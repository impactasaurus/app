import * as React from 'react';
const SVG = require('./logo.inline.svg');
import './style.less';

const subdomain = () => window.location.hostname.split('.')[0];

class Logo extends React.Component<any, any> {

  constructor(props) {
    super(props);
    const loadBranding = subdomain() !== 'app';
    this.state = {
      logo: null,
      loadBranding,
      subdomain: subdomain(),
    };
  }

  public componentDidMount() {
    const {loadBranding, subdomain} = this.state;
    if(loadBranding) {
      import(/* webpackChunkName: "logo-[request]" */`./../../../branding/${subdomain}/${subdomain}.tsx`)
      .then((m) => {
        this.setState({
          logo: m.default,
        });
      })
      .catch(() => {
        console.log(`no logo for subdomain '${subdomain}'`);
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
