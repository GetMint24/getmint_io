import { Dropdown, Flex, MenuProps, message } from "antd";
import Image from "next/image";
import { useEffect, useMemo } from "react";
import clsx from "clsx";
import { useNetwork, useSwitchNetwork } from "wagmi";
import { getChainLogo } from "../../utils/getChainLogo";
import { NetworkName } from "../../common/enums/NetworkName";

import styles from "./NetworkChainSelect.module.css";
import { useSearchParams } from "next/navigation";
import { BridgeType } from "../../common/enums/BridgeType";
import { HyperlaneAvailableNetworks } from "../../common/constants";
import { ChainDto } from "../../common/dto/ChainDto";

interface NetworkChainSelectProps {
    chainsInfo: ChainDto[];
}

export default function NetworkChainSelect({ chainsInfo }: NetworkChainSelectProps) {
    const searchParams = useSearchParams();
    const [messageApi, contextHolder] = message.useMessage();
    const { chain, chains } = useNetwork();
    const { reset, switchNetwork, error } = useSwitchNetwork(
        {
            onSettled: () => {
                reset();
            },
        }
    );

    const currentBridge = (searchParams.get('bridge') as BridgeType) || BridgeType.LayerZero;

    const isKnownChain = useMemo(() => {
        const chainNetworks = Object.values(NetworkName);
        const isNetwork = chainNetworks.some((network) => network === chain?.network);
        const isAvailable = chainsInfo.find(x => x.network === chain?.network)?.availableBridgeTypes?.includes(currentBridge);

        return chain && isNetwork && isAvailable;
    }, [chain, chainsInfo, currentBridge]);

    const chainName = useMemo(() => {
        if (chain && isKnownChain) {
            return chain.name;
        }

        return 'Wrong Network';
    }, [chain, isKnownChain]);

    const chainsMenu = useMemo(() => {
        const bridge = searchParams.get('bridge');

        const items: MenuProps['items'] = [...chains]
            .filter(c => {
                if (bridge === BridgeType.Hyperlane) {
                    return HyperlaneAvailableNetworks.includes(c.network as NetworkName);
                }

                return true;
            })
            .sort((a, b) => a.name.localeCompare(b.name))
            .map(c => ({
                key: c.id,
                label: c.name,
                icon: <Image width={24} height={24} src={getChainLogo(c.network)} alt="" />,
            }));

        return items;
    }, [chains, searchParams]);

    const chainLogo = useMemo(() => isKnownChain && getChainLogo(chain?.network!), [chain, isKnownChain]);

    const handleSwitchNetwork = (chainId: number) => {
        if (switchNetwork) {
            switchNetwork(chainId);
        }
    };

    useEffect(() => {
        if (error) {
            void messageApi.warning('User rejected the request');
        }
    }, [error, messageApi]);

    useEffect(() => {

    }, [searchParams]);

    if (!chain || !switchNetwork) {
        return null;
    }

    return (
        <>
            {contextHolder}

            <Dropdown
                trigger={['click']}
                menu={{
                    items: chainsMenu,
                    selectable: true,
                    defaultSelectedKeys: [String(chain.id)],
                    onClick: ({ key }) => handleSwitchNetwork(parseInt(key))
                }}
                rootClassName={styles.dropdown}
            >
                <Flex align="center" gap={8} className={clsx(styles.dropdownBtn, { [styles.wrong]: !isKnownChain })}>
                    {chainLogo && <Image src={chainLogo} width={24} height={24} alt="" />}

                    <div className={styles.value}>{chainName}</div>

                    <Image src="/svg/ui/dropdown-arrow.svg" width={24} height={24} alt="" />
                </Flex>
            </Dropdown>
        </>
    )
}