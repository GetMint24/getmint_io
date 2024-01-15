import { BalanceLogType } from "../../../../common/enums/BalanceLogType";
import prisma from "../../../../utils/prismaClient";

export async function POST(request: Request) {
    const { userId } = await request.json();
    const logTwitterTypes = [
        BalanceLogType.TwitterGetmintSubscription,
        BalanceLogType.TwitterActivityDaily,
        BalanceLogType.CreateTweet
    ];

    if (userId) {
        await prisma.$transaction(async (ctx) => {
            await ctx.user.update({
                data: {
                    twitterEnabled: false,
                    twitterLogin: null,
                    twitterToken: undefined,
                    followedGetmintTwitter: false,
                },
                where: { id: userId }
            });

            await ctx.balanceLog.deleteMany({ where: { userId, type: { in: logTwitterTypes } } });
        });

        return Response.json({ status: 'ok' });
    }

    return Response.json({ status: 'failed' });
}