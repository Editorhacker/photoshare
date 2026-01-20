const { google } = require("googleapis");

async function getDriveClientWithTokens(tokens) {
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
  );

  oauth2Client.setCredentials(tokens);
  return google.drive({ version: "v3", auth: oauth2Client });
}

module.exports = { getDriveClientWithTokens };
