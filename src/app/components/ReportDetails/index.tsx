import * as React from "react";
import { IExcluded } from "models/report";
import { IOutcomeSet } from "models/outcomeSet";
import {
  Message,
  Accordion,
  Label,
  SemanticShorthandCollection,
  AccordionPanelProps,
} from "semantic-ui-react";
import { renderArray } from "helpers/react";
import "./style.less";
import { BeneficiaryPill } from "components/BeneficiaryPill";
import { WithTranslation, withTranslation } from "react-i18next";

interface IProp extends WithTranslation {
  introduction?: string;
  includedBeneficiaries: string[];
  excluded: IExcluded;
  warnings: string[];
  questionSet: IOutcomeSet;
}

class ReportDetailsInner extends React.Component<IProp, null> {
  constructor(props) {
    super(props);
    this.renderWarnings = this.renderWarnings.bind(this);
    this.renderOverview = this.renderOverview.bind(this);
  }

  private getCategoryString(catID: string, qs: IOutcomeSet): string {
    const cat = qs.categories.find((c) => c.id === catID);
    if (cat === undefined) {
      return catID;
    } else {
      return cat.name;
    }
  }

  private getQuestionString(qID: string, qs: IOutcomeSet): string {
    const question = qs.questions.find((q) => q.id === qID);
    if (question === undefined) {
      return qID;
    } else {
      return question.question;
    }
  }

  private renderOverview(): JSX.Element {
    const {
      includedBeneficiaries: includedBens,
      excluded,
      questionSet: qs,
      t,
    } = this.props;
    const noBens = includedBens.length;
    const info = noBens > 0;
    const title = info ? t("Overview") : t("Report failed");
    const panels: SemanticShorthandCollection<AccordionPanelProps> = [];

    if (noBens > 0) {
      panels.push({
        key: "bens-included",
        title: t(
          "This report aggregates data covering {noBens, plural, one {# beneficiary} other {# beneficiaries}}.",
          { noBens }
        ),
        content: {
          content: (
            <div>
              {includedBens.sort().map((bID) => (
                <BeneficiaryPill
                  key={bID}
                  beneficiaryID={bID}
                  questionnaireID={qs.id}
                />
              ))}
            </div>
          ),
        },
      });
    }
    if (excluded.beneficiaryIDs.length > 0) {
      panels.push({
        key: "bens-excluded",
        title: t(
          "{excludedBens, plural, one {# beneficiary has} other {# beneficiaries have}} been excluded because they only have a single record.",
          {
            excludedBens: excluded.beneficiaryIDs.length,
          }
        ),
        content: {
          content: (
            <div>
              {excluded.beneficiaryIDs.sort().map((bID) => (
                <BeneficiaryPill
                  key={bID}
                  beneficiaryID={bID}
                  questionnaireID={qs.id}
                />
              ))}
            </div>
          ),
        },
      });
    }
    if (excluded.categoryIDs.length > 0 || excluded.questionIDs.length > 0) {
      panels.push({
        key: "qs+cats",
        title: t(
          "{noCategories, plural, one {# category} other {# categories}} and {noQuestions, plural, one {# question} other {# questions}} have been excluded because they are not present within the records.",
          {
            noCategories: excluded.categoryIDs.length,
            noQuestions: excluded.questionIDs.length,
          }
        ),
        content: {
          content: (
            <div>
              {excluded.categoryIDs.map((cID) => (
                <Label key={cID}>{this.getCategoryString(cID, qs)}</Label>
              ))}
              {excluded.questionIDs.map((qID) => (
                <Label key={qID}>{this.getQuestionString(qID, qs)}</Label>
              ))}
            </div>
          ),
        },
      });
    }
    return (
      <Message info={info} error={!info} className="report-overview">
        <Message.Header>{title}</Message.Header>
        {this.props.introduction && (
          <div className="intro">{this.props.introduction}</div>
        )}
        <Accordion exclusive={false} panels={panels} />
      </Message>
    );
  }

  private renderWarning(str: string): JSX.Element {
    return <div key={str}>{str}</div>;
  }

  private renderWarnings(): JSX.Element {
    const { t, warnings } = this.props;
    if (!Array.isArray(warnings) || warnings.length === 0) {
      return <div />;
    }
    return (
      <Message warning={true}>
        <Message.Header>{t("Warnings")}</Message.Header>
        {renderArray<string>(this.renderWarning, warnings)}
      </Message>
    );
  }

  public render() {
    return (
      <div className="report-details">
        {this.renderOverview()}
        {this.renderWarnings()}
      </div>
    );
  }
}

const TranslatedReportDetails = withTranslation()(ReportDetailsInner);
const ReportDetails = TranslatedReportDetails;
export { ReportDetails };
