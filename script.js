// ========================
// Country
// ========================
let country = { population:10000000, gdp:50000000000, military:5000, adminPower:50, stability:80 };

// ========================
// States (4 BD + 12 India)
// ========================
let states = [
  {name:"Dhaka Region", capital:"Dhaka", color:"#3498db", coords:[[23,90],[24,90],[24,91],[23,91]], landmarks:["Dhaka Land1","Dhaka Land2"]},
  {name:"Banga Province", capital:"Faridpur", color:"#2ecc71", coords:[[22,89],[23,89],[23,90],[22,90]], landmarks:["Faridpur Land1","Faridpur Land2"]},
  {name:"Gauda Province", capital:"Rajshahi", color:"#f1c40f", coords:[[24,88],[25,88],[25,89],[24,89]], landmarks:["Rajshahi Land1","Rajshahi Land2"]},
  {name:"Purbochal State", capital:"Comilla", color:"#e67e22", coords:[[23,91],[24,91],[24,92],[23,92]], landmarks:["Comilla Land1","Comilla Land2"]},
  {name:"West Bengal", capital:"Kolkata", color:"#9b59b6", coords:[[22,87],[23,87],[23,88],[22,88]], landmarks:["Victoria Memorial","Howrah Bridge"]},
  {name:"Bihar", capital:"Patna", color:"#1abc9c", coords:[[25,84],[26,84],[26,85],[25,85]], landmarks:["Mahavir Mandir","Patna Museum"]},
  {name:"Jharkhand", capital:"Ranchi", color:"#34495e", coords:[[23,85],[24,85],[24,86],[23,86]], landmarks:["Jagannath Temple","Rock Garden"]},
  {name:"Odisha", capital:"Bhubaneswar", color:"#d35400", coords:[[20,85],[21,85],[21,86],[20,86]], landmarks:["Lingaraj Temple","Konark"]},
  {name:"Sikkim", capital:"Gangtok", color:"#c0392b", coords:[[27,88],[28,88],[28,89],[27,89]], landmarks:["Rumtek Monastery"]},
  {name:"Assam", capital:"Dispur", color:"#7f8c8d", coords:[[26,92],[27,92],[27,93],[26,93]], landmarks:["Kaziranga NP"]},
  {name:"Meghalaya", capital:"Shillong", color:"#16a085", coords:[[25,91],[26,91],[26,92],[25,92]], landmarks:["Cherrapunjee","Shillong Peak"]},
  {name:"Arunachal Pradesh", capital:"Itanagar", color:"#2980b9", coords:[[28,94],[29,94],[29,95],[28,95]], landmarks:["Tawang Monastery"]},
  {name:"Manipur", capital:"Imphal", color:"#d35400", coords:[[24,93],[25,93],[25,94],[24,94]], landmarks:["Loktak Lake"]},
  {name:"Nagaland", capital:"Kohima", color:"#8e44ad", coords:[[25,94],[26,94],[26,95],[25,95]], landmarks:["Dzükou Valley"]},
  {name:"Mizoram", capital:"Aizawl", color:"#27ae60", coords:[[23,92],[24,92],[24,93],[23,93]], landmarks:["Reiek Hills"]},
  {name:"Tripura", capital:"Agartala", color:"#f39c12", coords:[[23,91],[24,91],[24,92],[23,92]], landmarks:["Ujjayanta Palace"]}
];

// ========================
// Cities (3 per state)
// ========================
let cities = [];
states.forEach(s=>{
  for(let i=1;i<=3;i++){
    cities.push({name:s.capital+" City "+i, state:s.name, lat:s.coords[0][0]+0.1*i, lng:s.coords[0][1]+0.1*i, population:50000*i, upgrades:{roads:0,hospitals:0,schools:0,universities:0,militaryTech:0}});
  }
});

// ========================
// Selected state
// ========================
let selectedState = states[0];

// ========================
// Map
// ========================
let map = L.map('map').setView([23.7,90.3],6);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:19}).addTo(map);
let polygons = {};
states.forEach(s=>{
  let poly = L.polygon(s.coords,{color:s.color,fillOpacity:0.3}).addTo(map);
  poly.bindPopup(`<b>${s.name}</b><br>Capital: ${s.capital}<br>Landmarks:<br>- ${s.landmarks.join("<br>- ")}`);
  poly.on('click',()=>{ selectedState=s; renderUpgradePanel(); renderCities(); highlightTab(); });
  polygons[s.name]=poly;
});

// ========================
// Tabs
// ========================
function renderTabs(){
  let container = document.getElementById('state-tabs'); container.innerHTML='';
  states.forEach(s=>{
    let btn = document.createElement('button');
    btn.className='state-btn '+(s.name===selectedState.name?'selected':'');
    btn.innerText=s.name;
    btn.onclick=()=>{selectedState=s; renderUpgradePanel(); renderCities(); highlightTab();};
    container.appendChild(btn);
  });
}
function highlightTab(){renderTabs();}
renderTabs();

