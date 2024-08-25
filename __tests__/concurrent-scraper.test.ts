import { scrapeYouTubeData } from "../src/scraper";
import { Config, ScrapeResult } from "../src/types";

const mockConfig: Config = {
  headless: true,
  requestInterception: true,
  blockResources: ["image", "stylesheet", "font"],
};

const MAX_CONCURRENCY = 5;

describe("YouTube Scraper Concurrency", () => {
  const videoIds = [
    "CEARgJ74WPU",
    "BQJtgquX8cU",
    "OzFXhuaLPdg",
    "VCrNOL5eEws",
    "ybMlyIFBFW4",
  ];

  const invalidVideoIds = [
    "invalid1",
    "invalid2",
    "invalid3",
    "invalid4",
    "invalid5",
  ];

  async function createConcurrentScrapingTasks(
    videoIds: string[],
    config: Config
  ): Promise<ScrapeResult[]> {
    const results: ScrapeResult[] = [];
    const pool: Promise<void>[] = [];

    for (const videoId of videoIds) {
      const task = async (): Promise<void> => {
        const result = await scrapeYouTubeData(videoId, config);
        results.push(result);
      };

      // Execute the task and remove it from the pool once done
      const taskPromise: Promise<void> = task().then(() => {
        pool.splice(pool.indexOf(taskPromise), 1);
      });

      pool.push(taskPromise);

      // Enforce max concurrency
      if (pool.length >= MAX_CONCURRENCY) {
        await Promise.race(pool);
      }
    }

    // Wait for all remaining tasks to complete
    await Promise.all(pool);
    return results;
  }

  it("should scrape multiple video data concurrently within the limit", async () => {
    const results = await createConcurrentScrapingTasks(videoIds, mockConfig);

    results.forEach((result) => {
      expect(result).toHaveProperty("poToken");
      expect(result).toHaveProperty("visitorData");
    });
  }, 30000);

  it("should throw an error for invalid video IDs concurrently within the limit", async () => {
    const scrapeInvalidIds = async (): Promise<void> => {
      await createConcurrentScrapingTasks(invalidVideoIds, mockConfig);
    };

    await expect(scrapeInvalidIds()).rejects.toThrow("Invalid video ID");
  });
});
