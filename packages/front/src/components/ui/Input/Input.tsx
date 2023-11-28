import styles from './Input.module.css';

export default function Input({ action, ...props }) {
    return (
        <div className={styles.inputWrapper}>
            <input type="text" {...props} className={styles.input} />
            {action && <div className={styles.action}>{action}</div>}
        </div>
    )
}