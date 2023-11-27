type LogoSvgProps = {
  fill: string;
  classParameters: string;
};

const LogoSvg: React.FC<LogoSvgProps> = ({ fill, classParameters }) => (
  <svg
    width="31"
    height="26"
    viewBox="0 0 31 26"
    fill={fill}
    className={classParameters}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M23.7418 4.19305C22.4813 2.41287 19.5708 1.19625 17.6376 2.76592C16.8695 3.39025 16.4876 4.20188 16.4921 5.20082C16.5143 10.0684 16.5231 14.9365 16.5187 19.8052C16.5165 20.9743 16.4538 21.7854 16.3305 22.2384C15.4797 25.3413 12.1912 26.5413 9.2806 25.6181C7.12821 24.9374 5.65683 23.5407 4.86648 21.4279C4.85922 21.4083 4.84752 21.3905 4.83225 21.3759C4.81697 21.3612 4.79851 21.3501 4.77823 21.3434C2.19069 20.4864 0.475664 18.146 0.830326 15.3266C0.836986 15.2724 0.826997 15.2211 0.800356 15.1724C-0.59498 12.6746 -0.163728 9.86176 2.07747 8.10313C2.12076 8.06887 2.14296 8.02412 2.14407 7.96887C2.17737 5.48094 3.07818 3.55324 5.48256 2.64161C5.53584 2.62172 5.57857 2.58912 5.61077 2.54382C5.89494 2.13828 6.09086 1.87031 6.19854 1.73992C8.29487 -0.786138 11.8465 -0.44469 13.8429 2.00844C14.3874 2.67641 14.0677 3.50352 13.2535 3.69413C12.5142 3.86817 12.2378 3.13389 11.7732 2.74437C10.7725 1.90733 9.40881 1.7366 8.30986 2.47917C7.12932 3.27809 6.78298 4.9008 7.5023 6.11742C7.85196 6.71081 7.89692 7.16332 7.30082 7.56278C5.94545 8.4711 5.19283 6.17543 5.15454 5.30192C5.14788 5.16379 5.09959 5.14722 5.00967 5.2522C4.16881 6.23013 4.08722 7.44509 4.23375 8.6816C4.27204 8.99819 3.94902 9.32803 3.6493 9.50373C1.7661 10.6126 1.60292 12.7061 2.73351 14.5061C2.82509 14.6503 2.91334 14.9006 2.87837 15.0664C2.16572 18.3996 5.96543 20.9224 8.79107 19.1356C9.03417 18.9814 9.26395 18.7809 9.55201 18.7543C10.0404 18.7079 10.3845 18.9035 10.5844 19.3411C11.2654 20.8229 8.23826 21.6119 7.30748 21.6915C7.29413 21.6926 7.28134 21.6973 7.27043 21.705C7.25953 21.7128 7.2509 21.7233 7.24546 21.7355C7.24002 21.7477 7.23796 21.7611 7.2395 21.7743C7.24103 21.7876 7.24611 21.8002 7.2542 21.8108C8.59625 23.5727 11.2337 24.6733 13.2135 23.3871C14.0594 22.8379 14.4829 21.9837 14.484 20.8246C14.4895 15.6012 14.4873 10.3795 14.4773 5.15938C14.4723 1.86258 17.3895 -0.366786 20.5815 0.118867C23.1058 0.501753 25.2753 2.05816 26.0946 4.50963C26.1123 4.56267 26.1479 4.59969 26.2011 4.62068C28.9518 5.6931 30.4388 7.70864 30.204 10.717C30.1995 10.7734 30.2106 10.8259 30.2373 10.8745C31.4128 13.0458 31.288 15.6498 29.453 17.3852C29.2677 17.5598 29.0839 17.7361 28.9019 17.914C28.863 17.9527 28.8442 17.9996 28.8453 18.0549C28.9102 20.4036 27.8546 22.5202 25.5268 23.3208C25.4746 23.3396 25.433 23.3722 25.4019 23.4186C24.0032 25.5452 22.0551 26.538 19.5491 25.7076C18.695 25.4242 17.0632 24.3717 16.9033 23.3655C16.8278 22.8937 17.0698 22.5451 17.6293 22.3197C18.3936 22.0114 18.7632 22.8434 19.2095 23.2213C20.3983 24.2275 22.1433 24.2739 23.1823 23.0788C23.9766 22.1672 24.0948 20.8958 23.4871 19.8483C23.3272 19.572 23.2495 19.3505 23.2539 19.1836C23.2628 18.7527 23.4832 18.4532 23.915 18.2853C25.1521 17.8046 25.7998 19.8052 25.8448 20.6654C25.8526 20.8268 25.9086 20.8456 26.013 20.7218C26.8788 19.6908 26.8705 18.5007 26.7773 17.2178C26.7589 16.9476 27.1236 16.6045 27.4017 16.452C29.2732 15.4178 29.3465 13.1934 28.2875 11.5392C28.0261 11.1314 28.1659 10.7916 28.2026 10.354C28.4706 7.07049 24.4878 5.1312 21.9069 7.05558C21.1027 7.6556 19.9521 6.64783 20.4166 5.82736C20.9445 4.89583 22.7011 4.38697 23.6952 4.29415C23.7696 4.28752 23.7851 4.25382 23.7418 4.19305Z" />
  </svg>
);

export default LogoSvg;