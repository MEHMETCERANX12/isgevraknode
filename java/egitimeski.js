function sayfaApiYolu(yol)
{
    const kok = window.location.pathname.replace(/\/$/, "");
    return kok + (String(yol).startsWith("/") ? yol : "/" + yol);
}

function temelisg1t1()
{
    alanguncellet3();
    temelisgayarkonulariniyuklet6();
    isyerigetir();
    $('#isyeri').off('change.temelisg').on('change.temelisg', function ()
    {
        const firmaid = String($(this).val() || '').trim();
        if (!firmaid) return;
        const firmalar = jsoncevir(store.get('firmajson'));
        const satir = firmalar.find(f => String(f.id) === firmaid);
        if (!satir) return;
        store.set('xjsonfirma', satir);
        store.set('xfirmaid', firmaid);
        durumguncellet2(firmaid, satir);
    });
    const seciliFirma = String(store.get('xfirmaid') || '').trim();
    if (seciliFirma)
    {
        $('#isyeri').val(seciliFirma).trigger('change');
    }
}

function temelisgayarkonulariniyuklet6()
{
    const settings = jsoncevir(store.get("settings"));
    if (!settings || typeof settings !== "object" || Array.isArray(settings)) return;

    const egitimAyari = Array.isArray(settings.e) && settings.e.length > 0 ? settings.e[0] : null;
    if (!egitimAyari || typeof egitimAyari !== "object") return;

    ["q", "w", "x", "y"].forEach(function (alanId)
    {
        if (!(alanId in egitimAyari)) return;
        const $alan = $("#" + alanId);
        if (!$alan.length) return;
        $alan.val(String(egitimAyari[alanId] ?? ""));
    });
}

function durumguncellet2(firmaid, isyeri)
{
    if (!isyeri) return;
    const saatMap = { '1': '8 Saat', '2': '12 Saat', '3': '16 Saat' };
    if (saatMap[isyeri.ts])
    {
        $('#saat').val(saatMap[isyeri.ts]);
    }
    alanguncellet3();
    for (let i = 1; i <= 12; i++)
    {
        $('#s' + i).prop('checked', false);
    }
    const ayar = jsoncevir(store.get('ayar'));
    const mevcut = ayar.find(obj => obj.id === firmaid);
    if (mevcut && mevcut.e)
    {
        for (let i = 0; i < mevcut.e.length && i < 12; i++)
        {
            $('#s' + (i + 1)).prop('checked', mevcut.e.charAt(i) === '1');
        }
    }
}

function alanguncellet3()
{
    const saat = $('#saat').val();
    const ikiGun = (saat === '12 Saat' || saat === '16 Saat');
    const hedefGun = ikiGun ? '2' : '1';
    if ($('#gundrop').length > 0)
    {
        $('#gundrop').val(hedefGun);
    }
    temelisggunalanlarinigoster();
}

function temel1devamt4()
{
    let firmaid = "";
    if ($('#isyeri').length > 0)
    {
        firmaid = firmasecimoku();
        if (!firmaid) return;
    }
    else
    {
        firmaid = String(store.get('xfirmaid') || '').trim();
        if (!firmaid)
        {
            alertify.error("Lütfen bir işyeri seçiniz", 7);
            return;
        }
    }
    let isgegitimkod = '';
    for (let i = 1; i <= 12; i++)
    {
        isgegitimkod += $('#s' + i).is(':checked') ? '1' : '0';
    }
    const jsonData =
    {
        toplamgun: $('#gundrop').val(),
        tarih1: $('#tarih1').val(),
        tarih2: $('#tarih2').val(),
        tarih3: $('#tarih3').val(),
        tarih4: $('#tarih4').val(),
        saat: $('#saat').val(),
        egitimyeri: $('#egitimyeri').val(),
        sinav: $('#sinav').val(),
        bossatir: parseInt($("#bossatir").val()) || 0,
        sertifika: $('#sertifika').val(),
        isgegitimkod: isgegitimkod,
        q: String($('#q').val() || ''),
        w: String($('#w').val() || ''),
        x: String($('#x').val() || ''),
        z: String($('#z').val() || '')
    };
    let ayar = jsoncevir(store.get("ayar"));
    const mevcut = ayar.find(obj => obj.id === firmaid);
    if (mevcut)
    {
        mevcut.e = isgegitimkod;
    }
    else
    {
        ayar.push({ e: isgegitimkod, i: "", id: firmaid });
    }
    store.set('isgegitimveri', JSON.stringify(jsonData));
    store.set("isgegitimkayittarih", jsonData.tarih1);
    store.set("ayar", ayar);
    window.location.href = "/temelisg2?id=" + encodeURIComponent(firmaid);
}

function temel2devamt5()
{
    try
    {
        if (store.get("isgegitimkayittarih") === null || store.get("ayar") === null || store.get("isgegitimkayittarih") === null)
        {
            alertify.error("Doküman sayfasına dönüp tekrar deneyiniz");
            return false;
        }
        let ayar = jsoncevir(store.get("ayar"));
        $('#HiddenField2').val(JSON.stringify(ayar));
        let calisansecim = dokumancalisansecim();
        var egitimtarihi = store.get("isgegitimkayittarih");
        var jsonData = $('#HiddenField1').val();
        var calisanjson = JSON.parse(jsonData);
        calisansecim.forEach(function (secili)
        {
            calisanjson.forEach(function (item)
            {
                if (item.x === secili.a && item.y === secili.u)
                {
                    item.e = egitimtarihi;
                }
            });
        });
        $('#HiddenField1').val(JSON.stringify(calisanjson));
        store.set("dosyaciktitipi", "1");
        return true;
    }
    catch
    {
        alertify.error("Doküman sayfasına dönüp tekrar deneyiniz");
        return false;
    }
}

function temelisg2sayfayukle()
{
    const calisanlar = Array.isArray(window.__temelisgCalisan) ? window.__temelisgCalisan : [];
    $('#HiddenField1').val(JSON.stringify(calisanlar));
    dokumancalisanload();
}

function temelisg2tamam()
{
    if (!temel2devamt5())
    {
        return false;
    }
    const firmaid = String(new URLSearchParams(window.location.search).get("id") || "").trim();
    if (!/^[a-z0-9]{10}$/.test(firmaid))
    {
        mesajmetin("Geçersiz işyeri seçimi.");
        return false;
    }
    const ayar = jsoncevir($('#HiddenField2').val());
    const calisan = jsoncevir($('#HiddenField1').val());
    $.ajax({
        url: sayfaApiYolu("/api/temelisg2guncelle/") + encodeURIComponent(firmaid),
        type: "PUT",
        contentType: "application/json",
        data: JSON.stringify({ ayar: ayar, calisan: calisan }),
        success: function ()
        {
            window.location.href = "/dosyacikti";
        },
        error: function ()
        {
            mesaj('9');
        }
    });
    return false;
}

