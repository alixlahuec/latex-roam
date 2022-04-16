import React, { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import ExportButton from "./ExportButton";

import { findRoamPage } from "../roam";
import { hasNodeListChanged } from "../utils";

import { menuClass } from "../classes";

function addMenus(){
	let newHeaders = Array.from(document.querySelectorAll("h1.rm-title-display"))
		.filter(page => !(page.parentElement.querySelector(`.${menuClass}`)));
	for(const header of newHeaders){
		let title = header.querySelector("span") ? header.querySelector("span").innerText : header.innerText;
		let pageUID = findRoamPage(title);

		let menu = document.createElement("div");
		menu.classList.add(menuClass);
		menu.setAttribute("data-title", title);
		if(pageUID) { menu.setAttribute("data-uid", pageUID); }

		header.insertAdjacentElement("afterend", menu);
	}
}

const findMenus = () =>Array.from(document.querySelectorAll(`.${menuClass}`));

const GraphWatcher = React.memo(function GraphWatcher(){
	// From React Docs : https://reactjs.org/blog/2015/12/16/ismounted-antipattern.html
	// https://jasonwatmore.com/post/2021/08/27/react-how-to-check-if-a-component-is-mounted-or-unmounted
	const mounted = useRef(false);
	const [menus, setMenus] = useState([]);

	const updatePageElements = useCallback(() => {
		// Page headers
		setMenus((prevState) => {
			const currentMenus = findMenus();
			if(hasNodeListChanged(prevState, currentMenus)){
				return currentMenus;
			} else {
				return prevState;
			}
		});

	}, []);

	useEffect(() => {
		mounted.current = true;
		// The watcher adds empty <div>s to relevant page elements
		// The contents of the <div>s will be managed by rendering portals
		const watcher = setInterval(
			() => {
				addMenus();

				if(mounted.current){
					updatePageElements();
				}
			},
			1000
		);

		return () => {
			mounted.current = false;
			clearInterval(watcher);
			Array.from(document.querySelectorAll(`.${menuClass}`)).forEach(div => div.remove());
		};
	}, [updatePageElements]);

	return menus 
		? menus.map((div, index) => {
			let pageUID = div.getAttribute("data-uid");
			return pageUID
				? createPortal(<ExportButton key={index} uid={pageUID} />, div)
				: null;
		})
		: null;
});

export default GraphWatcher;
