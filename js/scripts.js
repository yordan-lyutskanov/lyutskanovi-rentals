let scriptUrls = ["js/menu-bar.js", "js/rotating-button.js"];

scriptUrls.map(url => {
    console.log(`Adding script: ${url} to the dom.`)
    let script = document.createElement('script')
    script.src = url
    return script
}).forEach(script => document.head.appendChild(script))