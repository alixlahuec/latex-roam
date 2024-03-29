/* eslint-disable no-useless-escape */

// From Jason Yu: https://dev.to/ycmjason/stringprototypereplace-asynchronously-28k9
async function asyncReplaceAll(str, regex, asyncReplaceFn){
	const substrs = [];
	let match;
	let i = 0;

	// The regex needs to be cloned, because global regexes are stateful
	// (.lastIndex will be kept in memory, which can cause an infinite loop
	// if we match against the same regex at a different step in the stack)
	const regexClone = new RegExp(regex, regex.flags);

	while ((match = regexClone.exec(str)) !== null) {
		// Push the non-matching string
		substrs.push(str.slice(i, match.index));
		// Call the async replacer function with the match information
		// The asyncFn receives (match, p1, p2, p3, ...)
		substrs.push(asyncReplaceFn(...match, match.index));
		i = regexClone.lastIndex;
	}
	// Push the rest of the string
	substrs.push(str.slice(i));
	// Wait for the asyncFn calls to finish, and join all the pieces back into one string
	return (await Promise.all(substrs)).join("");
}

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
		throw new Error("No instance of zoteroRoam was found : bibliography won't be generated.");
	} else {
		const instance = window.zoteroRoam;
		if(!instance.getBibEntries){
			throw new Error("The zoteroRoam instance does not expose bibliography data : no bibliography will be generated.");
		} else {
			return await instance.getBibEntries(citekeys);
		}
	}
}

/* istanbul ignore next */
/** Sets up the extension's theme (light vs dark)
 * @param {Boolean} use_dark - If the extension's theme should be `dark`
 */
function setDarkTheme(use_dark = false){
	document.getElementsByTagName("body")[0].setAttribute("rl-dark-theme", (use_dark == true).toString());
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
	asyncReplaceAll,
	cleanUpHref,
	hasNodeListChanged,
	makeBibliography,
	setDarkTheme,
	sortRoamBlocks,
	todayDMY
};