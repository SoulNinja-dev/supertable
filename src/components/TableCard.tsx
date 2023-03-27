import Image from "next/image";

const TableCard = ({ name, desc, id }: Props) => {
  return (
    <div className="w-80 overflow-hidden rounded-md bg-sidebar shadow-sm">
      <Image src={`https://picsum.photos/seed/tu${id}/320/128`} alt={name} width={320} height={128} className="h-32 w-full" />
      <div className="p-4 font-semibold text-black">
        <div className="text-xl">{name}</div>
        <div className="text-sm text-gray-500">{desc}</div>
        <div className="flex flex-row items-center justify-between pt-4">
          <div></div>
          <div className="flex flex-row items-center gap-3">
            <button className="flex items-center rounded-md bg-black pl-3 py-1 text-base text-white transition duration-200 ease-in-out hover:bg-black/70">
              <span>View Tables</span>
              <Image
                src="/chevron-right.svg"
                alt="chevron-right"
                width={24}
                height={24}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

interface Props {
  name: string;
  desc?: string;
  id: string;
}

export default TableCard;
