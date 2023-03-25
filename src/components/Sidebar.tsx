import type { Dispatch, SetStateAction } from "react";

const Sidebar = ({ page, setPage }: Props) => {
  return (
    <aside className="col-span-1 flex h-screen flex-col gap-10 bg-stpurple/30 px-10 py-10">
      <div className="text-2xl font-semibold text-styellow">Supertable</div>
      <div className="flex flex-col gap-4">
        <div className="text-xs font-semibold uppercase text-gray-400">
          M a i n &nbsp;&nbsp;M e n u
        </div>
        <button
          onClick={() => setPage("dashboard")}
          className={`rounded text-left font-semibold ${
            page === "dashboard" ? "text-white" : "text-gray-300"
          } transition duration-200 ease-in-out hover:text-white`}
        >
          Dashboard
        </button>
        <button
          onClick={() => setPage("settings")}
          className={`rounded text-left font-semibold ${
            page === "settings" ? "text-white" : "text-gray-300"
          } transition duration-200 ease-in-out hover:text-white`}
        >
          Settings
        </button>
      </div>
      <div className="flex flex-col gap-4">
        <div className="text-xs font-semibold uppercase text-gray-400">
          F o r m s
        </div>
        <button
          onClick={() => setPage("form")}
          className="text-left text-sm font-semibold text-gray-300 transition duration-200 ease-in-out hover:text-white"
        >
          Form 1
        </button>
        <button
          onClick={() => setPage("form")}
          className="text-left text-sm font-semibold text-gray-300 transition duration-200 ease-in-out hover:text-white"
        >
          Form 2
        </button>
      </div>
    </aside>
  );
};

interface Props {
  page: string;
  setPage: (arg0: string) => void | Dispatch<SetStateAction<string>>;
}

export default Sidebar;
