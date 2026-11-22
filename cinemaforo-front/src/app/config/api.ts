// URLs de los microservicios. Al desplegar en Docker se cambian aquí, en un solo lugar.
export const API = {
  usuarios: 'http://localhost:8081/api',
  foro: 'http://localhost:8082/api',
  admin: 'http://localhost:8083/api',
};

// Ids de los roles en la tabla ROL de Oracle
export const ROL_ID = {
  USUARIO: 1,
  ADMIN: 2,
};
