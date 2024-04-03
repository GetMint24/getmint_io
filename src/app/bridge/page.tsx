"use client";

import { useEffect } from "react";
import { observer } from "mobx-react-lite";
import { useAccount } from "wagmi";
import { Flex } from "antd";
import { useSearchParams } from "next/navigation";

import Card from "../../components/ui/Card/Card";
import CostLabel from "../../components/CostLabel/CostLabel";
import NftList from "./components/NftList/NftList";
import NftStore from "../../store/NftStore";
import ChainStore from "../../store/ChainStore";

import styles from "./page.module.css";
import NetworkTypeTabs from "../../components/NetworkTypeTabs/NetworkTypeTabs";
import { BridgeType } from "../../common/enums/BridgeType";

function Page() {
    const { address } = useAccount();
    const searchParams = useSearchParams();

    useEffect(() => {
        ChainStore.getChains();
    }, []);

    useEffect(() => {
        const bridge = searchParams.get('bridge');

        if (bridge) {
            NftStore.setSelectedNetworkType(bridge as BridgeType);
        }
    }, [searchParams]);

    useEffect(() => {
        NftStore.getNfts();
    }, [address]);

    const isHyperlaneBridge = NftStore.currentNetworkType === BridgeType.Hyperlane;

    return (
        <Card title={(
            <Flex className={styles.header} justify="space-between" wrap="wrap">
                <div className={styles.title}>
                    <span className={styles.titleLabel}>Bridge {isHyperlaneBridge ? 'hNFT' : 'oNFT'}</span>
                    <CostLabel cost={10} size="large" />
                </div>

                <NetworkTypeTabs className={styles.networkType} selected={NftStore.currentNetworkType} onSelect={(type) => {
                    NftStore.setSelectedNetworkType(type);
                    NftStore.getNfts();
                }} />
            </Flex>
        )}>
            <div>Your NFT</div>
            <NftList />
        </Card>
    )
}

export default observer(Page);