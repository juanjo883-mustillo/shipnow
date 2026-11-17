import { PAGINATION } from '../constants/index.js'

// Normaliza page/limit que llegan como string desde la query.
export const parsePagination = ({ page, limit } = {}) => {
  const parsedPage = Math.max(Number.parseInt(page, 10) || PAGINATION.DEFAULT_PAGE, 1)
  const parsedLimit = Math.min(
    Math.max(Number.parseInt(limit, 10) || PAGINATION.DEFAULT_LIMIT, 1),
    PAGINATION.MAX_LIMIT
  )
  return { page: parsedPage, limit: parsedLimit }
}
