async function isgkurulciktiwordyaz()
{
    let json = jsoncevir(store.get("isgkurulsecim"));
    let kurulveri = json.kurulveri || [];
    kurulveri = jsoncevir(kurulveri);
    let kuruluye = json.kuruluye || [];
    kuruluye = jsoncevir(kuruluye);
    let kurulicerik = json.kurulicerik || [];
    kurulicerik = jsoncevir(kurulicerik);
    let tarih = kurulveri[0].tarih;
    let konu = kurulveri[0].konu;
    let saat = kurulveri[0].saat;
    const aylar = {0:"Olağanüstü İsg Kurul Toplantısı",1:"Ocak Ayı Olağan İsg Kurul Toplantısı",2:"Şubat Ayı Olağan İsg Kurul Toplantısı",3:"Mart Ayı Olağan İsg Kurul Toplantısı",4:"Nisan Ayı Olağan İsg Kurul Toplantısı",5:"Mayıs Ayı Olağan İsg Kurul Toplantısı",6:"Haziran Ayı Olağan İsg Kurul Toplantısı",7:"Temmuz Ayı Olağan İsg Kurul Toplantısı",8:"Ağustos Ayı Olağan İsg Kurul Toplantısı",9:"Eylül Ayı Olağan İsg Kurul Toplantısı",10:"Ekim Ayı Olağan İsg Kurul Toplantısı",11:"Kasım Ayı Olağan İsg Kurul Toplantısı",12:"Aralık Ayı Olağan İsg Kurul Toplantısı"};
    let konuyazi = aylar[konu] || "Bilinmeyen Konu";
    let isyeri = jsoncevir(store.get("xjsonfirma"));
    let isyeriunvan = isyeri.fi;
    let isyeriadres = isyeri.ad;
    let sgksicil = isyeri.sc;
    let tehlikesinifimap = { 1: "Az Tehlikeli", 2: "Tehlikeli", 3: "Çok Tehlikeli" };
    let tehlikesinifi = parseInt(isyeri.ts);
    tehlikesinifi = tehlikesinifimap[tehlikesinifi];
    const { Document, Packer, TextRun, Paragraph, Table, TableRow, TableCell, WidthType, BorderStyle, AlignmentType, HeightRule, VerticalAlign } = docx;
    let kararparagraf = [];
    kurulicerik.forEach(item => { kararparagraf.push ( new Paragraph({ children: [ new TextRun({ text: `${item.i}-) ${item.m}`, size: 22, font: "Calibri" })], spacing: { before: 50, after: 50 }, alignment: AlignmentType.JUSTIFIED}));});
    let kurulustbaslik = [];
    kurulustbaslik.push(new Paragraph({ alignment: AlignmentType.CENTER, style: "Normal", spacing: { after: 200 }, border: { top: { color: "000000", space: 1, style: BorderStyle.SINGLE }, bottom: { color: "000000", space: 1, style: BorderStyle.SINGLE }, left: { color: "000000", space: 1, style: BorderStyle.SINGLE }, right: { color: "000000", space: 1, style: BorderStyle.SINGLE } }, children: [new TextRun({ text: "İŞ SAĞLIĞI ve GÜVENLİĞİ KURUL KARARI", bold: true, font: "Calibri", size: 28 })] }));
    kurulustbaslik.push(new Paragraph({ text: `İşyeri Unvanı: ` + isyeriunvan, spacing: { after: 100 }, style: "Normal" }));
    kurulustbaslik.push(new Paragraph({ text: `İşyeri Adresi: ` + isyeriadres, spacing: { after: 100 }, style: "Normal" }));
    kurulustbaslik.push(new Paragraph({ text: `İşyeri SGK Sicil No: ` + sgksicil, spacing: { after: 100 }, style: "Normal" }));
    kurulustbaslik.push(new Paragraph({ text: `Toplantı Tarihi: ` + tarih, spacing: { after: 100 }, style: "Normal" }));
    kurulustbaslik.push(new Paragraph({ text: `Toplantı Saati: ` + saat, spacing: { after: 100 }, style: "Normal" }));
    kurulustbaslik.push(new Paragraph({ text: `Toplantı Konusu: ` + konuyazi, spacing: { after: 100 }, style: "Normal" }));
    kurulustbaslik.push(new Paragraph({ alignment: AlignmentType.CENTER, style: "Normal", spacing: { after: 200 }, border: { top: { color: "000000", space: 1, style: BorderStyle.SINGLE }, bottom: { color: "000000", space: 1, style: BorderStyle.SINGLE }, left: { color: "000000", space: 1, style: BorderStyle.SINGLE }, right: { color: "000000", space: 1, style: BorderStyle.SINGLE } }, children: [new TextRun({ text: "KURUL KARAR METNİ", bold: true, font: "Calibri", size: 28 })] }));
    const imzaicerik = [];
    imzaicerik.push(new TableRow
    ({
        height: { value: 400, rule: HeightRule.EXACT },
        children:
        [
            new TableCell({verticalAlign: VerticalAlign.CENTER,width: { size: 30, type: WidthType.PERCENTAGE }, children: [ new Paragraph({ alignment: AlignmentType.CENTER, children: [ new TextRun({ text: "Katılımcı Bilgileri", bold: true, size: 22, font: "Calibri" }) ] }) ] }),
            new TableCell({verticalAlign: VerticalAlign.CENTER, width: { size: 20, type: WidthType.PERCENTAGE }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "İmza", bold: true, size: 22, font: "Calibri" })] })] }),
            new TableCell({verticalAlign: VerticalAlign.CENTER, width: { size: 30, type: WidthType.PERCENTAGE }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Katılımcı Bilgileri", bold: true, size: 22, font: "Calibri" })] })] }),
            new TableCell({verticalAlign: VerticalAlign.CENTER,width: { size: 20, type: WidthType.PERCENTAGE }, children: [ new Paragraph({ alignment: AlignmentType.CENTER, children: [ new TextRun({ text: "İmza", bold: true, size: 22, font: "Calibri" }) ] }) ] }),
        ]
    })
);
    for (let i = 0; i < kuruluye.length; i += 2)
    {
        const uye1 = kuruluye[i];
        const uye2 = kuruluye[i + 1];
        imzaicerik.push(new TableRow
        ({
            height: { value: 750, rule: HeightRule.EXACT },
            children:
            [
                new TableCell({verticalAlign: VerticalAlign.CENTER,children:[new Paragraph({alignment:AlignmentType.CENTER,children:[new TextRun({text:uye1.a,size:22,font:"Calibri",bold:true}),new TextRun({text:uye1.u,break:1,size:22,font:"Calibri"})]})]}),
                new TableCell({children:[new Paragraph({alignment:AlignmentType.CENTER,children:[new TextRun({text:"",size:22})]})]}),
                new TableCell({verticalAlign: VerticalAlign.CENTER,children:[new Paragraph({alignment:AlignmentType.CENTER,children:[new TextRun({text: uye2 ? uye2.a : "",size:22,font:"Calibri",bold:true}),new TextRun({text: uye2 ? uye2.u : "",break:1,size:22,font:"Calibri"})]})]}),
                new TableCell({children:[new Paragraph({alignment:AlignmentType.CENTER,children:[new TextRun({text:"",size:22})]})]})
            ]
        }));
    }
    const imzatablo = new Table({width: {size: 100, type: WidthType.PERCENTAGE},rows:imzaicerik,borders:{top:{style:BorderStyle.SINGLE,size:1,color:"000000"},bottom:{style:BorderStyle.SINGLE,size:1,color:"000000"},left:{style:BorderStyle.SINGLE,size:1,color:"000000"},right:{style:BorderStyle.SINGLE,size:1,color:"000000"},insideHorizontal:{style:BorderStyle.SINGLE,size:1,color:"000000"},insideVertical:{style:BorderStyle.SINGLE,size:1,color:"000000"}}});
    const doc = new Document({
    styles:
    {
        paragraphStyles:
        [
            {id: "Normal", run: { font: "Calibri", size: 22 }, paragraph: {alignment: AlignmentType.JUSTIFIED }},
        ]
    },
    sections:
    [
        {
            properties: { page: { margin: { top: 850, right: 850, bottom: 850, left: 850 } } },
            headers: { default: new docx.Header({ children: kurulustbaslik})},
            children: [...kararparagraf],
            footers: { default: new docx.Footer({ children: [imzatablo] })}
        }
    ]
    });
    const blob = await Packer.toBlob(doc);
    saveAs(blob, "İş Sağlığı ve Güvenliği Kurulu - " + metinuret(3) + ".docx");
}
async function isgkurulatamawordyaz()
{
    let kuruluye = jsoncevir(store.get("kuruluyejson"));
    let isyeri = jsoncevir(store.get("xjsonfirma"));
    let hekimad = isyeri.hk;
    let uzmanad = store.get("uzmanad");
    kuruluye.push( { a: uzmanad, u: "İş Güvenliği Uzmanı" }, { a: hekimad, u: "İşyeri Hekimi" });
    const { Document, Packer, TextRun, Paragraph, Table, TableRow, TableCell, WidthType, BorderStyle, AlignmentType, HeightRule, VerticalAlign } = docx;
    let isyeriunvan = isyeri.fi;
    let isyeriadres = isyeri.ad;
    let sgksicil = isyeri.sc;
    let tehlikesinifimap = { 1: "Az Tehlikeli", 2: "Tehlikeli", 3: "Çok Tehlikeli" };
    let tehlikesinifi = parseInt(isyeri.ts);
    tehlikesinifi = tehlikesinifimap[tehlikesinifi];
    let kurulustbaslik = [];
    kurulustbaslik.push(new Paragraph({ alignment: AlignmentType.CENTER, style: "Normal", spacing: { after: 200 }, border: { top: { color: "000000", space: 1, style: BorderStyle.SINGLE }, bottom: { color: "000000", space: 1, style: BorderStyle.SINGLE }, left: { color: "000000", space: 1, style: BorderStyle.SINGLE }, right: { color: "000000", space: 1, style: BorderStyle.SINGLE } }, children: [new TextRun({ text: "İŞ SAĞLIĞI ve GÜVENLİĞİ KURUL ÜYE GÖREVLENDİRMESİ", bold: true, font: "Calibri", size: 28 })] }));
    kurulustbaslik.push(new Paragraph({ text: `\tİşyeri Unvanı: ` + isyeriunvan, spacing: { after: 100 }, style: "Normal" }));
    kurulustbaslik.push(new Paragraph({ text: `\tİşyeri Adresi: ` + isyeriadres, spacing: { after: 100 }, style: "Normal" }));
    kurulustbaslik.push(new Paragraph({ text: `\tİşyeri SGK Sicil No: ` + sgksicil, spacing: { after: 100 }, style: "Normal" }));
    kurulustbaslik.push(new Paragraph({ text: `\tİş Sağlığı ve Güvenliği Kurulları Hakkında Yönetmeliğin 6. Maddesi çerçevesinde işyerimizde iş sağlığı ve güvenliği kurulunun aşağıda adı, soyadı ve görevleri belirtilen kişilerden oluşmasına karar verilmiştir. Kurul, iş sağlığı ve güvenliği ile ilgili alınacak kararları oy birliği veya oy çokluğu esasına göre belirleyecek olup, alınan kararların en kısa sürede ve ivedilikle uygulanması işveren tarafından sağlanacaktır.`, spacing: { after: 200 }, style: "Normal" }));
    const imzaicerik = [];
    for (let i = 0; i < kuruluye.length; i += 3)
    {
        const uye1 = kuruluye[i];
        const uye2 = kuruluye[i + 1];
        const uye3 = kuruluye[i + 2];
        imzaicerik.push(new TableRow
        ({
            height: { value: 1400, rule: HeightRule.EXACT },
            children:
            [
                new TableCell({verticalAlign: VerticalAlign.CENTER, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: uye1 ? uye1.a : "", size: 22, font: "Calibri", bold: true }), new TextRun({ text: uye1 ? uye1.u : "", break: 1, size: 22, font: "Calibri" }), new TextRun({ text: uye1 ? "İmza" : "", break: 1, size: 22, font: "Calibri" })] })] }),
                new TableCell({verticalAlign:VerticalAlign.CENTER,children:[new Paragraph({alignment:AlignmentType.CENTER,children:[new TextRun({text:uye2?uye2.a:"",size:22,font:"Calibri",bold:true}),new TextRun({text:uye2?uye2.u:"",break:1,size:22,font:"Calibri"}), new TextRun({ text: uye2 ? "İmza" : "", break: 1, size: 22, font: "Calibri" })]})]}),
                new TableCell({verticalAlign:VerticalAlign.CENTER,children:[new Paragraph({alignment:AlignmentType.CENTER,children:[new TextRun({text:uye3?uye3.a:"",size:22,font:"Calibri",bold:true}),new TextRun({text:uye3?uye3.u:"",break:1,size:22,font:"Calibri"}), new TextRun({ text: uye3 ? "İmza" : "", break: 1, size: 22, font: "Calibri" })]})]})
            ]
        }));
        imzaicerik.push(new TableRow
        ({
            height: { value: 1000, rule: HeightRule.EXACT },
            children:
            [
                new TableCell({children: [new Paragraph({children: [new TextRun({ text: "" })] })] }),
                new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "" })] })] }),
                new TableCell({children: [new Paragraph({children: [new TextRun({ text: "" })] })] })
            ]
        }));
    }
    const imzatablo=new Table({width:{size:100,type:WidthType.PERCENTAGE},rows:imzaicerik,borders:{top:{style:BorderStyle.NONE},bottom:{style:BorderStyle.NONE},left:{style:BorderStyle.NONE},right:{style:BorderStyle.NONE},insideHorizontal:{style:BorderStyle.NONE},insideVertical:{style:BorderStyle.NONE}}});
    const doc = new Document({
    styles:
    {
        paragraphStyles:
        [
            {id: "Normal", run: { font: "Calibri", size: 22 }, paragraph: {alignment: AlignmentType.JUSTIFIED }},
        ]
    },
    sections:
    [
        {
            properties: { page: { margin: { top: 850, right: 850, bottom: 850, left: 850 } } },
            children: [...kurulustbaslik, imzatablo],
        }
    ]
    });
    const blob = await Packer.toBlob(doc);
    saveAs(blob, "İş Sağlığı ve Güvenliği Kurulu - " + metinuret(3) + ".docx");
}
function kuruluyekontrol()
{
    let firmaid = firmasecimoku();
    let tarih = $('#tarih').val().trim();
    if (!firmaid || !/^[a-z0-9]{10}$/.test(firmaid))
    {
        return false;
    }
    if (!tarih)
    {
        alertify.error("Lütfen bir tarih giriniz");
        return false;
    }
    let tarihRegex = /^(0[1-9]|[12][0-9]|3[01])\.(0[1-9]|1[0-2])\.(19|20)\d{2}$/;
    if (!tarihRegex.test(tarih))
    {
        alertify.error("Tarih formatı geçersiz. Lütfen gg.aa.yyyy formatında giriniz");
        return false;
    }
    store.set("isgkurulfirmaid", firmaid);
    store.set("atamatarih", tarih);
    return true;
}
function kuruluyedevam(kuruljson)
{
    let json = JSON.stringify(kuruljson);
    store.set("kuruluyejson", json);
    store.set("dosyaciktitipi", "7");
    window.location.href = "/dosyacikti";
}
function isgkurulolustur3load()
{
    let isgkurul = jsoncevir(store.get("isgkurultumu"));
    let kararmetni = isgkurul.kurulicerik || [];
    $('#tablo').DataTable
    ({
        data: kararmetni,
        pageLength: -1,
        ordering: false,
        dom: 't',
        columns:
        [
            { width: "3%", data: "i", title: "No"},
            { width: "75%", data: "m", title: "Karar İçeriği"},
            { width: "11%", data: null, title:"Düzenle", render:(d,t,r)=>`<input type="button" class="cssbutontamam" value="Düzenle" onclick="kurulmaddeduzenle(${r.i});"/>`},
            { width: "11%", data: null, title:"Sil", render:(d,t,r)=>`<input type="button" class="cssbutontamam" value="Sil" onclick="kurulmaddesil(${r.i});"/>`}
        ],
        language:{emptyTable: "Kurul Kararı Yok"},
        createdRow:function(r){$(r).find("td").eq(0).css("text-align","center"); $(r).find("td").eq(1).css("text-align","left");},
        headerCallback: function (thead) { $(thead).find('th').css('text-align', 'center');}
    });
}
function kurulmaddeekle()
{
    $('#m1').val('');
    $('#diyalogekle').fadeIn();
}
function kurulmaddeekleonay()
{
    let table = $('#tablo').DataTable();
    let m = $('#m1').val().trim();
    if (m.length < 4)
    {
        alertify.error("Karar maddesi en az 4 karakterden oluşmalıdır.");
        return false;
    }
    let kurulicerik = store.get("isgkurultumu");
    kurulicerik = jsoncevir(kurulicerik);
    let sira = 1;
    if (kurulicerik.kurulicerik && kurulicerik.kurulicerik.length > 0)
    {
        sira = Math.max(...kurulicerik.kurulicerik.map(x=>x.i)) + 1;
    }
    let yeniMadde = { i: sira, m: m };
    if(!kurulicerik.kurulicerik) kurulicerik.kurulicerik = [];
    kurulicerik.kurulicerik.push(yeniMadde);
    store.set("isgkurultumu", kurulicerik);
    table.row.add(yeniMadde).draw(false);
    $('#diyalogekle').fadeOut();
    return true;
}
function kurulmaddeduzenle(i)
{
    let kurulicerik = jsoncevir(store.get("isgkurultumu"));
    let madde = kurulicerik.kurulicerik.find(x=>x.i === i);
    if(!madde) return;
    $('#m2').val(madde.m);
    $('#Button1').data('maddeId', i);
    $('#diyalogduzenle').fadeIn();
}
function kurulmaddedegistir()
{
    let i = $('#Button1').data('maddeId');
    let m = $('#m2').val().trim();
    console.log(m.length);
    if (m.length < 4)
    {
        alertify.error("Karar maddesi en az 4 karakterden oluşmalıdır.");
        return false;
    }
    let kurulicerik = jsoncevir(store.get("isgkurultumu"));
    let madde = kurulicerik.kurulicerik.find(x=>x.i === i);
    if(madde) madde.m = m;
    store.set("isgkurultumu", kurulicerik);
    let table = $('#tablo').DataTable();
    let rowIndex = table.rows().indexes().filter(idx => table.row(idx).data().i === i)[0];
    table.row(rowIndex).data(madde).draw(false);
    $('#diyalogduzenle').fadeOut();
    return true;
}
function kurulmaddesil(i)
{
    store.set("silid", i);
    $('#diyalogsil').fadeIn();
}
function kurulmaddesilonay()
{
    let i = store.get("silid");
    let kurulicerik = jsoncevir(store.get("isgkurultumu"));
    kurulicerik.kurulicerik = kurulicerik.kurulicerik.filter(x => x.i !== i);
    kurulicerik.kurulicerik.forEach((x, idx) => { x.i = idx + 1;});
    store.set("isgkurultumu", kurulicerik);
    let table = $('#tablo').DataTable();
    table.clear();
    table.rows.add(kurulicerik.kurulicerik || []);
    table.draw();
    $('#diyalogsil').fadeOut();
    return true;
}
function isgkurulolustur2load()
{
    let isyerijson = isyersecimfirmaoku();
    let hekimad = isyerijson.hk;
    let uzmanad = store.get("uzmanad") || '';
    let kuruljson = jsoncevir(store.get("isgkuruluye"));
    store.set("isgkuruluye", kuruljson);
    if (uzmanad) { let index = kuruljson.length >= 1 ? 1 : kuruljson.length; kuruljson.splice(index, 0, { a: uzmanad, u: "İş Güvenliği Uzmanı" });}
    if (hekimad) { let index = kuruljson.length >= 2 ? 2 : kuruljson.length; kuruljson.splice(index, 0, { a: hekimad, u: "İşyeri Hekimi" });}
    $('#tablo').DataTable
    ({
        data: kuruljson,
        pageLength: -1,
        ordering: false,
        dom: 't',
        columns:
        [
            { data: "a", title: "İSG Kurul Üye Adı"},
            { data: "u", title: "İSG Kurul Üye Unvanı" },
            { data: null, title:"Düzenle",render:(d,t,r)=>`<input type="button" class="cssbutontamam" value="Düzenle" data-id="${r.i}" onclick="kuruluyeduzenle(this);"/>`},
            { data: null, title:"Sil",render:(d,t,r)=>`<input type="button" class="cssbutontamam" value="Sil" data-id="${r.i}" onclick="kuruluyesil(this);"/>`}
        ],
        createdRow:function(r){$(r).find("td").eq(0).css("text-align","left");$(r).find("td").eq(1).css("text-align","left");},
        headerCallback: function (thead) { $(thead).find('th').css('text-align', 'center');}
    });
}

