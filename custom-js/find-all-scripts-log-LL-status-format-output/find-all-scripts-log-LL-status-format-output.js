(async function() {
	const organizedScripts = {
		allScripts: {},
		htmlScripts: {},
		dynamicScripts: {}
	};
	const theOrigin = window.location.origin;
    const originRegex = new RegExp('^' + theOrigin, 'i');
	const siteNumber = 1; // Change to any negative integer to keep /cache/min/n/ in paths
	const siteNumberRegex = new RegExp('^/wp-content/cache/min/' + siteNumber, 'i');

	fetch(window.location.href).then((response) => {
		return response.text();
	}).then((html) => {
		const parser = new DOMParser();
		const doc = parser.parseFromString(html, 'text/html');
		const htmlScriptNodes = doc.querySelectorAll('script');
		let scriptPropName;
	
		const organizeScripts = (theScripts, scriptGroup) => {
			theScripts.forEach((theScript) => {
				if (theScript.hasAttribute('src') || theScript.dataset.rocketSrc) {
					scriptPropName = theScript.src ? theScript.src : theScript.dataset.rocketSrc;
					scriptPropName = scriptPropName.replace(originRegex, '') // Remove domain from self-hosted scripts
						.replace(siteNumberRegex, '') // Remove /wp-content/cache/min/n/ from minified scripts
			            .replace(/\?.*$/i, '')  // Remove query strings
			            .replace(/^(https?:\/\/)|(\/\/)/i, '')  // Remove protocol from external scripts
					// Account for duplicate scripts on same page
					if (typeof organizedScripts[scriptGroup][scriptPropName] === 'object') {
						organizedScripts[scriptGroup][scriptPropName].scriptCount += 1;
					} else {
						organizedScripts[scriptGroup][scriptPropName] = {};
						organizedScripts[scriptGroup][scriptPropName].scriptCount = 1;
					}
			        organizedScripts[scriptGroup][scriptPropName].hasSource = 'hassource';
			    } else {
	                scriptPropName = theScript.innerHTML;
	                if (typeof organizedScripts[scriptGroup][scriptPropName] === 'object') {
	                    organizedScripts[scriptGroup][scriptPropName].scriptCount += 1;
	                } else {
	    				organizedScripts[scriptGroup][scriptPropName] = {};
	                    organizedScripts[scriptGroup][scriptPropName].scriptCount = 1;
	                }
	                organizedScripts[scriptGroup][scriptPropName].hasSource = 'nosource';				
			    }
		
				if (theScript.hasAttribute('type') && theScript.type.match('rocketlazyloadscript')) {
			        organizedScripts[scriptGroup][scriptPropName].isLazyLoaded = 'lazyloaded';
			    } else {
				    organizedScripts[scriptGroup][scriptPropName].isLazyLoaded = 'notlazyloaded';
			    }
	
				// Find and organize scripts not in HTML source
				if ('allScripts' === scriptGroup && (! organizedScripts.htmlScripts.hasOwnProperty(scriptPropName))) {
					organizedScripts.dynamicScripts[scriptPropName] = organizedScripts[scriptGroup][scriptPropName];
	                organizedScripts.dynamicScripts[scriptPropName].isLazyLoaded = 'dynamic';
				}
			});
		};

		// Organize scripts in HTML source
		organizeScripts(htmlScriptNodes, 'htmlScripts');
	
		// Organize all scripts including those not in HTML source
		const allScriptNodes = document.querySelectorAll('script');
		organizeScripts(allScriptNodes, 'allScripts');
	
		const output = {
			hassource: {
	            lazyloaded: ['', 0],
	            notlazyloaded: ['', 0],
	            dynamic: ['', 0]
	        },
			nosource: {
	            lazyloaded: ['', 0],
	            notlazyloaded: ['', 0],
	            dynamic: ['', 0]
	        },
		};
	
		let scriptSeparator;
	    let scriptObj;
	
		// Prepare output for scripts in HTML Source
	    const sortedHtmlScriptKeys = Object.keys(organizedScripts.htmlScripts).sort();
	    sortedHtmlScriptKeys.forEach((sortedHtmlScriptKey) => {
	        scriptObj = organizedScripts.htmlScripts[sortedHtmlScriptKey];
	        scriptSeparator = (scriptObj.hasSource === 'hassource') ? '\r\n' : '\r\n\r\n\r\n\r\n\r\n';
	        for (let i = 0; i < organizedScripts.htmlScripts[sortedHtmlScriptKey].scriptCount; i++) {
	            output[scriptObj.hasSource][scriptObj.isLazyLoaded][0] += sortedHtmlScriptKey + scriptSeparator;
	            output[scriptObj.hasSource][scriptObj.isLazyLoaded][1] += 1;
	        }
	    });
	
		// Prepare output for scripts not in HTML Source
	    const sortedDynamicScriptKeys = Object.keys(organizedScripts.dynamicScripts).sort();
	    sortedDynamicScriptKeys.forEach((sortedDynamicScriptKey) => {
	        scriptObj = organizedScripts.dynamicScripts[sortedDynamicScriptKey];
	        scriptSeparator = (scriptObj.hasSource === 'hassource') ? '\r\n' : '\r\n\r\n\r\n\r\n\r\n';
	        for (let i = 0; i < organizedScripts.dynamicScripts[sortedDynamicScriptKey].scriptCount; i++) {
	            output[scriptObj.hasSource][scriptObj.isLazyLoaded][0] += sortedDynamicScriptKey + scriptSeparator;
	            output[scriptObj.hasSource][scriptObj.isLazyLoaded][1] += 1;
	        }
	    });
	
		const lazyLoadedColor = '#4da880';
		const notLazyLoadedColor = '#d16a62';
		const notInHtmlColor = '#888888';
	
	    console.log(`%cTotal Scripts (${allScriptNodes.length})`, `font-size: 3.1em; font-weight: 900;`);
		console.log(`%cRocketlazyloaded Inline Scripts (${output.nosource.lazyloaded[1]})`,
					`font-size: 2.2em; color: ${lazyLoadedColor}; font-weight: 900;`);
		console.log(`%c${output.nosource.lazyloaded[0]}`,
				   `font-size: 1.3em; color: ${lazyLoadedColor}; font-weight: 900;`);
		console.log(`%cNOT Rocketlazyloaded Inline Scripts (${output.nosource.notlazyloaded[1]})`,
					`font-size: 2.2em; color: ${notLazyLoadedColor}; font-weight: 900;`);
		console.log(`%c${output.nosource.notlazyloaded[0]}`,
				   `font-size: 1.3em; color: ${notLazyLoadedColor}; font-weight: 900;`);
		console.log(`%cInline Scripts Not In HTML Source (${output.nosource.dynamic[1]})`,
					`font-size: 2.2em; color: ${notInHtmlColor}; font-weight: 900;`);
		console.log(`%c${output.nosource.dynamic[0]}`,
				   `font-size: 1.3em; color: ${notInHtmlColor}; font-weight: 900;`);
		console.log(`%cRocketlazyloaded Scripts (${output.hassource.lazyloaded[1]})`,
					`font-size: 2.2em; color: ${lazyLoadedColor}; font-weight: 900;`);
		console.log(`%c${output.hassource.lazyloaded[0]}`, 
					`font-size: 1.3em; color: ${lazyLoadedColor}; font-weight: 900;`);
		console.log(`%cNOT Rocketlazyloaded Scripts (${output.hassource.notlazyloaded[1]})`,
					`font-size: 2.2em; color: ${notLazyLoadedColor}; font-weight: 900;`);
		console.log(`%c${output.hassource.notlazyloaded[0]}`,
				   `font-size: 1.3em; color: ${notLazyLoadedColor}; font-weight: 900;`);
		console.log(`%cScripts Not In HTML source (${output.hassource.dynamic[1]})`,
					`font-size: 2.2em; color: ${notInHtmlColor}; font-weight: 900;`);
		console.log(`%c${output.hassource.dynamic[0]}`,
				   `font-size: 1.3em; color: ${notInHtmlColor}; font-weight: 900;`);
	
	}).catch(function (err) {
		console.warn('The HTML from the source could not be fetched. Please refresh the page and try again.', err);
	});
})();