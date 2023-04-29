import Link from "next/link";

const Sidebar = ({ page }: Props) => {
  return (
    <aside className="col-span-1 flex h-[calc(100vh-64px)] flex-col justify-between gap-4 bg-[#f9f9f9] px-5 py-10 font-semibold text-black">
      <div className="flex flex-col gap-4">
        <Link
          href="/dashboard"
          className={`flex flex-row items-center gap-2 rounded-lg ${page === "dashboard" ? "bg-accent" : ""} py-3 px-3`}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g opacity="0.8">
              <path
                d="M10.8333 17.5V9.16667H17.5V17.5H10.8333ZM2.5 10.8333V2.5H9.16667V10.8333H2.5ZM7.5 9.16667V4.16667H4.16667V9.16667H7.5ZM2.5 17.5V12.5H9.16667V17.5H2.5ZM4.16667 15.8333H7.5V14.1667H4.16667V15.8333ZM12.5 15.8333H15.8333V10.8333H12.5V15.8333ZM10.8333 2.5H17.5V7.5H10.8333V2.5ZM12.5 4.16667V5.83333H15.8333V4.16667H12.5Z"
                fill="#5522DF"
              />
            </g>
          </svg>
          Dashboard
        </Link>
        <Link
          href="/dashboard"
          className="flex flex-row items-center gap-2 rounded-lg bg-black py-3 px-3 text-white"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 18 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M8.25 8.25V3.75H9.75V8.25H14.25V9.75H9.75V14.25H8.25V9.75H3.75V8.25H8.25Z"
              fill="#F5A60B"
            />
          </svg>
          Create Form
        </Link>
      </div>
      <Link
        href="/dashboard/settings"
        className="flex flex-row items-center justify-center gap-1 rounded-lg text-[#666666]"
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 18 18"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g clipPath="url(#clip0_862_701)">
            <path
              d="M6.51551 3.00006L8.4705 1.04511C8.76338 0.752215 9.2382 0.752215 9.53115 1.04511L11.4861 3.00006H14.2508C14.665 3.00006 15.0008 3.33585 15.0008 3.75006V6.51478L16.9558 8.46975C17.2487 8.76263 17.2487 9.23753 16.9558 9.5304L15.0008 11.4854V14.2501C15.0008 14.6643 14.665 15.0001 14.2508 15.0001H11.4861L9.53115 16.955C9.2382 17.2479 8.76338 17.2479 8.4705 16.955L6.51551 15.0001H3.7508C3.33658 15.0001 3.0008 14.6643 3.0008 14.2501V11.4854L1.04585 9.5304C0.752947 9.23753 0.752947 8.76263 1.04585 8.46975L3.0008 6.51478V3.75006C3.0008 3.33585 3.33658 3.00006 3.7508 3.00006H6.51551ZM4.5008 4.50006V7.1361L2.63684 9.00008L4.5008 10.8641V13.5001H7.13684L9.00083 15.364L10.8647 13.5001H13.5008V10.8641L15.3647 9.00008L13.5008 7.1361V4.50006H10.8647L9.00083 2.6361L7.13684 4.50006H4.5008ZM9.00083 12.0001C7.34394 12.0001 6.0008 10.6569 6.0008 9.00008C6.0008 7.34321 7.34394 6.00006 9.00083 6.00006C10.6577 6.00006 12.0008 7.34321 12.0008 9.00008C12.0008 10.6569 10.6577 12.0001 9.00083 12.0001ZM9.00083 10.5001C9.8292 10.5001 10.5008 9.82853 10.5008 9.00008C10.5008 8.17163 9.8292 7.50008 9.00083 7.50008C8.17238 7.50008 7.50083 8.17163 7.50083 9.00008C7.50083 9.82853 8.17238 10.5001 9.00083 10.5001Z"
              fill="#666666"
            />
          </g>
          <defs>
            <clipPath id="clip0_862_701">
              <rect width="18" height="18" fill="white" />
            </clipPath>
          </defs>
        </svg>
        Settings
      </Link>
    </aside>
  );
};

interface Props {
  page: string;
}

interface Base {
  id: string;
  name: string;
  permissionLevel: string;
}

export default Sidebar;
