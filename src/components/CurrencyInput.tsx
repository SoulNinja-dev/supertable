import { useState } from "react";
import { RHFProps } from "~/utils/misc";

const curs = [
  "USD",
  "EUR",
  "IND",
  "GBP",
  "JPY",
  "CAD",
  "AUD",
  "CNY",
  "CHF",
  "HKD",
];

const CurrencyInput = ({
  className,
  type,
  register,
  registerDataA,
  registerDataB,
  themeData,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & RHFProps) => {
  const [cur, setCur] = useState(0);
  const [focused, setFocused] = useState(false);

  return (
    <div
      className={`${
        className as string
      } flex flex-row items-center gap-1.5 rounded-lg px-3 py-1.5 ring-2 ring-gray-50/0`}
      style={{
        backgroundColor: themeData.bgColor,
        color: themeData.textColor,
        border: `2px solid ${themeData.borderColor}`,
      }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="h-6 w-6"
        style={{
          stroke: themeData.textColor
        }}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      <input
        className="w-full appearance-none font-semibold outline-none"
        onFocus={() => setFocused(true)}
        type={type ? "number" : "number"}
        {...props}
        {...register(registerDataA, { required: registerDataB })}
        onBlur={() => setFocused(false)}
        style={{
          backgroundColor: themeData.bgColor,
          color: themeData.textColor,
          // border: `2px solid ${themeData.borderColor}`,
        }}
      />
      <div
        className="cursor-pointer font-semibold"
        onClick={() => setCur(cur + 1 >= curs.length ? 0 : cur + 1)}
        style={{
          backgroundColor: themeData.bgColor,
          color: themeData.textColor,
          
        }}
      >
        {curs[cur]}
      </div>
    </div>
  );
};

export default CurrencyInput;
