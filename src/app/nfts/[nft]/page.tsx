"use client";

import { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import { Avatar, Flex, Spin, notification } from "antd";
import Image from "next/image";
import { notFound, useRouter } from "next/navigation";
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
import History from "./components/History/History";
import BridgeForm from "./components/BridgeForm/BridgeForm";
import { OperationHistoryDto } from "../../../common/dto/OperationHistoryDto";

import styles from "./page.module.css";

interface Props {
    params: { nft: string },
}

function Page({ params }: Props) {
    const router = useRouter();
    const [nft, setNft] = useState<NFTDto>();
    const [history, setHistory] = useState<OperationHistoryDto[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isLoadingHistory, setIsLoadingHistory] = useState(false);
    const { account } = AppStore;
    const { getChains } = ChainStore;

    const refetch = async () => {
        if (params.nft) {
            const nft = await ApiService.getNft(params.nft);
            if (nft) {
                setNft(nft);
                setIsLoadingHistory(true);
                const history = await ApiService.getNftHistory(nft.id, nft.chainNetwork);
                setHistory(history);
                setIsLoadingHistory(false);
            } else {
                notification.error({ message: 'NFT is not found' });
            }
        }
    };

    const loadPage = async () => {
        setIsLoading(true);
        await refetch();
        setIsLoading(false);
    };

    const goToBack = () => {
        router.back();
    };

    useEffect(() => {
        loadPage();
    }, [params]);

    useEffect(() => {
        getChains();
    }, []);

    if (isLoading) {
        return (
            <Card>
                <Flex align="center" justify="center">
                    <Spin size="large" />
                </Flex>
            </Card>
        );
    }

    if (!nft) {
        return notFound();
    }

    return (
        <Card
            title={
                <>
                    <div className={styles.back} onClick={goToBack}>
                        <Image src="/svg/ui/back-arrow.svg" width={24} height={24} alt="" />
                        <span>Back</span>
                    </div>
                    <div className={styles.title}>{nft.name}</div>
                </>
            }
        >
            <div className={styles.container}>
                <div className={styles.card}>
                    <div className={styles.image}>
                        <PinataImage hash={nft.pinataImageHash} name={nft.name} />
                    </div>

                    <div className={styles.info}>
                        <div className={styles.account}>
                            <Avatar size={32} src={account?.twitter.user?.avatar} style={{ background: generateGradient(135) }} />
                            {nft.userId === account?.id ? (
                                <span>You</span>
                            ) : nft.userName ? (
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
                        <BridgeForm nft={nft} className={styles.form} onAfterBridge={refetch} />
                    )}
                </div>
                
                <History history={history} loading={isLoadingHistory} className={styles.history} />
            </div>
        </Card>
    );
}

export default observer(Page);