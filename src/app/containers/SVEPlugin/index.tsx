import { PageWrapperHoC } from 'components/PageWrapperHoC';
import React from 'react';


const SVEInner = () => {
  // eslint-disable-next-line i18next/no-literal-string
  return <div>Integration coming soon!</div>;
}
export const SVE = PageWrapperHoC("Social Value Engine", "sve", SVEInner);
