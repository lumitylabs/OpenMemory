type AddSvgProps = {
  fill: string;
  classParameters: string;
};

const AddSvg: React.FC<AddSvgProps> = ({ fill, classParameters }) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    strokeWidth="1"
    fill={fill}
    className={classParameters}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M12 4.5V19.5M19.5 12H4.5"
      stroke="white"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
);

export default AddSvg;
