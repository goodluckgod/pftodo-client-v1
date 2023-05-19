import {
	Button,
	Checkbox,
	Flex,
	IconButton,
	Text,
	useClipboard,
	useTheme,
	useToast,
} from '@chakra-ui/react';
import { useAppDispatch } from '../../Hooks/Store';
import { setTitle } from '../../Store/Slicers/titleSlicer';
import InputBox from '../../Components/InputBox';
import TextareaBox from '../../Components/TextareaBox';
import fallbackImage from '../../Assets/placeholder.png';
import ImageDrop from '../../Components/ImageDrop';
import { IMAGE_TYPES } from '../../Types/Assets';
import {
	GetTodoResponse,
	TodoFormValues,
	TodoPriority,
	TodoPriorityColor,
	TodoPriorityNames,
	TodoStatus,
	TodoStatusColor,
	TodoStatusNames,
} from '../../Types/Todo';
import { useForm } from 'react-hook-form';
import SelectBox from '../../Components/SelectBox';
import { MdDelete, MdLink } from 'react-icons/md';
import { useQuery } from '@tanstack/react-query';
import {
	createTodoQuery,
	deleteTodoQuery,
	getTodoQuery,
	updateTodoQuery,
} from '../../Services/Todo';
import queryErrorHandler from '../../Helpers/QueryErrorHandler';
import { useNavigate, useParams } from 'react-router-dom';
import { yupResolver } from '@hookform/resolvers/yup';
import { todoSchema } from '../../Schemas/Todo';
import { setLoading } from '../../Store/Slicers/loadingSlicer';
import { useEffect, useState } from 'react';
import Dropzone from 'react-dropzone';
import { uploadFileQuery } from '../../Services/Asset';

