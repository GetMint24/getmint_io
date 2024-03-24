import React, { useEffect, useState } from "react";
import { NetworkType } from "../../common/enums/NetworkType";
import HyperlaneSvg from './HyperlaneSvg';
import LzSvg from "./LzSvg";
import cn from './style.module.css';
import clsx from "clsx";

const options = [
    {
        value: NetworkType.LayerZero,
        label: <LzSvg />
    },
    {
        value: NetworkType.Hyperlane,
        label: <HyperlaneSvg />
    }
];

interface NetworkTypeTabsProps {
    selected: NetworkType;
    onSelect: (value: NetworkType) => void;
}

export default function NetworkTypeTabs(props: NetworkTypeTabsProps) {
    const [selected, setSelected] = useState(NetworkType.LayerZero);

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
                        setSelected(item.value);
                        props.onSelect(item.value);
                    }}
                >
                    {item.label}
                </button>
            ))}
        </div>
    )
}