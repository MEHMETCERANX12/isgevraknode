const riskOlasiEtkiSecenekleri = [
    {
        baslik: "İş Kazası",
        secenekler: [
            "Ölümlü iş kazası",
            "Ölümlü veya ağır yaralanmalı iş kazası",
            "Ağır yaralanmalı iş kazası",
            "Uzuv kayıplı iş kazası",
            "Ağır veya hafif yaralanmalı iş kazası",
            "Hafif yaralanmalı iş kazası",
            "Ciltte yüzeysel yanık",
            "Uzuvların kesilmesi veya yaralanması",
            "Gıda tüketimine bağlı zehirlenme",
            "Kimyasalın yutulmasına bağlı zehirlenme",
            "Toksik gaz/buhar maruziyetine bağlı akut zehirlenme",
            "Kimyasala temasa bağlı ciltte tahriş",
            "Ağır malzeme düşmesine bağlı ezilme veya kırık"
        ]
    },
    {
        baslik: "Meslek Hastalığı",
        secenekler: [
            "Solunum yoluna bağlı meslek hastalığı",
            "Biyolojik etkenlere bağlı meslek hastalığı",
            "Kalıcı İşitme kaybı",
            "Kimyasal buharın solunması sonucu oluşabilecek meslek hastalıkları",
            "Kas iskelet sistemine bağlı meslek hastalıkları",
            "Görme hasarı veya görme bozuklukları"
        ]
    }
];

const riskMaruzKalanCalisanSecenekleri = [
    "Operatör",
    "Operatör ve yakınında bulunan diğer kişiler",
    "Tüm çalışanlar",
    "Tüm çalışanlar ve 3. şahıslar",
    "Gürültüye maruz kalan çalışanlar",
    "Toza maruz kalan çalışanlar",
    "Kimyasal buhara maruz kalan çalışanlar",
    "Zararlı gaza maruz kalan çalışanlar",
    "Ağır yük taşıyan çalışanlar"
];

function riskStoreJsonOku(anahtar)
{
    return jsoncevir(store.get(anahtar));
}

function riskDuzenleVeriOku()
{
    return riskStoreJsonOku("riskduzenleveri");
}

function riskDuzenleVeriYaz(veri)
{
    store.set("riskduzenleveri", veri);
    const veriKopyasi = JSON.parse(JSON.stringify(veri));
    if (Array.isArray(veriKopyasi.w))
    {
        veriKopyasi.w.forEach(item => { delete item.id; });
    }
    store.set("riskduzenlekayitjson", veriKopyasi);
}

function duzenleload2r2()
{
    riskrehbertablor12();
    riskiceaktartablor13();
    $('#siddetsecim, #frekanssecim, #olasiliksecim').on('change', riskhesaplama);
    $(document).off('click.riskaddegistir', 'input[name="addegistir"]').on('click.riskaddegistir', 'input[name="addegistir"]', function ()
    {
        let adjson = riskDuzenleVeriOku();
        $('#riskdegerlendirmead').val(adjson.x[0]);
        $('#diyologriskad').fadeIn();
    });
    $(document).off('click.riskyeniekle', 'input[name="yeniekle"]').on('click.riskyeniekle', 'input[name="yeniekle"]', function ()
    {
        riskduzenletemizle();
        store.set("riskkontrol", "2");
        $('#diyologriskduzenleme').fadeIn();
    });
    $(document).off('click.riskiceaktar', 'input[name="riskiceaktar"]').on('click.riskiceaktar', 'input[name="riskiceaktar"]', function ()
    {
        $('#diyologrisklistesi').fadeIn();
    });
    let veri = riskDuzenleVeriOku();
    veri.w.forEach(item =>
    {
        if (!item.hasOwnProperty('id'))
        {
            item.id = Math.floor(Math.random() * 1000000) + 1;
        }
    });
    riskDuzenleVeriYaz(veri);
    riskduzenlelisteyukle();
    $(document).off('click.riskduzenle', 'input[name="riskduzenle"]').on('click.riskduzenle', 'input[name="riskduzenle"]', function ()
    {
        riskduzenletemizle();
        store.set("riskkontrol", "1");
        const id = $(this).data('id');
        const veri = riskDuzenleVeriOku();
        const index = veri.w.findIndex(item => item.id === id);
        store.set("riskindex", index);
        const riskicerik = veri.w[index];
        $('#b').val(riskicerik.b);
        $('#c').val(riskicerik.c);
        $('#d').val(riskicerik.d);
        $('#e').val(riskicerik.e);
        $('#siddetsecim').val(String(riskicerik.k));
        $('#frekanssecim').val(String(riskicerik.l));
        $('#olasiliksecim').val(String(riskicerik.m));
        $('#siddetsecim, #frekanssecim, #olasiliksecim').trigger('change');
        $('#diyologriskduzenleme').fadeIn(function () {$('#diyologriskduzenleme .dylg-content').animate({ scrollTop: 0 }, 200);});
        riskicerik.q.forEach((qitem, i) =>
        {
            const index = i + 1;
            $('#f' + index).val(qitem.f);
            $('#g' + index).val(qitem.g);
        });
    });
    $(document).off('click.risksil', 'input[name="risksil"]').on('click.risksil', 'input[name="risksil"]', function ()
    {
        const id = $(this).data('id');
        const veri = riskDuzenleVeriOku();
        const index = veri.w.findIndex(item => item.id === id);
        store.set("riskindex", index);
        store.set("riskkontrol", "3");
        $('#diyologrisksil').fadeIn();
    });
    $(document).off('click.riskkismikopyala', 'input[name="riskkismikopyala"]').on('click.riskkismikopyala', 'input[name="riskkismikopyala"]', async function ()
    {
        const id = $(this).data('id');
        const veri = riskDuzenleVeriOku();
        const kaynak = veri.w.find(item => item.id === id);
        if (!kaynak)
        {
            alertify.error("Kopyalanacak kısım bulunamadı");
            return;
        }
        const kopya = JSON.parse(JSON.stringify(kaynak));
        kopya.id = Math.floor(Math.random() * 1000000) + 1;
        while (veri.w.some(item => item.id === kopya.id))
        {
            kopya.id = Math.floor(Math.random() * 1000000) + 1;
        }
        veri.w.push(kopya);
        riskDuzenleVeriYaz(veri);
        await risknodekaydet();
    });
}

function riskduzenlelisteyukle()
{
    let veri = riskDuzenleVeriOku();
    if (!veri) return;
    $('#riskbaslik').text(veri.x[0] + " Risk Değerlendirmesi Düzenleme");
    const alan = $('#riskdegerlendirmealan');
    alan.empty();
    veri.w.forEach((item) =>
    {
        const anaDiv = $(`<div style="border:0.2vw solid #ccc; padding:0.8vw; margin-bottom:15px; border-radius:0.8vw; background:#f9f9f9"><p><strong>Tehlike Kaynağı: </strong>${item.b}</p><p><strong>Tehlike: </strong>${item.c}</p><p><strong>Risk: </strong>${item.d}</p><p><strong>Riske Maruz Kalan Çalışanlar: </strong>${item.e}</p><p><strong>Şiddet:&nbsp;</strong>${item.k}&emsp;<strong>Frekans:&nbsp;</strong>${item.l}&emsp;<strong>Olasılık:&nbsp;</strong>${item.m}</p><div class="kontroller" style="margin-top:1vw;"></div></div>`);
        item.q.forEach(qitem => { anaDiv.find('.kontroller').append(`<div style="display:flex; justify-content:space-between; margin:1.5vw 0; gap:1.5vw;"><div style="flex:1;text-align:justify;"><strong>Kontrol:</strong> ${qitem.f}</div><div style="flex:1;text-align:justify;"><strong>Mevcut Durum:</strong> ${qitem.g}</div></div>`); });
        anaDiv.find('.kontroller').append(`<div class="cssdivortala"><input name="risksil" type="button" class="cssbutontumu" onclick="riskduzenlemesil();" value="Bu Kısmı Sil" data-id="${item.id}" />&emsp;&emsp;<input name="riskkismikopyala" type="button" class="cssbutontumu" value="Bu Kısmı Kopyala" data-id="${item.id}" />&emsp;&emsp;<input name="riskduzenle" type="button" class="cssbutontumu" value="Bu Kısmı Düzenle" data-id="${item.id}" /></div><div class="cssboslukalt1"></div>`);
        alan.append(anaDiv);
    });
}

function riskjsonhiddenfield2guncelle()
{
    let veri = riskDuzenleVeriOku();
    if (!veri) return;
    riskDuzenleVeriYaz(veri);
}


function riskicerikr0(satirno)
{
    store.set("tedbirsecim", satirno);
    $("#diyologrehber").fadeIn();
}

function riskolasiEtkiRehberiAc()
{
    const tablo = $("#riskolasietkitablo");
    if ($.fn.DataTable.isDataTable(tablo))
    {
        tablo.DataTable().destroy();
    }
    tablo.empty();
    const satirlar = riskOlasiEtkiSecenekleri.flatMap(grup =>
        grup.secenekler.map(metin => ({ baslik: grup.baslik, metin }))
    );
    tablo.DataTable({
        data: satirlar,
        order: [],
        paging: false,
        info: false,
        columnDefs: [{ targets: '_all', orderable: false }],
        columns: [
            { data: "baslik", title: "Başlık" },
            { data: "metin", title: "Risk - Olası Etki" },
            { data: null, title: "Seç", render: (data, type, row) => `<input type="button" name="riskolasiEtkiSec" class="cssbutontumu" data-metin="${$('<div>').text(row.metin).html()}" value="Seç"/>` }
        ],
        language: {
            search: "Risk Ara:",
            zeroRecords: "Eşleşen seçenek bulunamadı",
            emptyTable: "Risk seçeneği bulunamadı"
        },
        createdRow: function (row, data)
        {
            $(row).find('td').eq(0).css({ textAlign: 'left', fontWeight: 'bold' });
            $(row).find('td').eq(1).css('text-align', 'left');
            $(row).find('td').eq(2).css('text-align', 'center');
            if (data.baslik === "Meslek Hastalığı") $(row).addClass("risk-meslek-hastaligi");
        },
        headerCallback: function (thead) { $(thead).find('th').css('text-align', 'center'); }
    });
    $('.dt-search input').css({ "background-color": "white" }).attr("autocomplete", "off");
    $("#diyologolasiEtkiRehberi").fadeIn();
}

function riskMaruzKalanCalisanRehberiAc()
{
    const liste = $("#riskmaruzkalanliste").empty();
    riskMaruzKalanCalisanSecenekleri.forEach((metin, index) =>
    {
        const satir = $("<button>", {
            type: "button",
            class: "cssbutontumu riskmaruzkalansecenek",
            text: metin
        }).attr("data-index", index);
        liste.append(satir);
    });
    $("#diyologmaruzkalanrehberi").fadeIn();
}

$(document).off("click.riskolasiEtkiSec", 'input[name="riskolasiEtkiSec"]').on("click.riskolasiEtkiSec", 'input[name="riskolasiEtkiSec"]', function ()
{
    $("#d").val($(this).attr("data-metin"));
    $("#diyologolasiEtkiRehberi").fadeOut();
});

$(document).off("click.riskMaruzKalanSec", ".riskmaruzkalansecenek").on("click.riskMaruzKalanSec", ".riskmaruzkalansecenek", function ()
{
    const index = Number($(this).attr("data-index"));
    const metin = riskMaruzKalanCalisanSecenekleri[index];
    if (metin !== undefined)
    {
        $("#e").val(metin);
        $("#diyologmaruzkalanrehberi").fadeOut();
    }
});

