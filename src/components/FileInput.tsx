import { RHFProps } from "~/utils/misc";

const FileInput = ({ register, registerDataA, registerDataB, themeData }: RHFProps) => {
  return (
    <div className="flex flex-row items-center justify-between rounded-lg font-semibold "
    style={{
      backgroundColor: themeData.inputBgColor,
      color: themeData.textColor,
      border: `2.5px solid ${themeData.borderColor}`,
    }}
    >
      <input
        type="file"
        id="test"
        className="hidden"
        {...register(registerDataA, { required: registerDataB })}
      />
      <div
        className="flex w-full cursor-pointer flex-row items-center gap-1.5 px-3 py-1.5"
        onClick={() => document.getElementById("test")?.click()}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className="h-5 w-5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M18.375 12.739l-7.693 7.693a4.5 4.5 0 01-6.364-6.364l10.94-10.94A3 3 0 1119.5 7.372L8.552 18.32m.009-.01l-.01.01m5.699-9.941l-7.81 7.81a1.5 1.5 0 002.112 2.13"
          />
        </svg>
        Attachment
      </div>
      <button
        onClick={() => document.getElementById("test")?.click()}
        className="rounded-lg py-1.5 px-3 font-bold"
        style={{
          backgroundColor: themeData.inputBgColor,
          color: themeData.textColor,
          borderLeft: `2.5px solid ${themeData.borderColor}`,
        }}
      >
        Browse
      </button>
    </div>
  );
};

export default FileInput;
