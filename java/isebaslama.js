function isebaslamaayarlariyukle()
{
    const settings = jsoncevir(store.get("settings"));
    if (!settings || !settings.y || !Array.isArray(settings.y) || settings.y.length === 0)
    {
        return;
    }
    const ayarlar = settings.y[0];
    const saatMap = {
        "0": "2 Saat",
        "1": "3 Saat",
        "2": "4 Saat",
        "3": "5 Saat",
        "4": "6 Saat",
        "5": "7 Saat",
        "6": "8 Saat"
    };
    if (typeof ayarlar.a !== "undefined")
    {
        const saat = saatMap[String(ayarlar.a)];

        if (saat)
        {
            $("#saat").val(saat);
        }
    }
    const egiticiSecim = String(ayarlar.b || "0");
    if (egiticiSecim === "1")
    {
        $("#adsoyad").val(String(store.get("uzmanad") || "").trim());
    }
    else if (egiticiSecim === "2")
    {
        const firma = isyersecimfirmaoku();
        $("#adsoyad").val(String((firma && firma.is) || "").trim());
    }
    else
    {
        $("#adsoyad").val("");
    }
    ["q", "w", "x", "y", "z"].forEach(function (alanId, index)
    {
        if (typeof ayarlar[alanId] === "undefined")
        {
            return;
        }
        const deger = String(ayarlar[alanId] || "");
        $("#" + alanId).val(deger);
        $("#s1" + (index + 1)).prop("checked", deger !== "");
    });
}

function isebaslama1yukle()
{
    isyerigetir();
    isebaslamaayarlariyukle();
}


