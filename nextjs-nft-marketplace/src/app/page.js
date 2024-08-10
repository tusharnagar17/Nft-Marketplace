"use client"
import { useQuery, gql } from "@apollo/client"
import { GET_ACTIVE_ITEM } from "@/constants/subgraphQueries"
import { useAccount } from "wagmi"
import { wagmiConfig } from "./_app"
import { ConnectButton } from "@rainbow-me/rainbowkit"
import Link from "next/link"

export default function Home() {
    const { loading, error, data: listedNfts } = useQuery(GET_ACTIVE_ITEM)
    const { isConnected } = useAccount()
    console.log("listedNfts", listedNfts)

    return (
        <div className="container mx-auto">
            <h1 className="py-4 px-4 md:px-20 font-bold text-2xl">Recently Listed</h1>
            <div className="flex flex-wrap justify-center items-center">
                {isConnected ? (
                    loading || !listedNfts ? (
                        <div>Loading...</div>
                    ) : listedNfts.activeItems.length <= 0 ? (
                        <div className="my-10 text-xl font-semibold">
                            No nft Listed Yet!
                            <br />
                            <Link href="/sell-nft" className="">
                                <button
                                    type="button"
                                    class="text-white bg-sky-400 hover:bg-sky-500 focus:ring-4 focus:ring-blue-300 font-medium my-4 rounded-lg text-lg px-10 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                                >
                                    Sell you Nft
                                </button>
                            </Link>
                        </div>
                    ) : (
                        listedNfts.activeItems.map((nft) => {
                            const { price, nftAddress, tokenId, seller } = nft
                            return <div>nftCard</div>
                        })
                    )
                ) : (
                    <div className="flex justify-center items-center h-[60vh] text-xl font-medium">
                        Kindly Connect Eth Sepolia Network
                    </div>
                )}
            </div>
        </div>
    )
}
