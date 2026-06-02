function sayfaApiYolu(yol)
{
    const kok = window.location.pathname.replace(/\/$/, "");
    return kok + (String(yol).startsWith("/") ? yol : "/" + yol);
}

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

function talimatApiIstek(url, secenekler)
{
    return fetch(url, {
        credentials: "same-origin",
        headers: { "Content-Type": "application/json", ...(secenekler?.headers || {}) },
        ...secenekler
    }).then(async (response) =>
    {
        const veri = await response.json().catch(() => null);
        if (!response.ok)
        {
            const hata = new Error((veri && veri.error) || "İşlem başarısız");
            hata.response = response;
            hata.data = veri;
            throw hata;
        }
        return veri;
    });
}

function talimatSeciliIdleriOku()
{
    const liste = [];
    $('#talimatliste tbody tr').each(function ()
    {
        const id = parseInt($(this).find('input[name="sil"]').data('id'), 10);
        if (Number.isInteger(id) && id > 0)
        {
            liste.push(id);
        }
    });
    return liste;
}

function talimatidbul()
{
    const url = new URL(window.location.href);
    const id = parseInt(url.searchParams.get("id") || "", 10);
    return Number.isInteger(id) && id > 0 ? id : 0;
}

function talimatcikti3load()
{
    let calisanjson = store.get("talimatcikti3calisanlar");
    calisanjson = Array.isArray(calisanjson) ? calisanjson : [];
    $('#tablo').DataTable
    ({
        data: calisanjson,
        columns:
        [
            {data:null,orderable:false,render:DataTable.render.select(),width:"80px"},
            { data: "x", title: "Ad Soyad" },
            { data: "y", title: "Unvan" },
            { title: "Yazdır", data: null, orderable: !1, searchable: !1, render: function (a, b, c, d) { return `<input type="button" value="Word Yazdır" class="cssbutontamam" data-ad="${c.x}" data-un="${c.y}" onclick="talimatyazdirword(this);">` } }
        ],
        select: { style: "multi", selector: "td:first-child" },
        ordering: false,
        pageLength: -1, 
        dom: 't',
        language:{select:{rows:"%d satır seçildi"},search:"Çalışan Ara:",lengthMenu:"Sayfa başına _MENU_ kayıt göster",zeroRecords:"Çalışan bulunamadı",info:"_TOTAL_ kayıttan _START_ ile _END_ arası gösteriliyor",infoEmpty:"Çalışan bulunamadı",infoFiltered:"(toplam _MAX_ kayıttan filtrelendi)",emptyTable:"Çalışan bulunamadı"},
        createdRow:function(row){$(row).find('td').eq(0).css('text-align','center');$(row).find('td').eq(1).css('text-align','left');$(row).find('td').eq(2).css('text-align','left');},
        headerCallback: function (thead) {$(thead).find('th').css('text-align', 'center');}
    });
    $('.dt-search').css({"text-align": "right", "margin": "0.8vw 0 0.8vw 0"});
    $('.dt-search input').css({"background-color": "white", "width": "12vw", "margin": "0 auto", "display": "inline-block", "font-size": "1vw", "font-family": "'Inter', Calibri, 'Segoe UI', Arial, sans-serif", "text-align": "left"});
}

function talimatCiktiParametreleriniOku()
{
    const url = new URL(window.location.href);
    const firmaid = String(url.searchParams.get("id") || "").trim();
    const talimatlar = String(url.searchParams.get("talimat") || "").trim();
    const ids = talimatlar
        .split(",")
        .map((item) => parseInt(item, 10))
        .filter((item) => Number.isInteger(item) && item > 0);
    return { firmaid, ids };
}

function talimatJsonunuDiziyeCevir(talimat)
{
    if (!talimat || typeof talimat !== "object" || Array.isArray(talimat))
    {
        return { baslik: "", icerik: [] };
    }
    const baslik = Object.keys(talimat)[0] || "";
    const icerik = Array.isArray(talimat[baslik]) ? talimat[baslik] : [];
    return { baslik, icerik };
}

function talimatduzenle2SayfasiMi()
{
    return window.location.pathname.replace(/\/$/, "") === "/talimatduzenle2";
}

function talimatduzenle2JsonOku()
{
    const talimat = store.get("talimatduzenle2json");
    if (talimat && typeof talimat === "object" && !Array.isArray(talimat))
    {
        return talimat;
    }
    return {};
}

function talimatduzenle2JsonYaz(talimat)
{
    store.set("talimatduzenle2json", talimat);
    store.set("talimatjson", talimat);
}

