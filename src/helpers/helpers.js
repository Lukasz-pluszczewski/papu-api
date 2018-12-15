import _ from 'lodash';

const serializableFields = [
  'date',
  'readable',
  'domain',
  'httpVersionMajor',
  'httpVersionMinor',
  'httpVersion',
  'complete',
  'headers',
  'rawHeaders',
  'trailers',
  'rawTrailers',
  'upgrade',
  'url',
  'method',
  'statusCode',
  'statusMessage',
  'baseUrl',
  'originalUrl',
  '_parsedUrl',
  'params',
  'query',
  'body',
];

const simpleFields = [
  'date',
  'headers',
  'method',
  'baseUrl',
  'query',
  'body',
  'id',
];

export const extractRequest = req => _.clone(_.pick(req, serializableFields));

export const simplifyRequest = req => _.clone(_.pick(req, simpleFields));

export const matchObject = (object, filter) => {
  return _.some(object, (value, key) => {
    return filter.test(key) || (_.isPlainObject(value) ? matchObject(value, filter) : filter.test(value));
  });
};

export const filterWrapper = (filterValue, field) => el => {
  const filter = new RegExp(filterValue);
  if (_.isObject(el[field])) {
    return matchObject(el[field], filter);
  }
  if (_.isArray(el[field])) {
    return _.some(el[field], value => filter.test(value));
  }
  return filter.test(el[field]);
};

export const applyFilters = filters => (req, wrapper) => {
  filters.forEach(field => {
    const filterValue = req.query[field];
    if (filterValue) {
      wrapper = wrapper.filter(filterWrapper(filterValue, field));
    }
  });
  return wrapper;
};
