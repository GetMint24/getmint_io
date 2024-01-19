import { Dropdown, Flex, Switch, SwitchProps } from "antd";
import { useEffect, useState } from "react";
import Image from "next/image";

import styles from "./RefuelSwitch.module.css";
import { REFUEL_AMOUNT_USD } from "../../common/constants";

interface RefuelSwitchProps extends SwitchProps {
    onChangeRefuelGas: (value: number) => void;
    refuel: number;
}

export default function RefuelSwitch({ className, onChangeRefuelGas, refuel, ...props }: RefuelSwitchProps) {
    const [refuelCost, setRefuelCost] = useState(refuel);

    useEffect(() => {
        setRefuelCost(refuel);
    }, [refuel]);

    const changeRefuelGas = ({ key }: { key: string }) => {
        const gas = parseFloat(key);
        setRefuelCost(gas);
        onChangeRefuelGas(gas);
    };

    return (
        <Flex gap={8} align="center" justify="center" className={className}>
            <Switch {...props} className={styles.switch} />
            <span className={styles.label}>Enable refuel</span>

            <Dropdown
                trigger={['click']}
                placement={'topCenter'}
                menu={{
                    items: REFUEL_AMOUNT_USD.map(cost => ({
                        key: `${cost}`,
                        label: `$${cost}`
                    })),
                    selectable: true,
                    defaultSelectedKeys: [`${refuelCost}`],
                    onClick: changeRefuelGas,
                }}
            >
                <Flex gap={4} align="center" className={styles.price}>
                    <img src="/svg/ui/fuel.svg" alt="refuel" />
                    <span>${refuelCost}</span>
                    <Image src="/svg/ui/dropdown-arrow.svg" width={24} height={24} alt="" />
                </Flex>
            </Dropdown>
        </Flex>
    )
}