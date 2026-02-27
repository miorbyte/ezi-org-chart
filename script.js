function setupTemplate() {
    OrgChart.templates.eziCustom = Object.assign({}, OrgChart.templates.ana);
    OrgChart.templates.eziCustom.size = [250, 130]; // Tinggikan sikit kotak
    
    // Design Kotak Staf
    OrgChart.templates.eziCustom.node = 
        '<rect x="0" y="0" height="130" width="250" fill="#ffffff" stroke="#e2e8f0" stroke-width="2" rx="15" ry="15"></rect>' +
        '<line x1="90" y1="60" x2="230" y2="60" stroke="#f1f5f9" stroke-width="1" />'; // Garis pemisah halus

    // Nama
    OrgChart.templates.eziCustom.field_0 = 
        '<foreignObject x="95" y="15" width="145" height="45">' +
            '<div xmlns="http://www.w3.org/1999/xhtml" style="font-weight:800; font-size:14px; color:#1e3a8a; line-height:1.1; display:flex; align-items:center; height:100%; word-break:break-word;">{val}</div>' +
        '</foreignObject>';

    // Jawatan (FIXED LINE HEIGHT)
    OrgChart.templates.eziCustom.field_1 = 
        '<foreignObject x="95" y="65" width="145" height="55">' +
            '<div xmlns="http://www.w3.org/1999/xhtml" style="font-size:12px; color:#64748b; line-height:1.3; font-weight:500; display:block; word-break:break-word;">{val}</div>' +
        '</foreignObject>';

    // Gambar Bulat dengan Border
    OrgChart.templates.eziCustom.img_0 = 
        '<clipPath id="ulaImg"><circle cx="45" cy="65" r="38"></circle></clipPath>' +
        '<circle cx="45" cy="65" r="40" fill="#f8fafc" stroke="#e2e8f0" stroke-width="1"></circle>' +
        '<image preserveAspectRatio="xMidYMid slice" clip-path="url(#ulaImg)" xlink:href="{val}" x="7" y="27" width="76" height="76"></image>';
}
