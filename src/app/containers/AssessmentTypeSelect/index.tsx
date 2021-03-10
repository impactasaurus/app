import * as React from 'react';
import {AssessmentTypeSelector} from 'components/AssessmentTypeSelector';
import {IURLConnector, UrlHOC} from 'redux/modules/url';
import { AssessmentType } from 'models/assessment';
import { PageWrapperHoC } from 'components/PageWrapperHoC';
import './style.less';

interface IProps extends IURLConnector {
  location: {
    search: string,
    pathname: string,
  };
}

const AssessmentTypeSelectInner = (p: IProps) => {
  const typeSelected = (selected: AssessmentType) => {
    p.setURL(`${p.location.pathname}/${AssessmentType[selected]}`, p.location.search);
  };
  return <AssessmentTypeSelector typeSelector={typeSelected}/>;
}

// t("New Record")
const AssementTypePage = PageWrapperHoC("New Record", "conduct", AssessmentTypeSelectInner);
const AssessmentTypeSelect = UrlHOC(AssementTypePage);
export { AssessmentTypeSelect };
