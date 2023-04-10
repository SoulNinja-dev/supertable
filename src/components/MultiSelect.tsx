import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import OutsideClickHandler from "react-outside-click-handler";
import { ThemeData } from "~/utils/themes";
import Checkbox from "./Checkbox";

const MultiSelect = ({ options, placeholder, onChange, themeData, ..._ }: Props) => {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<number[]>([]);

  useEffect(() => {
    onChange(selected);
  }, [selected]);

  return (
    <OutsideClickHandler onOutsideClick={() => setOpen(false)}>
      <div className="relative flex flex-col">
        <div
          className={`gap-8 cursor-pointer flex flex-row items-center justify-between rounded-lg px-4 py-1.5 font-semibold outline-none ring-2 ring-gray-50/0 focus:ring-[#aeaeae]/40`}
          onClick={() => setOpen(!open)}
          onFocus={() => setOpen(true)}
          onBlur={() => setOpen(false)}
          
          style={{
            backgroundColor: themeData.bgColor,
            color: themeData.textColor,
            border: `2px solid ${themeData.borderColor}`,
          }}
        >
          {selected.length >= 1
            ? `${selected.length} ${
                selected.length > 1 ? "options" : "option"
              } selected`
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
              initial={{ opacity: 0, y: -20, scaleY: 0.8 }}
              animate={{ opacity: 1, y: 0, scaleY: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.6 }}
              transition={{ duration: 0.3, ease: "easeIn" }}
            >
              <div className="absolute z-[9999] mt-2 w-full rounded-lg shadow-xl"
                  style={{
                    backgroundColor: themeData.bgColor,
                    color: themeData.textColor,
                    border: `2px solid ${themeData.borderColor}`,
                  }}
              >
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
                      themeData={themeData}
                      checked={selected?.includes(ind) || false}
                      setChecked={() => {
                        if (selected?.includes(ind)) {
                          setSelected(selected.filter((i) => i !== ind));
                        } else {
                          setSelected(selected?.concat(ind));
                        }
                      }}
                      register={(a, b) => {
                        return;
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
  name: string;
  value?: any;
  onChange: (...event: any[]) => void;
  onBlur: () => void;
  ref: any;
  themeData: ThemeData;
}

export default MultiSelect;
