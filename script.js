let employeeData = [];
let chart;

function renderChart() {
    // Jika data kosong, jangan buat apa-apa
    if (employeeData.length === 0) return;

    // Musnahkan carta lama jika wujud untuk elak ralat
    document.getElementById("tree").innerHTML = "";

    chart = new OrgChart(document.getElementById("tree"), {
        nodes: employeeData,
        nodeBinding: {
            field_0: "name",
            field_1: "title",
            img_0: "img"
        }
    });
}

function addNode() {
    const name = document.getElementById('userName').value;
    const role = document.getElementById('userRole').value;
    const parent = document.getElementById('reportsTo').value;
    const photoInput = document.getElementById('userPhoto');

    if (!name || !role) { alert("Isi nama & jawatan!"); return; }

    const id = Date.now().toString();
    // PENTING: Jika staf pertama, pid MESTI kosong (null)
    const pid = employeeData.length === 0 ? null : (parent || null);

    const process = (imgData) => {
        employeeData.push({ id: id, pid: pid, name: name, title: role, img: imgData });
        
        // Tambah ke dropdown
        const opt = document.createElement('option');
        opt.value = id;
        opt.text = name;
        document.getElementById('reportsTo').add(opt);
        
        renderChart();
        
        // Clear input
        document.getElementById('userName').value = "";
        document.getElementById('userRole').value = "";
    };

    if (photoInput.files && photoInput.files[0]) {
        const reader = new FileReader();
        reader.onload = (e) => process(e.target.result);
        reader.readAsDataURL(photoInput.files[0]);
    } else {
        process("");
    }
}

function downloadPDF() { window.print(); }

function saveData() {
    const blob = new Blob([JSON.stringify(employeeData)], {type: "application/json"});
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = "carta.json";
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
