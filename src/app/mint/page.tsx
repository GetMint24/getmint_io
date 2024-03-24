'use client';

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAccount, useNetwork } from "wagmi";
import { observer } from "mobx-react-lite";
import { AxiosError } from "axios";
import { Flex, message } from 'antd';

import styles from './page.module.css';
import Card from "../../components/ui/Card/Card";
import MintForm, { MintSubmitEvent } from "./components/MintForm/MintForm";
import CostLabel from "../../components/CostLabel/CostLabel";
import ApiService from "../../services/ApiService";
import AppStore from "../../store/AppStore";
import { getContractAddress } from "../../common/constants";
import { NetworkName } from "../../common/enums/NetworkName";
import { mintNFT } from "../../core/contractController";
import ChainStore from "../../store/ChainStore";
import NftStore from "../../store/NftStore";
import { NetworkType } from "../../common/enums/NetworkType";
import NetworkTypeTabs from "../../components/NetworkTypeTabs/NetworkTypeTabs";

function Page() {
    const [messageApi, contextHolder] = message.useMessage();
    const [isNFTPending, setIsNFTPending] = useState<boolean>(false);
    const [currentNetwork, setCurrentNetwork] = useState<NetworkType>(NetworkType.LayerZero);
    const { account, walletConnected, openAccountDrawer, fetchAccount } = AppStore;
    const router = useRouter();
    const searchParams = useSearchParams();

    const { chain } = useNetwork();
    const { address } = useAccount();

    const _mintNFT = async (data: MintSubmitEvent, key?: string) => {
        if (!walletConnected) {
            openAccountDrawer();
            messageApi.info('Connect a wallet before Mint!');
            return;
        }

        if (chain) {
            setIsNFTPending(true);

            try {
                await ApiService.checkExistedNFT(data.image!, {
                    name: data.name,
                    description: data.description,
                });

                const result = await mintNFT({
                    contractAddress: getContractAddress(currentNetwork, chain.network as NetworkName),
                    networkType: currentNetwork,
                    chainToSend: {
                        id: chain.id,
                        name: chain.name,
                        network: chain.network,
                        lzChain: null,
                        token: 'ETH'
                    },
                    account,
                    accountAddress: address!
                });

                if (result.result) {
                    const nft = await ApiService.createMint(data.image!, {
                        name: data.name,
                        description: data.description,
                        metamaskWalletAddress: address as string,
                        tokenId: result.blockId!,
                        chainNetwork: chain?.network!,
                        transactionHash: result?.transactionHash!,
                        networkType: currentNetwork
                    });

                    await messageApi.success('NFT Successfully minted');
                    await NftStore.getNfts();

                    if (key) {
                        await ApiService.deleteFileFromCloud(key);
                    }

                    router.push(`/mint/${nft.pinataImageHash}?successful=true`);

                    await fetchAccount();
                } else {
                    messageApi.warning(result.message);
                }
            } catch (e) {
                console.error(e);
                setIsNFTPending(false);

                if (e instanceof AxiosError) {
                    await messageApi.error(e?.response?.data?.message);
                    return;
                }

                await messageApi.error('Oops, Something went wrong :(\nPlease reload this page and try again.');
            } finally {
                setIsNFTPending(false);
            }
        }
    };

    useEffect(() => {
        ChainStore.getChains();
    }, []);

    useEffect(() => {
        const tweeted = searchParams.get('tweeted');
        if (tweeted) {
            messageApi.info('Tweet was created');
        }
    }, [searchParams]);

    return (
        <>
            {contextHolder}

            <Card className={styles.page} isLoading={isNFTPending} title={(
                <Flex justify="space-between" wrap="wrap">
                    <div className={styles.title}>
                        <span className={styles.titleLabel}>Mint</span>
                        <CostLabel cost={20} size="large" />
                    </div>

                    <NetworkTypeTabs selected={currentNetwork} onSelect={setCurrentNetwork} />
                </Flex>
            )}>
                <MintForm onSubmit={_mintNFT} />
            </Card>
        </>
    )
}

export default observer(Page);