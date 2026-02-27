let employeeData = [];
let chart;

// 1. Fungsi Utama Melukis Carta
function renderChart() {
    const treeElement = document.getElementById("tree");
    
    // Jika tiada data staf, kosongkan kawasan carta dan berhenti
    if (employeeData.length === 0) {
        treeElement.innerHTML = "";
        return;
    }

    // Padam kandungan lama dalam kotak 'tree' sebelum lukis baru
    treeElement.innerHTML = "";

    try {
        chart = new OrgChart(treeElement, {
            nodes: employeeData,
            enableSearch: false,    // Matikan fungsi carian (JavaScript Level)
            enableDragDrop: false,  // Matikan fungsi tarik-lepas
            nodeMenu: null,         // Matikan menu pada setiap kotak
            menu: {},               // Kosongkan menu utama
            mouseWheel: OrgChart.action.zoom, // Benarkan zoom guna scroll
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

// 2. Tambah Kakitangan & Update Tajuk
function addNode() {
    const nameInput = document.getElementById('userName');
    const roleInput = document.getElementById('userRole');
    const parentInput = document.getElementById('reportsTo');
    const photoInput = document.getElementById('userPhoto');
    const titleInput = document.getElementById('chartTitle');
    const displayTitle = document.getElementById('displayTitle');

    // --- FORCE UPDATE TAJUK ---
    // Mengambil nilai dari input dan terus paparkan di skrin
    displayTitle.innerText = titleInput.value || "Carta Organisasi";

    // Validasi input Nama dan Jawatan
    if (!nameInput.value || !roleInput.value) { 
        alert("Sila masukkan Nama dan Jawatan."); 
        return; 
    }

    const id = Date.now().toString();
    // Staf pertama yang dimasukkan akan automatik menjadi Ketua (pid: null)
    const pid = (employeeData.length === 0) ? null : (parentInput.value || null);

    const handleNewNode = (imgData) => {
        const newNode = { 
            id: id, 
            pid: pid, 
            name: nameInput.value, 
            title: roleInput.value, 
            img: imgData 
        };
        
        employeeData.push(newNode);
        
        // Kemas kini dropdown senarai bos secara automatik
        const select = document.getElementById('reportsTo');
        const opt = document.createElement('option');
        opt.value = id;
        opt.text = nameInput.value;
        select.add(opt);
        
        // Lukis semula carta dengan data baru
        renderChart();
        
        // Kosongkan semula borang input staf (kecuali tajuk carta)
        nameInput.value = "";
        roleInput.value = "";
        photoInput.value = "";
    };

    // Proses gambar jika ada dimuat naik
    if (photoInput.files && photoInput.files[0]) {
        const reader = new FileReader();
        reader.onload = (e) => handleNewNode(e.target.result);
        reader.readAsDataURL(photoInput.files[0]);
    } else {
        handleNewNode(""); // Simpan tanpa gambar jika tiada fail dipilih
    }
}

// 3. Fungsi Cetak (Menggunakan Print Pelayar)
function downloadPDF() {
    if (employeeData.length === 0) {
        alert("Sila masukkan data staf terlebih dahulu.");
        return;
    }
    // Update tajuk sekali lagi sebelum cetak untuk kepastian
    const titleInput = document.getElementById('chartTitle');
    document.getElementById('displayTitle').innerText = titleInput.value || "Carta Organisasi";
    
    window.print();
}

// 4. Simpan Data ke fail .json (Backup)
function saveData() {
    if (employeeData.length === 0) return;
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
                
                // Reset tajuk carta dari data yang di-load (opsional)
                // Jika anda mahu simpan tajuk dalam JSON, perlu sedikit perubahan pada saveData
                
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
