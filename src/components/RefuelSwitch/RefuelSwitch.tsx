import { Flex, Switch, SwitchProps } from "antd";

import styles from "./RefuelSwitch.module.css";

export default function RefuelSwitch({ className, ...props }: SwitchProps) {
    return (
        <Flex gap={8} align="center" justify="center" className={className}>
            <Switch {...props} className={styles.switch} />
            <span className={styles.label}>Enable refuel</span>
            <Flex gap={4} align="center" className={styles.price}>
                <img src="/svg/ui/fuel.svg" />
                <span>$0.22</span>
            </Flex>
        </Flex>
    )
}