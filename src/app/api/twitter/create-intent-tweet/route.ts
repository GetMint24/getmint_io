import { BalanceLogType } from "../../../../common/enums/BalanceLogType";
import { BalanceOperation } from "../../../../common/enums/BalanceOperation";
import { BalanceOperationCost } from "../../../../common/enums/BalanceOperationCost";
import prisma from "../../../../utils/prismaClient";
import {v4 as uuidv4} from "uuid";

export async function POST(request: Request) {
    const data = await request.json();

    if (data) {
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
                        tweetId: uuidv4()
                    },
                });
        });

        return Response.json({ status: 'ok' });
    }

    return Response.json({ status: 'failed' });
}