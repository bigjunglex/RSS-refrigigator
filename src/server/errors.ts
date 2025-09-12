export abstract class BaseError extends Error {
    abstract readonly errKey: string;
}

export class NotFoundError extends BaseError {
    errKey = 'notfound' as const
    constructor(message:string){
        super(message)
    }
}

export class ValidateError extends BaseError {
    errKey = 'validate' as const
    constructor(message:string){
        super(message)
    }
}

export class ForbidenError extends BaseError {
    errKey = 'forbidden' as const
    constructor(message:string){
        super(message)
    }
}

export class UnathorizedError extends BaseError {
    errKey = 'unathorize' as const
    constructor(message:string){
        super(message)
    }
}

export class InternalError extends BaseError {
    errKey = 'internal' as const
    constructor(message:string){
        super(message)
    }
}

type ErrMessages = {
    [key: string]: [string, number];
}

export const ERR_MESSAGES:ErrMessages = {
    notfound: ['Not Found', 404],
    forbidden: ['Forbiden', 403],
    unathorize: ['Unathorized', 401],
    internal: ['Internal Server Error', 500]
}

export const ERRORS = [
    UnathorizedError,
    NotFoundError,
    ForbidenError,
    ValidateError,
]