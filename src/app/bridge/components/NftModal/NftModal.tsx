import { observer } from "mobx-react-lite";
import { Flex, Spin } from "antd";
import clsx from "clsx";

import NftStore from "../../../../store/NftStore";
import UiModal from "../../../../components/ui/Modal/Modal";
import Button from "../../../../components/ui/Button/Button";
import RefuelSwitch from "../../../../components/RefuelSwitch/RefuelSwitch";
import ChainSelect from "../../../../components/ChainSelect/ChainSelect";
import PinataImage from "../../../../components/PinataImage";
import { SuccessfulBridgeData } from "../../types";
import { useBridge } from "../../../../common/useBridge";
import { ChainDto } from "../../../../common/dto/ChainDto";

import styles from "./NftModal.module.css";

interface Props {
    onSubmit(data: SuccessfulBridgeData): void;
}

function NftModal({ onSubmit }: Props) {
    const nft = NftStore.selectedNft();

    const onAfterBridge = (previousChain?: ChainDto, nextChain?: ChainDto) => {
        if (previousChain && nextChain) {
            onSubmit({
                nftId: nft!.id,
                previousChain,
                nextChain,
            });
        }
    };

    const {
        bridgePriceList,
        chains,
        refuelCost,
        refuelEnabled,
        selectedChain,
        isPending,
        onChangeChain,
        onChangeRefuelEnabled,
        onChangeRefuelGas,
        onBridge
    } = useBridge(nft!, onAfterBridge);

    if (!nft) {
        return null;
    }

    const handleClose = () => {
        NftStore.setNft(null);
    };

    return (
        <UiModal
            open={!!nft}
            title={nft?.name}
            onClose={handleClose}
            width={742}
            footer={
                nft && (
                    <Flex gap={12} className={clsx(styles.footer, isPending && styles.footerPending)}>
                        <RefuelSwitch
                            refuel={refuelCost}
                            onChangeRefuelGas={onChangeRefuelGas}
                            checked={refuelEnabled}
                            onChange={onChangeRefuelEnabled}
                            className={styles.switch}
                        />

                        <Flex gap={8} flex={1} className={styles.actions}>
                            <ChainSelect
                                chains={chains}
                                value={selectedChain}
                                onChange={onChangeChain}
                                className={styles.dropdown}
                                priceList={bridgePriceList}
                            />
                            <Button className={styles.sendBtn} onClick={onBridge}>Send</Button>
                        </Flex>
                        {isPending && <Spin className={styles.pending} />}
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