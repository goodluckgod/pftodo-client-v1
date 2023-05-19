import { FlexProps } from '@chakra-ui/react';
import { ReactJSXElement } from '@emotion/react/types/jsx-namespace';

export enum AuthContainerType {
	SIGN_IN = 'SIGN_IN',
	SIGN_UP = 'SIGN_UP',
	FORGOT_PASSWORD = 'FORGOT_PASSWORD',
}

export interface AuthContainerProps extends FlexProps {
	children: React.ReactNode;
	title: string;
	changeTo?: string;
	onChange?: () => void;
	onSubmit: () => void;
	submitText: string;
	isLoading: boolean;
	onForgotPassword?: () => void;
	isCentered?: boolean;
	buttonIcon?: ReactJSXElement;
	canSubmit?: boolean;
}

export interface User {
	email: string;
	avatar: string;
	name: string;
	token: string;
}

export interface UpdatedUser extends User {
	isEmailChanged: boolean;
}

export interface AuthState {
	user: User;
	isLoggedIn: boolean;
}

export interface LoginFormValues {
	email: string;
	password: string;
}

export interface RegisterResponse {
	email: string;
}

export interface RegisterFormValues {
	name: string;
	email: string;
	password: string;
	passwordConfirmation: string;
	avatar: string;
}

export interface RegisterFormQuery
	extends Omit<RegisterFormValues, 'passwordConfirmation'> {}

export interface UpdateFormValues {
	name: string;
	email: string;
	oldPassword: string;
	password: string;
	avatar: string;
	passwordConfirmation: string;
}

export interface UpdateFormQuery
	extends Omit<UpdateFormValues, 'passwordConfirmation'> {}

export interface ForgotPasswordFormValues {
	email: string;
	password: string;
	passwordConfirmation: string;
}

export interface ForgotPasswordFormQuery
	extends Omit<ForgotPasswordFormValues, 'passwordConfirmation' | 'password'> {}
