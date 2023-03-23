import { useState } from "react";

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
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) => {
  const [cur, setCur] = useState(0);
  const [focused, setFocused] = useState(false);

  return (
    <div
      className={`${className as string} flex w-max flex-row items-center gap-1.5 rounded-lg px-3 py-1.5 ring-2 ${
        focused ? "ring-[#1a1a1a]" : "ring-[#d0d0d0]"
      }`}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="h-6 w-6 stroke-[#1a1a1a]"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      <input
        className="appearance-none bg-white font-semibold outline-none"
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        type={type ? "number" : "number"}
        {...props}
      />
      <div
        className="cursor-pointer font-semibold text-[#1a1a1a]"
        onClick={() => setCur(cur + 1 >= curs.length ? 0 : cur + 1)}
      >
        {curs[cur]}
      </div>
    </div>
  );
};

export default CurrencyInput;
