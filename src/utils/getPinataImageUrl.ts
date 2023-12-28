export default function getPinataImageUrl(hash: string) {
    return `${process.env.PINATA_GATEWAY}/ipfs/${hash}?pinataGatewayToken=${process.env.PINATA_GATEWAY_TOKEN}`;
}