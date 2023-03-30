import Image from "next/image";
import React from 'react'
import { HTMLProps } from "react";
import { FieldType } from "~/models/table";

interface TableFieldProps extends HTMLProps<HTMLDivElement> {
  name: string;
  type: FieldType;
}

const icons: Record<FieldType, string> = {
  checkbox: "/field-icons/check-square.svg",
  currency: "/field-icons/currency.svg",
  attachment: "/field-icons/file.svg",
  duration: "/field-icons/duration.svg",
  url: "/field-icons/link.svg",
  multilineText: "/field-icons/long-text.svg",
  singleLineText: "/field-icons/short-text.svg",
  phoneNumber: "/field-icons/phone.svg",
  percent: "/field-icons/percent.svg",
  number: "/field-icons/number.svg",
  multipleSelects: "/field-icons/multi-select.svg",
  date: "/field-icons/calendar.svg",
  rating: "/field-icons/rating.svg",
  email: "/field-icons/email.svg",
  singleSelect: "/field-icons/select.svg",
}

const TableField = React.forwardRef<HTMLDivElement, TableFieldProps>(
  ({ name, ...props }, ref) => {
    const icon = icons[props.type];

    return (
      <div {...props} ref={ref} className=" flex items-center gap-x-2">
        <span>
          <Image
            src={icon}
            width={24}
            height={24}
            alt="Check square icon"
          />
        </span>
        {name}
      </div>
    );
  }
);

export default TableField;