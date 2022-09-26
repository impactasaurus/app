import React from "react";
import * as config from "../../../../config/main";
import { CopyBox } from "components/CopyBox";
import { Message } from "semantic-ui-react";
import { AssessmentType, defaultRemoteMeetingLimit } from "models/assessment";
import { useTranslation } from "react-i18next";

export const QuestionnaireLink = (p: {
  link: string;
  typ: AssessmentType;
}): JSX.Element => {
  const { t } = useTranslation();
  const url = `${config.app.root}/${p.link}`;
  return (
    <Message success={true}>
      <Message.Header>{t("Success")}</Message.Header>
      <div>
        {t(
          "Please provide the following link to your {noBeneficiaries, plural, one {beneficiary} other {beneficiaries}}. They have {noDays, plural, one {# day} other {# days}} to complete the questionnaire",
          {
            noBeneficiaries: p.typ === AssessmentType.summon ? 100 : 1,
            noDays: defaultRemoteMeetingLimit,
          }
        )}
      </div>
      <div style={{ marginTop: "1em" }}>
        <CopyBox text={url} />
      </div>
    </Message>
  );
};
