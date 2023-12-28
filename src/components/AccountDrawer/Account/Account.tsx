import Image from "next/image";
import { useAccount, useDisconnect } from "wagmi";
import clsx from "clsx";
import { Avatar, Flex, message, Spin } from 'antd';

import styles from './Account.module.css';
import Button from "../../ui/Button/Button";
import CostLabel from "../../CostLabel/CostLabel";
import IconBtn from "../../ui/IconBtn/IconBtn";
import FormControl from "../../ui/FormControl/FormControl";
import Input from "../../ui/Input/Input";
import AccountAddress from "../../AccountAddress/AccountAddress";
import AppStore from "../../../store/AppStore";
import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import { twitterApi } from "../../../utils/twitterApi";

interface RewardItemProps {
    name: string;
    amount: number;
    count?: number;
    isTotal?: boolean;
}

function RewardItem({ name, amount, count, isTotal }: RewardItemProps) {
    const costLabel = `${amount} XP`;

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

function Account() {
    const { closeAccountDrawer, account, fetchAccount, disconnectTwitter, loading } = AppStore;
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

    const startTwitterAuth = () => {
        if (account) {
            const authUrl = twitterApi.getAuthUrl(account.id);
            window.location.assign(authUrl);
        }
    };

    const disconnectHandler = () => {
        void disconnectTwitter();
    };

    const goToFollow = () => {
        const url = new URL('https://twitter.com/intent/follow');
        url.searchParams.append('original_referer', process.env.APP_URL);
        url.searchParams.append('region', 'follow_link');
        url.searchParams.append('screen_name', 'GetMint_io');
        window.open(url, '_blank');
    };

    useEffect(() => {
        void fetchAccount();
    }, [fetchAccount]);

    if (!account) {
        return (
            <div className={styles.accountLoading}>
                <Flex vertical align="center" justify="center" gap={12}>
                    <Spin size="large" />
                    <span>Loading account...</span>
                </Flex>
            </div>
        )
    }

    return (
        <div className={styles.account}>
            {contextHolder}

            <main className={styles.accountMain}>
                <Image src="/svg/ui/close.svg" width={32} height={32} alt="" className={styles.closeIcon} onClick={closeAccountDrawer} />

                <div className={styles.card}>
                    <Flex gap={10}>
                        <Avatar size={48} style={{ background: 'linear-gradient(135deg, #2CD9FF 0.52%, #FFC701 100.52%)' }} />
                        <div>
                            <AccountAddress className={styles.userName} address={address} />
                            <AccountAddress className={styles.userAddress} address={address} withCopy />
                        </div>
                    </Flex>

                    <div className={styles.divider}></div>

                    <Flex justify="space-between" align="center" gap={12}>
                        <Flex align="center" gap={8}>
                            <Image src="/svg/socials/twitter.svg" width={28} height={26} alt="Add Twitters" />
                            <strong>Twitter</strong>
                        </Flex>

                        {account.twitter.user ? (
                            <Flex gap={8} align="center" className={styles.twitterAccount}>
                                <strong className={styles.twitterUsername}>@{account.twitter.user.username}</strong>
                                {loading ? (
                                    <Spin size="large" />
                                ) : (
                                    <button className={styles.disconnectButton} onClick={disconnectHandler}>Disconnect</button>
                                )}
                            </Flex>
                        ) : (
                            <button className={styles.connectButton} onClick={startTwitterAuth}>Connect</button>
                        )}
                    </Flex>

                    <div className={styles.divider}></div>

                    <Flex vertical gap={16} className={styles.subscribeInfo}>
                        <div>Subscribe to our social network <CostLabel cost={50} /></div>
                        <Button block onClick={goToFollow}>Follow <strong>@GetMint_io</strong></Button>
                    </Flex>
                </div>

                <div className={styles.card}>
                    <div className={styles.cardTitle}>Rewards</div>
                    {/* <div className={styles.divider}></div>
                    <div>
                        <FormControl title="Your refferal link">
                            <Input value={refferalLink} onChange={() => {}} readOnly action={(
                                <IconBtn tooltip="Copy" onClick={handleCopy}>
                                    <Image src="/svg/ui/copy.svg" width={24} height={24} alt="Copy" />
                                </IconBtn>
                            )} />
                        </FormControl>
                    </div> */}
                    <div className={styles.divider}></div>
                    {account ? (
                        <>
                            <div className={styles.rewardsList}>
                                <RewardItem
                                    name="Refferals"
                                    count={account.balance.refferalsCount}
                                    amount={account.balance.refferals}
                                />
                                <RewardItem
                                    name="Twitter activity"
                                    amount={account.balance.twitterActivity}
                                />
                                <RewardItem
                                    name="Mints"
                                    count={account.balance.mintsCount}
                                    amount={account.balance.mints}
                                />
                                <RewardItem
                                    name="Bridges"
                                    count={account.balance.bridgesCount}
                                    amount={account.balance.bridges}
                                />
                            </div>
                            <div className={styles.divider}></div>
                            <div><RewardItem name="Total" amount={account.balance.total} isTotal /></div>
                        </>
                    ) : <Spin />}
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

export default observer(Account);