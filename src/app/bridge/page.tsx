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
import { SuccessfulBridgeData } from "./types";
import AppStore from "../../store/AppStore";

import styles from "./page.module.css";

function Page() {
    const { fetchAccount } = AppStore;
    const [successfulData, setSuccessfulData] = useState<SuccessfulBridgeData | null>();

    const handleSubmit = async(data: SuccessfulBridgeData) => {
        NftStore.setNft(null);
        setSuccessfulData(data);
        NftStore.getNfts();
        await fetchAccount();
    };

    const closeSuccessModal = () => {
        setSuccessfulData(null);
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
            {successfulData && (
                <SuccessfulBridgeModal data={successfulData} onClose={closeSuccessModal} />
            )}
        </>
    )
}

export default observer(Page);