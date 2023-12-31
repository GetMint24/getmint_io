import { useEffect, useMemo, useState } from "react";
import { Dropdown, Flex, MenuProps } from "antd";
import Image from "next/image";
import { observer } from "mobx-react-lite";
import clsx from "clsx";
import ChainStore from "../../store/ChainStore";
import { getChainLogo } from "../../utils/getChainLogo";

import styles from "./ChainSelect.module.css";
import { ChainDto } from "../../common/dto/ChainDto";

interface Props {
    chains: ChainDto[];
    value?: string;
    className?: string;
    onChange?(value: string): void;
}

function ChainSelect({ value, className, onChange, chains }: Props) {
    const [selectedValue, setSelectedValue] = useState<string>('');
    const chain = ChainStore.getChainById(selectedValue);

    useEffect(() => {
        setSelectedValue(value!);
    }, [value]);

    const items: MenuProps['items'] = useMemo(() => {
        return [...chains]
            .sort((a, b) => a.name.localeCompare(b.name))
            .map((chain) => ({
                key: chain.id,
                label: chain.name,
                icon: <Image width={24} height={24} alt="" src={getChainLogo(chain.network)} />,
            }));
    }, [chains]);

    const chainLogo = useMemo(() => getChainLogo(chain?.network || ''), [chain]);

    const handleSelect = (value: string) => {
        setSelectedValue(value);
        onChange?.(value);
    };

    return (
        <Dropdown
            trigger={['click']}
            menu={{
                items,
                selectable: true,
                defaultSelectedKeys: [selectedValue],
                onClick: ({ key }) => handleSelect(key),    
            }}
            rootClassName={styles.dropdown}
        >
            <Flex align="center" gap={8} className={clsx(styles.select, className)}>
                {chainLogo && (<Image src={chainLogo} width={24} height={24} alt="" />)}

                <span className={styles.label}>{chain?.name || ''}</span>

                {/*<Flex align="center" gap={4} className={styles.price}>
                    <Image src="/svg/ui/fuel.svg" width={16} height={16} alt="" />
                    <span>$2.29</span>
                </Flex>*/}

                <Image src="/svg/ui/dropdown-arrow.svg" width={24} height={24} alt="" />
            </Flex>
        </Dropdown>
    )
}

export default observer(ChainSelect);