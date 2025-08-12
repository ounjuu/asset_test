import React, { useState } from "react";
import MenuTabs from "./MenuTabs";
import DataDisplay from "./DataDisplay";
import type { MenuType } from "./types";

const MainPage: React.FC = () => {
  const [selectedMenu, setSelectedMenu] = useState<MenuType>("stock");

  return (
    <div>
      <MenuTabs selected={selectedMenu} onSelect={setSelectedMenu} />
      <DataDisplay menu={selectedMenu} />
    </div>
  );
};

export default MainPage;
