import { ROUTES } from '@/routes/routes.constants';
import { LinkProblem } from '../../../components/link-problem/link-problem';
import { useTranslation } from 'react-i18next';

export function ExpiredLink({ isLoggedIn }: { isLoggedIn: boolean }) {
  const { t } = useTranslation();
  return (
    <LinkProblem
      message={t('auth.verify.expired')}
      actionLabel={
        isLoggedIn ? t('auth.verify.sendNewFromAccount') : t('auth.logIn')
      }
      actionHref={isLoggedIn ? ROUTES.account : ROUTES.login}
    />
  );
}
