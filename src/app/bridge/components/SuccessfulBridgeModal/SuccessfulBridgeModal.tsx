import { Flex } from "antd";
import Image from "next/image";
import { observer } from "mobx-react-lite";
import UiModal from "../../../../components/ui/Modal/Modal";
import ChainLabel from "../../../../components/ChainLabel/ChainLabel";
import NftStore from "../../../../store/NftStore";
import PinataImage from "../../../../components/PinataImage";

import styles from "./SuccessfulBridgeModal.module.css";
import { SuccessfulBridgeData } from "../../types";

interface Props {
    data: SuccessfulBridgeData;
    onClose?(): void;
}

function SuccessfulBridgeModal({ data, onClose }: Props) {
    const nft = NftStore.selectNftById(data.nftId);

    if (!nft) {
        return null;
    }

    return (
        <UiModal
            open={true}
            title={<span className={styles.title}>Successful Bridge</span>}
            width={468}
            onClose={onClose}
        >
            <div className={styles.name}>{nft.name}</div>

            <Flex align="center" justify="center" className={styles.image}>
                <PinataImage hash={nft.pinataImageHash} name={nft.name} />
            </Flex>

            <Flex align="center" className={styles.bridgeScheme}>
                <ChainLabel
                    network={data.previousChain.network}
                    label={data.previousChain.name}
                    justify="center"
                    className={styles.label}
                />
                <Image src="/svg/scheme-arrow.svg" width={24} height={24} alt="" />
                <ChainLabel
                    network={data.nextChain.network}
                    label={data.nextChain.name}
                    justify="center"
                    className={styles.label}
                />
            </Flex>
        </UiModal>
    )
}

export default observer(SuccessfulBridgeModal);