import axios from 'axios';

import { APIResponse } from '../Types/API';
import {
	AssetResponse,
	UploadFileQuery,
	UploadAvatarQuery,
	UploadThumbnailQuery,
} from '../Types/Assets';

const uploadAvatarQuery = async ({ avatar }: UploadAvatarQuery) => {
	const formData = new FormData();
	formData.append('avatar', avatar);

	const response = await axios.post<APIResponse<AssetResponse>>(
		'/asset/upload-avatar',
		formData
	);

	return response.data;
};

const uploadThumbnailQuery = async ({ thumbnail }: UploadThumbnailQuery) => {
	const formData = new FormData();
	formData.append('thumbnail', thumbnail);

	const response = await axios.post<APIResponse<AssetResponse>>(
		'/asset/upload-thumbnail',
		formData
	);

	return response.data;
};

const uploadFileQuery = async ({ file }: UploadFileQuery) => {
	const formData = new FormData();
	formData.append('file', file);

	const response = await axios.post<APIResponse<AssetResponse>>(
		'/asset/upload-file',
		formData
	);

	return response.data;
};

export { uploadAvatarQuery, uploadThumbnailQuery, uploadFileQuery };
