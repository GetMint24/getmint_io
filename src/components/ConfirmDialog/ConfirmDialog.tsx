import { Flex } from "antd";
import UiModal from "../ui/Modal/Modal";
import Button from "../ui/Button/Button";

import styles from "./ConfirmDialog.module.css";

interface Props {
    open: boolean;
    title: string;
    description?: string;
    onConfirm?(): void;
    onCancel?(): void;
}

export default function ConfirmDialog({ open, title, description, onCancel, onConfirm }: Props) {
    return (
        <UiModal
            open={open}
            title={title}
            hideCloseIcon={true}
            maskClosable={false}
            onClose={onCancel}
            width={400}
        >
            <div className={styles.description}>{description}</div>
            <Flex gap={8} className={styles.actions}>
                <Button rounded onClick={onCancel}>Cancel</Button>
                <Button onClick={onConfirm}>Confirm</Button>
            </Flex>
        </UiModal>
    );
}