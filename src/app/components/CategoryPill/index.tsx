import * as React from "react";
import { ICategoryMutation, setCategory } from "apollo/modules/categories";
import { ICategory } from "models/category";
import { Label, Select, Loader } from "semantic-ui-react";
import { IOutcomeSet } from "models/outcomeSet";
import ReactGA from "react-ga4";
import "./style.less";
import { useState } from "react";
import { useTranslation } from "react-i18next";

interface IProps extends ICategoryMutation {
  questionID: string;
  outcomeSetID: string;
  questionnaire: IOutcomeSet;
  cssClass?: string;
  readOnly?: boolean; // defaults to false
}

const CategoryPillInner = (props: IProps): JSX.Element => {
  const { questionID, outcomeSetID, questionnaire, cssClass, readOnly } = props;
  const { t } = useTranslation();

  const [editClicked, setEditClicked] = useState<boolean>(false);
  const [settingCategory, setSettingCategory] = useState(null);
  const [error, setError] = useState<string>(null);

  const setEditMode = () => {
    if (readOnly) {
      return;
    }

    setEditClicked(true);
  };

  const getCategory = (id): ICategory => {
    return questionnaire.categories.find((c) => c.id === id);
  };

  const renderPill = (
    className: string,
    text: string,
    saving = false
  ): JSX.Element => {
    const leftComponent = saving ? (
      <Loader active={true} inline={true} size="mini" />
    ) : (
      <span />
    );

    return (
      <Label
        className={`category-pill ${className} ${cssClass || ""} editable-${
          readOnly !== true
        }`}
        horizontal={true}
        onClick={setEditMode}
      >
        {leftComponent} {text}
      </Label>
    );
  };

  const renderSavingControl = (): JSX.Element => {
    return renderPill("set", settingCategory, true);
  };

  const getCategoryOptions = () => {
    const categories = questionnaire.categories.map((os) => {
      return {
        key: os.id,
        value: os.id,
        text: os.name,
      };
    });
    categories.unshift({
      key: null,
      value: null,
      text: t("No Category"),
    });
    return categories;
  };

  const logCategoryGAEvent = (isCategorySet, newCategoryId) => {
    let action = "";

    if (isCategorySet && newCategoryId !== null) {
      action = "changed";
    } else if (!isCategorySet && newCategoryId !== null) {
      action = "categorised";
    } else {
      action = "uncategorised";
    }

    ReactGA.event({
      category: "question",
      action,
      label: "likert",
    });
  };

  const isCategorySet = () => {
    const os = questionnaire;
    const q = os.questions.find((q) => q.id === questionID);

    if (
      q !== undefined &&
      q.categoryID !== null &&
      q.categoryID !== undefined
    ) {
      const cat = getCategory(q.categoryID);
      return cat !== null && cat !== undefined;
    }

    return false;
  };

  const updateCategory = (_, data) => {
    let categoryName = "No Category";
    const categoryIsSet = isCategorySet();

    if (data.value !== null) {
      const cat = getCategory(data.value);
      categoryName = cat.name;
    }

    if (!categoryIsSet && data.value === null) {
      setEditClicked(false);
      setSettingCategory(null);
      setError(null);
      return;
    }

    setEditClicked(false);
    setSettingCategory(categoryName);
    setError(null);

    props
      .setCategory(outcomeSetID, questionID, data.value)
      .then(() => {
        logCategoryGAEvent(categoryIsSet, data.value);
        setSettingCategory(null);
        setError(null);
      })
      .catch((e) => {
        console.log(e);
        setError(t("Setting category failed"));
        setSettingCategory(null);
      });
  };

  if (!questionnaire) {
    return renderPill("empty", "Loading...", true);
  }
  if (editClicked) {
    return (
      <Select
        placeholder={t("Select new category")}
        options={getCategoryOptions()}
        onChange={updateCategory}
      />
    );
  }
  if (settingCategory !== null) {
    return renderSavingControl();
  }
  if (error !== null) {
    return renderPill("failure", error);
  }

  const q = questionnaire.questions.find((q) => q.id === questionID);
  if (q === undefined) {
    return renderPill("empty", t("Unknown Category"));
  }
  if (q.categoryID === null || q.categoryID === undefined) {
    return renderPill("empty", t("No Category"));
  }
  const cat = getCategory(q.categoryID);
  if (cat === null || cat === undefined) {
    return renderPill("empty", t("Unknown Category"));
  }
  return renderPill("set", cat.name);
};

const CategoryPill = setCategory<IProps>(CategoryPillInner);
export { CategoryPill };
