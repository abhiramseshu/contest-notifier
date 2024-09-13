const express = require("express");
const { google } = require("googleapis");
const twilio = require("twilio");
const dotenv = require("dotenv");
const { simpleParser } = require("mailparser");

dotenv.config();

const app = express();
const client = new twilio(
  process.env.TWILIO_SID,
  process.env.TWILIO_AUTH_TOKEN
);
const client_id = process.env.CLIENT_ID;
const client_secret = process.env.CLIENT_SECRET;
const redirect_uris = ["http://localhost:3000/oauth2callback"];
const oauth2Client = new google.auth.OAuth2(
  client_id,
  client_secret,
  redirect_uris[0]
);

const gmail = google.gmail({ version: "v1", auth: oauth2Client });

app.get("/auth", (req, res) => {
  const url = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: [
      "https://www.googleapis.com/auth/gmail.readonly",
      "https://www.googleapis.com/auth/gmail.modify",
    ],
  });
  res.redirect(url);
});

app.get("/oauth2callback", (req, res) => {
  const code = req.query.code;
  if (code) {
    oauth2Client.getToken(code, (err, tokens) => {
      if (err) {
        return res.status(500).send("Error retrieving access token");
      }
      oauth2Client.setCredentials(tokens);
      res.send("Authorization successful! You can close this window.");
      checkForEmailsfromcollege();
      checkForEmailsfromcodeforces();
    });
  } else {
    res.status(400).send("No code provided");
  }
});

const Buffer = require("buffer").Buffer;
async function checkForEmailsfromcodeforces() {
  mailername = "codeforces";
  try {
    const response = await gmail.users.messages.list({
      userId: "me",
      q: "is:unread from:codeforces@codeforces.com",
    });

    const messages = response.data.messages || [];
    if (messages.length === 0) {
      console.log(`No new emails found from ${mailername}`);
      return;
    }

    for (const message of messages) {
      const msg = await gmail.users.messages.get({
        userId: "me",
        id: message.id,
        format: "full",
      });

      const emailData = msg.data;
      const subject =
        emailData.payload.headers.find((header) => header.name === "Subject")
          ?.value || "No Subject";
      console.log(`New email: ${subject}`);
      const body = getEmailBody(emailData.payload);
      console.log(`Email body: ${body}`);
      messagetosend = subject + "\n\n" + body;
      if (messagetosend.length > 1201)
        messagetosend = messagetosend.substr(0, 1200);
      sendWhatsAppMessage(
        `New contest email received from ${mailername} \n : ${messagetosend}`
      );
      await gmail.users.messages.modify({
        userId: "me",
        id: message.id,
        requestBody: {
          removeLabelIds: ["UNREAD"],
        },
      });

      console.log(`Email marked as read: ${subject}`);
    }
  } catch (error) {
    console.error("Error fetching or modifying emails:", error);
  }
}
async function checkForEmailsfromcollege() {
  mailername1 = "college";
  try {
    const response = await gmail.users.messages.list({
      userId: "me",
      q: "is:unread from:principal@cmrcet.ac.in",
    });

    const messages = response.data.messages || [];
    if (messages.length === 0) {
      console.log(`No new emails found from ${mailername1}`);
      return;
    }

    for (const message of messages) {
      const msg = await gmail.users.messages.get({
        userId: "me",
        id: message.id,
        format: "full",
      });

      const emailData = msg.data;
      const subject =
        emailData.payload.headers.find((header) => header.name === "Subject")
          ?.value || "No Subject";
      console.log(`New email: ${subject}`);
      const body = getEmailBody(emailData.payload);
      console.log(`Email body: ${body}`);
      messagetosend = subject + "\n\n" + body;
      if (messagetosend.length > 1201)
        messagetosend = messagetosend.substr(0, 1200);
      sendWhatsAppMessage(
        `A new email from ${mailername1} \n : ${messagetosend}`
      );
      await gmail.users.messages.modify({
        userId: "me",
        id: message.id,
        requestBody: {
          removeLabelIds: ["UNREAD"],
        },
      });

      console.log(`Email marked as read: ${subject}`);
    }
  } catch (error) {
    console.error("Error fetching or modifying emails:", error);
  }
}
function getEmailBody(payload) {
  let body = "";
  if (payload.parts && payload.parts.length) {
    for (const part of payload.parts) {
      if (part.mimeType === "text/plain" || part.mimeType === "text/html") {
        body = Buffer.from(part.body.data, "base64").toString("utf-8");
        break;
      }
    }
  } else if (payload.body && payload.body.data) {
    body = Buffer.from(payload.body.data, "base64").toString("utf-8");
  }

  return body;
}

function sendWhatsAppMessage(message) {
  client.messages
    .create({
      body: message,
      from: "whatsapp:+14155238886",
      to: `whatsapp:${process.env.MY_NUM}`,
    })
    .then((msg) => console.log(`WhatsApp message sent: ${msg.sid}`))
    .catch((err) => console.log("Error sending message:", err));
}
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log("click :: http://localhost:3000/auth");
});
