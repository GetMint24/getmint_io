import BoostLabel from "../../../../components/BoostLabel/BoostLabel";

import styles from "./LeadersList.module.css";

export default function LeadersList() {
    return (
        <div className={styles.list}>
            <div className={styles.card}>
                <div className={styles.position}>1</div>
                <div className={styles.info}>
                    <div className={styles.name}>
                        <div className={styles.label}>Name</div>
                        <div className={styles.value}>Name <BoostLabel value={1.5} size="small" /></div>
                    </div>

                    <div className={styles.activity}>
                        <div>
                            <div className={styles.label}>Mint</div>
                            <div className={styles.value}>1</div>
                        </div>
                        <div>
                            <div className={styles.label}>Bridge</div>
                            <div className={styles.value}>1</div>
                        </div>
                        <div>
                            <div className={styles.label}>Total&nbsp;XP</div>
                            <div className={styles.value}>30</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}