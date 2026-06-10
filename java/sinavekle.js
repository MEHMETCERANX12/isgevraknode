async function sinavsablonkaydet()
{
    const sablonAdi = String($("#sinavsablonad").val() || "").trim();
    const yeterliliksecim = sinavSablonSecilenleriAl("seviye");
    const sinavsecim = sinavSablonSecilenleriAl("sinav");
    if (sablonAdi.length < 3)
    {
        sinavSablonHata("Şablon adı en az 3 karakter olmalıdır.");
        return false;
    }
    if (sinavsecim.length !== 10 || yeterliliksecim.length !== 10)
    {
        sinavSablonHata("10 adet soru ve 10 adet değerlendirme sorusu seçiniz.");
        return false;
    }
    const veri = { i: sablonAdi, sinav: sinavsecim, seviye: yeterliliksecim };
    return await sinavkaydet(veri);
}

let sinavSablonVerisi = { sinav: [], seviye: [] };
$(document).ready(async function ()
{
    $(document).on("change", ".sinav-sablon-secim", function ()
    {
        sinavSablonSecimKontrol(this);
    });
    await sinavSablonYukle();
});

async function sinavSablonYukle()
{
    try
    {
        const veri = await sinavload();
        if (!veri)
        {
            return false;
        }
        sinavSablonVerisi =
        {
            sinav: Array.isArray(veri.sinav) ? veri.sinav : [],
            seviye: Array.isArray(veri.seviye) ? veri.seviye : []
        };
        sinavSablonSorulariBas();
        return true;
    }
    catch (error)
    {
        console.error("Sınav şablon JSON okunamadı:", error);
        sinavSablonHata("Sınav içeriği yüklenemedi.");
        return false;
    }
}

function sinavSablonSorulariBas()
{
    sinavSablonListeBas("#sinavsorulistesi", "sinav", sinavSablonVerisi.sinav);
    sinavSablonListeBas("#seviyesorulistesi", "seviye", sinavSablonVerisi.seviye);
    sinavSablonDizileriYaz();
}

function sinavSablonListeBas(hedef, tip, sorular)
{
    const $hedef = $(hedef);
    $hedef.empty();

    sorular.forEach(function (soru)
    {
        const id = Number(soru.id);
        const baslik = soru.b || "Başlıksız";
        const metin = soru.s || "";
        const secenekler = Array.isArray(soru.c) ? soru.c : [];
        const secenekMetni = secenekler.map(function (secenek, index)
        {
            const yazi = typeof secenek === "string" ? secenek : (secenek.x || "");
            return "<span>" + String.fromCharCode(65 + index) + ") " + sinavSablonHtml(yazi) + "</span>";
        }).join("");

        const kart =
            "<label class='sinav-sablon-soru' data-tip='" + tip + "' data-arama='" + sinavSablonAttr((baslik + " " + metin).toLocaleLowerCase("tr-TR")) + "'>" +
                "<input type='checkbox' class='sinav-sablon-secim' data-tip='" + tip + "' value='" + id + "' />" +
                "<div class='sinav-sablon-soru-icerik'>" +
                    "<div class='sinav-sablon-soru-ust'>" +
                        "<span class='sinav-sablon-id'>" + id + "</span>" +
                        "<span class='sinav-sablon-konu'>" + sinavSablonHtml(baslik) + "</span>" +
                    "</div>" +
                    "<div class='sinav-sablon-soru-metin'>" + sinavSablonHtml(metin) + "</div>" +
                    "<div class='sinav-sablon-secenekler'>" + secenekMetni + "</div>" +
                "</div>" +
            "</label>";

        $hedef.append(kart);
    });
}

function sinavSablonDizileriYaz(bildirimTipi)
{
    let yeterliliksecim = sinavSablonSecilenleriAl("seviye");
    let sinavsecim = sinavSablonSecilenleriAl("sinav");

    $("#sinavsayac").text(sinavsecim.length + " soru seçildi");
    $("#seviyesayac").text(yeterliliksecim.length + " soru seçildi");
    if (bildirimTipi === "sinav")
    {
        sinavSablonSecimBildir("sinav", sinavsecim.length);
    }
    else if (bildirimTipi === "seviye")
    {
        sinavSablonSecimBildir("seviye", yeterliliksecim.length);
    }
}

function sinavSablonSecimKontrol(secim)
{
    const tip = $(secim).data("tip");
    const secimAdedi = sinavSablonSecilenleriAl(tip).length;

    if (secimAdedi > 10)
    {
        $(secim).prop("checked", false);
        sinavSablonDizileriYaz();
        sinavSablonAlert("10 adetten fazla " + (tip === "seviye" ? "değerlendirme sorusu" : "soru") + " seçemezsiniz.");
        return;
    }

    sinavSablonDizileriYaz(tip);
}

function sinavSablonSecimBildir(tip, adet)
{
    let mesaj = adet + " adet soru seçtiniz. 10 adet soru seçiniz.";

    if (tip === "seviye")
    {
        mesaj = adet + " adet değerlendirme sorusu seçtiniz. 10 adet değerlendirme sorusu seçiniz.";
    }

    if (adet === 10 && tip === "sinav")
    {
        mesaj = "Yeterli sayıda soru seçtiniz. Tebrikler.";
    }
    else if (adet === 10 && tip === "seviye")
    {
        mesaj = "Yeterli sayıda değerlendirme sorusu seçtiniz. Tebrikler.";
    }

    sinavSablonAlert(mesaj);
}

function sinavsablonkayit()
{
    const yeterliliksecim = sinavSablonSecilenleriAl("seviye");
    const sinavsecim = sinavSablonSecilenleriAl("sinav");

    if (sinavsecim.length !== 10 || yeterliliksecim.length !== 10)
    {
        sinavSablonAlert("10 adet soru ve 10 adet değerlendirme sorusu seçiniz.");
        return false;
    }

    $("#sinavsablonad").val("");
    $("#diyalogsinavsablonad").fadeIn();
    return true;
}

function sinavSablonAlert(mesaj)
{
    if (typeof alertify !== "undefined" && alertify.message)
    {
        alertify.message(mesaj);
    }
}

function sinavSablonHata(mesaj)
{
    if (typeof alertify !== "undefined" && alertify.error)
    {
        alertify.error(mesaj);
        return;
    }

    sinavSablonAlert(mesaj);
}

function sinavSablonSecilenleriAl(tip)
{
    return $(".sinav-sablon-secim[data-tip='" + tip + "']:checked").map(function ()
    {
        return Number($(this).val());
    }).get();
}

function sinavSablonHtml(deger)
{
    return $("<div>").text(deger == null ? "" : String(deger)).html();
}

function sinavSablonAttr(deger)
{
    return sinavSablonHtml(deger).replace(/'/g, "&#39;");
}
