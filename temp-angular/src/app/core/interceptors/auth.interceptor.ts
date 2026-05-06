import { HttpInterceptorFn } from '@angular/common/http';

const PROTECTED_URLS = [
  'http://localhost:8080/api/resumes',
  'http://localhost:8080/api/sections',
  'http://localhost:8085/ai',
];

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const isProtected = PROTECTED_URLS.some((url) => req.url.startsWith(url));

  if (!isProtected) {
    return next(req);
  }

  const token = localStorage.getItem('token');

  if (!token) {
    return next(req);
  }

  const cloned = req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`,
    },
  });

  return next(cloned);
};
