import { type Dispatch, type SetStateAction, useState } from "react";
import { RHFProps } from "~/utils/misc";

const NumberInput = ({
  className,
  setValue,
  value,
  type,
  register,
  registerDataA,
  registerDataB,
  themeData,
  ...props
}: Props & React.InputHTMLAttributes<HTMLInputElement> & RHFProps) => {
  const [focused, setFocused] = useState(false);

  return (
    <div
      className={`flex flex-row items-center gap-1.5 rounded-lg px-3 py-1.5`}
      style={{
        backgroundColor: themeData.inputBgColor,
        border: focused ? `2.5px solid ${themeData.borderFocusedColor}` : `2.5px solid ${themeData.borderColor}`
      }}
    >
      <input
        className={`${className as string} w-full font-semibold outline-none appearance-none`}
        onFocus={() => setFocused(true)}
        {...register(registerDataA, { required: registerDataB, valueAsNumber: true })}
        onBlur={() => setFocused(false)}
        type={type ? "number" : "number"}
        value={value}
        onChange={(e) => setValue(Number(e.target.value))}
        style={{
          backgroundColor: themeData.inputBgColor,
        }}
        {...props}
      />
      <div className="flex flex-col items-center">
        <button onClick={() => setValue(Number(value || 0) + 1)}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={3}
            stroke="currentColor"
            className="h-2 w-2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4.5 15.75l7.5-7.5 7.5 7.5"
            />
          </svg>
        </button>
        <button onClick={() => setValue(Number(value || 0) - 1)}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={3}
            stroke="currentColor"
            className="h-2 w-2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19.5 8.25l-7.5 7.5-7.5-7.5"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

interface Props {
  setValue: (arg0: number) => void | Dispatch<SetStateAction<number>>;
}

export default NumberInput;
