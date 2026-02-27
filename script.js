let employeeData = [];
let chart;

// 1. Render Carta Tanpa Search/Menu
function renderChart() {
    chart = new OrgChart(document.getElementById("tree"), {
        enableSearch: false,   // Buang kotak search
        enableDragDrop: false, // Elak tersalah tarik kotak
        mouseWheel: OrgChart.action.zoom,
        nodeBinding: {
            field_0: "name",
            field_1: "title",
            img_0: "img"
        },
        nodes: employeeData
    });
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
    const id = Date.now(); 
    const newNode = { id: id, pid: parent, name: name, title: role, img: img };
    
    employeeData.push(newNode);
    updateDropdown(name, id);
    renderChart();
    
    // Reset Form
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

// 3. Simpan Fail .json
function saveData() {
    if(employeeData.length === 0) { alert("Tiada data untuk disimpan."); return; }
    const dataStr = JSON.stringify(employeeData);
    const blob = new Blob([dataStr], {type: "application/json"});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = "my_org_chart.json";
    a.click();
}

// 4. Buka Fail .json
function loadData() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = ".json";
    input.onchange = e => {
        const reader = new FileReader();
        reader.onload = event => {
            employeeData = JSON.parse(event.target.result);
            document.getElementById('reportsTo').innerHTML = '<option value="">-- Pilih Bos --</option>';
            employeeData.forEach(node => updateDropdown(node.name, node.id));
            renderChart();
            alert("Data berjaya dimuat naik!");
        };
        reader.readAsText(e.target.files[0]);
    };
    input.click();
}

// 5. Cetak PDF
function downloadPDF() {
    const element = document.getElementById('capture-area');
    const opt = {
        margin: 10,
        filename: 'Ezi_Org_Chart.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'landscape' }
    };
    html2pdf().set(opt).from(element).save();
}

// 6. Tukar Warna Latar
function changeBg() {
    const color = document.getElementById('bgColorPicker').value;
    document.getElementById('capture-area').style.backgroundColor = color;
}
