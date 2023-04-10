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

const DurationInput = ({
  className,
  register,
  registerDataA,
  registerDataB,
  themeData,
}: Props & RHFProps) => {
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
          }  min-w-[14rem] cursor-pointer rounded-lg px-4 py-1.5 font-semibold outline-none ring-2 ring-gray-50/0 focus:ring-[#aeaeae]/40`}
          onClick={() => setOpen(!open)}
          style={{
            backgroundColor: themeData.bgColor,
            color: themeData.textColor,
            border: `2px solid ${themeData.borderColor}`,
          }}
        >
          {hour?.toString() && minute?.toString() ? time : "hh:mm"}
        </div>
        <AnimatePresence>
          {open ? (
            <motion.div
              initial={{ opacity: 0, y: -20, scaleY: 0.8 }}
              animate={{ opacity: 1, y: 0, scaleY: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.6 }}
              transition={{ duration: 0.1, ease: "easeIn" }}
            >
              <div
                className="absolute z-[9999] mt-2 flex w-full flex-col gap-2 rounded-lg py-2 px-4 shadow-xl ring-2 ring-gray-50/0"
                style={{
                  backgroundColor: themeData.bgColor,
                  color: themeData.textColor,
                  border: `2px solid ${themeData.borderColor}`,
                }}
              >
                <SingleSelect
                  options={hours}
                  selected={hour}
                  setSelected={setHour}
                  placeholder="Hour"
                  themeData={themeData}
                />
                <SingleSelect
                  themeData={themeData}
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
