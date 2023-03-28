import type { SVGProps } from 'react';
import React from 'react';

const SvgStreamLocal = ({ fill, ...props }: SVGProps<SVGSVGElement>) => (
  <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M14.526 12a2.526 2.526 0 1 1-5.053 0 2.526 2.526 0 0 1 5.053 0Z"
      fill={fill || 'currentColor'}
    />
    <mask
      id="a"
      style={{
        maskType: 'luminance',
      }}
      maskUnits="userSpaceOnUse"
      x={5}
      y={15}
      width={15}
      height={10}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M5.313 15.838h13.895V24H5.313v-8.162Z"
        fill={fill || 'currentColor'}
      />
    </mask>
    <g mask="url(#a)">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12.132 15.79c-3.094 0-5.605 2.61-5.815 5.966a.743.743 0 0 0 .346.68 10.67 10.67 0 0 0 5.47 1.515c1.978 0 3.84-.548 5.47-1.515a.743.743 0 0 0 .345-.68c-.21-3.357-2.721-5.967-5.816-5.967Z"
        fill={fill || 'currentColor'}
      />
    </g>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M2.168 15.077a10.488 10.488 0 0 1-.41-3.279c.164-5.199 4.207-9.535 9.329-9.985 6.06-.533 11.161 4.306 11.161 10.328 0 1.004-.14 1.988-.416 2.936a.14.14 0 0 0 .083.17l1.378.533a.142.142 0 0 0 .186-.092c.333-1.102.508-2.245.52-3.41C24.07 5.82 19.027.361 12.654.018 5.742-.356 0 5.228 0 12.14c0 1.213.175 2.402.52 3.548.024.079.11.12.186.091l1.379-.532a.14.14 0 0 0 .083-.171Z"
      fill={fill || 'currentColor'}
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="m19.238 14.517-1.405-.541a.142.142 0 0 1-.082-.182c.232-.654.35-1.34.353-2.044.01-3.058-2.271-5.709-5.285-6.105-3.729-.49-6.923 2.43-6.923 6.086 0 .71.119 1.403.353 2.062a.143.143 0 0 1-.082.183l-1.404.54a.146.146 0 0 1-.19-.085 7.957 7.957 0 0 1-.467-2.784c.041-4.072 3.226-7.515 7.263-7.833 4.637-.364 8.526 3.328 8.526 7.917 0 .928-.158 1.836-.468 2.7a.146.146 0 0 1-.19.086Z"
      fill={fill || 'currentColor'}
    />
  </svg>
);

export default SvgStreamLocal;
