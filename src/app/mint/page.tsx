'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAccount, useNetwork } from "wagmi";
import { observer } from "mobx-react-lite";
import { AxiosError } from "axios";
import { message } from 'antd';

import styles from './page.module.css';
import Card from "../../components/ui/Card/Card";
import MintForm, { MintSubmitEvent } from "./components/MintForm/MintForm";
import CostLabel from "../../components/CostLabel/CostLabel";
import ApiService from "../../services/ApiService";
import AppStore from "../../store/AppStore";
import { CONTRACT_ADDRESS } from "../../common/constants";
import { NetworkName } from "../../common/enums/NetworkName";
import { mintNFT } from "../../core/contractController";
import ChainStore from "../../store/ChainStore";
import NftStore from "../../store/NftStore";
import Button from "../../components/ui/Button/Button";

function Page() {
    const [messageApi, contextHolder] = message.useMessage();
    const [isNFTPending, setIsNFTPending] = useState<boolean>(false);
    const { walletConnected, openAccountDrawer, fetchAccount } = AppStore;
    const router = useRouter();

    const { chain } = useNetwork();
    const { address } = useAccount();

    const _mintNFT = async (data: MintSubmitEvent) => {
        if (!walletConnected) {
            openAccountDrawer();
            messageApi.info('Connect a wallet before Mint!');
            return;
        }

        if (chain) {
            setIsNFTPending(true);

            try {
                const result = await mintNFT({
                    contractAddress: CONTRACT_ADDRESS[chain.network as NetworkName]
                });

                console.log({result})

                if (result.result) {
                    const nft = await ApiService.createMint(data.image!, {
                        name: data.name,
                        description: data.description,
                        metamaskWalletAddress: address as string,
                        tokenId: result.blockId!,
                        chainNetwork: chain?.network!,
                        transactionHash: result?.transactionHash!
                    });

                    await messageApi.success('NFT Successfully minted');
                    await NftStore.getNfts();
                    router.push(`/mint/${nft.pinataImageHash}?successful=true`);

                    await fetchAccount();
                } else {
                    messageApi.warning(result.message);
                }
            } catch (e) {
                setIsNFTPending(false);

                if (e instanceof AxiosError) {
                    await messageApi.error(e?.response?.data?.message);
                    return;
                }

                await messageApi.error('Something went wrong :(');
            } finally {
                setIsNFTPending(false);
            }
        }
    };

    const tweetHandler = () => {
        AppStore.createTweet({
            userId: AppStore.account!.id,
            nftId: 'test'
        });
    };

    useEffect(() => {
        ChainStore.getChains();
    }, []);

    return (
        <>
            {contextHolder}

            <Card className={styles.page} isLoading={isNFTPending} title={(
                <div className={styles.title}>
                    <span>Mint</span>
                    <CostLabel cost={20} size="large" />
                </div>
            )}>
                <MintForm onSubmit={_mintNFT} />
                <Button onClick={tweetHandler}>Tweet</Button>
            </Card>
        </>
    )
}

export default observer(Page);