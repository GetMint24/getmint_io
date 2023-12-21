"use client";

import Card from "../../components/ui/Card/Card";
import CostLabel from "../../components/CostLabel/CostLabel";
import NftList from "./components/NftList/NftList";
import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import NftStore from "../../store/NftStore";
import ChainStore from "../../store/ChainStore";
import NftModal from "./components/NftModal/NftModal";
import SuccessfulBridgeModal from "./components/SuccessfulBridgeModal/SuccessfulBridgeModal";

import styles from "./page.module.css";

function Page() {
    // TODO: change when exist response bridge request
    const [nftId, setNftId] = useState('');

    const handleSubmit = (id: string) => {
        NftStore.setNft(null);
        setNftId(id);
    };

    const closeSuccessModal = () => {
        setNftId('');
    };

    useEffect(() => {
        NftStore.getNfts();
        ChainStore.getChains();
    }, []);

    return (
        <>
            <Card title={(
                <div className={styles.title}>
                    <span>Bridge NFT</span>
                    <CostLabel cost={10} size="large" />
                </div>
            )}>
                <div>Your NFT</div>
                <NftList />
            </Card>

            <NftModal onSubmit={handleSubmit} />
            <SuccessfulBridgeModal nftId={nftId} onClose={closeSuccessModal} />
        </>
    )
}

export default observer(Page);