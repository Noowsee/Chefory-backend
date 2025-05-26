import puppeteer from "puppeteer";

export default async function handler(req, res) {
  const { url } = req.query;

  if (!url) {
    return res.status(400).send("Mangler URL");
  }

  try {
    const browser = await puppeteer.launch({
      headless: "new",
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();
    await page.goto(url, {
      waitUntil: "domcontentloaded",
      timeout: 15000,
    });

    let html = await page.content();
    await browser.close();

    html = html
      .replace(/<script[\s\S]*?<\/script>/gi, "")
      .replace(/<style[\s\S]*?<\/style>/gi, "")
      .replace(/\s+/g, " ")
      .slice(0, 15000);

    return res.status(200).json({ html });
  } catch (err) {
    console.error("❌ Feil i Puppeteer:", err.message);
    return res.status(500).send("Klarte ikke å hente HTML");
  }
}
