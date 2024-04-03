import { ReactNode } from "react";
import { BridgeType } from "../../../common/enums/BridgeType";
import { NetworkName } from "../../../common/enums/NetworkName";
import { HyperlaneAvailableNetworks } from "../../../common/constants";
import Image from "next/image";
import { getChainLogo } from "../../../utils/getChainLogo";
import { Chain } from "wagmi";

interface ChainMenuItem {
  key: number,
  label: string,
  icon: ReactNode,
}

export function getChainsByBridgeType(chains: Chain[], bridge: string | null) {
  const items: ChainMenuItem[] = [...chains]
    .filter(c => {
        if (bridge === BridgeType.Hyperlane) {
          return HyperlaneAvailableNetworks.includes(c.network as NetworkName);
        }

        return true;
    })
    .sort((a, b) => a.name.localeCompare(b.name))
    .map(c => ({
        key: c.id,
        label: c.name,
        icon: <Image width={24} height={24} src={getChainLogo(c.network)} alt="" />,
    }));

    return items
}
