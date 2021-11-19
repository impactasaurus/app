import { renderArray } from "helpers/react";
import * as React from "react";
import { useTranslation } from "react-i18next";
import { Dropdown, Input } from "semantic-ui-react";
import "./style.less";

export interface IOption {
  name: string;
  id: string;
}

interface IProps {
  options: IOption[];
  loading: boolean;
  error: boolean;
  dropdownText: string;
  onChange(selected: string[]): void;
  // change value to clear selected options
  clearTrigger?: number;
}

const MAX_RESULTS = 10;
const limitOptions = (_, i: number) => i <= MAX_RESULTS;

export const DropdownCheckbox = (p: IProps): JSX.Element => {
  const [options, setOptions] = React.useState<IOption[]>([]);
  const [selected, setSelected] = React.useState<IOption[]>([]);
  const [search, setSearch] = React.useState<string>("");
  const { t } = useTranslation();

  const onClose = () => {
    p.onChange(selected.map((s) => s.id));
    setSearch("");
  };

  const filterOptions = () => {
    if (search.length === 0) {
      setOptions([]);
    } else {
      setOptions(
        p.options.filter((o) => o.name.includes(search)).filter(limitOptions)
      );
    }
  };
  React.useEffect(filterOptions, [search]);

  React.useEffect(() => {
    setSelected([]);
  }, [p.clearTrigger]);

  const renderCheckbox = (option: IOption): JSX.Element => {
    const checked = selected.find((s) => s.id === option.id) !== undefined;
    const toggled = (e) => {
      e.stopPropagation();
      const newSelected = checked
        ? selected.filter((s) => s.id !== option.id)
        : selected.concat(option);
      setSelected(newSelected);
    };
    return (
      <Dropdown.Item
        key={`${p.dropdownText}-opt-${option.id}`}
        onClick={toggled}
      >
        <input
          type="checkbox"
          checked={checked}
          onChange={toggled}
          onClick={(e) => e.stopPropagation()}
          key={`${p.dropdownText}-opt-${option.id}-check`}
        />
        <span style={{ marginLeft: "0.5rem" }}>{option.name}</span>
      </Dropdown.Item>
    );
  };

  let optionsToShow = options;
  if (optionsToShow.length === 0) {
    optionsToShow = selected;
  }

  return (
    <Dropdown
      text={p.dropdownText}
      closeOnChange={false}
      closeOnBlur={true}
      key={`${p.dropdownText}-dropdown-checkbox`}
      selectOnBlur={false}
      className={
        "dropdown-checkbox " + (selected.length > 0 ? "selections" : "empty")
      }
      onClose={onClose}
    >
      <Dropdown.Menu key={`${p.dropdownText}-dropdown-menu`}>
        <Dropdown.Item
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          key={`${p.dropdownText}-search`}
          className="search-container"
        >
          <Input
            value={search}
            placeholder={t("Search...")}
            icon="search"
            loading={p.loading}
            onChange={(_, d) => setSearch(d.value)}
            key={`${p.dropdownText}-input`}
            error={p.error}
          />
        </Dropdown.Item>
        {renderArray(renderCheckbox, optionsToShow)}
      </Dropdown.Menu>
    </Dropdown>
  );
};
