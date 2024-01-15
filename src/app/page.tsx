"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Page from "./mint/page";
import ConfirmDialog from "../components/ConfirmDialog/ConfirmDialog";
import AppStore from "../store/AppStore";

export default function Home() {
    const [showConfirm, setShowConfirm] = useState(false);
    const params = useSearchParams();
    const { clearTwitter } = AppStore;
    const router = useRouter();

    const handleClear = async (id: string) => {
        const status = await clearTwitter(id);
        if (status === 'ok') {
            router.replace('/');
        }
    }

    const handleCancel = async () => {
        setShowConfirm(false);
        const id = params.get('newUserId');
        if (id) {
            handleClear(id);
        }
    };

    const handleConfirm = async () => {
        setShowConfirm(false);
        const id = params.get('oldUserId');
        if (id) {
            handleClear(id);
        }
    };

    useEffect(() => {
        const oldUserId = params.get('oldUserId');
        const newUserId = params.get('newUserId');

        if (oldUserId && newUserId) {
            setShowConfirm(true);
        }
    }, [params]);

    return (
        <>
            <Page />
            <ConfirmDialog
                open={showConfirm}
                title="Twitter account"
                description="Twitter account has already connected to wallet on GetMint.io.
                If you connect account to this wallet, all your rewards 'Twitter activity' will be reset. 
                Are you sure?"
                onCancel={handleCancel}
                onConfirm={handleConfirm}
            />
        </>
    );
}
