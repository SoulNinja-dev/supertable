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
  const [scheme, setScheme] = useState(true);

  return (
    <div className="flex flex-row">
      {focused ? (
        <div
          onClick={() => setScheme(!scheme)}
          className="cursor-pointer rounded-l-lg bg-[#f6f6f6] px-3 py-1.5 font-semibold text-[#959595] ring-2 ring-[#1a1a1a]"
        >
          {scheme ? "https://" : "http://"}
        </div>
      ) : (
        <div
          onClick={() => setScheme(!scheme)}
          className="cursor-pointer rounded-l-lg bg-[#f6f6f6] px-3 py-1.5 font-semibold text-[#959595] ring-2 ring-[#d0d0d0]"
        >
          {scheme ? "https://" : "http://"}
        </div>
      )}
      <input
        onFocus={() => setFocused(true)}
        {...register(registerDataA, {
          required: registerDataB,
          pattern: {
            value: /^(?!https?:\/\/)\w+(?:\.\w+)*\.\w{2,6}\b(?:\/\S*)?$/,
            message: "Invalid link(do not include http:// or https://)",
          },
        })}
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
