import Logo from "../../Logo/Logo";
import styles from './Header.module.css';
import Button from "../../ui/Button/Button";

export default function Header() {
    return (
        <div className={styles.header}>
            <Logo />
            <Button>Connect Metamask</Button>
        </div>
    )
}