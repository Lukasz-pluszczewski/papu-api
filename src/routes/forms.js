import sjp from 'services/sjpParser';

const forms = {
  '/forms/:word': {
    get: ({ params, db }) => sjp.getForms(params.word)
      .then(result => ({
        body: result,
      }))
      .catch(error => ({
        status: 500,
        body: error,
      })),
  },
};

export default forms;
