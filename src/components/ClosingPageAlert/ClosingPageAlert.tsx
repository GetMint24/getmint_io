import { Popover } from 'antd'
import styles from './ClosingPageAlert.module.css'
import { useEffect } from 'react';

export default function ClosingPageAlert() {
    useEffect(() => {
        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            e.preventDefault();
            e.returnValue = '';
        };
    
        window.addEventListener('beforeunload', handleBeforeUnload);
    
        return () => {
          window.removeEventListener('beforeunload', handleBeforeUnload);
        };
      }, []);

  return (
    <Popover 
        overlayClassName={styles.popover} 
        placement='bottom' 
        title='Please do not reload or close page during the loading.'
        open
    />
  )
}
