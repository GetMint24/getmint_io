import Image from "next/image";
import { useConnect } from "wagmi";

import Button from "../../ui/Button/Button";
import styles from './ConnectWallet.module.css';

const ConnectorIcon = {
    'MetaMask': <Image src="/svg/metamask.svg" width={32} height={32} alt="MetaMask" />
}

export default function ConnectWallet({ onClose }) {
    const { connect, connectors, isLoading, pendingConnector } =
        useConnect({
            onSuccess: onClose
        });

    return (
        <div className={styles.wrapper}>
            <div>
                <h2 className={styles.title}>Connect a Wallet</h2>

                {connectors.map((connector) => (
                    <Button
                        disabled={!connector.ready}
                        key={connector.id}
                        className={styles.connectorBtn}
                        onClick={() => connect({ connector })}
                        block
                    >
                        {ConnectorIcon[connector.name]}
                        {connector.name}
                        {!connector.ready && ' (unsupported)'}
                        {isLoading &&
                            connector.id === pendingConnector?.id &&
                            ' (connecting)'}
                    </Button>
                ))}
            </div>
        </div>
    )
}