const AddEditViewTodo = () => {
	const dispatch = useAppDispatch();
	const theme = useTheme();
	const toast = useToast();
	const { setValue: setClipboardValue, onCopy } = useClipboard('');
	const [currentTodo, setCurrentTodo] = useState<GetTodoResponse | null>(null);
	const [disableAll, setDisableAll] = useState(false);
	const navigate = useNavigate();
	const [selectedFile, setSelectedFile] = useState<File>(
		new File([], 'default')
	);

	const todoSlug = useParams<{ slug: string }>().slug;

	const { isFetching } = useQuery(
		['CURRENT_TODO'],
		async () => getTodoQuery(todoSlug as string),
		{
			enabled: !!todoSlug,
			onSuccess: (data) => {
				dispatch(setTitle(data.data.title));
				setCurrentTodo(data.data);
				reset({
					...data.data,
					tags: data.data?.tags?.join(', ') || '',
				});
				console.log(data.data);
				setDisableAll(!data.data.isOwner);
			},
			onError: (error: any) => {
				if (error?.response?.status === 404) {
					navigate('/404');
				} else {
					queryErrorHandler(error, setError);
				}
			},
		}
	);

	const { refetch: createTodo } = useQuery(
		['CREATE_TODO'],
		async () =>
			createTodoQuery({
				...getValues(),
				tags:
					// Split the tags by comma and trim the spaces, if can't split then check if there is a value and add it to an array, else add an empty array
					getValues('tags').includes(',')
						? getValues('tags')
								.split(',')
								.map((tag) => tag.trim())
						: getValues('tags')
						? [getValues('tags')]
						: [],
			}),
		{
			enabled: false,
			onSuccess: (data) => {
				navigate(`/todo/${data.data.slug}`);
			},
			onError: (error) => queryErrorHandler(error, setError),
		}
	);

	const { refetch: updateTodo } = useQuery(
		['UPDATE_TODO'],
		async () =>
			updateTodoQuery({
				...getValues(),
				tags:
					// Split the tags by comma and trim the spaces, if can't split then check if there is a value and add it to an array, else add an empty array
					getValues('tags').includes(',')
						? getValues('tags')
								.split(',')
								.map((tag) => tag.trim())
						: getValues('tags')
						? [getValues('tags')]
						: [],
				slug: todoSlug as string,
			}),
		{
			enabled: false,
			onSuccess: (data) => {
				if (!data.data) return;
				setCurrentTodo({
					...data.data,
					isOwner: true,
				});
				reset({
					...data.data,
					tags: data.data?.tags?.join(', ') || '',
				});
			},
			onError: (error) => queryErrorHandler(error, setError),
		}
	);

	const { refetch: deleteTodo, isFetching: deleting } = useQuery(
		['DELETE_TODO'],
		async () => deleteTodoQuery(todoSlug as string),
		{
			enabled: false,
			onSuccess: () => {
				navigate('/');
			},
			onError: (error) => queryErrorHandler(error, setError),
		}
	);

	const { refetch: uploadFile } = useQuery(
		['UPLOAD_FILE'],
		async () =>
			uploadFileQuery({
				file: selectedFile,
			}),
		{
			enabled: false,
			onSuccess: (data) => {
				setValue('file', data.data.location, {
					shouldValidate: true,
					shouldDirty: true,
				});
			},
			onError: (error) => queryErrorHandler(error, setError),
		}
	);

	useEffect(() => {
		dispatch(setLoading(isFetching));
	}, [isFetching, dispatch]);

	dispatch(setTitle(currentTodo ? currentTodo.title : 'add todo'));

	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
		getValues,
		setValue,
		setError,
		reset,
	} = useForm<TodoFormValues>({
		defaultValues: {
			title: currentTodo ? currentTodo.title : '',
			description: currentTodo ? currentTodo.description : '',
			priority: currentTodo ? currentTodo.priority : TodoPriority.LOW,
			status: currentTodo ? currentTodo.status : TodoStatus.ACTIVE,
			tags: currentTodo ? currentTodo.tags.join(',') : '',
			thumbnail: currentTodo ? currentTodo.thumbnail : '',
			file: currentTodo ? currentTodo.file : '',
			isPublic: currentTodo ? currentTodo.isPublic : false,
		},
		resolver: yupResolver(todoSchema),
	});

	const submit = async () => {
		if (currentTodo) {
			await updateTodo();
		} else {
			await createTodo();
		}
	};
	return (
		<Flex
			p={4}
			pb={8}
			justifyContent={'center'}
			alignItems={'center'}
			flexDirection={'column'}
			w={'100%'}
		>
			<Flex
				bgGradient={'linear(to-r, purple.500, purple.300)'}
				rounded={'md'}
				minW={'300px'}
				w={'100%'}
				maxW={'500px'}
				p={4}
				flexDirection={'column'}
				alignItems={'center'}
				boxShadow={'lg'}
			>
				<ImageDrop
					type={IMAGE_TYPES.THUMBNAIL}
					fallbackImage={fallbackImage}
					onUpload={(url) => setValue('thumbnail', url)}
					currentImage={currentTodo ? currentTodo.thumbnail : ''}
					maxFileSize={2 * 1024 * 1024}
					isDisabled={disableAll}
				/>
				<Flex flexDirection={'column'} gap={4} w={'100%'} p={4}>
					<form onSubmit={handleSubmit(submit)}>
						<input hidden {...register('thumbnail')} />
						<input hidden {...register('file')} />
						<InputBox
							label="title"
							placeholder="enter title"
							error={errors.title?.message}
							type="text"
							size={'lg'}
							w={'100%'}
							{...register('title')}
							isDisabled={disableAll}
						/>

						<TextareaBox
							label="description"
							placeholder="enter description"
							error={errors.description?.message}
							size={'lg'}
							w={'100%'}
							{...register('description')}
							isDisabled={disableAll}
						/>

						<SelectBox
							label="tags"
							placeholder="select priority"
							error={errors.priority?.message}
							size={'lg'}
							w={'100%'}
							{...register('priority')}
							variant={'filled'}
							bg={'red'}
							isDisabled={disableAll}
						>
							{Object.values(TodoPriority).map((priority) => (
								<option
									key={priority}
									value={priority}
									style={{
										backgroundColor:
											theme.colors[TodoPriorityColor[priority]][400],
									}}
								>
									{TodoPriorityNames[priority]}
								</option>
							))}
						</SelectBox>

						<SelectBox
							label="status"
							placeholder="select status"
							error={errors.status?.message}
							size={'lg'}
							w={'100%'}
							{...register('status')}
							variant={'filled'}
							isDisabled={disableAll}
						>
							{Object.values(TodoStatus).map((status) => (
								<option
									key={status}
									value={status}
									style={{
										backgroundColor: theme.colors[TodoStatusColor[status]][400],
									}}
								>
									{TodoStatusNames[status]}
								</option>
							))}
						</SelectBox>

						<InputBox
							label="tags"
							placeholder="enter tags"
							error={errors.tags?.message}
							type="text"
							size={'lg'}
							w={'100%'}
							helpText={'seperate tags with comma'}
							{...register('tags')}
							isDisabled={disableAll}
						/>

						<Dropzone
							onDrop={(files, rejectedFiles) => {
								const rejectedFile = rejectedFiles[0];
								if (rejectedFile) {
									if (rejectedFile.errors[0].code === 'file-too-large') {
										toast({
											title: 'error',
											description: 'file too large',
											status: 'error',
											duration: 3000,
											isClosable: true,
										});
									} else {
										toast({
											title: 'error',
											description: 'invalid file type',
											status: 'error',
											duration: 3000,
											isClosable: true,
										});
									}
								} else {
									setSelectedFile(files[0]);
									uploadFile();
								}
							}}
							maxSize={10 * 1024 * 1024}
							multiple={false}
							disabled={disableAll}
						>
							{({ getRootProps, getInputProps }) => (
								<Flex
									{...getRootProps()}
									w={'100%'}
									h={'100%'}
									justifyContent={'center'}
									alignItems={'center'}
									flexDirection={'column'}
									border={'2px dashed'}
									borderColor={'purple.400'}
									cursor={'pointer'}
									rounded={'md'}
									p={4}
									bg={disableAll ? 'gray.600' : 'purple.50'}
									my={4}
								>
									<input {...getInputProps()} />
									<Text>Drag and drop or click to upload file</Text>
								</Flex>
							)}
						</Dropzone>

						{getValues('file') && (
							<Flex
								w={'100%'}
								justifyContent={'center'}
								alignItems={'center'}
								flexDirection={'column'}
								border={'2px dashed'}
								borderColor={'purple.400'}
								cursor={'pointer'}
								textAlign={'center'}
								rounded={'md'}
								p={4}
								bg={'purple.50'}
								my={4}
								onClick={() => {
									window.open(getValues('file'));
								}}
							>
								<Text>attachment</Text>
								<Text fontSize={'xs'}>{getValues('file')}</Text>
								{!disableAll && (
									<IconButton
										aria-label={'delete attachment'}
										icon={<MdDelete />}
										colorScheme={'red'}
										color={'white'}
										borderColor={'black'}
										onClick={() => {
											setValue('file', '');
										}}
									/>
								)}
							</Flex>
						)}

						<Checkbox
							colorScheme={'white'}
							color={'blackAlpha.800'}
							borderColor={'black'}
							{...register('isPublic')}
							isChecked={getValues('isPublic')}
							isDisabled={disableAll}
							onChange={(e) => {
								setValue('isPublic', e.target.checked, {
									shouldDirty: true,
								});
							}}
						>
							set to public (you can share your url with others)
						</Checkbox>

						<Flex w={'100%'} justifyContent={'flex-end'} gap={2} mt={4}>
							<IconButton
								aria-label={'copy todo url'}
								icon={<MdLink />}
								colorScheme={'purple'}
								color={'white'}
								borderColor={'black'}
								onClick={() => {
									if (currentTodo) {
										setClipboardValue(window.location.href);
										onCopy();
										toast({
											title: 'success',
											description: 'copied to clipboard',
											status: 'success',
											duration: 3000,
											isClosable: true,
										});
									} else {
										toast({
											title: 'error',
											description: 'you need to save todo first',
											status: 'error',
											duration: 3000,
											isClosable: true,
										});
									}
								}}
							/>

							<IconButton
								aria-label={'delete todo'}
								icon={<MdDelete />}
								colorScheme={'red'}
								color={'white'}
								borderColor={'black'}
								_hover={{ bg: 'red', color: 'white' }}
								isDisabled={disableAll}
								isLoading={deleting}
								onClick={() => {
									if (currentTodo) {
										deleteTodo();
									} else {
										toast({
											title: 'error',
											description: 'you can not delete unsaved todo',
											status: 'error',
											duration: 3000,
											isClosable: true,
										});
									}
								}}
							/>

							<Button
								colorScheme={'white'}
								color={'blackAlpha.800'}
								borderColor={'black'}
								type={'submit'}
								_hover={{ bg: 'white', color: 'blackAlpha.800' }}
								isLoading={isSubmitting}
								isDisabled={disableAll}
							>
								{currentTodo ? 'update' : 'add'}
							</Button>
						</Flex>
					</form>
				</Flex>
			</Flex>
		</Flex>
	);
};

export default AddEditViewTodo;
