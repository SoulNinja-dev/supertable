import { useState } from "react";
import { RHFProps } from "~/utils/misc";

const PercentInput = ({
  className,
  type,
  register,
  registerDataA,
  registerDataB,
  themeData,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & RHFProps) => {
  const [focus, setFocus] = useState(false);

  return (
    <div
      className={`flex flex-row items-center appearance-none gap-1.5 rounded-lg px-3 py-1.5 ring-2 ring-gray-50/0`}
      style={{
        backgroundColor: themeData.inputBgColor,
        color: themeData.textColor,
        border: focus ? `2.5px solid ${themeData.borderFocusedColor}` : `2.5px solid ${themeData.borderColor}`,
      }}
    >
      <input
        onFocus={() => setFocus(true)}
        {...register(registerDataA, { required: registerDataB, valueAsNumber: true })}
        onBlur={() => setFocus(false)}
        className={`${
          className as string
        }  appearance-none font-semibold outline-none w-full`}
        type={type ? "number" : "number"}
        {...props}
        style={{
          backgroundColor: themeData.inputBgColor,
          color: themeData.textColor,
          // border: `2px solid ${themeData.borderColor}`,
        }}
      />
      <div className="font-bold">%</div>
    </div>
  );
};

export default PercentInput;
