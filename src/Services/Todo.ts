import axios from 'axios';

import { APIResponse } from '../Types/API';
import {
	CreateTodoFormQuery,
	GetTodoResponse,
	Todo,
	UpdateTodoFormQuery,
} from '../Types/Todo';

const createTodoQuery = async ({
	title,
	description,
	tags,
	file,
	thumbnail,
	isPublic,
	priority,
	status,
}: CreateTodoFormQuery) => {
	const response = await axios.post<APIResponse<Todo>>('/todo/create', {
		title,
		description,
		tags,
		file,
		thumbnail,
		isPublic,
		priority,
		status,
	});

	return response.data;
};

const updateTodoQuery = async ({
	title,
	description,
	tags,
	file,
	thumbnail,
	isPublic,
	priority,
	status,
	slug,
}: UpdateTodoFormQuery) => {
	const response = await axios.put<APIResponse<Todo>>('/todo/update/' + slug, {
		title,
		description,
		tags,
		file,
		thumbnail,
		isPublic,
		priority,
		status,
	});

	return response.data;
};

const getTodosQuery = async ({ query }: { query?: string }) => {
	const response = await axios.get<APIResponse<Todo[]>>('/todo/mine', {
		params: {
			search: query,
		},
	});

	return response.data;
};

const getTodoQuery = async (slug: string) => {
	const response = await axios.get<APIResponse<GetTodoResponse>>(
		'/todo/' + slug
	);

	return response.data;
};

const deleteTodoQuery = async (slug: string) => {
	const response = await axios.delete<APIResponse<Todo>>(
		'/todo/delete/' + slug
	);

	return response.data;
};

export {
	createTodoQuery,
	updateTodoQuery,
	getTodosQuery,
	getTodoQuery,
	deleteTodoQuery,
};
