async function temelisgSablonDuzenleYukle()
{
    var sablonId = temelisgSablonSeciliIdOku();
    if (!sablonId)
    {
        alertify.error('Düzenlenecek şablon bulunamadı.');
        window.location.href = '/temelsablonliste';
        return false;
    }

    try
    {
        const response = await fetch('/temelsablonduzenle/oku/' + encodeURIComponent(sablonId));
        const sonuc = await response.json().catch(function () { return {}; });
        if (!response.ok || !sonuc.success || !sonuc.data)
        {
            alertify.error((sonuc && sonuc.error) || 'Şablon bilgisi yüklenemedi.');
            window.location.href = '/temelsablonliste';
            return false;
        }
        temelisgDuzenlemeSablonId = sablonId;
        temelisgDuzenlemeSablonVerisi = sonuc.data;
        $('#sablonismi').val(String(sonuc.data.i || ''));
        $('#tehlikesinifi').val(String(sonuc.data.t || '0'));
        $('#egitimgunsayisi').val(String(temelisgSablonGunSayisiniHesapla(sonuc.data)));
        temelisgSablonFormunuHazirla('#sablonguncelle', temelisgSablonGuncelle);
        temelisgTablolariYenile();
        return true;
    }
    catch (err)
    {
        console.error('temelisg sablon duzenle yukle hata', err);
        alertify.error('Şablon bilgisi yüklenemedi.');
        window.location.href = '/temelsablonliste';
        return false;
    }
}

async function temelisgSablonKaydet()
{
    var sonuc = temelisgSablonSonucunuHazirla();
    if (!sonuc)
    {
        return false;
    }

    try
    {
        const response = await fetch('/temelsablonekle/ekle', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(sonuc)
        });
        const sonucJson = await response.json().catch(function () { return {}; });
        if (!response.ok || !sonucJson.success)
        {
            alertify.error((sonucJson && sonucJson.error) || 'Sablon kaydedilemedi.');
            return false;
        }
        window.location.href = '/temelsablonliste';
        return true;
    }
    catch (err)
    {
        console.error('temelisg sablon kaydet hata', err);
        alertify.error('Sablon kaydedilemedi.');
        return false;
    }
}

async function temelisgSablonGuncelle()
{
    if (!temelisgDuzenlemeSablonId)
    {
        alertify.error('Güncellenecek şablon bulunamadı.');
        return false;
    }
    var sonuc = temelisgSablonSonucunuHazirla();
    if (!sonuc)
    {
        return false;
    }

    try
    {
        const response = await fetch('/temelsablonduzenle/guncelle/' + encodeURIComponent(temelisgDuzenlemeSablonId),
        {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(sonuc)
        });
        const sonucJson = await response.json().catch(function () { return {}; });
        if (!response.ok || !sonucJson.success)
        {
            alertify.error((sonucJson && sonucJson.error) || 'Şablon güncellenemedi.');
            return false;
        }
        window.location.href = '/temelsablonliste';
        return true;
    }
    catch (err)
    {
        console.error('temelisg sablon guncelle hata', err);
        alertify.error('Şablon güncellenemedi.');
        return false;
    }
}

async function temelisgSablonListeYukle()
{
    try
    {
        const response = await fetch('/temelsablonliste/oku');
        const sonuc = await response.json().catch(function () { return {}; });
        if (!response.ok || !sonuc.success)
        {
            alertify.error((sonuc && sonuc.error) || 'Şablon listesi yüklenemedi.');
            temelisgSablonListeTabloOlustur([]);
            return false;
        }

        temelisgSablonListeTabloOlustur(Array.isArray(sonuc.data) ? sonuc.data : []);
        return true;
    }
    catch (err)
    {
        console.error('temelisg sablon liste hata', err);
        alertify.error('Şablon listesi yüklenemedi.');
        temelisgSablonListeTabloOlustur([]);
        return false;
    }
}

async function temelisgSablonSil()
{
    var sablonId = $('#temelisgsablonsildiyalog').attr('data-id');
    if (!sablonId)
    {
        alertify.error('Silinecek şablon bulunamadı.');
        return false;
    }

    try
    {
        const response = await fetch('/temelsablonliste/sil/' + encodeURIComponent(sablonId), { method: 'DELETE'});
        const sonuc = await response.json().catch(function () { return {}; });
        if (!response.ok || !sonuc.success)
        {
            alertify.error((sonuc && sonuc.error) || 'Şablon silinemedi.');
            return false;
        }
        var tablo = $('#temelisgsablonlistetablo').DataTable();
        tablo.rows(function (idx, data)
        {
            return String(data.id) === String(sablonId);
        }).remove().draw();
        $('#temelisgsablonsildiyalog').removeAttr('data-id').fadeOut();
        return true;
    }
    catch (err)
    {
        console.error('temelisg sablon sil hata', err);
        alertify.error('Şablon silinemedi.');
        return false;
    }
}

var azsure = 0;
var tehsure = 0;
var coksure = 0;
var temelisgSablonTablolari = {};
var temelisgSablonVerisi = {};
var temelisgTabloGunleri = {};
var temelisgDuzenlemeSablonId = '';
var temelisgDuzenlemeSablonVerisi = null;
var temelisgAksiyonButonSelector = '';
var temelisgKonuBasliklari = {
    1: "Genel Konular",
    2: "Sağlık Konuları",
    3: "Teknik Konular",
    4: "İşe ve İşyerine Özgü Konular"
};
var temelisgToplamSaatleri = {
    1: 8,
    2: 12,
    3: 16
};
var temelisgTip4MinSaatleri = {
    1: 2,
    2: 3,
    3: 4
};
var temelisgTabloMaxSaat = 8;
var temelisgAciklamaMetinleri = {
    0: {
        1: "",
        2: "",
        3: "",
        4: ""
    },
    1: {
        1: "1 Saat ≤ Sure ≤ 2 Saat. Her 45 Dakika 1 Saat Ders Olarak Hesaplanir.",
        2: "1 Saat ≤ Sure ≤ 2 Saat. Her 45 Dakika 1 Saat Ders Olarak Hesaplanir.",
        3: "2 Saat ≤ Sure ≤ 4 Saat. Her 45 Dakika 1 Saat Ders Olarak Hesaplanir.",
        4: "Toplam Sure Her Halukarda 2 Saat olmali. Her 45 Dakika 1 Saat Ders Olarak Hesaplanir."
    },
    2: {
        1: "1 Saat ≤ Sure ≤ 2 Saat. Her 45 Dakika 1 Saat Ders Olarak Hesaplanir.",
        2: "1 Saat ≤ Sure ≤ 4 Saat. Her 45 Dakika 1 Saat Ders Olarak Hesaplanir.",
        3: "1 Saat ≤ Sure ≤ 7 Saat. Her 45 Dakika 1 Saat Ders Olarak Hesaplanir.",
        4: "Toplam Sure Her Halukarda 3 Saat olmali. Her 45 Dakika 1 Saat Ders Olarak Hesaplanir."
    },
    3: {
        1: "1 Saat ≤ Sure ≤ 4 Saat. Her 45 Dakika 1 Saat Ders Olarak Hesaplanir.",
        2: "1 Saat ≤ Sure ≤ 4 Saat. Her 45 Dakika 1 Saat Ders Olarak Hesaplanir.",
        3: "1 Saat ≤ Sure ≤ 8 Saat. Her 45 Dakika 1 Saat Ders Olarak Hesaplanir.",
        4: "Toplam Sure Her Halukarda 4 Saat olmali. Her 45 Dakika 1 Saat Ders Olarak Hesaplanir."
    }
};

