$(document).ready(async function ()
{
    const firmaid = firmaidbul();
    if (!firmaid)
    {
        mesajmetin("Geçerli işyeri seçilmedi");
        window.location.href = "/isyerisec?id=08";
        return;
    }
    try
    {
        const response = await fetch(`/evrakisyeri/oku/${firmaid}`);
        if (response.status === 401)
        {
            window.location.href = "/";
            return;
        }
        const data = await response.json();
        if (!response.ok)
        {
            alertify.error(data.error || "Evrak kayıtları alınamadı");
            return;
        }
        $('#HiddenField1').val(JSON.stringify(data && typeof data === "object" ? data : {}));
        evrakkayitisyeriload();
    }
    catch
    {
        alertify.error("Evrak kayıtları alınamadı");
    }
    var t = store.get('activeTab');
    if (t) tabgecis(t);
});

async function evrakkayitisyeriload()
{
    let liste = [];
    try
    {
        liste = await githuboku("https://cdn.jsdelivr.net/gh/MEHMETCERANX12/isgevrak@main/kaynak/yillikplan1_4.json");
        if (!liste) return;
        store.set("listeicerik", liste);
    }
    catch
    {
        alertify.error("Yıllık plan verisi indirilemedi");
        return;
    }
    liste = jsoncevir(liste);
    let ekipmankontrol = liste.ekipmankontrol.filter(x => x.tur == "1");
    let ortamolcumu = liste.ekipmankontrol.filter(x => x.tur == "2");
    let sagliktarama = liste.sagliktarama;
    const unvanlar =
    [
        { id: "0", ad: "Lütfen Seçiniz" }, { id: "1", ad: "Elektrik Mühendisi" },
        { id: "2", ad: "Elektrik ve Elektronik Mühendisi" }, { id: "3", ad: "Elektronik Mühendisi" },
        { id: "4", ad: "Elektrik Yüksek Teknikeri" }, { id: "5", ad: "Elektrik Teknik Öğretmeni" },
        { id: "6", ad: "Elektrik Teknikeri" }, { id: "7", ad: "İnşaat Mühendisi" },
        { id: "8", ad: "İnşaat Yüksek Teknikeri" }, { id: "9", ad: "İnşaat Teknik Öğretmeni" },
        { id: "10", ad: "İnşaat Teknikeri" }, { id: "11", ad: "Makine Mühendisi" },
        { id: "12", ad: "Makine Yüksek Teknikeri" }, { id: "13", ad: "Makine Teknik Öğretmeni" },
        { id: "14", ad: "Makine Teknikeri" }, { id: "15", ad: "Mekatronik Mühendisi" },
        { id: "16", ad: "Metalurji ve Malzeme Mühendisi" }, { id: "17", ad: "Metal Teknik Öğretmeni" },
        { id: "18", ad: "Yapı Teknik Öğretmeni" }
    ];
    function unvanSelect()
    {
        let html = `<select class="cssdropdown100 unvan">`;
        unvanlar.forEach(x => { html += `<option value="${x.id}">${x.ad}</option>`; });
        html += `</select>`;
        return html;
    }
    $('#muhendislikkontrol').DataTable
    ({
        data: ekipmankontrol,
        dom: 't',
        pageLength: -1,
        order: [],
        rowGroup: { dataSrc: "grup" },
        columns: [
            { data: "kontrol", title: "İş Ekipmanı Kontrol Adı" },
            { data: null, title: "Tarih", width: "175px", render: () => `<input type="text" class="csstextbox100" autocomplete="off" onfocus="datepickerjquery(this)" style="text-align:center">` },
            { data: null, title: "Yapan Kişi Ad Soyad", width: "400px", render: () => `<input type="text" class="csstextbox100" onblur="adsoyadduzelt(this)" autocomplete="off">` },
            { data: null, title: "Yapan Kişi Unvan", width: "350px", render: () => unvanSelect() },
            { data: "id", visible: false }
        ],
        createdRow: function (r) { $(r).find("td").eq(0).css("text-align", "left"); },
        headerCallback: function (thead) { $(thead).find('th').css('text-align', 'center'); },
    });
    $('#ortamolcumtablo').DataTable
    ({
        data: ortamolcumu,
        dom: 't',
        pageLength: -1,
        order: [],
        columns: [
            { data: "kontrol", title: "Ortam Ölçüm Adı" },
            { data: null, title: "Tarih", width: "175px", render: () => `<input type="text" class="csstextbox100" autocomplete="off" onfocus="datepickerjquery(this)" style="text-align:center">` },
            { data: null, title: "Yapan Kişi Ad Soyad", width: "300px", render: () => `<input type="text" class="csstextbox100" onblur="adsoyadduzelt(this)" autocomplete="off">` },
            { data: null, title: "Yapan Kişi Unvan", width: "300px", render: () => `<input type="text" class="csstextbox100" onblur="basharfbuyuk(this)" autocomplete="off">` },
            { data: null, title: "Ölçüm Metodu", width: "250px", render: () => `<select class="cssdropdown100 olcumtip"><option value="0">Lütfen Seçiniz</option><option value="1">Kişisel Maruziyet Ölçümü</option><option value="2">Noktasal Ölçüm</option></select>` },
            { data: "id", visible: false }
        ],
        createdRow: function (r) { $(r).find("td").eq(0).css("text-align", "left"); },
        headerCallback: function (thead) { $(thead).find('th').css('text-align', 'center'); },
    });
    $('#sagliktaramatablo').DataTable
    ({
        data: sagliktarama,
        dom: 't',
        pageLength: -1,
        order: [],
        columns: [
            { data: "tarama", title: "Sağlık Taraması Adı" },
            { data: null, title: "Tarih", width: "175px", render: () => `<input type="text" class="csstextbox100" autocomplete="off" onfocus="datepickerjquery(this)" style="text-align:center">` },
            { data: null, title: "Yapan Kişi Ad Soyad", width: "400px", render: () => `<input type="text" class="csstextbox100" onblur="adsoyadduzelt(this)" autocomplete="off">` },
            { data: null, title: "Yapan Kişi Unvan", width: "350px", render: () => `<input type="text" class="csstextbox100" onblur="basharfbuyuk(this)" autocomplete="off">` },
            { data: "id", visible: false }
        ],
        createdRow: function (r) { $(r).find("td").eq(0).css("text-align", "left"); },
        headerCallback: function (thead) { $(thead).find('th').css('text-align', 'center'); },
    });
    risksonuckontrol();
    $('#risktarih, #riskuzman, #riskhekim').on('keyup change', risksonuckontrol);
    $('#risktip').on('change', risksonuckontrol);
    acilsonuckontrol();
    $('#aciltarih, #aciluzman, #acilhekim').on('keyup change', acilsonuckontrol);
    tatbikatsonuckontrol();
    $('#tatbikattarih, #tatbikatad, #tatbikatunvan').on('keyup change', tatbikatsonuckontrol);
    $('#tatbikattur').on('change', tatbikatsonuckontrol);
    egitimsonuckontrol();
    $('#uzmanad, #hekimad').on('keyup change', egitimsonuckontrol);
    saglikraporsonuckontrol();
    $('#periyodiktarih, #periyodikhekim, #isegirishekim').on('keyup change', saglikraporsonuckontrol);
    let veri = jsoncevir($('#HiddenField1').val());
    if (!veri) return;
    if (veri.riskdegerlendirme?.length)
    {
        let r = veri.riskdegerlendirme[0];
        $('#risktarih').val(r.t);
        $('#riskuzman').val(r.x);
        $('#riskhekim').val(r.y);
        $('#risktip').val(r.z);
        risksonuckontrol();
    }
    if (veri.acildurum?.length)
    {
        let a = veri.acildurum[0];
        $('#aciltarih').val(a.t);
        $('#aciluzman').val(a.x);
        $('#acilhekim').val(a.y);
        acilsonuckontrol();
    }
    if (veri.tatbikat?.length)
    {
        let t = veri.tatbikat[0];
        $('#tatbikattarih').val(t.t);
        $('#tatbikatad').val(t.x);
        $('#tatbikatunvan').val(t.y);
        $('#tatbikattur').val(t.z);
        tatbikatsonuckontrol();
    }
    let table1 = $('#muhendislikkontrol').DataTable();
    veri.isekipmanikontrol?.forEach(v =>
    {
        table1.rows().every(function ()
        {
            let rowData = this.data();
            if ((rowData.id || "") === v.id)
            {
                let tds = $(this.node()).find('td');
                tds.eq(1).find('input').val(v.t);
                tds.eq(2).find('input').val(v.x);
                tds.eq(3).find('select').val(v.y);
            }
        });
    });
    let table2 = $('#ortamolcumtablo').DataTable();
    veri.ortamolcumu?.forEach(v =>
    {
        table2.rows().every(function ()
        {
            let rowData = this.data();
            if ((rowData.id || "") === v.id)
            {
                let tds = $(this.node()).find('td');
                tds.eq(1).find('input').val(v.t); // Tarih
                tds.eq(2).find('input').val(v.x); // Ad Soyad
                tds.eq(3).find('input').val(v.z); // Unvan
                tds.eq(4).find('select').val(v.y); // Ölçüm Metodu
            }
        });
    });
    let table3 = $('#sagliktaramatablo').DataTable();
    veri.sagliktarama?.forEach(v =>
    {
        table3.rows().every(function ()
        {
            let rowData = this.data();
            if ((rowData.id || "") === v.id)
            {
                let tds = $(this.node()).find('td');
                tds.eq(1).find('input').val(v.t);
                tds.eq(2).find('input').val(v.x);
                tds.eq(3).find('input').val(v.y);
            }
        });
    });
    if (veri.egitim?.length)
    {
        $('#uzmanad').val(veri.egitim[0].x);
        $('#hekimad').val(veri.egitim[0].y);
        egitimsonuckontrol();
    }
    if (veri.saglikraporu?.length)
    {
        let s = veri.saglikraporu[0];
        $('#periyodiktarih').val(s.t);
        $('#periyodikhekim').val(s.x);
        $('#isegirishekim').val(s.y);
        saglikraporsonuckontrol();
    }
}

