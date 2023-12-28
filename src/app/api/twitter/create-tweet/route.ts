import { BalanceLogType } from "../../../../common/enums/BalanceLogType";
import { BalanceOperation } from "../../../../common/enums/BalanceOperation";
import { BalanceOperationCost } from "../../../../common/enums/BalanceOperationCost";
import prisma from "../../../../utils/prismaClient";
import { twitterApi } from "../../../../utils/twitterApi";

export async function POST(request: Request) {
    const token = request.headers.get('X-Twitter-Token');
    const data = await request.json();

    if (token && data.userId && data.nftId) {
        twitterApi.setToken(JSON.parse(token));

        const tokenResponse = await twitterApi.checkAndRefreshToken();

        if (tokenResponse) {
            await prisma.user.update({ where: { id: data.userId }, data: { twitterToken: JSON.stringify(tokenResponse.token) } });
        }

        const response = await twitterApi.createTweet(data.nftId);

        if (response.data)  {
            await prisma.$transaction(async (context) => {
                const balanceLog = await context.balanceLog.create({
                    data: {
                        userId: data.userId,
                        operation: BalanceOperation.Debit,
                        description: 'Начисление за Tweet',
                        type: BalanceLogType.CreateTweet,
                        amount: BalanceOperationCost.Tweet,
                    },
                });

                await context.tweetLog.create({
                    data: {
                        balanceLogId: balanceLog.id,
                        nftId: data.nftId,
                        tweetId: response.data!.id,
                    },
                });
            });
            
            return Response.json({ status: 'ok' });
        }

        return Response.json({ status: 'failed', errors: response.errors });
    }

    return Response.json({ status: 'failed' });
}