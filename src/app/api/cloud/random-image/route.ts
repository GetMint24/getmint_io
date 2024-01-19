import { revalidatePath } from "next/cache";
import cloudClient from "../../../../utils/cloudClient";
import { InternalError } from "../../utils/responses";

export async function GET() {
    try {
        revalidatePath('/api/cloud/random-image');
        const response = await cloudClient.getRandomImage();
        return Response.json(response);
    } catch (e) {
        return new InternalError(e);
    }
}