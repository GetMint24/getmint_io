"use client";

import Logo from "../../Logo/Logo";
import Navigation from "../../Navigation/Navigation";
import WalletActions from "../../WalletActions/WalletActions";
import MobileMenu from "../../MobileMenu/MobileMenu";
import { useMedia } from "use-media";

import styles from './Header.module.css';
import AccountDrawer from "../../AccountDrawer/AccountDrawer";

export default function Header() {
    const isTablet = useMedia({ maxWidth: '1024px' });

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

            <AccountDrawer />
        </div>
    );
}