const fs = require('fs');
const path = require('path');

// Manually parse .env.local
const envPath = path.join(__dirname, '.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
const env = {};
for (const line of envContent.split('\n')) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith('#')) continue;
  const eqIdx = trimmed.indexOf('=');
  if (eqIdx < 0) continue;
  env[trimmed.slice(0, eqIdx).trim()] = trimmed.slice(eqIdx + 1).trim();
}

const sid   = env.TWILIO_ACCOUNT_SID;
const key   = env.TWILIO_API_KEY;
const secret = env.TWILIO_API_SECRET;
const token = env.TWILIO_AUTH_TOKEN;
const twiml = env.TWILIO_TWIML_APP_SID;

console.log('\n=== ENV VARS ===');
console.log('TWILIO_ACCOUNT_SID  :', sid    ? `${sid.slice(0,6)}...${sid.slice(-4)} (${sid.length} chars)`    : '❌ MISSING');
console.log('TWILIO_AUTH_TOKEN   :', token  ? `${token.slice(0,4)}...${token.slice(-4)} (${token.length} chars)` : '❌ MISSING');
console.log('TWILIO_API_KEY      :', key    ? `${key.slice(0,6)}...${key.slice(-4)} (${key.length} chars)`    : '❌ MISSING');
console.log('TWILIO_API_SECRET   :', secret ? `${secret.slice(0,4)}...${secret.slice(-4)} (${secret.length} chars)` : '❌ MISSING');
console.log('TWILIO_TWIML_APP_SID:', twiml  ? `${twiml.slice(0,6)}...${twiml.slice(-4)}`  : '❌ MISSING');

// Check expected formats
console.log('\n=== FORMAT CHECK ===');
console.log('Account SID starts with AC:', sid?.startsWith('AC') ? '✅' : `❌ (starts with "${sid?.slice(0,2)}")`);
console.log('API Key starts with SK    :', key?.startsWith('SK') ? '✅' : `❌ (starts with "${key?.slice(0,2)}")`);
console.log('Auth Token length == 32   :', token?.length === 32 ? '✅' : `❌ (length: ${token?.length})`);
console.log('TwiML App starts with AP  :', twiml?.startsWith('AP') ? '✅' : `❌ (starts with "${twiml?.slice(0,2)}")`);

// Try generating a token
console.log('\n=== TOKEN GENERATION ===');
try {
  const twilio = require('twilio');
  const AccessToken = twilio.jwt.AccessToken;
  const VoiceGrant = AccessToken.VoiceGrant;

  const accessToken = new AccessToken(sid, key, secret, { identity: 'test-user' });
  const voiceGrant = new VoiceGrant({ outgoingApplicationSid: twiml, incomingAllow: false });
  accessToken.addGrant(voiceGrant);
  const jwt = accessToken.toJwt();
  console.log('Token generated       :', jwt ? `✅ (${jwt.length} chars)` : '❌');
  console.log('Token starts with eyJ :', jwt?.startsWith('eyJ') ? '✅' : '❌');
} catch (e) {
  console.log('Token generation FAILED:', e.message);
}

console.log('\nDone.\n');
