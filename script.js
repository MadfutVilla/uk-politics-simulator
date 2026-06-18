const parties = [
  { name: "Labour", logo: "🌹", colour: "#d50000", description: "Centre-left, public services, workers' rights" },
  { name: "Conservative", logo: "🌳", colour: "#0087dc", description: "Centre-right, tax control, law and order" },
  { name: "Reform UK", logo: "R", colour: "#12b6cf", description: "Populist right, immigration, political reform" },
  { name: "Liberal Democrats", logo: "🕊️", colour: "#faa61a", text: "#111", description: "Liberal, constitutional reform, civil liberties" },
  { name: "Green Party", logo: "🌻", colour: "#6ab023", description: "Climate, social justice, local democracy" },
  { name: "SNP", logo: "S", colour: "#fdf38e", text: "#111", description: "Scottish nationalism, independence, devolution" },
  { name: "Plaid Cymru", logo: "PC", colour: "#005b54", description: "Welsh nationalism, devolution, social democracy" },
  { name: "DUP", logo: "D", colour: "#d46a4c", description: "Unionism, conservatism, Northern Ireland focus" },
  { name: "Sinn Féin", logo: "SF", colour: "#326760", description: "Irish republicanism, social democratic politics" },
  { name: "Alliance Party", logo: "A", colour: "#f6cb2f", text: "#111", description: "Cross-community politics, liberal centre" },
  { name: "SDLP", logo: "SD", colour: "#2aa82c", description: "Irish nationalism, social democracy" },
  { name: "Ulster Unionist Party", logo: "U", colour: "#48a5ee", text: "#111", description: "Unionism, moderate conservatism" },
  { name: "Independent", logo: "I", colour: "#555555", description: "No party machine. Build your own movement." },
  { name: "Create Your Own Party", logo: "+", colour: "linear-gradient(135deg, #333, #888)", description: "Design a new political force from scratch." }
];

let selectedParty = null;
let polling = 34;
let approval = 48;

const partyGrid = document.getElementById("partyGrid");

parties.forEach((party) => {
  const card = document.createElement("button");
  card.className = "party-card";
  card.style.background = party.colour;
  card.style.color = party.text || "white";
  card.innerHTML = `
    <span class="party-logo">${party.logo}</span>
    <span>
      <strong>${party.name}</strong>
      <small>${party.description}</small>
    </span>
  `;
  card.onclick = () => selectParty(party);
  partyGrid.appendChild(card);
});

function setScreen(id) {
  document.querySelectorAll(".screen").forEach(screen => screen.classList.remove("active"));
  document.getElementById(id).classList.add("active");
}

function showTitleScreen() {
  setScreen("titleScreen");
}

function showPartyScreen() {
  setScreen("partyScreen");
}

function showAbout() {
  showToast("A UK political strategy game prototype. More features coming next.");
}

function selectParty(party) {
  if (party.name === "Create Your Own Party") {
    setScreen("createPartyScreen");
    return;
  }

  selectedParty = party;
  document.getElementById("selectedPartyText").textContent = `You are standing as leader of ${party.name}. Choose your leader details before entering the campaign.`;
  setScreen("leaderScreen");
}

function beginCampaign() {
  const leaderName = document.getElementById("leaderName").value.trim() || "Leader";
  const trait = document.getElementById("leaderTrait").value;
  document.getElementById("dashboardTitle").textContent = `${leaderName}'s ${selectedParty.name} Campaign`;
  document.getElementById("newsText").textContent = `${leaderName} launches the ${selectedParty.name} campaign. Early media reaction focuses on the leader's reputation as a ${trait}.`;
  setScreen("dashboardScreen");
}

function takeAction(action) {
  const outcomes = {
    speech: "Your speech dominates the evening news. Approval rises slightly.",
    nhs: "Your NHS policy is popular with voters, but opponents ask how it will be funded.",
    economy: "Your economic attack lands well with party supporters, but floating voters remain cautious.",
    visit: "Your visit to a marginal seat boosts local campaign morale."
  };

  polling += Math.floor(Math.random() * 3);
  approval += Math.floor(Math.random() * 4) - 1;
  document.getElementById("pollingStat").textContent = `${polling}%`;
  document.getElementById("approvalStat").textContent = approval;
  document.getElementById("newsText").textContent = outcomes[action];
}

function showToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 2600);
}



let customPartyDraft = {
  name: "",
  colour: "",
  colourName: "",
  logo: "",
  logoName: ""
};

function openColourStep() {
  const name = document.getElementById("customPartyName").value.trim();

  if (!name) {
    alert("Please enter a party name.");
    return;
  }

  customPartyDraft.name = name;
  document.getElementById("previewPartyName").textContent = name;
  document.getElementById("partyNameStep").style.display = "none";
  document.getElementById("partyColourStep").style.display = "flex";
}

function chooseCustomColour(colour, colourName) {
  const result = checkColourClash(colour);

  if (result.clashes) {
    alert(`That colour is too close to ${result.nearest.name}. Choose a more distinct colour so it does not clash on election maps.`);
    return;
  }

  customPartyDraft.colour = colour;
  customPartyDraft.colourName = colourName;

  document.querySelectorAll(".colour-option").forEach(button => {
    button.classList.remove("selected");
  });

  const clickedButton = Array.from(document.querySelectorAll(".colour-option"))
    .find(button => button.textContent.trim() === colourName);

  if (clickedButton) {
    clickedButton.classList.add("selected");
  }

  document.querySelector(".preview-badge").style.background = colour;
  document.getElementById("previewColourName").textContent = `${colourName} (${colour.toUpperCase()})`;

  if (document.getElementById("customColourInput")) {
    document.getElementById("customColourInput").value = colour;
    document.getElementById("customColourHex").value = colour.toUpperCase();
    previewColourSafety(colour);
  }
}

function openLogoStep() {
  if (!customPartyDraft.colour) {
    alert("Please choose a party colour.");
    return;
  }

  document.getElementById("partyColourStep").style.display = "none";
  document.getElementById("partyLogoStep").style.display = "flex";

  document.getElementById("finalPreviewPartyName").textContent = customPartyDraft.name;
  document.getElementById("finalLogoBadge").style.background = customPartyDraft.colour;
  document.getElementById("finalPreviewDetails").textContent =
    `${customPartyDraft.colourName} party colour selected. Now choose a logo.`;
}

function chooseCustomLogo(logo, logoName) {
  customPartyDraft.logo = logo;
  customPartyDraft.logoName = logoName;

  document.querySelectorAll(".logo-option").forEach(button => {
    button.classList.remove("selected");
  });

  const clickedButton = Array.from(document.querySelectorAll(".logo-option"))
    .find(button => button.textContent.trim().includes(logoName));

  if (clickedButton) {
    clickedButton.classList.add("selected");
  }

  document.getElementById("finalLogoBadge").textContent = logo;
  document.getElementById("finalLogoBadge").style.background = customPartyDraft.colour;
  document.getElementById("finalPreviewDetails").textContent =
    `${logoName} logo with ${customPartyDraft.colourName} party colour.`;
}

function saveCustomParty() {
  if (!customPartyDraft.name) {
    alert("Please enter a party name.");
    return;
  }

  if (!customPartyDraft.colour) {
    alert("Please choose a party colour.");
    return;
  }

  if (!customPartyDraft.logo) {
    alert("Please choose a party logo.");
    return;
  }

  selectedParty = {
    name: customPartyDraft.name,
    logo: customPartyDraft.logo,
    colour: customPartyDraft.colour,
    colourName: customPartyDraft.colourName,
    logoName: customPartyDraft.logoName,
    description: "Custom political party"
  };

  localStorage.setItem("customPartyName", customPartyDraft.name);
  localStorage.setItem("customPartyColour", customPartyDraft.colour);
  localStorage.setItem("customPartyColourName", customPartyDraft.colourName);
  localStorage.setItem("customPartyLogo", customPartyDraft.logo);
  localStorage.setItem("customPartyLogoName", customPartyDraft.logoName);

  document.getElementById("selectedPartyText").textContent =
    `You are standing as leader of ${customPartyDraft.name}. Choose your leader details before entering the campaign.`;

  setScreen("leaderScreen");
}


const restrictedPartyColours = [
  { name: "Labour red", colour: "#d50000" },
  { name: "Conservative blue", colour: "#0087dc" },
  { name: "Reform turquoise", colour: "#12b6cf" },
  { name: "Liberal Democrat orange", colour: "#faa61a" },
  { name: "Green Party green", colour: "#6ab023" },
  { name: "SNP yellow", colour: "#fdf38e" },
  { name: "Plaid Cymru green", colour: "#005b54" },
  { name: "DUP copper", colour: "#d46a4c" },
  { name: "Sinn Féin green", colour: "#326760" },
  { name: "Alliance yellow", colour: "#f6cb2f" },
  { name: "SDLP green", colour: "#2aa82c" },
  { name: "UUP blue", colour: "#48a5ee" }
];

function hexToRgb(hex) {
  const cleanHex = hex.replace("#", "");
  if (!/^[0-9A-Fa-f]{6}$/.test(cleanHex)) return null;

  return {
    r: parseInt(cleanHex.slice(0, 2), 16),
    g: parseInt(cleanHex.slice(2, 4), 16),
    b: parseInt(cleanHex.slice(4, 6), 16)
  };
}

function colourDistance(hexA, hexB) {
  const a = hexToRgb(hexA);
  const b = hexToRgb(hexB);
  if (!a || !b) return 0;

  return Math.sqrt(
    Math.pow(a.r - b.r, 2) +
    Math.pow(a.g - b.g, 2) +
    Math.pow(a.b - b.b, 2)
  );
}

function checkColourClash(hex) {
  const nearest = restrictedPartyColours
    .map(party => ({
      ...party,
      distance: colourDistance(hex, party.colour)
    }))
    .sort((a, b) => a.distance - b.distance)[0];

  return {
    clashes: nearest.distance < 90,
    nearest
  };
}

function setColourWarning(message, isBad) {
  const warning = document.getElementById("colourWarning");
  if (!warning) return;

  warning.textContent = message;
  warning.classList.toggle("bad", isBad);
  warning.classList.toggle("good", !isBad);
}

function previewPickedColour() {
  const colour = document.getElementById("customColourInput").value.toUpperCase();
  document.getElementById("customColourHex").value = colour;
  previewColourSafety(colour);
}

function previewTypedColour() {
  let colour = document.getElementById("customColourHex").value.trim();

  if (!colour.startsWith("#")) {
    colour = "#" + colour;
  }

  document.getElementById("customColourHex").value = colour.toUpperCase();

  if (/^#[0-9A-Fa-f]{6}$/.test(colour)) {
    document.getElementById("customColourInput").value = colour;
    previewColourSafety(colour);
  } else {
    setColourWarning("Enter a valid 6-digit hex colour, for example #7B2CBF.", true);
  }
}

function previewColourSafety(colour) {
  const result = checkColourClash(colour);

  if (result.clashes) {
    setColourWarning(`Too close to ${result.nearest.name}. Pick a more distinct colour.`, true);
  } else {
    setColourWarning("Safe colour selected. This will be clear on maps and polling charts.", false);
  }
}

function applyPickedColour() {
  const colour = document.getElementById("customColourHex").value.trim().toUpperCase();

  if (!/^#[0-9A-Fa-f]{6}$/.test(colour)) {
    alert("Please enter a valid colour code.");
    return;
  }

  const result = checkColourClash(colour);

  if (result.clashes) {
    alert(`That colour is too close to ${result.nearest.name}. Choose a more distinct colour so it does not clash on election maps.`);
    return;
  }

  chooseCustomColour(colour, "Custom Colour");
}


function openIdeologyStep(){
 if(!customPartyDraft.logo){
   alert("Please choose a party logo.");
   return;
 }
 document.getElementById("partyLogoStep").style.display="none";
 document.getElementById("partyIdeologyStep").style.display="flex";
 updateIdeologySummary();
}

function updateIdeologySummary(){
 const e=+document.getElementById("economicScale").value;
 const s=+document.getElementById("socialScale").value;

 let summary="Centrist Party";

 if(e<35 && s<35) summary="Progressive Left Party";
 else if(e<35 && s>65) summary="Traditional Socialist Party";
 else if(e>65 && s>65) summary="National Conservative Party";
 else if(e>65 && s<35) summary="Liberal Market Party";

 document.getElementById("ideologySummary").textContent=summary;
}

["economicScale","socialScale","environmentScale","internationalScale"].forEach(id=>{
 setTimeout(()=>{
   const el=document.getElementById(id);
   if(el) el.addEventListener("input", updateIdeologySummary);
 },0);
});

const originalSaveCustomParty = saveCustomParty;
saveCustomParty = function(){
 customPartyDraft.ideology = {
   economic:+document.getElementById("economicScale").value,
   social:+document.getElementById("socialScale").value,
   environmental:+document.getElementById("environmentScale").value,
   international:+document.getElementById("internationalScale").value
 };
 localStorage.setItem("customPartyIdeology", JSON.stringify(customPartyDraft.ideology));
 originalSaveCustomParty();
};


let selectedCoreValues = [];

function openCoreValuesStep(){
 document.getElementById("partyIdeologyStep").style.display="none";
 document.getElementById("coreValuesStep").style.display="flex";
}

function toggleValue(button,value){
 if(selectedCoreValues.includes(value)){
   selectedCoreValues=selectedCoreValues.filter(v=>v!==value);
   button.classList.remove("selected");
 } else {
   if(selectedCoreValues.length>=6){
     alert("You can choose a maximum of 6 core values.");
     return;
   }
   selectedCoreValues.push(value);
   button.classList.add("selected");
 }

 document.getElementById("selectedValuesText").textContent =
   `Selected: ${selectedCoreValues.length} / 6 - ${selectedCoreValues.join(", ")}`;
}

const oldSaveCustomPartyV2 = saveCustomParty;
saveCustomParty = function(){
 if(selectedCoreValues.length < 3){
   alert("Please select at least 3 core values.");
   return;
 }

 customPartyDraft.coreValues = selectedCoreValues;
 localStorage.setItem("customPartyCoreValues", JSON.stringify(selectedCoreValues));

 oldSaveCustomPartyV2();
};


const foundingCandidates = [
  { name: "Sarah Williams", loyalty: 82, competence: 76, popularity: 64, ambition: 41, media: 88, trait: "Media Star" },
  { name: "James Patel", loyalty: 55, competence: 91, popularity: 72, ambition: 89, media: 61, trait: "Opportunist" },
  { name: "Amelia Thompson", loyalty: 78, competence: 84, popularity: 69, ambition: 52, media: 74, trait: "Pragmatist" },
  { name: "David Morgan", loyalty: 91, competence: 66, popularity: 58, ambition: 28, media: 57, trait: "Loyalist" },
  { name: "Aisha Khan", loyalty: 70, competence: 88, popularity: 81, ambition: 63, media: 82, trait: "Policy Wonk" },
  { name: "Oliver Hughes", loyalty: 49, competence: 79, popularity: 76, ambition: 86, media: 84, trait: "Rebel" },
  { name: "Maya Campbell", loyalty: 86, competence: 73, popularity: 74, ambition: 39, media: 70, trait: "Party Organiser" },
  { name: "Thomas Evans", loyalty: 62, competence: 82, popularity: 60, ambition: 74, media: 66, trait: "Strategist" },
  { name: "Grace Robinson", loyalty: 75, competence: 68, popularity: 86, ambition: 58, media: 91, trait: "Campaigner" }
];

let selectedFoundingMembers = {
  deputy: null,
  chairman: null,
  campaign: null
};

function openFoundingMembersStep(){
  if(selectedCoreValues.length < 3){
    alert("Please select at least 3 core values.");
    return;
  }

  document.getElementById("coreValuesStep").style.display = "none";
  document.getElementById("foundingMembersStep").style.display = "flex";

  renderFoundingMembers();
}

function renderFoundingMembers(){
  renderMemberRole("deputyOptions", "deputy");
  renderMemberRole("chairmanOptions", "chairman");
  renderMemberRole("campaignOptions", "campaign");
  updateFoundingTeamSummary();
}

function renderMemberRole(containerId, role){
  const container = document.getElementById(containerId);
  if(!container) return;

  container.innerHTML = "";

  foundingCandidates.forEach((candidate, index) => {
    const card = document.createElement("button");
    card.className = "member-card";
    if(selectedFoundingMembers[role]?.name === candidate.name){
      card.classList.add("selected");
    }

    card.onclick = () => selectFoundingMember(role, candidate);

    card.innerHTML = `
      <strong>${candidate.name}</strong>
      <span>Loyalty: ${candidate.loyalty}</span>
      <span>Competence: ${candidate.competence}</span>
      <span>Popularity: ${candidate.popularity}</span>
      <span>Ambition: ${candidate.ambition}</span>
      <span>Media Skill: ${candidate.media}</span>
      <div class="member-trait">${candidate.trait}</div>
    `;

    container.appendChild(card);
  });
}

function selectFoundingMember(role, candidate){
  selectedFoundingMembers[role] = candidate;
  renderFoundingMembers();
}

function updateFoundingTeamSummary(){
  const deputy = selectedFoundingMembers.deputy?.name || "None";
  const chairman = selectedFoundingMembers.chairman?.name || "None";
  const campaign = selectedFoundingMembers.campaign?.name || "None";

  const summary = document.getElementById("foundingTeamSummary");
  if(summary){
    summary.textContent = `Deputy: ${deputy} | Chairman: ${chairman} | Campaign Director: ${campaign}`;
  }
}

const oldSaveCustomPartyV3 = saveCustomParty;
saveCustomParty = function(){
  if(!selectedFoundingMembers.deputy || !selectedFoundingMembers.chairman || !selectedFoundingMembers.campaign){
    alert("Please choose a Deputy Leader, Party Chairman and Campaign Director.");
    return;
  }

  customPartyDraft.foundingMembers = selectedFoundingMembers;
  localStorage.setItem("customPartyFoundingMembers", JSON.stringify(selectedFoundingMembers));

  oldSaveCustomPartyV3();
};

let selectedHQ = null;

function openHeadquartersStep(){
  if(!selectedFoundingMembers.deputy || !selectedFoundingMembers.chairman || !selectedFoundingMembers.campaign){
    alert("Please choose all founding members.");
    return;
  }

  document.getElementById("foundingMembersStep").style.display="none";
  document.getElementById("headquartersStep").style.display="flex";
}

function selectHQ(city, button){
  selectedHQ = city;

  document.querySelectorAll(".hq-btn").forEach(btn=>{
    btn.classList.remove("selected");
  });

  button.classList.add("selected");
  document.getElementById("hqSummary").textContent = city;
}

const oldSaveCustomPartyV4 = saveCustomParty;
saveCustomParty = function(){
  if(!selectedHQ){
    alert("Please choose a headquarters.");
    return;
  }

  customPartyDraft.headquarters = selectedHQ;
  localStorage.setItem("customPartyHeadquarters", selectedHQ);

  oldSaveCustomPartyV4();
};


