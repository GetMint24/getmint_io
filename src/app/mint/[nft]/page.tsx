"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Flex, Spin } from "antd";
import { observer } from "mobx-react-lite";

import styles from "./page.module.css";
import Card from "../../../components/ui/Card/Card";
import PinataImage from "../../../components/PinataImage";
import CostLabel from "../../../components/CostLabel/CostLabel";
import Button from "../../../components/ui/Button/Button";
import ChainLabel from "../../../components/ChainLabel/ChainLabel";
import BridgeForm from "./components/BridgeForm/BridgeForm";
import NftStore from "../../../store/NftStore";
import AppStore from "../../../store/AppStore";
import { twitterApi } from "../../../utils/twitterApi";
import ChainStore from "../../../store/ChainStore";

interface NftPageProps {
    params: { nft: string };
    searchParams: { successful?: boolean };
}

function NftPage({ params, searchParams }: NftPageProps) {
    const [nft, setNft] = useState(NftStore.selectNftByHash(params.nft));
    const { account, createTweet, loading, fetchAccount } = AppStore;
    const router = useRouter();

    const refetch = () => {
        NftStore.getNfts().then(() => setNft(NftStore.selectNftByHash(params.nft)));
    }

    const createTweetHandler = async () => {
        if (account && nft) {
            if (account.twitter.connected) {
                await createTweet({
                    userId: account.id,
                    nftId: nft.id,
                });
                refetch();
            } else {
                const authUrl = twitterApi.getAuthUrl(`${account.id}:${nft.id}`);
                window.location.assign(authUrl);
            }
        }
    };

    const goToMint = () => {
        router.push('/');
    };

    useEffect(() => {
        refetch();
        ChainStore.getChains();
        fetchAccount();
    }, []);

    if (!nft) {
        return <Spin size={"large"} />
    }

    return (
        <Card className={styles.page} title={searchParams.successful && (
            <Flex align="center" gap={12}>
                <Image src="/svg/congratulations.svg" width={32} height={32} alt="Congratulations" className={styles.titleIcon} />
                <span className={styles.title}>Congratulations!</span>
                <CostLabel className={styles.badge} cost={20} size="medium" success>+20 points</CostLabel>
            </Flex>
        )}>
            {nft && (
                <div className={styles.nft}>
                    <h2 className={styles.name}>{nft.name}</h2>
                    <div className={styles.image}>
                        <PinataImage hash={nft.pinataImageHash} name={nft.name} />
                    </div>
                </div>
            )}

            <Flex gap={8} align="center" className={styles.chainInfo}>
                <strong>Your NFT is now live on the</strong>
                <ChainLabel
                    network={nft?.chainNetwork || ''}
                    label={nft?.chainName || ''}
                    labelClassName={styles.chainLabel} />
            </Flex>

            <BridgeForm nft={nft} className={styles.bridge} onAfterBridge={refetch} />

            {loading ? (
                <Flex gap={12} align="center" justify="center">
                    <Spin size="large" />
                    <span>Creating tweet...</span>
                </Flex>
            ) : nft.tweeted ? (
                <div className={styles.tweet}>
                    <div className={styles.tweetText}>
                        <Image src="/svg/ui/successful.svg" width={24} height={24} alt="" />Thank you for your twit <CostLabel cost={10} success />
                    </div>
                    <Flex align="center" gap={8} className={styles.tweetButtons}>
                        <button className={styles.resultBtn} onClick={goToMint}>Mint again <CostLabel cost={20} /></button>
                        {/* <button className={styles.resultBtn}>Invite friends <CostLabel cost={20} /></button> */}
                    </Flex>
                </div>
            ) : (
                <div className={styles.tweet}>
                    <div className={styles.tweetText}>Tell your friends about it <CostLabel cost={10} /></div>
                    <Button className={styles.tweetBtn} block onClick={createTweetHandler}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="25" height="22" viewBox="0 0 25 22" fill="none">
                            <g clipPath="url(#clip0_577_1460)">
                                <path d="M1.04053 0.453369L9.93285 12.0876L0.984375 21.5467H2.99832L10.8327 13.2651L17.1627 21.5467H24.0162L14.6235 9.25808L22.9527 0.453369H20.9388L13.7237 8.08056L7.89405 0.453369H1.04053ZM4.00218 1.90495H7.15071L21.0541 20.0949H17.9055L4.00218 1.90495Z" fill="white"/>
                            </g>
                            <defs>
                                <clipPath id="clip0_577_1460">
                                    <rect width="24" height="22" fill="white" transform="translate(0.5)"/>
                                </clipPath>
                            </defs>
                        </svg> Tweet
                    </Button>
                </div>
            )}
        </Card>
    )
}

export default observer(NftPage);