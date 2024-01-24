import { useState } from "react";
import Image from "next/image";
import { notification, Spin } from "antd";
import { useNetwork, useSwitchNetwork } from "wagmi";
import clsx from "clsx";
import styles from './ClaimsModal.module.css';

import UiModal, { UiModalProps } from "../../ui/Modal/Modal";
import { EarnedItem } from "../../../common/types";
import { getChainLogo } from "../../../utils/getChainLogo";
import { claimReferralFee } from "../../../core/contractController";
import { NetworkName } from "../../../common/enums/NetworkName";
import ChainStore from "../../../store/ChainStore";

interface ClaimsModalProps extends UiModalProps {
    earnedItems: EarnedItem[];
    onClaimed: () => void;
}
const ZERO_VALUE = '$0.00';

export default function ClaimsModal(props: ClaimsModalProps) {
    const { earnedItems, onClaimed, ...etc } = props;
    const [isPending, setIsPending] = useState<boolean>(false);

    const { chain: currentChain } = useNetwork();
    const { switchNetworkAsync } = useSwitchNetwork();

    const claim = async (network: NetworkName) => {
        const chain = ChainStore.chains.find(x => x.network === network);

        if (chain) {
            setIsPending(true);

            if (currentChain?.network !== network) {
                await switchNetworkAsync?.(chain.chainId);
            }

            try {
                const response = await claimReferralFee(chain);

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
        <UiModal {...etc} title="Claim" width={400}>
            <div className={clsx(styles.wrapper, isPending && styles.wrapperLoading)}>
                <div className={styles.table}>
                    <div className={styles.tableHead}>
                        <div>Network</div>
                        <div>Amount</div>
                    </div>

                    {earnedItems.map(item => (
                        <div className={styles.row} key={item.chainNetwork}>
                            <div className={styles.network}><Image src={getChainLogo(item.chainNetwork)} width={24} height={24} alt="" /> {item.chainName}</div>
                            <div className={clsx(styles.claim, item.formattedPrice === ZERO_VALUE && styles.claimZero)}>
                                <div>{item.formattedPrice !== ZERO_VALUE ? item.formattedPrice : '$0'}</div>
                                {item.formattedPrice !== ZERO_VALUE && (
                                    <div>
                                        <button onClick={() => claim(item.chainNetwork)} className={styles.btn}>
                                            Claim {item.formattedPrice}
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {isPending && <div className={styles.loader}><Spin /></div>}
            </div>
        </UiModal>
    )
}