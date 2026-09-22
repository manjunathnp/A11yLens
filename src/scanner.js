import axe from 'axe-core';
import {inspectAuthentication} from './authentication.js';
import {randomUUID} from 'node:crypto';
import {acquire,release,navigate,scrollPage,cancelled,gap,unsafe,LIMITS,validURL} from './browser.js';
export {discover,validURL,createSession,confirmSession,closeSession,sessions,LIMITS} from './browser.js';
const tags=['wcag2a','wcag2aa','wcag21a','wcag21aa','wcag22aa','best-practice'];
const manualReview=[
 {name:'Keyboard journeys',detail:'Complete primary tasks with keyboard only. Check focus order, visible focus, traps, and focus restoration.'},
 {name:'Screen reader experience',detail:'Check reading order, names, live updates, errors, and changes of context with assistive technology.'},
 {name:'Zoom and reflow',detail:'Check 200% text resize, 400% zoom, text spacing, and both orientations. Viewport scans do not replace these tests.'},
 {name:'Meaning and media',detail:'Review alternative text quality, instructions, captions, transcripts, audio descriptions, and use of color.'},
 {name:'Complete processes',detail:'Review authentication, time limits, dragging alternatives, error recovery, and all steps of important tasks.'}
];
async function inspect(page,job,url,viewport,state,assets,seen,entry){
 // Evaluate frames independently so inaccessible frames remain explicit coverage gaps.
 for(const [index,frame] of page.frames().entries()){
  cancelled(job.signal);
  try{
   await frame.evaluate(axe.source);
   const result=await frame.evaluate(async tags=>{
    window.axe.configure({branding:{application:'A11YLens'}});
    return await window.axe.run(document,{runOnly:{type:'tag',values:tags},iframes:false,resultTypes:['violations','incomplete','passes','inapplicable']});
   },tags);
   entry.engine= result.testEngine.version;
   entry.inapplicableRules=Math.max(entry.inapplicableRules||0,result.inapplicable.length);
   for(const outcome of ['violations','incomplete','passes'])for(const rule of result[outcome])for(const node of rule.nodes){
    const status=outcome==='passes'?'pass':outcome==='incomplete'?'review':(node.impact||rule.impact||'moderate');
    const selector=JSON.stringify(node.target);
    const key=JSON.stringify([url,viewport,index,frame.url(),rule.id,selector,outcome,node.html,node.failureSummary]);
    if(seen.has(key)){const prior=seen.get(key);if(!prior.states.includes(state))prior.states.push(state);continue;}
    const checks=[...node.any,...node.all,...node.none].map(c=>({id:c.id,impact:c.impact,message:c.message,data:c.data,relatedNodes:c.relatedNodes}));
    const criteria=rule.tags.filter(t=>/^wcag\d{3,4}$/.test(t)).map(t=>`${t[4]}.${t[5]}.${t.slice(6)}`);
    const row={id:randomUUID(),page:url,frame:frame.url(),frameIndex:index,viewport,state,states:[state],selector,html:node.html,name:rule.help,rule:rule.id,type:rule.tags.includes('best-practice')?'Best practice':'WCAG '+(criteria.join(', ')||'A / AA'),criteria,tags:rule.tags,helpUrl:rule.helpUrl,outcome,status,impact:node.impact||rule.impact,checks,issues:outcome==='passes'?[]:[{code:rule.id,severity:status,message:rule.help,fix:node.failureSummary||checks.map(c=>c.message).join('\n')||'Review this element manually using the rule reference.'}]};
    seen.set(key,row);assets.push(row);entry.observations++;
   }
  }catch(e){cancelled(job.signal);entry.status='partial';gap(job,url,'Frame accessibility checks incomplete',`${viewport} · ${frame.url()} · ${e.message.split('\n')[0]}`);}
 }
 entry.states++;
}
export async function scan(input,job){
 const start=Date.now(),assets=[],pageResults=[],seen=new Map();let session;
 try{
  session=await acquire(input,job);
  const urls=[...new Set(input.pages.map(validURL))];
  for(const [pi,url] of urls.entries())for(const [vi,viewport] of [{name:'Desktop',width:1366,height:900},{name:'Mobile',width:390,height:844}].entries()){
   cancelled(job.signal);job.progress={message:`Checking accessibility: ${new URL(url).pathname} · ${viewport.name}`,done:pi*2+vi,total:urls.length*2,observations:assets.length};
   const entry={url,viewport:viewport.name,status:'checked',observations:0,states:0};pageResults.push(entry);
   // Keep the authenticated tab: sessionStorage belongs to a tab, not its context.
   const page=session.page;
   try{
    await page.setViewportSize({width:viewport.width,height:viewport.height});
    await navigate(page,url,true);
    entry.resolvedUrl=page.url();
    if(new URL(page.url()).origin!==new URL(input.url).origin)throw Error('Redirected outside selected website.');
    const authentication=await inspectAuthentication(page);
    if(authentication.signInForm||authentication.challenge||authentication.denied)throw Error('Sign-in page detected. Protected content remains unverified.');
    await scrollPage(page,job,url);
    await inspect(page,job,url,viewport.name,'Initial page',assets,seen,entry);
    const candidates=page.locator('summary,button[aria-expanded="false"],[role="tab"][aria-selected="false"]');
    const count=await candidates.count();
    // Reload each viewport in the same tab; preserve storage while resetting disclosure state.
    const handles=await candidates.elementHandles();
    if(count>LIMITS.interactions)gap(job,url,'Interaction limit reached',`${count-LIMITS.interactions} controls not explored.`);
    for(const control of handles.slice(0,LIMITS.interactions)){
     cancelled(job.signal);
     const info=await control.evaluate(e=>({name:e.getAttribute('aria-label')||e.textContent||'Expanded content',form:!!e.closest('form'),href:e.closest('a')?.href})).catch(()=>null);
     if(!info||info.form||info.href||unsafe.test(info.name)||!await control.isVisible())continue;
     try{
      const beforeURL=page.url();
      await control.click({timeout:1500});await page.waitForTimeout(200);
      if(page.url()!==beforeURL){gap(job,url,'Interaction changed page',info.name.slice(0,100));break;}
      await scrollPage(page,job,url);
      await inspect(page,job,url,viewport.name,info.name.trim().slice(0,100),assets,seen,entry);
     }catch(e){cancelled(job.signal);gap(job,url,'Interaction could not be checked',info.name.slice(0,100));}
    }
   }catch(e){cancelled(job.signal);entry.status='unverified';gap(job,url,'Page inspection failed',viewport.name+' · '+e.message.split('\n')[0]);}
  }
  assets.sort((a,b)=>['critical','serious','moderate','minor','review','pass'].indexOf(a.status)-['critical','serious','moderate','minor','review','pass'].indexOf(b.status));
  return {id:randomUUID(),date:new Date().toISOString(),durationMs:Date.now()-start,url:input.url,access:input.sessionId?'private':'public',scope:input.scope||'Selected pages',pages:urls,assets,pageResults,unverified:job.gaps.length,sampleData:false,engine:{name:'axe-core',version:axe.version,tags},manualReview,coverage:{complete:false,uniqueRules:new Set(assets.map(a=>a.rule)).size,elementOccurrences:new Set(assets.map(a=>JSON.stringify([a.page,a.frameIndex,a.selector]))).size,gaps:job.gaps,limits:LIMITS,note:'Counts are rule–element observations per viewport, deduplicated across unchanged states. Automated checks do not establish WCAG conformance. Keyboard, screen reader, content meaning, and complete user journeys require manual testing.'}};
 }finally{await release(session,input);}
}
