////SERTİFİKA/////

function temelisgyenisertifikakontrol()
{
    $('#loading').show();
    $.when(temelisgyenisertifikayaz())
    .done(function ()
    {
        alertify.error("Dosya indirildi", 7);
    })
    .fail(function ()
    {
        alertify.error("Bir hata oluştu.", 7);
    })
    .always(function ()
    {
        $('#loading').hide();
    });
}

async function temelisgyenisertifikayaz()
{
    var uzmanad = store.get("uzmanad");
    var uzmanno = store.get("uzmanno");
    var uzmankurum = store.get("uzmankurum");
    var isgegitimveri = jsoncevir(store.get('isgegitimveri')) || {};
    var isyeri = jsoncevir(store.get('xjsonfirma')) || {};
    var hekimad = isyeri.hk;
    var hekimno = isyeri.hn;
    var calisanliste = jsoncevir(store.get('calisansecim'));
    if (!Array.isArray(calisanliste) || calisanliste.length === 0)
    {
        calisanliste = [{ a: "", u: "" }];
    }    
    var isyeriismi = isyeri.fi || '';
    var isverenvekili = isyeri.is || '';
    var egitimyeri = isgegitimveri.egitimyeri || "Örgün";
    var egitimtur = isgegitimveri.tekrar || "İlk Defa Verilen Temel Eğitim";   
    var belgetarihRaw = isgegitimveri.belgetarih;
    var belgetarih = /^\d{2}\.\d{2}\.\d{4}$/.test(belgetarihRaw) ? belgetarihRaw.replace(/\./g, "/") : (belgetarihRaw || "....../....../20.....");
    var katilimtarih = sertifikatarihbulma(isgegitimveri);
    var saatdagilim = egitimsaatdagitim(isgegitimveri);
    var onsayfa = calisanliste.map(function (calisan, index)
    {
        var calisanAdi = String(calisan && calisan.a ? calisan.a : '').trim() || '..................................................';
        var calisanUnvani = String(calisan && calisan.u ? calisan.u : '').trim() || '..................................................';
        var content =
        [
            { text: 'TEMEL EĞİTİM BELGESİ', style: 'ustbaslik', margin: [0, 50, 0, 30] },
            { text: '\u200B\t\t\t\t\t\t\t\tİşbu belge,', style: 'normalsatir', margin: [0, 0, 0, 5]},
            { text: '\u200B\t\t\t\t\t\t\t\t' + calisanAdi + '/' + calisanUnvani + ' adına', style: 'normalsatir', margin: [0, 0, 0, 10]},
            { text: '\u200B\t\t\tÇalışanların İş Sağlığı ve Güvenliği Eğitimlerinin Usul ve Esasları Hakkında Yönetmelik kapsamında ' + uzmanad + ' İş Güvenliği Uzmanı - ' + hekimad + ' İşyeri Hekimi ' + uzmankurum + ' Ortak Sağlık ve Güvenlik Birimi tarafından ' + katilimtarih + ' tarihinde gerçekleştirilen temel eğitim sonunda düzenlenmiştir.', style: 'normalsatir', margin: [55,0,55,10]},
            { text: '\u200B\t\t\t\t\t\t\t\tÇalışanın İşyerinin Ünvanı: ' + isyeriismi, style: 'normalsatir', margin: [0, 0, 0, 5] },            
            { text: '\u200B\t\t\t\t\t\t\t\tBelge Düzenlenme Tarihi: ' + belgetarih, style: 'normalsatir', margin: [0, 0, 0, 5]},            
            { text: '\u200B\t\t\t\t\t\t\t\tEğitimin Süresi: ' + saatdagilim, style: 'normalsatir', margin: [0, 0, 0, 5] },
            { text: '\u200B\t\t\t\t\t\t\t\tEğitimin Türü: ' + egitimtur, style: 'normalsatir', margin: [0, 0, 0, 5] },           
            { text: '\u200B\t\t\t\t\t\t\t\tEğitimin Şekli: ' + egitimyeri, style: 'normalsatir', margin: [0, 0, 0, 150] },
            temelisgsertifikaimza(uzmanad, isverenvekili, hekimad, uzmanno, hekimno, uzmankurum)
        ];
        if (index < calisanliste.length - 1)
        {
            content.push({ text: '', pageBreak: 'after' });
        }
        return content;
    }).flat();
    var ilksayfa =
    {
        pageOrientation: 'landscape',
        content: onsayfa,
        styles:
        {
            ustbaslik: { fontSize: 14, bold: true, alignment: "center" },
            normalsatir: { fontSize: 11, alignment: 'justify' }
        }
    };    
    var sertifikaSekli = Number(temelisgsertifikaayarbul());
    if (sertifikaSekli !== 2)
    {
        if (sertifikaSekli === 1)
        {
            sertifikakirmizi(ilksayfa);
        }
        else if (sertifikaSekli === 0)
        {
            sertifikalacivert(ilksayfa);
        }
        else
        {
            sertifikaarkaplan(ilksayfa);
        }
    }
    var arkaicerik = calisanliste.map(function (calisan, index)
    {
        return [ sertifikaarkakonutablo(isgegitimveri), { text: '', pageBreak: (index < calisanliste.length - 1) ? 'after' : undefined } ];
    }).flat();

    var ikincisayfa =
    {
        pageOrientation: 'portrait',
        content: arkaicerik,
        defaultStyle:
        {
            font: 'Roboto',
            fontSize: 11
        },
        pageMargins: [30, 30, 30, 30]
    };

    var PDFDocument = PDFLib.PDFDocument;
    const pdf1Buffer = await new Promise(resolve => pdfMake.createPdf(ilksayfa).getBuffer(resolve));
    const pdf2Buffer = await new Promise(resolve => pdfMake.createPdf(ikincisayfa).getBuffer(resolve));
    var pdf1Doc = await PDFDocument.load(pdf1Buffer);
    var pdf2Doc = await PDFDocument.load(pdf2Buffer);
    var mergedPdf = await PDFDocument.create();
    var pages1 = await mergedPdf.copyPages(pdf1Doc, pdf1Doc.getPageIndices());
    var pages2 = await mergedPdf.copyPages(pdf2Doc, pdf2Doc.getPageIndices());
    var maxLength = Math.max(pages1.length, pages2.length);

    for (var i = 0; i < maxLength; i++)
    {
        if (pages1[i]) { mergedPdf.addPage(pages1[i]); }
        if (pages2[i]) { mergedPdf.addPage(pages2[i]); }
    }

    var finalBytes = await mergedPdf.save();
    var blob = new Blob([finalBytes], { type: "application/pdf" });
    saveAs(blob, "Sertifika.pdf");
}

