import React from "react";
import { RHFProps } from "~/utils/misc";

const EmailInput = ({
  className,
  register,
  registerDataA,
  registerDataB,
  themeData,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & RHFProps) => {
  return (
    <input
      className={`${
        className as string
      }  rounded-lg px-4 py-1.5 font-semibold outline-none ring-2 ring-gray-50/0 focus:ring-[#aeaeae]/40`}
      {...props}
      {...register(registerDataA, {
        required: registerDataB,
        pattern: {
          value: /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$/,
          message: "Invalid email",
        },
      })}
      style={{
        backgroundColor: themeData.bgColor,
        color: themeData.textColor,
        border: `2px solid ${themeData.borderColor}`,
      }}
    />
  );
};

export default EmailInput;