var temelisgcok =
[
    { "id": 1, "tip": 1, "konu": "Çalışma mevzuatı ile ilgili bilgiler", "sure": 15, "ch": 1 },
    { "id": 2, "tip": 1, "konu": "Çalışanların yasal hak ve sorumlulukları", "sure": 30, "ch": 1 },
    { "id": 3, "tip": 1, "konu": "İşyeri temizliği ve düzeni", "sure": 30, "ch": 1 },
    { "id": 4, "tip": 1, "konu": "İş kazası ve meslek hastalığından doğan hukuki sonuçlar", "sure": 15, "ch": 1 },
    { "id": 5, "tip": 2, "konu": "Meslek hastalıklarının sebepleri", "sure": 15, "ch": 1 },
    { "id": 6, "tip": 2, "konu": "Hastalıktan korunma prensipleri ve korunma tekniklerinin uygulanması", "sure": 15, "ch": 1 },
    { "id": 7, "tip": 2, "konu": "Biyolojik ve psikososyal risk etmenleri", "sure": 15, "ch": 1 },
    { "id": 8, "tip": 2, "konu": "İlk yardım", "sure": 30, "ch": 1 },
    { "id": 9, "tip": 2, "konu": "Bağımlılık yapıcı maddelerin zararları ve teknoloji bağımlılığı", "sure": 15, "ch": 1 },
    { "id": 10, "tip": 3, "konu": "Kimyasal, fiziksel ve ergonomik risk etmenleri", "sure": 45, "ch": 1 },
    { "id": 11, "tip": 3, "konu": "Elle kaldırma ve taşıma", "sure": 30, "ch": 1 },
    { "id": 12, "tip": 3, "konu": "Parlama, patlama", "sure": 30, "ch": 1 },
    { "id": 13, "tip": 3, "konu": "Yangın ve yangından korunma", "sure": 30, "ch": 1 },
    { "id": 14, "tip": 3, "konu": "İş ekipmanlarının güvenli kullanımı", "sure": 45, "ch": 1 },
    { "id": 15, "tip": 3, "konu": "Ekranlı araçlarla çalışma", "sure": 20, "ch": 1 },
    { "id": 16, "tip": 3, "konu": "Elektrik, tehlikeleri, riskleri ve önlemleri", "sure": 30, "ch": 1 },
    { "id": 17, "tip": 3, "konu": "İş kazalarının sebepleri ve korunma prensipleri ile tekniklerinin uygulanması", "sure": 30, "ch": 1 },
    { "id": 18, "tip": 3, "konu": "Sağlık ve güvenlik işaretleri", "sure": 20, "ch": 1 },
    { "id": 19, "tip": 3, "konu": "Kişisel koruyucu donanım kullanımı", "sure": 30, "ch": 1 },
    { "id": 20, "tip": 3, "konu": "İş sağlığı ve güvenliği genel kuralları ve güvenlik kültürü", "sure": 20, "ch": 1 },
    { "id": 21, "tip": 3, "konu": "Acil durumlar, tahliye ve kurtarma", "sure": 30, "ch": 1 },
    { "id": 22, "tip": 4, "konu": "Risk Değerlendirme Doküman Eğitimi", "sure": 60, "ch": 1 },
    { "id": 23, "tip": 4, "konu": "Acil Durum Planı Eğitimi", "sure": 60, "ch": 1 },
    { "id": 24, "tip": 4, "konu": "İş Sağlığı ve Güvenliği Mevzuatı Kapsamında Hazırlanmış Diğer Doküman Eğitimi", "sure": 15, "ch": 1 },
    { "id": 25, "tip": 4, "konu": "Yangın", "sure": 45, "ch": 1 },
    { "id": 26, "tip": 4, "konu": "Yüksekte Çalışma", "sure": 20, "ch": 0 },
    { "id": 27, "tip": 4, "konu": "Patlamadan Korunma Dokümanı Eğitimi", "sure": 20, "ch": 0 },
    { "id": 28, "tip": 4, "konu": "Kaynakla Çalışma", "sure": 20, "ch": 0 },
    { "id": 29, "tip": 4, "konu": "Kimyasal Etkenlerle Çalışma", "sure": 20, "ch": 0 },
    { "id": 30, "tip": 4, "konu": "Kanserojen veya Mutajen Maddelerle Çalışma", "sure": 20, "ch": 0 },
    { "id": 31, "tip": 4, "konu": "Kapalı Ortamda Çalışma", "sure": 20, "ch": 0 },
    { "id": 32, "tip": 4, "konu": "Özel Risk Taşıyan Ekipman ile Çalışma", "sure": 20, "ch": 0 },
    { "id": 33, "tip": 4, "konu": "Biyolojik Etkenlerle Çalışma", "sure": 20, "ch": 0 },
    { "id": 34, "tip": 4, "konu": "Radyasyon Riskinin Bulunduğu Ortamlarda Çalışma", "sure": 20, "ch": 0 }
];