function sertifikaarkakonutablo(isgegitimveri)
{
    var turkceHarfler = ['a', 'b', 'c', 'ç', 'd', 'e', 'f', 'g', 'ğ', 'h', 'ı', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'ö', 'p', 'r', 's', 'ş', 't', 'u', 'ü', 'v', 'y', 'z'];
    var gruplar = temelisgkonubulma(isgegitimveri);
    var toplamkonusayisi = 0;
    gruplar.forEach(function (grup)
    {
        toplamkonusayisi += grup.konular.length;
    });
    var cellPadding = 2;
    if (toplamkonusayisi < 30)//29 Konu
    {
        cellPadding = 4;
    }
    else if (toplamkonusayisi < 32)//31 Konu
    {
        cellPadding = 3.5
    }
    else if (toplamkonusayisi < 34)//33 Konu
    {
        cellPadding = 3;
    }
    else if (toplamkonusayisi < 36)// 35Konu
    {
        cellPadding = 2.5;
    }
    var konuBody =
    [[
        { text: "EĞİTİM KONULARI", alignment: "center", bold: true, fontSize: 12 },
        { text: "SÜRE", alignment: "center", bold: true, fontSize: 12 }
    ]];
    gruplar.forEach(function (grup)
    {
        konuBody.push([
            { text: grup.baslik, alignment: "center", bold: true },
            { text: String(grup.toplamSaat) + " Saat", alignment: "center", bold: true }
        ]);

        grup.konular.forEach(function (konu, index)
        {
            var harf = turkceHarfler[index] || String(index + 1);

            konuBody.push([
                { text: harf + ") " + konu.konu, alignment: "left" },
                { text: konu.sure ? String(konu.sure) + " Dakika" : "", alignment: "center" }
            ]);
        });
    });

    konuBody.push([
        {
            text: 'Bu sertifika Çalışanların İş Sağlığı Ve Güvenliği Eğitimlerinin Usul Ve Esasları Hakkında Yönetmeliğine göre hazırlanmıştır. Madde-4 b) Ders saati: En az kırk beş dakikalık ders ve on beş dakikalık ara dinlenmeden oluşan zaman dilimini ifade eder.',
            colSpan: 2,
            alignment: "left",
            fontSize: 8
        },
        {}
    ]);

    if (konuBody.length === 1)
    {
        konuBody.push([
            { text: "", alignment: "left" },
            { text: "", alignment: "center" }
        ]);
    }

    return {
        table: {
            headerRows: 1,
            widths: ["85%", "15%"],
            body: konuBody
        },
        layout:
        {
            hLineWidth: function (i, t) { return i === 0 || i === t.table.body.length ? 1 : 0.5; },
            vLineWidth: function () { return 0.5; },
            hLineColor: function () { return "#aaa"; },
            vLineColor: function () { return "#aaa"; },
            paddingLeft: function () { return 5; },
            paddingRight: function () { return 5; },
            paddingTop: function () { return cellPadding; },
            paddingBottom: function () { return cellPadding; }
        }
    };
}

function temelisgsertifikaimza(a, b, c, d, e, f)
{
    return {
        table:
        {
            widths: [47, 207, 207, 207, 47],
            body:
            [
                ["", { text: a, alignment: "center", fontSize: 11, bold: true }, { text: b, alignment: "center", fontSize: 11, bold: true }, { text: c, alignment: "center", fontSize: 11, bold: true }, ""],
                ["", { text: "İş Güvenliği Uzmanı", alignment: "center", fontSize: 11 }, { text: isverenunvanioku(), alignment: "center", fontSize: 11 }, { text: "İşyeri Hekimi", alignment: "center", fontSize: 11 }, ""],
                ["", { text: "Belge No: " + d, alignment: "center", fontSize: 11 }, "", { text: "Belge No: " + e, alignment: "center", fontSize: 11 }, ""],
            ]
        },
        layout: "noBorders"
    };
}


