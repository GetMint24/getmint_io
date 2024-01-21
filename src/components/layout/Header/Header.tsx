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

function Header() {
    const { metamaskWalletAddress, fetchAccount } = AppStore
    const isTablet = useMedia({ maxWidth: '1320px' });

    useEffect(() => {
        if (metamaskWalletAddress) {
            void fetchAccount();
        }
    }, [fetchAccount, metamaskWalletAddress]);

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