async function riskiceaktartablor13()
{
    let data = await githuboku("https://cdn.jsdelivr.net/gh/MEHMETCERANX12/isgevrak@main/kaynak/riskiceaktar1_1.json");
    if (!data) return;
    store.set("riskiceaktarjson", data);
    if ($.fn.DataTable.isDataTable('#mevcutrisktablo'))
    {
        $('#mevcutrisktablo').DataTable().destroy();
        $('#mevcutrisktablo').empty();
    }
    $('#mevcutrisktablo').DataTable
    ({
        data: data,
        order: [],
        columnDefs: [{ targets: '_all', orderable: false }],
        columns:
        [
            { data: "b", title: "Risk Paketi" },
            { data: "g", title: "Grup" },
            { data: "id", title: "Ekle", render: d => `<input type="button" name="riskiceaktarsec" class="cssbutontumu" data-id="${d}" value="Ekle"/>` }
        ],
        language: { search: "Risk Ara:", lengthMenu: "Sayfa başına _MENU_ kayıt göster", zeroRecords: "Eşleşen kayıt bulunamadı", info: "_TOTAL_ kayıttan _START_ ile _END_ arası gösteriliyor", infoEmpty: "Kayıt yok", infoFiltered: "(toplam _MAX_ kayıttan filtrelendi)", emptyTable: "Eşleşen risk bulunamadı" },
        lengthMenu: [10, 25, 50, 100, 500, 1000],
        pageLength: 100,
        createdRow: function (row)
        {
            $(row).find('td').eq(0).css('text-align', 'left');
            $(row).find('td').eq(1).css('text-align', 'left');
            $(row).find('td').eq(2).css('text-align', 'center');
        },
        headerCallback: function (thead) { $(thead).find('th').css('text-align', 'center'); }
    });
    $('.dt-search input').css({ "background-color": "white" }).attr("autocomplete", "off");
    $('.dt-length select').css({ "background-color": "white" });
    $(document).off("click.riskiceaktarsec", 'input[name="riskiceaktarsec"]').on("click.riskiceaktarsec", 'input[name="riskiceaktarsec"]', function ()
    {
        const id = parseInt($(this).data("id"), 10);
        const data = jsoncevir(store.get("riskiceaktarjson"));
        const secilen = data.find(item => item.id === id);
        if (!secilen || !secilen.m)
        {
            alertify.error("İçe aktarılacak kayıt bulunamadı");
            return;
        }
        store.set("riskiceaktarsecim", secilen);
        $('#diyologrisklistesi').fadeOut();
        riskiceaktarizleme14();
    });
}

function riskiceaktarizleme14()
{
    const secilen = jsoncevir(store.get("riskiceaktarsecim"));
    if (!secilen || !secilen.m)
    {
        alertify.error("İçe aktarılacak kayıt bulunamadı");
        return;
    }
    const veri = riskDuzenleVeriOku();
    const risk = JSON.parse(JSON.stringify(secilen.m));
    const tehlikeKaynagi = Array.isArray(veri.x) && veri.x.length > 0 ? veri.x[0] : "";
    if (risk.b === "x1" && tehlikeKaynagi)
    {
        risk.b = tehlikeKaynagi;
    }
    const alan = $('#riskiceaktaralan');
    alan.empty();
    const anaDiv = $(`<div style="border:0.2vw solid #ccc; padding:0.8vw; margin-bottom:15px; border-radius:0.8vw; background:#f9f9f9"><p><strong>Tehlike Kaynağı: </strong>${risk.b}</p><p><strong>Tehlike: </strong>${risk.c}</p><p><strong>Risk: </strong>${risk.d}</p><p><strong>Riske Maruz Kalan Çalışanlar: </strong>${risk.e}</p><p><strong>Şiddet:&nbsp;</strong>${risk.k}&emsp;<strong>Frekans:&nbsp;</strong>${risk.l}&emsp;<strong>Olasılık:&nbsp;</strong>${risk.m}</p><div class="kontroller" style="margin-top:1vw;"></div></div>`);
    (risk.q || []).forEach(qitem => { anaDiv.find('.kontroller').append(`<div style="display:flex; justify-content:space-between; margin:1.5vw 0; gap:1.5vw;"><div style="flex:1;text-align:justify;"><strong>Kontrol:</strong> ${qitem.f}</div><div style="flex:1;text-align:justify;"><strong>Mevcut Durum:</strong> ${qitem.g}</div></div>`); });
    alan.append(anaDiv);
    $('#diyologriskiceaktar').fadeIn();
}

function riskiceaktargeridon14()
{
    $('#diyologriskiceaktar').fadeOut(function ()
    {
        $('#diyologrisklistesi').fadeIn();
    });
}

function riskiceaktarkaydet14()
{
    const secilen = jsoncevir(store.get("riskiceaktarsecim"));
    if (!secilen || !secilen.m)
    {
        alertify.error("İçe aktarılacak kayıt bulunamadı");
        return false;
    }
    let veri = riskDuzenleVeriOku();
    if (!veri)
    {
        alertify.error("Risk verisi bulunamadı");
        return false;
    }
    if (!Array.isArray(veri.w))
    {
        veri.w = [];
    }
    const yeniKayit = JSON.parse(JSON.stringify(secilen.m));
    yeniKayit.id = Math.floor(Math.random() * 1000000) + 1;
    const tehlikeKaynagi = Array.isArray(veri.x) && veri.x.length > 0 ? veri.x[0] : "";
    if (yeniKayit.b === "x1" && tehlikeKaynagi)
    {
        yeniKayit.b = tehlikeKaynagi;
    }
    veri.w.push(yeniKayit);
    riskDuzenleVeriYaz(veri);
    return true;
}

async function riskrehbertablor12()
{
    let data = await githuboku("https://cdn.jsdelivr.net/gh/MEHMETCERANX12/isgevrak@main/kaynak/risktedbir1_2.json");
    if (!data) return;
    $('#riskiceriktablo').DataTable
    ({
        data: data,
        order: [],
        columnDefs: [{ targets: '_all', orderable: false }],
        columns:
            [
                { data: "c", title: "Başlık" },
                { data: "a", title: "Tedbir İçeriği" },
                { data: "b", title: "Uygulama İçeriği" },
                { data: null, title: "Seç", render: (d, t, r) => `<input type="button" name="iceriksec" class="cssbutontumu" data-a="${r.a}" data-b="${r.b}" value="Seç"/>` }
            ],
        language: { search: "Tedbir Ara:", lengthMenu: "Sayfa başına _MENU_ kayıt göster", zeroRecords: "Eşleşen kayıt bulunamadı", info: "_TOTAL_ kayıttan _START_ ile _END_ arası gösteriliyor", infoEmpty: "Kayıt yok", infoFiltered: "(toplam _MAX_ kayıttan filtrelendi)", emptyTable: "Eşleşen tedbir bulunamadı" },
        lengthMenu: [10, 25, 50, 100, 500, 1000],
        pageLength: 1000,
        createdRow: function (row) { $(row).find('td').eq(0).css('text-align', 'left'); $(row).find('td').eq(1).css('text-align', 'left'); $(row).find('td').eq(2).css('text-align', 'left'); },
        headerCallback: function (thead) { $(thead).find('th').css('text-align', 'center'); }
    });
    $('.dt-search input').css({ "background-color": "white" }).attr("autocomplete", "off");
    $('.dt-length select').css({ "background-color": "white" });
    $(document).off("click.riskiceriksec", 'input[name="iceriksec"]').on("click.riskiceriksec", 'input[name="iceriksec"]', function ()
    {
        let x = store.get("tedbirsecim");
        let a = $(this).data("a");
        let b = $(this).data("b");
        $("#f" + x).val(a);
        $("#g" + x).val(b);
        $("#diyologrehber").fadeOut();
    });
}

function duzenleload1r7()
{
    var data = riskStoreJsonOku("riskdegerlendirmeliste");
    if (data)
    {
        try
        {
            $('#risktablo').DataTable({
                data: data,
                pageLength: -1,
                lengthMenu: [[10, 25, 50, 100, 500, -1], [10, 25, 50, 100, 500, "Tümü"]],
                columns:
                [
                    {data: 'a', title: 'Risk Değerlendirme Adı', width: '80%' },
                    {data:'i',title:'Düzenle',orderable:!1,width:'10%',render:d=>`<input name="duzenle" type="button" class="cssbutontamam" value="Düzenle" data-id="${d}"/>`},
                    {data:'i',title:'Sil',orderable:!1,width:'10%',render:d=>`<input name="sil" type="button" class="cssbutontamam" value="Sil" data-id="${d}"/>`}
                ],
                language:
                {
                    search: "Risk Değerlendirme Ara:",
                    lengthMenu: "Sayfa başına _MENU_ kayıt göster",
                    zeroRecords: "Eşleşen kayıt bulunamadı",
                    info: "_TOTAL_ kayıttan _START_ ile _END_ arası gösteriliyor",
                    infoEmpty: "Kayıt yok",
                    infoFiltered: "(toplam _MAX_ kayıttan filtrelendi)",
                    emptyTable: "Risk değerlendirme bulunamadı"
                },
                createdRow: function (row)
                {
                    $(row).find('td').eq(0).css('text-align', 'left');
                    $(row).find('td').eq(1).css('text-align', 'center');
                    $(row).find('td').eq(2).css('text-align', 'center');
                },
                headerCallback: function (thead)
                { 
                    $(thead).find('th').css('text-align', 'center');
                }
            });
        }
        catch (e)
        {
            console.error("JSON parse hatası:", e);
        }
    }
    $('.dt-search input').css({ "background-color": "white" }).attr("autocomplete", "off");
    $('.dt-length select').css({ "background-color": "white" });
    $(document).off('click.riskduzenle1', 'input[name="duzenle"], input[name="sil"]').on('click.riskduzenle1', 'input[name="duzenle"], input[name="sil"]', function ()
    {
        var i = $(this).data('id');
        var b = $(this).closest('tr').find('td:eq(0)').text().trim();
        if ($(this).attr('name') === 'duzenle')
        {
            if (!Number.isInteger(i) || i <= 0)
            {
                alertify.error("Beklenmedik bir hata oluştu");
                return false;
            }
            window.location.href = "/riskdegerlendirmeduzenle2?id=" + encodeURIComponent(i);
        }
        else if ($(this).attr('name') === 'sil')
        {
            store.set("risksilinecekid", i);
            $("#mesajicerik").text(`${b} SİLMEK istediğinizden emin misiniz?`);
            $("#diyolagrisksil").fadeIn();
        }
    });
    $("#risksilbutton").off("click").on("click", async function ()
    {
        if (!risksilr6())
        {
            return;
        }
        const id = parseInt(String(store.get("risksilinecekid") || ""), 10);
        if (!await riskdegerlendirmesil(id))
        {
            return;
        }
        mesaj("3");
        $("#diyolagrisksil").fadeOut();
        const table = $("#risktablo").DataTable();
        table.row($(`input[name="sil"][data-id="${id}"]`).closest("tr")).remove().draw();
        const liste = jsoncevir(store.get("riskdegerlendirmeliste")).filter(item => item.i !== id);
        store.set("riskdegerlendirmeliste", liste);
    });
 }

function risksilr6()
{
    const iddeger = store.get("risksilinecekid");
    const id = parseInt(iddeger, 10);
    if (isNaN(id) || id <= 0)
    {
        alertify.error("Beklenmedik bir hata oluştu");
        return false;
    }
    return true;
}

function riskduzenle2idoku()
{
    const url = new URL(window.location.href);
    const id = parseInt(String(url.searchParams.get("id") || ""), 10);
    return Number.isInteger(id) && id > 0 ? id : 0;
}

async function riskduzenle2load()
{
    const riskid = riskduzenle2idoku();
    if (!riskid)
    {
        alertify.error("Geçersiz kayıt");
        return false;
    }
    try
    {
        const { response, json } = await riskduzenle2oku(riskid);
        if (!response.ok)
        {
            alertify.error(json.error || "Risk verisi alınamadı");
            return false;
        }
        store.set("riskduzenleveri", json);
        duzenleload2r2();
        riskduzenlenodebagla();
        return true;
    }
    catch (error)
    {
        console.log("riskduzenle2load hata", error);
        alertify.error("Risk verisi alınamadı");
        return false;
    }
}

