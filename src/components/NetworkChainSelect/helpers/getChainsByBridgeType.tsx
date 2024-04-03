import { ReactNode } from "react";
import { BridgeType } from "../../../common/enums/BridgeType";
import Image from "next/image";
import { getChainLogo } from "../../../utils/getChainLogo";
import { ChainDto } from "../../../common/dto/ChainDto";

interface ChainMenuItem {
  key: number,
  label: string,
  icon: ReactNode,
}

export function getChainsByBridgeType(chainsInfo: ChainDto[], bridge: string | null) {
  const items = chainsInfo.reduce((res: ChainMenuItem[], chainInfo) => {
    if (chainInfo.availableBridgeTypes.includes(bridge as BridgeType)) {
      res.push({
        key: chainInfo.chainId,
        label: chainInfo.name,
        icon: <Image width={24} height={24} src={getChainLogo(chainInfo.network)} alt="" />,
    })
    }
    return res
  }, [])

  return items.sort((a, b) => a.label.localeCompare(b.label))
}