// ========================
// Upgrade Panel
// ========================
function renderUpgradePanel(){
  let panel = document.getElementById('upgrade-panel'); panel.innerHTML='';
  // State
  let sDiv = document.createElement('div'); sDiv.className='upgrade-panel';
  sDiv.innerHTML='<h4>State: '+selectedState.name+'</h4>';
  ['roads','hospitals','schools','universities','militaryTech'].forEach(t=>{
    let p=document.createElement('p'); 
    p.innerHTML=t+': 0 <button class="upgrade-btn" onclick="upgradeState(\''+t+'\')">Upgrade +</button>';
    sDiv.appendChild(p);
  });
  panel.appendChild(sDiv);
  // Cities
  let cDiv = document.createElement('div'); cDiv.innerHTML='<h4>City Upgrades</h4>';
  cities.filter(c=>c.state===selectedState.name).forEach(c=>{
    let div=document.createElement('div'); div.className='upgrade-panel';
    div.innerHTML='<b>'+c.name+'</b>';
    ['roads','hospitals','schools','universities','militaryTech'].forEach(t=>{
      let p=document.createElement('p'); 
      p.innerHTML=t+': 0 <button class="upgrade-btn" onclick="upgradeCity(\''+c.name+'\',\''+t+'\')">Upgrade +</button>';
      div.appendChild(p);
    });
    cDiv.appendChild(div);
  });
  panel.appendChild(cDiv);

  // Cabinet Meeting Button
  let cabDiv = document.createElement('div'); cabDiv.className='upgrade-panel';
  cabDiv.innerHTML='<h4>Cabinet Meeting</h4><button onclick="cabinetMeeting()">Hold Meeting</button>';
  panel.appendChild(cabDiv);

  // Election Commission Button
  let eleDiv = document.createElement('div'); eleDiv.className='upgrade-panel';
  eleDiv.innerHTML='<h4>Election Commission</h4><button onclick="runElection(selectedState.name)">Run Election</button>';
  panel.appendChild(eleDiv);
}

// ========================
// Upgrade Functions
// ========================
function upgradeState(type){
  if(!selectedState.upgrades) selectedState.upgrades={roads:0,hospitals:0,schools:0,universities:0,militaryTech:0};
  selectedState.upgrades[type]++;
  if(type==="roads"||type==="schools"||type==="universities"){country.gdp+=5000000;country.population+=1000;}
  else if(type==="hospitals"){country.stability=Math.min(100,country.stability+2);}
  else if(type==="militaryTech"){country.military+=100;}
  logEvent(type+' upgraded in state '+selectedState.name); updateDashboard(); renderUpgradePanel();
}
function upgradeCity(name,type){
  let c = cities.find(c=>c.name===name); if(!c) return;
  c.upgrades[type]++;
  if(type==="roads"||type==="schools"||type==="universities"){country.gdp+=1000000;country.population+=500;}
  else if(type==="hospitals"){country.stability=Math.min(100,country.stability+1);}
  else if(type==="militaryTech"){country.military+=50;}
  logEvent(type+' upgraded in city '+name); updateDashboard(); renderUpgradePanel();
}

// ========================
// Roads & Buildings (2D)
function drawInfrastructure(){
  // Example road
  let road1 = L.polyline([[23.75,90.35],[23.76,90.36]], {color:'black', weight:3}).addTo(map);
  // Example building
  let building1 = L.polygon([[23.751,90.352],[23.751,90.353],[23.752,90.353],[23.752,90.352]], {color:'brown', fillOpacity:0.6}).addTo(map);
}
drawInfrastructure();

// ========================
// Cabinet Meeting
// ========================
function cabinetMeeting(){
  let effect=Math.floor(Math.random()*10)+1;
  country.gdp += effect*1000000;
  country.stability = Math.min(100, country.stability + effect);
  logEvent(`Cabinet meeting decision affected GDP +${effect}M, Stability +${effect}`);
  updateDashboard();
}

// ========================
// Election Simulation
// ========================
let electionResults={};
function runElection(stateName){
  let votes = Math.floor(Math.random()*1000)+500;
  electionResults[stateName]=votes;
  logEvent(`Election in ${stateName}: Candidate A ${votes} votes`);
}

// ========================
// Render Cities on Map
// ========================
let markers=[];
function renderCities(){
  markers.forEach(m=>map.removeLayer(m)); markers=[];
  cities.filter(c=>c.state===selectedState.name).forEach(c=>{
    let m=L.marker([c.lat,c.lng]).addTo(map);
    m.bindPopup('<b>'+c.name+'</b><br>Population: '+c.population);
    markers.push(m);
  });
}
renderCities();

// ========================
// Dashboard & Event Log
// ========================
function updateDashboard(){
  document.getElementById('population').textContent=country.population.toLocaleString();
  document.getElementById('gdp').textContent=country.gdp.toLocaleString();
  document.getElementById('military').textContent=country.military.toLocaleString();
  document.getElementById('adminPower').textContent=country.adminPower;
  document.getElementById('stability').textContent=country.stability;
}
function logEvent(msg){
  let logDiv=document.getElementById('event-log'); let entry=document.createElement('div');
  entry.textContent='['+new Date().toLocaleTimeString()+'] '+msg; logDiv.prepend(entry);
}
updateDashboard(); renderUpgradePanel();