async function risknodekaydet()
{
    const riskid = riskduzenle2idoku();
    const json = riskStoreJsonOku("riskduzenlekayitjson");
    if (!riskid || !json || typeof json !== "object" || Array.isArray(json))
    {
        alertify.error("Risk verisi bulunamadı");
        return;
    }
    try
    {
        const { response, json: sonuc } = await riskduzenle2guncelle(riskid, json);
        if (!response.ok)
        {
            alertify.error(sonuc.error || "Beklenmedik bir hata oluştu");
            return;
        }
        mesaj("2");
        riskduzenlelisteyukle();
    }
    catch (error)
    {
        console.log("risknodekaydet hata", error);
        alertify.error("Beklenmedik bir hata oluştu");
    }
}

async function risknodeadkaydet()
{
    const riskid = riskduzenle2idoku();
    const ad = String(store.get("riskduzenleyeniad") || "").trim();
    const json = riskStoreJsonOku("riskduzenlekayitjson");
    if (!riskid)
    {
        alertify.error("Beklenmedik bir hata oluştu");
        return;
    }
    try
    {
        const { response, json: sonuc } = await riskduzenle2adguncelle(riskid, ad, json);
        if (!response.ok)
        {
            alertify.error(sonuc.error || "Beklenmedik bir hata oluştu");
            return;
        }
        mesaj("2");
    }
    catch (error)
    {
        console.log("risknodeadkaydet hata", error);
        alertify.error("Beklenmedik bir hata oluştu");
    }
}

function riskduzenlenodebagla()
{
    $("#riskkaydetbutton").off("click").on("click", async function ()
    {
        if (!riskkaydetr9())
        {
            return;
        }
        await risknodekaydet();
    });

    $("#riskkismsilbutton").off("click").on("click", async function ()
    {
        if (!riskkaydetr9())
        {
            return;
        }
        await risknodekaydet();
    });

    $("#riskadbutton").off("click").on("click", async function ()
    {
        if (!addegistirr8())
        {
            return;
        }
        await risknodeadkaydet();
    });

    $("#risksiralabutton").off("click").on("click", async function ()
    {
        if (!risksiralar10())
        {
            return;
        }
        await risknodekaydet();
    });

    $("#riskiceaktarbutton").off("click").on("click", async function ()
    {
        if (!riskiceaktarkaydet14())
        {
            return;
        }
        $('#diyologriskiceaktar').fadeOut();
        await risknodekaydet();
    });
}
////////////RİSK DEĞERLENDİRME ÇIKTI////////////RİSK DEĞERLENDİRME ÇIKTI////////////RİSK DEĞERLENDİRME ÇIKTI////////////RİSK DEĞERLENDİRME ÇIKTI////////////
function riskdosyajsonindir()
{
    let calisanjson = riskStoreJsonOku("riskcikticalisanliste");
    calisanjson = calisanjson.filter(kisi => kisi.r !== 0);
    let isyeri = store.get('xjsonfirma');
    let uzmanad = store.get("uzmanad");
    let uzmanno = store.get("uzmanno");
    let risktarih = store.get("riskdegerlendirmetarih");
    let kapaksecim = store.get("riskkapaksecim");
    const settings = jsoncevir(store.get("settings"));
    const riskAyari = settings && Array.isArray(settings.r) && settings.r.length > 0 ? settings.r[0] : null;
    const renk = parseInt(riskAyari?.a ?? "0", 10) || 0;
    const giris = parseInt(riskAyari?.b ?? "0", 10) || 0;
    isyeri = [jsoncevir(isyeri)];
    isyeri = isyeri.map(item => ({ ...item, uzmanad: uzmanad, uzmanno: uzmanno, tarih: risktarih, kapak: kapaksecim, renk: renk, giris: giris }));
    let riskjson = riskStoreJsonOku("riskciktiseciliriskler");
    let jsonindir = { isyerijson: isyeri, calisanjson: calisanjson, riskjson: riskjson };
    let jsonBlob = new Blob([JSON.stringify(jsonindir, null, 2)], { type: "application/json;charset=utf-8" });
    let jsonid = metinuret(3);
    saveAs(jsonBlob, "Risk Değerlendirmesi - " + jsonid + ".json");
}

async function riskcikti3load()
{
    try
    {
        const { response, json } = await riskcikti3verigetir();
        if (!response.ok)
        {
            alertify.error(json.error || "Risk değerlendirme verisi alınamadı");
            return false;
        }
        store.set("riskciktiseciliriskler", Array.isArray(json.riskjson) ? json.riskjson : []);
        store.set("riskcikticalisanliste", Array.isArray(json.calisanjson) ? json.calisanjson : []);
        return true;
    }
    catch (error)
    {
        console.log("riskcikti3load hata", error);
        alertify.error("Risk değerlendirme verisi alınamadı");
        return false;
    }
}

