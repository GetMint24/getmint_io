import { BalanceLogType } from "../../../../common/enums/BalanceLogType";
import { BalanceOperation } from "../../../../common/enums/BalanceOperation";
import { BalanceOperationCost } from "../../../../common/enums/BalanceOperationCost";
import prisma from "../../../../utils/prismaClient";

export async function POST(request: Request) {
    const { userId } = await request.json();

    if (userId) {
        await prisma.$transaction(async (context) => {
            await context.balanceLog.create({
                data: {
                    userId,
                    operation: BalanceOperation.Debit,
                    description: 'Начисление за подписку на аккаунт Getmint',
                    type: BalanceLogType.TwitterGetmintSubscription,
                    amount: BalanceOperationCost.TwitterGetmintSubscription,
                }
            });

            await context.user.update({
                where: { id: userId },
                data: {
                    followedGetmintTwitter: true,
                },
            });
        });

        return Response.json({ status: 'ok' });
    }

    return Response.json({ status: 'failed' });
}