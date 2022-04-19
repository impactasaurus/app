import React, { useEffect } from "react";
import { IRecordUsage, recordUsage } from "apollo/modules/user";
import { useUser } from "redux/modules/user";
import {
  getCreatedDate,
  getOrganisation,
  getUserEmail,
  getUserName,
} from "helpers/auth";
import ReactGA from "react-ga";

const Inner = (p: IRecordUsage) => {
  const user = useUser();

  useEffect(() => {
    if (!user.loggedIn || !user.userID) {
      return;
    }

    const org = getOrganisation();
    ReactGA.set({
      userId: user.userID,
      dimension1: org,
      dimension2: user.beneficiaryUser ? "true" : "false",
    });

    if (!user.beneficiaryUser) {
      p.recordUsage().catch(console.error);

      const delighted = (window as any).delighted;
      if (delighted && delighted.survey) {
        delighted.survey({
          email: getUserEmail(),
          name: getUserName(),
          createdAt: getCreatedDate(),
          properties: {
            org,
          },
        });
      }
    }
  }, [user]);

  return <div />;
};

export const Tracker = recordUsage(Inner);
