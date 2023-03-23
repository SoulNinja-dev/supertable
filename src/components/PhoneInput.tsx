import { useState } from "react";

const PhoneInput = ({
  className,
  type,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) => {
  const [focused, setFocused] = useState(false);

  return (
    <div
      className={`flex w-max flex-row items-center rounded-lg ring-2 ${
        focused ? "ring-[#1a1a1a]" : "ring-[#d0d0d0]"
      }`}
    >
      <div className="py-1.5 pl-3 pr-1.5 font-semibold">US +1</div>
      <input
        className={`${
          className as string
        }  appearance-none rounded-lg bg-white py-1.5 pr-4 font-semibold text-[#1a1a1a] placeholder-[#d0d0d0] outline-none`}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        type={type ? "number" : "number"}
        {...props}
      />
    </div>
  );
};

export default PhoneInput;
