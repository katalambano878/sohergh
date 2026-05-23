import { NextRequest } from 'next/server';
import twilio from 'twilio';

/**
 * Diagnostic endpoint — verifies Twilio credentials are valid.
 * GET /support/api/twilio/debug
 *
 * Returns which env vars are set and whether the API key is valid.
 * DELETE THIS IN PRODUCTION.
 */
export async function GET(req: NextRequest) {
  const accountSid = process.env.TWILIO_ACCOUNT_SID?.trim();
  const authToken = process.env.TWILIO_AUTH_TOKEN?.trim();
  const apiKey = process.env.TWILIO_API_KEY?.trim();
  const apiSecret = process.env.TWILIO_API_SECRET?.trim();
  const twimlAppSid = process.env.TWILIO_TWIML_APP_SID?.trim();

  const envCheck = {
    TWILIO_ACCOUNT_SID: accountSid ? `${accountSid.slice(0, 6)}...${accountSid.slice(-4)}` : '❌ MISSING',
    TWILIO_AUTH_TOKEN: authToken ? `${authToken.slice(0, 4)}...${authToken.slice(-4)} (${authToken.length} chars)` : '❌ MISSING',
    TWILIO_API_KEY: apiKey ? `${apiKey.slice(0, 6)}...${apiKey.slice(-4)}` : '❌ MISSING',
    TWILIO_API_SECRET: apiSecret ? `${apiSecret.slice(0, 4)}...${apiSecret.slice(-4)} (${apiSecret.length} chars)` : '❌ MISSING',
    TWILIO_TWIML_APP_SID: twimlAppSid ? `${twimlAppSid.slice(0, 6)}...${twimlAppSid.slice(-4)}` : '❌ MISSING',
  };

  // Try to verify the Account SID + Auth Token by calling Twilio API
  let accountValid = false;
  let accountError = '';
  let apiKeyValid = false;
  let apiKeyError = '';
  let twimlAppValid = false;
  let twimlAppError = '';

  if (accountSid && authToken) {
    try {
      const client = twilio(accountSid, authToken);
      const account = await client.api.accounts(accountSid).fetch();
      accountValid = true;
    } catch (e: any) {
      accountError = e.message || String(e);
    }
  }

  // Check if the API Key exists
  if (accountSid && authToken && apiKey) {
    try {
      const client = twilio(accountSid, authToken);
      const key = await client.keys(apiKey).fetch();
      apiKeyValid = true;
    } catch (e: any) {
      apiKeyError = e.message || String(e);
    }
  }

  // Check if the TwiML App exists and what its voice URL is
  if (accountSid && authToken && twimlAppSid) {
    try {
      const client = twilio(accountSid, authToken);
      const app = await client.applications(twimlAppSid).fetch();
      twimlAppValid = true;
      twimlAppError = `Voice URL: ${app.voiceUrl || '(not set)'}, Method: ${app.voiceMethod || '(not set)'}`;
    } catch (e: any) {
      twimlAppError = e.message || String(e);
    }
  }

  // Try generating a token to see if it works
  let tokenGenerated = false;
  let tokenError = '';
  if (accountSid && apiKey && apiSecret) {
    try {
      const AccessToken = twilio.jwt.AccessToken;
      const VoiceGrant = AccessToken.VoiceGrant;
      const token = new AccessToken(accountSid, apiKey, apiSecret, {
        identity: 'debug-test',
      });
      token.addGrant(new VoiceGrant({
        outgoingApplicationSid: twimlAppSid,
        incomingAllow: false,
      }));
      const jwt = token.toJwt();
      tokenGenerated = !!jwt;
    } catch (e: any) {
      tokenError = e.message || String(e);
    }
  }

  return Response.json({
    envVars: envCheck,
    validation: {
      accountSidAuthToken: accountValid ? '✅ Valid' : `❌ ${accountError}`,
      apiKeyExists: apiKeyValid ? '✅ Key found & active' : `❌ ${apiKeyError}`,
      twimlApp: twimlAppValid ? `✅ ${twimlAppError}` : `❌ ${twimlAppError}`,
      tokenGeneration: tokenGenerated ? '✅ Token generated' : `❌ ${tokenError}`,
    },
  }, { status: 200 });
}
