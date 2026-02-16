# @lycento/sdk

Official Lycento JavaScript/TypeScript SDK for software licensing.

## Installation

```bash
npm install @lycento/sdk
# or
yarn add @lycento/sdk
# or
pnpm add @lycento/sdk
```

## Quick Start

```typescript
import { createClient, validateLicense } from "@lycento/sdk";

const client = createClient({
  baseUrl: "https://lycento.test",
  apiKey: "your-api-key",
});

// Validate a license
const result = await validateLicense(client, "YOUR-LICENSE-KEY");
console.log(result.valid);

// Activate a license
const activation = await client.activate("YOUR-LICENSE-KEY", {
  deviceName: "My Device",
  metadata: { app: "MyApp" },
});
console.log(activation.success);

// Deactivate a license
await client.deactivate("YOUR-LICENSE-KEY", activation.deviceId);
```

## API Reference

### `createClient(config)`

Create a new Lycento client instance.

```typescript
const client = createClient({
  baseUrl: "https://lycento.test",
  apiKey: "your-api-key",
  timeout: 10000, // optional, default 30000ms
});
```

### `validateLicense(client, licenseKey)`

Validate a license key.

```typescript
const result = await validateLicense(client, "LICENSE-KEY");
// { valid: boolean, license?: LicenseInfo, error?: string }
```

### `client.activate(licenseKey, options)`

Activate a license on the current device.

```typescript
const result = await client.activate("LICENSE-KEY", {
  deviceName: "My Device",
  metadata: { version: "1.0.0" },
});
```

### `client.deactivate(licenseKey, deviceId)`

Deactivate a device from a license.

```typescript
await client.deactivate("LICENSE-KEY", "device-id");
```

### `client.getInfo(licenseKey)`

Get license information.

```typescript
const info = await client.getInfo("LICENSE-KEY");
```

## Device Identification

The SDK automatically generates a unique device ID based on system information. You can also provide your own:

```typescript
import { getDeviceId, getDeviceInfo } from "@lycento/sdk";

const deviceId = getDeviceId();
const deviceInfo = getDeviceInfo();
```

## Error Handling

```typescript
import { LycentoError, ActivationError, ValidationError } from "@lycento/sdk";

try {
  await validateLicense(client, "LICENSE-KEY");
} catch (error) {
  if (error instanceof ValidationError) {
    console.log("Invalid license:", error.message);
  } else if (error instanceof ActivationError) {
    console.log("Activation failed:", error.message);
  }
}
```

## Platform Support

- Node.js 14+
- Modern browsers
- Electron
- Tauri (via Node.js sidecar)

## Documentation

- [API Documentation](https://github.com/ForEachCodeBrasil/lycento-sdk-js#readme)
- [Examples](./examples/)

## License

MIT © Lycento
