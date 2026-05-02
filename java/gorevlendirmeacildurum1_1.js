///LOAD///LOAD///LOAD///LOAD///LOAD///LOAD///LOAD///LOAD///
async function gorevlendirmeacilloadx1()
{
    const firmaid = firmaidbul();
    if (!firmaid)
    {
        mesajmetin("Geçerli işyeri seçilmedi");
        window.location.href = "/isyerisec?id=03";
        return;
    }
    try
    {
        const response = await fetch(`/gorevlendirmeacil/calisanoku/${firmaid}`);
        if (response.status === 401)
        {
            window.location.href = "/";
            return;
        }
        const data = await response.json();
        if (!response.ok)
        {
            alertify.error(data.error || "Çalışan listesi alınamadı");
            return;
        }
        $('#HiddenField1').val(JSON.stringify(Array.isArray(data) ? data : []));
    }
    catch
    {
        alertify.error("Çalışan listesi alınamadı");
    }
}

function gorevlendirmeacildurumload()
{
    const ekipliste = acilidurumlistesi();
    let calisanjson = jsoncevir($('#HiddenField1').val());
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
                data: "a",
                title: "Acil Durum Görevi",
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
        store.set('acildurumsecim', veri);
        const mevcutGorev = veri.a ? parseInt(veri.a, 10) : 0;
        $('#gorevselect').val(mevcutGorev);
        $('#dylgacildurum').fadeIn();
    });
}
///KAYDET///KAYDET///KAYDET///KAYDET///KAYDET///KAYDET///KAYDET///KAYDET///
async function gorevlendirmeacilkaydetx4()
{
    if (!grvacilguncellekontrol())
    {
        return false;
    }
    return await grvacilkaydet("Görevlendirme güncellendi");
}

function grvacilguncellekontrol()
{
    const secilen = store.get('acildurumsecim');
    if (!secilen || !secilen.id)
    {
        mesajmetin("Seçilen çalışan bulunamadı.");
        return false;
    }
    const yeniGorev = parseInt($('#gorevselect').val(), 10);
    let calisanlar = jsoncevir($('#HiddenField1').val());
    if (!Array.isArray(calisanlar))
    {
        calisanlar = [];
    }
    const index = calisanlar.findIndex(x => x.id === secilen.id);
    if (index !== -1)
    {
        calisanlar[index].a = yeniGorev;
    }
    else
    {
        mesajmetin("Seçilen çalışan bulunamadı.");
        return false;
    }
    $('#HiddenField1').val(JSON.stringify(calisanlar));
    const tablo = $('#tablo').DataTable();
    const rowIndex = tablo.rows().eq(0).filter(function (i)
    {
        return tablo.row(i).data().id === secilen.id;
    });
    if (rowIndex.length > 0)
    {
        const rowData = tablo.row(rowIndex[0]).data();
        rowData.a = yeniGorev;
        tablo.row(rowIndex[0]).data(rowData).invalidate();
    }
    $('#dylgacildurum').fadeOut();
    return true;
}

async function grvacilkaydet(basariliMesaj)
{
    const firmaid = firmaidbul();
    if (!firmaid)
    {
        mesajmetin("Geçerli işyeri seçilmedi");
        return false;
    }
    try
    {
        const json = jsoncevir($('#HiddenField1').val());
        const response = await fetch(`/gorevlendirmeacil/calisanguncelle/${firmaid}`,
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
function gorevlendirmeacildurumpdf()
{
    const ekipliste = acilidurumlistesi();
    let json = jsoncevir($('#HiddenField1').val());
    if (!json || json.length === 0)
    {
        alertify.error("Görevli çalışan bulunamadı");
        return false;
    }
    json = json.filter(x => x.a !== 0);
    if (!json || json.length === 0)
    {
        alertify.error("Görevli çalışan bulunamadı");
        return false;
    }
    json.sort((a, b) => a.a - b.a);
    const dosyaid = metinuret(3);
    const icerik =
    [
        [
            { text: 'No', style: 'header' },
            { text: 'Çalışan Ad Soyad', style: 'header' },
            { text: 'Acil Durum Ekip Görevi', style: 'header' }
        ],
        ...json.map((x, i) => [{ text: i + 1, alignment: 'center' }, x.x, ekipliste[x.a] || "Bilinmiyor"])
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
    pdfMake.createPdf(dokuman).download('Acil Durum Ekibi - ' + dosyaid + '.pdf');
}
///YARDIMCI FONKSİYONLAR///YARDIMCI FONKSİYONLAR///YARDIMCI FONKSİYONLAR///
function acilidurumlistesi()
{
    return {
        0: "Görevli Değil",
        1: "İlkyardım Ekibi - Ekip Başı",
        2: "İlkyardım Ekibi - Ekip Personeli",
        3: "Söndürme Ekibi - Ekip Başı",
        4: "Söndürme Ekibi - Ekip Personeli",
        5: "Koruma Ekibi - Ekip Başı + Koordinasyon",
        6: "Koruma Ekibi - Ekip Personeli + Koordinasyon",
        7: "Koruma Ekibi - Ekip Personeli",
        8: "Kurtarma Ekibi - Ekip Başı",
        9: "Kurtarma Ekibi - Ekip Personeli",
        10: "Destek Elemanı"
    };
}

function firmaidbul()
{
    const link = new URLSearchParams(window.location.search);
    const firmaid = (link.get("id") || store.get("xfirmaid") || "").toString().trim();
    return /^[a-z0-9]{10}$/.test(firmaid) ? firmaid : "";
}
