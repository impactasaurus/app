import * as React from 'react';
const SVG = require('./logo.inline.svg');
import './style.less';

const Logo =  () => {
  return (
    <span className="impactasaurus-logo">
      <SVG />
      <span className="title">Impactasaurus</span>
    </span>
  );
};

export default Logo;
