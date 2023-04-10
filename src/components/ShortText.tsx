import { HTMLMotionProps } from "framer-motion";
import { RHFProps } from "~/utils/misc";
import { motion } from "framer-motion";
import { useState } from "react";

const ShortText = ({
  className,
  register,
  registerDataA,
  registerDataB,
  themeData,
  ...props
}: HTMLMotionProps<"input"> & RHFProps) => {
  const [focused, setFocused] = useState(false);
  
  return (
    <motion.input
      className={`${
        className as string
      }  rounded-lg px-4 py-1.5 font-semibold outline-none`}
      {...props}
      {...register(registerDataA, { required: registerDataB })}
      onBlur={() => setFocused(false)}
      onFocus={() => setFocused(true)}
      style={{
        backgroundColor: themeData.inputBgColor,
        color: themeData.textColor,
        border: focused ? `2.5px solid ${themeData.borderFocusedColor}` : `2.5px solid ${themeData.borderColor}`
      }}
    />
  );
};

export default ShortText;
