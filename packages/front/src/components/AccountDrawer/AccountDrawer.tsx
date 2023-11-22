'use client'

import { useAccount, useConnect, useDisconnect } from "wagmi";

import Drawer from "../ui/Drawer/Drawer";
import Button from "../ui/Button/Button";

export default function AccountDrawer({ isOpen, isConnected, onClose }) {
    const { address, connector } = useAccount();
    const { connect, connectors, isLoading, pendingConnector } =
        useConnect({
            onSuccess: onClose
        });

    const { disconnect } = useDisconnect({
        onSuccess: onClose
    });

    return (
        <Drawer isOpen={isOpen} onClose={onClose}>
            {isConnected ? (
                <>
                    <h1>{address?.slice(0, 15)}</h1>
                    <p>Connected to {connector?.name} <button onClick={disconnect}>Disconnect</button></p>
                </>
            ) : (
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
            )}
        </Drawer>
    )
}