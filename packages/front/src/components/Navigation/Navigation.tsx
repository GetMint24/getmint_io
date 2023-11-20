'use client'

import styles from './Navigation.module.css';
import Link from "next/link";
import { useRouter } from "next/navigation";
import clsx from "clsx";

interface NavLinkProps {
    href: string;
    title: string;
    cost?: number;
}

function NavLink({ href, title, cost }: NavLinkProps) {
    const router = useRouter();
    const isActive = router.asPath === href;

    return (
        <Link href={href} className={clsx(styles.link, isActive && styles.linkActive)}>
            <div>
                <span>{title}</span>
                {Boolean(cost) && (
                    <div className={styles.costLabel}>
                        <span>+{cost}XP</span>
                    </div>
                )}
            </div>
        </Link>
    )
}

export default function Navigation() {
    return (
        <nav className={styles.nav}>
            <NavLink href="/" title="Mint" cost={20} />
            <NavLink href="/bridge" title="Bridge NFT" cost={10} />
            {/*<NavLink href="/" title="Leaderbord" />*/}
        </nav>
    )
}