function kuruluyeduzenle(buton)
{
    let row = $(buton).closest("tr");
    let table = $('#tablo').DataTable();
    let data = table.row(row).data();
    $('#a1').val(data.a);
    $('#u1').val(data.u);
    $('#Button1').data('rowIndex', table.row(row).index());
    $('#diyalogduzenle').fadeIn();
}
function kuruluyedegistir()
{
    let table = $('#tablo').DataTable();
    let rowIndex = $('#Button1').data('rowIndex');
    if (rowIndex === undefined) return;
    let yeniAd = $('#a1').val().trim();
    let yeniUnvan = $('#u1').val().trim();
    table.row(rowIndex).data({ a: yeniAd,
        u: yeniUnvan
    }).draw(false);

    let kuruljson = store.get("isgkuruluye") || [];
    if (kuruljson[rowIndex])
    {
        kuruljson[rowIndex].a = yeniAd;
        kuruljson[rowIndex].u = yeniUnvan;
    }
    store.set("isgkuruluye", kuruljson);
    $('#diyalogduzenle').fadeOut();
}
function kuruluyesil(buton)
{
    let row = $(buton).closest("tr");
    let table = $('#tablo').DataTable();
    let data = table.row(row).data();
    $('#siladsoyad').text(data.a + " adlı kişiyi silmek istediğinizden emin misiniz ?");
    $('#Button2').data('rowIndex', table.row(row).index());
    $('#diyalogsil').fadeIn();
}
function kuruluyesilonay()
{
    let table = $('#tablo').DataTable();
    let rowIndex = $('#Button2').data('rowIndex');
    if (rowIndex === undefined) return;
    table.row(rowIndex).remove().draw(false);
    let kuruljson = store.get("isgkuruluye") || [];
    if (kuruljson[rowIndex]) {
        kuruljson.splice(rowIndex, 1);
    }
    store.set("isgkuruluye", kuruljson);
    $('#diyalogsil').fadeOut();
}
function kuruluyeekle()
{
    $('#a2').val('');
    $('#u2').val('');
    $('#diyalogekle').fadeIn();
}
function kuruluyeekleonay()
{
    let table = $('#tablo').DataTable();
    let yeniAd = $('#a2').val().trim();
    let yeniUnvan = $('#u2').val().trim();
    if (!yeniAd || !yeniUnvan)
    {
        alertify.error("Ad Soyad ve Unvan alanları boş olamaz.");
        return;
    }
    let newRow = { a: yeniAd, u: yeniUnvan };
    table.row.add(newRow).draw(false);
    let kuruljson = store.get("isgkuruluye") || [];
    kuruljson.push(newRow);
    store.set("isgkuruluye", kuruljson);
    $('#diyalogekle').fadeOut();
}

