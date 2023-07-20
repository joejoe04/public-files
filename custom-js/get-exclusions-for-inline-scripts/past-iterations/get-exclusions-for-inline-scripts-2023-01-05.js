(async function() {
// Get the HTML source of current page as NodeList
fetch(window.location.href).then((response) => {
	return response.text();
}).then((html) => {
	const parser = new DOMParser();
	const doc = parser.parseFromString(html, 'text/html');
	const htmlScriptNodes = doc.querySelectorAll('script');
	let inlineExclusionsLL = '';
	let inlineExclusionsNoLL = '';
	let scriptCountLL = 0;
	let scriptCountNoLL = 0;
	let scriptContent;

	htmlScriptNodes.forEach((theScript) => {
		if (theScript.hasAttribute('src')) {
			return; // Only need inline Scripts
		}
		// Get the longest stretch of matching text from each script to be used as exclusions
		scriptContent = theScript.innerHTML;
		scriptContent = scriptContent.replace(/\n|\r|\t/g, '█');
		scriptContent = scriptContent
			.match(/[a-zA-Z{}()\.\s]+/g)
			.reduce((p, c) => p.length > c.length ? p : c).trim() + '\r\n';
		
		if (theScript.hasAttribute('type') && theScript.type === 'rocketlazyloadscript') {
			inlineExclusionsLL += scriptContent;
			scriptCountLL++;
		} else {
			inlineExclusionsNoLL += scriptContent;
			scriptCountNoLL++;
		}
	});

	// Escape needed characters so exclusions will work correctly
	inlineExclusionsLL = inlineExclusionsLL.replace(/([{}()\.])/g, "\\$1");
	inlineExclusionsNoLL = inlineExclusionsNoLL.replace(/([{}()\.])/g, "\\$1");

	const lazyLoadedColor = '#4da880';
	const notLazyLoadedColor = '#d16a62';

    console.log(`%cFormatted exclusions for Inline Scripts`, `font-size: 3.1em; font-weight: 900;`);
	console.log(`%cRocketlazyloaded Inline Script Exclusions (${scriptCountLL})`,
				`font-size: 2.2em; color: ${lazyLoadedColor}; font-weight: 900;`);
	console.log(`%c${inlineExclusionsLL}`,
			   `font-size: 1.3em; color: ${lazyLoadedColor}; font-weight: 900;`);
	console.log(`%cNOT Rocketlazyloaded Inline Script Exclusions (${scriptCountNoLL})`,
				`font-size: 2.2em; color: ${notLazyLoadedColor}; font-weight: 900;`);
	console.log(`%c${inlineExclusionsNoLL}`,
			   `font-size: 1.3em; color: ${notLazyLoadedColor}; font-weight: 900;`);

}).catch(function (err) {
	console.warn('The HTML from the source could not be fetched. Please refresh the page and try again.', err);
});
})();