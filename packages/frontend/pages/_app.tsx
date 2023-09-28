import Layout from '@/components/Layout';
import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { polygonMumbai } from 'wagmi/chains';
import { WagmiConfig, createConfig } from 'wagmi';
import { createPublicClient, http } from 'viem';
import { DndContext } from '@dnd-kit/core';

const config = createConfig({
  autoConnect: true,
  publicClient: createPublicClient({
    chain: polygonMumbai,
    transport: http(),
  }),
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <WagmiConfig config={config}>
      <Layout>
        <DndContext>
          <Component {...pageProps} />
        </DndContext>
      </Layout>
    </WagmiConfig>
  );
}
