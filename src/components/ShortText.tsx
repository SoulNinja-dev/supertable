import { HTMLMotionProps } from "framer-motion";
import React from "react";
import { RHFProps } from "~/utils/misc";
import { motion } from "framer-motion";

const ShortText = ({
  className,
  register,
  registerDataA,
  registerDataB,
  themeData,
  ...props
}: HTMLMotionProps<"input"> & RHFProps) => {
  return (
    <motion.input
      className={`${
        className as string
      }  rounded-lg px-4 py-1.5 font-semibold outline-none ring-2 ring-gray-50/0 focus:ring-[#aeaeae]/40`}
      {...props}
      {...register(registerDataA, { required: registerDataB })}
      style={{
        backgroundColor: themeData.bgColor,
        color: themeData.textColor,
        border: `2px solid ${themeData.borderColor}`
      }}
    />
  );
};

export default ShortText;
