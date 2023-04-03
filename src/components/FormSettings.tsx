import { useMemo, useState } from "react";
import { useDebounceCallback } from "~/hooks/useDelayedRequest";
import { useFormStore } from "~/stores/formStore";
import { api } from "~/utils/api";
import { AnimatePresence, motion } from "framer-motion";
import OutsideClickHandler from "react-outside-click-handler";
import { Theme } from "@prisma/client";
import { themes } from "~/utils/themes";
import PopoverPicker from "./PopoverPicker";

const FormSettings = () => {
  const [form] = useFormStore((state) => [state.form]);
  const [setForm] = useFormStore((state) => [state.setForm]);
  const { mutateAsync: editForm } = api.form.editForm.useMutation();
  // const debounceUpdateFormTitle = useDebounceCallback(500);
  // const debounceUpdateFormDescription = useDebounceCallback(500);

  return (
    <div className="flex w-full justify-center bg-sidebar py-6 px-10">
      <div className="w-full max-w-2xl">
        <div className="flex flex-col gap-8 p-6 text-black">
          <div className="text-3xl font-semibold">Form Settings</div>
          <div className="flex flex-col gap-6">
            <div className="flex flex-col text-xl font-semibold">
              Colors
              <div className="text-sm font-semibold text-gray-400">
                Change the colorscheme for your forms
              </div>
            </div>
            <div className="flex flex-row items-center gap-20">
              <div className="flex w-80 flex-col font-semibold">Theme</div>
              <div className="flex flex-row">
                <SelectTheme />
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-6">
            {/* <div className="flex flex-col text-xl font-semibold">
              SEO
              <div className="text-sm font-semibold text-gray-400">
                Change the default SEO data for your forms
              </div>
            </div> */}
            {/* <div className="flex flex-col gap-y-5">
              <div className="flex w-80 flex-col font-semibold">
                Title
                <div className="text-xs font-semibold text-gray-400">
                  The default SEO title
                </div>
              </div>
              <input
                value={form.title || ""}
                className="rounded-md bg-white px-3 py-1.5 font-semibold outline-none ring-2 ring-gray-300"
                placeholder="Form by Superteam"
              />
            </div>
            <div className="flex flex-col gap-y-5">
              <div className="flex w-80 flex-col font-semibold">
                Description
                <div className="text-xs font-semibold text-gray-400">
                  The default SEO description
                </div>
              </div>
              <textarea
                className="w-full rounded-md bg-white px-3 py-1.5 text-sm font-semibold outline-none ring-2 ring-gray-300"
                placeholder="This is the description for a form by Supertable"
                rows={5}
              ></textarea>
            </div> */}
            {/* <div className="flex flex-row gap-20">
              <div className="flex w-80 flex-col font-semibold">
                Color
                <div className="text-xs font-semibold text-gray-400">
                  The default SEO color(used by Discord in embeds)
                </div>
              </div>
              
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
};

const SelectTheme = () => {
  const [form, setForm] = useFormStore((state) => [state.form, state.setForm]);
  const { mutateAsync: editForm } = api.form.editForm.useMutation();
  const [showDropdown, setShowDropdown] = useState(false);
  const themeOptions = useMemo(() => Object.keys(themes), []);

  const handleSelectTheme = async (theme: Theme) => {
    await editForm({
      formId: form.id,
      theme: theme,
    });

    setForm({
      ...form,
      theme: theme,
    });
  };

  const handleColorChange = async (color: string) => {
    await editForm({
      formId: form.id,
      themeColor: color,
    });

    setForm({
      ...form,
      themeColor: color,
    });
  };

  return (
    <div className="relative">
      <div className="flex gap-x-4 items-center">
        {form.theme === "monochromatic" && (
          <PopoverPicker
            color={form.themeColor || "#3F51B5"}
            onChange={(color) => {
              handleColorChange(color);
            }}
          />
        )}
        <button
          id="dropdownHoverButton"
          data-dropdown-toggle="dropdownHover"
          data-dropdown-trigger="hover"
          className="inline-flex w-40 items-center justify-between rounded-lg  bg-gray-200 px-4 py-2 text-center text-sm font-medium capitalize text-black hover:bg-gray-300/50 focus:outline-none  focus:ring-4 focus:ring-gray-300"
          type="button"
          onClick={() => setShowDropdown(!showDropdown)}
        >
          <span>{form.theme}</span>
          <svg
            className="ml-2 h-4 w-4"
            aria-hidden="true"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M19 9l-7 7-7-7"
            ></path>
          </svg>
        </button>
      </div>

      <AnimatePresence>
        {showDropdown && (
          <OutsideClickHandler onOutsideClick={(e) => setShowDropdown(false)}>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
              id="dropdownHover"
              className="absolute top-12 right-0 z-10 w-44 divide-y divide-gray-100 rounded-lg bg-white shadow dark:bg-gray-700"
            >
              <ul
                className="py-2 text-sm text-gray-700 dark:text-gray-200"
                aria-labelledby="dropdownHoverButton"
              >
                {themeOptions.map((theme) => (
                  <li
                    key={theme}
                    className="block cursor-pointer px-4 py-2 font-medium capitalize hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                    onClick={() => {
                      handleSelectTheme(theme as Theme);
                      setShowDropdown(false);
                    }}
                  >
                    {theme}
                  </li>
                ))}
              </ul>
            </motion.div>
          </OutsideClickHandler>
        )}
      </AnimatePresence>
    </div>
  );
};

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

const Input: React.FC<InputProps> = (props) => {
  return (
    <input
      {...props}
      type="text"
      className="w-ful h rounded border-2 border-gray-300 px-4 py-3 transition-all duration-200 ease-in hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
    />
  );
};

export default FormSettings;
