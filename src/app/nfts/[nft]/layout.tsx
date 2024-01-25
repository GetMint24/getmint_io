import { ReactNode } from "react";
import { Metadata } from "next";
import { getNft } from "./utils";

interface Props {
    params: { nft: string },
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const nft = await getNft(params.nft);

    if (!nft) {
        return {};
    }

    return {
        title: `GetMint | ${nft.name}`,
        description: nft.description,
        twitter: {
            card: 'summary_large_image',
            title: `GetMint | ${nft.name}`,
            description: nft.description || undefined,
            images: `${process.env.APP_URL}/api/image/${params.nft}`,
        },
    };
}

export default function Layout({ children }: { children: ReactNode }) {
    return children;
}