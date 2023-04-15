import { signOut } from "next-auth/react";
import Link from "next/link";
import { Logout, Search, Home, Setting } from "react-iconly";

const Sidebar = ({ page }: Props) => {
  return (
    <aside className="col-span-1 flex h-screen flex-col gap-8 bg-accent/[0.12] px-5 py-10 text-white">
      <div className="flex flex-row items-center justify-between">
        <div className="flex flex-row items-center gap-2 text-xl font-semibold text-white">
          <img src="/supertable.svg" className="h-8 w-8" />
          Supertable
        </div>
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="rounded-md p-1.5 text-white outline-none transition duration-300 ease-in-out hover:bg-white/[0.15] focus:bg-white/[0.15]"
        >
          <Logout size={22} set="light" primaryColor="white" />
        </button>
      </div>
      <div className="flex flex-row items-center gap-2 rounded-lg bg-bg py-2 px-3">
        <Search set="light" primaryColor="white" size={18} />
        <input
          className="bg-bg font-semibold outline-none"
          placeholder="Search"
        />
      </div>
      <div className="text-xs font-semibold uppercase text-gray-300">
        M a i n&nbsp;&nbsp;&nbsp;M e n u
      </div>
      <div className="flex flex-col gap-4">
        <Link
          href="/dashboard"
          className={`flex flex-row items-center gap-2 rounded-lg px-2 py-2 transition duration-300 ease-in-out ${
            page === "dashboard"
              ? "bg-white/[0.15]"
              : "hover:bg-white/[0.15] focus:bg-white/[0.15]"
          }`}
        >
          <Home set="light" primaryColor="white" />
          Dashboard
        </Link>
        <Link
          href="/dashboard/settings"
          className={`flex flex-row items-center gap-2 rounded-lg px-2 py-2 transition duration-300 ease-in-out ${
            page === "settings"
              ? "bg-white/[0.15]"
              : "hover:bg-white/[0.15] focus:bg-white/[0.15]"
          }`}
        >
          <Setting set="light" primaryColor="white" />
          Settings
        </Link>
      </div>
    </aside>
  );
};

interface Props {
  page: string;
}

interface Base {
  id: string;
  name: string;
  permissionLevel: string;
}

export default Sidebar;
