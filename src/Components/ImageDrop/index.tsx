import { useEffect, useState } from 'react';

import { Avatar, Box, Flex, Image, Text, useToast } from '@chakra-ui/react';
import { IMAGE_TYPES, ImageDropProps } from '../../Types/Assets';
import { useAppSelector } from '../../Hooks/Store';
import Dropzone from 'react-dropzone';
import { useQuery } from '@tanstack/react-query';
import { uploadAvatarQuery, uploadThumbnailQuery } from '../../Services/Asset';

const ImageDrop = ({
	maxFileSize = 1 * 1024 * 1024,
	onUpload,
	fallbackImage,
	currentImage,
	type,
	isDisabled,
}: ImageDropProps) => {
	const user = useAppSelector((state) => state.auth.user);
	const [image, setImage] = useState(fallbackImage || user.avatar);
	const [selectedFile, setSelectedFile] = useState<File>(
		new File([], 'default')
	);
	const toast = useToast();

	useEffect(() => {
		if (currentImage) {
			setImage(currentImage);
		}
	}, [currentImage]);

	const { refetch: refetchThumbnail } = useQuery(
		['UPLOAD_THUMBNAIL'],
		() =>
			uploadThumbnailQuery({
				thumbnail: selectedFile,
			}),

		{
			enabled: false,
			onSuccess: (data) => {
				onUpload(data.data.location);
			},
			onError: (error) => {},
		}
	);

	const { refetch: reftechAvatar } = useQuery(
		['UPLOAD_AVATAR'],
		() =>
			uploadAvatarQuery({
				avatar: selectedFile,
			}),

		{
			enabled: false,
			onSuccess: (data) => {
				onUpload(data.data.location);
			},
			onError: (error) => {},
		}
	);

	return (
		<Flex
			w="100%"
			justifyContent="center"
			alignItems="center"
			flexDir="column"
			gap={2}
		>
			<Dropzone
				accept={{
					'image/png': ['.png', '.PNG'],
					'image/jpg': ['.jpg', '.JPG'],
					'image/jpeg': ['.jpeg', '.JPEG'],
				}}
				disabled={isDisabled}
				maxSize={maxFileSize}
				onDrop={async (acceptedFiles, fileRejections) => {
					const rejectedFile = fileRejections[fileRejections.length - 1];
					if (rejectedFile) {
						if (rejectedFile.errors[0].code === 'file-too-large') {
							toast({
								title: 'file too large',
								description: `max file size is ${maxFileSize / 1024}KB`,
								status: 'error',
								duration: 5000,
								isClosable: true,
							});
						}
						if (rejectedFile.errors[0].code === 'file-invalid-type') {
							toast({
								title: 'invalid file type',
								description: 'only png, jpg, jpeg are allowed',
								status: 'error',
								duration: 5000,
								isClosable: true,
							});
						}
					}
					if (!acceptedFiles.length) return;

					const file = acceptedFiles[acceptedFiles.length - 1];
					setSelectedFile(file);
					setImage(URL.createObjectURL(file));

					if (type === IMAGE_TYPES.AVATAR) {
						reftechAvatar();
					} else if (type === IMAGE_TYPES.THUMBNAIL) {
						refetchThumbnail();
					}
				}}
			>
				{({ getRootProps, getInputProps }) => (
					<Box {...getRootProps()} cursor="pointer">
						{(type === IMAGE_TYPES.AVATAR && (
							<Avatar
								size="2xl"
								name={user.name}
								src={image}
								border={'1px solid'}
								color="gray.200"
							/>
						)) || (
							<Image
								src={image}
								fallbackSrc={fallbackImage}
								border={'1px solid'}
								color="gray.200"
								rounded="md"
								maxW="300px"
							/>
						)}
						<input {...getInputProps()} />
					</Box>
				)}
			</Dropzone>

			{!isDisabled && (
				<Flex
					w="100%"
					flexDir="column"
					justifyContent="center"
					alignItems="center"
				>
					<Text fontSize="sm" color="gray.200">
						click or drag to upload
					</Text>
					<Text fontSize="xs" color="gray.200">
						max file size: {maxFileSize / 1024}KB
					</Text>
				</Flex>
			)}
		</Flex>
	);
};

export default ImageDrop;
