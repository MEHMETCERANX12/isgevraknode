$(document).ready(function ()
{
    calisanlisteload();
    calisanlisteclick();
});

function calisanlisteclick()
{
    $(document).off('click', 'input[name="Ekle"]').on('click', 'input[name="Ekle"]', function ()
    {
        $('#adsoyad1').val('');
        $('#unvan1').val('');
        $('#diyalogekle').fadeIn();
    });
    $('#tablo').off('click', 'input[name="Duzenle"]').on('click', 'input[name="Duzenle"]', function ()
    {
        var id = $(this).data('id');
        var json = jsoncevir(store.get('mysqljson'));
        json = json.find(r => r.id == id);
        if (json)
        {
            $('#adsoyad2').val(json.x);
            $('#unvan2').val(json.y);
            store.set("calisanid", id);
            $('#diyalogduzenle').fadeIn();
        }
    });
    $('#tablo').off('click', 'input[name="Sil"]').on('click', 'input[name="Sil"]', function ()
    {
        var id = $(this).data('id');
        var json = jsoncevir(store.get('mysqljson'));
        json = json.find(r => r.id == id);
        if (json)
        {
            $('#silbilgi').text(json.x + " adlı çalışanı silmek istediğinizden emin misiniz ?");
            store.set("calisanid", id);
            $('#diyalogsil').fadeIn();
        }
    });
    $(document).off('click', 'input[name="Tumsil"]').on('click', 'input[name="Tumsil"]', function ()
    {
        $('#diyalogtumunusil').fadeIn();
    });
    $(document).off('click', 'input[name="PDF"]').on('click', 'input[name="PDF"]', function ()
    {
        calisanlistepdfyazz7();
    });
    $(document).off('click', 'input[name="EXCEL"]').on('click', 'input[name="EXCEL"]', function ()
    {
        calisanlisteexcelyazz6();
    });
    $(document).off('click', 'input[name="EkleKaydet"]').on('click', 'input[name="EkleKaydet"]', function ()
    {
        ekleKaydetz15();
    });
    $(document).off('click', 'input[name="GuncelleKaydet"]').on('click', 'input[name="GuncelleKaydet"]', function ()
    {
        guncelleKaydetz16();
    });
    $(document).off('click', 'input[name="SilKaydet"]').on('click', 'input[name="SilKaydet"]', function ()
    {
        silKaydetz17();
    });
    $(document).off('click', 'input[name="TumunuSilKaydet"]').on('click', 'input[name="TumunuSilKaydet"]', function ()
    {
        tumunuSilKaydetz18();
    });
    $(document).off('click', '.dylgkapat').on('click', '.dylgkapat', function ()
    {
        $(this).closest('.dylg').fadeOut();
    });
}

function listeloadz1()
{
    var json = jsoncevir(store.get('mysqljson'));
    if ($.fn.DataTable.isDataTable('#tablo'))
    {
        $('#tablo').DataTable().clear().destroy();
        $('#tablo').empty();
    }
    $('#tablo').DataTable
    ({
        data: json,
        pageLength: 10,
        lengthMenu: [[10, 50, 100, 500, -1], ['10', '50', '100', '500']],
        order: [[0, 'asc']],
        columns:
        [
            { title: "Ad", data: "x" },
            { title: "Unvan", data: "y" },
            { title: "Düzenle", data: "id", orderable: false, searchable: false, render: function (d) { return '<input type="button" class="cssbutontamam" value="Düzenle" name="Duzenle" data-id="' + d + '">'; } },
            { title: "Sil", data: "id", orderable: false, searchable: false, render: function (d) { return '<input type="button" class="cssbutontamam" value="Sil" name="Sil" data-id="' + d + '">'; } }
        ],
        language: { search: "Çalışan Ara:", lengthMenu: "Sayfa başına _MENU_ kayıt göster", zeroRecords: "Böyle bir çalışan bulunamadı", info: "_TOTAL_ kayıttan _START_ ile _END_ arası gösteriliyor", infoEmpty: "Kayıt yok", infoFiltered: "(toplam _MAX_ kayıttan filtrelendi)", emptyTable: "Kayıtlı çalışan bulunamadı" },
        createdRow: function (row)
        {
            $(row).find('td').eq(0).css('text-align', 'left');
            $(row).find('td').eq(1).css('text-align', 'left');
            $(row).find('td').eq(2).css('text-align', 'center');
            $(row).find('td').eq(3).css('text-align', 'center');
        },
        headerCallback: function (thead) { $(thead).find('th').css('text-align', 'center'); }
    });
    $('.dt-search input').css({ "background-color": "white" }).attr("autocomplete", "off");
    $('.dt-length select').css({ "background-color": "white" });
}

async function ekleKaydetz15()
{
    if (!jsoneklez2())
    {
        return false;
    }
    return await calisanlisteguncellez20("Çalışan eklendi");
}

async function guncelleKaydetz16()
{
    if (!jsonguncellez3())
    {
        return false;
    }
    return await calisanlisteguncellez20("Çalışan güncellendi");
}

