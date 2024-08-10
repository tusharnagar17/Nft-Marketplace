"use client"
import { nftMarketplaceAbi } from "@/constants"
import { Input, Modal, useNotification } from "@web3uikit/core"
import { ethers } from "ethers"
import React from "react"
import { useWriteContract } from "wagmi"

const UpdateListingModal = ({ nftAddress, tokenId, isVisible, marketplaceAddress, onClose }) => {
    const dispatch = useNotification()
    const { writeContractAsync: updateContract } = useWriteContract()
    const [priceToUpdateListingWith, setPriceToUpdateListingWith] = useState(0)

    const handleUpdateListingSuccess = () => {
        dispatch({
            type: "success",
            message: "listing updated",
            title: "Listing updated - please refresh (and move blocks)",
            position: "topR",
        })
    }

    const updateListingFunction = async () => {
        try {
            const updateRequest = await updateContract({
                address: marketplaceAddress,
                abi: nftMarketplaceAbi,
                functionName: "updateListing",

                // todo
                args: [nftAddress, tokenId, ethers.parseEther(priceToUpdateListingWith || "0")],
            })

            if (updateRequest.status === "success") {
                handleUpdateListingSuccess()
            }
        } catch (error) {
            console.log("Update Listing Error:", error)
        }
    }
    return (
        <Modal
            isVisible={isVisible}
            onCancel={onClose}
            onCloseButtonPressed={onClose}
            onOK={() => {
                updateListingFunction()
            }}
        >
            <Input
                label="Update listing price in L1 Currency (ETH)"
                name="New Listing price"
                type="number"
                onChange={(event) => {
                    setPriceToUpdateListingWith(event.target.value)
                }}
            />
        </Modal>
    )
}

export default UpdateListingModal
