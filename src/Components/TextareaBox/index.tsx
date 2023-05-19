import React from 'react';
import {
	FormControl,
	FormErrorMessage,
	FormHelperText,
	FormLabel,
	Icon,
	Textarea,
} from '@chakra-ui/react';
import { TextareaBoxProps } from '../../Types/Components';

const TextareaBox = React.forwardRef(
	({ label, error, helpText, icon, ...props }: TextareaBoxProps, ref: any) => {
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

				<Textarea
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
				/>

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

export default TextareaBox;
