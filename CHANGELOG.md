# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-02-16

### Added

- Initial release
- License activation and deactivation
- License validation
- Device information management
- Automatic device ID generation
- Full TypeScript support
- Error handling with specific error types
- Comprehensive documentation

### Features

- `createClient()` - Create Lycento client instance
- `validateLicense()` - Validate license keys
- `client.activate()` - Activate license on device
- `client.deactivate()` - Deactivate device from license
- `client.getInfo()` - Get license information
- `getDeviceId()` - Get unique device identifier
- `getDeviceInfo()` - Get device information object

### Supported Platforms

- Node.js 14+
- Modern browsers
- Electron
- Tauri (via Node.js sidecar)
