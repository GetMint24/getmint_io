import React from "react";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Flex } from "antd";

import styles from "./page.module.css";
import prisma from "../../../utils/prismaClient";
import Card from "../../../components/ui/Card/Card";
import PinataImage from "../../../components/PinataImage";
import CostLabel from "../../../components/CostLabel/CostLabel";
import Button from "../../../components/ui/Button/Button";
import ChainLabel from "../../../components/ChainLabel/ChainLabel";
import BridgeForm from "./components/BridgeForm/BridgeForm";

interface NftPageProps {
    params: { nft: string };
    searchParams: { successful?: boolean };
}

export default async function NftPage({ params, searchParams }: NftPageProps) {
    // TODO: Move to server side
    const nft = await prisma.nft.findFirst({
        where: { pinataImageHash: params.nft },
        select: {
            id: true,
            pinataImageHash: true,
            name: true,
            description: true,
            createdAt: true,
            tokenId: true,
            nftChainConnection: {
                select: {
                    chain: true
                }
            }
        }
    });

    if (!nft) {
        return notFound()
    }

    const chain = nft?.nftChainConnection?.[0]?.chain;

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
                <ChainLabel network={chain?.network ?? ''} label={chain?.name ?? ''} labelClassName={styles.chainLabel} />
            </Flex>

            <BridgeForm className={styles.bridge} />

            <div className={styles.tweet}>
                <div className={styles.tweetText}>Tell your friends about it <CostLabel cost={10} /></div>
                <Button className={styles.tweetBtn} block>
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
        </Card>
    )
}