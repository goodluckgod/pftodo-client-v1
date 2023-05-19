import React from 'react';
import { Button, Flex, Heading } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

import { useAppDispatch } from '../../Hooks/Store';
import { setTitle } from '../../Store/Slicers/titleSlicer';

const NotFound = () => {
	const navigate = useNavigate();
	const dispatch = useAppDispatch();
	dispatch(setTitle('404'));

	return (
		<Flex flexDir="column" align="center" justify="center" h="100vh">
			<Heading size="4xl">404</Heading>
			<Heading>opps, we can't find anything here!</Heading>
			<Button colorScheme="purple" mt={4} onClick={() => navigate('/')}>
				Go Home
			</Button>
		</Flex>
	);
};

export default NotFound;
