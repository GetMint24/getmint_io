import prisma from "../../../utils/prismaClient";
import Joi from "joi";
import { BadRequest } from "../utils/errors";

interface CreateAccountDto {
    metamaskAddress: string;
}

const schema = Joi.object({
    metamaskAddress: Joi.string()
});

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