function temelisgkonubulma(isgegitimveri)
{
    var baslikHaritasi =
    {
        1: 'GENEL KONULAR',
        2: 'SAĞLIK KONULARI',
        3: 'TEKNİK KONULAR',
        4: 'DİĞER KONULAR'
    };
    var gruplanan = {};
    var konuListesi = Array.isArray(isgegitimveri && isgegitimveri.temelisgsablonkonulari) ? isgegitimveri.temelisgsablonkonulari : [];
    var tehlikeSinifi = String(isgegitimveri && isgegitimveri.isyeri && isgegitimveri.isyeri.ts ? isgegitimveri.isyeri.ts : '').trim();
    konuListesi.forEach(function (item)
    {
        var tip = parseInt(item && item.t, 10);
        var konuAdi = temelisgkonumetni({ ...item, tehlikeSinifi: tehlikeSinifi });
        var konuSuresi = parseInt(item && item.s, 10) || 0;
        if (!konuAdi || ![1, 2, 3, 4].includes(tip)) { return; }
        if (!gruplanan[tip])
        {
            gruplanan[tip] = {
                g: parseInt(item && item.g, 10) || 1,
                konular: []
            };
        }
        if (!gruplanan[tip].konular.some(function (konu) { return konu.konu === konuAdi; }))
        {
            gruplanan[tip].konular.push({ konu: konuAdi, sure: konuSuresi });
        }
    });
    return [1, 2, 3, 4].map(function (tip)
    {
        var grupVeri = gruplanan[tip] || { g: 1, konular: [] };
        var konular = grupVeri.konular || [];
        var gunNo = parseInt(grupVeri.g, 10) || 1;
        var gunTarihi = temelisgtektarihgetir(isgegitimveri, gunNo);
        var tarihGecerliMi = /^\d{1,2}\/\d{1,2}\/\d{4}$/.test(gunTarihi);
        var toplamDakika = konular.reduce(function (toplam, konu)
        {
            return toplam + (parseInt(konu && konu.sure, 10) || 0);
        }, 0);
        return {
            tip: tip,
            g: gunNo,
            baslik: tarihGecerliMi ? baslikHaritasi[tip] + ' - ' + gunTarihi : baslikHaritasi[tip],
            konular: konular,
            toplamDakika: toplamDakika,
            toplamSaat: Math.ceil(toplamDakika / 45)
        };
    }).filter(function (grup)
    {
        return grup.konular.length > 0;
    });
}

function temelisgyeniSeciliCalisanlariOku()
{
    var calisanlistedata = store.get('calisansecim');
    var calisanliste = [];
    if (calisanlistedata)
    {
        try
        {
            calisanliste = JSON.parse(calisanlistedata);
        }
        catch
        {
            calisanliste = [];
        }
    }
    return (Array.isArray(calisanliste) ? calisanliste : []).map(function (item)
    {
        return {
            a: String(item && (item.a || item.x) ? (item.a || item.x) : '').trim(),
            u: String(item && (item.u || item.y) ? (item.u || item.y) : '').trim()
        };
    }).filter(function (item)
    {
        return item.a || item.u;
    });
}

function sertifikatarihbulma(veri)
{
    var a = temelisgtektarihgetir(veri, 1);
    var b = temelisgtektarihgetir(veri, 2);
    var c = temelisgtektarihgetir(veri, 3);
    var d = temelisgtektarihgetir(veri, 4);
    var g = parseInt(veri.toplamgun, 10) || 1;
    if (g === 2) { return a + ' - ' + b; }
    if (g === 3) { return a + ' - ' + b + ' - ' + c; }
    if (g === 4) { return a + ' - ' + b + ' - ' + c + ' - ' + d; }
    return a;
}

function temelisgtektarihgetir(veri, gunNo)
{
    var varsayilan = "......./......./20.....";
    var temizTarih = String(veri && veri['tarih' + gunNo] ? veri['tarih' + gunNo] : '').trim();
    if (!temizTarih)
    {
        return varsayilan;
    }
    return temizTarih.replace(/\./g, "/");
}

function egitimsaatdagitim(isgegitimveri)
{
    var saatler = temelisgyeniGunDagilimiHesapla(isgegitimveri).map(function (gun)
    {
        return parseInt(gun.saat, 10) || 0;
    }).filter(function (saat) { return saat > 0; });
    if (saatler.length === 0)
    {
        return '';
    }
    var dagilimMetni = saatler.map(function (saat) { return saat + ' Saat';}).join(' - ');
    var toplamSure = saatler.reduce(function (toplam, saat) { return toplam + saat; }, 0);
    return dagilimMetni + ' (Toplam: ' + toplamSure + ' Saat)';
}

function temelisgsertifikaayarbul()
{
    var settings = jsoncevir(store.get("settings"));
    if (!settings || typeof settings !== "object" || Array.isArray(settings)) { return "0"; }
    var egitim = Array.isArray(settings.e) && settings.e.length > 0 ? settings.e[0] : null;
    if (!egitim || typeof egitim !== "object") { return "0"; }
    return String(egitim.a ?? "0");
}

function temelisgkonumetni(item)
{
    if (!item || typeof item !== 'object')
    {
        return '';
    }
    if (item.konu)
    {
        return String(item.konu).trim();
    }

    var tehlikeSinifi = String(item.tehlikeSinifi || item.tehlike || '').trim();
    var tip = parseInt(item.t, 10);
    var konuId = parseInt(item.k, 10);
    var kaynak = temelisgYeniKonuKaynakListesi(tehlikeSinifi);
    var konu = kaynak.find(function (kayit)
    {
        return parseInt(kayit.tip, 10) === tip && parseInt(kayit.id, 10) === konuId;
    });

    return konu && konu.konu ? String(konu.konu).trim() : '';
}

