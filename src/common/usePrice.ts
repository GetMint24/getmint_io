import { useEffect, useState } from "react";
import { fetchPrice } from "../core/contractController";

export function usePrice(symbol: string) {
    const [price, setPrice] = useState<number | null>(0);

    useEffect(() => {
        fetchPrice(symbol).then(setPrice);
    }, [symbol]);

    return price;
}