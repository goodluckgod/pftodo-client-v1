import React, { useEffect } from 'react';
import { Box, ChakraProvider, Fade, Spinner, useToast } from '@chakra-ui/react';
import {
	Routes,
	Route,
	useLocation,
	Navigate,
	useNavigate,
} from 'react-router-dom';
import {
	QueryClient,
	QueryClientProvider,
	QueryCache,
} from '@tanstack/react-query';

import Header from './Components/Header';

import Auth from './Pages/Auth';
import Home from './Pages/Home';
import NotFound from './Pages/NotFound';
import Profile from './Pages/Profile';
import AddEditViewTodo from './Pages/AddEditViewTodo';

import { useAppDispatch, useAppSelector } from './Hooks/Store';
import { logout } from './Store/Slicers/authSlicer';

import { APIMessageType, APIMessage } from './Types/API';

import theme from './Utils/Theme';

export const App = () => {
	const location = useLocation();
	const title = useAppSelector((state) => state.title.value);
	const isLoading = useAppSelector((state) => state.loading.value);
	const isLoggedIn = useAppSelector((state) => state.auth.isLoggedIn);
	const toast = useToast();
	const navigate = useNavigate();

	const dispatch = useAppDispatch();

	useEffect(() => {
		document.title = `${title} | pf's todo`;
	}, [title]);

	const checkForToasts = (
		messages: APIMessage[],
		isSuccessful: boolean = false
	) => {
		messages?.forEach((msg: APIMessage) => {
			if (msg.type === APIMessageType.TOAST) {
				toast({
					title: msg.msg,
					status: isSuccessful ? 'success' : 'error',
					variant: 'solid',
					duration: 5000,
					isClosable: true,
					position: 'bottom-right',
				});
			}
		});
	};

	const [queryClient] = React.useState(
		() =>
			new QueryClient({
				defaultOptions: {
					queries: {
						retry: 1,
						retryDelay: 1000,
						refetchOnWindowFocus: false,
					},
				},
				queryCache: new QueryCache({
					onError: (error: any) => {
						if (!error?.response) {
							toast({
								title: error?.message || 'an error occurred.',
								status: 'error',
								duration: 5000,
								isClosable: true,
								position: 'bottom-right',
							});
						}

						if (error?.response?.status === 401) {
							toast({
								title: 'you are not logged in, please login again.',
								status: 'error',
								duration: 5000,
								isClosable: true,
								position: 'bottom-right',
							});

							dispatch(logout());
							navigate('/');
						}

						const errors = error?.response?.data?.errors;

						checkForToasts(errors);
					},
					onSuccess: (data: any) => {
						const messages: APIMessage[] = data?.messages;
						checkForToasts(messages, true);

						const errors = data?.errors;
						checkForToasts(errors);
					},
				}),
			})
	);

	return (
		<QueryClientProvider client={queryClient}>
			<ChakraProvider
				theme={theme}
				toastOptions={{ defaultOptions: { position: 'bottom-right' } }}
			>
				{isLoading && (
					<Box
						bg="blackAlpha.800"
						display={'flex'}
						flexDirection={'column'}
						alignItems={'center'}
						justifyContent={'center'}
						height={'100vh'}
						width={'100vw'}
						position={'fixed'}
						zIndex={9999}
					>
						<Spinner color="white" size="xl" thickness="4px" />
					</Box>
				)}

				{(location.pathname !== '/' || isLoggedIn) &&
					location.pathname !== '/404' && (
						<Header
							title={title}
							showHomeIcon={isLoggedIn && location.pathname !== '/'}
							showAddIcon={isLoggedIn && location.pathname === '/'}
						/>
					)}
				<Routes>
					<Route path="/" element={isLoggedIn ? <Home /> : <Auth />} />
					<Route path="/404" element={<NotFound />} />
					<Route path="*" element={<Navigate to="/404" />} />
					{isLoggedIn && (
						<>
							<Route path="/add" element={<AddEditViewTodo />} />
							<Route path="/profile" element={<Profile />} />
							<Route path="/todo/:slug" element={<AddEditViewTodo />} />
						</>
					)}
				</Routes>
			</ChakraProvider>
		</QueryClientProvider>
	);
};
