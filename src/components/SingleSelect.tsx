import { useState } from "react";

const SingleSelect = ({ options, placeholder }: Props) => {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<number>();

  return (
    <div className="flex flex-col gap-2">
      <div
        className={`relative w-56 cursor-pointer rounded-lg bg-white px-4 py-1.5 font-semibold  ${
          selected !== undefined ? "text-[#1a1a1a]" : "text-[#d0d0d0]"
        } outline-none ring-2 ring-[#d0d0d0]`}
        onClick={() => setOpen(!open)}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
      >
        {selected !== undefined ? options[selected] : placeholder}
        <div className="absolute top-[50%] right-2 -translate-y-[40%] text-[#1a1a1a]">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={3}
            stroke="currentColor"
            className="h-4 w-4"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19.5 8.25l-7.5 7.5-7.5-7.5"
            />
          </svg>
        </div>
      </div>
      {open ? (
        <div className="rounded-lg shadow-xl ring-2 ring-[#d0d0d0]">
          {options?.map((option, ind) => (
            <div
              key={ind}
              onClick={() => {
                setSelected(ind);
                setOpen(false);
              }}
              className="cursor-pointer border border-[#d0d0d0] py-1.5 px-2 font-semibold hover:bg-[#d0d0d0]/40 focus:bg-[#d0d0d0]/40"
            >
              {option}
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
};

interface Props {
  options: (string | number)[];
  placeholder: string;
}

export default SingleSelect;
