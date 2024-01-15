import Image from "next/image";
import clsx from "clsx";

import styles from "./BoostLabel.module.css";

interface Props {
    value: number;
    size?: 'small' | 'default';
}

export default function BoostLabel({ value, size }: Props) {
    return (
        <div className={styles.container}>
            <div className={clsx(styles.label, { [styles.small]: size === 'small' })}>
                <Image width={16} height={16} src="/svg/boost.svg" alt="" />
                <span>{`x${value}`}</span>
            </div>
        </div>
    )
}