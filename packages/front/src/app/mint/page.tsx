import styles from './page.module.css';
import Card from "../../components/ui/Card/Card";
import MintForm from "./components/MintForm/MintForm";
import CostLabel from "../../components/CostLabel/CostLabel";
import PinataImage from "../../components/PinataImage";

export default function Page() {
    return (
        <Card className={styles.page} title={(
            <div className={styles.title}>
                <span>Mint</span>
                <CostLabel cost={20} large />
            </div>
        )}>
            {/*<PinataImage hash={'QmdUqFGTunepKfuG9QSTATgP84ox3bSxi7RS3PzosStB1t'} />*/}
            <MintForm />
        </Card>
    )
}
