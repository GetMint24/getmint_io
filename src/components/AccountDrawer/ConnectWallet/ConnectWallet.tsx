import Image from "next/image";

import Button from "../../ui/Button/Button";
import styles from './ConnectWallet.module.css';
import AppStore from "../../../store/AppStore";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccountEffect } from "wagmi";


export default function ConnectWallet() {
    const { closeAccountDrawer } = AppStore;

    useAccountEffect({
        onConnect: closeAccountDrawer,
    })

    return (
        <>
            <Image src="/svg/ui/close.svg" width={32} height={32} alt="" className={styles.closeIcon} onClick={closeAccountDrawer} />
            <div className={styles.wrapper}>
                <div>
                    <h2 className={styles.title}>Connect a Wallet</h2>

                    <ConnectButton.Custom >
                        {({
                          openConnectModal,
                        }) => {
                            return (
                                <Button className={styles.connectorBtn} onClick={openConnectModal} type="button">
                                    Connect Wallet
                                </Button>
                            )
                        }}
                    </ConnectButton.Custom>
                </div>
            </div>
        </>
    )
}