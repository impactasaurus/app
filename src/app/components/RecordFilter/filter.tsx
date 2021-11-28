import {
  getBeneficiaries,
  IBeneficiariesResult,
} from "apollo/modules/beneficiaries";
import { getOrgUsers, IGetOrgUsersResult } from "apollo/modules/organisation";
import { allOutcomeSets, IOutcomeResult } from "apollo/modules/outcomeSets";
import { getTags, ITagResult } from "apollo/modules/tags";
import React from "react";
import { QueryProps } from "react-apollo";
import {
  DropdownCheckbox,
  IOption,
  IProps as IDropdownCheckboxProps,
} from "../DropdownCheckbox";

export interface IProps<T>
  extends Omit<IDropdownCheckboxProps, "options" | "loading" | "error"> {
  data?: T;
}

const FilterHoC = <T extends QueryProps>(extractor: (d: T) => IOption[]) => {
  const Filter = (p: IProps<T>) => {
    return (
      <DropdownCheckbox
        {...p}
        options={extractor(p.data)}
        loading={!!p.data?.loading}
        error={!!p.data?.error}
      />
    );
  };
  return Filter;
};

export const TagFilter = getTags<IProps<ITagResult>>(
  FilterHoC((d: ITagResult) => {
    if (!d?.getTags) {
      return undefined;
    }
    return d.getTags.map((t) => ({ name: t, id: t }));
  })
);

export const BenFilter = getBeneficiaries<IProps<IBeneficiariesResult>>(
  FilterHoC((d: IBeneficiariesResult) => {
    if (!d?.getBeneficiaries) {
      return undefined;
    }
    return d.getBeneficiaries.map((b) => ({ name: b, id: b }));
  })
);

export const QuestionnaireFilter = allOutcomeSets<IProps<IOutcomeResult>>(
  FilterHoC((d: IOutcomeResult) => {
    if (!d?.allOutcomeSets) {
      return undefined;
    }
    return d.allOutcomeSets.map((q) => ({ name: q.name, id: q.id }));
  })
);

export const UserFilter = getOrgUsers<IProps<IGetOrgUsersResult>>(
  FilterHoC((d: IGetOrgUsersResult) => {
    if (!d?.users) {
      return undefined;
    }
    return d.users.map((u) => ({ name: u.name, id: u.id }));
  }),
  "data"
);
