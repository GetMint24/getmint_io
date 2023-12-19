import { Flex } from "antd";
import { CSSProperties } from "react";
import clsx from "clsx";

import styles from "./ChainLabel.module.css";

interface Props {
    src: string;
    label: string;
    className?: string;
    justify?: CSSProperties['justifyContent'];
    iconClassName?: string;
    labelClassName?: string;
}

export default function ChainLabel({ src, label, className, justify, iconClassName, labelClassName }: Props) {
    return (
        <Flex gap={8} align="center" justify={justify} className={clsx(styles.container, className)}>
            <img src={src} className={clsx(styles.icon, iconClassName)} />
            <strong className={clsx(styles.label, labelClassName)}>{label}</strong>
        </Flex>
    )
}