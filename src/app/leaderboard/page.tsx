"use client";

import Card from "../../components/ui/Card/Card";
import LeadersList from "./components/LeadersList/LeadersList";
import LeadersTable from "./components/LeadersTable/LeadersTable";

import styles from "./page.module.css";

export default function Page() {

    return (
        <Card
            title="Leaderboard"
            className={styles.card}
        >
            <LeadersTable />
            <LeadersList />
        </Card>
    )
}