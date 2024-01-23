import Image from "next/image";
import { useAccount, useDisconnect, useNetwork } from "wagmi";
import clsx from "clsx";
import { Avatar, Flex, message, Spin } from 'antd';
import { observer } from "mobx-react-lite";
import { useEffect, useMemo, useState } from "react";

import styles from './Account.module.css';
import Button from "../../ui/Button/Button";
import CostLabel from "../../CostLabel/CostLabel";
import IconBtn from "../../ui/IconBtn/IconBtn";
import FormControl from "../../ui/FormControl/FormControl";
import Input from "../../ui/Input/Input";
import AccountAddress from "../../AccountAddress/AccountAddress";
import AppStore from "../../../store/AppStore";
import { twitterApi } from "../../../utils/twitterApi";
import { generateGradient } from "../../../utils/generators";
import { convertAddress, getReffererEarnedInNetwork } from "../../../core/contractController";
import { CONTRACT_ADDRESS } from "../../../common/constants";
import { NetworkName } from "../../../common/enums/NetworkName";
import { usePrice } from "../../../common/usePrice";

interface RewardItemProps {
    name: string;
    amount?: string;
    count?: number;
    showAmount?: boolean;
    isTotal?: boolean;
}

function RewardItem({ name, amount = `0 XP`, count = 0, isTotal = false, showAmount = true }: RewardItemProps) {
    return (
        <Flex justify="space-between" align="center" className={clsx(isTotal && styles.rewardItemTotal)}>
            <div className={styles.rewardItemName}>{name}</div>
            <div className={styles.rewardItemCount}>
                {isTotal && <Image src="/svg/xp.svg" width={24} height={24} alt="XP" />}
                {showAmount ? (
                    <>
                        {count ? <span>{count} ({amount})</span> : <span>{amount}</span>}
                    </>
                ) : (
                    <>
                        {count || 0}
                    </>
                )}
            </div>
        </Flex>
    )
}

