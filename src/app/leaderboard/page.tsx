"use client";

import { useEffect } from "react";
import { observer } from "mobx-react-lite";
import { useMedia } from "use-media";
import { Flex, Spin } from "antd";
import Card from "../../components/ui/Card/Card";
import LeadersList from "./components/LeadersList/LeadersList";
import LeadersTable from "./components/LeadersTable/LeadersTable";
import LeadersStore from "../../store/LeadersStore";
import AppStore from "../../store/AppStore";

import styles from "./page.module.css";

function Page() {
    const { metamaskWalletAddress } = AppStore;
    const { currentUserStat, leaders, loading, getLeaders, getCurrentUserStat } = LeadersStore;
    const isMobile = useMedia({ maxWidth: 768 });

    useEffect(() => {
        void getLeaders();
    }, []);

    useEffect(() => {
        if (metamaskWalletAddress) {
            void getCurrentUserStat();
        }
    }, [metamaskWalletAddress]);

    return (
        <Card
            title="Leaderboard"
            className={styles.card}
        >
            {loading && (
                <Flex align="center" justify="center">
                    <Spin size="large" />
                </Flex>
            )}
            {!loading && (
                <>
                    {currentUserStat && (
                        <div className={styles.current}>
                            <div className={styles.subtitle}>{`Your stats on GetMint.io`}</div>
                            {isMobile ? (
                                <LeadersList leaders={[currentUserStat]} />
                            ) : (
                                <LeadersTable leaders={[currentUserStat]} />
                            )}
                        </div>
                    )}
                    {isMobile ? (
                        <LeadersList leaders={leaders} />
                    ) : (
                        <LeadersTable leaders={leaders} />
                    )}
                </>
            )}
        </Card>
    )
}

export default observer(Page);