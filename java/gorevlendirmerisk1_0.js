///LOAD///LOAD///LOAD///LOAD///LOAD///LOAD///LOAD///LOAD///
$(document).ready(async function ()
{
    const firmaid = riskfirmaidbul();
    let calisanjson = [];
    if (!firmaid)
    {
        mesajmetin("Geçerli işyeri seçilmedi");
        window.location.href = "/isyerisec?id=05";
        return;
    }
    try
    {
        const response = await fetch(`/gorevlendirmerisk/calisanoku/${firmaid}`);
        if (response.status === 401)
        {
            window.location.href = "/";
            return;
        }
        calisanjson = await response.json();
        if (!response.ok)
        {
            alertify.error(calisanjson.error || "Çalışan listesi alınamadı");
            return;
        }
        store.set("gorevlendirmerisk", calisanjson);
    }
    catch
    {
        alertify.error("Çalışan listesi alınamadı");
    }
    const ekipliste = riskgorevlistesi();
    calisanjson = jsoncevir(calisanjson);
    if (!Array.isArray(calisanjson))
    {
        calisanjson = [];
    }
    const table = $('#tablo').DataTable
    ({
        data: calisanjson,
        columns:
        [
            { data: 'x', title: 'Ad Soyad' },
            { data: 'y', title: 'Unvan' },
            {
                data: "r",
                title: "Risk Görevi",
                render: function (d)
                {
                    const k = parseInt(d, 10);
                    return typeof ekipliste[k] !== "undefined" ? ekipliste[k] : "Bilinmiyor";
                }
            },
            {
                data: null,
                title: "Görevlendirme",
                orderable: false,
                render: function ()
                {
                    return '<input type="button" name="sec" class="cssbutontamam" value="Seç"/>';
                }
            }
        ],
        order: [[0, 'asc']],
        pageLength: 500,
        lengthMenu: [[10, 25, 50, 100, 500], [10, 25, 50, 100, 500]],
        columnDefs: [{ orderable: false, targets: '_all' }],
        language:
        {
            search: "Çalışan Ara: ",
            lengthMenu: "Sayfa başına _MENU_ kayıt göster",
            zeroRecords: "Çalışan bulunamadı",
            info: "_TOTAL_ kayıttan _START_ ile _END_ arası gösteriliyor",
            infoEmpty: "Çalışan bulunamadı",
            infoFiltered: "(toplam _MAX_ kayıttan filtrelendi)",
            emptyTable: "Kayıtlı çalışan bulunamadı"
        },
        createdRow: function (row)
        {
            $(row).find("td").eq(0).css("text-align", "left");
            $(row).find("td").eq(1).css("text-align", "left");
            $(row).find("td").eq(2).css("text-align", "left");
        },
        headerCallback: function (thead)
        {
            $(thead).find('th').css('text-align', 'center');
        }
    });
    $('.dt-search input').css({ "background-color": "white" }).attr("autocomplete", "off");
    $('.dt-length select').css({ "background-color": "white" });
    $('#tablo').off('click', 'input[name="sec"]').on('click', 'input[name="sec"]', function ()
    {
        const veri = table.row($(this).closest('tr')).data();
        store.set('risksecim', veri);
        const mevcutGorev = veri.r ? parseInt(veri.r, 10) : 0;
        $('#gorevselect').val(mevcutGorev);
        $('#dylgriskanaliziekip').fadeIn();
    });
});

///KAYDET///KAYDET///KAYDET///KAYDET///KAYDET///KAYDET///KAYDET///KAYDET///
async function gorevlendirmeriskkaydetx6()
{
    if (!gorevlendirmeriskanaliziekipguncelle())
    {
        return false;
    }
    return await riskkaydet("Görevlendirme güncellendi");
}

function gorevlendirmeriskanaliziekipguncelle()
{
    const secilen = store.get('risksecim');
    if (!secilen || !secilen.id)
    {
        mesajmetin("Seçilen çalışan bulunamadı.");
        return false;
    }
    const yeniGorev = parseInt($('#gorevselect').val(), 10);
    let calisanlar = jsoncevir(store.get("gorevlendirmerisk"));
    if (!Array.isArray(calisanlar))
    {
        calisanlar = [];
    }
    if (yeniGorev !== 0)
    {
        const mevcut = calisanlar.find(x => x.id !== secilen.id && parseInt(x.r, 10) === yeniGorev);
        if (mevcut)
        {
            mesajmetin("Bu görev için zaten bir çalışan seçilmiş.");
            return false;
        }
    }
    const index = calisanlar.findIndex(x => x.id === secilen.id);
    if (index !== -1)
    {
        calisanlar[index].r = yeniGorev;
    }
    else
    {
        mesajmetin("Seçilen çalışan bulunamadı.");
        return false;
    }
    store.set("gorevlendirmerisk", JSON.stringify(calisanlar));
    const tablo = $('#tablo').DataTable();
    const rowIndex = tablo.rows().eq(0).filter(function (i)
    {
        return tablo.row(i).data().id === secilen.id;
    });
    if (rowIndex.length > 0)
    {
        const rowData = tablo.row(rowIndex[0]).data();
        rowData.r = yeniGorev;
        tablo.row(rowIndex[0]).data(rowData).invalidate();
    }
    $('#dylgriskanaliziekip').fadeOut();
    return true;
}

