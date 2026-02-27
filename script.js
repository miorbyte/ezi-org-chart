let employeeData = [];
let chart;

// 1. Fungsi Utama Melukis Carta
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
            nodeMenu: null,      
            mouseWheel: OrgChart.action.zoom,
            nodeBinding: {
                field_0: "name",
                field_1: "title",
                img_0: "img"
            }
        });
    } catch (e) {
        console.error("Gagal melukis carta:", e);
    }
}

// 2. Tambah Kakitangan & Kemaskini Tajuk
function addNode() {
    const titleInput = document.getElementById('chartTitle');
    const displayTitle = document.getElementById('displayTitle');
    const nameInput = document.getElementById('userName');
    const roleInput = document.getElementById('userRole');
    const parentInput = document.getElementById('reportsTo');
    const photoInput = document.getElementById('userPhoto');

    // Update tajuk di preview segera
    displayTitle.innerText = titleInput.value || "Carta Organisasi";

    if (!nameInput.value || !roleInput.value) {
        alert("Sila isi Nama dan Jawatan.");
        return;
    }

    const id = Date.now().toString();
    const pid = (employeeData.length === 0) ? null : (parentInput.value || null);

    const completeProcess = (imgData) => {
        employeeData.push({ id, pid, name: nameInput.value, title: roleInput.value, img: imgData });
        
        // Update senarai pilihan 'Melapor Kepada'
        const opt = document.createElement('option');
        opt.value = id;
        opt.text = nameInput.value;
        parentInput.add(opt);
        
        renderChart();
        
        // Reset borang
        nameInput.value = "";
        roleInput.value = "";
        photoInput.value = "";
    };

    if (photoInput.files && photoInput.files[0]) {
        const reader = new FileReader();
        reader.onload = (e) => completeProcess(e.target.result);
        reader.readAsDataURL(photoInput.files[0]);
    } else {
        completeProcess("");
    }
}

// 3. Fungsi Cetak (Ditala untuk Portrait Besar)
function downloadPDF() {
    if (employeeData.length === 0) {
        alert("Sila masukkan data staf dahulu.");
        return;
    }

    // Pastikan tajuk dimasukkan ke elemen display
    const titleValue = document.getElementById('chartTitle').value || "CARTA ORGANISASI";
    document.getElementById('displayTitle').innerText = titleValue;

    if (chart) {
        // PENTING: Jangan guna fit()! Guna zoom(1) untuk saiz kotak yang besar
        chart.zoom(1); 
        // Fokuskan kepada ketua jabatan (node pertama) supaya seimbang
        chart.center(employeeData[0].id); 
    }

    // Beri masa DOM kemaskini
    setTimeout(() => {
        window.print();
    }, 600);
}

// 4. Simpan Data (.json)
function saveData() {
    if (employeeData.length === 0) return;
    const blob = new Blob([JSON.stringify(employeeData)], {type: "application/json"});
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = "data_ezichart.json";
    a.click();
}

// 5. Buka Data (.json)
function loadData() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = e => {
        const reader = new FileReader();
        reader.onload = ev => {
            employeeData = JSON.parse(ev.target.result);
            const select = document.getElementById('reportsTo');
            select.innerHTML = '<option value="">-- Melapor Kepada --</option>';
            employeeData.forEach(node => {
                const opt = document.createElement('option');
                opt.value = node.id; opt.text = node.name;
                select.add(opt);
            });
            renderChart();
        };
        reader.readAsText(e.target.files[0]);
    };
    input.click();
}
