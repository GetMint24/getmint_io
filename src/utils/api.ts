import axios from "axios";
import AppStore from "../store/AppStore";

export const apiClient = axios.create({
    baseURL: '/api/'
});

apiClient.interceptors.request.use(config => {
    config.headers['X-Metamask-Address'] = AppStore.metamaskWalletAddress;
    config.headers['X-Twitter-Token'] = JSON.stringify(AppStore.account?.twitter.token);
    // config.headers['Cache-Control'] = 'no-store';
    return config;
});