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

  const { data: tableRes, refetch } = api.table.getTable.useQuery({ tableId });
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
        <title>Supertable | Dashboard</title>
      </Head>
      <div className="flex h-screen bg-white font-inter text-black overflow-y-hidden">
        <Sidebar refetchTable={refetch} />
        <main className="flex-1 relative h-screen">
          {/* Topbar */}
          <div className="w-full-bg-white h-14 border-b-2 border-gray-300 sticky top-0">
            {currentForm && (
              <div className="flex h-full items-center justify-between px-4 font-bold">
                {currentForm.title}
              </div>
            )}
          </div>

          <FormBuilder />
          
        </main>
      </div>
    </div>
  );
};

const Sidebar: React.FC<{refetchTable: () => Promise<any>}> = ({ refetchTable }) => {
  const router = useRouter();
  const [table] = useTableStore((state) => [state.table]);
  const [setForm] = useFormStore((state) => [state.setForm]);
  // const { data: forms, refetch: refetchForms } = api.form.getForms.useQuery({
  //   tableId: router.query.tableId as string,
  // });
  const { mutateAsync } = api.form.createForm.useMutation();
  const { data: currentForm, mutateAsync: fetchCurrentForm } =
    api.form.getForm.useMutation();

  const handleCreateForm = async () => {
    const res = await mutateAsync({
      tableId: router.query.tableId as string,
      baseId: router.query.baseId as string,
      title: "Untitled Form",
      description: "No description",
    });
    await refetchTable();
    handleSelectForm(res.id);
  };

  const handleSelectForm = async (formId: string) => {
    const currentForm = await fetchCurrentForm({ formId });
    setForm(currentForm);
    // add query param formid to url
    router.push(
      `/dashboard/${router.query.baseId}/${router.query.tableId}?formId=${formId}`,
      undefined,
      { shallow: true }
    );
  };

  useEffect(() => {
    if (!currentForm) {
      if (router.query.formId) {
        handleSelectForm(router.query.formId as string);
      } else if (table.forms && table.forms[0]) {
        handleSelectForm(table.forms[0].id);
      }
    }
  }, [router.query]);

  return (
    <div className="flex h-full w-64 flex-col items-center justify-between border-r-2 border-gray-300 bg-white">
      <div className="flex h-20 w-full flex-col justify-start px-4 pt-20">
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
        <div className="mt-10 flex flex-col items-start gap-y-5">
          <button
            className="flex w-full items-center gap-x-2 rounded-lg border-[2px] border-black px-4 py-2"
            onClick={handleCreateForm}
          >
            <Image src="/plus.svg" width={20} height={20} alt="Adding" />
            Create Form
          </button>
          {table && table.forms?.map((form) => (
            <button
              className={`flex w-full items-center gap-x-2 rounded-lg py-2 px-4 transition-colors duration-100 ease-in-out hover:bg-gray-100
                ${currentForm?.id === form.id ? "bg-gray-100" : ""}
              `}
              key={form.id}
              onClick={() => handleSelectForm(form.id)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                className="feather feather-table"
                viewBox="0 0 24 24"
              >
                <path d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18"></path>
              </svg>
              {form.title}
            </button>
          ))}
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
