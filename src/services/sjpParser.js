import cheerio from 'cheerio';
import superagent from 'superagent';

const sjpParser = {
  parse: html => {
    try {
      const $ = cheerio.load(html);
      const results = {};
      let firstValidTable = 0;
      $('.wtab tbody').each((i, table) => {
        if (i > firstValidTable) {
          return false;
        }
        const source = $(table).find('tr:nth-child(2) td').text();
        if (source.includes('nazwisk')) {
          firstValidTable++;
          console.log('Ingored last name table');
          return false;
        }

        results.base = $(table).find('tr:nth-child(1) th').text();

        $(table).find('tr').each((i, row) => {
          const label = $(row).find('th tt');
          const value = $(row).find('td');

          if ($(label).text()) {
            results[$(label).text()] = $(value).text().split(/, ?/);
          }
        });
      });

      return Promise.resolve(results);
    } catch (error) {
      console.error('SJP html parsing error', error);
      return Promise.reject(error);
    }
  },
  getHtml: word => {
    if (!word) {
      return Promise.reject({ message: 'No word provided' });
    }

    return new Promise((resolve, reject) => {
      superagent.get(`http://sjp.pl/${encodeURI(word)}`)
        .end((err, response) => {
          if (err) {
            return reject(err);
          }
          resolve(response.text);
        });
    });
  },
  getForms: word => {
    return sjpParser
      .getHtml(word)
      .then(sjpParser.parse);
  },
};

export default sjpParser;