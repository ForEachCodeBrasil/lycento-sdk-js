export {
    DeviceInfo,
    LycentoClient,
    Platform,
    createClient,
    getDeviceId,
    getDeviceInfo,
    validateLicense,
} from './client';

export type {
    ActivateOptions,
    ActivateResponse,
    DeactivateOptions,
    DeactivateResponse,
    LicenseInfo,
    LycentoConfig,
    ValidateOptions,
    ValidateResponse,
} from './client';

export {
    ActivationError,
    DeactivationError,
    LycentoError,
    NetworkError,
    ValidationError,
} from './errors';
