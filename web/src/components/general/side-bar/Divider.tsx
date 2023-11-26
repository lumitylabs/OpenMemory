import React from "react";

interface DividerProps {
  classParameters?: string;
}

const Divider: React.FC<DividerProps> = ({ classParameters }) => {
  return <div className={`border-t ${classParameters}`} />;
};

export default Divider;
