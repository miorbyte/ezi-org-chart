function downloadPDF() {
    const element = document.getElementById('capture-area');
    const treeElement = document.getElementById('tree');
    
    // 1. Simpan saiz asal supaya kita boleh reset balik nanti
    const originalWidth = treeElement.style.width;
    const originalHeight = treeElement.style.height;

    // 2. Paksa saiz lebar yang besar supaya carta tidak "berhimpit" (Wrap)
    // Kita guna 1200px sebagai standard lebar carta yang selesa
    treeElement.style.width = "1200px"; 
    treeElement.style.height = "auto"; 

    const opt = {
        margin:       0.2,
        filename:     'Ezi_Org_Chart.pdf',
        image:        { type: 'jpeg', quality: 1 },
        html2canvas:  { 
            scale: 2, 
            useCORS: true,
            width: 1200, // Paksa tangkap pada lebar 1200px
            windowWidth: 1200
        },
        jsPDF:        { 
            unit: 'in', 
            format: 'a4', 
            orientation: 'landscape',
            compress: true
        }
    };

    // 3. Jalankan html2pdf dengan mod 'Scale to Page'
    // html2pdf secara automatik akan kecilkan 1200px tadi ke saiz A4 Landscape
    html2pdf().set(opt).from(element).toPdf().get('pdf').then(function (pdf) {
        // Reset semula rupa paras web selepas siap cetak
        treeElement.style.width = originalWidth;
        treeElement.style.height = originalHeight;
    }).save();
}
