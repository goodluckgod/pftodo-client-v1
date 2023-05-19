import * as yup from 'yup';

const logInSchema = yup.object().shape({
	email: yup.string().email().required(),
	password: yup.string().min(6).required(),
});

const signUpSchema = yup.object().shape({
	name: yup.string().min(3).required(),
	email: yup.string().email().required(),
	password: yup.string().min(6).required(),
	passwordConfirmation: yup
		.string()
		.oneOf([yup.ref('password')], 'passwords must match')
		.required(),
});

const forgotPasswordSchema = yup.object().shape({
	email: yup.string().email().required(),
	password: yup.string().min(6).required(),
	passwordConfirmation: yup
		.string()
		.oneOf([yup.ref('password')], 'passwords must match')
		.required(),
});

// if .min(6) given to password field, it will throw error if password is not changed.
const min6Chars = (value: string | null | undefined) => {
	if (!value) return true;

	if (value.length < 6) {
		return false;
	}

	return true;
};

const updateSchema = yup.object().shape({
	name: yup.string().min(3).required(),
	email: yup.string().email().required(),
	password: yup
		.string()
		.test('min-6-chars', 'password must be at least 6 characters', min6Chars)
		.optional()
		.nullable(),
	passwordConfirmation: yup
		.string()
		.oneOf([yup.ref('password')], 'passwords must match')
		.optional()
		.nullable()
		.test('min-6-chars', 'password must be at least 6 characters', min6Chars),
	oldPassword: yup
		.string()
		.test('min-6-chars', 'password must be at least 6 characters', min6Chars)
		.optional()
		.nullable(),
});

export { logInSchema, signUpSchema, forgotPasswordSchema, updateSchema };
