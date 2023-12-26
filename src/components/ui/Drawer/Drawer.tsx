import { ReactNode } from "react";
import { Drawer } from "antd";

import styles from './Drawer.module.css';

interface DrawerProps {
    isOpen: boolean;
    children: ReactNode;
    placement?: 'left' | 'right' | 'top' | 'bottom';
    onClose: () => void;
}

export default function UiDrawer({ isOpen, children, onClose, placement }: DrawerProps) {
    return (
        <Drawer closeIcon={false} className={styles.drawer} open={isOpen} placement={placement ?? 'right'} onClose={onClose} contentWrapperStyle={{ width: 424 }}>
            {children}
        </Drawer>
    )
}