function Account() {
    const [messageApi, contextHolder] = message.useMessage();
    const [showVerifyText, setShowVerifyText] = useState(false);
    const {
        closeAccountDrawer,
        account,
        fetchAccount,
        disconnectTwitter,
        followTwitter,
        loading,
        clearAccount,
        setWalletConnected
    } = AppStore;

    const [earnedClaims, setEarnedClaims] = useState<string>('0');
    const price = usePrice('ETH');

    const { chain } = useNetwork();
    const { address, connector } = useAccount();
    const { disconnect } = useDisconnect({
        onSuccess: closeAccountDrawer
    });

    const refferalLink = useMemo(() => {
        if (address) {
            return `${document.location.origin}/?ref=${convertAddress(address)}`;
        }

        return '';
    }, [address]);

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
        if (account) {
            followTwitter(account.id);
            setShowVerifyText(true);
            const url = new URL('https://twitter.com/intent/follow');
            url.searchParams.append('original_referer', process.env.APP_URL);
            url.searchParams.append('region', 'follow_link');
            url.searchParams.append('screen_name', 'GetMint_io');
            window.open(url, '_blank');
            setTimeout(() => {
                fetchAccount();
                setShowVerifyText(false);
            }, 30000);
        }
    };

    useEffect(() => {
        void fetchAccount();
    }, [fetchAccount, address]);

    const claim = async () => {
        console.log('claim');
    };

    const calculateEarnedClaims = async () => {
        if (price) {
            const earned = await getReffererEarnedInNetwork(
                CONTRACT_ADDRESS[chain?.network as NetworkName],
                address!
            );

            const earnedInDollars = (parseFloat(earned) * price!).toFixed(2);
            setEarnedClaims(earnedInDollars === '0.00' ? '0' : earnedInDollars)
        }
    };

    useEffect(() => {
        calculateEarnedClaims();
    }, [chain, address, price]);

    const logout = () => {
        disconnect();
        clearAccount();
        setWalletConnected(false);
    };

    if (!account) {
        return (
            <div className={styles.accountLoading}>
                <Flex vertical align="center" justify="center" gap={12}>
                    <Spin size="large" />
                    <span>Loading account...</span>
                </Flex>
            </div>
        );
    }

    return (
        <div className={styles.account}>
            {contextHolder}

            <main className={styles.accountMain}>
                <Image src="/svg/ui/close.svg" width={32} height={32} alt="" className={styles.closeIcon} onClick={closeAccountDrawer} />

                <div className={styles.card}>
                    <Flex gap={10}>
                        <Avatar size={48} src={account.twitter.user?.avatar} style={{ background: generateGradient(135) }} />
                        <div>
                            {account.twitter.user?.username ? (
                                <span className={styles.userName}>{account.twitter.user.username}</span>
                            ) : (
                                <AccountAddress className={styles.userName} address={address} />
                            )}
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
                        {showVerifyText ? (
                            <Flex align="center" gap={8}>
                                <Spin />
                                <span>XP will be accrued after verification</span>
                            </Flex>
                        ) : (
                            <>
                                <Flex align="center" gap={8}>
                                    {account.twitter.followed && (<Image src="/svg/ui/successful.svg" width={24} height={24} alt="" />)}
                                    <span>Subscribe to our social network</span>
                                    <CostLabel cost={30} success={account.twitter.followed} />
                                </Flex>
                                <Button block onClick={goToFollow} disabled={account.twitter.followed || !account.twitter.connected}>Follow <strong>@GetMint_io</strong></Button>
                            </>
                        )}
                    </Flex>
                </div>

                <div className={styles.card}>
                    <div className={styles.cardTitle}>Refferal</div>
                    <div className={styles.divider}></div>
                    <div>
                        <FormControl className={styles.refferalLinkControl} title="Your refferal link">
                            <Input value={refferalLink} onChange={() => {}} readOnly action={(
                                <IconBtn tooltip="Copy" onClick={handleCopy}>
                                    <Image src="/svg/ui/copy.svg" width={24} height={24} alt="Copy" />
                                </IconBtn>
                            )} />
                        </FormControl>
                    </div>
                    <div className={styles.divider}></div>
                    {account ? (
                        <>
                            <div className={styles.rewardsList}>
                                <RewardItem
                                    name="Refferals"
                                    count={account.refferals.count}
                                    showAmount={false}
                                />

                                <RewardItem
                                    name="Referral mints"
                                    count={account.refferals.mintsCount}
                                    showAmount={false}
                                />

                                <RewardItem
                                    name="Claimable amount"
                                    amount={`$${earnedClaims}`}
                                />
                            </div>
                        </>
                    ) : <Spin />}
                    <div className={styles.divider}></div>
                    <Button
                        block
                        disabled={earnedClaims !== '0'}
                        onClick={claim}
                    >
                        Claim ${earnedClaims}
                    </Button>
                </div>

                <div className={styles.card}>
                    <div className={styles.cardTitle}>Rewards</div>
                    <div className={styles.divider}></div>
                    {account ? (
                        <>
                            <div className={styles.rewardsList}>
                                <RewardItem
                                    name="Refferals mints"
                                    count={account.balance.refferalsMintCount}
                                    amount={`${account.balance.refferals} XP`}
                                />
                                <RewardItem
                                    name="Twitter activity"
                                    amount={`${account.balance.twitterActivity} XP`}
                                />
                                <RewardItem
                                    name="Mints"
                                    count={account.balance.mintsCount}
                                    amount={`${account.balance.mints} XP`}
                                />
                                <RewardItem
                                    name="Bridges"
                                    count={account.balance.bridgesCount}
                                    amount={`${account.balance.bridges} XP`}
                                />
                            </div>
                            <div className={styles.divider}></div>
                            <div><RewardItem name="Total" amount={`${account.balance.total} XP`} isTotal /></div>
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
                        <IconBtn tooltip="Logout" onClick={logout}>
                            <Image src="/svg/ui/logout.svg" width={24} height={24} alt="Logout" />
                        </IconBtn>
                    </Flex>
                </div>
            </footer>
        </div>
    );
}

export default observer(Account);