import * as React from 'react';
const SVG = require('./logo.inline.svg');
import './style.less';

const Logo =  () => {
  return (
    <span className="localhost-logo">
      <SVG />
      <span className="title">Impactasaurus</span>
      <span className="little">LH</span>
    </span>
  );
};

export default Logo;
