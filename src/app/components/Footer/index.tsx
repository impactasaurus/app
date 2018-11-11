import * as React from 'react';
import './style.less';

export const Footer = () => (
  <div id="footer">
    <span className="left">
      <span className="copyright">&copy; {new Date().getFullYear()} Impactasaurus.</span>
      <a href="https://impactasaurus.org/terms">Terms of Use</a>
      <a href="https://impactasaurus.org/cookie">Cookie Policy</a>
      <a href="https://impactasaurus.org/privacy">Privacy Policy</a>
    </span>
    <span className="right">
      <a href="https://impactasaurus.org">About</a>
      <a href="mailto:support@impactasaurus.org">Contact Us</a>
    </span>
  </div>
);
