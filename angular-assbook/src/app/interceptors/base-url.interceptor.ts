import { HttpInterceptorFn } from '@angular/common/http';
import { SERVER } from '../constants';
import { isDevMode } from '@angular/core';

export const baseUrlInterceptor: HttpInterceptorFn = (req, next) => {
  // req : HttpRequest
  // next: HttpHandler if only this is backend Angular if more will be passed to the next
  const serverURL = isDevMode() ? SERVER : 'http://localhost:3000' ;
  const reqClone = req.clone({
    url: `${serverURL}/${req.url}`,
  });
  return next(reqClone);
};
