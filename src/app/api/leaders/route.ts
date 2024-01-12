import { LeaderDto } from "../../../common/dto/LeaderDto";
import { BalanceLogType } from "../../../common/enums/BalanceLogType";
import prisma from "../../../utils/prismaClient";

export async function GET(request: Request) {
    const leadersLogs = await prisma.balanceLog.groupBy({
        by: ['userId'],
        orderBy: { _sum: { amount: 'desc' } },
        _sum: { amount: true },
        take: 100,
    });
    const leadersIds = leadersLogs.map((log) => log.userId);
    const leadersLogsByType = await prisma.balanceLog.groupBy({
        by: ['userId', 'type'],
        where: { userId: { in: leadersIds } },
        _count: { amount: true }
    });
    const leaders = await prisma.user.findMany({ where: { id: { in: leadersIds } } });

    const result: LeaderDto[] = leadersLogs.map((leaderLog) => {
        const mintCount = leadersLogsByType.find((log) => log.userId === leaderLog.userId && log.type === BalanceLogType.Mint)?._count.amount || 0;
        const bridgeCount = leadersLogsByType.find((log) => log.userId === leaderLog.userId && log.type === BalanceLogType.Bridge)?._count.amount || 0;
        const leader = leaders.find((user) => user.id === leaderLog.userId);

        return {
            id: leaderLog.userId,
            login: leader!.twitterLogin || `${leader!.metamaskWalletAddress.slice(0, 6)}...${leader!.metamaskWalletAddress.slice(-5)}`,
            avatar: leader!.avatar || undefined,
            mintCount,
            bridgeCount,
            total: leaderLog._sum.amount || 0,
        };
    });

    return Response.json(result);
}