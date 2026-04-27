///LOAD///LOAD///LOAD///LOAD///LOAD///LOAD///LOAD///LOAD///
async function kurulVeriYuklex7()
{
    const firmaid = kurulfirmaidbul();
    if (!firmaid)
    {
        mesajmetin("Geçerli işyeri seçilmedi");
        window.location.href = "/isyerisec?id=06";
        return;
    }
    try
    {
        const response = await fetch(`/gorevlendirmekurul/server/isgkuruluyeoku/${firmaid}`);
        if (response.status === 401)
        {
            window.location.href = "/";
            return;
        }
        const data = await response.json();
        if (!response.ok)
        {
            alertify.error(data.error || "Kurul listesi alınamadı");
            return;
        }
        $('#HiddenField1').val(JSON.stringify(Array.isArray(data) ? data : []));
        kurulgorevlendirmeload();
    }
    catch
    {
        alertify.error("Kurul listesi alınamadı");
    }
}

function kurulgorevlendirmeload()
{
    const unvanlar = kurulunvanlistesi();
    let jsonData = jsoncevir($('#HiddenField1').val());
    if (!Array.isArray(jsonData))
    {
        jsonData = [];
    }
    if (jsonData.length > 10)
    {
        jsonData = jsonData.slice(0, 10);
    }
    while (jsonData.length < 10)
    {
        jsonData.push({ a: '', u: '' });
    }
    let firmajson = isyersecimfirmaoku();
    if (!firmajson)
    {
        const urlParams = new URLSearchParams(window.location.search);
        const firmaid = urlParams.get('id');
        const firmalar = jsoncevir(store.get('firmajson'));
        firmajson = firmalar.find(f => String(f.id) === String(firmaid));
    }
    const hekimad = firmajson ? firmajson.hk : "";
    const uzmanad = store.get("uzmanad") || "";
    jsonData =
    [
        { a: uzmanad, u: "İş Güvenliği Uzmanı", _ro: true },
        { a: hekimad, u: "İşyeri Hekimi", _ro: true },
        ...jsonData
    ];
    const $dialog = $('<div id="unvanDialog" title="Unvan Seç"></div>');
    const $list = $('<div class="unvan-list"></div>');
    unvanlar.forEach(function (u)
    {
        $list.append(`<div><button type="button" class="cssbutontamam unvan-sec" data-unvan="${u}">${u}</button></div>`);
    });
    $dialog.append($list);
    $('body').append($dialog);
    $dialog.dialog({ autoOpen: false, modal: true, width: 500, height: 800 });
    $('#kurultablo').DataTable
    ({
        data: jsonData,
        dom: 't',
        pageLength: -1,
        ordering: false,
        columns:
        [
            { data: null, title: 'No', render: function (d, t, r, m) { return m.row + 1; }, width: "50px" },
            { data: 'a', title: 'Ad Soyad', render: function (d, t, r, m) { const ro = m.row < 2 ? 'readonly' : ''; return `<input type="text" value="${d}" class="csstextbox90" ${ro}>`; } },
            { data: 'u', title: 'Kurul Unvan', render: function (d, t, r, m) { const ro = m.row < 2 ? 'readonly' : ''; return `<input type="text" value="${d}" class="csstextbox90" ${ro}>`; } },
            { data: null, title: 'Unvan Yaz', render: function (d, t, r, m) { const dis = m.row < 2 ? 'disabled' : ''; return `<input type="button" class="cssbutontamam unvan-bul" data-row="${m.row}" value="Unvan Yaz" ${dis}>`; }, width: "150px" }
        ],
        createdRow: function (r)
        {
            $(r).find('td').eq(0).css('text-align', 'center');
        },
        headerCallback: function (t)
        {
            $(t).find('th').css('text-align', 'center');
        }
    });
    $('#kurultablo').off('click', '.unvan-bul').on('click', '.unvan-bul', function ()
    {
        const rowIndex = parseInt($(this).data('row'), 10);
        if (rowIndex < 2)
        {
            return;
        }
        $dialog.data('rowIndex', rowIndex);
        $dialog.dialog('open');
    });
    $dialog.off('click', '.unvan-sec').on('click', '.unvan-sec', function ()
    {
        const secilen = $(this).data('unvan');
        const rowIndex = $dialog.data('rowIndex');
        if (rowIndex < 2)
        {
            return;
        }
        const $row = $('#kurultablo').DataTable().row(rowIndex).node();
        $($row).find('td:eq(2) input').val(secilen);
        $dialog.dialog('close');
    });
}

