interface PinataImageProps {
    hash: string;
    name?: string;
}

export default function PinataImage({ hash, name }) {
    return <img src={`${process.env.PINATA_DOMAIN}/ipfs/${hash}`} alt={name || ''} />
}