import type { NextApiRequest, NextApiResponse } from "next";
import Redis from "ioredis";
import { env } from "~/env.mjs";
import axios from "axios";
import qs from "qs";
import { prisma } from "~/server/db";
import jwt from "jsonwebtoken";

function generateJWTToken(payload: any, expireTime: any) {
  return jwt.sign(payload, env.JWT_SECRET, { expiresIn: expireTime });
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const redis = new Redis(env.REDIS_URL);

  const encodedCredentials = Buffer.from(
    `${env.AIRTABLE_CLIENT_ID}:${env.AIRTABLE_CLIENT_SECRET}`
  ).toString("base64");
  const authorizationHeader = `Basic ${encodedCredentials}`;
  const state = req.query.state;
  const cached = await redis.get(state?.toString() ?? "");
  if (cached === undefined) {
    res.send("This request was not from Airtable!");
    return;
  }
  await redis.del(state?.toString() ?? "");

  // Check if the redirect includes an error code.
  if (req.query.error) {
    const error = req.query.error;
    const errorDescription = req.query.error_description;
    res.send(`
            There was an error authorizing this request.
            <br/>Error: "${error}"
            <br/>Error Description: "${errorDescription}"
        `);
    return;
  }

  const code = req.query.code;
  const codeVerifier = JSON.parse(cached?.toString() ?? "").codeVerifier;

  const headers = {
    "Content-Type": "application/x-www-form-urlencoded",
    Authorization: authorizationHeader,
  };

  // get access token from airtable using the code
  const data = await axios({
    method: "POST",
    url: `https://airtable.com/oauth2/v1/token`,
    headers,
    data: qs.stringify({
      client_id: env.AIRTABLE_CLIENT_ID,
      code_verifier: codeVerifier,
      redirect_uri: env.AIRTABLE_REDIRECT_URI,
      code,
      grant_type: "authorization_code",
    }),
  }).catch((e) => {
    console.log("uh oh, something went wrong", e.response.data);
  });

  const { access_token, refresh_token, expires_in, refresh_expires_in } =
    data?.data;

  // get userdata from airtable
  const userdata = await axios
    .get("https://api.airtable.com/v0/meta/whoami", {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    })
    .catch((e) => {
      console.log("uh oh, something went wrong", e.response.data);
    });

  const { id, scopes } = userdata?.data;

  // check db to find userid
  // if no user -> create
  // make jwt and send to /dashboard?token={jwt}&newuser={true|false}

  // setting cookie
  const jwtToken = generateJWTToken(
    {
      access_token: id,
    },
    expires_in
  );

  const user = await prisma.user.findUnique({
    where: {
      airtable: id,
    },
  });

  if (!user) {
    const newUser = await prisma.user.create({
      data: {
        airtable: id,
      },
    });
  }

  res.redirect("/dashboard?token=" + jwtToken + "&newuser=" + !user);
}
