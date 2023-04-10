import React, { useState } from "react";
import { RHFProps } from "~/utils/misc";

const EmailInput = ({
  className,
  register,
  registerDataA,
  registerDataB,
  themeData,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & RHFProps) => {
  const [focused, setFocused] = useState(false);
  
  return (
    <input
      className={`${
        className as string
      }  rounded-lg px-4 py-1.5 font-semibold outline-none`}
      {...props}
      {...register(registerDataA, {
        required: registerDataB,
        pattern: {
          value: /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$/,
          message: "Invalid email",
        },
      })}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      style={{
        backgroundColor: themeData.inputBgColor,
        color: themeData.textColor,
        border: focused ? `2.5px solid ${themeData.borderFocusedColor}` : `2.5px solid ${themeData.borderColor}`,
      }}
    />
  );
};

export default EmailInput;
