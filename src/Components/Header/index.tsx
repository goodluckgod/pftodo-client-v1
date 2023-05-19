import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
	Avatar,
	Flex,
	Heading,
	IconButton,
	Menu,
	MenuButton,
	MenuItem,
	MenuList,
	useToast,
} from '@chakra-ui/react';

import { MdHome, MdAdd, MdPersonOutline, MdExitToApp } from 'react-icons/md';

import { HeaderProps } from '../../Types/Components';
import { User } from '../../Types/Auth';

import { useAppDispatch, useAppSelector } from '../../Hooks/Store';

import shortener from '../../Utils/Shortener';
import { logout } from '../../Store/Slicers/authSlicer';

const Header = ({
	title,
	showHomeIcon = true,
	showAddIcon = true,
}: HeaderProps) => {
	const toast = useToast();
	const dispatch = useAppDispatch();
	const user = useAppSelector((state) => state.auth.user);

	const isLoggedIn = useAppSelector((state) => state.auth.isLoggedIn);

	const navigate = useNavigate();

	return (
		<Flex p={[4, 6]} alignItems={'center'} gap={2}>
			{(showHomeIcon || showAddIcon) && (
				<IconButton
					aria-label="Home"
					icon={
						showHomeIcon ? <MdHome size={'1.5em'} /> : <MdAdd size={'1.5em'} />
					}
					rounded={'full'}
					size={'lg'}
					colorScheme={'purple'}
					bgGradient={'linear(to-r, purple.500, purple.300)'}
					color={'black'}
					_hover={{ transform: 'scale(1.05)' }}
					onClick={() => {
						if (showHomeIcon) {
							navigate('/');
						} else {
							navigate('/add');
						}
					}}
				/>
			)}
			<Heading fontSize={'4xl'} ml={2} fontWeight={'bold'}>
				{shortener(title, 12)}
			</Heading>

			{isLoggedIn && (
				<Menu colorScheme="purple">
					<MenuButton
						ml={'auto'}
						_hover={{ transform: 'scale(1.05)' }}
						transition={'all 0.2s ease-in-out'}
					>
						<Flex alignItems={'center'} gap={2}>
							<Heading
								fontSize={'2xl'}
								fontWeight={'normal'}
								mr={2}
								display={['none', 'none', 'block']}
							>
								{shortener(user.name, 18)}
							</Heading>
							<Avatar
								size={'md'}
								name={user.name}
								src={user.avatar}
								border={'3px solid'}
								color={'purple.600'}
								boxShadow={'lg'}
							/>
						</Flex>
					</MenuButton>
					<MenuList>
						<MenuItem
							icon={<MdPersonOutline />}
							onClick={() => navigate('/profile')}
							_hover={{
								bgGradient: 'linear(to-r, purple.500, purple.300)',
							}}
						>
							my profile
						</MenuItem>
						<MenuItem
							icon={<MdExitToApp />}
							onClick={() => {
								dispatch(logout());
								navigate('/');
								toast({
									title: 'logged out successfully',
									status: 'success',
									isClosable: true,
								});
							}}
							_hover={{
								bgGradient: 'linear(to-r, purple.500, purple.300)',
							}}
						>
							logout
						</MenuItem>
					</MenuList>
				</Menu>
			)}
		</Flex>
	);
};

export default Header;
