import { useEffect, useMemo, useState } from "react";
import { Dropdown, Flex, MenuProps } from "antd";
import Image from "next/image";
import { observer } from "mobx-react-lite";
import clsx from "clsx";
import styles from "./ChainSelect.module.css";

import ChainStore from "../../store/ChainStore";
import { getChainLogo } from "../../utils/getChainLogo";
import { ChainDto } from "../../common/dto/ChainDto";
import { EstimationBridgeType } from "../../core/contractController";

interface Props {
    chains: ChainDto[];
    value?: string;
    className?: string;
    priceList?: EstimationBridgeType;
    onChange?(value: string): void;
}

function ChainSelect({ value, className, onChange, chains, priceList }: Props) {
    const [selectedValue, setSelectedValue] = useState<string>('');
    const chain = ChainStore.getChainById(selectedValue);

    useEffect(() => {
        setSelectedValue(value!);
    }, [value]);

    const items: MenuProps['items'] = useMemo(() => {
        return [...chains]
            .sort((a, b) => a.name.localeCompare(b.name))
            .map((chain) => {
                const price = priceList?.find(p => p?.network === chain.network);

                return {
                    key: chain.id,
                    label: (
                        <Flex justify="space-between" align="center">
                            <div>{chain.name}</div>
                            {price && price.price !== '0.00' && <div>${price?.price}</div>}
                        </Flex>
                    ),
                    icon: <Image width={24} height={24} alt="" src={getChainLogo(chain.network)} />,
                }
            });
    }, [chains, priceList]);

    const bridgePrice = useMemo(() => {
        if (selectedValue && priceList && chains?.length) {
            const chain = chains.find(c => c.id === selectedValue);

            if (chain) {
                return priceList.find(p => p?.network === chain.network)?.price;
            }
        }

        return null;
    }, [selectedValue, chains, priceList]);

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
        >
            <Flex align="center" gap={8} className={clsx(styles.select, className)}>
                {chainLogo && (<Image src={chainLogo} width={24} height={24} alt="" />)}

                <span className={styles.label}>{chain?.name || ''}</span>

                {bridgePrice && bridgePrice !== '0.00' && (
                    <Flex align="center" gap={4} className={styles.price}>
                        <Image src="/svg/ui/fuel.svg" width={16} height={16} alt="" />
                        <span>${bridgePrice}</span>
                    </Flex>
                )}

                <Image src="/svg/ui/dropdown-arrow.svg" width={24} height={24} alt="" />
            </Flex>
        </Dropdown>
    )
}

export default observer(ChainSelect);