import { formatText } from "./common";

async function figure(caption, url, extra, handlers){
	const { addFigure } = handlers;
	let cleanURL = url.replaceAll("%2F", "/");
	let fileInfo = Array.from(cleanURL.matchAll(/[^/]+?\.(png|jpg|jpeg)/g));
	// let fileName = fileInfo[0][0];
	let fileExt = fileInfo[0][1];

	let figIndex = await addFigure(url, fileExt);

	// Parse extra information : label, description
	// Note : the first bit of inline code will be used as the figure label, if there are others they will be ignored
	let labelRegex = /(`.+?`)/g;
	let labelMatch = Array.from(extra.matchAll(labelRegex))[0] || false;
	let labelEl = labelMatch ? `\\label{fig:${labelMatch[0].slice(1,-1)}}\n` : "";

	let desc = extra.replace(labelRegex, "").trim();
	let descEl = (desc.length > 0) ? `\\medskip\n${formatText(desc, handlers)}\n` : "";

	return `\\begin{figure}[p]\n\\includegraphics[width=\\textwidth]{figure-${figIndex}.${fileExt}}\n\\caption{${formatText(caption, handlers)}}\n${labelEl}\n${descEl}\\end{figure}`;
}

export default figure;