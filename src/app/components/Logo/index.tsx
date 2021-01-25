import * as React from 'react';
import { shouldLoadBranding, loadBrandLogo } from 'theme/branding';
const SVG = require('./logo.inline.svg');
import './style.less';

interface IState {
  logo?: React.ComponentClass;
  loadBranding: boolean;
}

class Logo extends React.Component<any, IState> {

  constructor(props) {
    super(props);
    this.state = {
      logo: null,
      loadBranding: shouldLoadBranding(),
    };
  }

  public componentDidMount() {
    if(this.state.loadBranding) {
      loadBrandLogo()
      .then((logo) => {
        this.setState({
          logo,
        });
      })
      .catch(() => {
        console.log(`no logo for configured for subdomain`);
        this.setState({
          loadBranding: false,
        });
      });
    }
  }

  public render() {
    if(this.state.loadBranding) {
      const BrandedLogo = this.state.logo;
      if(BrandedLogo) {
        return <BrandedLogo />;
      }
      return <span />;
    }
    return (
      <span className="impactasaurus-logo">
        <SVG />
        <span className="title">Impactasaurus</span>
      </span>
    );
  }
}

export default Logo;