async function silKaydetz17()
{
    if (!jsonsilz4())
    {
        return false;
    }
    return await calisanlisteguncellez20("Çalışan silindi");
}

async function tumunuSilKaydetz18()
{
    store.set('mysqljson', '[]');
    $('#diyalogtumunusil').fadeOut();
    return await calisanlisteguncellez20("Tüm çalışanlar silindi");
}

function jsoneklez2()
{
    let json = jsoncevir(store.get('mysqljson'));
    var calisanad = $('#adsoyad1').val().trim();
    var calisanunvan = $('#unvan1').val().trim();
    if (!calisanad)
    {
        alertify.error("Ad Soyad boş olamaz.");
        return false;
    }
    var yenicalisan = { id: metinuret(3), x: calisanad, y: calisanunvan, a: 0, t: 0, r: 0, e: "", s: "", i: "" };
    json.push(yenicalisan);
    json = siralamaz5(json);
    store.set('mysqljson', JSON.stringify(json));
    $('#diyalogekle').fadeOut();
    return true;
}

function jsonguncellez3()
{
    let data = jsoncevir(store.get('mysqljson'));
    var calisanid = store.get("calisanid");
    var calisanad = $('#adsoyad2').val().trim();
    var unvan = $('#unvan2').val().trim();
    if (!calisanad)
    {
        alertify.error("Ad Soyad boş olamaz.");
        return false;
    }
    var kontrol = false;
    for (var i = 0; i < data.length; i++)
    {
        if (data[i].id == calisanid)
        {
            data[i].x = calisanad;
            data[i].y = unvan;
            kontrol = true;
            break;
        }
    }
    if (kontrol === false)
    {
        alertify.error("Güncellenecek çalışan bulunamadı.");
        return false;
    }
    data = siralamaz5(data);
    store.set('mysqljson', JSON.stringify(data));
    $('#diyalogduzenle').fadeOut();
    return true;
}

function jsonsilz4()
{
    try
    {
        let json = jsoncevir(store.get('mysqljson'));
        var calisanid = store.get("calisanid");
        json = json.filter(r => r.id != calisanid);
        json = siralamaz5(json);
        store.set('mysqljson', JSON.stringify(json));
        $('#diyalogsil').fadeOut();
        return true;
    }
    catch
    {
        $('#diyalogsil').fadeOut();
        alertify.error("Çalışan silinemedi");
        return false;
    }
}

async function calisanlisteexcelyazz6()
{
    let dosyaid = metinuret(3);
    let json = jsoncevir(store.get('mysqljson'));
    json = siralamaz5(json);
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Çalışan Listesi", {
        pageSetup: {
            paperSize: 9,
            orientation: 'portrait',
            margins: {
                left: 0.7, right: 0.7,
                top: 0.7, bottom: 0.7,
                header: 0.3, footer: 0.3
            }
        }
    });
    sheet.addRow(["No", "Çalışan Ad Soyad", "Çalışan Unvan"]);
    json.forEach((x, i) => {
        sheet.addRow([i + 1, x.x, x.y]);
    });
    sheet.columns = [
        { width: 7 },
        { width: 35 },
        { width: 35 }
    ];
    const headerRow = sheet.getRow(1);
    headerRow.eachCell((cell) => {
        cell.font = { bold: true };
        cell.alignment = { horizontal: "center", vertical: "middle" };
        cell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "FFE0E0E0" }
        };
        cell.border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            right: { style: 'thin' },
            bottom: { style: 'thin' }
        };
    });
    sheet.eachRow((row) => {
        row.eachCell((cell) => {
            cell.border = {
                top: { style: 'thin' },
                left: { style: 'thin' },
                right: { style: 'thin' },
                bottom: { style: 'thin' }
            };
            cell.alignment = { vertical: "middle" };
        });
    });
    sheet.getColumn(1).alignment = { horizontal: "center" };
    const buffer = await workbook.xlsx.writeBuffer();
    saveAs(new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }), `Çalışan Listesi - ${dosyaid}.xlsx`);
}

function calisanlistepdfyazz7()
{
    let dosyaid = metinuret(3);
    let json = jsoncevir(store.get('mysqljson'));
    json = siralamaz5(json);
    const icerik =
    [
        [{ text: 'No', style: 'header' }, { text: 'Çalışan Ad Soyad', style: 'header' }, { text: 'Çalışan Unvan', style: 'header' }],
        ...json.map((x, i) => [{ text: i + 1, alignment: 'center' }, x.x, x.y])
    ];
    const dokuman =
    {
        pageSize: 'A4',
        pageMargins: [30, 30, 30, 30],
        content: [{ table: { headerRows: 1, widths: ['7%', '46%', '47%'], body: icerik }, layout: 'solid' }],
        styles: { header: { fontSize: 12, bold: true, alignment: 'center' } },
    };
    pdfMake.createPdf(dokuman).download('Çalışan Listesi - ' + dosyaid + '.pdf');
}

function siralamaz5(json)
{
    return json.sort((a, b) => a.x.localeCompare(b.x, 'tr-TR', { sensitivity: 'base' }));
}