async function talimatVerisiniKaydet(secenekler)
{
    const talimatid = talimatidbul();
    if (!talimatid)
    {
        alertify.error("Beklenmedik bir hata oluştu");
        return false;
    }
    const json = talimatduzenle2SayfasiMi() ? talimatduzenle2JsonOku() : jsoncevir($('#HiddenField1').val());
    if (!json || typeof json !== "object" || Array.isArray(json))
    {
        alertify.error("Talimat verisi bulunamadı");
        return false;
    }
    const body = { json };
    if (secenekler?.baslik !== undefined)
    {
        body.baslik = secenekler.baslik;
    }
    try
    {
        if (talimatduzenle2SayfasiMi())
        {
            if (typeof window.talimatduzenle2JsonKaydet !== "function")
            {
                throw new Error("Talimat kayıt işlemi bulunamadı");
            }
            await window.talimatduzenle2JsonKaydet(json);
            if (secenekler?.baslik !== undefined)
            {
                if (typeof window.talimatduzenle2AdKaydet !== "function")
                {
                    throw new Error("Talimat adı kayıt işlemi bulunamadı");
                }
                await window.talimatduzenle2AdKaydet(secenekler.baslik);
            }
        }
        else
        {
            await talimatApiIstek(sayfaApiYolu(`/api/talimatlar/${talimatid}`), {
                method: "PUT",
                body: JSON.stringify(body)
            });
        }
        if (secenekler?.baslik !== undefined)
        {
            $('#diyalogtalimatad').fadeOut();
        }
        if (secenekler?.kapat)
        {
            $(secenekler.kapat).fadeOut();
        }
        return true;
    }
    catch (err)
    {
        alertify.error(err.message || "Güncelleme başarısız");
        return false;
    }
}

function talimatyeni1load()
{
    $('#adverisi').trigger('focus');
}

function talimatcikti1load()
{
    store.remove("talimatciktiayar");
    const ayarlar = isgtalimatvarsayilanayarlarioku();
    $('#imzatipi').val(String(ayarlar.a ?? "0"));
}

function talimatciktidevam1()
{
    const firmaid = firmasecimoku();
    if (!firmaid)
    {
        return false;
    }
    const imzaTipi = $('#imzatipi').val();
    const secim = (imzaTipi === "0" || imzaTipi === "1" || imzaTipi === "2") ? "1" : "2";
    store.set("talimatipi", secim);
    store.set("talimatciktiayar", JSON.stringify({ a: String(imzaTipi) }));
    window.location.href = `/talimatcikti2?id=${encodeURIComponent(firmaid)}`;
    return true;
}

function talimatciktidevam2()
{
    const liste = talimatSeciliIdleriOku();
    if (liste.length === 0)
    {
        alertify.error("Lütfen en az bir talimat seçiniz");
        return false;
    }
    const secim = String(store.get("talimatipi") || "1");
    const firmaid = String(store.get('xfirmaid') || '').trim();
    const talimatParam = liste.join(",");
    if (secim === "1")
    {
        if (!firmaid)
        {
            alertify.error("İşyeri bilgisi bulunamadı");
            return false;
        }
        window.location.href = `/talimatcikti3?id=${encodeURIComponent(firmaid)}&talimat=${encodeURIComponent(talimatParam)}`;
        return true;
    }
    window.location.href = `/talimatcikti4?talimat=${encodeURIComponent(talimatParam)}`;
    return true;
}

function talimatyeni1tamam()
{
    const talimatad = $('#adverisi').val().trim();
    if (talimatad.length < 4)
    {
        alertify.error("İSG Talimat adı minumum 4 karekter olmalıdır.");
        return false;
    }
    const json = {};
    json[talimatad] = [{ i: "Düzenle butonuna basarak İSG talimatının ilk maddesini buraya yazabilir ardından yeni madde ekle butonuna basarak yeni içerik ekleyebilirsin." }];
    store.set("talimatyeni1baslik", talimatad);
    store.set("talimatyeni1json", json);
    store.set("talimatyeni1yazar", String(store.get("uzmanad") || "").trim());
    return true;
}

