'use client'

import Drawer from "../ui/Drawer/Drawer";
import ConnectWallet from "./ConnectWallet/ConnectWallet";
import Account from "./Account/Account";

export default function AccountDrawer({ isOpen, isConnected, onClose }) {

    return (
        <Drawer isOpen={isOpen} onClose={onClose}>
            {
                isConnected
                    ? <Account onClose={onClose} />
                    : <ConnectWallet onClose={onClose} />
            }
        </Drawer>
    )
}