function kurultoplantijson()
{
    let kuruluye = store.get("isgkuruluye");
    kuruluye = jsoncevir(kuruluye);
    let kurulveri = store.get("isgkurulverijson");
    kurulveri = jsoncevir(kurulveri);
    let kurulicerik = [{ "m": "Lütfen alınan toplantı kararını buraya yazınız", "i": 1 }];
    let sonuc = { kurulveri: kurulveri ,  kuruluye: kuruluye ,  kurulicerik: kurulicerik };
    store.set("isgkurultumu", JSON.stringify(sonuc));
    return true;
}
function kurulolusturdevam1()
{
    let tarih = $('#tarih').val().trim();
    if (tarihkontrol(tarih) === false)
    {
        alertify.error("Lütfen geçerli bir tarih giriniz");
        return;
    }    
    let firmaid = firmasecimoku();
    if (!firmaid){ return;}
    let konu = $("#konu").val();
    if (isNaN(parseInt(konu)))
    {
        alertify.error("Toplantı konusunu seçiniz");
        return;
    }
    let saat = $("#saat").val();
    if (!/^\d{2}:\d{2}$/.test(saat))
    {
        alertify.error("Toplantı saatini yazınız");
        return;
    }
    let toplantijson = [{ tarih: tarih, konu: parseInt(konu), saat: saat }];
    store.set("isgkurultarih", tarih);
    store.set("isgkurulkonu", konu);
    store.set("isgkurulverijson", toplantijson);
    window.location.href = "/kurulolustur2?id=" + encodeURIComponent(firmaid);
}
function kurulduzenleload4()
{
    let isgkurul = jsoncevir(store.get("isgkurultumu"));
    let kararmetni = isgkurul.kurulicerik || [];
    $('#tablo').DataTable
    ({
        data: kararmetni,
        pageLength: -1,
        ordering: false,
        dom: 't',
        columns:
        [
            { width: "3%", data: "i", title: "No"},
            { width: "75%", data: "m", title: "Karar İçeriği"},
            { width: "11%", data: null, title:"Düzenle", render:(d,t,r)=>`<input type="button" class="cssbutontamam" value="Düzenle" onclick="kurulduzenlemaddeduzenle(${r.i});"/>`},
            { width: "11%", data: null, title:"Sil", render:(d,t,r)=>`<input type="button" class="cssbutontamam" value="Sil" onclick="kurulduzenelemaddesil(${r.i});"/>`}
        ],
        language:{emptyTable: "Kurul Kararı Yok"},
        createdRow:function(r){$(r).find("td").eq(0).css("text-align","center"); $(r).find("td").eq(1).css("text-align","left");},
        headerCallback: function (thead) { $(thead).find('th').css('text-align', 'center');}
    });
}
function kurulduzenlemaddeekle()
{
    $('#m1').val('');
    $('#diyalogekle').fadeIn();
}
function kurulduzenlemaddeekleonay()
{
    let table = $('#tablo').DataTable();
    let m = $('#m1').val().trim();
    if (m.length < 4)
    {
        alertify.error("Karar maddesi en az 4 karakterden oluşmalıdır.");
        return false;
    }
    let kurulicerik = store.get("isgkurultumu");
    kurulicerik = jsoncevir(kurulicerik);
    let sira = 1;
    if (kurulicerik.kurulicerik && kurulicerik.kurulicerik.length > 0)
    {
        sira = Math.max(...kurulicerik.kurulicerik.map(x=>x.i)) + 1;
    }
    let yeniMadde = { i: sira, m: m };
    if(!kurulicerik.kurulicerik) kurulicerik.kurulicerik = [];
    kurulicerik.kurulicerik.push(yeniMadde);
    store.set("isgkurultumu", kurulicerik);
    table.row.add(yeniMadde).draw(false);
    $('#diyalogekle').fadeOut();
    return true;
}
function kurulduzenlemaddeduzenle(i)
{
    let kurulicerik = jsoncevir(store.get("isgkurultumu"));
    let madde = kurulicerik.kurulicerik.find(x=>x.i === i);
    if(!madde) return;
    $('#m2').val(madde.m);
    $('#Button1').data('maddeId', i);
    $('#diyalogduzenle').fadeIn();
}
function kurulduzenlemaddedegistir()
{
    let i = $('#Button1').data('maddeId');
    let m = $('#m2').val().trim();
    console.log(m.length);
    if (m.length < 4)
    {
        alertify.error("Karar maddesi en az 4 karakterden oluşmalıdır.");
        return false;
    }
    let kurulicerik = jsoncevir(store.get("isgkurultumu"));
    let madde = kurulicerik.kurulicerik.find(x=>x.i === i);
    if(madde) madde.m = m;
    store.set("isgkurultumu", kurulicerik);
    let table = $('#tablo').DataTable();
    let rowIndex = table.rows().indexes().filter(idx => table.row(idx).data().i === i)[0];
    table.row(rowIndex).data(madde).draw(false);
    $('#diyalogduzenle').fadeOut();
    return true;
}
function kurulduzenelemaddesil(i)
{
    store.set("silid", i);
    $('#diyalogsil').fadeIn();
}
function kurulduzenlemaddesilonay()
{
    let i = store.get("silid");
    let kurulicerik = jsoncevir(store.get("isgkurultumu"));
    kurulicerik.kurulicerik = kurulicerik.kurulicerik.filter(x => x.i !== i);
    kurulicerik.kurulicerik.forEach((x, idx) => { x.i = idx + 1;});
    store.set("isgkurultumu", kurulicerik);
    let table = $('#tablo').DataTable();
    table.clear();
    table.rows.add(kurulicerik.kurulicerik || []);
    table.draw();
    $('#diyalogsil').fadeOut();
    return true;
}