async function riskgirispdfyazdir()
{
    let riskisekipmanikontrollistesi = [{"k":"Buhar ve kızgın su kazanları","x1":"0","x2":"0","x3":"1","x4":"1","x5":"1","x6":"0"},{"k":"Isıtma (Kalorifer, sıcak su vb.) kazanlar","x1":"0","x2":"0","x3":"1","x4":"1","x5":"1","x6":"0"},{"k":"Basınçlı hava ve gaz tankları ","x1":"0","x2":"0","x3":"1","x4":"1","x5":"1","x6":"0"},{"k":"Otoklav","x1":"0","x2":"0","x3":"1","x4":"1","x5":"1","x6":"0"},{"k":"Kapalı genleşme tankları (Hidrofor vb.)","x1":"0","x2":"0","x3":"1","x4":"1","x5":"1","x6":"0"},{"k":"Vinçler ve kaldırma teçhizatları","x1":"0","x2":"0","x3":"1","x4":"1","x5":"0","x6":"0"},{"k":"Forklift, Transpalet, Elektrikli Lift","x1":"0","x2":"0","x3":"1","x4":"1","x5":"0","x6":"0"},{"k":"Yükseltilebilen seyyar iş platformları","x1":"0","x2":"0","x3":"1","x4":"1","x5":"0","x6":"0"},{"k":"Yük asansörleri","x1":"0","x2":"0","x3":"1","x4":"1","x5":"0","x6":"0"},{"k":"İnşaat asansörleri","x1":"0","x2":"0","x3":"1","x4":"1","x5":"0","x6":"0"},{"k":"Sapanlar, vakumlu kaldırıcılar","x1":"0","x2":"0","x3":"1","x4":"1","x5":"0","x6":"0"},{"k":"Yapı iskeleleri","x1":"0","x2":"0","x3":"1","x4":"0","x5":"0","x6":"1"},{"k":"Seyyar iskeleler","x1":"0","x2":"0","x3":"0","x4":"0","x5":"0","x6":"0"},{"k":"Elektrik tesisatı ve topraklama tesisatı","x1":"1","x2":"1","x3":"0","x4":"0","x5":"0","x6":"0"},{"k":"Yıldırımdan korunma tesisatı","x1":"1","x2":"0","x3":"0","x4":"0","x5":"0","x6":"0"},{"k":"Orta veya Yüksek Gerilim Trafo","x1":"1","x2":"0","x3":"0","x4":"0","x5":"0","x6":"0"},{"k":"Jeneratör","x1":"1","x2":"0","x3":"0","x4":"0","x5":"0","x6":"0"},{"k":"Yangın algılama ve uyarı sistemleri","x1":"1","x2":"1","x3":"0","x4":"0","x5":"0","x6":"0"},{"k":"Yangın söndürme sistemleri","x1":"0","x2":"0","x3":"1","x4":"0","x5":"0","x6":"0"},{"k":"Portatif yangın söndürücüler","x1":"0","x2":"0","x3":"1","x4":"0","x5":"0","x6":"0"},{"k":"Havalandırma ve klima tesisatı","x1":"0","x2":"0","x3":"1","x4":"0","x5":"0","x6":"0"},{"k":"Tezgahlar(Pres, İşleme merkezleri vb.)","x1":"0","x2":"0","x3":"1","x4":"1","x5":"0","x6":"0"},{"k":"Endüstriyel raflar","x1":"0","x2":"0","x3":"1","x4":"1","x5":"0","x6":"0"},{"k":"Endüstriyel kapılar","x1":"0","x2":"0","x3":"1","x4":"1","x5":"0","x6":"0"},{"k":"Kazıcı yükleyici (JCB, Beko Loder)","x1":"0","x2":"0","x3":"1","x4":"1","x5":"0","x6":"0"},{"k":"Damperli kamyonlar","x1":"0","x2":"0","x3":"1","x4":"1","x5":"0","x6":"0"},{"k":"Greyderler","x1":"0","x2":"0","x3":"1","x4":"1","x5":"0","x6":"0"},{"k":"Sondaj makinaları","x1":"0","x2":"0","x3":"1","x4":"1","x5":"0","x6":"0"}];
    let calisanjson = riskStoreJsonOku("riskcikticalisanliste");
    calisanjson = calisanjson.filter(kisi => kisi.r !== 0).sort((a, b) => a.r - b.r).map(kisi => ({ ...kisi, riskekipbolum: kisi.r === 1 ? "Destek Elemanı" : kisi.r === 2 ? "Çalışan Temsilcisi" : kisi.r === 3 ? "Bilgi Sahibi Çalışan" : "" }));
    let destekelemanad = "";
    let calisatemsilcisiad = "";
    let bilgisahibicalisanad = "";
    let destekunvan = "";
    let temsilciunvan = "";
    let bilgisahibiunvan = "";
    for (let kisi of calisanjson)
    {
        if (kisi.r === 1)
        {
            destekelemanad += (destekelemanad ? ", " : "") + kisi.x;
            destekunvan = "Destek Elemanı";
        }
        else if (kisi.r === 2)
        {
            calisatemsilcisiad += (calisatemsilcisiad ? ", " : "") + kisi.x;
            temsilciunvan = "Çalışan Temsilcisi";
        }
        else if (kisi.r === 3) {
            bilgisahibicalisanad += (bilgisahibicalisanad ? ", " : "") + kisi.x;
            bilgisahibiunvan = "Bilgi Sahibi Çalışan";
        }
    }
    let isyeri = jsoncevir(store.get('xjsonfirma'));
    let isyeriismi = isyeri.fi;
    let isyeriadresi = isyeri.ad;
    let sgksicilno = isyeri.sc;
    let isyerisehir = isyeri.sh;
    let isveren = isyeri.is;
    let hekimad = isyeri.hk;
    var tehlikesinifimap = { 1: "Az Tehlikeli", 2: "Tehlikeli", 3: "Çok Tehlikeli" };
    let tehlikeno = parseInt(isyeri.ts);
    let tehlikesinifi = tehlikesinifimap[isyeri.ts];
    let uzmanad = store.get("uzmanad");
    let tumkisiler = isveren + " - " + isverenunvanioku() + " / " + uzmanad + " - İş Güvenliği Uzmanı / " + hekimad + " - İşyeri Hekimi / ";
    for (let kisi of calisanjson)
    {
        tumkisiler = tumkisiler + kisi.x + " - " + kisi.riskekipbolum + " / ";
    }
    tumkisiler = tumkisiler.slice(0, -3);
    let riskdegerlendirmetarih = store.get("riskdegerlendirmetarih");
    let riskgecerlilikTarih = riskgecerlilik(riskdegerlendirmetarih, tehlikeno);
    let kapakyil = riskdegerlendirmetarih.split('.')[2];
    let kapak = store.get("riskkapaksecim");
    let isyeribaslik = isyeribaslikayar(parseInt(kapak), isyeriismi);
    let ustbaslik = "";
    let altbaslik = "";
    if (isyeribaslik)
    {
        ustbaslik = isyeribaslik.ustbaslik.toLocaleUpperCase("tr-TR");
        altbaslik = isyeribaslik.altbaslik.toLocaleLowerCase('tr-TR').split(' ').map(w => w.charAt(0).toLocaleUpperCase('tr-TR') + w.slice(1)).join(' ');
    }
    function pdfcerceve() { var l = 30, t = 30, r = 30, b = 30, w = 595 - l - r, h = 842 - t - b; return { canvas: [{ type: "rect", x: l, y: t, w: w, h: h, lineWidth: 1, lineColor: "#000" }] } }
    function clone(obj) { return JSON.parse(JSON.stringify(obj));}
    /////////////////////////////////////////////////////////////////
    const riskekiptablo =
    {
        table:
        {
            widths: ['35%', '35%', '30%'],
            body:
            [
                [
                    { text: 'RİSK DEĞERLENDİRME EKİBİ', colSpan: 3, style: 'baslikorta', margin: [0, 5, 0, 5] },
                    {},
                    {}
                ],
                [
                    { text: 'Adı Soyadı', style: 'baslikorta', margin: [0, 5, 0, 5] },
                    { text: 'Ekip Görevi', style: 'baslikorta', margin: [0, 5, 0, 5] },
                    { text: 'İmza', style: 'baslikorta', margin: [0, 5, 0, 5] },
                ],
                [
                    { text: isveren, style: 'normalsol', margin: [2, 20, 0, 20] },
                    { text: isverenunvanioku(), style: 'normalsol', margin: [2, 20, 0, 20] },
                    { text: '' }
                ],
                [
                    { text: uzmanad, style: 'normalsol', margin: [2, 20, 0, 20] },
                    { text: 'İş Güvenliği Uzmanı', style: 'normalsol', margin: [2, 20, 0, 20] },
                    { text: '' }
                ],
                [
                    { text: hekimad, style: 'normalsol', margin: [2, 20, 0, 20] },
                    { text: 'İşyeri Hekimi', style: 'normalsol', margin: [2, 20, 0, 20] },
                    { text: '' }
                ],
                ...calisanjson.map(item =>
                [
                    { text: item.x, style: 'normalsol', margin: [2, 20, 0, 20] },
                    { text: item.riskekipbolum, style: 'normalsol', margin: [2, 20, 0, 20] },
                    { text: '' }
                ])
            ]
        },
    };
    const riskekipimza =
    {
        table:
        {
            widths: ['33%', '33%', '34%'],
            body:
            [
                [
                    { text: uzmanad, style: 'imzaad', margin: [0, 0, 0, 0] },
                    { text: isveren, style: 'imzaad', margin: [0, 0, 0, 0] },
                    { text: hekimad, style: 'imzaad', margin: [0, 0, 0, 0] }
                ],
                [
                    { text: 'İş Güvenliği Uzmanı', style: 'imzaunvan', margin: [0, 0, 0, 85] },
                    { text: isverenunvanioku(), style: 'imzaunvan', margin: [0, 0, 0, 85] },
                    { text: 'İşyeri Hekimi', style: 'imzaunvan', margin: [0, 0, 0, 85] }
                ],
                [
                    { text: destekelemanad, style: 'imzaad', margin: [0, 0, 0, 0] },
                    { text: calisatemsilcisiad, style: 'imzaad', margin: [0, 0, 0, 0] },
                    { text: bilgisahibicalisanad, style: 'imzaad', margin: [0, 0, 0, 0] }
                ],
                [
                    { text: destekunvan, style: 'imzaunvan', margin: [0, 0, 0, 0] },
                    { text: temsilciunvan, style: 'imzaunvan', margin: [0, 0, 0, 0] },
                    { text: bilgisahibiunvan, style: 'imzaunvan', margin: [0, 0, 0, 0] }
                ]
            ]
        },
        layout: 'noBorders',
    };
    const riskAyari = ayarbolumuoku("r");
    const finekinneyskor = String(riskAyari?.a ?? "0") === "1"
        ? {
            table:
            {
                widths: ['25%', '25%', '50%'],
                body:
                [
                    [
                        { text: "ŞİDDET", bold: true, color: "white", fillColor: "#808080", alignment: "center", fontSize: 14, margin: [0, 4, 0, 4]},
                        { text: "FREKANS", bold: true, color: "white", fillColor: "#808080", alignment: "center", fontSize: 14, margin: [0, 4, 0, 4] },
                        { text: "OLASILIK", bold: true, color: "white", fillColor: "#808080", alignment: "center", fontSize: 14, margin: [0, 4, 0, 4] }
                    ],
                    [
                        { text: "100 - Birden Fazla Ölüm", alignment: "left", fontSize: 11, margin: [0, 2, 0, 2]},
                        { text: "10 - Saatte Birden Fazla", alignment: "left", fontSize: 11, margin: [0, 2, 0, 2]},
                        { text: "10 - Çok Yüksek - Kesinlikle Olur", alignment: "left", fontSize: 11, margin: [0, 2, 0, 2]},
                    ],
                    [
                        { text: "40 - Ölüm", alignment: "left", fontSize: 11, margin: [0, 2, 0, 2]},
                        { text: "6 - Günde Birden Fazla", alignment: "left", fontSize: 11, margin: [0, 2, 0, 2]},
                        { text: "6 - Yüksek - Sıklıkla Olur", alignment: "left", fontSize: 11, margin: [0, 2, 0, 2]},
                    ],
                    [
                        { text: "15 - Uzuv Kaybı / Kalıcı Yaralanma", alignment: "left", fontSize: 11, margin: [0, 2, 0, 2]},
                        { text: "3 - Haftada Birkaç Kez", alignment: "left", fontSize: 11, margin: [0, 2, 0, 2]},
                        { text: "3 - Olası - Bazen Olur", alignment: "left", fontSize: 11, margin: [0, 2, 0, 2]},
                    ],
                    [
                        { text: "7 - Tedavi Gerektiren Yaralanma", alignment: "left", fontSize: 11, margin: [0, 2, 0, 2]},
                        { text: "2 - Ayda Birkaç Kez", alignment: "left", fontSize: 11, margin: [0, 2, 0, 2]},
                        { text: "1 - Düşük - Nadiren Olur", alignment: "left", fontSize: 11, margin: [0, 2, 0, 2]},
                    ],
                    [
                        { text: "3 - İlk Yardım Seviyesinde Yaralanma", alignment: "left", fontSize: 11, margin: [0, 2, 0, 2]},
                        { text: "1 - Yılda Birkaç Kez", alignment: "left", fontSize: 11, margin: [0, 2, 0, 2]},
                        { text: "0,5 - Çok Düşük - Nadir Ama Mümkün", alignment: "left", fontSize: 11, margin: [0, 2, 0, 2]},
                    ],
                    [
                        { text: "1 - Ucuz Atlatma", alignment: "left", fontSize: 11, margin: [0, 2, 0, 2]},
                        { text: "0,5 - Çok Seyrek", alignment: "left", fontSize: 11, margin: [0, 2, 0, 2]},
                        { text: "0,2 - Normal Şartlarda Olmaz Ama Mümkün", alignment: "left", fontSize: 11, margin: [0, 2, 0, 2]},
                    ],
                    [
                        { text: "RİSK SKORU", bold: true, color: "white", fillColor: "#808080", alignment: "center", fontSize: 14, margin: [0, 4, 0, 4]},
                        { text: "RİSK SEVİYESİ", bold: true, color: "white", fillColor: "#808080", alignment: "center", fontSize: 14, margin: [0, 4, 0, 4]},
                        { text: "DÜZELTİCİ FAALİYET PLANI", bold: true, color: "white", fillColor: "#808080", alignment: "center", fontSize: 14, margin: [0, 4, 0, 4]},
                    ],
                    [
                        { text: "R > 400", alignment: "left", fontSize: 11, margin: [0, 2, 0, 2], color: "white", fillColor: "#E74C3C", bold: true},
                        { text: "Tolere Edilemez Risk", alignment: "left", fontSize: 11, margin: [0, 2, 0, 2], color: "white", fillColor: "#E74C3C", bold: true},
                        { text: "Derhal Önlem Alınmalı. Tehlikeli Faaliyet Durdurulmalıdır.", alignment: "left", fontSize: 11, margin: [0, 2, 0, 2], color: "white", fillColor: "#E74C3C", bold: true},
                    ],
                    [
                        { text: "400 ≥ R > 200", alignment: "left", fontSize: 11, margin: [0, 2, 0, 2], color: "white", fillColor: "#8E44AD", bold: true},
                        { text: "Yüksek Risk", alignment: "left", fontSize: 11, margin: [0, 2, 0, 2], color: "white", fillColor: "#8E44AD", bold: true},
                        { text: "En Kısa Sürede (Birkaç Ay İçinde) Düzeltici Faaliyet Uygulanmalıdır.", alignment: "left", fontSize: 11, margin: [0, 2, 0, 2], color: "white", fillColor: "#8E44AD", bold: true},
                    ],
                    [
                        { text: "200 ≥ R > 70", alignment: "left", fontSize: 11, margin: [0, 2, 0, 2], color: "white", fillColor: "#2980B9", bold: true},
                        { text: "Önemli Risk", alignment: "left", fontSize: 11, margin: [0, 2, 0, 2], color: "white", fillColor: "#2980B9", bold: true},
                        { text: "Uzun Vadede (Yıl İçinde) İyileştirme Yapılmalıdır. Eylem Planına Alınmalıdır.", alignment: "left", fontSize: 11, margin: [0, 2, 0, 2], color: "white", fillColor: "#2980B9", bold: true},
                    ],
                    [
                        { text: "70 ≥ R > 20", alignment: "left", fontSize: 11, margin: [0, 2, 0, 2], fillColor: "#F7DC6F", bold: true},
                        { text: "Olası Risk", alignment: "left", fontSize: 11, margin: [0, 2, 0, 2], fillColor: "#F7DC6F", bold: true},
                        { text: "Gözetim Altında Tutulmalı, Takip Edilmeli, Eylem Planına Dâhil Edilmelidir.", alignment: "left", fontSize: 11, margin: [0, 2, 0, 2], fillColor: "#F7DC6F", bold: true},
                    ],
                    [
                        { text: "20 ≥ R", alignment: "left", fontSize: 11, margin: [0, 2, 0, 2], color: "white", fillColor: "#27AE60", bold: true},
                        { text: "Kabul Edilebilir Risk", alignment: "left", fontSize: 11, margin: [0, 2, 0, 2], color: "white", fillColor: "#27AE60", bold: true},
                        { text: "Mevcut Kontroller Risk Sürdürülebilir.", alignment: "left", fontSize: 11, margin: [0, 2, 0, 2], color: "white", fillColor: "#27AE60", bold: true},
                    ],
                ]
            },
        }
        : {
            table:
            {
                widths: ['25%', '25%', '50%'],
                body:
                [
                    [
                        { text: "ŞİDDET", bold: true, color: "white", fillColor: "#808080", alignment: "center", fontSize: 14, margin: [0, 4, 0, 4]},
                        { text: "FREKANS", bold: true, color: "white", fillColor: "#808080", alignment: "center", fontSize: 14, margin: [0, 4, 0, 4] },
                        { text: "OLASILIK", bold: true, color: "white", fillColor: "#808080", alignment: "center", fontSize: 14, margin: [0, 4, 0, 4] }
                    ],
                    [
                        { text: "100 - Birden Fazla Ölüm", alignment: "left", fontSize: 11, margin: [0, 2, 0, 2]},
                        { text: "10 - Saatte Birden Fazla", alignment: "left", fontSize: 11, margin: [0, 2, 0, 2]},
                        { text: "10 - Çok Yüksek - Kesinlikle Olur", alignment: "left", fontSize: 11, margin: [0, 2, 0, 2]},
                    ],
                    [
                        { text: "40 - Ölüm", alignment: "left", fontSize: 11, margin: [0, 2, 0, 2]},
                        { text: "6 - Günde Birden Fazla", alignment: "left", fontSize: 11, margin: [0, 2, 0, 2]},
                        { text: "6 - Yüksek - Sıklıkla Olur", alignment: "left", fontSize: 11, margin: [0, 2, 0, 2]},
                    ],
                    [
                        { text: "15 - Uzuv Kaybı / Kalıcı Yaralanma", alignment: "left", fontSize: 11, margin: [0, 2, 0, 2]},
                        { text: "3 - Haftada Birkaç Kez", alignment: "left", fontSize: 11, margin: [0, 2, 0, 2]},
                        { text: "3 - Olası - Bazen Olur", alignment: "left", fontSize: 11, margin: [0, 2, 0, 2]},
                    ],
                    [
                        { text: "7 - Tedavi Gerektiren Yaralanma", alignment: "left", fontSize: 11, margin: [0, 2, 0, 2]},
                        { text: "2 - Ayda Birkaç Kez", alignment: "left", fontSize: 11, margin: [0, 2, 0, 2]},
                        { text: "1 - Düşük - Nadiren Olur", alignment: "left", fontSize: 11, margin: [0, 2, 0, 2]},
                    ],
                    [
                        { text: "3 - İlk Yardım Seviyesinde Yaralanma", alignment: "left", fontSize: 11, margin: [0, 2, 0, 2]},
                        { text: "1 - Yılda Birkaç Kez", alignment: "left", fontSize: 11, margin: [0, 2, 0, 2]},
                        { text: "0,5 - Çok Düşük - Nadir Ama Mümkün", alignment: "left", fontSize: 11, margin: [0, 2, 0, 2]},
                    ],
                    [
                        { text: "1 - Ucuz Atlatma", alignment: "left", fontSize: 11, margin: [0, 2, 0, 2]},
                        { text: "0,5 - Çok Seyrek", alignment: "left", fontSize: 11, margin: [0, 2, 0, 2]},
                        { text: "0,2 - Normal Şartlarda Olmaz Ama Mümkün", alignment: "left", fontSize: 11, margin: [0, 2, 0, 2]},
                    ],
                    [
                        { text: "RİSK SKORU", bold: true, color: "white", fillColor: "#808080", alignment: "center", fontSize: 14, margin: [0, 4, 0, 4]},
                        { text: "RİSK SEVİYESİ", bold: true, color: "white", fillColor: "#808080", alignment: "center", fontSize: 14, margin: [0, 4, 0, 4]},
                        { text: "DÜZELTİCİ FAALİYET PLANI", bold: true, color: "white", fillColor: "#808080", alignment: "center", fontSize: 14, margin: [0, 4, 0, 4]},
                    ],
                    [
                        { text: "R > 400", alignment: "left", fontSize: 11, margin: [0, 2, 0, 2]},
                        { text: "Tolere Edilemez Risk", alignment: "left", fontSize: 11, margin: [0, 2, 0, 2]},
                        { text: "Derhal Önlem Alınmalı. Tehlikeli Faaliyet Durdurulmalıdır.", alignment: "left", fontSize: 11, margin: [0, 2, 0, 2]},
                    ],
                    [
                        { text: "400 ≥ R > 200", alignment: "left", fontSize: 11, margin: [0, 2, 0, 2]},
                        { text: "Yüksek Risk", alignment: "left", fontSize: 11, margin: [0, 2, 0, 2]},
                        { text: "En Kısa Sürede (Birkaç Ay İçinde) Düzeltici Faaliyet Uygulanmalıdır.", alignment: "left", fontSize: 11, margin: [0, 2, 0, 2]},
                    ],
                    [
                        { text: "200 ≥ R > 70", alignment: "left", fontSize: 11, margin: [0, 2, 0, 2]},
                        { text: "Önemli Risk", alignment: "left", fontSize: 11, margin: [0, 2, 0, 2]},
                        { text: "Uzun Vadede (Yıl İçinde) İyileştirme Yapılmalıdır. Eylem Planına Alınmalıdır.", alignment: "left", fontSize: 11, margin: [0, 2, 0, 2]},
                    ],
                    [
                        { text: "70 ≥ R > 20", alignment: "left", fontSize: 11, margin: [0, 2, 0, 2]},
                        { text: "Olası Risk", alignment: "left", fontSize: 11, margin: [0, 2, 0, 2]},
                        { text: "Gözetim Altında Tutulmalı, Takip Edilmeli, Eylem Planına Dâhil Edilmelidir.", alignment: "left", fontSize: 11, margin: [0, 2, 0, 2]},
                    ],
                    [
                        { text: "20 ≥ R", alignment: "left", fontSize: 11, margin: [0, 2, 0, 2]},
                        { text: "Kabul Edilebilir Risk", alignment: "left", fontSize: 11, margin: [0, 2, 0, 2]},
                        { text: "Mevcut Kontroller Risk Sürdürülebilir.", alignment: "left", fontSize: 11, margin: [0, 2, 0, 2]},
                    ],
                ]
            },
        };
    let sayfa1 =
    [
        { text: ustbaslik, style: 'kapakust', margin: [0, 10, 0, 5] },
        { text: altbaslik, style: 'kapakalt', margin: [0, 0, 0, 295] },
        { text: 'RİSK DEĞERLENDİRMESİ', style: 'kapakust', margin: [0, 0, 0, 350] },
        { text: isyerisehir + " - " + kapakyil, style: 'kapakyil', margin: [0, 0, 0, 10] },
    ];
    let sayfa2 =
    [
        { text: "RİSK DEĞERLENDİRME EKİBİ GÖREVLENDİRME FORMU", style: 'baslikorta', margin: [0, 0, 0, 15] },
        { text: "İşyeri Unvanı: " + isyeriismi, style: 'normal', margin: [35, 0, 0, 5] },
        { text: "İşyeri Adresi: " + isyeriadresi, style: 'normal', margin: [35, 0, 0, 5] },
        { text: "İşyeri Sicil No: " + sgksicilno, style: 'normal', margin: [35, 0, 0, 10] },
        { text: "\u200B\t\u200B\t\u200B\tYukarıda belirtilen işyeri ve adreste, 6331 Sayılı İş Sağlığı ve Güvenliği Kanunu kapsamında iş sağlığı ve güvenliğiyle ilgili risk değerlendirmesi çalışmalarının yürütülmesi amacıyla, aşağıda bilgileri yer alan kişilerin risk değerlendirme ekibinde görevlendirilmesine ve söz konusu risk değerlendirmesinin bu ekip tarafından hazırlanmasına karar verilmiştir.", style: 'normal', margin: [0, 0, 0, 10]},
    ];
    sayfa2.push(riskekiptablo);
    let sayfa3 =
    [
        { text: "RİSK DEĞERLENDİRME BİLGİLERİ", style: 'baslikorta', margin: [0, 10, 0, 10] },
        { text: "İşyeri Unvanı", style: 'kalin', margin: [0, 3, 0, 3]},
        { text: isyeriismi, style: 'normalsol', margin: [0, 3, 0, 3]},
        { text: "İşyeri Adresi", style: 'kalin', margin: [0, 3, 0, 3]},
        { text: isyeriadresi, style: 'normalsol', margin: [0, 3, 0, 3]},
        { text: "İşyeri SGK Sicil Numarası", style: 'kalin', margin: [0, 3, 0, 3]},
        { text: sgksicilno, style: 'normalsol', margin: [0, 3, 0, 3]},
        { text: isverenadsoyadetiketi(), style: 'kalin', margin: [0, 3, 0, 3]},
        { text: isveren, style: 'normalsol', margin: [0, 3, 0, 3]},
        { text: "Risk Değerlendirme Tarihi", style: 'kalin', margin: [0, 3, 0, 3]},
        { text: riskdegerlendirmetarih, style: 'normalsol', margin: [0, 3, 0, 3]},
        { text: "Risk Değerlendirme Son Geçerlilik Tarihi", style: 'kalin', margin: [0, 3, 0, 3]},
        { text: riskgecerlilikTarih, style: 'normalsol', margin: [0, 3, 0, 3]},
        { text: "Tehlike Sınıfı", style: 'kalin', margin: [0, 3, 0, 3]},
        { text: tehlikesinifi, style: 'normalsol', margin: [0, 3, 0, 3]},
        { text: "Risk Değerlendirmesini Gerçekleştiren Kişiler", style: 'kalin', margin: [0, 3, 0, 3]},
        { text: tumkisiler, style: 'normal', mmargin: [0, 3, 0, 3]},
        { text: "Risk Değerlendirme Metodu", style: 'kalin', margin: [0, 3, 0, 3]},
        { text: "Fine Kinney", style: 'normalsol', margin: [0, 3, 0, 50] }
    ];
    sayfa3.push(clone(riskekipimza));
    let sayfa4 =
    [
        { text: "\u200B\t\u200B\t\u200B\t1. AMAÇ", style: "basliksol", margin: [0, 0, 0, 10]},
        { text: "\u200B\t\u200B\t\u200B\tTehlikeleri Belirlemek", style: "basliksol", margin: [0, 0, 0, 5]},
        { text: "\u200B\t\u200B\t\u200B\tRisk değerlendirmesi, iş yerinde mevcut olan veya ortaya çıkma ihtimali bulunan tehlikelerin sistematik olarak tanımlanmasıdır. Tehlike, çalışanların sağlığına veya güvenliğine zarar verebilecek her türlü kaynak, durum ya da faaliyet anlamına gelir.", style: "normal", margin: [0, 0, 0, 5] },
        { text: "\u200B\t\u200B\t\u200B\tBu kapsamda, fiziksel tehlikeler, kimyasal tehlikeler, biyolojik tehlikeler, ergonomik tehlikeler, psikososyal tehlikeler, çevresel tehlikeler (ısı, nem, gürültü, aydınlatma, havalandırma vb.), davranışsal tehlikeler (yetersiz eğitim, dikkatsizlik, kişisel koruyucu donanım kullanmama) ve benzeri unsurlar dikkatle gözden geçirilir.", style: "normal", margin: [0, 0, 0, 5] },
        { text: "\u200B\t\u200B\t\u200B\tTehlikelerin belirlenmesi için işyeri çalışma ortamı, çalışanların görüş ve önerileri, iş kazası ve meslek hastalıkları verileri, kontrol listeleri ve standartlar gibi araçlardan faydalanılır.", style: "normal", margin: [0, 0, 0, 5] },
        { text: "\u200B\t\u200B\t\u200B\tRiskleri Değerlendirmek", style: "basliksol", margin: [0, 0, 0, 5] },
        { text: "\u200B\t\u200B\t\u200B\tBelirlenen tehlikelerin, çalışanlara ve iş yerine yönelik oluşturduğu riskler, yani olası zararların şiddeti ve bu zararların meydana gelme olasılığı değerlendirilir.", style: "normal", margin: [0, 0, 0, 5] },
        { text: "\u200B\t\u200B\t\u200B\tBu değerlendirme sürecinde:", style: "normal", margin: [0, 0, 0, 5] },
        { text: "\u200B\t\u200B\t\u200B\t• Olası kaza senaryoları düşünülür,", style: "normal", margin: [0, 0, 0, 5] },
        { text: "\u200B\t\u200B\t\u200B\t• Tehlikenin etkileyebileceği kişi sayısı ve etki alanı analiz edilir,", style: "normal", margin: [0, 0, 0, 5] },
        { text: "\u200B\t\u200B\t\u200B\t• Olayın meydana gelme sıklığı ve geçmişte yaşanmış benzer olaylara bakılır.", style: "normal", margin: [0, 0, 0, 5] },
        { text: "\u200B\t\u200B\t\u200B\tElde edilen sonuçlar, risklerin sıralanmasında ve hangi risklere öncelikle müdahale edileceğine rehberlik eder.", style: "normal", margin: [0, 0, 0, 5] },
        { text: "\u200B\t\u200B\t\u200B\tÖnleyici Tedbirleri Planlamak", style: "basliksol", margin: [0, 0, 0, 5] },
        { text: "\u200B\t\u200B\t\u200B\tRisk seviyesi kabul edilemez veya yüksek olan durumlarda, bu riskleri yok etmek veya kontrol altına almak amacıyla önleyici ve düzeltici tedbirler belirlenir. Alınan önlemlerin etkinliği düzenli olarak gözden geçirilmeli ve gerektiğinde güncellenmelidir. Tedbirlerin uygulanması sadece yazılı belgelerle sınırlı kalmamalı; sahada aktif olarak hayata geçirilmelidir.", style: "normal", margin: [0, 0, 0, 5] },
        { text: "\u200B\t\u200B\t\u200B\t2. KAPSAM", style: "basliksol", margin: [0, 10, 0, 10] },
        { text: "\u200B\t\u200B\t\u200B\tBu rapor, 6331 Sayılı İş Sağlığı ve Güvenliği Kanunun 10. ve 30. Maddelerine dayanılarak hazırlanan 29 Aralık 2012 tarihli, 28512 sayılı Resmi Gazetede yayımlanan “İş Sağlığı ve Güvenliği Risk Değerlendirmesi Yönetmeliği” çerçevesinde yapılan risk değerlendirme ve analizi çalışmalarını kapsamaktadır.", style: "normal", margin: [0, 0, 0, 5] },
        { text: "\u200B\t\u200B\t\u200B\tÇalışma ortamının ve çalışanların sağlık ve güvenliğini sağlama, sürdürme ve geliştirme amacı ile iş sağlığı ve güvenliği yönünden risk değerlendirmesi yapılır. Risk değerlendirmesinin gerçekleştirilmiş olması; işverenin, işyerinde iş sağlığı ve güvenliğinin sağlanması yükümlülüğünü ortadan kaldırmaz.", style: "normal", margin: [0, 0, 0, 15] }
    ];
    sayfa4.push(clone(riskekipimza));
    let sayfa5 =
    [
        { text: "\u200B\t\u200B\t\u200B\t3.TANIMLAR", style: "basliksol", margin: [0, 0, 0, 10]},
        { text: "\u200B\t\u200B\t\u200B\tTehlike: İşyerinde var olan ya da dışarıdan gelebilecek, çalışanı veya işyerini etkileyebilecek zarar veya hasar verme potansiyelini,", style: "normal", margin: [0, 0, 0, 5]},
        { text: "\u200B\t\u200B\t\u200B\tRisk: Tehlikeden kaynaklanacak kayıp, yaralanma ya da başka zararlı sonuç meydana gelme ihtimalini,", style: "normal", margin: [0, 0, 0, 5] },
        { text: "\u200B\t\u200B\t\u200B\tRisk değerlendirmesi: İşyerinde var olan ya da dışarıdan gelebilecek tehlikelerin belirlenmesi, bu tehlikelerin riske dönüşmesine yol açan faktörler ile tehlikelerden kaynaklanan risklerin analiz edilerek derecelendirilmesi ve kontrol tedbirlerinin kararlaştırılması amacıyla yapılması gerekli çalışmaları,", style: "normal", margin: [0, 0, 0, 5] },
        { text: "\u200B\t\u200B\t\u200B\tRiskin Derecelendirilmesi: Bir riskin olasılık ve şiddet düzeyine göre değerlendirilerek sayısal veya kategorik bir ölçekle önceliklendirilmesi işlemidir. Bu süreç, hangi risklere önce müdahale edileceğini belirlemede kullanılır.", style: "normal", margin: [0, 0, 0, 5] },
        { text: "\u200B\t\u200B\t\u200B\tKabul edilebilir risk seviyesi: Tüm kontrol tedbirlerinin eksiksiz ve sürekli olarak uygulanması durumunda, söz konusu tehlikeli olayın oluşturabileceği riskin, yasal düzenlemelere ve işyerinin risk önleme politikasına uygun şekilde, kayıp veya yaralanma meydana getirmeyecek düzeye indirgenmiş halidir. Bu seviye, riske karşı alınan önlemlerin etkinliğini ortaya koyar ve yapılan değerlendirmede bu seviyenin altında kalan riskler, iş sağlığı ve güvenliği açısından kabul edilebilir olarak değerlendirilir. Ancak, risk seviyesi bu sınırın üzerindeyse kontrol tedbirleri gözden geçirilerek süreç yeniden başlatılır.", style: "normal", margin: [0, 0, 0, 5] },
        { text: "\u200B\t\u200B\t\u200B\tÖnleme: İşyerinde yürütülen işlerin bütün safhalarında iş sağlığı ve güvenliği ile ilgili riskleri ortadan kaldırmak veya azaltmak için planlanan ve alınan tedbirlerin tümünü,", style: "normal", margin: [0, 0, 0, 5] },
        { text: "\u200B\t\u200B\t\u200B\tTehlike kaynağı: Zarar verme potansiyeline sahip kişi, nesne, durum veya süreçtir.", style: "normal", margin: [0, 0, 0, 5] },
        { text: "\u200B\t\u200B\t\u200B\tOlasılık: Bir tehlikenin, belirli şartlar altında zararlı bir olay meydana getirme ihtimalidir.", style: "normal", margin: [0, 0, 0, 5] },
        { text: "\u200B\t\u200B\t\u200B\tŞiddet (Etkilenme düzeyi): Bir tehlike gerçekleştiğinde ortaya çıkacak sonucun büyüklüğünü veya ciddiyetini ifade eder.", style: "normal", margin: [0, 0, 0, 5] },
        { text: "\u200B\t\u200B\t\u200B\tKontrol tedbiri: Riskleri ortadan kaldırmak veya kabul edilebilir seviyeye indirmek için uygulanan önlem veya önlemler bütünüdür.", style: "normal", margin: [0, 0, 0, 5] },
        { text: "\u200B\t\u200B\t\u200B\tİkame: Tehlikeli bir madde, ekipman veya yöntemin daha az tehlikeli olanla değiştirilmesi işlemidir.", style: "normal", margin: [0, 0, 0, 5] },
        { text: "\u200B\t\u200B\t\u200B\tKişisel Koruyucu Donanım: Çalışanı risklerden korumak amacıyla kullanılan, çalışana özel donanımlardır. Kişisel koruyucu donanımlar son çare olarak kullanılır ve riski tamamen ortadan kaldırmaz, sadece etkisini azaltır.", style: "normal", margin: [0, 0, 0, 5] },
        { text: "\u200B\t\u200B\t\u200B\tİş kazası: Çalışanı bedenen veya ruhen zarara uğratan, ani ve dış etkilerle meydana gelen olaydır.", style: "normal", margin: [0, 0, 0, 5] },
        { text: "\u200B\t\u200B\t\u200B\tMeslek hastalığı: Çalışanda mesleki risklere maruziyet sonucu ortaya çıkan hastalığı ifade eder.", style: "normal", margin: [0, 0, 0, 5] },
        { text: "\u200B\t\u200B\t\u200B\tSorumlu - Görevli Kişi: Risk değerlendirmesinde belirlenen tehlikeli olaya karşı alınması gereken tedbirlerin kontrolü ve eksiklerin giderilmesi işverenin sorumluluğundadır. Sorumlu - Görevli kişi ise, bu eksikliklerin nasıl tamamlanacağını bilen ve sürece dâhil olan kişiyi ifade eder.", style: "normal", margin: [0, 0, 0, 20] },
    ];
    sayfa5.push(clone(riskekipimza));
    let sayfa6 =
    [
        { text: "Kontrol Tedbirinin Tamamlanacağı Tarih: Risk değerlendirmesi sonucunda tespit edilen eksik veya yetersiz kontrol tedbirlerinin en geç uygulanması gereken tarihtir. Bu tarih, ilgili tedbirin zamanında hayata geçirilerek riski kabul edilebilir seviyeye düşürmeyi amaçlayan bir zaman sınırlamasıdır.Esas olan, gerekli önlemlerin mümkün olan en kısa sürede ve bu tarihten önce tamamlanmasıdır.", style: "normal", margin: [0, 0, 0, 5] },
        { text: "\u200B\t\u200B\t\u200B\t4.RİSK KONTROL ADIMLARI", style: "basliksol", margin: [0, 5, 0, 10] },
        { text: "\u200B\t\u200B\t\u200B\tRisklerin kontrolünde aşağıdaki sistematik adımlar izlenir:", style: "normal", margin: [0, 0, 0, 5]},
        { text: "\u200B\t\u200B\t\u200B\tPlanlama: Risklerin analiz edilip etkilerine göre önceliklendirilmesi sonucu, bu riskleri kontrol altına almak amacıyla planlama yapılır.", style: "normal", margin: [0, 0, 0, 5]},
        { text: "\u200B\t\u200B\t\u200B\tRisk kontrol tedbirlerinin kararlaştırılması: Riskin tamamen bertaraf edilmesi hedeflenir. Bu mümkün değilse, riskin kabul edilebilir seviyeye indirilmesi için şu önlemler sırasıyla uygulanır:", style: "normal", margin: [0, 0, 0, 5]},
        { text: "\u200B\t\u200B\t\u200B\tTehlike veya tehlike kaynaklarının tamamen ortadan kaldırılması,", style: "normal", margin: [0, 0, 0, 5] },
        { text: "\u200B\t\u200B\t\u200B\tTehlikeli maddenin, ekipmanın veya sürecin daha az tehlikeli olanla değiştirilmesi (ikame),", style: "normal", margin: [0, 0, 0, 5] },
        { text: "\u200B\t\u200B\t\u200B\tRiskler ile kaynağında mücadele edilmesi.", style: "normal", margin: [0, 0, 0, 5] },
        { text: "\u200B\t\u200B\t\u200B\tBu adımlar uygulanırken, toplu korunma önlemlerine, kişisel korunma önlemlerine göre öncelik verilmesi esastır. Ayrıca, alınacak önlemlerin yeni risklere yol açmaması sağlanmalıdır.", style: "normal", margin: [0, 0, 0, 5] },
        { text: "\u200B\t\u200B\t\u200B\tUygulama ve izleme: Kararlaştırılan önlemler hayata geçirilir ve iş yerinde uygulanması sağlanır. Bu tedbirlerin etkili olup olmadığı düzenli aralıklarla izlenir.", style: "normal", margin: [0, 0, 0, 5] },
        { text: "\u200B\t\u200B\t\u200B\tGözden geçirme: Yeni tehlikelerin ortaya çıkması, kazalar, ramak kala olaylar, proses değişiklikleri veya yasal düzenlemeler gibi durumlarda risk kontrol süreci yeniden değerlendirilir.", style: "normal", margin: [0, 0, 0, 5] },
        { text: "\u200B\t\u200B\t\u200B\tEğitim ve bilgilendirme: Çalışanların, alınan tedbirler hakkında bilgilendirilmesi ve gerektiğinde eğitilmesi sağlanarak uygulamaların etkinliği artırılır.", style: "normal", margin: [0, 0, 0, 5] },
        { text: "\u200B\t\u200B\t\u200B\tBelgelendirme: Yapılan tüm çalışmalar, kontrol tedbirleri, iş ekipmanı ve iş hijyeni ortam sonuçları ve denetim çıktıları uygun şekilde kayıt altına alınır.", style: "normal", margin: [0, 0, 0, 5] },
        { text: "\u200B\t\u200B\t\u200B\t5.İŞ EKİPMANI PERİYODİK KONTROLLERİ", style: "basliksol", margin: [0, 5, 0, 10] },
        { text: "\u200B\t\u200B\t\u200B\tBu risk değerlendirmesine bahsi geçen kontroller ve bu kontrolleri yapmayı yetkili kişilerin meslekleri şu şekildedir;", style: "normal", margin: [0, 0, 0, 5] },
        { text: "A Meslek Grubu: Elektrik Mühendisi, Elektrik Elektronik Mühendisi, Elektrik Teknikeri ve Elektrik Teknik Öğretmeni mesleklerini ifade eder.", style: "normal", margin: [0, 0, 0, 5] },
        { text: "B Meslek Grubu: Elektronik Mühendisi mesleğini ifade eder.", style: "normal", margin: [0, 0, 0, 5] },
        { text: "C Meslek Grubu: Makine Mühendisi, Makine Teknikeri, Makine Teknik Öğretmeni, Metal Teknik Öğretmeni mesleklerini ifade eder.", style: "normal", margin: [0, 0, 0, 5] },
        { text: "D Meslek Grubu: Mekatronik Mühendisi mesleğini ifade eder.", style: "normal", margin: [0, 0, 0, 5] },
        { text: "E Meslek Grubu: İnşaat Mühendisi, İnşaat Teknikeri, İnşaat Teknik Öğretmeni, Yapı Teknik Öğretmeni mesleklerini ifade eder.", style: "normal", margin: [0, 0, 0, 10] },
    ];
    sayfa6.push(clone(riskekipimza));
    const tickSvgResponse = await fetch('https://mehmetceranx12.github.io/isgevraknode/svg/tick.svg');
    if (!tickSvgResponse.ok) { throw new Error('Tik ikonu yüklenemedi.'); }
    const tickSvg = await tickSvgResponse.text();
    let sayfa7 =
    [{
        table:
        {
            headerRows: 2,
            widths: ['31%', '11.5%', '11.5%', '11.5%', '11.5%', '11.5%', '11.5%'],
            body:
            [
                [
                    {text:"İŞ EKİPMANI PERİYODİK KONTROL LİSTESİ",style:"baslikorta",colSpan:7},
                    ...Array(6).fill('')],
                [
                    { text: 'Kontrol Edilen Ekipman', style: 'normalorta'},
                    ..."ABCDEF".split("").map(g=>({text:`${g} Grubu Meslek`, style: 'normalorta'}))
                ],
                ...riskisekipmanikontrollistesi.slice(0, 14).map(item =>
                [
                    { text: item.k, style: 'normal'},
                    ...['x1','x2','x3','x4','x5','x6'].map(x => Number(item[x])===1 ? {svg:tickSvg,width:15,height:15,alignment:'center'} : {text:'X',alignment:'center'})
                ])
            ]
        }
    }];
    sayfa7.push({ text: '', margin: [0, 8] });
    sayfa7.push(clone(riskekipimza));
    let sayfa8 =
    [{
        table:
        {
            headerRows: 2,
            widths: ['31%', '11.5%', '11.5%', '11.5%', '11.5%', '11.5%', '11.5%'],
            body:
            [
                [
                    {text:"İŞ EKİPMANI PERİYODİK KONTROL LİSTESİ",style:"baslikorta",colSpan:7},
                    ...Array(6).fill('')],
                [
                    { text: 'Kontrol Edilen Ekipman', style: 'normalorta'},
                    ..."ABCDEF".split("").map(g=>({text:`${g} Grubu Meslek`, style: 'normalorta'}))
                ],
                ...riskisekipmanikontrollistesi.slice(14).map(item =>
                [
                    { text: item.k, style: 'normal'},
                    ...['x1','x2','x3','x4','x5','x6'].map(x => Number(item[x])===1 ? {svg:tickSvg,width:15,height:15,alignment:'center'} : {text:'X',alignment:'center'})
                ])
            ]
        }
    }];
    sayfa8.push({ text: '', margin: [0, 8] });
    sayfa8.push(clone(riskekipimza));


    let sayfa9 = [];
    sayfa9.push(finekinneyskor);
    sayfa9.push({ text: '', margin: [0, 8] });
    sayfa9.push(clone(riskekipimza));
    const dokuman =
    {
        pageMargins: [40, 40, 40, 40],
        background: function (currentPage) { if (currentPage === 1) { return pdfcerceve(); } return null; },
        content:
        [
            { stack: sayfa1},
            { text: '', pageBreak: 'after' },
            { stack: sayfa2 },
            { text: '', pageBreak: 'after' },
            { stack: sayfa3 },
            { text: '', pageBreak: 'after' },
            { stack: sayfa4},
            { text: '', pageBreak: 'after' },
            { stack: sayfa5},
            { text: '', pageBreak: 'after' },
            { stack: sayfa6 },
            { stack: sayfa7, pageBreak: 'before', pageOrientation: 'landscape' },
            { text: '', pageBreak: 'after' },
            { stack: sayfa8 },
            { text: '', pageBreak: 'after' },
            { stack: sayfa9 },
        ],
        footer: function (currentPage)
        {
            if (currentPage === 2) { return { text: "Sayfa: 1", style: "altbilgi", margin: [0, 0, 40, 0] }; }
            if (currentPage === 3) { return { text: "Sayfa: 2", style: "altbilgi", margin: [0, 0, 40, 0] }; }
            if (currentPage === 4) { return { text: "Sayfa: 3", style: "altbilgi", margin: [0, 0, 40, 0] }; }
            if (currentPage === 5) { return { text: "Sayfa: 4", style: "altbilgi", margin: [0, 0, 40, 0] }; }
            if (currentPage === 6) { return { text: "Sayfa: 5", style: "altbilgi", margin: [0, 0, 40, 0] }; }
            if (currentPage === 7) { return { text: "Sayfa: 6", style: "altbilgi", margin: [0, 0, 40, 0] }; }
            if (currentPage === 8) { return { text: "Sayfa: 7", style: "altbilgi", margin: [0, 0, 40, 0] }; }
            if (currentPage === 9) { return { text: "Sayfa: 8", style: "altbilgi", margin: [0, 0, 40, 0] }; }
            return null;
        },
        styles:
        {
            kapakust: { fontSize: 22, bold: true, alignment: 'center'},
            kapakalt: { fontSize: 14, bold: false, alignment: 'center'},
            kapakyil: { fontSize: 18, bold: true, alignment: 'center'},
            normal: { fontSize: 11, bold: false, alignment: 'justify'},
            normalsol: { fontSize: 11, bold: false, alignment: 'left'},
            normalorta: { fontSize: 11, bold: false, alignment: 'center'},
            kalin: { fontSize: 11, bold: true, alignment: 'justify'},
            baslikorta: { fontSize: 12, bold: true, alignment: 'center'},
            basliksol: { fontSize: 12, bold: true, alignment: 'left'},
            imzaad: { fontSize: 11, bold: true, alignment: 'center'},
            imzaunvan: { fontSize: 11, bold: false, alignment: 'center'},
            altbilgi: { fontSize: 11, bold: false, alignment: 'right'}
        }
    };
    pdfMake.createPdf(dokuman).download('Risk Değerlendirme Giriş - ' + metinuret(3) + '.pdf');
}

