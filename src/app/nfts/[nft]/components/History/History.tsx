import { useMedia } from "use-media";
import { observer } from "mobx-react-lite";
import clsx from "clsx";
import { useEffect, useState } from "react";
import { Spin } from "antd";
import Image from "next/image";
import { intlFormatDistance } from "date-fns";
import { BalanceLogType } from "../../../../../common/enums/BalanceLogType";
import { OperationHistoryDto } from "../../../../../common/dto/OperationHistoryDto";
import ChainLabel from "../../../../../components/ChainLabel/ChainLabel";
import ChainStore from "../../../../../store/ChainStore";
import ApiService from "../../../../../services/ApiService";

import styles from "./History.module.css";

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
    loading?: boolean;
    className?: string;
}

function History({ history, loading, className }: Props) {
    const isMobile = useMedia({ maxWidth: 768 });

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
                            <div className={styles.chains}>
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
                    <div>Network</div>
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
                            <div>
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
                            <div>{intlFormatDistance(new Date(item.date), new Date(), { locale: 'en-US' })}</div>
                        </div>
                    )
                })}
            </div>
        </div>
    );
}

export default observer(History);