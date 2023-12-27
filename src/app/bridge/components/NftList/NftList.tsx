import { Flex, Spin } from "antd";
import { observer } from "mobx-react-lite";
import PinataImage from "../../../../components/PinataImage";
import NftStore from "../../../../store/NftStore";
import ChainLabel from "../../../../components/ChainLabel/ChainLabel";
import { NFTDto } from "../../../../common/dto/NFTDto";
import ListCard from "../../../../components/ListCard/ListCard";

import styles from "./NftList.module.css";

function NftList() {
    const nfts = [...NftStore.nfts].sort((a, b) => a.chainName.localeCompare(b.chainName));

    const handleCardClick = (nft: NFTDto) => {
        NftStore.setNft(nft.id);
    };

    if (NftStore.loading) {
        return <Spin size="large" />
    }

    return (
        <Flex gap={12} justify="center" wrap="wrap" className={styles.list}>
            {nfts.map((nft) => (
                <ListCard
                    key={nft.id}
                    label={
                        <ChainLabel
                            network={nft.chainNetwork}
                            label={nft.chainName}
                            className={styles.chain}
                            iconClassName={styles.chainIcon}
                            labelClassName={styles.chainLabel}
                        />
                    }
                    image={<PinataImage hash={nft.pinataImageHash} name={nft.name} />}
                    title={nft.name}
                    xp={20}
                    onClick={() => handleCardClick(nft)}
                    className={styles.listItem}
                />
            ))}
        </Flex>
    )
}

export default observer(NftList);