let generatedManifesto = null;

function openManifestoBuilder(){
  if(!selectedHQ){
    alert("Please choose a headquarters.");
    return;
  }

  document.getElementById("headquartersStep").style.display = "none";
  document.getElementById("manifestoStep").style.display = "flex";
}

function manifestoPosition(value, low, centre, high){
  if(value < 35) return low;
  if(value > 65) return high;
  return centre;
}

function manifestoHas(value){
  return selectedCoreValues.includes(value);
}

function generateManifesto(){
  const ideology = customPartyDraft.ideology || {
    economic: 50,
    social: 50,
    environmental: 50,
    international: 50
  };

  const economyLine = manifestoPosition(
    ideology.economic,
    "raise public investment, strengthen workers' rights and use the state to rebuild key services",
    "balance fiscal responsibility with targeted investment in communities and public services",
    "cut waste, support enterprise, reduce unnecessary regulation and reward work"
  );

  const socialLine = manifestoPosition(
    ideology.social,
    "protect civil liberties, support equal rights and build a more open society",
    "combine personal freedom with responsibility, fairness and community security",
    "strengthen law and order, protect national traditions and restore public confidence in institutions"
  );

  const greenLine = manifestoPosition(
    ideology.environmental,
    "support practical environmental improvements without damaging household budgets",
    "invest in cleaner energy while protecting jobs and industry",
    "make climate action a national mission through green jobs, clean power and stronger environmental standards"
  );

  const internationalLine = manifestoPosition(
    ideology.international,
    "work closely with allies, international institutions and trading partners",
    "defend Britain's interests while keeping strong global partnerships",
    "put British sovereignty, border control and national interests at the centre of foreign policy"
  );

  const values = selectedCoreValues.join(", ");

  const policies = [];

  if(manifestoHas("Strong NHS")) policies.push(["NHS", "We will reduce waiting lists, expand GP access and focus funding on frontline care."]);
  if(manifestoHas("Housing")) policies.push(["Housing", "We will accelerate housebuilding, support first-time buyers and tackle poor-quality rented housing."]);
  if(manifestoHas("Education")) policies.push(["Education", "We will improve school standards, protect vocational routes and invest in skills for the modern economy."]);
  if(manifestoHas("Law and Order")) policies.push(["Crime", "We will strengthen neighbourhood policing, speed up justice and tackle antisocial behaviour."]);
  if(manifestoHas("Immigration Control")) policies.push(["Immigration", "We will create a fair but controlled immigration system linked to skills, housing and public service capacity."]);
  if(manifestoHas("Climate Action")) policies.push(["Environment", "We will expand clean energy, improve insulation and protect nature while creating green jobs."]);
  if(manifestoHas("Low Taxes")) policies.push(["Tax", "We will keep taxes competitive, simplify the tax system and support working families."]);
  if(manifestoHas("Welfare Expansion")) policies.push(["Welfare", "We will strengthen the safety net while helping people into secure, well-paid work."]);
  if(manifestoHas("National Security")) policies.push(["Security", "We will protect defence spending, improve resilience and stand firmly with Britain's allies."]);
  if(manifestoHas("Free Speech")) policies.push(["Free Speech", "We will defend open debate, academic freedom and the right to peaceful expression."]);
  if(manifestoHas("Equality")) policies.push(["Equality", "We will tackle unfair barriers in opportunity, pay, housing and public services."]);
  if(manifestoHas("Economic Growth")) policies.push(["Growth", "We will back business, infrastructure and innovation to grow every region of the UK."]);

  if(policies.length < 6){
    policies.push(["Public Services", "We will reform public services around outcomes, transparency and local accountability."]);
    policies.push(["Devolution", `From our headquarters in ${selectedHQ}, we will listen to every nation and region of the UK.`]);
  }

  generatedManifesto = {
    opening: `${customPartyDraft.name} is a new political movement built around ${values}. Our aim is to offer serious government, national renewal and practical change.`,
    economy: `On the economy, we will ${economyLine}.`,
    society: `On society, we will ${socialLine}.`,
    environment: `On the environment, we will ${greenLine}.`,
    international: `In the world, we will ${internationalLine}.`,
    policies
  };

  renderManifesto();
}

function regenerateManifesto(){
  generateManifesto();
}

function renderManifesto(){
  const output = document.getElementById("manifestoOutput");

  if(!generatedManifesto){
    output.innerHTML = "<p>Your manifesto will appear here.</p>";
    return;
  }

  let html = `
    <h4>Founding Statement</h4>
    <p>${generatedManifesto.opening}</p>

    <h4>Economy</h4>
    <p>${generatedManifesto.economy}</p>

    <h4>Society</h4>
    <p>${generatedManifesto.society}</p>

    <h4>Environment</h4>
    <p>${generatedManifesto.environment}</p>

    <h4>Foreign Policy</h4>
    <p>${generatedManifesto.international}</p>

    <h4>Key Pledges</h4>
  `;

  generatedManifesto.policies.forEach(policy => {
    html += `<p><strong>${policy[0]}:</strong> ${policy[1]}</p>`;
  });

  output.innerHTML = html;
}

const oldSaveCustomPartyV5 = saveCustomParty;
saveCustomParty = function(){
  if(!generatedManifesto){
    alert("Please generate a manifesto before creating your party.");
    return;
  }

  customPartyDraft.manifesto = generatedManifesto;
  localStorage.setItem("customPartyManifesto", JSON.stringify(generatedManifesto));

  oldSaveCustomPartyV5();
};


let generatedClassification = null;
let generatedSlogan = "";

function openClassificationAndSloganStep(){
  if(!generatedManifesto){
    alert("Please generate a manifesto first.");
    return;
  }

  document.getElementById("manifestoStep").style.display = "none";
  document.getElementById("classificationSloganStep").style.display = "flex";

  classifyPartyFromManifesto();
  generatePartySlogan();
  updateCampaignPosterPreview();
}

function classifyPartyFromManifesto(){
  const ideology = customPartyDraft.ideology || {
    economic: 50,
    social: 50,
    environmental: 50,
    international: 50
  };

  const values = selectedCoreValues || [];

  let classification = "Centrist Reform Party";
  let explanation = "A broadly moderate party focused on practical reform, public services and balanced government.";

  const eco = ideology.economic;
  const soc = ideology.social;
  const env = ideology.environmental;
  const intl = ideology.international;

  const has = (value) => values.includes(value);

  if(env >= 70 && (has("Climate Action") || eco <= 55)){
    classification = "Green Progressive Party";
    explanation = "A climate-focused progressive party built around environmental action, social reform and long-term investment.";
  } else if(eco <= 35 && soc <= 45){
    classification = "Democratic Socialist Party";
    explanation = "A left-wing party focused on redistribution, strong public services, workers' rights and equality.";
  } else if(eco <= 45 && soc <= 45 && (has("Strong NHS") || has("Welfare Expansion") || has("Housing"))){
    classification = "Social Democratic Party";
    explanation = "A centre-left party focused on public services, fairness, welfare, housing and managed economic reform.";
  } else if(eco >= 65 && soc <= 45){
    classification = "Liberal Market Party";
    explanation = "A pro-business, socially liberal party focused on enterprise, civil liberties and economic freedom.";
  } else if(eco >= 60 && soc >= 60 && intl >= 60){
    classification = "National Conservative Party";
    explanation = "A right-wing party focused on national sovereignty, immigration control, law and order, and traditional values.";
  } else if(eco >= 60 && soc >= 55){
    classification = "Conservative Reform Party";
    explanation = "A centre-right party focused on lower taxes, security, responsibility and gradual reform.";
  } else if(soc <= 40 && intl <= 45 && eco >= 40 && eco <= 65){
    classification = "Liberal Centrist Party";
    explanation = "A moderate liberal party focused on civil liberties, constitutional reform, international cooperation and public trust.";
  } else if(intl >= 70 && (has("Immigration Control") || has("National Security"))){
    classification = "Sovereigntist Reform Party";
    explanation = "A nationalist reform party focused on borders, sovereignty, security and reshaping Britain's institutions.";
  } else if(eco <= 50 && soc >= 55){
    classification = "Traditional Labour Movement";
    explanation = "A socially traditional but economically interventionist party focused on working communities and public services.";
  }

  generatedClassification = {
    name: classification,
    explanation,
    ideology: {
      economic: eco,
      social: soc,
      environmental: env,
      international: intl
    }
  };

  document.getElementById("classificationBadge").textContent = "Auto-classified";
  document.getElementById("partyClassificationTitle").textContent = classification;
  document.getElementById("partyClassificationExplanation").textContent = explanation;

  localStorage.setItem("customPartyClassification", JSON.stringify(generatedClassification));
}

function generatePartySlogan(){
  if(!generatedClassification){
    classifyPartyFromManifesto();
  }

  const type = generatedClassification.name;
  const values = selectedCoreValues || [];

  const has = (value) => values.includes(value);

  const sloganBank = {
    "Green Progressive Party": [
      "Clean Power. Fairer Future.",
      "A Greener Britain That Works For Everyone.",
      "Climate Action, Strong Communities."
    ],
    "Democratic Socialist Party": [
      "Power, Wealth and Opportunity For All.",
      "A Britain Built For Working People.",
      "Public Services, Fair Wages, Real Change."
    ],
    "Social Democratic Party": [
      "Building Britain's Future Fairly.",
      "Opportunity, Security and Public Service.",
      "A Fairer Britain, A Stronger Future."
    ],
    "Liberal Market Party": [
      "Free People. Strong Economy.",
      "Backing Enterprise, Protecting Freedom.",
      "Opportunity Through Freedom."
    ],
    "National Conservative Party": [
      "Secure Borders, Strong Britain.",
      "Put Britain First.",
      "Security, Sovereignty, Strength."
    ],
    "Conservative Reform Party": [
      "Common Sense Government.",
      "Lower Taxes, Safer Streets, Stronger Britain.",
      "Responsibility, Security, Renewal."
    ],
    "Liberal Centrist Party": [
      "Change With Competence.",
      "A New Centre For Britain.",
      "Practical Change, Honest Government."
    ],
    "Sovereigntist Reform Party": [
      "Take Back Britain's Future.",
      "Borders, Security, Sovereignty.",
      "A Strong Britain In Control."
    ],
    "Traditional Labour Movement": [
      "For Work, Family and Community.",
      "Rebuilding Britain's Working Communities.",
      "Security and Dignity For Working People."
    ],
    "Centrist Reform Party": [
      "A New Direction For Britain.",
      "Practical Change For A Better Britain.",
      "Serious Government, Real Results."
    ]
  };

  let slogans = sloganBank[type] || sloganBank["Centrist Reform Party"];

  if(has("Strong NHS")) slogans = ["Protect The NHS, Rebuild Britain.", ...slogans];
  if(has("Housing")) slogans = ["Homes, Hope and Renewal.", ...slogans];
  if(has("Economic Growth")) slogans = ["Growth For Every Region.", ...slogans];
  if(has("Law and Order")) slogans = ["Safe Streets, Strong Communities.", ...slogans];
  if(has("Climate Action")) slogans = ["Clean Energy, Fair Prosperity.", ...slogans];

  generatedSlogan = slogans[Math.floor(Math.random() * slogans.length)];

  const input = document.getElementById("partySloganInput");
  if(input){
    input.value = generatedSlogan;
    input.oninput = updateCampaignPosterPreview;
  }

  localStorage.setItem("customPartySlogan", generatedSlogan);
  updateCampaignPosterPreview();
}

function updateCampaignPosterPreview(){
  const input = document.getElementById("partySloganInput");
  const slogan = input ? input.value.trim() : generatedSlogan;

  const posterLogo = document.getElementById("posterLogo");
  const posterPartyName = document.getElementById("posterPartyName");
  const posterSlogan = document.getElementById("posterSlogan");
  const posterClassification = document.getElementById("posterClassification");

  if(posterLogo){
    posterLogo.textContent = customPartyDraft.logo || "+";
    posterLogo.style.background = customPartyDraft.colour || "#666666";
  }

  if(posterPartyName) posterPartyName.textContent = customPartyDraft.name || "Your Party";
  if(posterSlogan) posterSlogan.textContent = slogan || "Your slogan will appear here";
  if(posterClassification) posterClassification.textContent = generatedClassification?.name || "Party classification";
}

const oldSaveCustomPartyV6 = saveCustomParty;
saveCustomParty = function(){
  const sloganInput = document.getElementById("partySloganInput");

  if(!generatedClassification){
    alert("Please generate a party classification first.");
    return;
  }

  if(!sloganInput || !sloganInput.value.trim()){
    alert("Please enter or generate a party slogan.");
    return;
  }

  generatedSlogan = sloganInput.value.trim();

  customPartyDraft.classification = generatedClassification;
  customPartyDraft.slogan = generatedSlogan;

  localStorage.setItem("customPartyClassification", JSON.stringify(generatedClassification));
  localStorage.setItem("customPartySlogan", generatedSlogan);

  oldSaveCustomPartyV6();
};


let generatedMembership = null;

function openMembershipStep(){
  const sloganInput = document.getElementById("partySloganInput");

  if(!generatedClassification){
    alert("Please generate a party classification first.");
    return;
  }

  if(!sloganInput || !sloganInput.value.trim()){
    alert("Please enter or generate a party slogan.");
    return;
  }

  generatedSlogan = sloganInput.value.trim();
  localStorage.setItem("customPartySlogan", generatedSlogan);

  document.getElementById("classificationSloganStep").style.display = "none";
  document.getElementById("membershipStep").style.display = "flex";

  generateMembership();
}

function generateMembership(){
  const ideology = customPartyDraft.ideology || {
    economic: 50,
    social: 50,
    environmental: 50,
    international: 50
  };

  const values = selectedCoreValues || [];
  const classification = generatedClassification?.name || "Centrist Reform Party";

  let base = 4500;
  let reasons = [];

  if(classification.includes("Social Democratic") || classification.includes("Democratic Socialist")){
    base += 3500;
    reasons.push("left-wing parties often attract trade union, student and public service activists");
  }

  if(classification.includes("National Conservative") || classification.includes("Sovereigntist")){
    base += 3000;
    reasons.push("national reform movements can build strong activist support around sovereignty and borders");
  }

  if(classification.includes("Green")){
    base += 2500;
    reasons.push("climate-focused parties attract younger, urban and activist members");
  }

  if(classification.includes("Centrist") || classification.includes("Liberal")){
    base += 1200;
    reasons.push("moderate reform parties attract professionals and politically engaged swing voters");
  }

  if(values.includes("Strong NHS")) base += 1400;
  if(values.includes("Housing")) base += 1200;
  if(values.includes("Climate Action")) base += 1300;
  if(values.includes("Immigration Control")) base += 1300;
  if(values.includes("Law and Order")) base += 900;
  if(values.includes("Economic Growth")) base += 900;
  if(values.includes("Education")) base += 800;
  if(values.includes("Equality")) base += 900;
  if(values.includes("Free Speech")) base += 700;
  if(values.includes("Low Taxes")) base += 700;
  if(values.includes("Welfare Expansion")) base += 800;
  if(values.includes("National Security")) base += 700;

  const hqBoosts = {
    London: 2200,
    Birmingham: 1600,
    Manchester: 1700,
    Liverpool: 1300,
    Glasgow: 1400,
    Cardiff: 1000,
    Belfast: 850
  };

  base += hqBoosts[selectedHQ] || 1000;

  if(selectedFoundingMembers.deputy?.popularity > 78) base += 900;
  if(selectedFoundingMembers.chairman?.competence > 80) base += 1000;
  if(selectedFoundingMembers.campaign?.media > 80) base += 800;

  const variation = Math.floor(Math.random() * 2400) - 700;
  const finalMembership = Math.max(1200, base + variation);

  generatedMembership = {
    total: finalMembership,
    explanation: reasons.length
      ? reasons.join("; ") + "."
      : "your party begins with a modest but serious activist base.",
    headquartersBoost: selectedHQ,
    classification
  };

  document.getElementById("membershipNumber").textContent =
    finalMembership.toLocaleString("en-GB");

  document.getElementById("membershipExplanation").textContent =
    `${customPartyDraft.name} launches with ${finalMembership.toLocaleString("en-GB")} founding members.`;

  document.getElementById("membershipAppeal").textContent =
    `Membership strength is influenced by your ${classification} identity, your values of ${values.join(", ")}, your headquarters in ${selectedHQ}, and the quality of your founding team.`;

  localStorage.setItem("customPartyMembership", JSON.stringify(generatedMembership));
}

const oldSaveCustomPartyV7 = saveCustomParty;
saveCustomParty = function(){
  if(!generatedMembership){
    alert("Please generate party membership before creating your party.");
    return;
  }

  customPartyDraft.membership = generatedMembership;
  localStorage.setItem("customPartyMembership", JSON.stringify(generatedMembership));

  oldSaveCustomPartyV7();
};


let generatedPolling = null;

function openPollingStep(){
  if(!generatedMembership){
    alert("Generate party membership first.");
    return;
  }

  document.getElementById("membershipStep").style.display = "none";
  document.getElementById("pollingStep").style.display = "flex";
  generateInitialPolling();
}

function generateInitialPolling(){

  let polling = 1.0;

  const members = generatedMembership.total;

  polling += Math.min(4.5, members / 6000);

  const cls = generatedClassification?.name || "";

  if(cls.includes("Social Democratic")) polling += 1.0;
  if(cls.includes("National Conservative")) polling += 1.2;
  if(cls.includes("Green")) polling += 0.8;
  if(cls.includes("Centrist")) polling += 0.5;

  if(selectedCoreValues.includes("Housing")) polling += 0.4;
  if(selectedCoreValues.includes("Strong NHS")) polling += 0.4;
  if(selectedCoreValues.includes("Immigration Control")) polling += 0.5;
  if(selectedCoreValues.includes("Economic Growth")) polling += 0.3;

  polling += (Math.random() * 2.0);

  polling = Math.min(12, Math.max(1, polling));

  generatedPolling = {
    party: Number(polling.toFixed(1)),
    labour: 33.0,
    conservative: 25.0,
    reform: 15.0,
    libdem: 10.0,
    green: 6.0,
    others: 11.0
  };

  document.getElementById("pollingPercent").textContent =
    generatedPolling.party.toFixed(1) + "%";

  document.getElementById("pollingSummary").textContent =
    `${customPartyDraft.name} launches on ${generatedPolling.party.toFixed(1)}% nationally.`;

  document.getElementById("pollingBreakdown").innerHTML = `
    Labour: ${generatedPolling.labour}%<br>
    Conservative: ${generatedPolling.conservative}%<br>
    Reform UK: ${generatedPolling.reform}%<br>
    Liberal Democrats: ${generatedPolling.libdem}%<br>
    Green: ${generatedPolling.green}%<br>
    ${customPartyDraft.name}: ${generatedPolling.party.toFixed(1)}%
  `;

  localStorage.setItem("customPartyPolling", JSON.stringify(generatedPolling));
}

