"use client";

import Card from "../../components/ui/Card/Card";
import CostLabel from "../../components/CostLabel/CostLabel";
import NftList from "./components/NftList/NftList";
import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import NftStore from "../../store/NftStore";
import ChainStore from "../../store/ChainStore";

import styles from "./page.module.css";

function Page() {
    useEffect(() => {
        NftStore.getNfts();
        ChainStore.getChains();
    }, []);

    return (
        <Card title={(
            <div className={styles.title}>
                <span>Bridge NFT</span>
                <CostLabel cost={10} size="large" />
            </div>
        )}>
            <div>Your NFT</div>
            <NftList />
        </Card>
    )
}

export default observer(Page);