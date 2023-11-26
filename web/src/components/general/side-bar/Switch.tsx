import React from "react";

interface SwitchProps {
  id: string;
  checked: boolean;
  onChange: (checked: boolean, id: string) => void;
}

const Switch: React.FC<SwitchProps> = ({ id, checked, onChange }) => {
  const toggleClass = checked ? "translate-x-5" : "translate-x-0";
  const bgClass = checked ? "bg-[#D458C8]" : "bg-[#C6C6C6]";

  return (
    <label
      htmlFor={id}
      className={`relative inline-flex items-center h-6 rounded-full w-11 cursor-pointer ${bgClass}`}
    >
      <input
        type="checkbox"
        id={id}
        className="sr-only"
        checked={checked}
        onChange={(e) => onChange(e.target.checked, id)}
      />
      <span
        className={`inline-block w-6 h-6 transform bg-white rounded-full transition-transform ${toggleClass}`}
      />
    </label>
  );
};

export default Switch;