const oldSaveCustomPartyV8 = saveCustomParty;
saveCustomParty = function(){

  if(!generatedPolling){
    alert("Please generate initial polling.");
    return;
  }

  customPartyDraft.polling = generatedPolling;
  localStorage.setItem("customPartyPolling", JSON.stringify(generatedPolling));

  oldSaveCustomPartyV8();
};


function openFoundingCongress(){
  if(!generatedPolling){
    alert("Please generate initial polling first.");
    return;
  }

  document.getElementById("pollingStep").style.display = "none";
  document.getElementById("foundingCongressStep").style.display = "flex";

  renderFoundingCongress();
}

function renderFoundingCongress(){
  const partyName = customPartyDraft.name || "Your Party";
  const slogan = generatedSlogan || localStorage.getItem("customPartySlogan") || "A New Direction For Britain";
  const classification = generatedClassification?.name || "New Political Movement";
  const classificationText = generatedClassification?.explanation || "A new party enters British politics.";
  const logo = customPartyDraft.logo || "+";
  const colour = customPartyDraft.colour || "#666666";

  document.getElementById("congressPartyName").textContent = partyName;
  document.getElementById("congressSlogan").textContent = slogan;
  document.getElementById("congressLogo").textContent = logo;
  document.getElementById("congressLogo").style.background = colour;
  document.getElementById("congressClassification").textContent = classification;
  document.getElementById("congressLaunchText").textContent = classificationText;

  document.getElementById("congressTeam").innerHTML =
    `Deputy Leader: <strong>${selectedFoundingMembers.deputy?.name || "None"}</strong><br>
     Party Chairman: <strong>${selectedFoundingMembers.chairman?.name || "None"}</strong><br>
     Campaign Director: <strong>${selectedFoundingMembers.campaign?.name || "None"}</strong>`;

  document.getElementById("congressBase").innerHTML =
    `Headquarters: <strong>${selectedHQ || "Unknown"}</strong><br>
     Members: <strong>${generatedMembership?.total?.toLocaleString("en-GB") || "0"}</strong><br>
     Colour: <strong>${customPartyDraft.colourName || colour}</strong>`;

  document.getElementById("congressValues").textContent =
    selectedCoreValues.join(", ");

  document.getElementById("congressPolling").innerHTML =
    `${partyName}: <strong>${generatedPolling.party.toFixed(1)}%</strong><br>
     Labour: ${generatedPolling.labour}% | Conservative: ${generatedPolling.conservative}% | Reform UK: ${generatedPolling.reform}%`;

  const manifestoText = generatedManifesto
    ? `${generatedManifesto.opening} ${generatedManifesto.economy} ${generatedManifesto.society}`
    : "The party launches with a founding manifesto.";

  document.getElementById("congressManifesto").textContent = manifestoText;
}

const oldSaveCustomPartyV9 = saveCustomParty;
saveCustomParty = function(){
  customPartyDraft.foundingCongress = {
    launched: true,
    launchText: `${customPartyDraft.name} launches from ${selectedHQ} with ${generatedMembership?.total || 0} members and ${generatedPolling?.party || 0}% in the polls.`
  };

  localStorage.setItem("customPartyFoundingCongress", JSON.stringify(customPartyDraft.foundingCongress));

  oldSaveCustomPartyV9();
};


let generatedMediaReaction = null;

function openMediaReaction(){
  if(!generatedPolling){
    alert("Please complete the Founding Congress first.");
    return;
  }

  document.getElementById("foundingCongressStep").style.display = "none";
  document.getElementById("mediaReactionStep").style.display = "flex";

  generateMediaReaction();
}

function clampStat(value){
  return Math.max(15, Math.min(95, Math.round(value)));
}

function generateMediaReaction(){
  const partyName = customPartyDraft.name || "the new party";
  const classification = generatedClassification?.name || "new political movement";
  const polling = generatedPolling?.party || 1;
  const members = generatedMembership?.total || 1000;
  const values = selectedCoreValues || [];
  const hq = selectedHQ || "the UK";
  const slogan = generatedSlogan || localStorage.getItem("customPartySlogan") || "A New Direction For Britain";

  const has = (value) => values.includes(value);

  let excitement = 45 + polling * 3 + Math.min(15, members / 2500);
  let coverage = 42 + polling * 4 + (hq === "London" ? 10 : 4);
  let credibility = 42 + Math.min(20, members / 3000);
  let momentum = 40 + polling * 4;

  if(selectedFoundingMembers.deputy?.popularity > 75) excitement += 6;
  if(selectedFoundingMembers.chairman?.competence > 80) credibility += 7;
  if(selectedFoundingMembers.campaign?.media > 80) coverage += 7;
  if(has("Economic Growth")) credibility += 3;
  if(has("Strong NHS")) excitement += 3;
  if(has("Housing")) momentum += 3;
  if(has("Climate Action")) coverage += 3;
  if(has("Immigration Control")) coverage += 3;

  excitement = clampStat(excitement);
  coverage = clampStat(coverage);
  credibility = clampStat(credibility);
  momentum = clampStat(momentum);

  const bbc = `${partyName} has launched from ${hq}, promising ${values.slice(0,2).join(" and ").toLowerCase()}. Early polling places the party on ${polling.toFixed(1)}%, giving it a small but noticeable presence in national politics.`;

  let guardian = `${partyName}'s emphasis on ${values.join(", ").toLowerCase()} could appeal to younger and reform-minded voters, although questions remain over whether it can build a national campaign machine.`;
  if(has("Climate Action") || classification.includes("Green")) {
    guardian = `${partyName} has drawn attention with its climate and public service agenda, with analysts suggesting it could appeal to younger, urban and progressive voters.`;
  }

  let mail = `Critics have questioned whether ${partyName}'s promises are affordable, but supporters argue the party offers a fresh alternative to the established Westminster parties.`;
  if(has("Immigration Control") || classification.includes("National")) {
    mail = `${partyName}'s focus on borders, security and national renewal may appeal to voters frustrated with the political establishment, though opponents warn of divisive rhetoric.`;
  }

  const telegraph = `${partyName} faces an uphill battle against established parties despite a well-organised launch, a clear slogan — "${slogan}" — and a growing activist base.`;

  const sky = `Political analysts suggest ${partyName} could influence marginal seats if its early momentum continues, particularly with ${members.toLocaleString("en-GB")} members and ${polling.toFixed(1)}% support.`;

  const strengths = [];
  const weaknesses = [];
  const opportunities = [];
  const threats = [];

  if(members > 10000) strengths.push("strong membership base");
  else strengths.push("clear founding identity");

  if(credibility > 60) strengths.push("credible leadership team");
  if(values.length >= 5) strengths.push("broad policy appeal");
  if(polling >= 6) strengths.push("strong launch polling");

  weaknesses.push("limited national profile");
  if(polling < 5) weaknesses.push("low starting polling");
  if(coverage < 60) weaknesses.push("needs more media attention");
  weaknesses.push("unproven election machine");

  if(has("Housing")) opportunities.push("housing crisis");
  if(has("Strong NHS")) opportunities.push("NHS pressures");
  if(has("Economic Growth")) opportunities.push("regional growth agenda");
  if(has("Climate Action")) opportunities.push("green investment debate");
  if(has("Immigration Control")) opportunities.push("immigration and border debate");
  opportunities.push("voter dissatisfaction with established parties");

  if(classification.includes("Social") || classification.includes("Green")) threats.push("Labour competition");
  if(classification.includes("Conservative") || classification.includes("Sovereigntist")) threats.push("Conservative and Reform vote splitting");
  if(classification.includes("Liberal") || classification.includes("Centrist")) threats.push("Liberal Democrat competition");
  threats.push("hostile press scrutiny");
  threats.push("first-past-the-post barriers");

  const headlines = [
    `${partyName.toUpperCase()} ENTERS UK POLITICS`,
    `${partyName.toUpperCase()} LAUNCHES FROM ${hq.toUpperCase()}`,
    `${partyName.toUpperCase()} POLLS ${polling.toFixed(1)}% AFTER LAUNCH`,
    `"${slogan.toUpperCase()}" — NEW PARTY'S MESSAGE TO VOTERS`,
    `${classification.toUpperCase()} SEEKS BREAKTHROUGH`
  ];

  generatedMediaReaction = {
    outlets: {
      bbc,
      guardian,
      mail,
      telegraph,
      sky
    },
    stats: {
      publicExcitement: excitement,
      mediaCoverage: coverage,
      credibility,
      momentum
    },
    analysis: {
      strengths,
      weaknesses,
      opportunities,
      threats
    },
    headlines
  };

  document.getElementById("bbcReaction").textContent = bbc;
  document.getElementById("guardianReaction").textContent = guardian;
  document.getElementById("mailReaction").textContent = mail;
  document.getElementById("telegraphReaction").textContent = telegraph;
  document.getElementById("skyReaction").textContent = sky;

  document.getElementById("publicExcitement").textContent = excitement + "/100";
  document.getElementById("mediaCoverage").textContent = coverage + "/100";
  document.getElementById("credibilityScore").textContent = credibility + "/100";
  document.getElementById("momentumScore").textContent = momentum + "/100";

  document.getElementById("mediaStrengths").textContent = strengths.join(", ");
  document.getElementById("mediaWeaknesses").textContent = weaknesses.join(", ");
  document.getElementById("mediaOpportunities").textContent = opportunities.join(", ");
  document.getElementById("mediaThreats").textContent = threats.join(", ");
  document.getElementById("launchHeadlines").innerHTML = headlines.join("<br>");

  localStorage.setItem("customPartyMediaReaction", JSON.stringify(generatedMediaReaction));
}

const oldSaveCustomPartyV10 = saveCustomParty;
saveCustomParty = function(){
  if(!generatedMediaReaction){
    alert("Please generate the media reaction first.");
    return;
  }

  customPartyDraft.mediaReaction = generatedMediaReaction;
  localStorage.setItem("customPartyMediaReaction", JSON.stringify(generatedMediaReaction));

  oldSaveCustomPartyV10();
};


/* v2.7 colour screen fixed behaviour override */
const previousChooseCustomColourV27 = chooseCustomColour;
chooseCustomColour = function(colour, colourName) {
  const result = checkColourClash(colour);

  if (result.clashes) {
    alert(`That colour is too close to ${result.nearest.name}. Choose a more distinct colour so it does not clash on election maps.`);
    return;
  }

  customPartyDraft.colour = colour;
  customPartyDraft.colourName = colourName;

  document.querySelectorAll(".colour-fixed-option, .colour-option").forEach(button => {
    button.classList.remove("selected");
  });

  document.querySelectorAll(".colour-fixed-option").forEach(button => {
    if (button.textContent.trim() === colourName) {
      button.classList.add("selected");
    }
  });

  const previewBadge = document.querySelector("#partyColourStep .preview-badge");
  if (previewBadge) {
    previewBadge.style.background = colour;
  }

  const previewName = document.getElementById("previewPartyName");
  if (previewName) {
    previewName.textContent = customPartyDraft.name || "Your Party";
  }

  const previewColour = document.getElementById("previewColourName");
  if (previewColour) {
    previewColour.textContent = `${colourName} (${colour.toUpperCase()})`;
  }

  const mapPreview = document.querySelector(".colour-fixed-map-preview div");
  if (mapPreview) {
    mapPreview.style.setProperty("--selected-colour", colour);
  }

  if (document.getElementById("customColourInput")) {
    document.getElementById("customColourInput").value = colour;
    document.getElementById("customColourHex").value = colour.toUpperCase();
    previewColourSafety(colour);
  }
};


/* v2.8 logo screen fixed behaviour override */
const previousChooseCustomLogoV28 = chooseCustomLogo;
chooseCustomLogo = function(logo, logoName) {
  customPartyDraft.logo = logo;
  customPartyDraft.logoName = logoName;

  document.querySelectorAll(".logo-fixed-option, .logo-option").forEach(button => {
    button.classList.remove("selected");
  });

  document.querySelectorAll(".logo-fixed-option").forEach(button => {
    if (button.textContent.trim().includes(logoName)) {
      button.classList.add("selected");
    }
  });

  const badge = document.getElementById("finalLogoBadge");
  if (badge) {
    badge.textContent = logo;
    badge.style.background = customPartyDraft.colour || "#666666";
  }

  const campaignBadge = document.getElementById("campaignLogoIcon");
  if (campaignBadge) {
    campaignBadge.textContent = logo;
    campaignBadge.style.background = customPartyDraft.colour || "#666666";
  }

  const previewName = document.getElementById("finalPreviewPartyName");
  if (previewName) {
    previewName.textContent = customPartyDraft.name || "Your Party";
  }

  const campaignName = document.getElementById("campaignLogoPartyName");
  if (campaignName) {
    campaignName.textContent = customPartyDraft.name || "Your Party";
  }

  const details = document.getElementById("finalPreviewDetails");
  if (details) {
    details.textContent = `${logoName} logo with ${customPartyDraft.colourName || "selected"} party colour.`;
  }
};

const previousOpenLogoStepV28 = openLogoStep;
openLogoStep = function() {
  if (!customPartyDraft.colour) {
    alert("Please choose a party colour.");
    return;
  }

  document.getElementById("partyColourStep").style.display = "none";
  document.getElementById("partyLogoStep").style.display = "flex";

  const badge = document.getElementById("finalLogoBadge");
  const campaignBadge = document.getElementById("campaignLogoIcon");

  if (badge) {
    badge.style.background = customPartyDraft.colour || "#666666";
  }

  if (campaignBadge) {
    campaignBadge.style.background = customPartyDraft.colour || "#666666";
  }

  const previewName = document.getElementById("finalPreviewPartyName");
  if (previewName) {
    previewName.textContent = customPartyDraft.name || "Your Party";
  }

  const campaignName = document.getElementById("campaignLogoPartyName");
  if (campaignName) {
    campaignName.textContent = customPartyDraft.name || "Your Party";
  }

  const details = document.getElementById("finalPreviewDetails");
  if (details) {
    details.textContent = `${customPartyDraft.colourName || "Custom Colour"} party colour selected. Now choose a logo.`;
  }
};


/* v2.9 ideology screen fixed behaviour override */
function ideologyLabel(value, low, centre, high) {
  if (value < 35) return low;
  if (value > 65) return high;
  return centre;
}

const previousUpdateIdeologySummaryV29 = updateIdeologySummary;
updateIdeologySummary = function() {
  const economic = +document.getElementById("economicScale").value;
  const social = +document.getElementById("socialScale").value;
  const environmental = +document.getElementById("environmentScale").value;
  const international = +document.getElementById("internationalScale").value;

  let summary = "Centrist Party";

  if (environmental > 70 && social < 55) summary = "Green Progressive Party";
  else if (economic < 35 && social < 45) summary = "Democratic Socialist Party";
  else if (economic < 45 && social < 45) summary = "Social Democratic Party";
  else if (economic > 65 && social > 60 && international > 60) summary = "National Conservative Party";
  else if (economic > 65 && social < 45) summary = "Liberal Market Party";
  else if (economic > 60 && social > 55) summary = "Conservative Reform Party";
  else if (international > 70) summary = "Sovereigntist Reform Party";

  const summaryEl = document.getElementById("ideologySummary");
  if (summaryEl) summaryEl.textContent = summary;

  const economicLabel = document.getElementById("economicLabel");
  const socialLabel = document.getElementById("socialLabel");
  const environmentLabel = document.getElementById("environmentLabel");
  const internationalLabel = document.getElementById("internationalLabel");

  if (economicLabel) economicLabel.textContent = ideologyLabel(economic, "Left Economy", "Centrist Economy", "Right Economy");
  if (socialLabel) socialLabel.textContent = ideologyLabel(social, "Progressive", "Moderate Social Policy", "Conservative");
  if (environmentLabel) environmentLabel.textContent = ideologyLabel(environmental, "Low Climate Priority", "Balanced Green Policy", "Green Priority");
  if (internationalLabel) internationalLabel.textContent = ideologyLabel(international, "Globalist", "Balanced Foreign Policy", "Nationalist");

  const previewName = document.getElementById("ideologyPartyName");
  if (previewName) previewName.textContent = customPartyDraft.name || "Your Party";

  const previewLogo = document.getElementById("ideologyLogoPreview");
  if (previewLogo) {
    previewLogo.textContent = customPartyDraft.logo || "+";
    previewLogo.style.background = customPartyDraft.colour || "#666666";
  }
};

const previousOpenIdeologyStepV29 = openIdeologyStep;
openIdeologyStep = function() {
  if (!customPartyDraft.logo) {
    alert("Please choose a party logo.");
    return;
  }

  document.getElementById("partyLogoStep").style.display = "none";
  document.getElementById("partyIdeologyStep").style.display = "flex";

  ["economicScale","socialScale","environmentScale","internationalScale"].forEach(id => {
    const el = document.getElementById(id);
    if (el && !el.dataset.fixedListenerAdded) {
      el.addEventListener("input", updateIdeologySummary);
      el.dataset.fixedListenerAdded = "true";
    }
  });

  updateIdeologySummary();
};


/* v3.0 core values fixed behaviour override */
const previousOpenCoreValuesStepV30 = openCoreValuesStep;
openCoreValuesStep = function() {
  document.getElementById("partyIdeologyStep").style.display = "none";
  document.getElementById("coreValuesStep").style.display = "flex";
  updateCoreValuesSummary();
};

const previousToggleValueV30 = toggleValue;
toggleValue = function(button, value) {
  if (selectedCoreValues.includes(value)) {
    selectedCoreValues = selectedCoreValues.filter(v => v !== value);
    button.classList.remove("selected");
  } else {
    if (selectedCoreValues.length >= 6) {
      alert("You can choose a maximum of 6 core values.");
      return;
    }
    selectedCoreValues.push(value);
    button.classList.add("selected");
  }

  document.querySelectorAll(".core-fixed-btn").forEach(btn => {
    const text = btn.textContent.trim();
    btn.classList.toggle("selected", selectedCoreValues.includes(text));
  });

  updateCoreValuesSummary();
};

function updateCoreValuesSummary() {
  const count = document.getElementById("selectedValuesCount");
  const list = document.getElementById("selectedValuesList");
  const oldText = document.getElementById("selectedValuesText");

  if (count) {
    count.textContent = `${selectedCoreValues.length} / 6`;
  }

  if (list) {
    if (selectedCoreValues.length === 0) {
      list.textContent = "No values selected yet.";
    } else {
      list.innerHTML = selectedCoreValues
        .map(value => `<span class="selected-value-pill">${value}</span>`)
        .join("");
    }
  }

  if (oldText) {
    oldText.textContent = `Selected: ${selectedCoreValues.length} / 6 - ${selectedCoreValues.join(", ")}`;
  }
}



