export class BadRequest extends Response {
    constructor(message: string, detail?: unknown) {
        const data = {
            message,
            error: detail ?? null
        };

        super(JSON.stringify(data), {
            status: 400,
            headers: {
                'content-type': 'application/json'
            }
        });
    }
}