var temelisgtehlikeli =
[
    { "id": 1, "tip": 1, "konu": "Çalışma mevzuatı ile ilgili bilgiler", "sure": 15, "ch": 1 },
    { "id": 2, "tip": 1, "konu": "Çalışanların yasal hak ve sorumlulukları", "sure": 30, "ch": 1 },
    { "id": 3, "tip": 1, "konu": "İşyeri temizliği ve düzeni", "sure": 30, "ch": 1 },
    { "id": 4, "tip": 1, "konu": "İş kazası ve meslek hastalığından doğan hukuki sonuçlar", "sure": 15, "ch": 1 },
    { "id": 5, "tip": 2, "konu": "Meslek hastalıklarının sebepleri", "sure": 15, "ch": 1 },
    { "id": 6, "tip": 2, "konu": "Hastalıktan korunma prensipleri ve korunma tekniklerinin uygulanması", "sure": 15, "ch": 1 },
    { "id": 7, "tip": 2, "konu": "Biyolojik ve psikososyal risk etmenleri", "sure": 15, "ch": 1 },
    { "id": 8, "tip": 2, "konu": "İlk yardım", "sure": 30, "ch": 1 },
    { "id": 9, "tip": 2, "konu": "Bağımlılık yapıcı maddelerin zararları ve teknoloji bağımlılığı", "sure": 15, "ch": 1 },
    { "id": 10, "tip": 3, "konu": "Kimyasal, fiziksel ve ergonomik risk etmenleri", "sure": 30, "ch": 1 },
    { "id": 11, "tip": 3, "konu": "Elle kaldırma ve taşıma", "sure": 15, "ch": 1 },
    { "id": 12, "tip": 3, "konu": "Parlama, patlama", "sure": 15, "ch": 1 },
    { "id": 13, "tip": 3, "konu": "Yangın ve yangından korunma", "sure": 15, "ch": 1 },
    { "id": 14, "tip": 3, "konu": "İş ekipmanlarının güvenli kullanımı", "sure": 30, "ch": 1 },
    { "id": 15, "tip": 3, "konu": "Ekranlı araçlarla çalışma", "sure": 15, "ch": 1 },
    { "id": 16, "tip": 3, "konu": "Elektrik, tehlikeleri, riskleri ve önlemleri", "sure": 30, "ch": 1 },
    { "id": 17, "tip": 3, "konu": "İş kazalarının sebepleri ve korunma prensipleri ile tekniklerinin uygulanması", "sure": 15, "ch": 1 },
    { "id": 18, "tip": 3, "konu": "Sağlık ve güvenlik işaretleri", "sure": 15, "ch": 1 },
    { "id": 19, "tip": 3, "konu": "Kişisel koruyucu donanım kullanımı", "sure": 15, "ch": 1 },
    { "id": 20, "tip": 3, "konu": "İş sağlığı ve güvenliği genel kuralları ve güvenlik kültürü", "sure": 15, "ch": 1 },
    { "id": 21, "tip": 3, "konu": "Acil durumlar, tahliye ve kurtarma", "sure": 15, "ch": 1 },
    { "id": 22, "tip": 4, "konu": "Risk Değerlendirme Doküman Eğitimi", "sure": 45, "ch": 1 },
    { "id": 23, "tip": 4, "konu": "Acil Durum Planı Eğitimi", "sure": 30, "ch": 1 },
    { "id": 24, "tip": 4, "konu": "İş Sağlığı ve Güvenliği Mevzuatı Kapsamında Hazırlanmış Diğer Doküman Eğitimi", "sure": 15, "ch": 1 },
    { "id": 25, "tip": 4, "konu": "Yangın", "sure": 45, "ch": 1 },
    { "id": 26, "tip": 4, "konu": "Yüksekte Çalışma", "sure": 20, "ch": 0 },
    { "id": 27, "tip": 4, "konu": "Patlamadan Korunma Dokümanı Eğitimi", "sure": 20, "ch": 0 },
    { "id": 28, "tip": 4, "konu": "Kaynakla Çalışma", "sure": 20, "ch": 0 },
    { "id": 29, "tip": 4, "konu": "Kimyasal Etkenlerle Çalışma", "sure": 20, "ch": 0 },
    { "id": 30, "tip": 4, "konu": "Kanserojen veya Mutajen Maddelerle Çalışma", "sure": 20, "ch": 0 },
    { "id": 31, "tip": 4, "konu": "Kapalı Ortamda Çalışma", "sure": 20, "ch": 0 },
    { "id": 32, "tip": 4, "konu": "Özel Risk Taşıyan Ekipman ile Çalışma", "sure": 20, "ch": 0 },
    { "id": 33, "tip": 4, "konu": "Biyolojik Etkenlerle Çalışma", "sure": 20, "ch": 0 },
    { "id": 34, "tip": 4, "konu": "Radyasyon Riskinin Bulunduğu Ortamlarda Çalışma", "sure": 20, "ch": 0 }
];


var temelisgaz =
[
    { "id": 1, "tip": 1, "konu": "Çalışma mevzuatı ile ilgili bilgiler", "sure": 10, "ch": 1 },
    { "id": 2, "tip": 1, "konu": "Çalışanların yasal hak ve sorumlulukları", "sure": 10, "ch": 1 },
    { "id": 3, "tip": 1, "konu": "İşyeri temizliği ve düzeni", "sure": 10, "ch": 1 },
    { "id": 4, "tip": 1, "konu": "İş kazası ve meslek hastalığından doğan hukuki sonuçlar", "sure": 15, "ch": 1 },
    { "id": 5, "tip": 2, "konu": "Meslek hastalıklarının sebepleri", "sure": 15, "ch": 1 },
    { "id": 6, "tip": 2, "konu": "Hastalıktan korunma prensipleri ve korunma tekniklerinin uygulanması", "sure": 15, "ch": 1 },
    { "id": 7, "tip": 2, "konu": "Biyolojik ve psikososyal risk etmenleri", "sure": 15, "ch": 1 },
    { "id": 8, "tip": 2, "konu": "İlk yardım", "sure": 30, "ch": 1 },
    { "id": 9, "tip": 2, "konu": "Bağımlılık yapıcı maddelerin zararları ve teknoloji bağımlılığı", "sure": 15, "ch": 1 },
    { "id": 10, "tip": 3, "konu": "Kimyasal, fiziksel ve ergonomik risk etmenleri", "sure": 15, "ch": 1 },
    { "id": 11, "tip": 3, "konu": "Elle kaldırma ve taşıma", "sure": 10, "ch": 1 },
    { "id": 12, "tip": 3, "konu": "Parlama, patlama", "sure": 10, "ch": 1 },
    { "id": 13, "tip": 3, "konu": "Yangın ve yangından korunma", "sure": 10, "ch": 1 },
    { "id": 14, "tip": 3, "konu": "İş ekipmanlarının güvenli kullanımı", "sure": 10, "ch": 1 },
    { "id": 15, "tip": 3, "konu": "Ekranlı araçlarla çalışma", "sure": 15, "ch": 1 },
    { "id": 16, "tip": 3, "konu": "Elektrik, tehlikeleri, riskleri ve önlemleri", "sure": 10, "ch": 1 },
    { "id": 17, "tip": 3, "konu": "İş kazalarının sebepleri ve korunma prensipleri ile tekniklerinin uygulanması", "sure": 10, "ch": 1 },
    { "id": 18, "tip": 3, "konu": "Sağlık ve güvenlik işaretleri", "sure": 10, "ch": 1 },
    { "id": 19, "tip": 3, "konu": "Kişisel koruyucu donanım kullanımı", "sure": 10, "ch": 1 },
    { "id": 20, "tip": 3, "konu": "İş sağlığı ve güvenliği genel kuralları ve güvenlik kültürü", "sure": 10, "ch": 1 },
    { "id": 21, "tip": 3, "konu": "Acil durumlar, tahliye ve kurtarma", "sure": 15, "ch": 1 },
    { "id": 22, "tip": 4, "konu": "Yangın", "sure": 90, "ch": 1 },
    { "id": 23, "tip": 4, "konu": "Yüksekte Çalışma", "sure": 20, "ch": 0 },
    { "id": 24, "tip": 4, "konu": "Yüksekten Düşme", "sure": 20, "ch": 0 },
    { "id": 25, "tip": 4, "konu": "Kapalı Ortamda Çalışma", "sure": 20, "ch": 0 },
    { "id": 26, "tip": 4, "konu": "Özel Risk Taşıyan Ekipman ile Çalışma", "sure": 20, "ch": 0 }
];

