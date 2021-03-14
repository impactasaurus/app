import React, {useState, useEffect} from 'react';
import {PageWrapperHoC} from '../../components/PageWrapperHoC';
import {IUnsubscribe, unsubscribe} from '../../apollo/modules/user';
import { Message, Loader } from 'semantic-ui-react';
import { useTranslation } from 'react-i18next';

interface IProps extends IUnsubscribe {
  match: {
    params: {
      uid: string,
    },
  };
}

const UnsubscribeInner = (p: IProps) => {
  const [error, setError] = useState(undefined);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    p.unsubscribe(p.match.params.uid)
      .then(() => {
        setLoading(false);
        setError(undefined);
      })
      .catch((e) => {
        setLoading(false);
        setError(e);
      });
  }, []);

  const {t} = useTranslation();

  if (loading) {
    return <Loader active={true} inline="centered" />;
  }
  if (error) {
    return (
      <Message error={true}>
        <Message.Header>{t("Failed to unsubscribe")}</Message.Header>
        <Message.Content>{t("Please refresh and try again, if that doesn't work, please drop us an email at support@impactasaurus.org")}</Message.Content>
      </Message>
    );
  }
  return (
    <Message success={true}>
      <Message.Header>{t("Success")}</Message.Header>
      <div>{t("You have been unsubscribed")}</div>
    </Message>
  );
}

// t("Unsubscribe")
export const Unsubscribe = unsubscribe(PageWrapperHoC<IProps>('Unsubscribe', 'unsubscribe', UnsubscribeInner));
