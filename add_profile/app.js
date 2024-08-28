const https = require('https');
const http = require('http');
const dotenv = require('dotenv');
const fs = require('fs');
const cryptoJs = require('crypto-js');
const querystring = require('querystring');
const path = require('path');
const { v4: uuidv4 } = require("uuid");

// Determine the environment (default to bydgoszcz-test)
const env = process.env.NODE_ENV || 'test';

// Construct the path for the environment-specific .env file
const envFilePath = `.env.${env}`

// Check if the .env file exists
if (fs.existsSync(envFilePath)) {
  dotenv.config({ path: envFilePath });
  console.log(`Loaded ${envFilePath} file`);
} else {
  console.error(`.env file for ${env} enfironment not found. Using default .env file `);
  dotenv.config(); // Fallback to default .env if specific one is missing
}

const FOLDER_PATH = path.join(__dirname, 'data');

const PROFILE_ASSIGNER_USERNAME = process.env.PROFILE_ASSIGNER_USERNAME;
const PROFILE_ASSIGNER_PASSWORD = process.env.PROFILE_ASSIGNER_PASSWORD;

const PLATFORM_ADMIN_USERNAME = process.env.PLATFORM_ADMIN_USERNAME;
const PLATFORM_ADMIN_PASSWORD = process.env.PLATFORM_ADMIN_PASSWORD;

const IDENTITY_SERVER_CLIENT_ID = process.env.IDENTITY_SERVER_CLIENT_ID;
const IDENTITY_SERVER_CLIENT_SECRET = process.env.IDENTITY_SERVER_CLIENT_SECRET;
const IDENTITY_SERVER_HASH = IDENTITY_SERVER_CLIENT_ID + ":" + IDENTITY_SERVER_CLIENT_SECRET;
const IDENTITY_SERVER_OAUTH2_TOKEN_URI = process.env.IDENTITY_SERVER_OAUTH2_TOKEN_URI;

const CORE_MODULE_PROFILE_KEY = process.env.CORE_MODULE_PROFILE_KEY;
const PROFILE_REGISTRY_URI = process.env.PROFILE_REGISTRY_URI;


function postRequest(lib, requestUrl, requestData, requestHeaders) {
  return new Promise((resolve, reject) => {
    const postData = querystring.stringify(requestData);

    let headers = { 'Content-Length': Buffer.byteLength(postData) };
    Object.keys(requestHeaders).forEach((i) => {
      headers[i] = requestHeaders[i];
    });

    const request = lib.request(requestUrl, {
      method: 'POST',
      headers: headers
    }, (response) => {
      let data = '';

      // COllect the response body data
      response.on('data', (chunk) => {
        data += chunk;
      });

      // Resolve the promise once all data is received
      response.on('end', () => {
        resolve(JSON.parse(data));
      });
    }).on('error', (err) => {
      reject(err);
    });

    request.write(postData);
    request.end();
  });
}

function postJsonRequest(lib, requestUrl, requestData, requestHeaders) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify(requestData);

    //let headers = { 'Content-Length': Buffer.byteLength(postData) };
    //Object.keys(requestHeaders).forEach((i) => {
    //  headers[i] = requestHeaders[i];
    //});

    const request = lib.request(requestUrl, {
      method: 'POST',
      headers: requestHeaders
    }, (response) => {
      let data = '';

      // COllect the response body data
      response.on('data', (chunk) => {
        data += chunk;
      });

      // Resolve the promise once all data is received
      response.on('end', () => {
        resolve(data);
      });
    }).on('error', (err) => {
      reject(err);
    });

    request.write(postData);
    request.end();
  });
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}


async function app() {
  try {

    const PROFILE_ASSIGNER_ACCESS_TOKEN_RESPONSE = await postRequest(https, IDENTITY_SERVER_OAUTH2_TOKEN_URI, {
      grant_type: 'password',
      username: PROFILE_ASSIGNER_USERNAME,
      password: PROFILE_ASSIGNER_PASSWORD,
      scope: 'email openid pc profile SYSTEM'
    }, {
      "Authorization": "Basic " + cryptoJs.enc.Base64.stringify(cryptoJs.enc.Utf8.parse(IDENTITY_SERVER_HASH)),
      "Content-Type": "application/x-www-form-urlencoded"
    });
    const PROFILE_ASSIGNER_ACCESS_TOKEN = PROFILE_ASSIGNER_ACCESS_TOKEN_RESPONSE['access_token'];

    const PLATFORM_ADMIN_PASSWORD_RESPONSE = await postRequest(https, IDENTITY_SERVER_OAUTH2_TOKEN_URI, {
      grant_type: 'password',
      username: PLATFORM_ADMIN_USERNAME,
      password: PLATFORM_ADMIN_PASSWORD,
      scope: 'email openid pc profile SYSTEM'
    }, {
      "Authorization": "Basic " + cryptoJs.enc.Base64.stringify(cryptoJs.enc.Utf8.parse(IDENTITY_SERVER_HASH)),
      "Content-Type": "application/x-www-form-urlencoded"
    });
    const PLATFORM_ADMIN_PASSWORD_TOKEN = PLATFORM_ADMIN_PASSWORD_RESPONSE['access_token'];

    const PLATFORM_ADMIN_PROFILE_SWITCH_RESPONSE = await postRequest(https, IDENTITY_SERVER_OAUTH2_TOKEN_URI, {
      grant_type: 'profile_switch',
      profile_key: CORE_MODULE_PROFILE_KEY,
      client_id: IDENTITY_SERVER_CLIENT_ID,
      client_secret: IDENTITY_SERVER_CLIENT_SECRET,
      token: PLATFORM_ADMIN_PASSWORD_TOKEN
    }, {
      'Authorication': `Bearer ${PLATFORM_ADMIN_PASSWORD_TOKEN}`,
      'Content-Type': 'application/x-www-form-urlencoded'
    });
    const PLATFORM_ADMIN_PROFILE_SWITCH_TOKEN = PLATFORM_ADMIN_PROFILE_SWITCH_RESPONSE['access_token'];


    fs.readdir(FOLDER_PATH, (err, files) => {
      if (err) {
        console.error(err);
        return;
      }

      const JSON_FILES = files.filter((file) => path.extname(file) === '.json');
      JSON_FILES.forEach((file) => {
        const FILE_PATH = path.join(FOLDER_PATH, file);
        fs.readFile(FILE_PATH, 'utf8', (err, data) => {
          if (err) {
            console.error('Error reading the file:', err);
            return;
          }

          try {
            const JSON_DATA = JSON.parse(data);
            const ADD_PROFILE_RESPONSE = postJsonRequest(http, PROFILE_REGISTRY_URI + '/actions/profile/internal', JSON_DATA, {
              'Authorization': `Bearer ${PLATFORM_ADMIN_PROFILE_SWITCH_TOKEN}`,
              'X-Language': 'PL',
              'X-Process-Id': uuidv4(),
              'X-Transaction-Id': uuidv4(),
              'X-Request-Id': uuidv4(),
              'X-Job-Id': uuidv4(),
              'Content-Type': 'application/json; charset=utf-8',
              'X-Communication-Mode': 'ASYNC',
              'X-Resource-Security': 'FULL'
            });
            sleep(2000).then(() => {
              console.log(ADD_PROFILE_RESPONSE);
            });
          } catch (parseError) {
            console.error(`Error parsing JSON from ${file}:`, parseError);
          }
        })
      })
    });

  } catch (error) {
    console.error('Error making requests:', error);
  }
}


app();

