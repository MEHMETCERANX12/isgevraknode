function belgenoDuzenle(input)
{
    const prefix = "İGU-";
    let suffix = input.value;
    const upperSuffix = suffix.toLocaleUpperCase("tr-TR");
    if (upperSuffix.startsWith(prefix))
    {
        suffix = suffix.slice(prefix.length);
    }
    else if (upperSuffix.startsWith(prefix.slice(0, -1)))
    {
        suffix = suffix.slice(prefix.length - 1).replace(/^-/, "");
    }
    else
    {
        suffix = suffix.replace(/^(?:İGU-|IGU-)/i, "");
    }
    input.value = prefix + suffix;
}

function belgenoOnEkKoruma(event)
{
    const input = event.currentTarget;
    const baslangic = input.selectionStart;
    const bitis = input.selectionEnd;
    const onekUzunluk = 4;
    if (baslangic === bitis && baslangic < onekUzunluk)
    {
        input.setSelectionRange(onekUzunluk, onekUzunluk);
        if (event.key === "Backspace" || event.key === "Delete") event.preventDefault();
    }
    else if (baslangic !== bitis && baslangic < onekUzunluk && bitis <= onekUzunluk)
    {
        input.setSelectionRange(onekUzunluk, onekUzunluk);
        if (event.key === "Backspace" || event.key === "Delete") event.preventDefault();
    }
}

function belgenoImlecDuzelt(input)
{
    const onekUzunluk = 4;
    if (input.selectionStart < onekUzunluk || input.selectionEnd < onekUzunluk)
    {
        input.setSelectionRange(onekUzunluk, onekUzunluk);
    }
}

