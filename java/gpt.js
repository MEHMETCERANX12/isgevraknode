function gptriskdegerlendirmetamam1()
{
    let riskdegerlendirme = $('#riskdegerlendirme').val().trim();
    if (gptriskdegerlendirmekontrol(riskdegerlendirme) === false)
    {
        alertify.error("ChatGPT'den risk değerlendirmesini tekrar kopyalayıp yapıştırınız");
        $('#riskdegerlendirme').val("");
        return false;
    }
    store.set("gptriskdegerlendirme", riskdegerlendirme);
    $("#HiddenField1").val(riskdegerlendirme);
    $("#HiddenField2").val(store.get("uzmanad"));
    riskdegerlendirme = jsoncevir(riskdegerlendirme);
    $("#HiddenField3").val(riskdegerlendirme.x[0]);
    return true;
}

function gptriskimportload()
{
    try
    {
        const uzman = jsoncevir(store.get("uzmanjson"));
        if (!store.get("uzmanad") && Array.isArray(uzman) && uzman.length > 0)
        {
            store.set("uzmanad", String(uzman[0].uz || "").trim());
        }
    }
    catch (err)
    {
        console.error("gptriskimportload uzman oku hata:", err);
    }

    $("#gptriskkaydet").off("click").on("click", async function ()
    {
        const riskdegerlendirme = $("#riskdegerlendirme").val().trim();
        if (!gptriskdegerlendirmekontrol(riskdegerlendirme))
        {
            alertify.error("ChatGPT'den risk değerlendirmesini tekrar kopyalayıp yapıştırınız");
            $("#riskdegerlendirme").val("").trigger("focus");
            return;
        }

        const jsonData = jsoncevir(riskdegerlendirme);
        const ad = Array.isArray(jsonData.x) && jsonData.x.length > 0 ? String(jsonData.x[0] || "").trim() : "";
        const yazar = String(store.get("uzmanad") || "").trim();
        if (!ad)
        {
            alertify.error("Risk değerlendirme başlığı bulunamadı");
            return;
        }
        if (!yazar)
        {
            alertify.error("Uzman adı bulunamadı. Oturumu kapatıp tekrar giriş yapınız");
            return;
        }

        $("#gptriskkaydet").prop("disabled", true);
        gptriskdurumgoster("Kayıt oluşturuluyor...");
        kayit(jsonData, ad, yazar);
    });
}

function gptriskdurumgoster(metin)
{
    $("#gptriskdurum").text(String(metin || "")).show();
}

function gptriskdegerlendirmekontrol(data)
{
    let jsonData;
    try
    {
        jsonData = JSON.parse(data);
    }
    catch (e)
    {
        console.error("JSON parse hatası:", e);
        return false;
    }
    if (typeof jsonData !== 'object' || jsonData === null || Array.isArray(jsonData)) {
        return false;
    }
    if (!Array.isArray(jsonData.x) || jsonData.x.length === 0) return false;
    if (!jsonData.x.every(x => typeof x === "string" && x.trim() !== "")) return false;
    if (!Array.isArray(jsonData.w) || jsonData.w.length === 0) return false;

    for (const risk of jsonData.w)
    {
        if (typeof risk !== "object" || risk === null || Array.isArray(risk)) return false;
        for (const key of ["b", "c", "d", "e"]) {
            if (typeof risk[key] !== "string" || risk[key].trim() === "") return false;
        }
        for (const key of ["k", "l", "m"]) {
            if (typeof risk[key] !== "number" || !Number.isFinite(risk[key]) || risk[key] <= 0) return false;
        }
        if (!Array.isArray(risk.q) || risk.q.length === 0) return false;

        for (const onlem of risk.q) {
            if (typeof onlem !== "object" || onlem === null || Array.isArray(onlem)) return false;
            if (typeof onlem.f !== "string" || onlem.f.trim() === "") return false;
            if (typeof onlem.g !== "string" || onlem.g.trim() === "") return false;
        }
    }
    return true;
}

