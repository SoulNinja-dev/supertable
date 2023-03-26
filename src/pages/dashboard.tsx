import type {
  GetServerSideProps,
  InferGetServerSidePropsType,
  NextPage,
} from "next";
import Head from "next/head";
import { useState } from "react";
import Settings from "~/components/Settings";
import DashboardComponent from "~/components/Dashboard";
import Sidebar from "~/components/Sidebar";
import { getServerSession } from "next-auth/next";
import { authOptions } from "~/server/auth";
import { api } from "~/utils/api";

const Dashboard: NextPage<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = () => {
  const [page, setPage] = useState<"dashboard" | "settings" | "form">("form");
  const [form, setForm] = useState<string>();

  const { data, isFetching, error } = api.base.getSchemas.useQuery();

  return (
    <div className="h-screen bg-black">
      <Head>
        <title>Supertable | Dashboard</title>
      </Head>
      <div className="h-screen bg-white font-inter text-white">
        <div className="grid grid-cols-5 gap-4">
          <Sidebar page={page} setPage={setPage} />
          <main className="col-span-4 h-screen overflow-y-scroll">
            {page === "dashboard" ? (
              <DashboardComponent />
            ) : page === "settings" ? (
              <Settings />
            ) : (
              <>
                <div className="text-center text-black">
                  {isFetching
                    ? "loading..."
                    : error
                    ? JSON.stringify(error)
                    : JSON.stringify(data)}
                </div>
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getServerSession(context.req, context.res, authOptions);

  if (!session?.user) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
};