/* v3.1 founding members fixed behaviour override */
function populateFoundingMemberDropdowns() {
  const dropdowns = [
    { id: "deputySelect", role: "deputy", label: "Choose Deputy Leader" },
    { id: "chairmanSelect", role: "chairman", label: "Choose Party Chairman" },
    { id: "campaignSelect", role: "campaign", label: "Choose Campaign Director" }
  ];

  dropdowns.forEach(drop => {
    const select = document.getElementById(drop.id);
    if (!select) return;

    const currentValue = select.value;
    select.innerHTML = `<option value="">${drop.label}</option>`;

    foundingCandidates.forEach(candidate => {
      const option = document.createElement("option");
      option.value = candidate.name;
      option.textContent = `${candidate.name} — ${candidate.trait}`;
      select.appendChild(option);
    });

    select.value = currentValue;
  });
}

function selectFoundingMemberFromDropdown(role, candidateName) {
  if (!candidateName) {
    selectedFoundingMembers[role] = null;
  } else {
    selectedFoundingMembers[role] = foundingCandidates.find(c => c.name === candidateName) || null;
  }

  updateFoundingMemberFixedPreviews();
}

function formatMemberPreview(member) {
  if (!member) return "No one selected.";

  return `<strong>${member.name}</strong> — ${member.trait}<br>
  Loyalty: ${member.loyalty} | Competence: ${member.competence} | Popularity: ${member.popularity}<br>
  Ambition: ${member.ambition} | Media Skill: ${member.media}`;
}

function updateFoundingMemberFixedPreviews() {
  const deputyPreview = document.getElementById("deputyPreview");
  const chairmanPreview = document.getElementById("chairmanPreview");
  const campaignPreview = document.getElementById("campaignPreview");

  if (deputyPreview) deputyPreview.innerHTML = formatMemberPreview(selectedFoundingMembers.deputy);
  if (chairmanPreview) chairmanPreview.innerHTML = formatMemberPreview(selectedFoundingMembers.chairman);
  if (campaignPreview) campaignPreview.innerHTML = formatMemberPreview(selectedFoundingMembers.campaign);

  const deputy = selectedFoundingMembers.deputy?.name || "None";
  const chairman = selectedFoundingMembers.chairman?.name || "None";
  const campaign = selectedFoundingMembers.campaign?.name || "None";

  const summary = document.getElementById("foundingTeamSummary");
  if (summary) {
    summary.innerHTML = `Deputy Leader: <strong>${deputy}</strong><br>
    Party Chairman: <strong>${chairman}</strong><br>
    Campaign Director: <strong>${campaign}</strong>`;
  }
}

const previousOpenFoundingMembersStepV31 = openFoundingMembersStep;
openFoundingMembersStep = function() {
  if (selectedCoreValues.length < 3) {
    alert("Please select at least 3 core values.");
    return;
  }

  document.getElementById("coreValuesStep").style.display = "none";
  document.getElementById("foundingMembersStep").style.display = "flex";

  populateFoundingMemberDropdowns();
  updateFoundingMemberFixedPreviews();
};



/* v3.2 headquarters fixed behaviour override */
const hqEffects = {
  London: "Strong national media access and donor visibility.",
  Birmingham: "Stronger appeal across the Midlands and a balanced national image.",
  Manchester: "Improved support across northern England and urban regions.",
  Liverpool: "Boosts urban, working-class and activist support.",
  Glasgow: "Improves Scottish presence and devolved politics coverage.",
  Cardiff: "Improves Welsh support and regional credibility.",
  Belfast: "Improves Northern Ireland visibility and union/devolution debate coverage."
};

const previousSelectHQV32 = selectHQ;
selectHQ = function(city, button) {
  selectedHQ = city;

  document.querySelectorAll(".hq-fixed-btn, .hq-btn").forEach(btn => {
    btn.classList.remove("selected");
  });

  if (button) {
    button.classList.add("selected");
  }

  const summary = document.getElementById("hqSummary");
  if (summary) summary.textContent = city;

  const effect = document.getElementById("hqEffectText");
  if (effect) effect.textContent = hqEffects[city] || "Regional campaign base selected.";
};

const previousOpenHeadquartersStepV32 = openHeadquartersStep;
openHeadquartersStep = function() {
  if (!selectedFoundingMembers.deputy || !selectedFoundingMembers.chairman || !selectedFoundingMembers.campaign) {
    alert("Please choose all founding members.");
    return;
  }

  document.getElementById("foundingMembersStep").style.display = "none";
  document.getElementById("headquartersStep").style.display = "flex";
};


/* v3.3 classification screen clean behaviour */
const previousUpdateCampaignPosterPreviewV33 = updateCampaignPosterPreview;
updateCampaignPosterPreview = function() {
  const input = document.getElementById("partySloganInput");
  const slogan = input ? input.value.trim() : generatedSlogan;

  const posterLogo = document.getElementById("posterLogo");
  const posterPartyName = document.getElementById("posterPartyName");
  const posterSlogan = document.getElementById("posterSlogan");
  const posterClassification = document.getElementById("posterClassification");

  if (posterLogo) {
    posterLogo.textContent = customPartyDraft.logo || "+";
    posterLogo.style.background = customPartyDraft.colour || "#666666";
  }

  if (posterPartyName) posterPartyName.textContent = customPartyDraft.name || "Your Party";
  if (posterSlogan) posterSlogan.textContent = slogan || "Your slogan will appear here";
  if (posterClassification) posterClassification.textContent = generatedClassification?.name || "Party classification";
};



/* v3.4 clean automatic membership behaviour */
function membershipFactor(text, type = "positive") {
  return `<div class="membership-factor ${type === "negative" ? "negative" : ""}">
    <span>${text}</span>
    <strong>${type === "negative" ? "Negative" : "Positive"}</strong>
  </div>`;
}

const previousGenerateMembershipV34 = generateMembership;
generateMembership = function() {
  const ideology = customPartyDraft.ideology || {
    economic: 50,
    social: 50,
    environmental: 50,
    international: 50
  };

  const values = selectedCoreValues || [];
  const classification = generatedClassification?.name || "Centrist Reform Party";

  let base = 4500;
  const factors = [];

  if (classification.includes("Social Democratic") || classification.includes("Democratic Socialist")) {
    base += 3500;
    factors.push(membershipFactor("Strong activist and public service appeal"));
  }

  if (classification.includes("National Conservative") || classification.includes("Sovereigntist")) {
    base += 3000;
    factors.push(membershipFactor("Clear national reform message"));
  }

  if (classification.includes("Green")) {
    base += 2500;
    factors.push(membershipFactor("Strong climate activist appeal"));
  }

  if (classification.includes("Centrist") || classification.includes("Liberal")) {
    base += 1200;
    factors.push(membershipFactor("Moderate reform platform"));
  }

  const valueBoosts = {
    "Strong NHS": 1400,
    "Housing": 1200,
    "Climate Action": 1300,
    "Immigration Control": 1300,
    "Law and Order": 900,
    "Economic Growth": 900,
    "Education": 800,
    "Equality": 900,
    "Free Speech": 700,
    "Low Taxes": 700,
    "Welfare Expansion": 800,
    "National Security": 700
  };

  values.forEach(value => {
    base += valueBoosts[value] || 0;
  });

  if (values.includes("Strong NHS") || values.includes("Housing")) {
    factors.push(membershipFactor("Strong NHS and housing focus"));
  }

  if (values.includes("Economic Growth")) {
    factors.push(membershipFactor("Growth message attracts donors and volunteers"));
  }

  if (values.includes("Law and Order") || values.includes("National Security")) {
    factors.push(membershipFactor("Security agenda attracts older voters"));
  }

  const hqBoosts = {
    London: 2200,
    Birmingham: 1600,
    Manchester: 1700,
    Liverpool: 1300,
    Glasgow: 1400,
    Cardiff: 1000,
    Belfast: 850
  };

  base += hqBoosts[selectedHQ] || 1000;
  factors.push(membershipFactor(`${selectedHQ || "Regional"} headquarters gives an early base`));

  if (selectedFoundingMembers.deputy?.popularity > 78) {
    base += 900;
    factors.push(membershipFactor("Popular deputy leader"));
  }

  if (selectedFoundingMembers.chairman?.competence > 80) {
    base += 1000;
    factors.push(membershipFactor("Competent party chairman"));
  }

  if (selectedFoundingMembers.campaign?.media > 80) {
    base += 800;
    factors.push(membershipFactor("Strong media campaign team"));
  }

  factors.push(membershipFactor("New party with limited national recognition", "negative"));

  const variation = Math.floor(Math.random() * 900) - 250;
  const finalMembership = Math.max(1200, base + variation);

  const momentum = Math.max(25, Math.min(92, Math.round(42 + finalMembership / 420 + (generatedPolling?.party || 3) * 2)));
  const volunteers = Math.max(150, Math.round(finalMembership * 0.19));
  const branches = Math.max(8, Math.round(finalMembership / 650));
  const activist = Math.max(20, Math.min(95, Math.round(momentum * 0.85 + selectedFoundingMembers.campaign?.competence * 0.12)));

  generatedMembership = {
    total: finalMembership,
    explanation: `${customPartyDraft.name} launches with ${finalMembership.toLocaleString("en-GB")} founding members.`,
    headquartersBoost: selectedHQ,
    classification,
    momentum,
    volunteers,
    branches,
    activist
  };

  document.getElementById("membershipNumber").textContent = finalMembership.toLocaleString("en-GB");
  document.getElementById("membershipExplanation").textContent =
    `This is your estimated starting membership after launch, based on your party profile.`;

  const factorsEl = document.getElementById("membershipFactors");
  if (factorsEl) {
    factorsEl.innerHTML = factors.slice(0, 6).join("");
  }

  const momentumEl = document.getElementById("membershipMomentum");
  if (momentumEl) momentumEl.textContent = momentum;

  const momentumText = document.getElementById("membershipMomentumText");
  if (momentumText) {
    momentumText.textContent = momentum >= 70 ? "Strong launch momentum." : momentum >= 50 ? "Moderate launch momentum." : "Limited launch momentum.";
  }

  const volunteerEl = document.getElementById("volunteerNetwork");
  const branchesEl = document.getElementById("localBranches");
  const activistEl = document.getElementById("activistStrength");

  if (volunteerEl) volunteerEl.textContent = volunteers.toLocaleString("en-GB");
  if (branchesEl) branchesEl.textContent = branches.toLocaleString("en-GB");
  if (activistEl) activistEl.textContent = `${activist}/100`;

  const posterLogo = document.getElementById("membershipPosterLogo");
  const posterName = document.getElementById("membershipPosterName");
  const posterSlogan = document.getElementById("membershipPosterSlogan");
  const posterClass = document.getElementById("membershipPosterClass");

  if (posterLogo) {
    posterLogo.textContent = customPartyDraft.logo || "+";
    posterLogo.style.background = customPartyDraft.colour || "#666666";
  }

  const posterCard = document.querySelector(".membership-poster-card");
  if (posterCard) {
    posterCard.style.background = `linear-gradient(160deg, ${customPartyDraft.colour || "#7B2CBF"}88, rgba(0,0,0,0.30))`;
  }

  if (posterName) posterName.textContent = customPartyDraft.name || "Your Party";
  if (posterSlogan) posterSlogan.textContent = generatedSlogan || localStorage.getItem("customPartySlogan") || "A New Direction For Britain";
  if (posterClass) posterClass.textContent = classification;

  localStorage.setItem("customPartyMembership", JSON.stringify(generatedMembership));
};

const previousOpenMembershipStepV34 = openMembershipStep;
openMembershipStep = function() {
  const sloganInput = document.getElementById("partySloganInput");

  if (!generatedClassification) {
    alert("Please generate a party classification first.");
    return;
  }

  if (!sloganInput || !sloganInput.value.trim()) {
    alert("Please enter or generate a party slogan.");
    return;
  }

  generatedSlogan = sloganInput.value.trim();
  localStorage.setItem("customPartySlogan", generatedSlogan);

  document.getElementById("classificationSloganStep").style.display = "none";
  document.getElementById("membershipStep").style.display = "flex";

  generateMembership();
};



/* v3.5 clean automatic polling behaviour */
function pollingFactor(text, type = "positive") {
  return `<div class="polling-factor ${type === "negative" ? "negative" : ""}">
    <span>${text}</span>
    <strong>${type === "negative" ? "Drag" : "Boost"}</strong>
  </div>`;
}

function renderPollingRow(name, value, colour, max = 40) {
  const width = Math.max(3, Math.min(100, (value / max) * 100));
  return `<div class="polling-row">
    <span>${name}</span>
    <div class="polling-bar-track">
      <div class="polling-bar-fill" style="--poll-width:${width}%;--poll-colour:${colour};"></div>
    </div>
    <span>${Number(value).toFixed(1)}%</span>
  </div>`;
}

const previousGenerateInitialPollingV35 = generateInitialPolling;
generateInitialPolling = function() {
  let polling = 1.0;
  const factors = [];

  const members = generatedMembership?.total || 3000;
  polling += Math.min(4.5, members / 6000);

  const cls = generatedClassification?.name || "";

  if (cls.includes("Social Democratic")) {
    polling += 1.0;
    factors.push(pollingFactor("Social democratic positioning has broad appeal"));
  }
  if (cls.includes("National Conservative")) {
    polling += 1.2;
    factors.push(pollingFactor("National conservative message has a clear voter base"));
  }
  if (cls.includes("Green")) {
    polling += 0.8;
    factors.push(pollingFactor("Green identity attracts activist support"));
  }
  if (cls.includes("Centrist")) {
    polling += 0.5;
    factors.push(pollingFactor("Centrist reform message appeals to swing voters"));
  }

  if (selectedCoreValues.includes("Housing")) {
    polling += 0.4;
    factors.push(pollingFactor("Housing is a high-salience issue"));
  }
  if (selectedCoreValues.includes("Strong NHS")) {
    polling += 0.4;
    factors.push(pollingFactor("NHS focus increases mainstream appeal"));
  }
  if (selectedCoreValues.includes("Immigration Control")) {
    polling += 0.5;
    factors.push(pollingFactor("Immigration message attracts attention"));
  }
  if (selectedCoreValues.includes("Economic Growth")) {
    polling += 0.3;
    factors.push(pollingFactor("Economic growth message improves credibility"));
  }

  if (members < 5000) {
    factors.push(pollingFactor("Limited activist base", "negative"));
  } else {
    factors.push(pollingFactor("Membership gives campaign visibility"));
  }

  factors.push(pollingFactor("First-past-the-post makes new party breakthroughs difficult", "negative"));

  polling += (Math.random() * 1.0);
  polling = Math.min(12, Math.max(1, polling));

  const partyPoll = Number(polling.toFixed(1));

  generatedPolling = {
    party: partyPoll,
    labour: 33.0,
    conservative: 25.0,
    reform: 15.0,
    libdem: 10.0,
    green: 6.0,
    others: Math.max(0, Number((11.0 - partyPoll / 2).toFixed(1)))
  };

  document.getElementById("pollingPercent").textContent = partyPoll.toFixed(1) + "%";
  document.getElementById("pollingSummary").textContent =
    `${customPartyDraft.name} launches on ${partyPoll.toFixed(1)}% nationally.`;

  const factorsEl = document.getElementById("pollingFactors");
  if (factorsEl) {
    factorsEl.innerHTML = factors.slice(0, 6).join("");
  }

  const pollingBreakdown = document.getElementById("pollingBreakdown");
  if (pollingBreakdown) {
    pollingBreakdown.innerHTML = [
      renderPollingRow(customPartyDraft.name || "Your Party", partyPoll, customPartyDraft.colour || "#7B2CBF"),
      renderPollingRow("Labour", generatedPolling.labour, "#d50000"),
      renderPollingRow("Conservative", generatedPolling.conservative, "#0087dc"),
      renderPollingRow("Reform UK", generatedPolling.reform, "#12b6cf"),
      renderPollingRow("Lib Dems", generatedPolling.libdem, "#faa61a"),
      renderPollingRow("Green", generatedPolling.green, "#6ab023")
    ].join("");
  }

  const posterLogo = document.getElementById("pollingPosterLogo");
  const posterName = document.getElementById("pollingPosterName");
  const posterSlogan = document.getElementById("pollingPosterSlogan");
  const posterClass = document.getElementById("pollingPosterClass");

  if (posterLogo) {
    posterLogo.textContent = customPartyDraft.logo || "+";
    posterLogo.style.background = customPartyDraft.colour || "#666666";
  }

  const posterCard = document.querySelector(".polling-poster-card");
  if (posterCard) {
    posterCard.style.background = `linear-gradient(160deg, ${customPartyDraft.colour || "#7B2CBF"}88, rgba(0,0,0,0.30))`;
  }

  if (posterName) posterName.textContent = customPartyDraft.name || "Your Party";
  if (posterSlogan) posterSlogan.textContent = generatedSlogan || localStorage.getItem("customPartySlogan") || "A New Direction For Britain";
  if (posterClass) posterClass.textContent = generatedClassification?.name || "New Political Movement";

  localStorage.setItem("customPartyPolling", JSON.stringify(generatedPolling));
};

const previousOpenPollingStepV35 = openPollingStep;
openPollingStep = function() {
  if (!generatedMembership) {
    alert("Membership must be calculated first.");
    return;
  }

  document.getElementById("membershipStep").style.display = "none";
  document.getElementById("pollingStep").style.display = "flex";
  generateInitialPolling();
};



/* v3.6 clean founding congress render override */
const previousRenderFoundingCongressV36 = renderFoundingCongress;
renderFoundingCongress = function() {
  const partyName = customPartyDraft.name || "Your Party";
  const slogan = generatedSlogan || localStorage.getItem("customPartySlogan") || "A New Direction For Britain";
  const classification = generatedClassification?.name || "New Political Movement";
  const classificationText = generatedClassification?.explanation || "A new party enters British politics.";
  const logo = customPartyDraft.logo || "+";
  const colour = customPartyDraft.colour || "#666666";

  document.getElementById("congressPartyName").textContent = partyName;
  document.getElementById("congressSlogan").textContent = slogan;
  document.getElementById("congressLogo").textContent = logo;
  document.getElementById("congressLogo").style.background = colour;
  document.getElementById("congressClassification").textContent = classification;
  document.getElementById("congressLaunchText").textContent = classificationText;

  const partyCard = document.querySelector(".congress-party-card");
  if (partyCard) {
    partyCard.style.background = `linear-gradient(160deg, ${colour}66, rgba(0,0,0,0.32))`;
  }

  document.getElementById("congressTeam").innerHTML =
    `Deputy Leader:<br><strong>${selectedFoundingMembers.deputy?.name || "None"}</strong><br><br>
     Party Chairman:<br><strong>${selectedFoundingMembers.chairman?.name || "None"}</strong><br><br>
     Campaign Director:<br><strong>${selectedFoundingMembers.campaign?.name || "None"}</strong>`;

  document.getElementById("congressBase").innerHTML =
    `Headquarters:<br><strong>${selectedHQ || "Unknown"}</strong><br><br>
     Members:<br><strong>${generatedMembership?.total?.toLocaleString("en-GB") || "0"}</strong><br><br>
     Colour:<br><strong>${customPartyDraft.colourName || colour}</strong>`;

  document.getElementById("congressValues").innerHTML =
    `<div class="congress-values-list">${
      selectedCoreValues.map(value => `<div class="congress-value-item">${value}</div>`).join("")
    }</div>`;

  document.getElementById("congressPolling").innerHTML =
    `<span class="congress-poll-number">${generatedPolling.party.toFixed(1)}%</span>
     Initial national polling based on your party profile and public environment.`;

  const manifestoText = generatedManifesto
    ? `${generatedManifesto.opening} ${generatedManifesto.economy}`
    : "The party launches with a founding manifesto.";

  document.getElementById("congressManifesto").textContent = manifestoText;
};

