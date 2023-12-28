import getPinataImageUrl from "../utils/getPinataImageUrl";

interface PinataImageProps {
    hash: string;
    name?: string;
}

export default function PinataImage({ hash, name }: PinataImageProps) {
    return <img
        src={getPinataImageUrl(hash)}
        alt={name || ''}
    />
}