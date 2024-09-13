# Contest Notifier #
This project is a Node.js application that monitors your Gmail account for unread emails from specific senders (e.g., Codeforces or your college) and sends a WhatsApp notification when an email is received. It uses the Gmail API to read emails and Twilio's API to send notifications via WhatsApp.

## Features ##
- Automatically checks for unread emails from specific senders (Codeforces and College).
- Sends a WhatsApp message with the subject and body of the email to your configured phone number.
- Marks emails as "read" once processed.
## Technologies Used ##
- Node.js: Backend framework.
- Express.js: Web server framework for Node.js.
- Gmail API: For accessing and fetching emails.
- Twilio API: For sending WhatsApp notifications.
- Google OAuth 2.0: For authenticating and authorizing access to the Gmail API.
## Installation ##
1. **Clone the repository:**
```bash
git clone https://github.com/yourusername/email-notification-system.git
cd email-notification-system
```
2. **Install the dependencies:**
```js
npm install express googleapis twilio dotenv mailparser
```
3. **Create a .env file in the root directory and add the following environment variables:**
```env
CLIENT_ID=your-google-client-id
CLIENT_SECRET=your-google-client-secret
TWILIO_SID=your-twilio-sid
TWILIO_AUTH_TOKEN=your-twilio-auth-token
MY_NUM=your-whatsapp-number
PORT=3000
```
Replace `your-google-client-id`, `your-google-client-secret`, `your-twilio-sid`, `your-twilio-auth-token`, and `your-whatsapp-number` with your actual credentials and number.
## Usage ##
1. **Google Authentication:**

- Run the application:
```js
node app.js
```
- Open your browser and navigate to http://localhost:3000/auth to authenticate with your Google account.
- After authentication, the application will start checking for emails from Codeforces and your college.
2. **Email Check:**

- The app will check for unread emails from:
   - The emails mentioned in the functions
3. **WhatsApp Notification:**

- If a new email is found from any of the specified addresses, the subject and body will be sent as a WhatsApp message to your phone.
- Emails will be marked as "read" after processing.
## How It Works ##
- When you visit /auth, you'll be redirected to Google to grant access to your Gmail account.
- The application uses the Gmail API to fetch unread emails from specific addresses.
- After receiving an email, it sends a WhatsApp message to your phone number using the Twilio API.
