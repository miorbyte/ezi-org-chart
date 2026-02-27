let employeeData = [];
let chart;

function renderChart() {
    const treeElement = document.getElementById("tree");
    if (employeeData.length === 0) {
        treeElement.innerHTML = "";
        return;
    }
    
    // Reset kawasan carta
    treeElement.innerHTML = "";

    try {
        chart = new OrgChart(treeElement, {
            nodes: employeeData,
            enableSearch: false,
            template: "ana", // Template paling ringan
            nodeMenu: {
                edit: { text: "Repair / Edit" },
                remove: { text: "Padam" }
            },
            nodeBinding: {
                field_0: "name",
                field_1: "title",
                img_0: "img"
            }
        });
    } catch (err) {
        console.error("Gagal bina carta:", err);
    }
}

function addNode() {
    const nameInput = document.getElementById('userName');
    const roleInput = document.getElementById('userRole');
    const parentInput = document.getElementById('reportsTo');
    const photoInput = document.getElementById('userPhoto');

    if (!nameInput.value || !roleInput.value) {
        alert("Sila isi nama dan jawatan!");
        return;
    }

    const id = Date.now().toString();
    const pid = parentInput.value || null;

    const reader = new FileReader();
    if (photoInput.files && photoInput.files[0]) {
        reader.onload = function(e) {
            employeeData.push({ id: id, pid: pid, name: nameInput.value, title: roleInput.value, img: e.target.result });
            renderChart();
            clearInputs();
        };
        reader.readAsDataURL(photoInput.files[0]);
    } else {
        employeeData.push({ id: id, pid: pid, name: nameInput.value, title: roleInput.value, img: "" });
        renderChart();
        clearInputs();
    }
}

function clearInputs() {
    document.getElementById('userName').value = "";
    document.getElementById('userRole').value = "";
    document.getElementById('userPhoto').value = "";
    updateParentDropdown();
}

function updateParentDropdown() {
    const s = document.getElementById('reportsTo');
    const cur = s.value;
    s.innerHTML = '<option value="">-- Melapor Kepada --</option>';
    employeeData.forEach(node => {
        const opt = document.createElement('option');
        opt.value = node.id;
        opt.innerHTML = node.name;
        s.appendChild(opt);
    });
    s.value = cur;
}

function downloadPDF() {
    // Fungsi cetak yang paling asas
    window.print();
}

// Fungsi Simpan/Buka JSON (Pilihan)
function saveData() {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(employeeData));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "data_bpp.json");
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
}

function loadData() {
    const input = document.createElement('input');
    input.type = 'file';
    input.onchange = e => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onload = readerEvent => {
            employeeData = JSON.parse(readerEvent.target.result);
            renderChart();
        };
        reader.readAsText(file);
    };
    input.click();
}
