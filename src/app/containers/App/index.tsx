import * as React from "react";
import { Helmet } from "react-helmet";
import { Header, IsLoggedIn, Localiser } from "components";
import { IStore } from "redux/IStore";
import { Route, Switch } from "react-router-dom";
import * as containers from "containers";
import { Loader } from "semantic-ui-react";
import { Footer } from "components/Footer";
import { Tracker } from "components/Tracker";
import { TokenRefresher } from "components/TokenRefresher";
import { useSelector } from "react-redux";
const appConfig = require("../../../../config/main");
import "./style.less";
import "./../../theme/typo.less";
import "semantic-ui-less/semantic.less";
import "theme/form.less";

const wrapper = (child: JSX.Element): JSX.Element[] => {
  return [
    <Helmet key="helm" {...appConfig.app} {...appConfig.app.head} />,
    <Header key="header" />,
    child,
    <Footer key="footer" />,
  ];
};

export const App = (): JSX.Element[] => {
  const storeLoaded = useSelector((s: IStore) => s.storage.loaded);
  if (storeLoaded !== true) {
    return wrapper(<Loader key="loader" active={true} inline="centered" />);
  }

  return wrapper(
    <div key="content" id="main-app-content">
      <IsLoggedIn>
        <Localiser />
        <Tracker />
        <TokenRefresher />
      </IsLoggedIn>
      <Switch>
        <Route exact={true} path="/" component={containers.Home} />
        <Route path="/record/:type" component={containers.AssessmentConfig} />
        <Route path="/record" component={containers.AssessmentTypeSelect} />
        <Route
          path="/beneficiary/:id/export/:qid"
          component={containers.ExportBenRecords}
        />
        <Route path="/beneficiary/:id" component={containers.Beneficiary} />
        <Route path="/beneficiary" component={containers.BeneficiarySelector} />
        <Route path="/profile" component={containers.Account} />
        <Route path="/settings" component={containers.Settings} />
        <Route path="/login" component={containers.Login} />
        <Route path="/dataentry/:id" component={containers.DataEntry} />
        <Route path="/meeting/:id/edit" component={containers.RecordEdit} />
        <Route path="/meeting/:id/view" component={containers.RecordView} />
        <Route path="/meeting/:id" component={containers.Meeting} />
        <Route path="/smn/:id" component={containers.SummonAcceptance} />
        <Route
          path="/report/export/:questionSetID/:start/:end"
          component={containers.ExportReport}
        />
        <Route
          path="/report/:type/:questionSetID/:start/:end"
          component={containers.Report}
        />
        <Route path="/report" component={containers.ReportForm} />
        <Route path="/jti/:jti" component={containers.BeneficiaryRedirect} />
        <Route
          path="/questions/new/custom"
          component={containers.NewQuestionnaireForm}
        />
        <Route
          path="/questions/new"
          component={containers.NewQuestionnaireTypeSelector}
        />
        <Route path="/questions/:id" component={containers.OutcomeSet} />
        <Route path="/questions" component={containers.OutcomeSets} />
        <Route
          path="/catalogue/:id"
          component={containers.CatalogueQuestionnaire}
        />
        <Route path="/catalogue" component={containers.Catalogue} />
        <Route path="/redirect" component={containers.Redirect} />
        <Route path="/signup" component={containers.Signup} />
        <Route path="/invite/:id" component={containers.Invite} />
        <Route path="/unsubscribe/:uid" component={containers.Unsubscribe} />
        <Route path="/plugin/sve" component={containers.SVE} />
        <Route path="/no-org" component={containers.NoOrgPage} />
      </Switch>
    </div>
  );
};