async function isebaslamegitimcikti()
{
    let isebaslamaveri = JSON.parse(store.get('isebaslamaveri') || '{}');
    let konusecim = Array.isArray(isebaslamaveri.konular) ? isebaslamaveri.konular : isebaslamasecilikonular(isebaslamaveri.secimler || []);
    let isyeri = jsoncevir(store.get('xjsonfirma')) || {};
    let calisanliste = store.get('calisansecimjsonx');
    calisanliste = JSON.parse(calisanliste);
    if (!Array.isArray(calisanliste) || calisanliste.length === 0)
    {
        calisanliste = [{ a: ".................", u: "................." }];
    }
    let isyeriismi = isyeri.fi;
    let isyeriadresi = isyeri.ad;
    let isyerisicil = isyeri.sc;
    let isveren = isyeri.is;
    let egitici = isebaslamaveri.adsoyad;
    if (!egitici || egitici.trim() === "")
    {
        egitici = ".................";
    };
    let egitimtarihi = isebaslamaveri.tarih;
    if (!egitimtarihi || egitimtarihi.trim() === "")
    {
        egitimtarihi = "......./......./20....";
    };
    var tehlikesinifimap = { 1: "Az Tehlikeli", 2: "Tehlikeli", 3: "Çok Tehlikeli"};
    let tehlikesinifi = tehlikesinifimap[isyeri.ts];
    const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, WidthType, AlignmentType } = docx;
    let sayac = 0;
    let egitimsuresi = isebaslamaveri.saat;
    if (!egitimsuresi || egitimsuresi.trim() === "")
    {
        egitimsuresi = "2 Saat";
    }
    const secilenSatirlar = konusecim.map((konu, index) =>
    {
        sayac = sayac + 1;
        const no = sayac.toString();
        return new docx.TableRow({
        children:
        [
            new docx.TableCell({verticalAlign: docx.VerticalAlign.CENTER,children:[new docx.Paragraph({alignment: docx.AlignmentType.CENTER, children:[new docx.TextRun({text:no,font:"Calibri",size:22})]})]}),
            new docx.TableCell({verticalAlign: docx.VerticalAlign.CENTER,children:[new docx.Paragraph({children:[new docx.TextRun({text:konu,font:"Calibri",size:22})]})]}),
            new docx.TableCell({verticalAlign:docx.VerticalAlign.CENTER,verticalMerge:index===0?"restart":"continue",children:index===0?[new docx.Paragraph({alignment:docx.AlignmentType.CENTER,children:[new docx.TextRun({text:egitimsuresi,font:"Calibri",size:22, bold: true})]})]:[]})
        ]});
    });
    const egitimtabloicerik = new docx.Table({
        width: { size: 100, type: docx.WidthType.PERCENTAGE },
        margins: {top: 70, bottom: 70, left: 50, right: 50,},
        rows:
        [
            new docx.TableRow({
              children: [
                new docx.TableCell({verticalAlign: docx.VerticalAlign.CENTER,width:{size:8,type:docx.WidthType.PERCENTAGE},children:[new docx.Paragraph({alignment: docx.AlignmentType.CENTER,children:[new docx.TextRun({text:"No",bold:true,font:"Calibri",size:22})]})]}),
                new docx.TableCell({verticalAlign: docx.VerticalAlign.CENTER,width:{size:70,type:docx.WidthType.PERCENTAGE},children:[new docx.Paragraph({alignment: docx.AlignmentType.CENTER,children:[new docx.TextRun({text:"Eğitim Konusu",bold:true,font:"Calibri",size:22, alignment: docx.AlignmentType.CENTER})]})]}),
                new docx.TableCell({verticalAlign: docx.VerticalAlign.CENTER,width:{size:22,type:docx.WidthType.PERCENTAGE},children:[new docx.Paragraph({alignment: docx.AlignmentType.CENTER,children:[new docx.TextRun({text:"Eğitim Süresi",bold:true,font:"Calibri",size:22, alignment: docx.AlignmentType.CENTER})]})]})
              ]
            }),
            ...secilenSatirlar
        ]
    });
    const sections = calisanliste.map(calisan =>
    ({
        properties: { page: { margin: { top: 1417, right: 1134, bottom: 1417, left: 1134 } } },
        children:
        [
            new Paragraph({ children: [new TextRun({ text: "İŞE BAŞLAMA EĞİTİM BELGESİ", bold: true, font: "Calibri", size: 28 })], spacing: { after: 250 }, alignment: AlignmentType.CENTER }),
            new Paragraph({ children: [new TextRun({ text: "\tİşyeri Unvanı: " + isyeriismi, font: "Calibri", size: 22 })], spacing: { after: 100 } }),
            ...(isyeriadresi && isyeriadresi.trim() !== "" ? [new Paragraph({ children: [new TextRun({ text: "\tİşyeri Adresi: " + isyeriadresi, font: "Calibri", size: 22 })], spacing: { after: 100 } })] : []),
            ...(isyerisicil && isyerisicil.trim() !== "" ? [new Paragraph({ children: [new TextRun({ text: "\tSGK Sicil No: " + isyerisicil, font: "Calibri", size: 22 })], spacing: { after: 100 } })] : []),
            new Paragraph({ children: [new TextRun({ text: "\tTehlike Sınıfı: " + tehlikesinifi, font: "Calibri", size: 22 })], spacing: { after: 100 } }),
            new Paragraph({ children: [new TextRun({ text: "\tEğitim Tarihi: " + egitimtarihi, font: "Calibri", size: 22 })], spacing: { after: 100 } }),
            new Paragraph({ children: [new TextRun({ text: "\tAşağıda belirtilen konuları içeren işe başlama eğitimi, çalışan ile uygulamalı olarak yüz yüze gerçekleştirilmiştir. Çalışanların İş Sağlığı ve Güvenliği Eğitimlerinin Usul ve Esasları Hakkında Yönetmelik Madde-6 kapsamında iş sağlığı ve güvenliği temel eğitimi, yıllık eğitim planında belirtilen tarihler arasında verilecektir.", font: "Calibri", size: 22 })], spacing: { after: 100 }, alignment: AlignmentType.JUSTIFIED}),
            egitimtabloicerik,
            new Paragraph(''),
            new Paragraph(''),
            isebaslamaegitimiimza(isveren, calisan.a, calisan.u, egitici)
        ]
    }));

    const doc = new Document({ sections });
    const blob = await Packer.toBlob(doc);
    saveAs(blob, "İşe Başlama Eğitimi.docx");
}

function isebaslamasecilikonular(secimler)
{
    if (!Array.isArray(secimler))
    {
        return [];
    }
    const egitimkonulari = { sa: "Acil çıkış yolları, kapıları ve toplanma alanı", sb: "Çalışan temsilcisi ile tanışma", sc: "Kimyasal madde riski ve önlemi", sd: "Gürültü riski ve önlemi", se: "Toz riski ve önlemi", sf: "Kullanılması gerekli kişisel koruyucu donanımlar", sg: "Kaldırma ve taşıma işlerinde uyulacak kurallar", sh: "İş ekipmanlarının kullanımında uyulacak kurallar", si: "Güvenlik ve sağlık işaretlerinin tanıtımı", sj: "Kişisel ve el hijyeni" };
    return secimler
        .filter(item => item && Object.values(item)[0] === 1)
        .map(item => egitimkonulari[Object.keys(item)[0]] || "")
        .filter(konu => konu !== "");
}

