import { type NextPage } from "next";
import Head from "next/head";

import { api } from "~/utils/api";
import { motion } from "framer-motion";
import { signIn, signOut, useSession } from "next-auth/react";
import { useEffect } from "react";

const Home: NextPage = () => {
  const session = useSession();
  const { data, refetch } = api.example.getSchemas.useQuery(undefined, { enabled: false })


  useEffect(() => {
    if (session.data) {
      console.log(data)
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      refetch()
    }

    if (data) {
      console.log(data);
    }
  }, [data, session]);

  return (
    <>
      <Head>
        <title>Supertable | Login</title>
        <meta name="description" content="Welcome to Supertable" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="min-h-screen bg-black font-inter">
        <div className="flex min-h-screen flex-col items-center justify-center bg-[#5e08e9]/60">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            {session.data ? (
              <div className="flex flex-col text-white">
                {session.data?.user.id}
                <button
                  className="rounded bg-[#fea200] py-2 px-4 text-[#5e08e9] outline-none transition duration-200 ease-in-out hover:bg-[#ffd797] focus:bg-[#ffd797]"
                  onClick={() => {
                    // eslint-disable-next-line @typescript-eslint/no-floating-promises
                    signOut({ })
                    return
                  }}
                >
                  Logout
                </button>
              </div>
            ) : (
              <button className="rounded bg-[#fea200] py-2 px-4 text-[#5e08e9] outline-none transition duration-200 ease-in-out hover:bg-[#ffd797] focus:bg-[#ffd797]" onClick={() => {
                // eslint-disable-next-line @typescript-eslint/no-floating-promises
                signIn("airtable", {})
              }}>
                Login with Airtable
              </button>
            )}
          </motion.div>
        </div>
      </main>
    </>
  );
};

export default Home;
