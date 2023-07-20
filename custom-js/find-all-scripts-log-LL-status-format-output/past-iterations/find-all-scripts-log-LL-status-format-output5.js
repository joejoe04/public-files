(function() {
	const organizedScripts = {
		allScripts: {},
		htmlScripts: {},
		dynamicScripts: {}
	};
	const theOrigin = window.location.origin;
    const originRegex = new RegExp('^' + theOrigin, 'i');

fetch(window.location.href).then((response) => {
	return response.text();
}).then((html) => {
	const parser = new DOMParser();
	const doc = parser.parseFromString(html, 'text/html');
	const htmlScriptNodes = doc.querySelectorAll('script');
	let scriptPropName;
	const preserveDuplicateScriptText = 'wpr-preserve-duplicate-scripts';

	const organizeScripts = (theScripts, scriptGroup) => {
		theScripts.forEach((theScript) => {
			if (theScript.hasAttribute('src')) {
				scriptPropName = theScript.src
		            .replace(originRegex, '') // Remove domain for self-hosted scripts
		            .replace(/\?.*$/i, '')  // Remove query strings
		            .replace(/^(https?:\/\/)|(\/\/)/i, '')  // Remove protocol from external scripts
				if (typeof organizedScripts[scriptGroup][scriptPropName] === 'object') {
					organizedScripts[scriptGroup][scriptPropName].scriptCount += 1;
					scriptPropName = organizedScripts[scriptGroup][scriptPropName].scriptCount
						+ preserveDuplicateScriptText + scriptPropName;
					organizedScripts[scriptGroup][scriptPropName] = {};
				} else {
					organizedScripts[scriptGroup][scriptPropName] = {};
					organizedScripts[scriptGroup][scriptPropName].scriptCount = 1;
				}
				
		        organizedScripts[scriptGroup][scriptPropName].hasSource = 'hassource';
				// if (scriptGroup === 'allScripts') { console.dir(theScript.src) };
		    } else {
				scriptPropName = theScript.outerHTML;
				organizedScripts[scriptGroup][scriptPropName] = {};
			    organizedScripts[scriptGroup][scriptPropName].hasSource = 'nosource';
				// if (scriptGroup === 'allScripts') { console.dir(theScript.outerHTML) };
		    }
	
			if (theScript.hasAttribute('type') && theScript.type.match('rocketlazyloadscript')) {
		        organizedScripts[scriptGroup][scriptPropName].isLazyLoaded = 'lazyloaded';
		    } else {
			    organizedScripts[scriptGroup][scriptPropName].isLazyLoaded = 'notlazyloaded';
		    }

			if ('allScripts' === scriptGroup && (! organizedScripts.htmlScripts.hasOwnProperty(scriptPropName))) {
				organizedScripts.dynamicScripts[scriptPropName] = organizedScripts[scriptGroup][scriptPropName];
			}
		});
	};

	organizeScripts(htmlScriptNodes, 'htmlScripts');

	const allScriptNodes = document.querySelectorAll('script');
	organizeScripts(allScriptNodes, 'allScripts');

	// console.dir(allScriptNodes);
	// allScriptNodes.forEach((sss) => {
	// 	if (sss.src) {console.dir(sss.src)};
	// });
	
	const output = {
		hassource: { lazyloaded: '', notlazyloaded: '', dynamic: '' },
		nosource: { lazyloaded: '', notlazyloaded: '', dynamic: ''},
	};

	let scriptSeparator = '';
	
	for (const htmlScript in organizedScripts.htmlScripts) {
		let scriptObj = organizedScripts.htmlScripts[htmlScript];
		scriptSeparator = (scriptObj.hasSource === 'hassource') ? '\r\n' : '\r\n\r\n________________\r\n\r\n';
		output[scriptObj.hasSource][scriptObj.isLazyLoaded] += htmlScript + scriptSeparator;
	}
	
	for (const dynamicScript in organizedScripts.dynamicScripts) {
		let scriptObj = organizedScripts.dynamicScripts[dynamicScript];
		scriptSeparator = (scriptObj.hasSource === 'hassource') ? '\r\n' : '\r\n\r\n________________\r\n\r\n';
		output[scriptObj.hasSource].dynamic += dynamicScript + scriptSeparator;
	}
	

	console.log(`%cRocketlazyloaded External Scripts (${Object.keys(organizedScripts.htmlScripts).length})`,
				`font-size: 2.2em; color: #4da880; font-weight: 900;`);
	
	console.log(`%c${output.hassource.lazyloaded}`, 
				`font-size: 1.3em; color: #4da880; font-weight: 900;`);
	
	console.log(`%cNOT Rocketlazyloaded External Scripts (${Object.keys(organizedScripts.htmlScripts).length})`,
				`font-size: 2.2em; color: #4da880; font-weight: 900;`);
	
	console.log(`%c${output.hassource.notlazyloaded}`,
			   `font-size: 1.3em; color: #4da880; font-weight: 900;`);
	
	console.log(`%cExternal Scripts Not In HTML source (${Object.keys(organizedScripts.htmlScripts).length})`,
				`font-size: 2.2em; color: #4da880; font-weight: 900;`);
	
	console.log(`%c${output.hassource.dynamic}`,
			   `font-size: 1.3em; color: #4da880; font-weight: 900;`);

	console.log(`%cRocketlazyloaded Inline Scripts (${Object.keys(organizedScripts.htmlScripts).length})`,
				`font-size: 2.2em; color: #4da880; font-weight: 900;`);

	console.log(`%c${output.nosource.lazyloaded}`,
			   `font-size: 1.3em; color: #4da880; font-weight: 900;`);

	console.log(`%cNOT Rocketlazyloaded Inline Scripts (${Object.keys(organizedScripts.htmlScripts).length})`,
				`font-size: 2.2em; color: #4da880; font-weight: 900;`);

	console.log(`%c${output.nosource.notlazyloaded}`,
			   `font-size: 1.3em; color: #4da880; font-weight: 900;`);
	
	console.log(`%cInline Scripts Not In HTML Source (${Object.keys(organizedScripts.htmlScripts).length})`,
				`font-size: 2.2em; color: #4da880; font-weight: 900;`);

	console.log(`%c${output.nosource.dynamic}`,
			   `font-size: 1.3em; color: #4da880; font-weight: 900;`);
	
// console.dir(organizedScripts);
	

}).catch(function (err) {
	console.warn('Something went wrong.', err);
});
})();