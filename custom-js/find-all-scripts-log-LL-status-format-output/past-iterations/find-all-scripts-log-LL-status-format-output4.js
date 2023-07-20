(function() {

  fetch(window.location.href).then((response) => {
	return response.text();
  })
  .then((html) => {
    var parser = new DOMParser();
    var doc = parser.parseFromString(html, 'text/html');
    return doc.querySelectorAll('script');
  })
  .then((srcScriptNodes) => {

    const allScriptNodes = document.querySelectorAll('script');
    console.dir(srcScriptNodes);
    console.dir(allScriptNodes);
  })
  .catch(function (err) {
	console.warn('Something went wrong.', err);
  });
})();