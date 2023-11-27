type RemindSvgProps = {
  fill: string;
  classParameters: string;
};

const RemindSvg: React.FC<RemindSvgProps> = ({ fill, classParameters }) => (
  <svg
    width="54px"
    height="54px"
    viewBox="0 0 24 24"
    stroke-width="1"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    color={fill}
  >
    <path
      d="M9.5 14.5L3 21"
      stroke={fill}
      stroke-width="1"
      stroke-linecap="round"
      stroke-linejoin="round"
    ></path>
    <path
      d="M5.00007 9.48528L14.1925 18.6777L15.8895 16.9806L15.4974 13.1944L21.0065 8.5211L15.1568 2.67141L10.4834 8.18034L6.69713 7.78823L5.00007 9.48528Z"
      stroke={fill}
      stroke-width="1"
      stroke-linecap="round"
      stroke-linejoin="round"
    ></path>
  </svg>
);

export default RemindSvg;
