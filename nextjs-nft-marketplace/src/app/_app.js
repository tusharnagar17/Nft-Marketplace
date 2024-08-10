"use client"
import "@rainbow-me/rainbowkit/styles.css"
import { getDefaultConfig, RainbowKitProvider } from "@rainbow-me/rainbowkit"
import { WagmiProvider } from "wagmi"
import { mainnet, sepolia, polygon, optimism, arbitrum, base } from "wagmi/chains"
import { QueryClientProvider, QueryClient } from "@tanstack/react-query"
import { ApolloProvider, ApolloClient, InMemoryCache } from "@apollo/client"
import { Notification, NotificationProvider } from "@web3uikit/core"

const projectId = process.env.NEXT_PUBLIC_PROJECT_ID || ""

export const wagmiConfig = getDefaultConfig({
    appName: "Nft Marketplace",
    projectId: projectId,
    chains: [sepolia],
    ssr: true,
})

const client = new ApolloClient({
    cache: new InMemoryCache(),
    uri: "https://api.studio.thegraph.com/query/78600/nftmarketplace/version/latest",
})

const queryClient = new QueryClient()

export default function Provider({ children }) {
    return (
        <WagmiProvider config={wagmiConfig}>
            <QueryClientProvider client={queryClient}>
                <RainbowKitProvider>
                    <ApolloProvider client={client}>
                        <NotificationProvider>{children}</NotificationProvider>
                    </ApolloProvider>
                </RainbowKitProvider>
            </QueryClientProvider>
        </WagmiProvider>
    )
}
