import { Dropdown, Flex,  message } from "antd";
import Image from "next/image";
import { useEffect, useMemo } from "react";
import clsx from "clsx";
import { useNetwork, useSwitchNetwork } from "wagmi";
import { getChainLogo } from "../../utils/getChainLogo";

import styles from "./NetworkChainSelect.module.css";
import { useSearchParams } from "next/navigation";
import { getChainsByBridgeType } from "./helpers/getChainsByBridgeType";
import ChainStore from "../../store/ChainStore";
import { observer } from "mobx-react-lite";

const WRONG_NETWORK = 'Wrong Network'

function NetworkChainSelect() {
    const searchParams = useSearchParams();
    const [messageApi, contextHolder] = message.useMessage();
    const { chain, chains } = useNetwork();
    const setIsSelectedWrongChain = ChainStore.setIsSelectedWrongChain
    const { reset, switchNetwork, error } = useSwitchNetwork(
        {
            onSettled: () => {
                reset();
            },
        }
    );

    const { chainsMenu, isKnownChain, chainName } = useMemo(() => {
        const bridge = searchParams.get('bridge');

        const availableChains = getChainsByBridgeType(chains, bridge)
        const isKnownChain = !!(chain && availableChains.some(({label}) => label === chain.name))

        setIsSelectedWrongChain(!isKnownChain)
        return {
            chainsMenu: availableChains,
            isKnownChain,
            chainName: isKnownChain ? chain.name : WRONG_NETWORK
        }
    }, [chains, searchParams, chain]);

    const chainLogo = useMemo(() => isKnownChain && getChainLogo(chain?.network!), [chain, isKnownChain]);

    const handleSwitchNetwork = (chainId: number) => {
        if (switchNetwork) {
            switchNetwork(chainId);
        }
    };

    useEffect(() => {
        if (error) {
            void messageApi.warning('User rejected the request');
        }
    }, [error, messageApi]);

    if (!chain || !switchNetwork) {
        return null;
    }

    return (
        <>
            {contextHolder}

            <Dropdown
                trigger={['click']}
                menu={{
                    items: chainsMenu,
                    selectable: true,
                    defaultSelectedKeys: [String(chain.id)],
                    onClick: ({ key }) => handleSwitchNetwork(parseInt(key))
                }}
                rootClassName={styles.dropdown}
            >
                <Flex align="center" gap={8} className={clsx(styles.dropdownBtn, { [styles.wrong]: !isKnownChain })}>
                    {chainLogo && isKnownChain && <Image src={chainLogo} width={24} height={24} alt="" />}

                    <div className={styles.value}>{chainName}</div>

                    <Image src="/svg/ui/dropdown-arrow.svg" width={24} height={24} alt="" />
                </Flex>
            </Dropdown>
        </>
    )
}

export default observer(NetworkChainSelect)