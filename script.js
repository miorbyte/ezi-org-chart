// 1. BINA TEMPLATE KHAS YANG LEBIH LUAS & TERSUSUN
OrgChart.templates.bppCustom = Object.assign({}, OrgChart.templates.ana);
OrgChart.templates.bppCustom.size = [250, 120]; // Kotak luas

// Lukis kotak putih (Background)
OrgChart.templates.bppCustom.node = '<rect x="0" y="0" height="120" width="250" fill="#ffffff" stroke-width="1" stroke="#aeaeae" rx="10" ry="10"></rect>';

// Kedudukan Gambar (Pindah ke kiri sikit supaya tak tindih nama)
OrgChart.templates.bppCustom.img_0 = 
    '<clipPath id="ulaImg"><circle cx="50" cy="60" r="35"></circle></clipPath>' +
    '<image preserveAspectRatio="xMidYMid slice" clip-path="url(#ulaImg)" xlink:href="{val}" x="15" y="25" width="70" height="70"></image>';

// Kedudukan Nama (Field_0) - Kita beri ruang luas di sebelah kanan gambar
OrgChart.templates.bppCustom.field_0 = 
    '<foreignObject x="95" y="20" width="145" height="60">' +
        '<div xmlns="http://www.w3.org/1999/xhtml" style="font-family:sans-serif; font-weight:bold; font-size:14px; color:#333; line-height:1.2; display:flex; align-items:center; height:100%;">' +
            '{val}' +
        '</div>' +
    '</foreignObject>';

// Kedudukan Jawatan (Field_1) - Letak di bawah nama
OrgChart.templates.bppCustom.field_1 = 
    '<foreignObject x="95" y="75" width="145" height="40">' +
        '<div xmlns="http://www.w3.org/1999/xhtml" style="font-family:sans-serif; font-size:12px; color:#666; line-height:1.1;">' +
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
        template: "bppCustom", // Guna template buatan kita
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

    // --- LOGIK WRAP NAMA ---
    chart.on('field', function (sender, args) {
        if (args.name == "name") {
            let nameValue = args.value;
            if (nameValue.length > 15) {
                // Wrap setiap 15 aksara secara automatik
                args.value = OrgChart.wrap(nameValue, 15);
            }
        }
    });

    setTimeout(() => { chart.center(employeeData[0].id); }, 300);
}
