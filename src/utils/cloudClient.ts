import { DeleteObjectCommand, GetObjectCommand, ListObjectsV2Command, S3Client } from '@aws-sdk/client-s3';
import { generateIntNumber } from './generators';
import { RandomImageDto } from '../common/dto/RandomImageDto';

class CloudClient {
    client: S3Client;

    constructor () {
        this.client = new S3Client({
            endpoint: process.env.S3_ENDPOINT,
            forcePathStyle: false,
            region: process.env.S3_REGION,
            credentials: {
                accessKeyId: process.env.S3_ACCESS_KEY,
                secretAccessKey: process.env.S3_SECRET_KEY,
            },
        });
    }

    async getRandomImage(): Promise<RandomImageDto> {
        const { Contents } = await this.client.send(new ListObjectsV2Command({
            Bucket: 'getmint',
            StartAfter: 'Images/',
        }));

        if (!Contents?.length) {
            throw new Error('Can\'t get files list');
        }

        const randomObject = Contents[generateIntNumber(Contents.length)];

        if (!randomObject.Key) {
            throw new Error('Can\'t get file key');
        }

        const { Body, ContentType } = await this.client.send(new GetObjectCommand({
            Bucket: 'getmint',
            Key: randomObject.Key,
        }));

        if (!Body) {
            throw new Error('Can\'t get file');
        }

        const blob = await Body.transformToByteArray();

        return {
            key: randomObject.Key,
            type: ContentType,
            blob,
        };
    }

    async deleteFile(key: string) {
        const response = await this.client.send(new DeleteObjectCommand({
            Bucket: 'getmint',
            Key: key,
        }));

        return response.DeleteMarker;
    }
}

export default new CloudClient();