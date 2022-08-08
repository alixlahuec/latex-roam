import { CustomClasses } from "../../constants";
import { findRoamPage } from "../../roam";

/* istanbul ignore next */
const findMenus = () =>{
	return Array.from(document.querySelectorAll(`[class="${CustomClasses.MENU_CLASS}"]`));
};

/* istanbul ignore next */
function addMenuDivs(){
	let newHeaders = Array.from(document.querySelectorAll("h1.rm-title-display"))
		.filter(page => !(page.parentElement.querySelector(`[class="${CustomClasses.MENU_CLASS}"]`)));

	for(const header of newHeaders){
		let title = header.querySelector("span") ? header.querySelector("span").innerText : header.innerText;
		let pageUID = findRoamPage(title);

		let menu = document.createElement("div");
		menu.classList.add(CustomClasses.MENU_CLASS);
		menu.setAttribute("data-title", title);
		if(pageUID) { menu.setAttribute("data-uid", pageUID); }

		header.insertAdjacentElement("afterend", menu);
	}
}

export {
	addMenuDivs,
	findMenus
};