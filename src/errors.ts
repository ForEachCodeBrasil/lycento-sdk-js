export class LycentoError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'LycentoError';
    }
}

export class ActivationError extends LycentoError {
    constructor(message: string) {
        super(message);
        this.name = 'ActivationError';
    }
}

export class ValidationError extends LycentoError {
    constructor(message: string) {
        super(message);
        this.name = 'ValidationError';
    }
}

export class DeactivationError extends LycentoError {
    constructor(message: string) {
        super(message);
        this.name = 'DeactivationError';
    }
}

export class NetworkError extends LycentoError {
    constructor(message: string) {
        super(message);
        this.name = 'NetworkError';
    }
}
