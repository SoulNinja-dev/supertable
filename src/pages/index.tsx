import type {
  GetServerSideProps,
  InferGetServerSidePropsType,
  NextPage,
} from "next";
import Head from "next/head";

import { motion } from "framer-motion";
import { signIn, signOut, useSession } from "next-auth/react";
import { getServerSession } from "next-auth";
import { authOptions } from "~/server/auth";
import toast from "react-hot-toast";
import { useRouter } from "next/router";
import { useEffect } from "react";

const Home: NextPage<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = () => {
  const session = useSession();
  const router = useRouter();
  const { error } = router.query;

  useEffect(() => {
    error ? toast.error(error as string) : null;
  }, []);

  return (
    <>
      
      <Head>
        <title>Supertable | Login</title>
        <meta name="description" content="Welcome to Supertable" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="min-h-screen bg-white font-inter">
        <div className="flex min-h-screen flex-col items-center justify-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            {session.data?.user ? (
              <span>Logged in as {session.data.user.id}</span>
            ) : (
              <button
                className="rounded bg-black py-2 px-4 font-semibold text-white outline-none transition duration-200 ease-in-out hover:bg-black/60 focus:bg-black/60"
                onClick={() => {
                  signIn("airtable").catch((e) => {
                    console.log(e);
                  });
                }}
              >
                Login with Airtable
              </button>
            )}
          </motion.div>
        </div>
        <div></div>
      </main>
    </>
  );
};

export const getServerSideProps: GetServerSideProps<{ data: string }> = async (
  context
) => {
  const session = await getServerSession(context.req, context.res, authOptions);
  if (context.params?.signout) {
    signOut({ callbackUrl: "/" });
  }

  if (session?.user) {
    return {
      redirect: {
        destination: "/dashboard",
        permanent: false,
      },
    };
  }
  return {
    props: {
      data: "200",
    },
  };
};

export default Home;