function isgegitimsertifikakontrol()
{
    $('#loading').show();
    $.when(isgegitimsertifikayaz())
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

async function isgegitimsertifikayaz()
{
    let uzmanad = store.get("uzmanad");
    let uzmanno = store.get("uzmanno");
    let uzmankurum = store.get("uzmankurum");
    if (uzmankurum)
    {
        uzmankurum = "Eğitimi Veren Kurumun Unvanı: " + uzmankurum;
    }
    let isgegitimveri = store.get('isgegitimveri');
    isgegitimveri = JSON.parse(isgegitimveri || '{}');
    let isyeri = jsoncevir(store.get('xjsonfirma')) || {};
    let hekimad = isyeri.hk;
    let hekimno = isyeri.hn;
    let calisanlistedata = store.get('calisansecimjsonx');
    let calisanliste = [];
    if (calisanlistedata)
    {
        try
        {
            calisanliste = JSON.parse(calisanlistedata);
        }
        catch (e)
        {
            calisanliste = [];
        }
    }
    if (!Array.isArray(calisanliste) || calisanliste.length === 0)
    {
        calisanliste = [{ a: "", u: "" }];
    }
    let isyeriismi = isyeri.fi;
    let isverenvekili = isyeri.is;
    let toplamgun = isgegitimveri.toplamgun || "1";
    let toplamsaat = isgegitimveri.saat || "1";
    let egitimyeri = isgegitimveri.egitimyeri || "Örgün";
    let katilimtarih = temeltarihbul(isgegitimveri);
    let sure1 = temelegitimsuregun("1", parseInt(toplamgun) || 1, toplamsaat);
    let sure2 = temelegitimsuregun("2", parseInt(toplamgun) || 1, toplamsaat);
    let sure3 = temelegitimsuregun("3", parseInt(toplamgun) || 1, toplamsaat);
    let sure4 = temelegitimsuregun("4", parseInt(toplamgun) || 1, toplamsaat);
    let sertifikasaat = temelsertifikasaat(sure1, sure2, sure3, sure4, parseInt(toplamgun));
    let isgegitimkod = isgegitimveri.isgegitimkod || "000000000000";
    const ekKonular = temelisgekstrakonularigetir(isgegitimveri);
    const onsayfa = calisanliste.map((calisan, index) =>
    {
        const content = [
            { text: 'İŞ SAĞLIĞI ve GÜVENLİĞİ', style: 'ustbaslik', margin: [0, 50, 0, 10] },
            { text: 'EK-2 TEMEL EĞİTİM BELGESİ', style: 'ustbaslik', margin: [0, 0, 0, 20] },
            { text: 'İşyeri Unvanı: ' + isyeriismi, style: 'normalsatir', margin: [90, 0, 0, 5] },
            { text: 'Katılımcı Adı Soyadı: ' + calisan.a, style: 'normalsatir', margin: [90, 0, 0, 5] },
            { text: 'Katılımcının Görev Unvanı: ' + calisan.u, style: 'normalsatir', margin: [90, 0, 0, 5] },
            { text: 'Tarih: ' + katilimtarih, style: 'normalsatir', margin: [90, 0, 0, 5] },
            { text: 'Eğitim Süresi: ' + sertifikasaat, style: 'normalsatir', margin: [90, 0, 0, 5] },
            { text: 'Eğitim Şekli: ' + egitimyeri, style: 'normalsatir', margin: [90, 0, 0, 5] },
            { text: 'Yukarıda adı ve soyadı yazılı çalışan, Çalışanların  İş  Sağlığı  ve  Güvenliği  Eğitimlerinin  Usul  ve  Esasları  Hakkında  Yönetmelik', style: 'normalsatir', margin: [90, 0, 50, 5] },
            { text: 'kapsamında verilen iş sağlığı ve güvenliği eğitimlerini başarıyla tamamlayarak bu eğitim belgesini almaya hak kazanmıştır.', style: 'normalsatir', margin: [50, 0, 0, 165] },
            temelimzatablo(uzmanad, isverenvekili, hekimad, uzmanno, hekimno, uzmankurum)
        ];
        if (index < calisanliste.length - 1)
        {
            content.push({ text: '', pageBreak: 'after' });
        }
    return content;
    }).flat();

    const ilksayfa = {
        pageOrientation: 'landscape',
        content: onsayfa,
        styles:
        {
            ustbaslik: { fontSize: 14, bold: true, alignment: "center" },
            normalsatir: { fontSize: 11, alignment: 'justify' },
        }
    };
    const sertifikaSekli = Number(temelisgsertifikaseklioku());
    if(sertifikaSekli !== 2)
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
    const arkaicerik = calisanliste.map((calisan, index) => {
        return [
            temelisgkonutablo(isgegitimkod, ekKonular),
            { text: '', pageBreak: (index < calisanliste.length - 1) ? 'after' : undefined }
        ];
    }).flat();
    const ikincisayfa =
    {
        pageOrientation: 'portrait',
        content: arkaicerik,
        defaultStyle:
        {
            font: 'Roboto',
            fontSize: 11
        },
        pageMargins: [30, 30, 30, 30],
    };
    const { PDFDocument } = PDFLib;
    const pdf1Buffer = await temelpdfolusturma(ilksayfa);
    const pdf2Buffer = await temelpdfolusturma(ikincisayfa);
    const pdf1Doc = await PDFDocument.load(pdf1Buffer);
    const pdf2Doc = await PDFDocument.load(pdf2Buffer);
    const mergedPdf = await PDFDocument.create();
    const pages1 = await mergedPdf.copyPages(pdf1Doc, pdf1Doc.getPageIndices());
    const pages2 = await mergedPdf.copyPages(pdf2Doc, pdf2Doc.getPageIndices());
    const maxLength = Math.max(pages1.length, pages2.length);
    for (let i = 0; i < maxLength; i++)
    {
        if (pages1[i]) mergedPdf.addPage(pages1[i]);
        if (pages2[i]) mergedPdf.addPage(pages2[i]);
    }
    const finalBytes = await mergedPdf.save();
    const blob = new Blob([finalBytes], { type: "application/pdf" });
    saveAs(blob, "Sertifika.pdf");
}

function temelkatılımlistesikontrol()
{
    $('#loading').show();
    $.when(temelkatılımlistesiyaz())
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

function temelkatılımlistesiyaz()
{
    let uzmanad = store.get("uzmanad");
    let uzmanno = store.get("uzmanno");
    let isgegitimveri = store.get('isgegitimveri');
    isgegitimveri = JSON.parse(isgegitimveri || '{}');
    let isyeri = jsoncevir(store.get('xjsonfirma')) || {};
    let hekimad = isyeri.hk;
    let hekimno = isyeri.hn;
    let bossatir = isgegitimveri.bossatir;
    let calisanlistedata = store.get('calisansecimjsonx');
    let calisanliste = [];
    if (calisanlistedata)
    {
        try
        {
            calisanliste = jsoncevir(calisanlistedata);
        }
        catch (e) {
            calisanliste = [];
        }
    }
    const seciliCalisanlar = Array.isArray(calisanliste) ? [...calisanliste] : [];
    const ayriKatilimListesi = temelisgkatilimlisteayrioku() === "1" && seciliCalisanlar.length > 0;
    if (bossatir > 0)
    {
        calisanliste = calisanliste.concat(Array.from({ length: bossatir }, () => ({ a: "", u: "" })));
    }
    if(bossatir === 0 && (!Array.isArray(calisanliste) || calisanliste.length === 0))
    {
        calisanliste = Array.from({ length: 12 }, () => ({ a: "", u: "" }));
    }
    let isyeriismi = isyeri.fi;
    let toplamsaat = isgegitimveri.saat || "1";
    let egitimyeri = isgegitimveri.egitimyeri || "İşyeri";
    let isgegitimkod = isgegitimveri.isgegitimkod || "000000000000";
    const ekKonular = temelisgekstrakonularigetir(isgegitimveri);
    let toplamgun = isgegitimveri.toplamgun || "1";
    let sure1 = temelegitimsuregun("1", parseInt(toplamgun) || 1, toplamsaat);
    let sure2 = temelegitimsuregun("2", parseInt(toplamgun) || 1, toplamsaat);
    let sure3 = temelegitimsuregun("3", parseInt(toplamgun) || 1, toplamsaat);
    let sure4 = temelegitimsuregun("4", parseInt(toplamgun) || 1, toplamsaat);
    let tarih1 = isgegitimveri.tarih1 || "......./......./20....";
    let tarih2 = isgegitimveri.tarih2 || "......./......./20....";
    let tarih3 = isgegitimveri.tarih3 || "......./......./20....";
    let tarih4 = isgegitimveri.tarih4 || "......./......./20....";
    let konugun1 = katılımkonugun(1, parseInt(toplamgun) || 1, isgegitimkod, ekKonular);
    let konugun2 = katılımkonugun(2, parseInt(toplamgun) || 1, isgegitimkod, ekKonular);
    let konugun3 = katılımkonugun(3, parseInt(toplamgun) || 1, isgegitimkod, ekKonular);
    let konugun4 = katılımkonugun(4, parseInt(toplamgun) || 1, isgegitimkod, ekKonular);
    const katilimlistesi = { pageMargins: [25, 25, 25, 25], content: []};
    function createParticipantTable(katilimCalisanlari, gunNo, baslangicNo)
    {
        let tableBody = []; 
        let tarih, konu, sure;
        switch(gunNo) {
            case 1:
                tarih = tarih1;
                konu = konugun1;
                sure = sure1;
                break;
            case 2:
                tarih = tarih2;
                konu = konugun2;
                sure = sure2;
                break;
            case 3:
                tarih = tarih3;
                konu = konugun3;
                sure = sure3;
                break;
            case 4:
                tarih = tarih4;
                konu = konugun4;
                sure = sure4;
                break;
            default:
                tarih = tarih1;
                konu = konugun1;
                sure = sure1;
    }
    tableBody.push(...katilimustbilgi(isyeriismi, tarih, egitimyeri, sure, konu));
    for (let i = 0; i < katilimCalisanlari.length; i++) {
        const calisan = katilimCalisanlari[i];
        tableBody.push([
            { text: (baslangicNo + i).toString(), alignment: 'center', fontSize: 10, margin: [0, 11, 0, 11]},
            { text: calisan.a || '', alignment: 'left', fontSize: 10, margin: [0, 11, 0, 11]},
            { text: calisan.u || '', alignment: 'left', fontSize: 10, margin: [0, 11, 0, 11]},
            { text: ''}
        ]);
    }
    tableBody.push(
        [
            { text: uzmanad, alignment: 'center', fontSize: 10, bold: true, colSpan: 2, margin: [0, 0] },
            { text: ''},
            { text: hekimad, alignment: 'center', fontSize: 10, bold: true, colSpan: 2, margin: [0, 0] },
            { text: ''},
        ],
        [
            { text: 'İş Güvenliği Uzmanı - Belge No: ' + uzmanno, alignment: 'center', fontSize: 10, colSpan: 2, margin: [0, 0] },
            { text: '' },
            { text: 'İşyeri Hekimi - Belge No: ' + hekimno, alignment: 'center', fontSize: 10, colSpan: 2, margin: [0, 0] },
            { text: ''},
        ],
        [
            { text: '', colSpan: 2, margin: [25, 25] },
            { text: '' },
            { text: '', colSpan: 2, margin: [25, 25] },
            { text: ''},
        ]
    );    
    return {
        table: {
            widths: [25, "*", "auto", 100],
            body: tableBody
        },
    };
    }
    const chunkSize = 12;
    if (ayriKatilimListesi)
    {
        for (let i = 0; i < seciliCalisanlar.length; i++) {
            const tekKatilimciListesi = [seciliCalisanlar[i]].concat(Array.from({ length: bossatir }, () => ({ a: "", u: "" })));
            for (let gun = 1; gun <= parseInt(toplamgun); gun++) {
                katilimlistesi.content.push(createParticipantTable(tekKatilimciListesi, gun, 1));
                if (gun < parseInt(toplamgun) || i < seciliCalisanlar.length - 1) {
                    katilimlistesi.content.push({ text: '', pageBreak: 'after' });
                }
            }
        }
    }
    else
    {
        for (let gun = 1; gun <= parseInt(toplamgun); gun++) {
            for (let i = 0; i < calisanliste.length; i += chunkSize) {
                const endIndex = Math.min(i + chunkSize, calisanliste.length);
                katilimlistesi.content.push(createParticipantTable(calisanliste.slice(i, endIndex), gun, i + 1));
                if (endIndex < calisanliste.length) {
                    katilimlistesi.content.push({ text: '', pageBreak: 'after' });
                }
            }
            if (gun < parseInt(toplamgun)) {
                katilimlistesi.content.push({ text: '', pageBreak: 'after' });
            }
        }
    }
    pdfMake.createPdf(katilimlistesi).getBlob(function(blob) {
        saveAs(blob, 'Katılım Listesi.pdf');
    });
}

function katılımkonugun(hangigun, toplamgun, isgegitimkod, ekKonular)
{
    let veri = "", json = { egitimkonusu: ["Çalışma mevzuatı ile ilgili bilgiler", "Çalışanların yasal hak ve sorumlulukları", "İşyeri temizliği ve düzeni", "İş kazası ve meslek hastalığından doğan hukuki sonuçlar", "Meslek hastalıklarının sebepleri", "Hastalıktan korunma prensipleri ve korunma tekniklerinin uygulanması", "Biyolojik ve psikososyal risk etmenleri", "İlkyardım", "Tütün ürünlerinin zararları ve pasif etkilenim", "Kimyasal, fiziksel ve ergonomik risk etmenleri", "Elle kaldırma ve taşıma", "Parlama, patlama, yangın ve yangından korunma", "İş ekipmanlarının güvenli kullanımı", "Ekranlı araçlarla çalışma", "Elektrik tehlikeleri, riskleri ve önlemleri", "Güvenlik ve sağlık işaretleri", "İş kazalarının sebepleri ve korunma prensipleri ile tekniklerinin uygulanması", "Kişisel koruyucu donanım kullanımı", "İş sağlığı ve güvenliği genel kuralları ve güvenlik kültürü", "Tahliye ve kurtarma"] };
    const tumEkKonular = Array.isArray(ekKonular) && ekKonular.length > 0 ? ekKonular : temelisgekstrakonularigetir({});
    if (hangigun > toplamgun) return veri;
    for (let i = 0; i < isgegitimkod.length && i < tumEkKonular.length; i++)
    {
        const konu = String(tumEkKonular[i] || '').trim();
        if (isgegitimkod[i] === '1' && konu) json.egitimkonusu.push(konu);
    }
    let son = json.egitimkonusu.length, basla = 9, parca = (son - basla) / (toplamgun - 1), startIndex = hangigun === 1 ? 0 : basla + (parca * (hangigun - 2)), endIndex = hangigun === 1 ? basla : startIndex + parca;
    return veri = toplamgun === 1 ? json.egitimkonusu.join(", ") : json.egitimkonusu.slice(startIndex, endIndex).join(", ");
}

function katilimustbilgi(i, t, e, s, k)
{
    return [
        [{ text: 'TEMEL İŞ SAĞLIĞI ve GÜVENLİĞİ EĞİTİMİ - EĞİTİM KATILIM TUTANAĞI', colSpan: 4, alignment: 'center', fontSize: 11, bold: true, margin: [2, 2] }, '', '', ''],
        [{ text: `İşyeri Unvanı: ${i}`, colSpan: 4, alignment: 'left', fontSize: 10, margin: [2, 2] }, '', '', ''],
        [{ colSpan: 4, alignment: 'left', fontSize: 10, margin: [2, 2], text: [{ text: `Eğitim Tarihi: ${t}\t\t\t\tEğitim Şekli: ${e}\t\t\t\tSüresi: ${s}` }] }, '', '', ''],
        [{ text: 'EĞİTİM KONULARI', colSpan: 4, alignment: 'center', fontSize: 11, bold: true, margin: [2, 2] }, '', '', ''],
        [{ text: k, colSpan: 4, alignment: 'justify', fontSize: 10, margin: [0, 5] }, '', '', ''],
        [{ text: 'Sıra', alignment: 'center', fontSize: 10, margin: [1, 1], bold: true }, { text: 'Ad Soyad', alignment: 'center', fontSize: 10, margin: [1, 1], bold: true }, { text: 'Unvan', alignment: 'center', fontSize: 10, margin: [1, 1], bold: true }, { text: 'İmza', alignment: 'center', fontSize: 10, margin: [1, 1], bold: true }]
    ];
}

async function temelsinavsorusu()
{
    let calisanlistedata = store.get('calisansecimjsonx');
    let calisanliste = [];
    const sinavAdSoyadGoster = temelisgsinavadsoyadgoster() === "0";
    if (calisanlistedata)
    {
        try
        {
            calisanliste = jsoncevir(calisanlistedata);
        }
        catch
        {
            calisanliste = [];
        }
    }
    if (!sinavAdSoyadGoster)
    {
        calisanliste = [];
    }
    if (!Array.isArray(calisanliste) || calisanliste.length === 0) {
        calisanliste = Array.from({ length: 1 }, () => ({ a: ""}));
    }
    const { Document, Packer, Paragraph, TextRun, AlignmentType, Table, TableRow, TableCell, WidthType, VerticalAlign, HeightRule } = docx;
    const sinavImzaAlani = temelisgsinavimzaalanioku() === "1";
    const sinavBasliklari = temelisgsinavbasliklarioku();
    let sinavjson = {"yuksektecalisma":[{"soru":"Yüksekten çalışma sırasında aşağıda belirtilen hangi güvenlik önlemi doğrudur?","dogru":"Yüksekte çalışırken mutlaka emniyet kemeri takılmalı ve güvenli bir noktaya bağlanmalıdır.","yanlis1":"Yüksekte çalışırken yalnızca dengeye dikkat etmek yeterlidir, ek bir güvenlik ekipmanına gerek yoktur.","yanlis2":"Yüksekte çalışırken hızlı hareket ederek işi bir an önce tamamlamak en güvenli yöntemdir.","yanlis3":"Yüksekte çalışma sırasında rüzgarlı hava koşulları varsa, çalışmaya devam edilir."},{"soru":"Yüksekte yapılan çalışmalara ilişkin aşağıda verilen bilgilerden hangisi doğrudur?","dogru":"Yüksekte çalışırken paraşüt tipi emniyet kemeri takmamıza gerekir.","yanlis1":"Yağmurlu, karlı ve rüzgarlı havalarda yüksekte çalışmak güvenlidir.","yanlis2":"Yüksekte çalışırken yukarıdan aşağıya malzeme atabiliriz.","yanlis3":"Yüksekte çalışırken, yüksekten düşmemizi engelleyen korkulukları istediğimiz zaman çıkarabiliriz."},{"soru":"Yapı/İnşaat işlerine ilişkin aşağıda verilen bilgilerden hangisi yanlıştır?","dogru":"Yapı alanına işi olmayan kişilerin girişi engellenmelidir.","yanlis1":"Sahada dolaşırken baret takmaya ve iş ayakkabısı giymeye gerek yoktur.","yanlis2":"Kazı alanının etrafı çevrilmeli ve uyarı levhaları konulmalıdır.","yanlis3":"İskelede çalışırken, uzanmak veya başka bir sebepten ötürü dışarıya uzanmamalıyız."}],"bakim":[{"soru":"Bakım onarım işleri ile ilgili aşağıda verilen bilgilerden hangisi yanlıştır?","dogru":"Bakım/onarım konusunda mesleki yeterliliğe sahip olan çalışanlar bu işi yapabilir.","yanlis1":"Bakım/onarım işinin yapıldığı alana meraklı olan kişiler girebilir ve işe yardımcı olabilir.","yanlis2":"Bakım/onarım işlemi sırasında ekipmanın acil stop butonuna basılmalı ve elektrik bağlantısı sökülmelidir.","yanlis3":"Bakım/onarım işlemi sırasında 'Dikkat Bakım Var' levhası asılmalıdır."}],"elektrik":[{"soru":"Elektrik ile ilgili aşağıda verilen güvenlik tedbirlerinden hangisi yanlıştır?","dogru":"Hasar görmüş veya kesilmiş elektrik kablosunu bantlayarak kullanmaya devam edebiliriz.","yanlis1":"Her türlü elektrikli ekipmana müdahale etmeden önce elektriği kesmemiz gerekir.","yanlis2":"Elektrik kesilmiş olsa dahi elektrik kesilip kesilmediği kontrol etmeden işe başlamamalıyız.","yanlis3":"Elektrik sistemlerinde topraklama, olası bir elektrik kaçağını toprağa verilmesini sağlayan güvenlik sistemidir."}],"isekipmani":[{"soru":"Aşağıda belirtilen iş ekipmanlarının kullanımına ilişkin bilgilerden hangisi yanlıştır?","dogru":"İş ekipmanları sadece tasarım ve imalat amacına uygun işler için kullanılmalıdır.","yanlis1":"İş ekipmanının arıza yapması halinde kimseye haber veremeden hemen müdahale edip onarmalıyız.","yanlis2":"El aletleri ile çalışmaya başlamadan önce kırık, çatlak veya yıpranma olup olmadığını kontrol etmeliyiz.","yanlis3":"İş ekipmanlarının üstünde yer alan uyarı ve ikazlara dikkat etmeliyiz ve buna göre çalışmalıyız."},{"soru":"Bir iş ekipmanını kullanırken aşağıdaki hareketlerden hangisinin yapılması yanlıştır?","dogru":"İş ekipmanı çok yıpranmış veya bozulmuş ise kullanılmamalıdır.","yanlis1":"İş ekipmanın koruyucu kapak ve donanımları işi yavaşlatıyorsa çıkartılabilir.","yanlis2":"İş ekipmanın kullanımı konusunda yeterli bilgiye sahip değilsek kullanamamalıyız.","yanlis3":"Tehlikeli bir durum oluştuğunda acil stop butonuna basılmalıdır."}],"tekniksoru":[{"soru":"Ergonomik risk etmenleri ile ilgili aşağıdaki bilgilerden hangisi yanlıştır?","dogru":"Bir yükü birden daha fazla kişi ile taşımak, tek olarak taşımaktan daha güvenlidir.","yanlis1":"Bir yükü kaldırma aracı ile değil öncelikle elle taşımalıyız.","yanlis2":"Uzun süreli oturmak, egzersiz yapmamak vücut kaslarımızın zayıflamasına sebep olur.","yanlis3":"Bir yükü elle taşırken yükü vücudumuza yakın tutmalıyız."},{"soru":"Acil durum çağrı merkezi telefon numarası aşağıdakilerinden hangisidir?","dogru":"112","yanlis1":"111","yanlis2":"110","yanlis3":"109"},{"soru":"İşyerinde çalışma alanı düzenine ilişkin aşağıdaki bilgilerden hangisi doğrudur?","dogru":"Düzenli çalışma alanı, iş kazalarını azaltır, verimliliği artırır ve çalışanların motivasyonunu olumlu etkiler.","yanlis1":"Düzenli bir çalışma alanı, yalnızca estetik görünüm sağlar.","yanlis2":"Çalışma zemininde bulunan kablolar herhangi bir tehlike oluşturmaz.","yanlis3":"Çalışma zemini ıslak veya kaygan vaziyette iken çalışmaya devam edilebilir."},{"soru":"Çalışma ortamında karşılaşabileceğiniz tehlikeli kimyasal maddelerle ilgili hangi önlem en doğru yaklaşımdır?","dogru":"Çalışmadan önce malzeme güvenlik bilgi formunu okunmalı ve uygun kişisel koruyucu donanım kullanılmalıdır.","yanlis1":"Kimyasal maddelere çıplak elle, eldiven takmadan temas etmekte sakınca yoktur.","yanlis2":"Kimyasal maddeler, havalandırılmayan veya kapalı bir ortamda güvenli şekilde kullanılabilir.","yanlis3":"Kimyasal maddeleri karıştırıp birleştirmek tehlikeli değildir."},{"soru":"Aşağıdakilerden hangisi kimyasal maddelerle güvenli çalışmanın temel kurallarındandır?","dogru":"Kimyasal maddeler uygun şekilde etiketlenmeli ve kapalı ortamlarda saklanmalıdır.","yanlis1":"Kimyasal maddeler çalışma alanında açık ve ulaşılabilir şekilde bırakılmalıdır.","yanlis2":"Kimyasallarla çalışırken eldiven, maske gibi koruyucuların kullanılması gerekli değildir.","yanlis3":"Kimyasal maddeler yiyeceklerle aynı dolapta saklanabilir, bu herhangi bir risk oluşturmaz."},{"soru":"Aşağıda fiziksel risk etmenleri ile verilen bilgilerden hangisi doğrudur?","dogru":"Yüksek ve uzun süreli gürültüye maruziyet işitme kaybına neden olabilir.","yanlis1":"Kimyasal madde buharlarının solunması risk oluşturmaz.","yanlis2":"Tozlu çalışma ortamında maske kullanmak zorunlu değildir.","yanlis3":"Ortam sıcaklığı, çalışma performansını etkilemez."},{"soru":"Elle kaldırma ve taşıma işlemlerinde aşağıdakilerden hangisi doğru bir uygulamadır?","dogru":"Yük, dizlerden destek alınarak ve bel düz tutulacak şekilde kaldırılmalıdır.","yanlis1":"Yük mümkün olduğunca uzaktan kavranmalı ve hızlıca kaldırılmalıdır.","yanlis2":"Yük taşırken ani dönme ve eğilme hareketleri yapılmalıdır.","yanlis3":"Ağır yükler tek başına ve aniden kaldırılmalıdır."},{"soru":"Aşağıdakilerden hangisi yangın riskini azaltmaya yönelik doğru bir uygulamadır?","dogru":"Yanıcı maddeler uygun kaplarda saklanmalı ve ateş kaynaklarından uzak tutulmalıdır.","yanlis1":"Yanıcı maddeler açıkta ve kontrolsüz şekilde depolanabilir.","yanlis2":"Elektrik kablolarının zarar görmesi yangın riski oluşturmaz.","yanlis3":"Yangın söndürme ekipmanlarının bakımına gerek yoktur."},{"soru":"Acil bir durumda yapılması uygun olmayan davranış aşağıdakilerden hangisidir? (yangın, deprem vb.)","dogru":"Acil durumda asansör kullanılarak tahliye yapılmasında sakınca yoktur.","yanlis1":"Acil çıkış işaretlerini takip ederek tahliye olmalıyız.","yanlis2":"Acil durum yolları ve çıkışları her zaman açık tutulmalı ve önüne bir malzeme koymamalıyız.","yanlis3":"Acil durum anında paniğe kapılmamalı ve soğukkanlılığımızı korumalıyız."},{"soru":"Aşağıdakilerden hangisi elektrikle çalışmalarda güvenliği sağlamaya yönelik doğru bir uygulamadır?","dogru":"Elektrik panoları kilitli olmalı ve yetkisiz kişilerin erişimi engellenmelidir.","yanlis1":"Elektrik kabloları açıkta ve suya yakın yerlerde bırakılabilir.","yanlis2":"Elektrik arızalarını herkesin müdahale edebilmesi için pano kapağı açık bırakılmalıdır.","yanlis3":"Islak ellerle elektrikli aletleri kullanmak güvenlik açısından sorun oluşturmaz."},{"soru":"Kişisel koruyucu donanımlarla ile ilgili aşağıdaki ifadelerden hangisi doğrudur?","dogru":"Kişisel koruyucu donanımlar, çalışanı tehlikeye karşı korumak amacıyla kullanılan ekipmanlardır.","yanlis1":"Yıpranmış veya bozulmuşta olsa kişisel koruyucu donanımı kullanmalıyız.","yanlis2":"Kişisel koruyucu donanımlar tehlikeleri ortadan kaldırdığı için başka hiçbir önleme gerek yoktur.","yanlis3":"Kişisel koruyucu donanımlar beden ölçülerimize uygun olmasada kullanılması sakınca yaratmaz."}],"genelsoru":[{"soru":"İş sağlığı ve güvenliğinin amacı aşağıdakilerden hangisi değildir?","dogru":"Mal ve hizmetin çok daha hızlı bir şekilde üretilmesini sağlamak.","yanlis1":"Çalışma ortamında bulunan tehlikeleri en aza indirmek.","yanlis2":"Çalışanların işin yürütümü sırasında meydana gelebilecek tehlikelerden korumak.","yanlis3":"İş kazası ve meslek hastalıklarını en aza indirmek."},{"soru":"İş sağlığı ve güvenliği kültürü ile ilgili aşağıdaki bilgilerden hangisi yanlıştır?","dogru":"İş sağlığı ve güvenliği kültüründe öncelik güvenlik değil işin bir an önce yapılmasıdır.","yanlis1":"İş sağlığı ve güvenliği eğitiminin bir amacı da iş güvenliği kültürünün gelişmesidir.","yanlis2":"İş sağlığı ve güvenliği kültürünün gelişmesinde devlet, işveren ve çalışanların rolü önemlidir.","yanlis3":"İş sağlığı ve güvenliği kültürünün gelişimi ile iş kazası ve meslek hastalıkları sayıca azalacaktır."},{"soru":"Çalışanların iş sağlığı ve güvenliği açısından yükümlülüğüne ilişkin aşağıdakilerden hangisi yanlıştır?","dogru":"Ciddi ve yakın hayati bir tehlike olsa dahi çalışmaya devam etmekle yükümlüdür.","yanlis1":"Her türlü iş ekipmanını amacına uygun ve güvenlik donanımlarıyla kullanmakla yükümlüdür.","yanlis2":"İş sağlığı ve güvenliği eğitimine ve güvenlik talimatlarına uygun şekilde çalışmakla yükümlüdür.","yanlis3":"Diğer çalışma arkadaşlarının sağlığını ve güvenliğini tehlikeye düşürmemekle yükümlüdür."},{"soru":"Yaralanmalı bir iş kazası meydana geldiğinde aşağıdaki davranışlardan hangisi yanlıştır?","dogru":"Hafif yaralanmalı bir kazaysa kimseye haber verilmemeli, aynı şekilde çalışmaya devam edilmelidir.","yanlis1":"İşveren vekiline yaralanmalı kaza ile ilgili derhal haber verilmelidir.","yanlis2":"Ağır yaralanmalı bir kaza ise derhal 112 acil durum çağrı merkezine haber verilmelidir.","yanlis3":"Yaralanan çalışana ilkyardım ekibi derhal ilk müdahaleyi yapmalıdır."},{"soru":"Aşağıdakilerden hangisi işyerinde temizlik ve düzenin sağlanmasının olumlu etkilerinden biridir?","dogru":"İş kazası risklerini azaltır ve çalışma verimliliğini artırır.","yanlis1":"Sadece işyerinin estetik görünmesini sağlar, iş güvenliği ile ilgisi yoktur.","yanlis2":"Çalışanların dikkatini dağıtır, iş verimini düşürür.","yanlis3":"Temizlik ve düzen, yöneticilerin sorumluluğunda olup çalışanları ilgilendirmez"},{"soru":"Aşağıdakilerden hangisi işyeri temizliği ve düzeniyle ilgili doğru bir uygulamadır?","dogru":"Çalışma bittikten sonra kullanılan ekipmanlar yerlerine kaldırılmalı ve alan temizlenmelidir.","yanlis1":"Çalışma alanında dökülen sıvılar kendi kendine kurur, hemen temizlemeye gerek yoktur.","yanlis2":"Temizlik işleri sadece temizlik çalışanın sorumluluğundadır, diğer çalışanların katkı sağlamasına gerek yoktur.","yanlis3":"Zemin üzerinde bulunan kabloların düzenlenmesine veya kaldırılmasına gerek yoktur."},{"soru":"Çalışma mevzuatı ile ilgili aşağıdaki bilgilerden hangisi doğrudur?","dogru":"Türkiye'de çalışma hayatını düzenleyen temel yasa 4857 sayılı İş Kanunudur.","yanlis1":"Haftalık çalışma süresi 60 saattir.","yanlis2":"Çalışanın genel sağlık durumu, işe uygun olup olmaması önemli değildir.","yanlis3":"Yeterli dinlenme sürelerinin iş sağlığı ve güvenliğiyle bir ilgisi yoktur."},{"soru":"İşveren ve çalışanların sorumlulukları ile ilgili aşağıdakilerden hangisi doğrudur?","dogru":"İşveren tarafından çalışana sağlanan kişisel koruyucu donanımı doğru kullanmak çalışanın sorumluluğudur.","yanlis1":"İşveren, iş kazası ve meslek hastalığı durumunda hiçbir sorumluluğu yoktur. ","yanlis2":"Çalışanlar, işveren tarafından verilen eğitim ve talimatlar doğrultusunda hareket etmek zorunda değildir.","yanlis3":"Sağlık ve güvenlik yönünden ciddi ve yakın bir tehlikeli durumu işverene bildirmek gerekli değildir."},{"soru":"Meslek hastalıklarına ilişkin aşağıdaki bilgilerden hangisi doğrudur?","dogru":"Çalışma ortamındaki tehlikelerin ortadan kaldırılması meslek hastalığının oluşmasını engeller.","yanlis1":"Tozlu veya gürültülü ortamlarda uzun süreli çalışmak meslek hastalığına sebep olmaz.","yanlis2":"Meslek hastalıkları bir anda oluşur ve basit ilaçlarla hemen tedavi edilir.","yanlis3":"Kişisel koruyucu donanım kullanımı meslek hastalıklarını önlemede etkisizdir."},{"soru":"Aşağıdaki işyerlerinden hangisi psikososyal risk etmeni açısından daha tehlikelidir?","dogru":"Uzun süre stres ve baskı altında çalışılan işyerleri.","yanlis1":"Yüksek gürültü seviyesinde çalışılan işyerleri.","yanlis2":"Tozlu ve kirli ortamları bulunan işyerleri.","yanlis3":"Yoğun kimyasal kullanılan işyerleri."},{"soru":"İlkyardımın amacı aşağıdakilerden hangisidir?","dogru":"Hasta veya yaralının durumunun kötüleşmesini önlemek ve hayati tehlikeyi azaltmak.","yanlis1":"Ambulans gelene kadar hastayı bir yerden bir yere taşımak.","yanlis2":"Kazazedeye ilaç vermek ve tedavi etmek.","yanlis3":"Kazaya uğrayan çalışanı görmezden gelip olay yerinden uzaklaşmak."}]};
    let sinavicerigi = [];
calisanliste.forEach((calisan, i) => {
const usttablo1 = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
        new TableRow({
            height: { value: 500, rule: HeightRule.EXACT },
            children: [
                new TableCell({
                    children: [new Paragraph({ children: [new TextRun({ text: sinavBasliklari[0], font: "Calibri", size: 22, bold: true })], alignment: AlignmentType.CENTER })],
                    columnSpan: sinavImzaAlani ? 4 : 2,
                    verticalAlign: VerticalAlign.CENTER
                })
            ]
        }),
        new TableRow({
            height: { value: 400, rule: HeightRule.EXACT },
            children: sinavImzaAlani
                ? [
                    new TableCell({ width: { size: 12, type: WidthType.PERCENTAGE }, children: [new Paragraph({ indent: { left: 70, right: 70 }, children: [new TextRun({ text: "Ad Soyad", font: "Calibri", size: 22, bold: true })], alignment: AlignmentType.LEFT })], verticalAlign: VerticalAlign.CENTER }),
                    new TableCell({ width: { size: 46, type: WidthType.PERCENTAGE }, children: [new Paragraph({ indent: { left: 70, right: 70 }, children: [new TextRun({ text: calisan.a || "", font: "Calibri", size: 22 })], alignment: AlignmentType.LEFT })], verticalAlign: VerticalAlign.CENTER }),
                    new TableCell({ width: { size: 12, type: WidthType.PERCENTAGE }, children: [new Paragraph({ children: [new TextRun({ text: "İmza", font: "Calibri", size: 22, bold: true })], alignment: AlignmentType.CENTER })], verticalAlign: VerticalAlign.CENTER }),
                    new TableCell({ width: { size: 30, type: WidthType.PERCENTAGE }, children: [new Paragraph({ children: [new TextRun({ text: "", font: "Calibri", size: 22 })], alignment: AlignmentType.LEFT })], verticalAlign: VerticalAlign.CENTER })
                ]
                : [
                    new TableCell({ width: { size: 12, type: WidthType.PERCENTAGE }, children: [new Paragraph({ indent: { left: 70, right: 70 }, children: [new TextRun({ text: "Ad Soyad", font: "Calibri", size: 22, bold: true })], alignment: AlignmentType.LEFT })], verticalAlign: VerticalAlign.CENTER }),
                    new TableCell({ width: { size: 88, type: WidthType.PERCENTAGE }, children: [new Paragraph({ indent: { left: 70, right: 70 }, children: [new TextRun({ text: calisan.a || "", font: "Calibri", size: 22 })], alignment: AlignmentType.LEFT })], verticalAlign: VerticalAlign.CENTER })
                ]
        })
    ]
});
const usttablo2 = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
        new TableRow({
            height: { value: 500, rule: HeightRule.EXACT },
            children: [
                new TableCell({
                    children: [new Paragraph({ children: [new TextRun({ text: sinavBasliklari[1], font: "Calibri", size: 22, bold: true })], alignment: AlignmentType.CENTER })],
                    columnSpan: sinavImzaAlani ? 4 : 2,
                    verticalAlign: VerticalAlign.CENTER
                })
            ]
        }),
        new TableRow({
            height: { value: 400, rule: HeightRule.EXACT },
            children: sinavImzaAlani
                ? [
                    new TableCell({ width: { size: 12, type: WidthType.PERCENTAGE }, children: [new Paragraph({ indent: { left: 70, right: 70 }, children: [new TextRun({ text: "Ad Soyad", font: "Calibri", size: 22, bold: true })], alignment: AlignmentType.LEFT })], verticalAlign: VerticalAlign.CENTER }),
                    new TableCell({ width: { size: 46, type: WidthType.PERCENTAGE }, children: [new Paragraph({ indent: { left: 70, right: 70 }, children: [new TextRun({ text: calisan.a || "", font: "Calibri", size: 22 })], alignment: AlignmentType.LEFT })], verticalAlign: VerticalAlign.CENTER }),
                    new TableCell({ width: { size: 12, type: WidthType.PERCENTAGE }, children: [new Paragraph({ children: [new TextRun({ text: "İmza", font: "Calibri", size: 22, bold: true })], alignment: AlignmentType.CENTER })], verticalAlign: VerticalAlign.CENTER }),
                    new TableCell({ width: { size: 30, type: WidthType.PERCENTAGE }, children: [new Paragraph({ children: [new TextRun({ text: "", font: "Calibri", size: 22 })], alignment: AlignmentType.LEFT })], verticalAlign: VerticalAlign.CENTER })
                ]
                : [
                    new TableCell({ width: { size: 12, type: WidthType.PERCENTAGE }, children: [new Paragraph({ indent: { left: 70, right: 70 }, children: [new TextRun({ text: "Ad Soyad", font: "Calibri", size: 22, bold: true })], alignment: AlignmentType.LEFT })], verticalAlign: VerticalAlign.CENTER }),
                    new TableCell({ width: { size: 88, type: WidthType.PERCENTAGE }, children: [new Paragraph({ indent: { left: 70, right: 70 }, children: [new TextRun({ text: calisan.a || "", font: "Calibri", size: 22 })], alignment: AlignmentType.LEFT })], verticalAlign: VerticalAlign.CENTER })
                ]
        })
    ]
});
    const genelsorular = sinavsorusec(sinavjson.genelsoru, 7);
    const tekniksorular = sinavsorusec(sinavjson.tekniksoru, 7);

