import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import OutsideClickHandler from "react-outside-click-handler";
import SingleSelect from "./SingleSelect";
import { RHFProps } from "~/utils/misc";

const hours = [
  0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21,
  22, 23,
];

const minutes = [
  0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21,
  22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40,
  41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59,
];

const DurationInput = ({ className, register, registerDataA, registerDataB }: Props & RHFProps) => {
  const [open, setOpen] = useState(false);
  const [minute, setMinute] = useState<number>();
  const [hour, setHour] = useState<number>();
  const [time, setTime] = useState("");

  useEffect(() => {
    setTime(
      `${(hour as number) < 10 ? `0${hour as number}` : (hour as number)}:${
        (minute as number) < 10 ? `0${minute as number}` : (minute as number)
      }`
    );
  }, [hour, minute]);

  return (
    <OutsideClickHandler onOutsideClick={() => setOpen(false)}>
      <div className="relative flex flex-col">
        <div
          className={`${
            className as string
          }  min-w-[14rem] cursor-pointer rounded-lg bg-white px-4 py-1.5 font-semibold ${
            hour && minute ? "text-[#1a1a1a]" : "text-[#d0d0d0]"
          } outline-none ring-2 ring-[#d0d0d0] focus:ring-[#1a1a1a]`}
          onClick={() => setOpen(!open)}
        >
          {hour?.toString() && minute?.toString() ? time : "hh:mm"}
        </div>
        <AnimatePresence>
          {open ? (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.6 }}
              transition={{ duration: 0.3, ease: "easeIn" }}
            >
              <div className="absolute z-[9999] mt-2 flex w-full flex-col gap-2 rounded-lg bg-white py-2 px-4 shadow-xl ring-2 ring-[#d0d0d0]">
                <SingleSelect
                  options={hours}
                  selected={hour}
                  setSelected={setHour}
                  placeholder="Hour"
                />
                <SingleSelect
                  selected={minute}
                  setSelected={setMinute}
                  options={minutes}
                  placeholder="Minute"
                />
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </OutsideClickHandler>
  );
};

interface Props {
  className?: string;
}

export default DurationInput;
