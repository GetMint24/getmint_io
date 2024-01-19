import { LeaderDto } from "../../../common/dto/LeaderDto";
import { BalanceLogType } from "../../../common/enums/BalanceLogType";
import { BalanceOperation } from "../../../common/enums/BalanceOperation";
import prisma from "../../../utils/prismaClient";

export async function GET(request: Request) {
    const leadersLogs = await prisma.balanceLog.groupBy({
        by: ['userId'],
        where: { 
            operation: BalanceOperation.Debit,
            userId : { not: '75deaeb6-d01f-4997-b7b0-348cde511ced' }
        },
        orderBy: { _sum: { amount: 'desc' } },
        _sum: { amount: true },
        take: 100,
    });
    const leadersIds = leadersLogs.map((log) => log.userId);
    const leadersLogsByType = await prisma.balanceLog.groupBy({
        by: ['userId', 'type'],
        where: { userId: { in: leadersIds }, operation: BalanceOperation.Debit },
        _count: { amount: true }
    });
    const leaders = await prisma.user.findMany({ where: { id: { in: leadersIds } } });

    const result: LeaderDto[] = leadersLogs.map((log, index) => {
        const leader = leaders.find((leader) => log.userId === leader.id);
        const mintCount = leadersLogsByType.find((log) => log.userId === leader!.id && log.type === BalanceLogType.Mint)?._count.amount || 0;
        const bridgeCount = leadersLogsByType.find((log) => log.userId === leader!.id && log.type === BalanceLogType.Bridge)?._count.amount || 0;

        return {
            id: leader!.id,
            login: leader?.twitterLogin || `${leader!.metamaskWalletAddress.slice(0, 1)}х${leader!.metamaskWalletAddress.slice(2, 6)}...${leader!.metamaskWalletAddress.slice(-5)}`,
            avatar: leader?.avatar || undefined,
            position: index + 1,
            mintCount,
            bridgeCount,
            total: log._sum.amount || 0,
        };
    });

    if (leaders.length < 100) {
        const usersWithoutXp = await prisma.user.findMany({ where: { id: { notIn: leadersIds } }, take: 100 - leaders.length });
        usersWithoutXp.forEach((user) => {
            result.push({
                id: user.id,
                login: user.twitterLogin || `${user.metamaskWalletAddress.slice(0, 1)}х${user.metamaskWalletAddress.slice(2, 6)}...${user.metamaskWalletAddress.slice(-5)}`,
                avatar: user.avatar || undefined,
                position: result.length + 1,
                mintCount: 0,
                bridgeCount: 0,
                total: 0,
            });
        });
    }

    return Response.json(result);
}