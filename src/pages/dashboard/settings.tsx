import type {
  GetServerSideProps,
  InferGetServerSidePropsType,
  NextPage,
} from "next";
import Head from "next/head";
import Settings from "~/components/Settings";
import Sidebar from "~/components/Sidebar";
import { getServerSession } from "next-auth/next";
import { authOptions } from "~/server/auth";

const SettingsPage: NextPage<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = () => {


  return (
    <div className="h-screen bg-black">
      <Head>
        <title>Supertable | Dashboard</title>
      </Head>
      <div className="h-screen bg-bg font-inter text-white">
        <div className="grid grid-cols-5 gap-4">
          <Sidebar page={"settings"}/>
          <main className="col-span-4 h-screen overflow-y-scroll">
            <Settings />
          </main>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;

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
