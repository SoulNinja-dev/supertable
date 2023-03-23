/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { type GetServerSidePropsContext } from "next";
import crypto from "crypto";
import google, { GoogleProfile } from "next-auth/providers/google";
import {
  getServerSession,
  type NextAuthOptions,
  type DefaultSession,
} from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { env } from "~/env.mjs";
import { prisma } from "~/server/db";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
    } & DefaultSession["user"];
  }
}

const clientId = env.AIRTABLE_CLIENT_ID;
const clientSecret = env.AIRTABLE_CLIENT_SECRET;
const redirectUri = env.AIRTABLE_REDIRECT_URI;
const encodedCredentials = Buffer.from(`${clientId}:${clientSecret}`).toString(
  "base64"
);
const authorizationHeader = `Basic ${encodedCredentials}`;

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  callbacks: {
    signIn(res) {
      console.log("sign in:", res);
      return true;
    },
    session(res) {
      console.log("session: ", res);
      return res.session;
    },
    jwt(res) {
      console.log("jwt ", res);
      return res.token;
    },
  },
  providers: [
    // https://next-auth.js.org/configuration/providers/oauth#using-a-custom-provider
    {
      id: "airtable",
      name: "Airtable",
      type: "oauth",
      version: "2.0",
      clientId,
      clientSecret,
      authorization: {
        url: "https://airtable.com/oauth2/v1/authorize",
        params: {
          client_id: clientId,
          redirect_uri: redirectUri,
          response_type: "code",
          scope: "data.records:write schema.bases:read",
        },
      },
      checks: ["pkce", "state"],
      token: {
        url: "https://api.airtable.com/oauth2/v1/token",
        params: {
          Headers: {
            Authorization: authorizationHeader,
            "Content-Type": "application/x-www-form-urlencoded",
          },
          client_id: clientId,
          grant_type: "code",
          redirect_uri: redirectUri,
        },
        // async request(context) {
        //   const tokens = await makeTokenRequest(context);
        //   return { tokens };
        // }
      },
      userinfo: {
        // @ts-ignore
        request: () => {
          console.log("first here ig?");
        },
      },
      // @ts-ignore
      profile(profile) {
        console.log("YOO AM HERE");
        return {
          profile: profile,
        };
      },
    },
  ],
};

/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getServerAuthSession = (ctx: {
  req: GetServerSidePropsContext["req"];
  res: GetServerSidePropsContext["res"];
}) => {
  return getServerSession(ctx.req, ctx.res, authOptions);
};

const makeTokenRequest = async (context: any) => {};