function temelisgYeniKonuKaynakListesi(tehlikeSinifi)
{
    if (String(tehlikeSinifi) === '2') { return typeof temelisgtehlikeli !== 'undefined' && Array.isArray(temelisgtehlikeli) ? temelisgtehlikeli : []; }
    if (String(tehlikeSinifi) === '3') { return typeof temelisgcok !== 'undefined' && Array.isArray(temelisgcok) ? temelisgcok : []; }
    return typeof temelisgaz !== 'undefined' && Array.isArray(temelisgaz) ? temelisgaz : [];
}

/////KATILIM LİSTESİ//////

function temelisgyenikatilimlistesikontrol()
{
    $('#loading').show();
    $.when(temelisgyenikatilimlistesiyaz())
    .done(function ()
    {
        alertify.error("Dosya indirildi", 7);
    })
    .fail(function ()
    {
        alertify.error("Bir hata oluştu.", 7);
    })
    .always(function ()
    {
        $('#loading').hide();
    });
}

function temelisgyeniKatilimListeAyriOku()
{
    var settings = jsoncevir(store.get("settings"));
    if (!settings || typeof settings !== "object" || Array.isArray(settings)) { return "0"; }
    var egitim = Array.isArray(settings.e) && settings.e.length > 0 ? settings.e[0] : null;
    if (!egitim || typeof egitim !== "object") { return "0"; }
    return String(egitim.e ?? "0");
}

function temelisgyeniKatilimKonuMetniOlustur(isgegitimveri, gunVeri)
{
    var gunKonulari = Array.isArray(gunVeri && gunVeri.konular) ? gunVeri.konular : [];
    if (gunKonulari.length > 0)
    {
        return gunKonulari.map(function (konu)
        {
            return konu.konu;
        }).join(', ');
    }

    var gruplar = temelisgkonubulma(isgegitimveri);
    var tipler = Array.isArray(gunVeri && gunVeri.tipler) ? gunVeri.tipler : [];
    var seciliGruplar = gruplar.filter(function (grup)
    {
        return tipler.includes(grup.tip);
    });

    return seciliGruplar.flatMap(function (grup)
    {
        return grup.konular.map(function (konu)
        {
            return konu.konu;
        });
    }).join(', ');
}

function temelisgyeniKatilimUstBilgi(i, t, e, s, k)
{
    return [
        [{ text: 'TEMEL İŞ SAĞLIĞI ve GÜVENLİĞİ EĞİTİMİ - EĞİTİM KATILIM TUTANAĞI', colSpan: 4, alignment: 'center', fontSize: 11, bold: true, margin: [2, 2] }, '', '', ''],
        [{ text: 'İşyeri Unvanı: ' + i, colSpan: 4, alignment: 'left', fontSize: 10, margin: [2, 2] }, '', '', ''],
        [{ colSpan: 4, alignment: 'left', fontSize: 10, margin: [2, 2], text: [{ text: 'Eğitim Tarihi: ' + t + '\t\t\t\tEğitimin Düzenlendiği Yer: ' + e + '\t\t\t\tSüresi: ' + s }] }, '', '', ''],
        [{ text: 'EĞİTİM KONULARI', colSpan: 4, alignment: 'center', fontSize: 11, bold: true, margin: [2, 2] }, '', '', ''],
        [{ text: k || '', colSpan: 4, alignment: 'justify', fontSize: 10, margin: [2, 5] }, '', '', ''],
        [{ text: 'Sıra', alignment: 'center', fontSize: 10, margin: [1, 1], bold: true }, { text: 'Ad Soyad', alignment: 'center', fontSize: 10, margin: [1, 1], bold: true }, { text: 'Unvan', alignment: 'center', fontSize: 10, margin: [1, 1], bold: true }, { text: 'İmza', alignment: 'center', fontSize: 10, margin: [1, 1], bold: true }]
    ];
}

