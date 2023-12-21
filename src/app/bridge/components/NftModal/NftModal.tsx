import { observer } from "mobx-react-lite";
import { Flex } from "antd";
import NftStore from "../../../../store/NftStore";
import UiModal from "../../../../components/ui/Modal/Modal";
import Button from "../../../../components/ui/Button/Button";
import RefuelSwitch from "../../../../components/RefuelSwitch/RefuelSwitch";
import ChainSelect from "../../../../components/ChainSelect/ChainSelect";
import PinataImage from "../../../../components/PinataImage";

import styles from "./NftModal.module.css";

interface Props {
    onSubmit?(id: string): void;
}

function NftModal({ onSubmit }: Props) {
    const nft = NftStore.selectedNft();

    const handleClose = () => {
        NftStore.setNft(null);
    };

    const handleSubmit = () => {
        onSubmit?.(nft?.id || '');
    };

    return (
        <UiModal
            open={!!nft}
            title={nft?.name}
            onClose={handleClose}
            width={742}
            footer={
                nft && (
                    <Flex gap={12} className={styles.footer}>
                        <RefuelSwitch className={styles.switch} />
                        <Flex gap={8} flex={1} className={styles.actions}>
                            <ChainSelect value={nft.chainId} className={styles.dropdown} />
                            <Button className={styles.sendBtn} onClick={handleSubmit}>Send</Button>
                        </Flex>
                    </Flex>
                )
            }
        >
            {nft && (
                <>
                    <Flex align="center" justify="center" className={styles.image}>
                        <PinataImage hash={nft.pinataImageHash} name={nft.name} />
                    </Flex>
                    <div className={styles.description}>{nft.description}</div>
                </>
            )}
        </UiModal>
    )
}

export default observer(NftModal);