const sinavbirsorular = genelsorular.flatMap((soruObj, index) => {
    const yanlislar = [soruObj.yanlis1, soruObj.yanlis2, soruObj.yanlis3];
    const dogruCevapIndex = index % 4;
    const siraliSecenekler = [];
    for (let i = 0; i < 4; i++) siraliSecenekler.push(i === dogruCevapIndex ? soruObj.dogru : yanlislar.shift());
    const sikHarfleri = ["a-)", "b-)", "c-)", "d-)"];
    const secenekParagraflari = siraliSecenekler.map((secenek, i) =>
        new Paragraph({ children: [new TextRun({ text: `${sikHarfleri[i]} ${secenek}`, font: "Calibri", size: 22 })], spacing: { after: i === 3 ? 125 : 50 }, alignment: AlignmentType.JUSTIFIED })
    );
    return [
        new Paragraph({ children: [new TextRun({ text: `${index + 1}-)`, bold: true, font: "Calibri", size: 22 }), new TextRun({ text: ` ${soruObj.soru}`, font: "Calibri", size: 22 })], alignment: AlignmentType.JUSTIFIED, spacing: { after: 125 } }),
        ...secenekParagraflari
    ];
});
const sinavikisorular = tekniksorular.flatMap((soruObj, index) => {
    const yanlislar = [soruObj.yanlis1, soruObj.yanlis2, soruObj.yanlis3];
    const dogruCevapIndex = index % 4;
    const siraliSecenekler = [];
    for (let i = 0; i < 4; i++) siraliSecenekler.push(i === dogruCevapIndex ? soruObj.dogru : yanlislar.shift());
    return [
        new Paragraph({ children: [new TextRun({ text: `${index + 1}-)`, bold: true, font: "Calibri", size: 22 }), new TextRun({ text: ` ${soruObj.soru}`, font: "Calibri", size: 22 })], alignment: AlignmentType.JUSTIFIED, spacing: { after: 125 } }),
        ...siraliSecenekler.map((secenek, i) =>
            new Paragraph({ children: [new TextRun({ text: ["a-)", "b-)", "c-)", "d-)"][i] + ` ${secenek}`, font: "Calibri", size: 22 })], spacing: { after: i === 3 ? 125 : 50 }, alignment: AlignmentType.JUSTIFIED })
        )
    ];
});
    const kisininSinavi = [
        usttablo1,
        new Paragraph({}),
        ...sinavbirsorular,
        new Paragraph({}),
        new Paragraph({ children: [new TextRun({ text: `Başarılı  ☐   Başarısız  ☐`, font: "Calibri", size: 26 })], alignment: AlignmentType.CENTER, spacing: { after: 100, before: 100 } }),
        new Paragraph({}),
        new Paragraph({}),
        new Paragraph({}),
        usttablo2,
        new Paragraph({}),
        ...sinavikisorular,
        new Paragraph({}),
        new Paragraph({ children: [new TextRun({ text: `Başarılı  ☐   Başarısız  ☐`, font: "Calibri", size: 26 })], alignment: AlignmentType.CENTER, spacing: { after: 100, before: 100 } }),
        new Paragraph({}),
        new Paragraph({}),
        new Paragraph({}),
    ];
    sinavicerigi.push(...kisininSinavi);
});
    const doc = new Document({
    sections: [{
        properties: {
            page: { margin: { top: 850, right: 850, bottom: 850, left: 850 } }
        },
        children: sinavicerigi,
        }]
    });
    const blob = await Packer.toBlob(doc);
    saveAs(blob, "Sınav.docx");
}
function sinavsorusec(soruDizisi, adet)
{
  let kopya = [...soruDizisi];
    for (let i = kopya.length - 1; i > 0; i--)
    {
        const j = Math.floor(Math.random() * (i + 1));
        [kopya[i], kopya[j]] = [kopya[j], kopya[i]];
    }
  return kopya.slice(0, adet);
}