function temelisgyenikatilimlistesiyaz()
{
    var uzmanad = store.get("uzmanad");
    var uzmanno = store.get("uzmanno");
    var isgegitimveri = jsoncevir(store.get('isgegitimveri')) || {};
    var isyeri = jsoncevir(store.get('xjsonfirma')) || {};
    var hekimad = isyeri.hk || '';
    var hekimno = isyeri.hn || '';
    var bossatir = parseInt(isgegitimveri.bossatir, 10) || 0;
    var calisanliste = temelisgyeniSeciliCalisanlariOku();
    var seciliCalisanlar = Array.isArray(calisanliste) ? calisanliste.slice() : [];
    var ayriKatilimListesi = temelisgyeniKatilimListeAyriOku() === "1" && seciliCalisanlar.length > 0;
    if (bossatir > 0)
    {
        calisanliste = calisanliste.concat(Array.from({ length: bossatir }, function ()
        {
            return { a: "", u: "" };
        }));
    }
    if (bossatir === 0 && (!Array.isArray(calisanliste) || calisanliste.length === 0))
    {
        calisanliste = Array.from({ length: 12 }, function ()
        {
            return { a: "", u: "" };
        });
    }

    var isyeriismi = isyeri.fi || '';
    var egitimyeri = isgegitimveri.egitimyeri || "Yüz Yüze";
    if(egitimyeri === "Yüz Yüze")
    {
        egitimyeri = "İşyeri";
    }
    var toplamgun = Math.max(1, Math.min(4, parseInt(isgegitimveri.toplamgun, 10) || 1));
    var tarihler = [
        temelisgtektarihgetir(isgegitimveri, 1),
        temelisgtektarihgetir(isgegitimveri, 2),
        temelisgtektarihgetir(isgegitimveri, 3),
        temelisgtektarihgetir(isgegitimveri, 4)
    ];
    var gunDagilimi = temelisgyeniGunDagilimiHesapla(isgegitimveri);
    var katilimlistesi = { pageMargins: [25, 25, 25, 25], content: [] };

    function createParticipantTable(katilimCalisanlari, gunNo, baslangicNo)
    {
        var gunVeri = gunDagilimi[gunNo - 1] || { tipler: [], saat: 0 };
        var sure = gunVeri.saat > 0 ? String(gunVeri.saat) + ' Saat' : '';
        var konu = temelisgyeniKatilimKonuMetniOlustur(isgegitimveri, gunVeri);
        var tableBody = [];

        tableBody.push.apply(tableBody, temelisgyeniKatilimUstBilgi(isyeriismi, tarihler[gunNo - 1], egitimyeri, sure, konu));
        for (var i = 0; i < katilimCalisanlari.length; i++)
        {
            var calisan = katilimCalisanlari[i];
            tableBody.push([
                { text: String(baslangicNo + i), alignment: 'center', fontSize: 10, margin: [0, 11, 0, 11] },
                { text: calisan.a || '', alignment: 'left', fontSize: 10, margin: [0, 11, 0, 11] },
                { text: calisan.u || '', alignment: 'left', fontSize: 10, margin: [0, 11, 0, 11] },
                { text: '' }
            ]);
        }
        tableBody.push(
            [
                { text: uzmanad, alignment: 'center', fontSize: 10, bold: true, colSpan: 2, margin: [0, 0] },
                { text: '' },
                { text: hekimad, alignment: 'center', fontSize: 10, bold: true, colSpan: 2, margin: [0, 0] },
                { text: '' }
            ],
            [
                { text: 'İş Güvenliği Uzmanı - Belge No: ' + uzmanno, alignment: 'center', fontSize: 10, colSpan: 2, margin: [0, 0] },
                { text: '' },
                { text: 'İşyeri Hekimi - Belge No: ' + hekimno, alignment: 'center', fontSize: 10, colSpan: 2, margin: [0, 0] },
                { text: '' }
            ],
            [
                { text: '', colSpan: 2, margin: [25, 25] },
                { text: '' },
                { text: '', colSpan: 2, margin: [25, 25] },
                { text: '' }
            ]
        );

        return {
            table: {
                widths: [25, "*", "auto", 100],
                body: tableBody
            }
        };
    }

    if (ayriKatilimListesi)
    {
        for (var j = 0; j < seciliCalisanlar.length; j++)
        {
            var tekKatilimciListesi = [seciliCalisanlar[j]].concat(Array.from({ length: bossatir }, function ()
            {
                return { a: "", u: "" };
            }));
            for (var gun = 1; gun <= toplamgun; gun++)
            {
                katilimlistesi.content.push(createParticipantTable(tekKatilimciListesi, gun, 1));
                if (gun < toplamgun || j < seciliCalisanlar.length - 1)
                {
                    katilimlistesi.content.push({ text: '', pageBreak: 'after' });
                }
            }
        }
    }
    else
    {
        var chunkSize = 12;
        for (var gunNo = 1; gunNo <= toplamgun; gunNo++)
        {
            for (var baslangic = 0; baslangic < calisanliste.length; baslangic += chunkSize)
            {
                var endIndex = Math.min(baslangic + chunkSize, calisanliste.length);
                katilimlistesi.content.push(createParticipantTable(calisanliste.slice(baslangic, endIndex), gunNo, baslangic + 1));
                if (endIndex < calisanliste.length)
                {
                    katilimlistesi.content.push({ text: '', pageBreak: 'after' });
                }
            }
            if (gunNo < toplamgun)
            {
                katilimlistesi.content.push({ text: '', pageBreak: 'after' });
            }
        }
    }

    pdfMake.createPdf(katilimlistesi).getBlob(function (blob)
    {
        saveAs(blob, 'Katılım Listesi.pdf');
    });
}

function temelisgyeniGunDagilimiHesapla(isgegitimveri)
{
    var veri = isgegitimveri || jsoncevir(store.get('isgegitimveri')) || {};
    var toplamgun = Math.max(1, Math.min(4, parseInt(veri.toplamgun, 10) || 4));
    var gruplar = temelisgkonubulma(veri);
    var gunler = new Array(toplamgun).fill(null).map(function (_, index)
    {
        return { gun: index + 1, tipler: [], saat: 0, konular: [] };
    });

    gruplar.forEach(function (grup)
    {
        var gunNo = Math.max(1, Math.min(toplamgun, parseInt(grup && grup.g, 10) || 1));
        var hedefGun = gunler[gunNo - 1];
        hedefGun.tipler.push(grup.tip);
        hedefGun.saat += grup.toplamSaat || 0;
        hedefGun.konular = hedefGun.konular.concat(grup.konular || []);
    });

    return gunler;
}

///////SINAV//////

