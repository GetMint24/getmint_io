import { Avatar, Flex, Spin } from "antd";
import { observer } from "mobx-react-lite";
import BoostLabel from "../../../../components/BoostLabel/BoostLabel";
import LeadersStore from "../../../../store/LeadersStore";
import { generateGradient } from "../../../../utils/generators";

import styles from "./LeadersTable.module.css";

function LeadersTable() {
    const { leaders } = LeadersStore;

    if (!leaders.length) {
        return null;
    }

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
                {leaders.map((leader, index) => (
                    <div className={styles.row} key={leader.id}>
                        <div className={styles.wrapper}>
                            <div>{index + 1}</div>
                            <div>
                                <Flex align="center" gap={8}>
                                    <Avatar size={32} src={leader.avatar} style={{ background: generateGradient(135) }} />
                                    <span>{leader.login}</span>
                                    {/* <BoostLabel value={1.5} /> */}
                                </Flex>
                            </div>
                            <div>{leader.mintCount}</div>
                            <div>{leader.bridgeCount}</div>
                            <div>{leader.total}</div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default observer(LeadersTable);