import FormCard from "./FormCard";

const DashboardComponent = () => {
  return (
    <div className="flex flex-col gap-8 p-6 text-black">
      <div className="flex flex-row items-center justify-between text-3xl font-semibold">
        Dashboard
        <div className="flex w-64 flex-row items-center gap-2 overflow-hidden rounded-md bg-white px-3 py-1.5 text-base font-semibold text-black ring-2 ring-gray-300">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="h-5 w-5 stroke-gray-400"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
            />
          </svg>
          <input
            placeholder="Search..."
            className="w-48 bg-white outline-none"
          />
        </div>
      </div>
      <div className="text-xl font-semibold">Recent Forms</div>
      <div className="flex flex-row flex-wrap gap-6">
        <FormCard
          title="form title"
          desc="some desc for the form lorem ipsum and a little bit more"
          cover="https://picsum.photos/1000/500"
          id=""
        />
        <FormCard
          title="contributor form"
          desc="join xyz dao as a contiributor mhm hi lol"
          cover="https://picsum.photos/1000/500"
          id=""
        />
        <FormCard
          title="form title"
          desc="join that same xyz wait not abc dao as a member huh?"
          cover="https://picsum.photos/1000/500"
          id=""
        />
        <FormCard
          title="idk what else is left"
          desc="bruh this is just random for testing idk what other form to make"
          cover="https://picsum.photos/1000/500"
          id=""
        />
      </div>
    </div>
  );
};

export default DashboardComponent;
