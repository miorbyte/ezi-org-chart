let employeeData = [];
let chart;

// 1. Fungsi Utama Melukis Carta
function renderChart() {
    // Jika tiada data staf, jangan buat apa-apa
    if (employeeData.length === 0) return;

    // Padam kandungan lama dalam kotak 'tree' sebelum lukis baru
    const treeElement = document.getElementById("tree");
    treeElement.innerHTML = "";

    try {
        chart = new OrgChart(treeElement, {
            nodes: employeeData,
            enableSearch: false, // MEMBUANG KOTAK SEARCH
            mouseWheel: OrgChart.action.zoom, // Benarkan zoom guna scroll tetikus
            nodeBinding: {
                field_0: "name",
                field_1: "title",
                img_0: "img"
            }
        });
    } catch (e) {
        console.error("Gagal memaparkan carta:", e);
    }
}

// 2. Tambah Kakitangan
function addNode() {
    const name = document.getElementById('userName').value;
    const role = document.getElementById('userRole').value;
    const parent = document.getElementById('reportsTo').value;
    const photoInput = document.getElementById('userPhoto');
    const titleText = document.getElementById('chartTitle').value;

    // Kemas kini tajuk carta yang dipaparkan
    document.getElementById('displayTitle').innerText = titleText || "Carta Organisasi";

    if (!name || !role) { 
        alert("Sila masukkan Nama dan Jawatan."); 
        return; 
    }

    const id = Date.now().toString();
    // Logik PID: Staf pertama mesti null (Ketua Tertinggi)
    const pid = (employeeData.length === 0) ? null : (parent ? parent : null);

    const handleNewNode = (imgData) => {
        const newNode = { id: id, pid: pid, name: name, title: role, img: imgData };
        employeeData.push(newNode);
        
        // Kemas kini dropdown senarai bos
        const select = document.getElementById('reportsTo');
        const opt = document.createElement('option');
        opt.value = id;
        opt.text = name;
        select.add(opt);
        
        renderChart();
        
        // Kosongkan semula borang input
        document.getElementById('userName').value = "";
        document.getElementById('userRole').value = "";
        document.getElementById('userPhoto').value = "";
    };

    // Proses gambar jika ada dimuat naik
    if (photoInput.files && photoInput.files[0]) {
        const reader = new FileReader();
        reader.onload = (e) => handleNewNode(e.target.result);
        reader.readAsDataURL(photoInput.files[0]);
    } else {
        handleNewNode(""); // Tanpa gambar
    }
}

// 3. Fungsi Cetak (Menggunakan Print Pelayar)
function downloadPDF() {
    if (employeeData.length === 0) {
        alert("Sila masukkan data staf terlebih dahulu.");
        return;
    }
    window.print();
}

// 4. Simpan Data ke fail .json
function saveData() {
    if (employeeData.length === 0) {
        alert("Tiada data untuk disimpan.");
        return;
    }
    const dataStr = JSON.stringify(employeeData);
    const blob = new Blob([dataStr], {type: "application/json"});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = "data_ezi_org.json";
    a.click();
}

// 5. Buka Data dari fail .json
function loadData() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = e => {
        const reader = new FileReader();
        reader.onload = event => {
            try {
                employeeData = JSON.parse(event.target.result);
                // Reset dropdown 'Reports To'
                const select = document.getElementById('reportsTo');
                select.innerHTML = '<option value="">-- Melapor Kepada --</option>';
                
                // Isi semula dropdown dan lukis carta
                employeeData.forEach(node => {
                    const opt = document.createElement('option');
                    opt.value = node.id;
                    opt.text = node.name;
                    select.add(opt);
                });
                renderChart();
            } catch (err) {
                alert("Ralat: Fail JSON tidak sah!");
            }
        };
        reader.readAsText(e.target.files[0]);
    };
    input.click();
}