function temelisgsablonYukle()
{
    temelisgDuzenlemeSablonId = '';
    temelisgDuzenlemeSablonVerisi = null;
    temelisgSablonFormunuHazirla('#sablonkaydet', temelisgSablonKaydet);
    temelisgTablolariYenile();
}

function temelisgSablonFormunuHazirla(butonSelector, tiklamaFonksiyonu)
{
    azsure = temelisgToplamSaatleri[1];
    tehsure = temelisgToplamSaatleri[2];
    coksure = temelisgToplamSaatleri[3];
    temelisgAksiyonButonSelector = butonSelector || '';
    $('#tehlikesinifi').off('change.temelisg').on('change.temelisg', temelisgTablolariYenile);
    $('#egitimgunsayisi').off('change.temelisg').on('change.temelisg', temelisgGunSecimleriniGuncelle);
    $('.temelisg-tablogun').off('change.temelisg').on('change.temelisg', function ()
    {
        var tip = parseInt($(this).attr('data-tip'), 10);
        temelisgTabloGunleri[tip] = temelisgGunDegeriniNormalizEt($(this).val());
        temelisgGunToplamUyarilariniGuncelle();
        temelisgAksiyonButonuGuncelle();
    });
    $('#sablonismi').off('input.temelisg').on('input.temelisg', temelisgAksiyonButonuGuncelle);
    $(butonSelector).off('click.temelisg').on('click.temelisg', tiklamaFonksiyonu);
    temelisgAksiyonButonuGuncelle();
}

function temelisgSablonGunSayisiniHesapla(sablon)
{
    var ustSeviyeGun = parseInt(sablon && sablon.g, 10);
    if (!Number.isNaN(ustSeviyeGun) && ustSeviyeGun > 0)
    {
        return ustSeviyeGun;
    }

    var konuGruplari = Array.isArray(sablon && sablon.x) ? sablon.x : [];
    var maxGun = 0;

    konuGruplari.forEach(function (grup)
    {
        var gun = temelisgGunDegeriniNormalizEt(grup && grup.g);
        if (gun > maxGun)
        {
            maxGun = gun;
        }
    });

    return maxGun > 0 ? maxGun : 0;
}

function temelisgTablolariYenile()
{
    var secim = $('#tehlikesinifi').val();
    var gunSecimi = $('#egitimgunsayisi').length ? $('#egitimgunsayisi').val() : '1';
    var tehlikeSinifiGecerli = secim === "1" || secim === "2" || secim === "3";
    var gunSecimiGecerli = gunSecimi === "1" || gunSecimi === "2" || gunSecimi === "3" || gunSecimi === "4" || gunSecimi === "5";
    var secimGecerli = tehlikeSinifiGecerli && gunSecimiGecerli;

    $('#tablolarkapsayici').toggle(secimGecerli);
    temelisgAciklamalariGuncelle(secim);

    if (!secimGecerli)
    {
        temelisgSablonVerisi = {};
        temelisgTabloGunleri = {};
        temelisgDurumKutulariniSifirla();
        temelisgTabloGunSelectleriniGuncelle();
        temelisgGunToplamUyarilariniGuncelle();
        temelisgAksiyonButonuGuncelle();
        return;
    }

    var kaynak =
        secim === "1" ? temelisgaz :
        secim === "2" ? temelisgtehlikeli :
        temelisgcok;


    temelisgSablonVerisi = {
        1: temelisgTipVerisiHazirla(kaynak, 1, true),
        2: temelisgTipVerisiHazirla(kaynak, 2, true),
        3: temelisgTipVerisiHazirla(kaynak, 3, true),
        4: temelisgTipVerisiHazirla(kaynak, 4, false)
    };

    if (temelisgDuzenlemeSablonVerisi && String(temelisgDuzenlemeSablonVerisi.t) === String(secim))
    {
        temelisgSablonIceriginiUygula(temelisgDuzenlemeSablonVerisi);
    }

    temelisgTabloKur(1, '#tip1tablo', true);
    temelisgTabloKur(2, '#tip2tablo', true);
    temelisgTabloKur(3, '#tip3tablo', true);
    temelisgTabloKur(4, '#tip4tablo', false);

    temelisgToplamHesapla(1);
    temelisgToplamHesapla(2);
    temelisgToplamHesapla(3);
    temelisgToplamHesapla(4);
    temelisgGenelDogrulamaGuncelle();
    temelisgTabloGunSelectleriniGuncelle();
    temelisgGunToplamUyarilariniGuncelle();
    temelisgAksiyonButonuGuncelle();
}

function temelisgAciklamalariGuncelle(secim) {}

