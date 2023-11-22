'use client'

import { useEffect, useState } from "react";
import { useAccount, useDisconnect } from "wagmi";

import ConnectWalletDrawer from "../ConnectWalletDrawer/ConnectWalletDrawer";
import Button from "../ui/Button/Button";
import AccountDrawer from "../AccountDrawer/AccountDrawer";

export default function ConnectWallet() {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [isOpenAccount, setIsOpenAccount] = useState<boolean>(false);

    const { disconnect } = useDisconnect();
    const { address, isConnected, isConnecting } = useAccount();

    const [isClient, setIsClient] = useState(false)

    useEffect(() => {
        setIsClient(true);
    }, [])

    if (!isClient) {
        return <Button rounded>Connecting...</Button>;
    }

    if (!isConnected) {
        return (
            <div>
                <Button onClick={() => setIsOpen(true)}>
                    {isConnecting ? 'Connecting...' : 'Connect a Wallet'}
                </Button>
                <ConnectWalletDrawer isOpen={isOpen} onClose={() => setIsOpen(false)} />
            </div>
        )
    }

    const logout = () => {
        disconnect();
        setIsOpenAccount(false);
    };

    return (
        <div>
            <Button onClick={() => setIsOpenAccount(true)} rounded>{address?.slice(0, 15)}</Button>

            <AccountDrawer
                isOpen={isOpenAccount}
                onDisconnect={logout}
                onClose={() => setIsOpenAccount(false)}
            />
        </div>
    )
}