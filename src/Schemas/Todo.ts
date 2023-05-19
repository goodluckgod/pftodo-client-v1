import * as yup from 'yup';

const todoSchema = yup.object().shape({
	title: yup.string().min(3).max(50).required(),
	description: yup.string().min(3).max(500).required(),
	tags: yup.string().optional(),
	file: yup.string().optional(),
	thumbnail: yup.string().url().optional(),
	isPublic: yup.boolean().required(),
	priority: yup.string().required(),
	status: yup.string().required(),
});

export { todoSchema };