async function talimatduzenle2load()
{
    const talimat = talimatduzenle2JsonOku();
    let hizliIcerikler = [];
    try
    {
        const response = await fetch("https://cdn.jsdelivr.net/gh/MEHMETCERANX12/isgevrak@main/isgtalimat1_1.json");
        const data = await response.json().catch(() => null);
        if (!response.ok)
        {
            throw new Error((data && data.error) || "İşlem başarısız");
        }
        hizliIcerikler = Array.isArray(data) ? data.slice().sort((a, b) => a.sira - b.sira) : [];
    }
    catch
    {
        hizliIcerikler = [];
    }

    let { baslik, icerik } = talimatJsonunuDiziyeCevir(talimat);
    $('#talimatad').val(baslik);
    $('#talimaticerik').DataTable({
        data: icerik,
        ordering: false,
        dom: 't',
        pageLength: -1,
        columns: [
            { title: "Talimat İçerik", width: "86%", data: "i" },
            { title: "Düzenle", width: "7%", data: "duzenle", render: (d, t, r, i) => `<input type="button" name="duzenle" class="cssbutontamam" value="Düzenle" data-id="${i}"/>` },
            { title: "Sil", width: "7%", data: "sil", render: (d, t, r, i) => `<input type="button" name="sil" class="cssbutontamam" value="Sil" data-id="${i}"/>` }
        ],
        language: { search: "", zeroRecords: "İsg talimat içeriği boş", info: "_TOTAL_ kayıttan _START_ ile _END_ arası gösteriliyor", infoEmpty: "İsg talimat içeriği boş", infoFiltered: "(toplam _MAX_ kayıttan filtrelendi)", emptyTable: "İsg talimat içeriği boş" },
        headerCallback: function (thead) { $(thead).find('th').css('text-align', 'center'); },
        createdRow: function (row) { $(row).find('td').eq(0).css({ 'text-align': 'left' }); }
    });
    const talimatjson = Array.isArray(hizliIcerikler) ? hizliIcerikler : [];
    $('#tablo').DataTable({
        data: talimatjson,
        pageLength: -1,
        dom: 'ft',
        ordering: false,
        columns: [
            { data: "anabaslik", title: "Talimat Türü" },
            { data: "baslik", title: "Açıklama" },
            { data: null, title: "Ekle", render: (d, t, r) => `<input name="hizliekle" type="button" class="cssbutontamam" value="Ekle" data-icerik="${r.icerik}"/>` }
        ],
        language: { search: "", lengthMenu: "Sayfa başına _MENU_ kayıt göster", zeroRecords: "Böyle bir çalışan bulunamadı", info: "_TOTAL_ kayıttan _START_ ile _END_ arası gösteriliyor", infoEmpty: "Kayıt yok", infoFiltered: "(toplam _MAX_ kayıttan filtrelendi)", emptyTable: "Kayıtlı çalışan bulunamadı" },
        createdRow: function (row) { $(row).find('td').eq(0).css('text-align', 'left'); $(row).find('td').eq(1).css('text-align', 'left'); },
        headerCallback: function (thead) { $(thead).find('th').css('text-align', 'center'); }
    });
    $('.dt-search').css({ "text-align": "center", "margin": "1vw 1vw" });
    $('.dt-search input').css({ "background-color": "white", "width": "400px", "margin": "0 auto", "display": "inline-block", "font-size": "1vw", "font-family": "'Inter', Calibri, 'Segoe UI', Arial, sans-serif", "text-align": "center" }).attr("placeholder", "Hızlı Talimat İçeriği Ara");
    $(document).off("click.talimatdetay").on("click.talimatdetay", "input[name='sil']", function ()
    {
        if ($(this).closest('#talimaticerik').length === 0)
        {
            return;
        }
        $('#diyalogtalimatsil').fadeIn();
        const satir = $('#talimaticerik').DataTable().row($(this).closest('tr')).data();
        store.set('isgtalimatsil', satir);
    });
    $(document).off("click.talimatduzendetay").on("click.talimatduzendetay", "input[name='duzenle']", function ()
    {
        if ($(this).closest('#talimaticerik').length === 0)
        {
            return;
        }
        $('#diyalogtalimatduzenle').fadeIn();
        const satir = $('#talimaticerik').DataTable().row($(this).closest('tr')).data();
        store.set('isgtalimatduzenle', satir);
        $('#veriduzenle').val(satir.i);
    });
    $(document).off("click.talimathizliekle").on("click.talimathizliekle", "input[name='hizliekle']", function ()
    {
        const icerikMetni = $(this).data('icerik');
        store.set('hizliekleveri', icerikMetni);
        isgtalimathizliekle2();
    });
}

async function isgtalimatekle2()
{
    try
    {
        const talimat = talimatduzenle2JsonOku();
        const baslik = Object.keys(talimat)[0];
        const yeniMetin = $('#veriekle').val().trim();
        if (yeniMetin.length < 5)
        {
            alert("Lütfen en az 5 karakterlik bir içerik giriniz.");
            return false;
        }
        talimat[baslik].push({ i: yeniMetin });
        talimatduzenle2JsonYaz(talimat);
        const kayitTamam = await talimatVerisiniKaydet({ kapat: '#diyalogtalimatekle' });
        if (!kayitTamam)
        {
            return false;
        }
        else
        {
            mesaj("1");
        }
        const { icerik } = talimatJsonunuDiziyeCevir(talimat);
        $('#talimaticerik').DataTable().clear().rows.add(icerik).draw();
        $('#veriekle').val('');
        return true;
    }
    catch
    {
        alert("Talimat eklenirken bir hata oluştu.");
        return false;
    }
}

async function isgtalimatsil2()
{
    try
    {
        const talimat = talimatduzenle2JsonOku();
        const baslik = Object.keys(talimat)[0];
        const talimatjson = talimat[baslik];
        const satir = store.get('isgtalimatsil');
        const silinecek = satir.i;
        talimat[baslik] = talimatjson.filter((item) => item.i !== silinecek);
        talimatduzenle2JsonYaz(talimat);
        const kayitTamam = await talimatVerisiniKaydet({ kapat: '#diyalogtalimatsil' });
        if (!kayitTamam)
        {
            return false;
        }
        else
        {
            mesaj("3");
        }
        $('#talimaticerik').DataTable().clear().rows.add(talimat[baslik]).draw();
        store.remove('isgtalimatsil');
        return true;
    }
    catch (e)
    {
        alert("Silme işlemi sırasında bir hata oluştu." + e);
        return false;
    }
}

