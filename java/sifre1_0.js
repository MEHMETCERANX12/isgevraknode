async function sifredegistirmedogrulama()
{
    var eski = $("#eskisifre").val().trim();
    var yeni = $("#yenisifre").val().trim();
    var tekrar = $("#tekrarsifre").val().trim();
    if (eski === "")
    {
        mesajmetin("Eski şifre alanı boş bırakılamaz.");
        return false;
    }
    if (yeni === "")
    {
        mesajmetin("Yeni şifre alanı boş bırakılamaz.");
        return false;
    }
    if (tekrar === "") {
        mesajmetin("Yeni şifre tekrar alanı boş bırakılamaz.");
        return false;
    }
    if (yeni.length < 8)
    {
        mesajmetin("Yeni şifre en az 8 karakter olmalıdır.");
        return false;
    }
    if (yeni !== tekrar)
    {
        mesajmetin("Yeni şifre ile tekrarı aynı değil.");
        return false;
    }
    var regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[.,:;\-_*?!="^+%&/()<>#${}\[\]'~])[A-Za-z\d.,:;\-_*?!="^+%&/()<>#${}\[\]'~]{8,}$/;
    var turkceKarakter = /[çğıöşüÇĞİÖŞÜ]/;
    if (!regex.test(yeni) || turkceKarakter.test(yeni))
    {
        mesajmetin("Şifreniz en az 8 karakter olmalı, büyük/küçük harf, rakam ve sembol içermeli ve en az bir sembolden oluşmalıdır. Türkçe karakter kullanmayınız.");
        return false;
    }
    try
    {
        const response = await fetch('/sifre/guncelle',
        {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ eskisifre: eski, yenisifre: yeni })
        });
        let sonuc = {};
        try
        {
            sonuc = await response.json();
        }
        catch (err)
        {
            sonuc = {};
        }
        if (!response.ok)
        {
            if (sonuc.error === "Eski şifre hatalı")
            {
                mesajmetin("Eski şifre hatalı!");
                return false;
            }
            if (sonuc.error)
            {
                mesajmetin(sonuc.error);
                return false;
            }
            mesajmetin("Beklenmedik bir hata oluştu");
            return false;
        }
        mesajmetin("Şifre Başarı İle Değiştirildi");
        $("#eskisifre, #yenisifre, #tekrarsifre).val("");
    }
    catch (err)
    {
        mesajmetin("Beklenmedik bir hata oluştu");
    }
    return false;
}
