let employeeData = [];
let chart;

// 1. SETUP TEMPLATE (Custom BPP)
OrgChart.templates.bppCustom = Object.assign({}, OrgChart.templates.isla);
OrgChart.templates.bppCustom.size = [250, 120];
OrgChart.templates.bppCustom.node = '<rect x="0" y="0" height="120" width="250" fill="#ffffff" stroke-width="1" stroke="#aeaeae" rx="10" ry="10"></rect>';

// Gambar Staf (Bulat di sebelah kiri)
OrgChart.templates.bppCustom.img_0 = 
    '<clipPath id="ulaImg"><circle cx="50" cy="60" r="35"></circle></clipPath>' +
    '<image preserveAspectRatio="xMidYMid slice" clip-path="url(#ulaImg)" xlink:href="{val}" x="15" y="25" width="70" height="70"></image>';

// Nama Staf (Sokongan HTML untuk 2-3 baris)
OrgChart.templates.bppCustom.field_0 = 
    '<foreignObject x="95" y="20" width="145" height="60">' +
        '<div xmlns="http://www.w3.org/1999/xhtml" style="font-family:sans-serif; font-weight:bold; font-size:14px; color:#333; line-height:1.2; display:flex; align-items:center; height:100%; overflow:hidden;">{val}</div>' +
    '</foreignObject>';

// Jawatan Staf (Di bawah nama)
OrgChart.templates.bppCustom.field_1 = 
    '<foreignObject x="95" y="75" width="145" height="40">' +
        '<div xmlns="http://www.w3.org/1999/xhtml" style="font-family:sans-serif; font-size:12px; color:#666; line-height:1.1;">{val}</div>' +
    '</foreignObject>';

// 2. FUNGSI RENDER CARTA
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
            template: "bppCustom",
            nodeBinding: {
                field_0: "name",
                field_1: "title",
                img_0: "img"
            },
            nodeMenu: {
                edit: { text: "Edit Staf" },
                remove: { text: "Padam Staf" }
            }
        });

        // Logik Wrap Nama Otomatik (Pecah baris jika panjang)
        chart.on('field', function (sender, args) {
            if (args.name == "name" && args.value.length > 15) {
                args.value = OrgChart.wrap(args.value, 15);
            }
        });

        setTimeout(() => {
            chart.center(employeeData[0].id);
        }, 300);

        updateParentDropdown();
    } catch (e) {
        console.error("Ralat Render:", e);
    }
}

// 3. FUNGSI TAMBAH STAF DENGAN AUTO-COMPRESS FOTO
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

    if (photoInput.files && photoInput.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const img = new Image();
            img.onload = function() {
                // Kecilkan imej ke 150px (Resolusi optimum untuk carta)
                const compressedData = compressImage(img, 150, 150);
                saveAndRender(id, pid, nameInput.value, roleInput.value, compressedData);
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(photoInput.files[0]);
    } else {
        saveAndRender(id, pid, nameInput.value, roleInput.value, "");
    }

    function saveAndRender(id, pid, name, title, img) {
        employeeData.push({ id, pid, name, title, img });
        renderChart();
        
        // Reset Input
        nameInput.value = "";
        roleInput.value = "";
        photoInput.value = "";
        parentInput.value = "";
    }
}

// 4. FUNGSI PENGECILAN IMEJ (Canvas Resize)
function compressImage(img, width, height) {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    
    // Crop imej jadi petak tengah sebelum resize
    const minSide = Math.min(img.width, img.height);
    const sx = (img.width - minSide) / 2;
    const sy = (img.height - minSide) / 2;
    
    ctx.drawImage(img, sx, sy, minSide, minSide, 0, 0, width, height);
    return canvas.toDataURL('image/jpeg', 0.7); // Guna JPEG quality 70% (Ringan)
}

// 5. FUNGSI DROPDOWN KETUA
function updateParentDropdown() {
    const select = document.getElementById('reportsTo');
    const current = select.value;
    select.innerHTML = '<option value="">-- Melapor Kepada (Pilih Ketua) --</option>';
    employeeData.forEach(node => {
        const opt = document.createElement('option');
        opt.value = node.id;
        opt.textContent = node.name;
        select.appendChild(opt);
    });
    select.value = current;
}

// 6. SISTEM FAIL & CETAK
function downloadPDF() { window.print(); }

function saveData() {
    if (employeeData.length === 0) return alert("Tiada data untuk disimpan!");
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
            try {
                employeeData = JSON.parse(ev.target.result);
                renderChart();
            } catch(err) {
                alert("Fail JSON tidak sah!");
            }
        };
        reader.readAsText(e.target.files[0]);
    };
    input.click();
}
