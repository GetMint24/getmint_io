import { NextRequest } from "next/server";
import axios from "axios";

import { MintDto } from "../../../common/MintDto";

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');

    const data = {
        id: id ?? 1,
        name: 'Fox Geometric',
        description: 'Description Description Description',
        imageHash: 'QmdUqFGTunepKfuG9QSTATgP84ox3bSxi7RS3PzosStB1t'
    } as MintDto;

    return Response.json(data);
}

export async function POST(request: Request) {
    try {
        const formData = await request.formData();

        const name: string = formData.get('name') as unknown as string;
        const description: string | null = formData.get('description') as unknown as string | null;
        const image: File = formData.get('image') as unknown as File;

        const pinataFormData = new FormData();
        pinataFormData.append('file', image);
        pinataFormData.append('pinataMetadata', JSON.stringify({
            name,
            keyvalues: { description }
        }));

        const response = await axios.post("https://api.pinata.cloud/pinning/pinFileToIPFS", pinataFormData, {
            headers: {
                Authorization: `Bearer ${process.env.PINATA_JWT}`,
            },
        });

        const { IpfsHash } = response.data;

        return Response.json({
            id: 1,
            name: 'Fox Geometric',
            description: 'Description Description Description',
            imageHash: IpfsHash
        });
    } catch (e) {
        console.error(e);
        return Response.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}