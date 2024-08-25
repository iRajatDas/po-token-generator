import puppeteer, { PuppeteerExtra } from "puppeteer-extra";
import stealthPlugin from "puppeteer-extra-plugin-stealth";
import adblockerPlugin from "puppeteer-extra-plugin-adblocker";
import { Browser, Page, PuppeteerLaunchOptions } from "puppeteer";
import NodeCache from "node-cache";
import logger from "./logger";
import os from "os";
import { Config, ScrapeResult } from "./types";

let browserPromise: Promise<Browser> | null = null;

// Explicitly type puppeteer as PuppeteerExtra
const puppeteerExtra: PuppeteerExtra = puppeteer;

function initializePuppeteer(config: Config): void {
  puppeteerExtra.use(stealthPlugin());

  if (config.adblockerPlugin !== false) {
    puppeteerExtra.use(
      adblockerPlugin(config.adblockerPluginOptions || { blockTrackers: true })
    );
  }
}

function getExecutablePath(config: Config): string {
  let executablePath =
    config.executablePath || process.env.CHROME_EXECUTABLE_PATH;
  if (!executablePath) {
    switch (os.platform()) {
      case "win32":
        executablePath =
          "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
        break;
      case "darwin":
        executablePath =
          "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
        break;
      case "linux":
        executablePath = "/usr/bin/chromium-browser";
        break;
      default:
        throw new Error(`Unsupported platform: ${os.platform()}`);
    }
  }
  return executablePath;
}

function initializeBrowser(config: Config): PuppeteerLaunchOptions {
  initializePuppeteer(config);

  return {
    headless: config.headless !== false,
    executablePath: getExecutablePath(config),
    args: config.launchArgs || [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-gpu",
      "--disable-dev-shm-usage",
    ],
  };
}

async function getBrowser(config: Config = {}): Promise<Browser> {
  if (!browserPromise) {
    const launchOptions = initializeBrowser(config);
    browserPromise = puppeteer!.launch(launchOptions) as Promise<Browser>;
  }
  return browserPromise;
}

export async function scrapeYouTubeData(
  videoId: string,
  config: Config = {}
): Promise<ScrapeResult> {
  if (!videoId || videoId.length !== 11) {
    logger.error("Invalid video ID");
    throw new Error("Invalid video ID");
  }

  const cache = new NodeCache(
    config.cacheOptions || { stdTTL: 300, checkperiod: 320 }
  );
  const cachedData = cache.get<ScrapeResult>(videoId);
  if (cachedData) {
    logger.info(`Cache hit for video ID: ${videoId}`);
    return cachedData;
  }

  const browser = await getBrowser(config);

  try {
    const page: Page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 720, ...config });

    if (config.requestInterception !== false) {
      await page.setRequestInterception(true);
      page.on("request", (req) => {
        const blockResources = config.blockResources || [
          "image",
          "stylesheet",
          "font",
        ];
        if (blockResources.includes(req.resourceType())) {
          req.abort();
        } else {
          req.continue();
        }
      });
    }

    await page.goto(`https://www.youtube.com/embed/${videoId}`, {
      waitUntil: config.waitUntil || "domcontentloaded",
    });

    const client = await page.createCDPSession();
    await client.send("Debugger.enable");
    await client.send("Network.enable");

    const data = await new Promise<ScrapeResult>((resolve, reject) => {
      client.on("Network.requestWillBeSent", (e) => {
        if (e.request.url.includes("/youtubei/v1/player")) {
          try {
            const jsonData = JSON.parse(e.request.postData || "{}");
            const result: ScrapeResult = {
              poToken: jsonData.serviceIntegrityDimensions.poToken,
              visitorData: jsonData.context.client.visitorData,
            };
            logger.info("Data Found", result);
            cache.set(videoId, result);
            resolve(result);
          } catch (error) {
            reject(error);
          }
        }
      });

      page.evaluate(() => {
        const player = document.querySelector(
          "#movie_player"
        ) as HTMLDivElement;
        if (player) player.click();
      });
    });

    await page.close();
    return data;
  } catch (error) {
    logger.error("Scraping Error: ", error);
    throw error;
  }
}