function temelisgegitimgunalanhazirla()
{
    const $saat = $('#saat');
    if ($saat.length > 0)
    {
        $saat.off('change.temelisg').on('change.temelisg', function ()
        {
            temelisgsaatagoregunalanlariniguncelle();
        });
    }
    $('#gundrop').off('change.temelisg').on('change.temelisg', function ()
    {
        temelisgsaatagoregunalanlariniguncelle();
    });
    temelisgsaatagoregunalanlariniguncelle();
}

function temelisgsaatagoregunalanlariniguncelle()
{
    const saat = $('#saat').val() || (typeof temelisgYeniSaatMetni === 'function' ? temelisgYeniSaatMetni() : '');
    const varsayilanGun = (saat === '12 Saat' || saat === '16 Saat') ? '2' : '1';
    const $gundrop = $('#gundrop');
    if ($gundrop.length > 0)
    {
        const mevcutDeger = String($gundrop.val() || '');
        if (!['1', '2', '3', '4'].includes(mevcutDeger))
        {
            $gundrop.val(varsayilanGun);
        }
    }
    temelisggunalanlarinigoster();
}

function temelisggunalanlarinigoster()
{
    const seciliGun = parseInt($('#gundrop').val(), 10) || 1;
    $('#alan1').toggle(seciliGun >= 1);
    $('#alan2').toggle(seciliGun >= 2);
    $('#alan3').toggle(seciliGun >= 3);
    $('#alan4').toggle(seciliGun >= 4);
}

