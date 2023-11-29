import prisma from "../../../utils/prismaClient";
import Joi from "joi";
import { BadRequest } from "../utils/responses";
import { AccountDto } from "../../../common/dto/AccountDto";
import { BalanceLogType } from "../../../common/enums/BalanceLogType";

interface CreateAccountDto {
    metamaskAddress: string;
}

const schema = Joi.object({
    metamaskAddress: Joi.string()
});

export async function GET(request: Request) {
    const metamaskWalletAddress = request.headers.get('X-Metamask-Address');

    if (!metamaskWalletAddress) {
        return new BadRequest('Metamask account not provided');
    }

    const total = await prisma.balanceLog.findFirst({
        orderBy: {
            createdAt: 'desc'
        }
    });

    const aggregateByType = (type: BalanceLogType) => {
        return prisma.balanceLog.aggregate({
            where: { type },
            _sum: { amount: true },
            _count: { amount: true }
        });
    };

    const mints = await aggregateByType(BalanceLogType.Mint);
    const bridges = await aggregateByType(BalanceLogType.Bridge);
    const refferals = await aggregateByType(BalanceLogType.Refferal);
    const twitterActivityDaily = await aggregateByType(BalanceLogType.TwitterActivityDaily);
    const twitterGetmintSubscription = await aggregateByType(BalanceLogType.TwitterGetmintSubscription);

    const accountDto: AccountDto = {
        balance: {
            total: total?.balance || 0,
            mints: mints._sum.amount || 0,
            mintsCount: mints._count.amount,
            bridges: bridges._sum.amount || 0,
            bridgesCount: bridges._count.amount,
            twitterActivity: (twitterActivityDaily._sum.amount || 0) + (twitterGetmintSubscription._sum.amount || 0),
            refferals: refferals._sum.amount || 0,
            refferalsCount: refferals._count.amount
        }
    };

    return Response.json(accountDto);
}

/**
 * Создание нового пользователя после привязки кошелька MetaMask
 */
export async function POST(request: Request) {
    const rawData: CreateAccountDto = await request.json();
    const { value: data, error } = schema.validate(rawData);

    if (error) {
        return new BadRequest('Invalid data', error?.details?.map(({ message }) => message));
    }

    const user = await prisma.user.findFirst({
        where: {
            metamaskWalletAddress: data.metamaskAddress
        }
    });

    if (!user) {
        const createdUser = await prisma.user.create({
            data: {
                metamaskWalletAddress: data.metamaskAddress
            }
        });

        return Response.json(createdUser);
    }

    return Response.json(user);
}