async function isgtalimatduzenle2()
{
    try
    {
        const satir = store.get('isgtalimatduzenle');
        if (!satir)
        {
            alert("Düzenlenecek satır bulunamadı.");
            return false;
        }
        const talimat = talimatduzenle2JsonOku();
        const baslik = Object.keys(talimat)[0];
        const talimatjson = talimat[baslik];
        const yeniMetin = $('#veriduzenle').val().trim();
        if (yeniMetin.length < 5)
        {
            alert("Lütfen en az 5 karakterlik bir içerik giriniz.");
            return false;
        }
        for (let i = 0; i < talimatjson.length; i++)
        {
            if (talimatjson[i].i === satir.i)
            {
                talimatjson[i].i = yeniMetin;
                break;
            }
        }
        talimatduzenle2JsonYaz(talimat);
        const kayitTamam = await talimatVerisiniKaydet({ kapat: '#diyalogtalimatduzenle' });
        if (!kayitTamam)
        {
            return false;
        }
        else
        {
            mesaj("2");
        }
        const table = $('#talimaticerik').DataTable();
        table.clear().rows.add(talimatjson).draw();
        $('#veriduzenle').val('');
        store.remove('isgtalimatduzenle');
        return true;
    }
    catch (e)
    {
        alert("Talimat düzenlenirken bir hata oluştu: " + e);
        return false;
    }
}

async function isgtalimathizliekle2()
{
    try
    {
        const talimat = talimatduzenle2JsonOku();
        const baslik = Object.keys(talimat)[0];
        const yeniMetin = String(store.get('hizliekleveri') || '').trim();
        if (yeniMetin.length < 5)
        {
            alert("Lütfen en az 5 karakterlik bir içerik giriniz.");
            return false;
        }
        talimat[baslik].push({ i: yeniMetin });
        talimatduzenle2JsonYaz(talimat);
        const kayitTamam = await talimatVerisiniKaydet({ kapat: '#diyalogtalimat' });
        if (!kayitTamam)
        {
            return false;
        }
        else
        {
            mesaj("1");
        }
        $('#talimaticerik').DataTable().clear().rows.add(talimat[baslik]).draw();
        return true;
    }
    catch
    {
        alert("Talimat eklenirken bir hata oluştu.");
        return false;
    }
}

async function isgtalimatadguncelle2()
{
    try
    {
        const talimat = talimatduzenle2JsonOku();
        const eskibaslik = Object.keys(talimat)[0];
        const yenibaslik = $('#talimatad').val().trim();
        if (yenibaslik.length < 3)
        {
            alert("Lütfen geçerli bir talimat adı giriniz.");
            return false;
        }
        const mevcuticerik = talimat[eskibaslik];
        const yenitalimat = {};
        yenitalimat[yenibaslik] = mevcuticerik;
        talimatduzenle2JsonYaz(yenitalimat);
        store.set("talimatduzenle2baslik", yenibaslik);
        return await talimatVerisiniKaydet({ baslik: yenibaslik });
    }
    catch
    {
        alert("Talimat adı güncellenirken bir hata oluştu");
        return false;
    }
}

function talimatcikti2load()
{
    const firmaid = String(new URL(window.location.href).searchParams.get("id") || "").trim();
    if (firmaid)
    {
        store.set('xfirmaid', firmaid);
    }
    let data = store.get("talimatcikti2talimatlar");
    data = Array.isArray(data) ? data : [];
    data.sort((a, b) => a.b.localeCompare(b.b, 'tr', { sensitivity: 'base' }));
    $('#talimattablo').DataTable({
        data: data,
        ordering: false,
        columns: [
            { data: 'b', title: 'İSG Talimat Adı', width: '80%' },
            { data: 'o', title: 'Onay', width: '10%', render: function (d) { return d == 2 ? '✓' : ''; } },
            { data: 'i', title: 'Ekle', orderable: false, width: '10%', render: function (d) { return `<input name="ekle" type="button" class="cssbutontamam" value="Ekle" data-id="${d}"/>`; } }
        ],
        language: { search: "İSG Talimat Ara:", lengthMenu: "Sayfa başına _MENU_ kayıt göster", zeroRecords: "Eşleşen kayıt bulunamadı", info: "_TOTAL_ kayıttan _START_ ile _END_ arası gösteriliyor", infoEmpty: "Kayıt yok", infoFiltered: "(toplam _MAX_ kayıttan filtrelendi)", emptyTable: "Kayıtlı İSG talimatı bulunamadı" },
        createdRow: function (row) { $(row).find('td').eq(0).css('text-align', 'left'); },
        headerCallback: function (thead) { $(thead).find('th').css('text-align', 'center'); }
    });
    $('.dt-search input').css({ "background-color": "white" }).attr("autocomplete", "off");
    $('.dt-length select').css({ "background-color": "white" });
    $("#diyalogtalimat").fadeIn();
    const anatablo = $('#talimatliste').DataTable({
        ordering: false,
        dom: 't',
        columns: [
            { data: 'b', title: "İSG Talimat Listesi", width: "100%" },
            { data: 'i', title: 'Sil', width: '10%', render: (d) => `<input name="sil" type="button" class="cssbutontamam" value="Sil" data-id="${d}" onclick="talimatsilliste('${d}')" />` }
        ],
        language: { zeroRecords: "Henüz İSG talimatı eklenmedi", infoEmpty: "Henüz İSG talimatı eklenmedi", emptyTable: "Henüz İSG talimatı eklenmedi" },
        headerCallback: function (thead) { $(thead).find('th').css('text-align', 'center'); },
        createdRow: function (row) { $(row).find('td').eq(0).css({ 'text-align': 'left' }); }
    });
    $(document).off('click.talimatcikti2').on('click.talimatcikti2', 'input[name="ekle"]', function ()
    {
        const id = $(this).data('id');
        const satir = $('#talimattablo').DataTable().data().toArray().find((x) => x.i == id);
        if (satir)
        {
            anatablo.row.add({ b: satir.b, i: satir.i }).draw();
        }
        $("#diyalogtalimat").fadeOut();
        $("#talimatlistediv").fadeIn();
        if (anatablo.rows().count() === 5)
        {
            $("#talimateklebuton").fadeOut();
            alertify.error("En fazla beş tane İSG talimatı ekleyebilirsiniz");
        }
        else
        {
            $("#talimateklebuton").fadeIn();
        }
        if (anatablo.rows().count() > 1)
        {
            $("#bilgi").fadeIn();
        }
        else
        {
            $("#bilgi").fadeOut();
        }
    });
    const $tbody = $("#talimatliste tbody");
    $tbody.sortable({ helper: fixHelper, update: function () { return true; } }).disableSelection();
    function fixHelper(e, t)
    {
        const o = t.children();
        const h = t.clone();
        h.children().each(function (i) { $(this).width(o.eq(i).width()); });
        return h;
    }
}

