import type { AxiosError, AxiosInstance } from 'axios';
import axios from 'axios';
import { DeviceInfo, getDeviceId, getDeviceInfo, Platform } from './device';
import {
    ActivationError,
    DeactivationError,
    LycentoError,
    NetworkError,
    ValidationError,
} from './errors';

export interface LycentoConfig {
    baseUrl: string;
    apiKey?: string;
    timeout?: number;
}

export interface ActivateOptions {
    licenseKey: string;
    deviceId?: string;
    deviceName?: string;
    devicePlatform?: Platform;
    ipAddress?: string;
}

export interface ValidateOptions {
    licenseKey: string;
    deviceId?: string;
}

export interface DeactivateOptions {
    licenseKey: string;
    deviceId: string;
}

export interface ActivateResponse {
    success: boolean;
    license: {
        key: string;
        status: string;
        type: string;
        expiresAt: string | null;
        maxDevices: number;
    };
    activation: {
        id: number;
        deviceId: string;
        deviceName: string;
        devicePlatform: string;
        activatedAt: string;
    };
}

export interface ValidateResponse {
    valid: boolean;
    license: {
        key: string;
        status: string;
        type: string;
        expiresAt: string | null;
        maxDevices: number;
    };
    activation: {
        id: number;
        deviceId: string;
        deviceName: string;
        devicePlatform: string;
        lastValidatedAt: string;
    } | null;
}

export interface DeactivateResponse {
    success: boolean;
    message: string;
    activation: {
        id: number;
        deviceId: string;
        deactivatedAt: string;
    };
}

export interface LicenseInfo {
    license: {
        key: string;
        status: string;
        type: string;
        expiresAt: string | null;
        maxDevices: number;
        activeDevices: number;
    };
    activations: Array<{
        id: number;
        deviceId: string;
        deviceName: string;
        devicePlatform: string;
        activatedAt: string;
        deactivatedAt: string | null;
        isActive: boolean;
    }>;
}

export class LycentoClient {
    private client: AxiosInstance;

    constructor(config: LycentoConfig) {
        this.client = axios.create({
            baseURL: config.baseUrl.replace(/\/$/, ''),
            timeout: config.timeout ?? 10000,
            headers: {
                'Content-Type': 'application/json',
                ...(config.apiKey && {
                    Authorization: `Bearer ${config.apiKey}`,
                }),
            },
        });
    }

    /**
     * Activate a license on a device
     */
    async activate(options: ActivateOptions): Promise<ActivateResponse> {
        const deviceInfo = await getDeviceInfo();

        const payload = {
            license_key: options.licenseKey,
            device_id: options.deviceId ?? deviceInfo.deviceId,
            device_name: options.deviceName ?? deviceInfo.deviceName,
            device_platform: options.devicePlatform ?? deviceInfo.platform,
            ip_address: options.ipAddress,
        };

        try {
            const response = await this.client.post(
                '/api/v1/licenses/activate',
                payload,
            );
            return this.transformActivationResponse(response.data);
        } catch (error) {
            throw this.handleError(error, 'activation');
        }
    }

    /**
     * Validate a license
     */
    async validate(options: ValidateOptions): Promise<ValidateResponse> {
        const deviceId = options.deviceId ?? (await getDeviceInfo()).deviceId;

        const payload = {
            license_key: options.licenseKey,
            device_id: deviceId,
        };

        try {
            const response = await this.client.post(
                '/api/v1/licenses/validate',
                payload,
            );
            return this.transformValidationResponse(response.data);
        } catch (error) {
            throw this.handleError(error, 'validation');
        }
    }

    /**
     * Deactivate a license on a device
     */
    async deactivate(options: DeactivateOptions): Promise<DeactivateResponse> {
        const payload = {
            license_key: options.licenseKey,
            device_id: options.deviceId,
        };

        try {
            const response = await this.client.post(
                '/api/v1/licenses/deactivate',
                payload,
            );
            return {
                success: response.data.success,
                message: response.data.message,
                activation: {
                    id: response.data.activation.id,
                    deviceId: response.data.activation.device_id,
                    deactivatedAt: response.data.activation.deactivated_at,
                },
            };
        } catch (error) {
            throw this.handleError(error, 'deactivation');
        }
    }

