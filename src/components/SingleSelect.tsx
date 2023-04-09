import { AnimatePresence, motion } from "framer-motion";
import { type Dispatch, type SetStateAction, useState } from "react";
import OutsideClickHandler from "react-outside-click-handler";
import { RHFProps } from "~/utils/misc";

const SingleSelect = ({
  options,
  placeholder,
  selected,
  setSelected,
  register,
  registerDataA,
  registerDataB,
}: Props & RHFProps) => {
  const [open, setOpen] = useState(false);
  // const [selected, setSelected] = useState<number>();

  return (
    <OutsideClickHandler onOutsideClick={() => setOpen(false)}>
      <select
        className="bg-white hidden"
        value={selected}
        {...register(registerDataA, { required: registerDataB })}
      >
        {options.map((option, ind) => (
          <option value={ind} key={ind}>
            {option}
          </option>
        ))}
      </select>
      <div className="relative flex flex-col">
        <div
          className={`flex cursor-pointer flex-row items-center justify-between gap-8 rounded-lg bg-white px-4 py-1.5 font-semibold  ${
            selected !== undefined ? "text-[#1a1a1a]" : "text-[#d0d0d0]"
          } outline-none ring-2 ring-[#d0d0d0]`}
          onClick={() => setOpen(!open)}
          onFocus={() => setOpen(true)}
          onBlur={() => setOpen(false)}
        >
          {selected !== undefined ? options[selected] : placeholder}
          <div className="text-[#1a1a1a]">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={3}
              stroke="currentColor"
              className="h-4 w-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19.5 8.25l-7.5 7.5-7.5-7.5"
              />
            </svg>
          </div>
        </div>
        <AnimatePresence>
          {open ? (
            <motion.div
              initial={{ opacity: 0, y: -10, scaleY: 0.8 }}
              animate={{ opacity: 1, y: 0, scaleY: 1 }}
              exit={{ opacity: 0, y: -20, scaleY: 0.6 }}
              transition={{ duration: 0.1, ease: "easeIn" }}
            >
              <div className="absolute z-[9999] mt-2 w-full rounded-lg bg-white shadow-xl ring-2 ring-[#d0d0d0]">
                {options?.map((option, ind) => (
                  <div
                    key={ind}
                    onClick={() => {
                      setSelected(ind);
                      setOpen(false);
                    }}
                    className="cursor-pointer border border-[#d0d0d0] py-1.5 px-2 font-semibold hover:bg-[#d0d0d0]/40 focus:bg-[#d0d0d0]/40"
                  >
                    {option}
                  </div>
                ))}
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </OutsideClickHandler>
  );
};

interface Props {
  options: (string | number)[];
  placeholder: string;
  selected: number | undefined;
  setSelected: (arg0: number) => void | Dispatch<SetStateAction<number>>;
}

export default SingleSelect;