function talimatsilliste(id)
{
    let anatablo = $('#talimatliste').DataTable();
    anatablo.rows().every(function ()
    {
        const data = this.data();
        if (data.i == id)
        {
            this.remove().draw();
            return false;
        }
    });
    if (anatablo.rows().count() === 0)
    {
        $("#talimatlistediv").fadeOut();
    }
    if (anatablo.rows().count() !== 5)
    {
        $("#talimateklebuton").fadeIn();
    }
    if (anatablo.rows().count() > 1)
    {
        $("#bilgi").fadeIn();
    }
    else
    {
        $("#bilgi").fadeOut();
    }
}



function talimatcikti4load()
{
    const { ids } = talimatCiktiParametreleriniOku();
    if (ids.length === 0)
    {
        alertify.error("Talimat seçimi bulunamadı");
        window.location.href = "/talimatcikti2";
        return;
    }
}

async function talimatyazdirword(button)
{
    const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, WidthType, AlignmentType, Header, Footer, BorderStyle } = window.docx;
    let isyerijson = jsoncevir(store.get('xjsonfirma')) || {};
    const firmaadi = isyerijson.fi || "";
    const isveren = isyerijson.is || "";
    let adsoyad = "";
    let unvan = "";
    if (button.id === "bosyazdir")
    { 
        adsoyad = "......................"; 
        unvan = "Çalışan";
    }
    else
    {
        adsoyad = (button.getAttribute("data-ad") || "").trim();
        unvan = (button.getAttribute("data-un") || "").trim(); 
    }
    const uzmanad = store.get("uzmanad") || "";
    let talimatlar = store.get("talimatcikti3talimatlar");
    talimatlar = Array.isArray(talimatlar) ? talimatlar : [];
    const sections = talimatImzaBolumleriOlustur(talimatlar, { firmaadi, isveren, uzmanad, adsoyad, unvan, Document, Paragraph, TextRun, Table, TableRow, TableCell, WidthType, AlignmentType, Header, Footer, BorderStyle });
    if (sections.length === 0) return alertify.error("Hiçbir talimat içeriği alınamadı.");
    const doc = new Document({ sections });
    const blob = await Packer.toBlob(doc);
    if (button.id === "bosyazdir")
    { 
        saveAs(blob, `Boş İSG Talimat.docx`);
    }
    else
    {
        saveAs(blob, `${adsoyad} İSG Talimat.docx`);
    }
}

function talimatImzaBolumleriOlustur(talimatlar, baglam)
{
    const { firmaadi, isveren, uzmanad, adsoyad, unvan, Paragraph, TextRun, Table, TableRow, TableCell, WidthType, AlignmentType, Header, Footer, BorderStyle } = baglam;
    const ayarlar = isgtalimatayarlarioku();
    const imzaTipi = String(ayarlar.a ?? "0");
    const baslikTipi = String(ayarlar.b ?? "0");
    const sections = [];
    const altbilgi = isgtalimatimzatablosuolustur({ imzaTipi, isveren, uzmanad, adsoyad, unvan, Paragraph, TextRun, Table, TableRow, TableCell, WidthType, AlignmentType, BorderStyle });
    for (let i = 0; i < talimatlar.length; i++)
    {
        let icerik = talimatlar[i];
        if (!icerik || icerik === "Yok") continue;
        const baslik = Object.keys(icerik)[0];
        const paragraflar = (icerik[baslik] || []).map(p => p.i);
        const headerTable = isgtalimatbasliktablosuolustur({ baslikTipi, firmaadi, baslik, Paragraph, TextRun, Table, TableRow, TableCell, WidthType, AlignmentType });
        sections.push({
            properties: { page: { margin: { top: 1134, bottom: 1417, left: 851, right: 851, header: 567, footer: 1134 } } },
            headers: { default: new Header({ children: [headerTable] }) },
            footers: { default: new Footer({ children: [altbilgi] }) },
            children: [...paragraflar.map(text => new Paragraph({ children: [new TextRun({ text, font: "Calibri", size: 22 })], alignment: AlignmentType.JUSTIFIED, spacing: { after: 100 } }))]
        });
    }
    return sections;
}