function ciktidevam1r1()
{
    let firmaid = firmasecimoku();
    let tarih = $('#tarih').val().trim()
    if (tarihkontrol(tarih) === false)
    {
        alertify.error("Lütfen geçerli bir tarih giriniz");
        return;
    }
    store.set("riskdegerlendirmetarih", tarih);
    var kapaksecim = $('#kapaksecim')[0].selectedIndex + 1;
    store.set("riskdegerlendirmetarih", tarih);
    store.set("riskkapaksecim", kapaksecim);
    window.location.href = "/riskcikti2?id=" + encodeURIComponent(firmaid);
}

async function riskcikti2load()
{
    try
    {
        const { response, json } = await riskcikti2genelgetir();
        if (!response.ok)
        {
            alertify.error(json.error || "Risk değerlendirme listesi alınamadı");
            return false;
        }
        store.set("riskciktigenelliste", Array.isArray(json) ? json : []);
        $("#riskcikti2button").off("click").on("click", function ()
        {
            return ciktidevamr5node();
        });
        ciktiload2r4();
        return true;
    }
    catch (error)
    {
        console.log("riskcikti2load hata", error);
        alertify.error("Risk değerlendirme listesi alınamadı");
        return false;
    }
}

function ciktiload2r4()
{    
    let json = riskStoreJsonOku("riskciktigenelliste");
    if (!Array.isArray(json))
    {
        json = [];
    }
    const ozelliste = [3, 4, 9, 11, 12, 55, 63, 68, 84, 87, 113, 114, 129, 140, 142, 153, 167, 300];
    const ozeljson = json.filter(item => ozelliste.includes(item.i));
    json.sort((x, y) => x.a.localeCompare(y.a, 'tr'));
    ozeljson.sort((x, y) => x.a.localeCompare(y.a, 'tr'));
    function genelRiskTableYukle(data)
    {
        if ($.fn.DataTable.isDataTable('#genelrisktablo'))
        {
            $('#genelrisktablo').DataTable().destroy();
            $('#genelrisktablo').empty();
        }
        $('#genelrisktablo').DataTable(
            {
                ordering: false,
                pageLength: 10,
                lengthMenu: [[10, 25, 50, -1], [10, 25, 50, 'Tümü']],
                data: data,
                columns:
                    [
                        { data: 'a', title: 'Risk Değerlendirme Adı', width: '80%' },
                        { data: 'o', title: 'Onay', width: '10%', render: d => d == 1 ? '✓' : '' },
                        {
                            data: 'i',
                            title: 'Ekle',
                            orderable: false,
                            width: '10%',
                            render: d =>
                                `<input name="ekle" type="button" class="cssbutontamam" value="Ekle" data-id="${d}"/>`
                        }
                    ],
                language:
                {
                    search: "Risk Değerlendirme Ara:",
                    lengthMenu: "Sayfa başına _MENU_ kayıt göster",
                    zeroRecords: "Eşleşen kayıt bulunamadı",
                    info: "_TOTAL_ kayıttan _START_ ile _END_ arası gösteriliyor",
                    infoEmpty: "Kayıt yok",
                    infoFiltered: "(toplam _MAX_ kayıttan filtrelendi)",
                    emptyTable: "Risk değerlendirmesi bulunamadı"
                },
                headerCallback: t => $(t).find('th').css('text-align', 'center'),
                createdRow: row => $(row).find('td').eq(0).css('text-align', 'left')
            });

        $('.dt-search input').css({ "background-color": "white" }).attr("autocomplete", "off");
        $('.dt-length select').css({ "background-color": "white" });
    }
    genelRiskTableYukle(json);
    $('#riskfiltre').on('change', function ()
    {
        if (this.value === "1") {
            genelRiskTableYukle(ozeljson);
        }
        else
        {
            genelRiskTableYukle(json);
        }            
    });
    $("#diyaloggenelrisktablo").fadeIn();
    let anatablo = $('#risktablocikti').DataTable
    ({
        dom: 't',
        pageLength: -1,
        ordering: false,
        columns:
        [
            {
                data: null,
                title: 'Sıra',
                width: '14%',
                orderable: false,
                searchable: false,
                render: (d, t, r) => `<input type="button" class="cssbutontamam risk-sira-buton" value="↑" title="Yukarı taşı" data-id="${r.i}" onclick="riskcikti2sirayukari(this);"/><input type="button" class="cssbutontamam risk-sira-buton" value="↓" title="Aşağı taşı" data-id="${r.i}" onclick="riskcikti2siraasagi(this);"/>`
            },
            { data: 'a', title: "Risk Değerlendirme Listesi", width: "100%" },
            { data: 'i', title: 'Sil', width: '10%', render: d => `<input name="sil" type="button" class="cssbutontamam" value="Sil" data-id="${d}" />` }
        ],
        headerCallback: thead => $(thead).find('th').css('text-align', 'center'),
        createdRow: row => $(row).find('td').eq(0).css({ 'text-align': 'left' })
    });
    $(document).on('click', 'input[name="ekle"]', function ()
    {
        const id = $(this).data('id');
        const table = $(this).closest('table').attr('id');
        const sourceTable = $('#' + table).DataTable();
        const satirVerisi = sourceTable.data().toArray().find(x => x.i == id);
        if (satirVerisi)
        {
            anatablo.row.add({ a: satirVerisi.a, i: satirVerisi.i }).draw();
        }
        $("#diyaloggenelrisktablo").fadeOut();
        $("#diyalogsikrisktablo").fadeOut();
        $("#risktablodiv").fadeIn();
        if (anatablo.rows().count() === 50)
        {
            $("#riskeklebuton").fadeOut();
            alertify.error("En fazla üç tane İSG talimatı ekleyebilirsiniz");
        }
        else
        {
            $("#riskeklebuton").fadeIn();
        }
        if (anatablo.rows().count() > 1) $("#bilgi").fadeIn();
        else $("#bilgi").fadeOut();
    });
    $(document).on('click', 'input[name="sil"]', function ()
    {
        const id = $(this).data('id');
        anatablo.rows().every(function ()
        {
            const data = this.data();
            if (data.i == id)
            {
                this.remove().draw();
                return false;
            }
        });
        if (anatablo.rows().count() === 0) $("#risktablodiv").fadeOut();
        if (anatablo.rows().count() !== 50) $("#riskeklebuton").fadeIn();
        else $("#riskeklebuton").fadeOut();
        if (anatablo.rows().count() > 1) $("#bilgi").fadeIn();
        else $("#bilgi").fadeOut();
    });
}