function basharfbuyuk(veri)
{
    if (!veri) return "";
    function asIstisnasi(metin)
    {
        return metin.replace(/\bA\.Ş\./gi, "A.Ş.");
    }

    if (typeof veri === "object" && veri.value !== undefined)
    {
        let t = veri.value;
        t = t.replace(/\s+/g, " ")
             .trim()
             .replace(/[^\p{L} ',.()\/-_]/gu, "");

        if (!t)
        {
            veri.value = "";
            return;
        }

        veri.value = t
            .toLocaleLowerCase("tr-TR")
            .split(" ")
            .map(w => w.charAt(0).toLocaleUpperCase("tr-TR") + w.slice(1))
            .join(" ")
            .replace(/ Ve /g, " ve ");
        veri.value = asIstisnasi(veri.value);

        return;
    }
    if (typeof veri === "string")
    {
        let t = veri;

        t = t.replace(/\s+/g, " ")
             .trim()
             .replace(/[^\p{L} ',.()\/-_]/gu, "");

        if (!t) return "";

        t = t
            .toLocaleLowerCase("tr-TR")
            .split(" ")
            .map(w => w.charAt(0).toLocaleUpperCase("tr-TR") + w.slice(1))
            .join(" ")
            .replace(/ Ve /g, " ve");
        return asIstisnasi(t);
    }
    return "";
}

function tekbosluk(e)
{
    if(!e || !e.value) return;
    e.value = e.value.replace(/[\r\n]+/g," ").replace(/\s+/g," ").trim();
}

function adsoyadduzelt(veri)
{
    if (!veri) return "";

    function formatla(t)
    {
        t = t.replace(/\s+/g, " ")
             .trim()
             .replace(/[^a-zA-ZçÇğĞıİöÖşŞüÜ\s'-]/g, "");

        if (!t) return "";

        let parcalar = t
            .toLocaleLowerCase("tr-TR")
            .split(/(\s+)/); // boşlukları koru

        let son = parcalar.length - 1;

        while (son >= 0 && parcalar[son].trim() === "")
            son--;

        if (son < 0) return t;
        parcalar[son] = parcalar[son].toLocaleUpperCase("tr-TR");
        for (let i = 0; i < son; i++)
        {
            if (parcalar[i].trim() !== "")
            {
                parcalar[i] =
                    parcalar[i].charAt(0).toLocaleUpperCase("tr-TR") +
                    parcalar[i].slice(1);
            }
        }

        return parcalar.join("");
    }
    if (typeof veri === "object" && veri.value !== undefined)
    {
        veri.value = formatla(veri.value);
        return;
    }
    if (typeof veri === "string")
    {
        return formatla(veri);
    }
    return "";
}

function uyarimesaj(metin)
{
    alertify.alert().setting({ title: 'Kayıt Hatası', message: metin, transition: 'flipy', label: 'TAMAM' }).show();
}

function sifredegistirmedogrulama()
{
    const sifre = $("#sifre").val();
    const sifreTekrar = $("#sifretekrar").val();
    const hatalar = [];

    if (!sifre || !sifreTekrar)
    {
        hatalar.push("Şifre ve şifre tekrar alanları boş bırakılamaz.");
    }
    else
    {
        if (sifre.length < 8)
        {
            hatalar.push("Şifre en az 8 karakter olmalıdır.");
        }
        if (sifre !== sifreTekrar)
        {
            hatalar.push("Şifre ile şifre tekrarı aynı değil.");
        }

        const sifreKurali = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[.,:;\-_*?!="^+%&/()<>#${}\[\]'~])[A-Za-z\d.,:;\-_*?!="^+%&/()<>#${}\[\]'~]+$/;
        if (!sifreKurali.test(sifre) || /[çğıöşüÇĞİÖŞÜ]/.test(sifre))
        {
            hatalar.push("Şifre büyük harf, küçük harf, rakam ve sembol içermeli; Türkçe karakter içermemelidir.");
        }
    }
    return hatalar;
}

async function veridogrulama()
{
    const hatalar = [];
    let ilkHataAlani = null;
    const hataEkle = (mesaj, alan) =>
    {
        hatalar.push(mesaj);
        if (!ilkHataAlani) ilkHataAlani = alan;
    };
    const adSoyad = $("#adsoyad").val().trim().replace(/\s+/g, " ");
    const adSoyadUzunluk = Array.from(adSoyad).length;
    const adKelimeleri = adSoyad.split(" ").filter(kelime => /\p{L}/u.test(kelime));
    if (adSoyadUzunluk < 5 || adSoyadUzunluk > 100 || adKelimeleri.length < 2)
    {
        hataEkle("Ad Soyad en az iki kelimeden ve 5 karakterden oluşmalı.", $("#adsoyad"));
    }

    const emailInput = $("#email");
    const email = emailInput.val().trim();
    const emailParcalari = email.split("@");
    const emailYerel = emailParcalari[0] || "";
    const emailAlanAdi = emailParcalari[1] || "";
    if (!email || Array.from(email).length > 100 || emailParcalari.length !== 2 || emailYerel.length > 64 || emailAlanAdi.length > 253 || !emailInput.prop("validity").valid || emailYerel.startsWith(".") || emailYerel.endsWith(".") || emailYerel.includes(".."))
    {
        hataEkle("Geçerli bir e-posta adresi giriniz.", emailInput);
    }
    sifredegistirmedogrulama().forEach(mesaj => hataEkle(mesaj, $("#sifre")));
    const belgeNoInput = $("#belgeno");
    const belgeNo = belgeNoInput.val();
    if (!/^İGU-[\p{L}\p{N}-]{1,6}$/u.test(belgeNo) || Array.from(belgeNo).length > 12)
    {
        hataEkle("Belge No İGU- ile başlamalı ve en fazla 12 karakter olmalıdır.", belgeNoInput);
    }
    const osgbInput = $("#osgb");
    if (Array.from(osgbInput.val().trim()).length > 100)
    {
        hataEkle("Ortak Sağlık ve Güvenlik Birimi adı en fazla 100 karakter olabilir.", osgbInput);
    }
    if (hatalar.length > 0)
    {
        const hataListesi = hatalar.map(mesaj => `<li>${mesaj}</li>`).join("");
        uyarimesaj(`<div>Şu alanları kontrol edin:</div><ul style="margin:8px 0 0;padding-left:22px">${hataListesi}</ul>`);
        if (ilkHataAlani) ilkHataAlani.trigger("focus");
        return false;
    }
    const veri = [{
        uz: adSoyad,
        un: belgeNo.trim(),
        kr: osgbInput.val().trim(),
        kullanici: email,
        sifre: $("#sifre").val(),
        sifretekrar: $("#sifretekrar").val()
    }];
    try
    {
        const dogruyanlis = await $.ajax({ url: "/kayit/uyekayit", method: "POST", contentType: "application/json", dataType: "json", data: JSON.stringify(veri) });
        if (dogruyanlis !== true)
        {
            uyarimesaj("Beklenmedik bir hata oluştu");
            return false;
        }
        else
        {
            uyarimesaj("Başarı ile oluşturuldu.");
        }
        return true;
    }
    catch (error)
    {
        console.error("Kayıt doğrulama isteği başarısız:", error);
        uyarimesaj("Doğrulama sırasında sunucuya ulaşılamadı. Lütfen tekrar deneyiniz.");
        return false;
    }
}