function temelisgTipVerisiHazirla(kaynak, tip, secili)
{
    return kaynak
        .filter(function (item) { return item.tip === tip; })
        .map(function (item, index)
        {
            return {
                id: item.id,
                satirid: tip + '_' + index,
                tip: item.tip,
                konu: item.konu,
                sure: item.sure,
                ch: item.ch === 1 ? 1 : 0,
                secili: item.ch === 1
            };
        });
}

function temelisgSablonIceriginiUygula(sablon)
{
    var konuHaritasi = {};
    var konuGruplari = Array.isArray(sablon && sablon.x) ? sablon.x : [];

    konuGruplari.forEach(function (grup)
    {
        var tip = temelisgSayiyaCevir(grup && grup.t);
        var gun = temelisgGunDegeriniNormalizEt(grup && grup.g);
        var konular = Array.isArray(grup && grup.x) ? grup.x : [];

        konular.forEach(function (item)
        {
            konuHaritasi[String(tip) + '_' + String(item.k)] = {
                s: item.s,
                g: gun
            };
        });
    });

    [1, 2, 3, 4].forEach(function (tip)
    {
        temelisgTabloGunleri[tip] = 0;
        temelisgSablonVerisi[tip].forEach(function (item)
        {
            var kayit = konuHaritasi[String(item.tip) + '_' + String(item.id)];
            if (tip === 4)
            {
                item.secili = !!kayit;
                item.ch = kayit ? 1 : 0;
            }
            if (kayit)
            {
                item.sure = temelisgSayiyaCevir(kayit.s);
                if (temelisgTabloGunleri[tip] === 0)
                {
                    temelisgTabloGunleri[tip] = temelisgGunDegeriniNormalizEt(kayit.g);
                }
            }
        });
    });
}

function temelisgTabloKur(tip, tabloSelector, secimSabit)
{
    var konuBasligi = temelisgKonuBasliklari[tip] || "Konu";

    if ($.fn.DataTable.isDataTable(tabloSelector))
    {
        $(tabloSelector).DataTable().clear().destroy();
    }

    temelisgSablonTablolari[tip] = $(tabloSelector).DataTable({
        data: temelisgSablonVerisi[tip],
        dom: 't',
        pageLength: -1,
        ordering: false,
        searching: false,
        info: false,
        paging: false,
        autoWidth: false,
        columns: [
            {
                title: "Seçim",
                data: null,
                orderable: false,
                width: "90px",
                render: function (data, type, row)
                {
                    if (type !== "display") { return row.ch; }
                    var checked = row.ch === 1 ? 'checked="checked"' : '';
                    var disabled = secimSabit ? 'disabled="disabled"' : '';
                    return '<input type="checkbox" class="temelisg-secim" data-tip="' + tip + '" data-id="' + row.satirid + '" ' + checked + ' ' + disabled + ' />';
                }
            },
            {
                title: konuBasligi,
                data: "konu",
                orderable: false
            },
            {
                title: "Süre",
                data: "sure",
                orderable: false,
                width: "140px",
                render: function (data, type, row)
                {
                    if (type !== "display") { return data; }
                    return '<input type="number" class="csstextbox100 temelisg-sure" style="text-align:center;" data-tip="' + tip + '" data-id="' + row.satirid + '" value="' + data + '" min="0" step="1" autocomplete="off" />';
                }
            }
        ],
        createdRow: function (row)
        {
            $(row).find('td').eq(0).css('text-align', 'center');
            $(row).find('td').eq(1).css('text-align', 'left');
            $(row).find('td').eq(2).css('text-align', 'center');
        },
        headerCallback: function (thead)
        {
            $(thead).find('th').css('text-align', 'center');
        }
    });

    $(tabloSelector + ' tbody').off('input', '.temelisg-sure').on('input', '.temelisg-sure', function ()
    {
        var hedefTip = parseInt($(this).attr('data-tip'), 10);
        var satirId = $(this).attr('data-id');
        var sure = temelisgSayiyaCevir($(this).val());
        temelisgSatirGuncelle(hedefTip, satirId, { sure: sure });
        temelisgToplamHesapla(hedefTip);
    });

    $(tabloSelector + ' tbody').off('change', '.temelisg-secim').on('change', '.temelisg-secim', function ()
    {
        var hedefTip = parseInt($(this).attr('data-tip'), 10);
        var satirId = $(this).attr('data-id');
        var secili = $(this).is(':checked');
        temelisgSatirGuncelle(hedefTip, satirId, { secili: secili, ch: secili ? 1 : 0 });
        temelisgToplamHesapla(hedefTip);
    });
}

function temelisgGunSayisiDegeriniGetir()
{
    if (!$('#egitimgunsayisi').length) { return 0; }
    var gunSayisi = parseInt($('#egitimgunsayisi').val(), 10);
    return Number.isNaN(gunSayisi) || gunSayisi < 1 ? 0 : gunSayisi;
}

function temelisgGunDegeriniNormalizEt(deger)
{
    var gun = parseInt(deger, 10);
    var maxGun = temelisgGunSayisiDegeriniGetir();
    if (Number.isNaN(gun) || gun < 1 || (maxGun > 0 && gun > maxGun)) { return 0; }
    return gun;
}

function temelisgGunSecenekleriniOlusturHtml(seciliGun)
{
    var maxGun = temelisgGunSayisiDegeriniGetir();
    var secenekler = ['<option value="0">Lütfen Seçiniz</option>'];

    for (var gun = 1; gun <= maxGun; gun++)
    {
        secenekler.push('<option value="' + gun + '"' + (Number(seciliGun) === gun ? ' selected="selected"' : '') + '>' + gun + '.Gün</option>');
    }

    return secenekler.join('');
}

function temelisgGunSecimleriniGuncelle()
{
    var secim = $('#tehlikesinifi').val();
    var gunSayisi = temelisgGunSayisiDegeriniGetir();
    var tehlikeSinifiGecerli = secim === "1" || secim === "2" || secim === "3";
    var secimGecerli = tehlikeSinifiGecerli && gunSayisi > 0;

    $('#tablolarkapsayici').toggle(secimGecerli);

    if (!secimGecerli)
    {
        temelisgSablonVerisi = {};
        temelisgTabloGunleri = {};
        temelisgDurumKutulariniSifirla();
        temelisgTabloGunSelectleriniGuncelle();
        temelisgGunToplamUyarilariniGuncelle();
        temelisgAksiyonButonuGuncelle();
        return;
    }

    [1, 2, 3, 4].forEach(function (tip)
    {
        temelisgTabloGunleri[tip] = temelisgGunDegeriniNormalizEt(temelisgTabloGunleri[tip]);
    });

    temelisgTabloGunSelectleriniGuncelle();
    temelisgGunToplamUyarilariniGuncelle();
    temelisgAksiyonButonuGuncelle();
}

