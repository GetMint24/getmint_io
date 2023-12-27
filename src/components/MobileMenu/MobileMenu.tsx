import { Avatar, Flex } from "antd";
import Image from "next/image";
import { ReactNode, useState } from "react";
import Logo from "../Logo/Logo";
import NetworkChainSelect from "../NetworkChainSelect/NetworkChainSelect";
import { useAccount } from "wagmi";
import Button from "../ui/Button/Button";
import Link from "next/link";
import CostLabel from "../CostLabel/CostLabel";
import SoonLabel from "../SoonLabel/SoonLabel";
import AppStore from "../../store/AppStore";
import Drawer from "../ui/Drawer/Drawer";
import { observer } from "mobx-react-lite";

import styles from "./MobileMenu.module.css";

interface NavLinkProps {
    href: string;
    title: ReactNode;
    cost?: number;
    onClick?(): void;
}

function NavLink({ href, title, cost, onClick }: NavLinkProps) {
    return (
        <div>
            <Link href={href} className={styles.link} onClick={onClick}>
                {title}
                {!!cost && <CostLabel cost={cost} />}
            </Link>
        </div>
    )
}

function MobileMenu() {
    const [isOpen, setIsOpen] = useState(false);
    const { openAccountDrawer } = AppStore;
    const { isConnected, isConnecting } = useAccount();

    const handleOpenMenu = () => {
        setIsOpen(true);
    };

    const handleCloseMenu = () => {
        setIsOpen(false);
    };

    return (
        <>
            <Flex gap={16} align="center">
                <Avatar size={40} style={{ background: 'linear-gradient(135deg, #2CD9FF 0.52%, #FFC701 100.52%)' }} onClick={openAccountDrawer} className={styles.avatar} />
                <button className={styles.burger} onClick={handleOpenMenu}>
                    <Image src="/svg/ui/burger.svg" width={24} height={24} alt="" />
                </button>
            </Flex>

            <Drawer isOpen={isOpen} onClose={handleCloseMenu}>
                <Flex align="center" justify="space-between" gap={40}>
                    <Logo />
                    <Image src="/svg/ui/close.svg" width={32} height={32} alt="" className={styles.closeIcon} onClick={handleCloseMenu} />
                </Flex>

                <nav className={styles.nav}>
                    <NavLink href="/" title="Mint" cost={20} onClick={handleCloseMenu} />
                    <NavLink href="/bridge" title="Bridge NFT" cost={10} onClick={handleCloseMenu} />
                    <NavLink href="/leaderboard" title={<>Leaderboard <SoonLabel /></>} onClick={handleCloseMenu} />
                    <NavLink href="/meme" title={<>Meme <SoonLabel /></>} onClick={handleCloseMenu} />
                </nav>

                {isConnected ? (
                    <Flex vertical gap={12}>
                        <strong className={styles.selectLabel}>Select chain</strong>
                        <NetworkChainSelect />
                    </Flex>
                ) : (
                    <Button onClick={openAccountDrawer}>
                        {isConnecting ? 'Connecting...' : 'Connect Metamsk'}
                    </Button>
                )}
            </Drawer>
        </>
    )
}

export default observer(MobileMenu);