function riskcikti2sirayukari(button)
{
    riskcikti2siradegistir(button.getAttribute("data-id"), -1);
}

function riskcikti2siraasagi(button)
{
    riskcikti2siradegistir(button.getAttribute("data-id"), 1);
}

function riskcikti2siradegistir(id, yon)
{
    const tablo = $('#risktablocikti').DataTable();
    const liste = tablo.rows().data().toArray();
    const index = liste.findIndex(item => String(item.i) === String(id));
    const yeniIndex = index + yon;
    if (index < 0 || yeniIndex < 0 || yeniIndex >= liste.length)
    {
        return;
    }
    [liste[index], liste[yeniIndex]] = [liste[yeniIndex], liste[index]];
    tablo.clear().rows.add(liste).draw();
}

function ciktidevamr5()
{
    let liste = [];
    $('#risktablocikti tbody tr').each(function ()
    {
        let id = $(this).find('input[name="sil"]').data('id');
        if (id !== undefined)
        {
            liste.push(id);
        }
    });
    if (liste.length === 0)
    {
        alertify.error("Risk Değerlendirmesi Bulunamadı");
        return false;
    }
    else if(liste.length > 0)
    {
        store.set("riskciktisecilenids", liste);
        return true;
    }
}

////////////////YARDIMCI FONKSİYON////////////////YARDIMCI FONKSİYON////////////////YARDIMCI FONKSİYON////////////////YARDIMCI FONKSİYON////////////////YARDIMCI FONKSİYON
function riskgecerlilik(tarih, tehlike) { if (!tarih) return ""; const [g, a, y] = tarih.split(".").map(Number); if (!g || !a || !y) return ""; let e = 0; switch (tehlike) { case 1: e = 6; break; case 2: e = 4; break; case 3: e = 2; break; default: return "" }const d = new Date(y + e, a - 1, g), p = n => n.toString().padStart(2, "0"); return `${p(d.getDate())}.${p(d.getMonth() + 1)}.${d.getFullYear()}` }
function isyeribaslikayar(a, v) { if (!v || typeof v !== "string" || v.trim().length === 0) { alert("Lütfen geçerli bir veri girin!"); return } const k = v.trim().split(" ").filter(k => k.length > 0); if (k.length === 0) { alert("Geçerli veri girin!"); return } let s = {}; switch (a) { case 1: s = { ustbaslik: k[0], altbaslik: k.slice(1).join(" ") }; break; case 2: if (k.length < 2) { alert("Script 2 için en az 2 kelime gerekli!"); return } s = { ustbaslik: k.slice(0, 2).join(" "), altbaslik: k.slice(2).join(" ") }; break; case 3: if (k.length < 3) { alert("Script 3 için en az 3 kelime gerekli!"); return } s = { ustbaslik: k.slice(0, 3).join(" "), altbaslik: k.slice(3).join(" ") }; break; default: alertify.error("Geçersiz giriş (1, 2 veya 3 olmalı)"); return }return s }

