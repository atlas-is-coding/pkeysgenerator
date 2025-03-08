export class InvalidPrivateKeyError extends Error {
    constructor(message: string = 'Invalid private key format') {
        super(message);
        this.name = 'InvalidPrivateKeyError';
    }
}

export class KeyGenerationError extends Error {
    constructor(message: string = 'Failed to generate private key') {
        super(message);
        this.name = 'KeyGenerationError';
    }
}

export class ValidationError extends Error {
    constructor(message: string = 'Failed to validate key pair') {
        super(message);
        this.name = 'ValidationError';
    }
}
