const nextConfig = {
    env: {
        PINATA_GATEWAY_TOKEN: process.env.PINATA_GATEWAY_TOKEN,
        PINATA_GATEWAY: process.env.PINATA_GATEWAY,
        APP_URL: process.env.APP_URL,
        TWITTER_CLIENT_ID: process.env.TWITTER_CLIENT_ID,
        TWITTER_CLIENT_SECRET: process.env.TWITTER_CLIENT_SECRET,
        TWITTER_CODE_CHALLENGE: process.env.TWITTER_CODE_CHALLENGE,
    }
}

module.exports = nextConfig
