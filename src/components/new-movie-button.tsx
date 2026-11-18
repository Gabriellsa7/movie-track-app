import { ROUTES } from '@/routes/routes.constants';
import { FloatingAddButton } from './floating-add-button';
import { useTranslation } from 'react-i18next';

export function NewMovieButton() {
  const { t } = useTranslation();
  return (
    <FloatingAddButton href={ROUTES.newMovie} label={t('common.logMovie')} />
  );
}
