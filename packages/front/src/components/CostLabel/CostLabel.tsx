import clsx from "clsx";

import styles from "./CostLabel.module.css";

interface CostLabelProps {
    cost: number;
}

export default function CostLabel({ cost, large }: CostLabelProps) {
    return (
        <div className={clsx(styles.costLabel, large && styles.large)}>
            <span>+{cost}XP</span>
        </div>
    )
}