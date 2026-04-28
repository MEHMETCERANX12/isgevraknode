async function sildevamx6()
{
    $('#isyersil').fadeOut();
    let id = store.get("isyerisilmeid");
    let firmajson = jsoncevir(store.get('firmajson')) || {};
    try
    {
        if (!id || !/^[a-z0-9]{10}$/.test(id))
        {
            alertify.error("Geçersiz işyeri");
            return false;
        }
        if (!Array.isArray(firmajson))
        {
            alertify.error("Beklenmedik bir hata oluştu");
            return false;
        }
        const yeniListe = firmajson.filter(item => item && item.id != id);
        const response = await fetch(`/isyeriliste/kayitsil/${id}`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(yeniListe)
        });
        const result = await response.json();
        if (!response.ok)
        {
            alertify.error(result.error || "Silme hatası");
            return false;
        }
        store.set('firmajson', yeniListe);
        store.remove("isyerisilmeid");
        alertify.success("İşyeri silindi");
        window.location.href = "/isyeriliste";
        return true;
    }
    catch (e)
    {
        alertify.error("Hata: " + e.message);
        return false;
    }
}

function listeloadx7()
{
    let firmajson = jsoncevir(store.get('firmajson')) || [];
    $('#isyeritablo tbody').off('click', 'input[name="duzenle"]');
    $('#isyeritablo tbody').off('click', 'input[name="liste-sil"]');
    if (firmajson)
    {
        $('#isyeritablo').DataTable({
            data: firmajson,
            columns:
            [
                { data: 'fi', title: 'Firma İsmi' },
                { data: 'fk', title: 'Kısa İsim' },
                { data: 'id', title: 'İşlem', orderable: !1, render: e => `<div class="cssdivortala cssgapbuton"><input type="button" name="duzenle" class="cssbutontamam" value="Düzenle" data-id="${e}"/><input type="button" name="liste-sil" class="cssbutontamam" value="Sil" data-id="${e}"/></div>` }
            ],
            pageLength: 10,
            lengthMenu: [ [10, 50, 100, 500, -1], ['10', '50', '100', '500', 'Tümü'] ],
            order: [[0, 'asc']],
            language:{search:"İşyeri Ara:",lengthMenu: "Sayfa başına _MENU_ kayıt göster",zeroRecords:"Eşleşen kayıt bulunamadı",info:"_TOTAL_ kayıttan _START_ ile _END_ arası gösteriliyor",infoEmpty:"Kayıt yok",infoFiltered:"(toplam _MAX_ kayıttan filtrelendi)",emptyTable:"Kayıtlı işyeri bulunamadı"},
            createdRow: function (row) { $(row).find('td').eq(0).css('text-align', 'left'); $(row).find('td').eq(1).css('text-align', 'left'); },
            headerCallback: function (thead){$(thead).find('th').css('text-align', 'center');}
        });
    }
    else
    {
        alertify.error("Beklenmedik bir hata oluştu");
    }
    $('.dt-search input').css({ "background-color": "white" }).attr("autocomplete", "off");
    $('.dt-length select').css({ "background-color": "white" });
    $('#isyeritablo tbody').on('click', 'input[name="duzenle"]', function ()
    {
        let id = $(this).data('id');
        window.location.href = "/isyeriduzenle?id=" + encodeURIComponent(id);
    });
    $('#isyeritablo tbody').on('click', 'input[name="liste-sil"]', function ()
    {
        let id = $(this).data('id');
        store.set("isyerisilmeid", id);
        $("#isyersil").fadeIn();
    });
}

function pdfyazdirx8()
{
    let json = jsoncevir(store.get('firmajson')) || {};
    if (!json || json.length === 0) { return false; }
    let dosyaid = metinuret(3);
    const icerik =
    [
        [{ text: 'No', style: 'header' }, { text: 'İşyeri Unvanı', style: 'header' }, { text: 'İşyeri Adresi', style: 'header' }, { text: 'İşyeri Hekimi', style: 'header' }, { text: isverenunvanioku(), style: 'header' }, { text: 'SGK Sicil No', style: 'header' }, { text: 'Şehir', style: 'header' }],
        ...json.map((x,i)=>[{text:i+1,alignment:'center'},x.fi,x.ad,x.hk,x.is,x.sc,x.sh])
    ];
    const dokuman =
    {
        pageSize: 'A4',
        pageOrientation: 'landscape',
        pageMargins: [20, 20, 20, 20],
        content:
        [
            {
                table:
                {
                    headerRows: 1,
                    widths: ['auto','auto','auto','auto','auto','auto','auto'],
                    body: icerik
                },
                layout: 'solid'
            }
        ],
        styles: { header: { fontSize: 12, bold: true, alignment: 'center' }}
    };
    pdfMake.createPdf(dokuman).download('İşyeri Listesi - ' + dosyaid + '.pdf');
}
