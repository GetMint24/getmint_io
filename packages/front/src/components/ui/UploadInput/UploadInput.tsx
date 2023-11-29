import Image from "next/image";
import { ChangeEvent, InputHTMLAttributes, useState } from "react";

import styles from './UploadInput.module.css';

interface UploadInputProps extends InputHTMLAttributes<HTMLInputElement> {
    onUpload?: (file: File) => void;
}

export default function UploadInput({ onUpload, ...props }: UploadInputProps) {
    const [selected, setSelected] = useState<string>('');

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        if (!event.target.files) {
            return;
        }

        if (props.onChange) {
            props?.onChange(event);
        }

        const file = event.target.files[0];

        if (onUpload) {
            onUpload(file);
        }

        setSelected(file.name);
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