function isgkurulduzenle3load()
{
    let json = store.get("isgkurulsecim");
    json = jsoncevir(json);
    let kurulveri = json.kurulveri || [];
    let tarih = kurulveri[0].tarih;
    let konu = kurulveri[0].konu;
    let saat = kurulveri[0].saat;
    $('#tarih').val(tarih);
    $('#konu').val(konu);
    $('#saat').val(saat);
    let kuruluye = json.kuruluye || [];
    store.set("isgkuruluye", kuruluye);
    $('#tablo').DataTable
    ({
        data: kuruluye,
        pageLength: -1,
        ordering: false,
        dom: 't',
        columns:
        [
            { data: "a", title: "İSG Kurul Üye Adı"},
            { data: "u", title: "İSG Kurul Üye Unvanı" },
            { data: null, title:"Düzenle",render:(d,t,r)=>`<input type="button" class="cssbutontamam" value="Düzenle" data-id="${r.i}" onclick="kurulduzenleuyeduzenle(this);"/>`},
            { data: null, title:"Sil",render:(d,t,r)=>`<input type="button" class="cssbutontamam" value="Sil" data-id="${r.i}" onclick="kuruluduzenleyesil(this);"/>`}
        ],
        createdRow:function(r){$(r).find("td").eq(0).css("text-align","left");$(r).find("td").eq(1).css("text-align","left");},
        headerCallback: function (thead) { $(thead).find('th').css('text-align', 'center');}
    });
}
function kurulduzenleuyeduzenle(buton)
{
    let row = $(buton).closest("tr");
    let table = $('#tablo').DataTable();
    let data = table.row(row).data();
    $('#a1').val(data.a);
    $('#u1').val(data.u);
    $('#Button1').data('rowIndex', table.row(row).index());
    $('#diyalogduzenle').fadeIn();
}
function kurulduzeneleuyedegistir()
{
    let table = $('#tablo').DataTable();
    let rowIndex = $('#Button1').data('rowIndex');
    if (rowIndex === undefined) return;
    let yeniAd = $('#a1').val().trim();
    let yeniUnvan = $('#u1').val().trim();
    table.row(rowIndex).data({ a: yeniAd,
        u: yeniUnvan
    }).draw(false);

    let kuruljson = store.get("isgkuruluye") || [];
    if (kuruljson[rowIndex])
    {
        kuruljson[rowIndex].a = yeniAd;
        kuruljson[rowIndex].u = yeniUnvan;
    }
    store.set("isgkuruluye", kuruljson);
    $('#diyalogduzenle').fadeOut();
}
function kuruluduzenleyesil(buton)
{
    let row = $(buton).closest("tr");
    let table = $('#tablo').DataTable();
    let data = table.row(row).data();
    $('#siladsoyad').text(data.a + " adlı kişiyi silmek istediğinizden emin misiniz ?");
    $('#Button2').data('rowIndex', table.row(row).index());
    $('#diyalogsil').fadeIn();
}
function kurulduzenleuyesilonay()
{
    let table = $('#tablo').DataTable();
    let rowIndex = $('#Button2').data('rowIndex');
    if (rowIndex === undefined) return;
    table.row(rowIndex).remove().draw(false);
    let kuruljson = store.get("isgkuruluye") || [];
    if (kuruljson[rowIndex]) {
        kuruljson.splice(rowIndex, 1);
    }
    store.set("isgkuruluye", kuruljson);
    $('#diyalogsil').fadeOut();
}
function kurulduzenleuyeekle()
{
    $('#a2').val('');
    $('#u2').val('');
    $('#diyalogekle').fadeIn();
}
function kurulduzenleuyeekleonay()
{
    let table = $('#tablo').DataTable();
    let yeniAd = $('#a2').val().trim();
    let yeniUnvan = $('#u2').val().trim();
    if (!yeniAd || !yeniUnvan)
    {
        alertify.error("Ad Soyad ve Unvan alanları boş olamaz.");
        return;
    }
    let newRow = { a: yeniAd, u: yeniUnvan };
    table.row.add(newRow).draw(false);
    let kuruljson = store.get("isgkuruluye") || [];
    kuruljson.push(newRow);
    store.set("isgkuruluye", kuruljson);
    $('#diyalogekle').fadeOut();
}
function kurulduzenletoplantijson()
{
    let json = store.get("isgkurulsecim");
    json = jsoncevir(json);
    let kurulveri = json.kurulveri || [];
    if (kurulveri.length === 0) kurulveri.push({});
    let tarih = $('#tarih').val().trim();
    if (tarihkontrol(tarih) === true)
    {
        kurulveri[0].tarih = tarih;
    }
    let konu = $("#konu").val().trim();
    if (!isNaN(parseInt(konu)) && parseInt(konu) > 0)
    {
        kurulveri[0].konu = parseInt(konu);
    }
    let saat = $("#saat").val();
    if (/^\d{2}:\d{2}$/.test(saat))
    {
        kurulveri[0].saat = saat;
    }
    let kuruluye = store.get("isgkuruluye");
    kuruluye = jsoncevir(kuruluye);
    let kurulicerik = json.kurulicerik || [];
    let sonuc = { kurulveri: kurulveri, kuruluye: kuruluye, kurulicerik: kurulicerik };
    store.set("isgkurultumu", JSON.stringify(sonuc));
    return true;
}

