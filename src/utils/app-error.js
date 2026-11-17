// Error de dominio provisorio. Lo lanzan los services; el middleware arma la respuesta HTTP.
// En el Módulo 3 se reemplaza por la capa de custom errors completa.
export class AppError extends Error {
  constructor({ code, status, message }, details) {
    super(message)
    this.name = 'AppError'
    this.code = code
    this.status = status
    this.details = details
  }
}
