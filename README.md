# [![npm](https://img.shields.io/npm/v/po-token-generator)](https://www.npmjs.com/package/po-token-generator) PO Token Generator

`po-token-generator` is a utility package designed to help you access YouTube data without logging in (Most of the cases). It leverages Puppeteer with `puppeteer-extra` plugins (Stealth and Adblocker) to bypass restrictions and generate a `poToken`, which can be used to make requests to YouTube as if you were authenticated.

## Key Features

- **YouTube Data Scraping**: Scrapes YouTube for `poToken` and `visitorData` using Puppeteer.
- **Stealth Mode**: Uses the Puppeteer Stealth plugin to avoid detection by anti-bot systems.
- **Adblocker Integration**: Blocks ads and trackers for faster and cleaner scraping.
- **Concurrent Scraping**: Supports scraping multiple YouTube video IDs concurrently.
- **Caching**: Built-in caching to avoid redundant requests and improve efficiency.
- **Flexible Configuration**: Highly configurable with support for custom browser options, viewports, and more.

## Why `po_token`?

The `po_token` is an essential token that allows access to certain YouTube resources without requiring a login. By using `po_token`, you can bypass login requirements and access metadata, comments, and other public resources without triggering CAPTCHA or other anti-bot mechanisms.

## Installation

You can install the package via npm or pnpm:

```bash
# Using npm
npm install po-token-generator

# Using pnpm
pnpm add po-token-generator
```

## Usage

### Basic Example

Here’s how to use `po-token-generator` to scrape YouTube video data:

```typescript
import { scrapeYouTubeData } from "po_token-generator";

const videoId = "CEARgJ74WPU";

(async () => {
  try {
    const data = await scrapeYouTubeData(videoId);
    console.log(data);
  } catch (error) {
    console.error("Failed to scrape data:", error);
  }
})();
```

### Advanced Configuration

The `scrapeYouTubeData` function is highly configurable. Here’s an example using advanced options:

```typescript
import { scrapeYouTubeData, Config } from "po_token-generator";

const config: Config = {
  headless: true,
  requestInterception: true,
  blockResources: ["image", "stylesheet", "font"],
  cacheOptions: { stdTTL: 600 }, // Cache results for 10 minutes
  viewport: { width: 1280, height: 720 },
};

const videoId = "CEARgJ74WPU";

(async () => {
  try {
    const data = await scrapeYouTubeData(videoId, config);
    console.log(data);
  } catch (error) {
    console.error("Failed to scrape data:", error);
  }
})();
```

## API Reference

### `scrapeYouTubeData(videoId: string, config?: Config): Promise<ScrapeResult>`

Scrapes YouTube for the specified `videoId` and returns the `poToken` and `visitorData`.

#### Parameters:

- `videoId` **(string)**: The ID of the YouTube video you want to scrape.
- `config` **(Config)**: Optional configuration object.

#### Returns:

- `Promise<ScrapeResult>`: Resolves with an object containing `poToken` and `visitorData`.

### Configuration Options (`Config`)

```typescript
interface Config {
  headless?: boolean; // Run Puppeteer in headless mode
  requestInterception?: boolean; // Enable request interception to block certain resources
  blockResources?: ResourceType[]; // Specify resource types to block (e.g., 'image', 'stylesheet')
  stealthPlugin?: boolean; // Use Puppeteer stealth plugin
  adblockerPlugin?: boolean; // Use Puppeteer adblocker plugin
  adblockerPluginOptions?: Record<string, any>; // Options for adblocker plugin
  cacheOptions?: NodeCache.Options; // Cache options for NodeCache
  viewport?: puppeteer.Viewport; // Set custom viewport dimensions
  launchArgs?: string[]; // Additional launch arguments for Puppeteer
  waitUntil?: "load" | "domcontentloaded" | "networkidle0" | "networkidle2"; // When to consider navigation done
  executablePath?: string; // Path to the Chromium or Chrome executable
}
```

### `ScrapeResult`

```typescript
interface ScrapeResult {
  poToken: string; // The poToken extracted from YouTube
  visitorData: string; // The visitorData extracted from YouTube
}
```

## Example Use Cases

- **Metadata Collection**: Collect metadata from YouTube videos without needing to log in.
- **Comment Analysis**: Access and analyze comments from YouTube videos.
- **Data Scraping**: Scrape YouTube data at scale using multiple video IDs concurrently.

## Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/iRajatDas/po-token-generator/issues).

### Development Setup

1.  Fork the repository.
2.  Clone your fork.
3.  Install dependencies: `pnpm install`
4.  Make your changes and submit a pull request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
