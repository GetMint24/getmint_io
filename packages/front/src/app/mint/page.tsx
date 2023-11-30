'use client';

import { useCallback, useState } from "react";
import { useAccount, useContractWrite, usePrepareContractWrite, useWaitForTransaction } from "wagmi";
import { fetchBalance } from '@wagmi/core'
import { observer } from "mobx-react-lite";
import { message } from 'antd';
import Image from "next/image";

import styles from './page.module.css';
import Card from "../../components/ui/Card/Card";
import MintForm, { MintSubmitEvent } from "./components/MintForm/MintForm";
import CostLabel from "../../components/CostLabel/CostLabel";
import PinataImage from "../../components/PinataImage";
import { MintDto } from "../../common/dto/MintDto";
import ApiService from "../../services/ApiService";
import AppStore from "../../store/AppStore";
import { WalletAddress } from "../../common/types";
import { NFT_COST } from "../../common/constants";

function Page() {
    const [messageApi, contextHolder] = message.useMessage();
    const [isMinted, setIsMinted] = useState<boolean>(false);
    const [nft, setNft] = useState<MintDto>();
    const [isNFTPending, setIsNFTPending] = useState<boolean>(false);
    const { walletConnected, openAccountDrawer, fetchAccount } = AppStore;

    const { address } = useAccount();

    const { config } = usePrepareContractWrite({
        address,
        abi: [
            {
                name: 'mint',
                type: 'function',
                stateMutability: 'nonpayable',
                inputs: [],
                outputs: [],
            },
        ],
        functionName: 'mint',
    });

    const { data, write, writeAsync } = useContractWrite(config);
    const { isLoading  } = useWaitForTransaction({
        hash: data?.hash,
    });

    const mintNFT = useCallback(async (data: MintSubmitEvent) => {
        if (!walletConnected) {
            openAccountDrawer();
            messageApi.info('Connect a wallet before Mint!');
            return;
        }

        setIsNFTPending(true);

        try {
            if (writeAsync) {
                const balance = await fetchBalance({
                    address: address as WalletAddress
                });

                if (balance.value < NFT_COST) {
                    messageApi.warning('Not enough funds to mint');
                    setIsNFTPending(false);
                    return;
                }

                // await writeAsync();

                const nft = await ApiService.createMint(data.image!, {
                    name: data.name,
                    description: data.description,
                    metamaskWalletAddress: address as string
                });

                setNft(nft);
                setIsMinted(true);

                await fetchAccount();
            } else {
                await messageApi.warning('Sorry! Something went wrong :(');
            }
        } catch (e) {
            setIsNFTPending(false);
            await messageApi.error('User rejected the request');
        }
    }, [write, walletConnected, writeAsync]);

    if (isMinted && nft) {
        return (
            <Card className={styles.page} title={(
                <div className={styles.title}>
                    <span><Image src="/svg/congratulations.svg" width={32} height={32} alt="Congratulations" /> Congratulations!</span>
                    {/*<CostLabel cost={20} large />*/}
                </div>
            )}>
                <PinataImage hash={nft.pinataImageHash} name={nft.name} />
                {nft.description && <p>{nft.description}</p>}
                <a href={`https://etherscan.io/tx/${data?.hash}`}>Etherscan</a>
            </Card>
        )
    }

    return (
        <>
            {contextHolder}

            <Card className={styles.page} isLoading={isLoading || isNFTPending} title={(
                <div className={styles.title}>
                    <span>Mint</span>
                    <CostLabel cost={20} size="large" />
                </div>
            )}>
                <MintForm onSubmit={mintNFT} />
            </Card>
        </>
    )
}

export default observer(Page);