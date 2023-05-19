export enum IMAGE_TYPES {
	AVATAR = 'AVATAR',
	THUMBNAIL = 'THUMBNAIL',
}

export interface ImageDropProps {
	maxFileSize?: number;
	onUpload: (location: string) => void;
	type: IMAGE_TYPES;
	fallbackImage?: string;
	currentImage?: string;
	isDisabled?: boolean;
}

export interface AssetResponse {
	location: string;
}

export interface AttatchmentAssetResponse {
	location: string;
	name: string;
}

export interface UploadAvatarQuery {
	avatar: File;
}

export interface UploadThumbnailQuery {
	thumbnail: File;
}

export interface UploadFileQuery {
	file: File;
}
