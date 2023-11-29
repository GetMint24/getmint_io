'use client';

import { useCallback, useState } from "react";
import { useAccount, useContractWrite, usePrepareContractWrite, useWaitForTransaction } from "wagmi";
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
    const { data, write, writeAsync, error } = useContractWrite(config);
    const { isLoading, isSuccess, isFetched } = useWaitForTransaction({
        hash: data?.hash,
    })

    const handleGetMint = useCallback(async (data: MintSubmitEvent) => {
        if (!walletConnected) {
            openAccountDrawer();
            messageApi.info('Connect a wallet before Mint!');
            return;
        }

        setIsNFTPending(true);

        try {
            if (writeAsync) {
                // await writeAsync();

                const nft = await ApiService.createMint(data.image!, {
                    name: data.name,
                    description: data.description,
                    metamaskWalletAddress: address as string
                });

                console.log(nft);

                setNft(nft);
                setIsMinted(true);

                await fetchAccount();
            } else {
                await messageApi.warning('Sorry! Something went wrong');
            }
        } catch (e) {
            setIsNFTPending(false);
            await messageApi.warning('Error: User rejected the request');
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
                    <CostLabel cost={20} large />
                </div>
            )}>
                <MintForm onSubmit={handleGetMint} />
            </Card>
        </>
    )
}

export default observer(Page);