function kurulduzenledevam1()
{ 
    let firmaid = firmasecimoku();
    if (!firmaid){ return;}
    window.location.href = "/kurulduzenle2?id=" + encodeURIComponent(firmaid);
}

function isgkurulcikti2load()
{
    let data = store.get("isgkurulload");
    const aylar = {0:"Olağanüstü İsg Kurul Toplantısı",1:"Ocak Ayı Olağan İsg Kurulu Toplantısı",2:"Şubat Ayı Olağan İsg Kurulu Toplantısı",3:"Mart Ayı Olağan İsg Kurulu Toplantısı",4:"Nisan Ayı Olağan İsg Kurulu Toplantısı",5:"Mayıs Ayı Olağan İsg Kurulu Toplantısı",6:"Haziran Ayı Olağan İsg Kurulu Toplantısı",7:"Temmuz Ayı Olağan İsg Kurulu Toplantısı",8:"Ağustos Ayı Olağan İsg Kurulu Toplantısı",9:"Eylül Ayı Olağan İsg Kurulu Toplantısı",10:"Ekim Ayı Olağan İsg Kurulu Toplantısı",11:"Kasım Ayı Olağan İsg Kurulu Toplantısı",12:"Aralık Ayı Olağan İsg Kurulu Toplantısı"};
    const sonuc = data.map(item => { const tarih = item.kurulveri[0].tarih; const konu = item.kurulveri[0].konu; return{ i: item.i, tarih, konu, konuyazi: aylar[konu] || "Bilinmeyen Konu" }; });
    $('#tablo').DataTable
    ({
        data: sonuc,
        order: [[0, "desc"]],
        dom: 't',
        pageLength: -1,
        columns:
        [
            { title: "Tarih", data: "tarih", type: "date-eu" },
            { title: "Toplantı Konusu", data: "konuyazi", orderable: false },
            { data: 'i', title: 'Çıktı Al', orderable: false, render: e => `<input type="button" name="cikti" class="cssbutontamam" value="Çıktı" data-id="${e}"/>` }
        ],
        createdRow: row => $(row).find('td').eq(1).css('text-align', 'left'),
        headerCallback: thead => $(thead).find('th').css('text-align', 'center')
    });
    $(document).on("click", "input[name='cikti']", function ()
    {
        const id = parseInt($(this).data("id"));
        const data = store.get("isgkurulload");
        const satir = data.find(item => item.i === id);
        store.set("isgkurulsecim", satir);
        store.set("dosyaciktitipi", "6");
        window.location.href = "/dosyacikti";
    });
}
function kurulciktidevam1()
{ 
    let firmaid = firmasecimoku();
    if (!firmaid){ return;}
    window.location.href = "/kurulcikti2?id=" + encodeURIComponent(firmaid);
}

function kurulApiIstek(url, secenekler)
{
    return fetch(url, {
        credentials: "same-origin",
        headers: { "Content-Type": "application/json", ...(secenekler?.headers || {}) },
        ...secenekler
    }).then(async (response) =>
    {
        const veri = await response.json().catch(() => null);
        if (!response.ok)
        {
            const hata = new Error((veri && veri.error) || "İşlem başarısız");
            hata.data = veri;
            throw hata;
        }
        return veri;
    });
}

function kurulSeciliKararKimligiOku()
{
    const satir = jsoncevir(store.get("isgkurulsecim")) || {};
    const kararid = parseInt(String(store.get("isgkurulkararid") || satir.i || ""), 10);
    const firmaid = String(store.get("isgkurulfirmaid") || "").trim();
    return { kararid, firmaid };
}


function kurulSecimStoreGuncelle(veri)
{
    const kararid = parseInt(String(veri?.i || ""), 10);
    if (Number.isInteger(kararid) && kararid > 0)
    {
        store.set("isgkurulkararid", kararid);
    }
    store.set("isgkurulsecim", JSON.stringify(veri));
    store.set("isgkurultumu", JSON.stringify(veri));
}

