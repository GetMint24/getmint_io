"use client";

import { notFound } from "next/navigation";
import { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import Card from "../../../components/ui/Card/Card";
import AppStore from "../../../store/AppStore";
import ApiService from "../../../services/ApiService";
import { NFTDto } from "../../../common/dto/NFTDto";

import styles from "./page.module.css";

interface Props {
    params: { nft: string },
}

function Page({ params }: Props) {
    const [nft, setNft] = useState<NFTDto>();
    const { account } = AppStore;

    useEffect(() => {
        if (params.nft) {
            ApiService.getNft(params.nft).then((nft) => setNft(nft));
        }
    }, [params]);

    return (
        <Card
            title={
                <span className={styles.title}>{nft?.name}</span>
            }
        >
            <></>
        </Card>
    )
}

export default observer(Page);