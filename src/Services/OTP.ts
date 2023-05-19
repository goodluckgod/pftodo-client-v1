import axios from 'axios';

import { VerifyOTPQuery, ResendOTPQuery } from '../Types/OTP';
import { APIResponse } from '../Types/API';
import { User } from '../Types/Auth';

const verifyOTPQuery = async ({
	email,
	otp,
	type,
	password,
}: VerifyOTPQuery) => {
	const response = await axios.post<APIResponse<User | null>>(
		'/user/verify-otp',
		{
			email,
			otp,
			type,
			password,
		}
	);

	return response.data;
};

const resendOTPQuery = async ({ email }: ResendOTPQuery) => {
	const response = await axios.post<APIResponse<null>>('/user/resend-otp', {
		email,
	});

	return response.data;
};

export { verifyOTPQuery, resendOTPQuery };
