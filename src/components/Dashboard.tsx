import React from "react";
import { BaseObject } from "~/server/api/routers/base";
import { api } from "~/utils/api";
import TableCard from "./TableCard";

const DashboardComponent = () => {
  const { data } = api.base.getBases.useQuery();

  return (
    <div className="flex flex-col gap-8 p-6 text-black">
      {data ? (
        data.bases.map((base) => <BaseSection key={base.id} {...base} />)
      ) : (
        <div className="flex h-96 w-full items-center justify-center">
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
      <div className="mb-4 text-2xl font-semibold">{name}</div>
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
        <div className="flex h-96 w-full items-center justify-center">
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

export default DashboardComponent;
