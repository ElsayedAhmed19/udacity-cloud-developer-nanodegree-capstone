// STUDENT: Once your application is deployed, copy an API id here so that the frontend could interact with it
const apiId = 'lapfdg0fn9'
export const apiEndpoint = `https://${apiId}.execute-api.us-east-1.amazonaws.com/dev`

export const authConfig = {
  domain: 'dev-nc6219zm.us.auth0.com',            // Auth0 domain
  clientId: 'fjkxHmDevhCnDrt1wcGYmaqNwR4so9zU',          // Auth0 client id
  callbackUrl: 'http://localhost:3000/callback'
}
