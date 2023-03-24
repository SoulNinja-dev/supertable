import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import OutsideClickHandler from "react-outside-click-handler";
import Checkbox from "./Checkbox";

const MultiSelect = ({ options, placeholder }: Props) => {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<number[]>([]);

  return (
    <OutsideClickHandler onOutsideClick={() => setOpen(false)}>
      <div className="relative flex flex-col">
        <div
          className={`relative w-56 cursor-pointer rounded-lg bg-white px-4 py-1.5 font-semibold  ${
            selected.length >= 1 ? "text-[#1a1a1a]" : "text-[#d0d0d0]"
          } outline-none ring-2 ring-[#d0d0d0]`}
          onClick={() => setOpen(!open)}
          onFocus={() => setOpen(true)}
          onBlur={() => setOpen(false)}
        >
          {selected.length >= 1
            ? `${selected.length} ${selected.length > 1 ? "options" : "option"} selected`
            : placeholder}
          <div className="absolute top-[50%] right-2 -translate-y-[40%] text-[#1a1a1a]">
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
              initial={{ opacity: 0, y: 20, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.6 }}
              transition={{ duration: 0.3, ease: "easeIn" }}
            >
              <div className="absolute z-[9999] mt-2 w-full rounded-lg bg-white shadow-xl ring-2 ring-[#d0d0d0]">
                {options?.map((option, ind) => (
                  <div
                    key={ind}
                    onClick={() => {
                      if (selected?.includes(ind)) {
                        setSelected(selected.filter((i) => i !== ind));
                      } else {
                        setSelected(selected?.concat(ind));
                      }
                      setOpen(false);
                    }}
                    className="flex cursor-pointer flex-row items-center gap-2 border border-[#d0d0d0] py-1.5 px-2 font-semibold hover:bg-[#d0d0d0]/40 focus:bg-[#d0d0d0]/40"
                  >
                    <Checkbox
                      checked={selected?.includes(ind) || false}
                      setChecked={() => {
                        if (selected?.includes(ind)) {
                          setSelected(selected.filter((i) => i !== ind));
                        } else {
                          setSelected(selected?.concat(ind));
                        }
                      }}
                    />
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
}

export default MultiSelect;
