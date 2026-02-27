let employeeData = [];
let chart;

// 1. CUSTOM TEMPLATE (Isla Base)
OrgChart.templates.bppCustom = Object.assign({}, OrgChart.templates.isla);
OrgChart.templates.bppCustom.size = [250, 120];
OrgChart.templates.bppCustom.node = '<rect x="0" y="0" height="120" width="250" fill="#ffffff" stroke-width="1" stroke="#aeaeae" rx="10" ry="10"></rect>';

// Gambar (Kiri)
OrgChart.templates.bppCustom.img_0 = 
    '<clipPath id="ulaImg"><circle cx="50" cy="60" r="35"></circle></clipPath>' +
    '<image preserveAspectRatio="xMidYMid slice" clip-path="url(#ulaImg)" xlink:href="{val}" x="15" y="25" width="70" height="70"></image>';

// Nama (Field 0 - HTML Support)
OrgChart.templates.bppCustom.field_0 = 
    '<foreignObject x="95" y="20" width="145" height="60">' +
        '<div xmlns="http://www.w3.org/1999/xhtml" style="font-family:sans-serif; font-weight:bold; font-size:14px; color:#333; line-height:1.2; display:flex; align-items:center; height:100%;">{val}</div>' +
    '</foreignObject>';

// Jawatan (Field 1 - HTML Support)
OrgChart.templates.bppCustom.field_1 = 
    '<foreignObject x="95" y="75" width="145" height="40">' +
        '<div xmlns="http://www.w3.org/1999/xhtml" style="font-family:sans-serif; font-size:12px; color:#666; line-height:1.1;">{val}</div>' +
    '</foreignObject>';

function renderChart() {
    const treeElement = document.getElementById("tree");
    if (employeeData.length === 0) return;
    treeElement.innerHTML = "";

    chart = new OrgChart(treeElement, {
        nodes: employeeData,
        enableSearch: false,
        template: "bppCustom",
        nodeBinding: { field_0: "name", field_1: "title", img_0: "img" },
        nodeMenu: { edit: { text: "Edit" }, remove: { text: "Padam" } }
    });

    chart.on('field', function (sender, args) {
        if (args.name == "name" && args.value.length > 15) {
            args.value = OrgChart.wrap(args.value, 15);
        }
    });

    setTimeout(() => { chart.center(employeeData[0].id); }, 300);
    updateParentDropdown();
}

function addNode() {
    const nameInput = document.getElementById('userName');
    const roleInput = document.getElementById('userRole');
    const parentInput = document.getElementById('reportsTo');
    const photoInput = document.getElementById('userPhoto');

    if (!nameInput.value || !roleInput.value) return alert("Sila isi Nama & Jawatan!");

    const id = Date.now().toString();
    const pid = parentInput.value || null;

    const process = (imgData) => {
        employeeData.push({ id, pid, name: nameInput.value, title: roleInput.value, img: imgData });
        renderChart();
        nameInput.value = ""; roleInput.value = ""; photoInput.value = "";
    };

    if (photoInput.files && photoInput.files[0]) {
        const reader = new FileReader();
        reader.onload = (e) => process(e.target.result);
        reader.readAsDataURL(photoInput.files[0]);
    } else {
        process("");
    }
}

function updateParentDropdown() {
    const s = document.getElementById('reportsTo');
    const cur = s.value;
    s.innerHTML = '<option value="">-- Melapor Kepada (Pilih Ketua) --</option>';
    employeeData.forEach(n => s.add(new Option(n.name, n.id)));
    s.value = cur;
}

function downloadPDF() { window.print(); }
function saveData() {
    const blob = new Blob([JSON.stringify(employeeData)], {type: "application/json"});
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = "data_bpp.json";
    a.click();
}
function loadData() {
    const input = document.createElement('input');
    input.type = 'file';
    input.onchange = e => {
        const reader = new FileReader();
        reader.onload = ev => { employeeData = JSON.parse(ev.target.result); renderChart(); };
        reader.readAsText(e.target.files[0]);
    };
    input.click();
}
