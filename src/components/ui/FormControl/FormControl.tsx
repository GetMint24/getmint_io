import clsx from "clsx";
import { ReactNode } from "react";

import styles from './FormControl.module.css';

interface FormControlProps {
    title: ReactNode;
    children: ReactNode;
    extra?: ReactNode;
    optional?: boolean;
    className?: string;
    error?: string;
}

export default function FormControl({ title, children, extra, optional, className, error }: FormControlProps) {
    return (
        <div className={clsx(styles.control, className)}>
            <div className={styles.header}>
                <div className={styles.title}>
                    {title} {optional && <span className={styles.optional}>(Optional)</span>}
                </div>
                {extra && <p className={styles.extra}>{extra}</p>}
            </div>

            <div>
                {children}
            </div>

            {error && <div className={styles.alert}>{error}</div>}
        </div>
    );
}