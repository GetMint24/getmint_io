import axios from "axios";

export async function sendNFTImage(image: File, name: string, description: string = '') {
    const pinataFormData = new FormData();

    pinataFormData.append('file', image);
    pinataFormData.append('pinataMetadata', JSON.stringify({
        name,
        keyvalues: { description }
    }));

    const response = await axios.post(
        'https://api.pinata.cloud/pinning/pinFileToIPFS',
        pinataFormData,
        {
            headers: {
                Authorization: `Bearer ${process.env.PINATA_JWT}`,
            },
        }
    );

    const { IpfsHash: pinataImageHash } = response.data;

    const res = await axios.post(
        "https://api.pinata.cloud/pinning/pinJSONToIPFS",
        generateNFTMetadata(name, description, pinataImageHash),
        {
            headers: {
                Authorization: `Bearer ${process.env.PINATA_JWT}`,
            },
        }
    );

    const { IpfsHash: pinataJsonHash } = res.data;

    return {
        pinataImageHash,
        pinataJsonHash
    };
}

function generateNFTMetadata(name: string, description: string, imageHash: string) {
    return {
        pinataContent: {
            name,
            description,
            image: `${process.env.PINATA_GATEWAY}/ipfs/${imageHash}?pinataGatewayToken=${process.env.PINATA_GATEWAY_TOKEN}`,
        },
        pinataMetadata: {
            name: `${name}.json`
        }
    };
}