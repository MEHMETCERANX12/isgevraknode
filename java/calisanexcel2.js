$(document).ready(function ()
{
    excelloadz11();
    excelduzenle2cliclk();
});

function excelduzenle2cliclk()
{
    $(document).off('click', 'input[name="ExcelEkleKaydet"]').on('click', 'input[name="ExcelEkleKaydet"]', function ()
    {
        ekleKaydetz23();
    });
    $(document).off('click', 'input[name="ExcelSilKaydet"]').on('click', 'input[name="ExcelSilKaydet"]', function ()
    {
        silKaydetz24();
    });
    $(document).off('click', 'input[name="ExcelGuncelleKaydet"]').on('click', 'input[name="ExcelGuncelleKaydet"]', function ()
    {
        guncelleKaydetz25();
    });
}

function excelloadz11()
{
    let mysqljson;
    try
    {
        mysqljson = jsoncevir(store.get('mysqljson'));
    }
    catch
    {
        alertify.error("Kayıtlı çalışan verisi okunamadı.");
        mysqljson = [];
    }
    $('#HiddenField1').val(JSON.stringify(mysqljson));
    let ekleData, silData, guncelleData;
    try
    {
        ekleData = jsoncevir(store.get('eklejson'));
        silData = jsoncevir(store.get('siljson'));
        guncelleData = jsoncevir(store.get('gunceljson'));
    }
    catch
    {
        alertify.error("Excel karşılaştırma verisi okunamadı.");
        ekleData = [];
        silData = [];
        guncelleData = [];
    }
    tabloOlusturz27('ekletablo', ekleData);
    tabloOlusturz27('siltablo', silData);
    tabloOlusturz27('guncelletablo', guncelleData);
}

async function calisanListeKaydetz20(basariliMesaj)
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
        const response = await fetch(`/calisanexcel2/calisanguncelle/${firmaid}`,
        {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(Array.isArray(json) ? json : [])
        });
        const result = await response.json();
        if (!response.ok)
        {
            alertify.error(result.error || "Kayıt işlemi başarısız");
            return false;
        }
        if (basariliMesaj)
        {
            alertify.success(basariliMesaj);
        }
        return true;
    }
    catch (e)
    {
        alertify.error("Kayıt işlemi başarısız");
        return false;
    }
}

async function excelKaydetz22(basariliMesaj)
{
    const kayitBasarili = await calisanListeKaydetz20(basariliMesaj);
    if (!kayitBasarili)
    {
        return false;
    }
    excelloadz11();
    return true;
}

function eklez12()
{
    let mysqlData;
    try
    {
        mysqlData = jsoncevir($('#HiddenField1').val());
    }
    catch
    {
        alertify.error("Çalışan verisi okunamadı.");
        return false;
    }
    const eklejsonStr = store.get('eklejson');
    if (!eklejsonStr)
    {
        alertify.error("Eklenmek üzere çalışan bulunamadı.");
        return false;
    }
    let ekleData;
    try
    {
        ekleData = jsoncevir(eklejsonStr);
    }
    catch
    {
        alertify.error("Eklenecek çalışan verisi okunamadı.");
        return false;
    }
    if (ekleData.length === 0)
    {
        alertify.warning("Yeni eklenecek çalışan bulunamadı.");
        return false;
    }
    const mevcutAdSet = new Set(mysqlData.map(x => x.x));
    ekleData.forEach(c => {
        if (!mevcutAdSet.has(c.x))
        {
            mysqlData.push({ x: c.x, y: c.y, a: 0, t: 0, r: 0, e: "", s: "", i: "", id: metinuret(3) });
            mevcutAdSet.add(c.x);
        }
    });
    mysqlData = siralamaz5(mysqlData);
    store.set('mysqljson', JSON.stringify(mysqlData));
    $('#HiddenField1').val(JSON.stringify(mysqlData));
    store.set('eklejson', '[]');
    $('#ekletablo').DataTable().clear().draw();
    return true;
}

async function ekleKaydetz23()
{
    if (!eklez12())
    {
        return false;
    }
    return await excelKaydetz22("Çalışanlar eklendi");
}

