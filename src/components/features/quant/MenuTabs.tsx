import React from "react";
import type { MenuType } from "./types";

interface Props {
  selected: MenuType;
  onSelect: (menu: MenuType) => void;
}

const MenuTabs: React.FC<Props> = ({ selected, onSelect }) => {
  return (
    <div className="flex justify-start w-full gap-2 mb-4 text-xl font-extrabold">
      <button
        className={`text-start py-2 rounded ${
          selected === "stock" ? "text-white" : "text-gray-500"
        }`}
        onClick={() => onSelect("stock")}
      >
        주식퀀트
      </button>
      <button
        className={`text-start py-2 rounded ${
          selected === "coin" ? "text-white" : "text-gray-500"
        }`}
        onClick={() => onSelect("coin")}
      >
        코인퀀트
      </button>
    </div>
  );
};

export default MenuTabs;
