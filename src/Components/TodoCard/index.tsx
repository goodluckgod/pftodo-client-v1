import React from 'react';
import {
	Badge,
	Card,
	CardBody,
	CardFooter,
	Flex,
	Heading,
	Image,
	Stack,
	Tag,
	Text,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

import {
	Todo,
	TodoPriorityColor,
	TodoStatusColor,
	TodoStatusNames,
} from '../../Types/Todo';

import placeholder from '../../Assets/placeholder.png';
import shortener from '../../Utils/Shortener';
import randomColor from '../../Utils/RandomColor';

const TodoCard = ({ todo }: { todo: Todo }) => {
	const navigate = useNavigate();

	return (
		<Card
			direction={['column', 'column', 'column', 'row']}
			overflow="hidden"
			variant="outline"
			bgGradient="linear(to-r, purple.500, purple.300)"
			width="100%"
			_hover={{ transform: 'scale(1.03)' }}
			transition="all 0.2s ease-in-out"
			onClick={() => navigate(`/todo/${todo.slug}`)}
			cursor="pointer"
			borderColor="purple.500"
			borderRadius={'xl'}
		>
			<Image
				objectFit="cover"
				width={['100%', '100%', '100%', '30%']}
				src={todo.thumbnail}
				alt="Caffe Latte"
				fallbackSrc={placeholder}
			/>

			<Stack width="100%">
				<CardBody>
					<Heading size="lg" fontWeight="bold">
						{shortener(todo.title, 30)}
					</Heading>

					<Text py="2" fontSize={'lg'}>
						{shortener(todo.description, 350)}
					</Text>
				</CardBody>

				<CardFooter alignItems="center" width="100%">
					<Flex alignItems="center" gap={2} width="100%">
						<Flex alignItems="center" gap={2} flexWrap={'wrap'}>
							{todo.tags.map((tag, index) => (
								<Tag
									key={index}
									size={'sm'}
									variant="solid"
									colorScheme={randomColor()}
								>
									{tag}
								</Tag>
							))}
						</Flex>
						<Flex
							alignItems="center"
							gap={2}
							ml={'auto'}
							flexWrap={'wrap'}
							justify={'flex-end'}
						>
							<Badge colorScheme={todo.file ? 'green' : 'red'} size={'xs'}>
								{todo.file ? 'Has File' : 'No File'}
							</Badge>
							<Badge colorScheme={TodoStatusColor[todo.status]} size={'xs'}>
								{TodoStatusNames[todo.status]}
							</Badge>
							<Badge colorScheme={TodoPriorityColor[todo.priority]} size={'xs'}>
								{todo.priority}
							</Badge>
							<Badge colorScheme={todo.isPublic ? 'green' : 'red'} size={'xs'}>
								{todo.isPublic ? 'Public' : 'Private'}
							</Badge>
						</Flex>
					</Flex>
				</CardFooter>
			</Stack>
		</Card>
	);
};

export default TodoCard;
