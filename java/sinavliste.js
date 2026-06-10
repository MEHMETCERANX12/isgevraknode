function sinavSablonEkleSayfasinaGit()
{
    window.location.href = "/sinavekle";
}

async function sinavSablonListeYukle()
{
    try
    {
        const response = await fetch('/sinavliste/oku/');
        const sonuc = await response.json().catch(function () { return {}; });
        if (!response.ok || !sonuc.success)
        {
            alertify.error((sonuc && sonuc.error) || "Sınav şablon listesi yüklenemedi.");
            sinavSablonListeTabloOlustur([]);
            return false;
        }

        sinavSablonListeTabloOlustur(Array.isArray(sonuc.data) ? sonuc.data : []);
        return true;
    }
    catch (err)
    {
        console.error("sinav sablon liste hata", err);
        alertify.error("Sınav şablon listesi yüklenemedi.");
        sinavSablonListeTabloOlustur([]);
        return false;
    }
}

async function sinavSablonSil()
{
    var sablonId = $("#sinavsablonsildiyalog").attr("data-id");
    if (!sablonId)
    {
        alertify.error("Silinecek şablon bulunamadı.");
        return false;
    }
    try
    {
        const response = await fetch('/sinavliste/sil/' + encodeURIComponent(sablonId),
        {
            method: "DELETE"
        });
        const sonuc = await response.json().catch(function () { return {}; });
        if (!response.ok || !sonuc.success)
        {
            alertify.error((sonuc && sonuc.error) || "Şablon silinemedi.");
            return false;
        }

        var tablo = $("#sinavsablonlistetablo").DataTable();
        tablo.rows(function (idx, data)
        {
            return String(data.id) === String(sablonId);
        }).remove().draw();
        $("#sinavsablonsildiyalog").removeAttr("data-id").fadeOut();
        alertify.message("Şablon silindi.");
        return true;
    }
    catch (err)
    {
        console.error("sinav sablon sil hata", err);
        alertify.error("Şablon silinemedi.");
        return false;
    }
}

function sinavSablonListeTabloOlustur(liste)
{
    if ($.fn.DataTable.isDataTable("#sinavsablonlistetablo"))
    {
        $("#sinavsablonlistetablo").DataTable().clear().destroy();
    }

    $("#sinavsablonlistetablo").DataTable({
        data: Array.isArray(liste) ? liste : [],
        pageLength: -1,
        order: false,
        lengthMenu: [[10, 25, 50, 100, -1], [10, 25, 50, 100, "Tümü"]],
        columns:
        [
            { data: "i", title: "Şablon Adı", width: "70%" },
            {
                data: null,
                title: "Düzenle",
                orderable: false,
                width: "15%",
                render: function (data, type, row)
                {
                    return '<input type="button" class="cssbutontamam" value="Düzenle" data-id="' + sinavSablonHtml(row.id) + '" onclick="sinavSablonDuzenleGoster(this);" />';
                }
            },
            {
                data: null,
                title: "Sil",
                orderable: false,
                width: "15%",
                render: function (data, type, row)
                {
                    return '<input type="button" class="cssbutontamam" value="Sil" data-id="' + sinavSablonHtml(row.id) + '" onclick="sinavSablonSilDiyalogAc(this);" />';
                }
            }
        ],
        language:
        {
            search: "Şablon Ara:",
            lengthMenu: "Sayfa başına _MENU_ kayıt göster",
            zeroRecords: "Sınav şablonu bulunamadı",
            info: "_TOTAL_ kayıttan _START_ ile _END_ arası gösteriliyor",
            infoEmpty: "Sınav şablonu bulunamadı",
            infoFiltered: "(toplam _MAX_ kayıttan filtrelendi)",
            emptyTable: "Sınav şablonu bulunamadı"
        },
        createdRow: function (row)
        {
            $(row).find("td").eq(0).css("text-align", "left");
        },
        headerCallback: function (thead)
        {
            $(thead).find("th").css("text-align", "center");
        }
    });

    $(".dt-search input").css({ "background-color": "white" }).attr("autocomplete", "off");
    $(".dt-length select").css({ "background-color": "white" });
}
function sinavSablonSilDiyalogAc(button)
{
    var sablonId = $(button).attr("data-id");
    $("#sinavsablonsildiyalog").attr("data-id", sablonId).fadeIn();
}

function sinavSablonDuzenleGoster(button)
{
    var sablonId = $(button).attr("data-id");
    if (!sablonId)
    {
        alertify.error("Düzenlenecek şablon bulunamadı.");
        return;
    }

    window.location.href = "/sinavduzenle?id=" + encodeURIComponent(sablonId);
}

function sinavSablonHtml(deger)
{
    return $("<div>").text(deger == null ? "" : String(deger)).html();
}
