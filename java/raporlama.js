$(document).ready(async function ()
{
    let data = "";
    const firmaid = firmaidbul();
    if (!firmaid)
    {
        mesajmetin("Geçerli işyeri seçilmedi");
        window.location.href = "/isyerisec?id=09";
        return;
    }
    try
    {
        const response = await fetch(`/raporlama/oku/${firmaid}`);
        if (response.status === 401)
        {
            window.location.href = "/";
            return;
        }
        data = await response.json();
        if (!response.ok)
        {
            alertify.error(data.error || "Raporlama verileri alınamadı");
            return;
        }
    }
    catch
    {
        alertify.error("Raporlama verileri alınamadı");
    }
    data = jsoncevir(data);
    store.set("raporlamacalisan", data.calisan || []);
    store.set("raporlamaevrakkayit", data.evrakkayit || []);
    let liste = [];
    try
    {
        liste = await githuboku("https://cdn.jsdelivr.net/gh/MEHMETCERANX12/isgevrak@main/kaynak/yillikplan1_4.json");
        if (!liste) return;
        store.set("listeicerik", liste);
    }
    catch (err)
    {
        console.error(err);
        alertify.error("Yıllık plan verisi indirilemedi");
        return;
    }
})

function raporlamasecim()
{
    var secim = $('#raportipi').val() + $('#dosyatipi').val();
    switch(secim){case"11":calisanraporlamapdf();break;case"12":calisanraporlamaexcel();break;case"21":isyeriraporalpdf();break;case"22":isyeriraporalexcel();break;case"31":gorevlendirmeraporpdf();break;case"32":gorevlendirmeraporexcel();break;default:$('#raportipi').val()===""?alertify.error("Lütfen rapor tipini seçiniz."):$('#dosyatipi').val()===""?alertify.error("Lütfen dosya tipi seçiniz."):alertify.error("Geçersiz seçim.");}
}

function calisanraporlamaexcel()
{
    let firmajson = isyersecimfirmaoku();
    var data = jsoncevir(store.get("raporlamacalisan"));
    let tehlike = parseInt(firmajson.ts);
    var workbook = new ExcelJS.Workbook();
    var worksheet = workbook.addWorksheet("Rapor");
    worksheet.pageSetup = { paperSize: 9, orientation: "landscape", fitToPage: true, fitToWidth: 1, fitToHeight: 0, horizontalCentered: true, margins: { left: 0.4, right: 0.4, top: 0.4, bottom: 0.4, header: 0.2, footer: 0.2 } };
    worksheet.columns = [{width: 27.7 }, {width: 27.7 }, {width: 13.7 }, {width: 13.7 }, {width: 13.7}, {width: 13.7}, {width: 13.7}, {width: 13.7}, {width: 13.7}];
    worksheet.getRow(1).height = 22;
    worksheet.getRow(2).height = 22;
    worksheet.views = [{ state: 'frozen', ySplit: 2 }];
    worksheet.mergeCells('A1:B1');
    worksheet.getCell('A1').value = "ÇALIŞAN BİLGİLERİ";
    yesilbaslik(worksheet.getCell('A1'));
    ortala(worksheet.getCell('A1'));
    worksheet.getCell('A2').value = "Ad Soyad";
    gribaslik(worksheet.getCell('A2'));
    ortala(worksheet.getCell('A2'));
    worksheet.getCell('B2').value = "Unvan";
    gribaslik(worksheet.getCell('B2'));
    ortala(worksheet.getCell('B2'));
    worksheet.mergeCells('C1:D1');
    worksheet.getCell('C1').value = "TEMEL İSG EĞİTİMİ";
    yesilbaslik(worksheet.getCell('C1'));
    ortala(worksheet.getCell('C1'));
    worksheet.getCell('C2').value = "Eğitim Tarihi";
    gribaslik(worksheet.getCell('C2'));
    ortala(worksheet.getCell('C2'));
    worksheet.getCell('D2').value = "Son Geçerlilik";
    gribaslik(worksheet.getCell('D2'));
    ortala(worksheet.getCell('D2'));
    worksheet.mergeCells('E1:F1');
    worksheet.getCell('E1').value = "SAĞLIK RAPORU";
    yesilbaslik(worksheet.getCell('E1'));
    ortala(worksheet.getCell('E1'));
    worksheet.getCell('E2').value = "Rapor Tarihi";
    gribaslik(worksheet.getCell('E2'));
    ortala(worksheet.getCell('E2'));
    worksheet.getCell('F2').value = "Son Geçerlilik";
    gribaslik(worksheet.getCell('F2'));
    ortala(worksheet.getCell('F2'));
    worksheet.mergeCells('G1:H1');
    worksheet.getCell('G1').value = "İLKYARDIM EĞİTİMİ";
    yesilbaslik(worksheet.getCell('G1'));
    ortala(worksheet.getCell('G1'));
    worksheet.getCell('G2').value = "Eğitim Tarihi";
    gribaslik(worksheet.getCell('G2'));
    ortala(worksheet.getCell('G2'));
    worksheet.getCell('H2').value = "Son Geçerlilik";
    gribaslik(worksheet.getCell('H2'));
    ortala(worksheet.getCell('H2'));
    let gecerlitarih = '';
    data.forEach((item, index) =>
    {
        const rowNumber = index + 3;
        worksheet.getRow(rowNumber).height = 30;
        worksheet.getCell(`A${rowNumber}`).value = item.x;
        adsoyadexcelrapor(worksheet.getCell(`A${rowNumber}`));
        worksheet.getCell(`B${rowNumber}`).value = item.y;
        adsoyadexcelrapor(worksheet.getCell(`B${rowNumber}`));
        worksheet.getCell(`C${rowNumber}`).value = item.e;
        tarihexcelrapor(worksheet.getCell(`C${rowNumber}`));
        gecerlitarih = isgegitimgecerlilik(item.e, tehlike);
        worksheet.getCell(`D${rowNumber}`).value = gecerlitarih;
        tarihexcelrapor(worksheet.getCell(`D${rowNumber}`));
        worksheet.getCell(`E${rowNumber}`).value = item.s;
        tarihexcelrapor(worksheet.getCell(`E${rowNumber}`));
        gecerlitarih = saglikgecerlilik(item.s, tehlike);
        worksheet.getCell(`F${rowNumber}`).value = gecerlitarih;
        tarihexcelrapor(worksheet.getCell(`F${rowNumber}`));
        worksheet.getCell(`G${rowNumber}`).value = item.i;
        tarihexcelrapor(worksheet.getCell(`G${rowNumber}`));
        gecerlitarih = ilkyardimgecerlilik(item.i);
        worksheet.getCell(`H${rowNumber}`).value = gecerlitarih;
        tarihexcelrapor(worksheet.getCell(`H${rowNumber}`));
    });
    workbook.xlsx.writeBuffer().then(function(data){saveAs(new Blob([data],{type:"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"}),"Çalışan Rapor.xlsx");});
}

function calisanraporlamapdf()
{
    let firmajson = isyersecimfirmaoku();
    var data = jsoncevir(store.get("raporlamacalisan"));
    let tehlike = parseInt(firmajson.ts);
    let tableBody =
    [
        [
            { text: "Ad Soyad", style: 'tableHeader' },
            { text: "Unvan", style: 'tableHeader' },
            { text: "Eğitim Tarihi", style: 'tableHeader' },
            { text: "Son Geçerlilik", style: 'tableHeader' },
            { text: "Rapor Tarihi", style: 'tableHeader' },
            { text: "Son Geçerlilik", style: 'tableHeader' },
            { text: "İlkyardım Eğt", style: 'tableHeader' },
            { text: "Son Geçerlilik", style: 'tableHeader' }
        ]
    ];
    data.forEach(item =>
    {
        let egitimGecerlilik = isgegitimgecerlilik(item.e, tehlike);
        let saglikGecerlilik = saglikgecerlilik(item.s, tehlike);
        let ilkyardimGecerlilik = ilkyardimgecerlilik(item.i);
        tableBody.push
        ([
            { text: item.x || '', style: 'leftCell' },
            { text: item.y || '', style: 'leftCell' },
            { text: item.e || '', style: 'cell' },
            { text: egitimGecerlilik || '', style: 'cell' },
            { text: item.s || '', style: 'cell' },
            { text: saglikGecerlilik || '', style: 'cell' },
            { text: item.i || '', style: 'cell' },
            { text: ilkyardimGecerlilik || '', style: 'cell' }
        ]);
    });
    var docDefinition =
    {
        pageOrientation: 'landscape',
        pageMargins: [20, 20, 20, 20],
        content:
        [{
            table:
            {
                headerRows: 1,
                widths: ['auto', 'auto', '*', '*', '*', '*', '*', '*'],
                body: tableBody
            }
        }],
        styles:
        {
            header:{fontSize:18,bold:true},
            tableHeader: { fillColor: '#eeeeee', bold: true, fontSize: 11, alignment: 'center' },
            cell: { fontSize: 10, alignment: 'center' },
            leftCell: { fontSize: 10, alignment: 'left' }
        },
    };
    pdfMake.createPdf(docDefinition).download('Çalışan Rapor.pdf');
}

