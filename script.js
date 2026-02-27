let employeeData = [];
let chart;

// 1. Inisialisasi Carta Masa Mula
window.onload = function() {
    renderChart();
};

// 2. Fungsi Lukis Carta (OrgChart.js Built-in Export)
function renderChart() {
    chart = new OrgChart(document.getElementById("tree"), {
        nodes: employeeData,
        nodeBinding: {
            field_0: "name",
            field_1: "title",
            img_0: "img"
        },
        // Fungsi Export Terbina Dalam (Auto-Fit Support)
        menu: {
            pdf: { text: "Export PDF" }
        }
    });
}

// 3. Tambah Kakitangan
function addNode() {
    const name = document.getElementById('userName').value;
    const role = document.getElementById('userRole').value;
    const parent = document.getElementById('reportsTo').value;
    const photoInput = document.getElementById('userPhoto');
    const titleText = document.getElementById('chartTitle').value;

    document.getElementById('displayTitle').innerText = titleText || "Carta Organisasi";

    if (!name || !role) { 
        alert("Sila isi Nama & Jawatan"); 
        return; 
    }

    if (photoInput.files && photoInput.files[0]) {
        const reader = new FileReader();
        reader.onload = (e) => processNode(name, role, parent, e.target.result);
        reader.readAsDataURL(photoInput.files[0]);
    } else {
        processNode(name, role, parent, "");
    }
}

function processNode(name, role, parent, img) {
    const id = Date.now();
    const newNode = { 
        id: id, 
        pid: parent ? parent : null, 
        name: name, 
        title: role, 
        img: img 
    };
    
    employeeData.push(newNode);
    updateDropdown(name, id);
    renderChart();
    
    // Reset Input
    document.getElementById('userName').value = "";
    document.getElementById('userRole').value = "";
    document.getElementById('userPhoto').value = "";
}

function updateDropdown(name, id) {
    const select = document.getElementById('reportsTo');
    const opt = document.createElement('option');
    opt.value = id;
    opt.text = name;
    select.appendChild(opt);
}

// 4. Tukar Warna Latar Preview
function changeBg() {
    const color = document.getElementById('bgColorPicker').value;
    document.getElementById('preview-container').style.backgroundColor = color;
}

// 5. Simpan ke Fail .json
function saveData() {
    if (employeeData.length === 0) { alert("Tiada data untuk disimpan"); return; }
    const dataStr = JSON.stringify(employeeData);
    const blob = new Blob([dataStr], {type: "application/json"});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = "ezi_org_data.json";
    a.click();
}

// 6. Buka Fail .json
function loadData() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = e => {
        const reader = new FileReader();
        reader.onload = event => {
            employeeData = JSON.parse(event.target.result);
            document.getElementById('reportsTo').innerHTML = '<option value="">-- Pilih Bos --</option>';
            employeeData.forEach(node => updateDropdown(node.name, node.id));
            renderChart();
        };
        reader.readAsText(e.target.files[0]);
    };
    input.click();
}

// 7. Fungsi Cetak PDF (Auto-Fit A4 Landscape)
function downloadPDF() {
    if (employeeData.length === 0) { alert("Sila tambah kakitangan dulu"); return; }
    
    chart.exportPDF({
        format: 'A4',
        landscape: true,
        header: document.getElementById('chartTitle').value || "Carta Organisasi",
        footer: "Dihasilkan melalui Ezi Org Chart",
        margin: [20, 20, 20, 20]
    });
}
