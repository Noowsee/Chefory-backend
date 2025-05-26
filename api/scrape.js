import chromium from "@sparticuz/chromium-min";
import puppeteer from "puppeteer-core";

export default async function handler(req, res) {
  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ error: "Mangler URL" });
  }

  let browser = null;

  try {
    console.log("🚀 Starter puppeteer");

    browser = await puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath(),
      headless: true,
    });

    const page = await browser.newPage();
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 30000 });

    const html = await page.content();

    console.log("✅ HTML hentet");
    res.status(200).json({ html });
  } catch (err) {
    console.error("❌ Feil under scraping:", err.message);
    res
      .status(500)
      .json({ error: "Klarte ikke hente HTML", detail: err.message });
  } finally {
    if (browser !== null) {
      await browser.close();
    }
  }
}
