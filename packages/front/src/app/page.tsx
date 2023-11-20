import styles from './page.module.css'
import { Button, Flex } from "antd";

export default function Home() {
    return (
        <main className={styles.main}>
            <Flex align="center" justify="space-between">
                <h1>GetMint.io</h1>
                <Button type="primary">Connect Metamask</Button>
            </Flex>
        </main>
    )
}
