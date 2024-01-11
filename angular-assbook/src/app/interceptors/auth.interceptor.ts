import { HttpInterceptorFn } from '@angular/common/http';
/**
 * Every http request is intercepted an check if there is a token
 * if there is it is included
 * 
 * @param req petición
 * @param next acction to do according with state
 * @returns reques with credentials included, not 
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('token');

  if (token) { // Estamos autenticados
    const authReq = req.clone({
      headers: req.headers.set('Authorization', 'Bearer ' + token),
    });
    return next(authReq); // Petición con credenciales  //  Request with token
  }
  return next(req); // Petición sin credenciales // Request without token
};