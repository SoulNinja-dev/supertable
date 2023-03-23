import React from "react";

const EmailInput = ({
  className,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) => {
  return (
    <input
      className={`${
        className as string
      }  rounded-lg bg-white px-4 py-1.5 font-semibold text-[#1a1a1a] placeholder-[#d0d0d0] outline-none ring-2 ring-[#d0d0d0] focus:ring-[#1a1a1a]`}
      {...props}
    />
  );
};

export default EmailInput;
