'use client'

import { useEffect, useState } from "react";
import { useAccount } from "wagmi";

import Button from "../ui/Button/Button";
import AccountDrawer from "../AccountDrawer/AccountDrawer";
import AccountAddress from "../AccountAddress/AccountAddress";

import styles from './ConnectWallet.module.css';

export default function ConnectWallet() {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const { address, isConnected, isConnecting } = useAccount();

    const [isClient, setIsClient] = useState(false)

    useEffect(() => {
        setIsClient(true);
    }, []);

    if (!isClient) {
        return <Button className={styles.btn}>Connect a Wallet</Button>;
    }

    return (
        <div>
            {!isConnected ? (
                <Button className={styles.btn} onClick={() => setIsOpen(true)}>
                    {isConnecting ? 'Connecting...' : 'Connect a Wallet'}
                </Button>
            ) : (
                <Button className={styles.btn} onClick={() => setIsOpen(true)}>
                    <AccountAddress address={address} />
                </Button>
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