import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import {
	Button,
	Flex,
	HStack,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalOverlay,
	PinInput,
	PinInputField,
	Text,
} from '@chakra-ui/react';

import { otpSchema } from '../../Schemas/OTP';

import { resendOTPQuery, verifyOTPQuery } from '../../Services/OTP';

import { OTPFormValues, OTPModalProps, OTPTitles } from '../../Types/OTP';

import queryErrorHandler from '../../Helpers/QueryErrorHandler';

const OTPModal = ({
	isOpen,
	onClose,
	type,
	email,
	password,
	canClose = true,
	...props
}: OTPModalProps) => {
	const {
		register,
		handleSubmit,
		setError,
		getValues,
		setValue,
		formState: { isSubmitting, isValid, errors },
	} = useForm<OTPFormValues>({
		resolver: yupResolver(otpSchema),
	});

	const { refetch: verifyOTP } = useQuery(
		['VERIFY_OTP'],
		() => {
			return verifyOTPQuery({
				email,
				otp: getValues('otp'),
				password,
				type,
			});
		},
		{
			refetchOnWindowFocus: false,
			enabled: false,
			onSuccess: (data) => {
				onClose(data);
			},
			onError: (error) => queryErrorHandler(error, setError),
		}
	);

	const {
		refetch: resendOTP,
		isLoading: isResendingOTP,
		fetchStatus,
	} = useQuery(
		['RESEND_OTP'],
		() => {
			return resendOTPQuery({
				email,
			});
		},
		{
			refetchOnWindowFocus: false,
			enabled: false,
			onError: (error) => queryErrorHandler(error, setError),
		}
	);

	const onSubmit = async () => {
		await verifyOTP();
	};

	return (
		<Modal
			isOpen={isOpen}
			onClose={() => {
				onClose(false);
			}}
			colorScheme="purple"
			{...props}
			isCentered
			size={['full', 'full', 'md', 'xl']}
		>
			<ModalOverlay />
			<ModalContent bgGradient={'linear(to-br, purple.500, purple.300)'}>
				<ModalHeader>{OTPTitles[type]}</ModalHeader>
				{canClose && <ModalCloseButton />}
				<form
					onSubmit={handleSubmit(onSubmit)}
					style={{ width: '100%' }}
					noValidate
				>
					<ModalBody>
						<Flex flexDirection="column" alignItems="center" gap={4}>
							<Text>
								you will receive an email to{' '}
								<Text as="span" fontWeight={'bold'}>
									{email}
								</Text>{' '}
								with the OTP, please enter it below
							</Text>
							<HStack>
								<PinInput
									otp
									focusBorderColor="purple.500"
									size="lg"
									variant="filled"
									onChange={(value) => {
										setValue('otp', value, {
											shouldValidate: true,
											shouldDirty: true,
										});
									}}
									isInvalid={!!errors?.otp?.message}
								>
									<PinInputField />
									<PinInputField />
									<PinInputField />
									<PinInputField />
									<PinInputField />
									<PinInputField />
								</PinInput>
								{/* fix for the pininput not working */}
								<input
									type="text"
									style={{ display: 'none' }}
									{...register('otp')}
								/>
							</HStack>
						</Flex>
					</ModalBody>

					<ModalFooter>
						{errors?.otp?.message && getValues('otp')?.length ? (
							<Text
								color="red.500"
								bg="red.50"
								borderRadius="md"
								px={2}
								mr={'auto'}
								fontSize="sm"
							>
								{errors?.otp?.message}
							</Text>
						) : (
							<Text fontSize="sm" mr={'auto'} fontWeight="bold">
								don't have an OTP?{' '}
								<Text
									as="span"
									color="purple.900"
									cursor="pointer"
									onClick={() => {
										resendOTP();
									}}
									_hover={{
										textDecoration: 'underline',
										color: 'purple.700',
									}}
									transition={'all 0.2s ease-in-out'}
								>
									resend OTP
								</Text>
							</Text>
						)}
						<Button
							variant="ghost"
							isDisabled={!isValid}
							isLoading={
								isSubmitting || (isResendingOTP && fetchStatus === 'fetching')
							}
							type="submit"
						>
							yes, it's correct!
						</Button>
					</ModalFooter>
				</form>
			</ModalContent>
		</Modal>
	);
};

export default OTPModal;
