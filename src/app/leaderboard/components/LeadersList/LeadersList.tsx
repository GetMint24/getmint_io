import clsx from "clsx";
import { LeaderDto } from "../../../../common/dto/LeaderDto";

import styles from "./LeadersList.module.css";

interface Props {
    leaders: LeaderDto[];
}

export default function LeadersList({ leaders }: Props) {
    if (!leaders.length) {
        return null;
    }

    return (
        <div className={styles.list}>
            {leaders.map((leader) => (
                <div className={styles.card} key={leader.id}>
                    <div
                        className={clsx(styles.position, {
                            [styles.first]: leader.position === 1,
                            [styles.second]: leader.position === 2,
                            [styles.third]: leader.position === 3,
                            [styles.small]: leader.position > 99,
                        })}
                    >
                        {leader.position}
                    </div>
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