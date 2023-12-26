import prisma from "../../../../utils/prismaClient";
import { twitterApi } from "../../../../utils/twitterApi";

export async function POST(request: Request) {
    const metamaskWalletAddress = request.headers.get('X-Metamask-Address');
    const token = request.headers.get('X-Twitter-Token');
    
    if (metamaskWalletAddress && token) {
        twitterApi.setToken(JSON.parse(token));
        const { revoked } = await twitterApi.revokeToken();

        if (revoked) {
            await prisma.user.update({
                data: { twitterEnabled: false, twitterLogin: null, avatar: null, twitterToken: undefined },
                where: { metamaskWalletAddress },
            });
        
            return Response.json({ status: 'ok' });
        }
    }

    return Response.json({ status: 'failed' });
}