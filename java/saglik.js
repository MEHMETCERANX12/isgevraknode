function saglikrapordevam1()
{
    let tarih = $('#tarih').val().trim();
    if (tarihkontrol(tarih) === false)
    {
        alertify.error("Lütfen geçerli bir tarih giriniz");
        return;
    }
    store.set("saglikraportarih", tarih);
    let firmaid = firmasecimoku();
    if (!firmaid)
    {
        alertify.error("Lütfen işyeri seçiniz");
        return;
    }
    window.location.href = "/saglikraporukvkk2?id=" + encodeURIComponent(firmaid);
}
function saglikraporu2load()
{
    let calisanjson = jsoncevir(store.get("saglikcalisanjson"));
    $('#tablo').DataTable
    ({
        data: calisanjson,
        pageLength: -1,
        order: [[1, 'asc']],
        lengthChange: false,
        columns:
        [
            { data:null,title:"Seçim",render:(d,t,r)=>`<input type="checkbox" name="secim" class="row-checkbox" data-id="${r.x}|${r.y}">`,orderable:false},
            { data: "x", title: "Ad Soyad" },
            { data: "y", title: "Unvan",orderable:false },
            { data:null,title:"Gece Çalışır",render:(d,t,r)=>`<input type="checkbox" name="gece" class="row-checkbox" data-id="${r.x}|${r.y}">`,orderable:false},
            { data:null,title:"Yüksekte Çalışır",render:(d,t,r)=>`<input type="checkbox" name="yuksek" class="row-checkbox" data-id="${r.x}|${r.y}">`,orderable:false},

        ],
        language:{search:"Çalışan Ara:",lengthMenu:"Sayfa başına _MENU_ kayıt göster",zeroRecords:"Çalışan bulunamadı",info:"_TOTAL_ kayıttan _START_ ile _END_ arası gösteriliyor",infoEmpty:"Çalışan bulunamadı",infoFiltered:"(toplam _MAX_ kayıttan filtrelendi)",emptyTable:"Çalışan bulunamadı"},
        createdRow:function(r){$(r).find("td").eq(1).css("text-align","left");$(r).find("td").eq(2).css("text-align","left");},
        headerCallback: function (thead) {$(thead).find('th').css('text-align', 'center');}
    });
    $('.dt-search input').css({ "background-color": "white" }).attr("autocomplete", "off");
    $('.dt-length select').css({ "background-color": "white" });
}
function saglikraportumsecim()
{
    let hepsiSecili = $('#tablo tbody input[name="secim"]:checked').length === $('#tablo tbody input[name="secim"]').length;
    $('#tablo tbody input[name="secim"]').prop('checked', !hepsiSecili);
}
function saglikraporgececalisir()
{
    let hepsiSecili = $('#tablo tbody input[name="gece"]:checked').length === $('#tablo tbody input[name="gece"]').length;
    $('#tablo tbody input[name="gece"]').prop('checked', !hepsiSecili);
}
function saglikraporyuksektecalisir()
{
    let hepsiSecili = $('#tablo tbody input[name="yuksek"]:checked').length === $('#tablo tbody input[name="yuksek"]').length;
    $('#tablo tbody input[name="yuksek"]').prop('checked', !hepsiSecili);
}
function saglikraporcalisansecim() {
    var calisanjson = [];
    var table = $('#tablo').DataTable();
    table.rows().every(function () {
        var $row = $(this.node());
        var secim = $row.find('input[name="secim"]').prop('checked');

        if (secim) {
            var rowKey = $row.find('input[name="secim"]').data('id');
            if (rowKey) {
                var [adsoyad, unvan] = rowKey.split('|');
                var gece = $row.find('input[name="gece"]').prop('checked') ? 1 : 0;
                var yuksek = $row.find('input[name="yuksek"]').prop('checked') ? 1 : 0;
                let durum = "";
                if (gece === 1 && yuksek === 0) durum = "Gece veya vardiyalı olarak çalışır.";
                else if (gece === 0 && yuksek === 1) durum = "Yüksekte Çalışır.";
                else if (gece === 1 && yuksek === 1) durum = "Gece veya vardiyalı olarak ve yüksekte çalışır.";

                calisanjson.push({
                    a: adsoyad,
                    u: unvan,
                    gece: gece,
                    yuksek: yuksek,
                    durum: durum
                });
            }
        }
    });
    return calisanjson;
}
function saglikraporyazdir()
{
    let tarih = store.get("saglikraportarih");
    let json = saglikraporcalisansecim();
    if (json.length == 0)
    {
        alertify.error("En az bir kişi seçiniz");
        return;
    }
    let isyeri = jsoncevir(store.get('xjsonfirma')) || {};
    let hekimad = isyeri.hk;
    let hekimno = isyeri.hn;
    let isyeriunvan = isyeri.fi;
    let sicil = isyeri.sc;
    let adres = isyeri.ad;
    const { Document, Packer, TextRun, Paragraph, Table, TableRow, TableCell, WidthType, PageBreak, AlignmentType, Footer } = docx;
    const girisparagraflar =
    [
        new Paragraph({children:[new TextRun({text:"ÇALIŞAN İŞE GİRİŞ / PERİYODİK MUAYENE FORMU",bold:true,size:24,font:"Calibri"})],spacing:{before:0,after:100},alignment:AlignmentType.CENTER}),
        new Paragraph({children:[new TextRun({text:"\tİşyerine Ait Bilgiler",size:24,font:"Calibri",bold:true})],spacing:{before:100,after:100},alignment:AlignmentType.JUSTIFIED}),
        new Paragraph({ children: [new TextRun({ text: "\tİşyeri Unvanı: " + isyeriunvan, size: 22, font: "Calibri" })], spacing: { before: 100, after: 100 }, alignment: AlignmentType.JUSTIFIED }),
        new Paragraph({ children: [new TextRun({ text: "\tSGK Sicil No: " + sicil, size: 22, font: "Calibri" })], spacing: { before: 100, after: 100 }, alignment: AlignmentType.JUSTIFIED }),
        new Paragraph({ children: [new TextRun({ text: "\tAdres: " + adres, size: 22, font: "Calibri" })], spacing: { before: 100, after: 100 }, alignment: AlignmentType.JUSTIFIED }),
        new Paragraph({ children: [new TextRun({ text: "\tİşyeri Hekimi: " + hekimad + " - " + hekimno, size: 22, font: "Calibri" })], spacing: { before: 100, after: 100 }, alignment: AlignmentType.JUSTIFIED }),
        new Paragraph({children:[new TextRun({text:"\tÇalışana Ait Bilgiler",size:24,font:"Calibri",bold:true})],spacing:{before:100,after:100},alignment:AlignmentType.JUSTIFIED}),
    ];
    let calisanparagraf = [];
    json.forEach((item, index) =>
    {
        calisanparagraf.push(...girisparagraflar);
        calisanparagraf.push
        (
            new Paragraph({children: [new TextRun({ text: "\tAdı Soyadı: " + item.a, size: 22, font: "Calibri" })], spacing: { before: 100, after: 100 }, alignment: AlignmentType.JUSTIFIED }),
            new Paragraph({children: [new TextRun({ text: "\tGörev/Unvan: " + item.u, size: 22, font: "Calibri" })], spacing: { before: 100, after: 100 }, alignment: AlignmentType.JUSTIFIED }),
            new Paragraph({children: [new TextRun({ text: "\t" + tarih + " tarihinde işe giriş periyodik muayenesi yapılmış olan kimlik bilgileri yukarıda yazılı olan çalışanın EK-2 işe giriş periyodik muayenesine istinaden;", size: 22, font: "Calibri" })], spacing: { before: 100, after: 100 }, alignment: AlignmentType.JUSTIFIED }),
            new Paragraph({children: [new TextRun({text:"\tKanaat ve Sonuç",size:24,font:"Calibri",bold:true})],spacing:{before:100,after:100},alignment:AlignmentType.JUSTIFIED}),
            new Paragraph({children: [new TextRun({text:"\t" + item.u + " işinde bedenen ve ruhen çalışmaya elverişlidir. " + item.durum,size:22,font:"Calibri"})],spacing:{before:100,after:100},alignment:AlignmentType.JUSTIFIED}),
            new Paragraph({children: [new TextRun({text:"Tarih: " + tarih,size:24,font:"Calibri",bold:true})],spacing:{before:50,after:50},alignment:AlignmentType.RIGHT}),
            new Paragraph({children: [new TextRun({text:"\tAdı ve Soyadı: ",size:24,font:"Calibri",bold:true})],spacing:{before:50,after:50},alignment:AlignmentType.LEFT}),
            new Paragraph({children: [new TextRun({text:"\tDiploma Tarih ve Tesis No: ",size:24,font:"Calibri",bold:true})],spacing:{before:50,after:50},alignment:AlignmentType.LEFT}),
            new Paragraph({children: [new TextRun({text:"\tİşyeri Hekimliği Belge No: ",size:24,font:"Calibri",bold:true})],spacing:{before:50,after:50},alignment:AlignmentType.LEFT}),
        );
        if (index < json.length - 1) {  calisanparagraf.push(new Paragraph({ children: [new PageBreak()] }));}
    });
    const doc=new Document({sections:[{properties:{page:{size:{orientation:"landscape",width:8391,height:11906},margin:{top:567,right:567,bottom:567,left:567,header: 360,footer: 360}}},footers:{default:new Footer({children:[new Paragraph({children:[new TextRun({text:"\tBu form, Kişisel Verilerin Korunması kanunu kapsamında İşyeri Hekimi ve Diğer Sağlık Personelinin Görev, Yetki, Sorumluluk ve Eğitimleri Hakkında Yönetmeliğin EK-2 de yer alan “İşe Giriş ve Periyodik Muayene formunu” referans alarak hazırlanmıştır.",size:16,font:"Calibri"})]})]})},children:[...calisanparagraf]}]});
    Packer.toBlob(doc).then(blob => { saveAs(blob, "Sağlık Raporu.docx"); });
}
