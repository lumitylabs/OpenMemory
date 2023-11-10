import React from "react";
import ImgComponent from "./general/manager/img-manager/ImgComponent";

const Navbar: React.FC = () => {
  return (
    <div className="fixed w-full z-10">
      <div className="bg-[#1B1B1B] text-white">
        <h1
          className="text-2xl text-white p-6 pl-12 cursor-pointer select-none flex items-center gap-2 font-Saira"
          onClick={() => (window.location.href = "/")}
        >
          <ImgComponent name="Brain" type="nav-logo" />
          OpenMemory
        </h1>
        <div className="bg-[#131313] h-0.5"></div>
      </div>
    </div>
  );
};

export default Navbar;
