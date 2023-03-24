import { type NextPage } from "next";
import Head from "next/head";

import { api } from "~/utils/api";
import { motion } from "framer-motion";

const Home: NextPage = () => {
  const handleClick = async (e: any) => {
    e.preventDefault();
    location.href = `http://localhost:3000/api/auth/redirect`;
  };

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
            <button
              className="rounded bg-[#fea200] py-2 px-4 text-[#5e08e9] outline-none transition duration-200 ease-in-out hover:bg-[#ffd797] focus:bg-[#ffd797]"
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
