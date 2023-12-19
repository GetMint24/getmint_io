import { ReactNode } from "react";
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import styles from "./layout.module.css";

import Header from "../components/layout/Header/Header";
import Footer from "../components/layout/Footer/Footer";
import WalletProvider from "./wallet-provider";
import StyledComponentsRegistry from "../components/AntdRegistry";
import Script from "next/script";

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'GetMint',
  twitter: {
    card: 'summary',
    title: 'title',
    description: 'description',
    images: '/example-nft.png',
  },
}

export default function RootLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <WalletProvider>
          <StyledComponentsRegistry>
            <div className={styles.bg}>
              <div className="container">
                <div className={styles.bgHero} />
              </div>
            </div>

            <div className={styles.wrapper}>
              <header className={styles.wrapperHeader}>
                <div className="container">
                  <Header />
                </div>
              </header>

              <main className={styles.main}>
                <div className="container">
                  {children}
                </div>
              </main>

              <footer className={styles.wrapperFooter}>
                <div className="container">
                  <Footer />
                </div>
              </footer>
            </div>
          </StyledComponentsRegistry>
        </WalletProvider>
      </body>

      <Script async src="https://platform.twitter.com/widgets.js" type="text/javascript" />
    </html>
  )
}
