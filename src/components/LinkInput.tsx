import { useState } from "react";
import { RHFProps } from "~/utils/misc";

const LinkInput = ({
  className,
  register,
  registerDataA,
  registerDataB,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & RHFProps) => {
  const [focused, setFocused] = useState(false);

  return (
    <div className="flex flex-row">
      {focused ? (
        <div className="rounded-l-lg bg-[#f6f6f6] px-3 py-1.5 font-semibold text-[#959595] ring-2 ring-[#1a1a1a]">
          https://
        </div>
      ) : (
        <div className="rounded-l-lg bg-[#f6f6f6] px-3 py-1.5 font-semibold text-[#959595] ring-2 ring-[#d0d0d0]">
          https://
        </div>
      )}
      <input
        onFocus={() => setFocused(true)}
        {...register(registerDataA, { required: registerDataB })}
        onBlur={() => setFocused(false)}
        className={`${
          className as string
        }  peer w-full rounded-r-lg bg-white px-4 py-1.5 font-semibold text-[#1a1a1a] placeholder-[#d0d0d0] outline-none ring-2 ring-[#d0d0d0] focus:ring-[#1a1a1a]`}
        {...props}
      />
    </div>
  );
};

export default LinkInput;
