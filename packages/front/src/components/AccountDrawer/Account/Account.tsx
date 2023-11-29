import Image from "next/image";
import { useAccount, useDisconnect } from "wagmi";
import clsx from "clsx";
import { Avatar, Flex, message } from 'antd';

import styles from './Account.module.css';
import Button from "../../ui/Button/Button";
import CostLabel from "../../CostLabel/CostLabel";
import IconBtn from "../../ui/IconBtn/IconBtn";
import FormControl from "../../ui/FormControl/FormControl";
import Input from "../../ui/Input/Input";
import AccountAddress from "../../AccountAddress/AccountAddress";
import AppStore from "../../../store/AppStore";

interface RewardItemProps {
    name: string;
    cost: number;
    count?: number;
    isTotal?: boolean;
}

function RewardItem({ name, cost, count, isTotal }: RewardItemProps) {
    const costLabel = `${cost} XP`;

    return (
        <Flex justify="space-between" align="center" className={clsx(isTotal && styles.rewardItemTotal)}>
            <div className={styles.rewardItemName}>{name}</div>
            <div className={styles.rewardItemCount}>
                {isTotal && <Image src="/svg/xp.svg" width={24} height={24} alt="XP" />}
                {count ? <span>{count} ({costLabel})</span> : <span>{costLabel}</span>}
            </div>
        </Flex>
    )
}

export default function Account() {
    const { closeAccountDrawer } = AppStore;
    const [messageApi, contextHolder] = message.useMessage();

    const { address, connector } = useAccount();
    const { disconnect } = useDisconnect({
        onSuccess: closeAccountDrawer
    });

    const refferalLink = 'https://getmint.io/ref=031231480das';

    const handleCopy = async () => {
        await navigator.clipboard.writeText(refferalLink);
        await messageApi.info('Your refferal link has copied!');
    };

    return (
        <div className={styles.account}>
            {contextHolder}

            <main className={styles.accountMain}>
                <div className={styles.card}>
                    <Flex gap={10}>
                        <Avatar size={48} style={{ background: 'linear-gradient(135deg, #2CD9FF 0.52%, #FFC701 100.52%)' }} />
                        <div>
                            <AccountAddress className={styles.userName} address={address} />
                            <AccountAddress className={styles.userAddress} address={address} withCopy />
                        </div>
                    </Flex>

                    <div className={styles.divider}></div>

                    <Flex justify="space-between" align="center">
                        <Flex align="center" gap={8}>
                            <Image src="/svg/socials/twitter.svg" width={28} height={26} alt="Add Twitters" />
                            <strong>Twitter</strong>
                        </Flex>

                        <button className={styles.connectButton}>Connect</button>
                    </Flex>

                    <div className={styles.divider}></div>

                    <Flex vertical gap={16} className={styles.subscribeInfo}>
                        <div>Subscribe to our social network <CostLabel cost={50} /> and <CostLabel cost={1} /> every day for not unsubscribing with us</div>
                        <Button block>Follow <strong>@GetMint_io</strong></Button>
                    </Flex>
                </div>

                <div className={styles.card}>
                    <div className={styles.cardTitle}>Rewards</div>
                    <div className={styles.divider}></div>
                    <div>
                        <FormControl title="Your refferal link">
                            <Input value={refferalLink} onChange={() => {}} readOnly action={(
                                <IconBtn tooltip="Copy" onClick={handleCopy}>
                                    <Image src="/svg/ui/copy.svg" width={24} height={24} alt="Copy" />
                                </IconBtn>
                            )} />
                        </FormControl>
                    </div>
                    <div className={styles.divider}></div>
                    <div className={styles.rewardsList}>
                        <RewardItem name="Refferals" count={0} cost={0} />
                        <RewardItem name="Twitter activity" cost={0} />
                        <RewardItem name="Mints" count={0} cost={0} />
                        <RewardItem name="Bridges" count={0} cost={0} />
                    </div>
                    <div className={styles.divider}></div>
                    <div><RewardItem name="Total" cost={0} isTotal /></div>
                </div>
            </main>

            <footer>
                <div className={styles.card}>
                    <Flex justify="space-between" gap={8} align="center" className={styles.walletConnector}>
                        <Flex align="center" gap={8}>
                            <Image src="/svg/metamask.svg" width={32} height={32} alt="MetaMask" />
                            <div className={styles.connector}>
                                <h2>{connector?.name}</h2>
                                <AccountAddress className={styles.connectorAddress} address={address} />
                            </div>
                        </Flex>
                        <IconBtn tooltip="Logout" onClick={() => disconnect()}>
                            <Image src="/svg/ui/logout.svg" width={24} height={24} alt="Logout" />
                        </IconBtn>
                    </Flex>
                </div>
            </footer>
        </div>
    );
}