const puppeteer = require("puppeteer");

(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe", // ✅ tumhara asli Chrome
    defaultViewport: null,
    args: ["--start-maximized"],
  });

  const page = await browser.newPage();

  // ⚙️ Cookies load karne ka try
  const fs = require("fs");
  const cookiesPath = "cookies.json";
  if (fs.existsSync(cookiesPath)) {
    const cookies = JSON.parse(fs.readFileSync(cookiesPath));
    await page.setCookie(...cookies);
    console.log("✅ Cookies loaded!");
  }

  // TikTok open
  await page.goto("https://www.tiktok.com/", { waitUntil: "load" });

  // Agar login nahi hai to tum manual login karo
  console.log("🔹 Please login manually if not already logged in...");
  await page.waitForTimeout(60000); // 60 seconds to login manually

  // ✅ Login ke baad cookies save
  const currentCookies = await page.cookies();
  fs.writeFileSync(cookiesPath, JSON.stringify(currentCookies));
  console.log("💾 Cookies saved for next time!");

  // Uske baad tum video open karke auto-like run kar sakti ho
  await page.goto(
    "https://www.tiktok.com/@neelam.muneer.kha57/video/7555729899303095566",
    { waitUntil: "load" }
  );

  console.log("💬 Waiting for comments...");
  await page.waitForTimeout(10000);

  await page.evaluate(() => {
    function autoLike() {
      let buttons = document.querySelectorAll("button[data-e2e='comment-like-icon']");
      buttons.forEach((btn) => {
        if (btn.getAttribute("data-processed") !== "true") {
          btn.click();
          btn.setAttribute("data-processed", "true");
        }
      });
      console.log("❤️ New comments liked!");
    }
    setInterval(autoLike, 5000);
  });

  console.log("🚀 Auto-like running...");
})();