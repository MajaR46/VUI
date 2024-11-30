const lighthouse = require('lighthouse');
const chromeLauncher = require('chrome-launcher');
const fs = require('fs');

async function runLighthouse(url) {
  // Launch Chrome
  const chrome = await chromeLauncher.launch({ chromeFlags: ['--headless'] });
  
  // Run Lighthouse on the specified URL
  const result = await lighthouse(url, {
    port: chrome.port,
    output: 'html',  // You can also specify 'json' for JSON output
    logLevel: 'info',
  });

  // Save the report as HTML
  const reportHtml = result.report;
  fs.writeFileSync('lighthouse-report.html', reportHtml);

  console.log('Lighthouse report saved as lighthouse-report.html');

  // Close Chrome
  await chrome.kill();
}

// Run Lighthouse on the URL of your choice
const url = 'https://melt-vert.vercel.app/';
runLighthouse(url);
