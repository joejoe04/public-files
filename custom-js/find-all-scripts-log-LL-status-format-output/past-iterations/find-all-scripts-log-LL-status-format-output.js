(function() {
  const scriptNodes = document.querySelectorAll('script');
  const organizedScripts = {
    lazyLoaded: [], notLazyLoaded: []
  };
  const organizedInlineScripts = {
    lazyLoaded: [], notLazyLoaded: []
  };
  let lazyLoadedStatus = 'notLazyLoaded';
  let originRegex = new RegExp('^' + window.location.origin, 'i');
  
  scriptNodes.forEach(function(script) {
      
    if (script.hasAttribute('type') && script.type.match('rocketlazyloadscript')) {
      lazyLoadedStatus = 'lazyLoaded';
    } else {
      lazyLoadedStatus = 'notLazyLoaded';
    }
      
    if (script.hasAttribute('src')) {
      organizedScripts[lazyLoadedStatus].push(
        script.src
          .replace(originRegex, '') // Remove domain for self-hosted scripts
          .replace(/\?.*$/i, '')  // Remove query strings
          .replace(/^https?:\/\//i, '')  // Remove protocol from external scripts
          .replace(/^\/\//i, '')  // Remove relative protocol from external scripts
      );
      
    } else {
      organizedInlineScripts[lazyLoadedStatus].push(script.innerHTML + '\r\n');
    }
    
  });

  console.log(`%cTotal Script Count (${scriptNodes.length})`, "font-size: 3.5em; font-weight: 900");

  let scriptLog;
  const logSettings = [
    {scriptList: organizedInlineScripts.lazyLoaded, title: 'Rocketlazyloaded Inline Script Count', fColor: '#4da880'},
    {scriptList: organizedInlineScripts.notLazyLoaded, title: 'NOT Rocketlazyloaded Inline Script Count', fColor: '#d16a62'},
    {scriptList: organizedScripts.lazyLoaded, title: 'Rocketlazyloaded Script Count', fColor: '#4da880'},
    {scriptList: organizedScripts.notLazyLoaded, title: 'NOT Rocketlazyloaded Script Count', fColor: '#d16a62'}
  ];

  logSettings.forEach((logSetting) => {
    scriptLog = '';
    logSetting.scriptList.sort();
    logSetting.scriptList.forEach((script) => {
      scriptLog += script + '\r\n';
    });
    console.log(`%c${logSetting.title} (${logSetting.scriptList.length})`, `font-size: 2.2em; color: ${logSetting.fColor}; font-weight: 900;`);
    console.log(`%c${scriptLog}`, `font-size: 1.3em; color: ${logSetting.fColor};`);
  });    
})();





--------------------------------------------
UPDATED TO SEPARATE SCRIPTS NOT IN SOURCE CODE



(function() {

  // let scriptNodes;

  fetch('https://relabdevelopment.com/').then(function (response) {
	// The API call was successful!
	return response.text();
  }).then(function (html) {
	// Convert the HTML string into a document object
	var parser = new DOMParser();
	var doc = parser.parseFromString(html, 'text/html');
	// Get the script files
	return doc.querySelectorAll('script');
	// console.dir(img);
  }).then(function (scriptNodes) {
    // const scriptNodes = document.querySelectorAll('script');
  const organizedScripts = {
    lazyLoaded: [], notLazyLoaded: []
  };
  const organizedInlineScripts = {
    lazyLoaded: [], notLazyLoaded: []
  };
  let lazyLoadedStatus = 'notLazyLoaded';
  let originRegex = new RegExp('^' + window.location.origin, 'i');
  
  scriptNodes.forEach(function(script) {
      
    if (script.hasAttribute('type') && script.type.match('rocketlazyloadscript')) {
      lazyLoadedStatus = 'lazyLoaded';
    } else {
      lazyLoadedStatus = 'notLazyLoaded';
    }
      
    if (script.hasAttribute('src')) {
      organizedScripts[lazyLoadedStatus].push(
        script.src
          .replace(originRegex, '') // Remove domain for self-hosted scripts
          .replace(/\?.*$/i, '')  // Remove query strings
          .replace(/^https?:\/\//i, '')  // Remove protocol from external scripts
          .replace(/^\/\//i, '')  // Remove relative protocol from external scripts
      );
      
    } else {
      organizedInlineScripts[lazyLoadedStatus].push(script.innerHTML + '\r\n');
    }
    
  });

  console.log(`%cTotal Script Count (${scriptNodes.length})`, "font-size: 3.5em; font-weight: 900");

  let scriptLog;
  const logSettings = [
    {
      scriptList: organizedInlineScripts.lazyLoaded,
      title: 'Rocketlazyloaded Inline Script Count',
      fColor: '#4da880'
    },
    {
      scriptList: organizedInlineScripts.notLazyLoaded,
      title: 'NOT Rocketlazyloaded Inline Script Count',
      fColor: '#d16a62'
    },
    {
      scriptList: organizedScripts.lazyLoaded,
      title: 'Rocketlazyloaded Script Count',
      fColor: '#4da880'
    },
    {
      scriptList: organizedScripts.notLazyLoaded,
      title: 'NOT Rocketlazyloaded Script Count',
      fColor: '#d16a62'
    }
  ];

  logSettings.forEach((logSetting) => {
    scriptLog = '';
    logSetting.scriptList.sort();
    logSetting.scriptList.forEach((script) => {
      scriptLog += script + '\r\n';
    });
    console.log(`%c${logSetting.title} (${logSetting.scriptList.length})`, `font-size: 2.2em; color: ${logSetting.fColor}; font-weight: 900;`);
    console.log(`%c${scriptLog}`, `font-size: 1.3em; color: ${logSetting.fColor};`);
  });
  }).catch(function (err) {
	// There was an error
	console.warn('Something went wrong.', err);
  });
})();