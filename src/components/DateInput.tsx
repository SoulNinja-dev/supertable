import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import OutsideClickHandler from "react-outside-click-handler";
import SingleSelect from "./SingleSelect";
import { RHFProps } from "~/utils/misc";

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "november",
  "December",
];

const years = [
  2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012,
  2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023,
];

const DateInput = ({ className, register, registerDataA, registerDataB }: Props & RHFProps) => {
  const [open, setOpen] = useState(false);
  const [month, setMonth] = useState<number>();
  const [day, setDay] = useState<number>();
  const [year, setYear] = useState<number>();
  const [date, setDate] = useState("");
  const [days, setDays] = useState<number[] | string[]>(["Select Month First"]);

  useEffect(() => {
    // if (day && month && year)
    setDate(
      `${
        (day as number) + 1 < 10
          ? `0${(day as number) + 1}`
          : (day as number) + 1
      }/${
        (month as number) + 1 < 10
          ? `0${(month as number) + 1}`
          : (month as number) + 1
      }/${years[year as number] as number}`
    );
  }, [day, month, year]);

  useEffect(() => {
    [0, 2, 5, 7, 8, 10, 12].includes(month as number)
      ? setDays([
          1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
          21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31,
        ])
      : [3, 5, 9, 11].includes(month as number)
      ? setDays([
          1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
          21, 22, 23, 24, 25, 26, 27, 28, 29, 30,
        ])
      : month === 1
      ? setDays([
          1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
          21, 22, 23, 24, 25, 26, 27, 28,
        ])
      : ["Select Month First"];
  }, [month]);

  return (
    <OutsideClickHandler onOutsideClick={() => setOpen(false)}>
      <div className="relative flex flex-col">
        <div
          className={`${
            className as string
          }  min-w-[14rem] cursor-pointer rounded-lg bg-white px-4 py-1.5 font-semibold ${
            day && month && year ? "text-[#1a1a1a]" : "text-[#d0d0d0]"
          } outline-none ring-2 ring-[#d0d0d0] focus:ring-[#1a1a1a]`}
          onClick={() => setOpen(!open)}
        >
          {day && month && year ? date : "dd/mm/yyyy"}
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
                  options={months}
                  selected={month}
                  setSelected={setMonth}
                  placeholder="Month"
                />
                <SingleSelect
                  selected={day}
                  setSelected={setDay}
                  options={days}
                  placeholder="Day"
                />
                <SingleSelect
                  options={years}
                  placeholder="Year"
                  selected={year}
                  setSelected={setYear}
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

export default DateInput;
