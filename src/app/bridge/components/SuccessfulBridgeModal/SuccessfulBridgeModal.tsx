import { Flex } from "antd";
import UiModal from "../../../../components/ui/Modal/Modal";
import ChainLabel from "../../../../components/ChainLabel/ChainLabel";

import styles from "./SuccessfulBridgeModal.module.css";

interface Props {
    open?: boolean;
    onClose?(): void;
}

export default function SuccessfulBridgeModal({ open, onClose }: Props) {
    return (
        <UiModal
            open={open}
            title={<span className={styles.title}>Successful Bridge</span>}
            width={468}
            onClose={onClose}
        >
            <div className={styles.name}>Fox Geometric</div>

            <Flex align="center" justify="center" className={styles.image}>
                <img src="/example-nft.png" />
            </Flex>

            <Flex align="center" className={styles.bridgeScheme}>
                <ChainLabel src="/svg/chains/base.svg" label="Base network" justify="center" className={styles.label} />
                <img src="/svg/scheme-arrow.svg" />
                <ChainLabel src="/svg/chains/arbitrum.svg" label="Arbitrum One" justify="center" className={styles.label} />
            </Flex>
        </UiModal>
    )
}