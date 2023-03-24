import type { NextApiRequest, NextApiResponse } from "next";
import crypto from "crypto";
import Redis from "ioredis";
import { env } from "~/env.mjs";

const redis = new Redis(env.REDIS_URL);

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const clientId = env.AIRTABLE_CLIENT_ID;
  const redirectUri = env.AIRTABLE_REDIRECT_URI;
  const scope = "data.records:write schema.bases:read";
  const state = crypto.randomBytes(100).toString("base64url");

  const codeVerifier = crypto.randomBytes(96).toString("base64url"); // 128 characters
  const codeChallengeMethod = "S256";
  const codeChallenge = crypto
    .createHash("sha256")
    .update(codeVerifier) // hash the code verifier with the sha256 algorithm
    .digest("base64") // base64 encode, needs to be transformed to base64url
    .replace(/=/g, "") // remove =
    .replace(/\+/g, "-") // replace + with -
    .replace(/\//g, "_"); // replace / with _ now base64url encoded

  redis.set(state, JSON.stringify({ codeVerifier }));

  // build the authorization URL
  const authorizationUrl = new URL(`https://airtable.com/oauth2/v1/authorize`);
  authorizationUrl.searchParams.set("code_challenge", codeChallenge);
  authorizationUrl.searchParams.set(
    "code_challenge_method",
    codeChallengeMethod
  );
  authorizationUrl.searchParams.set("state", state);
  authorizationUrl.searchParams.set("client_id", clientId);
  authorizationUrl.searchParams.set("redirect_uri", redirectUri);
  authorizationUrl.searchParams.set("response_type", "code");
  authorizationUrl.searchParams.set("scope", scope);

  // redirect the user and request authorization
  res.redirect(authorizationUrl.toString());
}
