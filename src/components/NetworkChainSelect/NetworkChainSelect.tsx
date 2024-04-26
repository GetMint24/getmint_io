import { Dropdown, Flex,  message } from "antd";
import Image from "next/image";
import { useEffect, useMemo } from "react";
import clsx from "clsx";
import { useAccount, useSwitchChain } from "wagmi";
import { getChainLogo } from "../../utils/getChainLogo";

import styles from "./NetworkChainSelect.module.css";
import { useSearchParams } from "next/navigation";
import { getChainsByBridgeType } from "./helpers/getChainsByBridgeType";
import ChainStore from "../../store/ChainStore";
import { observer } from "mobx-react-lite";
import { ChainDto } from "../../common/dto/ChainDto";
import { BridgeType } from "../../common/enums/BridgeType";
import { getChainNetworkByChainName } from "../../utils/getChainNetworkByName";

const WRONG_NETWORK = 'Wrong Network'

interface NetworkChainSelectProps {
    chainsInfo: ChainDto[];
}

function NetworkChainSelect({ chainsInfo }: NetworkChainSelectProps) {
    const searchParams = useSearchParams();
    const [messageApi, contextHolder] = message.useMessage();
    const { chain } = useAccount();
    const setIsSelectedWrongChain = ChainStore.setIsSelectedWrongChain
    const { reset, switchChain, error } = useSwitchChain(
        {
            mutation: {
                onSettled: () => {
                    reset();
                }
            }
        }
    );

    const currentBridge = (searchParams.get('bridge') as BridgeType) || BridgeType.LayerZero;

    const { chainsMenu, isKnownChain, chainName } = useMemo(() => {
        const availableChains = getChainsByBridgeType(chainsInfo, currentBridge)
        const chainInfo = chain ? chainsInfo.find((c) => c.name === chain.name) : undefined
        const isKnownChain = chainInfo && currentBridge ? chainInfo.availableBridgeTypes.includes(currentBridge) : false

        return {
            chainsMenu: availableChains,
            isKnownChain,
            chainName: isKnownChain && chain ? chain.name : WRONG_NETWORK
        }
    }, [searchParams, chain, chainsInfo, currentBridge]);

    const chainLogo = useMemo(() => {
        if (!chain || !isKnownChain) {
            return ''
        }

        return getChainLogo(getChainNetworkByChainName(chain.name))
    }, [chain, isKnownChain]);

    const handleSwitchNetwork = (chainId: number) => {
        if (switchChain) {
            switchChain({
                chainId
            });
        }
    };

    useEffect(() => {
        if (error) {
            void messageApi.warning('User rejected the request');
        }
    }, [error, messageApi]);

    useEffect(() => {
        setIsSelectedWrongChain(!isKnownChain)
    }, [isKnownChain])
    

    return (
        <>
            {contextHolder}

            <Dropdown
                trigger={['click']}
                menu={{
                    items: chainsMenu,
                    selectable: true,
                    defaultSelectedKeys: [String(chain?.id)],
                    onClick: ({ key }) => handleSwitchNetwork(parseInt(key))
                }}
                rootClassName={styles.dropdown}
            >
                <Flex align="center" gap={8} className={clsx(styles.dropdownBtn, { [styles.wrong]: !isKnownChain })}>
                    {chainLogo && isKnownChain && <Image src={chainLogo} width={24} height={24} alt="" />}

                    <div className={styles.value}>{chainName}</div>

                    <Image src="/svg/ui/dropdown-arrow.svg" width={24} height={24} alt="" />
                </Flex>
            </Dropdown>
        </>
    )
}

export default observer(NetworkChainSelect)