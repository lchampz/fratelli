import { Request, Response, NextFunction } from 'express';

declare global {
  namespace Express {
    interface Request {
      pagination?: {
        page: number;
        limit: number;
        sortBy: string;
        sortOrder: 'asc' | 'desc';
        skip: number;
      };
    }
  }
}

export interface PaginationQuery {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginationOptions {
  defaultLimit: number;
  maxLimit: number;
  defaultSortBy: string;
  defaultSortOrder: 'asc' | 'desc';
}

export const paginationMiddleware = (options: PaginationOptions = {
  defaultLimit: 10,
  maxLimit: 100,
  defaultSortBy: 'createdAt',
  defaultSortOrder: 'desc'
}) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.min(
      options.maxLimit,
      Math.max(1, parseInt(req.query.limit as string) || options.defaultLimit)
    );
    const sortBy = (req.query.sortBy as string) || options.defaultSortBy;
    const sortOrder = (req.query.sortOrder as 'asc' | 'desc') || options.defaultSortOrder;

    req.pagination = {
      page,
      limit,
      sortBy,
      sortOrder,
      skip: (page - 1) * limit,
    };

    next();
  };
};

export const createPaginationResponse = (
  data: any[],
  total: number,
  page: number,
  limit: number
) => {
  const totalPages = Math.ceil(total / limit);
  const hasNext = page < totalPages;
  const hasPrev = page > 1;

  return {
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasNext,
      hasPrev,
    },
  };
};
