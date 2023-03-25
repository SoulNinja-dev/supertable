import { type GetServerSidePropsContext } from "next";
import {
  getServerSession,
  type NextAuthOptions,
  type DefaultSession,
} from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { env } from "~/env.mjs";
import { prisma } from "~/server/db";

import axios from "axios";

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      // ...other properties
      // role: UserRole;
    } & DefaultSession["user"];
  }

  // interface User {
  //   // ...other properties
  //   // role: UserRole;
  // }
}

interface AirtableProfile {
  id: string;
  name?: string;
  email?: string;
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authOptions: NextAuthOptions = {
  callbacks: {
    session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
        // session.user.role = user.role; <-- put other properties on the session here
      }
      return session;
    },
  },
  adapter: PrismaAdapter(prisma),
  providers: [
    {
      id: "airtable",
      name: "Airtable",
      type: "oauth",
      version: "2.0",
      clientId: env.AIRTABLE_CLIENT_ID,
      clientSecret: env.AIRTABLE_SECRET,
      authorization: {
        url: "https://airtable.com/oauth2/v1/authorize",
        params: {
          response_type: "code",
          scope: "data.records:write schema.bases:read",
          redirect_uri: `${env.NEXTAUTH_URL}/api/auth/callback/airtable`,
        },
      },
      requestTokenUrl: "https://airtable.com/oauth2/v1/token",
      accessTokenUrl: "https://airtable.com/oauth2/v1/token",
      token: {
        url: "https://airtable.com/oauth2/v1/token",
        async request(context) {
          const { code } = context.params;
          const redirect_uri =
            context.params.redirect_uri ||
            `${env.NEXTAUTH_URL}/api/auth/callback/airtable`;
          const { clientId, clientSecret } = context.provider;
          if (!code || !redirect_uri || !clientId || !clientSecret) {
            throw new Error("Missing parameters");
          }
          if (!context.checks.code_verifier) {
            throw new Error("Missing code_verifier");
          }
          const credentials = Buffer.from(
            `${clientId}:${clientSecret}`
          ).toString("base64");

          const res = await axios.post(
            "https://airtable.com/oauth2/v1/token",
            new URLSearchParams({
              code,
              redirect_uri: redirect_uri as string,
              grant_type: "authorization_code",
              client_id: clientId,
              code_verifier: context.checks.code_verifier,
            }),
            {
              headers: {
                Authorization: `Basic ${credentials}`,
                "Content-Type": "application/x-www-form-urlencoded",
              },
            }
          );
          return {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            tokens: res.data,
          };
        },
      },
      profile(profile: AirtableProfile) {
        return profile;
      },
      userinfo: {
        request: async ({ client, tokens }) => {
          if (!tokens.access_token) {
            throw new Error("Missing access token");
          }

          const res = await axios.get<{ id: string }>(
            "https://api.airtable.com/v0/meta/whoami",
            {
              headers: {
                Authorization: `Bearer ${tokens.access_token}`,
              },
            }
          );
          const data = res.data;

          return {
            sub: data.id,
            id: data.id,
          };
        },
      },

      checks: ["pkce", "state"],
    },
    /**
     * ...add more providers here.
     *
     * Most other providers require a bit more work than the Discord provider. For example, the
     * GitHub provider requires you to add the `refresh_token_expires_in` field to the Account
     * model. Refer to the NextAuth.js docs for the provider you want to use. Example:
     *
     * @see https://next-auth.js.org/providers/github
     */
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
