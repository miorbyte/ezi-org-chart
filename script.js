let employeeData = [];
let chart;

// 1. KITA BINA TEMPLATE KHAS YANG BOLEH TERIMA 2 BARIS
OrgChart.templates.bppCustom = Object.assign({}, OrgChart.templates.ana);
OrgChart.templates.bppCustom.size = [250, 120]; // Besarkan kotak sikit
OrgChart.templates.bppCustom.node = '<rect x="0" y="0" height="120" width="250" fill="#ffffff" stroke-width="1" stroke="#aeaeae" rx="10" ry="10"></rect>';

// Tukar teks biasa kepada 'foreignObject' supaya HTML <br> berfungsi
OrgChart.templates.bppCustom.field_0 = 
    '<foreignObject x="70" y="30" width="170" height="60">' +
        '<div xmlns="http://www.w3.org/1999/xhtml" style="font-family:sans-serif; font-weight:bold; font-size:14px; color:#333; line-height:1.2; text-align:left; display:flex; align-items:center; height:100%;">' +
            '{val}' +
        '</div>' +
    '</foreignObject>';

function renderChart() {
    const treeElement = document.getElementById("tree");
    if (employeeData.length === 0) return;
    treeElement.innerHTML = "";

    chart = new OrgChart(treeElement, {
        nodes: employeeData,
        enableSearch: false,
        template: "bppCustom", // Guna template buatan kita tadi
        nodeMenu: {
            edit: { text: "Repair / Edit" },
            remove: { text: "Padam Staf" }
        },
        nodeBinding: {
            field_0: "name",
            field_1: "title",
            img_0: "img"
        }
    });

    // --- LOGIK POTONG NAMA JADI 2 BARIS ---
    chart.on('field', function (sender, args) {
        if (args.name == "name") {
            let nameValue = args.value;
            if (nameValue.length > 15) {
                let words = nameValue.split(" ");
                let mid = Math.ceil(words.length / 2);
                let line1 = words.slice(0, mid).join(" ");
                let line2 = words.slice(mid).join(" ");
                // Gunakan <br> kerana template kita sekarang sokong HTML
                args.value = line1 + "<br>" + line2;
            }
        }
    });

    setTimeout(() => { chart.center(employeeData[0].id); }, 300);
    updateParentDropdown();
}

// Fungsi addNode, downloadPDF, saveData, loadData kekal sama...
function addNode() {
    const name = document.getElementById('userName').value;
    const role = document.getElementById('userRole').value;
    const pid = document.getElementById('reportsTo').value || null;
    const photo = document.getElementById('userPhoto').files[0];

    if (!name || !role) return alert("Isi nama dan jawatan!");

    const id = Date.now().toString();
    if (photo) {
        const reader = new FileReader();
        reader.onload = (e) => {
            employeeData.push({ id, pid, name, title: role, img: e.target.result });
            renderChart();
            resetInputs();
        };
        reader.readAsDataURL(photo);
    } else {
        employeeData.push({ id, pid, name, title: role, img: "" });
        renderChart();
        resetInputs();
    }
}

function resetInputs() {
    document.getElementById('userName').value = "";
    document.getElementById('userRole').value = "";
    document.getElementById('userPhoto').value = "";
    updateParentDropdown();
}

function updateParentDropdown() {
    const s = document.getElementById('reportsTo');
    const cur = s.value;
    s.innerHTML = '<option value="">-- Melapor Kepada --</option>';
    employeeData.forEach(n => s.add(new Option(n.name, n.id)));
    s.value = cur;
}

function downloadPDF() { window.print(); }
