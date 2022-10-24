/* eslint-disable react/destructuring-assignment */
import type { SVGComponent } from './index';

const FullScreenExit = (props: SVGComponent) => (
  <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none">
    <g clipPath="url(#clip0_4547_4289)">
      <path
        d="M0.642958 14.8847H7.11707V21.3571C7.11707 21.7813 7.46082 22.125 7.88502 22.125C8.30923 22.125 8.65298 21.7813 8.65298 21.3571V14.1171C8.65298 13.7355 8.37476 13.419 8.01003 13.3593V13.3488H7.88502H0.642958C0.218748 13.3488 -0.125 13.6925 -0.125 14.1167C-0.125 14.5409 0.218748 14.8847 0.642958 14.8847Z"
        fill={props.fill || 'currentColor'}
        stroke={props.fill || 'currentColor'}
        strokeWidth={0.25}
      />
      <path
        d="M22.605 13.3488H15.4879C15.0637 13.3488 14.72 13.6926 14.72 14.1168V21.3567C14.72 21.7809 15.0637 22.1247 15.4879 22.1247C15.9121 22.1247 16.2559 21.7809 16.2559 21.3567V14.8843H22.73C23.1542 14.8843 23.498 14.5406 23.498 14.1163C23.498 13.6921 23.1542 13.3484 22.73 13.3484H22.605V13.3488Z"
        fill={props.fill || 'currentColor'}
        stroke={props.fill || 'currentColor'}
        strokeWidth={0.25}
      />
      <path
        d="M14.72 7.88403C14.719 8.30857 15.0631 8.65213 15.4879 8.65213H15.6129V8.65171H22.73C23.1542 8.65171 23.498 8.30796 23.498 7.88375C23.498 7.45954 23.1542 7.1158 22.73 7.1158H16.2559V0.642958C16.2559 0.218749 15.9121 -0.125 15.4879 -0.125C15.0637 -0.125 14.72 0.218748 14.72 0.642958V7.88403ZM14.72 7.88403C14.72 7.88398 14.72 7.88393 14.72 7.88388L14.845 7.88418H14.72V7.88403Z"
        fill={props.fill || 'currentColor'}
        stroke={props.fill || 'currentColor'}
        strokeWidth={0.25}
      />
      <path
        d="M8.01003 -0.125V-0.11447C8.37468 -0.0548669 8.65298 0.261226 8.65298 0.642958V7.88418C8.65298 8.30839 8.30923 8.65213 7.88502 8.65213H0.642958C0.218748 8.65213 -0.125 8.30839 -0.125 7.88418C-0.125 7.46 0.218752 7.11614 0.643107 7.11664M8.01003 -0.125L7.11707 7.24164V7.11664M8.01003 -0.125H7.88502C7.46082 -0.125 7.11707 0.218748 7.11707 0.642958V7.11664M8.01003 -0.125L7.24207 7.11664H7.11707M0.643107 7.11664L0.642958 7.24164V7.11664H0.643107ZM0.643107 7.11664H7.11707"
        fill={props.fill || 'currentColor'}
        stroke={props.fill || 'currentColor'}
        strokeWidth={0.25}
      />
    </g>
    <defs>
      <clipPath id="clip0_4547_4289">
        <rect width={24} height={24} fill={props.fill || 'currentColor'} />
      </clipPath>
    </defs>
  </svg>
);

export default FullScreenExit;