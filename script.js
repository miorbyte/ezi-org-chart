let employeeData = [];
let chart;

function renderChart() {
    const treeElement = document.getElementById("tree");
    if (employeeData.length === 0) {
        treeElement.innerHTML = "";
        return;
    }

    treeElement.innerHTML = "";
    
    chart = new OrgChart(treeElement, {
        nodes: employeeData,
        enableSearch: false,
        menu: null,
        
        // --- AKTIFKAN EDIT & REPAIR ---
        nodeMenu: {
            edit: { text: "Repair / Edit" },
            remove: { text: "Padam Staf" }
        },

        nodeBinding: {
            field_0: "name",
            field_1: "title",
            img_0: "img"
        },

        // Update senarai bos jika ada perubahan nama/padam
        onUpdate: function() { updateParentDropdown(); },
        onRemove: function() { updateParentDropdown(); }
    });

    updateParentDropdown();
}

function updateParentDropdown() {
    const select = document.getElementById('reportsTo');
    const currentVal = select.value;
    select.innerHTML = '<option value="">-- Melapor Kepada --</option>';
    employeeData.forEach(node => {
        const opt = document.createElement('option');
        opt.value = node.id;
        opt.text = node.name;
        select.add(opt);
    });
    select.value = currentVal;
}

function addNode() {
    const nameInput = document.getElementById('userName');
    const roleInput = document.getElementById('userRole');
    const parentInput = document.getElementById('reportsTo');
    const photoInput = document.getElementById('userPhoto');

    if (!nameInput.value || !roleInput.value) {
        alert("Sila isi nama dan jawatan.");
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

function downloadPDF() {
    if (employeeData.length === 0) return;

    document.getElementById('displayTitle').innerText = document.getElementById('chartTitle').value || "CARTA ORGANISASI";

    if (chart) {
        // Zoom(1) bermaksud 100% saiz asal kotak.
        // Ini akan menghalang kotak jadi terlalu besar atau terlalu kecil.
        chart.zoom(1);
        chart.center(employeeData[0].id);
    }

    setTimeout(() => {
        window.print();
    }, 600);
}

// Fungsi Simpan & Buka JSON
function saveData() {
    const blob = new Blob([JSON.stringify(employeeData)], {type: "application/json"});
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = "data_bpp.json";
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
