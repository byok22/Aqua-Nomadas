const docListEl = document.getElementById("docList");
const docViewerEl = document.getElementById("docViewer");
const docTitleEl = document.getElementById("docTitle");
const docPathEl = document.getElementById("docPath");
const searchInputEl = document.getElementById("searchInput");

let docs = [];
let currentPath = "";

const CATEGORIES = [
  { key: "",                                       label: "Inicio",         icon: "📄", color: "cat-inicio" },
  { key: "01_Operativo",                            label: "Operativo",       icon: "⚙️", color: "cat-operativo" },
  { key: "01_Operativo/Hojas_Operativas_por_Rol",   label: "Hojas por Rol",  icon: "👤", color: "cat-roles" },
  { key: "02_Marketing",                            label: "Marketing",       icon: "📣", color: "cat-marketing" },
  { key: "03_Seguridad",                            label: "Seguridad",       icon: "🛡️", color: "cat-seguridad" },
  { key: "04_Itinerarios",                          label: "Itinerarios",     icon: "📅", color: "cat-itinerarios" },
  { key: "05_Plantillas",                           label: "Plantillas",      icon: "📋", color: "cat-plantillas" },
];

function getFolder(path) {
  const parts = path.split("/");
  if (parts.length === 1) return "";
  if (parts.length >= 3) return parts.slice(0, 2).join("/");
  return parts[0];
}

async function loadIndex() {
  const res = await fetch("./md-index.json");
  if (!res.ok) throw new Error("No se pudo cargar md-index.json");
  docs = await res.json();
}

function groupDocs(items) {
  const groups = {};
  CATEGORIES.forEach((c) => { groups[c.key] = []; });
  items.forEach((doc) => {
    const folder = getFolder(doc.path);
    if (groups[folder] !== undefined) groups[folder].push(doc);
    else groups[""].push(doc);
  });
  return groups;
}

function renderDocList(items) {
  docListEl.innerHTML = "";

  if (!items.length) {
    const empty = document.createElement("p");
    empty.style.padding = "8px";
    empty.textContent = "Sin resultados.";
    docListEl.appendChild(empty);
    return;
  }

  const groups = groupDocs(items);
  const currentFolder = getFolder(currentPath);

  CATEGORIES.forEach(({ key, label, icon, color }) => {
    const docsInGroup = groups[key] || [];
    if (!docsInGroup.length) return;

    const isActiveGroup = key === currentFolder;

    const header = document.createElement("button");
    header.className = `cat-header ${color}${isActiveGroup ? " open" : ""}`;
    header.setAttribute("aria-expanded", isActiveGroup ? "true" : "false");
    header.innerHTML =
      `<span class="cat-icon">${icon}</span>` +
      `<span class="cat-label">${label}</span>` +
      `<span class="cat-count">${docsInGroup.length}</span>` +
      `<span class="cat-arrow">${isActiveGroup ? "▾" : "▸"}</span>`;

    const groupEl = document.createElement("div");
    groupEl.className = "cat-group" + (isActiveGroup ? " expanded" : "");

    docsInGroup.forEach((doc) => {
      const btn = document.createElement("a");
      btn.href = "#";
      btn.className = "doc-item" + (doc.path === currentPath ? " active" : "");
      btn.dataset.path = doc.path;
      btn.textContent = doc.title;
      btn.addEventListener("click", async (e) => {
        e.preventDefault();
        await openDoc(doc.path);
        renderDocList(items);
      });
      groupEl.appendChild(btn);
    });

    header.addEventListener("click", () => {
      const expanded = groupEl.classList.toggle("expanded");
      header.classList.toggle("open", expanded);
      header.setAttribute("aria-expanded", expanded ? "true" : "false");
      header.querySelector(".cat-arrow").textContent = expanded ? "▾" : "▸";
    });

    docListEl.appendChild(header);
    docListEl.appendChild(groupEl);
  });
}

async function openDoc(path) {
  try {
    currentPath = path;
    const res = await fetch(`../${path}`);
    if (!res.ok) {
      throw new Error("No se pudo abrir el documento");
    }

    const markdown = await res.text();
    docTitleEl.textContent = docs.find((d) => d.path === path)?.title || path;
    docPathEl.textContent = path;
    docViewerEl.innerHTML = marked.parse(markdown);
  } catch (err) {
    docTitleEl.textContent = "Error";
    docPathEl.textContent = path;
    docViewerEl.innerHTML = `<p>No se pudo cargar el archivo. Detalle: ${err.message}</p>`;
  }
}

function filterDocs() {
  const term = searchInputEl.value.trim().toLowerCase();
  const filtered = docs.filter((d) => {
    return d.title.toLowerCase().includes(term) || d.path.toLowerCase().includes(term);
  });
  renderDocList(filtered);
}

async function init() {
  try {
    await loadIndex();
    docs.sort((a, b) => a.path.localeCompare(b.path));
    renderDocList(docs);
    if (docs[0]) {
      await openDoc(docs[0].path);
      renderDocList(docs);
    }
  } catch (err) {
    docTitleEl.textContent = "Error inicial";
    docViewerEl.innerHTML = `<p>Fallo al iniciar visor: ${err.message}</p>`;
  }
}

searchInputEl.addEventListener("input", filterDocs);
init();
