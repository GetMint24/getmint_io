import { Flex, Switch, SwitchProps } from "antd";

import styles from "./RefuelSwitch.module.css";
import { REFUEL_AMOUNT_USD } from "../../common/constants";

export default function RefuelSwitch({ className, ...props }: SwitchProps) {
    return (
        <Flex gap={8} align="center" justify="center" className={className}>
            <Switch {...props} className={styles.switch} />
            <span className={styles.label}>Enable refuel</span>
            <Flex gap={4} align="center" className={styles.price}>
                <img src="/svg/ui/fuel.svg" alt="refuel" />
                <span>${REFUEL_AMOUNT_USD}</span>
            </Flex>
        </Flex>
    )
}