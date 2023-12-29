import Image from "next/image";
import styles from './Footer.module.css';
import { ReactNode } from "react";

interface FooterLinkProps {
    href: string;
    children: ReactNode;
}

function FooterLink({ href, children }: FooterLinkProps) {
    return (
        <a href={href} target="_blank" className={styles.link}>
            {children}
        </a>
    );
}

export default function Footer() {
    return (
        <div className={styles.footer}>
            <div className={styles.socials}>
                {/*<FooterLink href="#">
                    <Image src="/svg/socials/discord.svg" width={32} height={32} alt="Discord" />
                    <span>Discord</span>
                </FooterLink>*/}

                <FooterLink href="https://twitter.com/GetMint_io">
                    <Image src="/svg/socials/twitter.svg" width={28} height={28} alt="Twitter" />
                    <span>Twitter</span>
                </FooterLink>

                <FooterLink href="https://getmint.gitbook.io/">
                    <Image src="/svg/socials/gitbook.svg" width={28} height={28} alt="GitBook" />
                    <span>GitBook</span>
                </FooterLink>

                <FooterLink href="https://medium.com/@GetMint_io">
                    <Image src="/svg/socials/medium.svg" width={28} height={28} alt="Medium" />
                    <span>Medium</span>
                </FooterLink>
            </div>

            <FooterLink href="https://layerzero.network/">
                <span className={styles.poweredBy}>Powered by</span>
                <Image src="/svg/layer-zero.svg" width={111} height={30} alt="Layer Zero" />
            </FooterLink>
        </div>
    )
}