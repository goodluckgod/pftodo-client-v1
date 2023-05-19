import { APIMessage, APIMessageType } from '../Types/API';

const queryErrorHandler = (error: any, setError: any) => {
	const errors = error?.response?.data?.errors || error?.response?.data;
	errors?.forEach((error: APIMessage) => {
		if (error.type === APIMessageType.FIELD) {
			setError(error.path, { message: error.msg });
		}
	});
};

export default queryErrorHandler;
