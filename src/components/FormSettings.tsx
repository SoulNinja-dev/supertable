import { useMemo, useRef, useState } from "react";
import { useDebounceCallback } from "~/hooks/useDelayedRequest";
import { useFormStore } from "~/stores/formStore";
import { api } from "~/utils/api";
import { AnimatePresence, motion } from "framer-motion";
import OutsideClickHandler from "react-outside-click-handler";
import { Theme } from "@prisma/client";
import { themes } from "~/utils/themes";
import PopoverPicker from "./PopoverPicker";

import axios from "axios";
import classNames from "classnames";
import ToggleButton from "./Toggle";
import { useTableStore } from "~/stores/tableStore";
import { toast } from "react-hot-toast";
import { isProperSlug } from "~/utils/misc";

const FormSettings = () => {
  const [table] = useTableStore((state) => [state.table]);
  const [form, setForm] = useFormStore((state) => [state.form, state.setForm]);
  const { mutateAsync: editForm } = api.form.editForm.useMutation();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { mutateAsync: generatePresignedUrl } =
    api.s3.generatePresignedUrl.useMutation();
  const debounceUpdateSlug = useDebounceCallback(500);
  // const debounceUpdateFormDescription = useDebounceCallback(500);

  const handleSubmit = async (file: File | null) => {
    if (!file) return;
    if (!form.id) return;

    try {
      const presignedUrl = await generatePresignedUrl({
        fileName: file.name,
        type: "ogImage",
      });

      await axios.put(presignedUrl, file, {
        headers: {
          // Content type image explicit
          "Content-Type": "image/*",
        },
      });

      // Extract the actual S3 URL from the presigned URL
      const uploadedImageUrl =
        new URL(presignedUrl).origin + new URL(presignedUrl).pathname;

      const response = await editForm({
        formId: form.id,
        seoImage: uploadedImageUrl,
      });

      setForm({
        ...form,
        seoImage: uploadedImageUrl,
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleConnectWalletChange = async (value: boolean) => {
    const solanaAddrField = table.fields.find(
      (field) => field.name === "solana-addr"
    );
    console.log(solanaAddrField);
    if (!solanaAddrField) {
      toast.error(
        "You need to have a field called 'solana-addr' in your table to enable wallet connect"
      );
      return;
    } else if (solanaAddrField.type !== "singleLineText") {
      toast.error(
        "The field 'solana-addr' needs to be of type 'Single line text' to enable wallet connect"
      );
      return;
    }
    setForm({
      ...form,
      connectWallet: value,
    });

    await editForm({
      formId: form.id,
      connectWallet: value,
    });
  };

  const handleSlugChange = async (value: string) => {
    const slugError = isProperSlug(value);
    if (slugError) {
      toast.error("Slug can only contain lowercase letters, numbers and dashes");
      return;
    }
    await editForm({
      formId: form.id,
      slug: value,
    });
  };

  return (
    <div className="flex w-full justify-center bg-sidebar px-10 pb-60">
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

          {/* Wallet */}
          <div className="flex gap-20">
            <div className="flex max-w-sm flex-col text-xl font-semibold">
              Wallet
              <div className="text-sm font-semibold text-gray-400">
                Solana Wallet Connect. (Have a field called <br /> "solana-addr"
                in your table of type "Single line text")
              </div>
            </div>
            <div className="scale-[.8]">
              <ToggleButton
                value={form.connectWallet}
                onValueChange={handleConnectWalletChange}
              />
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <div className="flex flex-col text-xl font-semibold">
              SEO
              <div className="text-sm font-semibold text-gray-400">
                Change the default SEO data for your forms
              </div>
            </div>
            <div className="flex flex-col gap-y-5">
              <div className="flex w-80 flex-col font-semibold">
                Slug
                <div className="text-xs font-semibold text-gray-400">
                  URL slug for your form
                </div>
              </div>
              <input
                value={form.slug || ""}
                className="rounded-md bg-white px-3 py-1.5 font-semibold outline-none ring-2 ring-gray-300 w-1/2"
                placeholder="Form by Superteam"
                onChange={(e) => {
                  setForm({
                    ...form,
                    slug: e.target.value,
                  });
                  debounceUpdateSlug(() => handleSlugChange(e.target.value));
                  
                }}
              />
            </div>
            {/*
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
            <div className="flex flex-col">
              <div className="flex w-80 flex-col font-semibold">
                Upload SEO Image
                <div className="text-xs font-semibold text-gray-400">
                  The default SEO image(used by Discord in embeds)
                </div>
              </div>
              <div
                className={classNames({
                  "mt-4 flex h-[250px] w-[500px] cursor-pointer items-center justify-center rounded-lg border-2 border-gray-400/60 bg-gray-200 pb-10 text-gray-500 transition duration-100 ease-in-out hover:bg-gray-300/70":
                    true,
                })}
                onClick={() =>
                  fileInputRef.current && fileInputRef.current.click()
                }
                style={{
                  backgroundImage: form.seoImage
                    ? `url(${form.seoImage})`
                    : "none",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat",
                }}
              >
                <div className="rounded-lg bg-white px-3 py-2">
                  {form.seoImage ? "Change Image" : "Upload Image"}
                </div>
              </div>
              <input
                type="file"
                ref={fileInputRef}
                style={{ display: "none" }}
                accept="image/*"
                onChange={(e) =>
                  handleSubmit(
                    e.target.files ? (e.target.files[0] as File) : null
                  )
                }
              />
            </div>
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
      <div className="flex items-center justify-center gap-x-4">
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
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 9l-7 7-7-7"
            ></path>
          </svg>
        </button>
      </div>

      <AnimatePresence>
        {showDropdown && (
          <OutsideClickHandler onOutsideClick={(e) => setShowDropdown(false)}>
            <motion.div
              initial={{ opacity: 0, scale: 0.6, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: -20 }}
              transition={{ duration: 0.1 }}
              id="dropdownHover"
              className="absolute top-12 -left-2.5 z-10 w-44 divide-y divide-gray-100 rounded-lg bg-white shadow dark:bg-gray-700"
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
