import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import styles from "./layout.module.css";

import Header from "../components/layout/Header/Header";
import Footer from "../components/layout/Footer/Footer";
import WalletProvider from "./wallet-provider";

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'GetMint',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <WalletProvider>
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
        </WalletProvider>
      </body>
    </html>
  )
}
