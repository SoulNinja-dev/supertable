import { useEffect, useState } from "react";
import { useDebounceCallback } from "~/hooks/useDelayedRequest";
import PopoverPicker from "./PopoverPicker";

import SingleSelect from "~/components/SingleSelect";
import { api } from "~/utils/api";
import { FullTableObject } from "~/models/table";

const Settings = () => {
  const [selected, setSelected] = useState(0);
  const { data: tables } = api.table.getAllTableInfos.useQuery();
  
  

  const handleBaseChange = (index: number) => {
    setSelected(index);
  };

  return (
    <div className="flex flex-col gap-8 p-6 text-black">
      <div className="flex w-full justify-between">
        <div className="text-3xl font-semibold ">Settings</div>
        <div>
          Choose Table
          <SingleSelect
            options={tables?.map((table) => table.name) ?? []}
            placeholder="choose base"
            selected={selected}
            setSelected={handleBaseChange}
            register={(_: string, __: boolean) => {
              return;
            }}
            registerDataA=""
            registerDataB={false}
            themeData={{
              bgColor: "#ffffff",
              inputBgColor: "#f2f2f2",
              popupColor: "#fafafa",
              placeholderColor: "",
              textColor: "#000000",
              buttonColor: "#000000",
              borderFocusedColor: "#000000",
              borderColor: "#aeaeae",
            }}
          />
        </div>
      </div>

      {
        tables && tables[selected] && (
          <SettingsForm tableId={tables[selected]?.id as string} />
        )
      }
    </div>
  );
};

const SettingsForm: React.FC<{ tableId: string }> = ({ tableId }) => {
  const { data: table, isLoading } = api.table.getTable.useQuery({tableId});
  const { mutateAsync } = api.table.editTable.useMutation();
  const [tableData, setTableData] = useState<FullTableObject | null>(null);

  const debounceCustomDomain = useDebounceCallback(500);

  const handleDomainChange = (domain: string) => {
    if (!tableData) return;
    console.log(domain);
    setTableData({
      ...tableData,
      customDomain: domain,
    });
    debounceCustomDomain(() => {
      mutateAsync({
        id: tableId,
        customDomain: domain,
      });
    });
  }

  useEffect(() => {
    if (!isLoading && table) setTableData(table);
  }, [table, isLoading])

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-row items-center justify-between text-xl font-semibold">
        <div className="flex flex-col">
          Domains
          <div className="text-sm font-semibold text-gray-400">
            Change your subdomain or connect a custom domain
          </div>
        </div>
      </div>

      <div className="flex flex-row items-center gap-20">
        <div className="flex w-80 flex-col font-semibold">
          Custom Domain
          <div className="text-xs font-semibold text-gray-400">
            Host the forms on your own domain
          </div>
        </div>
        <div className="flex flex-row rounded-md font-semibold ring-2 ring-gray-300">
          <div className="rounded-l-md bg-gray-300 px-3 py-1.5">https://</div>
          <input
            className="rounded-r-md bg-white px-3 outline-none"
            placeholder="yourdomain.com"
            value={tableData?.customDomain ?? ""}
            onChange={
              (e) => handleDomainChange(e.target.value)
            }
          />
        </div>
      </div>
    </div>
  );
};

export default Settings;