function silz13()
{
    let mysqlData;
    try
    {
        mysqlData = jsoncevir($('#HiddenField1').val());
    }
    catch
    {
        alertify.error("Çalışan verisi okunamadı.");
        return false;
    }
    const siljsonStr = store.get('siljson');
    if (!siljsonStr)
    {
        alertify.error("Silinecek çalışan bilgisi bulunamadı.");
        return false;
    }
    let silData;
    try
    {
        silData = jsoncevir(siljsonStr);
    }
    catch
    {
        alertify.error("Silinecek çalışan verisi okunamadı.");
        return false;
    }
    const silinecekler = silData.map(x => x.id);
    if (silinecekler.length === 0)
    {
        alertify.warning("Silinecek çalışan bulunamadı.");
        return false;
    }
    mysqlData = mysqlData.filter(calisan => !silinecekler.includes(calisan.id));
    mysqlData = siralamaz5(mysqlData);
    $('#HiddenField1').val(JSON.stringify(mysqlData));
    store.set('mysqljson', JSON.stringify(mysqlData));
    store.set('siljson', '[]');
    $('#siltablo').DataTable().clear().draw();
    return true;
}

async function silKaydetz24()
{
    if (!silz13())
    {
        return false;
    }
    return await excelKaydetz22("Çalışanlar silindi");
}

function guncellez14()
{
    let mysqlData;
    try
    {
        mysqlData = jsoncevir($('#HiddenField1').val());
    }
    catch
    {
        alertify.error("Çalışan verisi okunamadı.");
        return false;
    }
    const gunceljsonStr = store.get('gunceljson');
    if (!gunceljsonStr)
    {
        alertify.error("Güncellenecek çalışan bilgisi bulunamadı.");
        return false;
    }
    let guncelData;
    try
    {
        guncelData = jsoncevir(gunceljsonStr);
    }
    catch
    {
        alertify.error("Güncellenecek çalışan verisi okunamadı.");
        return false;
    }
    if (guncelData.length === 0)
    {
        alertify.warning("Güncellenecek çalışan bulunamadı.");
        return false;
    }
    const guncelleMap = new Map(guncelData.map(x => [x.id, x]));
    mysqlData = mysqlData.map(c => guncelleMap.has(c.id) ? { ...c, x: guncelleMap.get(c.id).x, y: guncelleMap.get(c.id).y } : c);
    mysqlData = siralamaz5(mysqlData);
    store.set('mysqljson', JSON.stringify(mysqlData));
    $('#HiddenField1').val(JSON.stringify(mysqlData));
    store.set('gunceljson', '[]');
    $('#guncelletablo').DataTable().clear().draw();
    return true;
}

async function guncelleKaydetz25()
{
    if (!guncellez14())
    {
        return false;
    }
    return await excelKaydetz22("Çalışanlar güncellendi");
}

function tabloOlusturz27(tabloId, data)
{
    $(`#${tabloId}`).DataTable
    ({
        destroy: true,
        data: data,
        order: [[0, 'asc']],
        dom: 't',
        pageLength: -1,
        language: { zeroRecords: "Bulunamadı", emptyTable: "Bulunamadı" },
        columns:
        [
            { data: 'x', title: 'Ad Soyad' },
            { data: 'y', title: 'Unvan' }
        ],
        createdRow: function (row)
        {
            $(row).find('td').eq(0).css('text-align', 'left');
            $(row).find('td').eq(1).css('text-align', 'left');
        },
        headerCallback: function (thead) { $(thead).find('th').css('text-align', 'center'); }
    });
}

function firmaidbul()
{
    const link = new URLSearchParams(window.location.search);
    const firmaid = (link.get("id") || store.get("xfirmaid") || "").toString().trim();
    return /^[a-z0-9]{10}$/.test(firmaid) ? firmaid : "";
}

function siralamaz5(json)
{
    return json.sort((a, b) => a.x.localeCompare(b.x, 'tr-TR', { sensitivity: 'base' }));
}