function temelisgegitimtarihdiyalogac()
{
    $('#diyalogegitimgun').fadeIn();
    temelisgegitimgunalanhazirla();
}

function temelisgkonutablo(i, ekKonular){const{konular:t,basliklar:n}=temelisgtumkonular(i, ekKonular),e=[];e.push([{text:"EĞİTİM KONULARI",colSpan:2,alignment:"center",bold:!0,fontSize:12},{}]);let l=0,a=1,o="1.";for(let i=0;i<t.length;i++){if(l<n.length&&i===n[l].index){e.push([{text:n[l].title,colSpan:2,alignment:"center",bold:!0},{}]),o=l+1+".",a=1,l++}e.push([{text:o+a,alignment:"center"},{text:t[i],alignment:"left"}]),a++}return{table:{headerRows:1,widths:["10%","90%"],body:e},layout:{hLineWidth:function(i,t){return 0===i||i===t.table.body.length?1:.5},vLineWidth:function(){return.5},hLineColor:function(){return"#aaa"},vLineColor:function(){return"#aaa"},paddingLeft:function(){return 5},paddingRight:function(){return 5},paddingTop:function(){return 5},paddingBottom:function(){return 5}}}}
async function temelpdfolusturma(docDefinition){return new Promise((resolve, reject) => {pdfMake.createPdf(docDefinition).getBuffer((buffer) => {resolve(buffer);});});}
function temelisgtumkonular(i, ekKonular){const e=["Çalışma mevzuatı ile ilgili bilgiler","Çalışanların yasal hak ve sorumlulukları","İşyeri temizliği ve düzeni","İş kazası ve meslek hastalığından doğan hukuki sonuçlar","Meslek hastalıklarının sebepleri","Hastalıktan korunma prensipleri ve korunma tekniklerinin uygulanması","Biyolojik ve psikososyal risk etmenleri","İlkyardım","Tütün ürünlerinin zararları ve pasif etkilenim","Kimyasal, fiziksel ve ergonomik risk etmenleri","Elle kaldırma ve taşıma","Parlama, patlama, yangın ve yangından korunma","İş ekipmanlarının güvenli kullanımı","Ekranlı araçlarla çalışma","Elektrik tehlikeleri, riskleri ve önlemleri","Güvenlik ve sağlık işaretleri","İş kazalarının sebepleri ve korunma prensipleri ile tekniklerinin uygulanması","Kişisel koruyucu donanım kullanımı","İş sağlığı ve güvenliği genel kuralları ve güvenlik kültürü","Tahliye ve kurtarma"],t=Array.isArray(ekKonular)&&ekKonular.length>0?ekKonular:temelisgekstrakonularigetir({}),n=[...e];for(let e=0;e<i.length&&e<t.length;e++){const o=String(t[e]||"").trim();"1"===i[e]&&o&&n.push(o)}const o=[{index:0,title:"GENEL KONULAR"},{index:4,title:"SAĞLIK KONULARI"},{index:9,title:"TEKNİK KONULAR"},{index:20,title:"DİĞER KONULAR"}];return{konular:n,basliklar:o}}
function temelisgekstrakonularigetir(isgegitimveri){const sabit=["Yapı işlerinde tehlikeler, riskler ve önlemler","Radyasyon, tehlikeleri, riskleri ve önlemleri","Trafik kuralları ve güvenli sürüş teknikleri","Malzeme güvenlik bilgi formları","Kapalı ortamda çalışma","Kaynakla çalışma","Yüksekte çalışma","Hijyen Eğitimi"];const q=String((isgegitimveri&&isgegitimveri.q)||"").trim(),w=String((isgegitimveri&&isgegitimveri.w)||"").trim(),x=String((isgegitimveri&&isgegitimveri.x)||"").trim(),z=String((isgegitimveri&&isgegitimveri.z)||"").trim();return sabit.concat([q,w,x,z]);}
function temelisgkatilimlisteayrioku(){const settings=jsoncevir(store.get("settings"));if(!settings||typeof settings!=="object"||Array.isArray(settings))return"0";const egitim=Array.isArray(settings.e)&&settings.e.length>0?settings.e[0]:null;if(!egitim||typeof egitim!=="object")return"0";return String(egitim.e??"0");}
function temelisgsinavimzaalanioku(){const settings=jsoncevir(store.get("settings"));if(!settings||typeof settings!=="object"||Array.isArray(settings))return"0";const egitim=Array.isArray(settings.e)&&settings.e.length>0?settings.e[0]:null;if(!egitim||typeof egitim!=="object")return"0";return String(egitim.b??"0");}
function temelisgsinavadsoyadgoster(){const settings=jsoncevir(store.get("settings"));if(!settings||typeof settings!=="object"||Array.isArray(settings))return"0";const egitim=Array.isArray(settings.e)&&settings.e.length>0?settings.e[0]:null;if(!egitim||typeof egitim!=="object")return"0";return String(egitim.d??"0");}
function temelisgsinavbasliklarioku(){const temelBaslik="TEMEL İSG EĞİTİMİ DEĞERLENDİRME SORULARI",bosTarih="....../....../20.....",settings=jsoncevir(store.get("settings"));if(!settings||typeof settings!=="object"||Array.isArray(settings))return[temelBaslik,temelBaslik];const egitim=Array.isArray(settings.e)&&settings.e.length>0?settings.e[0]:null;if(!egitim||typeof egitim!=="object"||String(egitim.c??"0")!=="1")return[temelBaslik,temelBaslik];const isgegitimveri=jsoncevir(store.get("isgegitimveri"))||{},tarih1=String(isgegitimveri.tarih1||"").trim(),tarih2Ham=String(isgegitimveri.tarih2||"").trim();if(!tarih1&&!tarih2Ham)return[`${temelBaslik} - (Tarih: ${bosTarih})`,`${temelBaslik} - (Tarih: ${bosTarih})`];const tarih2=tarih2Ham||temelisgbirtarihsonrasi(tarih1)||bosTarih,ilk=tarih1||bosTarih;return[`${temelBaslik} - (Tarih: ${ilk})`,`${temelBaslik} - (Tarih: ${tarih2})`];}
function temelisgbirtarihsonrasi(tarih){const eslesme=/^(\d{2})\.(\d{2})\.(\d{4})$/.exec(String(tarih||"").trim());if(!eslesme)return"";const gun=parseInt(eslesme[1],10),ay=parseInt(eslesme[2],10),yil=parseInt(eslesme[3],10),d=new Date(yil,ay-1,gun);if(d.getFullYear()!==yil||d.getMonth()!==ay-1||d.getDate()!==gun)return"";d.setDate(d.getDate()+1);const p=n=>n.toString().padStart(2,"0");return`${p(d.getDate())}.${p(d.getMonth()+1)}.${d.getFullYear()}`;}
function temelisgsertifikaseklioku(){const settings=jsoncevir(store.get("settings"));if(!settings||typeof settings!=="object"||Array.isArray(settings))return"0";const egitim=Array.isArray(settings.e)&&settings.e.length>0?settings.e[0]:null;if(!egitim||typeof egitim!=="object")return"0";return String(egitim.a??"0");}
function temelimzatablo(a, b, c, d, e, f) { return { table: { widths: [47, 207, 207, 207, 47], body: [["", { text: a, alignment: "center", fontSize: 11, bold: !0 }, { text: b, alignment: "center", fontSize: 11, bold: !0 }, { text: c, alignment: "center", fontSize: 11, bold: !0 }, ""], ["", { text: "İş Güvenliği Uzmanı", alignment: "center", fontSize: 11 }, { text: isverenunvanioku(), alignment: "center", fontSize: 11 }, { text: "İşyeri Hekimi", alignment: "center", fontSize: 11 }, ""], ["", { text: "Belge No: " + d, alignment: "center", fontSize: 11 }, "", { text: "Belge No: " + e, alignment: "center", fontSize: 11 }, ""], [{ colSpan: 5, text: f, alignment: "center", fontSize: 9 }, "", "", "", ""]] }, layout: "noBorders" } }
function temeltarihbul(v) { const t = "....../....../202....", a = v.tarih1 || t, b = v.tarih2 || t, c = v.tarih3 || t, d = v.tarih4 || t, g = parseInt(v.toplamgun) || 1; switch (g) { case 1: return a; case 2: return `${a} - ${b}`; case 3: return `${a} - ${b} - ${c}`; case 4: return `${a} - ${b} - ${c} - ${d}`; default: return a } }
function temelegitimsuregun(h, t, s) { let r = ""; if (s === "8 Saat") { if (h === "1" && t === 1) r = "8 Saat"; else if (t === 2 && ["1", "2"].includes(h)) r = "4 Saat"; else if (t === 3) { if (h === "1") r = "4 Saat"; if (["2", "3"].includes(h)) r = "2 Saat" } else if (t === 4 && ["1", "2", "3", "4"].includes(h)) r = "2 Saat" } else if (s === "12 Saat") { if (t === 2) { if (h === "1") r = "4 Saat"; if (h === "2") r = "8 Saat" } else if (t === 3 && ["1", "2", "3"].includes(h)) r = "4 Saat"; else if (t === 4) { if (["1", "2"].includes(h)) r = "2 Saat"; if (["3", "4"].includes(h)) r = "4 Saat" } } else if (s === "16 Saat") { if (t === 2 && ["1", "2"].includes(h)) r = "8 Saat"; else if (t === 3) { if (h === "1") r = "8 Saat"; if (["2", "3"].includes(h)) r = "4 Saat" } else if (t === 4 && ["1", "2", "3", "4"].includes(h)) r = "4 Saat" } return r; }
function temelsertifikasaat(s1, s2, s3, s4, g) { let s = "", t = 16; for (let i = 0; i < g; i++) { try { if (i === 0) { s = s1; t = parseInt(s1.replace(" Saat", "")) } else if (i === 1) { s += " - " + s2; t += parseInt(s2.replace(" Saat", "")) } else if (i === 2) { s += " - " + s3; t += parseInt(s3.replace(" Saat", "")) } else if (i === 3) { s += " - " + s4; t += parseInt(s4.replace(" Saat", "")) } } catch (e) { } } return s + " (Toplam: " + t + " Saat)"; }
