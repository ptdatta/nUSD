import '@/styles/globals.css'
import { ThirdwebProvider } from "@thirdweb-dev/react";
import { Sepolia } from "@thirdweb-dev/chains";


export default function App({ Component, pageProps }) {
  return (
    <ThirdwebProvider activeChain={Sepolia}>
        <Component {...pageProps} />
    </ThirdwebProvider>
  );
}
