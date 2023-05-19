import React, { useState, useEffect } from 'react';
import {
	Box,
	Checkbox,
	Collapse,
	Flex,
	Link,
	useDisclosure,
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { MdMailOutline, MdLockOutline, MdPersonOutline } from 'react-icons/md';

import AuthContainer from '../../Components/AuthContainer';
import InputBox from '../../Components/InputBox';
import OTPModal from '../../Components/OTPModal';

import { setTitle } from '../../Store/Slicers/titleSlicer';
import { login } from '../../Store/Slicers/authSlicer';

import {
	AuthContainerType,
	ForgotPasswordFormValues,
	LoginFormValues,
	RegisterFormValues,
} from '../../Types/Auth';
import { OTPTypes } from '../../Types/OTP';

import {
	forgotPasswordSchema,
	logInSchema,
	signUpSchema,
} from '../../Schemas/Auth';

import {
	loginQuery,
	registerQuery,
	forgotPasswordQuery,
} from '../../Services/Auth';

import { useAppDispatch } from '../../Hooks/Store';

import queryErrorHandler from '../../Helpers/QueryErrorHandler';
import AvatarDrop from '../../Components/ImageDrop';
import ImageDrop from '../../Components/ImageDrop';
import { IMAGE_TYPES } from '../../Types/Assets';

const RegisterContainer = ({ onChange }: { onChange: () => void }) => {
	const [isAgreed, setIsAgreed] = useState(false);
	const { isOpen, onOpen, onClose } = useDisclosure();

	const { refetch } = useQuery(
		['REGISTER'],
		() => {
			return registerQuery({
				email: getValues('email'),
				password: getValues('password'),
				name: getValues('name'),
				avatar: getValues('avatar'),
			});
		},
		{
			refetchOnWindowFocus: false,
			onSuccess: () => {
				onOpen();
			},
			enabled: false,
			onError: (error: any) => queryErrorHandler(error, setError),
		}
	);

	const {
		register,
		handleSubmit,
		setError,
		getValues,
		setValue,
		reset,
		formState: { errors, isSubmitting },
	} = useForm<RegisterFormValues>({
		resolver: yupResolver(signUpSchema),
	});

	const onSubmit = async () => {
		await refetch();
	};

	return (
		<>
			<OTPModal
				isOpen={isOpen}
				type={OTPTypes.REGISTRATION}
				email={getValues('email')}
				onClose={(value) => {
					onClose();
					if (!value) return;
					onChange();
					reset();
				}}
			/>
			<AuthContainer
				title="welcome, let's get started"
				changeTo="already have an account? login"
				submitText="register"
				onSubmit={handleSubmit(onSubmit)}
				onChange={onChange}
				isLoading={isSubmitting}
				isCentered
				buttonIcon={<MdPersonOutline />}
				canSubmit={isAgreed}
			>
				<ImageDrop
					type={IMAGE_TYPES.AVATAR}
					onUpload={(url) => {
						setValue('avatar', url);
					}}
				/>
				<Flex gap={4} w="100%" flexDir={'column'}>
					<input type="hidden" {...register('avatar')} />
					<InputBox
						type="name"
						label="name"
						error={errors.name?.message}
						size={'lg'}
						placeholder="dogukan duran"
						icon={MdPersonOutline}
						inputIcon={MdPersonOutline}
						{...register('name')}
					/>
					<InputBox
						type="email"
						label="email"
						error={errors.email?.message}
						size={'lg'}
						placeholder="dogukanduran@protonmail.com"
						isRequired
						icon={MdMailOutline}
						inputIcon={MdMailOutline}
						{...register('email')}
					/>
					<InputBox
						type="password"
						label="password"
						error={errors.password?.message}
						helpText="password must be at least 6 characters long"
						size={'lg'}
						placeholder="&bull; &bull; &bull; &bull; &bull; &bull; &bull; &bull; &bull; &bull;"
						icon={MdLockOutline}
						inputIcon={MdLockOutline}
						isRequired
						showPassword
						{...register('password')}
					/>
					<InputBox
						type="password"
						label="re-enter password"
						error={errors.passwordConfirmation?.message}
						size={'lg'}
						placeholder="&bull; &bull; &bull; &bull; &bull; &bull; &bull; &bull; &bull; &bull;"
						icon={MdLockOutline}
						inputIcon={MdLockOutline}
						isRequired
						{...register('passwordConfirmation')}
					/>
					<Checkbox
						isChecked={isAgreed}
						onChange={() => setIsAgreed(!isAgreed)}
						colorScheme={'purple'}
						color={'blackAlpha.800'}
						borderColor={'black'}
					>
						i agree to the{' '}
						<Link
							color={'blackAlpha.900'}
							as={RouterLink}
							to={'/about-us'}
							fontWeight={'bold'}
							isExternal
						>
							terms and conditions
						</Link>
					</Checkbox>
				</Flex>
			</AuthContainer>
		</>
	);
};

const LoginContainer = ({
	onChange,
	onForgotPassword,
}: {
	onChange: () => void;
	onForgotPassword: () => void;
}) => {
	const dispatch = useAppDispatch();

	const { refetch } = useQuery(
		['LOGIN'],
		() =>
			loginQuery({
				email: getValues('email'),
				password: getValues('password'),
			}),
		{
			refetchOnWindowFocus: false,
			enabled: false,
			onSuccess: (data) => {
				dispatch(
					login({
						user: {
							...data.data,
						},
						isLoggedIn: true,
					})
				);
				reset();
			},
			onError: (error) => queryErrorHandler(error, setError),
		}
	);

	const {
		handleSubmit,
		register,
		getValues,
		setError,
		reset,
		formState: { errors, isSubmitting },
	} = useForm<LoginFormValues>({
		resolver: yupResolver(logInSchema),
	});

	const onSubmit = async () => {
		await refetch();
	};

	return (
		<AuthContainer
			title="welcome back, let's log you in"
			changeTo="don't have an account? sign up"
			submitText="sign in"
			onSubmit={handleSubmit(onSubmit)}
			onChange={onChange}
			isLoading={isSubmitting}
			onForgotPassword={onForgotPassword}
			isCentered
			buttonIcon={<MdPersonOutline />}
		>
			<Flex gap={4} w="100%" flexDir={'column'}>
				<InputBox
					type="email"
					label="email"
					error={errors.email?.message}
					size={'lg'}
					placeholder="dogukanduran@protonmail.com"
					isRequired
					icon={MdMailOutline}
					inputIcon={MdMailOutline}
					{...register('email')}
				/>
				<InputBox
					type="password"
					label="password"
					error={errors.password?.message}
					size={'lg'}
					placeholder="&bull; &bull; &bull; &bull; &bull; &bull; &bull; &bull; &bull; &bull;"
					icon={MdLockOutline}
					inputIcon={MdLockOutline}
					isRequired
					showPassword
					{...register('password')}
				/>
			</Flex>
		</AuthContainer>
	);
};

const ForgotPasswordContainer = ({ onChange }: { onChange: () => void }) => {
	const { isOpen, onOpen, onClose } = useDisclosure();

	const { refetch } = useQuery(
		['FORGOT_PASSWORD'],
		() =>
			forgotPasswordQuery({
				email: getValues('email'),
			}),
		{
			refetchOnWindowFocus: false,
			enabled: false,
			onSuccess: () => {
				onOpen();
			},
			onError: (error) => queryErrorHandler(error, setError),
		}
	);

	const {
		handleSubmit,
		register,
		getValues,
		reset,
		setError,
		formState: { errors, isSubmitting },
	} = useForm<ForgotPasswordFormValues>({
		resolver: yupResolver(forgotPasswordSchema),
	});

	const onSubmit = async () => {
		await refetch();
	};

	return (
		<>
			<OTPModal
				isOpen={isOpen}
				type={OTPTypes.FORGOT_PASSWORD}
				email={getValues('email')}
				password={getValues('password')}
				onClose={(value) => {
					onClose();
					if (!value) return;
					onChange();
					reset();
				}}
			/>
			<AuthContainer
				title="oh no, forgot your password?"
				changeTo="let me try again"
				submitText="send reset otp"
				onSubmit={handleSubmit(onSubmit)}
				onChange={onChange}
				isLoading={isSubmitting}
				isCentered
				buttonIcon={<MdMailOutline />}
			>
				<Flex gap={4} w="100%" flexDir={'column'}>
					<InputBox
						type="email"
						label="email"
						error={errors.email?.message}
						size={'lg'}
						placeholder="dogukanduran@protonmail.com"
						isRequired
						icon={MdMailOutline}
						inputIcon={MdMailOutline}
						{...register('email')}
					/>
					<InputBox
						type="password"
						label="new password"
						error={errors.password?.message}
						helpText="password must be at least 6 characters long"
						size={'lg'}
						placeholder="&bull; &bull; &bull; &bull; &bull; &bull; &bull; &bull; &bull; &bull;"
						icon={MdLockOutline}
						inputIcon={MdLockOutline}
						isRequired
						showPassword
						{...register('password')}
					/>
					<InputBox
						type="password"
						label="re-enter password"
						error={errors.passwordConfirmation?.message}
						size={'lg'}
						placeholder="&bull; &bull; &bull; &bull; &bull; &bull; &bull; &bull; &bull; &bull;"
						icon={MdLockOutline}
						inputIcon={MdLockOutline}
						isRequired
						{...register('passwordConfirmation')}
					/>
				</Flex>
			</AuthContainer>
		</>
	);
};

const Auth = () => {
	const [currentContainer, setCurrentContainer] =
		React.useState<AuthContainerType>(AuthContainerType.SIGN_IN);

	const dispatch = useAppDispatch();

	useEffect(() => {
		let title = 'sign in';

		switch (currentContainer) {
			case AuthContainerType.SIGN_IN:
				title = 'sign in';
				break;
			case AuthContainerType.SIGN_UP:
				title = 'sign up';
				break;
			case AuthContainerType.FORGOT_PASSWORD:
				title = 'forgot password';
				break;
		}

		dispatch(setTitle(title));
	}, [dispatch, currentContainer]);

	return (
		<Box pos="relative" w="100%" h="100vh">
			<Collapse
				in={currentContainer === AuthContainerType.SIGN_UP}
				animateOpacity
			>
				<RegisterContainer
					onChange={() => setCurrentContainer(AuthContainerType.SIGN_IN)}
				/>
			</Collapse>

			<Collapse
				in={currentContainer === AuthContainerType.SIGN_IN}
				animateOpacity
			>
				<LoginContainer
					onChange={() => setCurrentContainer(AuthContainerType.SIGN_UP)}
					onForgotPassword={() =>
						setCurrentContainer(AuthContainerType.FORGOT_PASSWORD)
					}
				/>
			</Collapse>

			<Collapse
				in={currentContainer === AuthContainerType.FORGOT_PASSWORD}
				animateOpacity
			>
				<ForgotPasswordContainer
					onChange={() => setCurrentContainer(AuthContainerType.SIGN_IN)}
				/>
			</Collapse>
		</Box>
	);
};

export default Auth;
