export type CryptoAddress = `0x${string}`;

export type AuthState = `${string}:${string}` | string;

export interface TwitterUser {
    username: string;
    avatar?: string;
}
