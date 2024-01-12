"use client";

import { useEffect } from "react";
import { observer } from "mobx-react-lite";
import { useMedia } from "use-media";
import { Flex, Spin } from "antd";
import Card from "../../components/ui/Card/Card";
import LeadersList from "./components/LeadersList/LeadersList";
import LeadersTable from "./components/LeadersTable/LeadersTable";
import LeadersStore from "../../store/LeadersStore";

import styles from "./page.module.css";

function Page() {
    const { loading, getLeaders } = LeadersStore;
    const isMobile = useMedia({ maxWidth: 768 });

    useEffect(() => {
        void getLeaders();
    }, []);

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
            {!loading && isMobile ? (
                <LeadersList />
            ) : (
                <LeadersTable />
            )}
        </Card>
    )
}

export default observer(Page);