const previousOpenFoundingCongressV36 = openFoundingCongress;
openFoundingCongress = function() {
  if (!generatedPolling) {
    alert("Please complete initial polling first.");
    return;
  }

  document.getElementById("pollingStep").style.display = "none";
  document.getElementById("foundingCongressStep").style.display = "flex";
  renderFoundingCongress();
};



/* v3.7 clean media reaction render additions */
const previousGenerateMediaReactionV37 = generateMediaReaction;
generateMediaReaction = function() {
  previousGenerateMediaReactionV37();

  const posterLogo = document.getElementById("mediaPosterLogo");
  const posterName = document.getElementById("mediaPosterName");
  const posterSlogan = document.getElementById("mediaPosterSlogan");
  const finalCard = document.querySelector(".media-final-card");

  if (posterLogo) {
    posterLogo.textContent = customPartyDraft.logo || "+";
    posterLogo.style.background = customPartyDraft.colour || "#666666";
  }

  if (posterName) posterName.textContent = customPartyDraft.name || "Your Party";
  if (posterSlogan) posterSlogan.textContent = generatedSlogan || localStorage.getItem("customPartySlogan") || "A New Direction For Britain";

  if (finalCard) {
    finalCard.style.background = `linear-gradient(160deg, ${customPartyDraft.colour || "#7B2CBF"}88, rgba(0,0,0,0.30))`;
  }

  const headlinesEl = document.getElementById("launchHeadlines");
  if (headlinesEl && generatedMediaReaction?.headlines) {
    headlinesEl.innerHTML = generatedMediaReaction.headlines
      .map(headline => `<div class="headline-item">${headline}</div>`)
      .join("");
  }
};



/* v3.8 Party HQ Dashboard interactive system */
let hqState = {
  week: 1,
  year: 2029,
  pollingHistory: [],
  funds: 2800000,
  mps: 0,
  completedTasks: 0,
  news: [],
  tasks: []
};

function startPartyHq() {
  buildInitialHqState();
  document.querySelectorAll(".screen, .hq-screen, section").forEach(screen => {
    if (screen.id !== "partyHqScreen") screen.style.display = "none";
  });
  document.getElementById("partyHqScreen").style.display = "grid";
  renderHqDashboard();
}

const previousSaveCustomPartyV38 = saveCustomParty;
saveCustomParty = function() {
  if (typeof generatedMediaReaction !== "undefined" && !generatedMediaReaction) {
    alert("Please complete the media reaction first.");
    return;
  }

  customPartyDraft.mediaReaction = generatedMediaReaction;
  localStorage.setItem("customPartyMediaReaction", JSON.stringify(generatedMediaReaction || {}));
  localStorage.setItem("customPartyFinal", JSON.stringify(customPartyDraft));

  startPartyHq();
};

function buildInitialHqState() {
  const polling = generatedPolling?.party || 4.5;
  const members = generatedMembership?.total || 10000;

  hqState.week = 1;
  hqState.year = 2029;
  hqState.pollingHistory = [
    Math.max(1, polling - 1.4),
    Math.max(1, polling - 0.9),
    Math.max(1, polling - 0.4),
    polling
  ];
  hqState.funds = Math.max(350000, Math.round((generatedMembership?.total || members) * 180));
  hqState.mps = 0;
  hqState.completedTasks = 0;

  hqState.news = [
    { title: "New party launches nationally", text: `${customPartyDraft.name} begins its first week after launch.` },
    { title: "Membership passes launch target", text: `${members.toLocaleString("en-GB")} members join the party.` },
    { title: "Analysts watch early polling", text: `Early national polling puts the party on ${polling.toFixed(1)}%.` }
  ];

  hqState.tasks = [
    { id: "launch-rally", title: `Hold launch rally in ${selectedHQ || "your HQ"}`, impact: "High Impact", done: false },
    { id: "recruit-candidates", title: "Recruit 5 new candidates", impact: "High Impact", done: false },
    { id: "bbc-interview", title: "Give BBC interview", impact: "Medium Impact", done: false },
    { id: "fundraiser", title: "Attend business fundraiser", impact: "Medium Impact", done: false },
    { id: "local-offices", title: "Set up local offices", impact: "Low Impact", done: false }
  ];
}

function renderHqDashboard() {
  const name = customPartyDraft.name || "Your Party";
  const logo = customPartyDraft.logo || "+";
  const colour = customPartyDraft.colour || "#7B2CBF";
  const classification = generatedClassification?.name || customPartyDraft.classification?.name || "New Political Movement";
  const polling = hqState.pollingHistory[hqState.pollingHistory.length - 1] || generatedPolling?.party || 0;
  const members = generatedMembership?.total || 0;

  document.getElementById("hqPartyLogo").textContent = logo;
  document.getElementById("hqPartyLogo").style.background = colour;
  document.getElementById("hqPartyName").textContent = name;
  document.getElementById("hqPartyClass").textContent = classification;
  document.getElementById("hqWelcome").innerHTML = `Welcome back. You are leading <strong style="color:${colour}">${name}</strong>.`;

  document.getElementById("hqPolling").textContent = polling.toFixed(1) + "%";
  document.getElementById("hqPollingLarge").textContent = polling.toFixed(1) + "%";
  document.getElementById("hqMembers").textContent = members.toLocaleString("en-GB");
  document.getElementById("hqFunds").textContent = formatMoney(hqState.funds);
  document.getElementById("hqMps").textContent = hqState.mps;
  document.getElementById("hqWeek").textContent = hqState.week;

  document.getElementById("hqResourceMembers").textContent = members.toLocaleString("en-GB");
  document.getElementById("hqResourceFunds").textContent = formatMoney(hqState.funds);
  document.getElementById("hqResourceMps").textContent = hqState.mps;

  renderHqPollingLine();
  renderHqNews();
  renderHqTasks();
  renderHqPollingBreakdown();
}

function formatMoney(value) {
  if (value >= 1000000) return "£" + (value / 1000000).toFixed(1) + "m";
  if (value >= 1000) return "£" + Math.round(value / 1000) + "k";
  return "£" + value;
}

function renderHqPollingLine() {
  const history = hqState.pollingHistory.slice(-5);
  const points = history.map((value, index) => {
    const x = 20 + index * (380 / Math.max(1, history.length - 1));
    const y = 145 - Math.min(120, value * 10);
    return `${x},${y}`;
  }).join(" ");
  document.getElementById("hqPollingLine").setAttribute("points", points);
}

function renderHqNews() {
  const feed = document.getElementById("hqNewsFeed");
  feed.innerHTML = hqState.news.slice(0, 5).map(item => `
    <button class="hq-news-item" onclick="openNewsStory('${item.title.replace(/'/g, "\\'")}')">
      <strong>${item.title}</strong>
      <p>${item.text}</p>
    </button>
  `).join("");
}

function renderHqTasks() {
  const list = document.getElementById("hqTaskList");
  list.innerHTML = hqState.tasks.map(task => `
    <label class="hq-task-item">
      <input type="checkbox" ${task.done ? "checked" : ""} onchange="toggleTask('${task.id}')">
      <div>
        <strong>${task.title}</strong>
        <p>${task.done ? "Completed" : "Due this week"}</p>
      </div>
      <span class="hq-task-impact">${task.impact}</span>
    </label>
  `).join("");
}

function renderHqPollingBreakdown() {
  const partyPoll = hqState.pollingHistory[hqState.pollingHistory.length - 1] || 0;
  const rows = [
    [customPartyDraft.name || "Your Party", partyPoll, customPartyDraft.colour || "#7B2CBF"],
    ["Labour", 33, "#d50000"],
    ["Conservative", 25, "#0087dc"],
    ["Reform UK", 15, "#12b6cf"],
    ["Lib Dems", 10, "#faa61a"],
    ["Green", 6, "#6ab023"]
  ];

  document.getElementById("hqPollingBreakdown").innerHTML = rows.map(([name, val, col]) => `
    <div class="hq-bar-row">
      <span>${name}</span>
      <div class="hq-bar-track"><div class="hq-bar-fill" style="--w:${Math.min(100, val * 2.5)}%;--c:${col};"></div></div>
      <strong>${Number(val).toFixed(1)}%</strong>
    </div>
  `).join("");
}

function toggleTask(id) {
  const task = hqState.tasks.find(t => t.id === id);
  if (!task) return;
  task.done = !task.done;

  if (task.done) {
    hqState.completedTasks += 1;
    const last = hqState.pollingHistory[hqState.pollingHistory.length - 1];
    hqState.pollingHistory[hqState.pollingHistory.length - 1] = Number((last + 0.1).toFixed(1));
    if (generatedMembership) generatedMembership.total += 120;
    hqState.news.unshift({ title: "Task completed", text: `${task.title} improves party momentum.` });
  }

  renderHqDashboard();
}

function runQuickAction(type) {
  const last = hqState.pollingHistory[hqState.pollingHistory.length - 1];
  let msg = "";
  if (type === "rally") {
    hqState.pollingHistory[hqState.pollingHistory.length - 1] = Number((last + 0.2).toFixed(1));
    if (generatedMembership) generatedMembership.total += 350;
    hqState.funds -= 65000;
    msg = "Launch rally boosts visibility and membership.";
  }
  if (type === "interview") {
    hqState.pollingHistory[hqState.pollingHistory.length - 1] = Number((last + 0.15).toFixed(1));
    msg = "TV interview improves national recognition.";
  }
  if (type === "fundraiser") {
    hqState.funds += 320000;
    msg = "Fundraiser brings in new donations.";
  }
  if (type === "policy") {
    hqState.pollingHistory[hqState.pollingHistory.length - 1] = Number((last + 0.1).toFixed(1));
    msg = "Policy speech gives the party more credibility.";
  }
  if (type === "candidates") {
    hqState.news.unshift({ title: "Candidate recruitment begins", text: "New local organisers begin searching for target-seat candidates." });
    msg = "Candidate recruitment network expanded.";
  }

  hqState.news.unshift({ title: "Quick action completed", text: msg });
  renderHqDashboard();
}

function endWeek() {
  const last = hqState.pollingHistory[hqState.pollingHistory.length - 1] || 1;
  const completed = hqState.tasks.filter(t => t.done).length;
  const gain = 0.05 + completed * 0.12 + Math.random() * 0.25;
  const newPolling = Number((last + gain).toFixed(1));

  hqState.pollingHistory.push(newPolling);
  hqState.week += 1;

  if (generatedMembership) {
    generatedMembership.total += Math.round(250 + completed * 180 + Math.random() * 300);
  }

  hqState.funds += Math.round(120000 + (generatedMembership?.total || 10000) * 2.5);

  hqState.news.unshift({
    title: `Week ${hqState.week} polling update`,
    text: `${customPartyDraft.name} rises to ${newPolling.toFixed(1)}% nationally.`
  });

  hqState.tasks = [
    { id: "regional-tour-" + hqState.week, title: "Regional campaign tour", impact: "High Impact", done: false },
    { id: "policy-briefing-" + hqState.week, title: "Release policy briefing", impact: "Medium Impact", done: false },
    { id: "candidate-selection-" + hqState.week, title: "Select target seat candidates", impact: "High Impact", done: false },
    { id: "media-round-" + hqState.week, title: "Sunday politics interview", impact: "Medium Impact", done: false }
  ];

  renderHqDashboard();
}

function openNewsStory(title) {
  openHqSection("news");
  document.getElementById("hqDetailTitle").textContent = title;
  document.getElementById("hqDetailContent").innerHTML = `
    <div class="hq-detail-card">
      <h3>${title}</h3>
      <p>This story is affecting your party's visibility. Future updates will allow you to respond directly to stories with interviews, press releases or policy changes.</p>
      <button onclick="runQuickAction('interview')">Respond with Interview</button>
    </div>
  `;
}

function openHqSection(section) {
  document.querySelectorAll(".hq-nav button").forEach(btn => btn.classList.remove("active"));
  const labels = {
    dashboard: "Party HQ Dashboard",
    campaign: "Campaign HQ",
    media: "Media Centre",
    policy: "Policy Unit",
    candidates: "Candidate Recruitment",
    party: "Party Management",
    finance: "Finance Office",
    research: "Research Department",
    map: "UK Campaign Map",
    polling: "Polling Centre",
    calendar: "Calendar",
    news: "News Story"
  };

  if (section === "dashboard") {
    document.getElementById("hqDashboardView").classList.add("active");
    document.getElementById("hqDetailView").classList.remove("active");
    const dashBtn = Array.from(document.querySelectorAll(".hq-nav button")).find(b => b.textContent.includes("Dashboard"));
    if (dashBtn) dashBtn.classList.add("active");
    return;
  }

  document.getElementById("hqDashboardView").classList.remove("active");
  document.getElementById("hqDetailView").classList.add("active");
  document.getElementById("hqDetailTitle").textContent = labels[section] || "Section";
  document.getElementById("hqDetailContent").innerHTML = getHqSectionContent(section);
}

function getHqSectionContent(section) {
  const content = {
    campaign: [
      ["Launch Rally", "Organise rallies in target regions to increase members and polling.", "Run Rally", "rally"],
      ["Target Seats", "Build a future target-seat list for the election campaign.", "Scout Seats", "candidates"]
    ],
    media: [
      ["TV Interview", "Go on national television to improve credibility and recognition.", "Book Interview", "interview"],
      ["Press Office", "Prepare daily lines and respond to attacks from rival parties.", "Prepare Lines", "policy"]
    ],
    policy: [
      ["Policy Speech", "Announce a detailed policy to gain credibility.", "Give Speech", "policy"],
      ["Manifesto Review", "Review the manifesto generated during party creation.", "Open Manifesto", "policy"]
    ],
    candidates: [
      ["Recruit Candidates", "Find candidates for winnable and target constituencies.", "Recruit", "candidates"],
      ["Selection Battles", "Manage local party selections and candidate loyalty.", "Review", "candidates"]
    ],
    party: [
      ["Membership Drive", "Increase membership with local campaigning and online outreach.", "Launch Drive", "rally"],
      ["Leadership Team", "Review your deputy, chairman and campaign director.", "Review Team", "policy"]
    ],
    finance: [
      ["Fundraiser", "Host a fundraising event with donors and supporters.", "Run Fundraiser", "fundraiser"],
      ["Spending Review", "Control campaign spending and protect cash reserves.", "Review Budget", "fundraiser"]
    ],
    research: [
      ["Focus Group", "Run research on voters' priorities.", "Run Focus Group", "policy"],
      ["Issue Tracking", "Track the most important issues this week.", "Track Issues", "policy"]
    ],
    map: [
      ["Regional Map", "View regional membership and polling. Interactive map will be expanded next.", "Open Map", "rally"],
      ["Campaign Offices", "Set up offices in key regions to improve performance.", "Set Up Office", "fundraiser"]
    ],
    polling: [
      ["National Poll", "Your current national polling is shown on the dashboard.", "Commission Poll", "policy"],
      ["Demographics", "See which voter groups are moving towards your party.", "Research Voters", "policy"]
    ],
    calendar: [
      ["This Week", "Complete weekly tasks then end the week to progress.", "End Week", "endWeek"],
      ["Upcoming Events", "Future version will add interviews, by-elections and conferences.", "Review Events", "policy"]
    ]
  };

  const cards = content[section] || [["Coming Soon", "This section will be expanded in the next update.", "Back", "dashboard"]];

  return cards.map(([title, text, button, action]) => `
    <div class="hq-detail-card">
      <h3>${title}</h3>
      <p>${text}</p>
      <button onclick="${action === "endWeek" ? "endWeek()" : action === "dashboard" ? "openHqSection('dashboard')" : `runQuickAction('${action}')`}">${button}</button>
    </div>
  `).join("");
}



/* v3.9 dashboard blank screen fix */
function ensureHqDefaults() {
  if (!window.customPartyDraft) window.customPartyDraft = {};
  if (!window.generatedMembership) {
    window.generatedMembership = { total: 10000 };
  }
  if (!window.generatedPolling) {
    window.generatedPolling = { party: 4.5, labour: 33, conservative: 25, reform: 15, libdem: 10, green: 6 };
  }
  if (!window.generatedClassification) {
    window.generatedClassification = { name: customPartyDraft.classification?.name || "New Political Movement" };
  }
}

const previousStartPartyHqV39 = typeof startPartyHq === "function" ? startPartyHq : null;
startPartyHq = function() {
  ensureHqDefaults();

  if (!hqState || !hqState.pollingHistory || hqState.pollingHistory.length === 0) {
    buildInitialHqState();
  } else {
    buildInitialHqState();
  }

  document.querySelectorAll(".screen, section, .hq-screen").forEach(el => {
    el.style.display = "none";
  });

  const hq = document.getElementById("partyHqScreen");
  if (!hq) {
    alert("Party HQ screen could not be found. Please use the latest fixed ZIP.");
    return;
  }

  hq.style.display = "grid";
  document.body.style.overflow = "auto";

  const dashboard = document.getElementById("hqDashboardView");
  const detail = document.getElementById("hqDetailView");
  if (dashboard) dashboard.classList.add("active");
  if (detail) detail.classList.remove("active");

  renderHqDashboard();
};

const previousSaveCustomPartyV39 = typeof saveCustomParty === "function" ? saveCustomParty : null;
saveCustomParty = function() {
  try {
    localStorage.setItem("customPartyFinal", JSON.stringify(customPartyDraft || {}));
    if (typeof generatedMediaReaction !== "undefined") {
      localStorage.setItem("customPartyMediaReaction", JSON.stringify(generatedMediaReaction || {}));
    }
  } catch (error) {
    console.warn("Could not save party data", error);
  }

  startPartyHq();
};



/* v4.0 Interactive news feed and dashboard command centre */
let hqPoliticalEnvironment = {
  economy: "Weak",
  nhs: "Top Issue",
  immigration: "Rising Concern",
  governmentApproval: 38,
  mediaMood: "Curious"
};