function isgtalimatayarlarioku()
{
    const varsayilanAyarlar = isgtalimatvarsayilanayarlarioku();
    const sayfaAyari = jsoncevir(store.get("talimatciktiayar"));
    if (!sayfaAyari || typeof sayfaAyari !== "object" || Array.isArray(sayfaAyari))
    {
        return varsayilanAyarlar;
    }
    return {
        a: String(sayfaAyari.a ?? varsayilanAyarlar.a ?? "0"),
        b: String(sayfaAyari.b ?? varsayilanAyarlar.b ?? "0")
    };
}

function isgtalimatvarsayilanayarlarioku()
{
    const settings = jsoncevir(store.get("settings"));
    if (!settings || typeof settings !== "object" || Array.isArray(settings))
    {
        return { a: "0", b: "0" };
    }
    const talimatAyari = Array.isArray(settings.i) && settings.i.length > 0
        ? settings.i[0]
        : (Array.isArray(settings.k) && settings.k.length > 0 ? settings.k[0] : null);
    if (!talimatAyari || typeof talimatAyari !== "object")
    {
        return { a: "0", b: "0" };
    }
    return { a: String(talimatAyari.a ?? "0"), b: String(talimatAyari.b ?? "0") };
}

function isgtalimatbasliktablosuolustur(baglam)
{
    const { baslikTipi, firmaadi, baslik, Paragraph, TextRun, Table, TableRow, TableCell, WidthType, AlignmentType } = baglam;
    if (baslikTipi === "1")
    {
        return new Table({
            rows: [
                new TableRow({ children: [new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: firmaadi || "", bold: true, font: "Calibri", size: 24 })], alignment: AlignmentType.CENTER })], verticalAlign: "center", borders: { bottom: { style: "none", size: 0, color: "FFFFFF" } } })] }),
                new TableRow({ children: [new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: baslik, bold: false, font: "Calibri", size: 24 })], alignment: AlignmentType.CENTER })], verticalAlign: "center", borders: { top: { style: "none", size: 0, color: "FFFFFF" } } })] })
            ],
            width: { size: 100, type: WidthType.PERCENTAGE },
            alignment: AlignmentType.CENTER
        });
    }
    return new Table({
        rows: [new TableRow({ children: [new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: baslik, bold: true, font: "Calibri", size: 24 })], alignment: AlignmentType.CENTER })], verticalAlign: "center" })] })],
        width: { size: 100, type: WidthType.PERCENTAGE },
        alignment: AlignmentType.CENTER
    });
}

