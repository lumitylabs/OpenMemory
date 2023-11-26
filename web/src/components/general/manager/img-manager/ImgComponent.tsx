import ImagesData from "./ImgsData";

interface ImgComponentProps {
  name: string;
  type: string;
}

const ImgComponent: React.FC<ImgComponentProps> = (props) => {
  let className = "";
  switch (props.type) {
    case "icons-button":
      className = "h-[16px] w-[16px]";
      break;

    case "reminder-button":
      className = "h-[20px] w-[20px]";
      break;

    case "brain-logo":
      className = "h-[24px] w-[24px]";
      break;
  }
  return (
    <img className={className} src={ImagesData[props.name]} alt="Imagem" />
  );
};

export default ImgComponent;
