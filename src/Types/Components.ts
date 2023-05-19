import { As, InputProps, SelectProps, TextareaProps } from '@chakra-ui/react';

export interface InputBoxProps extends InputProps {
	label?: string;
	error?: string;
	helpText?: string;
	icon?: As;
	inputIcon?: As;
	showPassword?: boolean;
}

export interface SelectBoxProps extends SelectProps {
	label?: string;
	error?: string;
	helpText?: string;
	inputIcon?: As;
	children: React.ReactNode;
}

export interface TextareaBoxProps extends TextareaProps {
	label?: string;
	error?: string;
	helpText?: string;
	icon?: As;
}

export interface HeaderProps {
	title: string;
	showHomeIcon?: boolean;
	showAddIcon?: boolean;
}
