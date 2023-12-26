declare namespace NodeJS {
    export interface ProcessEnv {
        readonly PINATA_JWT?: string;
        readonly PINATA_GATEWAY?: string;
        readonly PINATA_GATEWAY_TOKEN?: string;
        readonly TWITTER_CLIENT_ID: string;
        readonly TWITTER_CLIENT_SECRET: string;
        readonly TWITTER_CODE_CHALLENGE: string;
        readonly APP_URL: string;
        readonly DATABASE_URL: string;
    }
}