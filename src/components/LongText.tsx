import { RHFProps } from "~/utils/misc";
import { HTMLMotionProps, motion } from "framer-motion";

const LongText = ({
  className,
  register,
  registerDataA,
  registerDataB,
  themeData,
  ...props
}: HTMLMotionProps<"textarea"> & RHFProps) => {
  return (
    <motion.textarea
      className={`${
        className as string
      }  resize-none rounded-lg px-4 py-1.5 font-semibold outline-none ring-2 ring-gray-50/0 focus:ring-[#aeaeae]/40`}
      {...props}
      {...register(registerDataA, { required: registerDataB })}
      style={{
        backgroundColor: themeData.bgColor,
        color: themeData.textColor,
        border: `2px solid ${themeData.borderColor}`,
        
      }}
    />
  );
};

export default LongText;
