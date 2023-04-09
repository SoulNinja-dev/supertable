import React from "react";
import { RHFProps } from "~/utils/misc";

const EmailInput = ({
  className,
  register,
  registerDataA,
  registerDataB,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & RHFProps) => {
  return (
    <input
      className={`${
        className as string
      }  rounded-lg bg-white px-4 py-1.5 font-semibold text-[#1a1a1a] placeholder-[#d0d0d0] outline-none ring-2 ring-[#d0d0d0] focus:ring-[#1a1a1a]`}
      {...props}
      {...register(registerDataA, {
        required: registerDataB,
        pattern: {
          value: /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$/,
          message: "Invalid email",
        },
      })}
    />
  );
};

export default EmailInput;