    /**
     * Get license information
     */
    async getInfo(licenseKey: string): Promise<LicenseInfo> {
        try {
            const response = await this.client.get('/api/v1/licenses/info', {
                params: { license_key: licenseKey },
            });
            return this.transformLicenseInfoResponse(response.data);
        } catch (error) {
            throw this.handleError(error, 'info');
        }
    }

    /**
     * Quick check if license is valid (alias for validate)
     */
    async isValid(licenseKey: string, deviceId?: string): Promise<boolean> {
        try {
            const result = await this.validate({ licenseKey, deviceId });
            return result.valid;
        } catch {
            return false;
        }
    }

    private transformActivationResponse(data: any): ActivateResponse {
        return {
            success: data.success,
            license: {
                key: data.license.key,
                status: data.license.status,
                type: data.license.type,
                expiresAt: data.license.expires_at,
                maxDevices: data.license.max_devices,
            },
            activation: {
                id: data.activation.id,
                deviceId: data.activation.device_id,
                deviceName: data.activation.device_name,
                devicePlatform: data.activation.device_platform,
                activatedAt: data.activation.activated_at,
            },
        };
    }

    private transformValidationResponse(data: any): ValidateResponse {
        return {
            valid: data.valid,
            license: {
                key: data.license.key,
                status: data.license.status,
                type: data.license.type,
                expiresAt: data.license.expires_at,
                maxDevices: data.license.max_devices,
            },
            activation: data.activation
                ? {
                      id: data.activation.id,
                      deviceId: data.activation.device_id,
                      deviceName: data.activation.device_name,
                      devicePlatform: data.activation.device_platform,
                      lastValidatedAt: data.activation.last_validated_at,
                  }
                : null,
        };
    }

    private transformLicenseInfoResponse(data: any): LicenseInfo {
        return {
            license: {
                key: data.license.key,
                status: data.license.status,
                type: data.license.type,
                expiresAt: data.license.expires_at,
                maxDevices: data.license.max_devices,
                activeDevices: data.license.active_devices,
            },
            activations: data.activations.map((a: any) => ({
                id: a.id,
                deviceId: a.device_id,
                deviceName: a.device_name,
                devicePlatform: a.device_platform,
                activatedAt: a.activated_at,
                deactivatedAt: a.deactivated_at,
                isActive: a.is_active,
            })),
        };
    }

    private handleError(error: unknown, context: string): LycentoError {
        if (axios.isAxiosError(error)) {
            const axiosError = error as AxiosError;
            if (!axiosError.response) {
                return new NetworkError(
                    'Network error - please check your connection',
                );
            }

            const status = axiosError.response!.status;
            const data = axiosError.response!.data as any;

            if (status === 422) {
                const errorMessage =
                    data.error || data.message || 'Validation failed';
                switch (context) {
                    case 'activation':
                        return new ActivationError(errorMessage);
                    case 'validation':
                        return new ValidationError(errorMessage);
                    case 'deactivation':
                        return new DeactivationError(errorMessage);
                    default:
                        return new LycentoError(errorMessage);
                }
            }

            if (status === 404) {
                return new LycentoError('License not found');
            }

            if (status === 429) {
                return new NetworkError(
                    'Rate limit exceeded - please try again later',
                );
            }

            return new LycentoError(`Server error: ${status}`);
        }

        return new LycentoError('Unknown error occurred');
    }
}

/**
 * Create a Lycento client instance
 */
export function createClient(config: LycentoConfig): LycentoClient {
    return new LycentoClient(config);
}

/**
 * Quick validation helper - validates with auto-detected device
 */
export async function validateLicense(
    licenseKey: string,
    baseUrl: string,
    apiKey?: string,
): Promise<boolean> {
    const client = createClient({ baseUrl, apiKey });
    return client.isValid(licenseKey);
}

export {
    ActivationError,
    DeactivationError,
    DeviceInfo,
    getDeviceId,
    getDeviceInfo,
    LycentoError,
    NetworkError,
    Platform,
    ValidationError,
};
