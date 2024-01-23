import Image from "next/image";
import styles from './ClaimsModal.module.css';

import UiModal, { UiModalProps } from "../../ui/Modal/Modal";
import { EarnedItem } from "../../../common/types";
import { getChainLogo } from "../../../utils/getChainLogo";
import clsx from "clsx";

interface ClaimsModalProps extends UiModalProps {
    earnedItems: EarnedItem[];
}
const ZERO_VALUE = '$0.00';

export default function ClaimsModal(props: ClaimsModalProps) {
    const { earnedItems, ...etc } = props;

    return (
        <UiModal {...etc} title="Claim" width={400}>
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
                                    <button onClick={() => alert('Claim')} className={styles.btn}>Claim {item.formattedPrice}</button>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </UiModal>
    )
}