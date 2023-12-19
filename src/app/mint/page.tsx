'use client';

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { useAccount, useContractWrite, usePrepareContractWrite, useWaitForTransaction } from "wagmi";
import { fetchBalance } from '@wagmi/core'
import { observer } from "mobx-react-lite";
import { message } from 'antd';

import styles from './page.module.css';
import Card from "../../components/ui/Card/Card";
import MintForm, { MintSubmitEvent } from "./components/MintForm/MintForm";
import CostLabel from "../../components/CostLabel/CostLabel";
import ApiService from "../../services/ApiService";
import AppStore from "../../store/AppStore";
import { WalletAddress } from "../../common/types";
import { NFT_COST } from "../../common/constants";
import { AxiosError } from "axios";

function Page() {
    const [messageApi, contextHolder] = message.useMessage();
    const [isNFTPending, setIsNFTPending] = useState<boolean>(false);
    const { walletConnected, openAccountDrawer, fetchAccount } = AppStore;
    const router = useRouter();

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
        // if (!walletConnected) {
        //     openAccountDrawer();
        //     messageApi.info('Connect a wallet before Mint!');
        //     return;
        // }

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

                await messageApi.success('NFT Successfully minted');
                router.push(`/mint/${nft.pinataImageHash}?successful=true`);

                await fetchAccount();
            } else {
                await messageApi.warning('Sorry! Something went wrong :(');
            }
        } catch (e) {
            setIsNFTPending(false);

            if (e instanceof AxiosError) {
                await messageApi.error(e?.response?.data?.message);
                return;
            }

            await messageApi.error('User rejected the request');
        }
    }, [write, walletConnected, writeAsync]);

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