async function kurulKararStoredenGuncelle()
{
    const { kararid, firmaid } = kurulSeciliKararKimligiOku();
    const veri = jsoncevir(store.get("isgkurultumu"));
    if (!/^[a-z0-9]{10}$/.test(firmaid) || !Number.isInteger(kararid) || kararid <= 0)
    {
        alertify.error("Kurul bilgisi bulunamadı");
        return false;
    }
    await kurulKararGuncelle(firmaid, kararid, veri);
    kurulSecimStoreGuncelle({ ...veri, i: kararid });
    return true;
}

async function kurulUyeListesiniHazirla(firmaid)
{
    let kuruljson = await kuruluyeJsonGetir(firmaid);
    const isyerijson = isyersecimfirmaoku();
    const hekimad = isyerijson?.hk || "";
    const uzmanad = String(store.get("uzmanad") || "").trim();
    kuruljson = Array.isArray(kuruljson) ? kuruljson.slice() : [];
    if (uzmanad)
    {
        const index = kuruljson.length >= 1 ? 1 : kuruljson.length;
        kuruljson.splice(index, 0, { a: uzmanad, u: "İş Güvenliği Uzmanı" });
    }
    if (hekimad)
    {
        const index = kuruljson.length >= 2 ? 2 : kuruljson.length;
        kuruljson.splice(index, 0, { a: hekimad, u: "İşyeri Hekimi" });
    }
    return kuruljson;
}

function kurulolusturdevam1()
{
    const tarih = $('#tarih').val().trim();
    if (tarihkontrol(tarih) === false)
    {
        alertify.error("Lütfen geçerli bir tarih giriniz");
        return false;
    }
    const firmaid = firmasecimoku();
    if (!firmaid)
    {
        return false;
    }
    const konu = $("#konu").val();
    if (isNaN(parseInt(konu, 10)))
    {
        alertify.error("Toplantı konusunu seçiniz");
        return false;
    }
    const saat = $("#saat").val();
    if (!/^\d{2}:\d{2}$/.test(saat))
    {
        alertify.error("Toplantı saatini yazınız");
        return false;
    }
    const toplantijson = [{ tarih, konu: parseInt(konu, 10), saat }];
    store.set("isgkurultarih", tarih);
    store.set("isgkurulkonu", konu);
    store.set("isgkurulverijson", toplantijson);
    store.set("isgkurulfirmaid", firmaid);
    window.location.href = `/kurulolustur2?id=${encodeURIComponent(firmaid)}`;
    return true;
}

function isgkurulolustur2load(data)
{
    const firmaid = String(store.get("isgkurulfirmaid") || "").trim();
    if (!/^[a-z0-9]{10}$/.test(firmaid))
    {
        window.location.href = "/kurulolustur1";
        return;
    }
    let kuruljson = Array.isArray(data) ? data.slice() : jsoncevir(store.get("isgkuruluye"));
    const isyerijson = isyersecimfirmaoku();
    const hekimad = isyerijson?.hk || "";
    const uzmanad = String(store.get("uzmanad") || "").trim();
    kuruljson = Array.isArray(kuruljson) ? kuruljson.slice() : [];
    if (uzmanad)
    {
        const index = kuruljson.length >= 1 ? 1 : kuruljson.length;
        kuruljson.splice(index, 0, { a: uzmanad, u: "İş Güvenliği Uzmanı" });
    }
    if (hekimad)
    {
        const index = kuruljson.length >= 2 ? 2 : kuruljson.length;
        kuruljson.splice(index, 0, { a: hekimad, u: "İşyeri Hekimi" });
    }
    store.set("isgkuruluye", kuruljson);
    $('#tablo').DataTable({
        data: kuruljson,
        pageLength: -1,
        ordering: false,
        dom: 't',
        columns: [
            { data: "a", title: "İSG Kurul Üye Adı" },
            { data: "u", title: "İSG Kurul Üye Unvanı" },
            { data: null, title: "Düzenle", render: () => `<input type="button" class="cssbutontamam" value="Düzenle" onclick="kuruluyeduzenle(this);"/>` },
            { data: null, title: "Sil", render: () => `<input type="button" class="cssbutontamam" value="Sil" onclick="kuruluyesil(this);"/>` }
        ],
        createdRow: function (r) { $(r).find("td").eq(0).css("text-align", "left"); $(r).find("td").eq(1).css("text-align", "left"); },
        headerCallback: function (thead) { $(thead).find('th').css('text-align', 'center'); }
    });
}

function kurultoplantijson()
{
    const kuruluye = jsoncevir(store.get("isgkuruluye"));
    const kurulveri = jsoncevir(store.get("isgkurulverijson"));
    const kurulicerik = [{ m: "Lütfen alınan toplantı kararını buraya yazınız", i: 1 }];
    const sonuc = { kurulveri, kuruluye, kurulicerik };
    kurulSecimStoreGuncelle(sonuc);
    return sonuc;
}

function isgkurulolustur3load()
{
    const firmaid = String(store.get("isgkurulfirmaid") || "").trim();
    const kararid = parseInt(String(store.get("isgkurulkararid") || ""), 10);
    if (!/^[a-z0-9]{10}$/.test(firmaid) || !Number.isInteger(kararid) || kararid <= 0)
    {
        window.location.href = "/kurulolustur1";
        return;
    }
    let isgkurul = jsoncevir(store.get("isgkurultumu"));
    if (!isgkurul || !Array.isArray(isgkurul.kurulicerik))
    {
        alertify.error("Kurul kararı yüklenemedi");
        window.location.href = "/kurulolustur1";
        return;
    }
    kurulSecimStoreGuncelle({ ...isgkurul, i: kararid });
    const kararmetni = isgkurul.kurulicerik || [];
    $('#tablo').DataTable({
        data: kararmetni,
        pageLength: -1,
        ordering: false,
        dom: 't',
        columns: [
            { width: "3%", data: "i", title: "No" },
            { width: "75%", data: "m", title: "Karar İçeriği" },
            { width: "11%", data: null, title: "Düzenle", render: (d, t, r) => `<input type="button" class="cssbutontamam" value="Düzenle" onclick="kurulmaddeduzenle(${r.i});"/>` },
            { width: "11%", data: null, title: "Sil", render: (d, t, r) => `<input type="button" class="cssbutontamam" value="Sil" onclick="kurulmaddesil(${r.i});"/>` }
        ],
        language: { emptyTable: "Kurul Kararı Yok" },
        createdRow: function (r) { $(r).find("td").eq(0).css("text-align", "center"); $(r).find("td").eq(1).css("text-align", "left"); },
        headerCallback: function (thead) { $(thead).find('th').css('text-align', 'center'); }
    });
}

async function kurulmaddeekleonay()
{
    const table = $('#tablo').DataTable();
    const m = $('#m1').val().trim();
    if (m.length < 4)
    {
        alertify.error("Karar maddesi en az 4 karakterden oluşmalıdır.");
        return false;
    }
    const kurulicerik = jsoncevir(store.get("isgkurultumu"));
    let sira = 1;
    if (kurulicerik.kurulicerik && kurulicerik.kurulicerik.length > 0)
    {
        sira = Math.max(...kurulicerik.kurulicerik.map((x) => x.i)) + 1;
    }
    const yeniMadde = { i: sira, m };
    if (!kurulicerik.kurulicerik) kurulicerik.kurulicerik = [];
    kurulicerik.kurulicerik.push(yeniMadde);
    store.set("isgkurultumu", kurulicerik);
    try
    {
        await guncelle();
        table.row.add(yeniMadde).draw(false);
        $('#diyalogekle').fadeOut();
        return true;
    }
    catch (err)
    {
        alertify.error(err.message || "Karar maddesi kaydedilemedi");
        return false;
    }
}

