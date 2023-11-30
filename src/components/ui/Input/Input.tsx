import { InputHTMLAttributes, ReactNode } from "react";

import styles from './Input.module.css';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    action?: ReactNode;
}

export default function Input({ action, ...props }: InputProps) {
    return (
        <div className={styles.inputWrapper}>
            <input type="text" {...props} className={styles.input} />
            {action && <div className={styles.action}>{action}</div>}
        </div>
    )
}