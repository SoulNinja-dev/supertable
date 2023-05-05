import React from "react";
import { BaseObject } from "~/server/api/routers/base";
import { api } from "~/utils/api";
import TableCard from "./TableCard";

const DashboardComponent = () => {
  const { data } = api.base.getBases.useQuery();

  return (
    <div className="flex flex-col gap-8 p-10 text-black">
      <div className="flex flex-row items-center justify-between text-2xl font-bold">
        Dashboard
        <div className="flex flex-row items-center gap-2 rounded-md bg-[#f9f9f9] py-2 px-3 text-[#666666]">
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
            className="bg-transparent text-base font-medium"
            placeholder="Search for forms"
          />
        </div>
      </div>
      {/* <div className="flex font-semibold h-[calc(100vh-268px)] flex-col items-center justify-center gap-3">
        <svg
          width="65"
          height="64"
          viewBox="0 0 65 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M29.8333 29.3333V13.3333H35.1666V29.3333H51.1666V34.6667H35.1666V50.6667H29.8333V34.6667H13.8333V29.3333H29.8333Z"
            fill="#F5A60B"
          />
        </svg>
        <div className="text-2xl font-bold">You don&apos;t have any form yet!</div>
        <div className="text-[#666666]">
          Create a new form or select a different table to see forms here.
        </div>
        <button className="flex flex-row items-center gap-2 rounded-lg bg-black py-2 px-3 text-white">
          <svg
            width="20"
            height="20"
            viewBox="0 0 18 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M8.25 8.25V3.75H9.75V8.25H14.25V9.75H9.75V14.25H8.25V9.75H3.75V8.25H8.25Z"
              fill="#F5A60B"
            />
          </svg>
          Create Form
        </button>
      </div> */}

      {data ? (
        data.bases.map((base) => <BaseSection key={base.id} {...base} />)
      ) : (
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
  const { data } = api.table.getTables.useQuery({ baseId });
  return (
    <div>
      <h3 className="text-4xl mb-4">{name}</h3>

      <div>
        {data ? (
          <div className="flex flex-row flex-wrap items-stretch gap-6">
            {data &&
              data.tables.map(({ name, id, description }) => (
                <TableCard
                  baseId={baseId}
                  name={name}
                  desc={description}
                  id={id}
                  key={id}
                />
              ))}
          </div>
        ) : (
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
    </div>
  );
};

export default DashboardComponent;
