import { observer } from "mobx-react-lite";
import { useState } from "react";
import clsx from "clsx";
import { useMedia } from "use-media";
import { NFTDto } from "../../../../../common/dto/NFTDto";
import ChainSelect from "../../../../../components/ChainSelect/ChainSelect";
import RefuelSwitch from "../../../../../components/RefuelSwitch/RefuelSwitch";
import Button from "../../../../../components/ui/Button/Button";
import ChainStore from "../../../../../store/ChainStore";

import styles from "./BridgeForm.module.css";

interface Props {
    nft: NFTDto;
    className?: string;
}

function BridgeForm({ nft, className }: Props) {
    const [selectedChain, setSelectedChain] = useState<string>(nft.chainId);
    const { chains } = ChainStore;
    const isMobile = useMedia({ maxWidth: 768 });

    const handleChangeChain = (value: string) => {
        setSelectedChain(value);
    };

    return (
        <div className={clsx(styles.container, className)}>
            {!isMobile ? (
                <ChainSelect chains={chains} value={selectedChain} onChange={handleChangeChain} />
            ) : (
                <RefuelSwitch />
            )}
            <div className={styles.actions}>
                {!isMobile ? (
                    <RefuelSwitch />
                ) : (
                    <ChainSelect chains={chains} value={selectedChain} onChange={handleChangeChain} />
                )}
                <Button>Send</Button>
            </div>
        </div>
    );
}

export default observer(BridgeForm);