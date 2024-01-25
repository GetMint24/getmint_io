export class BadRequest extends Response {
    constructor(message: string, detail?: unknown) {
        const data: {
            message: string;
            error?: unknown;
        } = { message };

        if (detail) {
            data['error'] = detail;
        }

        super(JSON.stringify(data), {
            status: 400,
            headers: {
                'content-type': 'application/json'
            }
        });
    }
}

export class InternalError extends Response {
    constructor(error: unknown) {
        super(JSON.stringify({
            message: 'Internal Server Error',
            error
        }), {
            status: 500,
            headers: {
                'content-type': 'application/json'
            }
        });
    }
}

export class NotFoundError extends Response {
    constructor(message: string) {
        super(JSON.stringify({
            message
        }), { status: 404, headers: {
            'Content-Type': 'application/json'
        } });
    }
}

export class OkResponse extends Response {
    constructor() {
        super('', {
            status: 200,
            headers: {
                'content-type': 'application/json'
            }
        });
    }
}