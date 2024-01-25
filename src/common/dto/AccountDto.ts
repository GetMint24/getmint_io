import { OAuth2UserOptions } from "twitter-api-sdk/dist/OAuth2User";
import { TwitterUser } from "../types";

export interface AccountDto {
    id: string,
    refferer: string | null;
    balance: {
        refferals: number;
        refferalsMintCount: number;
        mintsCount: number;
        mints: number;
        bridgesCount: number;
        bridges: number;
        twitterActivity: number;
        total: number;
    },
    twitter: {
        followed: boolean;
        connected: boolean;
        token: OAuth2UserOptions['token'];
        user?: TwitterUser;
    },
    refferals: {
        count: number;
        mintsCount: number;
        claimAmount: number;
    }
}