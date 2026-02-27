let employeeData = [];
let chart;

// 1. Fungsi untuk tunjuk nama fail yang dipilih pada label
function updateFileName(input) {
    const display = document.getElementById('file-name-display');
    if (input.files && input.files.length > 0) {
        display.textContent = "Foto: " + input.files[0].name;
        display.style.color = "#059669"; // Hijau jika ada fail
    } else {
        display.textContent = "Tiada foto dipilih";
        display.style.color = "#64748b";
    }
}

// 2. Setup Template Kotak Staf (Fix Jarak Baris & Kedudukan)
function setupTemplate() {
    OrgChart.templates.eziCustom = Object.assign({}, OrgChart.templates.ana);
    OrgChart.templates.eziCustom.size = [250, 120];
    OrgChart.templates.eziCustom.node = '<rect x="0" y="0" height="120" width="250" fill="#ffffff" stroke="#cbd5e1" stroke-width="1" rx="10" ry="10"></rect>';

    // Nama (Field 0) - Support Turun Baris
    OrgChart.templates.eziCustom.field_0 = 
        '<foreignObject x="90" y="15" width="150" height="50">' +
            '<div xmlns="http://www.w3.org/1999/xhtml" style="font-weight:bold; font-size:14px; color:#1e3a8a; line-height:1.1; display:flex; align-items:center; height:100%; word-break: break-word; overflow:hidden;">{val}</div>' +
        '</foreignObject>';

    // Jawatan (Field 1) - FIX: Jarak baris 1.2 supaya baris kedua nampak jelas
    OrgChart.templates.eziCustom.field_1 = 
        '<foreignObject x="90" y="65" width="150" height="45">' +
            '<div xmlns="http://www.w3.org/1999/xhtml" style="font-size:12px; color:#64748b; line-height:1.2; display:block; word-break: break-word; overflow:hidden;">{val}</div>' +
        '</foreignObject>';

    // Gambar Bulat Staf
    OrgChart.templates.eziCustom.img_0 = 
        '<clipPath id="ulaImg"><circle cx="45" cy="60" r="35"></circle></clipPath>' +
        '<image preserveAspectRatio="xMidYMid slice" clip-path="url(#ulaImg)" xlink:href="{val}" x="10" y="25" width="70" height="70"></image>';
}

// 3. Fungsi Lukis/Render Carta
function renderChart() {
    const treeDiv = document.getElementById("tree");
    if (employeeData.length === 0) return;

    if (!OrgChart.templates.eziCustom) setupTemplate();

    chart = new OrgChart(treeDiv, {
        nodes: employeeData,
        template: "eziCustom",
        enableSearch: false, // Sesuai permintaan anda sebelum ini
        nodeBinding: {
            field_0: "name",
            field_1: "title",
            img_0: "img"
        }
    });

    updateDropdown();
}

// 4. Tambah Staf Baru (Proses Gambar & Data)
function addNode() {
    const name = document.getElementById('userName').value;
    const role = document.getElementById('userRole').value;
    const pid = document.getElementById('reportsTo').value || null;
    const photo = document.getElementById('userPhoto').files[0];

    if (!name || !role) return alert("Sila masukkan Nama dan Jawatan!");

    const id = Date.now().toString();

    if (photo) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const img = new Image();
            img.onload = function() {
                const canvas = document.createElement('canvas');
                canvas.width = 150; canvas.height = 150;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, 150, 150);
                saveAndRender(id, pid, name, role, canvas.toDataURL('image/jpeg', 0.7));
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(photo);
    } else {
        saveAndRender(id, pid, name, role, ""); // Tanpa foto
    }
}

function saveAndRender(id, pid, name, title, img) {
    employeeData.push({ id, pid, name, title, img });
    renderChart();
    
    // Reset Input Borang
    document.getElementById('userName').value = "";
    document.getElementById('userRole').value = "";
    document.getElementById('userPhoto').value = "";
    document.getElementById('file-name-display').textContent = "Tiada foto dipilih";
    document.getElementById('file-name-display').style.color = "#64748b";
}

// 5. Kemaskini Senarai "Melapor Kepada"
function updateDropdown() {
    const select = document.getElementById('reportsTo');
    const currentSelection = select.value;
    select.innerHTML = '<option value="">-- Melapor Kepada (Ketua) --</option>';
    employeeData.forEach(node => {
        const option = new Option(node.name, node.id);
        select.add(option);
    });
    select.value = currentSelection;
}

// 6. Simpan Data ke Fail JSON
function saveData() {
    if (employeeData.length === 0) return alert("Tiada data untuk disimpan!");
    const dataStr = JSON.stringify(employeeData, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = "carta_organisasi_ezi.json";
    link.click();
}

// 7. Buka Data dari Fail JSON
function loadData() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = e => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onload = event => {
            employeeData = JSON.parse(event.target.result);
            renderChart();
        };
        reader.readAsText(file);
    };
    input.click();
}
