interface PinataImageProps {
    hash: string;
    name?: string;
}

export default function PinataImage({ hash, name }: PinataImageProps) {
    return <img src={`https://apricot-characteristic-grasshopper-875.mypinata.cloud/ipfs/${hash}`} alt={name || ''} />
}