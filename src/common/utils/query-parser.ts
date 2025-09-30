import { Model, Document } from 'mongoose';

type SortOrder = 'asc' | 'desc';
export type ParsedQuery = {
  page: number;
  pageSize: number;
  filter: Record<string, any>;
  sort?: Record<string, 1 | -1>;
};

function coercePrimitive(value: string) {
  if (value === 'true') return true;
  if (value === 'false') return false;
  if (!isNaN(Number(value))) return Number(value);
  return value;
}

export function parseHttpQueryToMongo(
  raw: Record<string, any>,
  options?: {
    textSearchFields?: string[];
    allowedFilterFields?: string[];
    defaultSort?: Record<string, 1 | -1>;
  }
): ParsedQuery {
  const page = Number(raw.page ?? 1) || 1;
  const pageSize = Number(raw.pageSize ?? 12) || 12;

  const { textSearchFields = [], allowedFilterFields, defaultSort } = options ?? {};

  const sortField = raw.sortField as string | undefined;
  const sortOrder = (raw.sortOrder as SortOrder | undefined) ?? 'desc';
  let sort: Record<string, 1 | -1> | undefined = undefined;
  if (sortField) {
    sort = { [sortField]: sortOrder === 'asc' ? 1 : -1 };
  } else if (defaultSort) {
    sort = defaultSort;
  }

  const filter: Record<string, any> = {};

  const search = raw.search as string | undefined;
  if (search && textSearchFields.length > 0) {
    filter.$or = textSearchFields.map((f) => ({ [f]: { $regex: search, $options: 'i' } }));
  }

  const controlKeys = new Set(['page', 'pageSize', 'search', 'sortField', 'sortOrder']);

  Object.entries(raw).forEach(([key, rawVal]) => {
    if (controlKeys.has(key)) return;

    if (Array.isArray(allowedFilterFields) && !allowedFilterFields.includes(key)) return;

    if (key.endsWith('_like')) {
      const field = key.replace(/_like$/, '');
      if (rawVal) {
        filter[field] = { $regex: String(rawVal), $options: 'i' };
      }
      return;
    }

    if (key.endsWith('From') || key.endsWith('To')) {
      const base = key.replace(/(From|To)$/, '');
      const op = key.endsWith('From') ? '$gte' : '$lte';
      filter[base] = filter[base] || {};
      filter[base][op] = coercePrimitive(String(rawVal));
      return;
    }

    if (Array.isArray(rawVal)) {
      const arr = rawVal
        .map((v) => coercePrimitive(String(v)))
        .filter((v) => v !== '');
      if (arr.length > 0) filter[key] = { $in: arr };
      return;
    }
    if (typeof rawVal === 'string' && rawVal.includes(',')) {
      const arr = rawVal
        .split(',')
        .map((v) => coercePrimitive(v.trim()))
        .filter((v) => v !== '');
      if (arr.length > 0) filter[key] = { $in: arr };
      return;
    }

    if (rawVal !== undefined && rawVal !== '') {
      filter[key] = coercePrimitive(String(rawVal));
    }
  });

  return { page, pageSize, filter, sort };
}

export async function paginateModel<T extends Document>(
  model: Model<T>,
  parsed: ParsedQuery,
  populateFields: string[] = []
) {
  const { page, pageSize, filter, sort } = parsed;

  let q = model.find(filter);
  if (sort) q = q.sort(sort);

  for (const field of populateFields) {
    q = q.populate(field, '_id name');
  }

  const total = await model.countDocuments(filter);
  const items = await q.skip((page - 1) * pageSize).limit(pageSize);

  return {
    items,
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  };
}


