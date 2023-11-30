import styles from './Card.module.css';
import { ReactNode } from "react";
import clsx from "clsx";
import { Spin } from "antd";

interface CardProps {
    children: ReactNode;
    title?: string | ReactNode;
    className?: string;
    isLoading?: boolean;
}

export default function Card({ title, children, className, isLoading }: CardProps) {
    return (
        <div className={clsx(styles.card, className, {
            [styles.loading]: isLoading
        })}>
            {title && (
                <div className={styles.cardHead}>
                    <div className={styles.cardHeadTitle}>
                        {title}
                    </div>
                </div>
            )}

            <div className={styles.cardBody}>
                {children}
            </div>

            {isLoading && (
                <div className={styles.spinner}><Spin size="large" /></div>
            )}
        </div>
    )
}