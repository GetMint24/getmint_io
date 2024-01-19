import cloudClient from "../../../../utils/cloudClient";
import { BadRequest, InternalError } from "../../utils/responses";

export async function POST(request: Request) {
    const { key } = await request.json();

    if (!key) {
        return new BadRequest('Missing file key parameter');
    }

    try {
        const deleted = await cloudClient.deleteFile(key);

        return Response.json({ status: deleted ? 'ok' : 'failed' });
    } catch (e) {
        return new InternalError(e);
    }
}