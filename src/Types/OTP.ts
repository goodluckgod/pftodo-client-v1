import { APIResponse } from './API';
import { User } from './Auth';

export enum OTPTypes {
	REGISTRATION = 'REGISTRATION',
	FORGOT_PASSWORD = 'FORGOT_PASSWORD',
	CHANGE_EMAIL = 'CHANGE_EMAIL',
}

export enum OTPTitles {
	REGISTRATION = "let's finish your registration",
	FORGOT_PASSWORD = "let's reset your password",
	CHANGE_EMAIL = "let's change your email",
}

export interface OTPModalProps {
	isOpen: boolean;
	onClose: (data: APIResponse<User | null> | boolean) => void;
	type: OTPTypes;
	email: string;
	password?: string;
	canClose?: boolean;
}

export interface OTPFormValues {
	otp: string;
}

export interface VerifyOTPQuery {
	email: string;
	otp: string;
	type: OTPTypes;
	password?: string;
}

export interface ResendOTPQuery {
	email: string;
}
