function evrakcalisanload()
{
    let data = jsoncevir(store.get("evrakcalisan"));
    const table = $('#tablo').DataTable
    ({
        order: [[0, 'asc']],
        pageLength: -1,
        lengthMenu: [[10, 50, 100, 500, -1], [10, 50, 100, 500, "Tümü"]],
        data: data,
        columns:
        [
            { title: "Ad Soyad", data: 'x', width: "30%"},
            { title: "İSG Eğitim",data:"e",width:"19%",render:function(d,t,r){return'<input style="text-align:center" class="csstextbox100" onfocus="datepickerjquery(this)" value="'+(d||"")+'"/>';}},
            { title: "Sağlık Raporu",data:"s",width:"19%",render:function(d,t,r){return'<input style="text-align:center" class="csstextbox100" onfocus="datepickerjquery(this)" value="'+(d||"")+'"/>';}},
            { title: "İlkyardım",data:"i",width:"19%",render:function(d,t,r){return'<input style="text-align:center" class="csstextbox100" onfocus="datepickerjquery(this)" value="'+(d||"")+'"/>';}},
            { title: "Tarihleri Sil",data:null,orderable:false,width:"13%",render:function(){return'<button type="button" class="cssbutontamam sil">Sil</button>';}}
        ],
        language:{search:"Çalışan Ara: ",lengthMenu:"Sayfa başına _MENU_ kayıt göster",zeroRecords:"Eşleşen kayıt bulunamadı",info:"_TOTAL_ kayıttan _START_ ile _END_ arası gösteriliyor",infoEmpty:"Kayıt yok",infoFiltered:"(toplam _MAX_ kayıttan filtrelendi)",emptyTable:"Kayıtlı çalışan bulunamadı"},
        createdRow: function (row, data) { $(row).attr('data-id', data.id); $(row).find('td').eq(0).css('text-align', 'left');},
        headerCallback: function (thead) { $(thead).find('th').css('text-align', 'center'); },
    });
    $('.dt-search input').css({"background-color": "white",}).attr("autocomplete", "off");
    $('.dt-length select').css({ "background-color": "white", });
    $('#tablo').on('click', '.sil', function ()
    {
        const row = $(this).closest('tr');
        row.find('td:eq(1) input').val('');
        row.find('td:eq(2) input').val('');
        row.find('td:eq(3) input').val('');
        row.addClass('row-changed');
        alertify.error("Değişiklikleri tamamladığınzda KAYDET tuşuna basmayı unutmayınız");
    });
    $('#tablo').on('input change', 'input', function ()
    {
        $(this).closest('tr').addClass('row-changed');
    });
    window.evrakkayitCalisanTable = table;
}

function evrakkayitcalisankontrol()
{
    let data = jsoncevir(store.get("evrakcalisan"));
    let ok = true;
    const updates = {};
    $('#tablo tbody tr').each(function ()
    {
        var row = $(this);
        var id = row.data('id');
        if (!id)
        {
            alertify.error("Beklenmedik bir hata oluştu");
            ok = false;
            return false;
        }
        var e = row.find('td:eq(1) input').val().trim();
        var s = row.find('td:eq(2) input').val().trim();
        var i = row.find('td:eq(3) input').val().trim();
        updates[id] = { e: e, s: s, i: i };
    });
    if (!ok) return false;
    data = data.map(function (item)
    {
        const u = updates[item.id];
        return u ? Object.assign({}, item, u) : item;
    });
    store.set("evrakcalisan", data);
    $('#tablo tbody tr').removeClass('row-changed');
    return true;
}
