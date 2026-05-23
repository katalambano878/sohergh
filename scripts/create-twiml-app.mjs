/**
 * Create (or find) a Twilio TwiML Application pointing at this app's voice webhook.
 *
 * Requires in .env.local: TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, NEXT_PUBLIC_APP_URL
 *
 * Run: node scripts/create-twiml-app.mjs
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function loadEnv() {
  const envPath = path.join(__dirname, '..', '.env.local');
  const alt = path.join(__dirname, '..', '.env');
  const p = fs.existsSync(envPath) ? envPath : fs.existsSync(alt) ? alt : null;
  if (!p) return {};
  return Object.fromEntries(
    fs.readFileSync(p, 'utf-8')
      .split('\n')
      .filter((l) => /^[A-Z_][A-Z0-9_]*=/i.test(l.trim()))
      .map((l) => {
        const eq = l.indexOf('=');
        let v = l.slice(eq + 1).trim();
        if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
          v = v.slice(1, -1);
        }
        v = v.replace(/;$/, '').trim();
        return [l.slice(0, eq).trim(), v];
      }),
  );
}

const env = { ...process.env, ...loadEnv() };
const sid = env.TWILIO_ACCOUNT_SID;
const token = env.TWILIO_AUTH_TOKEN;
let base = (env.NEXT_PUBLIC_APP_URL || '').trim().replace(/\/$/, '');

if (!sid || !token) {
  console.error('Set TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN in .env.local');
  process.exit(1);
}

if (!base || base.includes('example.com')) {
  console.error(
    '\nSet NEXT_PUBLIC_APP_URL in .env.local to your real public https origin:',
    '  • Production: https://yourdomain.com',
    '  • Local test: https://xxxx.ngrok-free.app (then run Next on 3002)',
    '\nTwilio cannot reach localhost without a tunnel.\n',
  );
  process.exit(1);
}

const voiceUrl = `${base}/support/api/twilio/voice`;
const auth = Buffer.from(`${sid}:${token}`).toString('base64');
const friendlyName = 'Sohergh Rachel Voice';

async function listApps() {
  const url = `https://api.twilio.com/2010-04-01/Accounts/${sid}/Applications.json`;
  const res = await fetch(url, { headers: { Authorization: `Basic ${auth}` } });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || JSON.stringify(data));
  return data.applications || [];
}

async function createApp() {
  const url = `https://api.twilio.com/2010-04-01/Accounts/${sid}/Applications.json`;
  const body = new URLSearchParams({
    FriendlyName: friendlyName,
    VoiceUrl: voiceUrl,
    VoiceMethod: 'POST',
  });
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || JSON.stringify(data));
  return data.sid;
}

const existing = await listApps();
const found = existing.find((a) => a.friendly_name === friendlyName);

let appSid = found?.sid;
if (appSid) {
  console.log('Found existing TwiML App:', friendlyName, appSid);
  console.log('Voice URL should be:', voiceUrl);
  console.log('Update it in Console if needed: https://console.twilio.com/us1/develop/voice/manage/twiml-apps');
} else {
  appSid = await createApp();
  console.log('Created TwiML App:', appSid);
  console.log('VoiceUrl:', voiceUrl);
}

const envLocal = path.join(__dirname, '..', '.env.local');
let text = fs.readFileSync(envLocal, 'utf-8');
if (/^TWILIO_TWIML_APP_SID=/m.test(text)) {
  text = text.replace(/^TWILIO_TWIML_APP_SID=.*$/m, `TWILIO_TWIML_APP_SID=${appSid}`);
} else {
  text = text.replace(
    /(# ─── Rachel Voice AI Support ─.*)/,
    `$1\nTWILIO_TWIML_APP_SID=${appSid}`,
  );
  if (!text.includes('TWILIO_TWIML_APP_SID')) {
    text += `\nTWILIO_TWIML_APP_SID=${appSid}\n`;
  }
}
fs.writeFileSync(envLocal, text, 'utf-8');
console.log('\nWrote TWILIO_TWIML_APP_SID to .env.local');
console.log('Restart `npm run dev` and test Call Support.\n');
