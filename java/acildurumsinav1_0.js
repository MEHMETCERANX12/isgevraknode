(function (window, $)
{
    "use strict";

    let sablonlar = [];
    let yazdiriliyor = false;

    $(document).ready(async function ()
    {
        const alan = $("#acildurumsinavsablon");
        try
        {
            const response = await fetch("/sinav/oku/0");
            const sonuc = await response.json();
            if (!response.ok || !sonuc.success)
            {
                throw new Error(sonuc.error || "Sınav şablonları yüklenemedi.");
            }
            sablonlar = (Array.isArray(sonuc.data) ? sonuc.data : [])
                .filter(function (sablon) { return sablon.tur === "diger"; })
                .sort(function (a, b) { return String(a.i || "").localeCompare(String(b.i || ""), "tr"); });
            alan.empty().append($("<option>").val("").text(sablonlar.length ? "Lütfen Sınav Şablonu Seçiniz" : "Diğer eğitim sınav şablonu bulunamadı"));
            sablonlar.forEach(function (sablon, index)
            {
                alan.append($("<option>").val(String(index)).text(sablon.i || "Adsız Sınav Şablonu"));
            });
            alan.prop("disabled", sablonlar.length === 0).trigger("change.select2");
        }
        catch (err)
        {
            alan.empty().append($("<option>").val("").text("Sınav şablonları yüklenemedi"));
            alertify.error(err.message || "Sınav şablonları yüklenemedi.");
        }
    });

    window.acildurumSinavYaz = async function ()
    {
        if (yazdiriliyor) { return; }
        const secim = $("#acildurumsinavsablon").val();
        const sablon = secim !== "" && secim != null ? sablonlar[Number(secim)] : null;
        if (!sablon)
        {
            alertify.error("Lütfen bir sınav şablonu seçiniz.");
            return;
        }
        const tarih = String($("#admetarih").val() || "").trim();
        if (!tarih || tarihkontrol(tarih) === false)
        {
            alertify.error("Lütfen geçerli bir eğitim tarihi giriniz.");
            return;
        }
        const ekip = acildurumekipjson();
        if (!Array.isArray(ekip) || ekip.length === 0)
        {
            alertify.error("Sınav oluşturulacak acil durum ekip üyesi bulunamadı.");
            return;
        }
        yazdiriliyor = true;
        $("#acildurumsinavyaz").prop("disabled", true);
        try
        {
            await window.digerEgitimSinavCiktiKontrol({
                sinavVeri: { tarih: tarih, sinavsablonveri: sablon },
                calisanlar: ekip.map(function (kisi) { return { a: kisi.x || "", u: kisi.y || "" }; }),
                baslik: "ACİL DURUM EKİBİ EĞİTİMİ",
                dosyaAdi: "Acil Durum Ekibi Eğitimi Sınav.pdf",
                imzaAlani: true
            });
        }
        finally
        {
            yazdiriliyor = false;
            $("#acildurumsinavyaz").prop("disabled", false);
        }
    };
})(window, jQuery);