let hqUpcomingEvents = [];
let hqNewsIdCounter = 1;

function createNewsItem(source, title, text, priority, choices) {
  return {
    id: "news-" + (hqNewsIdCounter++),
    source,
    title,
    text,
    priority,
    time: hqState.week === 1 ? "Today" : `Week ${hqState.week}`,
    choices,
    resolved: false
  };
}

function generateOpeningDashboardNews() {
  hqState.news = [
    createNewsItem(
      "BBC",
      "New political movement enters Westminster conversation",
      `${customPartyDraft.name || "Your party"} launches with early polling momentum and a growing membership base.`,
      "major",
      [
        { label: "Give Interview", effect: "interview" },
        { label: "Push Slogan", effect: "members" },
        { label: "Stay Quiet", effect: "safe" }
      ]
    ),
    createNewsItem(
      "Sky News",
      "Labour dismisses new challenge",
      "Senior Labour figures say the new party is unlikely to break through under first-past-the-post.",
      "breaking",
      [
        { label: "Counter Attack", effect: "attack" },
        { label: "Look Serious", effect: "credibility" },
        { label: "Ignore", effect: "safe" }
      ]
    ),
    createNewsItem(
      "The Guardian",
      "Membership surge after launch",
      `Activists report strong early interest after the party's founding congress in ${selectedHQ || "its headquarters"}.`,
      "positive",
      [
        { label: "Celebrate", effect: "members" },
        { label: "Membership Drive", effect: "membersBig" },
        { label: "Thank Volunteers", effect: "credibility" }
      ]
    ),
    createNewsItem(
      "The Times",
      "Business leaders watch new party carefully",
      "Donors are interested, but want to see whether the party can become electorally serious.",
      "routine",
      [
        { label: "Meet Donors", effect: "funds" },
        { label: "Economic Speech", effect: "credibility" },
        { label: "Reject Big Donors", effect: "members" }
      ]
    )
  ];
}

function generateDashboardNews() {
  const partyName = customPartyDraft.name || "Your Party";
  const storyBank = [
    createNewsItem("BBC", "Voters want practical solutions", `${partyName} is gaining attention among voters frustrated with the main parties.`, "positive", [
      { label: "Accept Interview", effect: "interview" },
      { label: "Release Plan", effect: "policy" },
      { label: "Ignore", effect: "safe" }
    ]),
    createNewsItem("Sky News", "Presenter questions your spending plans", "Your manifesto is being challenged over cost and delivery.", "major", [
      { label: "Defend Plans", effect: "credibility" },
      { label: "Attack Rivals", effect: "attack" },
      { label: "Clarify Policy", effect: "policy" }
    ]),
    createNewsItem("Daily Mail", "Border policy faces scrutiny", "Commentators ask whether your party is serious enough on immigration and security.", "major", [
      { label: "Toughen Line", effect: "polling" },
      { label: "Balanced Response", effect: "credibility" },
      { label: "Ignore", effect: "safe" }
    ]),
    createNewsItem("The Guardian", "Young voters interested in new party", "Polling suggests younger voters are open to a new political alternative.", "positive", [
      { label: "Youth Campaign", effect: "membersBig" },
      { label: "Climate Speech", effect: "policy" },
      { label: "Campus Tour", effect: "members" }
    ]),
    createNewsItem("The Telegraph", "Donors ask for economic credibility", "Business figures want more detail before committing major funds.", "routine", [
      { label: "Meet Donors", effect: "funds" },
      { label: "Tax Speech", effect: "credibility" },
      { label: "Decline", effect: "safe" }
    ])
  ];

  hqState.news.unshift(storyBank[Math.floor(Math.random() * storyBank.length)]);
  renderHqDashboard();
}

function renderHqNews() {
  const feed = document.getElementById("hqNewsFeed");
  if (!feed) return;

  feed.innerHTML = hqState.news.slice(0, 12).map(item => {
    if (!item.choices) {
      return `
        <div class="hq-news-card routine">
          <div class="hq-news-meta">
            <span class="hq-news-source">HQ</span>
            <span class="hq-news-priority">${item.time || "Today"}</span>
          </div>
          <h4>${item.title}</h4>
          <p>${item.text}</p>
        </div>
      `;
    }

    return `
      <div class="hq-news-card ${item.priority || "routine"} ${item.resolved ? "hq-news-resolved" : ""}">
        <div class="hq-news-meta">
          <span class="hq-news-source">${item.source}</span>
          <span class="hq-news-priority">${item.priority === "breaking" ? "Breaking" : item.priority === "major" ? "Major" : item.priority === "positive" ? "Positive" : "Routine"} • ${item.time}</span>
        </div>
        <h4>${item.title}</h4>
        <p>${item.text}</p>
        <div class="hq-news-actions">
          ${item.choices.map((choice, idx) => `<button onclick="respondToNews('${item.id}', ${idx})">${choice.label}</button>`).join("")}
        </div>
      </div>
    `;
  }).join("");
}

function respondToNews(newsId, choiceIndex) {
  const story = hqState.news.find(item => item.id === newsId);
  if (!story || story.resolved) return;

  const choice = story.choices[choiceIndex];
  story.resolved = true;
  story.text += ` You chose: ${choice.label}.`;

  applyNewsEffect(choice.effect, story.title);
  renderHqDashboard();
}

function applyNewsEffect(effect, title) {
  const last = hqState.pollingHistory[hqState.pollingHistory.length - 1] || generatedPolling?.party || 4;
  let message = "";

  if (effect === "interview") {
    hqState.pollingHistory[hqState.pollingHistory.length - 1] = Number((last + 0.2).toFixed(1));
    message = "Your media appearance improves national recognition.";
  } else if (effect === "attack") {
    hqState.pollingHistory[hqState.pollingHistory.length - 1] = Number((last + 0.15).toFixed(1));
    hqPoliticalEnvironment.mediaMood = "Combative";
    message = "Your attack gets attention but raises the political temperature.";
  } else if (effect === "credibility") {
    hqState.pollingHistory[hqState.pollingHistory.length - 1] = Number((last + 0.1).toFixed(1));
    hqPoliticalEnvironment.mediaMood = "Respectful";
    message = "Your response improves credibility with commentators.";
  } else if (effect === "members") {
    if (generatedMembership) generatedMembership.total += 300;
    message = "Your response increases activist enthusiasm.";
  } else if (effect === "membersBig") {
    if (generatedMembership) generatedMembership.total += 850;
    hqState.funds += 45000;
    message = "A major membership push brings new activists and small donations.";
  } else if (effect === "funds") {
    hqState.funds += 300000;
    message = "Donor interest increases party funds.";
  } else if (effect === "policy") {
    hqState.pollingHistory[hqState.pollingHistory.length - 1] = Number((last + 0.12).toFixed(1));
    hqPoliticalEnvironment.mediaMood = "Policy-focused";
    message = "A policy-focused response improves seriousness.";
  } else if (effect === "polling") {
    hqState.pollingHistory[hqState.pollingHistory.length - 1] = Number((last + 0.18).toFixed(1));
    message = "The line cuts through with some voters.";
  } else {
    message = "You avoid risk, but gain little momentum.";
  }

  hqState.news.unshift({
    title: "Reaction logged",
    text: message,
    time: `Week ${hqState.week}`
  });
}

function renderPoliticalEnvironment() {
  const box = document.getElementById("hqPoliticalEnvironment");
  if (!box) return;

  box.innerHTML = `
    <div class="hq-env-row"><span>Economy</span><strong>${hqPoliticalEnvironment.economy}</strong></div>
    <div class="hq-env-row"><span>NHS</span><strong>${hqPoliticalEnvironment.nhs}</strong></div>
    <div class="hq-env-row"><span>Immigration</span><strong>${hqPoliticalEnvironment.immigration}</strong></div>
    <div class="hq-env-row"><span>Government Approval</span><strong>${hqPoliticalEnvironment.governmentApproval}%</strong></div>
    <div class="hq-env-row"><span>Media Mood</span><strong>${hqPoliticalEnvironment.mediaMood}</strong></div>
  `;
}

function renderUpcomingEvents() {
  const box = document.getElementById("hqUpcomingEvents");
  if (!box) return;

  if (!hqUpcomingEvents.length) {
    hqUpcomingEvents = [
      { title: "BBC Politics Live Interview", time: "In 3 days", type: "Media Opportunity" },
      { title: `${selectedHQ || "Regional"} Local Rally`, time: "In 1 week", type: "Campaign Event" },
      { title: "Policy Announcement", time: "In 2 weeks", type: "Major Event" }
    ];
  }

  box.innerHTML = hqUpcomingEvents.map((event, idx) => `
    <button class="hq-event-row" onclick="openEventDetails(${idx})">
      <span>${event.title}<br><small>${event.type}</small></span>
      <strong>${event.time}</strong>
    </button>
  `).join("");
}

function openEventDetails(index) {
  const event = hqUpcomingEvents[index];
  if (!event) return;

  openHqSection("calendar");
  document.getElementById("hqDetailTitle").textContent = event.title;
  document.getElementById("hqDetailContent").innerHTML = `
    <div class="hq-detail-card">
      <h3>${event.title}</h3>
      <p>${event.type}. This event can affect polling, membership and media coverage depending on how you prepare.</p>
      <button onclick="runQuickAction('interview')">Prepare Media Lines</button>
      <button onclick="runQuickAction('rally')">Mobilise Volunteers</button>
    </div>
  `;
}

const previousBuildInitialHqStateV40 = buildInitialHqState;
buildInitialHqState = function() {
  previousBuildInitialHqStateV40();
  generateOpeningDashboardNews();
  hqUpcomingEvents = [
    { title: "BBC Politics Live Interview", time: "In 3 days", type: "Media Opportunity" },
    { title: `${selectedHQ || "Regional"} Local Rally`, time: "In 1 week", type: "Campaign Event" },
    { title: "Policy Announcement", time: "In 2 weeks", type: "Major Event" }
  ];
};

const previousRenderHqDashboardV40 = renderHqDashboard;
renderHqDashboard = function() {
  previousRenderHqDashboardV40();
  renderPoliticalEnvironment();
  renderUpcomingEvents();
};

const previousEndWeekV40 = endWeek;
endWeek = function() {
  previousEndWeekV40();

  if (Math.random() > 0.35) {
    generateDashboardNews();
  }

  hqPoliticalEnvironment.governmentApproval = Math.max(22, Math.min(55, hqPoliticalEnvironment.governmentApproval + Math.round(Math.random() * 4 - 2)));
  renderHqDashboard();
};



/* v4.1 definitive Party HQ engine */
let fixedHq = {
  week: 1,
  year: 2029,
  pollingHistory: [3.8, 4.4, 5.1, 5.7],
  funds: 2800000,
  mps: 0,
  newsId: 1,
  news: [],
  tasks: [],
  events: [],
  environment: {
    economy: "Weak",
    nhs: "Top Issue",
    immigration: "Rising Concern",
    approval: 38,
    mood: "Curious"
  }
};

function fixedMoney(value) {
  if (value >= 1000000) return "£" + (value / 1000000).toFixed(1) + "m";
  if (value >= 1000) return "£" + Math.round(value / 1000) + "k";
  return "£" + value;
}

function getPartyNameSafe() {
  return customPartyDraft?.name || "Your Party";
}

function getPartyColourSafe() {
  return customPartyDraft?.colour || "#7B2CBF";
}

function getPartyLogoSafe() {
  return customPartyDraft?.logo || "+";
}

function getPartyClassSafe() {
  return generatedClassification?.name || customPartyDraft?.classification?.name || "New Political Movement";
}

function createFixedNews(source, title, text, priority, choices) {
  return {
    id: "fixed-news-" + fixedHq.newsId++,
    source,
    title,
    text,
    priority,
    time: fixedHq.week === 1 ? "Today" : "Week " + fixedHq.week,
    choices,
    resolved: false
  };
}

function initFixedHq() {
  const poll = Number((generatedPolling?.party || 5.2).toFixed(1));
  const members = generatedMembership?.total || 14310;

  fixedHq.week = 1;
  fixedHq.year = 2029;
  fixedHq.pollingHistory = [
    Math.max(1, poll - 1.3),
    Math.max(1, poll - 0.8),
    Math.max(1, poll - 0.2),
    poll
  ];
  fixedHq.funds = Math.max(500000, Math.round(members * 180));
  fixedHq.mps = 0;
  fixedHq.newsId = 1;

  fixedHq.tasks = [
    { id: "launch-rally", title: "Hold launch rally", impact: "High Impact", done: false },
    { id: "recruit-candidates", title: "Recruit 5 new candidates", impact: "High Impact", done: false },
    { id: "bbc-interview", title: "Give BBC interview", impact: "Medium Impact", done: false },
    { id: "fundraiser", title: "Attend business fundraiser", impact: "Medium Impact", done: false },
    { id: "local-office", title: "Set up local offices", impact: "Low Impact", done: false }
  ];

  fixedHq.events = [
    { title: "BBC Politics Live Interview", time: "In 3 days", type: "Media Opportunity" },
    { title: (selectedHQ || "Regional") + " Local Rally", time: "In 1 week", type: "Campaign Event" },
    { title: "Policy Announcement", time: "In 2 weeks", type: "Major Event" }
  ];

  fixedHq.news = [
    createFixedNews("BBC", "New political movement enters Westminster conversation", getPartyNameSafe() + " launches with early polling momentum and a growing membership base.", "major", [
      { label: "Give Interview", effect: "interview" },
      { label: "Push Slogan", effect: "members" },
      { label: "Stay Quiet", effect: "safe" }
    ]),
    createFixedNews("Sky News", "Labour dismisses new challenge", "Senior Labour figures say the new party is unlikely to break through under first-past-the-post.", "breaking", [
      { label: "Counter Attack", effect: "attack" },
      { label: "Look Serious", effect: "credibility" },
      { label: "Ignore", effect: "safe" }
    ]),
    createFixedNews("The Guardian", "Membership surge after launch", "Activists report strong early interest after the founding congress.", "positive", [
      { label: "Celebrate", effect: "members" },
      { label: "Membership Drive", effect: "membersBig" },
      { label: "Thank Volunteers", effect: "credibility" }
    ]),
    createFixedNews("The Times", "Business leaders watch new party carefully", "Donors are interested, but want to see whether the party can become electorally serious.", "routine", [
      { label: "Meet Donors", effect: "funds" },
      { label: "Economic Speech", effect: "credibility" },
      { label: "Reject Big Donors", effect: "members" }
    ])
  ];
}

function startPartyHq() {
  initFixedHq();

  document.querySelectorAll("section, .screen").forEach(el => {
    el.style.display = "none";
  });

  const hq = document.getElementById("partyHqScreen");
  hq.style.display = "grid";
  document.body.style.overflow = "auto";
  showDashboardHome();
  renderFixedHq();
}

function saveCustomParty() {
  try {
    localStorage.setItem("customPartyFinal", JSON.stringify(customPartyDraft || {}));
  } catch(e) {}
  startPartyHq();
}

function renderFixedHq() {
  const name = getPartyNameSafe();
  const colour = getPartyColourSafe();
  const logo = getPartyLogoSafe();
  const classification = getPartyClassSafe();
  const members = generatedMembership?.total || 14310;
  const polling = fixedHq.pollingHistory[fixedHq.pollingHistory.length - 1];

  const logoEl = document.getElementById("hqPartyLogo");
  if (logoEl) {
    logoEl.textContent = logo;
    logoEl.style.background = colour;
  }

  document.getElementById("hqPartyName").textContent = name;
  document.getElementById("hqPartyClass").textContent = classification;
  document.getElementById("hqWelcome").innerHTML = `Welcome back. You are leading <strong style="color:${colour}">${name}</strong>.`;

  document.getElementById("hqPolling").textContent = polling.toFixed(1) + "%";
  document.getElementById("hqPollingLarge").textContent = polling.toFixed(1) + "%";
  document.getElementById("hqMembers").textContent = members.toLocaleString("en-GB");
  document.getElementById("hqFunds").textContent = fixedMoney(fixedHq.funds);
  document.getElementById("hqMps").textContent = fixedHq.mps;
  document.getElementById("hqWeek").textContent = fixedHq.week;

  document.getElementById("hqResourceMembers").textContent = members.toLocaleString("en-GB");
  document.getElementById("hqResourceFunds").textContent = fixedMoney(fixedHq.funds);
  document.getElementById("hqResourceMps").textContent = fixedHq.mps;

  renderFixedPollingLine();
  renderFixedNews();
  renderFixedTasks();
  renderFixedPollingBreakdown();
  renderFixedEnvironment();
  renderFixedEvents();
}

function renderFixedPollingLine() {
  const history = fixedHq.pollingHistory.slice(-5);
  const points = history.map((value, index) => {
    const x = 20 + index * (380 / Math.max(1, history.length - 1));
    const y = 130 - Math.min(105, value * 9);
    return `${x},${y}`;
  }).join(" ");
  const line = document.getElementById("hqPollingLine");
  if (line) line.setAttribute("points", points);
}

function renderFixedNews() {
  const feed = document.getElementById("hqNewsFeed");
  if (!feed) return;

  feed.innerHTML = fixedHq.news.slice(0, 12).map(item => `
    <article class="fixed-news-item ${item.priority || "routine"} ${item.resolved ? "resolved" : ""}">
      <div class="fixed-news-meta">
        <span>${item.source}</span>
        <span>${item.priority === "breaking" ? "Breaking" : item.priority === "major" ? "Major" : item.priority === "positive" ? "Positive" : "Routine"} • ${item.time}</span>
      </div>
      <h4>${item.title}</h4>
      <p>${item.text}</p>
      <div class="fixed-news-actions">
        ${(item.choices || []).map((choice, idx) => `<button onclick="respondToFixedNews('${item.id}', ${idx})">${choice.label}</button>`).join("")}
      </div>
    </article>
  `).join("");
}

function respondToFixedNews(newsId, index) {
  const story = fixedHq.news.find(n => n.id === newsId);
  if (!story || story.resolved) return;

  const choice = story.choices[index];
  story.resolved = true;
  story.text += " You chose: " + choice.label + ".";
  applyFixedEffect(choice.effect);
  renderFixedHq();
}

function applyFixedEffect(effect) {
  const lastIndex = fixedHq.pollingHistory.length - 1;
  const last = fixedHq.pollingHistory[lastIndex];

  if (effect === "interview") fixedHq.pollingHistory[lastIndex] = Number((last + 0.2).toFixed(1));
  if (effect === "attack") fixedHq.pollingHistory[lastIndex] = Number((last + 0.15).toFixed(1));
  if (effect === "credibility") fixedHq.pollingHistory[lastIndex] = Number((last + 0.1).toFixed(1));
  if (effect === "members" && generatedMembership) generatedMembership.total += 300;
  if (effect === "membersBig" && generatedMembership) generatedMembership.total += 850;
  if (effect === "funds") fixedHq.funds += 300000;
  if (effect === "safe") fixedHq.funds += 25000;

  fixedHq.news.unshift(createFixedNews("HQ", "Decision response recorded", "Your decision has affected the party's momentum and resources.", "routine", []));
}

