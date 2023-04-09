import { useState } from "react";
import { RHFProps } from "~/utils/misc";

const PercentInput = ({
  className,
  type,
  register,
  registerDataA,
  registerDataB,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & RHFProps) => {
  const [focus, setFocus] = useState(false);

  return (
    <div
      className={`flex flex-row items-center appearance-none gap-1.5 rounded-lg px-3 py-1.5 ring-2 ${
        focus ? "ring-[#1a1a1a]" : "ring-[#d0d0d0]"
      }`}
    >
      <input
        onFocus={() => setFocus(true)}
        {...register(registerDataA, { required: registerDataB, valueAsNumber: true })}
        onBlur={() => setFocus(false)}
        className={`${
          className as string
        }  appearance-none bg-white font-semibold outline-none w-full`}
        type={type ? "number" : "number"}
        {...props}
      />
      <div className="font-bold">%</div>
    </div>
  );
};

export default PercentInput;
