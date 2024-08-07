"use client"
import "@rainbow-me/rainbowkit/styles.css"
import { getDefaultConfig, RainbowKitProvider } from "@rainbow-me/rainbowkit"
import { WagmiProvider } from "wagmi"
import { mainnet, polygon, optimism, arbitrum, base } from "wagmi/chains"
import { QueryClientProvider, QueryClient } from "@tanstack/react-query"

const projectId = process.env.NEXT_PUBLIC_PROJECT_ID || ""

const config = getDefaultConfig({
    appName: "Nft Marketplace",
    projectId: projectId,
    chains: [mainnet],
    ssr: true,
})

const queryClient = new QueryClient()

export default function Provider({ children }) {
    return (
        <WagmiProvider config={config}>
            <QueryClientProvider client={queryClient}>
                <RainbowKitProvider>{children}</RainbowKitProvider>
            </QueryClientProvider>
        </WagmiProvider>
    )
}
