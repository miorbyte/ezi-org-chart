let employeeData = [];
let chart;

function renderChart() {
    const treeElement = document.getElementById("tree");
    if (employeeData.length === 0) {
        treeElement.innerHTML = "";
        return;
    }

    treeElement.innerHTML = ""; // Bersihkan kawasan sebelum lukis

    try {
        chart = new OrgChart(treeElement, {
            nodes: employeeData,
            enableSearch: false, // Matikan search
            menu: null,          // MATIKAN MENU (Tiga Baris)
            nodeMenu: null,      // Matikan menu pada kotak staf
            mouseWheel: OrgChart.action.zoom,
            nodeBinding: {
                field_0: "name",
                field_1: "title",
                img_0: "img"
            }
        });
    } catch (e) {
        console.error("Ralat lukis carta:", e);
    }
}

function addNode() {
    const titleInput = document.getElementById('chartTitle');
    const displayTitle = document.getElementById('displayTitle');
    const nameInput = document.getElementById('userName');
    const roleInput = document.getElementById('userRole');
    const parentInput = document.getElementById('reportsTo');
    const photoInput = document.getElementById('userPhoto');

    // Update tajuk preview serta-merta
    displayTitle.innerText = titleInput.value || "Carta Organisasi";

    if (!nameInput.value || !roleInput.value) {
        alert("Sila isi Nama dan Jawatan.");
        return;
    }

    const id = Date.now().toString();
    const pid = (employeeData.length === 0) ? null : (parentInput.value || null);

    const process = (imgData) => {
        employeeData.push({ id, pid, name: nameInput.value, title: roleInput.value, img: imgData });
        
        // Update senarai pilihan bos
        const opt = document.createElement('option');
        opt.value = id; opt.text = nameInput.value;
        parentInput.add(opt);
        
        renderChart();
        
        // Reset input staf
        nameInput.value = "";
        roleInput.value = "";
        photoInput.value = "";
    };

    if (photoInput.files && photoInput.files[0]) {
        const reader = new FileReader();
        reader.onload = (e) => process(e.target.result);
        reader.readAsDataURL(photoInput.files[0]);
    } else {
        process("");
    }
}

function downloadPDF() {
    if (employeeData.length === 0) {
        alert("Sila masukkan data dahulu.");
        return;
    }
    // Pastikan tajuk terkini dipasang sebelum cetak
    document.getElementById('displayTitle').innerText = document.getElementById('chartTitle').value || "CARTA ORGANISASI";
    
    // Beri masa singkat untuk DOM dikemaskini
    setTimeout(() => {
        window.print();
    }, 300);
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
