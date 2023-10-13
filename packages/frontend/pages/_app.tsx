import Layout from '@/components/Layout';
import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { polygonMumbai } from 'wagmi/chains';
import { WagmiConfig, configureChains, createConfig } from 'wagmi';
import { DndContext } from '@dnd-kit/core';
import { ReactNode, createContext, useState } from 'react';
import { Avatar } from '@/hooks/useAvatars';
import { Equipment } from '@/hooks/useEquipment';
import { MetaMaskConnector } from 'wagmi/connectors/metaMask';
import { alchemyProvider } from 'wagmi/providers/alchemy';
import { publicProvider } from 'wagmi/providers/public';

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [polygonMumbai],
  [
    alchemyProvider({ apiKey: 'Rr2KU0W5MgrAwZoIjL73ILY4pZtl-Slq' }),
    publicProvider(),
  ]
);

const config = createConfig({
  autoConnect: true,
  connectors: [new MetaMaskConnector({ chains })],
  publicClient,
  webSocketPublicClient,
});

type IAvatarsContext = {
  avatars: Avatar[];
  setAvatars: React.Dispatch<React.SetStateAction<Avatar[]>>;
};
type IEquipmentContext = {
  myItems: Equipment[];
  setMyItems: React.Dispatch<React.SetStateAction<Equipment[]>>;
};

type IBattleDetailsContext = {
  battleDetails: {
    token1Id: number;
    token2Id: number;
    winnerId: number;
  };
  setBattleDetails: React.Dispatch<
    React.SetStateAction<{
      token1Id: number;
      token2Id: number;
      winnerId: number;
    }>
  >;
  battleResultsModalOpen: boolean;
  setBattleResultsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export const AvatarsContext = createContext<IAvatarsContext>({
  avatars: [],
  setAvatars: () => {},
});
export const EquipmentContext = createContext<IEquipmentContext>({
  myItems: [],
  setMyItems: () => {},
});

export const BattleDetailsContext = createContext<IBattleDetailsContext>({
  battleDetails: {
    token1Id: 0,
    token2Id: 0,
    winnerId: 0,
  },
  setBattleDetails: () => {},
  battleResultsModalOpen: false,
  setBattleResultsModalOpen: () => {},
});

export const AvatarsProvider = ({ children }: { children: ReactNode }) => {
  const [avatars, setAvatars] = useState([]);
  return (
    // @ts-ignore
    <AvatarsContext.Provider value={{ avatars, setAvatars }}>
      {children}
    </AvatarsContext.Provider>
  );
};

export const EquipmentProvider = ({ children }: { children: ReactNode }) => {
  const [myItems, setMyItems] = useState([]);
  return (
    // @ts-ignore
    <EquipmentContext.Provider value={{ myItems, setMyItems }}>
      {children}
    </EquipmentContext.Provider>
  );
};

export const BattleModalProvider = ({ children }: { children: ReactNode }) => {
  const [battleDetails, setBattleDetails] = useState({
    token1Id: 0,
    token2Id: 0,
    winnerId: 0,
  });
  const [battleResultsModalOpen, setBattleResultsModalOpen] = useState(false);
  return (
    // @ts-ignore
    <BattleDetailsContext.Provider
      value={{
        battleDetails,
        setBattleDetails,
        battleResultsModalOpen,
        setBattleResultsModalOpen,
      }}
    >
      {children}
    </BattleDetailsContext.Provider>
  );
};

export default function App({ Component, pageProps }: AppProps) {
  return (
    <WagmiConfig config={config}>
      <BattleModalProvider>
        <AvatarsProvider>
          <EquipmentProvider>
            <Layout>
              <DndContext>
                <Component {...pageProps} />
              </DndContext>
            </Layout>
          </EquipmentProvider>
        </AvatarsProvider>
      </BattleModalProvider>
    </WagmiConfig>
  );
}
