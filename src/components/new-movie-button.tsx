import { ROUTES } from '@/routes/routes.constants';
import { FloatingAddButton } from './floating-add-button';

export function NewMovieButton() {
  return <FloatingAddButton href={ROUTES.newMovie} label="Log a movie" />;
}
