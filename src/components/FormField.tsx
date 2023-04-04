import classNames from "classnames";
import React, { useEffect, useState } from "react";
import OutsideClickHandler from "react-outside-click-handler";
import { FullFormObject } from "~/models/form";
import { Field } from "~/models/table";
import { useFormStore } from "~/stores/formStore";
import { api } from "~/utils/api";
import ToggleButton from "./Toggle";

// Extend div element
interface FormFieldProps extends React.HTMLProps<HTMLDivElement> {
  field: Field;
  isDragging: boolean;
  formField: FullFormObject["fields"][0];
}

// Forward ref div element
const FormField = React.forwardRef<HTMLDivElement, FormFieldProps>(
  ({ field, isDragging, formField, ...rest }, ref) => {
    const { mutateAsync: editForm } = api.form.editFormField.useMutation();
    const [form, setFormField] = useFormStore((state) => [
      state.form,
      state.setFormField,
    ]);
    const [isActive, setIsActive] = useState(false);

    useEffect(() => {
      if (isActive) {
        console.log(field.id);
      }
    }, [isActive]);

    const handleToggleRequired = async (value: boolean) => {
      setFormField({
        ...formField,
        required: value,
      });
      await editForm({
        formId: form.id,
        fieldId: field.id,
        required: value,
      });
    };

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
            "flex w-full max-w-lg flex-col items-center justify-center border hover:bg-[#ededed]":
              true,
            "border-gray-400 bg-[#f3f2f2]": isDragging || isActive,
            "border-transparent": !isDragging && !isActive,
          })}
          onClick={() => setIsActive(true)}
        >
          {isActive && (
            <div className="-mt-1 flex w-full justify-end border-b border-b-gray-300 px-2 text-xs font-semibold text-gray-500">
              <div className="flex items-center">
                <span>Required</span>
                <div className="w-8 scale-[0.5]">
                  <ToggleButton
                    value={formField.required}
                    onValueChange={handleToggleRequired}
                  />
                </div>
              </div>
            </div>
          )}
          <div className="flex w-full flex-col gap-y-5 p-4">
            <div className="flex items-center justify-between">
              <label className="h-5 text-xl">{field.name}</label>
              {formField.required && (
                <span className="h-5 text-3xl text-red-500">*</span>
              )}
            </div>
            <input
              type="text"
              className="w-ful h rounded bg-sidebar px-4 py-3 ring-2 ring-gray-300 transition-all duration-200 ease-in hover:ring-gray-400 focus:outline-none focus:ring-black"
            />
          </div>
        </div>
      </OutsideClickHandler>
    );
  }
);

export default FormField;
