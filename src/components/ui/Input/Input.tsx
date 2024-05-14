import { InputHTMLAttributes, ReactNode, forwardRef } from "react";

import styles from './Input.module.css';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    action?: ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(({ action, ...props }, ref) => {
    return (
        <div className={styles.inputWrapper}>
            <input type="text" {...props} ref={ref} className={styles.input} />
            {action && <div className={styles.action}>{action}</div>}
        </div>
    )
})

Input.displayName = 'Input'

export default Input