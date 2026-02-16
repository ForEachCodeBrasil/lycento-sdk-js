import { execSync } from 'child_process';
import crypto from 'crypto';
import os from 'os';

export type Platform =
    | 'windows'
    | 'macos'
    | 'linux'
    | 'android'
    | 'ios'
    | 'unknown';

export interface DeviceInfo {
    deviceId: string;
    deviceName: string;
    platform: Platform;
    platformVersion: string;
    architecture: string;
}

/**
 * Get or create a persistent device ID
 * Uses machine-specific identifiers
 */
export function getDeviceId(): string {
    // Try to get from environment or generate from machine info
    const homeDir = os.homedir();
    const hostname = os.hostname();
    const platform = os.platform();
    const cpus = os.cpus();

    // Create a deterministic device ID from machine characteristics
    const data = `${homeDir}-${hostname}-${platform}-${cpus[0]?.model || 'unknown'}`;
    return crypto
        .createHash('sha256')
        .update(data)
        .digest('hex')
        .substring(0, 32);
}

/**
 * Get device information
 */
export async function getDeviceInfo(): Promise<DeviceInfo> {
    const deviceId = getDeviceId();

    const platform = getPlatform();
    const deviceName = getDeviceName();

    return {
        deviceId,
        deviceName,
        platform,
        platformVersion: os.release(),
        architecture: os.arch(),
    };
}

/**
 * Detect the current platform
 */
function getPlatform(): Platform {
    const platform = os.platform().toLowerCase();

    if (platform === 'win32') return 'windows';
    if (platform === 'darwin') return 'macos';
    if (platform === 'linux') return 'linux';
    if (platform === 'android') return 'android';
    if (platform === 'ios') return 'ios';

    return 'unknown';
}

/**
 * Get a human-readable device name
 */
function getDeviceName(): string {
    const platform = os.platform();
    const hostname = os.hostname();

    if (platform === 'win32') {
        const username = os.userInfo().username;
        return `${username}-${hostname}`;
    }

    if (platform === 'darwin') {
        try {
            const result = execSync('scutil --get ComputerName', {
                encoding: 'utf8',
            });
            return result.trim();
        } catch {
            return hostname;
        }
    }

    return hostname;
}