function isyeriraporalpdf()
{
    let githubjson = jsoncevir(store.get("listeicerik"));
    let firmajson = isyersecimfirmaoku();
    let tehlike = parseInt(firmajson.ts);
    var tehlikesinifimap = { 1: "Az Tehlikeli", 2: "Tehlikeli", 3: "Çok Tehlikeli"};
    let tehlikesinifi = tehlikesinifimap[firmajson.ts];
    var json = jsoncevir(store.get("raporlamaevrakkayit"));
    const riskmap={1:"Fine Kinney",2:"L Tipi Matris",3:"Hazop",4:"Neden-Sonuç Analiz",5:"Hata Ağacı Analiz",6:"Hata Türleri ve Etki Analiz"};
    let risktarih = "";
    let riskuzman = "";
    let riskhekim = "";
    let risktip = "";
    if (json.riskdegerlendirme && json.riskdegerlendirme.length > 0)
    {
        let r = json.riskdegerlendirme[0];
        risktarih = r.t;
        riskuzman = r.x;
        riskhekim = r.y;
        risktip = riskmap[r.z];
    }
    let aciltarih = "";
    let aciluzman = "";
    let acilhekim = "";
    if (json.acildurum && json.acildurum.length > 0)
    {
        let a = json.acildurum[0];
        aciltarih = a.t;
        aciluzman = a.x;
        acilhekim = a.y;
    }
    var tatbikatmaps = { 1: "Yangın", 2: "Patlama", 3: "Sel", 4: "Kimyasal Madde Yayılım", 5: "Salgın Hastalık", 6: "Zehirlenme", 7: "Sabotaj", 8: "Radyoaktif Madde Yayılım", 9: "Nükleer Madde Yayılım" };
    let tatbikattarih = "";
    let tatbikatad = "";
    let tatbikatunvan = "";
    let tatbikattur = "";
    if (json.tatbikat && json.tatbikat.length > 0)
    {
        let t = json.tatbikat[0];
        tatbikattarih = t.t;
        tatbikatad = t.x;
        tatbikatunvan = t.y;
        tatbikattur = tatbikatmaps[t.z];
    }
    let periyodiktarih = "";
    let periyodikhekim = "";
    let isegirishekim = "";
    if (json.saglikraporu && json.saglikraporu.length > 0)
    {
        let s = json.saglikraporu[0];
        periyodiktarih = s.t;
        periyodikhekim = s.x;
        isegirishekim = s.y;
    }
    let egitimuzman = "";
    let egitimhekim = "";
    if (json.egitim && json.egitim.length > 0)
    {
        egitimuzman = json.egitim[0].x;
        egitimhekim = json.egitim[0].y;
    }
    const unvanlar = [{ id: "0", ad: "Lütfen Seçiniz" }, { id: "1", ad: "Elektrik Mühendisi" }, { id: "2", ad: "Elektrik ve Elektronik Mühendisi" }, { id: "3", ad: "Elektronik Mühendisi" }, { id: "4", ad: "Elektrik Yüksek Teknikeri" }, { id: "5", ad: "Elektrik Teknik Öğretmeni" }, { id: "6", ad: "Elektrik Teknikeri" }, { id: "7", ad: "İnşaat Mühendisi" }, { id: "8", ad: "İnşaat Yüksek Teknikeri" }, { id: "9", ad: "İnşaat Teknik Öğretmeni" }, { id: "10", ad: "İnşaat Teknikeri" }, { id: "11", ad: "Makine Mühendisi" }, { id: "12", ad: "Makine Yüksek Teknikeri" }, { id: "13", ad: "Makine Teknik Öğretmeni" }, { id: "14", ad: "Makine Teknikeri" }, { id: "15", ad: "Mekatronik Mühendisi" }, { id: "16", ad: "Metalurji ve Malzeme Mühendisi" }, { id: "17", ad: "Metal Teknik Öğretmeni" }, { id: "18", ad: "Yapı Teknik Öğretmeni" }];
    let ekipmankontrol = githubjson.ekipmankontrol.filter(x => x.tur == "1");
    const unvanmap = unvanlar.reduce((m, u) => (m[u.id] = u.ad, m), {});
    let isekipmanijson = [];
    if (json.isekipmanikontrol && json.isekipmanikontrol.length > 0)
    {
        isekipmanijson = json.isekipmanikontrol.map(k => { let e = ekipmankontrol.find(x => x.id == k.id); return e ? { olcumad: e.kontrol, olcumyapanad: k.x, olcumyapanunvan: unvanmap[k.y] || k.y, t: k.t } : null }).filter(x => x);
    }
    let isekipmanitablo = [[{ text: "İş Ekipmanı Ölçüm Adı", style: "tablobaslik" }, { text: "Ölçüm Yapan Kişi Ad Soyad", style: "tablobaslik" }, { text: "Ölçüm Yapan Kişi Unvanı", style: "tablobaslik" }, { text: "Ölçüm Tarihi", style: "tablobaslik" }, { text: "Geçerlilik Tarihi", style: "tablobaslik" }]];
    isekipmanijson.forEach(r =>
    {
        isekipmanitablo.push([r.olcumad, r.olcumyapanad, r.olcumyapanunvan, { text: r.t, alignment: "center" }, { text: isekipmanigecerlilik(r.t), alignment: "center" }]);
    });
    let ortamolcumu = githubjson.ekipmankontrol.filter(x => x.tur == "2");
    const ortamolcummap = { 1: "Kişisel Maruziyet Ölçümü", 2: "Noktasal Ölçüm" };
    let ortamolcumjson = [];
    if (json.ortamolcumu && json.ortamolcumu.length > 0)
    {
        ortamolcumjson = json.ortamolcumu.map(k => { let e = ortamolcumu.find(x => x.id == k.id); return e ? { olcumad: e.kontrol, olcumyapanad: k.x, olcumtip: ortamolcummap[k.y] || k.y, t: k.t } : null }).filter(x => x);
    }
    let ortamolcumtablo = [[{ text: "Ortam Ölçüm Adı", style: "tablobaslik" }, { text: "Ölçüm Yapan Kişi Ad Soyad", style: "tablobaslik" }, { text: "Ölçüm Tipi", style: "tablobaslik" }, { text: "Ölçüm Tarihi", style: "tablobaslik" }, { text: "Geçerlilik Tarihi", style: "tablobaslik" }]];
    ortamolcumjson.forEach(r =>
    {
        ortamolcumtablo.push([
            r.olcumad,
            r.olcumyapanad,
            r.olcumtip,
            { text: r.t, alignment: "center" },
            { text: "Değişiklik Halinde", alignment: "center" }
        ]);
    });
    let sagliktaramaliste = githubjson.sagliktarama;
    let sagliktaramasonuc = [];
    if (json.sagliktarama && json.sagliktarama.length > 0)
    {
        sagliktaramasonuc = json.sagliktarama.map(k => { let e = sagliktaramaliste.find(x => x.id == k.id); return e ? { taramaad: e.tarama, yapanad: k.x, yapanunvan: k.y, t: k.t } : null }).filter(x => x);
    }
    let sagliktaramatablo = [[{ text: "Sağlık Taraması Adı", style: "tablobaslik" }, { text: "Tarama Yapan Ad Soyad", style: "tablobaslik" }, { text: "Tarama Yapan Unvan", style: "tablobaslik" }, { text: "Tarih", style: "tablobaslik" }, { text: "Geçerlilik", style: "tablobaslik" }]];
    sagliktaramasonuc.forEach(r =>
    {
        sagliktaramatablo.push([r.taramaad, r.yapanad, r.yapanunvan, { text: r.t, alignment: "center" }, { text: saglikgecerlilik(r.t, tehlike), alignment: "center" }]);
    });
    const docDefinition =
    {
        pageMargins: [30,30,30,30],
        content:
        [
            { text: 'İŞYERİ KAYIT RAPORLAMA', style: 'header' },
            { text: '\nİşyeri Bilgileri', style: 'sectionHeader' },
            {
                table:
                {
                    widths: ['25%', '75%'],
                    body:
                    [
                        ['İşyeri İsmi', firmajson.fi || ''],
                        [isverenunvanioku(), firmajson.is || ''],
                        ['Tehlike Sınıfı', tehlikesinifi || ''],
                        ['SGK Sicil No', firmajson.sc || ''],
                        ['Adres', firmajson.ad || ''],
                        ['İşyeri Hekimi', firmajson.hk || ''],
                        ['İş Güvenliği Uzmanı', store.get("uzmanad") || ''],
                        ['Bulunduğu İl', firmajson.sh || ''],
                    ]
                },
                layout: 'lightGrid'
            },
            { text: '\nRisk Değerlendirme Kayıtları', style: 'sectionHeader' },
            {
                table:
                {
                    widths: ['25%', '75%'],
                    body:
                    [
                        ['Risk Değerlendirme Tarihi', risktarih || ''],
                        ['Risk Değerlendirme Tipi', risktip || ''],
                        ['İş Güvenliği Uzmanı', riskuzman || ''],
                        ['İşyeri Hekimi', riskhekim || ''],
                        ['Son Geçerlilik Tarihi', riskdegerlendirmegecerlilik(risktarih, tehlike) || ''],
                    ]
                },
                layout: 'lightGrid'
            },
            { text: '\nAcil Durum Planı', style: 'sectionHeader' },
            {
                table:
                {
                    widths: ['25%', '75%'],
                    body:
                    [
                        ['Acil Durum Planı Tarihi', aciltarih || ''],
                        ['İş Güvenliği Uzmanı', aciluzman || ''],
                        ['İşyeri Hekimi', acilhekim || ''],
                        ['Son Geçerlilik Tarihi', riskdegerlendirmegecerlilik(aciltarih, tehlike) || ''],
                    ]
                },
                layout: 'lightGrid'
            },
            { text: '\nAcil Durum Tatbikatı', style: 'sectionHeader'},
            {
                table:
                {
                    widths: ['25%', '75%'],
                    body:
                    [
                        ['Tatbikat Tarihi', tatbikattarih || ''],
                        ['Gerçekleştiren Ad Soyad', tatbikatad || ''],
                        ['Gerçekleştiren Unvan', tatbikatunvan || ''],
                        ['Tatbikat Türü', tatbikattur || ''],
                        ['Son Geçerlilik Tarihi', acildurumtatbikattarih(tatbikattarih) || ''],
                    ]
                },
                layout: 'lightGrid'
            },
            { text: '\nEK-2 Sağlık Raporu', style: 'sectionHeader' },
            {
                table:
                {
                    widths: ['25%', '75%'],
                    body:
                    [
                        ['Periyodik Muayene Tarihi', periyodiktarih || ''],
                        ['Periyodik Muayene Hekim', periyodikhekim || ''],
                        ['İşe Giriş Raporu Hekim', isegirishekim || ''],
                    ]
                },
                layout: 'lightGrid'
            },
            { text: '\nTemel İSG Eğitimi', style: 'sectionHeader' },
            {
                table:
                {
                    widths: ['25%', '75%'],
                    body:
                    [
                        ['Temel İSG Eğitimi Uzman', egitimuzman || ''],
                        ['Temel İSG Eğitimi Hekim', egitimhekim || ''],
                    ]
                },
                layout: 'lightGrid',
            },
            {
                pageBreak: 'before',
                pageOrientation: 'landscape',
                pageMargins: [25, 25, 25, 25],
                table:
                {
                    widths: ['30%', '25%', '21%', '12%', '12%'],
                    body: isekipmanitablo,
                },
                layout: 'lightGrid',
                margin: [0, 0, 0, 10]
            },
            {
                table:
                {
                    widths: ['30%', '25%', '21%', '12%', '12%'],
                    body: ortamolcumtablo,
                },
                layout: 'lightGrid',
                margin: [0, 0, 0, 10]
            },
            {
                table:
                {
                    widths: ['30%', '25%', '21%', '12%', '12%'],
                    body: sagliktaramatablo,
                },
                layout: 'lightGrid',
                margin: [0, 0, 0, 10]
            }
        ],
        styles:
        {
            header:{font:'Roboto',fontSize:14,bold:true,alignment:'center',margin:[0,0,0,0]},
            sectionHeader:{font:'Roboto',fontSize:12,bold:true,margin:[0,0,0,5]},
            tablobaslik:{bold:true,alignment:'center',fillColor:'#545454',color:'white'}
        },
        defaultStyle: { fontSize: 10, margin: [0, 0, 0, 0]},
        footer: function (currentPage, pageCount)
        {
            return {text: 'Sayfa: ' + currentPage + '/' + pageCount,  alignment: 'right', margin: [0, 0, 25, 10]};
        }
    };
    pdfMake.createPdf(docDefinition).getBlob(function (blob) {saveAs(blob, 'İşyeri Rapor.pdf');});
}