function evrakkayitisyerioku()
{
    let sonuc = { riskdegerlendirme: [], acildurum: [], tatbikat: [], isekipmanikontrol: [], ortamolcumu: [], sagliktarama: [], egitim: [], saglikraporu: [] };
    let risktarih = $('#risktarih').val();
    let riskuzman = $('#riskuzman').val();
    let riskhekim = $('#riskhekim').val();
    let risktip = $('#risktip').val();
    if (risktarih && riskuzman && riskhekim && risktip !== "0")
    {
        sonuc.riskdegerlendirme.push({ t: risktarih, x: riskuzman, y: riskhekim, z: risktip });
    }
    let aciltarih = $('#aciltarih').val();
    let aciluzman = $('#aciluzman').val();
    let acilhekim = $('#acilhekim').val();
    if (aciltarih && aciluzman && acilhekim)
    {
        sonuc.acildurum.push({ t: aciltarih, x: aciluzman, y: acilhekim });
    }
    let tatbikattarih = $('#tatbikattarih').val();
    let tatbikatad = $('#tatbikatad').val();
    let tatbikatunvan = $('#tatbikatunvan').val();
    let tatbikattur = $('#tatbikattur').val();
    if (tatbikattarih && tatbikatad && tatbikatunvan && tatbikattur !== "0")
    {
        sonuc.tatbikat.push({ t: tatbikattarih, x: tatbikatad, y: tatbikatunvan, z: tatbikattur });
    }
    let uzman = $('#uzmanad').val();
    let hekim = $('#hekimad').val();
    if (uzman && hekim)
    {
        sonuc.egitim.push({ x: uzman, y: hekim });
    }
    let periyodiktarih = $('#periyodiktarih').val();
    let periyodikhekim = $('#periyodikhekim').val();
    let isegirishekim = $('#isegirishekim').val();
    if (periyodiktarih && periyodikhekim && isegirishekim)
    {
        sonuc.saglikraporu.push({ t: periyodiktarih, x: periyodikhekim, y: isegirishekim })
    }
    let table = $('#muhendislikkontrol').DataTable();
    table.rows({ page: 'all' }).every(function ()
    {
        let rowData = this.data(); // 👈 id burada
        let tds = $(this.node()).find('td');

        let tarih = tds.eq(1).find('input').val().trim();
        let yapanad = tds.eq(2).find('input').val().trim();
        let yapanunvan = tds.eq(3).find('select').val();

        if (yapanad && tarih && yapanunvan !== "0")
        {
            sonuc.isekipmanikontrol.push({
                id: rowData.id,
                x: yapanad,
                y: yapanunvan,
                t: tarih
            });
        }
    });
    let table2 = $('#ortamolcumtablo').DataTable();
    table2.rows({ page: 'all' }).every(function ()
    {
        let rowData = this.data();
        let tds = $(this.node()).find('td');
        let tarih  = tds.eq(1).find('input').val().trim();
        let yapanad = tds.eq(2).find('input').val().trim();
        let yapanunvan = tds.eq(3).find('input').val().trim();
        let olcumtip = tds.eq(4).find('select').val();
        if (yapanad && yapanunvan && tarih && olcumtip !== "0")
        {
            sonuc.ortamolcumu.push
            ({
                id: rowData.id,
                x: yapanad,
                z: yapanunvan,
                y: olcumtip,
                t: tarih
            });
        }
    });
    let table3 = $('#sagliktaramatablo').DataTable();
    table3.rows({ page: 'all' }).every(function ()
    {
        let rowData = this.data(); // 👈 id burada
        let tds = $(this.node()).find('td');
        let tarih = tds.eq(1).find('input').val().trim();
        let yapanad = tds.eq(2).find('input').val().trim();
        let yapanunvan = tds.eq(3).find('input').val().trim();
        if (yapanad && yapanunvan && tarih)
        {
            sonuc.sagliktarama.push({
                id: rowData.id,
                x: yapanad,
                y: yapanunvan,
                t: tarih
            });
        }
    });
    $('#HiddenField1').val(JSON.stringify(sonuc));
    return true;
}

