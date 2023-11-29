import { ButtonHTMLAttributes, ReactNode } from "react";
import clsx from "clsx";

import styles from './Button.module.css';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    children: ReactNode;
    block?: boolean;
    rounded?: boolean;
    small?: boolean;
}

export default function Button({ children, block, rounded, small, className, ...props }: ButtonProps) {
    return (
        <button
            type="button"
            {...props}
            className={clsx(styles.button, className, {
                [styles.rounded]: rounded,
                [styles.block]: block,
                [styles.small]: small
            })}
        >
            {children}
        </button>
    )
}