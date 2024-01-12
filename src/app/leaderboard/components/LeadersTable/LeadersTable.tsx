import { Avatar, Flex } from "antd";
import clsx from "clsx";
import BoostLabel from "../../../../components/BoostLabel/BoostLabel";
import { generateGradient } from "../../../../utils/generators";
import { LeaderDto } from "../../../../common/dto/LeaderDto";

import styles from "./LeadersTable.module.css";

interface Props {
    leaders: LeaderDto[];
}

export default function LeadersTable({ leaders }: Props) {
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
                {leaders.map((leader) => (
                    <div className={styles.row} key={leader.id}>
                        <div className={styles.wrapper}>
                            <div
                                className={clsx({
                                    [styles.first]: leader.position === 1,
                                    [styles.second]: leader.position === 2,
                                    [styles.third]: leader.position === 3,
                                    [styles.small]: leader.position > 99,
                                })}
                            >
                                {leader.position}
                            </div>
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