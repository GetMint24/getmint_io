'use client';

import { useCallback, useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
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
import { BridgeType } from "../../common/enums/BridgeType";
import NetworkTypeTabs from "../../components/NetworkTypeTabs/NetworkTypeTabs";

function Page() {
    const [messageApi, contextHolder] = message.useMessage();
    const [isNFTPending, setIsNFTPending] = useState<boolean>(false);
    const [currentBridge, setCurrentBridge] = useState<BridgeType>(BridgeType.LayerZero);
    const { account, walletConnected, openAccountDrawer, fetchAccount } = AppStore;
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const { chain } = useNetwork();
    const { address } = useAccount();

    const createQueryString = useCallback(
        (name: string, value: string) => {
            const params = new URLSearchParams(searchParams.toString())
            params.set(name, value)

            return params.toString()
        },
        [searchParams]
    );

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
                    contractAddress: getContractAddress(currentBridge, chain.network as NetworkName),
                    networkType: currentBridge,
                    chainToSend: {
                        id: chain.id,
                        name: chain.name,
                        network: chain.network,
                        hyperlaneChain: null,
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
                        networkType: currentBridge
                    });

                    await messageApi.success('NFT Successfully minted');
                    await NftStore.getNfts();

                    if (key) {
                        await ApiService.deleteFileFromCloud(key);
                    }

                    router.push(`/mint/${nft.id}?successful=true`);

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
        const bridge = searchParams.get('bridge');

        if (tweeted) {
            messageApi.info('Tweet was created');
        }

        if (bridge) {
            setCurrentBridge(bridge as BridgeType);
        }
    }, [searchParams]);

    const isHyperlaneBridge = currentBridge === BridgeType.Hyperlane;

    return (
        <>
            {contextHolder}

            <Card className={styles.page} isLoading={isNFTPending} title={(
                <Flex className={styles.header} justify="space-between" wrap="wrap">
                    <div className={styles.title}>
                        <span className={styles.titleLabel}>Mint{isHyperlaneBridge && ' hNFT'}</span>
                        {!isHyperlaneBridge && <CostLabel cost={20} size="large" />}
                    </div>

                    <NetworkTypeTabs className={styles.networkType} selected={currentBridge} onSelect={bridge => {
                        setCurrentBridge(bridge);
                        router.push(pathname + '?' + createQueryString('bridge', bridge));
                    }} />
                </Flex>
            )}>
                <MintForm onSubmit={_mintNFT} currentBridge={currentBridge} />
            </Card>
        </>
    )
}

export default observer(Page);