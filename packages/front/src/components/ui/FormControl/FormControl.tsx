import clsx from "clsx";
import styles from './FormControl.module.css';
import { ReactNode } from "react";

interface FormControlProps {
    title: string;
    children: ReactNode;
    extra?: ReactNode;
    optional?: boolean;
    className?: string;
}

export default function FormControl({ title, children, extra, optional, className }: FormControlProps) {
    return (
        <div className={clsx(styles.control, className)}>
            <label>
                <div className={styles.header}>
                    <div className={styles.title}>
                        {title} {optional && <span className={styles.optional}>(Optional)</span>}
                    </div>
                    {extra && <p className={styles.extra}>{extra}</p>}
                </div>

                {children}
            </label>
        </div>
    );
}