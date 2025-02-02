import {commandExists, execFile} from '../util.js';

export async function isAvailable() {
	return commandExists('gsettings');
}

async function isDarkTheme() {
	const {themeStyle} = await execFile('gsettings', [
		'get',
		'org.gnome.desktop.interface',
		'color-scheme',
	]);

	return themeStyle === 'prefer-dark';
}

export async function get() {
	const property = (await isDarkTheme()) ? 'picture-uri-dark' : 'picture-uri';

	const {stdout} = await execFile('gsettings', [
		'get',
		'org.gnome.desktop.background',
		property,
	]);

	return stdout.trim().slice(8, -1);
}

export async function set(imagePath) {
	await execFile('gsettings', [
		'set',
		'org.gnome.desktop.background',
		(await isDarkTheme()) ? 'picture-uri-dark' : 'picture-uri',
		`file://${imagePath}`,
	]);
}
