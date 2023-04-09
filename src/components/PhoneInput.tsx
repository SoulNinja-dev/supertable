import { useState } from "react";
import { RHFProps } from "~/utils/misc";

const PhoneInput = ({
  className,
  type,
  register,
  registerDataA,
  registerDataB,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & RHFProps) => {
  const [focused, setFocused] = useState(false);

  return (
    <div
      className={`flex flex-row items-center rounded-lg ring-2 ${
        focused ? "ring-[#1a1a1a]" : "ring-[#d0d0d0]"
      }`}
    >
      <div className="w-20 py-1.5 pl-3 pr-1.5 font-semibold">US +1</div>
      <input
        className={`${
          className as string
        }  w-full appearance-none rounded-lg bg-white py-1.5 pr-4 font-semibold text-[#1a1a1a] placeholder-[#d0d0d0] outline-none`}
        onFocus={() => setFocused(true)}
        {...register(registerDataA, {
          required: registerDataB,
          pattern: {
            value: /^\d{10}$/,
            message: "Invalid phone number",
          },
        })}
        onBlur={() => setFocused(false)}
        type={type ? "number" : "number"}
        {...props}
      />
    </div>
  );
};

export default PhoneInput;
