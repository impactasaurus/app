import { renderArray } from "helpers/react";
import * as React from "react";
import { Dropdown, Input } from "semantic-ui-react";
import "./style.less";

interface IOption {
  name: string;
  id: string;
}

interface IProps {
  dropdownText: string;
  onLoad(search?: string): Promise<IOption[]>;
  onChange(selected: string[]): void;
}

export const DropdownCheckbox = (p: IProps): JSX.Element => {
  const [loading, setLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<boolean>(false);
  const [opened, setOpened] = React.useState<boolean>(false);
  const [options, setOptions] = React.useState<IOption[]>([]);
  const [selected, setSelected] = React.useState<IOption[]>([]);
  const [search, setSearch] = React.useState<string>("");

  const load = () => {
    if (loading || !opened) {
      return;
    }
    setLoading(true);
    p.onLoad(search === "" ? undefined : search)
      .then((ops) => {
        setOptions(ops);
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  };

  React.useEffect(load, [opened, search]);

  const doNothing = (
    e:
      | React.FormEvent<HTMLInputElement>
      | React.FormEvent<MouseEvent>
      | React.MouseEvent<HTMLDivElement>
  ) => {
    e.preventDefault();
    e.stopPropagation();
  };

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

  return (
    <Dropdown
      text={p.dropdownText}
      onOpen={() => setOpened(true)}
      closeOnChange={false}
      closeOnBlur={true}
      key={`${p.dropdownText}-dropdown-checkbox`}
      selectOnBlur={false}
      className={
        "dropdown-checkbox " + (selected.length > 0 ? "selections" : "empty")
      }
    >
      <Dropdown.Menu key={`${p.dropdownText}-dropdown-menu`}>
        <Dropdown.Item
          onClick={doNothing}
          key={`${p.dropdownText}-search`}
          className="search-container"
        >
          <Input
            value={search}
            placeholder={"Search..."}
            icon="search"
            loading={loading}
            onChange={(_, d) => setSearch(d.value)}
            key={`${p.dropdownText}-input`}
          />
        </Dropdown.Item>
        {renderArray(renderCheckbox, options)}
      </Dropdown.Menu>
    </Dropdown>
  );
};
//
//
