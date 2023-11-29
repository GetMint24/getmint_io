'use client';

import { useCallback, useState } from "react";
import { useAccount, useContractWrite, usePrepareContractWrite, useWaitForTransaction } from "wagmi";
import { message } from 'antd';
import Image from "next/image";

import styles from './page.module.css';
import Card from "../../components/ui/Card/Card";
import MintForm, { MintFormData } from "./components/MintForm/MintForm";
import CostLabel from "../../components/CostLabel/CostLabel";
import PinataImage from "../../components/PinataImage";
import { CreateMintDto, MintDto } from "../../common/MintDto";
import ApiService from "../../services/ApiService";
import { observer } from "mobx-react-lite";
import AppStore from "../../store/AppStore";

function Page() {
    const [messageApi, contextHolder] = message.useMessage();
    const [isMinted, setIsMinted] = useState<boolean>(false);
    const [nft, setNft] = useState<MintDto>();
    const { walletConnected, openAccountDrawer } = AppStore;

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
    const { isLoading, isSuccess } = useWaitForTransaction({
        hash: data?.hash,
    })

    const handleGetMint = useCallback(async (data: MintFormData) => {
        if (!walletConnected) {
            openAccountDrawer();
            messageApi.info('Connect a wallet before Mint!');
            return;
        }

        try {
            await writeAsync();
            /*const response = await ApiService.createMint(data.file, {
                name: data.name,
                description: data.description,
                userId: 1
            });*/

            setNft({
                id: 1,
                name: 'Fox Geometric',
                description: 'Description Description Description',
                imageHash: 'QmdUqFGTunepKfuG9QSTATgP84ox3bSxi7RS3PzosStB1t'
            });
            setIsMinted(true);
        } catch (e) {
            messageApi.warning('Error: User rejected the request');
        }
    }, [write, walletConnected]);

    if (isMinted) {
        return (
            <Card className={styles.page} title={(
                <div className={styles.title}>
                    <span><Image src="/svg/congratulations.svg" width={32} height={32} alt="Congratulations" /> Congratulations!</span>
                    {/*<CostLabel cost={20} large />*/}
                </div>
            )}>
                <PinataImage hash={nft.imageHash} name={nft.name} />
                {nft.description && <p>{nft.description}</p>}
                <a href={`https://etherscan.io/tx/${data?.hash}`}>Etherscan</a>
            </Card>
        )
    }

    return (
        <>
            {contextHolder}

            <Card className={styles.page} title={(
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