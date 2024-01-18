import Image from "next/image";
import { ChangeEvent, InputHTMLAttributes, useEffect, useState } from "react";

import styles from './UploadInput.module.css';
import { Tooltip } from "antd";

interface UploadInputProps extends InputHTMLAttributes<HTMLInputElement> {
    file?: File | null;
    onUpload?: (file: File) => void;
}

export default function UploadInput({ file, onUpload, ...props }: UploadInputProps) {
    const [selected, setSelected] = useState<string>('');
    const [preview, setPreview] = useState<string>();

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        if (!event.target.files) {
            return;
        }

        if (props.onChange) {
            props?.onChange(event);
        }

        const file = event.target.files[0];
        const objectUrl = URL.createObjectURL(file);
        setPreview(objectUrl);

        if (onUpload) {
            onUpload(file);
        }

        setSelected(file.name);
    };

    useEffect(() => {
        if (file) {
            setPreview(URL.createObjectURL(file));
        }
    }, [file]);

    return (
        <Tooltip title={preview ? 'Click to upload' : ''}>
            <label className={styles.control}>
                <input {...props} onChange={handleChange} type="file" hidden />

                <div className={styles.inner}>
                    {preview ? (
                        <img className={styles.preview} src={preview} alt="" />
                    ) : (
                        <div className={styles.imageWrapper}>
                            <Image className={styles.image} src="/svg/upload-picture.svg" width={24} height={24} alt="" />
                            <Image className={styles.dropImage} src="/svg/upload-drop.svg" width={24} height={24} alt="" />
                        </div>
                    )}

                    {!preview && <p>{selected ? selected : 'Click to upload'}</p>}
                </div>
            </label>
        </Tooltip>
    )
}