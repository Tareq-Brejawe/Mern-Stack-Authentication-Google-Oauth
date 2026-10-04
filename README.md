Setup .env file

NODE_ENV = "production"
MONGO_URI = your.mongodb.uri
PORT = 5000
JWT_SECRET = SECRE_KEY
MAILTRAP_TOKEN = your.mailtrap.token
CLIENT_URL = http://localhost:3000

.env.local ---> frontend

NEXT_PUBLIC_RECAPATCHA_SITE_KEY= your.recaptcha.site.key
NEXT_PUBLIC_GOOGLE_CLIENT_ID= your.google.client.id
NEXT_PUBLIC_RECAPATCHA_SECRET_KEY= your.recaptcha.secret.key
NEXT_PUBLIC_GOOGLE_CLIENT_SECRET = your.google.client.secret

Run this app locally
npm run build
Start the app
npm run start
