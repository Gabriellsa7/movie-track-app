import type { errors as en } from '../en/errors';

export const errors: typeof en = {
  noConnection:
    'Não foi possível falar com o servidor. Confira sua conexão e tente de novo.',
  serviceUnavailable:
    'Serviço indisponível no momento. Tente de novo daqui a pouco.',
  wrongCredentials: 'E-mail ou senha incorretos',
  emailHasAccount: 'Este e-mail já tem uma conta',
  tooManyAttempts: 'Muitas tentativas. Espere alguns minutos e tente de novo.',
  invalidName: 'Nome inválido',
  invalidEmail: 'E-mail inválido',
  invalidPassword: 'Senha inválida',
  wrongPassword: 'Senha incorreta',
  confirmPasswordToChangeEmail: 'Confirme sua senha para trocar o e-mail',
  movieAlreadyLogged: 'Você já registrou este filme',
  invalidRating: 'Nota inválida',
  invalidYear: 'Ano inválido',
  dateInFuture: 'A data não pode estar no futuro',
  invalidGenre: 'Gênero inválido',
};
