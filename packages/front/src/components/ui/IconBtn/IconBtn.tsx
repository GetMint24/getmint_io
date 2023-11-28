import clsx from "clsx";
import styles from './IconBtn.module.css';
import { Tooltip } from "antd";

export default function IconBtn({ tooltip, ...props }) {
    return (
        <Tooltip title={tooltip}>
            <button {...props} className={clsx(styles.iconBtn, props.className)} />
        </Tooltip>
    )
}