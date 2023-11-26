type ArrowDownSvgProps = {
  fill: string;
  classParameters: string;
};

const ArrowDownSvg: React.FC<ArrowDownSvgProps> = ({
  fill,
  classParameters,
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke-width="1.5"
    stroke={fill}
    className={classParameters}
  >
    <path
      stroke-linecap="round"
      stroke-linejoin="round"
      d="M19.5 8.25l-7.5 7.5-7.5-7.5"
    />
  </svg>
);

export default ArrowDownSvg;