function isgtalimatimzatablosuolustur(baglam)
{
    const { imzaTipi, isveren, uzmanad, adsoyad, unvan, Paragraph, TextRun, Table, TableRow, TableCell, WidthType, AlignmentType, BorderStyle } = baglam;
    const bosBorder = { top: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" }, bottom: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" }, left: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" }, right: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" } };
    if (imzaTipi === "5")
    {
        return new Table({
            rows: [new TableRow({ children: [new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "", font: "Calibri", size: 22 })], alignment: AlignmentType.CENTER })], verticalAlign: "center", width: { size: 100, type: WidthType.PERCENTAGE }, borders: bosBorder })] })],
            width: { size: 100, type: WidthType.PERCENTAGE },
            alignment: AlignmentType.CENTER
        });
    }
    if (imzaTipi === "1")
    {
        return new Table({
            rows: [
                new TableRow({ children: [
                    new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: isveren, font: "Calibri", size: 22, bold: true })], alignment: AlignmentType.CENTER })], verticalAlign: "center", width: { size: 50, type: WidthType.PERCENTAGE }, borders: bosBorder }),
                    new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: adsoyad, font: "Calibri", size: 22, bold: true })], alignment: AlignmentType.CENTER })], verticalAlign: "center", width: { size: 50, type: WidthType.PERCENTAGE }, borders: bosBorder })
                ] }),
                new TableRow({ children: [
                    new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: isverenunvanioku(), font: "Calibri", size: 22 })], alignment: AlignmentType.CENTER })], verticalAlign: "center", borders: bosBorder }),
                    new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: unvan, font: "Calibri", size: 22 })], alignment: AlignmentType.CENTER })], verticalAlign: "center", borders: bosBorder })
                ] }),
                new TableRow({ children: [
                    new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "İmza", font: "Calibri", size: 22 })], alignment: AlignmentType.CENTER })], verticalAlign: "center", borders: bosBorder }),
                    new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "İmza", font: "Calibri", size: 22 })], alignment: AlignmentType.CENTER })], verticalAlign: "center", borders: bosBorder })
                ] })
            ],
            width: { size: 100, type: WidthType.PERCENTAGE },
            alignment: AlignmentType.CENTER
        });
    }
    if (imzaTipi === "2")
    {
        return new Table({
            rows: [
                new TableRow({ children: [
                    new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "", font: "Calibri", size: 22, bold: true })], alignment: AlignmentType.CENTER })], verticalAlign: "center", width: { size: 65, type: WidthType.PERCENTAGE }, borders: bosBorder }),
                    new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: adsoyad, font: "Calibri", size: 22, bold: true })], alignment: AlignmentType.CENTER })], verticalAlign: "center", width: { size: 35, type: WidthType.PERCENTAGE }, borders: bosBorder })
                ] }),
                new TableRow({ children: [
                    new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "", font: "Calibri", size: 22 })], alignment: AlignmentType.CENTER })], verticalAlign: "center", borders: bosBorder }),
                    new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: unvan, font: "Calibri", size: 22 })], alignment: AlignmentType.CENTER })], verticalAlign: "center", borders: bosBorder })
                ] }),
                new TableRow({ children: [
                    new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "", font: "Calibri", size: 22 })], alignment: AlignmentType.CENTER })], verticalAlign: "center", borders: bosBorder }),
                    new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "İmza", font: "Calibri", size: 22 })], alignment: AlignmentType.CENTER })], verticalAlign: "center", borders: bosBorder })
                ] })
            ],
            width: { size: 100, type: WidthType.PERCENTAGE },
            alignment: AlignmentType.CENTER
        });
    }
    if (imzaTipi === "3")
    {
        return new Table({
            rows: [
                new TableRow({ children: [
                    new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: uzmanad, font: "Calibri", size: 22, bold: true })], alignment: AlignmentType.CENTER })], verticalAlign: "center", width: { size: 50, type: WidthType.PERCENTAGE }, borders: bosBorder }),
                    new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: isveren, font: "Calibri", size: 22, bold: true })], alignment: AlignmentType.CENTER })], verticalAlign: "center", width: { size: 50, type: WidthType.PERCENTAGE }, borders: bosBorder })
                ] }),
                new TableRow({ children: [
                    new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "İş Güvenliği Uzmanı", font: "Calibri", size: 22 })], alignment: AlignmentType.CENTER })], verticalAlign: "center", borders: bosBorder }),
                    new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: isverenunvanioku(), font: "Calibri", size: 22 })], alignment: AlignmentType.CENTER })], verticalAlign: "center", borders: bosBorder })
                ] }),
                new TableRow({ children: [
                    new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "İmza", font: "Calibri", size: 22 })], alignment: AlignmentType.CENTER })], verticalAlign: "center", borders: bosBorder }),
                    new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "İmza", font: "Calibri", size: 22 })], alignment: AlignmentType.CENTER })], verticalAlign: "center", borders: bosBorder })
                ] })
            ],
            width: { size: 100, type: WidthType.PERCENTAGE },
            alignment: AlignmentType.CENTER
        });
    }
    if (imzaTipi === "4")
    {
        return new Table({
            rows: [
                new TableRow({ children: [
                    new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "", font: "Calibri", size: 22, bold: true })], alignment: AlignmentType.CENTER })], verticalAlign: "center", width: { size: 65, type: WidthType.PERCENTAGE }, borders: bosBorder }),
                    new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: isveren, font: "Calibri", size: 22, bold: true })], alignment: AlignmentType.CENTER })], verticalAlign: "center", width: { size: 35, type: WidthType.PERCENTAGE }, borders: bosBorder })
                ] }),
                new TableRow({ children: [
                    new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "", font: "Calibri", size: 22 })], alignment: AlignmentType.CENTER })], verticalAlign: "center", borders: bosBorder }),
                    new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: isverenunvanioku(), font: "Calibri", size: 22 })], alignment: AlignmentType.CENTER })], verticalAlign: "center", borders: bosBorder })
                ] }),
                new TableRow({ children: [
                    new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "", font: "Calibri", size: 22 })], alignment: AlignmentType.CENTER })], verticalAlign: "center", borders: bosBorder }),
                    new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "İmza", font: "Calibri", size: 22 })], alignment: AlignmentType.CENTER })], verticalAlign: "center", borders: bosBorder })
                ] })
            ],
            width: { size: 100, type: WidthType.PERCENTAGE },
            alignment: AlignmentType.CENTER
        });
    }
    return new Table({
        rows: [
            new TableRow({ children: [new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: uzmanad, font: "Calibri", size: 22, bold: true })], alignment: AlignmentType.CENTER })], verticalAlign: "center", width: { size: 31, type: WidthType.PERCENTAGE }, borders: bosBorder }), new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: isveren, font: "Calibri", size: 22, bold: true })], alignment: AlignmentType.CENTER })], verticalAlign: "center", width: { size: 31, type: WidthType.PERCENTAGE }, borders: bosBorder }), new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: adsoyad, font: "Calibri", size: 22, bold: true })], alignment: AlignmentType.CENTER })], verticalAlign: "center", width: { size: 38, type: WidthType.PERCENTAGE }, borders: bosBorder })] }),
            new TableRow({ children: [new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "İş Güvenliği Uzmanı", font: "Calibri", size: 22 })], alignment: AlignmentType.CENTER })], verticalAlign: "center", borders: bosBorder }), new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: isverenunvanioku(), font: "Calibri", size: 22 })], alignment: AlignmentType.CENTER })], verticalAlign: "center", borders: bosBorder }), new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: unvan, font: "Calibri", size: 22 })], alignment: AlignmentType.CENTER })], verticalAlign: "center", borders: bosBorder })] }),
            new TableRow({ children: [new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "İmza", font: "Calibri", size: 22 })], alignment: AlignmentType.CENTER })], verticalAlign: "center", borders: bosBorder }), new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "İmza", font: "Calibri", size: 22 })], alignment: AlignmentType.CENTER })], verticalAlign: "center", borders: bosBorder }), new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "İmza", font: "Calibri", size: 22 })], alignment: AlignmentType.CENTER })], verticalAlign: "center", borders: bosBorder })] })
        ],
        width: { size: 100, type: WidthType.PERCENTAGE },
        alignment: AlignmentType.CENTER
    });
}

