const puppeteer = require('puppeteer')

const html = `
<html>
<style>
table { border-collapse: collapse; }
div.caption { display: flex; wrap-text: break-word; width: 236px; padding: 0 0 10px 0; }
span { color: #009dde }
i.fa-gas-pump { align-self: center; font-size: 40px; padding: 5px; color: #009dde; }
i.fa-caret-up {  color: red; margin-left: 2px; }
i.fa-caret-down { color: green; margin-left: 2px; }
i.fa-equals { color: yellow; margin-left: 2px; }
th{ background-color: #ededed; padding: 4px 6px; text-align: left; vertical-align: middle; border: 1px solid #fff; }
td  {
  background-color: #009dde;
  color: #fff;
  padding-right: 10px;
  padding: 0 10px 0 10px;
  text-align: left;
  border: 1px solid #fff;
}

h3 { color: #009dde; text-transform: uppercase; line-height: 1.2rem; font-size: 13px; margin-bottom: 4px;}
div.container { width: 244px; }
</style>
<link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.1.1/css/all.css" integrity="sha384-O8whS3fhG2OnA5Kas0Y9l3cfpmYjapjI0E4theH4iuMD+pLhbf6JI0jIMfYcK3yZ" crossorigin="anonymous">
<body>
<div class="container">
<div class="caption">
  <i class="fas fa-gas-pump"></i>
  <div>
  <h3> Precios combustibles </h3>
  <span> 22/07/2018 - 23/07/1018 </span>
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
`
const generatePicture = async (selector, padding = 0) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(`data:text/html,${html}`, { waitUntil: 'networkidle0' })
  const rect = await page.evaluate(selector => {
    const element = document.querySelector(selector)      
    const{ x, y, width, height } = element.getBoundingClientRect()
    return { left: x, top: y, width, height }
  }, selector)

  await page.screenshot({ 
      path: 'example.png', 
      clip: {
       x: rect.left - padding,
       y: rect.top - padding,
       width: rect.width + padding * 2,
       height: rect.height + padding * 2
      } 
  })
  await browser.close()
}


generatePicture('div', 5)
