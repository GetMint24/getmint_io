import { Flex } from "antd";
import { MouseEvent, ReactNode } from "react";
import Image from "next/image";
import clsx from "clsx";

import styles from "./ListCard.module.css";

interface Props {
    image?: ReactNode;
    label?: ReactNode;
    title?: ReactNode;
    xp?: number;
    className?: string;
    onClick?(event?: MouseEvent): void;
}

export default function ListCard({ image, label, title, xp, className, onClick }: Props) {
    return (
        <Flex gap={12} vertical className={clsx(styles.card, className)} onClick={onClick}>
            {label && (<div>{label}</div>)}

            {image && (
                <Flex vertical align="center" justify="center" className={styles.image}>
                    {image}
                </Flex>
            )}

            {(title || xp) && (
                <div>
                    {title && (<div className={styles.name}>{title}</div>)}
                    {xp && (
                        <Flex gap={4} align="center" className={styles.xp}>
                            <Image src="/svg/xp.svg" width={20} height={20} alt="XP" />
                            <span>{xp} XP</span>
                        </Flex>
                    )}
                </div>
            )}
        </Flex>
    )
}