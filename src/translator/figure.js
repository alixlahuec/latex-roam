import { formatText } from "./common";

async function figure(caption, url, extra){
	const cleanURL = url.replaceAll("%2F", "/");
	const fileInfo = Array.from(cleanURL.matchAll(/[^/]+?\.(png|jpg|jpeg)/g));
	// let fileName = fileInfo[0][0];
	const fileExt = fileInfo[0][1];

	const figIndex = await window.latexRoam.addFigure(url, fileExt);

	// Parse extra information : label, description
	// Note : the first bit of inline code will be used as the figure label, if there are others they will be ignored
	const labelRegex = /(`.+?`)/g;
	const labelMatch = Array.from(extra.matchAll(labelRegex))[0] || false;
	const labelEl = labelMatch ? `\\label{fig:${labelMatch[0].slice(1,-1)}}\n` : "";

	const desc = extra.replace(labelRegex, "").trim();
	const descEl = (desc.length > 0) ? `\\medskip\n${await formatText(desc)}\n` : "";

	return `\\begin{figure}[p]\n\\includegraphics[width=\\textwidth]{figure-${figIndex}.${fileExt}}\n\\caption{${await formatText(caption.trim())}}\n${labelEl}\n${descEl}\\end{figure}`;
}

async function parseImage(_match, p1, p2, p3) {
	return await figure(p1, p2, p3);
}

export {
	parseImage
};