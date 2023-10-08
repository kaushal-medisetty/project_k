import { sendOTP, verifyOTP, resendOTP } from "./index.js";
// (async () => {
// 	const data = await sendOTP({ email: "adarshshahi2404@gmail.com", min: 2 });
// 	console.log(data);
// })();
(async () => {
	const data = await verifyOTP({
		token:
			"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFkYXJzaHNoYWhpMjQwNEBnbWFpbC5jb20iLCJpYXQiOjE2ODM1NTM3MDAsImV4cCI6MTY4MzU1MzgyMH0.BUaz1lWxFcFDYXl4pSBvMnbzGfszXFMef4alMuAkoJs",
		otp: "920944",
	});
	console.log(data);
})();
