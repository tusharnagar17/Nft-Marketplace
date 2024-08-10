"use client"
import { Form, useNotification } from "@web3uikit/core"
import React, { useState, useEffect } from "react"
import styles from "../../styles/Home.module.css"
import { useAccount, useReadContract, useWriteContract } from "wagmi"
import { nftAbi, nftMarketplaceAbi, nftMarketplaceAddress } from "@/constants"
import { wagmiConfig } from "../_app"
import { ConnectButton } from "@rainbow-me/rainbowkit"
import { ethers } from "ethers"

const SellPage = () => {
    const [proceeds, setProceeds] = useState("0")
    const { isConnected, address: userAddress } = useAccount({ wagmiConfig })
    const dispatch = useNotification()
    const { writeContractAsync: approveNft } = useWriteContract()
    const { writeContractAsync: listNft } = useWriteContract()
    const { writeContractAsync: withdrawProceedsFromContract } = useWriteContract()

    // 1.  function that return proceeds
    const { data: returnedProceeds } = useReadContract({
        address: nftMarketplaceAddress,
        abi: nftMarketplaceAbi,
        functionName: "getProceeds",
        args: [userAddress],
    })
    useEffect(() => {
        if (returnedProceeds) {
            setProceeds(returnedProceeds.toString())
        }
    }, [returnedProceeds])

    // 2. List Sell
    const approveAndList = async (data) => {
        console.log("Approving...")

        // data from form
        const nftAddress = data.data[0].inputResult
        const tokenId = data.data[1].inputResult
        const priceInput = data.data[2].inputResult
        if (!(nftAddress && tokenId && priceInput)) {
            dispatch({
                type: "success",
                message: "Kindly Fill all details",
                title: "Field Blank",
                position: "topR",
            })
            return null
        }
        const price = ethers.parseUnits(priceInput, "ether").toString()

        try {
            const approveRequest = await approveNft({
                address: nftAddress,
                abi: nftAbi,
                functionName: "approve",
                args: [nftMarketplaceAddress, tokenId],
            })

            handleApproveSuccess(nftAddress, tokenId, price)
        } catch (error) {
            console.log("Approve Error:", error)
        }
    }

    // list approved nft
    const handleApproveSuccess = async (nftAddress, tokenId, price) => {
        try {
            const listRequest = await listNft({
                address: nftMarketplaceAddress,
                abi: nftMarketplaceAbi,
                functionName: "listItem",
                args: [nftAddress, tokenId, price],
            })

            handleListSuccess()
        } catch (error) {
            console.log("List Error: ", error)
        }
    }

    // withdraw proceeds
    const withdrawProceeds = async () => {
        try {
            const withdrawRequest = await withdrawProceedsFromContract({
                address: nftMarketplaceAddress,
                abi: nftMarketplaceAbi,
                functionName: "withdrawProceeds",
            })

            handleWithdrawSuccess()
        } catch (error) {
            console.log("Withdraw Error:", error)
        }
    }

    const handleListSuccess = () => {
        dispatch({
            type: "success",
            message: "NFT listing",
            title: "NFT listed",
            position: "topR",
        })
    }
    const handleWithdrawSuccess = () => {
        dispatch({
            type: "success",
            message: "Withdrawing proceeds",
            position: "topR",
        })
    }
    if (!isConnected) {
        return (
            <div className="flex flex-col gap-6 justify-center items-center h-[80vh]">
                <div className="text-xl font-sans font-semibold">
                    Kindly first Connect your account!
                </div>
                <ConnectButton label="Connect Now" />{" "}
            </div>
        )
    }

    return (
        <div className={styles.container}>
            {/* Form  */}
            <Form
                onSubmit={approveAndList}
                title="Sell your NFT!"
                id="Main Form"
                data={[
                    {
                        name: "NFT Address",
                        type: "text",
                        inputWidth: "50%",
                        value: "",
                        key: "nftAddress",
                    },
                    {
                        name: "Token ID",
                        type: "number",
                        // inputWidth: "50%",
                        value: "",
                        key: "tokenId",
                    },
                    {
                        name: "Price (in ETH)",
                        type: "number",
                        // inputWidth: "",
                        value: "",
                        key: "price",
                    },
                ]}
            />
            {/* All Proceeds */}
            <div>Withdraw {proceeds} proceeds</div>
            {proceeds != "0" ? (
                <Button
                    text="Withdraw"
                    type="button"
                    onClick={() => {
                        withdrawProceeds()
                    }}
                />
            ) : (
                <div>No Proceeds Detected</div>
            )}
        </div>
    )
}

export default SellPage