async function toplutalimatyazdir()
{
    const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, WidthType, AlignmentType, Header, Footer, BorderStyle } = window.docx;
    let isyerijson = jsoncevir(store.get('xjsonfirma')) || {};
    const firmaadi = isyerijson.fi || "";
    const isveren = isyerijson.is || "";
    const uzmanad = store.get("uzmanad") || "";
    let talimatlar = store.get("talimatcikti3talimatlar");
    talimatlar = Array.isArray(talimatlar) ? talimatlar : [];
    let tablo = $('#tablo').DataTable();
    let secilenler = tablo.rows({ selected: true }).data().toArray();
    if (secilenler.length === 0)
    {
        alertify.error("Lütfen en az bir çalışan seçiniz.");
        return;
    }
    const sections = [];
    for (let i = 0; i < secilenler.length; i++)
    {
        let calisan = secilenler[i] || {};
        let adsoyad = (calisan.x || "").trim();
        let unvan = (calisan.y || "").trim();
        sections.push(...talimatImzaBolumleriOlustur(talimatlar, { firmaadi, isveren, uzmanad, adsoyad, unvan, Paragraph, TextRun, Table, TableRow, TableCell, WidthType, AlignmentType, Header, Footer, BorderStyle }));
    }
    if (sections.length === 0)
    {
        alertify.error("Hiçbir talimat içeriği alınamadı.");
        return;
    }
    const doc = new Document({ sections });
    const blob = await Packer.toBlob(doc);
    saveAs(blob, "Toplu İSG Talimat.docx");
}

async function isgtalimatduyuruyazdir()
{
    const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, WidthType, AlignmentType, BorderStyle, Header, Footer } = window.docx;
    const sections = [];
    let isyerijson = jsoncevir(store.get('xjsonfirma'));
    let adres = isyerijson.ad || "";
    let firmaadi = isyerijson.fi || "";
    let isveren = isyerijson.is || "";
    const uzmanad = store.get("uzmanad") || "";
    let talimatlar = store.get("talimatcikti4talimatlar");
    talimatlar = Array.isArray(talimatlar) ? talimatlar : [];
    const ayarlar = isgtalimatayarlarioku();
    const imzaTipi = String(ayarlar.a ?? "0");
    const imzaTablosu = isgtalimatimzatablosuolustur({
        imzaTipi,
        isveren,
        uzmanad,
        adsoyad: "",
        unvan: "",
        Paragraph,
        TextRun,
        Table,
        TableRow,
        TableCell,
        WidthType,
        AlignmentType,
        BorderStyle
    });
    const firmaTablosu = new Table({
        rows: [new TableRow({ children: [new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: firmaadi, bold: true, size: 22, font: "Calibri" })], alignment: AlignmentType.CENTER }), new Paragraph({ children: [new TextRun({ text: adres, size: 22, font: "Calibri" })], alignment: AlignmentType.CENTER })], verticalAlign: "center", width: { size: 100, type: WidthType.PERCENTAGE }, borders: { top: { style: BorderStyle.SINGLE, size: 4, color: "000000" }, bottom: { style: BorderStyle.SINGLE, size: 4, color: "000000" }, left: { style: BorderStyle.SINGLE, size: 4, color: "000000" }, right: { style: BorderStyle.SINGLE, size: 4, color: "000000" } } })] })],
        width: { size: 100, type: WidthType.PERCENTAGE },
        alignment: AlignmentType.CENTER
    });
    const altbilgi = imzaTipi === "5"
        ? [firmaTablosu]
        : [imzaTablosu, new Paragraph({ children: [new TextRun({ text: "", font: "Calibri", size: 8 })], spacing: { after: 80 } }), firmaTablosu];
    for (let i = 0; i < talimatlar.length; i++)
    {
        let icerik = talimatlar[i];
        if (!icerik || icerik === "Yok") continue;
        const baslik = Object.keys(icerik)[0];
        const paragraflar = (icerik[baslik] || []).map(p => p.i);
        const headerTable = new Table({ rows: [new TableRow({ children: [new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: baslik, bold: true, font: "Calibri", size: 24 })], alignment: AlignmentType.CENTER })], verticalAlign: "center" })] })], width: { size: 100, type: WidthType.PERCENTAGE }, alignment: AlignmentType.CENTER });
        sections.push
            ({
                properties: { page: { margin: { top: 1134, bottom: 1417, left: 851, right: 851, header: 567, footer: 1134 } } },
                headers: { default: new Header({ children: [headerTable] }) },
                footers: { default: new Footer({ children: altbilgi }) },
                children: [...paragraflar.map(text => new Paragraph({ children: [new TextRun({ text, font: "Calibri", size: 22 })], alignment: AlignmentType.JUSTIFIED, spacing: { after: 100 } })),]
            });
    }
    if (sections.length === 0) return alertify.error("Hiçbir talimat içeriği alınamadı.");
    const doc = new Document({ sections });
    const blob = await Packer.toBlob(doc);
    saveAs(blob, `İSG Talimat.docx`);
}
