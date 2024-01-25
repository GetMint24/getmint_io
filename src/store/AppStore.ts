import { makeAutoObservable } from "mobx";
import { enableStaticRendering } from "mobx-react-lite";
import { AccountDto } from "../common/dto/AccountDto";
import ApiService from "../services/ApiService";
import { CreateTweetDto } from "../common/dto/CreateTweetDto";
import NftStore from "./NftStore";
import { notification } from "antd";
import { decodeAddress } from "../core/contractController";

enableStaticRendering(typeof window === 'undefined');

class AppStore {
    account: AccountDto | null = null;
    walletConnected = false;
    accountDrawerOpened = false;
    metamaskWalletAddress: string | undefined;
    referrerAddress: string = '';
    loading = false;

    constructor() {
        makeAutoObservable(this, undefined, { autoBind: true });
    }

    clearAccount() {
        this.account = null;
    }

    async fetchAccount() {
        this.account = await ApiService.getAccount();
    }

    setWalletConnected(isConnected: boolean) {
        this.walletConnected = isConnected;

        if (!isConnected) {
            this.metamaskWalletAddress = undefined;
        }
    }

    setWalletAddress(address: string) {
        this.metamaskWalletAddress = address;
    }

    openAccountDrawer() {
        this.accountDrawerOpened = true;
    }

    closeAccountDrawer() {
        this.accountDrawerOpened = false;
    }

    async disconnectTwitter() {
        this.loading = true;
        const { status } = await ApiService.disconnectTwitter();

        if (status === 'ok') {
            await this.fetchAccount();
        }

        this.loading = false;

        return status;
    }

    async createTweet(data: CreateTweetDto) {
        this.loading = true;

        try {
            const { status } = await ApiService.createTweet(data);

            if (status === 'ok') {
                await NftStore.getNfts();
            }
        } catch (e) {
            console.error(e);
            notification.warning({
                message: 'The tweet may have already been created',
                duration: 10000
            })
        } finally {
            this.loading = false;
        }
    }

    async clearTwitter(userId: string) {
        this.loading = true;

        try {
            const { status } = await ApiService.clearTwitter(userId);
            return status;
        } catch (e) {
            console.error(e);
        } finally {
            await this.fetchAccount();
            this.loading = false;
        }
    }

    async followTwitter(userId: string) {
        try {
            await ApiService.followTwitter(userId);
        } catch (e) {
            console.error(e);
        }
    }

    setReffererAddress(refCode: string) {
        try {
            this.referrerAddress = decodeAddress(refCode);
            localStorage.setItem('refCode', refCode);
        } catch (e) {
            console.error(e);
        }
    }

}
export default new AppStore();