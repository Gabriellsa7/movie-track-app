import { ROUTES } from '@/routes/routes.constants';
import { LinkProblem } from '../../../components/link-problem/link-problem';

export function ExpiredLink({ isLoggedIn }: { isLoggedIn: boolean }) {
  return (
    <LinkProblem
      message="This link is invalid, was already used or expired. Links are valid for 24 hours."
      actionLabel={isLoggedIn ? 'Send a new link from Account' : 'Log in'}
      actionHref={isLoggedIn ? ROUTES.account : ROUTES.login}
    />
  );
}
