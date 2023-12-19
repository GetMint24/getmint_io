import { Flex, Image } from "antd";
import { observer } from "mobx-react-lite";
import PinataImage from "../../../../components/PinataImage";
import NftStore from "../../../../store/NftStore";
import ChainLabel from "../../../../components/ChainLabel/ChainLabel";

import styles from "./NftList.module.css";

function NftList() {
    const nfts = NftStore.nfts;

    const handleCardClick = () => {
        NftStore.setNft(1);
    };

    return (
        <Flex gap={12} justify="center" wrap="wrap" className={styles.list}>
            {/* {nfts.map((nft) => ( */}
                <Flex gap={12} vertical className={styles.listItem} onClick={handleCardClick}>
                    <ChainLabel src="/svg/chains/base.svg" label="Base network" className={styles.chain} iconClassName={styles.chainIcon} labelClassName={styles.chainLabel} />

                    <Flex vertical align="center" justify="center" className={styles.image}>
                        {/* <PinataImage hash={nft.pinataImageHash} name={nft.name} /> */}
                        <img src="/example-nft.png" />
                    </Flex>

                    <div>
                        <strong className={styles.name}>Name</strong>
                        <Flex gap={4} align="center" className={styles.xp}>
                            <img src="/svg/xp.svg" />
                            <span>10 XP</span>
                        </Flex>
                    </div>
                </Flex>
                <Flex gap={12} vertical className={styles.listItem} onClick={handleCardClick}>
                    <ChainLabel src="/svg/chains/base.svg" label="Base network" className={styles.chain} iconClassName={styles.chainIcon} labelClassName={styles.chainLabel} />

                    <Flex vertical align="center" justify="center" className={styles.image}>
                        {/* <PinataImage hash={nft.pinataImageHash} name={nft.name} /> */}
                        <img src="/example-nft.png" />
                    </Flex>

                    <div>
                        <strong className={styles.name}>Name</strong>
                        <Flex gap={4} align="center" className={styles.xp}>
                            <img src="/svg/xp.svg" />
                            <span>10 XP</span>
                        </Flex>
                    </div>
                </Flex>
            {/* ))} */}
        </Flex>
    )
}

export default observer(NftList);