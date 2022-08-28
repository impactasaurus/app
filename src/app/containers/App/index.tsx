import * as React from "react";
import { Helmet } from "react-helmet";
import { IStore } from "redux/IStore";
import { Redirect, Switch } from "react-router-dom";
import * as containers from "containers";
import { Loader } from "semantic-ui-react";
import { Footer } from "components/Footer";
import { Tracker } from "components/Tracker";
import { TokenRefresher } from "components/TokenRefresher";
import { useSelector } from "react-redux";
import Route from "components/Route";
import { LogoutConfirmation } from "components/LogoutConfirmation";
import { LogOutListener } from "components/LogOutListener";
import { Header } from "components/Header";
import { IfLoggedIn } from "components/IfLoggedIn";
import { Localiser } from "components/Localiser";
import { PageWrapper } from "components/PageWrapperHoC";
import { Toaster } from "react-hot-toast";
const appConfig = require("../../../../config/main");
import "./style.less";
import "./../../theme/typo.less";
import "semantic-ui-less/semantic.less";
import "theme/form.less";

const wrapper = (child: JSX.Element): JSX.Element[] => {
  return [
    <Helmet key="helm" {...appConfig.app} {...appConfig.app.head} />,
    <Header key="header" />,
    <div key="content" id="main-app-content">
      {child}
    </div>,
    <Toaster key="toast" />,
    <Footer key="footer" />,
  ];
};

export const App = (): JSX.Element[] => {
  const storeLoaded = useSelector((s: IStore) => s.storage.loaded);
  if (storeLoaded !== true) {
    return wrapper(
      <PageWrapper>
        <Loader key="loader" active={true} inline="centered" />
      </PageWrapper>
    );
  }

  return wrapper(
    <>
      <IfLoggedIn>
        <Localiser />
        <Tracker />
        <TokenRefresher />
        <LogOutListener />
      </IfLoggedIn>
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
        <Route public={true} path="/login" component={containers.Login} />
        <Route path="/dataentry/:id" component={containers.DataEntry} />
        <Route path="/meeting/:id/edit" component={containers.RecordEdit} />
        <Route path="/meeting/:id/view" component={containers.RecordView} />
        <Route
          beneficiary={true}
          path="/meeting/:id"
          component={containers.Meeting}
        />
        <Route
          public={true}
          user={<LogoutConfirmation />}
          path="/smn/:id"
          component={containers.SummonAcceptance}
        />
        <Route
          path="/report/export/:questionSetID/:start/:end"
          component={containers.ExportReport}
        />
        <Route
          path="/report/:type/:questionSetID/:start/:end"
          component={containers.Report}
        />
        <Route path="/report" component={containers.ReportForm} />
        <Route
          public={true}
          beneficiary={true}
          user={<LogoutConfirmation />}
          path="/jti/:jti"
          component={containers.BeneficiaryRedirect}
        />
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
        <Route public={true} path="/redirect" component={containers.Redirect} />
        <Route
          public={true}
          user={<Redirect to={"/"} />}
          beneficiary={false}
          path="/signup"
          component={containers.Signup}
        />
        <Route public={true} path="/invite/:id" component={containers.Invite} />
        <Route
          public={true}
          path="/unsubscribe/:uid"
          component={containers.Unsubscribe}
        />
        <Route path="/external/:b64url" component={containers.ExternalLink} />
        <Route path="/plugin/sve" component={containers.SVE} />
      </Switch>
    </>
  );
};
