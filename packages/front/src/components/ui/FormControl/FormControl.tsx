import clsx from "clsx";
import styles from './FormControl.module.css';

export default function FormControl({ title, children, extra, optional, className }) {
    return (
        <div className={clsx(styles.control, className)}>
            <label>
                <div className={styles.header}>
                    <div className={styles.title}>
                        {title} {optional && <span className={styles.optional}>(Optional)</span>}
                    </div>
                    {extra && <p className={styles.extra}>{extra}</p>}
                </div>

                {children}
            </label>
        </div>
    );
}