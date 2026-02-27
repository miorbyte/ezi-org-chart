let employeeData = [];
let chart;

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
        template: "isla", 
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

    // --- TEKNIK MUKTAMAT: TUKAR SVG KEPADA HTML DIV ---
    chart.on('field', function (sender, args) {
        if (args.name == "name") {
            let nameValue = args.value;
            // Kita pecahkan nama mengikut jarak
            let words = nameValue.split(" ");
            let line1, line2;

            if (words.length > 2) {
                let mid = Math.ceil(words.length / 2);
                line1 = words.slice(0, mid).join(" ");
                line2 = words.slice(mid).join(" ");
            } else {
                line1 = nameValue;
                line2 = "";
            }

            // Gantikan teks SVG dengan HTML Div yang boleh wrap
            args.html = `
                <div style="display:flex; align-items:center; justify-content:center; height:100%; width:100%;">
                    <div style="font-weight:bold; font-size:14px; color:#333; text-align:center; line-height:1.2; word-break:normal;">
                        ${line1}${line2 ? '<br>' + line2 : ''}
                    </div>
                </div>`;
        }
    });

    setTimeout(() => {
        chart.center(employeeData[0].id);
    }, 300);

    updateParentDropdown();
}

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
    employeeData.forEach(n => {
        s.add(new Option(n.name, n.id));
    });
    s.value = cur;
}

function downloadPDF() { window.print(); }

function saveData() {
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
            employeeData = JSON.parse(ev.target.result);
            renderChart();
        };
        reader.readAsText(e.target.files[0]);
    };
    input.click();
}