async function riskkaydet(basariliMesaj)
{
    const firmaid = riskfirmaidbul();
    if (!firmaid)
    {
        mesajmetin("Geçerli işyeri seçilmedi");
        return false;
    }
    try
    {
        const json = jsoncevir(store.get("gorevlendirmerisk"));
        const response = await fetch(`/gorevlendirmerisk/calisanguncelle/${firmaid}`,
        {
            method: "PUT",
            headers:
            {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(Array.isArray(json) ? json : [])
        });
        const result = await response.json();
        if (!response.ok)
        {
            alertify.error(result.error || "Kaydetme işlemi başarısız");
            return false;
        }
        if (basariliMesaj)
        {
            alertify.success(basariliMesaj);
        }
        return true;
    }
    catch
    {
        alertify.error("Kaydetme işlemi başarısız");
        return false;
    }
}

///RAPORLAMA///RAPORLAMA///RAPORLAMA///RAPORLAMA///RAPORLAMA///RAPORLAMA///RAPORLAMA///RAPORLAMA///
function gorevlendirmeriskanaliziekippdf()
{
    const ekipliste = riskgorevlistesi();
    let json = jsoncevir(store.get("gorevlendirmerisk"));
    if (!json || json.length === 0)
    {
        alertify.error("Görevli çalışan bulunamadı");
        return false;
    }
    json = json.filter(x => x.r !== 0);
    if (!json || json.length === 0)
    {
        alertify.error("Görevli çalışan bulunamadı");
        return false;
    }
    json = json.map(x => ({ adsoyad: x.x, unvan: x.y, gorev: ekipliste[x.r] || "Bilinmiyor" }));
    let isyerijson = isyersecimfirmaoku();
    if (!isyerijson)
    {
        const urlParams = new URLSearchParams(window.location.search);
        const firmaid = urlParams.get('id');
        const firmalar = jsoncevir(store.get('firmajson'));
        isyerijson = firmalar.find(f => String(f.id) === String(firmaid));
    }
    if (!isyerijson)
    {
        alertify.error("İşyeri bulunamadı");
        return false;
    }
    const isveren = isyerijson.is || "";
    const hekim = isyerijson.hk || "";
    const uzman = store.get('uzmanad') || "";
    const ekle =
    [
        { adsoyad: isveren, unvan: isverenunvanioku(), gorev: isverenunvanioku() },
        { adsoyad: uzman, unvan: "İş Güvenliği Uzmanı", gorev: "İş Güvenliği Uzmanı" },
        { adsoyad: hekim, unvan: "İşyeri Hekimi", gorev: "İşyeri Hekimi" }
    ];
    json = [...ekle, ...json];
    const tableBody =
    [
        [{ text: "Ad Soyad", bold: true, alignment: "center" }, { text: "Unvan", bold: true, alignment: "center" }, { text: "Ekip Görevi", bold: true, alignment: "center" }],
        ...json.map(x => [{ text: x.adsoyad, alignment: "left" }, { text: x.unvan, alignment: "left" }, { text: x.gorev, alignment: "left" }])
    ];
    const docDefinition =
    {
        content:
        [
            { text: 'Risk Değerlendirme Ekip Listesi', style: 'header' },
            {
                style: "tableExample",
                table:
                {
                    headerRows: 1,
                    widths: ["33%", "42%", "25%"],
                    body: tableBody
                }
            }
        ],
        styles:
        {
            header:
            {
                fontSize: 16,
                bold: true,
                margin: [0, 0, 0, 5],
                alignment: "center"
            },
            tableExample:
            {
                margin: [0, 10, 0, 5]
            }
        }
    };
    pdfMake.createPdf(docDefinition).getBlob(blob => saveAs(blob, "Risk Değerlendirme Ekibi - " + metinuret(2) + ".pdf"));
}

///YARDIMCI FONKSİYONLAR///YARDIMCI FONKSİYONLAR///YARDIMCI FONKSİYONLAR///
function riskgorevlistesi()
{
    return {
        0: "Görevli Değil",
        1: "Destek Elemanı",
        2: "Çalışan Temsilcisi",
        3: "Bilgi Sahibi Çalışan"
    };
}

function riskfirmaidbul()
{
    const link = new URLSearchParams(window.location.search);
    const firmaid = (link.get("id") || store.get("xfirmaid") || "").toString().trim();
    return /^[a-z0-9]{10}$/.test(firmaid) ? firmaid : "";
}
