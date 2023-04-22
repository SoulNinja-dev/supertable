import type { Dispatch, SetStateAction } from "react";
import { RHFProps } from "~/utils/misc";

const Checkbox = ({
  className,
  checked,
  setChecked,
  label,
  register,
  registerDataA,
  themeData,
}: Props & RHFProps) => {
  return (
    <div className="flex flex-row gap-3 items-center">
      <input
        className="hidden"
        type="checkbox"
        checked={checked}
        {...register(registerDataA, { required: false })}
      />
      {label ? <div>{label}</div> : null}
      {checked ? (
        <div
          onClick={() => setChecked(!checked)}
          className={`${
            className as string
          }  flex h-6 w-6 cursor-pointer items-center justify-center rounded bg-[#1a1a1a] outline-none`}
          style={{
            backgroundColor: themeData.borderFocusedColor,
            color: themeData.textColor,
            border: checked ? `2.5px solid ${themeData.borderFocusedColor}` : `2.5px solid ${themeData.borderColor}`,
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={3}
            stroke="currentColor"
            className="h-4 w-4"
            style={{
              stroke: themeData.bgColor,
            }}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4.5 12.75l6 6 9-13.5"
            />
          </svg>
        </div>
      ) : (
        <div
          onClick={() => setChecked(!checked)}
          className={`${
            className as string
          }  h-6 w-6 cursor-pointer rounded`}
          style={{
            backgroundColor: themeData.inputBgColor,
            color: themeData.textColor,
            border: checked ? `2.5px solid ${themeData.borderFocusedColor}` : `2.5px solid ${themeData.borderColor}`,
          }}
        ></div>
      )}
    </div>
  );
};

interface Props {
  className?: string;
  checked: boolean;
  setChecked: (arg0: boolean) => void | Dispatch<SetStateAction<boolean>>;
  label?: string;
}

export default Checkbox;
