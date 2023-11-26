type MoreSvgProps = {
  fill: string;
  classParameters: string;
};

const MoreSvg: React.FC<MoreSvgProps> = ({ fill, classParameters }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    stroke-width="1.5"
    stroke={fill}
    className={classParameters}
  >
    <path
      stroke-linecap="round"
      stroke-linejoin="round"
      d="M6.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM12.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM18.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
    />
  </svg>
);

export default MoreSvg;