function temelisgTabloGunSelectleriniGuncelle()
{
    [1, 2, 3, 4].forEach(function (tip)
    {
        var selector = '#tip' + tip + 'gun';
        if (!$(selector).length) { return; }
        $(selector).html(temelisgGunSecenekleriniOlusturHtml(temelisgTabloGunleri[tip] || 0));
    });
}

function temelisgGunToplamUyarilariniGuncelle()
{
    var gunToplamlari = {};
    var seciliGunSayisi = temelisgGunSayisiDegeriniGetir();

    [1, 2, 3, 4].forEach(function (tip)
    {
        var gun = temelisgGunDegeriniNormalizEt(temelisgTabloGunleri[tip]);
        var uyariSelector = '#tip' + tip + 'gunuyari';
        if (!$(uyariSelector).length) { return; }

        if (!gun)
        {
            $(uyariSelector)
                .text('Gün Seçimi Yapılmadı.')
                .css('color', 'brown');
            return;
        }

        if (!Array.isArray(temelisgSablonVerisi[tip]))
        {
            $(uyariSelector).text('').css('color', '');
            return;
        }

        gunToplamlari[gun] = (gunToplamlari[gun] || 0) + temelisgToplamHesapDegeri(tip);
    });

    var eksikGunler = [];
    for (var gunNo = 1; gunNo <= seciliGunSayisi; gunNo++)
    {
        if (!gunToplamlari[gunNo])
        {
            eksikGunler.push(gunNo);
        }
    }

    [1, 2, 3, 4].forEach(function (tip)
    {
        var gun = temelisgGunDegeriniNormalizEt(temelisgTabloGunleri[tip]);
        var uyariSelector = '#tip' + tip + 'gunuyari';
        if (!$(uyariSelector).length) { return; }

        if (!gun)
        {
            $(uyariSelector)
                .text('Gün Seçimi Yapılmadı.')
                .css('color', 'brown');
            return;
        }

        if (eksikGunler.length > 0)
        {
            $(uyariSelector)
                .text('Seçilen ' + seciliGunSayisi + ' günün tamamı en az bir tabloda kullanılmalıdır.')
                .css('color', 'brown');
            return;
        }

        if (!gunToplamlari[gun])
        {
            $(uyariSelector).text('').css('color', '');
            return;
        }

        var toplamSaat = temelisgDakikaSaatCevirOndalikli(gunToplamlari[gun]);
        if (gunToplamlari[gun] > 360)
        {
            $(uyariSelector)
                .text(gun + '. Gün Toplam Süresi ' + toplamSaat + ' Saat. 8 Saati Aşıyor. Düzeltiniz.')
                .css('color', 'brown');
        }
        else
        {
            $(uyariSelector)
                .text(gun + '. Gün Toplam Süresi ' + toplamSaat + ' Saat. 8 Saati Geçmemektedir.')
                .css('color', 'teal');
        }
    });
}

function temelisgGunToplamKuraliUygunMu()
{
    var gunToplamlari = {};
    var seciliGunSayisi = temelisgGunSayisiDegeriniGetir();

    for (var tip = 1; tip <= 4; tip++)
    {
        var gun = temelisgGunDegeriniNormalizEt(temelisgTabloGunleri[tip]);
        if (!gun) { return false; }
        if (!Array.isArray(temelisgSablonVerisi[tip])) { return false; }

        gunToplamlari[gun] = (gunToplamlari[gun] || 0) + temelisgToplamHesapDegeri(tip);
    }

    for (var gunNo = 1; gunNo <= seciliGunSayisi; gunNo++)
    {
        if (!gunToplamlari[gunNo])
        {
            return false;
        }
    }

    return Object.keys(gunToplamlari).every(function (gun)
    {
        return gunToplamlari[gun] <= 360;
    });
}

function temelisgSatirGuncelle(tip, satirId, alanlar)
{
    var satir = temelisgSablonVerisi[tip].find(function (item) { return item.satirid === satirId; });
    if (!satir) { return; }
    Object.assign(satir, alanlar);
}

function temelisgToplamHesapla(tip)
{
    var toplam = temelisgSablonVerisi[tip].reduce(function (sonuc, item)
    {
        if (tip === 4 && !item.secili) { return sonuc; }
        return sonuc + temelisgSayiyaCevir(item.sure);
    }, 0);
    $('#tip' + tip + 'toplam').text(temelisgToplamMetniOlustur(toplam));
    temelisgTabloDogrulamaGuncelle(tip, toplam);
    temelisgGunToplamUyarilariniGuncelle();
    return toplam;
}

function temelisgDakikaSaatCevir(toplamDakika)
{
    if (toplamDakika % 45 !== 0) { return null; }
    return toplamDakika / 45;
}

function temelisgDakikaSaatCevirOndalikli(toplamDakika)
{
    var deger = toplamDakika / 45;
    return Number.isInteger(deger) ? String(deger) : String(parseFloat(deger.toFixed(2)));
}

function temelisgToplamMetniOlustur(toplamDakika)
{
    return 'Toplam Süre: ' + toplamDakika + ' Dakika. ' + temelisgDakikaSaatCevirOndalikli(toplamDakika) + ' Ders Saati.';
}

function temelisgTabloDogrulamaGuncelle(tip, toplamDakika)
{
    var secim = $('#tehlikesinifi').val();
    var saat = temelisgDakikaSaatCevir(toplamDakika);
    var minTip4Saat = temelisgTip4MinSaatleri[secim];
    var dogru = false;
    var mesaj = '';

    if (saat === null)
    {
        mesaj = 'Hatalı: Bu tablo toplamı 45 dakika ve katları olmalı.';
    }
    else if (tip === 4 && saat < minTip4Saat)
    {
        mesaj = 'Hatalı: Bu tablo en az ' + minTip4Saat + ' saat olmalı. Şu an toplam ' + saat + ' saat.';
    }
    else if (tip === 4 && saat >= temelisgTabloMaxSaat)
    {
        mesaj = 'Hatalı: Bu tablo ' + temelisgTabloMaxSaat + ' saatten küçük olmalı. Şu an toplam ' + saat + ' saat.';
    }
    else if (saat > temelisgTabloMaxSaat)
    {
        mesaj = 'Hatalı: Bu tablo en fazla ' + temelisgTabloMaxSaat + ' saat olabilir. Şu an toplam ' + saat + ' saat.';
    }
    else
    {
        dogru = true;
        mesaj = 'Doğru: Toplam ' + saat + ' saat. Kurala uygun.';
    }

    temelisgDurumKutusuYaz('#tip' + tip + 'durum', dogru, mesaj);
    temelisgGenelDogrulamaGuncelle();
}

