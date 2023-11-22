'use client'

import { useAccount } from "wagmi";

import Drawer from "../ui/Drawer/Drawer";

export default function AccountDrawer({ isOpen, onClose, onDisconnect }) {
    const { address, connector } = useAccount();

    return (
        <Drawer isOpen={isOpen} onClose={onClose}>
            <h1>{address?.slice(0, 15)}</h1>
            <p>Connected to {connector?.name} <button onClick={onDisconnect}>Disconnect</button></p>
        </Drawer>
    )
}