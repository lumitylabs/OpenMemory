type ImportSvgProps = {
  fill: string;
  classParameters: string;
};

const ImportSvg: React.FC<ImportSvgProps> = ({ fill, classParameters }) => (
  <svg
    width="16"
    height="22"
    viewBox="0 0 16 22"
    strokeWidth="1"
    fill={fill}
    className={classParameters}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M5 7.25H3.5C2.90326 7.25 2.33097 7.48705 1.90901 7.90901C1.48705 8.33097 1.25 8.90326 1.25 9.5V18.5C1.25 19.0967 1.48705 19.669 1.90901 20.091C2.33097 20.5129 2.90326 20.75 3.5 20.75H12.5C13.0967 20.75 13.669 20.5129 14.091 20.091C14.5129 19.669 14.75 19.0967 14.75 18.5V9.5C14.75 8.90326 14.5129 8.33097 14.091 7.90901C13.669 7.48705 13.0967 7.25 12.5 7.25H11M5 11L8 14M8 14L11 11M8 14V1.25"
      stroke="white"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
);

export default ImportSvg;
