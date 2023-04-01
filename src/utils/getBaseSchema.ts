import { TRPCError } from "@trpc/server";
import axios from "axios";

export default async ({
  accessToken,
  baseId,
}: {
  accessToken: string;
  baseId: string;
}) => {
  try {
    const url = `https://api.airtable.com/v0/meta/bases/${baseId}/tables`;
    const res = await axios.get<{
      tables: {
        description: string;
        id: string;
        name: string;
        primaryField: string;
        fields: {
          type: string;
          id: string;
          name: string;
          description?: string;
          options?: any;
        }[];
      }[];
    }>(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return res.data.tables;
  } catch (e: any) {
    console.log(JSON.stringify(e));
    throw new TRPCError({
      message: "Error fetching base schemas",
      code: "BAD_REQUEST",
    });
  }
};
