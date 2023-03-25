const FormCard = ({ title, desc, cover, id }: Props) => {
  return (
    <div className="w-80 h-max overflow-hidden rounded-md bg-sidebar shadow-sm">
      <img src={cover} className="h-32 w-full" />
      <div className="p-4 font-semibold text-black">
        <div className="text-2xl">{title}</div>
        <div className="text-sm text-gray-500">
          {desc}
        </div>
        <div className="pt-4 flex flex-row items-center justify-between">
          <div></div>
          <div className="flex flex-row items-center gap-3">
            <button>
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
                  d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244"
                />
              </svg>
            </button>
            <button className="rounded-md bg-black px-3 py-1 text-base text-white transition duration-200 ease-in-out hover:bg-black/70">
              Edit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

interface Props {
  title: string;
  desc: string;
  cover: string;
  id: string;
}

export default FormCard;