async function isyeriraporalexcel()
{
    let githubjson = jsoncevir(store.get("listeicerik"));
    let firmajson = isyersecimfirmaoku();
    let tehlike = parseInt(firmajson.ts);
    var json = jsoncevir(store.get("raporlamaevrakkayit"));
    let uzmanAd = store.get("uzmanad") || '';
    const riskmap={1:"Fine Kinney",2:"L Tipi Matris",3:"Hazop",4:"Neden-Sonuç Analiz",5:"Hata Ağacı Analiz",6:"Hata Türleri ve Etki Analiz"};
    let riskveri = { tarih: '', tip: '', uzman: '', hekim: '' };
    if (json.riskdegerlendirme && json.riskdegerlendirme.length > 0)
    {
        let r = json.riskdegerlendirme[0];
        riskveri.tarih = r.t;
        riskveri.tip = riskmap[r.z] || "";
        riskveri.uzman = r.x;
        riskveri.hekim = r.y;
    }
    let acilveri = { tarih: '', uzman: '', hekim: '' };
    if (json.acildurum && json.acildurum.length > 0)
    {
        let a = json.acildurum[0];
        acilveri.tarih = a.t;
        acilveri.uzman = a.x;
        acilveri.hekim = a.y;
    }
    var tatbikatmaps = { 1: "Yangın", 2: "Patlama", 3: "Sel", 4: "Kimyasal Madde Yayılım", 5: "Salgın Hastalık", 6: "Zehirlenme", 7: "Sabotaj", 8: "Radyoaktif Madde Yayılım", 9: "Nükleer Madde Yayılım" };
    let tatbikat = { tarih: '', adsoyad: '', unvan: '', tur: '' };
    if (json.tatbikat && json.tatbikat.length > 0)
    {
        let t = json.tatbikat[0];
        tatbikat.tarih = t.t;
        tatbikat.adsoyad = t.x;
        tatbikat.unvan = t.y;
        tatbikat.tur = tatbikatmaps[t.z];
    }
    let saglikraporu = { tarih: '', periyodik: '', isegiris: '' };
    if (json.saglikraporu && json.saglikraporu.length > 0)
    {
        let s = json.saglikraporu[0];
        saglikraporu.tarih = s.t;
        saglikraporu.periyodik = s.x;
        saglikraporu.isegiris = s.y;
    }
    let isgegitim = { uzman: '', hekim: '' };
    if (json.egitim && json.egitim.length > 0)
    {
        let egitim = json.egitim[0];
        isgegitim.uzman = egitim.x;
        isgegitim.hekim = egitim.y;
    }
    const tehlikesinifiMap = { 1: "Az Tehlikeli", 2: "Tehlikeli", 3: "Çok Tehlikeli" };
    const unvanlar = [
        { id: "0", ad: "Lütfen Seçiniz" },
        { id: "1", ad: "Elektrik Mühendisi" }, { id: "2", ad: "Elektrik ve Elektronik Mühendisi" },
        { id: "3", ad: "Elektronik Mühendisi" }, { id: "4", ad: "Elektrik Yüksek Teknikeri" },
        { id: "5", ad: "Elektrik Teknik Öğretmeni" }, { id: "6", ad: "Elektrik Teknikeri" },
        { id: "7", ad: "İnşaat Mühendisi" }, { id: "8", ad: "İnşaat Yüksek Teknikeri" },
        { id: "9", ad: "İnşaat Teknik Öğretmeni" }, { id: "10", ad: "İnşaat Teknikeri" },
        { id: "11", ad: "Makine Mühendisi" }, { id: "12", ad: "Makine Yüksek Teknikeri" },
        { id: "13", ad: "Makine Teknik Öğretmeni" }, { id: "14", ad: "Makine Teknikeri" },
        { id: "15", ad: "Mekatronik Mühendisi" }, { id: "16", ad: "Metalurji ve Malzeme Mühendisi" },
        { id: "17", ad: "Metal Teknik Öğretmeni" }, { id: "18", ad: "Yapı Teknik Öğretmeni" }
    ];
    const unvanMap = unvanlar.reduce((m, u) => { m[u.id] = u.ad; return m; }, {});
    let isEkipmaniRows = [];
    if (json.isekipmanikontrol && json.isekipmanikontrol.length > 0) {
        let ekipmanListesi = githubjson.ekipmankontrol.filter(x => x.tur == "1");
        json.isekipmanikontrol.forEach(k => {
            let e = ekipmanListesi.find(x => x.id == k.id);
            if (e) {
                isEkipmaniRows.push([
                    e.kontrol,
                    k.x,
                    unvanMap[k.y] || k.y,
                    k.t || '',
                    isekipmanigecerlilik(k.t) || ''
                ]);
            }
        });
    }
    let ortamOlcumRows = [];
    if (json.ortamolcumu && json.ortamolcumu.length > 0) {
        let ortamOlcumListesi = githubjson.ekipmankontrol.filter(x => x.tur == "2");
        const ortamTipMap = { 1: "Kişisel Maruziyet Ölçümü", 2: "Noktasal Ölçüm" };
        json.ortamolcumu.forEach(k => {
            let e = ortamOlcumListesi.find(x => x.id == k.id);
            if (e) {
                ortamOlcumRows.push([
                    e.kontrol,
                    k.x,
                    ortamTipMap[k.y] || k.y,
                    k.t || '',
                    k.t ? 'Değişiklik Halinde' : ''
                ]);
            }
        });
    }
    let saglikTaramaRows = [];
    if (json.sagliktarama && json.sagliktarama.length > 0) {
        let taramaListesi = githubjson.sagliktarama;
        json.sagliktarama.forEach(k => {
            let e = taramaListesi.find(x => x.id == k.id);
            if (e) {
                saglikTaramaRows.push([
                    e.tarama,
                    k.x,
                    k.y,
                    k.t || '',
                    saglikgecerlilik(k.t, tehlike) || ''
                ]);
            }
        });
    }
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('İşyeri Raporu-1');
    worksheet.pageSetup = {
        paperSize: 9, orientation: "portrait", fitToPage: true, fitToWidth: 1, fitToHeight: 0, horizontalCentered: true,
        margins: { left: 0.4, right: 0.4, top: 0.4, bottom: 0.4, header: 0.2, footer: 0.2 }
    };
    worksheet.columns = [{ width: 27.7 }, { width: 62.7 }];
    const anabaslik = { font: { name: 'Calibri', size: 12, bold: true }, alignment: { horizontal: 'center', vertical: 'top' } };
    const altbaslik = { font: { name: 'Calibri', size: 11, bold: true }, alignment: { horizontal: 'left', vertical: 'middle' } };
    const normalmetin = {
        font: { name: 'Calibri', size: 11, bold: false }, alignment: { horizontal: 'left', vertical: 'middle' },
        border: { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
    };
    const ortalanormalmetin = {
        font: { name: 'Calibri', size: 11, bold: false }, alignment: { horizontal: 'center', vertical: 'middle' },
        border: { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
    };
    const tablobaslikstil = {
        font: { bold: true, color: { argb: 'FFFFFFFF' } }, alignment: { horizontal: 'center', vertical: 'middle', wrapText: true },
        fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF545454' } },
        border: { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
    };

    let hedefsatir = 1;
    worksheet.mergeCells(hedefsatir, 1, hedefsatir, 2);
    worksheet.getCell(hedefsatir, 1).value = 'İŞYERİ KAYIT RAPORLAMA';
    worksheet.getCell(hedefsatir, 1).style = anabaslik;
    worksheet.getRow(hedefsatir).height = 25;
    hedefsatir++;

    worksheet.mergeCells(hedefsatir, 1, hedefsatir, 2);
    worksheet.getCell(hedefsatir, 1).value = 'İşyeri Bilgileri';
    worksheet.getCell(hedefsatir, 1).style = altbaslik;
    worksheet.getRow(hedefsatir).height = 20;
    hedefsatir++;
    worksheet.getCell(hedefsatir, 1).value = 'İşyeri İsmi';
    worksheet.getCell(hedefsatir, 1).style = normalmetin;
    worksheet.getCell(hedefsatir, 2).value = firmajson.fi || '';
    worksheet.getCell(hedefsatir, 2).style = normalmetin;
    worksheet.getRow(hedefsatir).height = 20;
    hedefsatir++;

    worksheet.getCell(hedefsatir, 1).value = isverenunvanioku();
    worksheet.getCell(hedefsatir, 1).style = normalmetin;
    worksheet.getCell(hedefsatir, 2).value = firmajson.is || '';
    worksheet.getCell(hedefsatir, 2).style = normalmetin;
    worksheet.getRow(hedefsatir).height = 20;
    hedefsatir++;

    worksheet.getCell(hedefsatir, 1).value = 'Tehlike Sınıfı';
    worksheet.getCell(hedefsatir, 1).style = normalmetin;
    worksheet.getCell(hedefsatir, 2).value = tehlikesinifiMap[firmajson.ts] || '';
    worksheet.getCell(hedefsatir, 2).style = normalmetin;
    worksheet.getRow(hedefsatir).height = 20;
    hedefsatir++;

    worksheet.getCell(hedefsatir, 1).value = 'SGK Sicil No';
    worksheet.getCell(hedefsatir, 1).style = normalmetin;
    worksheet.getCell(hedefsatir, 2).value = firmajson.sc || '';
    worksheet.getCell(hedefsatir, 2).style = normalmetin;
    worksheet.getRow(hedefsatir).height = 20;
    hedefsatir++;

    worksheet.getCell(hedefsatir, 1).value = 'Adres';
    worksheet.getCell(hedefsatir, 1).style = normalmetin;
    worksheet.getCell(hedefsatir, 2).value = firmajson.ad || '';
    worksheet.getCell(hedefsatir, 2).style = normalmetin;
    worksheet.getRow(hedefsatir).height = 20;
    hedefsatir++;

    worksheet.getCell(hedefsatir, 1).value = 'İşyeri Hekimi';
    worksheet.getCell(hedefsatir, 1).style = normalmetin;
    worksheet.getCell(hedefsatir, 2).value = firmajson.hk || '';
    worksheet.getCell(hedefsatir, 2).style = normalmetin;
    worksheet.getRow(hedefsatir).height = 20;
    hedefsatir++;

    worksheet.getCell(hedefsatir, 1).value = 'İş Güvenliği Uzmanı';
    worksheet.getCell(hedefsatir, 1).style = normalmetin;
    worksheet.getCell(hedefsatir, 2).value = uzmanAd;
    worksheet.getCell(hedefsatir, 2).style = normalmetin;
    worksheet.getRow(hedefsatir).height = 20;
    hedefsatir++;

    worksheet.getCell(hedefsatir, 1).value = 'Bulunduğu İl';
    worksheet.getCell(hedefsatir, 1).style = normalmetin;
    worksheet.getCell(hedefsatir, 2).value = firmajson.sh || '';
    worksheet.getCell(hedefsatir, 2).style = normalmetin;
    worksheet.getRow(hedefsatir).height = 20;
    hedefsatir++;
    worksheet.mergeCells(hedefsatir, 1, hedefsatir, 2);
    worksheet.getCell(hedefsatir, 1).value = 'Risk Değerlendirme Kayıtları';
    worksheet.getCell(hedefsatir, 1).style = altbaslik;
    worksheet.getRow(hedefsatir).height = 25;
    hedefsatir++;

    worksheet.getCell(hedefsatir, 1).value = 'Risk Değerlendirme Tarihi';
    worksheet.getCell(hedefsatir, 1).style = normalmetin;
    worksheet.getCell(hedefsatir, 2).value = riskveri.tarih || '';
    worksheet.getCell(hedefsatir, 2).style = normalmetin;
    worksheet.getRow(hedefsatir).height = 20;
    hedefsatir++;

    worksheet.getCell(hedefsatir, 1).value = 'Risk Değerlendirme Tipi';
    worksheet.getCell(hedefsatir, 1).style = normalmetin;
    worksheet.getCell(hedefsatir, 2).value = riskveri.tip;
    worksheet.getCell(hedefsatir, 2).style = normalmetin;
    worksheet.getRow(hedefsatir).height = 20;
    hedefsatir++;

    worksheet.getCell(hedefsatir, 1).value = 'İş Güvenliği Uzmanı';
    worksheet.getCell(hedefsatir, 1).style = normalmetin;
    worksheet.getCell(hedefsatir, 2).value = riskveri.uzman || '';
    worksheet.getCell(hedefsatir, 2).style = normalmetin;
    worksheet.getRow(hedefsatir).height = 20;
    hedefsatir++;

    worksheet.getCell(hedefsatir, 1).value = 'İşyeri Hekimi';
    worksheet.getCell(hedefsatir, 1).style = normalmetin;
    worksheet.getCell(hedefsatir, 2).value = riskveri.hekim || '';
    worksheet.getCell(hedefsatir, 2).style = normalmetin;
    worksheet.getRow(hedefsatir).height = 20;
    hedefsatir++;

    worksheet.getCell(hedefsatir, 1).value = 'Son Geçerlilik Tarihi';
    worksheet.getCell(hedefsatir, 1).style = normalmetin;
    worksheet.getCell(hedefsatir, 2).value = riskdegerlendirmegecerlilik(riskveri.tarih, tehlike) || '';
    worksheet.getCell(hedefsatir, 2).style = normalmetin;
    worksheet.getRow(hedefsatir).height = 20;
    hedefsatir++;
    worksheet.mergeCells(hedefsatir, 1, hedefsatir, 2);
    worksheet.getCell(hedefsatir, 1).value = 'Acil Durum Planı';
    worksheet.getCell(hedefsatir, 1).style = altbaslik;
    worksheet.getRow(hedefsatir).height = 25;
    hedefsatir++;

    worksheet.getCell(hedefsatir, 1).value = 'Acil Durum Planı Tarihi';
    worksheet.getCell(hedefsatir, 1).style = normalmetin;
    worksheet.getCell(hedefsatir, 2).value = acilveri.tarih || '';
    worksheet.getCell(hedefsatir, 2).style = normalmetin;
    worksheet.getRow(hedefsatir).height = 20;
    hedefsatir++;

    worksheet.getCell(hedefsatir, 1).value = 'İş Güvenliği Uzmanı';
    worksheet.getCell(hedefsatir, 1).style = normalmetin;
    worksheet.getCell(hedefsatir, 2).value = acilveri.uzman || '';
    worksheet.getCell(hedefsatir, 2).style = normalmetin;
    worksheet.getRow(hedefsatir).height = 20;
    hedefsatir++;

    worksheet.getCell(hedefsatir, 1).value = 'İşyeri Hekimi';
    worksheet.getCell(hedefsatir, 1).style = normalmetin;
    worksheet.getCell(hedefsatir, 2).value = acilveri.hekim || '';
    worksheet.getCell(hedefsatir, 2).style = normalmetin;
    worksheet.getRow(hedefsatir).height = 20;
    hedefsatir++;

    worksheet.getCell(hedefsatir, 1).value = 'Son Geçerlilik Tarihi';
    worksheet.getCell(hedefsatir, 1).style = normalmetin;
    worksheet.getCell(hedefsatir, 2).value = riskdegerlendirmegecerlilik(acilveri.tarih, tehlike) || '';
    worksheet.getCell(hedefsatir, 2).style = normalmetin;
    worksheet.getRow(hedefsatir).height = 20;
    hedefsatir++;
    worksheet.mergeCells(hedefsatir, 1, hedefsatir, 2);
    worksheet.getCell(hedefsatir, 1).value = 'Acil Durum Tatbikatı';
    worksheet.getCell(hedefsatir, 1).style = altbaslik;
    worksheet.getRow(hedefsatir).height = 25;
    hedefsatir++;

    worksheet.getCell(hedefsatir, 1).value = 'Tatbikat Tarihi';
    worksheet.getCell(hedefsatir, 1).style = normalmetin;
    worksheet.getCell(hedefsatir, 2).value = tatbikat.tarih || '';
    worksheet.getCell(hedefsatir, 2).style = normalmetin;
    worksheet.getRow(hedefsatir).height = 20;
    hedefsatir++;

    worksheet.getCell(hedefsatir, 1).value = 'Gerçekleştiren Ad Soyad';
    worksheet.getCell(hedefsatir, 1).style = normalmetin;
    worksheet.getCell(hedefsatir, 2).value = tatbikat.adsoyad || '';
    worksheet.getCell(hedefsatir, 2).style = normalmetin;
    worksheet.getRow(hedefsatir).height = 20;
    hedefsatir++;

    worksheet.getCell(hedefsatir, 1).value = 'Gerçekleştiren Unvan';
    worksheet.getCell(hedefsatir, 1).style = normalmetin;
    worksheet.getCell(hedefsatir, 2).value = tatbikat.unvan || '';
    worksheet.getCell(hedefsatir, 2).style = normalmetin;
    worksheet.getRow(hedefsatir).height = 20;
    hedefsatir++;

    worksheet.getCell(hedefsatir, 1).value = 'Tatbikat Türü';
    worksheet.getCell(hedefsatir, 1).style = normalmetin;
    worksheet.getCell(hedefsatir, 2).value = tatbikat.tur;
    worksheet.getCell(hedefsatir, 2).style = normalmetin;
    worksheet.getRow(hedefsatir).height = 20;
    hedefsatir++;

    worksheet.getCell(hedefsatir, 1).value = 'Son Geçerlilik Tarihi';
    worksheet.getCell(hedefsatir, 1).style = normalmetin;
    worksheet.getCell(hedefsatir, 2).value = acildurumtatbikattarih(tatbikat.tarih) || '';
    worksheet.getCell(hedefsatir, 2).style = normalmetin;
    worksheet.getRow(hedefsatir).height = 20;
    hedefsatir++;
    worksheet.mergeCells(hedefsatir, 1, hedefsatir, 2);
    worksheet.getCell(hedefsatir, 1).value = 'EK-2 Sağlık Raporu';
    worksheet.getCell(hedefsatir, 1).style = altbaslik;
    worksheet.getRow(hedefsatir).height = 25;
    hedefsatir++;

    worksheet.getCell(hedefsatir, 1).value = 'Periyodik Muayene Tarihi';
    worksheet.getCell(hedefsatir, 1).style = normalmetin;
    worksheet.getCell(hedefsatir, 2).value = saglikraporu.tarih || '';
    worksheet.getCell(hedefsatir, 2).style = normalmetin;
    worksheet.getRow(hedefsatir).height = 20;
    hedefsatir++;

    worksheet.getCell(hedefsatir, 1).value = 'Periyodik Muayene Hekim';
    worksheet.getCell(hedefsatir, 1).style = normalmetin;
    worksheet.getCell(hedefsatir, 2).value = saglikraporu.periyodik || '';
    worksheet.getCell(hedefsatir, 2).style = normalmetin;
    worksheet.getRow(hedefsatir).height = 20;
    hedefsatir++;

    worksheet.getCell(hedefsatir, 1).value = 'İşe Giriş Raporu Hekim';
    worksheet.getCell(hedefsatir, 1).style = normalmetin;
    worksheet.getCell(hedefsatir, 2).value = saglikraporu.isegiris || '';
    worksheet.getCell(hedefsatir, 2).style = normalmetin;
    worksheet.getRow(hedefsatir).height = 20;
    hedefsatir++;
    worksheet.mergeCells(hedefsatir, 1, hedefsatir, 2);
    worksheet.getCell(hedefsatir, 1).value = 'Temel İSG Eğitimi';
    worksheet.getCell(hedefsatir, 1).style = altbaslik;
    worksheet.getRow(hedefsatir).height = 25;
    hedefsatir++;
    worksheet.getCell(hedefsatir, 1).value = 'Temel İSG Eğitimi Uzman';
    worksheet.getCell(hedefsatir, 1).style = normalmetin;
    worksheet.getCell(hedefsatir, 2).value = isgegitim.uzman || '';
    worksheet.getCell(hedefsatir, 2).style = normalmetin;
    worksheet.getRow(hedefsatir).height = 20;
    hedefsatir++;

    worksheet.getCell(hedefsatir, 1).value = 'Temel İSG Eğitimi Hekim';
    worksheet.getCell(hedefsatir, 1).style = normalmetin;
    worksheet.getCell(hedefsatir, 2).value = isgegitim.hekim || '';
    worksheet.getCell(hedefsatir, 2).style = normalmetin;
    worksheet.getRow(hedefsatir).height = 20;
    hedefsatir++;
    const raporSayfa2 = workbook.addWorksheet('İşyeri Raporu-2');
    raporSayfa2.pageSetup = {
        paperSize: 9, orientation: "landscape", fitToPage: true, fitToWidth: 1, fitToHeight: 0, horizontalCentered: true,
        margins: { left: 0.4, right: 0.4, top: 0.4, bottom: 0.4, header: 0.2, footer: 0.2 }
    };
    raporSayfa2.columns = [
        { width: 36.7 }, { width: 37.7 }, { width: 31.7 },
        { width: 15.7 }, { width: 16.7 }, { width: 13.7 },
        { width: 13.7 }, { width: 13.7 }, { width: 13.7 }
    ];
    hedefsatir = 1;
    raporSayfa2.getCell(hedefsatir, 1).value = "İş Ekipmanı Ölçüm Adı";
    raporSayfa2.getCell(hedefsatir, 1).style = tablobaslikstil;
    raporSayfa2.getCell(hedefsatir, 2).value = "Ölçüm Yapan Kişi Ad Soyad";
    raporSayfa2.getCell(hedefsatir, 2).style = tablobaslikstil;
    raporSayfa2.getCell(hedefsatir, 3).value = "Ölçüm Yapan Kişi Unvanı";
    raporSayfa2.getCell(hedefsatir, 3).style = tablobaslikstil;
    raporSayfa2.getCell(hedefsatir, 4).value = "Ölçüm Tarihi";
    raporSayfa2.getCell(hedefsatir, 4).style = tablobaslikstil;
    raporSayfa2.getCell(hedefsatir, 5).value = "Geçerlilik Tarihi";
    raporSayfa2.getCell(hedefsatir, 5).style = tablobaslikstil;
    hedefsatir++;
    isEkipmaniRows.forEach(data =>
    {
        const row = raporSayfa2.addRow(data);
        row.getCell(1).style = normalmetin;
        row.getCell(2).style = normalmetin;
        row.getCell(3).style = normalmetin;
        row.getCell(4).style = ortalanormalmetin;
        row.getCell(5).style = ortalanormalmetin;
        hedefsatir++;
    });
    hedefsatir++;
    raporSayfa2.getCell(hedefsatir, 1).value = "Ortam Ölçüm Adı";
    raporSayfa2.getCell(hedefsatir, 1).style = tablobaslikstil;
    raporSayfa2.getCell(hedefsatir, 2).value = "Ölçüm Yapan Kişi Ad Soyad";
    raporSayfa2.getCell(hedefsatir, 2).style = tablobaslikstil;
    raporSayfa2.getCell(hedefsatir, 3).value = "Ölçüm Tipi";
    raporSayfa2.getCell(hedefsatir, 3).style = tablobaslikstil;
    raporSayfa2.getCell(hedefsatir, 4).value = "Ölçüm Tarihi";
    raporSayfa2.getCell(hedefsatir, 4).style = tablobaslikstil;
    raporSayfa2.getCell(hedefsatir, 5).value = "Geçerlilik Tarihi";
    raporSayfa2.getCell(hedefsatir, 5).style = tablobaslikstil;
    hedefsatir++;
    ortamOlcumRows.forEach(data => {
        const row = raporSayfa2.addRow(data);
        row.getCell(1).style = normalmetin;
        row.getCell(2).style = normalmetin;
        row.getCell(3).style = normalmetin;
        row.getCell(4).style = ortalanormalmetin;
        row.getCell(5).style = ortalanormalmetin;
        hedefsatir++;
    });
    hedefsatir += 2;
    raporSayfa2.getCell(hedefsatir, 1).value = "Sağlık Taraması Adı";
    raporSayfa2.getCell(hedefsatir, 1).style = tablobaslikstil;
    raporSayfa2.getCell(hedefsatir, 2).value = "Tarama Yapan Kişi Ad Soyad";
    raporSayfa2.getCell(hedefsatir, 2).style = tablobaslikstil;
    raporSayfa2.getCell(hedefsatir, 3).value = "Tarama Yapan Kişi Unvanı";
    raporSayfa2.getCell(hedefsatir, 3).style = tablobaslikstil;
    raporSayfa2.getCell(hedefsatir, 4).value = "Tarama Tarihi";
    raporSayfa2.getCell(hedefsatir, 4).style = tablobaslikstil;
    raporSayfa2.getCell(hedefsatir, 5).value = "Geçerlilik Tarihi";
    raporSayfa2.getCell(hedefsatir, 5).style = tablobaslikstil;
    hedefsatir++;
    saglikTaramaRows.forEach(data =>
    {
        const row = raporSayfa2.addRow(data);
        row.getCell(1).style = normalmetin;
        row.getCell(2).style = normalmetin;
        row.getCell(3).style = normalmetin;
        row.getCell(4).style = ortalanormalmetin;
        row.getCell(5).style = ortalanormalmetin;
        hedefsatir++;
    });
    try
    {
        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
        saveAs(blob, "İşyeri Raporu.xlsx");
        console.log("Excel dosyası başarıyla oluşturuldu ve indirme başlatıldı.");
    }
    catch (err)
    {
        console.error('Excel dosyası oluşturulurken hata:', err);
        alert('Excel dosyası oluşturulurken bir hata oluştu.');
    }
}

function gorevlendirmeraporexcel()
{
    let firmajson = isyersecimfirmaoku();
    let isveren = firmajson.is;
    let hekimad = firmajson.hk;
    let hekimno = firmajson.hn;
    let uzmanad = store.get("uzmanad") || '';
    let uzmanno = store.get("uzmanno") || '';
    var data = jsoncevir(store.get("raporlamacalisan"));
    const normalmetin={font:{name:'Calibri',size:11,bold:false},alignment:{horizontal:'left',vertical:'middle'},border:{top:{style:'thin'},left:{style:'thin'},bottom:{style:'thin'},right:{style:'thin'}}};
    const tablobaslikstil={font:{bold:true,color:{argb:'FFFFFFFF'}},alignment:{horizontal:'center',vertical:'middle',wrapText:true},fill:{type:'pattern',pattern:'solid',fgColor:{argb:'FF545454'}},border:{top:{style:'thin'},left:{style:'thin'},bottom:{style:'thin'},right:{style:'thin'}}};
    const altbaslik = {font: { name: 'Calibri', size: 11, bold: true }, alignment: { horizontal: 'center', vertical: 'middle' }};
    const acilliste = { 0: "Görevli Değil", 1: "İlkyardım Ekibi - Ekip Başı", 2: "İlkyardım Ekibi - Ekip Personeli", 3: "Söndürme Ekibi - Ekip Başı", 4: "Söndürme Ekibi - Ekip Personeli", 5: "Koruma Ekibi - Ekip Başı + Koordinasyon", 6: "Koruma Ekibi - Ekip Personeli + Koordinasyon", 7: "Koruma Ekibi - Ekip Personeli", 8: "Kurtarma Ekibi - Ekip Başı", 9: "Kurtarma Ekibi - Ekip Personeli", 10: "Destek Elemanı" };
    const temsilciliste = { 0: "Görevli Değil", 1: "Çalışan Temsilcisi", 2: "Çalışan Baş Temsilcisi"};
    const riskliste = { 0: "Görevli Değil", 1: "Destek Elemanı", 2: "Çalışan Temsilcisi", 3: "Bilgi Sahibi Çalışan"};
    let acildurumekibi = data.filter(person => person.a !== 0).sort((x, y) => x.a - y.a);
    acildurumekibi = acildurumekibi.map(person => ({ ...person, a: acilliste[person.a] || 'Bilinmiyor' }));
    var workbook = new ExcelJS.Workbook();
    var worksheet = workbook.addWorksheet("Rapor");
    worksheet.pageSetup = { paperSize: 9, orientation: "portrait", fitToPage: true, fitToWidth: 1, fitToHeight: 0, horizontalCentered: true, margins: { left: 0.2, right: 0.2, top: 0.4, bottom: 0.4, header: 0.2, footer: 0.2 } };
    worksheet.columns = [{width: 27.7 }, {width: 27.7 }, {width: 42.7 }];
    let hedefsatir = 1;
    worksheet.mergeCells(hedefsatir, 1, hedefsatir, 3);
    worksheet.getCell(hedefsatir, 1).value = 'ACİL DURUM EKİP GÖREVLENDİRMESİ';
    worksheet.getCell(hedefsatir, 1).style = altbaslik;
    worksheet.getRow(hedefsatir).height = 25;
    hedefsatir = hedefsatir + 1;
    worksheet.getCell(hedefsatir, 1).value = 'Ad Soyad';
    worksheet.getCell(hedefsatir, 1).style = tablobaslikstil;
    worksheet.getCell(hedefsatir, 2).value = 'Unvan';
    worksheet.getCell(hedefsatir, 2).style = tablobaslikstil;
    worksheet.getCell(hedefsatir, 3).value = 'Acil Durum Ekip Görevi';
    worksheet.getCell(hedefsatir, 3).style = tablobaslikstil;
    worksheet.getRow(hedefsatir).height = 20;
    hedefsatir = hedefsatir + 1;
    acildurumekibi.forEach((item) =>
    {
        worksheet.getRow(hedefsatir).height = 20;
        worksheet.getCell(hedefsatir, 1).value = item.x;
        worksheet.getCell(hedefsatir, 1).style = normalmetin;
        worksheet.getCell(hedefsatir, 2).value = item.y;
        worksheet.getCell(hedefsatir, 2).style = normalmetin;
        worksheet.getCell(hedefsatir, 3).value = item.a;
        worksheet.getCell(hedefsatir, 3).style = normalmetin;
        hedefsatir = hedefsatir + 1;
    });
    let temsilciekibi = data.filter(person => person.t !== 0).sort((x, y) => x.t - y.t);
    temsilciekibi = temsilciekibi.map(person => ({ ...person, t: temsilciliste[person.t] || 'Bilinmiyor' }));
    worksheet.mergeCells(hedefsatir, 1, hedefsatir, 3);
    worksheet.getCell(hedefsatir, 1).value = 'ÇALIŞAN TEMSİLCİSİ GÖREVLENDİRMESİ';
    worksheet.getCell(hedefsatir, 1).style = altbaslik;
    worksheet.getRow(hedefsatir).height = 25;
    hedefsatir = hedefsatir + 1;
    worksheet.getCell(hedefsatir, 1).value = 'Ad Soyad';
    worksheet.getCell(hedefsatir, 1).style = tablobaslikstil;
    worksheet.getCell(hedefsatir, 2).value = 'Unvan';
    worksheet.getCell(hedefsatir, 2).style = tablobaslikstil;
    worksheet.getCell(hedefsatir, 3).value = 'Temsilci Görevi';
    worksheet.getCell(hedefsatir, 3).style = tablobaslikstil;
    worksheet.getRow(hedefsatir).height = 20;
    hedefsatir = hedefsatir + 1;
    temsilciekibi.forEach((item) =>
    {
        worksheet.getRow(hedefsatir).height = 20;
        worksheet.getCell(hedefsatir, 1).value = item.x;
        worksheet.getCell(hedefsatir, 1).style = normalmetin;
        worksheet.getCell(hedefsatir, 2).value = item.y;
        worksheet.getCell(hedefsatir, 2).style = normalmetin;
        worksheet.getCell(hedefsatir, 3).value = item.t;
        worksheet.getCell(hedefsatir, 3).style = normalmetin;
        hedefsatir = hedefsatir + 1;
    });
    let riskanaliziekibi = data.filter(person => person.r !== 0).sort((x, y) => x.r - y.r);
    riskanaliziekibi = riskanaliziekibi.map(person => ({ ...person, r: riskliste[person.r] || 'Bilinmiyor' }));
    worksheet.mergeCells(hedefsatir, 1, hedefsatir, 3);
    worksheet.getCell(hedefsatir, 1).value = 'RİSK DEĞERLENDİRME EKİBİ';
    worksheet.getCell(hedefsatir, 1).style = altbaslik;
    worksheet.getRow(hedefsatir).height = 25;
    hedefsatir = hedefsatir + 1;
    worksheet.getCell(hedefsatir, 1).value = 'Ad Soyad';
    worksheet.getCell(hedefsatir, 1).style = tablobaslikstil;
    worksheet.getCell(hedefsatir, 2).value = 'Unvan / Belge No';
    worksheet.getCell(hedefsatir, 2).style = tablobaslikstil;
    worksheet.getCell(hedefsatir, 3).value = 'Risk Değerlendirme Görevi';
    worksheet.getCell(hedefsatir, 3).style = tablobaslikstil;
    worksheet.getRow(hedefsatir).height = 20;
    hedefsatir = hedefsatir + 1;
    worksheet.getRow(hedefsatir).height = 20;
    worksheet.getCell(hedefsatir, 1).value = isveren;
    worksheet.getCell(hedefsatir, 1).style = normalmetin;
    worksheet.getCell(hedefsatir, 2).value = isverenunvanioku();
    worksheet.getCell(hedefsatir, 2).style = normalmetin;
    worksheet.getCell(hedefsatir, 3).value = isverenunvanioku();
    worksheet.getCell(hedefsatir, 3).style = normalmetin;
    hedefsatir = hedefsatir + 1;
    worksheet.getRow(hedefsatir).height = 20;
    worksheet.getCell(hedefsatir, 1).value = uzmanad;
    worksheet.getCell(hedefsatir, 1).style = normalmetin;
    worksheet.getCell(hedefsatir, 2).value = uzmanno;
    worksheet.getCell(hedefsatir, 2).style = normalmetin;
    worksheet.getCell(hedefsatir, 3).value = 'İş Güvenliği Uzmanı';
    worksheet.getCell(hedefsatir, 3).style = normalmetin;
    hedefsatir = hedefsatir + 1;
    worksheet.getRow(hedefsatir).height = 20;
    worksheet.getCell(hedefsatir, 1).value = hekimad;
    worksheet.getCell(hedefsatir, 1).style = normalmetin;
    worksheet.getCell(hedefsatir, 2).value = hekimno;
    worksheet.getCell(hedefsatir, 2).style = normalmetin;
    worksheet.getCell(hedefsatir, 3).value = 'İşyeri Hekimi';
    worksheet.getCell(hedefsatir, 3).style = normalmetin;
    hedefsatir = hedefsatir + 1;
    riskanaliziekibi.forEach((item) => { worksheet.getRow(hedefsatir).height = 20; worksheet.getCell(hedefsatir, 1).value = item.x; worksheet.getCell(hedefsatir, 1).style = normalmetin; worksheet.getCell(hedefsatir, 2).value = item.y; worksheet.getCell(hedefsatir, 2).style = normalmetin; worksheet.getCell(hedefsatir, 3).value = item.r; worksheet.getCell(hedefsatir, 3).style = normalmetin; hedefsatir = hedefsatir + 1; });
    workbook.xlsx.writeBuffer().then(function(data){saveAs(new Blob([data],{type:"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"}),"Çalışan Rapor.xlsx");});
}

function gorevlendirmeraporpdf()
{
    let firmajson = isyersecimfirmaoku();
    let isveren = firmajson.is;
    let hekimad = firmajson.hk;
    let hekimno = firmajson.hn;
    let uzmanad = store.get("uzmanad") || '';
    let uzmanno = store.get("uzmanno") || '';
    var data = jsoncevir(store.get("raporlamacalisan"));
    const acilliste = { 0: "Görevli Değil", 1: "İlkyardım Ekibi - Ekip Başı", 2: "İlkyardım Ekibi - Ekip Personeli", 3: "Söndürme Ekibi - Ekip Başı", 4: "Söndürme Ekibi - Ekip Personeli", 5: "Koruma Ekibi - Ekip Başı + Koordinasyon", 6: "Koruma Ekibi - Ekip Personeli + Koordinasyon", 7: "Koruma Ekibi - Ekip Personeli", 8: "Kurtarma Ekibi - Ekip Başı", 9: "Kurtarma Ekibi - Ekip Personeli", 10: "Destek Elemanı" };
    const temsilciliste = { 0: "Görevli Değil", 1: "Çalışan Temsilcisi", 2: "Çalışan Baş Temsilcisi" };
    const riskliste = { 0: "Görevli Değil", 1: "Destek Elemanı", 2: "Çalışan Temsilcisi", 3: "Bilgi Sahibi Çalışan" };
    let acildurumekibi=data.filter(p=>p.a!==0).sort((a,b)=>a.a-b.a).map(p=>[p.x,p.y,acilliste[p.a]||"Bilinmiyor"]);
    let temsilciekibi=data.filter(p=>p.t!==0).sort((a,b)=>a.t-b.t).map(p=>[p.x,p.y,temsilciliste[p.t]||"Bilinmiyor"]);
    let riskanaliziekibi=data.filter(p=>p.r!==0).sort((a,b)=>a.r-b.r).map(p=>[p.x,p.y,riskliste[p.r]||"Bilinmiyor"]);
    riskanaliziekibi.unshift([isveren,isverenunvanioku(),isverenunvanioku()],[uzmanad,uzmanno,"İş Güvenliği Uzmanı"],[hekimad,hekimno,"İşyeri Hekimi"]);
    function generateTable(title, headers, rows)
    {
        return [
            { text: title, style: 'sectionTitle', margin: [0, 5, 0, 5] },
            {
                table:
                {
                    headerRows: 1,
                    widths: ['30%', '30%', '40%'],
                    body:
                    [
                        headers.map(h => ({ text: h, style: 'tableHeader' })),
                        ...rows.map(row => row.map(cell => ({ text: cell, style: 'tableCell' })))
                    ]
                },
                layout: 'lightGrid'
            }
        ];
    }
    let docDefinition =
    {
        pageOrientation: 'portrait',
        pageMargins: [20, 20, 20, 20],
        content:
        [
            ...generateTable("ACİL DURUM EKİP GÖREVLENDİRMESİ", ["Ad Soyad", "Unvan", "Acil Durum Ekip Görevi"], acildurumekibi),
            ...generateTable("ÇALIŞAN TEMSİLCİSİ GÖREVLENDİRMESİ", ["Ad Soyad", "Unvan", "Temsilci Görevi"], temsilciekibi),
            ...generateTable("RİSK DEĞERLENDİRME EKİBİ", ["Ad Soyad", "Unvan / Belge No", "Risk Değerlendirme Görevi"], riskanaliziekibi)
        ],
        styles:
        {
            mainTitle: { fontSize: 12, bold: true, alignment: 'center', margin: [0, 0, 0, 10] },
            sectionTitle: { fontSize: 11, bold: true, alignment: 'center' },
            tableHeader: { fillColor: '#545454', color: 'white', bold: true, fontSize: 10, alignment: 'center' },
            tableCell: { fontSize: 10, margin: [1, 1, 1, 1] }
        },
        defaultStyle: { font: 'Roboto' }
    };
    pdfMake.createPdf(docDefinition).download('Çalışan Raporu.pdf');
}

function acildurumtatbikattarih(tarih){if(!tarih)return"";const[g,a,y]=tarih.split(".").map(Number);if(!g||!a||!y)return"";const d=new Date(y+1,a-1,g),p=n=>n.toString().padStart(2,"0");return`${p(d.getDate())}.${p(d.getMonth()+1)}.${d.getFullYear()}`}
function yesilbaslik(cell) { cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF4F81BD' } }; cell.font = { color: { argb: 'FFFFFFFF' }, bold: true, size: 11, name: 'Calibri' }; cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };}
function adsoyadexcelrapor(cell) { cell.font = { size: 11, name: 'Calibri' }; cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }; cell.alignment = { vertical: 'middle', horizontal: 'left', wrapText: true };}
function tarihexcelrapor(cell) { cell.font = { size: 11, name: 'Calibri' }; cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }; cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };}
function gribaslik(cell) { cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE5E7E9' } }; cell.font = { color: { argb: 'FF000000' }, bold: true, size: 11, name: 'Calibri' }; cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };}
function ortala(cell) { cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };}
function isgegitimgecerlilik(tarih,tehlike){if(!tarih)return"";const[gun,ay,yil]=tarih.split(".").map(Number);if(!gun||!ay||!yil)return"";let ekYil=0;switch(tehlike){case 1:ekYil=3;break;case 2:ekYil=2;break;case 3:ekYil=1;break;default:return""}const g=new Date(yil+ekYil,ay-1,gun),p=n=>n.toString().padStart(2,"0");return`${p(g.getDate())}.${p(g.getMonth()+1)}.${g.getFullYear()}`}
function saglikgecerlilik(t,d){if(!t)return"";const[g,a,y]=t.split(".").map(Number);if(!g||!a||!y)return"";let e=0;switch(d){case 1:e=5;break;case 2:e=3;break;case 3:e=1;break;default:return""}const n=new Date(y+e,a-1,g),p=n=>n.toString().padStart(2,"0");return`${p(n.getDate())}.${p(n.getMonth()+1)}.${n.getFullYear()}`}
function ilkyardimgecerlilik(t){if(!t)return"";const[g,a,y]=t.split(".").map(Number);if(!g||!a||!y)return"";const e=new Date(y+3,a-1,g),p=n=>n.toString().padStart(2,"0");return`${p(e.getDate())}.${p(e.getMonth()+1)}.${e.getFullYear()}`}
function riskdegerlendirmegecerlilik(tarih,tehlike){if(!tarih)return"";const[g,a,y]=tarih.split(".").map(Number);if(!g||!a||!y)return"";let e=0;switch(tehlike){case 1:e=6;break;case 2:e=4;break;case 3:e=2;break;default:return""}const d=new Date(y+e,a-1,g),p=n=>n.toString().padStart(2,"0");return`${p(d.getDate())}.${p(d.getMonth()+1)}.${d.getFullYear()}`}
function isekipmanigecerlilik(tarih){if(!tarih)return"";const[g,a,y]=tarih.split(".").map(Number);if(!g||!a||!y)return"";const d=new Date(y+1,a-1,g),p=n=>n.toString().padStart(2,"0");return`${p(d.getDate())}.${p(d.getMonth()+1)}.${d.getFullYear()}`}
