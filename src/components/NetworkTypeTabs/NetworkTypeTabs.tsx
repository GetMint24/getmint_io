import React, { useEffect, useState } from "react";
import { BridgeType } from "../../common/enums/BridgeType";
import HyperlaneSvg from './HyperlaneSvg';
import LzSvg from "./LzSvg";
import cn from './style.module.css';
import clsx from "clsx";

const options = [
    {
        value: BridgeType.LayerZero,
        label: <LzSvg />
    },
    {
        value: BridgeType.Hyperlane,
        label: <HyperlaneSvg />
    }
];

interface NetworkTypeTabsProps {
    selected: BridgeType;
    onSelect: (value: BridgeType) => void;
}

export default function NetworkTypeTabs(props: NetworkTypeTabsProps) {
    const [selected, setSelected] = useState(BridgeType.LayerZero);

    useEffect(() => {
        if (props.selected) {
            setSelected(props.selected);
        }
    }, [props.selected]);

    return (
        <div className={cn.tabs}>
            {options.map(item => (
                <button
                    key={item.value}
                    className={clsx(cn.btn, {
                        [cn.active]: selected === item.value
                    })}
                    onClick={() => {
                        if (selected !== item.value) {
                            setSelected(item.value);
                            props.onSelect(item.value);
                        }
                    }}
                >
                    {item.label}
                </button>
            ))}
        </div>
    )
}