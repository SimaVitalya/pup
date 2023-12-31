const express = require('express');
const puppeteer = require('puppeteer');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(cors()); // Enable CORS for all routes

app.get('/car/:vin', async (req, res) => {
  const vin = req.params.vin;

  const browser = await puppeteer.launch({
    headless: true, // Set to true for production use
    args: ['--no-sandbox', '--disable-setuid-sandbox'] // Required for running in Docker
  });
  const page = await browser.newPage();

  await page.goto('https://carbuy.ee');

  const response = await page.evaluate(async (vin) => {
    vin = vin.toUpperCase().trim();
    const requestUrl = `https://mnt.salesmodul.com/api/v1/data/${vin}`;
    const fetchResponse = await fetch(requestUrl);
    return fetchResponse.json();
  }, vin);

  await browser.close();

  res.json(response);
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});