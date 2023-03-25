import type { NextPage } from "next";
import Head from "next/head";
import { useState } from "react";
import Settings from "~/components/Settings";
import DashboardComponent from "~/components/Dashboard";
import Sidebar from "~/components/Sidebar";

const Dashboard: NextPage = () => {
  const [page, setPage] = useState<"dashboard" | "settings" | "form">(
    "settings"
  );
  const [form, setForm] = useState<string>();

  return (
    <div className="h-screen bg-black">
      <Head>
        <title>Supertable | Dashboard</title>
      </Head>
      <div className="h-screen bg-white font-inter text-white">
        <div className="grid grid-cols-5 gap-4">
          <Sidebar page={page} setPage={setPage} />
          <main className="col-span-4 h-screen overflow-y-scroll">
            {page === "dashboard" ? (
              <DashboardComponent />
            ) : page === "settings" ? (
              <Settings />
            ) : (
              <></>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
