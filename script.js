let employeeData = [];
let chart;

function updateDisplayTitle(val) {
    document.getElementById('displayTitle').innerText = val || "Tajuk Carta Organisasi";
}

function updateFileName(input) {
    const display = document.getElementById('file-name-display');
    display.textContent = input.files.length > 0 ? "Fail: " + input.files[0].name : "Tiada foto dipilih";
}

function setupTemplate() {
    OrgChart.templates.eziCustom = Object.assign({}, OrgChart.templates.ana);
    OrgChart.templates.eziCustom.size = [250, 130];
    OrgChart.templates.eziCustom.node = '<rect x="0" y="0" height="130" width="250" fill="#ffffff" stroke="#e2e8f0" stroke-width="2" rx="15" ry="15"></rect>';

    // Nama Staf
    OrgChart.templates.eziCustom.field_0 = 
        '<foreignObject x="95" y="15" width="145" height="45">' +
            '<div xmlns="http://www.w3.org/1999/xhtml" style="font-weight:800; font-size:14px; color:#1e3a8a; line-height:1.1; display:flex; align-items:center; height:100%; word-break:break-word;">{val}</div>' +
        '</foreignObject>';

    // Jawatan (FIXED: Jarak baris dilaraskan supaya baris 2 nampak)
    OrgChart.templates.eziCustom.field_1 = 
        '<foreignObject x="95" y="65" width="145" height="55">' +
            '<div xmlns="http://www.w3.org/1999/xhtml" style="font-size:12px; color:#64748b; line-height:1.3; font-weight:500; display:block; word-break:break-word; overflow:hidden;">{val}</div>' +
        '</foreignObject>';

    OrgChart.templates.eziCustom.img_0 = 
        '<clipPath id="ulaImg"><circle cx="45" cy="65" r="38"></circle></clipPath>' +
        '<circle cx="45" cy="65" r="40" fill="#f8fafc" stroke="#e2e8f0" stroke-width="1"></circle>' +
        '<image preserveAspectRatio="xMidYMid slice" clip-path="url(#ulaImg)" xlink:href="{val}" x="7" y="27" width="76" height="76"></image>';
}

function renderChart() {
    const treeDiv = document.getElementById("tree");
    if (employeeData.length === 0) return;
    if (!OrgChart.templates.eziCustom) setupTemplate();

    chart = new OrgChart(treeDiv, {
        nodes: employeeData,
        template: "eziCustom",
        nodeBinding: { field_0: "name", field_1: "title", img_0: "img" }
    });
    updateDropdown();
}

function addNode() {
    const name = document.getElementById('userName').value;
    const role = document.getElementById('userRole').value;
    const pid = document.getElementById('reportsTo').value || null;
    const photo = document.getElementById('userPhoto').files[0];

    if (!name || !role) return alert("Isi Nama & Jawatan!");

    const id = Date.now().toString();
    if (photo) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const img = new Image();
            img.onload = function() {
                const canvas = document.createElement('canvas');
                canvas.width = 150; canvas.height = 150;
                canvas.getContext('2d').drawImage(img, 0, 0, 150, 150);
                saveAndRender(id, pid, name, role, canvas.toDataURL('image/jpeg', 0.8));
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(photo);
    } else {
        saveAndRender(id, pid, name, role, "");
    }
}

function saveAndRender(id, pid, name, title, img) {
    employeeData.push({ id, pid, name, title, img });
    renderChart();
    document.getElementById('userName').value = "";
    document.getElementById('userRole').value = "";
    document.getElementById('userPhoto').value = "";
    document.getElementById('file-name-display').textContent = "Tiada foto dipilih";
}

function updateDropdown() {
    const select = document.getElementById('reportsTo');
    const current = select.value;
    select.innerHTML = '<option value="">-- Melapor Kepada (Ketua) --</option>';
    employeeData.forEach(n => select.add(new Option(n.name, n.id)));
    select.value = current;
}

function saveData() {
    if (employeeData.length === 0) return;
    const blob = new Blob([JSON.stringify(employeeData, null, 2)], {type: "application/json"});
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = "carta_ezi.json";
    a.click();
}

function loadData() {
    const input = document.createElement('input');
    input.type = 'file'; input.accept = '.json';
    input.onchange = e => {
        const reader = new FileReader();
        reader.onload = ev => {
            employeeData = JSON.parse(ev.target.result);
            renderChart();
        };
        reader.readAsText(e.target.files[0]);
    };
    input.click();
}
