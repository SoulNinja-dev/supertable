import { type NextPage } from "next";
import Head from "next/head";

import { motion } from "framer-motion";

const Home: NextPage = () => {
  const handleClick = () => {
    location.href = `${window.location.origin}/api/auth/redirect`;
  };

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
            <button
              className="rounded bg-black py-2 px-4 font-semibold text-white outline-none transition duration-200 ease-in-out hover:bg-black/60 focus:bg-black/60"
              onClick={handleClick}
            >
              Login with Airtable
            </button>
          </motion.div>
        </div>
      </main>
    </>
  );
};

export default Home;
