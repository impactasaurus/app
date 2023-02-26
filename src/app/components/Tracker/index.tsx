import React, { useEffect } from "react";
import { IRecordUsage, recordUsage } from "apollo/modules/user";
import { useUser } from "redux/modules/user";
import ReactGA from "react-ga4";

const Inner = (p: IRecordUsage) => {
  const user = useUser();

  useEffect(() => {
    if (!user.loggedIn || !user.userID) {
      return;
    }

    ReactGA.set({
      userId: user.userID,
      dimension1: user.org,
      dimension2: user.beneficiaryUser ? "true" : "false",
    });

    if (!user.beneficiaryUser) {
      p.recordUsage().catch(console.error);

      const delighted = (window as any).delighted;
      if (delighted && delighted.survey) {
        delighted.survey({
          email: user.email,
          name: user.name,
          createdAt: user.created,
          properties: {
            org: user.org,
          },
        });
      }
    }
  }, [user.userID]);

  return <div />;
};

export const Tracker = recordUsage(Inner);
