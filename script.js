let employeeData = [];
let chart;

// Fungsi tajuk real-time
function updateTitle() {
    const val = document.getElementById('chartTitle').value;
    document.getElementById('displayTitle').innerText = val || "Tajuk Carta";
}

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
        mouseWheel: OrgChart.action.zoom,
        
        // --- AKTIFKAN REPAIR/DELETE ---
        nodeMenu: {
            edit: { text: "Repair / Edit" },
            remove: { text: "Delete Staf" }
        },

        nodeBinding: {
            field_0: "name",
            field_1: "title",
            img_0: "img"
        },

        // Update dropdown bila data berubah
        onUpdate: function() { updateParentDropdown(); },
        onRemove: function() { updateParentDropdown(); }
    });

    // Paksa carta duduk tengah
    setTimeout(() => {
        chart.center(employeeData[0].id);
    }, 300);

    updateParentDropdown();
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

function updateParentDropdown() {
    const select = document.getElementById('reportsTo');
    const current = select.value;
    select.innerHTML = '<option value="">-- Melapor Kepada --</option>';
    employeeData.forEach(node => {
        const opt = document.createElement('option');
        opt.value = node.id; opt.text = node.name;
        select.add(opt);
    });
    select.value = current;
}

function downloadPDF() {
    if (employeeData.length === 0) return;
    
    // Pastikan tajuk dan carta sedia
    updateTitle();
    chart.fit(); // Paksa muat 1 page
    chart.center(employeeData[0].id);

    setTimeout(() => {
        window.print();
    }, 500);
}

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
