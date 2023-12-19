"use client";

import Card from "../../components/ui/Card/Card";
import CostLabel from "../../components/CostLabel/CostLabel";
import NftList from "./components/NftList/NftList";
import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import NftStore from "../../store/NftStore";
import NftModal from "./components/NftModal/NftModal";
import SuccessfulBridgeModal from "./components/SuccessfulBridgeModal/SuccessfulBridgeModal";

import styles from "./page.module.css";

function Page() {
    const [isSuccess, setIsSuccess] = useState(false);

    const handleSubmit = () => {
        NftStore.setNft(null);
        setIsSuccess(true);
    };

    const closeSuccessModal = () => {
        setIsSuccess(false);
    };

    useEffect(() => {
        NftStore.getNfts();
    }, []);

    return (
        <>
            <Card title={(
                <div className={styles.title}>
                    <span>Bridge NFT</span>
                    <CostLabel cost={10} size="large" />
                </div>
            )}>
                <strong>Your NFT</strong>
                <NftList />
            </Card>

            <NftModal onSubmit={handleSubmit} />
            <SuccessfulBridgeModal open={isSuccess} onClose={closeSuccessModal} />
        </>
    )
}

export default observer(Page);