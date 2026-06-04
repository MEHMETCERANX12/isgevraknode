async function yillikdegerlendirmeraporuload()
{
    isyerigetir();
    try
    {
        let yillikplandata = await githuboku("https://cdn.jsdelivr.net/gh/MEHMETCERANX12/isgevrak@main/kaynak/yillikplan1_4.json");
        store.set("yillikplandata", yillikplandata);
        store.set("indirmetamam", "1");
    }
    catch
    {
        store.set("indirmetamam", "0");
        alertify.error("Yıllık plan verisi indirilemedi");
    }
}

async function yillikdegerelendirmeraporu()
{
    let jsonveri = jsoncevir(store.get("degerlendirmejson"));
    let yillikplandata = jsoncevir(store.get("yillikplandata"));
    let isyeri = jsoncevir(store.get("xjsonfirma"));
    let isyeriunvan = isyeri.fi;
    let isyeriadres = isyeri.ad;
    let isyerisicil = isyeri.sc;
    let isveren = isyeri.is;
    //////////////////////////////////////
    const kitap = new ExcelJS.Workbook();
    kitap.creator = "Mehmet CERAN";
    kitap.created = new Date();
    const sayfa = kitap.addWorksheet("EK-2 Değerlendirme");
    sayfa.pageSetup = { paperSize: 9, orientation: "landscape", horizontalCentered: true, verticalCentered: false, fitToWidth: 1, fitToHeight: 999, showGridLines: !1, margins: { left: 0.5, right: 0.5, top: 0.5, bottom: 1, header: 0.3, footer: 0.3 } };
    sayfa.pageSetup.printTitlesRow = "1:10";
    sayfa.getColumn(1).width = 4;
    sayfa.getColumn(2).width = 21;
    sayfa.getColumn(3).width = 11;
    sayfa.getColumn(4).width = 27;
    sayfa.getColumn(5).width = 8;
    sayfa.getColumn(6).width = 27;
    sayfa.getColumn(6).width = 21;
    sayfa.getColumn(7).width = 44;
    sayfa.headerFooter = { oddFooter: "&RSayfa No: &P/&N"};
    ///////////////////////////////
    sayfa.getCell("A1").value = store.get("degerlendirmeyil") +  " - YILLIK DEĞERLENDİRME RAPORU";
    sayfa.getCell("A1").alignment = { vertical: "middle", indent: 38 };
    sayfa.getCell("A1").font = { name: "Calibri", bold: true, size: 12 };
    sayfa.mergeCells("A1:F1");
    ["A1", "B1", "C1", "D1", "E1"].forEach(h => sayfa.getCell(h).border = { top: { style: "thin" }, bottom: { style: "thin" } });
    sayfa.getCell("A1").border.left = { style: "thin" };
    let g1 = sayfa.getCell("G1");
    g1.value = "Tarih: " + store.get("degerlendirmetarih");
    g1.alignment = { vertical: "middle", horizontal: "right", indent: 1 };
    g1.font = { name: "Calibri", size: 11 };
    g1.border = { top: { style: "thin" }, bottom: { style: "thin" }, right: { style: "thin" }};
    sayfa.getRow(1).height = 22;
    ///////////////////////////////
    sayfa.mergeCells("A2:G2");
    sayfa.getRow(2).height = 8;
    ///////////////////////////////
    ["A3", "A4", "A5", "A6", "A7", "A8"].forEach((h, i) => { let c = sayfa.getCell(h); c.alignment = { horizontal: "left", vertical: "middle" }; c.font = { name: "Calibri", size: 11 }; sayfa.getRow(i + 3).height = 18; });
    sayfa.mergeCells("A3:G3");
    sayfa.getCell("A3").value = "İşyeri Unvanı: " + isyeriunvan;
    ///////////////////////////////
    sayfa.mergeCells("A4:G4");
    sayfa.getCell("A4").value = "İşyeri SGK Sicil No: " + isyerisicil;
    ///////////////////////////////
    sayfa.mergeCells("A5:G5");
    sayfa.getCell("A5").value = "İşyeri Adresi: " + isyeriadres;
    ///////////////////////////////
    sayfa.mergeCells("A6:G6");
    sayfa.getCell("A6").value = "Telefon/Faks No:                                                                     E-Posta:";
    ///////////////////////////////
    sayfa.mergeCells("A7:G7");
    sayfa.getCell("A7").value = "İş Kolu:";
    ///////////////////////////////
    sayfa.mergeCells("A8:G8");
    sayfa.getCell("A8").value = "İşçi sayısı:                      Erkek:                       Kadın:                      Genç:                      Çocuk:                      Toplam:";
    ///////////////////////////////
    sayfa.mergeCells("A9:G9");
    sayfa.getRow(9).height = 8;
    ///////////////////////////////
    ["A10", "B10", "C10", "D10", "E10", "F10", "G10"].forEach(h => { let c = sayfa.getCell(h); c.alignment = { horizontal: "center", vertical: "middle" }; c.font = { name: "Calibri", bold: !0, size: 11 }; c.border = { top: { style: "thin" }, left: { style: "thin" }, bottom: { style: "thin" }, right: { style: "thin" } } });
    sayfa.getRow(10).height = 18;
    sayfa.getCell("A10").value = "No";
    sayfa.getCell("B10").value = "Yapılan Çalışmalar";
    sayfa.getCell("C10").value = "Tarih";
    sayfa.getCell("D10").value = "Yapan Kişi ve Unvanı";
    sayfa.getCell("E10").value = "Tekrar";
    sayfa.getCell("F10").value = "Kullanılan Yöntem";
    sayfa.getCell("G10").value = "Sonuç ve Yorum";
    sayfa.getCell("A11").value = 1;
    sayfa.getCell("B11").value = "Risk Değerlendirmesi";
    if (!Array.isArray(jsonveri.riskdegerlendirme) || jsonveri.riskdegerlendirme.length === 0)
    {
        ["A11", "B11", "C11", "D11", "E11", "F11", "G11"].forEach(h => { let c = sayfa.getCell(h); c.alignment = (h === "B11") ? { horizontal: "left", vertical: "middle", wrapText: !0 } : { horizontal: "center", vertical: "middle", wrapText: !0 }; c.font = { name: "Calibri", size: 11 }; c.border = { top: { style: "thin" }, left: { style: "thin" }, bottom: { style: "thin" }, right: { style: "thin" } } });
        sayfa.getCell("C11").value = "-";
        sayfa.getCell("C11").value = "-";
        sayfa.getCell("D11").value = "-";
        sayfa.getCell("E11").value = "-";
        sayfa.getCell("F11").value = "-";
        sayfa.getCell("G11").value = "-";
        sayfa.getRow(11).height = 45;
    }
    else
    {
        ["A11", "B11", "C11", "D11", "E11", "F11", "G11"].forEach(h => { let c = sayfa.getCell(h); c.alignment = (h === "B11" || h === "G11") ? { horizontal: "left", vertical: "middle", wrapText: !0 } : { horizontal: "center", vertical: "middle", wrapText: !0 }; c.font = { name: "Calibri", size: 11 }; c.border = { top: { style: "thin" }, left: { style: "thin" }, bottom: { style: "thin" }, right: { style: "thin" } } });
        let rd = jsonveri.riskdegerlendirme[0];
        let t = rd.t || "-";
        let x = rd.x || "";
        let y = rd.y || "";
        let z = rd.z || "-";
        const riskmap = { 1: "Fine Kinney", 2: "L Tipi Matris", 3: "Hazop", 4: "Neden-Sonuç Analiz", 5: "Hata Ağacı Analiz", 6: "Hata Türleri ve Etki Analiz" };
        sayfa.getCell("C11").value = t;
        sayfa.getCell("D11").value = x + "\nİş Güvenliği Uzmanı\n" + y + "\nİşyeri Hekimi";
        sayfa.getCell("D11").alignment = { horizontal: "center", vertical: "middle", wrapText: true };
        sayfa.getCell("E11").value = 1;
        sayfa.getCell("F11").value = riskmap[z];
        sayfa.getCell("G11").value = "";
        sayfa.getRow(11).height = 75;
    }
    sayfa.getCell("A12").value = 2;
    sayfa.getCell("B12").value = "Ortam Ölçümleri";
    sayfa.getRow(12).height = 45;
    if (!Array.isArray(jsonveri.ortamolcumu) || jsonveri.ortamolcumu.length === 0)
    {
        ["A12", "B12", "C12", "D12", "E12", "F12", "G12"].forEach(h => { let c = sayfa.getCell(h); c.alignment = (h === "B12") ? { horizontal: "left", vertical: "middle", wrapText: !0 } : { horizontal: "center", vertical: "middle", wrapText: !0 }; c.font = { name: "Calibri", size: 11 }; c.border = { top: { style: "thin" }, left: { style: "thin" }, bottom: { style: "thin" }, right: { style: "thin" } } });
        sayfa.getCell("C12").value = "-";
        sayfa.getCell("C12").value = "-";
        sayfa.getCell("D12").value = "-";
        sayfa.getCell("E12").value = "-";
        sayfa.getCell("F12").value = "-";
    }
    else
    {
        ["A12", "B12", "C12", "D12", "E12", "F12", "G12"].forEach(h => { let c = sayfa.getCell(h); c.alignment = (h === "B12" || h === "G12") ? { horizontal: "left", vertical: "middle", wrapText: !0 } : { horizontal: "center", vertical: "middle", wrapText: !0 }; c.font = { name: "Calibri", size: 11 }; c.border = { top: { style: "thin" }, left: { style: "thin" }, bottom: { style: "thin" }, right: { style: "thin" } } });
        let ort = jsonveri.ortamolcumu[0];
        sayfa.getCell("C12").value = "Ek-1"
        sayfa.getCell("D12").value = "Ek-1";
        sayfa.getCell("E12").value = 1;
        sayfa.getCell("F12").value = "Ek-1";
    }
    sayfa.getCell("A13").value = 3;
    sayfa.getCell("B13").value = "İşe Giriş Muayeneleri";
    sayfa.getRow(13).height = 45;
    if (!Array.isArray(jsonveri.saglikraporu) || jsonveri.saglikraporu.length === 0)
    {
        ["A13", "B13", "C13", "D13", "E13", "F13", "G13"].forEach(h => { let c = sayfa.getCell(h); c.alignment = (h === "B13") ? { horizontal: "left", vertical: "middle", wrapText: !0 } : { horizontal: "center", vertical: "middle", wrapText: !0 }; c.font = { name: "Calibri", size: 11 }; c.border = { top: { style: "thin" }, left: { style: "thin" }, bottom: { style: "thin" }, right: { style: "thin" } } });
        sayfa.getCell("C13").value = "-";
        sayfa.getCell("C13").value = "-";
        sayfa.getCell("D13").value = "-";
        sayfa.getCell("E13").value = "-";
        sayfa.getCell("F13").value = "-";
    }
    else
    {
        ["A13", "B13", "C13", "D13", "E13", "F13", "G13"].forEach(h => { let c = sayfa.getCell(h); c.alignment = (h === "B13" || h === "G13") ? { horizontal: "left", vertical: "middle", wrapText: !0 } : { horizontal: "center", vertical: "middle", wrapText: !0 }; c.font = { name: "Calibri", size: 11 }; c.border = { top: { style: "thin" }, left: { style: "thin" }, bottom: { style: "thin" }, right: { style: "thin" } } });
        let sg = jsonveri.riskdegerlendirme[0];
        let t = sg.t || "-";
        let y = sg.y || "";
        sayfa.getCell("C13").value = "Sürekli";
        sayfa.getCell("D13").value = y;
        sayfa.getCell("E13").value = 1;
        sayfa.getCell("F13").value = "Ek-2 Sağlık Raporu";
    }
    sayfa.getCell("A14").value = 4;
    sayfa.getCell("B14").value = "Periyodik Muayeneler";
    sayfa.getRow(14).height = 45;
    if (!Array.isArray(jsonveri.saglikraporu) || jsonveri.saglikraporu.length === 0)
    {
        ["A14", "B14", "C14", "D14", "E14", "F14", "G14"].forEach(h => { let c = sayfa.getCell(h); c.alignment = (h === "B14") ? { horizontal: "left", vertical: "middle", wrapText: !0 } : { horizontal: "center", vertical: "middle", wrapText: !0 }; c.font = { name: "Calibri", size: 11 }; c.border = { top: { style: "thin" }, left: { style: "thin" }, bottom: { style: "thin" }, right: { style: "thin" } } });
        sayfa.getCell("C14").value = "-";
        sayfa.getCell("C14").value = "-";
        sayfa.getCell("D14").value = "-";
        sayfa.getCell("E14").value = "-";
        sayfa.getCell("F14").value = "-";
    }
    else
    {
        ["A14", "B14", "C14", "D14", "E14", "F14", "G14"].forEach(h => { let c = sayfa.getCell(h); c.alignment = (h === "B14" || h === "G14") ? { horizontal: "left", vertical: "middle", wrapText: !0 } : { horizontal: "center", vertical: "middle", wrapText: !0 }; c.font = { name: "Calibri", size: 11 }; c.border = { top: { style: "thin" }, left: { style: "thin" }, bottom: { style: "thin" }, right: { style: "thin" } } });
        let sg = jsonveri.saglikraporu[0];
        let t = sg.t || "-";
        let x = sg.x || "";
        sayfa.getCell("C14").value = t;
        sayfa.getCell("D14").value = x;
        sayfa.getCell("E14").value = 1;
        sayfa.getCell("F14").value = "Ek-2 Sağlık Raporu";
    }
    let sonuc = sagliktaramabtrf(jsonveri, yillikplandata);
    let bvar = sonuc[0];
    let tvar = sonuc[1];
    let rvar = sonuc[2];
    let fvar = sonuc[3];
    sayfa.getCell("A15").value = 5;
    sayfa.getCell("B15").value = "Radyolojik Analizler";
    sayfa.getRow(15).height = 45;
    if (Array.isArray(jsonveri.sagliktarama) && jsonveri.sagliktarama.length > 0 && rvar === true)
    {
        ["A15", "B15", "C15", "D15", "E15", "F15", "G15"].forEach(h => { let c = sayfa.getCell(h); c.alignment = (h === "B15" || h === "G15") ? { horizontal: "left", vertical: "middle", wrapText: !0 } : { horizontal: "center", vertical: "middle", wrapText: !0 }; c.font = { name: "Calibri", size: 11 }; c.border = { top: { style: "thin" }, left: { style: "thin" }, bottom: { style: "thin" }, right: { style: "thin" } } });
        sayfa.getCell("C15").value = "Ek-1";
        sayfa.getCell("D15").value = "Ek-1";
        sayfa.getCell("E15").value = 1;
        sayfa.getCell("F15").value = "Ek-1";
    }
    else
    {
        ["A15", "B15", "C15", "D15", "E15", "F15", "G15"].forEach(h => { let c = sayfa.getCell(h); c.alignment = (h === "B15" || h === "G15") ? { horizontal: "left", vertical: "middle", wrapText: !0 } : { horizontal: "center", vertical: "middle", wrapText: !0 }; c.font = { name: "Calibri", size: 11 }; c.border = { top: { style: "thin" }, left: { style: "thin" }, bottom: { style: "thin" }, right: { style: "thin" } } });
        sayfa.getCell("C15").value = "-";
        sayfa.getCell("D15").value = "-";
        sayfa.getCell("E15").value = "-";
        sayfa.getCell("F15").value = "-";
    }
    sayfa.getCell("A16").value = 6;
    sayfa.getCell("B16").value = "Biyolojik Analizler";
    sayfa.getRow(16).height = 45;
    if (Array.isArray(jsonveri.sagliktarama) && jsonveri.sagliktarama.length > 0 && bvar === true)
    {
        ["A16", "B16", "C16", "D16", "E16", "F16", "G16"].forEach(h => { let c = sayfa.getCell(h); c.alignment = (h === "B16" || h === "G16") ? { horizontal: "left", vertical: "middle", wrapText: !0 } : { horizontal: "center", vertical: "middle", wrapText: !0 }; c.font = { name: "Calibri", size: 11 }; c.border = { top: { style: "thin" }, left: { style: "thin" }, bottom: { style: "thin" }, right: { style: "thin" } } });
        sayfa.getCell("C16").value = "Ek-1";
        sayfa.getCell("D16").value = "Ek-1";
        sayfa.getCell("E16").value = 1;
        sayfa.getCell("F16").value = "Ek-1";
    }
    else
    {
        ["A16", "B16", "C16", "D16", "E16", "F16", "G16"].forEach(h => { let c = sayfa.getCell(h); c.alignment = (h === "B16" || h === "G16") ? { horizontal: "left", vertical: "middle", wrapText: !0 } : { horizontal: "center", vertical: "middle", wrapText: !0 }; c.font = { name: "Calibri", size: 11 }; c.border = { top: { style: "thin" }, left: { style: "thin" }, bottom: { style: "thin" }, right: { style: "thin" } } });
        sayfa.getCell("C16").value = "-";
        sayfa.getCell("D16").value = "-";
        sayfa.getCell("E16").value = "-";
        sayfa.getCell("F16").value = "-";
    }
    sayfa.getCell("A17").value = 7;
    sayfa.getCell("B17").value = "Toksikolojik Analizler";
    sayfa.getRow(17).height = 45;
    if (Array.isArray(jsonveri.sagliktarama) && jsonveri.sagliktarama.length > 0 && tvar === true)
    {
        ["A17", "B17", "C17", "D17", "E17", "F17", "G17"].forEach(h => { let c = sayfa.getCell(h); c.alignment = (h === "B17" || h === "G17") ? { horizontal: "left", vertical: "middle", wrapText: !0 } : { horizontal: "center", vertical: "middle", wrapText: !0 }; c.font = { name: "Calibri", size: 11 }; c.border = { top: { style: "thin" }, left: { style: "thin" }, bottom: { style: "thin" }, right: { style: "thin" } } });
        sayfa.getCell("C17").value = "Ek-1";
        sayfa.getCell("D17").value = "Ek-1";
        sayfa.getCell("E17").value = 1;
        sayfa.getCell("F17").value = "Ek-1";
    }
    else
    {
        ["A17", "B17", "C17", "D17", "E17", "F17", "G17"].forEach(h => { let c = sayfa.getCell(h); c.alignment = (h === "B17" || h === "G17") ? { horizontal: "left", vertical: "middle", wrapText: !0 } : { horizontal: "center", vertical: "middle", wrapText: !0 }; c.font = { name: "Calibri", size: 11 }; c.border = { top: { style: "thin" }, left: { style: "thin" }, bottom: { style: "thin" }, right: { style: "thin" } } });
        sayfa.getCell("C17").value = "-";
        sayfa.getCell("D17").value = "-";
        sayfa.getCell("E17").value = "-";
        sayfa.getCell("F17").value = "-";
    }
    sayfa.getCell("A18").value = 8;
    sayfa.getCell("B18").value = "Fizyolojik Analizler";
    sayfa.getRow(18).height = 45;
    if (Array.isArray(jsonveri.sagliktarama) && jsonveri.sagliktarama.length > 0 && fvar === true)
    {
        ["A18", "B18", "C18", "D18", "E18", "F18", "G18"].forEach(h => { let c = sayfa.getCell(h); c.alignment = (h === "B18" || h === "G18") ? { horizontal: "left", vertical: "middle", wrapText: !0 } : { horizontal: "center", vertical: "middle", wrapText: !0 }; c.font = { name: "Calibri", size: 11 }; c.border = { top: { style: "thin" }, left: { style: "thin" }, bottom: { style: "thin" }, right: { style: "thin" } } });
        sayfa.getCell("C18").value = "Ek-1";
        sayfa.getCell("D18").value = "Ek-1";
        sayfa.getCell("E18").value = 1;
        sayfa.getCell("F18").value = "Ek-1";
    }
    else
    {
        ["A18", "B18", "C18", "D18", "E18", "F18", "G18"].forEach(h => { let c = sayfa.getCell(h); c.alignment = (h === "B18" || h === "G18") ? { horizontal: "left", vertical: "middle", wrapText: !0 } : { horizontal: "center", vertical: "middle", wrapText: !0 }; c.font = { name: "Calibri", size: 11 }; c.border = { top: { style: "thin" }, left: { style: "thin" }, bottom: { style: "thin" }, right: { style: "thin" } } });
        sayfa.getCell("C18").value = "-";
        sayfa.getCell("D18").value = "-";
        sayfa.getCell("E18").value = "-";
        sayfa.getCell("F18").value = "-";
    }
    sayfa.getCell("A19").value = 9;
    sayfa.getRow(19).height = 45;
    sayfa.getCell("B19").value = "Psikolojik Testler";
    sayfa.getCell("C19").value = "-";
    sayfa.getCell("D19").value = "-";
    sayfa.getCell("E19").value = "-";
    sayfa.getCell("F19").value = "-";
    sayfa.getCell("G19").value = "";
    ["A19", "B19", "C19", "D19", "E19", "F19", "G19"].forEach(h => { let c = sayfa.getCell(h); c.alignment = (h === "B19") ? { horizontal: "left", vertical: "middle", wrapText: !0 } : { horizontal: "center", vertical: "middle", wrapText: !0 }; c.font = { name: "Calibri", size: 11 }; c.border = { top: { style: "thin" }, left: { style: "thin" }, bottom: { style: "thin" }, right: { style: "thin" } } });
    sayfa.getCell("A20").value = 10;
    sayfa.getCell("B20").value = "Eğitim Çalışmaları";
    if (!Array.isArray(jsonveri.egitim) || jsonveri.egitim.length === 0)
    {
        ["A20", "B20", "C20", "D20", "E20", "F20", "G20"].forEach(h => { let c = sayfa.getCell(h); c.alignment = (h === "B20") ? { horizontal: "left", vertical: "middle", wrapText: !0 } : { horizontal: "center", vertical: "middle", wrapText: !0 }; c.font = { name: "Calibri", size: 11 }; c.border = { top: { style: "thin" }, left: { style: "thin" }, bottom: { style: "thin" }, right: { style: "thin" } } });
        sayfa.getCell("C20").value = "-";
        sayfa.getCell("C20").value = "-";
        sayfa.getCell("D20").value = "-";
        sayfa.getCell("E20").value = "-";
        sayfa.getCell("F20").value = "-";
        sayfa.getCell("G20").value = "-";
        sayfa.getRow(20).height = 45;
    }
    else
    {
        ["A20", "B20", "C20", "D20", "E20", "F20", "G20"].forEach(h => { let c = sayfa.getCell(h); c.alignment = (h === "B20" || h === "G20") ? { horizontal: "left", vertical: "middle", wrapText: !0 } : { horizontal: "center", vertical: "middle", wrapText: !0 }; c.font = { name: "Calibri", size: 11 }; c.border = { top: { style: "thin" }, left: { style: "thin" }, bottom: { style: "thin" }, right: { style: "thin" } } });
        let eg = jsonveri.egitim[0];
        let x = eg.x || "-";
        let y = eg.y || "";
        const riskmap = { 1: "Fine Kinney", 2: "L Tipi Matris", 3: "Hazop", 4: "Neden-Sonuç Analiz", 5: "Hata Ağacı Analiz", 6: "Hata Türleri ve Etki Analiz" };
        sayfa.getCell("C20").value = "Sürekli";
        sayfa.getCell("D20").value = x + "\nİş Güvenliği Uzmanı\n" + y + "\nİşyeri Hekimi";
        sayfa.getCell("D20").alignment = { horizontal: "center", vertical: "middle", wrapText: true };
        sayfa.getCell("E20").value = 1;
        sayfa.getCell("F20").value = "Temel İş Sağlığı ve Güvenliği Eğitimi";
        sayfa.getCell("G20").value = "";
        sayfa.getRow(20).height = 75;
    }
    sayfa.getCell("A21").value = 11;
    sayfa.getCell("B21").value = "Diğer Çalışmalar";
    sayfa.getRow(21).height = 45;
    if ((Array.isArray(jsonveri.acildurum) && jsonveri.acildurum.length > 0) || (Array.isArray(jsonveri.tatbikat) && jsonveri.tatbikat.length > 0) || (Array.isArray(jsonveri.isekipmanikontrol) && jsonveri.isekipmanikontrol.length > 0))
    {
        ["A21", "B21", "C21", "D21", "E21", "F21", "G21"].forEach(h => { let c = sayfa.getCell(h); c.alignment = (h === "B21" || h === "G21") ? { horizontal: "left", vertical: "middle", wrapText: !0 } : { horizontal: "center", vertical: "middle", wrapText: !0 }; c.font = { name: "Calibri", size: 11 }; c.border = { top: { style: "thin" }, left: { style: "thin" }, bottom: { style: "thin" }, right: { style: "thin" } } });
        sayfa.getCell("C21").value = "Ek-1";
        sayfa.getCell("D21").value = "Ek-1";
        sayfa.getCell("E21").value = 1;
        sayfa.getCell("F21").value = "Ek-1";
    }
    else
    {
        ["A21", "B21", "C21", "D21", "E21", "F21", "G21"].forEach(h => { let c = sayfa.getCell(h); c.alignment = (h === "B21" || h === "G21") ? { horizontal: "left", vertical: "middle", wrapText: !0 } : { horizontal: "center", vertical: "middle", wrapText: !0 }; c.font = { name: "Calibri", size: 11 }; c.border = { top: { style: "thin" }, left: { style: "thin" }, bottom: { style: "thin" }, right: { style: "thin" } } });
        sayfa.getCell("C21").value = "-";
        sayfa.getCell("D21").value = "-";
        sayfa.getCell("E21").value = "-";
        sayfa.getCell("F21").value = "-";
    }
    if (bvar === true || fvar === true || tvar === true || rvar === true || (Array.isArray(jsonveri.acildurum) && jsonveri.acildurum.length > 0) || (Array.isArray(jsonveri.tatbikat) && jsonveri.tatbikat.length > 0) || (Array.isArray(jsonveri.isekipmanikontrol) && jsonveri.isekipmanikontrol.length > 0) || (Array.isArray(jsonveri.ortamolcumu) && jsonveri.ortamolcumu.length > 0))
    {
        const ek1sayfa = kitap.addWorksheet("Ek-1");
        ek1sayfa.pageSetup = { paperSize: 9, orientation: "portrait", horizontalCentered: true, verticalCentered: false, fitToWidth: 1, fitToHeight: 999, showGridLines: !1, margins: { left: 0.4, right: 0.4, top: 0.6, bottom: 0.6, header: 0.3, footer: 0.3 } };
        ek1sayfa.pageSetup.printTitlesRow = "1:2";
        ek1sayfa.getColumn(1).width = 21;
        ek1sayfa.getColumn(2).width = 11;
        ek1sayfa.getColumn(3).width = 30;
        ek1sayfa.getColumn(4).width = 30;
        ek1sayfa.headerFooter = { oddFooter: "&RSayfa No: &P/&N"};
        ek1sayfa.getCell("A1").value = "EK-1";
        ek1sayfa.getCell("A2").value = "Yapılan Çalışmalar";
        ek1sayfa.getCell("B2").value = "Tarih";
        ek1sayfa.getCell("C2").value = "Yapan Kişi ve Unvanı";
        ek1sayfa.getCell("D2").value = "Kullanılan Yöntem";
        ["A1", "B1", "C1", "D1", "A2", "B2", "C2", "D2"].forEach(h => { let c = ek1sayfa.getCell(h); c.alignment = { horizontal: "center", vertical: "middle" }; c.font = { name: "Calibri", bold: !0, size: 11 }; c.border = { top: { style: "thin" }, left: { style: "thin" }, bottom: { style: "thin" }, right: { style: "thin" } } });
        ek1sayfa.mergeCells("A1:D1");
        ek1sayfa.getRow(1).height = 20;
        ek1sayfa.getRow(2).height = 20;
        let satir = 3;
        if (Array.isArray(jsonveri.ortamolcumu) && jsonveri.ortamolcumu.length > 0)
        {
            const olcumtip =[{id:"1",ad:"Kişisel Maruziyet Ölçümü"},{id:"2",ad:"Noktasal Ölçüm"}];
            const unvanMap = Object.fromEntries(olcumtip.map(u => [u.id, u.ad]));
            const ortamOlcumMap = Object.fromEntries((yillikplandata.ekipmankontrol || []).filter(o => o.tur === "2").map(o => [o.id, o.kontrol]));
            let listesonuc = (jsonveri.ortamolcumu || []).map(x => ({...x,olcumAdi: ortamOlcumMap[x.id] || "", unvanAdi: unvanMap[x.y] || ""}));
            listesonuc.forEach(item =>
            {
                ek1sayfa.getCell("A" + satir).value = "Ortam Ölçümleri";
                ek1sayfa.getCell("B" + satir).value = item.t;
                ek1sayfa.getCell("C" + satir).value = item.x + "\n" + item.z;
                ek1sayfa.getCell("D" + satir).value = item.olcumAdi + " - " + item.unvanAdi;
                ["A","B","C","D"].forEach(k=>{let h=ek1sayfa.getCell(k+satir);h.font={name:"Calibri",size:11};h.alignment={horizontal:(k==="A"||k==="D")?"left":"center",vertical:"middle",wrapText:true};h.border={top:{style:"thin"},left:{style:"thin"},bottom:{style:"thin"},right:{style:"thin"}}});
                satir = satir + 1;
            });
        }
        if (bvar === true || fvar === true || tvar === true || rvar === true)
        {
            const tipMap = { r: "Radyolojik Analizler", b: "Biyolojik Analizler", t: "Toksikolojik Analizler", f: "Fizyolojik Analizler" };
            const saglikTaramaMap = Object.fromEntries((yillikplandata.sagliktarama || []).map(s => [s.id, s]));
            const listesonuc = (jsonveri.sagliktarama || []).map(x => { const eslesen = saglikTaramaMap[x.id] || {}; return {...x, taramaAdi: eslesen.tarama || "", tip: tipMap[eslesen.tip] || ""};});
            if (listesonuc.length > 0)
            {
                listesonuc.forEach(item =>
                {
                    ek1sayfa.getCell("A" + satir).value = item.tip;
                    ek1sayfa.getCell("B" + satir).value = item.t;
                    ek1sayfa.getCell("C" + satir).value = item.x + "\n" + item.y;
                    ek1sayfa.getCell("D" + satir).value = item.taramaAdi;
                    ["A","B","C","D"].forEach(k=>{let h=ek1sayfa.getCell(k+satir);h.font={name:"Calibri",size:11};h.alignment={horizontal:(k==="A"||k==="D")?"left":"center",vertical:"middle",wrapText:true};h.border={top:{style:"thin"},left:{style:"thin"},bottom:{style:"thin"},right:{style:"thin"}}});
                    satir = satir + 1;
                });
            }
        }
        if ((Array.isArray(jsonveri.acildurum) && jsonveri.acildurum.length > 0))
        {
            let acildurum = jsonveri.acildurum[0];
            ek1sayfa.getCell("A" + satir).value = "Acil Durum Planı";
            ek1sayfa.getCell("B" + satir).value = acildurum.t;
            ek1sayfa.getCell("C" + satir).value = acildurum.x + "\nİş Güvenliği Uzmanı\n" + acildurum.y + "\nİşyeri Hekimi";
            ek1sayfa.getCell("D" + satir).value = "İşyerlerinde Acil Durumlar Hakkında Yönetmelik Ek-1";
            ["A", "B", "C", "D"].forEach(k => { let h = ek1sayfa.getCell(k + satir); h.font = { name: "Calibri", size: 11 }; h.alignment = { horizontal: (k === "A" || k === "D") ? "left" : "center", vertical: "middle", wrapText: true }; h.border = { top: { style: "thin" }, left: { style: "thin" }, bottom: { style: "thin" }, right: { style: "thin" } } });
            satir = satir + 1;
        }
        if ((Array.isArray(jsonveri.tatbikat) && jsonveri.tatbikat.length > 0))
        {
            var tatbikatmaps = { 1: "Yangın Tatbikatı", 2: "Patlama Tatbikatı", 3: "Sel Tatbikatı", 4: "Kimyasal Madde Yayılım Tatbikatı", 5: "Salgın Hastalık Tatbikatı", 6: "Zehirlenme Tatbikatı", 7: "Sabotaj Tatbikatı", 8: "Radyoaktif Madde Yayılım Tatbikatı", 9: "Nükleer Madde Yayılım Tatbikatı" };
            let tatbikat = jsonveri.tatbikat[0];
            ek1sayfa.getCell("A" + satir).value = "Acil Durum Tatbikatı";
            ek1sayfa.getCell("B" + satir).value = tatbikat.t;
            ek1sayfa.getCell("C" + satir).value = tatbikat.x + "\n" + tatbikat.y;
            ek1sayfa.getCell("D" + satir).value = tatbikatmaps[tatbikat.z];
            ["A", "B", "C", "D"].forEach(k => { let h = ek1sayfa.getCell(k + satir); h.font = { name: "Calibri", size: 11 }; h.alignment = { horizontal: (k === "A" || k === "D") ? "left" : "center", vertical: "middle", wrapText: true }; h.border = { top: { style: "thin" }, left: { style: "thin" }, bottom: { style: "thin" }, right: { style: "thin" } } });
            satir = satir + 1;
        }
        if (Array.isArray(jsonveri.isekipmanikontrol) && jsonveri.isekipmanikontrol.length > 0)
        {
            const olcumtip =[{id:"0",ad:"Lütfen Seçiniz"},{id:"1",ad:"Elektrik Mühendisi"},{id:"2",ad:"Elektrik ve Elektronik Mühendisi"},{id:"3",ad:"Elektronik Mühendisi"},{id:"4",ad:"Elektrik Yüksek Teknikeri"},{id:"5",ad:"Elektrik Teknik Öğretmeni"},{id:"6",ad:"Elektrik Teknikeri"},{id:"7",ad:"İnşaat Mühendisi"},{id:"8",ad:"İnşaat Yüksek Teknikeri"},{id:"9",ad:"İnşaat Teknik Öğretmeni"},{id:"10",ad:"İnşaat Teknikeri"},{id:"11",ad:"Makine Mühendisi"},{id:"12",ad:"Makine Yüksek Teknikeri"},{id:"13",ad:"Makine Teknik Öğretmeni"},{id:"14",ad:"Makine Teknikeri"},{id:"15",ad:"Mekatronik Mühendisi"},{id:"16",ad:"Metalurji ve Malzeme Mühendisi"},{id:"17",ad:"Metal Teknik Öğretmeni"},{id:"18",ad:"Yapı Teknik Öğretmeni"}];
            const unvanMap = Object.fromEntries(olcumtip.map(u => [u.id, u.ad]));
            const ekipmanmap = Object.fromEntries((yillikplandata.ekipmankontrol || []).filter(o => o.tur === "1").map(o => [o.id, o.kontrol]));
            let listesonuc = (jsonveri.isekipmanikontrol || []).map(x => ({...x,olcumAdi: ekipmanmap[x.id] || "", unvanAdi: unvanMap[x.y] || ""}));
            listesonuc.forEach(item =>
            {
                ek1sayfa.getCell("A" + satir).value = item.olcumAdi + " (İş Ekipmanı Kontrolü)";
                ek1sayfa.getCell("B" + satir).value = item.t;
                ek1sayfa.getCell("C" + satir).value = item.x + "\n" + item.unvanAdi;
                ek1sayfa.getCell("D" + satir).value = "İş Ekipmanlarının Kullanımında Sağlık Ve Güvenlik Şartları Yönetmeliğinde Belirtilen TSE Standartları";
                ["A","B","C","D"].forEach(k=>{let h=ek1sayfa.getCell(k+satir);h.font={name:"Calibri",size:11};h.alignment={horizontal:(k==="A"||k==="D")?"left":"center",vertical:"middle",wrapText:true};h.border={top:{style:"thin"},left:{style:"thin"},bottom:{style:"thin"},right:{style:"thin"}}});
                satir = satir + 1;
            });
        }
    }
    const buffer = await kitap.xlsx.writeBuffer();
    saveAs(new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }), "EK-2 Yıllık Değerlendirme Raporu.xlsx");
}
function sagliktaramabtrf(j, y) { let i = (j.sagliktarama || []).map(x => x.id), m = {}, s = { b: !1, t: !1, r: !1, f: !1 }; (y.sagliktarama || []).forEach(x => m[x.id] = x.tip); i.forEach(id => { let t = m[id]; t && (s[t] = !0) }); return [s.b, s.t, s.r, s.f] }
