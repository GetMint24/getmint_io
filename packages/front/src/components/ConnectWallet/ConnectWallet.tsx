'use client'

import { useEffect, useState } from "react";
import { useAccount } from "wagmi";

import Button from "../ui/Button/Button";
import AccountDrawer from "../AccountDrawer/AccountDrawer";

export default function ConnectWallet() {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const { address, isConnected, isConnecting } = useAccount();

    const [isClient, setIsClient] = useState(false)

    useEffect(() => {
        setIsClient(true);
    }, []);

    if (!isClient) {
        return <Button>Connect a Wallet</Button>;
    }

    return (
        <div>
            {!isConnected ? (
                <Button onClick={() => setIsOpen(true)}>
                    {isConnecting ? 'Connecting...' : 'Connect a Wallet'}
                </Button>
            ) : (
                <Button onClick={() => setIsOpen(true)}>{address?.slice(0, 15)}</Button>
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