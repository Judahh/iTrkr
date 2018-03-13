declare let chrome: any;

chrome.app.runtime.onLaunched.addListener(() => {
  chrome.app.window.create('backApp/index.html', {
    id: 'main',
    bounds: {
      width: 620, 
      height: 500
    }
  });
});
