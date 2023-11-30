import Logo from "../../Logo/Logo";
import styles from './Header.module.css';
import Navigation from "../../Navigation/Navigation";
import WalletActions from "../../WalletActions/WalletActions";

export default function Header() {
    return (
        <>
            <div className={styles.header}>
                <Logo />
                <Navigation />
                <WalletActions />
            </div>
        </>
    );
}