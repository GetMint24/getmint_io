import { Avatar, Flex } from "antd";

import styles from "./LeadersTable.module.css";
import BoostLabel from "../../../../components/BoostLabel/BoostLabel";

export default function LeadersTable() {
    return (
        <div>
            <div className={styles.head}>
                <div>Rank</div>
                <div>Name</div>
                <div>Mint</div>
                <div>Bridge</div>
                <div>Total&nbsp;XP</div>
            </div>

            <div className={styles.body}>
                <div className={styles.row}>
                    <div className={styles.wrapper}>
                        <div>1</div>
                        <div>
                            <Flex align="center" gap={8}>
                                <Avatar size={32} />
                                <span>Name</span>
                                <BoostLabel value={1.5} />
                            </Flex>
                        </div>
                        <div>1</div>
                        <div>1</div>
                        <div>30</div>
                    </div>
                </div>
            </div>
        </div>
    )
}