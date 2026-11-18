import type { auth as en } from '../en/auth';

export const auth: typeof en = {
  email: 'E-mail',
  password: 'Senha',
  logIn: 'Entrar',
  signUp: 'Criar conta',
  login: {
    headline: 'SEU DIÁRIO\nDE FILMES',
    tagline:
      'Registre o que você assistiu, dê sua nota e planeje o que ver depois.',
    forgotPassword: 'Esqueci a senha',
    loggingIn: 'Entrando…',
    noAccount: 'Ainda não tem conta?',
    explore: 'Explorar perfis sem entrar',
    unexpected: 'Não deu para entrar. Tente de novo.',
  },
  signUpScreen: {
    title: 'CRIAR CONTA',
    subtitle: 'Leva menos de um minuto.',
    name: 'Nome ou apelido',
    signingUp: 'Criando conta…',
    haveAccount: 'Já tem uma conta?',
    unexpected: 'Não deu para criar a conta. Tente de novo.',
  },
  forgot: {
    title: 'Esqueci a senha',
    subtitle:
      'Informe o e-mail da sua conta. Vamos enviar um link para criar uma senha nova.',
    send: 'Enviar link',
    sending: 'Enviando…',
    resend: 'Reenviar link',
    resendIn: 'Reenviar em {{time}}',
    backToLogin: 'Voltar para o login',
    sentTitle: 'Confira sua caixa de entrada',
    sentBody:
      'Se existir uma conta com esse e-mail, o link chega em alguns minutos. Ele vale por 1 hora. Veja também o spam.',
    unexpected: 'Não deu para enviar o link. Tente de novo.',
  },
  reset: {
    title: 'Nova senha',
    subtitle:
      'Escolha uma senha nova. Você vai sair de todos os aparelhos conectados.',
    newPassword: 'Nova senha',
    confirmPassword: 'Confirmar nova senha',
    save: 'Salvar nova senha',
    expiredQuestion: 'Link expirado?',
    requestAnother: 'Pedir outro',
    requestAnotherLink: 'Pedir outro link',
    expired:
      'Este link é inválido, já foi usado ou expirou. Os links valem por 1 hora.',
    changed: 'Senha trocada. Entre com a nova senha.',
    unexpected: 'Não deu para salvar a nova senha. Tente de novo.',
  },
  verify: {
    confirming: 'Confirmando seu e-mail…',
    confirmed: 'E-mail confirmado',
    confirmedEmail: 'Tudo certo, <bold>{{email}}</bold> agora está confirmado.',
    confirmedNoEmail: 'Tudo certo, seu e-mail agora está confirmado.',
    failed:
      'Não deu para confirmar seu e-mail. Confira sua conexão e abra o link de novo.',
    expired:
      'Este link é inválido, já foi usado ou expirou. Os links valem por 24 horas.',
    sendNewFromAccount: 'Enviar um novo link pela Conta',
    goHome: 'Ir para o início',
  },
};
