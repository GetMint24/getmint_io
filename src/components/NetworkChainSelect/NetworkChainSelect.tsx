import { Dropdown, Flex, MenuProps, message } from "antd";
import Image from "next/image";
import { useEffect, useMemo } from "react";
import clsx from "clsx";
import { useNetwork, useSwitchNetwork } from "wagmi";
import { getChainLogo } from "../../utils/getChainLogo";
import { NetworkName } from "../../common/enums/NetworkName";

import styles from "./NetworkChainSelect.module.css";

export default function NetworkChainSelect() {
    const [messageApi, contextHolder] = message.useMessage();
    const { chain, chains } = useNetwork();
    const { reset, switchNetwork, error } = useSwitchNetwork(
        {
            onSettled: () => {
                reset();
            },
        }
    );

    const chainName = useMemo(() => {
        const chainNetworks = Object.values(NetworkName);
        if (chain && chainNetworks.some((network) => network === chain.network)) {
            return chain.name;
        }
        return 'Wrong Network';
    }, [chain]);

    const isKnownChain = useMemo(() => {
        const chainNetworks = Object.values(NetworkName);
        return chain && chainNetworks.some((network) => network === chain.network);
    }, [chain]);

    const chainsMenu = useMemo(() => {
        const items: MenuProps['items'] = [...chains]
            .sort((a, b) => a.name.localeCompare(b.name))
            .map(c => ({
                key: c.id,
                label: c.name,
                icon: <Image width={24} height={24} src={getChainLogo(c.network)} alt="" />,
            }));

        return items;
    }, [chains]);

    const chainLogo = useMemo(() => getChainLogo(chain?.network!), [chain]);

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