function tehlikeanalizjsonkontrol()
{
    let value = $("#riskdegerlendirme").val().trim();
    if (!value) return false;
    try
    {
        const data = JSON.parse(value);
        if (!Array.isArray(data) || data.length === 0) return false;
        const item = data[0];
        if (!item.baslik || !item.veri || !Array.isArray(item.veri)) return false;
        const requiredKeys = ["a", "b", "s", "f", "o"];
        const isValidVeri = item.veri.length > 0 && item.veri.every(kayit =>
        {
            if (typeof kayit !== "object" || kayit === null) return false;
            const keys = Object.keys(kayit);
            return ( requiredKeys.every(k => keys.includes(k)) && keys.every(k => requiredKeys.includes(k)));
        });
        return isValidVeri;
    }
    catch (e)
    {
        return false;
    }
}

function tehlikeanalizjson()
{
    if (tehlikeanalizjsonkontrol())
    {
        $("#bolum1").fadeOut(300, function () { $("#bolum2").fadeIn(300); });
        const data = JSON.parse($("#riskdegerlendirme").val());
        store.set("tehlikeanaliz", $("#riskdegerlendirme").val());
        tehlikeanaliztabloolustur();
    }
    else
    {
        $("#bolum2").fadeOut(300, function () { $("#bolum1").fadeIn(300); });
    }
}

function tehlikeanaliztabloolustur()
{
    const json = JSON.parse(store.get("tehlikeanaliz"));
    const veri = json[0].veri;
    const $tablo = $("#tehlikeanaliztablo");
    if ($.fn.DataTable.isDataTable($tablo))
    {
        const tablo = $tablo.DataTable();
        tablo.clear().rows.add(veri).draw();
        return;
    }
    $tablo.DataTable
    ({
        data: veri,
        dom: 't',
        columns: [
            { data: 'a', title: 'Tehlike Tanımı' },
            { data: 'b', title: 'Olası Sonuç' },
            { data: 's', title: 'Şdt' },
            { data: 'f', title: 'Frk' },
            { data: 'o', title: 'Ols' }
        ],
        pageLength: -1,
        language: { search: "Kayıt Ara:", zeroRecords: "Kayıt bulunamadı", info: "TOTAL kayıttan START - END arası gösteriliyor", infoEmpty: "Kayıt bulunamadı", emptyTable: "Kayıt yok" },
        createdRow: function (row)
        {
            $(row).find('td').eq(0).css('text-align', 'left');
            $(row).find('td').eq(1).css('text-align', 'left');
            $(row).find('td').eq(2).css('text-align', 'center');
            $(row).find('td').eq(3).css('text-align', 'center');
            $(row).find('td').eq(4).css('text-align', 'center');
        },
        headerCallback: function (thead) { $(thead).find('th').css('text-align', 'center');}
    });
}

function tehlikeanalizpdfaktar()
{
    const json = JSON.parse(store.get("tehlikeanaliz"));
    const baslik = (json[0].baslik[0] + " Raporu") || "Tehlike Analizi";
    const veri = json[0].veri;
    const tabloGovdesi = [
        [
            { text: 'Tehlike Tanımı', style: 'tableHeader' },
            { text: 'Olası Sonuç', style: 'tableHeader' },
            { text: 'Şdt', style: 'tableHeader' },
            { text: 'Frk', style: 'tableHeader' },
            { text: 'Ols', style: 'tableHeader' }
        ],
        ...veri.map((kayit) => [
            { text: kayit.a, style: 'tableCell' },
            { text: kayit.b, style: 'tableCell' },
            { text: kayit.s, style: 'tableCell', alignment: 'center' },
            { text: kayit.f, style: 'tableCell', alignment: 'center' },
            { text: kayit.o, style: 'tableCell', alignment: 'center' }
        ])
    ];

    const belgeTanim = {
        pageOrientation: 'landscape',
        pageMargins: [40, 40, 40, 40],
        content: [
            { text: baslik, style: 'title', margin: [0, 0, 0, 15] },
            {
                table: {
                    headerRows: 1,
                    widths: ['*', '*', 'auto', 'auto', 'auto'],
                    body: tabloGovdesi
                },
                layout: {
                    fillColor: (rowIndex) => (rowIndex === 0 ? '#eeeeee' : null),
                    hLineWidth: () => 0.5,
                    vLineWidth: () => 0.5,
                    paddingTop: () => 8,
                    paddingBottom: () => 8
                }
            }
        ],
        styles:
        {
            title: { fontSize: 16, bold: true, alignment: 'center' },
            tableHeader: { bold: true, fontSize: 11, alignment: 'center' },
            tableCell: { fontSize: 10 }
        }
    };
    pdfMake.createPdf(belgeTanim).download(`${baslik}.pdf`);
}