function temelisgYeniSablonAnahtari(item, index, kaynakListe)
{
    var id = String(item && item.id ? item.id : '').trim();
    var kaynakIndex = Array.isArray(kaynakListe) ? kaynakListe.indexOf(item) : -1;
    return id || ('__index_' + String(kaynakIndex >= 0 ? kaynakIndex : index));
}

async function temelisgyeniSinavCiktiKontrol()
{
    $('#loading').show();
    try
    {
        await temelsinavsorusu();
        alertify.error("Dosya indirildi", 7);
    }
    catch (err)
    {
        console.error("temelisgyeni sınav çıktı hata", err);
        alertify.error("Sınav dosyası oluşturulamadı.", 7);
    }
    finally
    {
        $('#loading').hide();
    }
}

async function temelsinavsorusu()
{
    var isgegitimveri = jsoncevir(store.get('isgegitimveri')) || {};
    var sinavSablon = temelisgyeniSeciliSinavSablonOku(isgegitimveri);
    var sinavSecim = temelisgyeniSayiDizisi(sinavSablon && sinavSablon.sinav);
    var yeterlilikSecim = temelisgyeniSayiDizisi(sinavSablon && sinavSablon.seviye);

    if (sinavSecim.length === 0 || yeterlilikSecim.length === 0)
    {
        throw new Error("Sınav şablonu içinde soru seçimi bulunamadı.");
    }

    var sinavverisi = await temelisgyeniSinavSoruVerisiOku();
    var sinavSorular = Array.isArray(sinavverisi.sinav) ? sinavverisi.sinav : [];
    var seviyeSorular = Array.isArray(sinavverisi.seviye) ? sinavverisi.seviye : [];
    var calisanlar = temelisgyeniSeciliCalisanlariOku();

    if (!Array.isArray(calisanlar) || calisanlar.length === 0)
    {
        calisanlar = [{ a: "", u: "" }];
    }

    await temelisgyeniSinavVeSeviyeYazdir(
        calisanlar,
        temelisgyeniSinavTarihiOku(isgegitimveri),
        temelisgyeniSinavImzaAlaniOku(),
        sinavSorular,
        sinavSecim,
        store.get("uzmanad") || "",
        seviyeSorular,
        yeterlilikSecim
    );
}

function temelisgyeniSeciliSinavSablonOku(isgegitimveri)
{
    if (isgegitimveri && isgegitimveri.sinavsablonveri)
    {
        return isgegitimveri.sinavsablonveri;
    }

    var sablonId = String((isgegitimveri && isgegitimveri.sinavid) || store.get('temelisgyenisinavsablonid') || '').trim();
    var liste = jsoncevir(store.get('sinavsablonliste'));
    if (!Array.isArray(liste) || !sablonId)
    {
        return null;
    }

    return liste.find(function (item, index)
    {
        return temelisgYeniSablonAnahtari(item, index, liste) === sablonId;
    }) || null;
}

function temelisgyeniSayiDizisi(dizi)
{
    return (Array.isArray(dizi) ? dizi : []).map(function (deger)
    {
        return Number(deger);
    }).filter(function (deger)
    {
        return Number.isFinite(deger);
    });
}

async function temelisgyeniSinavSoruVerisiOku()
{
    var mevcut = store.get("sinavicerik");
    var mevcutJson = typeof mevcut === "string" ? jsoncevir(mevcut) : mevcut;
    if (mevcutJson && (Array.isArray(mevcutJson.sinav) || Array.isArray(mevcutJson.seviye)))
    {
        return mevcutJson;
    }
    var url = "https://cdn.jsdelivr.net/gh/MEHMETCERANX12/isgevrak@main/json/sinav1_4.json";
    var veri = await $.getJSON(url);
    store.set("sinavicerik", veri);
    return veri || {};
}

function temelisgyeniSinavTarihiOku(isgegitimveri)
{
    var tarih = temelisgtektarihgetir(isgegitimveri, 1);
    return tarih === "......./......./20....." ? "....../....../20....." : tarih;
}

function temelisgyeniSinavImzaAlaniOku()
{
    var settings = jsoncevir(store.get("settings"));
    if (!settings || typeof settings !== "object" || Array.isArray(settings)) { return false; }
    var egitim = Array.isArray(settings.e) && settings.e.length > 0 ? settings.e[0] : null;
    if (!egitim || typeof egitim !== "object") { return false; }
    return String(egitim.b ?? "0") === "1";
}

function temelisgyeniSinavVeSeviyeYazdir(calisanjson, tarih, sinavimzaalani, sinavsorular, sinavsecim, uzmanad, seviyesorular, yeterliliksecim)
{
    var calisanlar = Array.isArray(calisanjson) ? calisanjson : [calisanjson];
    var icerik = [];

    calisanlar.forEach(function (calisan, calisanIndex)
    {
        icerik.push.apply(icerik, temelisgyeniYeterlilikIcerigiOlustur([calisan], seviyesorular, yeterliliksecim, calisanIndex > 0));
        icerik.push.apply(icerik, temelisgyeniSinavIcerigiOlustur([calisan], tarih, sinavimzaalani, sinavsorular, sinavsecim, uzmanad, true));
    });

    var docDefinition =
    {
        pageSize: "A4",
        pageMargins: [30, 20, 30, 20],
        defaultStyle:
        {
            font: "Roboto",
            fontSize: 10,
            lineHeight: 1
        },
        content: icerik
    };

    return new Promise(function (resolve)
    {
        pdfMake.createPdf(docDefinition).getBlob(function (blob)
        {
            saveAs(blob, "İSG Seviye Tespit ve Sınav.pdf");
            resolve();
        });
    });
}

