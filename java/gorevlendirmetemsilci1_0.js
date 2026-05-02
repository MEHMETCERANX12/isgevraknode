///LOAD///LOAD///LOAD///LOAD///LOAD///LOAD///LOAD///LOAD///
$(document).ready(async function ()
{
    const firmaid = temsilcifirmaidbul();
    let calisanjson = [];
    if (!firmaid)
    {
        mesajmetin("Geçerli işyeri seçilmedi");
        window.location.href = "/isyerisec?id=04";
        return;
    }
    try
    {
        const response = await fetch(`/gorevlendirmetemsilci/calisanoku/${firmaid}`);
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
        store.set("gorevlendirmetemsilci", calisanjson);
    }
    catch
    {
        alertify.error("Çalışan listesi alınamadı");
    }
    const ekipliste = temsilcilistesi();
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
                data: 't',
                title: 'Çalışan Temsilcisi',
                render: function (d)
                {
                    const k = parseInt(d, 10);
                    return typeof ekipliste[k] !== "undefined" ? ekipliste[k] : "Bilinmiyor";
                }
            },
            {
                data: null,
                title: 'Görevlendirme',
                orderable: false,
                render: function ()
                {
                    return '<input name="sec" type="button" class="cssbutontamam" value="Seç"/>';
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
        store.set('temsilcisecim', veri);
        const mevcutGorev = veri.t ? parseInt(veri.t, 10) : 0;
        $('#gorevselect').val(mevcutGorev);
        $('#dylgcalisantemsilcisi').fadeIn();
    });
});

///KAYDET///KAYDET///KAYDET///KAYDET///KAYDET///KAYDET///KAYDET///KAYDET///
async function gorevlendirmetemsilcikaydetx5()
{
    if (!gorevlendirmetemsilciguncelle())
    {
        return false;
    }
    return await temsilcikaydet("Görevlendirme güncellendi");
}

function gorevlendirmetemsilciguncelle()
{
    const secilen = store.get('temsilcisecim');
    if (!secilen || !secilen.id)
    {
        mesajmetin("Seçilen çalışan bulunamadı.");
        return false;
    }
    const yeniGorev = parseInt($('#gorevselect').val(), 10);
    let calisanlar = jsoncevir(store.get("gorevlendirmetemsilci"));
    if (!Array.isArray(calisanlar))
    {
        calisanlar = [];
    }
    const index = calisanlar.findIndex(x => x.id === secilen.id);
    if (index !== -1)
    {
        calisanlar[index].t = yeniGorev;
    }
    else
    {
        mesajmetin("Seçilen çalışan bulunamadı.");
        return false;
    }
    store.set("gorevlendirmetemsilci", JSON.stringify(calisanlar));
    const tablo = $('#tablo').DataTable();
    const rowIndex = tablo.rows().eq(0).filter(function (i)
    {
        return tablo.row(i).data().id === secilen.id;
    });
    if (rowIndex.length > 0)
    {
        const rowData = tablo.row(rowIndex[0]).data();
        rowData.t = yeniGorev;
        tablo.row(rowIndex[0]).data(rowData).invalidate();
    }
    $('#dylgcalisantemsilcisi').fadeOut();
    return true;
}

async function temsilcikaydet(basariliMesaj)
{
    const firmaid = temsilcifirmaidbul();
    if (!firmaid)
    {
        mesajmetin("Geçerli işyeri seçilmedi");
        return false;
    }
    try
    {
        const json = jsoncevir(store.get("gorevlendirmetemsilci"));
        const response = await fetch(`/gorevlendirmetemsilci/calisanguncelle/${firmaid}`,
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
function gorevlendirmetemsilcipdf()
{
    const ekipliste = temsilcilistesi();
    let json = jsoncevir(store.get("gorevlendirmetemsilci"));
    if (!json || json.length === 0)
    {
        alertify.error("Görevli çalışan bulunamadı");
        return false;
    }
    json = json.filter(x => x.t !== 0);
    if (!json || json.length === 0)
    {
        alertify.error("Görevli temsilci bulunamadı");
        return false;
    }
    json.sort((a, b) => b.t - a.t);
    const dosyaid = metinuret(3);
    const icerik =
    [
        [
            { text: 'No', style: 'header' },
            { text: 'Çalışan Ad Soyad', style: 'header' },
            { text: 'Temsilci Görevi', style: 'header' }
        ],
        ...json.map((x, i) => [{ text: i + 1, alignment: 'center' }, x.x, ekipliste[x.t] || "Bilinmiyor"])
    ];
    const dokuman =
    {
        pageSize: 'A4',
        pageMargins: [30, 30, 30, 30],
        content:
        [{
            table:
            {
                headerRows: 1,
                widths: ['7%', '36%', '57%'],
                body: icerik
            },
            layout: 'solid'
        }],
        styles:
        {
            header:
            {
                fontSize: 12,
                bold: true,
                alignment: 'center'
            }
        }
    };
    pdfMake.createPdf(dokuman).download('Çalışan Temsilcisi - ' + dosyaid + '.pdf');
}

///YARDIMCI FONKSİYONLAR///YARDIMCI FONKSİYONLAR///YARDIMCI FONKSİYONLAR///
function temsilcilistesi()
{
    return {
        0: "Görevli Değil",
        1: "Çalışan Temsilcisi",
        2: "Çalışan Baş Temsilcisi"
    };
}

function temsilcifirmaidbul()
{
    const link = new URLSearchParams(window.location.search);
    const firmaid = (link.get("id") || store.get("xfirmaid") || "").toString().trim();
    return /^[a-z0-9]{10}$/.test(firmaid) ? firmaid : "";
}
