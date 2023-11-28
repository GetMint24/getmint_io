'use client'

import { Dropdown, Flex, MenuProps, message } from "antd";
import { useEffect, useMemo, useState } from "react";
import { useAccount, useNetwork, useSwitchNetwork } from "wagmi";
import Image from 'next/image';

import Button from "../ui/Button/Button";
import AccountDrawer from "../AccountDrawer/AccountDrawer";
import AccountAddress from "../AccountAddress/AccountAddress";

import styles from './ConnectWallet.module.css';

export default function ConnectWallet() {
    const [messageApi, contextHolder] = message.useMessage();
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const { address, isConnected, isConnecting } = useAccount();
    const { chain, chains } = useNetwork();
    const { reset, switchNetwork, error } = useSwitchNetwork(
        {
            onSettled: () => {
                reset();
            },
        }
    );

    const [isClient, setIsClient] = useState(false);

    const chainsMenu = useMemo(() => {
        const items: MenuProps['items'] = [...chains]
            .sort((a, b) => a.name.localeCompare(b.name))
            .map(c => ({
                key: c.id,
                label: c.name
            }));

        return items;
    }, [chains]);

    const chainLogo = useMemo(() => {
        const paths = {
            'Arbitrum One': '/svg/chains/arbitrum.svg'
        }

        return paths[chain?.name] || '';
    }, [chain]);

    const handleSwitchNetwork = (chainId: number) => {
        if (switchNetwork) {
            switchNetwork(chainId);
        }
    };

    useEffect(() => {
        setIsClient(true);
    }, []);

    useEffect(() => {
        if (error) {
            console.log(error)
            if (error?.['code'] === 4001) {
                messageApi.warning('User rejected the request');
            }
        }
    }, [error]);

    if (!isClient) {
        return <Button className={styles.btn}>Connect a Wallet</Button>;
    }

    return (
        <div>
            {contextHolder}

            {!isConnected ? (
                <Button className={styles.btn} onClick={() => setIsOpen(true)}>
                    {isConnecting ? 'Connecting...' : 'Connect a Wallet'}
                </Button>
            ) : (
                <Flex gap={10}>
                    {switchNetwork && (
                        <Dropdown
                            trigger={['click']}
                            menu={{
                                items: chainsMenu,
                                selectable: true,
                                defaultSelectedKeys: [chain.id],
                                onClick: ({ key }) => handleSwitchNetwork(key)
                            }}
                        >
                            <Flex align="center" justify="center" gap={8} className={styles.dropdownBtn}>
                                {chainLogo && <Image src={chainLogo} width={24} height={24} alt="" />}

                                <div>{chain.name}</div>
                                <Image src="/svg/ui/dropdown-arrow.svg" width={24} height={24} alt="" />
                            </Flex>
                        </Dropdown>
                    )}

                    <Button className={styles.btn} onClick={() => setIsOpen(true)}>
                        <AccountAddress address={address} />
                    </Button>
                </Flex>
            )}

            <AccountDrawer
                isConnected={isConnected}
                isOpen={isOpen}
                onDisconnect={() => setIsOpen(false)}
                onClose={() => setIsOpen(false)}
            />
        </div>
    )
}