function isebaslamaegitimiimza(isveren, calisanadsoyad, calisanunvan, egitici)
{
return new docx.Table
({
    width: { size: 100, type: docx.WidthType.PERCENTAGE },
    borders:{top:{style:docx.BorderStyle.NONE,size:0,color:"FFFFFF"},bottom:{style:docx.BorderStyle.NONE,size:0,color:"FFFFFF"},left:{style:docx.BorderStyle.NONE,size:0,color:"FFFFFF"},right:{style:docx.BorderStyle.NONE,size:0,color:"FFFFFF"},insideHorizontal:{style:docx.BorderStyle.NONE,size:0,color:"FFFFFF"},insideVertical:{style:docx.BorderStyle.NONE,size:0,color:"FFFFFF"}},
    rows:
    [
        new docx.TableRow
        ({
            children:
            [
                new docx.TableCell({ width: { size: 33, type: docx.WidthType.PERCENTAGE }, children: [new docx.Paragraph({ alignment: docx.AlignmentType.CENTER, children: [new docx.TextRun({ text: egitici, font: "Calibri", size: 22, bold: true })] })] }),
                new docx.TableCell({ width: { size: 34, type: docx.WidthType.PERCENTAGE }, children: [new docx.Paragraph({ alignment: docx.AlignmentType.CENTER, children: [new docx.TextRun({ text: isveren, font: "Calibri", size: 22, bold: true })] })] }),
                new docx.TableCell({ width: { size: 33, type: docx.WidthType.PERCENTAGE }, children: [new docx.Paragraph({ alignment: docx.AlignmentType.CENTER, children: [new docx.TextRun({ text: calisanadsoyad, font: "Calibri", size: 22, bold: true })] })] }),
            ]
        }),
        new docx.TableRow
        ({
            children:
            [
                new docx.TableCell({children:[new docx.Paragraph({alignment:docx.AlignmentType.CENTER,children:[new docx.TextRun({text:"Eğitici",font:"Calibri",size:22})]})]}),
                new docx.TableCell({children:[new docx.Paragraph({alignment:docx.AlignmentType.CENTER,children:[new docx.TextRun({text:isverenunvanioku(),font:"Calibri",size:22})]})]}),
                new docx.TableCell({children:[new docx.Paragraph({alignment: docx.AlignmentType.CENTER, children: [new docx.TextRun({text: calisanunvan, font: "Calibri", size: 22})]})]}),
            ]
        }),
        new docx.TableRow
        ({
            children:
            [
                new docx.TableCell({children:[new docx.Paragraph({alignment:docx.AlignmentType.CENTER,children:[new docx.TextRun({text:"İmza",font:"Calibri",size:22})]})]}),
                new docx.TableCell({children:[new docx.Paragraph({alignment:docx.AlignmentType.CENTER,children:[new docx.TextRun({text:"İmza",font:"Calibri",size:22})]})]}),
                new docx.TableCell({children:[new docx.Paragraph({alignment: docx.AlignmentType.CENTER, children: [new docx.TextRun({ text: "İmza", font: "Calibri", size: 22})]})]}),
            ]
        }),
    ]
})
}

function isebaslama1devam()
{
    let firmaid = firmasecimoku();
    if (!/^[a-z0-9]{10}$/.test(firmaid))
    {
        mesajmetin("Geçersiz işyeri seçimi.");
        return false;
    }
    let konular = [];
    $(".gridtablo tbody tr").each(function ()
    {
        $(this).find(".csscheckbox:checked").each(function ()
        {
            const konu = $(this).closest("td").next("td").text().trim();
            if (konu !== "")
            {
                konular.push(konu);
            }
        });
    });
    [
        { checkboxId: "s11", inputId: "q" },
        { checkboxId: "s12", inputId: "w" },
        { checkboxId: "s13", inputId: "x" },
        { checkboxId: "s14", inputId: "y" },
        { checkboxId: "s15", inputId: "z" }
    ].forEach(function (item)
    {
        if (!$("#" + item.checkboxId).is(":checked"))
        {
            return;
        }
        const konu = $("#" + item.inputId).val().trim();
        if (konu !== "")
        {
            konular.push(konu);
        }
    });
    const liste =
    {
        tarih: $("#tarih").val().trim(),
        adsoyad: adsoyadduzelt($("#adsoyad").val().trim()),
        saat: $("#saat").val(),
        konular: konular
    };
    store.set('isebaslamaveri', JSON.stringify(liste));
    window.location.href = "/isebaslama2?id=" + encodeURIComponent(firmaid);
}

function isebaslamatamam2()
{
    dokumancalisansecim();
    store.set("dosyaciktitipi", "2");
    window.location.href = "/dosyacikti?id=2";
}
