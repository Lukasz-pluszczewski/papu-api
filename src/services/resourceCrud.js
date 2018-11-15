import _ from 'lodash';
import getDb from 'services/DbService';
import defaults from 'models/defaults';
import initial from 'models/initial';

const resource = (db, name) => db.get(name);

const resourceCrud = {
  /**
   * Return the list of elements
   * @param {string} resourceName
   * @param {Object} query for lodash filter method https://lodash.com/docs/4.17.11#filter
   * @param {function} cb additional callback that accepts lodash wrapper and returns lodash wrapper
   * @param {boolean} returnWrapper flag indicating if the method should return lodash wrapper or unwrapped value
   * @return {object|array} lodash wrapper or array of elements
   */
  get(resourceName, query = {}, cb = wrapper => wrapper, returnWrapper = false) {
    let wrapper = cb(resource(resourceCrud.db, resourceName));
    wrapper = wrapper.filter(query);
    return returnWrapper ? wrapper : wrapper.value();
  },

  /**
   * Return element by ID
   * @param {string} resourceName
   * @param {string} id
   * @param {function} cb additional callback that accepts lodash wrapper and returns lodash wrapper
   * @param {boolean} returnWrapper flag indicating if the method should return lodash wrapper or unwrapped value
   * @return {object|array} lodash wrapper or array of elements
   */
  getById(resourceName, id, cb = wrapper => wrapper, returnWrapper = false) {
    const wrapper = cb(resource(resourceCrud.db, resourceName).getById(id));
    return returnWrapper ? wrapper : wrapper.value();
  },

  /**
   * Return element by ID
   * @param {string} resourceName
   * @param {object} data for new element
   * @param {boolean} returnWrapper flag indicating if the method should return lodash wrapper or unwrapped value
   * @return {object|array} lodash wrapper or array of elements
   */
  create(resourceName, data, returnWrapper = false) {
    const wrapper = resource(resourceCrud.db, resourceName)
      .insert(_.merge({}, defaults[resourceName] || {}, data));

    return returnWrapper ? wrapper : wrapper.write();
  },
  replace(resourceName, id, data, returnWrapper = false) {
    const wrapper = resource(resourceCrud.db, resourceName)
      .replaceById(id, _.merge({}, defaults[resourceName] || {}, data));

    return returnWrapper ? wrapper : wrapper.write();
  },
  update(resourceName, id, data, returnWrapper = false) {
    const wrapper = resource(resourceCrud.db, resourceName).updateById(id, data);
    return returnWrapper ? wrapper : wrapper.write();
  },
  delete(resourceName, query, returnWrapper = false) {
    const wrapper = resource(resourceCrud.db, resourceName).removeById(id);
    return returnWrapper ? wrapper : wrapper.write();
  },
  deleteById(resourceName, id, returnWrapper = false) {
    const wrapper = resource(resourceCrud.db, resourceName).removeById(id);
    return returnWrapper ? wrapper : wrapper.write();
  },
  clear(resourceName, returnWrapper = false) {
    const wrapper = resourceCrud.db.set(resourceName, initial[resourceName] || []);
    return returnWrapper ? wrapper : wrapper.write();
  },
  db: getDb(),
};

export default resourceCrud;
