'use client';
import{WalletProvider,IotaClientProvider,} from'@iota/dapp-kit';
import { getFullnodeUrl } from '@iota/iota-sdk/client';
import { QueryClient,QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useState } from 'react';
import "@iota/dapp-kit/dist/index.css";

const network = {
    testnet: { url: getFullnodeUrl("testnet") },
};

export default function Providers({ children }: { children: React.ReactNode }) {
   const [queryClient] = useState(() => new QueryClient());
  return (
    <QueryClientProvider client={queryClient}>
      <IotaClientProvider networks={network} defaultNetwork="testnet">
        <WalletProvider >
          {children}
        </WalletProvider>
        </IotaClientProvider>
      </QueryClientProvider>
    
  );
}