function riskhesaplama()
{
    const s = parseFloat($('#siddetsecim').val());
    const f = parseFloat($('#frekanssecim').val());
    const o = parseFloat($('#olasiliksecim').val());
    if (isNaN(s) || isNaN(f) || isNaN(o))
    {
        $('#tehlikesonuc').html('').hide();
        return;
    }
    const risk = s * f * o;
    let riskSeviye = "";
    let renk = "";
    if (risk < 21)
    {
        riskSeviye = "20 ≥ Kabul Edilebilir Risk";
        renk = "green";
        yazi = "white";
    }
    else if (risk < 71)
    {
        riskSeviye = "70 ≥ Risk > 20 Olası Risk";
        renk = "yellow";
        yazi = "black";
    }
    else if (risk < 201)
    {
        riskSeviye = "200 ≥ Risk > 70 Önemli Risk";
        renk = "darkblue";
        yazi = "white";
    }
    else if (risk < 401)
    {
        riskSeviye = "400 ≥ Risk > 200 Yüksek Risk";
        renk = "purple";
        yazi = "white";
    }
    else
    {
        riskSeviye = "Risk > 400 Tolere Edilmez Risk";
        renk = "firebrick";
        yazi = "white";
    }
    $('#tehlikesonuc').html(`<div style="padding: 0.3vw; width: 18vw; text-align:center; border-radius:0.5vw; font-weight:bold; background:${renk}; color:${yazi}">${riskSeviye}</div>`).show();
}

