import React, { useEffect } from 'react';
import { Flex, useDisclosure } from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { MdPersonOutline, MdMailOutline, MdLockOutline } from 'react-icons/md';

import { updateSchema } from '../../Schemas/Auth';

import AuthContainer from '../../Components/AuthContainer';
import InputBox from '../../Components/InputBox';
import OTPModal from '../../Components/OTPModal';
import ImageDrop from '../../Components/ImageDrop';

import { updateUserQuery } from '../../Services/Auth';

import { useAppDispatch, useAppSelector } from '../../Hooks/Store';
import { setTitle } from '../../Store/Slicers/titleSlicer';
import { update } from '../../Store/Slicers/authSlicer';

import { OTPTypes } from '../../Types/OTP';
import { IMAGE_TYPES } from '../../Types/Assets';
import { UpdateFormValues } from '../../Types/Auth';

import queryErrorHandler from '../../Helpers/QueryErrorHandler';

const Profile = () => {
	const user = useAppSelector((state) => state.auth.user);
	const dispatch = useAppDispatch();
	const { isOpen, onOpen, onClose } = useDisclosure();

	const { refetch } = useQuery(
		['UPDATE_USER'],
		() =>
			updateUserQuery({
				name: getValues('name'),
				email: getValues('email'),
				password: getValues('password'),
				oldPassword: getValues('oldPassword'),
				avatar: getValues('avatar'),
			}),
		{
			enabled: false,
			onSuccess: (data) => {
				dispatch(update(data.data));
				if (data.data.isEmailChanged) {
					onOpen();
				}
			},
			onError: (error) => queryErrorHandler(error, setError),
		}
	);

	useEffect(() => {
		dispatch(setTitle('profile'));
	}, [dispatch]);

	const onSubmit = async () => {
		await refetch();
	};

	const {
		handleSubmit,
		register,
		getValues,
		setValue,
		setError,
		formState: { errors, isSubmitting },
	} = useForm<UpdateFormValues>({
		resolver: yupResolver(updateSchema),
		defaultValues: {
			name: user?.name,
			email: user?.email,
			oldPassword: '',
			password: '',
			passwordConfirmation: '',
			avatar: '',
		},
	});

	return (
		<>
			<OTPModal
				isOpen={isOpen}
				type={OTPTypes.CHANGE_EMAIL}
				email={getValues('email')}
				onClose={(data) => {
					if (typeof data === 'boolean') return onClose();

					if (data.data) {
						dispatch(update(data.data));
						onClose();
					}
				}}
			/>
			<Flex flexDir="column" align="center" justify="center" py={24} p={8}>
				<AuthContainer
					title={`hello, ${user?.name.split(' ')[0]}`}
					submitText="save"
					onSubmit={handleSubmit(onSubmit)}
					isLoading={isSubmitting}
				>
					<Flex w="100%" gap={4} flexDir="column">
						<ImageDrop
							type={IMAGE_TYPES.AVATAR}
							onUpload={(url) => {
								setValue('avatar', url);
							}}
						/>
						<input type="hidden" {...register('avatar')} />
						<InputBox
							label="name"
							type="name"
							error={errors.name?.message}
							isRequired
							size="lg"
							icon={MdPersonOutline}
							inputIcon={MdPersonOutline}
							{...register('name')}
						/>
						<InputBox
							label="email"
							type="email"
							error={errors.email?.message}
							isRequired
							size="lg"
							icon={MdMailOutline}
							inputIcon={MdMailOutline}
							{...register('email')}
							helpText="if you change your email, you should confirm it again, if you don't it will be reverted back to the old one"
						/>
						<InputBox
							label="new password"
							type="password"
							error={errors.password?.message}
							placeholder="&bull; &bull; &bull; &bull; &bull; &bull; &bull; &bull; &bull; &bull;"
							isRequired
							size="lg"
							showPassword
							icon={MdLockOutline}
							inputIcon={MdLockOutline}
							{...register('password')}
						/>
						<InputBox
							label="confirm new password"
							type="password"
							error={errors.passwordConfirmation?.message}
							placeholder="&bull; &bull; &bull; &bull; &bull; &bull; &bull; &bull; &bull; &bull;"
							isRequired
							size="lg"
							icon={MdLockOutline}
							inputIcon={MdLockOutline}
							{...register('passwordConfirmation')}
						/>
						<InputBox
							label="current password"
							type="password"
							error={errors.oldPassword?.message}
							placeholder="&bull; &bull; &bull; &bull; &bull; &bull; &bull; &bull; &bull; &bull;"
							isRequired
							size="lg"
							showPassword
							helpText="you should enter your current password to save critical changes like email and password"
							icon={MdLockOutline}
							inputIcon={MdLockOutline}
							{...register('oldPassword')}
						/>
					</Flex>
				</AuthContainer>
			</Flex>
		</>
	);
};

export default Profile;
