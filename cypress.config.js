const { defineConfig } = require('cypress');
const { dotenv } = require('dotenv');

dotenv.config();

module.exports = defineConfig({
  e2e: {
   env: {
      mailUrl: process.env.CYPRESS_MAIL_URL,
      mailUsername: process.env.CYPRESS_MAIL_USERNAME,
      mailPassword: process.env.CYPRESS_MAIL_PASSWORD,
      mailAdminUsername: process.env.CYPRESS_MAIL_ADMIN_USERNAME,
      mailAdminPassword: process.env.CYPRESS_MAIL_ADMIN_PASSWORD,
      owncloudUrl: process.env.CYPRESS_OWNCLOUD_URL,
      owncloudUsername: process.env.CYPRESS_OWNCLOUD_USERNAME,
      owncloudPassword: process.env.CYPRESS_OWNCLOUD_PASSWORD,
    },
    supportFile: false
  },
})
