import { Flex, Spin } from "antd";
import { observer } from "mobx-react-lite";
import Image from "next/image";
import PinataImage from "../../../../components/PinataImage";
import NftStore from "../../../../store/NftStore";
import ChainLabel from "../../../../components/ChainLabel/ChainLabel";
import { NFTDto } from "../../../../common/dto/NFTDto";

import styles from "./NftList.module.css";

function NftList() {
    const nfts = NftStore.nfts;

    const handleCardClick = (nft: NFTDto) => {
        NftStore.setNft(nft);
    };

    if (NftStore.loading) {
        return <Spin size="large" />
    }

    return (
        <Flex gap={12} justify="center" wrap="wrap" className={styles.list}>
             {nfts.map((nft) => (
                <Flex key={nft.id} gap={12} vertical className={styles.listItem} onClick={() => handleCardClick(nft)}>
                    <ChainLabel
                        network={nft.chainNetwork}
                        label={nft.chainName}
                        className={styles.chain}
                        iconClassName={styles.chainIcon}
                        labelClassName={styles.chainLabel}
                    />

                    <Flex vertical align="center" justify="center" className={styles.image}>
                         <PinataImage hash={nft.pinataImageHash} name={nft.name} />
                    </Flex>

                    <div>
                        <strong className={styles.name}>{nft.name}</strong>
                        <Flex gap={4} align="center" className={styles.xp}>
                            <Image src="/svg/xp.svg" width={14} height={14} alt="XP" />
                            <span>20 XP</span>
                        </Flex>
                    </div>
                </Flex>
             ))}
        </Flex>
    )
}

export default observer(NftList);