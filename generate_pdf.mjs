import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const htmlPath = path.resolve('resume_source.html').replace(/\\/g, '/');
const outputPath = path.resolve('ABE_MELWIN DAVE_RESUME.pdf');
const port = 9222;

console.log('Spawning Chrome...');
const chromeProcess = spawn(chromePath, [
  '--headless=new',
  '--disable-gpu',
  `--remote-debugging-port=${port}`,
  '--no-first-run',
  '--no-default-browser-check',
  `--user-data-dir=${process.env.TEMP}\\chrome_cdp_profile_${Date.now()}`
], { stdio: 'ignore' });

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function run() {
  try {
    let targets = null;
    for (let i = 0; i < 20; i++) {
      try {
        const res = await fetch(`http://127.0.0.1:${port}/json/version`);
        if (res.ok) {
          targets = await res.json();
          break;
        }
      } catch (e) {
        await sleep(300);
      }
    }

    if (!targets) {
      throw new Error('Could not connect to Chrome debugging port');
    }

    console.log('Opening page target...');
    const createRes = await fetch(`http://127.0.0.1:${port}/json/new?file:///${htmlPath}`, { method: 'PUT' });
    const target = await createRes.json();
    const wsUrl = target.webSocketDebuggerUrl;

    console.log('Connecting WebSocket to target:', wsUrl);
    const ws = new WebSocket(wsUrl);

    await new Promise((resolve, reject) => {
      ws.onopen = resolve;
      ws.onerror = reject;
    });

    let msgId = 1;
    function sendCommand(method, params = {}) {
      return new Promise((resolve, reject) => {
        const id = msgId++;
        const handler = (event) => {
          const data = JSON.parse(event.data);
          if (data.id === id) {
            ws.removeEventListener('message', handler);
            if (data.error) {
              reject(data.error);
            } else {
              resolve(data.result);
            }
          }
        };
        ws.addEventListener('message', handler);
        ws.send(JSON.stringify({ id, method, params }));
      });
    }

    console.log('Waiting for fonts and layout...');
    await sendCommand('Page.enable');
    await sleep(1500); // Give time for Google Fonts to load

    console.log('Generating PDF...');
    const pdfResult = await sendCommand('Page.printToPDF', {
      printBackground: true,
      paperWidth: 8.5,
      paperHeight: 11,
      marginTop: 0.35,
      marginBottom: 0.35,
      marginLeft: 0.45,
      marginRight: 0.45,
      preferCSSPageSize: true
    });

    const buffer = Buffer.from(pdfResult.data, 'base64');
    fs.writeFileSync(outputPath, buffer);
    console.log(`✓ PDF successfully saved to: ${outputPath} (${buffer.length} bytes)`);

    ws.close();
  } catch (err) {
    console.error('Error generating PDF:', err);
  } finally {
    try {
      chromeProcess.kill();
    } catch (e) {}
  }
}

run();
