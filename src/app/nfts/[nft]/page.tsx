"use client";

import { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import { Avatar, Spin } from "antd";
import Image from "next/image";
import Card from "../../../components/ui/Card/Card";
import AppStore from "../../../store/AppStore";
import ApiService from "../../../services/ApiService";
import { NFTDto } from "../../../common/dto/NFTDto";
import PinataImage from "../../../components/PinataImage";
import AccountAddress from "../../../components/AccountAddress/AccountAddress";
import { generateGradient } from "../../../utils/generators";
import ChainLabel from "../../../components/ChainLabel/ChainLabel";
import { BalanceOperationCost } from "../../../common/enums/BalanceOperationCost";
import ChainStore from "../../../store/ChainStore";

import styles from "./page.module.css";
import History from "./components/History/History";
import BridgeForm from "./components/BridgeForm/BridgeForm";

interface Props {
    params: { nft: string },
}

function Page({ params }: Props) {
    const [nft, setNft] = useState<NFTDto>();
    const { account } = AppStore;
    const { getChains } = ChainStore;

    useEffect(() => {
        if (params.nft) {
            ApiService.getNft(params.nft).then((nft) => {
                setNft(nft);
            });
        }
    }, [params]);

    useEffect(() => {
        getChains();
    }, []);

    if (!nft) {
        return (
            <Spin size="large" />
        );
    }

    return (
        <Card
            title={
                <span className={styles.title}>{nft?.name}</span>
            }
        >
            <div className={styles.container}>
                <div className={styles.card}>
                    <div className={styles.image}>
                        <PinataImage hash={nft?.pinataImageHash} name={nft?.name} />
                    </div>

                    <div className={styles.info}>
                        <div className={styles.account}>
                            <Avatar size={32} src={account?.twitter.user?.avatar} style={{ background: generateGradient(135) }} />
                            {nft.userName ? (
                                <span>{nft.userName}</span>
                            ) : (
                                <AccountAddress address={nft.userWalletAddress} />
                            )}
                        </div>

                        <div className={styles.chain}>
                            <ChainLabel network={nft.chainNetwork} label={nft.chainName} />
                            {account?.id === nft.userId && (
                                <div className={styles.xp}>
                                    <Image src="/svg/xp.svg" width={20} height={20} alt="XP" />
                                    <span>{BalanceOperationCost.Bridge} XP</span>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className={styles.description}>{nft.description}</div>

                    {account?.id === nft.userId && (
                        <BridgeForm nft={nft} className={styles.form} />
                    )}
                </div>
                
                <History nftId={nft.id} chainNetwork={nft.chainNetwork} className={styles.history} />
            </div>
        </Card>
    );
}

export default observer(Page);