import { BalanceLogType } from "../../../../common/enums/BalanceLogType";
import { BalanceOperation } from "../../../../common/enums/BalanceOperation";
import { BalanceOperationCost } from "../../../../common/enums/BalanceOperationCost";
import prisma from "../../../../utils/prismaClient";
import { twitterApi } from "../../../../utils/twitterApi";

export async function GET(request: Request) {
    const params = new URL(request.url).searchParams;
    const state = params.get('state');
    const code = params.get('code');
    const error = params.get('error');
    const redirectUrl = new URL(process.env.APP_URL);

    if (error || !code || !state) return Response.error();

    try {
        const { token } = await twitterApi.requestToken(code as string);
        const [userId, nftId] = state.split(':');
        const { data: twitterUser } = await twitterApi.findMyUser();
        const userWithLogin = await prisma.user.findFirst({ where: { twitterLogin: twitterUser?.username } });

        if (userWithLogin && userId !== userWithLogin.id) {
            redirectUrl.searchParams.set('oldUserId', userWithLogin.id);
            redirectUrl.searchParams.set('newUserId', userId);
        }

        await prisma.user.update({
            data: {
                twitterEnabled: true,
                twitterLogin: twitterUser?.username,
                twitterToken: JSON.stringify(token),
                avatar: twitterUser?.profile_image_url,
            },
            where: { id: userId }
        });

        if (nftId) {
            const response = await twitterApi.createTweet(nftId);
            // TODO: return when can use nfts in minted page
            // const nft = await prisma.nft.findFirst({ where: { id: nftId } });

            if (response.data) {
                await prisma.$transaction(async (context) => {
                    const balanceLog = await context.balanceLog.create({
                        data: {
                            userId,
                            operation: BalanceOperation.Debit,
                            description: 'Начисление за Tweet',
                            type: BalanceLogType.CreateTweet,
                            amount: BalanceOperationCost.Tweet,
                        },
                    });

                    await context.tweetLog.create({
                        data: {
                            balanceLogId: balanceLog.id,
                            nftId,
                            tweetId: response.data!.id,
                        },
                    });
                });

                redirectUrl.searchParams.set('tweeted', 'true');
            }
        }
    } catch (e) {
        console.log(e);
    }

    return Response.redirect(redirectUrl);
}