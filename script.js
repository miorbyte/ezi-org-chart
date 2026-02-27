let employeeData = [];
let chart;

function renderChart() {
    const treeElement = document.getElementById("tree");
    if (employeeData.length === 0) return;
    treeElement.innerHTML = "";

    chart = new OrgChart(treeElement, {
        nodes: employeeData,
        enableSearch: false,
        mouseWheel: OrgChart.action.zoom,
        
        // Guna template 'ana' tapi kita akan besarkan kotaknya di CSS
        template: "ana", 
        
        nodeMenu: {
            edit: { text: "Repair / Edit" },
            remove: { text: "Delete Staf" }
        },
        
        // Nama field untuk gambar dalam template 'ana' adalah img_0
        nodeBinding: {
            field_0: "name",
            field_1: "title",
            img_0: "img" 
        }
    });

    // --- FUNGSI PAKSA NAMA JADI 2 BARIS ---
    chart.on('field', function (sender, args) {
        if (args.name == "name") {
            var name = args.value;
            // Jika nama panjang, kita wrap setiap 15-20 huruf
            if (name.length > 15) {
                args.value = OrgChart.wrap(name, 15);
            }
        }
    });

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

    if (!nameInput.value) return alert("Sila isi nama!");

    const id = Date.now().toString();
    const pid = parentInput.value || null;

    const process = (imgData) => {
        employeeData.push({ id, pid, name: nameInput.value, title: roleInput.value, img: imgData });
        renderChart();
        // Reset input lepas tambah
        nameInput.value = ""; 
        roleInput.value = ""; 
        photoInput.value = "";
    };

    if (photoInput.files && photoInput.files[0]) {
        const reader = new FileReader();
        reader.onload = (e) => process(e.target.result);
        reader.readAsDataURL(photoInput.files[0]);
    } else {
        process(""); // Jika tiada gambar
    }
}

// Fungsi lain (downloadPDF, saveData, loadData) kekal sama seperti sebelum ini...
function downloadPDF() {
    if (!chart) return;
    chart.zoom(1);
    chart.center(employeeData[0].id);
    setTimeout(() => { window.print(); }, 700);
}

function updateParentDropdown() {
    const s = document.getElementById('reportsTo');
    const cur = s.value;
    s.innerHTML = '<option value="">-- Melapor Kepada --</option>';
    employeeData.forEach(node => { s.add(new Option(node.name, node.id)); });
    s.value = cur;
}
