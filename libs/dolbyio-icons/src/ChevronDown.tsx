import type { SVGProps } from 'react';
import React from 'react';

const SvgInfo = ({ fill, ...rest }: SVGProps<SVGSVGElement>) => (
  <svg width="100%" height="100%" viewBox="0 0 16 10" fill="none" xmlns="http://www.w3.org/2000/svg" {...rest}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M0.655172 2.27524L7.2752 9.23785C7.65575 9.6381 8.28872 9.65407 8.68896 9.27351L15.3444 2.27547C15.7116 1.88928 15.7115 1.283 15.3441 0.896998L15.2151 0.761515C14.8637 0.392232 14.2973 0.350492 13.8976 0.645728L13.7835 0.743988L7.99892 6.82707L2.23298 0.762216C1.88171 0.392742 1.31536 0.350695 0.915492 0.645714L0.801205 0.744055L0.65529 0.89701C0.288126 1.28304 0.288074 1.88914 0.655172 2.27524Z"
      fill={fill || 'currentColor'}
    />
  </svg>
);

export default SvgInfo;
