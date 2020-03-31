const ingredients = {
  '/ingredients': {
    get: ({ db }) => db.find('ingredients')({})
      .then(result => ({
        body: result,
      }))
      .catch(error => ({
        status: 500,
        body: error,
      })),
    post: ({ db, body }) => db.insert('ingredients')(body)
      .then(result => ({
        body: result,
      }))
      .catch(error => ({
        status: 500,
        body: error,
      })),
  },
};

export default ingredients;