function riskduzenletemizle()
{
    $('#b').val("");
    $('#c').val("");
    $('#d').val("");
    $('#e').val("");
    $("#siddetsecim").val("");
    $("#frekanssecim").val("");
    $("#olasiliksecim").val("");
    $('#siddetsecim, #frekanssecim, #olasiliksecim').trigger('change');
    $("#f1").val("");
    $("#g1").val("");
    $("#f2").val("");
    $("#g2").val("");
    $("#f3").val("");
    $("#g3").val("");
    $("#f4").val("");
    $("#g4").val("");
    $("#f5").val("");
    $("#g5").val("");
    $("#f6").val("");
    $("#g6").val("");
    $("#f7").val("");
    $("#g7").val("");
    $("#f8").val("");
    $("#g8").val("");
    $("#f9").val("");
    $("#g9").val("");
    $("#f10").val("");
    $("#g10").val("");
    $("#f11").val("");
    $("#g11").val("");
    $("#f12").val("");
    $("#g12").val("");
}

function addegistirr8()
{    
    let veri = riskDuzenleVeriOku();
    const yenibaslik = $('#riskdegerlendirmead').val();
    veri.x[0] = yenibaslik;
    riskDuzenleVeriYaz(veri);
    store.set("riskduzenleyeniad", yenibaslik);
    $('#diyologriskad').fadeOut();
    $('#riskbaslik').text(yenibaslik + " Risk Değerlendirmesi Düzenleme");
    return true;
}

function riskkaydetr9()
{
    let kontrol = store.get("riskkontrol");
    if (kontrol === "1")
    {
        let veri = riskDuzenleVeriOku();
        const index = parseInt(store.get("riskindex"));
        const riskicerik = veri.w[index];
        riskicerik.b = $('#b').val();
        riskicerik.c = $('#c').val();
        riskicerik.d = $('#d').val();
        riskicerik.e = $('#e').val();
        riskicerik.k = parseFloat($('#siddetsecim').val());
        riskicerik.l = parseFloat($('#frekanssecim').val());
        riskicerik.m = parseFloat($('#olasiliksecim').val());
        riskicerik.q = [];
        for (let i = 1; i <= 12; i++)
        {
            const f = $('#f' + i).val();
            const g = $('#g' + i).val();
            if (f || g) {
                riskicerik.q.push({ f, g });
            }
        }
        if (!riskicerik.b || !riskicerik.c || !riskicerik.d || !riskicerik.e || !riskicerik.q.length || Number.isNaN(riskicerik.k) || Number.isNaN(riskicerik.l) || Number.isNaN(riskicerik.m))
        {
            alertify.error("Lütfen tüm zorunlu alanları doldurunuz");
            return false;
        }
        riskDuzenleVeriYaz(veri);
        
        $('#diyologriskduzenleme').fadeOut();
        return true;
    }
    else if (kontrol === "2")
    {
        let veri = riskDuzenleVeriOku();
        const yenikayit =
        {
            id: Math.floor(Math.random() * 1000000) + 1,
            b: $('#b').val(),
            c: $('#c').val(),
            d: $('#d').val(),
            e: $('#e').val(),
            k: parseFloat($('#siddetsecim').val()),
            l: parseFloat($('#frekanssecim').val()),
            m: parseFloat($('#olasiliksecim').val()),
            q: []
        };
        for (let i = 1; i <= 12; i++)
        {
            const f = $('#f' + i).val();
            const g = $('#g' + i).val();
            if (f || g)
            {
                yenikayit.q.push({ f, g });
            }
        }
        if (!yenikayit.b || !yenikayit.c || !yenikayit.d || !yenikayit.e || !yenikayit.q.length || Number.isNaN(yenikayit.k) || Number.isNaN(yenikayit.l) || Number.isNaN(yenikayit.m))
        {
            alertify.error("Lütfen tüm zorunlu alanları doldurunuz");
            return false;
        }
        veri.w.push(yenikayit);
        riskDuzenleVeriYaz(veri);        
        $('#diyologriskduzenleme').fadeOut();
        return true;
    }
    else if (kontrol === "3")
    {
        let veri = riskDuzenleVeriOku();
        const index = parseInt(store.get("riskindex"));
        if (isNaN(index) || index < 0 || index >= veri.w.length)
        {
            alertify.error("Silinecek kayıt bulunamadı");
            return false;
        }
        veri.w.splice(index, 1);
        riskDuzenleVeriYaz(veri);
        $('#diyologrisksil').fadeOut();
        return true;
    }
    return false;
}

function risksiralar10()
{
    try
    {
        let veri = store.get("riskdegerlendirmesirali");
        if (typeof veri === "string")
        {
            veri = JSON.parse(veri);
        }
        riskDuzenleVeriYaz(veri);
        return true;
    }
    catch (ex)
    {
        console.log(ex);
        return false;
    }
}

function risksiralar11()
{
    var data = riskDuzenleVeriOku();
    if (!data) return;
    if ($.fn.DataTable.isDataTable('#riskdegerlendirmetablo'))
    {
        $('#riskdegerlendirmetablo').DataTable().destroy();
        $('#riskdegerlendirmetablo tbody').empty();
    }
    $('#riskdegerlendirmetablo').DataTable({
        data: data.w,
        rowId: 'id',
        columns: [
            {
                data: 'c',
                title: 'Tehlike',
                className: 'text-left'
            },
            {
                data: 'd',
                title: 'Risk',
                className: 'text-left'
            },
            {
                data: 'id',
                visible: false,
                searchable: false
            }
        ],
        paging: false,
        dom: 't',
        info: false,
        ordering: false,
        searching: false,
        createdRow: function (row) {
            $(row).find('td:eq(0), td:eq(1)').css('text-align', 'left');
        },
        headerCallback: function (thead) {
            $(thead).find('th').css('text-align', 'center');
        },
        initComplete: function ()
        {
            $("#riskdegerlendirmetablo tbody").sortable({
                helper: function (e, tr) {
                    var $originals = tr.children();
                    var $helper = tr.clone();
                    $helper.children().each(function (index) {
                        $(this).width($originals.eq(index).width());
                    });
                    return $helper;
                },
                update: function ()
                {
                    let yeniSiraliIdListesi = [];
                    $('#riskdegerlendirmetablo tbody tr').each(function () {
                        let id = parseInt(this.id);
                        if (!isNaN(id)) yeniSiraliIdListesi.push(id);
                    });
                    let orijinal = data.w;
                    let sirali = yeniSiraliIdListesi
                        .map(id => orijinal.find(x => x && x.id === id))
                        .filter(x => x);
                    data.w = sirali;
                    store.set("riskdegerlendirmesirali", data);
                }
            }).disableSelection();
        }
    });
    $('.dt-search input').css({ "background-color": "white" }).attr("autocomplete", "off");
    $('.dt-length select').css({ "background-color": "white" });
    $("#diyologrisksiralama").fadeIn();
}