function temelisgGenelDogrulamaGuncelle()
{
    var secim = $('#tehlikesinifi').val();
    var hedefSaat = temelisgToplamSaatleri[secim];
    if (!hedefSaat)
    {
        temelisgDurumKutusuYaz('#geneldurum', false, 'Genel toplam kontrol bekleniyor.');
        return;
    }

    var toplamDakika = [1, 2, 3, 4].reduce(function (sonuc, tip)
    {
        if (!temelisgSablonVerisi[tip]) { return sonuc; }
        return sonuc + temelisgToplamHesapDegeri(tip);
    }, 0);
    var toplamSaat = temelisgDakikaSaatCevir(toplamDakika);
    var tumTablolarDogru = [1, 2, 3, 4].every(function (tip)
    {
        return $('#tip' + tip + 'durum').attr('data-durum') === '1';
    });

    var dogru = toplamSaat >= hedefSaat && tumTablolarDogru;
    var mesaj;

    if (toplamSaat === null)
    {
        mesaj = 'Hatalı: Genel toplam 45 dakika ve katları olmalı.';
    }
    else if (!tumTablolarDogru)
    {
        mesaj = 'Hatalı: Önce tablo kurallarini düzeltin. Genel toplam ' + toplamSaat + ' saat.';
    }
    else if (toplamSaat < hedefSaat)
    {
        mesaj = 'Hatalı: Toplam eğitim süresi en az ' + hedefSaat + ' saat olmalı. Şu an ' + toplamSaat + ' saat.';
    }
    else
    {
        mesaj = 'Dogru: Genel toplam ' + toplamSaat + ' saat. Şablon bu haliyle kaydedilebilir.';
    }

    temelisgDurumKutusuYaz('#geneldurum', dogru, mesaj);
    temelisgAksiyonButonuGuncelle();
}

function temelisgToplamHesapDegeri(tip)
{
    return temelisgSablonVerisi[tip].reduce(function (sonuc, item)
    {
        if (tip === 4 && !item.secili) { return sonuc; }
        return sonuc + temelisgSayiyaCevir(item.sure);
    }, 0);
}

function temelisgDurumKutusuYaz(selector, dogru, mesaj)
{
    $(selector)
        .attr('data-durum', dogru ? '1' : '0')
        .css({
            'background-color': dogru ? 'teal' : 'brown',
            'color': '#ffffff'
        })
        .text(mesaj);
}

function temelisgDurumKutulariniSifirla()
{
    [1, 2, 3, 4].forEach(function (tip)
    {
        temelisgDurumKutusuYaz('#tip' + tip + 'durum', false, 'Kontrol bekleniyor.');
        $('#tip' + tip + 'toplam').text('Toplam Süre: 0 Dakika. 0 Ders Saati.');
    });
    temelisgDurumKutusuYaz('#geneldurum', false, 'Genel toplam kontrol bekleniyor.');
    temelisgAksiyonButonuGuncelle();
}

function temelisgFormKaydedilebilirMi()
{
    var sablonAdi = $('#sablonismi').val().trim();
    var tehlikeSinifi = $('#tehlikesinifi').val();
    var egitimGunSayisi = $('#egitimgunsayisi').length ? $('#egitimgunsayisi').val() : '1';

    if (sablonAdi.length < 3) { return false; }
    if (!(tehlikeSinifi === "1" || tehlikeSinifi === "2" || tehlikeSinifi === "3")) { return false; }
    if ($('#egitimgunsayisi').length && !(egitimGunSayisi === "1" || egitimGunSayisi === "2" || egitimGunSayisi === "3" || egitimGunSayisi === "4" || egitimGunSayisi === "5")) { return false; }

    for (var tip = 1; tip <= 4; tip++)
    {
        if (!Array.isArray(temelisgSablonVerisi[tip]) || $('#tip' + tip + 'durum').attr('data-durum') !== '1')
        {
            return false;
        }
        if ($('#tip' + tip + 'gun').length && temelisgGunDegeriniNormalizEt(temelisgTabloGunleri[tip]) === 0)
        {
            return false;
        }
    }

    if (!temelisgGunToplamKuraliUygunMu())
    {
        return false;
    }

    return $('#geneldurum').attr('data-durum') === '1';
}

function temelisgAksiyonButonuGuncelle()
{
    if (!temelisgAksiyonButonSelector) { return; }
    $(temelisgAksiyonButonSelector).toggle(temelisgFormKaydedilebilirMi());
}

function temelisgSayiyaCevir(deger)
{
    var sayi = parseInt(deger, 10);
    return Number.isNaN(sayi) || sayi < 0 ? 0 : sayi;
}

function temelisgSablonSonucunuHazirla()
{
    if (!temelisgSablonDogrula())
    {
        return null;
    }

    var konuGruplari = [];
    var tabloToplamlari = {};

    [1, 2, 3, 4].forEach(function (tip)
    {
        tabloToplamlari['tip' + tip] = temelisgToplamHesapla(tip);
        var grup = {
            t: tip,
            g: temelisgGunDegeriniNormalizEt(temelisgTabloGunleri[tip]),
            x: []
        };

        temelisgSablonVerisi[tip].forEach(function (item)
        {
            if (tip !== 4 || item.secili)
            {
                grup.x.push({
                    k: item.id,
                    s: temelisgSayiyaCevir(item.sure)
                });
            }
        });

        konuGruplari.push(grup);
    });

    return {
        i: $('#sablonismi').val().trim(),
        t: parseInt($('#tehlikesinifi').val(), 10),
        g: parseInt($('#egitimgunsayisi').val(), 10),
        s: temelisgDakikaSaatCevir(tabloToplamlari.tip1 + tabloToplamlari.tip2 + tabloToplamlari.tip3 + tabloToplamlari.tip4),
        x: konuGruplari
    };
}

