let employeeData = [];
let chart;

// 1. Tukar Warna Latar
function changeBg() {
    const color = document.getElementById('bgColorPicker').value;
    document.getElementById('capture-area').style.backgroundColor = color;
}

// 2. Tambah Kakitangan
function addNode() {
    const name = document.getElementById('userName').value;
    const role = document.getElementById('userRole').value;
    const parent = document.getElementById('reportsTo').value;
    const photoInput = document.getElementById('userPhoto');
    const title = document.getElementById('chartTitle').value;

    document.getElementById('displayTitle').innerText = title || "Carta Organisasi";

    if (!name || !role) { alert("Sila isi Nama & Jawatan"); return; }

    if (photoInput.files && photoInput.files[0]) {
        const reader = new FileReader();
        reader.onload = (e) => processNode(name, role, parent, e.target.result);
        reader.readAsDataURL(photoInput.files[0]);
    } else {
        processNode(name, role, parent, "");
    }
}

function processNode(name, role, parent, img) {
    const id = Date.now(); // Guna timestamp sebagai ID unik
    const newNode = { id: id, pid: parent, name: name, title: role, img: img };
    
    employeeData.push(newNode);
    updateDropdown(name, id);
    renderChart();
    
    document.getElementById('userName').value = "";
    document.getElementById('userRole').value = "";
}

function updateDropdown(name, id) {
    const select = document.getElementById('reportsTo');
    const opt = document.createElement('option');
    opt.value = id;
    opt.text = name;
    select.appendChild(opt);
}

function renderChart() {
    chart = new OrgChart(document.getElementById("tree"), {
        nodes: employeeData,
        nodeBinding: { field_0: "name", field_1: "title", img_0: "img" }
    });
}

// 3. Simpan & Buka
function saveData() {
    const dataStr = JSON.stringify(employeeData);
    const blob = new Blob([dataStr], {type: "application/json"});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = "chart_data.json";
    a.click();
}

function loadData() {
    const input = document.createElement('input');
    input.type = 'file';
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

// 4. PDF
function downloadPDF() {
    const element = document.getElementById('capture-area');
    html2pdf().from(element).save('Ezi_Org_Chart.pdf');
}
