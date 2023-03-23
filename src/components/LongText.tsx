const LongText = ({
  className,
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement>) => {
  return (
    <textarea
      className={`${
        className as string
      }  resize-none rounded-lg bg-white px-4 py-1.5 font-semibold text-[#1a1a1a] placeholder-[#d0d0d0] outline-none ring-2 ring-[#d0d0d0] focus:ring-[#1a1a1a]`}
      {...props}
    ></textarea>
  );
};

export default LongText;
