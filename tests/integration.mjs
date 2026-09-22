process.env.A11YLENS_TEST_HEADLESS='1';
import assert from 'node:assert/strict';
import http from 'node:http';
import {spawn} from 'node:child_process';
import {readFile,mkdir} from 'node:fs/promises';
import {chromium} from 'playwright';
import axe from 'axe-core';
import {createSession,confirmSession,closeSession,sessions} from '../src/scanner.js';
const port=4301,base=`http://127.0.0.1:${port}`;
const requests=[];
const site=http.createServer((req,res)=>{requests.push(req.url);res.setHeader('Content-Type','text/html');if(req.url==='/login')return res.end('<html lang="en"><title>Sign in</title><form><label>Password<input type="password"></label><button>Sign in</button></form></html>');if(req.url==='/missing'){res.writeHead(404);return res.end('Missing')};res.end(`<!doctype html><html lang="en"><head><title>Fixture</title></head><body><main><h1>Accessibility fixture</h1>${req.url==='/clean'?'<button>Accessible button</button>':`<img id="no-alt" src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"><button id="unnamed"></button><input id="unlabelled"><p style="color:#aaa;background:white">Low contrast words</p><a href="/clean">Clean page</a><a href="/logout">Sign out</a><details><summary>More options</summary><button id="revealed"></button></details><div id="host"></div><script>document.querySelector('#host').attachShadow({mode:'open'}).innerHTML='<button id="shadow"></button>'</script>`}</main></body></html>`)});
await new Promise(r=>site.listen(0,'127.0.0.1',r));const url=`http://127.0.0.1:${site.address().port}`;
const proc=spawn(process.execPath,['server.js'],{cwd:new URL('..',import.meta.url),env:{...process.env,PORT:String(port)},stdio:'pipe'});let browser;proc.stderr.on('data',d=>process.stderr.write(d));
async function api(path,data,method=data?'POST':'GET'){const r=await fetch(base+'/api/'+path,{method,headers:{'X-A11YLens':'1','Content-Type':'application/json'},...(data?{body:JSON.stringify(data)}:{})});const v=await r.json();if(!r.ok)throw Error(v.error);return v}
async function job(input){const {id}=await api('jobs',input);for(let i=0;i<300;i++){const j=await api('jobs/'+id);if(j.status==='complete')return j.result;if(j.status==='error')throw Error(j.error);await new Promise(r=>setTimeout(r,200));}throw Error('Timeout')}
try{
 for(let i=0;i<50;i++){try{await api('health');break}catch{await new Promise(r=>setTimeout(r,100))}}
 assert.equal((await fetch(base+'/api/jobs',{method:'POST'})).status,403);
 const discovery=await job({kind:'discover',url});assert.equal(discovery.pages.length,2);assert.ok(!requests.includes('/logout'));
 const result=await job({kind:'scan',url,pages:[url+'/'],scope:'Current page'});
 assert.equal(result.engine.name,'axe-core');assert.equal(result.pageResults.length,2);
 for(const viewport of ['Desktop','Mobile'])for(const rule of ['image-alt','button-name','label','color-contrast'])assert.ok(result.assets.some(a=>a.viewport===viewport&&a.rule===rule&&a.outcome==='violations'),`${viewport} ${rule}`);
 assert.ok(result.assets.some(a=>a.selector.includes('shadow')&&a.outcome==='violations'));
 assert.ok(result.assets.some(a=>a.selector.includes('revealed')&&a.state==='More options'));
 assert.ok(result.assets.some(a=>a.status==='pass'));assert.ok(result.assets.some(a=>a.states.length>1));
 const failed=await job({kind:'scan',url,pages:[url+'/missing']});assert.equal(failed.assets.length,0);assert.ok(failed.pageResults.every(p=>p.status==='unverified'));
 const auth=await createSession(url+'/login');try{await assert.rejects(()=>confirmSession(auth.id),/sign.in|sign in/i);await sessions.get(auth.id).page.goto(url+'/clean');await confirmSession(auth.id);assert.equal(sessions.get(auth.id).confirmed,true);}finally{await closeSession(auth.id);}
 console.log('Scanner: actual failures, desktop/mobile, shadow DOM, disclosure states, deduplication, passes, and HTTP failure coverage verified.');
 browser=await chromium.launch();const page=await browser.newPage({viewport:{width:1440,height:1000}});const errors=[];page.on('pageerror',e=>errors.push(e.message));await page.goto(base);
 await page.getByRole('button',{name:'New audit',exact:true}).first().click();await page.locator('#site-url').fill(url+'/clean');await page.locator('#next').click();await page.getByRole('radio',{name:'Current page'}).check();await page.locator('#next').click();await page.locator('#next').click();await page.waitForFunction(()=>!document.querySelector('dialog').open,null,{timeout:60000});assert.match(await page.locator('.site-info').innerText(),/Current page/);
 await page.evaluate(a=>localStorage.setItem('a11ylens-audits-v1',JSON.stringify([a])),result);await page.reload();await page.getByRole('button',{name:'Audit overview',exact:true}).click();
 for(const width of [1440,390]){await page.setViewportSize({width,height:1000});assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);await page.evaluate(axe.source);const check=await page.evaluate(()=>axe.run());assert.deepEqual(check.violations.map(v=>({id:v.id,targets:v.nodes.map(n=>n.target)})),[]);}
 await page.setViewportSize({width:1440,height:1000});await mkdir(new URL('../test-output/',import.meta.url),{recursive:true});await page.screenshot({path:new URL('../test-output/dashboard.png',import.meta.url).pathname,fullPage:true});
 await page.locator('[data-detail]').first().click();assert.ok(await page.getByText('Recorded markup',{exact:true}).count());await page.getByRole('button',{name:'Close dialog'}).click();await page.getByRole('tab',{name:'All checks'}).click();await page.locator('#type-filter').selectOption('image-alt');assert.ok(await page.locator('tbody tr').count());await page.locator('#viewport-filter').selectOption('Mobile');assert.equal(await page.locator('tbody tr').count(),1);
 await page.getByRole('button',{name:'Export report'}).click();for(const ext of ['html','json','csv','pdf']){const pending=page.waitForEvent('download');await page.locator(`[data-export=${ext}]`).click();await (await pending).saveAs(new URL(`../test-output/report.${ext}`,import.meta.url).pathname);}
 assert.equal((await readFile(new URL('../test-output/report.pdf',import.meta.url))).subarray(0,4).toString(),'%PDF');
 const report=await browser.newPage();report.on('pageerror',e=>errors.push(e.message));await report.goto(new URL('../test-output/report.html',import.meta.url).href);const all=await report.locator('tbody tr:visible').count();await report.locator('#issue-type').selectOption('image-alt');assert.equal(await report.locator('tbody tr:visible').count(),2);await report.locator('#viewport').selectOption('Mobile');assert.equal(await report.locator('tbody tr:visible').count(),1);await report.locator('#reset').click();assert.equal(await report.locator('tbody tr:visible').count(),all);await report.evaluate(axe.source);const reportCheck=await report.evaluate(()=>axe.run());assert.deepEqual(reportCheck.violations.map(v=>({id:v.id,targets:v.nodes.map(n=>n.target)})),[]);assert.deepEqual(errors,[]);
 const running=await api('jobs',{kind:'scan',url,pages:[url+'/']});await api('jobs/'+running.id,null,'DELETE');assert.equal((await api('jobs/'+running.id)).status,'cancelled');
 console.log('UI: live setup-to-report scan, filters, evidence, responsive reflow, axe checks, HTML/JSON/CSV/PDF exports, standalone report and cancellation verified.');
}finally{await browser?.close();proc.kill('SIGTERM');site.closeAllConnections();await new Promise(r=>site.close(r));}
