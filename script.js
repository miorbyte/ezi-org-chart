let employeeData = [];
let chart;

// 1. TEMPLATE CUSTOM
if (OrgChart) {
    OrgChart.templates.bppCustom = Object.assign({}, OrgChart.templates.isla);
    OrgChart.templates.bppCustom.size = [250, 120];
    OrgChart.templates.bppCustom.node = '<rect x="0" y="0" height="120" width="250" fill="#ffffff" stroke-width="1" stroke="#aeaeae" rx="10" ry="10"></rect>';

    OrgChart.templates.bppCustom.img_0 = 
        '<clipPath id="ulaImg"><circle cx="50" cy="60" r="35"></circle></clipPath>' +
        '<image preserveAspectRatio="xMidYMid slice" clip-path="url(#ulaImg)" xlink:href="{val}" x="15" y="25" width="70" height="70"></image>';

    OrgChart.templates.bppCustom.field_0 = 
        '<foreignObject x="95" y="20" width="145" height="60">' +
            '<div xmlns="http://www.w3.org/1999/xhtml" style="font-family:sans-serif; font-weight:bold; font-size:14px; color:#333; line-height:1.2; display:flex; align-items:center; height:100%; overflow:hidden;">{val}</div>' +
        '</foreignObject>';

    OrgChart.templates.bppCustom.field_1 = 
        '<foreignObject x="95" y="75" width="145" height="40">' +
            '<div xmlns="http://www.w3.org/1999/xhtml" style="font-family:sans-serif; font-size:12px; color:#666; line-height:1.1;">{val}</div>' +
        '</foreignObject>';
}

function renderChart() {
    console.log("Melukis carta dengan data:", employeeData);
    const treeElement = document.getElementById("tree");
    if (!treeElement) return console.error("Elemen #tree tidak dijumpai!");
    
    treeElement.innerHTML = "";

    try {
        chart = new OrgChart(treeElement, {
            nodes: employeeData,
            enableSearch: false,
            template: "bppCustom",
            nodeBinding: { field_0: "name", field_1: "title", img_0: "img" },
            nodeMenu: { edit: { text: "Edit" }, remove: { text: "Padam" } }
        });

        chart.on('field', function (sender, args) {
            if (args.name == "name" && args.value.length > 15) {
                args.value = OrgChart.wrap(args.value, 15);
            }
        });
    } catch (e) {
        console.error("Gagal melukis carta:", e);
    }
}

function addNode() {
    const name = document.getElementById('userName').value;
    const role = document.getElementById('userRole').value;
    const parent = document.getElementById('reportsTo').value || null;
    const photoFile = document.getElementById('userPhoto').files[0];

    if (!name || !role) return alert("Nama dan Jawatan wajib diisi!");

    const id = Date.now().toString();

    if (photoFile) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const img = new Image();
            img.onload = function() {
                const canvas = document.createElement('canvas');
                canvas.width = 150; canvas.height = 150;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, 150, 150);
                const compressed = canvas.toDataURL('image/jpeg', 0.7);
                saveData(id, parent, name, role, compressed);
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(photoFile);
    } else {
        saveData(id, parent, name, role, "");
    }
}

function saveData(id, pid, name, title, img) {
    employeeData.push({ id, pid, name, title, img });
    renderChart();
    // Clear inputs
    document.getElementById('userName').value = "";
    document.getElementById('userRole').value = "";
    document.getElementById('userPhoto').value = "";
    updateParentDropdown();
}

function updateParentDropdown() {
    const select = document.getElementById('reportsTo');
    const current = select.value;
    select.innerHTML = '<option value="">-- Melapor Kepada --</option>';
    employeeData.forEach(node => {
        const opt = document.createElement('option');
        opt.value = node.id;
        opt.textContent = node.name;
        select.appendChild(opt);
    });
    select.value = current;
}

function downloadPDF() { window.print(); }
