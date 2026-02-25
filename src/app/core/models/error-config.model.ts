export interface ErrorConfig {
  code: string;
  message: string;
  action?: ErrorSideEffect;
}
  
export enum ErrorSideEffect {
  LOGOUT = 'logout',
  REFRESH = 'refresh',
  REDIRECT = 'redirect' // dashboard
}