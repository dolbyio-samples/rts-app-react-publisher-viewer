import type { SVGProps } from 'react';
import React from 'react';

const SvgPlay = ({ fill, ...rest }: SVGProps<SVGSVGElement>) => (
  <svg
    fill={fill || 'currentColor'}
    height="100%"
    viewBox="0 0 22 22"
    width="100%"
    xmlns="http://www.w3.org/2000/svg"
    {...rest}
  >
    <g clipPath="url(#clip_expand)">
      <path d="M0.757856 0.000889049C0.549339 0.0225456 0.355933 0.121259 0.215914 0.277891C0.075896 0.434523 -0.00116441 0.636986 -0.000157084 0.847004V4.79554C-0.00368273 5.02218 0.0844583 5.24026 0.243616 5.40142C0.402773 5.56258 0.619348 5.65374 0.845997 5.65374C1.07265 5.65374 1.28972 5.56309 1.44838 5.40142C1.60754 5.24026 1.69517 5.02168 1.69215 4.79554V2.88272L6.45177 7.64211C6.60538 7.81839 6.82548 7.92264 7.05918 7.9312C7.29288 7.93926 7.51953 7.85062 7.68524 7.68593C7.85145 7.52124 7.9416 7.29511 7.93505 7.06142C7.92851 6.82773 7.82526 6.60713 7.65048 6.45201L2.89087 1.69312H4.79471C5.02136 1.69614 5.23945 1.60851 5.40062 1.44936C5.56179 1.29021 5.65296 1.07364 5.65296 0.8465C5.65296 0.619359 5.5623 0.403297 5.40062 0.244147C5.23945 0.0855005 5.02136 -0.00213279 4.79471 0.000889049H0.845997C0.816784 -0.000621871 0.787572 -0.000621871 0.757856 0.000889049ZM17.1168 0.000889049C16.8922 0.0124728 16.6817 0.112697 16.5316 0.279906C16.381 0.447114 16.3029 0.666701 16.315 0.891324C16.3266 1.11595 16.4268 1.32647 16.594 1.47655C16.7612 1.62714 16.9808 1.70521 17.2055 1.69312H19.1093L14.3497 6.45252C14.1749 6.60764 14.0717 6.82823 14.0651 7.06192C14.0586 7.29561 14.1487 7.52174 14.315 7.68643C14.4807 7.85112 14.7073 7.93977 14.941 7.93171C15.1747 7.92315 15.3943 7.81839 15.5484 7.64262L20.308 2.88322V4.79604C20.305 5.02268 20.3927 5.24076 20.5518 5.40192C20.711 5.56309 20.9275 5.65425 21.1547 5.65425C21.3818 5.65425 21.5979 5.56359 21.7571 5.40192C21.9162 5.24076 22.0039 5.02218 22.0009 4.79604V0.847004C22.0009 0.622884 21.9117 0.407326 21.753 0.24868C21.5944 0.0900333 21.3788 0.000889049 21.1547 0.000889049H17.206C17.1768 -0.000621871 17.1471 -0.000621871 17.1178 0.000889049H17.1168ZM6.95442 14.0937C6.76253 14.1189 6.58524 14.2091 6.45177 14.3491L1.69215 19.1085V17.2047C1.69668 16.9756 1.60854 16.7545 1.44737 16.5918C1.2862 16.4291 1.0661 16.3385 0.836931 16.341C0.610786 16.3435 0.395218 16.4357 0.238076 16.5983C0.0809327 16.7605 -0.00519371 16.9791 -0.000157084 17.2047V21.1533C-0.000157084 21.3774 0.0889913 21.5929 0.247645 21.7516C0.406299 21.9102 0.621867 21.9994 0.845997 21.9994H4.79471C5.02136 22.0029 5.23945 21.9148 5.40062 21.7556C5.56179 21.5965 5.65296 21.3799 5.65296 21.1533C5.65296 20.9266 5.5623 20.7096 5.40062 20.5509C5.23945 20.3918 5.02086 20.3041 4.79471 20.3071H2.8818L7.65048 15.5387C7.82072 15.3725 7.9134 15.1423 7.90534 14.9046C7.89728 14.6669 7.79 14.4433 7.60868 14.2892C7.42736 14.135 7.19014 14.0635 6.95392 14.0932L6.95442 14.0937ZM14.8519 14.0937C14.6378 14.1164 14.4409 14.2202 14.3009 14.3828C14.1603 14.5455 14.0878 14.756 14.0969 14.9706C14.1059 15.1856 14.1961 15.3886 14.3497 15.5392L19.1184 20.3077H17.2055C16.9788 20.3046 16.7607 20.3923 16.5996 20.5514C16.4384 20.7106 16.3472 20.9271 16.3472 21.1538C16.3472 21.3804 16.4379 21.597 16.5996 21.7561C16.7607 21.9153 16.9793 22.0029 17.2055 21.9999H21.1542C21.3783 21.9999 21.5939 21.9107 21.7525 21.7521C21.9112 21.5934 22.0003 21.3779 22.0003 21.1538V17.2052C22.0054 16.9761 21.9167 16.755 21.7556 16.5923C21.5944 16.4296 21.3743 16.339 21.1451 16.3415C20.919 16.344 20.7034 16.4362 20.5463 16.5988C20.3891 16.761 20.303 16.9796 20.308 17.2052V19.109L15.5484 14.3496C15.3681 14.1617 15.1112 14.0676 14.8524 14.0942L14.8519 14.0937Z" />
    </g>
    <defs>
      <clipPath id="clip_expand">
        <rect height="22" width="22" />
      </clipPath>
    </defs>
  </svg>
);

export default SvgPlay;
