import styles from './page.module.css';
import Card from "../../components/ui/Card/Card";
import MintForm from "./components/MintForm/MintForm";
import CostLabel from "../../components/CostLabel/CostLabel";

export default function Page() {
    return (
        <Card className={styles.page} title={(
            <div className={styles.title}>
                <span>Mint</span>
                <CostLabel cost={20} large />
            </div>
        )}>
            <MintForm />
        </Card>
    )
}
