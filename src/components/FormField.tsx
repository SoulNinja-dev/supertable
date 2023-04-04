import classNames from "classnames";
import React, { useEffect, useState } from "react";
import OutsideClickHandler from "react-outside-click-handler";
import { Field } from "~/models/table";

// Extend div element
interface FormFieldProps extends React.HTMLProps<HTMLDivElement> {
  field: Field;
  isDragging: boolean;
}

// Forward ref div element
const FormField = React.forwardRef<HTMLDivElement, FormFieldProps>(
  ({ field, isDragging, ...rest }, ref) => {
    const [isActive, setIsActive] = useState(false);

    useEffect(() => {
      if (isActive) {
        console.log(field.id)
      }
    }, [isActive])

    return (
      <OutsideClickHandler
        onOutsideClick={() => {
          if (isActive) setIsActive(false);
        }}
        display="contents"
      >
        <div
          ref={ref}
          {...rest}
          className={classNames({
            "border flex flex-col w-full max-w-lg items-center justify-center hover:bg-[#ededed]":
              true,
            "border-gray-400 bg-[#f3f2f2]": isDragging || isActive,
            "border-transparent": !isDragging && !isActive,


          })}
          onClick={() => setIsActive(true)}
        >
          {
            isActive && (
              <div>
                Required
              </div>
            )
          }
          <div className="flex w-full flex-col gap-y-5 p-4">
            <label className="text-xl">{field.name}</label>
            <input
              type="text"
              className="w-ful h rounded border-2 border-gray-300 px-4 py-3 transition-all duration-200 ease-in hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
        </div>
      </OutsideClickHandler>
    );
  }
);

export default FormField;
