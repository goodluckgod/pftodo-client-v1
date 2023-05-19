export enum APIMessageType {
	FIELD = 'field',
	TOAST = 'toast',
}

export interface APIMessage {
	msg: string;
	path?: string;
	type: APIMessageType;
}

export interface APIResponse<T> {
	data: T;
	messages: APIMessage[];
	errors: APIMessage[];
}
