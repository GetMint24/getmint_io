import { Flex } from "antd";
import { CSSProperties, useMemo } from "react";
import clsx from "clsx";

import styles from "./ChainLabel.module.css";
import { getChainLogo } from "../../utils/getChainLogo";

interface Props {
    network: string;
    label: string;
    className?: string;
    justify?: CSSProperties['justifyContent'];
    iconClassName?: string;
    labelClassName?: string;
}

export default function ChainLabel({ network, label, className, justify, iconClassName, labelClassName }: Props) {
    const src = useMemo(() => getChainLogo(network), [network]);

    return (
        <Flex gap={8} align="center" justify={justify} className={clsx(styles.container, className)}>
            <img src={src} className={clsx(styles.icon, iconClassName)} alt={label || ''} />
            <strong className={clsx(styles.label, labelClassName)}>{label}</strong>
        </Flex>
    )
}