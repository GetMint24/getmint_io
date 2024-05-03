'use client';

import { useCallback, useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useAccount } from "wagmi";
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
import { ControllerFunctionResult, mintNFT } from "../../core/contractController";
import NftStore from "../../store/NftStore";
import { BridgeType } from "../../common/enums/BridgeType";
import NetworkTypeTabs from "../../components/NetworkTypeTabs/NetworkTypeTabs";
import { getChainNetworkByChainName } from "../../utils/getChainNetworkByName";
import ClosingPageAlert from "../../components/ClosingPageAlert/ClosingPageAlert";

function Page() {
    const [messageApi, contextHolder] = message.useMessage();
    const [isNFTPending, setIsNFTPending] = useState<boolean>(false);
    const [currentBridge, setCurrentBridge] = useState<BridgeType>(BridgeType.LayerZero);
    const { account, walletConnected, openAccountDrawer, fetchAccount } = AppStore;
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const { address, chain } = useAccount();

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
                const network = getChainNetworkByChainName(chain.name)
                let mintResult: ControllerFunctionResult | null = null
                let nftId: string | null = null
                let pinataImageHash: string | null = null;

                try {
                    const pinataImage = await ApiService.createNFT(data.image!, {
                        name: data.name,
                        description: data.description,
                    });
                    pinataImageHash = pinataImage.pinataImageHash

                    mintResult = await mintNFT({
                        contractAddress: getContractAddress(currentBridge, network),
                        networkType: currentBridge,
                        chainToSend: {
                            id: chain.id,
                            name: chain.name,
                            network,
                            hyperlaneChain: null,
                            lzChain: null,
                            token: 'ETH'
                        },
                        account,
                        accountAddress: address!
                    });

                    if (mintResult?.result) {
                        const nft = await ApiService.createMint({
                            name: data.name,
                            description: data.description,
                            metamaskWalletAddress: address as string,
                            tokenId: mintResult.blockId!,
                            chainNetwork: network,
                            transactionHash: mintResult?.transactionHash!,
                            networkType: currentBridge,
                            pinataImageHash: pinataImage.pinataImageHash, 
                            pinataJsonHash: pinataImage.pinataJsonHash
                        });

                        nftId = nft.id
                    } else {
                        messageApi.warning(mintResult.message);
                    }
                } catch (e) {
                    if (pinataImageHash) {
                        ApiService.deleteNftImageFromPinata(pinataImageHash);
                    }

                    throw e
                }

                if (nftId) {
                    if (key) {
                        ApiService.deleteFileFromCloud(key);
                    }

                    messageApi.success('NFT Successfully minted');
                    NftStore.getNfts();
                    fetchAccount();
                    router.push(`/mint/${nftId}?successful=true`);
                }
            } catch (e) {
                console.error(e);
                setIsNFTPending(false);

                if (e instanceof AxiosError) {
                    messageApi.error(e?.response?.data?.message);
                    return;
                }

                messageApi.error('Oops, Something went wrong :(\nPlease reload this page and try again.');
            } finally {
                setIsNFTPending(false);
            }
        }
    };

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

            {isNFTPending && <ClosingPageAlert />}

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