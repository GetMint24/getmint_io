import { ReactNode } from "react";
import styles from './Button.module.css';

interface ButtonProps {
    children: ReactNode;
}

export default function Button({ children, ...props }: ButtonProps) {
    return (
        <button className={styles.button} type="button" {...props}>
            {children}
        </button>
    )
}