import React, { useState, useEffect } from "react";
import {
  Button,
  Input,
  Typography,
  Card,
  CardBody,
} from "@material-tailwind/react";
import {
  useContract,
  useContractWrite,
  ConnectWallet,
  useAddress,
  useMetamask,
  useContractRead,
} from "@thirdweb-dev/react";
import { ethers } from "ethers";

export default function Home() {
  const [amount, setAmount] = useState("");
  const [show, setShow] = useState(false);
  const [message, setMessage] = useState("");
  const [totalSupply, setTotalSupply] = useState(0);
  const [ethDeposit, setEthDeposit] = useState(0);
  const [balance, setBalance] = useState(0);
  const address = useAddress();
  const connect = useMetamask();

  const stableCoin = useContract("0x3fa9895098AB87e043C8c88aa32a92022a503B54");
  const nUSDEngine = useContract("0x9dF446a8a9AAc18c17C26f86659EdC643b4cD0d0");

  // const { data, isLoading } = useContractRead(nUSDEngine.contract, "getTotalSupply", []);

  useEffect(() => {
    const fetchdata = async () => {
      const data = await nUSDEngine.contract.call("getTotalSupply", []);
      const data2 = await nUSDEngine.contract.call("getDepositBalance", [
        address,
      ]);
      const data3 = await nUSDEngine.contract.call("getBalance", [address]);
      setBalance(parseInt(data3?._hex, 16));
      setTotalSupply(parseInt(data?._hex, 16));
      setEthDeposit(parseInt(data2?._hex, 16) / 1e9);
    };
    if (nUSDEngine.contract) {
      fetchdata();
    }
  }, [nUSDEngine.contract, totalSupply, balance, ethDeposit]);

  const handleDeposit = async () => {
    if (amount == "") {
      setShow(true);
      setMessage("*Please enter value you want to deposit");
    } else {
      try {
        const data = await nUSDEngine.contract.call("deposite", [], {
          value: ethers.utils.parseEther(amount),
        });
        const receipt = await stableCoin.contract.call("approve", [
          nUSDEngine.address,
          totalSupply,
        ]);
        alert("Transction Complete Please Refresh to View Updates");
        console.log(receipt);
      } catch (error) {
        console.error("contract call failure", error);
      }
    }
  };

  const handleRedeem = async () => {
    if (amount == "") {
      setShow(true);
      setMessage("*Please enter value you want to redeem");
    } else {
      try {
        const value = parseFloat(amount) * 1e9 + "";
        const data = await nUSDEngine.contract.call("redeem", [value]);
        alert("Transction Complete Please Refresh to View Updates");
        console.log(data);
      } catch (error) {
        console.error("contract call failure", error);
      }
    }
  };

  return (
    <>
      <div className="flex justify-end border-b-2">
        <div className="flex items-center m-3">
          <div className="bg-blue-600 text-white m-2 px-3 py-4 rounded-xl">
            You Owned: {balance} nUSD
          </div>
          <div className="bg-blue-600 text-white m-2 px-3 py-4 rounded-xl">
            ETH Stored: {ethDeposit} ETH
          </div>
          <div className="bg-blue-600 text-white m-2 px-3 py-4 rounded-xl">
            TotalSupply: {totalSupply} nUSD
          </div>
          <ConnectWallet />
        </div>
      </div>
      <div className="flex justify-center">
        <div className="flex flex-col w-[450px] p-5 relative">
          <Input
            size="lg"
            label="Enter Amount(ETH)"
            color="blue"
            type="number"
            value={amount}
            onChange={(e) => {
              setAmount(e.target.value);
              setShow(false);
            }}
          />

          <Typography variant="small" color="red" className="ml-2">
            {show && message}
          </Typography>

          <div className="flex items-center p-1 absolute top-[95px] left-[85px]">
            <Button variant="gradient" className="mx-4" onClick={handleDeposit}>
              Deposit
            </Button>
            <Button variant="gradient" onClick={handleRedeem}>
              Reddem
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