function renderFixedTasks() {
  const list = document.getElementById("hqTaskList");
  if (!list) return;

  list.innerHTML = fixedHq.tasks.map(task => `
    <label class="fixed-task-item">
      <input type="checkbox" ${task.done ? "checked" : ""} onchange="toggleFixedTask('${task.id}')">
      <div>
        <strong>${task.title}</strong>
        <p>${task.done ? "Completed" : "Due this week"}</p>
      </div>
      <span class="fixed-task-impact">${task.impact}</span>
    </label>
  `).join("");
}

function toggleFixedTask(id) {
  const task = fixedHq.tasks.find(t => t.id === id);
  if (!task) return;
  task.done = !task.done;

  if (task.done) {
    applyFixedEffect("members");
    fixedHq.news.unshift(createFixedNews("HQ", "Task completed", task.title + " improves party momentum.", "positive", []));
  }

  renderFixedHq();
}

function renderFixedPollingBreakdown() {
  const partyPoll = fixedHq.pollingHistory[fixedHq.pollingHistory.length - 1];
  const rows = [
    [getPartyNameSafe(), partyPoll, getPartyColourSafe()],
    ["Labour", 33, "#d50000"],
    ["Conservative", 25, "#0087dc"],
    ["Reform UK", 15, "#12b6cf"],
    ["Lib Dems", 10, "#faa61a"],
    ["Green", 6, "#6ab023"]
  ];

  document.getElementById("hqPollingBreakdown").innerHTML = rows.map(([name, val, col]) => `
    <div class="fixed-bar-row">
      <span>${name}</span>
      <div class="fixed-bar-track"><div class="fixed-bar-fill" style="--w:${Math.min(100, val * 2.5)}%;--c:${col};"></div></div>
      <strong>${Number(val).toFixed(1)}%</strong>
    </div>
  `).join("");
}

function renderFixedEnvironment() {
  document.getElementById("hqPoliticalEnvironment").innerHTML = `
    <div class="fixed-env-row"><span>Economy</span><strong>${fixedHq.environment.economy}</strong></div>
    <div class="fixed-env-row"><span>NHS</span><strong>${fixedHq.environment.nhs}</strong></div>
    <div class="fixed-env-row"><span>Immigration</span><strong>${fixedHq.environment.immigration}</strong></div>
    <div class="fixed-env-row"><span>Government Approval</span><strong>${fixedHq.environment.approval}%</strong></div>
    <div class="fixed-env-row"><span>Media Mood</span><strong>${fixedHq.environment.mood}</strong></div>
  `;
}

function renderFixedEvents() {
  document.getElementById("hqUpcomingEvents").innerHTML = fixedHq.events.map((event, idx) => `
    <button class="fixed-event-row" onclick="openFixedEvent(${idx})">
      <span>${event.title}<br><small>${event.type}</small></span>
      <strong>${event.time}</strong>
    </button>
  `).join("");
}

function generateDashboardNews() {
  const party = getPartyNameSafe();
  const stories = [
    createFixedNews("BBC", "Voters want practical solutions", `${party} is gaining attention among voters frustrated with the main parties.`, "positive", [
      { label: "Accept Interview", effect: "interview" },
      { label: "Release Plan", effect: "credibility" },
      { label: "Ignore", effect: "safe" }
    ]),
    createFixedNews("Sky News", "Presenter questions your spending plans", "Your manifesto is being challenged over cost and delivery.", "major", [
      { label: "Defend Plans", effect: "credibility" },
      { label: "Attack Rivals", effect: "attack" },
      { label: "Clarify Policy", effect: "credibility" }
    ]),
    createFixedNews("The Guardian", "Young voters interested in new party", "Polling suggests younger voters are open to a new political alternative.", "positive", [
      { label: "Youth Campaign", effect: "membersBig" },
      { label: "Climate Speech", effect: "credibility" },
      { label: "Campus Tour", effect: "members" }
    ]),
    createFixedNews("The Telegraph", "Donors ask for economic credibility", "Business figures want more detail before committing major funds.", "routine", [
      { label: "Meet Donors", effect: "funds" },
      { label: "Tax Speech", effect: "credibility" },
      { label: "Decline", effect: "safe" }
    ])
  ];

  fixedHq.news.unshift(stories[Math.floor(Math.random() * stories.length)]);
  renderFixedHq();
}

function runQuickAction(type) {
  const lastIndex = fixedHq.pollingHistory.length - 1;
  const last = fixedHq.pollingHistory[lastIndex];
  let text = "Action completed.";

  if (type === "rally") {
    fixedHq.pollingHistory[lastIndex] = Number((last + 0.2).toFixed(1));
    if (generatedMembership) generatedMembership.total += 350;
    fixedHq.funds -= 65000;
    text = "Launch rally boosts visibility and membership.";
  }
  if (type === "interview") {
    fixedHq.pollingHistory[lastIndex] = Number((last + 0.15).toFixed(1));
    text = "TV interview improves national recognition.";
  }
  if (type === "fundraiser") {
    fixedHq.funds += 320000;
    text = "Fundraiser brings in new donations.";
  }
  if (type === "policy") {
    fixedHq.pollingHistory[lastIndex] = Number((last + 0.1).toFixed(1));
    text = "Policy speech improves credibility.";
  }
  if (type === "candidates") {
    text = "Candidate recruitment network expanded.";
  }

  fixedHq.news.unshift(createFixedNews("HQ", "Quick action completed", text, "positive", []));
  renderFixedHq();
}

function endWeek() {
  const completed = fixedHq.tasks.filter(t => t.done).length;
  const last = fixedHq.pollingHistory[fixedHq.pollingHistory.length - 1];
  const gain = 0.05 + completed * 0.08 + Math.random() * 0.22;

  fixedHq.pollingHistory.push(Number((last + gain).toFixed(1)));
  fixedHq.week += 1;
  fixedHq.funds += Math.round(120000 + (generatedMembership?.total || 10000) * 2.2);

  if (generatedMembership) {
    generatedMembership.total += Math.round(250 + completed * 160 + Math.random() * 300);
  }

  fixedHq.environment.approval = Math.max(22, Math.min(55, fixedHq.environment.approval + Math.round(Math.random() * 4 - 2)));

  fixedHq.tasks = [
    { id: "regional-tour-" + fixedHq.week, title: "Regional campaign tour", impact: "High Impact", done: false },
    { id: "policy-briefing-" + fixedHq.week, title: "Release policy briefing", impact: "Medium Impact", done: false },
    { id: "candidate-selection-" + fixedHq.week, title: "Select target seat candidates", impact: "High Impact", done: false },
    { id: "media-round-" + fixedHq.week, title: "Sunday politics interview", impact: "Medium Impact", done: false }
  ];

  fixedHq.news.unshift(createFixedNews("HQ", `Week ${fixedHq.week} begins`, `${getPartyNameSafe()} enters a new political week with fresh opportunities.`, "major", []));
  generateDashboardNews();
  renderFixedHq();
}

function showDashboardHome() {
  document.querySelectorAll(".fixed-hq-nav").forEach(btn => btn.classList.remove("active"));
  const first = document.querySelector(".fixed-hq-nav");
  if (first) first.classList.add("active");
  document.getElementById("fixedDashboardHome").style.display = "grid";
  document.getElementById("fixedDashboardDetail").style.display = "none";
}

function openHqSection(section) {
  if (section === "dashboard") {
    showDashboardHome();
    return;
  }

  document.getElementById("fixedDashboardHome").style.display = "none";
  document.getElementById("fixedDashboardDetail").style.display = "block";

  const titles = {
    campaign: "Campaign HQ",
    media: "Media Centre",
    policy: "Policy Unit",
    candidates: "Candidate Recruitment",
    party: "Party Management",
    finance: "Finance Office",
    research: "Research Department",
    map: "UK Campaign Map",
    polling: "Polling Centre",
    calendar: "Calendar"
  };

  document.getElementById("hqDetailTitle").textContent = titles[section] || "Section";

  const contentMap = {
    campaign: [["Hold Rally", "Boost local visibility and membership.", "Run Rally", "rally"], ["Target Seats", "Start preparing key constituencies.", "Scout Seats", "candidates"]],
    media: [["TV Interview", "Improve recognition and credibility.", "Book Interview", "interview"], ["Press Response", "Respond to hostile coverage.", "Prepare Lines", "policy"]],
    policy: [["Policy Speech", "Release serious policy detail.", "Give Speech", "policy"], ["Manifesto Review", "Review founding manifesto.", "Review", "policy"]],
    candidates: [["Recruit Candidates", "Find candidates for key seats.", "Recruit", "candidates"], ["Selection Battles", "Manage candidate loyalty.", "Review", "candidates"]],
    party: [["Membership Drive", "Grow activists and volunteers.", "Launch Drive", "rally"], ["Leadership Team", "Review senior figures.", "Review", "policy"]],
    finance: [["Fundraiser", "Meet donors and raise money.", "Run Fundraiser", "fundraiser"], ["Spending Review", "Protect campaign funds.", "Review Budget", "fundraiser"]],
    research: [["Focus Group", "Discover voter priorities.", "Run Focus Group", "policy"], ["Issue Tracking", "Track NHS, economy and immigration.", "Track", "policy"]],
    map: [["Regional Map", "Regional campaign map will be expanded next.", "Open Map", "rally"], ["Campaign Offices", "Set up local offices.", "Set Up Office", "fundraiser"]],
    polling: [["National Poll", "Commission a detailed national poll.", "Commission Poll", "policy"], ["Demographics", "Research voter groups.", "Research Voters", "policy"]],
    calendar: [["This Week", "Complete tasks and end the week.", "End Week", "endWeek"], ["Upcoming Events", "Prepare for interviews and rallies.", "Review Events", "policy"]]
  };

  const cards = contentMap[section] || [["Coming Soon", "This section will be expanded next.", "Back", "dashboard"]];

  document.getElementById("hqDetailContent").innerHTML = cards.map(([title, text, button, action]) => `
    <div class="fixed-detail-card">
      <h3>${title}</h3>
      <p>${text}</p>
      <button onclick="${action === "endWeek" ? "endWeek()" : action === "dashboard" ? "showDashboardHome()" : `runQuickAction('${action}')`}">${button}</button>
    </div>
  `).join("");
}

function openFixedEvent(index) {
  const event = fixedHq.events[index];
  if (!event) return;
  openHqSection("calendar");
  document.getElementById("hqDetailTitle").textContent = event.title;
  document.getElementById("hqDetailContent").innerHTML = `
    <div class="fixed-detail-card">
      <h3>${event.title}</h3>
      <p>${event.type}. Preparing properly can improve polling, credibility and membership.</p>
      <button onclick="runQuickAction('interview')">Prepare Media Lines</button>
      <button onclick="runQuickAction('rally')">Mobilise Volunteers</button>
    </div>
  `;
}


/* v4.7 Clean HQ + Campaign rebuild */
window.cleanCampaignState = window.cleanCampaignState || {
  volunteers: 0,
  offices: 1,
  adverts: 0,
  actionsThisWeek: 0,
  maxActionsPerWeek: 3,
  regions: [],
  seats: [],
  log: []
};

function cleanMoney(value) {
  value = Number(value || 0);
  if (value >= 1000000) return "£" + (value / 1000000).toFixed(1) + "m";
  if (value >= 1000) return "£" + Math.round(value / 1000) + "k";
  return "£" + value;
}

function cleanCurrentPoll() {
  if (window.fixedHq && fixedHq.pollingHistory && fixedHq.pollingHistory.length) {
    return Number(fixedHq.pollingHistory[fixedHq.pollingHistory.length - 1] || 5.2);
  }
  if (window.generatedPolling && generatedPolling.party) return Number(generatedPolling.party);
  return 5.2;
}

function cleanCurrentFunds() {
  if (window.fixedHq && typeof fixedHq.funds === "number") return fixedHq.funds;
  return 2800000;
}

function cleanCurrentMembers() {
  if (window.generatedMembership && generatedMembership.total) return generatedMembership.total;
  return 14310;
}

function ensureCleanCampaignState() {
  const s = window.cleanCampaignState;
  if (s.regions.length) return;

  const base = cleanCurrentPoll();
  s.volunteers = Math.max(900, Math.round(cleanCurrentMembers() * 0.18));
  s.offices = 1;
  s.adverts = 0;
  s.actionsThisWeek = 0;
  s.maxActionsPerWeek = 3;

  s.regions = [
    { name: window.selectedHQ || "West Midlands", support: +(base + 4.1).toFixed(1), office: true },
    { name: "London", support: +Math.max(1, base - 0.4).toFixed(1), office: false },
    { name: "North West", support: +Math.max(1, base - 0.1).toFixed(1), office: false },
    { name: "South East", support: +Math.max(1, base - 0.9).toFixed(1), office: false },
    { name: "Scotland", support: +Math.max(1, base - 2.2).toFixed(1), office: false },
    { name: "Wales", support: +Math.max(1, base - 1.4).toFixed(1), office: false }
  ];

  s.seats = [
    { name: (window.selectedHQ || "Birmingham") + " Central", party: "Labour", chance: 14, target: false },
    { name: "Walsall South", party: "Labour", chance: 11, target: false },
    { name: "Manchester Central", party: "Labour", chance: 9, target: false },
    { name: "Uxbridge", party: "Conservative", chance: 8, target: false },
    { name: "Bristol West", party: "Green", chance: 7, target: false }
  ];

  s.log = [
    "Campaign HQ opened.",
    "Regional strategy prepared.",
    "Target-seat list created."
  ];
}

function cleanShowDashboard() {
  const home = document.getElementById("fixedDashboardHome");
  const detail = document.getElementById("fixedDashboardDetail");
  const content = document.getElementById("hqDetailContent");

  if (home) {
    home.style.display = "grid";
    home.classList.remove("force-hidden");
    home.classList.add("force-visible");
  }

  if (detail) {
    detail.style.display = "none";
    detail.classList.remove("force-visible");
    detail.classList.add("force-hidden");
  }

  if (content) {
    content.className = "fixed-detail-grid";
    content.innerHTML = "";
  }

  document.querySelectorAll(".fixed-hq-nav").forEach(btn => {
    btn.classList.toggle("active", btn.textContent.toLowerCase().includes("dashboard"));
  });

  if (typeof renderFixedHq === "function") renderFixedHq();
}

function openCleanCampaignHQ() {
  ensureCleanCampaignState();

  const home = document.getElementById("fixedDashboardHome");
  const detail = document.getElementById("fixedDashboardDetail");
  const title = document.getElementById("hqDetailTitle");
  const content = document.getElementById("hqDetailContent");

  if (!home || !detail || !title || !content) {
    alert("Campaign HQ could not load because the dashboard was not found.");
    return;
  }

  home.style.display = "none";
  home.classList.remove("force-visible");
  home.classList.add("force-hidden");

  detail.style.display = "block";
  detail.classList.remove("force-hidden");
  detail.classList.add("force-visible");

  title.textContent = "Campaign HQ";
  content.className = "clean-campaign-content";
  content.innerHTML = renderCleanCampaignHQ();

  document.querySelectorAll(".fixed-hq-nav").forEach(btn => {
    btn.classList.toggle("active", btn.textContent.toLowerCase().includes("campaign"));
  });
}

function renderCleanCampaignHQ() {
  const s = window.cleanCampaignState;
  const actionsLeft = s.maxActionsPerWeek - s.actionsThisWeek;
  const selectedSeats = s.seats.filter(seat => seat.target).length;
  const readiness = Math.min(100, Math.round(18 + selectedSeats * 8 + s.offices * 7 + s.adverts * 6 + actionsLeft * 2));

  return `
    <div class="clean-campaign-header">
      <div>
        <h2>Campaign HQ</h2>
        <p style="margin:8px 0 0;color:rgba(255,255,255,.72);">Run weekly campaign operations, target regions and prepare for future elections.</p>
      </div>
      <button class="clean-back-dashboard" onclick="cleanShowDashboard()">← Back to Dashboard</button>
    </div>

    <div class="clean-campaign-grid">
      <div class="clean-campaign-card">
        <h3>Campaign Overview</h3>
        <div class="clean-campaign-stats">
          <div><span>Polling</span><strong>${cleanCurrentPoll().toFixed(1)}%</strong></div>
          <div><span>Funds</span><strong>${cleanMoney(cleanCurrentFunds())}</strong></div>
          <div><span>Volunteers</span><strong>${s.volunteers.toLocaleString("en-GB")}</strong></div>
          <div><span>Actions Left</span><strong>${actionsLeft}</strong></div>
        </div>
      </div>

      <div class="clean-campaign-card">
        <h3>Campaign Actions</h3>
        <div class="clean-campaign-list">
          ${[
            ["Hold Rally", "Cost: £75k. Boosts members, volunteers and polling.", "rally"],
            ["Launch Advert", "Cost: £250k. Big visibility boost but expensive.", "advert"],
            ["Volunteer Drive", "Cost: £40k. Builds activist strength.", "volunteers"],
            ["Target Seat Push", "Cost: £95k. Improves selected target seats.", "target"],
            ["Regional Tour", "Cost: £120k. Boosts regional support.", "tour"]
          ].map(([name, desc, action]) => `
            <div class="clean-campaign-row">
              <div><strong>${name}</strong><p>${desc}</p></div>
              <button onclick="runCleanCampaignAction('${action}')" ${actionsLeft <= 0 ? "disabled" : ""}>Run</button>
            </div>
          `).join("")}
        </div>
      </div>

      <div class="clean-campaign-card">
        <h3>Election Readiness</h3>
        <div class="clean-campaign-stats">
          <div><span>Target Seats</span><strong>${selectedSeats}</strong></div>
          <div><span>Offices</span><strong>${s.offices}</strong></div>
          <div><span>Adverts</span><strong>${s.adverts}</strong></div>
          <div><span>Readiness</span><strong>${readiness}/100</strong></div>
        </div>
      </div>

      <div class="clean-campaign-card">
        <h3>Regional Support</h3>
        <div class="clean-campaign-list">
          ${s.regions.map((region, i) => `
            <div class="clean-campaign-row">
              <div>
                <strong>${region.name}</strong>
                <small>${region.office ? "Office active" : "No office"} • Support ${region.support.toFixed(1)}%</small>
                <div class="clean-meter"><div style="--w:${Math.min(100, region.support * 5)}%;"></div></div>
              </div>
              <button onclick="openCleanCampaignOffice(${i})" ${region.office ? "disabled" : ""}>${region.office ? "Open" : "Open Office"}</button>
            </div>
          `).join("")}
        </div>
      </div>

      <div class="clean-campaign-card">
        <h3>Target Seats</h3>
        <div class="clean-campaign-list">
          ${s.seats.map((seat, i) => `
            <div class="clean-campaign-row">
              <div>
                <strong>${seat.name}</strong>
                <small>Held by ${seat.party} • Win chance ${seat.chance}% ${seat.target ? "• Targeted" : ""}</small>
                <div class="clean-meter"><div style="--w:${Math.min(100, seat.chance * 2)}%;"></div></div>
              </div>
              <button onclick="toggleCleanTargetSeat(${i})">${seat.target ? "Remove" : "Target"}</button>
            </div>
          `).join("")}
        </div>
      </div>

      <div class="clean-campaign-card">
        <h3>Campaign Log</h3>
        <div class="clean-campaign-list">
          ${s.log.slice(0, 8).map(log => `
            <div class="clean-campaign-row">
              <div><strong>${log}</strong><small>Campaign record</small></div>
            </div>
          `).join("")}
        </div>
      </div>
    </div>
  `;
}