function temelisgSablonDogrula()
{
    var sablonAdi = $('#sablonismi').val().trim();
    var tehlikeSinifi = $('#tehlikesinifi').val();
    var egitimGunSayisi = $('#egitimgunsayisi').length ? $('#egitimgunsayisi').val() : '1';
    var hedefSaat = temelisgToplamSaatleri[tehlikeSinifi];
    var tip4MinSaat = temelisgTip4MinSaatleri[tehlikeSinifi];
    if (sablonAdi.length < 3)
    {
        alertify.error('Şablon adı en az 3 karakter oluşmalıdır.');
        return false;
    }

    if (!(tehlikeSinifi === "1" || tehlikeSinifi === "2" || tehlikeSinifi === "3"))
    {
        alertify.error('Lütfen tehlike sınıfı seçiniz.');
        return false;
    }

    if ($('#egitimgunsayisi').length && !(egitimGunSayisi === "1" || egitimGunSayisi === "2" || egitimGunSayisi === "3" || egitimGunSayisi === "4" || egitimGunSayisi === "5"))
    {
        alertify.error('Lütfen eğitim gün sayısı seçiniz.');
        return false;
    }

    for (var tip = 1; tip <= 4; tip++)
    {
        var tipToplamDakika = temelisgToplamHesapDegeri(tip);
        if (temelisgDakikaSaatCevir(tipToplamDakika) === null)
        {
            alertify.error('Her tablo toplam süresi 45 dakika ve 1 ders saati katı olmak zorundadır.');
            return false;
        }
        var tipToplamSaat = temelisgDakikaSaatCevir(tipToplamDakika);
        if (tipToplamSaat > temelisgTabloMaxSaat)
        {
            alertify.error('Her tablo en fazla ' + temelisgTabloMaxSaat + ' saat olabilir.');
            return false;
        }
        if (tip === 4 && tipToplamSaat < tip4MinSaat)
        {
            alertify.error('İşe ve İşyerine Özgü Konular tablosu en az ' + tip4MinSaat + ' saat olmalıdır.');
            return false;
        }
        if (tip === 4 && tipToplamSaat >= temelisgTabloMaxSaat)
        {
            alertify.error('İşe ve İşyerine Özgü Konular tablosu ' + temelisgTabloMaxSaat + ' saatten küçük olmalıdır.');
            return false;
        }
        if ($('#tip' + tip + 'gun').length && temelisgGunDegeriniNormalizEt(temelisgTabloGunleri[tip]) === 0)
        {
            alertify.error('Lütfen her tablo için gün seçiniz.');
            return false;
        }
    }
    var genelToplamDakika = temelisgToplamHesapDegeri(1) + temelisgToplamHesapDegeri(2) + temelisgToplamHesapDegeri(3) + temelisgToplamHesapDegeri(4);
    var genelToplamSaat = temelisgDakikaSaatCevir(genelToplamDakika);
    if (genelToplamSaat === null)
    {
        alertify.error('Toplam eğitim süresi 45 dakika ve 1 ders saati katları olmak zorundadır.');
        return false;
    }
    if (genelToplamSaat < hedefSaat)
    {
        alertify.error('Toplam eğitim süresi tehlike sınıfına göre en az ' + hedefSaat + ' saat olmalidir.');
        return false;
    }
    return true;
}

function temelisgTehlikeSinifiMetniGetir(deger)
{
    if (String(deger) === '1') { return 'Az Tehlikeli'; }
    if (String(deger) === '2') { return 'Tehlikeli'; }
    if (String(deger) === '3') { return 'Çok Tehlikeli'; }
    return '-';
}

function temelisgSablonEkleSayfasinaGit()
{
    window.location.href = '/temelsablonekle';
}

function temelisgSablonListeTabloOlustur(liste)
{
    if ($.fn.DataTable.isDataTable('#temelisgsablonlistetablo'))
    {
        $('#temelisgsablonlistetablo').DataTable().clear().destroy();
    }

    $('#temelisgsablonlistetablo').DataTable({
        data: Array.isArray(liste) ? liste : [],
        pageLength: -1,
        order: false,
        lengthMenu: [[10, 25, 50, 100, -1], [10, 25, 50, 100, 'Tümü']],
        columns:
        [
            { data: 'i', title: 'Şablon Adı', width: '36%' },
            {
                data: 't',
                title: 'Tehlike Sınıfı',
                width: '22%',
                render: function (data)
                {
                    return temelisgTehlikeSinifiMetniGetir(data);
                }
            },
            {
                data: 's',
                title: 'Toplam Süre',
                width: '18%',
                render: function (data)
                {
                    return data ? String(data) + ' Ders Saati' : '-';
                }
            },
            {
                data: null,
                title: 'Düzenle',
                orderable: false,
                width: '12%',
                render: function (data, type, row)
                {
                    return '<input type="button" class="cssbutontamam" value="Düzenle" data-id="' + row.id + '" onclick="temelisgSablonDuzenleGoster(this);" />';
                }
            },
            {
                data: null,
                title: 'Sil',
                orderable: false,
                width: '12%',
                render: function (data, type, row)
                {
                    return '<input type="button" class="cssbutontamam" value="Sil" data-id="' + row.id + '" onclick="temelisgSablonSilDiyalogAc(this);" />';
                }
            }
        ],
        language:
        {
            search: 'Şablon Ara:',
            lengthMenu: 'Sayfa başına _MENU_ kayıt göster',
            zeroRecords: 'İSG eğitim şablonu bulunamadı',
            info: '_TOTAL_ kayıttan _START_ ile _END_ arası gösteriliyor',
            infoEmpty: 'İSG eğitim şablonu bulunamadı',
            infoFiltered: '(toplam _MAX_ kayıttan filtrelendi)',
            emptyTable: 'İSG eğitim şablonu bulunamadı'
        },
        createdRow: function (row)
        {
            $(row).find('td').eq(0).css('text-align', 'left');
        },
        headerCallback: function (thead)
        {
            $(thead).find('th').css('text-align', 'center');
        }
    });

    $('.dt-search input').css({ 'background-color': 'white' }).attr('autocomplete', 'off');
    $('.dt-length select').css({ 'background-color': 'white' });
}

function temelisgSablonSilDiyalogAc(button)
{
    var sablonId = $(button).attr('data-id');
    $('#temelisgsablonsildiyalog').attr('data-id', sablonId).fadeIn();
}

function temelisgSablonDuzenleGoster(button)
{
    var sablonId = $(button).attr('data-id');
    if (!sablonId)
    {
        alertify.error('Düzenlenecek şablon bulunamadı.');
        return;
    }
    window.location.href = '/temelsablonduzenle?id=' + encodeURIComponent(sablonId);
}

function temelisgSablonSeciliIdOku()
{
    var arama = new URLSearchParams(window.location.search);
    return String(arama.get('id') || '').trim();
}
