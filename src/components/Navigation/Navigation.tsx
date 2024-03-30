'use client'

import { ReactNode } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import clsx from "clsx";

import styles from './Navigation.module.css';
import CostLabel from "../CostLabel/CostLabel";
import SoonLabel from "../SoonLabel/SoonLabel";
import { BridgeType } from "../../common/enums/BridgeType";

interface NavLinkProps {
    href: string;
    title: string | ReactNode;
    cost?: number;
    className?: string;
}

function NavLink({ href, title, cost, className }: NavLinkProps) {
    const pathname = usePathname ();
    const isActive = pathname === href;

    return (
        <Link href={href} className={clsx(styles.link, className, isActive && styles.linkActive)}>
            <div>
                <span>{title}</span>
                {Boolean(cost) && <CostLabel cost={cost as number} />}
            </div>
        </Link>
    )
}

const getPathWithBridgeParam = (path: string, bridge: BridgeType) => {
    if (bridge) {
        return `${path}?bridge=${bridge}`;
    }

    return path;
}

export default function Navigation() {
    const searchParams = useSearchParams();
    const bridge = searchParams.get('bridge') as BridgeType;

    return (
        <nav className={styles.nav}>
            <NavLink href={getPathWithBridgeParam('/', bridge)} title="Mint" cost={20} />
            <NavLink href={getPathWithBridgeParam('/bridge', bridge)} title="Bridge NFT" cost={10} />
            <NavLink href="/leaderboard" title="Leaderboard" />
            <NavLink href="#" title={<>Meme <SoonLabel /></>} className="meme" />
        </nav>
    )
}