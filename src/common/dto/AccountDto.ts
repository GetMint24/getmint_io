import { OAuth2UserOptions } from "twitter-api-sdk/dist/OAuth2User";
import { TwitterUser } from "../types";

export interface AccountDto {
    id: string,
    balance: {
        refferalsCount: number;
        refferals: number;
        mintsCount: number;
        mints: number;
        bridgesCount: number;
        bridges: number;
        twitterActivity: number;
        total: number;
    },
    twitter: {
        connected: boolean;
        token: OAuth2UserOptions['token'];
        user?: TwitterUser;
    },
}