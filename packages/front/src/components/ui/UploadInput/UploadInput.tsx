import Image from "next/image";

import styles from './UploadInput.module.css';

export default function UploadInput({ ...props }) {
    return (
        <label className={styles.control}>
            <input {...props} type="file" hidden />

            <div className={styles.inner}>
                <div className={styles.imageWrapper}>
                    <Image className={styles.image} src="/svg/upload-picture.svg" width={24} height={24} alt="" />
                    <Image className={styles.dropImage} src="/svg/upload-drop.svg" width={24} height={24} alt="" />
                </div>
                <p>Drag and Drop or click to upload</p>
            </div>
        </label>
    )
}