import type { Dispatch, SetStateAction } from "react";
import { RHFProps } from "~/utils/misc";

const RatingInput = ({
  className,
  rating,
  setRating,
  register,
  registerDataA,
  registerDataB,
  maxRating,
}: Props & RHFProps) => {
  return (
    <div className={`${className as string} flex flex-row gap-0.5`}>
      <input type="number" className="hidden" value={rating} {...register(registerDataA, { required: registerDataB })} />
      {Array.from({ length: maxRating }).map((_, ind) => (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill={rating >= ind + 1 ? "currentColor" : "none"}
          strokeWidth={1.5}
          stroke={rating < ind + 1 ? "currentColor" : "none"}
          className="h-6 w-6 cursor-pointer"
          onClick={() => setRating(ind + 1)}
        >
          <path
            fillRule="evenodd"
            d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
            clipRule="evenodd"
          />
        </svg>
      ))}
    </div>
  );
};

interface Props {
  className?: string;
  rating: number;
  setRating: (arg0: number) => void | Dispatch<SetStateAction<number>>;
  maxRating: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
}

export default RatingInput;
