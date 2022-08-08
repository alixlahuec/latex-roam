/* eslint-disable no-useless-escape */

function cleanUpHref({ text, url }){
	let target = url;
	target = target.replaceAll(/\\\&/g, "&");
	target = target.replaceAll(/\\\%/g, "%");

	return `\\href{${target}}{${text}}`;
}

/** Checks if the contents of a NodeList have changed
 * From mauroc8 on SO: https://stackoverflow.com/questions/51958759/how-can-i-test-the-equality-of-two-nodelists
 * @param {NodeList} prev - The previous contents of the NodeList
 * @param {NodeList} current - The current contents of the NodeList
 * @returns {Boolean} `true` if the NodeList has changed ; `false` otherwise
 */
function hasNodeListChanged(prev, current){
	return (prev.length + current.length) != 0 && (prev.length !== current.length || prev.some((el, i) => el !== current[i]));
}

async function makeBibliography(citekeys){
	if(!window.zoteroRoam){
		throw new Error("No instance of zoteroRoam was found");
	} else {
		const instance = window.zoteroRoam;
		if(!instance.getBibEntries){
			throw new Error("The zoteroRoam instance does not expose bibliographic entries.");
		} else {
			return await instance.getBibEntries(citekeys);
		}
	}
}

function sortRoamBlocks(arr){
	return [...arr].sort((a,b) => a.order < b.order ? -1 : 1);
}

function todayDMY(){
	const today = new Date();
	const dd = String(today.getDate()).padStart(2, "0");
	const mm = String(today.getMonth() + 1).padStart(2, "0");
	const yyyy = today.getFullYear();

	return `${dd}/${mm}/${yyyy}`;
}

export {
	cleanUpHref,
	hasNodeListChanged,
	makeBibliography,
	sortRoamBlocks,
	todayDMY
};