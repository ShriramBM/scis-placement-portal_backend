export interface PaginationParams {
  page: number;
  limit: number;
  skip: number;
}

export interface PaginatedResult<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export function parsePaginationQuery(
  query: Record<string, unknown>,
  defaultLimit = 10,
  maxLimit = 100
): PaginationParams | null {
  const pageRaw = query.page;
  const limitRaw = query.limit;

  if (pageRaw === undefined && limitRaw === undefined) {
    return null;
  }

  const page = Math.max(1, parseInt(String(pageRaw ?? 1), 10) || 1);
  const limit = Math.min(
    maxLimit,
    Math.max(1, parseInt(String(limitRaw ?? defaultLimit), 10) || defaultLimit)
  );

  return {
    page,
    limit,
    skip: (page - 1) * limit,
  };
}

export function buildPaginatedResponse<T>(
  data: T[],
  total: number,
  params: PaginationParams
): PaginatedResult<T> {
  return {
    data,
    pagination: {
      page: params.page,
      limit: params.limit,
      total,
      totalPages: Math.max(1, Math.ceil(total / params.limit)),
    },
  };
}
