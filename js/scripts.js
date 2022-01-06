let scriptUrls = ["js/menu-bar.js"];

scriptUrls.map(url => {
    console.log(`Adding script: ${url} to the dom.`)
    let script = document.createElement('script')
    script.src = scriptUrls
    return script
}).forEach(script => document.head.appendChild(script))