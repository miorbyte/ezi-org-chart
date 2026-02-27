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
        mouseWheel: OrgChart.action.zoom,
        // Menu repair/edit
        nodeMenu: {
            edit: { text: "Repair / Edit" },
            remove: { text: "Delete Staf" }
        },
        nodeBinding: {
            field_0: "name",
            field_1: "title",
            img_0: "img"
        }
    });

    // Lepas render, paksa carta ke tengah kawasan preview
    setTimeout(() => {
        chart.fit();
        chart.center(employeeData[0].id);
    }, 200);

    updateParentDropdown();
}

function addNode() {
    const nameInput = document.getElementById('userName');
    const roleInput = document.getElementById('userRole');
    const parentInput = document.getElementById('reportsTo');
    const photoInput = document.getElementById('userPhoto');

    if (!nameInput.value) return alert("Sila isi nama!");

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
    const s = document.getElementById('reportsTo');
    const cur = s.value;
    s.innerHTML = '<option value="">-- Melapor Kepada --</option>';
    employeeData.forEach(node => { s.add(new Option(node.name, node.id)); });
    s.value = cur;
}

function downloadPDF() {
    if (!chart) return;
    // Paksa carta ke tengah dan muat 1 page sebelum print
    chart.fit();
    chart.center(employeeData[0].id);
    setTimeout(() => { window.print(); }, 500);
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
