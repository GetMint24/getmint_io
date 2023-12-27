"use client";

import { useMedia } from "use-media";

import styles from "./page.module.css";

export default function Page() {
    const isMobile = useMedia({ maxWidth: '768px' });

    return isMobile ? (
        <img src="/leaderbord-placeholder-small.png" className={styles.img} />
    ) : (
        <img src="/leaderbord-placeholder.png" className={styles.img} />
    )
}