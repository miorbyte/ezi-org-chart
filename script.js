let employeeData = [];
let chart;

window.onload = function() {
    renderChart();
};

function renderChart() {
    // Bersihkan kawasan carta sebelum lukis
    document.getElementById("tree").innerHTML = "";
    chart = new OrgChart(document.getElementById("tree"), {
        nodes: employeeData,
        nodeBinding: {
            field_0: "name",
            field_1: "title",
            img_0: "img"
        }
    });
}

function addNode() {
    const name = document.getElementById('userName').value;
    const role = document.getElementById('userRole').value;
    const parent = document.getElementById('reportsTo').value;
    const photoInput = document.getElementById('userPhoto');
    const titleText = document.getElementById('chartTitle').value;

    document.getElementById('displayTitle').innerText = titleText || "Carta Organisasi";

    if (!name || !role) { 
        alert("Sila masukkan nama dan jawatan."); 
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
    const id = Date.now().toString();
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
    
    // Kosongkan input selepas tambah
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

function downloadPDF() {
    if (employeeData.length === 0) {
        alert("Sila masukkan data terlebih dahulu.");
        return;
    }
    window.print(); // Membuka dialog cetakan pelayar
}

function saveData() {
    if (employeeData.length === 0) return;
    const dataStr = JSON.stringify(employeeData);
    const blob = new Blob([dataStr], {type: "application/json"});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = "ezi_org_data.json";
    a.click();
}

function loadData() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = e => {
        const reader = new FileReader();
        reader.onload = event => {
            employeeData = JSON.parse(event.target.result);
            document.getElementById('reportsTo').innerHTML = '<option value="">-- Melapor Kepada --</option>';
            employeeData.forEach(node => updateDropdown(node.name, node.id));
            renderChart();
        };
        reader.readAsText(e.target.files[0]);
    };
    input.click();
}
