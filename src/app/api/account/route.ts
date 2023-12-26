import prisma from "../../../utils/prismaClient";
import Joi from "joi";
import { BadRequest } from "../utils/responses";
import { AccountDto } from "../../../common/dto/AccountDto";
import { BalanceLogType } from "../../../common/enums/BalanceLogType";
import { BalanceOperation } from "../../../common/enums/BalanceOperation";
import { TwitterUser } from "../../../common/types";
import { OAuth2UserOptions } from "twitter-api-sdk/dist/OAuth2User";

interface CreateAccountDto {
    metamaskAddress: string;
}

const schema = Joi.object({
    metamaskAddress: Joi.string()
});

export async function GET(request: Request) {
    const metamaskWalletAddress = request.headers.get('X-Metamask-Address');
    let twitterUser: TwitterUser | undefined;
    let token: OAuth2UserOptions['token'];

    if (!metamaskWalletAddress) {
        return new BadRequest('Metamask account not provided');
    }

    let user = await prisma.user.findFirst({
        where: { metamaskWalletAddress }
    });

    if (!user) {
        user = await prisma.user.create({
            data: {
                metamaskWalletAddress
            }
        });
    }

    if (user.twitterEnabled && user.twitterLogin) {
        twitterUser = {
            username: user.twitterLogin,
            avatar: user.avatar || undefined,
        };
    }

    if (user.twitterToken) {
        token = JSON.parse(user.twitterToken.toString());
    }

    const total = await prisma.balanceLog.aggregate({
        where: { userId: user.id },
        _sum: { amount: true }
    });

    const aggregateByType = (type: BalanceLogType) => {
        return prisma.balanceLog.aggregate({
            where: {
                userId: user!.id,
                type,
                operation: BalanceOperation.Debit
            },
            _sum: { amount: true },
            _count: { amount: true }
        });
    };

    const mints = await aggregateByType(BalanceLogType.Mint);
    const bridges = await aggregateByType(BalanceLogType.Bridge);
    const refferals = await aggregateByType(BalanceLogType.Refferal);
    const twitterActivityDaily = await aggregateByType(BalanceLogType.TwitterActivityDaily);
    const twitterGetmintSubscription = await aggregateByType(BalanceLogType.TwitterGetmintSubscription);
    const tweets = await aggregateByType(BalanceLogType.CreateTweet);

    const accountDto: AccountDto = {
        id: user.id,
        balance: {
            total: total._sum.amount || 0,
            mints: mints._sum.amount || 0,
            mintsCount: mints._count.amount,
            bridges: bridges._sum.amount || 0,
            bridgesCount: bridges._count.amount,
            twitterActivity: (twitterActivityDaily._sum.amount || 0) + (twitterGetmintSubscription._sum.amount || 0) + (tweets._sum.amount || 0),
            refferals: refferals._sum.amount || 0,
            refferalsCount: refferals._count.amount
        },
        twitter: {
            connected: user.twitterEnabled,
            token,
            user: twitterUser,
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