function temelisgyeniYeterlilikIcerigiOlustur(calisanjson, seviyesorular, yeterliliksecim, ilkSayfadanOnceKes)
{
    var kenarlikRengi = "#333333";
    var tabloSutunlari = ["12%", "46%", "12%", "30%"];
    var calisanlar = Array.isArray(calisanjson) ? calisanjson : [calisanjson];
    var icerik = [];

    function baslikSatiriOlustur()
    {
        return [
            { text: "İSG EĞİTİM ÖNCESİ BİREYSEL SEVİYE TESPİT FORMU", colSpan: 4, alignment: "center", bold: true, fontSize: 11, margin: [0, 0, 0, 0] },
            {},
            {},
            {}
        ];
    }

    function imzaHucreleriOlustur(calisan)
    {
        return [
            [
                { text: "Ad Soyad", bold: true, margin: [0, 2, 0, 2], fontSize: 10 },
                { text: calisan.a || "", margin: [0, 2, 0, 2], fontSize: 10 },
                { text: "İmza", bold: true, alignment: "center", rowSpan: 3, margin: [0, 20, 0, 0], fontSize: 10 },
                { text: "", rowSpan: 3, margin: [0, 2, 0, 2], fontSize: 10 }
            ],
            [
                { text: "Görevi", bold: true, margin: [0, 2, 0, 2], fontSize: 10 },
                { text: calisan.u || "", margin: [0, 2, 0, 2], fontSize: 10 },
                { text: "" },
                { text: "" }
            ],
            [
                { text: "Tarih", bold: true, margin: [0, 2, 0, 2], fontSize: 10 },
                { text: "", margin: [0, 2, 0, 2], fontSize: 10 },
                { text: "" },
                { text: "" }
            ]
        ];
    }

    function baslikTablosuOlustur(calisan, calisanIndex)
    {
        return {
            pageBreak: (ilkSayfadanOnceKes && calisanIndex === 0) || calisanIndex > 0 ? "before" : undefined,
            table:
            {
                widths: tabloSutunlari,
                body:
                [
                    baslikSatiriOlustur()
                ].concat(imzaHucreleriOlustur(calisan))
            },
            layout:
            {
                hLineColor: function () { return kenarlikRengi; },
                vLineColor: function () { return kenarlikRengi; },
                hLineWidth: function () { return 0.7; },
                vLineWidth: function () { return 0.7; }
            },
            margin: [0, 0, 0, 8]
        };
    }

    function bosKutu()
    {
        return { canvas: [{ type: "rect", x: 0, y: 0, w: 8, h: 8, lineWidth: 0.7, lineColor: "black" }], margin: [0, 1, 0, 0] };
    }

    var secilenSorular = (Array.isArray(seviyesorular) ? seviyesorular : []).filter(function (soru)
    {
        return yeterliliksecim.includes(Number(soru.id));
    });

    calisanlar.forEach(function (calisan, calisanIndex)
    {
        icerik.push(baslikTablosuOlustur(calisan || {}, calisanIndex));

        secilenSorular.forEach(function (soru, index)
        {
            var soruSatirlari = [{ text: (index + 1) + ". " + (soru.s || ""), bold: true, margin: [0, 5, 0, 5] }];
            var secenekler = Array.isArray(soru.c) ? soru.c : [];

            secenekler.forEach(function (secenek)
            {
                var secenekMetni = typeof secenek === "string" ? secenek : (secenek.x || "");
                soruSatirlari.push(
                {
                    columns:
                    [
                        { width: 14, canvas: bosKutu().canvas, margin: [0, 1, 0, 0] },
                        { width: "*", text: secenekMetni }
                    ],
                    margin: [0, 0, 0, 3]
                });
            });

            icerik.push({ stack: soruSatirlari, unbreakable: true, margin: [0, 0, 0, 0] });
        });
    });

    return icerik;
}

