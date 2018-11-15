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

