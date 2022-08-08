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

async function makeBibliography(citekeys, {include = "biblatex"} = {}){
	// Get the full data for the Zotero items
	if(window.zoteroRoam?.data?.items && true){
		let zoteroItems = citekeys.map(citekey => window.zoteroRoam.data.items.find(item => item.key == citekey));
		let librariesToCall = [...new Set(zoteroItems.map(it => it.requestLabel))].map(lib => window.zoteroRoam.config.requests.find(req => req.name == lib));
		// Make requests to the Zotero API for the bibliography entries of the items'
		let apiCalls = [];
		librariesToCall.forEach(lib => {
			let libItemsToRequest = zoteroItems.filter(item => item.requestLabel == lib.name);
			let zoteroKeys = libItemsToRequest.map(item => item.data.key);
			let nbCalls = Math.ceil(zoteroKeys.length/50);
			for(let i = 0; i < nbCalls; i++){
				let keysList = zoteroKeys.slice(i*50, Math.min((i+1)*50, zoteroKeys.length)).join(",");
				apiCalls.push(fetch(
					`https://api.zotero.org/${lib.dataURI}?include=${include}&itemKey=${keysList}`,
					{
						method: "GET",
						headers: {
							"Zotero-API-Key": lib.apikey,
							"Zotero-API-Version": 3
						}
					}
				));
			}
		});
		let bibResults = await Promise.all(apiCalls);
		let bibEntries = await Promise.all(bibResults.map(data => data.json()));

		let flatBibliography = bibEntries.flat(1).map(entry => entry[`${include}`]).sort().join("");

		return flatBibliography;
	} else if(window.zoteroRoam?.getBibEntries){
		return await window.zoteroRoam.getBibEntries(citekeys);
	} else {
		return "";
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