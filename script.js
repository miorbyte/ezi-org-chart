let employeeData = [];
let chart;

function renderChart() {
    const treeElement = document.getElementById("tree");
    if (employeeData.length === 0) return;
    treeElement.innerHTML = "";

    chart = new OrgChart(treeElement, {
        nodes: employeeData,
        nodeMenu: {
            edit: { text: "Repair / Edit" },
            remove: { text: "Delete Staf" }
        },
        nodeBinding: { field_0: "name", field_1: "title", img_0: "img" }
    });

    // Paksa carta ke tengah setiap kali render
    setTimeout(() => { chart.center(employeeData[0].id); }, 300);
    updateParentDropdown();
}

function addNode() {
    const name = document.getElementById('userName').value;
    const role = document.getElementById('userRole').value;
    const pid = document.getElementById('reportsTo').value || null;
    const file = document.getElementById('userPhoto').files[0];

    if (!name || !role) return alert("Sila isi nama dan jawatan!");

    const id = Date.now().toString();
    const process = (img) => {
        employeeData.push({ id, pid, name, title: role, img });
        renderChart();
        document.getElementById('userName').value = "";
        document.getElementById('userRole').value = "";
    };

    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => process(e.target.result);
        reader.readAsDataURL(file);
    } else { process(""); }
}

function updateParentDropdown() {
    const s = document.getElementById('reportsTo');
    const cur = s.value;
    s.innerHTML = '<option value="">-- Pilih Bos --</option>';
    employeeData.forEach(n => { s.add(new Option(n.name, n.id)); });
    s.value = cur;
}

function downloadPDF() {
    if (!chart) return;
    chart.center(employeeData[0].id);
    chart.fit();
    setTimeout(() => { window.print(); }, 500);
}

// Tambah fungsi Save/Load JSON jika perlu
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
        reader.onload = ev => {
            employeeData = JSON.parse(ev.target.result);
            renderChart();
        };
        reader.readAsText(e.target.files[0]);
    };
    input.click();
}
