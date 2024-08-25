import { scrapeYouTubeData } from "../src/scraper";
import { Config } from "../src/types";
import { Browser } from "puppeteer";

let browser: Browser;

const config: Config = {
  headless: true,
  requestInterception: true,
};

describe("YouTube Scraper", () => {
  afterAll(async () => {
    if (browser) {
      await browser.close();
    }
  });

  it("should fetch YouTube data successfully", async () => {
    const videoId = "CEARgJ74WPU";
    const data = await scrapeYouTubeData(videoId, config);
    expect(data).toHaveProperty("poToken");
    expect(data).toHaveProperty("visitorData");
  });

  it("should throw an error for invalid video ID", async () => {
    await expect(scrapeYouTubeData("invalidId", config)).rejects.toThrow(
      "Invalid video ID"
    );
  });
});
