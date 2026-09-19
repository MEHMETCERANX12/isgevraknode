function pageloaddigeregitim1()
{
    isyerigetir();
    digeregitimsaatayariyukle();
    digeregitimurlsecimiyukle(); 
    digerEgitimSinavIcerigiYukle();
}

async function digerEgitimSinavSablonlariYukle()
{
    try
    {
        const response = await fetch("/digeregitim1/oku");
        const sonuc = await response.json();
        if (!response.ok || !sonuc || !sonuc.success)
        {
            store.set("digersinavsablonliste", JSON.stringify([]));
            digerEgitimSinavSablonSelectDoldur([]);
            digerEgitimSinavMesaj((sonuc && sonuc.error) || "Sınav şablon listesi yüklenemedi.");
            return false;
        }
        const liste = Array.isArray(sonuc.data) ? sonuc.data : [];
        store.set("digersinavsablonliste", JSON.stringify(liste));
        digerEgitimSinavSablonSelectDoldur(liste);
    }
    catch (err)
    {
        console.error("diğer eğitim sınav şablon liste hata", err);
        store.set("digersinavsablonliste", JSON.stringify([]));
        digerEgitimSinavSablonSelectDoldur([]);
        digerEgitimSinavMesaj("Sınav şablon listesi yüklenemedi.");
        return false;
    }
}

async function digeregitimdevam1()
{
    const firmaid = firmasecimoku();
    if (!firmaid)
    {
        return false;
    }
    const sinavSablonId = String($("#digersinav").val() || "").trim();
    if (!sinavSablonId)
    {
        digerEgitimSinavMesaj("Lütfen bir sınav şablonu seçiniz.");
        return false;
    }
    const seciliSinavSablon = digerEgitimSinavSablonBul(sinavSablonId);
    if (!seciliSinavSablon)
    {
        digerEgitimSinavMesaj("Seçilen sınav şablonu bulunamadı.");
        return false;
    }
    const soruIcerigi = await digerEgitimSinavIcerigiYukle();
    if (!soruIcerigi)
    {
        digerEgitimSinavMesaj("Sınav soru içeriği yüklenemedi. Çıktı alınabilmesi için lütfen tekrar deneyiniz.");
        return false;
    }
    const verijson =
    {
        tarih: $("#tarih").val(),
        egitimtur: $("#egitimtur").val(),
        saat: $("#saat").val(),
        egitimsekli: $("#egitimsekli").val(),
        egitimyeri: $("#egitimsekli").val(),
        bossatir: parseInt($("#bossatir").val(), 10) || 0,
        sinavid: sinavSablonId,
        sinavsablonad: String(seciliSinavSablon.i || ""),
        sinavsablonveri: seciliSinavSablon
    };
    store.set("digeregitimsinavsablonid", sinavSablonId);
    store.set("digeregitimveri", JSON.stringify(verijson));
    window.location.href = "/digeregitim2?id=" + encodeURIComponent(firmaid);
    return true;
}

function digeregitimsaatayariyukle()
{
    const settings = jsoncevir(store.get("settings"));
    if (!settings || !settings.k || !Array.isArray(settings.k) || settings.k.length === 0)
    {
        return;
    }
    const ayarlar = settings.k[0];
    const saatMap =
    {
        "0": "2 Saat",
        "1": "3 Saat",
        "2": "4 Saat",
        "3": "5 Saat",
        "4": "6 Saat",
        "5": "7 Saat",
        "6": "8 Saat"
    };
    const saat = saatMap[String(ayarlar.c ?? "")];
    if (saat)
    {
        $("#saat").val(saat);
    }
}

async function digerEgitimSinavIcerigiYukle()
{
    const mevcut = store.get("digersinavicerik");
    const mevcutJson = typeof mevcut === "string" ? jsoncevir(mevcut) : mevcut;
    if (mevcutJson && Array.isArray(mevcutJson.sinav) && mevcutJson.sinav.length > 0)
    {
        return mevcutJson;
    }

    try
    {
        const veri = await $.getJSON("https://mehmetceranx12.github.io/isgevraknode/json/digersinav.json");
        if (!veri || !Array.isArray(veri.sinav) || veri.sinav.length === 0)
        {
            return null;
        }

        store.set("digersinavicerik", JSON.stringify(veri));
        return veri;
    }
    catch (err)
    {
        console.error("diğer eğitim sınav soru içeriği yüklenemedi", err);
        return null;
    }
}

function digerEgitimSinavSablonSelectDoldur(liste)
{
    const oncekiSecim = String(store.get("digeregitimsinavsablonid") || "").trim();
    const kaynakListe = Array.isArray(liste) ? liste : [];
    const siraliListe = kaynakListe.slice().sort(function (a, b)
    {
        const adA = String(a && a.i ? a.i : "").toLocaleLowerCase("tr-TR");
        const adB = String(b && b.i ? b.i : "").toLocaleLowerCase("tr-TR");
        return adA.localeCompare(adB, "tr");
    });
    const html = ["<option value=''>Lütfen Sınav Şablonu Seçiniz</option>"];

    siraliListe.forEach(function (item, index)
    {
        const sablonId = digerEgitimSinavSablonAnahtari(item, index, kaynakListe);
        const sablonAdi = String(item && item.i ? item.i : "Adsız Sınav Şablonu").trim();
        html.push("<option value='" + digerEgitimSinavHtml(sablonId) + "'>" + digerEgitimSinavHtml(sablonAdi) + "</option>");
    });

    $("#digersinav").html(html.join("")).trigger("change.select2");

    if (oncekiSecim && kaynakListe.some(function (item, index)
    {
        return digerEgitimSinavSablonAnahtari(item, index, kaynakListe) === oncekiSecim;
    }))
    {
        $("#digersinav").val(oncekiSecim);
    }
    else if (kaynakListe.length === 1)
    {
        $("#digersinav").val(digerEgitimSinavSablonAnahtari(kaynakListe[0], 0, kaynakListe));
    }

    $("#digersinav").trigger("change.select2");
}

function digerEgitimSinavSablonBul(sablonId)
{
    sablonId = String(sablonId || "").trim();
    if (!sablonId)
    {
        return null;
    }

    const liste = digerEgitimSinavListeOku();
    return liste.find(function (item, index)
    {
        return digerEgitimSinavSablonAnahtari(item, index, liste) === sablonId;
    }) || null;
}

function digerEgitimSinavListeOku()
{
    const liste = jsoncevir(store.get("digersinavsablonliste"));
    return Array.isArray(liste) ? liste : [];
}

function digerEgitimSinavSablonAnahtari(item, index, kaynakListe)
{
    const id = String(item && item.id ? item.id : "").trim();
    const kaynakIndex = Array.isArray(kaynakListe) ? kaynakListe.indexOf(item) : -1;
    return id || ("__index_" + String(kaynakIndex >= 0 ? kaynakIndex : index));
}

function digerEgitimSinavHtml(deger)
{
    return $("<div>").text(deger == null ? "" : String(deger)).html().replace(/'/g, "&#39;");
}

function digerEgitimSinavMesaj(mesaj)
{
    if (typeof alertify !== "undefined" && alertify.error)
    {
        alertify.error(mesaj, 7);
    }
}

function digeregitimurlsecimiyukle()
{
    const egitimId = String(new URLSearchParams(window.location.search).get("id") || "").trim();
    if (/^[1-9]$/.test(egitimId))
    {
        $("#egitimtur").val(egitimId);
    }
}
