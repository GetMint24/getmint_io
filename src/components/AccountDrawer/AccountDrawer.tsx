'use client'

import { observer } from "mobx-react-lite";

import Drawer from "../ui/Drawer/Drawer";
import ConnectWallet from "./ConnectWallet/ConnectWallet";
import Account from "./Account/Account";
import AppStore  from "../../store/AppStore";

function AccountDrawer() {
    const { accountDrawerOpened, closeAccountDrawer, walletConnected } = AppStore;

    return (
        <Drawer isOpen={accountDrawerOpened} onClose={closeAccountDrawer}>
            {walletConnected ? <Account /> : <ConnectWallet />}
        </Drawer>
    );
}

export default observer(AccountDrawer);