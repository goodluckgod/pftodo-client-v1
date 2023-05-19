import { User } from './Auth';

export enum TodoPriority {
	LOW = 'LOW',
	MEDIUM = 'MEDIUM',
	HIGH = 'HIGH',
}

export enum TodoPriorityNames {
	LOW = 'low',
	MEDIUM = 'medium',
	HIGH = 'high',
}

export enum TodoPriorityColor {
	LOW = 'green',
	MEDIUM = 'yellow',
	HIGH = 'red',
}

export enum TodoStatus {
	ACTIVE = 'ACTIVE',
	ONWORK = 'ONWORK',
	COMPLETED = 'COMPLETED',
}

export enum TodoStatusNames {
	ACTIVE = 'active',
	COMPLETED = 'completed',
	ONWORK = 'onwork',
}

export enum TodoStatusColor {
	ACTIVE = 'green',
	COMPLETED = 'blue',
	ONWORK = 'yellow',
}

export type Todo = {
	_id: string;
	title: string;
	description: string;
	tags: string[];
	file: string;
	thumbnail: string;
	createdBy?: User;
	createdAt: Date;
	updatedAt?: Date;
	isPublic: boolean;
	slug: string;
	priority: TodoPriority;
	status: TodoStatus;
};

export interface GetTodoResponse extends Todo {
	isOwner: boolean;
}

export interface TodoFormValues {
	title: string;
	description: string;
	tags: string;
	file: string;
	thumbnail: string;
	isPublic: boolean;
	priority: TodoPriority;
	status: TodoStatus;
}

export interface CreateTodoFormQuery extends Omit<TodoFormValues, 'tags'> {
	tags: string[];
}

export interface UpdateTodoFormQuery extends Omit<TodoFormValues, 'tags'> {
	tags: string[];
	slug: string;
}
