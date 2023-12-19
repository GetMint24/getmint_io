'use client'

import { Dropdown, Flex, MenuProps, message } from "antd";
import { useEffect, useMemo, useState } from "react";
import { useAccount, useNetwork, useSwitchNetwork } from "wagmi";
import Image from 'next/image';

import Button from "../ui/Button/Button";
import AccountDrawer from "../AccountDrawer/AccountDrawer";
import AccountAddress from "../AccountAddress/AccountAddress";
import AppStore from "../../store/AppStore";

import styles from './WalletActions.module.css';

interface Props {
    className?: string;
}

export default function WalletActions({ className }: Props) {
    const { openAccountDrawer, setWalletConnected, setWalletAddress } = AppStore;

    const [messageApi, contextHolder] = message.useMessage();
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
        if (chain) {
            const paths: Record<string, string> = {
                'Arbitrum One': '/svg/chains/arbitrum.svg'
            }

            return paths[chain.name] || '';
        }

        return '';
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
            void messageApi.warning('User rejected the request');
        }
    }, [error, messageApi]);

    useEffect(() => {
        setWalletConnected(isConnected);
    }, [isConnected, setWalletConnected]);

    useEffect(() => {
        setWalletAddress(address as string);
    }, [address, setWalletAddress]);

    if (!isClient) {
        return <Button className={styles.btn}>Connect a Wallet</Button>;
    }

    return (
        <div className={className}>
            {contextHolder}

            {!isConnected ? (
                <Button className={styles.btn} onClick={openAccountDrawer}>
                    {isConnecting ? 'Connecting...' : 'Connect a Wallet'}
                </Button>
            ) : (
                <Flex gap={10}>
                    {switchNetwork && chain && (
                        <Dropdown
                            trigger={['click']}
                            menu={{
                                items: chainsMenu,
                                selectable: true,
                                defaultSelectedKeys: [String(1)],
                                onClick: ({ key }) => handleSwitchNetwork(parseInt(key))
                            }}
                        >
                            <Flex align="center" justify="center" gap={8} className={styles.dropdownBtn}>
                                {chainLogo && <Image src={chainLogo} width={24} height={24} alt="" />}

                                <div className={styles.dropdownValue}>Arbitrum One</div>

                                <Flex gap={4} align="center" className={styles.price}>
                                    <img src="/svg/ui/fuel.svg" />
                                    <span>$0.22</span>
                                </Flex>

                                <Image src="/svg/ui/dropdown-arrow.svg" width={24} height={24} alt="" />
                            </Flex>
                        </Dropdown>
                    )}

                    {address && (
                        <Button className={styles.btn} onClick={openAccountDrawer}>
                            <AccountAddress address={address} />
                        </Button>
                    )}
                </Flex>
            )}

            <AccountDrawer />
        </div>
    )
}