import axios from 'axios';

import {
	LoginFormValues,
	RegisterFormQuery,
	ForgotPasswordFormQuery,
	RegisterResponse,
	User,
	UpdatedUser,
	UpdateFormQuery,
} from '../Types/Auth';
import { APIResponse } from '../Types/API';

const loginQuery = async ({ email, password }: LoginFormValues) => {
	const response = await axios.post<APIResponse<User>>('/user/login', {
		email,
		password,
	});

	return response.data;
};

const registerQuery = async ({
	name,
	email,
	password,
	avatar,
}: RegisterFormQuery) => {
	const response = await axios.post<APIResponse<RegisterResponse>>(
		'/user/register',
		{
			name,
			email,
			password,
			avatar,
		}
	);

	return response.data;
};

const forgotPasswordQuery = async ({ email }: ForgotPasswordFormQuery) => {
	const response = await axios.post<APIResponse<null>>(
		'/user/forgot-password',
		{
			email,
		}
	);

	return response.data;
};

const updateUserQuery = async ({
	name,
	email,
	oldPassword,
	password,
	avatar,
}: UpdateFormQuery) => {
	const response = await axios.put<APIResponse<UpdatedUser>>('/user/update', {
		name,
		email,
		oldPassword,
		password,
		avatar,
	});

	return response.data;
};

export { loginQuery, registerQuery, forgotPasswordQuery, updateUserQuery };
