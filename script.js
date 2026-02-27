let employeeData = [];
let chart;

// Setup Template
OrgChart.templates.bppCustom = Object.assign({}, OrgChart.templates.ana);
OrgChart.templates.bppCustom.size = [250, 120];
OrgChart.templates.bppCustom.node = '<rect x="0" y="0" height="120" width="250" fill="#ffffff" stroke="#ccc" rx="10" ry="10"></rect>';

// Template Nama & Jawatan
OrgChart.templates.bppCustom.field_0 = '<foreignObject x="90" y="20" width="150" height="60"><div xmlns="http://www.w3.org/1999/xhtml" style="font-weight:bold;font-size:14px;">{val}</div></foreignObject>';
OrgChart.templates.bppCustom.field_1 = '<foreignObject x="90" y="70" width="150" height="40"><div xmlns="http://www.w3.org/1999/xhtml" style="font-size:12px;color:#666;">{val}</div></foreignObject>';
OrgChart.templates.bppCustom.img_0 = '<image xlink:href="{val}" x="15" y="25" width="60" height="60"></image>';

function renderChart() {
    const treeDiv = document.getElementById("tree");
    if (employeeData.length === 0) return;

    chart = new OrgChart(treeDiv, {
        nodes: employeeData,
        template: "bppCustom",
        nodeBinding: { field_0: "name", field_1: "title", img_0: "img" }
    });

    // Auto-wrap nama
    chart.on('field', function (sender, args) {
        if (args.name == "name") args.value = OrgChart.wrap(args.value, 15);
    });

    updateDropdown();
}

function addNode() {
    const name = document.getElementById('userName').value;
    const role = document.getElementById('userRole').value;
    const pid = document.getElementById('reportsTo').value || null;
    const photo = document.getElementById('userPhoto').files[0];

    if (!name || !role) return alert("Isi nama & jawatan!");

    const id = Date.now().toString();

    if (photo) {
        const reader = new FileReader();
        reader.onload = function(e) {
            // Kecilkan gambar guna Canvas secara pantas
            const img = new Image();
            img.onload = function() {
                const canvas = document.createElement('canvas');
                canvas.width = 100; canvas.height = 100;
                canvas.getContext('2d').drawImage(img, 0, 0, 100, 100);
                employeeData.push({ id, pid, name, title: role, img: canvas.toDataURL('image/jpeg', 0.6) });
                renderChart();
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(photo);
    } else {
        employeeData.push({ id, pid, name, title: role, img: "" });
        renderChart();
    }
}

function updateDropdown() {
    const s = document.getElementById('reportsTo');
    s.innerHTML = '<option value="">-- Melapor Kepada --</option>';
    employeeData.forEach(n => s.add(new Option(n.name, n.id)));
}
