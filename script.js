let employeeData = [];
let chart;

function renderChart() {
    const treeElement = document.getElementById("tree");
    if (employeeData.length === 0) return;

    // Bersihkan sebelum lukis
    treeElement.innerHTML = "";

    try {
        chart = new OrgChart(treeElement, {
            nodes: employeeData,
            enableSearch: false, // Konfigurasi utama matikan search
            enableDragDrop: false,
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
        alert("Sila isi Nama & Jawatan."); 
        return; 
    }

    const id = Date.now().toString();
    const pid = (employeeData.length === 0) ? null : (parent || null);

    const completeAdd = (imgData) => {
        employeeData.push({ id, pid, name, title: role, img: imgData });
        
        // Update senarai dropdown
        const select = document.getElementById('reportsTo');
        const opt = document.createElement('option');
        opt.value = id;
        opt.text = name;
        select.add(opt);
        
        renderChart();
        
        // Reset input
        document.getElementById('userName').value = "";
        document.getElementById('userRole').value = "";
        document.getElementById('userPhoto').value = "";
    };

    if (photoInput.files && photoInput.files[0]) {
        const reader = new FileReader();
        reader.onload = (e) => completeAdd(e.target.result);
        reader.readAsDataURL(photoInput.files[0]);
    } else {
        completeAdd("");
    }
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
    const blob = new Blob([JSON.stringify(employeeData)], {type: "application/json"});
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = "data_ezichart.json";
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
            const select = document.getElementById('reportsTo');
            select.innerHTML = '<option value="">-- Melapor Kepada --</option>';
            employeeData.forEach(node => {
                const opt = document.createElement('option');
                opt.value = node.id; opt.text = node.name;
                select.add(opt);
            });
            renderChart();
        };
        reader.readAsText(e.target.files[0]);
    };
    input.click();
}
