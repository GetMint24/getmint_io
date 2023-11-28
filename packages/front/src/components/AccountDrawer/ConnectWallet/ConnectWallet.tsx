import Button from "../../ui/Button/Button";
import { useConnect } from "wagmi";

export default function ConnectWallet({ onClose }) {
    const { connect, connectors, isLoading, pendingConnector } =
        useConnect({
            onSuccess: onClose
        });

    return (
        <>
            <h2>Connect a Wallet</h2>

            {connectors.map((connector) => (
                <Button
                    disabled={!connector.ready}
                    key={connector.id}
                    onClick={() => connect({ connector })}
                    block
                >
                    {connector.name}
                    {!connector.ready && ' (unsupported)'}
                    {isLoading &&
                        connector.id === pendingConnector?.id &&
                        ' (connecting)'}
                </Button>
            ))}
        </>
    )
}