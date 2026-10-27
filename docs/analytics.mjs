export const money=n=>n==null?'Not established':new Intl.NumberFormat('en-US',{style:'currency',currency:'USD'}).format(n);
export const round=n=>Math.round((n+Number.EPSILON)*100)/100;
export function statistics(offers){
 const prices=offers.map(o=>o.current_listed_price).filter(Number.isFinite).sort((a,b)=>a-b),n=prices.length;
 return {count:n,min:n?prices[0]:null,max:n?prices[n-1]:null,mean:n?round(prices.reduce((a,b)=>a+b,0)/n):null,median:n?(n%2?prices[(n-1)/2]:(prices[n/2-1]+prices[n/2])/2):null};
}
export function quantile(values,q){const v=[...values].sort((a,b)=>a-b);if(!v.length)return null;const p=(v.length-1)*q,l=Math.floor(p);return v[l]+(v[Math.ceil(p)]-v[l])*(p-l);}
export function position(price,offers){
 const s=statistics(offers);if(!s.count)return 'No comparable prices';
 const v=offers.map(o=>o.current_listed_price),q1=quantile(v,.25),q3=quantile(v,.75);
 return price<s.min?'Below the researched market':price>s.max?'Above the researched market':price<q1?'Budget-oriented':price>q3?'Premium-oriented':'Near the market middle';
}
export function comparePrice(price,offers){return offers.map(o=>({...o,difference:round(price-o.current_listed_price),relation:Math.abs(price-o.current_listed_price)<.005?'Same price':price>o.current_listed_price?'Competitor is cheaper':'Competitor is more expensive'}));}
export function filterCompetitors(data,{query='',type='All',tier='All',sort='ascending',selectedOnly=false,selected=[]}={}){
 const reps=data.pricing_offers.filter(o=>o.is_representative),prices=reps.map(o=>o.current_listed_price),q1=quantile(prices,.25),q3=quantile(prices,.75);
 return data.competitors.map(c=>{const rep=reps.find(o=>o.competitor_id===c.competitor_id);return {...c,rep,tier:rep.current_listed_price<q1?'Budget':rep.current_listed_price>q3?'Premium':'Mid-market',offers:data.pricing_offers.filter(o=>o.competitor_id===c.competitor_id)};})
 .filter(c=>(type==='All'||c.classification===type)&&(tier==='All'||c.tier===tier)&&(!selectedOnly||selected.includes(c.competitor_id))&&`${c.name} ${c.offers.map(o=>o.product_name).join(' ')}`.toLowerCase().includes(query.toLowerCase()))
 .sort((a,b)=>sort==='name'?a.name.localeCompare(b.name):(a.rep.current_listed_price-b.rep.current_listed_price)*(sort==='descending'?-1:1));
}
export function validateData(data){
 if(!Array.isArray(data.competitors)||!Array.isArray(data.pricing_offers)||!data.pricing_offers.length)throw Error('Research records are missing.');
 const ids=new Set(data.competitors.map(c=>c.competitor_id));
 if(ids.size!==data.competitors.length)throw Error('Duplicate competitor IDs.');
 const offers=new Set();
 for(const o of data.pricing_offers){
  if(offers.has(o.offer_id)||!ids.has(o.competitor_id))throw Error('Invalid offer relationships.');offers.add(o.offer_id);
  if(!Number.isFinite(o.current_listed_price)||o.current_listed_price<0)throw Error('Invalid numerical price.');
  if(o.currency!=='USD'||o.pricing_unit!=='per tee'||o.pricing_model!=='One-time purchase')throw Error('Price normalization is required for this dataset.');
  if(new URL(o.source_url).protocol!=='https:')throw Error('Source links must use HTTPS.');
 }
 for(const c of data.competitors){const r=data.pricing_offers.filter(o=>o.competitor_id===c.competitor_id&&o.is_representative);if(r.length!==1||r[0].offer_id!==c.representative_offer_id)throw Error('Representative relationship is invalid.');}
 const s=statistics(data.pricing_offers.filter(o=>o.is_representative)),saved=data.comparison.representative;
 if(s.min!==saved.minimum||s.max!==saved.maximum||s.mean!==saved.average||s.median!==saved.median)throw Error('Saved representative statistics conflict with source records.');
 return data;
}
