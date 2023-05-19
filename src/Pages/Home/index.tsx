import React, { useEffect } from 'react';
import { Flex, Grid } from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';

import { MdSearch } from 'react-icons/md';

import { getTodosQuery } from '../../Services/Todo';

import InputBox from '../../Components/InputBox';
import TodoCard from '../../Components/TodoCard';

import { setTitle } from '../../Store/Slicers/titleSlicer';
import { setLoading } from '../../Store/Slicers/loadingSlicer';
import { useAppDispatch } from '../../Hooks/Store';

const Home = () => {
	const dispatch = useAppDispatch();
	const [search, setSearch] = React.useState('');

	useEffect(() => {
		dispatch(setTitle('my todos'));
	}, [dispatch]);

	const {
		data: todos,
		isFetching,
		refetch,
	} = useQuery(['GET_TODOS'], () =>
		getTodosQuery({
			query: search,
		})
	);

	useEffect(() => {
		const dly = setTimeout(() => {
			refetch();
		}, 1500);

		return () => clearTimeout(dly);
	}, [search, refetch]);

	useEffect(() => {
		dispatch(setLoading(isFetching));
	}, [dispatch, isFetching]);

	return (
		<Flex px={[2, 4, 8]} py={2} gap={8} flexDir={'column'}>
			<Flex
				gap={4}
				justify={'flex-end'}
				flexDir={['column', 'column', 'row', 'row']}
			>
				<InputBox
					placeholder="search"
					inputIcon={MdSearch}
					w={['100%', '100%', 'auto', 'auto']}
					onChange={(e) => setSearch(e.target.value)}
					value={search}
				/>
			</Flex>
			<Grid
				templateColumns={[
					'repeat(1, 1fr)',
					'repeat(1, 1fr)',
					'repeat(1, 1fr)',
					'repeat(2, 1fr)',
				]}
				gap={12}
			>
				{todos?.data?.map((todo) => (
					<TodoCard todo={todo} />
				))}
			</Grid>
		</Flex>
	);
};

export default Home;
