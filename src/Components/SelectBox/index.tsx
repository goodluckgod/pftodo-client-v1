import React from 'react';
import {
	FormControl,
	FormErrorMessage,
	FormHelperText,
	FormLabel,
	Select,
} from '@chakra-ui/react';
import { SelectBoxProps } from '../../Types/Components';

const SelectBox = React.forwardRef(
	(
		{ label, error, helpText, children, ...props }: SelectBoxProps,
		ref: any
	) => {
		return (
			<FormControl w="auto" isInvalid={!!error}>
				{label && (
					<FormLabel
						fontSize="md"
						fontWeight="bold"
						pl={0.5}
						mb={0.5}
						display="flex"
						alignItems="center"
						gap={1}
					>
						{label && label}
					</FormLabel>
				)}

				<Select
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
				>
					{children}
				</Select>

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

export default SelectBox;
