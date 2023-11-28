'use client';

import { useCallback, useState } from "react";
import Image from "next/image";

import styles from './page.module.css';
import Card from "../../components/ui/Card/Card";
import MintForm, { MintFormData } from "./components/MintForm/MintForm";
import CostLabel from "../../components/CostLabel/CostLabel";
import PinataImage from "../../components/PinataImage";
import { CreateMintDto, MintDto } from "../../common/MintDto";
import ApiService from "../../services/ApiService";

export default function Page() {
    const [isMinted, setIsMinted] = useState<boolean>(false);
    const [nft, setNft] = useState<MintDto>();

    const handleGetMint = useCallback(async (data: MintFormData) => {
        /*const response = await ApiService.createMint(data.file, {
            name: data.name,
            description: data.description,
            userId: 1
        });*/

        setNft({
            id: 1,
            name: 'Fox Geometric',
            description: 'Description Description Description',
            imageHash: 'QmdUqFGTunepKfuG9QSTATgP84ox3bSxi7RS3PzosStB1t'
        });
        setIsMinted(true)
    }, []);

    if (isMinted) {
        return (
            <Card className={styles.page} title={(
                <div className={styles.title}>
                    <span><Image src="/svg/congratulations.svg" width={32} height={32} alt="Congratulations" /> Congratulations!</span>
                    {/*<CostLabel cost={20} large />*/}
                </div>
            )}>
                <PinataImage hash={nft.imageHash} name={nft.name} />
                {nft.description && <p>{nft.description}</p>}
            </Card>
        )
    }

    return (
        <Card className={styles.page} title={(
            <div className={styles.title}>
                <span>Mint</span>
                <CostLabel cost={20} large />
            </div>
        )}>
            <MintForm onSubmit={handleGetMint} />
        </Card>
    )
}
