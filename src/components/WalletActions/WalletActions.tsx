'use client'

import { Flex } from "antd";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";

import Button from "../ui/Button/Button";
import AccountAddress from "../AccountAddress/AccountAddress";
import AppStore from "../../store/AppStore";
import NetworkChainSelect from "../NetworkChainSelect/NetworkChainSelect";

import styles from './WalletActions.module.css';

export default function WalletActions() {
    const { openAccountDrawer, setWalletConnected, setWalletAddress } = AppStore;

    const { address, isConnected, isConnecting } = useAccount();

    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

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
        <div>
            {!isConnected ? (
                <Button onClick={openAccountDrawer}>
                    {isConnecting ? 'Connecting...' : 'Connect Metamask'}
                </Button>
            ) : (
                <Flex gap={10}>
                    <NetworkChainSelect />

                    {address && (
                        <Button className={styles.btn} onClick={openAccountDrawer}>
                            <AccountAddress address={address} />
                        </Button>
                    )}
                </Flex>
            )}
        </div>
    )
}