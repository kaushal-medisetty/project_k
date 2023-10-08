import fetch from "node-fetch";

const VERSION = "v1";
const URL = "https://emailauth-api.onrender.com";

const errorHandler = (data, ...args) => {
	for (let i = 0; i < args.length; i++) {
		if (!data.hasOwnProperty(args[0]))
			throw new Error("argument must be an object with email property");
	}
};

const setOption = (data) => {
	return {
		method: "post",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(data),
	};
};

const sendOTP = async (data) => {
	errorHandler(data, "email");
	if (data.hasOwnProperty("min")) {
		if (typeof data.min !== "number")
			throw new Error("Min property value must be a number");
		else {
			data = { email: data.email, expiresIn: data.min };
		}
	}
	const response = await fetch(`${URL}/${VERSION}/sendotp`, setOption(data));
	return await response.json();
};

const verifyOTP = async (data) => {
	errorHandler(data, "token", "otp");
	const response = await fetch(`${URL}/${VERSION}/verifyotp`, setOption(data));
	return await response.json();
};

const resendOTP = async (data) => {
	errorHandler(data, "token");
	const response = await fetch(`${URL}/${VERSION}/resendotp`, setOption(data));
	return await response.json();
};

export { sendOTP, verifyOTP, resendOTP };
