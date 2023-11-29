import clsx from "clsx";
import { Tooltip } from "antd";
import { ButtonHTMLAttributes } from "react";

import styles from './IconBtn.module.css';

interface IconBtnProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    tooltip?: string;
}

export default function IconBtn({ tooltip, ...props }: IconBtnProps) {
    return (
        <Tooltip title={tooltip}>
            <button {...props} className={clsx(styles.iconBtn, props.className)} />
        </Tooltip>
    )
}