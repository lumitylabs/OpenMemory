type SearchSvgProps = {
  fill: string;
  classParameters: string;
};

const SearchSvg: React.FC<SearchSvgProps> = ({ fill, classParameters }) => (
  <svg
    width="18"
    height="18"
    fill="none"
    viewBox="0 0 18 18"
    stroke={fill}
    className={classParameters}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M15.7506 15.7496L11.8528 11.8519M11.8528 11.8519C12.9078 10.7969 13.5004 9.36613 13.5004 7.87423C13.5004 6.38234 12.9078 4.95154 11.8528 3.89661C10.7979 2.84168 9.36711 2.24902 7.87521 2.24902C6.38331 2.24902 4.95252 2.84168 3.89759 3.89661C2.84265 4.95154 2.25 6.38234 2.25 7.87423C2.25 9.36613 2.84265 10.7969 3.89759 11.8519C4.95252 12.9068 6.38331 13.4994 7.87521 13.4994C9.36711 13.4994 10.7979 12.9068 11.8528 11.8519Z"
      stroke="#75A8BD"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
);

export default SearchSvg;
