import axios from "axios";
import AppStore from "../store/AppStore";
import { decodeAddress } from "../core/contractController";

export const apiClient = axios.create({
    baseURL: '/api/'
});

apiClient.interceptors.request.use(config => {
    config.headers['X-Metamask-Address'] = AppStore.metamaskWalletAddress;
    config.headers['X-Twitter-Token'] = JSON.stringify(AppStore.account?.twitter.token);

    const refCode = localStorage.getItem('refCode');
    if (refCode) {
        config.headers['X-Refferer-Address'] = decodeAddress(refCode);
    }

    // config.headers['Cache-Control'] = 'no-store';
    return config;
});