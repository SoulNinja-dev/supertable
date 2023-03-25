import { useState } from "react";
import PopoverPicker from "./PopoverPicker";

const Settings = () => {
  const [color, setColor] = useState("username");

  return (
    <div className="flex flex-col gap-8 p-6 text-black">
      <div className="text-3xl font-semibold">Settings</div>
      <div className="flex flex-col gap-6">
        <div className="flex flex-row items-center justify-between text-xl font-semibold">
          <div className="flex flex-col">
            Domains
            <div className="text-sm font-semibold text-gray-400">
              Change your subdomain or connect a custom domain
            </div>
          </div>
          text-3xl 
        </div>
        <div className="flex flex-row items-center gap-20">
          <div className="flex w-80 flex-col font-semibold">
            Custom Subdomain
            <div className="text-xs font-semibold text-gray-400">
              Subdomain under which your forms will be accessible
            </div>
          </div>
          <div className="flex flex-row rounded-md font-semibold ring-2 ring-gray-300">
            <input
              className="rounded-l-md bg-white px-3 outline-none"
              placeholder="yoursubdomain"
            />
            <div className="rounded-r-md bg-gray-300 px-3 py-1.5">
              .superteam.fun
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
            />
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col text-xl font-semibold">
          Colors
          <div className="text-sm font-semibold text-gray-400">
            Change the colorscheme for your forms
          </div>
        </div>
        <div className="flex flex-row items-center gap-20">
          <div className="flex w-80 flex-col font-semibold">Theme</div>
          <div className="flex flex-row"></div>
        </div>
      </div>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col text-xl font-semibold">
          SEO
          <div className="text-sm font-semibold text-gray-400">
            Change the default SEO data for your forms
          </div>
        </div>
        <div className="flex flex-row items-center gap-20">
          <div className="flex w-80 flex-col font-semibold">
            Title
            <div className="text-xs font-semibold text-gray-400">
              The default SEO title
            </div>
          </div>
          <input
            className="rounded-md bg-white px-3 py-1.5 font-semibold outline-none ring-2 ring-gray-300"
            placeholder="Form by Superteam"
          />
        </div>
        <div className="flex flex-row items-center gap-20">
          <div className="flex w-80 flex-col font-semibold">
            Description
            <div className="text-xs font-semibold text-gray-400">
              The default SEO description
            </div>
          </div>
          <textarea
            className="w-[15.5rem] rounded-md bg-white px-3 py-1.5 text-sm font-semibold outline-none ring-2 ring-gray-300"
            placeholder="This is the description for a form by Supertable"
          ></textarea>
        </div>
        <div className="flex flex-row gap-20">
          <div className="flex w-80 flex-col font-semibold">
            Color
            <div className="text-xs font-semibold text-gray-400">
              The default SEO color(used by Discord in embeds)
            </div>
          </div>
          <PopoverPicker color={color} onChange={setColor} />
        </div>
        <div className="flex flex-row items-center gap-20">
          <div className="flex w-80 flex-col font-semibold">
            Cover Image
            <div className="text-xs font-semibold text-gray-400">
              The default SEO image
            </div>
          </div>
          <button className="rounded-md px-4 py-1.5 font-semibold ring-2 ring-gray-300 transition duration-200 ease-in-out hover:bg-gray-300/40">
            Upload
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
