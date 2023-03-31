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

const FormBuilder = dynamic(() => import("~/components/FormBuilder"), {
  ssr: false,
});

const TablePage: NextPage<{ baseId: string; tableId: string }> = ({
  baseId,
  tableId,
}) => {
  const router = useRouter();
  const [setTable] = useTableStore((state) => [state.setTable]);

  // const { data: res } = api.table.getTable.useQuery(
  //   { tableId },
  //   {
  //     retry: false,
  //   }
  // );

  // console.log("GET TABLE: ", res);

  // const { data } = api.table.editTable.useQuery({
  //   id: tableId,
  //   seoImage: "urmomlol.png",
  //   theme: "blue",
  // });

  // console.log("EDIT TABLE: ", data);

  // useEffect(() => {
  //   if (data) {
  //     setTable(data);
  //   }
  // }, [data]);

  // form stuff

  // create form
  // const { data: createForm } = api.form.createForm.useQuery({
  //   tableId: tableId,
  //   baseId: baseId,
  //   title: "users form",
  //   description: "beta users not sigma :(",
  // });

  // console.log("CREATE FORM: ", createForm);

  // get forms
  // const { data: getForms } = api.form.getForms.useQuery({
  //   tableId: tableId,
  // });
  // console.log("GET FORMS: ", getForms);

  // get form
  // const { data: getForm } = api.form.getForm.useQuery({
  //   formId: "clfvmin74000g5iozftoaq8r1",
  // });
  // console.log("GET FORM: ", getForm);

  // edit form
  // const { data: editForm } = api.form.editForm.useQuery(
  //   {
  //     formId: "clfvmin74000g5iozftoaq8r1",
  //     title: "not users form",
  //     slug: "not-users-form",
  //   },
  //   {
  //     retry: false,
  //   }
  // );
  // console.log("EDIT FORM: ", editForm);

  // delete form :pray:
  const { data: deleteForm } = api.form.deleteForm.useQuery(
    {
      formId: "clfvmjy32000m5ioz4clyzpyl",
      baseId: baseId,
    },
    { retry: false }
  );
  console.log("DELETE FORM: ", deleteForm);

  return (
    <div className="h-screen">
      <Head>
        <title>Supertable | Dashboard</title>
      </Head>
      <div className="flex h-screen bg-white font-inter text-black">
        <Sidebar />
        <main className="flex-1">
          {/* Topbar */}
          <div className="w-full-bg-white h-14 border-b-2 border-gray-300"></div>

          <FormBuilder />
        </main>
      </div>
    </div>
  );
};

const Sidebar = () => {
  const router = useRouter();
  const [table] = useTableStore((state) => [state.table]);
  return (
    <div className="flex h-full w-64 flex-col items-center justify-between border-r-2 border-gray-300 bg-white">
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
        <div className="flex flex-col">
          <button className="border-">

          </button>
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
