import React from "react";
import { BaseObject } from "~/server/api/routers/base";
import { api } from "~/utils/api";
import TableCard from "./TableCard";

const DashboardComponent = () => {
  const { data } = api.base.getBases.useQuery();

  return (
    <div className="flex flex-col gap-8 p-6 text-black">
      <div className="flex flex-row items-center justify-between text-3xl font-semibold">
        Dashboard
        <div className="flex w-64 flex-row items-center gap-2 overflow-hidden rounded-md bg-white px-3 py-1.5 text-base font-semibold text-black ring-2 ring-gray-300">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="h-5 w-5 stroke-gray-400"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
            />
          </svg>
          <input
            placeholder="Search..."
            className="w-48 bg-white outline-none"
          />
        </div>
      </div>
      {data &&
        data.bases.map((base) => <BaseSection key={base.id} {...base} />)}
    </div>
  );
};

const BaseSection: React.FC<BaseObject> = ({ id: baseId, name }) => {
  const { data } = api.base.getTables.useQuery({ baseId });
  return (
    <div>
      <div className="mb-4 text-2xl font-semibold">{name}</div>
      <div className="flex flex-row flex-wrap items-stretch gap-6">
        {data &&
          data.tables.map(({ name, id, description }) => (
            <TableCard baseId={baseId} name={name} desc={description} id={id} key={id} />
          ))}
      </div>
    </div>
  );
};

export default DashboardComponent;
