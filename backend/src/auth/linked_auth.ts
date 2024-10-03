;
import axios from "axios";
import express, { Request, Response } from "express";
import admin from '../config/firebase.config';

const clientID = '774jlqal6w58dt';
const clientSecret = 'WPL_AP0.Boveh6fIEPXOqvfT.NTcxMTc5MzE3';
const redirectUri = 'http://localhost:3000/home';
const router = express.Router();

router.get('/linkedin', (req, res) => {
    console.log('heyy')
  const authorizationUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${clientID}&redirect_uri=${redirectUri}&state=123456&scope=r_liteprofile%20r_emailaddress`;
  res.redirect(authorizationUrl);
});

router.get('/linkedin/callback', async (req, res) => {
  const authorizationCode = req.query.code;

  try {
    const tokenResponse = await axios.post('https://www.linkedin.com/oauth/v2/accessToken', null, {
      params: {
        grant_type: 'authorization_code',
        code: authorizationCode,
        redirect_uri: redirectUri,
        client_id: clientID,
        client_secret: clientSecret
      }
    });

    const accessToken = tokenResponse.data.access_token;
    const profileResponse = await axios.get('https://api.linkedin.com/v2/me', {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });

    const emailResponse = await axios.get('https://api.linkedin.com/v2/emailAddress?q=members&projection=(elements*(handle~))', {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });

    const profile = profileResponse.data;
    const email = emailResponse.data.elements[0]['handle~'].emailAddress;

    // Create Firebase token
    const firebaseToken = await admin.auth().createCustomToken(profile.id, { email, name: profile.localizedFirstName });

    res.json({ firebaseToken });

  } catch (error) {
    res.status(500).send(error);
  }
});
export default router;
