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
    nftId: string;
    chainNetwork: string;
    className?: string;
}

function History({ nftId, chainNetwork, className }: Props) {
    const [history, setHistory] = useState<OperationHistoryDto[]>([]);
    const isMobile = useMedia({ maxWidth: 768 });

    useEffect(() => {
        ApiService.getNftHistory(nftId, chainNetwork).then((history) => setHistory(history));
    }, [chainNetwork, nftId]);

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
                {!history.length && <Spin size="large" />}
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