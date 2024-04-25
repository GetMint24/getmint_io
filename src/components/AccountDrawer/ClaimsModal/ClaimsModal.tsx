import { useState } from "react";
import Image from "next/image";
import { notification, Spin } from "antd";
import { useAccount, useSwitchChain } from "wagmi";
import clsx from "clsx";
import styles from './ClaimsModal.module.css';

import UiModal, { UiModalProps } from "../../ui/Modal/Modal";
import { EarnedItem } from "../../../common/types";
import { getChainLogo } from "../../../utils/getChainLogo";
import { claimReferralFee } from "../../../core/contractController";
import { NetworkName } from "../../../common/enums/NetworkName";
import ChainStore from "../../../store/ChainStore";
import { getChainNetworkByChainName } from "../../../utils/getChainNetworkByName";
import HyperlaneSvg from "../../NetworkTypeTabs/HyperlaneSvg";
import { BridgeType } from "../../../common/enums/BridgeType";

interface ClaimsModalProps extends UiModalProps {
    earnedItems: EarnedItem[];
    onClaimed: () => void;
}
const ZERO_VALUE = '$0.00';

export default function ClaimsModal(props: ClaimsModalProps) {
    const { earnedItems, onClaimed, ...etc } = props;
    const [isPending, setIsPending] = useState<boolean>(false);

    const { chain: currentChain } = useAccount();
    const { switchChainAsync } = useSwitchChain();

    const claim = async (network: NetworkName, bridgeType: BridgeType) => {
        const chain = ChainStore.chains.find(x => x.network === network);

        if (chain && currentChain) {
            setIsPending(true);

            

            try {
                const currentChainNetwork = getChainNetworkByChainName(currentChain.name)

                if (currentChainNetwork !== network) {
                    await switchChainAsync?.({
                        chainId: chain.chainId
                    });
                }

                const response = await claimReferralFee(chain, bridgeType);

                if (response.result) {
                    onClaimed();

                    notification.success({
                        message: response.message
                    });
                } else {
                    notification.error({
                        message: response.message
                    });

                    setIsPending(false);
                }
            } finally {
                setIsPending(false);
            }
        }
    };

    return (
        <UiModal {...etc} title="Claim" width={600}>
            <div className={clsx(styles.wrapper, isPending && styles.wrapperLoading)}>
                <div className={styles.table}>
                    <div className={styles.tableHead}>
                        <div>Network</div>
                        <div className={styles.bridgeType}>Amount</div>
                        <div className={styles.bridgeType}>
                            <Image className={styles.lzIcon} width={24} height={24} src='/svg/layer-zero-logo.svg' alt='Layerzero' />
                        </div>
                        <div className={styles.bridgeType}>
                            <HyperlaneSvg className={styles.hyperlaneIcon} showText={false} withoutOpacity />
                        </div>
                    </div>

                    {earnedItems.map(item => (
                        <div className={styles.row} key={item.chainNetwork}>
                            <div className={styles.network}><Image src={getChainLogo(item.chainNetwork)} width={24} height={24} alt="" /> {item.chainName}</div>
                            <div className={clsx(styles.claim, item.earnedSum === ZERO_VALUE && styles.claimZero)}>
                                {item.earnedSum}
                            </div>
                            <div className={styles.claim}>
                                {
                                    item.lz.formattedPrice !== ZERO_VALUE && (
                                        <div>
                                            <button onClick={() => claim(item.chainNetwork, BridgeType.LayerZero)} className={styles.btn}>
                                                Claim {item.lz.formattedPrice}
                                            </button>
                                        </div>
                                    )
                                }
                            </div>
                            <div className={styles.claim}>
                                {
                                    item.hyperlane.formattedPrice !== ZERO_VALUE && (
                                        <div>
                                            <button onClick={() => claim(item.chainNetwork, BridgeType.Hyperlane)} className={styles.btn}>
                                                Claim {item.hyperlane.formattedPrice}
                                            </button>
                                        </div>
                                    )
                                }
                            </div>
                        </div>
                    ))}
                </div>

                {isPending && <div className={styles.loader}><Spin /></div>}
            </div>
        </UiModal>
    )
}