/* istanbul ignore file */
/** Adds an option to context menu for blocks
 * @param {String} label - The label for the menu option
 * @param {Function} onClick - The command to execute
 * @returns 
 */
function addBlockMenuCommand(label, onClick){
	return window.roamAlphaAPI.ui.blockContextMenu.addCommand({
		label,
		callback: (entity) => onClick(entity)
	});
}

/** Searches a Roam page by its title
 * @param {String} title - The title to be searched
 * @returns {String|false} The UID of the Roam page (if it exists), otherwise `false`
 */
function findRoamPage(title){
	const pageSearch = window.roamAlphaAPI.q(`[
		:find ?uid 
		:in $ ?title 
		:where
			[?p :node/title ?title]
			[?p :block/uid ?uid]
		]`, title);
	if(pageSearch.length > 0){
		return pageSearch[0][0];
	} else{
		return false;
	}
}

function getBlockText(uid){
	return window.roamAlphaAPI.q(`[
        :find ?str 
        :in $ ?uid 
        :where
            [?b :block/uid ?uid]
            [?b :block/string ?str]
    ]`, uid);
}

function queryBlockContents(uid){
	return window.roamAlphaAPI.q(`[
		:find 
			[(pull ?b 
				[ :block/string :block/children :block/order :block/heading :children/view-type :block/text-align {:block/children ...} ]) 
			...] 
		:in $ ?uid 
		:where
			[?b :block/uid ?uid]
	]`, uid)[0];
}

function queryPageContentsByTitle(title){
	return window.roamAlphaAPI.q(`[
		:find [
			(pull ?e [ :node/title :block/string :block/children :block/order :block/heading :children/view-type :block/text-align {:block/children ...} ]) 
			...] 
		:in $ ?ptitle 
		:where 
			[?e :node/title ?ptitle] 
	]`, title)[0];
}

/** Removes an option from context menu for blocks
 * @param {String} label - The label of the menu option
 * @returns 
 */
function removeBlockMenuCommand(label){
	return window.roamAlphaAPI.ui.blockContextMenu.removeCommand({ label });
}

export {
	addBlockMenuCommand,
	findRoamPage,
	getBlockText,
	queryBlockContents,
	queryPageContentsByTitle,
	removeBlockMenuCommand
};