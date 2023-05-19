import React from 'react';
import { Button, Flex, Heading, Link } from '@chakra-ui/react';

import { AuthContainerProps } from '../../Types/Auth';

const AuthContainer = ({
	children,
	title,
	changeTo,
	onChange,
	onSubmit,
	submitText,
	isLoading,
	onForgotPassword,
	isCentered,
	buttonIcon,
	canSubmit = true,
	...props
}: AuthContainerProps) => {
	return (
		<Flex
			p={8}
			bgGradient={'linear(to-br, purple.500, purple.300)'}
			rounded={'lg'}
			boxShadow={'lg'}
			flexDir={'column'}
			align={'center'}
			w="100%"
			maxW="400px"
			{...props}
			style={
				isCentered
					? {
							position: 'absolute',
							top: '50%',
							left: '50%',
							transform: 'translate(-50%, -50%)',
					  }
					: {}
			}
		>
			<Heading color={'gray.800'} fontSize={'3xl'} fontWeight={'bold'} mb={4}>
				{title}
			</Heading>

			<form onSubmit={onSubmit} style={{ width: '100%' }} noValidate>
				{children}

				<Button
					w={'full'}
					bg={'purple.500'}
					color={'white'}
					rounded={'md'}
					shadow={'md'}
					_hover={{
						bg: 'purple.600',
					}}
					mt={4}
					type="submit"
					isLoading={isLoading}
					{...(buttonIcon && {
						leftIcon: buttonIcon,
					})}
					isDisabled={!canSubmit}
				>
					{submitText}
				</Button>
			</form>

			<Link mt={4} onClick={onChange} color={'gray.800'} cursor={'pointer'}>
				{changeTo}
			</Link>

			{onForgotPassword && (
				<Link onClick={onForgotPassword} color={'gray.800'} cursor={'pointer'}>
					forgot password?
				</Link>
			)}
		</Flex>
	);
};

export default AuthContainer;
