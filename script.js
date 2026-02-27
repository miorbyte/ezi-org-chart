let employeeData = [];
let chart;

// 1. SETUP TEMPLATE (Tanpa memanggil OrgChart.wrap)
function setupTemplate() {
    OrgChart.templates.bppCustom = Object.assign({}, OrgChart.templates.ana);
    OrgChart.templates.bppCustom.size = [250, 120];
    OrgChart.templates.bppCustom.node = '<rect x="0" y="0" height="120" width="250" fill="#ffffff" stroke="#007bff" stroke-width="1" rx="10" ry="10"></rect>';

    // Nama - Teks akan turun baris sendiri kerana word-break
    OrgChart.templates.bppCustom.field_0 = 
        '<foreignObject x="90" y="20" width="150" height="60">' +
            '<div xmlns="http://www.w3.org/1999/xhtml" style="font-weight:bold; font-size:14px; color:#333; line-height:1.2; display:flex; align-items:center; height:100%; word-break: break-word; overflow:hidden;">{val}</div>' +
        '</foreignObject>';

    // Jawatan
    OrgChart.templates.bppCustom.field_1 = 
        '<foreignObject x="90" y="75" width="150" height="40">' +
            '<div xmlns="http://www.w3.org/1999/xhtml" style="font-size:12px; color:#666; word-break: break-word;">{val}</div>' +
        '</foreignObject>';

    // Gambar Staf
    OrgChart.templates.bppCustom.img_0 = 
        '<clipPath id="ulaImg"><circle cx="45" cy="60" r="35"></circle></clipPath>' +
        '<image preserveAspectRatio="xMidYMid slice" clip-path="url(#ulaImg)" xlink:href="{val}" x="10" y="25" width="70" height="70"></image>';
}

function renderChart() {
    const treeDiv = document.getElementById("tree");
    if (employeeData.length === 0) return;

    if (!OrgChart.templates.bppCustom) setupTemplate();

    // Ralat sebelum ini berlaku di sini, jadi saya sudah buang bahagian 'chart.on'
    chart = new OrgChart(treeDiv, {
        nodes: employeeData,
        template: "bppCustom",
        nodeBinding: { 
            field_0: "name", 
            field_1: "title", 
            img_0: "img" 
        }
    });

    updateDropdown();
}

function addNode() {
    const nameInput = document.getElementById('userName');
    const roleInput = document.getElementById('userRole');
    const pid = document.getElementById('reportsTo').value || null;
    const photo = document.getElementById('userPhoto').files[0];

    if (!nameInput.value || !roleInput.value) return alert("Sila isi nama dan jawatan!");

    const id = Date.now().toString();

    if (photo) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const img = new Image();
            img.onload = function() {
                const canvas = document.createElement('canvas');
                canvas.width = 150; canvas.height = 150;
                canvas.getContext('2d').drawImage(img, 0, 0, 150, 150);
                saveAndRender(id, pid, nameInput.value, roleInput.value, canvas.toDataURL('image/jpeg', 0.7));
                nameInput.value = ""; roleInput.value = ""; // Reset
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(photo);
    } else {
        saveAndRender(id, pid, nameInput.value, roleInput.value, "");
        nameInput.value = ""; roleInput.value = ""; // Reset
    }
}

function saveAndRender(id, pid, name, title, img) {
    employeeData.push({ id, pid, name, title, img });
    renderChart();
}

function updateDropdown() {
    const select = document.getElementById('reportsTo');
    const current = select.value;
    select.innerHTML = '<option value="">-- Melapor Kepada --</option>';
    employeeData.forEach(n => select.add(new Option(n.name, n.id)));
    select.value = current;
}

function saveData() {
    const blob = new Blob([JSON.stringify(employeeData, null, 2)], {type: "application/json"});
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = "carta_bpp.json";
    a.click();
}

function loadData() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
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
