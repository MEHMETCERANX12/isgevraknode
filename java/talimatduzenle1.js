function talimatduzenle1load(talimatjson)
{
    $('#talimattablo').DataTable
    ({
        data: talimatjson,
        columns: [
            { data: 'b', title: 'İSG Talimat Adı', width: '80%' },
            { data: 'i', title: 'Düzenle', orderable: false, width: '10%', render: (data) => `<input name="duzenle" type="button" class="cssbutontamam" value="Düzenle" data-id="${data}"/>` },
            { data: 'i', title: 'Sil', orderable: false, width: '10%', render: (data) => `<input name="sil" type="button" class="cssbutontamam" value="Sil" data-id="${data}"/>` }
        ],
        language: { search: "İSG Talimat Ara:", lengthMenu: "Sayfa başına _MENU_ kayıt göster", zeroRecords: "Eşleşen kayıt bulunamadı", info: "_TOTAL_ kayıttan _START_ ile _END_ arası gösteriliyor", infoEmpty: "Kayıt yok", infoFiltered: "(toplam _MAX_ kayıttan filtrelendi)", emptyTable: "İSG Talimat Bulunamadı" },
        createdRow: function (row) { $(row).find('td').eq(0).css('text-align', 'left'); },
        headerCallback: function (thead) { $(thead).find('th').css('text-align', 'center'); }
    });
    $('.dt-search input').css({ "background-color": "white" }).attr("autocomplete", "off");
    $('.dt-length select').css({ "background-color": "white" });
    $(document).off('click.talimatduzenle').on('click.talimatduzenle', 'input[name="duzenle"]', function ()
    {
        const id = parseInt($(this).data('id'), 10);
        const ad = $(this).closest('tr').find('td:eq(0)').text().trim();
        store.set("talimatduzenlead", ad);
        if (!Number.isInteger(id) || id <= 0)
        {
            alertify.error("Beklenmedik bir hata oluştu");
            return false;
        }
        window.location.href = `/talimatduzenle2?id=${encodeURIComponent(id)}`;
    });
    $(document).off('click.talimatsil').on('click.talimatsil', 'input[name="sil"]', function ()
    {
        const i = $(this).data('id');
        const ad = $(this).closest('tr').find('td:eq(0)').text().trim();
        store.set("talimatduzenlead", ad);
        $("#mesajicerik").text(`${ad} SİLMEK istediğinizden emin misiniz?`);
        $("#diyolagtalimatsil").fadeIn();
        store.set("talimatduzenle1silid", i);
    });
}

function talimatduzenle1sil()
{
    let secimid = parseInt(store.get("talimatduzenle1silid"), 10);
    if (isNaN(secimid) || secimid <= 0)
    {
        alertify.error("Beklenmedik bir hata oluştu");
        return false;
    }
    let json = jsoncevir(store.get("talimatjson"));
    if (!Array.isArray(json))
    {
        alertify.error("Veri bulunamadı");
        return false;
    }
    return isgtalimatsilsql(secimid, json);
}