$(document).ready(function ()
{ 
    fetch("/hekim/oku").then(response =>
    {
        if (!response.ok) throw new Error("Hekim listesi alınamadı");
        return response.json();
    })
    .then(data =>
    {
        const json = Array.isArray(data) ? data : jsoncevir(data);
        store.set("hekimjson", json);
        hekimtablosuyukle(json);
    })
    .catch(() =>
    {
        mesaj('9');
    });
})

function hekimtablosuyukle(data)
{
    let json = Array.isArray(data) ? data.slice() : [];
    json.sort((a, b) => String(a?.ad || "").localeCompare(String(b?.ad || ""), 'tr-TR', { sensitivity: 'base' }));
    if ($.fn.DataTable.isDataTable('#kisitablo'))
    {
        const hekimTablosu = $('#kisitablo').DataTable();
        hekimTablosu.clear().rows.add(json).draw();
        return;
    }
    const hekimTablosu = $('#kisitablo').DataTable
    ({
        data: json,
        dom: 't',
        pageLength: -1,
        ordering: false,
        columns:
        [
            { title: "Ad Soyad", data: "ad", width: "50%", orderable: false },
            { title: "Belge No", data: "no", width: "30%", orderable: false },
            { title: "Düzenle", data: null, orderable: false, width: "10%", render: function (d, t, r) { return '<input type="button" name="duzenle" class="cssbutontamam" value="Düzenle" data-id="' + r.id + '">'; } },
            { title: "Sil", data: null, orderable: false, width: "10%", render: function (d, t, r) { return '<input type="button" name="sil" class="cssbutontamam" value="Sil" data-id="' + r.id + '">'; } }
        ],
        language: { zeroRecords: "Eşleşen kayıt bulunamadı", infoEmpty: "Kayıtlı hekim bulunamadı", emptyTable: "Kayıtlı hekim bulunamadı" },
        createdRow: function (row)
        {
            $(row).find("td").eq(0).css("text-align", "left");
            $(row).find("td").eq(1).css("text-align", "center");
        },
        headerCallback: function (thead)
        {
            $(thead).find('th').css('text-align', 'center');
        }
    });

    $('#kisitablo tbody').on('click', 'input[name="sil"]', function ()
    {
        const rowData = hekimTablosu.row($(this).closest('tr')).data();
        if (!rowData) return;
        $('#silbilgi').html(`${rowData.ad} adlı hekimi (${rowData.no}) SİLMEK istediğinizden emin misiniz ?`);
        store.set("hekimid", rowData.id);
        store.set("hekimad", rowData.ad);
        store.set("hekimno", rowData.no);
        $('#dylghekimsil').fadeIn();
    });
    $('#kisitablo tbody').on('click', 'input[name="duzenle"]', function ()
    {
        const rowData = hekimTablosu.row($(this).closest('tr')).data();
        if (!rowData) return;
        $('#adsoyad2').val(rowData.ad);
        $('#no2').val(rowData.no);
        store.set("hekimid", rowData.id);
        store.set("hekimad", rowData.ad);
        store.set("hekimno", rowData.no);
        $('#dylghekimduzenle').fadeIn();
    });
}

async function hekimtanimkaydet(kisiListesi, firmaListesi, mesajKodu)
{
    try
    {
        const kisiResponse = await fetch("/hekim/guncelle",
        {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(kisiListesi)
        });
        if (!kisiResponse.ok) throw new Error("Hekim listesi kaydedilemedi");
        const firmaDizisi = Array.isArray(firmaListesi) ? firmaListesi : null;
        if (firmaDizisi)
        {
            const firmaResponse = await fetch("/hekim/isyeri",
            {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(firmaDizisi)
            });
            if (!firmaResponse.ok) throw new Error("İşyeri listesi kaydedilemedi");
            store.set("firmajson", firmaDizisi);
        }
        store.set("hekimjson", kisiListesi);
        hekimtablosuyukle(kisiListesi);
        mesaj(mesajKodu);
    }
    catch (err)
    {
        mesaj('9');
    }
}

function hekimtanimekle()
{
    let ad = $('#adsoyad1').val().trim();
    let no = $('#no1').val().trim();
    if (!ad || !no)
    {
        alertify.error("Lütfen tüm alanları doldurunuz.");
        return false;
    }
    let json = jsoncevir(store.get("hekimjson")) || [];
    let yeni = { id: metinuret(3), ad: ad, no: no };
    json.push(yeni);
    json.sort((a, b) => a.ad.localeCompare(b.ad, 'tr-TR', { sensitivity: 'base' }));
    $('#dylghekimekle').fadeOut();
    hekimtanimkaydet(json, null, '1');
    return false;
}

function hekimtanimguncelle()
{
    let ad = $('#adsoyad2').val().trim();
    let no = $('#no2').val().trim();
    let secilen = store.get("hekimid");
    if (!ad || !no || !secilen)
    {
        alertify.error("Lütfen bir hekim seçip tüm alanları doldurunuz.");
        return false;
    }

    let json = jsoncevir(store.get("hekimjson")) || [];
    let index = json.findIndex(x => x.id === secilen);
    if (index < 0)
    {
        alertify.error("Güncellenecek kayıt bulunamadı.");
        return false;
    }

    json[index].ad = ad;
    json[index].no = no;
    json.sort((a, b) => a.ad.localeCompare(b.ad, 'tr-TR', { sensitivity: 'base' }));

    let eskiAd = store.get("hekimad");
    let eskiNo = store.get("hekimno");
    let firmalar = jsoncevir(store.get('firmajson')) || [];
    for (let i = 0; i < firmalar.length; i++)
    {
        if (firmalar[i].hk === eskiAd || firmalar[i].hn === eskiNo)
        {
            firmalar[i].hk = ad;
            firmalar[i].hn = no;
        }
    }

    $('#dylghekimduzenle').fadeOut();
    hekimtanimkaydet(json, firmalar, '2');
    return false;
}

function hekimtanimsil()
{
    let secilen = store.get("hekimid");
    if (!secilen)
    {
        alertify.error("Lütfen bir hekim seçiniz.");
        return false;
    }

    let json = jsoncevir(store.get("hekimjson")) || [];
    let silinen = json.find(x => x.id === secilen);
    if (!silinen)
    {
        alertify.error("Silinecek kayıt bulunamadı.");
        return false;
    }

    let yeniData = json.filter(x => x.id !== secilen);
    yeniData.sort((a, b) => a.ad.localeCompare(b.ad, 'tr-TR', { sensitivity: 'base' }));

    let firmalar = jsoncevir(store.get('firmajson')) || [];
    for (let i = 0; i < firmalar.length; i++)
    {
        if (firmalar[i].hk === silinen.ad || firmalar[i].hn === silinen.no)
        {
            firmalar[i].hk = "";
            firmalar[i].hn = "";
        }
    }
    $('#dylghekimsil').fadeOut();
    hekimtanimkaydet(yeniData, firmalar, '3');
    return false;
}
