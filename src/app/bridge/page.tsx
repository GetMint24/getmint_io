import styles from "./page.module.css";
import Card from "../../components/ui/Card/Card";
import CostLabel from "../../components/CostLabel/CostLabel";

export default function Page() {
    return (
        <Card title={(
            <div className={styles.title}>
                <span>Bridge NFT</span>
                <CostLabel cost={10} size="large" />
            </div>
        )}>
            CardProps
        </Card>
    )
}