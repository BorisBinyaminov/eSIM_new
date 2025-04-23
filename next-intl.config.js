// next-intl.config.js
module.exports = {
  locales: ['en', 'ru'],
  defaultLocale: 'en',
  pages: {
    '*': ['common'],
    '/guides': ['guides'],
    '/paymentMethod/bank': ['paymentMethod'],
    '/buyEsim': ['buyEsim'],
  },
};