async function evrakisyerikayit()
{
    if (!evrakkayitisyerioku())
    {
        return false;
    }
    const firmaid = firmaidbul();
    if (!firmaid)
    {
        mesajmetin("Geçerli işyeri seçilmedi");
        return false;
    }
    try
    {
        const json = jsoncevir($('#HiddenField1').val());
        const response = await fetch(`/evrakisyeri/kayit/${firmaid}`,
        {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(json && typeof json === "object" && !Array.isArray(json) ? json : {})
        });
        const result = await response.json();
        if (!response.ok)
        {
            alertify.error(result.error || "Kaydetme işlemi başarısız");
            return false;
        }
        alertify.success("İşyeri evrak kayıtları güncellendi");
        return true;
    }
    catch
    {
        alertify.error("Kaydetme işlemi başarısız");
        return false;
    }
}

function acilsonuckontrol() { let t = $("#aciltarih").val(), u = $("#aciluzman").val(), h = $("#acilhekim").val(); t && u && h ? $("#acilsonuc").show() : $("#acilsonuc").hide() }
function risksonuckontrol() { let t = $("#risktarih").val(), u = $("#riskuzman").val(), h = $("#riskhekim").val(), p = $("#risktip").val(); t && u && h && p !== "0" ? $("#risksonuc").show() : $("#risksonuc").hide() }
function tatbikatsonuckontrol() { let t = $("#tatbikattarih").val(), a = $("#tatbikatad").val(), u = $("#tatbikatunvan").val(), r = $("#tatbikattur").val(); t && a && u && r !== "0" ? $("#tatbikatsonuc").show() : $("#tatbikatsonuc").hide() }
function egitimsonuckontrol() { let u = $("#uzmanad").val(), h = $("#hekimad").val(); u && h ? $("#egitimsonuc").show() : $("#egitimsonuc").hide() }
function saglikraporsonuckontrol() { let t = $("#periyodiktarih").val(), h = $("#periyodikhekim").val(), i = $("#isegirishekim").val(); t && h && i ? $("#saglikraporsonuc").show() : $("#saglikraporsonuc").hide() }

function tabgecis(t)
{
    $(".tab,.tab-content").removeClass("active");
    const tab = document.getElementById(t + "-tab");
    const content = document.getElementById(String(t));
    if (tab) tab.classList.add("active");
    if (content)
    {
        content.classList.add("active");
    }
    store.set('activeTab', String(t));
}

