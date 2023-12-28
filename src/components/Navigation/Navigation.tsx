'use client'

import { ReactNode } from "react";
import Link from "next/link";
import { usePathname  } from "next/navigation";
import clsx from "clsx";

import styles from './Navigation.module.css';
import CostLabel from "../CostLabel/CostLabel";
import SoonLabel from "../SoonLabel/SoonLabel";

interface NavLinkProps {
    href: string;
    title: string | ReactNode;
    cost?: number;
}

function NavLink({ href, title, cost }: NavLinkProps) {
    const pathname = usePathname ();
    const isActive = pathname === href;

    return (
        <Link href={href} className={clsx(styles.link, isActive && styles.linkActive)}>
            <div>
                <span>{title}</span>
                {Boolean(cost) && <CostLabel cost={cost as number} />}
            </div>
        </Link>
    )
}

export default function Navigation() {
    return (
        <nav className={styles.nav}>
            <NavLink href="/" title="Mint" cost={20} />
            <NavLink href="/bridge" title="Bridge NFT" cost={10} />
            <NavLink href="/leaderboard" title={<>Leaderboard <SoonLabel /></>} />
            <NavLink href="/meme" title={<>Meme <SoonLabel /></>} />
        </nav>
    )
}