function cleanSpend(cost) {
  const s = window.cleanCampaignState;

  if (s.actionsThisWeek >= s.maxActionsPerWeek) {
    alert("You have used all campaign actions this week. Click End Week to continue.");
    return false;
  }

  if (cleanCurrentFunds() < cost) {
    alert("You do not have enough funds for this campaign action.");
    return false;
  }

  if (window.fixedHq && typeof fixedHq.funds === "number") fixedHq.funds -= cost;
  s.actionsThisWeek += 1;
  return true;
}

function cleanBoostPolling(amount) {
  if (window.fixedHq && fixedHq.pollingHistory && fixedHq.pollingHistory.length) {
    const i = fixedHq.pollingHistory.length - 1;
    fixedHq.pollingHistory[i] = +(fixedHq.pollingHistory[i] + amount).toFixed(1);
  }
}

function cleanCampaignNews(title, text) {
  if (window.fixedHq && Array.isArray(fixedHq.news) && typeof createFixedNews === "function") {
    fixedHq.news.unshift(createFixedNews("Campaign HQ", title, text, "positive", []));
  }
}

function runCleanCampaignAction(type) {
  ensureCleanCampaignState();
  const s = window.cleanCampaignState;

  if (type === "rally") {
    if (!cleanSpend(75000)) return;
    cleanBoostPolling(0.2);
    s.volunteers += 180;
    if (window.generatedMembership) generatedMembership.total += 450;
    s.log.unshift("Held a launch rally.");
    cleanCampaignNews("Rally energises supporters", "The campaign rally boosts membership, volunteers and visibility.");
  }

  if (type === "advert") {
    if (!cleanSpend(250000)) return;
    cleanBoostPolling(0.35);
    s.adverts += 1;
    s.log.unshift("Launched a national advert campaign.");
    cleanCampaignNews("Advertising campaign goes live", "Your adverts increase visibility but reduce campaign funds.");
  }

  if (type === "volunteers") {
    if (!cleanSpend(40000)) return;
    s.volunteers += 650;
    if (window.generatedMembership) generatedMembership.total += 280;
    s.log.unshift("Ran a volunteer recruitment drive.");
    cleanCampaignNews("Volunteer drive succeeds", "New activists join the campaign operation.");
  }

  if (type === "target") {
    if (!cleanSpend(95000)) return;
    s.seats.forEach(seat => {
      if (seat.target) seat.chance = Math.min(45, seat.chance + 4);
    });
    cleanBoostPolling(0.08);
    s.log.unshift("Expanded target-seat campaign.");
    cleanCampaignNews("Target-seat operation expands", "Your selected target seats become more competitive.");
  }

  if (type === "tour") {
    if (!cleanSpend(120000)) return;
    s.regions.forEach(region => {
      region.support = +(region.support + (region.office ? 0.6 : 0.25)).toFixed(1);
    });
    cleanBoostPolling(0.18);
    s.log.unshift("Completed a regional tour.");
    cleanCampaignNews("Regional tour completed", "The leader's regional tour improves campaign reach.");
  }

  if (typeof renderFixedHq === "function") renderFixedHq();
  openCleanCampaignHQ();
}

function toggleCleanTargetSeat(index) {
  ensureCleanCampaignState();
  const seat = window.cleanCampaignState.seats[index];
  if (!seat) return;
  seat.target = !seat.target;
  window.cleanCampaignState.log.unshift((seat.target ? "Targeted " : "Removed ") + seat.name + ".");
  openCleanCampaignHQ();
}

function openCleanCampaignOffice(index) {
  ensureCleanCampaignState();
  const region = window.cleanCampaignState.regions[index];
  if (!region || region.office) return;

  if (!cleanSpend(180000)) return;

  region.office = true;
  region.support = +(region.support + 1.2).toFixed(1);
  window.cleanCampaignState.offices += 1;
  window.cleanCampaignState.log.unshift("Opened campaign office in " + region.name + ".");
  cleanCampaignNews("New office opens in " + region.name, "The office improves regional support and local organising.");

  if (typeof renderFixedHq === "function") renderFixedHq();
  openCleanCampaignHQ();
}

/* Clean final routing override */
showDashboardHome = cleanShowDashboard;

openHqSection = function(section) {
  if (section === "dashboard") return cleanShowDashboard();
  if (section === "campaign") return openCleanCampaignHQ();

  const home = document.getElementById("fixedDashboardHome");
  const detail = document.getElementById("fixedDashboardDetail");
  const title = document.getElementById("hqDetailTitle");
  const content = document.getElementById("hqDetailContent");

  if (!home || !detail || !title || !content) return;

  home.style.display = "none";
  home.classList.add("force-hidden");
  detail.style.display = "block";
  detail.classList.add("force-visible");

  const titleMap = {
    media: "Media Centre",
    policy: "Policy Unit",
    candidates: "Candidate Recruitment",
    party: "Party Management",
    finance: "Finance Office",
    research: "Research Department",
    map: "UK Campaign Map",
    polling: "Polling Centre",
    calendar: "Calendar"
  };

  title.textContent = titleMap[section] || "Section";
  content.className = "fixed-detail-grid";
  content.innerHTML = `
    <div class="fixed-detail-card">
      <h3>${title.textContent}</h3>
      <p>This section is ready to expand next. Dashboard and Campaign HQ are now rebuilt cleanly.</p>
      <button onclick="cleanShowDashboard()">Back to Dashboard</button>
    </div>
  `;
};

const previousCleanEndWeek = typeof endWeek === "function" ? endWeek : null;
endWeek = function() {
  if (previousCleanEndWeek) previousCleanEndWeek();

  ensureCleanCampaignState();
  window.cleanCampaignState.actionsThisWeek = 0;

  const boost = window.cleanCampaignState.offices * 75;
  window.cleanCampaignState.volunteers += boost;
  window.cleanCampaignState.log.unshift("Regional offices recruited " + boost + " extra volunteers this week.");
};


/* v4.8 Weekly Gameplay Loop */
window.weeklyState = window.weeklyState || {
  season: "Spring",
  year: 2029,
  weeksUntilElection: 190,
  lastSummary: null
};

function formatWeekMoneyV48(value) {
  value = Number(value || 0);
  if (value >= 1000000) return "£" + (value / 1000000).toFixed(1) + "m";
  if (value >= 1000) return "£" + Math.round(value / 1000) + "k";
  return "£" + value;
}

function getWeekPollV48() {
  if (window.fixedHq && fixedHq.pollingHistory && fixedHq.pollingHistory.length) {
    return Number(fixedHq.pollingHistory[fixedHq.pollingHistory.length - 1]);
  }
  if (window.generatedPolling && generatedPolling.party) return Number(generatedPolling.party);
  return 5.2;
}

function setWeekPollV48(value) {
  value = Number(value.toFixed(1));
  if (window.fixedHq && fixedHq.pollingHistory && fixedHq.pollingHistory.length) {
    fixedHq.pollingHistory.push(value);
  }
  if (window.generatedPolling) generatedPolling.party = value;
}

function getWeekMembersV48() {
  if (window.generatedMembership && generatedMembership.total) return generatedMembership.total;
  return 14310;
}

function setWeekMembersV48(value) {
  if (!window.generatedMembership) window.generatedMembership = { total: value };
  generatedMembership.total = Math.max(1000, Math.round(value));
}

function getWeekFundsV48() {
  if (window.fixedHq && typeof fixedHq.funds === "number") return fixedHq.funds;
  return 2800000;
}

function setWeekFundsV48(value) {
  if (window.fixedHq && typeof fixedHq.funds === "number") {
    fixedHq.funds = Math.max(0, Math.round(value));
  }
}

function currentWeekNumberV48() {
  if (window.fixedHq && fixedHq.week) return fixedHq.week;
  return 1;
}

function setWeekNumberV48(value) {
  if (window.fixedHq) fixedHq.week = value;
}

function generateWeeklyEventV48() {
  const party = (window.customPartyDraft && customPartyDraft.name) || "Your Party";
  const events = [
    {
      title: "BBC Interview Request",
      text: "A producer invites your leader onto a Sunday politics programme.",
      effect: "media",
      poll: 0.2,
      members: 120,
      funds: 0
    },
    {
      title: "Local Councillor Defects",
      text: "A local councillor announces they are joining your party.",
      effect: "party",
      poll: 0.15,
      members: 260,
      funds: 25000
    },
    {
      title: "Donor Meeting",
      text: "A group of donors offers support after noticing your early campaign momentum.",
      effect: "finance",
      poll: 0.05,
      members: 40,
      funds: 350000
    },
    {
      title: "Hostile Newspaper Column",
      text: "A national newspaper questions whether your party is serious enough to govern.",
      effect: "media",
      poll: -0.15,
      members: -60,
      funds: 0
    },
    {
      title: "Membership Surge",
      text: party + " gains attention online after clips from the campaign spread on social media.",
      effect: "party",
      poll: 0.1,
      members: 720,
      funds: 65000
    },
    {
      title: "Policy Scrutiny",
      text: "Journalists challenge the costs behind one of your headline policies.",
      effect: "policy",
      poll: -0.05,
      members: 0,
      funds: 0
    },
    {
      title: "Volunteer Breakthrough",
      text: "Regional organisers report stronger than expected volunteer activity.",
      effect: "campaign",
      poll: 0.1,
      members: 250,
      funds: 0
    }
  ];

  return events[Math.floor(Math.random() * events.length)];
}

function generateWeeklyStoriesV48(summary) {
  const party = (window.customPartyDraft && customPartyDraft.name) || "Your Party";
  const pollText = summary.pollChange >= 0 ? "rises" : "falls";
  const stories = [
    {
      title: "Weekly polling update",
      text: party + " " + pollText + " to " + summary.newPoll.toFixed(1) + "% nationally."
    },
    {
      title: "Membership update",
      text: "Party membership now stands at " + summary.newMembers.toLocaleString("en-GB") + "."
    },
    {
      title: summary.event.title,
      text: summary.event.text
    }
  ];

  return stories;
}

function calculateWeeklyResultV48() {
  const oldPoll = getWeekPollV48();
  const oldMembers = getWeekMembersV48();
  const oldFunds = getWeekFundsV48();
  const oldWeek = currentWeekNumberV48();

  const completedTasks = window.fixedHq && fixedHq.tasks ? fixedHq.tasks.filter(t => t.done).length : 0;
  const campaignActions = window.cleanCampaignState ? cleanCampaignState.actionsThisWeek : 0;
  const campaignOffices = window.cleanCampaignState ? cleanCampaignState.offices : 1;
  const adverts = window.cleanCampaignState ? cleanCampaignState.adverts : 0;

  const event = generateWeeklyEventV48();

  let pollChange = 0.05;
  pollChange += completedTasks * 0.08;
  pollChange += campaignActions * 0.09;
  pollChange += campaignOffices * 0.025;
  pollChange += adverts * 0.015;
  pollChange += event.poll;
  pollChange += (Math.random() * 0.16) - 0.06;

  let memberChange = 180;
  memberChange += completedTasks * 120;
  memberChange += campaignActions * 180;
  memberChange += campaignOffices * 75;
  memberChange += event.members;
  memberChange += Math.round(Math.random() * 220);

  let fundChange = 90000;
  fundChange += Math.round(oldMembers * 1.2);
  fundChange += event.funds;
  fundChange += Math.round(Math.random() * 65000);

  const newPoll = Math.max(0.5, Math.min(45, oldPoll + pollChange));
  const newMembers = Math.max(1000, oldMembers + memberChange);
  const newFunds = Math.max(0, oldFunds + fundChange);

  const summary = {
    oldWeek,
    newWeek: oldWeek + 1,
    oldPoll,
    newPoll,
    pollChange: newPoll - oldPoll,
    oldMembers,
    newMembers,
    memberChange: newMembers - oldMembers,
    oldFunds,
    newFunds,
    fundChange: newFunds - oldFunds,
    completedTasks,
    campaignActions,
    event
  };

  setWeekNumberV48(summary.newWeek);
  setWeekPollV48(summary.newPoll);
  setWeekMembersV48(summary.newMembers);
  setWeekFundsV48(summary.newFunds);

  if (window.weeklyState) {
    weeklyState.weeksUntilElection = Math.max(0, (weeklyState.weeksUntilElection || 190) - 1);
    weeklyState.lastSummary = summary;
  }

  if (window.cleanCampaignState) {
    cleanCampaignState.actionsThisWeek = 0;
    const volunteerBoost = cleanCampaignState.offices * 75;
    cleanCampaignState.volunteers += volunteerBoost;
    cleanCampaignState.log.unshift("Week " + summary.newWeek + ": offices recruited " + volunteerBoost + " extra volunteers.");
  }

  if (window.fixedHq) {
    fixedHq.tasks = [
      { id: "weekly-rally-" + summary.newWeek, title: "Hold a regional rally", impact: "High Impact", done: false },
      { id: "weekly-media-" + summary.newWeek, title: "Respond to the week's biggest story", impact: "Medium Impact", done: false },
      { id: "weekly-candidates-" + summary.newWeek, title: "Recruit local candidates", impact: "High Impact", done: false },
      { id: "weekly-funds-" + summary.newWeek, title: "Raise £100k in donations", impact: "Medium Impact", done: false }
    ];

    const stories = generateWeeklyStoriesV48(summary);
    stories.reverse().forEach(story => {
      if (typeof createFixedNews === "function") {
        fixedHq.news.unshift(createFixedNews("Week " + summary.newWeek, story.title, story.text, "major", [
          { label: "Respond", effect: "credibility" },
          { label: "Use in Campaign", effect: "members" },
          { label: "Ignore", effect: "safe" }
        ]));
      } else {
        fixedHq.news.unshift({ title: story.title, text: story.text });
      }
    });
  }

  return summary;
}

function showWeeklySummaryV48(summary) {
  const existing = document.getElementById("weeklyModalV48");
  if (existing) existing.remove();

  const pollClass = summary.pollChange >= 0 ? "weekly-change-positive" : "weekly-change-negative";
  const memberClass = summary.memberChange >= 0 ? "weekly-change-positive" : "weekly-change-negative";
  const fundClass = summary.fundChange >= 0 ? "weekly-change-positive" : "weekly-change-negative";

  const modal = document.createElement("div");
  modal.id = "weeklyModalV48";
  modal.className = "weekly-modal-backdrop";
  modal.innerHTML = `
    <div class="weekly-modal">
      <div class="weekly-modal-header">
        <div>
          <h2>Week ${summary.oldWeek} Complete</h2>
          <p>Your campaign moves into Week ${summary.newWeek}. New stories, tasks and opportunities have appeared.</p>
        </div>
        <span class="weekly-badge">${weeklyState.weeksUntilElection} weeks until election</span>
      </div>

      <div class="weekly-summary-grid">
        <div class="weekly-summary-card">
          <span>Polling</span>
          <strong>${summary.oldPoll.toFixed(1)}% → ${summary.newPoll.toFixed(1)}%</strong>
          <p class="${pollClass}">${summary.pollChange >= 0 ? "+" : ""}${summary.pollChange.toFixed(1)} this week</p>
        </div>

        <div class="weekly-summary-card">
          <span>Members</span>
          <strong>${summary.oldMembers.toLocaleString("en-GB")} → ${summary.newMembers.toLocaleString("en-GB")}</strong>
          <p class="${memberClass}">${summary.memberChange >= 0 ? "+" : ""}${Math.round(summary.memberChange).toLocaleString("en-GB")} members</p>
        </div>

        <div class="weekly-summary-card">
          <span>Funds</span>
          <strong>${formatWeekMoneyV48(summary.oldFunds)} → ${formatWeekMoneyV48(summary.newFunds)}</strong>
          <p class="${fundClass}">${summary.fundChange >= 0 ? "+" : ""}${formatWeekMoneyV48(summary.fundChange)}</p>
        </div>
      </div>

      <div class="weekly-section">
        <h3>Why it changed</h3>
        <div class="weekly-list">
          <div class="weekly-list-item"><strong>Completed tasks</strong><p>${summary.completedTasks} dashboard tasks were completed.</p></div>
          <div class="weekly-list-item"><strong>Campaign actions</strong><p>${summary.campaignActions} campaign actions were used this week.</p></div>
          <div class="weekly-list-item"><strong>Campaign organisation</strong><p>Campaign offices and volunteers added extra background support.</p></div>
        </div>
      </div>

      <div class="weekly-section">
        <h3>Random political event</h3>
        <div class="weekly-list">
          <div class="weekly-list-item"><strong>${summary.event.title}</strong><p>${summary.event.text}</p></div>
        </div>
      </div>

      <div class="weekly-section">
        <h3>New week setup</h3>
        <div class="weekly-list">
          <div class="weekly-list-item"><strong>Tasks refreshed</strong><p>New weekly tasks have been added to the Dashboard.</p></div>
          <div class="weekly-list-item"><strong>Campaign capacity reset</strong><p>You can use campaign actions again this week.</p></div>
          <div class="weekly-list-item"><strong>News feed updated</strong><p>The latest political stories now appear on the Dashboard.</p></div>
        </div>
      </div>

      <div class="weekly-modal-actions">
        <button onclick="closeWeeklySummaryV48()">Continue to Dashboard</button>
        <button onclick="closeWeeklySummaryV48(); openCleanCampaignHQ();">Go to Campaign HQ</button>
      </div>
    </div>
  `;

  document.body.appendChild(modal);
}

function closeWeeklySummaryV48() {
  const modal = document.getElementById("weeklyModalV48");
  if (modal) modal.remove();

  if (typeof renderFixedHq === "function") renderFixedHq();
  if (typeof cleanShowDashboard === "function") cleanShowDashboard();
}

const previousEndWeekV48 = typeof endWeek === "function" ? endWeek : null;
endWeek = function() {
  const summary = calculateWeeklyResultV48();
  showWeeklySummaryV48(summary);
};