async function kurulmaddedegistir()
{
    const i = $('#Button1').data('maddeId');
    const m = $('#m2').val().trim();
    if (m.length < 4)
    {
        alertify.error("Karar maddesi en az 4 karakterden oluşmalıdır.");
        return false;
    }
    const kurulicerik = jsoncevir(store.get("isgkurultumu"));
    const madde = kurulicerik.kurulicerik.find((x) => x.i === i);
    if (madde) madde.m = m;
    store.set("isgkurultumu", kurulicerik);
    try
    {
        await guncelle();
        const table = $('#tablo').DataTable();
        const rowIndex = table.rows().indexes().filter((idx) => table.row(idx).data().i === i)[0];
        table.row(rowIndex).data(madde).draw(false);
        $('#diyalogduzenle').fadeOut();
        return true;
    }
    catch (err)
    {
        alertify.error(err.message || "Karar maddesi güncellenemedi");
        return false;
    }
}

async function kurulmaddesilonay()
{
    const i = store.get("silid");
    const kurulicerik = jsoncevir(store.get("isgkurultumu"));
    kurulicerik.kurulicerik = kurulicerik.kurulicerik.filter((x) => x.i !== i);
    kurulicerik.kurulicerik.forEach((x, idx) => { x.i = idx + 1; });
    store.set("isgkurultumu", kurulicerik);
    try
    {
        await guncelle();
        const table = $('#tablo').DataTable();
        table.clear();
        table.rows.add(kurulicerik.kurulicerik || []);
        table.draw();
        $('#diyalogsil').fadeOut();
        return true;
    }
    catch (err)
    {
        alertify.error(err.message || "Karar maddesi silinemedi");
        return false;
    }
}

function kuruluyekontrol()
{
    const firmaid = firmasecimoku();
    const tarih = $('#tarih').val().trim();
    if (!firmaid || !/^[a-z0-9]{10}$/.test(firmaid))
    {
        return false;
    }
    if (!tarih)
    {
        alertify.error("Lütfen bir tarih giriniz");
        return false;
    }
    const tarihRegex = /^(0[1-9]|[12][0-9]|3[01])\.(0[1-9]|1[0-2])\.(19|20)\d{2}$/;
    if (!tarihRegex.test(tarih))
    {
        alertify.error("Tarih formatı geçersiz. Lütfen gg.aa.yyyy formatında giriniz");
        return false;
    }
    store.set("isgkurulfirmaid", firmaid);
    store.set("atamatarih", tarih);
    return true;
}

function kurulduzenledevam1()
{
    const firmaid = firmasecimoku();
    if (!firmaid)
    {
        return false;
    }
    store.set("isgkurulfirmaid", firmaid);
    window.location.href = `/kurulduzenle2?id=${encodeURIComponent(firmaid)}`;
    return true;
}

async function isgkurulduzenle2load()
{
    const firmaid = String(store.get("isgkurulfirmaid") || "").trim();
    if (!/^[a-z0-9]{10}$/.test(firmaid))
    {
        window.location.href = "/kurulduzenle1";
        return;
    }
    let data = jsoncevir(store.get("isgkurulload"));
    const aylar = {0:"Olağanüstü İsg Kurul Toplantısı",1:"Ocak Ayı Olağan İsg Kurulu Toplantısı",2:"Şubat Ayı Olağan İsg Kurulu Toplantısı",3:"Mart Ayı Olağan İsg Kurulu Toplantısı",4:"Nisan Ayı Olağan İsg Kurulu Toplantısı",5:"Mayıs Ayı Olağan İsg Kurulu Toplantısı",6:"Haziran Ayı Olağan İsg Kurulu Toplantısı",7:"Temmuz Ayı Olağan İsg Kurulu Toplantısı",8:"Ağustos Ayı Olağan İsg Kurulu Toplantısı",9:"Eylül Ayı Olağan İsg Kurulu Toplantısı",10:"Ekim Ayı Olağan İsg Kurulu Toplantısı",11:"Kasım Ayı Olağan İsg Kurulu Toplantısı",12:"Aralık Ayı Olağan İsg Kurulu Toplantısı"};
    const sonuc = data.map((item) =>
    {
        const tarih = item.kurulveri?.[0]?.tarih || "";
        const konu = item.kurulveri?.[0]?.konu;
        return { i: item.i, tarih, konu, konuyazi: aylar[konu] || "Bilinmeyen Konu" };
    });
    $('#tablo').DataTable
    ({
        data: sonuc,
        order: [[0, "desc"]],
        dom: 't',
        pageLength: -1,
        columns: [
            { title: "Tarih", data: "tarih", type: "date-eu" },
            { title: "Toplantı Konusu", data: "konuyazi", orderable: false },
            { data: 'i', title: 'Düzenle', orderable: false, render: (e) => `<input type="button" name="duzenle" class="cssbutontamam" value="Düzenle" data-id="${e}"/>` },
            { data: 'i', title: 'Sil', orderable: false, render: (e) => `<input type="button" name="sil" class="cssbutontamam" value="Sil" data-id="${e}"/>` }
        ],
        createdRow: (row) => $(row).find('td').eq(1).css('text-align', 'left'),
        headerCallback: (thead) => $(thead).find('th').css('text-align', 'center')
    });
    $(document).off("click.kurulduzenle").on("click.kurulduzenle", "input[name='duzenle']", function ()
    {
        const id = parseInt($(this).data("id"), 10);
        const dataRows = jsoncevir(store.get("isgkurulload"));
        const satir = dataRows.find((item) => item.i === id);
        if (!satir) return;
        store.set("isgkurulsecim", JSON.stringify(satir));
        store.set("isgkurulkararid", id);
        window.location.href = `/kurulduzenle3?firmaid=${encodeURIComponent(firmaid)}&kararid=${encodeURIComponent(id)}`;
    });
    $(document).off("click.kurulsil").on("click.kurulsil", "input[name='sil']", function ()
    {
        const id = parseInt($(this).data("id"), 10);
        store.set("kararsilid", id);
        $('#diyalogkurulsil').fadeIn();
    });
}

function kurulciktidevam1()
{
    const firmaid = firmasecimoku();
    if (!firmaid)
    {
        return false;
    }
    store.set("isgkurulfirmaid", firmaid);
    window.location.href = `/kurulcikti2?id=${encodeURIComponent(firmaid)}`;
    return true;
}

function isgkurulcikti2load()
{
    const firmaid = String(store.get("isgkurulfirmaid") || "").trim();
    if (!/^[a-z0-9]{10}$/.test(firmaid))
    {
        window.location.href = "/kurulcikti1";
        return;
    }
    let data = jsoncevir(store.get("isgkurulload"));
    const aylar = {0:"Olağanüstü İsg Kurul Toplantısı",1:"Ocak Ayı Olağan İsg Kurulu Toplantısı",2:"Şubat Ayı Olağan İsg Kurulu Toplantısı",3:"Mart Ayı Olağan İsg Kurulu Toplantısı",4:"Nisan Ayı Olağan İsg Kurulu Toplantısı",5:"Mayıs Ayı Olağan İsg Kurulu Toplantısı",6:"Haziran Ayı Olağan İsg Kurulu Toplantısı",7:"Temmuz Ayı Olağan İsg Kurulu Toplantısı",8:"Ağustos Ayı Olağan İsg Kurulu Toplantısı",9:"Eylül Ayı Olağan İsg Kurulu Toplantısı",10:"Ekim Ayı Olağan İsg Kurulu Toplantısı",11:"Kasım Ayı Olağan İsg Kurulu Toplantısı",12:"Aralık Ayı Olağan İsg Kurulu Toplantısı"};
    const sonuc = data.map((item) => ({ i: item.i, tarih: item.kurulveri?.[0]?.tarih || "", konu: item.kurulveri?.[0]?.konu, konuyazi: aylar[item.kurulveri?.[0]?.konu] || "Bilinmeyen Konu" }));
    $('#tablo').DataTable({
        data: sonuc,
        order: [[0, "desc"]],
        dom: 't',
        pageLength: -1,
        columns: [
            { title: "Tarih", data: "tarih", type: "date-eu" },
            { title: "Toplantı Konusu", data: "konuyazi", orderable: false },
            { data: 'i', title: 'Çıktı Al', orderable: false, render: (e) => `<input type="button" name="cikti" class="cssbutontamam" value="Çıktı" data-id="${e}"/>` }
        ],
        createdRow: (row) => $(row).find('td').eq(1).css('text-align', 'left'),
        headerCallback: (thead) => $(thead).find('th').css('text-align', 'center')
    });
    $(document).off("click.kurulcikti").on("click.kurulcikti", "input[name='cikti']", function ()
    {
        const id = parseInt($(this).data("id"), 10);
        const dataRows = jsoncevir(store.get("isgkurulload"));
        const satir = dataRows.find((item) => item.i === id);
        store.set("isgkurulsecim", JSON.stringify(satir));
        store.set("isgkurulkararid", id);
        store.set("dosyaciktitipi", "6");
        window.location.href = "/dosyacikti";
    });
}

