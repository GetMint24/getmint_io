import styles from './Input.module.css';

export default function Input({ ...props }) {
    return (
        <div>
            <input type="text" {...props} className={styles.input} />
        </div>
    )
}