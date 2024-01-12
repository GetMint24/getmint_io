import { observer } from "mobx-react-lite";
import BoostLabel from "../../../../components/BoostLabel/BoostLabel";
import LeadersStore from "../../../../store/LeadersStore";
import { Spin } from "antd";

import styles from "./LeadersList.module.css";

function LeadersList() {
    const { leaders } = LeadersStore;

    if (!leaders.length) {
        return null;
    }

    return (
        <div className={styles.list}>
            {leaders.map((leader, index) => (
                <div className={styles.card} key={leader.id}>
                    <div className={styles.position}>{index + 1}</div>
                    <div className={styles.info}>
                        <div className={styles.name}>
                            <div className={styles.label}>Name</div>
                            <div className={styles.value}>
                                {leader.login}
                                {/* <BoostLabel value={1.5} size="small" /> */}
                            </div>
                        </div>

                        <div className={styles.activity}>
                            <div>
                                <div className={styles.label}>Mint</div>
                                <div className={styles.value}>{leader.mintCount}</div>
                            </div>
                            <div>
                                <div className={styles.label}>Bridge</div>
                                <div className={styles.value}>{leader.bridgeCount}</div>
                            </div>
                            <div>
                                <div className={styles.label}>Total&nbsp;XP</div>
                                <div className={styles.value}>{leader.total}</div>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}

export default observer(LeadersList);