import type { SVGProps } from 'react';
import React from 'react';

const SvgCameraReverse = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width="100%"
    height="100%"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    fill={props.fill || 'currentColor'}
  >
    <path
      fill={props.fill || 'currentColor'}
      d="M21.25 7.5a.75.75 0 0 1 .743.648L22 8.25v8.5a3.25 3.25 0 0 1-3.066 3.245L18.75 20H6.061l.72.72a.75.75 0 0 1 .072.976l-.073.084a.75.75 0 0 1-.976.073l-.084-.073-2-2-.064-.072-.007-.01.07.082a.753.753 0 0 1 .001-1.06l2-2a.75.75 0 0 1 1.133.976l-.073.084-.72.72h12.69a1.75 1.75 0 0 0 1.744-1.607l.006-.143v-8.5a.75.75 0 0 1 .75-.75Zm-3.054-5.353.084.073 2 2c.026.025.05.052.071.081l-.07-.081a.746.746 0 0 1 .004 1.056l-.005.004-2 2a.75.75 0 0 1-1.133-.976l.073-.084.718-.72H5.25a1.75 1.75 0 0 0-1.744 1.606L3.5 7.25v8.5a.75.75 0 0 1-1.493.102L2 15.75v-8.5a3.25 3.25 0 0 1 3.066-3.245L5.25 4h12.689l-.72-.72a.75.75 0 0 1-.072-.976l.073-.084a.75.75 0 0 1 .976-.073ZM12 8a4 4 0 1 1 0 8 4 4 0 0 1 0-8Zm0 1.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5Z"
    />
  </svg>
);

export default SvgCameraReverse;