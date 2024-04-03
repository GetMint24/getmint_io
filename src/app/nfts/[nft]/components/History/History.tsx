import { useMedia } from "use-media";
import { observer } from "mobx-react-lite";
import clsx from "clsx";
import { Spin } from "antd";
import Image from "next/image";
import { intlFormatDistance } from "date-fns";
import { BalanceLogType } from "../../../../../common/enums/BalanceLogType";
import { OperationHistoryDto } from "../../../../../common/dto/OperationHistoryDto";
import ChainLabel from "../../../../../components/ChainLabel/ChainLabel";
import ChainStore from "../../../../../store/ChainStore";

import styles from "./History.module.css";
import { BridgeType } from "../../../../../common/enums/BridgeType";
import { getBridgeBlockExplorer } from "../../../../../utils/getBridgeBlockExplorer";
import { LinkSvg } from "../../../../../components/LinkSvg/LinkSvg";

const OPERATION_ICONS = {
    [BalanceLogType.Mint]: '/svg/mint-operation.svg',
    [BalanceLogType.Bridge]: '/svg/bridge-operation.svg',
};

const OPERATION_NAME = {
    [BalanceLogType.Mint]: 'Mint',
    [BalanceLogType.Bridge]: 'Bridge',
};

interface Props {
    history: OperationHistoryDto[];
    bridgeType: BridgeType,
    loading?: boolean;
    className?: string;
}

function History({ history, bridgeType, loading, className }: Props) {
    const isMobile = useMedia({ maxWidth: 768 });
    
    const isHyperlaneBridgeType = bridgeType === BridgeType.Hyperlane
    const showLinkColumn = isHyperlaneBridgeType ? history.some((h) => h.transactionHash) : false;

    if (isMobile) {
        return (
            <div className={clsx(styles.container, className)}>
                {loading && <Spin size="large" />}
                {!loading && !history.length && <strong>Operation history is empty</strong>}
                {history.map((item, index) => {
                    const chain = ChainStore.getChainByNetwork(item.chainNetwork);
                    const targetChain = item.targetChainNetwork ? ChainStore.getChainByNetwork(item.targetChainNetwork) : undefined;

                    if (!chain) {
                        return null;
                    }

                    return (
                        <div key={index} className={styles.card}>
                            <div className={styles.info}>
                                <div>
                                    <div className={styles.label}>Action</div>
                                    <div className={styles.operation}>
                                        <Image src={OPERATION_ICONS[item.type]} width={20} height={20} alt="" />
                                        <span>{OPERATION_NAME[item.type]}</span>
                                    </div>
                                </div>
                                <div>
                                    <div className={styles.label}>Time</div>
                                    <div className={styles.value}>{intlFormatDistance(new Date(item.date), new Date(), { locale: 'en-US' })}</div>
                                </div>
                            </div>
                            <div className={styles.info}>
                                <div className={styles.infoRightSide}>
                                    <div className={styles.label}>Network</div>
                                    <div className={styles.scheme}>
                                        <ChainLabel network={chain.network} label={chain.name} justify="center" iconClassName={styles.icon} labelClassName={styles.chainLabel} />
                                        {targetChain && (
                                            <>
                                                <Image src="/svg/scheme-arrow.svg" width={16} height={16} alt="" className={styles.arrow} />
                                                <ChainLabel network={targetChain.network} label={targetChain.name} justify="center" iconClassName={styles.icon} labelClassName={styles.chainLabel} />
                                            </>
                                        )}
                                    </div>
                                </div>
                                {showLinkColumn && item.transactionHash && <div className={styles.infoRightSide}>
                                    <div className={styles.label}>Link</div>
                                    <a className={styles.transactionLink} href={getBridgeBlockExplorer(BridgeType.Hyperlane, item.transactionHash)} target="_blank">
                                        hyperlane.xyz
                                        <LinkSvg />
                                    </a>
                                </div>}

                            </div>
                        </div>
                    );
                })}
            </div>
        );
    }

    return (
        <div className={clsx(styles.container, className)}>
            <div className={styles.head}>
                <div className={styles.row}>
                    <div>Action</div>
                    <div className={styles.centeredTitle}>Network</div>
                    {showLinkColumn && <div className={styles.centeredTitle}>Link</div>}
                    <div>Time</div>
                </div>
            </div>
            <div className={styles.body}>
                {loading && <Spin size="large" />}
                {!loading && !history.length && <strong>Operation history is empty</strong>}
                {history.map((item, index) => {
                    const chain = ChainStore.getChainByNetwork(item.chainNetwork);
                    const targetChain = item.targetChainNetwork ? ChainStore.getChainByNetwork(item.targetChainNetwork) : undefined;

                    if (!chain) {
                        return null;
                    }

                    return (
                        <div key={index} className={styles.row}>
                            <div>
                                <div className={styles.operation}>
                                    <Image src={OPERATION_ICONS[item.type]} width={24} height={24} alt="" />
                                    <span>{OPERATION_NAME[item.type]}</span>
                                </div>
                            </div>
                            <div >
                                <div className={styles.scheme}>
                                    <ChainLabel network={chain.network} label={chain.name} />
                                    {targetChain && (
                                        <>
                                            <Image src="/svg/scheme-arrow.svg" width={16} height={16} alt="" />
                                            <ChainLabel network={targetChain.network} label={targetChain.name} />
                                        </>
                                    )}
                                </div>
                            </div>
                            {showLinkColumn && !item.transactionHash && <div className={styles.transactionLinkWrapper} />}
                            {showLinkColumn && item.transactionHash && 
                                <div className={styles.transactionLinkWrapper}>
                                    <a className={styles.transactionLink} href={getBridgeBlockExplorer(BridgeType.Hyperlane, item.transactionHash)} target="_blank">
                                        hyperlane.xyz

                                        <LinkSvg />
                                    </a>
                                </div>
                            }
                            <div>{intlFormatDistance(new Date(item.date), new Date(), { locale: 'en-US' })}</div>
                        </div>
                    )
                })}
            </div>
        </div>
    );
}

export default observer(History);