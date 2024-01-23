import Joi from "joi";
import { OAuth2UserOptions } from "twitter-api-sdk/dist/OAuth2User";
import prisma from "../../../utils/prismaClient";

import { BadRequest } from "../utils/responses";
import { AccountDto } from "../../../common/dto/AccountDto";
import { BalanceLogType } from "../../../common/enums/BalanceLogType";
import { BalanceOperation } from "../../../common/enums/BalanceOperation";
import { TwitterUser } from "../../../common/types";

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
        const reffererAddress = request.headers.get('X-Refferer-Address') ?? '';

        let reffererId;
        let reffererMetamaskAddress;

        const isSameAddress = metamaskWalletAddress.toLowerCase() === reffererAddress.toLowerCase();

        if (reffererAddress && !isSameAddress) {
            const reffererUser = await prisma.user.findFirst({
                where: {
                    metamaskWalletAddress: {
                        contains: reffererAddress,
                        mode: 'insensitive'
                    }
                }
            });

            if (reffererUser) {
                reffererId = reffererUser.id;
                reffererMetamaskAddress = reffererUser.metamaskWalletAddress;
            }
        }

        user = await prisma.user.create({
            data: {
                metamaskWalletAddress,
                reffererId,
                reffererAddress: reffererMetamaskAddress
            },
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

    const aggregateByType = (type: BalanceLogType, userId: string) => {
        return prisma.balanceLog.aggregate({
            where: {
                userId: userId,
                type,
                operation: BalanceOperation.Debit
            },
            _sum: { amount: true },
            _count: { amount: true }
        });
    };

    const mints = await aggregateByType(BalanceLogType.Mint, user.id!);
    const bridges = await aggregateByType(BalanceLogType.Bridge, user.id!);
    const twitterActivityDaily = await aggregateByType(BalanceLogType.TwitterActivityDaily, user.id!);
    const twitterGetmintSubscription = await aggregateByType(BalanceLogType.TwitterGetmintSubscription, user.id!);
    const tweets = await aggregateByType(BalanceLogType.CreateTweet, user.id!);

    const refferalMints = await prisma.balanceLog.aggregate({
        where: {
            userId: {
                in: await prisma.user.findMany({
                    where: { reffererId: user.id },
                    select: { id: true }
                }).then(response => response.map(r => r.id))
            },
            type: BalanceLogType.Mint,
            operation: BalanceOperation.Debit
        },
        _sum: { amount: true },
        _count: { amount: true }
    });

    const refferalsCount = await prisma.user.count({
        where: { reffererId: user.id },
    });

    const accountDto: AccountDto = {
        id: user.id,
        refferer: user.reffererAddress,
        balance: {
            total: total._sum.amount || 0,
            mints: mints._sum.amount || 0,
            mintsCount: mints._count.amount,
            bridges: bridges._sum.amount || 0,
            bridgesCount: bridges._count.amount,
            twitterActivity: (twitterActivityDaily._sum.amount || 0) + (twitterGetmintSubscription._sum.amount || 0) + (tweets._sum.amount || 0),
            refferals: refferalMints._sum.amount || 0,
            refferalsMintCount: refferalMints._count.amount || 0,
        },
        twitter: {
            connected: user.twitterEnabled,
            followed: !!twitterGetmintSubscription._count.amount && user.followedGetmintTwitter,
            token,
            user: twitterUser,
        },
        refferals: {
            count: refferalsCount,
            mintsCount: refferalMints._count.amount,
            claimAmount: 0
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