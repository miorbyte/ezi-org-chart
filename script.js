let employeeData = [];
let chart;

// 1. Inisialisasi - Pastikan library sedia
window.onload = function() {
    console.log("Aplikasi Sedia");
};

function renderChart() {
    const treeElement = document.getElementById("tree");
    
    // Padam kandungan lama
    treeElement.innerHTML = "";

    // Jika tiada data, jangan lukis apa-apa
    if (employeeData.length === 0) return;

    try {
        chart = new OrgChart(treeElement, {
            nodes: employeeData,
            nodeBinding: {
                field_0: "name",
                field_1: "title",
                img_0: "img"
            }
        });
    } catch (e) {
        console.error("Gagal melukis carta:", e);
    }
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

    // Tukar ID kepada String supaya stabil
    const id = Date.now().toString();

    // Logik PENTING: Jika staf pertama, PID mesti null
    const pid = (employeeData.length === 0) ? null : (parent ? parent : null);

    if (photoInput.files && photoInput.files[0]) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const newNode = { id: id, pid: pid, name: name, title: role, img: e.target.result };
            employeeData.push(newNode);
            updateDropdown(name, id);
            renderChart();
        };
        reader.readAsDataURL(photoInput.files[0]);
    } else {
        const newNode = { id: id, pid: pid, name: name, title: role, img: "" };
        employeeData.push(newNode);
        updateDropdown(name, id);
        renderChart();
    }

    // Reset input
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
        alert("Tiada data untuk dicetak.");
        return;
    }
    window.print();
}

function saveData() {
    if (employeeData.length === 0) return;
    const dataStr = JSON.stringify(employeeData);
    const blob = new Blob([dataStr], {type: "application/json"});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = "data_carta.json";
    a.click();
}

function loadData() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = e => {
        const reader = new FileReader();
        reader.onload = event => {
            try {
                employeeData = JSON.parse(event.target.result);
                document.getElementById('reportsTo').innerHTML = '<option value="">-- Melapor Kepada --</option>';
                employeeData.forEach(node => updateDropdown(node.name, node.id));
                renderChart();
            } catch (err) {
                alert("Fail JSON tidak sah!");
            }
        };
        reader.readAsText(e.target.files[0]);
    };
    input.click();
}
