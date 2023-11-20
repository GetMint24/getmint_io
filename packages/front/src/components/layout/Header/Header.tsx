import Logo from "../../Logo/Logo";
import styles from './Header.module.css';
import Button from "../../ui/Button/Button";
import Navigation from "../../Navigation/Navigation";

export default function Header() {
    return (
        <div className={styles.header}>
            <Logo />
            <Navigation />
            <Button>Connect Metamask</Button>
        </div>
    )
}