import { TRPCError } from "@trpc/server";
import axios from "axios";

export default async ({ accessToken }: { accessToken: string }) => {
  try {
    const res = await axios.get("https://api.airtable.com/v0/meta/bases", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return res.data;
  } catch (e: any) {
    console.log(JSON.stringify(e));
    throw new TRPCError({
      message: "Error fetching bases",
      code: "BAD_REQUEST",
    });
  }
};
