import React from 'react';
import {
	As,
	Button,
	FormControl,
	FormErrorMessage,
	FormHelperText,
	FormLabel,
	Icon,
	Input,
	InputGroup,
	InputLeftElement,
	InputRightElement,
} from '@chakra-ui/react';
import { InputBoxProps } from '../../Types/Components';

const InputBox = React.forwardRef(
	(
		{
			label,
			error,
			helpText,
			icon,
			inputIcon,
			showPassword,

			...props
		}: InputBoxProps,
		ref: any
	) => {
		const [show, setShow] = React.useState(false);

		return (
			<FormControl w="auto" isInvalid={!!error}>
				{(label || icon) && (
					<FormLabel
						fontSize="md"
						fontWeight="bold"
						pl={0.5}
						mb={0.5}
						display="flex"
						alignItems="center"
						gap={1}
					>
						{icon && <Icon as={icon} />}
						{label && label}
					</FormLabel>
				)}
				<InputGroup
					display="flex"
					alignItems="center"
					borderRadius="md"
					overflow="hidden"
				>
					{inputIcon && (
						<InputLeftElement
							pointerEvents="none"
							top="auto !important"
							children={<Icon as={inputIcon} color="purple.600" />}
						/>
					)}

					<Input
						{...props}
						ref={ref}
						borderColor={error ? 'red.500' : 'purple.600'}
						backgroundColor={error ? 'red.50' : 'purple.50'}
						_focus={{
							borderColor: 'purple.600',
							backgroundColor: 'white',
						}}
						focusBorderColor="purple.600"
						_placeholder={{ color: 'gray.500' }}
						{...(props.type === 'password' && {
							type: show ? 'text' : 'password',
						})}
					/>
					{showPassword && props.type === 'password' && (
						<InputRightElement width="4.5rem" top="auto !important">
							<Button
								size="xs"
								onClick={() => setShow(!show)}
								colorScheme="purple"
							>
								{show ? 'Hide' : 'Show'}
							</Button>
						</InputRightElement>
					)}
				</InputGroup>

				{helpText && (
					<FormHelperText color="blackAlpha.700">{helpText}</FormHelperText>
				)}
				{error && (
					<FormErrorMessage
						color="red.500"
						bg="red.50"
						borderRadius="md"
						px={2}
					>
						{error}
					</FormErrorMessage>
				)}
			</FormControl>
		);
	}
);

export default InputBox;
