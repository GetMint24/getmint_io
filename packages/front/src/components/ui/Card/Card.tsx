import styles from './Card.module.css';
import { ReactNode } from "react";
import clsx from "clsx";

interface CardProps {
    children: ReactNode;
    title?: string | ReactNode;
    className?: string;
}

export default function Card({ title, children, className }: CardProps) {
    return (
        <div className={clsx(styles.card, className)}>
            {title && (
                <div className={styles.cardHead}>
                    <div className={styles.cardHeadTitle}>
                        {title}
                    </div>
                </div>
            )}

            <div className={styles.cardBody}>{children}</div>
        </div>
    )
}