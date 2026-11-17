// Valores inmutables del dominio. Nada de strings sueltos en el resto del código.

export const NODE_ENVS = Object.freeze({
  DEVELOPMENT: 'development',
  TEST: 'test',
  PRODUCTION: 'production',
})

export const USER_ROLES = Object.freeze({
  ADMIN: 'admin',
  USER: 'user',
  DRIVER: 'driver',
  STORE: 'store',
})

export const PRODUCT_STATUS = Object.freeze({
  AVAILABLE: 'available',
  OUT_OF_STOCK: 'out_of_stock',
})

export const ORDER_STATUS = Object.freeze({
  PENDING: 'pending',
  ASSIGNED: 'assigned',
  IN_TRANSIT: 'in_transit',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
})

export const RESPONSE_STATUS = Object.freeze({
  SUCCESS: 'success',
  ERROR: 'error',
})

export const HTTP_STATUS = Object.freeze({
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
})

// Diccionario provisorio de errores. En el Módulo 3 se convierte en la capa centralizada.
export const ERRORS = Object.freeze({
  VALIDATION_ERROR: { code: 'VALIDATION_ERROR', status: HTTP_STATUS.BAD_REQUEST, message: 'Los datos enviados no son válidos' },
  INVALID_ID: { code: 'INVALID_ID', status: HTTP_STATUS.BAD_REQUEST, message: 'El id enviado no es válido' },
  INVALID_USER_ROLE: { code: 'INVALID_USER_ROLE', status: HTTP_STATUS.BAD_REQUEST, message: 'El rol indicado no existe' },
  USER_NOT_FOUND: { code: 'USER_NOT_FOUND', status: HTTP_STATUS.NOT_FOUND, message: 'El usuario solicitado no existe' },
  EMAIL_ALREADY_EXISTS: { code: 'EMAIL_ALREADY_EXISTS', status: HTTP_STATUS.CONFLICT, message: 'Ya existe un usuario con ese email' },
  PRODUCT_NOT_FOUND: { code: 'PRODUCT_NOT_FOUND', status: HTTP_STATUS.NOT_FOUND, message: 'El producto solicitado no existe' },
  STORE_NOT_FOUND: { code: 'STORE_NOT_FOUND', status: HTTP_STATUS.NOT_FOUND, message: 'El comercio solicitado no existe' },
  ORDER_NOT_FOUND: { code: 'ORDER_NOT_FOUND', status: HTTP_STATUS.NOT_FOUND, message: 'El pedido solicitado no existe' },
  ORDER_ALREADY_DELIVERED: { code: 'ORDER_ALREADY_DELIVERED', status: HTTP_STATUS.CONFLICT, message: 'El pedido ya fue entregado' },
  ROUTE_NOT_FOUND: { code: 'ROUTE_NOT_FOUND', status: HTTP_STATUS.NOT_FOUND, message: 'La ruta solicitada no existe' },
  INTERNAL_ERROR: { code: 'INTERNAL_ERROR', status: HTTP_STATUS.INTERNAL_SERVER_ERROR, message: 'Error interno del servidor' },
})

export const PAGINATION = Object.freeze({
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 50,
})
