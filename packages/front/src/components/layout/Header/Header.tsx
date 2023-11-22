import Logo from "../../Logo/Logo";
import styles from './Header.module.css';
import Navigation from "../../Navigation/Navigation";
import ConnectWallet from "../../ConnectWallet/ConnectWallet";

export default function Header() {
    return (
        <>
            <div className={styles.header}>
                <Logo />
                <Navigation />
                <ConnectWallet />
            </div>
        </>
    );
}