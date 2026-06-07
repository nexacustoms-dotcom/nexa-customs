import fs from 'fs';
let c = fs.readFileSync('src/pages/AdminPage.jsx', 'utf8');
const start = c.indexOf('\nfunction FullProductEditor(');
const end = c.indexOf('\nfunction printOrderSheet(');
if (start === -1 || end === -1) { console.log('Markers not found', start, end); process.exit(1); }
const newFunc = `
function FullProductEditor({ prod, onSave, onCancel }) {
  const { pricing } = useApp();
  const [p, setP] = useState(JSON.parse(JSON.stringify(prod)));
  const [selectedOptKey, setSelectedOptKey] = useState(null);
  const upd = k => v => setP(prev => ({ ...prev, [k]: v }));
  function updTierPrice(ti, val) { const np=[...p.pricing]; np[ti]={...np[ti],p:parseFloat(val)||0}; upd('pricing')(np); }
  function updTierQty(ti, val) { const np=[...p.pricing]; np[ti]={...np[ti],q:parseInt(val)||0}; upd('pricing')(np); }
  function addTier() { upd('pricing')([...p.pricing, { q:0, p:0 }]); }
  function removeTier(ti) { upd('pricing')(p.pricing.filter((_,i)=>i!==ti)); }
  function addGroup() { upd('opts')([...(p.opts||[]), { key:'group-'+Date.now(), label:'New Group', opts:[{id:'opt1',l:'Option 1',price_type:'multiplier',price_val:1.0,m:1.0}] }]); }
  function removeGroup(gi) { upd('opts')((p.opts||[]).filter((_,i)=>i!==gi)); }
  function updGroup(gi, field, val) { const ng=[...(p.opts||[])]; ng[gi]={...ng[gi],[field]:val}; upd('opts')(ng); }
  function addOption(gi) { const ng=[...(p.opts||[])]; ng[gi]={...ng[gi],opts:[...ng[gi].opts,{id:'opt-'+Date.now(),l:'New Choice',price_type:'multiplier',price_val:1.0,m:1.0}]}; upd('opts')(ng); }
  function removeOption(gi,oi) { const ng=[...(p.opts||[])]; ng[gi]={...ng[gi],opts:ng[gi].opts.filter((_,i)=>i!==oi)}; upd('opts')(ng); }
  function updOption(gi,oi,field,val) { const ng=[...(p.opts||[])]; const no=[...ng[gi].opts]; no[oi]={...no[oi],[field]:val}; ng[gi]={...ng[gi],opts:no}; upd('opts')(ng); }
  function setSizePrices(optId,tierIdx,price) {
    const ng=[...(p.opts||[])]; const gi=ng.findIndex(g=>g.key==='size'); if(gi===-1)return;
    const no=[...ng[gi].opts]; const oi=no.findIndex(o=>o.id===optId); if(oi===-1)return;
    no[oi]={...no[oi],size_prices:{...(no[oi].size_prices||{}),[tierIdx]:parseFloat(price)||0}};
    ng[gi]={...ng[gi],opts:no}; upd('opts')(ng);
  }
  function getSizePrice(optId,tierIdx) {
    const g=(p.opts||[]).find(g=>g.key==='size'); const o=g?.opts?.find(o=>o.id===optId);
    return o?.size_prices?.[tierIdx] ?? '';
  }
  const isSqft = p.sqft?.enabled;
  const hasSizeGroup = (p.opts||[]).some(g=>g.key==='size');
  const sizeGroup = (p.opts||[]).find(g=>g.key==='size');
  const selectedSizeOpt = sizeGroup?.opts?.find(o=>o.id===selectedOptKey);
  const inp = { width:'100%', background:'var(--s2)', border:'1px solid var(--bd)', color:'var(--tx)', padding:'7px 10px', borderRadius:6, fontSize:12, outline:'none', fontFamily:"'DM Sans',sans-serif" };
  const sl = { ...inp, appearance:'none', backgroundRepeat:'no-repeat', backgroundPosition:'right 10px center', paddingRight:28 };
  return (
    <div>
      <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:22 }}>
        <button className="abtn" onClick={onCancel}>back Back to List</button>
        <h2 style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:800, fontSize:22 }}>Editing: {prod.name}</h2>
      </div>
      {p.label_configurator && (
        <div className="aform-section" style={{ marginBottom:18 }}>
          <div className="aform-title">Label Configurator Settings</div>
          <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
            {[['lbl_shapes','Shapes','Circle, Oval, Square'],['lbl_sizes','Sizes','2x2, 3x3'],['lbl_stocks','Materials','Semi Gloss'],['lbl_ink','Ink','CMYK'],['lbl_finishing','Finishing','Standard']].map(([key,label,hint]) => (
              <div key={key} className="aform-grp">
                <label className="aform-lbl">{label}</label>
                <input className="ainp" placeholder={hint} value={Array.isArray(p[key]) ? p[key].join(', ') : (p[key]||'')} onChange={e => upd(key)(e.target.value.split(',').map(x=>x.trim()).filter(Boolean))} />
              </div>
            ))}
          </div>
        </div>
      )}
      <div className="aform-section" style={{ marginBottom:18 }}>
        <div className="aform-title">Turnaround Availability</div>
        <div style={{ display:'flex', gap:12, flexWrap:'wrap' }}>
          {[['rush_ok','Rush (2-3 days)','R',Math.round((pricing?.rush_pct??0.25)*100)],['express_ok','Express (same/next)','E',Math.round((pricing?.express_pct??0.50)*100)]].map(([key,label,ico,pct]) => {
            const val = p[key] !== false;
            return (
              <div key={key} onClick={() => upd(key)(!val)} style={{ display:'flex', alignItems:'center', gap:10, padding:'12px 18px', borderRadius:10, border:'2px solid '+(val ? 'var(--o)' : 'var(--bd)'), background:val ? 'rgba(249,115,22,.08)' : 'var(--s2)', cursor:'pointer', userSelect:'none' }}>
                <div style={{ fontWeight:700, fontSize:13 }}>{label}</div>
                <div style={{ fontSize:11, color:'var(--mu)' }}>+{pct}%</div>
                <div style={{ width:22, height:22, borderRadius:6, background:val ? 'var(--o)' : 'var(--bd)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:13, color:val ? '#000' : 'var(--mu)', fontWeight:800 }}>{val ? 'Y' : 'N'}</div>
              </div>
            );
          })}
        </div>
      </div>
      <div style={{ display:'grid', gridTemplateColumns:hasSizeGroup ? '1fr 1fr' : '1fr', gap:16, marginBottom:18 }}>
        <div className="aform-section">
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:12 }}>
            <div className="aform-title" style={{ margin:0 }}>Quantity Tiers</div>
            <button className="abtn abtn-add" style={{ fontSize:11, padding:'5px 10px' }} onClick={addTier}>+ Add Tier</button>
          </div>
          {hasSizeGroup && !selectedSizeOpt && (
            <div style={{ fontSize:12, color:'var(--mu)', background:'var(--s2)', borderRadius:8, padding:'10px 12px', marginBottom:12, borderLeft:'3px solid var(--o)' }}>
              Click a size on the right to enter prices for it.
            </div>
          )}
          {hasSizeGroup && selectedSizeOpt && (
            <div style={{ fontSize:12, color:'var(--o)', background:'var(--ol)', borderRadius:8, padding:'10px 12px', marginBottom:12, fontWeight:600 }}>
              Editing prices for: {selectedSizeOpt.l}
            </div>
          )}
          {(p.pricing||[]).map((tier,ti) => (
            <div key={ti} style={{ display:'grid', gridTemplateColumns:'1fr 1fr auto', gap:6, marginBottom:6, alignItems:'center' }}>
              <input type="number" style={inp} value={tier.q} onChange={e => updTierQty(ti,e.target.value)} placeholder="Qty" />
              <div style={{ display:'flex', alignItems:'center', gap:4 }}>
                <span style={{ color:'var(--mu)', fontSize:12 }}>$</span>
                {selectedSizeOpt
                  ? <input type="number" step="0.01" style={{ ...inp, flex:1 }} value={getSizePrice(selectedSizeOpt.id,ti)} onChange={e => setSizePrices(selectedSizeOpt.id,ti,e.target.value)} placeholder={'base:'+tier.p} />
                  : <input type="number" step="0.01" style={{ ...inp, flex:1 }} value={tier.p} onChange={e => updTierPrice(ti,e.target.value)} />
                }
              </div>
              <button onClick={() => removeTier(ti)} style={{ padding:'5px 9px', borderRadius:6, border:'1px solid rgba(239,68,68,.3)', background:'rgba(239,68,68,.08)', color:'#f87171', cursor:'pointer', fontSize:12 }}>X</button>
            </div>
          ))}
          {!isSqft && (p.pricing||[]).length > 0 && (
            <div style={{ marginTop:12, background:'var(--s2)', borderRadius:8, padding:'10px 12px' }}>
              <div style={{ fontSize:10, fontWeight:700, color:'var(--mu)', textTransform:'uppercase', marginBottom:6 }}>Preview</div>
              <div style={{ display:'flex', flexWrap:'wrap', gap:6 }}>
                {(p.pricing||[]).map((tier,ti) => {
                  const sp = selectedSizeOpt ? getSizePrice(selectedSizeOpt.id,ti) : null;
                  const prNum = parseFloat(sp||tier.p||0);
                  return (
                    <div key={ti} style={{ padding:'5px 10px', borderRadius:6, background:'var(--sf)', border:'1px solid var(--bd)', fontSize:11, textAlign:'center' }}>
                      <div style={{ fontWeight:700 }}>{(tier.q||0).toLocaleString()}</div>
                      <div style={{ color:'var(--o)', fontWeight:700 }}>{'$'+prNum.toFixed(2)}</div>
                      <div style={{ fontSize:9, color:'var(--mu)' }}>{tier.q > 0 ? '$'+(prNum/tier.q).toFixed(3)+'/ea' : ''}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
        <div className="aform-section">
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:12 }}>
            <div className="aform-title" style={{ margin:0 }}>Option Groups</div>
            <button className="abtn abtn-add" style={{ fontSize:11, padding:'5px 10px' }} onClick={addGroup}>+ Add Group</button>
          </div>
          {(p.opts||[]).map((g,gi) => {
            const isSize = g.key === 'size';
            return (
              <div key={gi} style={{ border:'1px solid '+(isSize ? 'var(--o)' : 'var(--bd)'), borderRadius:10, padding:12, marginBottom:12, background:isSize ? 'rgba(249,115,22,.03)' : 'var(--s2)' }}>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr auto', gap:8, marginBottom:10, alignItems:'center' }}>
                  <div>
                    <div style={{ fontSize:9, fontWeight:700, color:'var(--mu)', textTransform:'uppercase', marginBottom:3 }}>Label</div>
                    <input style={inp} value={g.label} onChange={e => updGroup(gi,'label',e.target.value)} />
                  </div>
                  <div>
                    <div style={{ fontSize:9, fontWeight:700, color:'var(--mu)', textTransform:'uppercase', marginBottom:3 }}>Key</div>
                    <input style={inp} value={g.key} onChange={e => updGroup(gi,'key',e.target.value.toLowerCase().replace(/\\s+/g,'-'))} />
                  </div>
                  <button onClick={() => removeGroup(gi)} style={{ padding:'5px 9px', borderRadius:6, border:'1px solid rgba(239,68,68,.3)', background:'rgba(239,68,68,.08)', color:'#f87171', cursor:'pointer', fontSize:12, alignSelf:'flex-end' }}>X</button>
                </div>
                {isSize && <div style={{ fontSize:10, color:'var(--o)', marginBottom:8, fontWeight:600 }}>Click a size to set its prices on the left</div>}
                {(g.opts||[]).map((o,oi) => {
                  const pt = o.price_type || 'multiplier';
                  const pv = o.price_val ?? o.m ?? 1;
                  const isSel = isSize && selectedOptKey === o.id;
                  const sp0 = getSizePrice(o.id, 0);
                  return (
                    <div key={oi} style={{ marginBottom:8 }}>
                      {isSize ? (
                        <div onClick={() => setSelectedOptKey(isSel ? null : o.id)} style={{ display:'flex', alignItems:'center', gap:8, padding:'9px 12px', borderRadius:8, border:'2px solid '+(isSel ? 'var(--o)' : 'var(--bd)'), background:isSel ? 'var(--ol)' : 'var(--sf)', cursor:'pointer', userSelect:'none' }}>
                          <input style={{ ...inp, background:'transparent', border:'none', padding:0, fontWeight:isSel ? 700 : 400, color:isSel ? 'var(--o)' : 'var(--tx)', fontSize:13, flex:1 }} value={o.l} onChange={e => { e.stopPropagation(); updOption(gi,oi,'l',e.target.value); }} onClick={e => e.stopPropagation()} placeholder="Size label" />
                          <span style={{ fontSize:10, color:isSel ? 'var(--o)' : 'var(--mu)', fontWeight:600 }}>{sp0 ? 'from $'+sp0 : 'click to set'}</span>
                          <div style={{ width:18, height:18, borderRadius:4, background:isSel ? 'var(--o)' : 'var(--bd)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:11, color:isSel ? '#000' : 'var(--mu)', fontWeight:800 }}>{isSel ? 'Y' : '>'}</div>
                          <button onClick={e => { e.stopPropagation(); removeOption(gi,oi); }} style={{ padding:'3px 6px', borderRadius:5, border:'1px solid rgba(239,68,68,.3)', background:'rgba(239,68,68,.08)', color:'#f87171', cursor:'pointer', fontSize:11 }}>X</button>
                        </div>
                      ) : (
                        <div style={{ display:'grid', gridTemplateColumns:'1.4fr 1fr 90px 65px auto', gap:5, alignItems:'center' }}>
                          <input style={{...inp,fontSize:11}} value={o.l} onChange={e => updOption(gi,oi,'l',e.target.value)} placeholder="Label" />
                          <input style={{...inp,fontSize:10}} value={o.id} onChange={e => updOption(gi,oi,'id',e.target.value.toLowerCase().replace(/\\s+/g,'-'))} placeholder="key" />
                          <select value={pt} style={{...sl,fontSize:10,padding:'6px 8px'}} onChange={e => { const ng=[...(p.opts||[])]; const no=[...ng[gi].opts]; const defs={multiplier:1.0,percent:10,fixed:5,linear_ft:2.5}; no[oi]={...no[oi],price_type:e.target.value,price_val:defs[e.target.value],m:e.target.value==='multiplier'?(no[oi].price_val||1):1}; ng[gi]={...ng[gi],opts:no}; upd('opts')(ng); }}>
                            <option value="multiplier">x Mult</option>
                            <option value="percent">% Pct</option>
                            <option value="fixed">$ Fixed</option>
                            <option value="linear_ft">ft</option>
                          </select>
                          <input type="number" step={pt==='multiplier' ? '0.01' : '1'} style={{...inp,fontSize:11,textAlign:'center'}} value={pv} onChange={e => { const ng=[...(p.opts||[])]; const no=[...ng[gi].opts]; const v=parseFloat(e.target.value)||0; no[oi]={...no[oi],price_val:v,m:pt==='multiplier'?v:1,price_type:pt}; ng[gi]={...ng[gi],opts:no}; upd('opts')(ng); }} />
                          <button onClick={() => removeOption(gi,oi)} style={{ padding:'5px 7px', borderRadius:5, border:'1px solid rgba(239,68,68,.3)', background:'rgba(239,68,68,.08)', color:'#f87171', cursor:'pointer', fontSize:11 }}>X</button>
                        </div>
                      )}
                    </div>
                  );
                })}
                <button onClick={() => addOption(gi)} style={{ fontSize:11, padding:'5px 10px', borderRadius:6, border:'1px dashed var(--bd)', background:'transparent', color:'var(--mu)', cursor:'pointer', marginTop:4 }}>+ Add {isSize ? 'Size' : 'Choice'}</button>
              </div>
            );
          })}
        </div>
      </div>
      <div style={{ display:'flex', gap:10, marginTop:18 }}>
        <button className="abtn abtn-add" onClick={() => onSave(p)} style={{ fontSize:14, padding:'10px 24px' }}>Save All Changes</button>
        <button className="abtn" onClick={onCancel}>Cancel</button>
      </div>
    </div>
  );
}
`;

c = c.slice(0, start) + newFunc + c.slice(end);
fs.writeFileSync('src/pages/AdminPage.jsx', c);
console.log('Done. Lines:', c.split('\n').length);
