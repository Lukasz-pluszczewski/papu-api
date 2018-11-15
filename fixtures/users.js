import crud from '../src/services/resourceCrud';

const usersFixtures = [
  {
    login: 'admin',
    password: 'sha1$3e783aa2$1$2cf1370abee4e5d0d9ed833e318c0a8d928dd7cc',
  },
];

usersFixtures.forEach(user => crud.create('users', user));

process.exit();
