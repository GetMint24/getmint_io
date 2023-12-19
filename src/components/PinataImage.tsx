interface PinataImageProps {
    hash: string;
    name?: string;
}

export default function PinataImage({ hash, name }: PinataImageProps) {
    return <img
        src={`${process.env.PINATA_GATEWAY}/ipfs/${hash}?pinataGatewayToken=${process.env.PINATA_GATEWAY_TOKEN}`}
        alt={name || ''}
    />
}