async function isgkurulduzenle3load(json)
{
    const kurulveri = json.kurulveri || [];
    const tarih = kurulveri[0]?.tarih || "";
    const konu = kurulveri[0]?.konu || "";
    const saat = kurulveri[0]?.saat || "";
    $('#tarih').val(tarih);
    $('#konu').val(konu);
    $('#saat').val(saat);
    const kuruluye = json.kuruluye || [];
    store.set("isgkuruluye", kuruluye);
    $('#tablo').DataTable
    ({
        data: kuruluye,
        pageLength: -1,
        ordering: false,
        dom: 't',
        columns:
        [
            { data: "a", title: "İSG Kurul Üye Adı" },
            { data: "u", title: "İSG Kurul Üye Unvanı" },
            { data: null, title: "Düzenle", render: () => `<input type="button" class="cssbutontamam" value="Düzenle" onclick="kurulduzenleuyeduzenle(this);"/>` },
            { data: null, title: "Sil", render: () => `<input type="button" class="cssbutontamam" value="Sil" onclick="kuruluduzenleyesil(this);"/>` }
        ],
        createdRow: function (r) { $(r).find("td").eq(0).css("text-align", "left"); $(r).find("td").eq(1).css("text-align", "left"); },
        headerCallback: function (thead) { $(thead).find('th').css('text-align', 'center'); }
    });
}

async function kurulduzenletoplantijson()
{
    const json = jsoncevir(store.get("isgkurulsecim"));
    const kurulveri = json.kurulveri || [{}];
    const tarih = $('#tarih').val().trim();
    if (tarihkontrol(tarih) === true) kurulveri[0].tarih = tarih;
    const konu = $("#konu").val().trim();
    if (!isNaN(parseInt(konu, 10)) && parseInt(konu, 10) >= 0) kurulveri[0].konu = parseInt(konu, 10);
    const saat = $("#saat").val();
    if (/^\d{2}:\d{2}$/.test(saat)) kurulveri[0].saat = saat;
    const kuruluye = jsoncevir(store.get("isgkuruluye"));
    const kurulicerik = json.kurulicerik || [];
    const sonuc = { kurulveri, kuruluye, kurulicerik };
    kurulSecimStoreGuncelle({ ...sonuc, i: json.i });
    return true;
}

async function kurulduzenleload4()
{
    const firmaid = String(store.get("isgkurulfirmaid") || "").trim();
    const kararid = parseInt(String(store.get("isgkurulkararid") || ""), 10);
    if (!/^[a-z0-9]{10}$/.test(firmaid) || !Number.isInteger(kararid) || kararid <= 0)
    {
        window.location.href = "/kurulduzenle1";
        return;
    }
    let isgkurul = jsoncevir(store.get("isgkurultumu"));
    kurulSecimStoreGuncelle({ ...isgkurul, i: kararid });
    const kararmetni = isgkurul.kurulicerik || [];
    $('#tablo').DataTable({
        data: kararmetni,
        pageLength: -1,
        ordering: false,
        dom: 't',
        columns: [
            { width: "3%", data: "i", title: "No" },
            { width: "75%", data: "m", title: "Karar İçeriği" },
            { width: "11%", data: null, title: "Düzenle", render: (d, t, r) => `<input type="button" class="cssbutontamam" value="Düzenle" onclick="kurulduzenlemaddeduzenle(${r.i});"/>` },
            { width: "11%", data: null, title: "Sil", render: (d, t, r) => `<input type="button" class="cssbutontamam" value="Sil" onclick="kurulduzenelemaddesil(${r.i});"/>` }
        ],
        language: { emptyTable: "Kurul Kararı Yok" },
        createdRow: function (r) { $(r).find("td").eq(0).css("text-align", "center"); $(r).find("td").eq(1).css("text-align", "left"); },
        headerCallback: function (thead) { $(thead).find('th').css('text-align', 'center'); }
    });
}

async function kurulduzenlemaddeekleonay()
{
    const table = $('#tablo').DataTable();
    const m = $('#m1').val().trim();
    if (m.length < 4)
    {
        alertify.error("Karar maddesi en az 4 karakterden oluşmalıdır.");
        return false;
    }
    const kurulicerik = jsoncevir(store.get("isgkurultumu"));
    let sira = 1;
    if (kurulicerik.kurulicerik && kurulicerik.kurulicerik.length > 0)
    {
        sira = Math.max(...kurulicerik.kurulicerik.map((x) => x.i)) + 1;
    }
    const yeniMadde = { i: sira, m };
    if (!kurulicerik.kurulicerik) kurulicerik.kurulicerik = [];
    kurulicerik.kurulicerik.push(yeniMadde);
    store.set("isgkurultumu", kurulicerik);
    try
    {
        await guncelle();
        table.row.add(yeniMadde).draw(false);
        $('#diyalogekle').fadeOut();
        return true;
    }
    catch (err)
    {
        alertify.error(err.message || "Karar maddesi eklenemedi");
        return false;
    }
}

async function kurulduzenlemaddedegistir()
{
    const i = $('#Button1').data('maddeId');
    const m = $('#m2').val().trim();
    if (m.length < 4)
    {
        alertify.error("Karar maddesi en az 4 karakterden oluşmalıdır.");
        return false;
    }
    const kurulicerik = jsoncevir(store.get("isgkurultumu"));
    const madde = kurulicerik.kurulicerik.find((x) => x.i === i);
    if (madde) madde.m = m;
    store.set("isgkurultumu", kurulicerik);
    try
    {
        await guncelle();
        const table = $('#tablo').DataTable();
        const rowIndex = table.rows().indexes().filter((idx) => table.row(idx).data().i === i)[0];
        table.row(rowIndex).data(madde).draw(false);
        $('#diyalogduzenle').fadeOut();
        return true;
    }
    catch (err)
    {
        alertify.error(err.message || "Karar maddesi güncellenemedi");
        return false;
    }
}

async function kurulduzenlemaddesilonay()
{
    const i = store.get("silid");
    const kurulicerik = jsoncevir(store.get("isgkurultumu"));
    kurulicerik.kurulicerik = kurulicerik.kurulicerik.filter((x) => x.i !== i);
    kurulicerik.kurulicerik.forEach((x, idx) => { x.i = idx + 1; });
    store.set("isgkurultumu", kurulicerik);
    try
    {
        await guncelle();
        const table = $('#tablo').DataTable();
        table.clear();
        table.rows.add(kurulicerik.kurulicerik || []).draw();
        $('#diyalogsil').fadeOut();
        return true;
    }
    catch (err)
    {
        alertify.error(err.message || "Karar maddesi silinemedi");
        return false;
    }
}
