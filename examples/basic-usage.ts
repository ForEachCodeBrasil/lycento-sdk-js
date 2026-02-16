/**
 * Lycento SDK - Usage Examples
 *
 * Install:
 *   npm install @lycento/sdk axios
 *
 * Or if using in Node.js without axios:
 *   npm install @lycento/sdk
 *   npm install axios  # peer dependency
 */

import { createClient, LycentoError } from '@lycento/sdk';

// ============================================
// Basic Usage
// ============================================

const client = createClient({
    baseUrl: 'https://your-tenant.lycento.com',
    // apiKey: 'optional-api-key',  // For authenticated endpoints
    timeout: 10000,
});

// ============================================
// Activate a License
// ============================================

async function activateLicense() {
    try {
        const result = await client.activate({
            licenseKey: 'LYC-XXXXXXXX-XXXXXXXX',
            // deviceId: 'optional-device-id',    // Auto-detected if omitted
            // deviceName: 'My Computer',          // Auto-detected if omitted
            // devicePlatform: 'windows',          // Auto-detected if omitted
        });

        console.log('License activated:', result.success);
        console.log('License status:', result.license.status);
        console.log('Expires at:', result.license.expiresAt);
        console.log('Activation ID:', result.activation.id);
    } catch (error) {
        if (error instanceof LycentoError) {
            console.error('Lycento Error:', error.message);
        } else {
            console.error('Unknown error:', error);
        }
    }
}

// ============================================
// Validate a License
// ============================================

async function validateLicense() {
    try {
        const result = await client.validate({
            licenseKey: 'LYC-XXXXXXXX-XXXXXXXX',
            // deviceId: 'optional-device-id',  // Auto-detected if omitted
        });

        if (result.valid) {
            console.log('License is valid!');
            console.log('Status:', result.license.status);
            console.log('Type:', result.license.type);
            console.log('Max devices:', result.license.maxDevices);
        } else {
            console.log('License is invalid');
        }
    } catch (error) {
        if (error instanceof LycentoError) {
            console.error('Lycento Error:', error.message);
        }
    }
}

// ============================================
// Quick Validation (isValid helper)
// ============================================

async function quickValidation() {
    const isValid = await client.isValid('LYC-XXXXXXXX-XXXXXXXX');
    console.log('Is valid:', isValid);
}

// ============================================
// Deactivate a License
// ============================================

async function deactivateLicense() {
    try {
        const result = await client.deactivate({
            licenseKey: 'LYC-XXXXXXXX-XXXXXXXX',
            deviceId: 'device-id-to-deactivate',
        });

        console.log('Device deactivated:', result.success);
    } catch (error) {
        if (error instanceof LycentoError) {
            console.error('Lycento Error:', error.message);
        }
    }
}

// ============================================
// Get License Info
// ============================================

async function getLicenseInfo() {
    try {
        const info = await client.getInfo('LYC-XXXXXXXX-XXXXXXXX');

        console.log('License Key:', info.license.key);
        console.log('Status:', info.license.status);
        console.log('Type:', info.license.type);
        console.log('Active Devices:', info.license.activeDevices);
        console.log('Max Devices:', info.license.maxDevices);

        console.log('\nActivations:');
        for (const activation of info.activations) {
            console.log(
                `- ${activation.deviceName} (${activation.devicePlatform}): ${activation.isActive ? 'Active' : 'Inactive'}`,
            );
        }
    } catch (error) {
        if (error instanceof LycentoError) {
            console.error('Lycento Error:', error.message);
        }
    }
}

// ============================================
// Run Examples
// ============================================

// activateLicense();
// validateLicense();
// quickValidation();
// deactivateLicense();
// getLicenseInfo();
