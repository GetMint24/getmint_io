import { useConnect } from "wagmi";

import Drawer from "../ui/Drawer/Drawer";
import Button from "../ui/Button/Button";

export default function ConnectWalletDrawer({ isOpen, onClose }) {
    const { connect, connectors, isLoading, pendingConnector } =
        useConnect();

    return (
        <Drawer isOpen={isOpen} onClose={onClose}>
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
        </Drawer>
    )
}