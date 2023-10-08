## Introduction

This is a Node.js module that provides a simple interface for sending and verifying OTP (One-Time Password) codes via an API. The API is hosted at https://emailauth-api.onrender.com.
Installation

This module can be installed using npm:

```
npm install email-otp-verify
```

Usage

To use the module, import the sendOTP, verifyOTP, and resendOTP functions:

```js
import { sendOTP, verifyOTP, resendOTP } from "email-otp-verify";
```

## sendOTP(data)

This function sends an OTP code to the email address provided in the data object. The data object must have an email property that contains the email address. The function returns a Promise that resolves with the response including a token which will be required further when verifying OTP and resending OTP.

Optionally, you can also set the expiration time for the OTP by including a min property in the data object. The min property must be a number that represents the number of minutes before the OTP expires. If the min property is included, the function will modify the data object to include the expiresIn property instead, with the value set to the number of seconds until expiration.

```js
const data = {
	email: "example@example.com",
	min: 5, // optional, sets the OTP expiration time to 5 minutes
};

sendOTP(data)
	.then((response) => {
		console.log(response);
	})
	.catch((error) => {
		console.error(error);
	});
```

## verifyOTP(data)

This function verifies an OTP code that was sent to an email address. The data object must have a token property that contains the token received from the sendOTP function, and an otp property that contains the OTP code entered by the user. The function returns a Promise that resolves with the response from the API.

```js
const data = {
	token: "example-token",
	otp: "123456",
};

verifyOTP(data)
	.then((response) => {
		console.log(response);
	})
	.catch((error) => {
		console.error(error);
	});
```

## resendOTP(data)

This function resends an OTP code to the email address associated with the given token. The data object must have a token property that contains the token received from the sendOTP function. The function returns a Promise that resolves with the response from the API.

```js
const data = {
	token: "example-token",
};

resendOTP(data)
	.then((response) => {
		console.log(response);
	})
	.catch((error) => {
		console.error(error);
	});
```

### Error Handling

The module throws an error if the data object passed to any of the functions is missing a required property. Specifically, the sendOTP function requires an email property, the verifyOTP function requires token and otp properties, and the resendOTP function requires a token property.
