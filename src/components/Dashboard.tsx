import React, { useEffect, useRef, useState } from "react";
import { BaseObject } from "~/server/api/routers/base";
import { api } from "~/utils/api";
import TableCard from "./TableCard";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { useClickOutside } from "~/hooks/useClickOutside";
import Link from "next/link";

const DashboardComponent = () => {
  const { data, error, isLoading, refetch } = api.base.listBases.useQuery();
  const { mutateAsync: reloadBases, isLoading: isReloadingBases } =
    api.base.reloadBases.useMutation();
  const [searchInput, setSearchInput] = useState("");

  const handleReloadBases = async () => {
    await reloadBases();
    refetch();
  };

  return (
    <div className="flex flex-col gap-8 p-10 text-black">
      <div className="flex flex-row items-center justify-between text-2xl font-bold">
        <div className="flex items-center gap-x-3">
          Dashboard{" "}
          {data && (
            <span className="text-base font-medium text-[#666666]">
              ({data.bases.length} bases)
            </span>
          )}
          {isReloadingBases ? (
            <svg
              className="h-5 w-5 animate-spin text-[#666666]"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              ></path>
            </svg>
          ) : (
            <button
              className="rounded-md bg-accent py-1 px-3 text-sm font-medium transition duration-100 ease-in hover:opacity-80"
              onClick={handleReloadBases}
            >
              Reload
            </button>
          )}
        </div>
        <div className="flex flex-row items-center gap-2 rounded-md border bg-[#f9f9f9] py-2 px-3 text-[#666666]">
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g clipPath="url(#clip0_862_726)">
              <path
                d="M12.0206 11.078L14.8759 13.9327L13.9326 14.876L11.0779 12.0207C10.0157 12.8721 8.69459 13.3353 7.33325 13.3333C4.02125 13.3333 1.33325 10.6453 1.33325 7.33333C1.33325 4.02133 4.02125 1.33333 7.33325 1.33333C10.6453 1.33333 13.3333 4.02133 13.3333 7.33333C13.3352 8.69466 12.8721 10.0158 12.0206 11.078ZM10.6833 10.5833C11.5293 9.71325 12.0018 8.54695 11.9999 7.33333C11.9999 4.75466 9.91125 2.66666 7.33325 2.66666C4.75459 2.66666 2.66659 4.75466 2.66659 7.33333C2.66659 9.91133 4.75459 12 7.33325 12C8.54687 12.0019 9.71318 11.5294 10.5833 10.6833L10.6833 10.5833Z"
                fill="#666666"
              />
            </g>
            <defs>
              <clipPath id="clip0_862_726">
                <rect width="16" height="16" rx="6" fill="white" />
              </clipPath>
            </defs>
          </svg>
          <input
            className="bg-transparent text-base font-medium outline-none"
            placeholder="Search for forms"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
        </div>
      </div>

      {!isLoading && data && (
        <div className="flex flex-wrap gap-4">
          {data.bases
            .filter((base) =>
              base.name.toLowerCase().includes(searchInput.toLowerCase())
            )
            .map((base) => (
              <BaseSection key={base.id} {...base} />
            ))}{" "}
        </div>
      )}

      {!isLoading && data && data.bases.length === 0 && (
        <div className="mt-10 flex w-full justify-center">
          <h1 className="max-w-[500px] text-center text-3xl">
            You don't have any bases yet. Try Reloading or Create one on Airtable and Try again
          </h1>
        </div>
      )}

      {isLoading && (
        <div className="flex h-[calc(100vh-268px)] w-full items-center justify-center">
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
    </div>
  );
};

const BaseSection: React.FC<BaseObject> = ({ id: baseId, name }) => {
  const [showTableModal, setShowTableModal] = useState(false);

  const handleOpenTableModal = () => setShowTableModal(true);
  const handleCloseTableModal = () => setShowTableModal(false);

  return (
    <>
      <div
        className="flex cursor-pointer gap-x-4 overflow-hidden rounded-lg bg-gray-100 transition-shadow duration-200 ease-in-out hover:shadow-md"
        onClick={handleOpenTableModal}
      >
        <Image
          src={`https://picsum.photos/seed/${baseId}/60/60`}
          alt={name}
          width={60}
          height={60}
          className=" w-full"
        />

        <div className="py-4 pr-6">{name}</div>
      </div>
      <AnimatePresence>
        {showTableModal && (
          <TablesModal
            baseId={baseId}
            handleClose={handleCloseTableModal}
            baseName={name}
          />
        )}
      </AnimatePresence>
    </>
  );
};

const TablesModal: React.FC<{
  baseId: string;
  handleClose: () => void;
  baseName: string;
}> = ({ baseId, handleClose, baseName }) => {
  const { data, refetch, isLoading } = api.table.getTables.useQuery({ baseId });
  const { mutateAsync: reloadTables, isLoading: isReloadingTables  } = api.table.reloadTables.useMutation();
  const ref = useRef<HTMLDivElement>(null);

  useClickOutside(ref, handleClose);

  const handleReloadTables = async () => {
    await reloadTables({baseId});
    await refetch();
  }
  
  useEffect(() => {
    if (data?.tables.length === 0) {
      handleReloadTables();
    }
  }, [data]);

  return (
    <motion.div className="absolute top-0 left-0 flex h-screen w-screen items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 100 }}
        transition={{ duration: 0.2 }}
        ref={ref}
        className="h-[500px] w-[500px] rounded-xl bg-gray-200 p-6 shadow-xl"
      >
        <h3 className="text-2xl flex gap-x-2 items-center">
          {data?.tables.length} tables in {baseName}
          {isReloadingTables ? (
            <svg
              className="h-5 w-5 animate-spin text-[#666666]"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              ></path>
            </svg>
          ) : (
            <button
              className="rounded-md bg-gray-400 text-white py-1 px-3 text-sm font-medium transition duration-100 ease-in hover:opacity-80"
              onClick={handleReloadTables}
            >
              Reload
            </button>
          )}
        </h3>
        <div className="mt-4 flex flex-col gap-y-2 overflow-y-scroll">
          {data?.tables.map((table) => (
            <Link
              href={`/dashboard/${baseId}/${table.id}`}
              key={table.id}
              className="duration-50 rounded-md bg-white px-4 py-2 transition ease-in-out hover:bg-gray-50"
            >
              {table.name}
            </Link>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default DashboardComponent;
