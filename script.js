let employeeData = [];
let chart;

// Fungsi Lukis Carta
function renderChart() {
    const treeElement = document.getElementById("tree");
    if (employeeData.length === 0) {
        treeElement.innerHTML = "";
        return;
    }

    treeElement.innerHTML = ""; // Bersihkan kawasan

    try {
        chart = new OrgChart(treeElement, {
            nodes: employeeData,
            enableSearch: false, // Matikan search
            nodeMenu: null,      // Matikan menu kotak
            menu: {},            // Matikan menu utama
            mouseWheel: OrgChart.action.zoom,
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

// Tambah Staf & Update Tajuk
function addNode() {
    const titleInput = document.getElementById('chartTitle');
    const displayTitle = document.getElementById('displayTitle');
    const nameInput = document.getElementById('userName');
    const roleInput = document.getElementById('userRole');
    const parentInput = document.getElementById('reportsTo');
    const photoInput = document.getElementById('userPhoto');

    // Paksa update tajuk di preview
    displayTitle.innerText = titleInput.value || "Carta Organisasi";

    if (!nameInput.value || !roleInput.value) {
        alert("Sila masukkan Nama dan Jawatan.");
        return;
    }

    const id = Date.now().toString();
    const pid = (employeeData.length === 0) ? null : (parentInput.value || null);

    const completeProcess = (imgData) => {
        employeeData.push({ id, pid, name: nameInput.value, title: roleInput.value, img: imgData });
        
        // Update Dropdown Bos
        const opt = document.createElement('option');
        opt.value = id;
        opt.text = nameInput.value;
        parentInput.add(opt);
        
        renderChart();
        
        // Kosongkan input staf
        nameInput.value = "";
        roleInput.value = "";
        photoInput.value = "";
    };

    if (photoInput.files && photoInput.files[0]) {
        const reader = new FileReader();
        reader.onload = (e) => completeProcess(e.target.result);
        reader.readAsDataURL(photoInput.files[0]);
    } else {
        completeProcess("");
    }
}

// Fungsi Cetak (Dibaiki untuk Tajuk PDF)
function downloadPDF() {
    if (employeeData.length === 0) {
        alert("Masukkan data staf dahulu.");
        return;
    }

    // Pastikan tajuk terkini diambil sebelum cetak
    const titleInput = document.getElementById('chartTitle');
    document.getElementById('displayTitle').innerText = titleInput.value || "CARTA ORGANISASI";

    // Beri masa DOM update sekejap (0.5 saat)
    setTimeout(() => {
        window.print();
    }, 500);
}

// Simpan JSON
function saveData() {
    if (employeeData.length === 0) return;
    const blob = new Blob([JSON.stringify(employeeData)], {type: "application/json"});
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = "data_ezichart.json";
    a.click();
}

// Buka JSON
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
