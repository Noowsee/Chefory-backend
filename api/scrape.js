import puppeteer from "puppeteer-core";
import chromium from "@sparticuz/chromium-min";

export default async function handler(req, res) {
  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ error: "URL mangler i forespørsel" });
  }

  try {
    const browser = await puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath(),
      headless: chromium.headless,
    });

    const page = await browser.newPage();
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 20000 });

    const html = await page.content();

    await browser.close();

    res.status(200).json({ html });
  } catch (error) {
    console.error("❌ Puppeteer-feil:", error);
    res.status(500).json({ error: "Kunne ikke hente HTML" });
  }
}
