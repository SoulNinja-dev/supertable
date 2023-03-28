import { GetServerSideProps, NextPage } from "next";
import { getServerSession } from "next-auth";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { authOptions } from "~/server/auth";
import { api } from "~/utils/api";

const TablePage: NextPage<{ baseId: string, tableId: string }> = ({ baseId, tableId }) => {
  const router = useRouter();
  console.log()
  const { data  } = api.base.getTable.useQuery({ baseId, tableId }, {
    retry: false,
  });


  useEffect(() => {
    console.log(data)
  }, [data])



  return (
    <div className="h-screen">
      <Head>
        <title>Supertable | Dashboard</title>
      </Head>
      <div className="flex h-screen bg-white font-inter text-black">
        <Sidebar/>
        hi
      </div>
    </div>
  );
};

const Sidebar = () => {
  return (
    <div className="flex h-full w-64 flex-col items-center justify-between bg-sidebar">
      <div className="flex h-20 w-full flex-col items-center justify-center"></div>
    </div>
  );
};


export const getServerSideProps: GetServerSideProps<{ baseId: string, tableId: string }> = async (context) => {
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
      tableId: context.query.tableId as string
    },
  }
};

export default TablePage;
