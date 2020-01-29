const { ipcRenderer } = require('electron');

import {
	attributeNames as videoCropperAttributeNames,
	tagName as videoCropperTagName
} from '../../components/video/video-cropper.js';

import { eventNames as sourceSelectorEventNames } from '../../components/video/source-selector.js';

export { init };

document.fullConfig = {
	cutouts: {},
	outputs: {},
	sources: {}
}; // TMP, we should change how to access this data

function init(logger, document) {
	logger.log('cutout-manager init starting...', document);
	document.addEventListener('cutout-move', (event) => {
		const { source, x, y, width, height } = event.detail;

		ipcRenderer.send('cutout-move', { source, x, y, width, height });
	});

	ipcRenderer.on('new-config', (event, newFullConfig) => {
		// A new config is received from the backend.
		document.fullConfig = newFullConfig;

		logger.log('newFullConfig received', newFullConfig);

		document.dispatchEvent(new CustomEvent('new-config'));
	});

	document.addEventListener(sourceSelectorEventNames.SOURCE_SELECTED, ({ detail }) => {
		logger.log('SOURCE_SELECTED', detail);
		if (detail) {
			const { id } = detail;
			let cutoutId = findCutoutIdFromSourceId(id);

			if (!cutoutId) {
				logger.log(`No existing cutout found for source with id ${id}, creating new cutout`);
				const cutout = createCutoutFromSource(id, logger);
				if (cutout) {
					logger.log('Created cutout', cutout);
					cutoutId = `cutout_${id}`;
					ipcRenderer.send('update-cutout', cutoutId, cutout);
				} else {
					logger.error('No cutout created');
				}
			}

			if (cutoutId) {
				logger.log('Changing preview to cutout', cutoutId);
				const preview = document.querySelector(`${videoCropperTagName}.preview`);
				preview.setAttribute(videoCropperAttributeNames.SOURCE_ID, cutoutId);
			} else {
				logger.warn('Unable to find or create a cutout for source', id);
			}
		}
	});

	ipcRenderer.send('initialize');
	return 'cutout-manager init complete';
}

function createCutoutFromSource(sourceId, logger) {
	if (!document || !document.fullConfig || !document.fullConfig.sources) {
		logger.error('No sources in document.fullConfig', document);
	}
	const { sources } = document.fullConfig;
	if (!sources) {
		return undefined;
	}

	const source = sources[sourceId];
	if (!source) {
		logger.error('Cant create cutout for unknown source', sourceId);
		return undefined;
	}

	return {
		width: 720,
		height: 1280,
		outputRotation: 0,
		source: sourceId,
		x: 0,
		y: 0
	};
}

function findCutoutIdFromSourceId(sourceId, logger) {
	if (document.fullConfig) {
		const { cutouts } = document.fullConfig;
		return Object.keys(cutouts).find((cutoutId) => cutouts[cutoutId].source === sourceId);
	} else {
		logger.log('No cutout found for ', sourceId);
	}

	return undefined;
}

console.log('Cutout manager', document, window, console);
