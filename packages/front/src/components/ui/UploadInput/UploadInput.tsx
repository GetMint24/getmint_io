import Image from "next/image";
import { ChangeEvent, useState } from "react";

import styles from './UploadInput.module.css';

export default function UploadInput({ ...props }) {
    const [selected, setSelected] = useState<string>('');

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        if (!event.target.files) {
            return;
        }

        props?.onChange(event);
        setSelected(event.target.files[0].name);
    }

    return (
        <label className={styles.control}>
            <input {...props} onChange={handleChange} type="file" hidden />

            <div className={styles.inner}>
                <div className={styles.imageWrapper}>
                    <Image className={styles.image} src="/svg/upload-picture.svg" width={24} height={24} alt="" />
                    <Image className={styles.dropImage} src="/svg/upload-drop.svg" width={24} height={24} alt="" />
                </div>
                <p>{selected ? selected : 'Drag and Drop or click to upload'}</p>
            </div>
        </label>
    )
}