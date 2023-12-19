import { observer } from "mobx-react-lite";
import { Flex } from "antd";
import NftStore from "../../../../store/NftStore";
import UiModal from "../../../../components/ui/Modal/Modal";
import styles from "./NftModal.module.css";
import WalletActions from "../../../../components/WalletActions/WalletActions";
import Button from "../../../../components/ui/Button/Button";
import RefuelSwitch from "../../../../components/RefuelSwitch/RefuelSwitch";

interface Props {
    onSubmit?(): void;
}

function NftModal({ onSubmit }: Props) {
    const nft = NftStore.selectedNft;

    const handleClose = () => {
        NftStore.setNft(null);
    };

    return (
        <UiModal
            open={!!nft}
            title="Fox Geometric"
            onClose={handleClose}
            width={742}
            footer={
                <Flex gap={12} className={styles.footer}>
                    <RefuelSwitch className={styles.switch} />
                    <Flex gap={8} flex={1} className={styles.actions}>
                        <WalletActions className={styles.dropdown} />
                        <Button className={styles.sendBtn} onClick={onSubmit}>Send</Button>
                    </Flex>
                </Flex>
            }
        >
            <Flex align="center" justify="center" className={styles.image}>
                <img src="/example-nft.png" />
            </Flex>
            <div className={styles.description}>DescriptionDescriptionDescriptionDescriptionDescriptionDescriptionDescriptionDescriptionDescriptionDescriptionDescriptionDescription</div>
        </UiModal>
    )
}

export default observer(NftModal);