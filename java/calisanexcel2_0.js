let mysqljson = [];
let eklejson = [];
let siljson = [];
let gunceljson = [];

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


function excelloadkontrol()
{
    let excelveri;
    const firmaid = firmaidbul();
    if (!firmaid)
    {
        mesajmetin("Geçerli işyeri seçilmedi");
        window.location.href = "/isyerisec?id=02";
        return;
    }
    try
    {
        excelveri = jsoncevir(store.get('exceljson'));
        if (!Array.isArray(excelveri))
        {
            window.location.href = "/calisanexcel1";
            return;
        }
    }
    catch
    {
        window.location.href = "/calisanexcel1";
        return;
    }
    excelloadz11(firmaid, excelveri);
    excelduzenle2cliclk();
}

function excelkarsilastirz11(excelveri, calisanveri)
{
    mysqljson = siralamaz5(calisanveri);
    const sonjson = [];
    const excelMap = new Map();
    excelveri.forEach(e => {
        if (!e.x) return;
        const prev = excelMap.get(e.x);
        if (!prev || (!prev.y && e.y))
        {
            excelMap.set(e.x, e);
        }
    });
    const mysqlMap = new Map();
    mysqljson.forEach(m => {
        if (m && m.x) mysqlMap.set(m.x, m);
    });

    excelMap.forEach(e => {
        if (!mysqlMap.has(e.x))
        {
            sonjson.push({ x: e.x, y: e.y, sonuc: 1 });
        }
    });

    mysqljson.forEach(m => {
        const e = excelMap.get(m.x);
        if (e)
        {
            sonjson.push({
                x: e.x,
                y: e.y !== "" ? e.y : m.y,
                a: m.a,
                t: m.t,
                r: m.r,
                e: m.e,
                s: m.s,
                i: m.i,
                id: m.id,
                sonuc: 2
            });
        }
        else
        {
            sonjson.push({ x: m.x, y: m.y, id: m.id, sonuc: 0 });
        }
    });

    eklejson = sonjson.filter(x => x.sonuc === 1);
    siljson = sonjson.filter(x => x.sonuc === 0);
    gunceljson = sonjson.filter(x => x.sonuc === 2);

    tabloOlusturz27('ekletablo', eklejson);
    tabloOlusturz27('siltablo', siljson);
    tabloOlusturz27('guncelletablo', gunceljson);
}

async function excelKaydetz22(calisanlar, basariliMesaj)
{
    const kayitBasarili = await calisanListeKaydetz20(calisanlar, basariliMesaj);
    if (!kayitBasarili)
    {
        return false;
    }
    mysqljson = calisanlar;
    return true;
}

function eklez12()
{
    if (eklejson.length === 0)
    {
        alertify.warning("Yeni eklenecek çalışan bulunamadı.");
        return false;
    }
    const yeniCalisanlar = [...mysqljson];
    const mevcutAdSet = new Set(yeniCalisanlar.map(x => x.x));
    eklejson.forEach(c => {
        if (!mevcutAdSet.has(c.x))
        {
            yeniCalisanlar.push({ x: c.x, y: c.y, a: 0, t: 0, r: 0, e: "", s: "", i: "", id: metinuret(3) });
            mevcutAdSet.add(c.x);
        }
    });
    return siralamaz5(yeniCalisanlar);
}

async function ekleKaydetz23()
{
    const yeniCalisanlar = eklez12();
    if (!yeniCalisanlar)
    {
        return false;
    }
    if (!await excelKaydetz22(yeniCalisanlar, "Çalışanlar eklendi"))
    {
        return false;
    }
    eklejson = [];
    $('#ekletablo').DataTable().clear().draw();
    return true;
}

function silz13()
{
    const silinecekler = siljson.map(x => x.id);
    if (silinecekler.length === 0)
    {
        alertify.warning("Silinecek çalışan bulunamadı.");
        return false;
    }
    const yeniCalisanlar = mysqljson.filter(calisan => !silinecekler.includes(calisan.id));
    return siralamaz5(yeniCalisanlar);
}

async function silKaydetz24()
{
    const yeniCalisanlar = silz13();
    if (!yeniCalisanlar)
    {
        return false;
    }
    if (!await excelKaydetz22(yeniCalisanlar, "Çalışanlar silindi"))
    {
        return false;
    }
    siljson = [];
    $('#siltablo').DataTable().clear().draw();
    return true;
}

function guncellez14()
{
    if (gunceljson.length === 0)
    {
        alertify.warning("Güncellenecek çalışan bulunamadı.");
        return false;
    }
    const guncelleMap = new Map(gunceljson.map(x => [x.id, x]));
    const yeniCalisanlar = mysqljson.map(c => guncelleMap.has(c.id) ? { ...c, x: guncelleMap.get(c.id).x, y: guncelleMap.get(c.id).y } : c);
    return siralamaz5(yeniCalisanlar);
}

async function guncelleKaydetz25()
{
    const yeniCalisanlar = guncellez14();
    if (!yeniCalisanlar)
    {
        return false;
    }
    if (!await excelKaydetz22(yeniCalisanlar, "Çalışanlar güncellendi"))
    {
        return false;
    }
    gunceljson = [];
    $('#guncelletablo').DataTable().clear().draw();
    return true;
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

function siralamaz5(json)
{
    return json.sort((a, b) => a.x.localeCompare(b.x, 'tr-TR', { sensitivity: 'base' }));
}
