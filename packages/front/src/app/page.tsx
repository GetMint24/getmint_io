import styles from './page.module.css'
import Header from "../components/layout/Header/Header";
import Footer from "../components/layout/Footer/Footer";

export default function Home() {
    return (
        <>
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
                        Content
                    </div>
                </main>

                <footer className={styles.wrapperFooter}>
                    <div className="container">
                        <Footer />
                    </div>
                </footer>
            </div>
        </>
    )
}
