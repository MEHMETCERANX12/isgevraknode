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
        anaDiv.find('.kontroller').append(`<div class="cssdivortala"><input name="risksil" type="button" class="cssbutontumu" onclick="riskduzenlemesil();" value="Bu Kısmı Sil" data-id="${item.id}" />&emsp;&emsp;<input name="riskduzenle" type="button" class="cssbutontumu" value="Bu Kısmı Düzenle" data-id="${item.id}" /></div><div class="cssboslukalt1"></div>`);
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
    const iconBase64 = 'data:image/png;base64,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AADGPwAIACACAGD8A4AAACIAAMY/AAgAIAIAYPwDgAAAIgAAxj8ACAAgAgAY/8Y/AAgAIAIAGP8AgAAAIgCA8Q8ACAAgAgAY/wAgAAAiAIDxDwACACACABj/ACAAgAgAgPEPAAIAiAAAGP8AIACACABg/AMAAgCIAADGPwAgAIAIAGD8AwACAIgAAMY/AAgAgAgAYPwDgAAAiAAAxj8ACACACABg/AOAAAAigAgAGP8AgAAAIgCA8Q8ACAAgAgAY/wCAAAAiAIDxDwAIACACABj/ACAAACIAgPEPAAIAIAIAGP8AIAAAIgCA8Q8AAgAgAgDGPwAgAAAiAGD8AwACAIgAAMY/ACAAgAgAYPwDAAIAiAAAxj8ACACOAEQAAOMfAAQAQAQAMP4BQAAARADA+AcABABABACMfwBAAABEAMD4BwAEAEAEAIx/AEAAABFABACMfwBAAAARAMD4BwAEABABAIx/ABAAABEAMP4BAAEAEAEA4x8AEAAAEQAw/gEAAQAQAQDjHwAQAAARADD+AQABABABAOMfABAAABEAMP4BAAEARAAA4x8ABABABACMfwBAAABEAMD4BwAEAEAEAIx/AEAAAEQAwPgHAAQAQAQAjH8AQAAARADA+AcABABABACMfwBAAABEADD+AQABABABRAAw/gEAAQAQAQDjHwAQAAARADD+AQABABABAOMfABAAABEAMP4BAAEAEAEA4x8AEAAAEQCMf+MfABAAABEAjH8AAAEAEAHA+AcABAAAEQCMfwBAAABEAMD4BwAEAEAEAIx/AEAAAEQAwPgHAAQAQAQAjH8AQAAARAAw/gEABABABADjHwBAAABEADD+AQABAEAEAOMfABAAAEQAMP4BAAEAEAFEADD+AQABABABAOMfABAAABEAjH8AAAEAEAHA+AcAEAAAEQCMfwAAAQAQAcD4BwAEAAARAIx/AEAAABABwPgHAAQAABEAjH8AQAAAEAHA+AcABABABADjHwBAAABEADD+AQAEAEAEAOMfAEAAAEQAMP4BAAQAQAQA4x8AEAAARAAw/gEAAQBABADjHwAQAABEAIx/AAABAEAEwPgHABAAAEQAjH8AAAEAEAHA+AcAEAAAEQCMfwAAAQAQAcD4BwAEAAARAIx/AEAAABABMP4BAAQAABEA4x8AQAAAEAEw/gEABAAAEQDjHwBAAAAQATD+AQAEAEAEEAEw/gEABABABADjHwAQAABEADD+AQABAEAEwPgHABAAAEQAjH8AAAEAQATA+AcAEAAARACMfwAAAQBABMD4BwAQAABEAIx/AAABAEAEwPgHABAAABEA4x8AQAAAEAEw/gEABAAAEQDjHwBAAAAQATD+AQAEAAARAOMfAEAAABABMP4BAAQAABEA4x8AQAAAOHcEMBiNfwCAsG46AoCiaNv2l/R6XZZllf5y6kSMfwAAAQAgdggQAYYp38Xx5zT+/+ooAAA+zkcAAP5PGpEP0tsDJzGo8X83/b4dOQoAAAEAYNMIcJje7nXjkv7KD2/8Kv1+eYgjAIAAAHDuCJB/ouwbAvrrsFj/5F+kAQA4gx1HAHC63d3dSXp7kV57TqM3POwPAGBDHgII8AndNwT8rSzLn9Nf3kmvW07l2uS7Mf6Yxv/fHQUAwGZ8BADgjNLofFb4SMB1en/+Pu8PAHA+PgIAcA67u7tP0ttjJ3EllsX6lv+5owAAOD93AACcQxqjOQDcLtwNcNnyT/1vG/8AANtzBwDAlnZ3dx8V67sBJk7jwuSwsm/4AwAIAAB9iwB5/B+k18xpbGXVDf9DRwEAIAAA9DkEVF0I8JWBmw//5+n1LI3/leMAABAAAIYSAupi/bGA2mkY/gAAAgDAOELA/cJHAwx/AAABAGAUIaAq1ncE5I8GjPlhgctu+B8a/gAAAgBA5BAw6SLAw/Sajugf/TC9XnqqPwCAAAAwxhiQA8D9LghUAf8R81f55Z/2H/lpPwCAAABArBgwT6/X3ehf+p0FABAAAPjtGFB1IeCbYv0tAn1+ZsDyg9E/95N+AAABAIDzB4F8d8C0CwInv74Oedzn2/qPu/eFn/IDAAgAAFx+FKi6GPBl9+vJBcWBefd+/MFfL419AAABAID+BYKNYoCn8wMAAAAAAARwwxEAAACAAAAAAAAIAAAAAIAAAAAAAAgAAAAAgAAAAAAACAAAAACAAAAAAAAIAAAAACAAAAAAAAIAAAAAIAAAAAAAAgAAAAAgAAAAAAACAAAAACAAAAAAAAIAAAAACAAAAACAAAAAAAAIAAAAAIAAAAAAAAgAAAAAgAAAAAAACAAAAACAAAAAAAACAAAAACAAAAAAAAIAAAAAIAAAAAAAAgAAAAAgAAAAAAACAAAAACAAAAAAAAIAAAAACAAAAACAAAAAAAAIAAAAAIAAAAAAAAgAAAAAgAAAAAAACAAAAACAAAAAAAACAAAAACAAAAAAAAIAAAAAIAAAAAAAAgAAAAAgAAAAAAACAAAAACAAAAAAgAAAAAAACAAAAACAAAAAAAAIAAAAAIAAAAAAAAgAAAAAgAAAAAAACAAAAACAAAAAAAACAAAAACAAAAAAAAIAAAAAIAAAAAAAAgAAAAAgAAAAAAACAAAAACAAAAAAgAAAAAAACAAAAACAAAAAAAAIAAAAAIAAAAAAAAgAAAAAgAAAAAAACAAAAAAgAAAAAAACAAAAACAAAAAAAAIAAAAAIAAAAAAAAgAAAAAgAAAAAAACAAAAACAAAAAAgAAAAAAACAAAAACAAAAAAAAIAAAAAIAAAAAAAAgAAAAAgAAAAAAACAAAAAAgAAAAAAACAAAAACAAAAAAAAIAAAAAIAAAAAAAAgAAAAAgAAAAAAACAAAAAAgAAAAAgAAAAAAACAAAAACAAAAAAAAIAAAAAIAAAAAAAAgAAAAAgAAAAAAACAAAAAAgAAAAAAACAAAAACAAAAAAAAIAAAAAIAAAAAAAAgAAAAAgAAAAAAACAAAAAAgAAAAAgAAAAAAACAAAAACAAAAAAAAIAAAAAIAAAAAAAAgAAAAAgAAAAAAAAgAAAAAgAAAAAAACAAAAACAAAAAAAAIAAAAAIAAAAAAAAgAAAAAgAAAAAAACAAAAAAgAAAAAgAAAAAAACAAAAACAAAAAAAAIAAAAAIAAAAAAAAgAAAAAgAAAAAAAAgAAAAAgAAAAAAACAAAAACAAAAAAAAIAAAAAIAAAAAAAAgAAAAAgAAAAAIAAAAAAAAgAAAAAgAAAAAAACAAAAMB/2bEDGQAAAIBB/tb3+AojAAEAAAAACAAAAABAAAAAAAACAAAAABAAAAAAIAAAAAAAAQAAAAAIAAAAAEAAAAAAAAIAAAAAEAAAAACAAAAAAAAEAAAAAAgAAAAAQAAAAAAAAgAAAAAQAAAAAIAAAAAAAAQAAAAAIAAAAAAAAQAAAAACAAAAABAAAAAAgAAAAAAABAAAAAAgAAAAAAABAAAAAAgAAAAAQAAAAAAAAgAAAAAEAAAAACAAAAAAAAEAAAAACAAAAABAAAAAAAACAAAAABAAAAAAgAAAAAAAAQAAAAAIAAAAAEAAAAAAAAIAAAAAEAAAAACAAAAAAAAEAAAAACAAAAAAQAAAAAAAAgAAAAAQAAAAAIAAAAAAAAQAAAAAIAAAAAAAAQAAAAAIAAAAAEAAAAAAgAAAAAAAFhJAgAEApKo6nvcfVk8AAAAASUVORK5CYII=';
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
                    ...['x1','x2','x3','x4','x5','x6'].map(x => Number(item[x])===1 ? {image:'tickIcon',width:15,height:15,alignment:'center'} : {text:'X',alignment:'center'})
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
                    ...['x1','x2','x3','x4','x5','x6'].map(x => Number(item[x])===1 ? {image:'tickIcon',width:15,height:15,alignment:'center'} : {text:'X',alignment:'center'})
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
        images: { tickIcon: iconBase64},
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
    window.location.href = "/riskdegerlendirmecikti2?id=" + encodeURIComponent(firmaid);
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
    $("#risktablocikti tbody").sortable({helper:fixHelper,update:function(){const n=[];$("#risktablocikti tbody tr").each(function(){n.push($(this).find("td:eq(0)").text())})}}).disableSelection();
    function fixHelper(e,tr){const $originals=tr.children();const $helper=tr.clone();$helper.children().each(function(i){$(this).width($originals.eq(i).width())});return $helper}
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

function ciktidevamr5node()
{
    if (!ciktidevamr5())
    {
        return false;
    }
    const firma = String(store.get('xfirmaid') || '').trim();
    const ids = riskStoreJsonOku("riskciktisecilenids");
    if (!firma || !Array.isArray(ids) || !ids.length)
    {
        alertify.error("Risk Değerlendirmesi Bulunamadı");
        return false;
    }
    window.location.href = "/riskdegerlendirmecikti3?firmaid=" + encodeURIComponent(firma) + "&ids=" + encodeURIComponent(ids.join(","));
    return true;
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
        for (let i = 1; i <= 10; i++)
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
        for (let i = 1; i <= 10; i++)
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
