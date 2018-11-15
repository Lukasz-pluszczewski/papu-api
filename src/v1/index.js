import { Router as router } from 'express';
import _ from 'lodash';
import { name, version, author } from '../../package.json';
import { extractRequest, simplifyRequest } from '../helpers/getRequestData';
import resourceCrud from '../services/resourceCrud';

const matchObject = (object, filter) => {
  return _.some(object, (value, key) => {
    return filter.test(key) || (_.isPlainObject(value) ? matchObject(value, filter) : filter.test(value));
  });
};

const filterWrapper = (filterValue, field) => el => {
  const filter = new RegExp(filterValue);
  if (_.isObject(el[field])) {
    return matchObject(el[field], filter);
  }
  if (_.isArray(el[field])) {
    return _.some(el[field], value => filter.test(value));
  }
  return filter.test(el[field]);
};

const applyFilters = filters => (req, wrapper) => {
  filters.forEach(field => {
    const filterValue = req.query[field];
    if (filterValue) {
      wrapper = wrapper.filter(filterWrapper(filterValue, field));
    }
  });
  return wrapper;
};

const filterMiddleware = (req, count = false) => wrapper => {
  if (req.query.full !== 'true') {
    wrapper = wrapper.map(simplifyRequest);
  }
  wrapper = applyFilters([
    'date',
    'method',
    'baseUrl',
    'query',
    'body',
    'headers',
  ])(req, wrapper);

  if (req.query.id) {
    wrapper = wrapper.find({ id: req.query.id });
  }
  if (count) {
    return wrapper.size();
  }
  return wrapper;
};

export default () => {
  const api = router();

  api.get('/requests', (req, res) => {
    res.json(resourceCrud.get('requests', filterMiddleware(req)));
  });
  api.get('/count', (req, res) => {
    res.json(resourceCrud.get('requests', filterMiddleware(req, true)));
  });
  api.delete('/requests', (req, res) => {
    resourceCrud.clear('requests');
    res.json({ message: 'ok' });
  });
  api.get('/requests/:id', (req, res) => {
    res.json(resourceCrud.getById('requests', req.params.id));
  });
  api.delete('/requests/:id', (req, res) => {
    resourceCrud.delete('requests', req.params.id);
    res.json({ message: 'ok' });
  });
  api.use('*', (req, res) => {
    const requestData = {
      ...extractRequest(req),
      date: (new Date()).toISOString(),
    };
    resourceCrud.create('requests', requestData);
    res.json(requestData);
  });

  return api;
};
