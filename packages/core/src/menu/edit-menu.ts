import { MessageType } from '../message';
import * as uuid from 'uuid';
import * as Types from '../types';

const ids = {
	edit: uuid.v4(),
	undo: uuid.v4(),
	redo: uuid.v4(),
	cut: uuid.v4(),
	copy: uuid.v4(),
	paste: uuid.v4(),
	pasteInside: uuid.v4(),
	duplicate: uuid.v4(),
	selectAll: uuid.v4(),
	delete: uuid.v4()
};

export const editMenu = (ctx: Types.MenuContext): Types.MenuItem => {
	const isElectron = ctx.app && ctx.app.isHostType(Types.HostType.Electron);
	const hasBrowserClipboard =
		typeof navigator !== 'undefined' && typeof (navigator as any).clipboard !== 'undefined';
	const hasClipboard = isElectron || hasBrowserClipboard;
	const hasFocusedInput = typeof ctx.app !== 'undefined' && ctx.app.getHasFocusedInput();
	const hasSelectedElement =
		typeof ctx.project !== 'undefined' && typeof ctx.project.getSelectedElement() !== 'undefined';
	const selectedElementAccepts = hasSelectedElement
		? ctx.project!.getSelectedElement()!.acceptsChildren()
		: false;

	return {
		label: 'Edit',
		role: 'edit',
		id: ids.edit,
		submenu: [
			{
				id: ids.undo,
				label: '&Undo',
				accelerator: 'CmdOrCtrl+Z',
				enabled: typeof ctx.project !== 'undefined',
				click: app => {
					app.send({
						id: uuid.v4(),
						type: MessageType.Undo,
						payload: undefined
					});
				}
			},
			{
				id: ids.redo,
				label: '&Redo',
				accelerator: 'Shift+CmdOrCtrl+Z',
				enabled: typeof ctx.project !== 'undefined',
				click: app => {
					app.send({
						id: uuid.v4(),
						payload: undefined,
						type: MessageType.Redo
					});
				}
			},
			{
				id: uuid.v4(),
				type: 'separator'
			},
			{
				id: ids.cut,
				label: '&Cut',
				enabled: typeof ctx.project !== 'undefined' && hasClipboard,
				accelerator: 'CmdOrCtrl+X',
				click: app => {
					if (!ctx.project) {
						return;
					}

					const item = ctx.project.getFocusedItem();
					const itemType = ctx.project.getFocusedItemType();

					if (!item) {
						return;
					}

					app.send({
						id: uuid.v4(),
						payload: {
							item: item.toJSON(),
							itemType,
							projectId: ctx.project.getId()
						},
						type: MessageType.Cut
					});
				}
			},
			{
				id: ids.copy,
				label: 'C&opy',
				enabled: typeof ctx.project !== 'undefined' && hasClipboard,
				accelerator: 'CmdOrCtrl+C',
				click: app => {
					if (!ctx.project) {
						return;
					}

					const item = ctx.project.getFocusedItem();
					const itemType = ctx.project.getFocusedItemType();

					if (!item) {
						return;
					}

					app.send({
						id: uuid.v4(),
						payload: {
							itemId: item.getId(),
							itemType,
							projectId: ctx.project.getId()
						},
						type: MessageType.Copy
					});
				}
			},
			{
				id: ids.paste,
				label: '&Paste',
				enabled: typeof ctx.project !== 'undefined' && hasClipboard,
				accelerator: 'CmdOrCtrl+V',
				click: app => {
					app.send({
						id: uuid.v4(),
						payload: undefined,
						type: MessageType.Paste
					});
				}
			},
			{
				id: ids.pasteInside,
				label: '&Paste Inside',
				enabled:
					!hasFocusedInput && hasClipboard && selectedElementAccepts && hasSelectedElement,
				accelerator: 'CmdOrCtrl+Shift+V',
				click: app => {
					const selectedElement = ctx.project && ctx.project.getSelectedElement();

					if (!selectedElement) {
						return;
					}

					app.send({
						id: uuid.v4(),
						payload: {
							targetType: Types.ElementTargetType.Inside,
							id: selectedElement.getId()
						},
						type: MessageType.Paste
					});
				}
			},
			{
				id: uuid.v4(),
				type: 'separator'
			},
			{
				id: ids.duplicate,
				label: '&Duplicate',
				// 				enabled:
				// 					typeof selectedElement !== 'undefined' ||
				// 					(typeof activePage !== 'undefined' && !app.getHasFocusedInput()),
				accelerator: 'CmdOrCtrl+D',
				click: app => {
					app.send({
						id: uuid.v4(),
						payload: undefined,
						type: MessageType.DuplicateSelected
					});
				}
			},
			{
				id: uuid.v4(),
				type: 'separator'
			},
			{
				id: ids.selectAll,
				label: '&Select All',
				accelerator: 'CmdOrCtrl+A',
				role: 'selectall'
			},
			{
				id: uuid.v4(),
				type: 'separator'
			},
			{
				id: ids.delete,
				label: '&Delete',
				enabled: typeof ctx.project !== 'undefined',
				accelerator: process.platform === 'darwin' ? 'Backspace' : 'Delete',
				click: app => {
					app.send({
						id: uuid.v4(),
						payload: undefined,
						type: MessageType.DeleteSelected
					});
				}
			}
		]
	};
};
