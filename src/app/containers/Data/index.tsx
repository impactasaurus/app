import React, { useState } from "react";
import { Button } from "semantic-ui-react";
import { QuestionSetSelect } from "components/QuestionSetSelect";
import { IURLConnector, UrlHOC } from "../../redux/modules/url";
import { Trans, useTranslation } from "react-i18next";
import { PageWrapperHoC } from "components/PageWrapperHoC";
import "./style.less";

const DataInner = (p: IURLConnector) => {
  const [selectedQuestionnaire, setSelectedQuestionnaire] = useState(undefined);
  const { t } = useTranslation();

  const goToExport = () => {
    p.setURL(`/settings/data/questionnaire/export/${selectedQuestionnaire}`);
  };

  return (
    <>
      <h3>{t("Export")}</h3>
      <p>
        {t("Export all the records associated with a questionnaire to Excel:")}
      </p>
      <QuestionSetSelect onQuestionSetSelected={setSelectedQuestionnaire} />
      <Button disabled={!selectedQuestionnaire} onClick={goToExport}>
        {t("Export")}
      </Button>
      <h3>{t("Import")}</h3>
      <p>
        <Trans
          defaults="To import large amounts of data into Impactasaurus, please email <email>support@impactasaurus.org</email>"
          components={{
            email: <a href="mailto:support@impactasaurus.org?Subject=Import" />,
          }}
        />
      </p>
    </>
  );
};

// t("Data")
const DataPage = PageWrapperHoC("Data", "data", DataInner);
const Data = UrlHOC(DataPage);
export { Data };
