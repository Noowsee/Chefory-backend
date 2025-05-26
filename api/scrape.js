import chromium from "chrome-aws-lambda";
import puppeteer from "puppeteer-core";

export default async function handler(req, res) {
  const { url } = req.query;

  if (!url) {
    return res.status(400).send("Mangler URL");
  }

  let browser = null;

  try {
    browser = await puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath,
      headless: chromium.headless,
    });

    const page = await browser.newPage();
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 20000 });

    let html = await page.content();

    await browser.close();

    html = html
      .replace(/<script[\s\S]*?<\/script>/gi, "")
      .replace(/<style[\s\S]*?<\/style>/gi, "")
      .replace(/\s+/g, " ")
      .slice(0, 15000);

    return res.status(200).json({ html });
  } catch (err) {
    if (browser) await browser.close();
    console.error("❌ Puppeteer-feil:", err.message);
    return res.status(500).json({ error: "Klarte ikke å hente HTML" });
  }
}
