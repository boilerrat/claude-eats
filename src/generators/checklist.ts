/**
 * HTML Grocery Checklist Generator
 *
 * Produces a self-contained HTML file with tappable checkboxes, plan tabs,
 * and a progress bar. No external dependencies — works offline on any device.
 */

import * as fs from 'fs';
import * as path from 'path';
import type { GeneratorConfig } from '../types';
import { scaleIngredients } from '../utils/scale';
import { buildGroceryList, CATEGORY_CONFIG, CATEGORY_ORDER } from '../utils/grocery';

export function generateChecklist(config: GeneratorConfig): void {
  const { targetServings, plans, outputDir } = config;
  const suffix = config.outputSuffix ?? `serves${targetServings}`;
  const outputPath = path.join(outputDir, `grocery_checklist_${suffix}.html`);

  // Build scaled grocery lists for each plan
  const planData = plans.map(plan => {
    const scaledRecipes = plan.recipes.map(recipe => ({
      ...recipe,
      ingredients: scaleIngredients(recipe.ingredients, recipe.baseServings, targetServings),
    }));
    const groceryList = buildGroceryList(scaledRecipes);
    return { plan, groceryList };
  });

  // Serialise grocery data for the HTML script block
  const plansJson = JSON.stringify(
    planData.map(({ plan, groceryList }) => ({
      id: plan.id,
      label: plan.label,
      color: plan.id === 'a' ? '#4A7FC1' : '#C8803A',
      activeTabClass: plan.id === 'a' ? 'active-a' : 'active-b',
      categories: CATEGORY_ORDER
        .filter(cat => groceryList[cat].length > 0)
        .map(cat => ({
          category: `${CATEGORY_CONFIG[cat].emoji} ${CATEGORY_CONFIG[cat].label}`,
          color: CATEGORY_CONFIG[cat].color,
          bg: CATEGORY_CONFIG[cat].bg,
          items: groceryList[cat].map(i => i.display),
        })),
    }))
  );

  const servingNote = targetServings > 4
    ? `Family of 4 + leftovers &middot; Scaled to ${targetServings} servings`
    : `Family of 4 &middot; Monday&ndash;Friday Dinners`;

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Weekly Grocery Checklist</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: #F8F6F1; font-family: Georgia, 'Times New Roman', serif; padding-bottom: 60px; }
  #header { background: #1A1A2E; padding: 22px 20px 0; position: sticky; top: 0; z-index: 100; box-shadow: 0 2px 12px rgba(0,0,0,0.2); }
  .header-inner { max-width: 560px; margin: 0 auto; }
  .header-top { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 14px; }
  .eyebrow { color: #C8A96E; font-size: 11px; letter-spacing: 3px; text-transform: uppercase; margin-bottom: 4px; }
  .title { color: #fff; font-size: 22px; font-weight: bold; }
  .subtitle { color: #8A8FAA; font-size: 13px; margin-top: 3px; font-style: italic; }
  #reset-btn { background: transparent; border: 1px solid #3A3A5C; color: #8A8FAA; border-radius: 6px; padding: 6px 14px; font-size: 12px; cursor: pointer; font-family: Georgia, serif; }
  #reset-btn:hover { border-color: #C8A96E; color: #C8A96E; }
  .tabs { display: flex; }
  .tab-btn { flex: 1; padding: 10px 8px; border: none; cursor: pointer; font-family: Georgia, serif; font-size: 13px; font-weight: bold; background: transparent; color: #8A8FAA; border-bottom: 3px solid transparent; transition: all 0.2s; }
  .tab-btn.active-a { color: #6BA3D6; border-bottom-color: #6BA3D6; }
  .tab-btn.active-b { color: #C8803A; border-bottom-color: #C8803A; }
  .progress-wrap { background: #111827; padding: 10px 20px 12px; }
  .progress-inner { max-width: 560px; margin: 0 auto; }
  .progress-labels { display: flex; justify-content: space-between; margin-bottom: 6px; }
  .progress-labels span { color: #8A8FAA; font-size: 12px; }
  .progress-track { background: #2C2C4A; border-radius: 4px; height: 5px; overflow: hidden; }
  #progress-bar { height: 100%; background: #4A7FC1; border-radius: 4px; width: 0%; transition: width 0.3s ease; }
  .list { max-width: 560px; margin: 20px auto 0; padding: 0 16px; display: none; }
  .list.active { display: block; }
  .cat-block { background: #fff; border-radius: 12px; margin-bottom: 14px; overflow: hidden; box-shadow: 0 1px 4px rgba(0,0,0,0.07); border: 1px solid #EBEBEB; transition: border-color 0.3s; }
  .cat-header { width: 100%; background: #FAFAFA; border: none; border-bottom: 1px solid #EFEFEF; padding: 14px 18px; display: flex; justify-content: space-between; align-items: center; cursor: pointer; transition: background 0.3s; }
  .cat-header-left { display: flex; align-items: center; gap: 10px; }
  .cat-name { font-size: 15px; font-family: Georgia, serif; font-weight: bold; color: #222; transition: color 0.3s; }
  .cat-badge { background: #EBEBEB; color: #888; border-radius: 20px; padding: 1px 9px; font-size: 11px; transition: all 0.3s; }
  .cat-chevron { color: #AAAAAA; font-size: 13px; }
  .cat-items { display: block; }
  .cat-items.collapsed { display: none; }
  .item-btn { display: flex; align-items: center; gap: 14px; width: 100%; background: #fff; border: none; border-bottom: 1px solid #F3F3F3; padding: 12px 18px; cursor: pointer; text-align: left; transition: background 0.15s; }
  .item-btn:last-child { border-bottom: none; }
  .item-btn:hover { background: #FAFAFA; }
  .checkbox { width: 22px; height: 22px; min-width: 22px; border-radius: 6px; border: 2px solid #D0D0D0; background: #fff; display: flex; align-items: center; justify-content: center; transition: all 0.15s; }
  .checkbox svg { display: none; }
  .item-label { font-size: 14px; font-family: Georgia, serif; color: #222; transition: all 0.15s; line-height: 1.4; }
  .item-btn.done .item-label { color: #AAAAAA; text-decoration: line-through; }
  .item-btn.done .checkbox svg { display: block; }
  .done-banner { text-align: center; padding: 24px 20px; background: #FFFFF8; border-radius: 12px; border: 1px solid rgba(200,169,110,0.25); margin-top: 8px; display: none; }
  .done-banner .cart-icon { font-size: 28px; margin-bottom: 8px; }
  .done-banner .done-title { color: #C8A96E; font-family: Georgia, serif; font-size: 16px; font-weight: bold; }
  .done-banner .done-sub { color: #AAAAAA; font-family: Georgia, serif; font-size: 13px; margin-top: 4px; font-style: italic; }
  @media print { #header { position: static; } #reset-btn, .progress-wrap, .tabs { display: none; } .list { display: block !important; } .cat-items.collapsed { display: block !important; } }
</style>
</head>
<body>
<div id="header">
  <div class="header-inner">
    <div class="header-top">
      <div>
        <div class="eyebrow">Weekly Shop</div>
        <div class="title">Grocery Checklist</div>
        <div class="subtitle">${servingNote}</div>
      </div>
      <button id="reset-btn" onclick="resetCurrent()">Reset</button>
    </div>
    <div class="tabs" id="tabs"></div>
  </div>
</div>
<div class="progress-wrap">
  <div class="progress-inner">
    <div class="progress-labels">
      <span id="progress-label">0 of 0 items</span>
      <span id="progress-pct">0%</span>
    </div>
    <div class="progress-track"><div id="progress-bar"></div></div>
  </div>
</div>
<div id="lists"></div>
<script>
const PLANS = ${plansJson};
let currentPlan = PLANS[0].id;
const state = {};
PLANS.forEach(p => { state[p.id] = {}; p.categories.forEach(c => c.items.forEach(i => { state[p.id][i] = false; })); });

function getTotal(id) { return PLANS.find(p=>p.id===id).categories.reduce((a,c)=>a+c.items.length,0); }
function getDone(id) { return Object.values(state[id]).filter(Boolean).length; }

function updateProgress() {
  const done = getDone(currentPlan), total = getTotal(currentPlan);
  const pct = total ? Math.round(done/total*100) : 0;
  document.getElementById('progress-label').textContent = done+' of '+total+' items';
  const el = document.getElementById('progress-pct');
  el.textContent = pct===100 ? '✓ All done!' : pct+'%';
  el.style.color = pct===100 ? '#C8A96E' : '#8A8FAA';
  el.style.fontWeight = pct===100 ? 'bold' : 'normal';
  const bar = document.getElementById('progress-bar');
  bar.style.width = pct+'%';
  bar.style.background = pct===100 ? '#C8A96E' : PLANS.find(p=>p.id===currentPlan).color;
  const banner = document.getElementById('done-banner-'+currentPlan);
  if(banner) banner.style.display = pct===100 ? 'block' : 'none';
}

function toggleItem(planId, item, btn, color, bg) {
  state[planId][item] = !state[planId][item];
  const checked = state[planId][item];
  btn.classList.toggle('done', checked);
  const box = btn.querySelector('.checkbox');
  box.style.background = checked ? color : '#fff';
  box.style.borderColor = checked ? color : '#D0D0D0';
  btn.style.background = checked ? bg : '#fff';
  updateBadge(btn.closest('.cat-block'), color, bg);
  updateProgress();
}

function updateBadge(block, color, bg) {
  const items = block.querySelectorAll('.item-btn');
  const done = [...items].filter(b=>b.classList.contains('done')).length;
  const total = items.length, allDone = done===total;
  const badge = block.querySelector('.cat-badge');
  badge.textContent = done+'/'+total;
  badge.style.background = allDone ? color : '#EBEBEB';
  badge.style.color = allDone ? '#fff' : '#888';
  block.querySelector('.cat-header').style.background = allDone ? bg : '#FAFAFA';
  block.querySelector('.cat-name').style.color = allDone ? color : '#222';
  block.style.borderColor = allDone ? color+'66' : '#EBEBEB';
}

function resetCurrent() {
  Object.keys(state[currentPlan]).forEach(k => state[currentPlan][k] = false);
  document.querySelectorAll('#list-'+currentPlan+' .item-btn').forEach(btn => {
    btn.classList.remove('done'); btn.style.background='#fff';
    const box=btn.querySelector('.checkbox'); box.style.background='#fff'; box.style.borderColor='#D0D0D0';
  });
  document.querySelectorAll('#list-'+currentPlan+' .cat-block').forEach(block => {
    const badge=block.querySelector('.cat-badge'), total=block.querySelectorAll('.item-btn').length;
    badge.textContent='0/'+total; badge.style.background='#EBEBEB'; badge.style.color='#888';
    block.querySelector('.cat-header').style.background='#FAFAFA';
    block.querySelector('.cat-name').style.color='#222'; block.style.borderColor='#EBEBEB';
  });
  updateProgress();
}

function switchTab(id) {
  currentPlan = id;
  PLANS.forEach(p => {
    document.getElementById('list-'+p.id).classList.toggle('active', p.id===id);
    document.getElementById('tab-'+p.id).className = 'tab-btn' + (p.id===id ? ' '+p.activeTabClass : '');
  });
  updateProgress();
}

function build() {
  const tabsEl = document.getElementById('tabs');
  const listsEl = document.getElementById('lists');
  PLANS.forEach((plan, pi) => {
    const tab = document.createElement('button');
    tab.id = 'tab-'+plan.id; tab.className = 'tab-btn'+(pi===0?' '+plan.activeTabClass:'');
    tab.textContent = plan.label; tab.onclick = () => switchTab(plan.id);
    tabsEl.appendChild(tab);
    const listEl = document.createElement('div');
    listEl.id = 'list-'+plan.id; listEl.className = 'list'+(pi===0?' active':'');
    listEl.style.cssText = 'max-width:560px;margin:20px auto 0;padding:0 16px;display:'+(pi===0?'block':'none');
    plan.categories.forEach(cat => {
      const block = document.createElement('div'); block.className='cat-block';
      const header = document.createElement('button'); header.className='cat-header';
      header.innerHTML='<div class="cat-header-left"><span class="cat-name">'+cat.category+'</span><span class="cat-badge">0/'+cat.items.length+'</span></div><span class="cat-chevron">▾</span>';
      header.onclick = () => { const el=block.querySelector('.cat-items'); const c=el.classList.toggle('collapsed'); header.querySelector('.cat-chevron').textContent=c?'▸':'▾'; header.style.borderBottom=c?'none':'1px solid #EFEFEF'; };
      const itemsEl = document.createElement('div'); itemsEl.className='cat-items';
      cat.items.forEach(item => {
        const btn = document.createElement('button'); btn.className='item-btn';
        btn.innerHTML='<div class="checkbox"><svg width="12" height="9" viewBox="0 0 12 9" fill="none"><path d="M1 4L4.5 7.5L11 1" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></div><span class="item-label">'+item+'</span>';
        btn.onclick = () => toggleItem(plan.id, item, btn, cat.color, cat.bg);
        itemsEl.appendChild(btn);
      });
      block.appendChild(header); block.appendChild(itemsEl); listEl.appendChild(block);
    });
    const banner = document.createElement('div'); banner.id='done-banner-'+plan.id; banner.className='done-banner';
    banner.innerHTML='<div class="cart-icon">🛒</div><div class="done-title">Cart complete!</div><div class="done-sub">Have a great week of cooking.</div>';
    listEl.appendChild(banner); listsEl.appendChild(listEl);
  });
  updateProgress();
}
build();
</script>
</body>
</html>`;

  fs.mkdirSync(outputDir, { recursive: true });
  fs.writeFileSync(outputPath, html, 'utf8');
  console.log(`  ✓ Checklist → ${outputPath}`);
}
