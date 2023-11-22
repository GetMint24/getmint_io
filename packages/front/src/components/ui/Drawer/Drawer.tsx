import { ReactNode } from "react";
import { Drawer } from "antd";

import styles from './Drawer.module.css';

interface DrawerProps {
    isOpen: boolean;
    children: ReactNode;
    onClose: () => void;
}

export default function UiDrawer({ isOpen, children, onClose }: DrawerProps) {
    return (
        <Drawer closeIcon={false} className={styles.drawer} open={isOpen} placement="right" onClose={onClose}>
            {children}
        </Drawer>
    )
}