import React, { useState } from 'react';

import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { ButtonBase, Button, TextField, Box, Snackbar, Alert } from '@mui/material';
import {
	Accordion,
	AccordionSummary,
	AccordionDetails,
	Typography,
	IconButton,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';

import SingleItem from '@/components/MenusManagement/SingleItem';
import type { CategoryData, ItemMenuProps, MenuModifierProps } from '@/lib/types';

export default function MenuModifier({ setMenuList, selectedMenu }: MenuModifierProps) {
	const [menuData, setMenuData] = useState(selectedMenu);
	const theme = useTheme();
	const [expanded, setExpanded] = useState<string | false>(false);

	const [isError, setIsError] = useState(false);
	const [errorMessage, setErrorMessage] = useState('');

	const handleAccordionChange =
		(panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
			setExpanded(isExpanded ? panel : false);
		};

	const handleAddCategory = (newCategory: CategoryData) => {
		const updatedCategories = [...menuData.categories, newCategory];
		setMenuData({ ...menuData, categories: updatedCategories });
	};

	const handleAddItem = (categoryId: number, newItem: ItemMenuProps) => {
		const updatedCategories = menuData.categories?.map((category) => {
			if (category.categoryId === categoryId) {
				return {
					...category,
					items: [...category.items, newItem],
				};
			}
			return category;
		});
		setMenuData({ ...menuData, categories: updatedCategories });
	};

	const handleDeleteCategory = (categoryId: number) => {
		const updatedCategories = menuData.categories?.filter(
			(category) => category.categoryId !== categoryId,
		);
		setMenuData({ ...menuData, categories: updatedCategories });
	};

	const handleDeleteItem = (categoryId: number, id: number) => {
		const updatedCategories = menuData.categories?.map((category) => {
			if (category.categoryId === categoryId) {
				return {
					...category,
					items: category.items.filter((item) => item.id !== id),
				};
			}
			return category;
		});
		setMenuData({ ...menuData, categories: updatedCategories });
	};

	const handleCategoryNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = event.target;
		const categoryId = parseInt(name);
		const updatedCategories = menuData.categories?.map((category) => {
			if (category.categoryId === categoryId) {
				return {
					...category,
					categoryName: value,
				};
			}
			return category;
		});
		setMenuData({ ...menuData, categories: updatedCategories });
	};

	const handleModifyItem = (categoryId: number, id: number, newItem: ItemMenuProps) => {
		const updatedCategories = menuData.categories?.map((category) => {
			if (category.categoryId === categoryId) {
				return {
					...category,
					items: category.items.map((item) => (item.id === id ? newItem : item)),
				};
			}
			return category;
		});
		setMenuData({ ...menuData, categories: updatedCategories });
	};

	const handleFieldChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = event.target;
		setMenuData({ ...menuData, [name]: value });
	};

	const handleSave = () => {
		if (!menuData.menuName) {
			setErrorMessage('菜單名稱不能為空');
			setIsError(true);
			return;
		}

		const categories = menuData.categories;
		categories.forEach((category) => {
			if (category.categoryName === '') {
				setErrorMessage('類別名稱不能為空');
				setIsError(true);
			}
			category.items.forEach((item) => {
				if (item.itemName === '') {
					setErrorMessage(`${category.categoryName} 類別中，品項名稱不能為空`);
					setIsError(true);
				}
			});
		});
		// Posting to Backend
	};

	const createNewCategory = () => {
		const newCategory: CategoryData = {
			categoryId: Math.floor(Math.random() * 100000000),
			categoryName: '',
			items: [],
		};
		handleAddCategory(newCategory);
	};

	const createNewItem = (categoryId: number) => {
		const newItem: ItemMenuProps = {
			id: Math.floor(Math.random() * 100000000),
			itemName: '請輸入品項名稱',
			itemDescription: '',
			itemPrice: 0,
			itemCalories: 0,
			itemTags: [],
		};
		handleAddItem(categoryId, newItem);
	};

	const menuTypes = ['預購', '非預購'];
	const menuTimes = ['午間', '晚間', '全日'];

	return (
		<Box>
			<Box className="flex justify-start">
				<Box className="flex flex-row" sx={{ mr: 5, ml: 5, mt: 1.5 }}>
					<TextField
						id="menu-name"
						name="menuName"
						label="菜單名稱"
						type="text"
						variant="standard"
						value={menuData.menuName || ''}
						onChange={handleFieldChange}
					/>
				</Box>

				<Box sx={{ mr: 5 }}>
					<Box
						component="span"
						sx={{ fontSize: 'small', color: theme.palette.text.secondary }}
					>
						菜單類別
					</Box>
					<Box sx={{ display: 'flex', gap: 1 }}>
						{menuTypes.map((type) => (
							<Button
								key={type}
								variant="contained"
								onClick={() => setMenuData({ ...menuData, menuType: type })}
								sx={{
									borderRadius: 5,
									borderColor:
										menuData.menuType === type
											? `${theme.palette.primary.main} !important`
											: '#C4C4C4 !important',
									bgcolor:
										menuData.menuType === type
											? `${theme.palette.primary.main} !important`
											: '#C4C4C4 !important',
									color: 'black',
								}}
							>
								{type}
							</Button>
						))}
					</Box>
				</Box>

				<Box>
					<Box
						component="span"
						sx={{ fontSize: 'small', color: theme.palette.text.secondary }}
					>
						菜單時段
					</Box>

					<Box sx={{ display: 'flex', gap: 1 }}>
						{menuTimes.map((time) => (
							<Button
								key={time}
								variant="contained"
								onClick={() => setMenuData({ ...menuData, menuTime: time })}
								sx={{
									borderRadius: 5,
									borderColor:
										menuData.menuTime === time
											? `${theme.palette.primary.main} !important`
											: '#C4C4C4 !important',
									bgcolor:
										menuData.menuTime === time
											? `${theme.palette.primary.main} !important`
											: '#C4C4C4 !important',
									color: 'black',
								}}
							>
								{time}
							</Button>
						))}
					</Box>
				</Box>
			</Box>

			<Box className="mt-10 flex flex-col items-center">
				{menuData.categories?.map((category) => (
					<Accordion
						expanded={expanded === `panel${category.categoryId}`}
						onChange={handleAccordionChange(`panel${category.categoryId}`)}
						key={category.categoryId}
						sx={{ marginBottom: '10px', width: '90%' }}
					>
						<AccordionSummary
							expandIcon={<ExpandMoreIcon />}
							aria-controls={`panel${category.categoryId}-content`}
							id={`panel${category.categoryId}-header`}
						>
							<Box
								sx={{
									display: 'flex',
									justifyContent: 'space-between',
									width: '100%',
									alignItems: 'center',
								}}
							>
								<TextField
									id="category-name"
									name={category.categoryId.toString()}
									label="類別名稱"
									type="text"
									variant="standard"
									value={category.categoryName || ''}
									onChange={handleCategoryNameChange}
									required
								/>

								<Box sx={{ display: 'flex', alignItems: 'center' }}>
									<Typography
										sx={{ color: 'text.secondary', marginRight: '16px' }}
									>
										{category.items.length} items
									</Typography>
									<IconButton
										edge="end"
										aria-label="delete"
										onClick={() => handleDeleteCategory(category.categoryId)}
									>
										<DeleteIcon />
									</IconButton>
								</Box>
							</Box>
						</AccordionSummary>
						<AccordionDetails>
							{category.items.map((item) => (
								<Accordion key={item.id}>
									<AccordionSummary expandIcon={<ExpandMoreIcon />}>
										<Box
											sx={{
												display: 'flex',
												justifyContent: 'space-between',
												width: '100%',
												alignItems: 'center',
											}}
										>
											<Typography sx={{ flexShrink: 0 }}>
												{item.itemName}
											</Typography>
											<IconButton
												edge="end"
												aria-label="delete"
												onClick={() =>
													handleDeleteItem(category.categoryId, item.id)
												}
											>
												<DeleteIcon />
											</IconButton>
										</Box>
									</AccordionSummary>
									<AccordionDetails>
										<SingleItem
											item={item}
											setItem={(newItem) =>
												handleModifyItem(
													category.categoryId,
													item.id,
													newItem,
												)
											}
										/>
									</AccordionDetails>
								</Accordion>
							))}
							<Box className="mb-[10px] flex w-full border shadow">
								<ButtonBase
									className="w-full"
									onClick={() => createNewItem(category.categoryId)}
								>
									<Box className="my-2 flex w-full justify-center">
										<Typography className="text-slate-500">新增品項</Typography>
										<AddIcon color="disabled" />
									</Box>
								</ButtonBase>
							</Box>
						</AccordionDetails>
					</Accordion>
				))}
				<Box className="mb-[10px] flex w-[90%] border shadow">
					<ButtonBase className="w-full" onClick={() => createNewCategory()}>
						<Box className="my-2 flex w-full justify-center">
							<Typography className="text-slate-500">新增類別</Typography>
							<AddIcon color="disabled" />
						</Box>
					</ButtonBase>
				</Box>
			</Box>

			<Box sx={{ position: 'fixed', bottom: 16, right: 16 }}>
				<Button
					color="primary"
					onClick={handleSave}
					variant="contained"
					sx={{
						borderColor: `${theme.palette.primary.main} !important`,
						bgcolor: `${theme.palette.primary.main} !important`,
						color: 'black',
						borderRadius: 5,
					}}
				>
					儲存
				</Button>
			</Box>
			<Snackbar open={isError} autoHideDuration={6000} onClose={() => setIsError(false)}>
				<Alert onClose={() => setIsError(false)} severity="error" sx={{ width: '100%' }}>
					{errorMessage}
				</Alert>
			</Snackbar>
		</Box>
	);
}