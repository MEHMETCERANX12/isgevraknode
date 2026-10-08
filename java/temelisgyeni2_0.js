$(document).ready(async function ()
{
    let firmaid = firmaidbul();
    let calisanjson = [];
    store.set('temelisgyeni2calisanload', '0');
    if (!/^[a-z0-9]{10}$/.test(firmaid))
    {
        mesajmetin('Geçersiz işyeri seçimi.');
        return;
    }    
    try
    {
        var response = await fetch('/temelisgyeni2/calisanoku/' + encodeURIComponent(firmaid));
        if (!response.ok)
        {
            throw new Error('Çalışan listesi alınamadı.');
        }
        calisanjson = await response.json();
        store.set('calisanjson', calisanjson);
        store.set('kontrol', '1');
    }
    catch (err)
    {
        store.set('calisanjson', '[]');   
        store.set('kontrol', '0');
        mesajmetin('Çalışan listesi alınamadı.');
    }
    $('#tablo').DataTable
    ({
        data: calisanjson,
        order: [[1, 'asc']],
        pageLength: 10,
        lengthMenu: [[10, 50, 100, 500, -1], [10, 50, 100, 500, "Tümü"]],
        columns:[{data:null,orderable:false,render:DataTable.render.select(),width:"80px"},{data:"x",title:"Ad Soyad"},{data:"y",title:"Unvan"}],
        select: { style: 'multi', selector: 'td:first-child'},
        language:{select:{rows:"%d satır seçildi"},search:"Çalışan Ara:",lengthMenu:"Sayfa başına _MENU_ kayıt göster",zeroRecords:"Çalışan bulunamadı",info:"_TOTAL_ kayıttan _START_ ile _END_ arası gösteriliyor",infoEmpty:"Çalışan bulunamadı",infoFiltered:"(toplam _MAX_ kayıttan filtrelendi)",emptyTable:"Çalışan bulunamadı"},
        createdRow:function(r){$(r).find("td").eq(1).css("text-align","left");$(r).find("td").eq(2).css("text-align","left");},
        headerCallback: function (thead) { $(thead).find('th').css('text-align', 'center');}
    });
    $('.dt-search input').css({ "background-color": "white" }).attr("autocomplete", "off");
    $('.dt-length select').css({ "background-color": "white" });
 });


function temelisgyeni2devamt5()
{
    try
    {
        if (store.get('kontrol') === '0')
        {
            alertify.error('Çalışan listesi alınamadı. Sayfayı yenileyip tekrar deneyiniz');
            return false;
        }
        var calisansecim = dokumancalisansecim();
        var egitimtarihi = store.get('isgegitimkayittarih') || '';
        var calisanjson = jsoncevir(store.get('calisanjson'));
        if (calisansecim.length > 0)
        {
            calisansecim.forEach(function (secili)
            {
                calisanjson.forEach(function (item)
                {
                    if (item.x === secili.a && item.y === secili.u)
                    {
                        item.e = egitimtarihi;
                    }
                });
            });
            store.set('calisanjson', calisanjson);
        }
        store.set("calisansecim", JSON.stringify(calisansecim));
        store.set('dosyaciktitipi', '11');
        return true;
    }
    catch
    {
        alertify.error('Doküman sayfasına dönüp tekrar deneyiniz');
        return false;
    }
}

async function temelisgyeni2tamam()
{
    if (!temelisgyeni2devamt5())
    {
        return false;
    }
    var firmaid = firmaidbul();
    if (!/^[a-z0-9]{10}$/.test(firmaid))
    {
        mesajmetin('Geçersiz işyeri seçimi.');
        return false;
    }
    var calisansecim = jsoncevir(store.get('calisansecim'));
    if (calisansecim.length > 0)
    {
        let calisanjson = jsoncevir(store.get('calisanjson'));
        try
        {
            var response = await fetch(
                '/temelisgyeni2/calisanguncelle/' + encodeURIComponent(firmaid),
                {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(calisanjson)
                }
            );

            if (!response.ok)
            {
                throw new Error('Çalışan listesi güncellenemedi.');
            }
        }
        catch (err)
        {
            console.error('temelisgyeni2 güncelle hata', err);
            mesaj('9');
            return false;
        }
    }
    window.location.href = '/dosyacikti';
    return false;
}