function temelisgyeniSinavIcerigiOlustur(calisanjson, tarih, sinavimzaalani, sorular, sinavsecim, uzmanad, ilkSayfadanOnceKes)
{
    var secenekHarfleri = ["a", "b", "c"];
    var kenarlikRengi = "#333333";
    var ortakHucre = { margin: [5, 6, 5, 6], fontSize: 10 };
    var tabloSutunlari = sinavimzaalani ? ["12%", "46%", "12%", "30%"] : ["12%", "88%"];
    var calisanlar = Array.isArray(calisanjson) ? calisanjson : [calisanjson];
    var icerik = [];

    function baslikSatiriOlustur()
    {
        return [
            { text: "EĞİTİM SONU ÖLÇME ve DEĞERLENDİRME SINAVI - " + tarih, colSpan: sinavimzaalani ? 4 : 2, alignment: "center", bold: true, fontSize: 11, margin: [0, 0, 0, 0] },
            {}
        ].concat(sinavimzaalani ? [{}, {}] : []);
    }

    function imzaHucreleriOlustur(calisan)
    {
        return sinavimzaalani ?
            [
                { text: "Ad Soyad", bold: true, margin: ortakHucre.margin, fontSize: ortakHucre.fontSize },
                { text: calisan.a || "", margin: ortakHucre.margin, fontSize: ortakHucre.fontSize },
                { text: "İmza", bold: true, alignment: "center", margin: ortakHucre.margin, fontSize: ortakHucre.fontSize },
                { text: "", margin: ortakHucre.margin, fontSize: ortakHucre.fontSize }
            ]
            :
            [
                { text: "Ad Soyad", bold: true, margin: ortakHucre.margin, fontSize: ortakHucre.fontSize },
                { text: calisan.a || "", margin: ortakHucre.margin, fontSize: ortakHucre.fontSize }
            ];
    }

    function baslikTablosuOlustur(calisan, calisanIndex)
    {
        return {
            pageBreak: (ilkSayfadanOnceKes && calisanIndex === 0) || calisanIndex > 0 ? "before" : undefined,
            table:
            {
                widths: tabloSutunlari,
                body:
                [
                    baslikSatiriOlustur(),
                    imzaHucreleriOlustur(calisan)
                ]
            },
            layout:
            {
                hLineColor: function () { return kenarlikRengi; },
                vLineColor: function () { return kenarlikRengi; },
                hLineWidth: function () { return 0.7; },
                vLineWidth: function () { return 0.7; }
            },
            margin: [0, 0, 0, 8]
        };
    }

    var secilenSorular = (Array.isArray(sorular) ? sorular : []).filter(function (soru)
    {
        return sinavsecim.includes(Number(soru.id));
    });

    function sorulariKaristir(soruListesi)
    {
        var karisikSorular = soruListesi.slice();
        for (var i = karisikSorular.length - 1; i > 0; i--)
        {
            var rastgeleIndex = Math.floor(Math.random() * (i + 1));
            var gecici = karisikSorular[i];
            karisikSorular[i] = karisikSorular[rastgeleIndex];
            karisikSorular[rastgeleIndex] = gecici;
        }
        return karisikSorular;
    }

    function cevapSirasiniAyarla(secenekler, soruIndex)
    {
        var siraliSecenekler = (Array.isArray(secenekler) ? secenekler : []).slice();
        var dogruCevapIndex = siraliSecenekler.findIndex(function (secenek)
        {
            return secenek && secenek.y === true;
        });

        if (dogruCevapIndex === -1)
        {
            return siraliSecenekler;
        }

        var hedefIndex = soruIndex % secenekHarfleri.length;
        var dogruCevap = siraliSecenekler.splice(dogruCevapIndex, 1)[0];
        siraliSecenekler.splice(hedefIndex, 0, dogruCevap);
        return siraliSecenekler;
    }

    function bosKutu()
    {
        return { canvas: [{ type: "rect", x: 0, y: 0, w: 8, h: 8, lineWidth: 0.7, lineColor: "black" }], margin: [0, 1, 0, 0] };
    }

    function puanTablosuOlustur()
    {
        return {
            margin: [0, 6, 0, 0],
            table:
            {
                widths: [10, 50, 10, 50, 10, 50, 10, 50, 10, 50, 10, 50, "*"],
                body:
                [
                    [
                        bosKutu(),
                        { text: "10 Puan", fontSize: 10 },
                        bosKutu(),
                        { text: "30 Puan", fontSize: 10 },
                        bosKutu(),
                        { text: "50 Puan", fontSize: 10 },
                        bosKutu(),
                        { text: "70 Puan", fontSize: 10 },
                        bosKutu(),
                        { text: "90 Puan", fontSize: 10 },
                        bosKutu(),
                        { text: "Başarılı", fontSize: 10 },
                        { text: uzmanad || "", bold: true, fontSize: 10, alignment: "center" }
                    ],
                    [
                        bosKutu(),
                        { text: "20 Puan", fontSize: 10 },
                        bosKutu(),
                        { text: "40 Puan", fontSize: 10 },
                        bosKutu(),
                        { text: "60 Puan", fontSize: 10 },
                        bosKutu(),
                        { text: "80 Puan", fontSize: 10 },
                        bosKutu(),
                        { text: "100 Puan", fontSize: 10 },
                        bosKutu(),
                        { text: "Başarısız", fontSize: 10 },
                        { text: "" }
                    ]
                ]
            },
            layout:
            {
                hLineWidth: function () { return 0; },
                vLineWidth: function () { return 0; },
                paddingLeft: function () { return 0; },
                paddingRight: function () { return 0; },
                paddingTop: function () { return 0; },
                paddingBottom: function () { return 8; }
            }
        };
    }

    calisanlar.forEach(function (calisan, calisanIndex)
    {
        var karisikSorular = sorulariKaristir(secilenSorular);
        icerik.push(baslikTablosuOlustur(calisan || {}, calisanIndex));

        karisikSorular.forEach(function (soru, index)
        {
            var soruSatirlari = [{ text: (index + 1) + ". " + (soru.s || ""), bold: true, margin: [0, 5, 0, 5] }];
            var secenekler = cevapSirasiniAyarla(soru.c || [], index);

            secenekler.forEach(function (secenek, secenekIndex)
            {
                soruSatirlari.push(
                {
                    text: secenekHarfleri[secenekIndex] + ") " + (secenek.x || ""),
                    margin: [0, 0, 0, 3]
                });
            });

            icerik.push({ stack: soruSatirlari, unbreakable: true, margin: [0, 0, 0, 0] });
        });

        icerik.push(
        {
            text: "Her soru 10 puan değerindedir. Sınavda başarılı sayılmak için en az 60 puan alınması gerekmektedir.",
            bold: true,
            margin: [0, 0, 0, 6]
        });
        icerik.push(puanTablosuOlustur());
    });

    return icerik;
}
