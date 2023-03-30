const FileInput = () => {
  return (
    <div className="flex w-72 flex-row items-center justify-between rounded-lg font-semibold text-[#d0d0d0] ring-2 ring-[#d0d0d0]">
      <input type="file" id="test" className="hidden" />
      <div
        className="flex cursor-pointer flex-row items-center gap-1.5 px-3 py-1.5"
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
        attachment
      </div>
      <button
        onClick={() => document.getElementById("test")?.click()}
        className="rounded-lg py-1.5 px-3 font-bold text-[#1a1a1a] ring-2 ring-[#d0d0d0]"
      >
        Browse
      </button>
    </div>
  );
};

export default FileInput;
