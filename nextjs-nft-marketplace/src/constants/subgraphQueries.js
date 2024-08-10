import { gql } from "@apollo/client"

export const GET_ACTIVE_ITEM = gql`
    {
        activeItems(first: 5, where: { buyer: "0x00000000" }) {
            id
            buyer
            seller
            nftAddress
            tokenId
            price
        }
    }
`
