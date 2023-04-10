import { RHFProps } from "~/utils/misc";
import { HTMLMotionProps, motion } from "framer-motion";
import { useState } from "react";

const LongText = ({
  className,
  register,
  registerDataA,
  registerDataB,
  themeData,
  ...props
}: HTMLMotionProps<"textarea"> & RHFProps) => {
  const [focused, setFocused] = useState(false);
  
  return (
    <motion.textarea
      className={`${
        className as string
      }  resize-none rounded-lg px-4 py-1.5 font-semibold outline-none`}
      {...props}
      {...register(registerDataA, { required: registerDataB })}
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

export default LongText;
