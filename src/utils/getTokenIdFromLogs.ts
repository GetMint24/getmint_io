import { hexToNumber } from "viem";
import { TransactionLog } from "../common/types";

export const getTokenIdFromLogs = (logs: TransactionLog[]) => {
    const log = logs.find(x => x.topics.length === 4);
    return log ? parseInt(`${hexToNumber(log.topics[3])}`) : undefined
}