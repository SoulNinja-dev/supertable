import { AnimatePresence, motion } from "framer-motion";
import { GetServerSideProps, NextPage } from "next";
import { getServerSession } from "next-auth";
import Head from "next/head";
import { useRouter } from "next/router";
import { useState } from "react";
import { userRouter } from "~/server/api/routers/user";
import { authOptions, getServerAuthSession } from "~/server/auth";
import { prisma } from "~/server/db";
import { api } from "~/utils/api";

const AirtableConfigPage: NextPage = () => {
  const [value, setValue] = useState("");
  const router = useRouter()
  const { mutate, isLoading } =
    api.user.updateAirtableAccessToken.useMutation({
      onSuccess(data, variables, context) {
          router.push("/dashboard")
      },
    });

  const handleSave = async () => {
    try {
      mutate(value);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Head>
        <title>Supertable | Login</title>
        <meta name="description" content="Welcome to Supertable" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="min-h-screen bg-bg font-manrope">
        <div className="flex min-h-screen flex-col items-center justify-center">
            <p className="text-gray-500 max-w-md w-full mb-2 ml-4 text-sm">
              Get your token  <a href="https://airtable.com/create/tokens" className="text-blue-600 underline hover:text-blue-700 hover:no-underline" target="_blank" rel="noopener noreferrer">here</a>
            </p>
          <input
            type="text"
            placeholder="Enter Airtable Personal Token"
            className="w-full max-w-md rounded-[12px] border-2 border-slate-400 px-5 py-2"
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
          <div className="w-full max-w-md">
            <AnimatePresence>
              {value && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ duration: 0.2 }}
                  className="top- absolute w-full max-w-md"
                >
                  <button
                    disabled={isLoading}
                    onClick={handleSave}
                    className="mt-4 w-full max-w-md rounded-[12px] bg-blue-400 py-2 px-5 text-lg font-semibold text-white transition-colors duration-200 ease-in-out hover:bg-blue-500"
                  >
                    {
                      isLoading ? "Saving..." : "Save"
                    }
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const redirect = !!context.query.redirect;
  const session = await getServerSession(context.req, context.res, authOptions);
  console.log("Session:", session);
  if (!session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  const userApi = userRouter.createCaller({
    session: session,
    prisma: prisma,
  });

  const res = await userApi.verifyAirtable();

  if (res && redirect) {
      return {
        redirect: {
          destination: "/dashboard",
          permanent: false,
        },
      };
  } else {
    
    return {
      props: {},
    };
  }
};

export default AirtableConfigPage;
