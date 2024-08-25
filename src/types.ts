import { Options as NodeCacheOptions } from "node-cache";
import { ResourceType, Viewport } from "puppeteer";

export interface Config {
  /**
   * If true, runs the browser in headless mode. Defaults to true.
   */
  headless?: boolean;

  /**
   * If true, enables request interception. Useful for blocking certain types of resources.
   */
  requestInterception?: boolean;

  /**
   * An array of resource types to block, such as 'image', 'stylesheet', 'font', etc.
   */
  blockResources?: ResourceType[];

  /**
   * If true, enables the Puppeteer stealth plugin to avoid detection as an automated browser.
   */
  stealthPlugin?: boolean;

  /**
   * If true, enables the Puppeteer adblocker plugin.
   */
  adblockerPlugin?: boolean;

  /**
   * Options for the adblocker plugin.
   */
  adblockerPluginOptions?: Record<string, any>;

  /**
   * Options for NodeCache, which is used for caching scrape results.
   */
  cacheOptions?: NodeCacheOptions;

  /**
   * The viewport settings for the browser, such as width and height.
   */
  viewport?: Viewport;

  /**
   * Arguments passed to the browser on launch, such as '--no-sandbox'.
   */
  launchArgs?: string[];

  /**
   * Specifies how long the browser should wait when navigating, before considering the page load finished.
   */
  waitUntil?: "load" | "domcontentloaded" | "networkidle0" | "networkidle2";

  /**
   * The path to the Chromium or Chrome executable to use. Defaults to the one bundled with Puppeteer.
   */
  executablePath?: string;
}

export interface ScrapeResult {
  /**
   * The poToken extracted from the page.
   */
  poToken: string;

  /**
   * The visitorData extracted from the page.
   */
  visitorData: string;
}
