let employeeData = [];
let chart;

// 1. Fungsi Melukis Carta
function renderChart() {
    const treeElement = document.getElementById("tree");
    if (employeeData.length === 0) {
        treeElement.innerHTML = "";
        return;
    }

    treeElement.innerHTML = "";

    try {
        chart = new OrgChart(treeElement, {
            nodes: employeeData,
            enableSearch: false,
            menu: null,
            
            // TAMBAH MENU EDIT & PADAM
            nodeMenu: {
                edit: { text: "Repair / Edit" },
                remove: { text: "Delete Staf" }
            },
            
            // Kemaskini data secara automatik selepas edit/padam
            onRemove: function(id) {
                employeeData = employeeData.filter(node => node.id !== id);
                updateParentDropdown();
            },
            onUpdate: function(node) {
                // Mencari dan mengemaskini data dalam array asal
                const index = employeeData.findIndex(item => item.id === node.id);
                if (index !== -1) employeeData[index] = node;
                updateParentDropdown();
            },

            nodeBinding: {
                field_0: "name",
                field_1: "title",
                img_0: "img"
            }
        });
    } catch (e) { console.error(e); }

    updateParentDropdown();
}

// 2. Kemaskini Senarai Pilihan Bos
function updateParentDropdown() {
    const select = document.getElementById('reportsTo');
    const currentValue = select.value;
    select.innerHTML = '<option value="">-- Melapor Kepada (Pilih Bos) --</option>';
    
    employeeData.forEach(node => {
        const opt = document.createElement('option');
        opt.value = node.id;
        opt.text = node.name;
        select.add(opt);
    });
    select.value = currentValue;
}

// 3. Tambah Staf Baru
function addNode() {
    const titleInput = document.getElementById('chartTitle');
    const nameInput = document.getElementById('userName');
    const roleInput = document.getElementById('userRole');
    const parentInput = document.getElementById('reportsTo');
    const photoInput = document.getElementById('userPhoto');

    if (!nameInput.value || !roleInput.value) {
        alert("Sila masukkan Nama dan Jawatan.");
        return;
    }

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

// 4. Fungsi Cetak
function downloadPDF() {
    if (employeeData.length === 0) return;
    
    document.getElementById('displayTitle').innerText = document.getElementById('chartTitle').value || "CARTA ORGANISASI";

    if (chart) {
        chart.zoom(1.2); 
        chart.center(employeeData[0].id);
    }

    setTimeout(() => {
        window.print();
    }, 500);
}

// 5. Simpan/Buka Data (JSON)
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
            renderChart();
        };
        reader.readAsText(e.target.files[0]);
    };
    input.click();
}
