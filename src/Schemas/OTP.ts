import * as yup from 'yup';

const otpSchema = yup.object().shape({
	otp: yup.string().min(6).max(6).required(),
});

export { otpSchema };
