$(document).ready(function ()
{
    excelleduzenleloadz8();
    excelleduzenle1click();
});

function excelleduzenle1click()
{
    $(document).off('change', '#durum').on('change', '#durum', function ()
    {
        var $container = $('#excelveri');
        var containerWidth = $(window).width() * 0.8;
        excelwebayarz9($container, containerWidth, $(this).val());
    });
    $(document).off('click', '#baslat').on('click', '#baslat', function ()
    {
        exceltamamz10();
    });
}

function excelleduzenleloadz8()
{
    const firmaid = firmaidbul();
    if (!firmaid)
    {
        mesajmetin("Geçerli işyeri seçilmedi");
        window.location.href = "/isyerisec?id=02";
        return;
    }
    var $container = $('#excelveri');
    var containerWidth = $(window).width() * 0.8;
    excelwebayarz9($container, containerWidth, "0");
}

function excelwebayarz9($container, containerWidth, durum)
{
    let options = { tabs: false, toolbar: false, worksheets: [] };
    if (durum === "0")
    {
        options.worksheets.push
        ({
            minDimensions: [2, 500],
            columns: [
                { width: containerWidth / 3, title: 'Ad Soyad' },
                { width: containerWidth / 3, title: 'Unvan' }
            ]
        });
    }
    else if (durum === "1")
    {
        options.worksheets.push
        ({
            minDimensions: [3, 500],
            columns: [
                { width: containerWidth / 4, title: 'Ad' },
                { width: containerWidth / 4, title: 'Soyad' },
                { width: containerWidth / 4, title: 'Unvan' }
            ]
        });
    }
    $container.html("");
    var spreadsheetInstance = jspreadsheet($container[0], options);
    $container.css({ width: '80%', margin: '0 auto' });
    $container.data('spreadsheetInstance', spreadsheetInstance);
}

function exceltamamz10()
{
    var $container = $('#excelveri');
    var spreadsheetInstance = $container.data('spreadsheetInstance');
    var spreadsheetApi = null;
    if (spreadsheetInstance && typeof spreadsheetInstance.getData === "function")
    {
        spreadsheetApi = spreadsheetInstance;
    }
    else if (Array.isArray(spreadsheetInstance) && spreadsheetInstance[0] && typeof spreadsheetInstance[0].getData === "function")
    {
        spreadsheetApi = spreadsheetInstance[0];
    }
    if (!spreadsheetApi)
    {
        alert("Spreadsheet yüklenmedi veya instance bulunamadı!");
        return;
    }
    let durum = $('#durum').val();
    var rawData = spreadsheetApi.getData();
    var excelveri = [];

    if (durum === "0")
    {
        excelveri = $.map(rawData, function (row)
        {
            return {
                x: row[0] ? adsoyadduzelt(row[0].toString().trim()) : "",
                y: row[1] ? basharfbuyuk(row[1].toString().trim()) : ""
            };
        }).filter(function (row) { return row.x !== ""; });
    }
    else if (durum === "1")
    {
        excelveri = $.map(rawData, function (row)
        {
            let adsoyad = "";
            if (row[0] || row[1])
            {
                adsoyad = (row[0] ? row[0].toString().trim() : "") + " " +
                          (row[1] ? row[1].toString().trim() : "");
            }
            return {
                x: adsoyad ? adsoyadduzelt(adsoyad.trim()) : "",
                y: row[2] ? basharfbuyuk(row[2].toString().trim()) : ""
            };
        }).filter(function (row) { return row.x !== ""; });
    }

    const excelMap = new Map();
    excelveri.forEach(e => {
        if (!e.x) return;
        const prev = excelMap.get(e.x);
        if (!prev || (!prev.y && e.y))
        {
            excelMap.set(e.x, e);
        }
    });
    store.set('exceljson', JSON.stringify(Array.from(excelMap.values())));

    const firmaid = firmaidbul();
    window.location.href = "/calisanexcel2?id=" + encodeURIComponent(firmaid);
}

