"use client";

import { useMedia } from "use-media";
import { useEffect } from "react";
import { observer } from "mobx-react-lite";
import Logo from "../../Logo/Logo";
import Navigation from "../../Navigation/Navigation";
import WalletActions from "../../WalletActions/WalletActions";
import MobileMenu from "../../MobileMenu/MobileMenu";
import AppStore from "../../../store/AppStore";

import styles from './Header.module.css';
import { useAccount } from "wagmi";
import ChainStore from "../../../store/ChainStore";
import { useSearchParams } from "next/navigation";
import { BridgeType } from "../../../common/enums/BridgeType";

function Header() {
    const searchParams = useSearchParams();

    const { fetchAccount, setWalletConnected, setWalletAddress } = AppStore
    const { address, isConnected } = useAccount();
    
    const isTablet = useMedia({ maxWidth: '1320px' });
    const bridgeType = searchParams.get('bridge') || BridgeType.LayerZero

    useEffect(() => {
        ChainStore.getChains()
    }, [bridgeType])

    useEffect(() => {
        if (address) {
            setWalletConnected(isConnected);
            setWalletAddress(address);
            void fetchAccount()
        }
    }, [isConnected, address, setWalletConnected]);

    return (
        <div className={styles.header}>
            <Logo />
            {!isTablet && (
                <>
                    <Navigation />
                    <WalletActions />
                </>
            )}
            {isTablet && (<MobileMenu />)}
        </div>
    );
}

export default observer(Header);