import clsx from "clsx";

import styles from "./CostLabel.module.css";
import { ReactNode } from "react";

enum CostLabelSize {
    Medium = 'medium',
    Large = 'large'
}

interface CostLabelProps {
    cost: number;
    success?: boolean;
    size?: Lowercase<keyof typeof CostLabelSize>;
    children?: ReactNode;
    className?: string;
}

export default function CostLabel({ cost, size, success, children, className }: CostLabelProps) {
    return (
        <div className={clsx(
            styles.costLabel,
            size === CostLabelSize.Large && styles.large,
            size === CostLabelSize.Medium && styles.medium,
            success && styles.success,
            className
        )}>
            <span>{children ? children : `+${cost} XP`}</span>
        </div>
    )
}