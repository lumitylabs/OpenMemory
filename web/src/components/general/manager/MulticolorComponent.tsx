import React from "react";
import MulticolorSvgData from "./MulticolorData";

interface MulticolorComponentProps {
  name: string;
  baseColor: string;
  selectedColor: string;
  isSelected: boolean;
  classParameters: string;
}

const MulticolorComponent: React.FC<MulticolorComponentProps> = ({
  name,
  baseColor,
  selectedColor,
  isSelected,
  classParameters,
}) => {
  const IconComponent = MulticolorSvgData[name];
  if (!IconComponent) {
    return <div>Ícone não encontrado!</div>;
  }
  const fillColor = isSelected ? selectedColor : baseColor;

  return <IconComponent fill={fillColor} classParameters={classParameters} />;
};

export default MulticolorComponent;
