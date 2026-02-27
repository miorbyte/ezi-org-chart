let employeeData = [];
let chart;

// 1. DEFINISI TEMPLATE (CUSTOM) - Untuk pastikan nama 2-3 baris & jawatan muncul
OrgChart.templates.bppCustom = Object.assign({}, OrgChart.templates.ana);
OrgChart.templates.bppCustom.size = [250, 120]; 

OrgChart.templates.bppCustom.node = '<rect x="0" y="0" height="120" width="250" fill="#ffffff" stroke-width="1" stroke="#aeaeae" rx="10" ry="10"></rect>';

// Gambar Staf
OrgChart.templates.bppCustom.img_0 = 
    '<clipPath id="ulaImg"><circle cx="50" cy="60" r="35"></circle></clipPath>' +
    '<image preserveAspectRatio="xMidYMid slice" clip-path="url(#ulaImg)" xlink:href="{val}" x="15" y="25" width="70" height="70"></image>';

// Nama (Field 0) - Menggunakan foreignObject supaya boleh wrap (turun baris)
OrgChart.templates.bppCustom.field_0 = 
    '<foreignObject x="95" y="20" width="145" height="60">' +
        '<div xmlns="http://www.w3.org/1999/xhtml" style="font-family:sans-serif; font-weight:bold; font-size:14px; color:#333; line-height:1.2; display:flex; align-items:center; height:100%; overflow:hidden;">' +
            '{val}' +
        '</div>' +
    '</foreignObject>';

// Jawatan (Field 1)
OrgChart.templates.bppCustom.field_1 = 
    '<foreignObject x="95" y="75" width="145" height="40">' +
        '<div xmlns="http://www.w3.org/1999/xhtml" style="font-family:sans-serif; font-size:12px; color:#666; line-height:1.1;">' +
            '{val}' +
        '</div>' +
    '</foreignObject>';

// 2. FUNGSI UTAMA RENDER CARTA
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
        template: "bppCustom",
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

    // Logik automatik pecahkan nama panjang (Wrap)
    chart.on('field', function (sender, args) {
        if (args.name == "name") {
            if (args.value.length > 15) {
                args.value = OrgChart.wrap(args.value, 15);
            }
        }
    });

    setTimeout(() => {
        chart.center(employeeData[0].id);
    }, 300);

    updateParentDropdown();
}

// 3. FUNGSI TAMBAH STAF (FIXED)
function addNode() {
    // Pastikan ID ini sama dengan dalam index.html
    const nameInput = document.getElementById('userName');
    const roleInput = document.getElementById('userRole');
    const parentInput = document.getElementById('reportsTo');
    const photoInput = document.getElementById('userPhoto');

    // Validasi ringkas
    if (!nameInput.value || !roleInput.value) {
        alert("Sila masukkan Nama dan Jawatan!");
        return;
    }

    const id = Date.now().toString();
    const pid = parentInput.value || null;

    const processAddition = (imgData) => {
        employeeData.push({ 
            id: id, 
            pid: pid, 
            name: nameInput.value, 
            title: roleInput.value, 
            img: imgData 
        });
        
        renderChart();
        
        // Kosongkan input selepas berjaya
        nameInput.value = "";
        roleInput.value = "";
        photoInput.value = "";
    };

    // Proses Gambar
    if (photoInput.files && photoInput.files[0]) {
        const reader = new FileReader();
        reader.onload = (e) => processAddition(e.target.result);
        reader.readAsDataURL(photoInput.files[0]);
    } else {
        processAddition(""); // Tambah tanpa gambar
    }
}

// 4. FUNGSI KEMAS KINI DROPDOWN (BOS)
function updateParentDropdown() {
    const select = document.getElementById('reportsTo');
    const currentValue = select.value;
    select.innerHTML = '<option value="">-- Melapor Kepada (Pilih Ketua) --</option>';
    
    employeeData.forEach(node => {
        const opt = document.createElement('option');
        opt.value = node.id;
        opt.textContent = node.name;
        select.appendChild(opt);
    });
    
    select.value = currentValue;
}

// 5. FUNGSI SISTEM (CETAK, SIMPAN, BUKA)
function downloadPDF() {
    if (!chart) return alert("Tiada data untuk dicetak!");
    window.print();
}

function saveData() {
    if (employeeData.length === 0) return alert("Tiada data untuk disimpan!");
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(employeeData));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "data_bpp.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
}

function loadData() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = e => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onload = readerEvent => {
            try {
                employeeData = JSON.parse(readerEvent.target.result);
                renderChart();
            } catch (err) {
                alert("Fail JSON tidak sah!");
            }
        };
        reader.readAsText(file);
    };
    input.click();
}
