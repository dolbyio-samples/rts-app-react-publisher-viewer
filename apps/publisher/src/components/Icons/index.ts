import type { SVGProps } from 'react';

export interface SVGComponent extends SVGProps<SVGSVGElement> {
  testID?: string;
}