///KAYDET///KAYDET///KAYDET///KAYDET///KAYDET///KAYDET///KAYDET///KAYDET///
async function kurulKaydetx8()
{
    if (!kurulgorevlendirmeyaz())
    {
        return false;
    }
    const firmaid = kurulfirmaidbul();
    if (!firmaid)
    {
        mesajmetin("Geçerli işyeri seçilmedi");
        return false;
    }
    try
    {
        const json = jsoncevir($('#HiddenField1').val());
        const response = await fetch(`/gorevlendirmekurul/server/isgkuruluyeguncelle/${firmaid}`,
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
        alertify.success("Kurul üyeleri güncellendi");
        return true;
    }
    catch
    {
        alertify.error("Kaydetme işlemi başarısız");
        return false;
    }
}

function kurulgorevlendirmeyaz()
{
    const table = $('#kurultablo').DataTable();
    const data = [];
    table.rows().every(function ()
    {
        const rowIndex = this.index();
        if (rowIndex < 2)
        {
            return;
        }
        const row = this.node();
        const adInput = $(row).find('td:eq(1) input');
        const unvanInput = $(row).find('td:eq(2) input');
        let adsoyad = adInput.length > 0 ? adInput.val().trim() : '';
        let unvan = unvanInput.length > 0 ? unvanInput.val().trim() : '';
        unvan = basharfbuyuk(unvan);
        adsoyad = adsoyadduzelt(adsoyad);
        if (adsoyad !== '' && unvan !== '')
        {
            data.push({ a: adsoyad, u: unvan });
        }
    });
    if (data.length === 0)
    {
        return false;
    }
    $('#HiddenField1').val(JSON.stringify(data));
    return true;
}

///RAPORLAMA///RAPORLAMA///RAPORLAMA///RAPORLAMA///RAPORLAMA///RAPORLAMA///RAPORLAMA///RAPORLAMA///
function isgkurulgorevlendirmeyazdir()
{
    let json = $('#HiddenField1').val();
    try
    {
        json = JSON.parse(json);
    }
    catch
    {
        alertify.error("Beklenmedik bir hata oluştu");
        return false;
    }
    const firmajson = isyersecimfirmaoku();
    const hekimad = firmajson.hk;
    const uzmanad = store.get("uzmanad");
    json.unshift({ a: uzmanad, u: "İş Güvenliği Uzmanı" }, { a: hekimad, u: "İşyeri Hekimi" });
    const dosyaid = metinuret(3);
    const icerik =
    [
        [{ text: 'No', style: 'header' }, { text: 'Kurul Üyesi Ad Soyad', style: 'header' }, { text: 'Kuruldaki Görevi', style: 'header' }],
        ...json.map((x, i) => [{ text: i + 1, alignment: 'center' }, x.a, x.u])
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
                widths: ['7%', '46%', '47%'],
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
    pdfMake.createPdf(dokuman).download('İSG Kurul Üyeleri - ' + dosyaid + '.pdf');
}

///YARDIMCI FONKSİYONLAR///YARDIMCI FONKSİYONLAR///YARDIMCI FONKSİYONLAR///
function kurulunvanlistesi()
{
    return ["İSG Kurul Başkanı", "İşveren Vekili", "Çalışan Baş Temsilcisi", "Çalışan Temsilcisi", "İnsan Kaynakları", "Mali İşler Sorumlusu", "Muhasebe", "Sivil Savunma Uzmanı", "Formen", "Ustabaşı", "Usta", "Alt İşveren Temsilcisi"];
}

function kurulfirmaidbul()
{
    const link = new URLSearchParams(window.location.search);
    const firmaid = (link.get("id") || store.get("xfirmaid") || "").toString().trim();
    return /^[a-z0-9]{10}$/.test(firmaid) ? firmaid : "";
}
