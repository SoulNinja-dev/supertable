import { GetServerSideProps, NextPage } from "next";
import { getServerSession } from "next-auth";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect } from "react";
import dynamic from "next/dynamic";

import { authOptions } from "~/server/auth";
import { useTableStore } from "~/stores/tableStore";
import { api } from "~/utils/api";
import { useFormStore } from "~/stores/formStore";
import Navbar from "~/components/Navbar";
import Sidebar from "~/components/Sidebar";

const FormBuilder = dynamic(() => import("~/components/FormBuilder"), {
  ssr: false,
});



const TablePage: NextPage<{ baseId: string; tableId: string }> = ({
  baseId,
  tableId,
}) => {
  const router = useRouter();
  const [setTable, setLoading] = useTableStore((state) => [
    state.setTable,
    state.setLoading,
  ]);

  const {
    data: tableRes,
    refetch,
    isInitialLoading,
  } = api.table.getTable.useQuery({ tableId });
  const [currentForm] = useFormStore((state) => [state.form]);

  useEffect(() => {
    if (tableRes) {
      setTable(tableRes);
      setLoading(false);
    }
  }, [tableRes]);

  return (
    <div className="h-screen">
      <Head>
        <title>Supertable | Form</title>
      </Head>
      <div className="h-screen overflow-hidden">
        <Navbar />
        <div className="grid grid-cols-5 gap-4">
          <Sidebar page="table" refetchTable={refetch as any} />
          <main className="h-[calc(100vh-268px)] flex-1 col-span-4">
            
             {!currentForm.id && !isInitialLoading && (
               <div className="flex h-2/3 w-full items-center justify-center">
                 {"No forms available :("}
               </div>
            )}
            {isInitialLoading && (
              <div className="flex h-2/3 w-full items-center justify-center">
                <svg
                  className="-ml-1 mr-3 h-6 w-6 animate-spin text-[#a09c9b]"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-100"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-50"
                    fill="#000"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              </div>
            )}
            {currentForm.id && <FormBuilder />}
          </main>
        </div>
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
