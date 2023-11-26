type ProcessSvgProps = {
  fill: string;
  classParameters: string;
};

const ProcessSvg: React.FC<ProcessSvgProps> = ({ fill, classParameters }) => (
  <svg
    width="32"
    height="32"
    viewBox="0 0 32 32"
    fill="none"
    className={classParameters}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M10 21.1V10.9C10 10.4029 10.4029 10 10.9 10H21.1C21.5971 10 22 10.4029 22 10.9V21.1C22 21.5971 21.5971 22 21.1 22H10.9C10.4029 22 10 21.5971 10 21.1Z"
      stroke="white"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <path
      d="M28 4.9V27.1C28 27.5971 27.5971 28 27.1 28H4.9C4.40294 28 4 27.5971 4 27.1V4.9C4 4.40294 4.40294 4 4.9 4H27.1C27.5971 4 28 4.40294 28 4.9Z"
      stroke="white"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <path
      d="M23.5 4V1"
      stroke="white"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <path
      d="M16 4V1"
      stroke="white"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <path
      d="M8.5 4V1"
      stroke="white"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <path
      d="M8.5 28V31"
      stroke="white"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <path
      d="M16 28V31"
      stroke="white"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <path
      d="M23.5 28V31"
      stroke="white"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <path
      d="M28 23.5H31"
      stroke="white"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <path
      d="M28 16H31"
      stroke="white"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <path
      d="M28 8.5H31"
      stroke="white"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <path
      d="M4 23.5H1"
      stroke="white"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <path
      d="M4 16H1"
      stroke="white"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <path
      d="M4 8.5H1"
      stroke="white"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
);

export default ProcessSvg;
