import puppeteer from 'puppeteer-core'
import path from 'node:path'
const dir = process.cwd()
const b = await puppeteer.launch({ executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless:'shell', args:['--no-sandbox','--force-color-profile=srgb'] })
const p = await b.newPage()
await p.setViewport({ width: 680, height: 1000, deviceScaleFactor: 1 })
await p.goto('file://'+path.join(dir,'email.html'), { waitUntil:'networkidle0' })
await p.screenshot({ path: path.join(dir,'_email-preview.png'), fullPage: true })
await b.close()
console.log('ok')
