import { GetServerSideProps, NextPage } from "next";
import { getServerSession } from "next-auth";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { authOptions } from "~/server/auth";
import { useTableStore } from "~/stores/tableStore";
import { api } from "~/utils/api";

const TablePage: NextPage<{ baseId: string; tableId: string }> = ({
  baseId,
  tableId,
}) => {
  const router = useRouter();
  const [setTable] = useTableStore((state) => [state.setTable]);

  // const { data } = api.base.getTable.useQuery(
  //   { baseId, tableId },
  //   {
  //     retry: false,
  //   }
  // );

  // useEffect(() => {
  //   if (data) {
  //     setTable(data);
  //   }
  // }, [data]);

  return (
    <div className="h-screen">
      <Head>
        <title>Supertable | Dashboard</title>
      </Head>
      <div className="flex h-screen bg-white font-inter text-black">
        <Sidebar />
        hi
      </div>
    </div>
  );
};

const Sidebar = () => {
  const router = useRouter();
  const [table] = useTableStore((state) => [state.table]);
  return (
    <div className="flex h-full w-64 flex-col items-center justify-between bg-sidebar">
      <div className="flex h-20 w-full flex-col justify-center px-8 pt-20">
        <Link
          className="flex cursor-pointer items-center text-lg"
          href="/dashboard"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="black"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="feather feather-chevron-right rotate-180"
          >
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
          {table.name}
        </Link>
      </div>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps<{
  baseId: string;
  tableId: string;
}> = async (context) => {
  const session = await getServerSession(context.req, context.res, authOptions);
  if (!session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  // Return query params baseId and tableId

  return {
    props: {
      baseId: context.query.baseId as string,
      tableId: context.query.tableId as string,
    },
  };
};

export default TablePage;
