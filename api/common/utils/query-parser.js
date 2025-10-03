"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseHttpQueryToMongo = parseHttpQueryToMongo;
exports.paginateModel = paginateModel;
function coercePrimitive(value) {
    if (value === 'true')
        return true;
    if (value === 'false')
        return false;
    if (!isNaN(Number(value)))
        return Number(value);
    return value;
}
function parseHttpQueryToMongo(raw, options) {
    const page = Number(raw.page ?? 1) || 1;
    const pageSize = Number(raw.pageSize ?? 12) || 12;
    const { textSearchFields = [], allowedFilterFields, defaultSort } = options ?? {};
    const sortField = raw.sortField;
    const sortOrder = raw.sortOrder ?? 'desc';
    let sort = undefined;
    if (sortField) {
        sort = { [sortField]: sortOrder === 'asc' ? 1 : -1 };
    }
    else if (defaultSort) {
        sort = defaultSort;
    }
    const filter = {};
    const search = raw.search;
    if (search && textSearchFields.length > 0) {
        filter.$or = textSearchFields.map((f) => ({ [f]: { $regex: search, $options: 'i' } }));
    }
    const controlKeys = new Set(['page', 'pageSize', 'search', 'sortField', 'sortOrder']);
    Object.entries(raw).forEach(([key, rawVal]) => {
        if (controlKeys.has(key))
            return;
        if (Array.isArray(allowedFilterFields) && !allowedFilterFields.includes(key))
            return;
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
            if (arr.length > 0)
                filter[key] = { $in: arr };
            return;
        }
        if (typeof rawVal === 'string' && rawVal.includes(',')) {
            const arr = rawVal
                .split(',')
                .map((v) => coercePrimitive(v.trim()))
                .filter((v) => v !== '');
            if (arr.length > 0)
                filter[key] = { $in: arr };
            return;
        }
        if (rawVal !== undefined && rawVal !== '') {
            filter[key] = coercePrimitive(String(rawVal));
        }
    });
    return { page, pageSize, filter, sort };
}
async function paginateModel(model, parsed, populateFields = []) {
    const { page, pageSize, filter, sort } = parsed;
    let q = model.find(filter);
    if (sort)
        q = q.sort(sort);
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
//# sourceMappingURL=query-parser.js.map