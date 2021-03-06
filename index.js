const puppeteer = require('puppeteer')

/*const html = `
<html>
<style>
body { font-family: 'Helvetica', sans-serif; box-sizing: border-box; }
table { border-collapse: collapse; }
div.caption { display: flex; wrap-text: break-word; padding: 0 0 10px 0; }
span { color: #009dde; font-size: 10px; }
i.fa-gas-pump { align-self: center; font-size: 35px; padding: 5px; color: #009dde; margin: 0 10px 0 0; }
i.fa-caret-up {  color: red; margin-left: 2px; }
i.fa-caret-down { color: green; margin-left: 2px; }
i.fa-equals { color: yellow; margin-left: 2px; }
th{ background-color: #ededed; padding: 4px 6px; text-align: left; vertical-align: middle; border: 1px solid #fff; font-size: 15px; }
td  {
  background-color: #009dde;
  color: #fff;
  padding: 0 10px 0 10px;
  text-align: left;
  border: 1px solid #fff;
  font-size: 15px;
  font-weight: bold;
}

h3 { color: #009dde; text-transform: uppercase; line-height: 1.2rem; font-size: 13px; margin-bottom: 4px;}
div.container { width: 25%; display: flex; flex-direction: column; align-items: center; }
</style>
<link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.1.1/css/all.css" integrity="sha384-O8whS3fhG2OnA5Kas0Y9l3cfpmYjapjI0E4theH4iuMD+pLhbf6JI0jIMfYcK3yZ" crossorigin="anonymous">
<body>
<div class="container">
<div class="caption">
  <i class="fas fa-gas-pump"></i>
  <div>
  <h3> Precios combustibles </h3>
  <span> Semana del 21 al 28 de Julio 2018 </span>
  </div>
</div>
<table>
  <tbody>
    <tr><th>Gasolina premium</th><td>RD$100 <i class="fas fa-caret-up"></i></td></tr>
    <tr><th>Gasolina Regular</th><td>RD$200 <i class="fas fa-caret-down"></i></td></tr>
    <tr><th>Gasolina </th><td>RD$300 <i class="fas fa-equals"></i></td></tr>
    <tr><th>Gasolina premium</th><td>RD$400 <i class="fas fa-caret-down"></td></tr>
  </tbody>
</table>
</div>
</body>
</html>
`*/
const generatePicture = async (browser, html, selector, padding = 0) => {
  // const browser = await puppeteer.launch();
  const page = await browser.newPage();
  page.setViewport({ width: 1000, height: 600, deviceScaleFactor: 2 }) // hit desktop breakpoint
  await page.goto(`data:text/html;charset=UTF-8,${html}`, { waitUntil: 'networkidle0' })
  const rect = await page.evaluate(selector => {
    const element = document.querySelector(selector)      
    const{ x, y, width, height } = element.getBoundingClientRect()
    return { left: x, top: y, width, height }
  }, selector)

  await page.screenshot({ 
      path: 'example.png', 
      ommitBackground: true,
      clip: {
       x: rect.left - padding,
       y: rect.top - padding,
       width: rect.width + padding * 2,
       height: rect.height + padding * 2
      } 
  })
 await page.close()
//  await browser.close()
}

const getHTML = (body, style) => {
 return `
<html>
<style>
body { font-family: 'Helvetica', sans-serif; box-sizing: border-box; }
table { border-collapse: collapse; }
div.caption { display: flex; wrap-text: break-word; padding: 0 0 10px 0; }
div.header { height: 40px; display: flex; flex-direction: column; justify-content: center; }
span { color: #009dde; font-size: 13px; }
i.fa-gas-pump { align-self: center; align-self: flex-start; font-size: 45px; padding: 5px; color: #009dde; margin: 0 10px 0 0; }
i.fa-caret-up {  color: red; margin-left: 2px; }
i.fa-caret-down { color: green; margin-left: 2px; }
i.fa-equals { color: yellow; margin-left: 2px; }
tr > td:first-child { background-color: #aaaaaa; padding: 4px 6px; text-align: left; vertical-align: middle; border: 1px solid #fff; font-size: 15px; }
td  {
  background-color: #009dde;
  color: #fff;
  padding: 0 10px 0 10px;
  text-align: left;
  border: 1px solid #fff;
  font-size: 15px;
  font-weight: bold;
}

h3 { color: #009dde; text-transform: uppercase; line-height: 1.2rem; font-size: 20px; margin-bottom: 4px;}
div.container { width: 36%; display: flex; flex-direction: column; align-items: center; justify-content: center; }
</style>
<link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.1.1/css/all.css" integrity="sha384-O8whS3fhG2OnA5Kas0Y9l3cfpmYjapjI0E4theH4iuMD+pLhbf6JI0jIMfYcK3yZ" crossorigin="anonymous">
<header>
</header>
<body>
${body}
</body>
`
}

const getTable = async () => {
  const browser = await puppeteer.launch()
  const page = await browser.newPage()
  await page.goto('https://micm.gob.do/precios-de-combustibles')
  const text = await page.evaluate(() => document.querySelector('table > tbody').outerHTML) 
  const html = `
   <div class="container">
<div class="caption">
  <i class="fas fa-gas-pump"></i>
  <div class="header">
  <h3> Precios combustibles </h3>
  <span> Semana del 21 al 28 de Julio 2018 </span>
  </div>
</div>
   <table>${getHTML(text)}</table>
  </div>
  `
  await generatePicture(browser, html, 'div', 2)
  await page.close()
  await browser.close()
}
getTable()
// generatePicture('div', 0)
