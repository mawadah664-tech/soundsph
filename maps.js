(() => {
 const endpoint='https://gibs.earthdata.nasa.gov/wms/epsg3857/best/wms.cgi';
 const layerConfig={
  landTemp:{id:'MODIS_Terra_Land_Surface_Temp_Day',label:'Land surface temperature · MODIS Terra'},
  fires:{id:'MODIS_Combined_Thermal_Anomalies_All',label:'Active fire detections · MODIS Terra + Aqua'},
  oceanTemp:{id:'GHRSST_Sea_Surface_Temperature',label:'Sea surface temperature · GHRSST MUR'},
  seaIce:{id:'MODIS_Terra_Sea_Ice',label:'Sea ice · MODIS Terra'}
 };
 const today=new Date(); const iso=d=>d.toISOString().slice(0,10); const yesterday=new Date(today);yesterday.setDate(today.getDate()-1);
 const dateInput=document.getElementById('mapDate');dateInput.max=iso(today);if(!dateInput.value)dateInput.value=iso(yesterday);
 const map=L.map('nasaMap',{center:[18,8],zoom:2,minZoom:1,maxZoom:8,worldCopyJump:true,zoomControl:true});
 const base=L.tileLayer.wms(endpoint,{layers:'MODIS_Terra_CorrectedReflectance_TrueColor',format:'image/jpeg',transparent:false,version:'1.1.1',time:dateInput.value,attribution:'NASA EOSDIS GIBS'}).addTo(map);
 let overlay=null;
 function apply(){
  const key=document.getElementById('layerSelect').value;const date=dateInput.value||iso(yesterday);const cfg=layerConfig[key];
  if(overlay)map.removeLayer(overlay);
  overlay=L.tileLayer.wms(endpoint,{layers:cfg.id,format:'image/png',transparent:true,version:'1.1.1',time:date,opacity:.88,attribution:'NASA EOSDIS GIBS'}).addTo(map);
  base.setParams({time:date});
  const status=document.getElementById('mapStatus');status.textContent=(document.documentElement.lang==='ar'?'الطبقة الحالية: ':'Current layer: ')+cfg.label+' · '+date;
 }
 document.getElementById('applyLayer').addEventListener('click',apply);
 document.getElementById('layerSelect').addEventListener('change',apply);
 apply();
 let lang='en';
 document.getElementById('mapLanguage').addEventListener('click',()=>{
  lang=lang==='en'?'ar':'en';document.documentElement.lang=lang;document.documentElement.dir=lang==='ar'?'rtl':'ltr';
  document.querySelectorAll('[data-en][data-ar]').forEach(el=>{el.innerHTML=el.dataset[lang];});
  document.getElementById('mapLanguage').textContent=lang==='en'?'العربية':'English';
  document.getElementById('mapLanguage').setAttribute('aria-label',lang==='en'?'Switch to Arabic':'Switch to English');
  apply();
 });
 map.whenReady(()=>{setTimeout(()=>map.invalidateSize(),150);document.getElementById('mapStatus').textContent='NASA GIBS imagery · '+dateInput.value;});
})();