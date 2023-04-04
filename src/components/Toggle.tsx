import classNames from "classnames";
import React from "react";

// Extend label element props

interface ToggleProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  value: boolean;
  onValueChange: (value: boolean) => void;
}

const ToggleButton: React.FC<ToggleProps> = ({ onValueChange, value, ...rest }) => {
  
  return (
    <label {...rest} className="flex cursor-pointer select-none items-center">
      <div className="relative">
        <input
          type="checkbox"
          className="sr-only"
          checked={value}
          onChange={(e) => onValueChange(e.target.checked)}
        />
        <div className={
          classNames({
            "block h-8 w-14 rounded-full bg-[#d3d4d8]" : true,
            "bg-[#478af7]": value
          })
        }></div>
        <div className={
          classNames({
            "dot absolute left-1 top-1 h-6 w-6 rounded-full bg-white transition": true,
            "transform translate-x-6": value
          })
        }></div>
      </div>
    </label>
  );
};

export default ToggleButton;
