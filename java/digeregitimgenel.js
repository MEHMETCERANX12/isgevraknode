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
    const saat = saatMap[String(ayarlar.c || "")];
    if (saat)
    {
        $("#saat").val(saat);
    }
}

function digeregitim1yukle()
{
    isyerigetir();
    digeregitimsaatayariyukle();
    digeregitimurlsecimiyukle();
}

function digeregitimurlsecimiyukle()
{
    const egitimId = String(new URLSearchParams(window.location.search).get("id") || "").trim();
    if (/^[1-8]$/.test(egitimId))
    {
        $("#egitimtur").val(egitimId);
    }
}

function digeregitimicerikkodu(egitimturint)
{
    if (egitimturint === 1) { return 2; }
    if (egitimturint === 2) { return 1; }
    return egitimturint;
}

async function digeregitimsertifikakontrol()
{
    $('#loading').show();
    $.when(digeregitimsertifikayaz())
    .done(function ()
    {
        alertify.error("Dosya indirildi", 7);
    })
    .fail(function ()
    {
        alertify.error("Bir hata oluştu.", 7);
    })
    .always(function ()
    {
        $('#loading').hide();
    });
}

async function digeregitimkatilimkontrol()
{
    $('#loading').show();
    $.when(digerkatılımlistesiyaz())
    .done(function ()
    {
        alertify.error("Dosya indirildi", 7);
    })
    .fail(function ()
    {
        alertify.error("Bir hata oluştu.", 7);
    })
    .always(function ()
    {
        $('#loading').hide();
    });
}

function digeregitimdevam1()
{
    let firmaid = firmasecimoku();
    const verijson =
    {
        tarih: $("#tarih").val(),
        egitimtur: $("#egitimtur").val(),
        saat: $("#saat").val(),
        egitimsekli: $("#egitimsekli").val(),
        bossatir: parseInt($("#bossatir").val()) || 0
    };
    store.set("digeregitimveri", JSON.stringify(verijson));
    window.location.href = "/digeregitim2?id=" + encodeURIComponent(firmaid);
}

function digeregitimdevam2()
{
    dokumancalisansecim();
    store.set("dosyaciktitipi", "3");
    window.location.href = "/dosyacikti?id=3";
}

async function digeregitimsertifikayaz()
{
    let uzmanad = store.get("uzmanad");
    let uzmanno = store.get("uzmanno");
    let digeregitimveri = store.get('digeregitimveri');
    digeregitimveri = JSON.parse(digeregitimveri || '{}');
    let isyeri = jsoncevir(store.get('xjsonfirma')) || {};
    let hekimad = isyeri.hk;
    let hekimno = isyeri.hn;
    let calisanlistedata = store.get('calisansecimjsonx');
    let calisanliste = [];
    if (calisanlistedata)
    {
        try
        {
            calisanliste = JSON.parse(calisanlistedata);
        }
        catch (e)
        {
            calisanliste = [];
        }
    }
    if (!Array.isArray(calisanliste) || calisanliste.length === 0)
    {
        calisanliste = [{ a: "", u: "" }];
    }
    let isyeriismi = isyeri.fi;
    let isverenvekili = isyeri.is;
    let tarih = digeregitimveri.tarih || "......./......./20.....";
    let egitimturint = parseInt(digeregitimveri.egitimtur) || 1;
    egitimturint = digeregitimicerikkodu(egitimturint);
    const egitimtur = new Map([[0,"Lütfen Seçiniz"],[1,"İş Ekipmanı Eğitimi"],[2,"Yüksekte Çalışma Eğitimi"],[3,"Kimyasal Eğitimi"],[4,"İş Kazası Eğitimi"],[5,"KKD Eğitimi"],[6,"Kaldırma Aksesuarı"],[7,"Yangın Eğitimi"],[8,"Gürültülü Ortamda Güvenli Çalışma Eğitimi"]]);
    let egitimturdosya = egitimtur.get(parseInt(egitimturint));
    let egitimtsaat = digeregitimveri.saat || "2 Saat";
    let egitimyeri = digeregitimveri.egitimyeri || "Örgün";
    let egitimicerik = {};
    let bosluk = 0;
    if (egitimturint === 1)
    { bosluk = 50; egitimicerik = { "baslik": "İŞ EKİPMANLARIYLA GÜVENLİ ÇALIŞMA EĞİTİMİ KATILIM SERTİFİKASI", "katilim": "İŞ EKİPMANLARI İLE GÜVENLİ ÇALIŞMA - EĞİTİM KATILIM TUTANAĞI", "paragraf": "\u200B\t\t\tYukarıda adı soyadı yazılı çalışan, “İş Ekipmanlarının Kullanımında Sağlık ve Güvenlik Şartları Yönetmeliği” 10.ve 11.maddeleri çerçevesinde aşağıda yer alan konulardaki eğitim programına başarıyla tamamlayarak bu eğitim belgesini almaya hak kazanmıştır.", "maddeler": ["İş ekipmanı kumanda ve acil durdurma sistemleri", "İş ekipmanı bakım onarım işlerinde güvenlik", "İş ekipmanlarının ergonomik kullanımı", "İş ekipmanı kaynaklı iş kazaları ve meslek hastalıkları", "İş sağlığı ve güvenliği talimatı ve kullanım kılavuzları", "İş ekipmanlarının koruyucu donanımları"] }; }
    if (egitimturint === 2)
    { bosluk = 50;egitimicerik = { "baslik": "YÜKSEKTE ÇALIŞMA EĞİTİMİ KATILIM SERTİFİKASI", "katilim": "YÜKSEKTE ÇALIŞMA EĞİTİM KATILIM TUTANAĞI", "paragraf": "\u200B\t\t\tYukarıda adı soyadı yazılı çalışan, “Yapı İşlerinde İş Sağlığı ve Güvenliği Yönetmeliği Ek-4 Madde-2/g” çerçevesinde aşağıda yer alan konulardaki eğitim programına başarıyla tamamlayarak bu eğitim belgesini almaya hak kazanmıştır.", "maddeler": ["Yükseklik ile ilgili tanımlar, yüksekte çalışmanın kuralları", "Toplu koruma yöntemleri ve kişisel korunma yöntemleri", "Kişisel koruyucu donanımlar ve doğru kullanım şekli", "Yüksekte çalışma ekipmanlarının güvenli kullanımı", "Yüksek düşmeye neden olan faktörler", "Yatay ve dikey yaşam hatlarının kullanımı"] }; }
    if (egitimturint === 3)
    { bosluk = 50;egitimicerik = { "baslik": "KİMYASALLARLA GÜVENLİ ÇALIŞMA EĞİTİMİ KATILIM SERTİFİKASI", "katilim": "KİMYASALLARLA GÜVENLİ ÇALIŞMA - EĞİTİM KATILIM TUTANAĞI", "paragraf": "\u200B\t\t\tYukarıda adı soyadı yazılı çalışan, “Kimyasal Maddelerle Çalışmalarda Sağlık ve Güvenlik Önlemleri Hakkında Yönetmelik” 9. madde çerçevesinde aşağıda yer alan konulardaki eğitim programına başarıyla tamamlayarak bu eğitim belgesini almaya hak kazanmıştır.", "maddeler": ["Patlayıcı ortam ve patlamadan korunma tedbirleri", "Kimyasal risk işaretleri ve güvenlik tedbirleri", "Kimyasalların uygun şekilde depolanması", "Malzeme güvenlik bilgi formları", "Toplu koruma yöntemleri ve kişisel korunma yöntemleri"] }; }
    if (egitimturint === 4)
    { bosluk = 43, egitimicerik = { "baslik": "İŞ KAZASI SONRASI İŞE DÖNÜŞ EĞİTİM SERTİFİKASI", "katilim": "İŞ KAZASI SONRASI İŞE DÖNÜŞ - EĞİTİM KATILIM TUTANAĞI", "paragraf": "\u200B\t\t\tYukarıda adı soyadı yazılı çalışan, “Çalışanların İş Sağlığı ve Güvenliği Eğitimlerinin Usul ve Esasları Hakkında Yönetmelik” 6. madde çerçevesinde aşağıda yer alan konulardaki eğitim programına başarıyla tamamlayarak bu eğitim belgesini almaya hak kazanmıştır.", "maddeler": ["İş kazasının sebepleri", "İş kazasından korunma yöntemleri", "İş kazası ve meslek hastalığından doğan hukuki sonuçlar", "Güvenli çalışma yöntemleri", "Toplu koruma yöntemleri ve kişisel korunma yöntemleri", "Düzeltici ve önleyici faaliyetler hakkında bilgilendirme"] } };
    if (egitimturint === 5)
    { bosluk = 50, egitimicerik = { "baslik": "KİŞİSEL KORUYUCU DONANIM EĞİTİMİ SERTİFİKASI", "katilim": "KİŞİSEL KORUYUCU DONANIM - EĞİTİM KATILIM TUTANAĞI", "paragraf": "\u200B\t\t\tYukarıda adı soyadı yazılı çalışan, “Kişisel Koruyucu Donanımların İşyerlerinde Kullanılması Hakkında Yönetmelik” 5. madde çerçevesinde aşağıda yer alan konularda uygulamalı eğitim programını başarıyla tamamlayarak bu eğitim belgesini almaya hak kazanmıştır.", "maddeler": ["İş sağlığı ve güvenliği kültürü", "Toplu ve kişisel olarak korunma yöntemleri", "Kişisel koruyucu donanım tip ve çeşitleri", "Kişisel koruyucu donanım hijyeni ve temizliği", "Kişisel koruyucu donanım kullanımı önemi"] } };
    if (egitimturint === 6)
    { bosluk = 50, egitimicerik = { "baslik": "KALDIRMA AKSESUARLARININ GÜVENLİ KULLANIM EĞİTİMİ SERTİFİKASI", "katilim": "KALDIRMA AKSESUARLARININ GÜVENLİ KULLANIM - EĞİTİM KATILIM TUTANAĞI", "paragraf": "\u200B\t\t\tYukarıda adı soyadı yazılı çalışan, “İş Ekipmanlarının Kullanımında Sağlık ve Güvenlik Şartları Yönetmeliği” çerçevesinde aşağıda yer alan konulardaki eğitim programına başarıyla tamamlayarak bu eğitim belgesini almaya hak kazanmıştır.", "maddeler": ["Sapanlama temel kuralları", "Sapan çeşitleri ve doğru kullanım", "Kaldırma aksesuarlarının kontrolü ve bakımı", "Güvenli kaldırma uygulamaları", "Etiketleme ve kapasite tespiti"] } };
    if (egitimturint === 7)
    { bosluk = 50, egitimicerik = { "baslik": "YANGIN EĞİTİMİ SERTİFİKASI", "katilim": "YANGIN EĞİTİMİ - EĞİTİM KATILIM TUTANAĞI", "paragraf": "\u200B\t\t\tYukarıda adı soyadı yazılı çalışan, yangınla mücadele ve acil durumlarda güvenli hareket edilmesi kapsamında aşağıda yer alan konulardaki eğitim programını başarıyla tamamlayarak bu eğitim belgesini almaya hak kazanmıştır.", "maddeler": ["Yangının temel prensipleri ve yangın türleri", "Yangının çıkış nedenleri ve alınması gereken önleyici tedbirler", "Yangın söndürme cihazlarının türleri ve kullanım şekli", "Acil çıkış yolları, kaçış güzergâhları ve toplanma yeri", "Acil durum numaraları ve iletişim yöntemleri", "Yangın söndürme, kurtarma, koruma ve ilk yardım ekiplerinin görevleri"] } };
    if (egitimturint === 8)
    { bosluk = 50, egitimicerik = { "baslik": "GÜRÜLTÜLÜ ORTAMDA GÜVENLİ ÇALIŞMA EĞİTİMİ KATILIM SERTİFİKASI", "katilim": "GÜRÜLTÜLÜ ORTAMDA GÜVENLİ ÇALIŞMA - EĞİTİM KATILIM TUTANAĞI", "paragraf": "\u200B\t\t\tYukarıda adı soyadı yazılı çalışan, “Çalışanların Gürültü ile İlgili Risklerden Korunmalarına Dair Yönetmelik” 11. maddesi çerçevesinde aşağıda yer alan konulardaki eğitim programını başarıyla tamamlayarak bu eğitim belgesini almaya hak kazanmıştır.", "maddeler": ["Gürültüden kaynaklanabilecek riskler", "Gürültüye karşı alınan koruyucu ve önleyici tedbirler", "Maruziyet sınır değerleri ve maruziyet eylem değerleri", "Gürültü ölçüm sonuçlarının değerlendirilmesi ve önemi", "Kulak koruyucularının doğru seçimi ve kullanımı", "Gürültüye bağlı işitme kaybı belirtileri, sağlık gözetimi ve güvenli çalışma uygulamaları"] } };
    const iconBase64 = 'data:image/png;base64,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AADGPwAIACACAGD8A4AAACIAAMY/AAgAIAIAYPwDgAAAIgAAxj8ACAAgAgAY/8Y/AAgAIAIAGP8AgAAAIgCA8Q8ACAAgAgAY/wAgAAAiAIDxDwACACACABj/ACAAgAgAgPEPAAIAiAAAGP8AIACACABg/AMAAgCIAADGPwAgAIAIAGD8AwACAIgAAMY/AAgAgAgAYPwDgAAAiAAAxj8ACACACABg/AOAAAAigAgAGP8AgAAAIgCA8Q8ACAAgAgAY/wCAAAAiAIDxDwAIACACABj/ACAAACIAgPEPAAIAIAIAGP8AIAAAIgCA8Q8AAgAgAgDGPwAgAAAiAGD8AwACAIgAAMY/ACAAgAgAYPwDAAIAiAAAxj8ACACOAEQAAOMfAAQAQAQAMP4BQAAARADA+AcABABABACMfwBAAABEAMD4BwAEAEAEAIx/AEAAABFABACMfwBAAAARAMD4BwAEABABAIx/ABAAABEAMP4BAAEAEAEA4x8AEAAAEQAw/gEAAQAQAQDjHwAQAAARADD+AQABABABAOMfABAAABEAMP4BAAEARAAA4x8ABABABACMfwBAAABEAMD4BwAEAEAEAIx/AEAAAEQAwPgHAAQAQAQAjH8AQAAARADA+AcABABABACMfwBAAABEADD+AQABABABRAAw/gEAAQAQAQDjHwAQAAARADD+AQABABABAOMfABAAABEAMP4BAAEAEAEA4x8AEAAAEQCMf+MfABAAABEAjH8AAAEAEAHA+AcABAAAEQCMfwBAAABEAMD4BwAEAEAEAIx/AEAAAEQAwPgHAAQAQAQAjH8AQAAARAAw/gEABABABADjHwBAAABEADD+AQABAEAEAOMfABAAAEQAMP4BAAEAEAFEADD+AQABABABAOMfABAAABEAjH8AAAEAEAHA+AcAEAAAEQCMfwAAAQAQAcD4BwAEAAARAIx/AEAAABABwPgHAAQAABEAjH8AQAAAEAHA+AcABABABADjHwBAAABEADD+AQAEAEAEAOMfAEAAAEQAMP4BAAQAQAQA4x8AEAAARAAw/gEAAQBABADjHwAQAABEAIx/AAABAEAEwPgHABAAAEQAjH8AAAEAEAHA+AcAEAAAEQCMfwAAAQAQAcD4BwAEAAARAIx/AEAAABABMP4BAAQAABEA4x8AQAAAEAEw/gEABAAAEQDjHwBAAAAQATD+AQAEAEAEEAEw/gEABABABADjHwAQAABEADD+AQABAEAEwPgHABAAAEQAjH8AAAEAQATA+AcAEAAARACMfwAAAQBABMD4BwAQAABEAIx/AAABAEAEwPgHABAAABEA4x8AQAAAEAEw/gEABAAAEQDjHwBAAAAQATD+AQAEAAARAOMfAEAAABABMP4BAAQAABEA4x8AQAAAOHcEMBiNfwCAsG46AoCiaNv2l/R6XZZllf5y6kSMfwAAAQAgdggQAYYp38Xx5zT+/+ooAAA+zkcAAP5PGpEP0tsDJzGo8X83/b4dOQoAAAEAYNMIcJje7nXjkv7KD2/8Kv1+eYgjAIAAAHDuCJB/ouwbAvrrsFj/5F+kAQA4gx1HAHC63d3dSXp7kV57TqM3POwPAGBDHgII8AndNwT8rSzLn9Nf3kmvW07l2uS7Mf6Yxv/fHQUAwGZ8BADgjNLofFb4SMB1en/+Pu8PAHA+PgIAcA67u7tP0ttjJ3EllsX6lv+5owAAOD93AACcQxqjOQDcLtwNcNnyT/1vG/8AANtzBwDAlnZ3dx8V67sBJk7jwuSwsm/4AwAIAAB9iwB5/B+k18xpbGXVDf9DRwEAIAAA9DkEVF0I8JWBmw//5+n1LI3/leMAABAAAIYSAupi/bGA2mkY/gAAAgDAOELA/cJHAwx/AAABAGAUIaAq1ncE5I8GjPlhgctu+B8a/gAAAgBA5BAw6SLAw/Sajugf/TC9XnqqPwCAAAAwxhiQA8D9LghUAf8R81f55Z/2H/lpPwCAAABArBgwT6/X3ehf+p0FABAAAPjtGFB1IeCbYv0tAn1+ZsDyg9E/95N+AAABAIDzB4F8d8C0CwInv74Oedzn2/qPu/eFn/IDAAgAAFx+FKi6GPBl9+vJBcWBefd+/MFfL419AAABAID+BYKNYoCn8wMAAAAAAARwwxEAAACAAAAAAAAIAAAAAIAAAAAAAAgAAAAAgAAAAAAACAAAAACAAAAAAAAIAAAAACAAAAAAAAIAAAAAIAAAAAAAAgAAAAAgAAAAAAACAAAAACAAAAAAAAIAAAAACAAAAACAAAAAAAAIAAAAAIAAAAAAAAgAAAAAgAAAAAAACAAAAACAAAAAAAACAAAAACAAAAAAAAIAAAAAIAAAAAAAAgAAAAAgAAAAAAACAAAAACAAAAAAAAIAAAAACAAAAACAAAAAAAAIAAAAAIAAAAAAAAgAAAAAgAAAAAAACAAAAACAAAAAAAACAAAAACAAAAAAAAIAAAAAIAAAAAAAAgAAAAAgAAAAAAACAAAAACAAAAAAgAAAAAAACAAAAACAAAAAAAAIAAAAAIAAAAAAAAgAAAAAgAAAAAAACAAAAACAAAAAAAACAAAAACAAAAAAAAIAAAAAIAAAAAAAAgAAAAAgAAAAAAACAAAAACAAAAAAgAAAAAAACAAAAACAAAAAAAAIAAAAAIAAAAAAAAgAAAAAgAAAAAAACAAAAAAgAAAAAAACAAAAACAAAAAAAAIAAAAAIAAAAAAAAgAAAAAgAAAAAAACAAAAACAAAAAAgAAAAAAACAAAAACAAAAAAAAIAAAAAIAAAAAAAAgAAAAAgAAAAAAACAAAAAAgAAAAAAACAAAAACAAAAAAAAIAAAAAIAAAAAAAAgAAAAAgAAAAAAACAAAAAAgAAAAAgAAAAAAACAAAAACAAAAAAAAIAAAAAIAAAAAAAAgAAAAAgAAAAAAACAAAAAAgAAAAAAACAAAAACAAAAAAAAIAAAAAIAAAAAAAAgAAAAAgAAAAAAACAAAAAAgAAAAAgAAAAAAACAAAAACAAAAAAAAIAAAAAIAAAAAAAAgAAAAAgAAAAAAAAgAAAAAgAAAAAAACAAAAACAAAAAAAAIAAAAAIAAAAAAAAgAAAAAgAAAAAAACAAAAAAgAAAAAgAAAAAAACAAAAACAAAAAAAAIAAAAAIAAAAAAAAgAAAAAgAAAAAAAAgAAAAAgAAAAAAACAAAAACAAAAAAAAIAAAAAIAAAAAAAAgAAAAAgAAAAAIAAAAAAAAgAAAAAgAAAAAAACAAAAMB/2bEDGQAAAIBB/tb3+AojAAEAAAAACAAAAABAAAAAAAACAAAAABAAAAAAIAAAAAAAAQAAAAAIAAAAAEAAAAAAAAIAAAAAEAAAAACAAAAAAAAEAAAAAAgAAAAAQAAAAAAAAgAAAAAQAAAAAIAAAAAAAAQAAAAAIAAAAAAAAQAAAAACAAAAABAAAAAAgAAAAAAABAAAAAAgAAAAAAABAAAAAAgAAAAAQAAAAAAAAgAAAAAEAAAAACAAAAAAAAEAAAAACAAAAABAAAAAAAACAAAAABAAAAAAgAAAAAAAAQAAAAAIAAAAAEAAAAAAAAIAAAAAEAAAAACAAAAAAAAEAAAAACAAAAAAQAAAAAAAAgAAAAAQAAAAAIAAAAAAAAQAAAAAIAAAAAAAAQAAAAAIAAAAAEAAAAAAgAAAAAAAFhJAgAEApKo6nvcfVk8AAAAASUVORK5CYII=';
const docDefinition = {
  images: {
    tickIcon: iconBase64,
  },
  styles: {
    ustbaslik: { fontSize: 14, bold: true, alignment: 'center' },
    normalsatir: { fontSize: 11, alignment: 'justify' }
  },
  pageOrientation: 'landscape',

  content: calisanliste.map((calisan, index) => {
    const content = [
      { text: egitimicerik.baslik, style: 'ustbaslik', margin: [0, 50, 0, 10] },
      { text: 'İşyeri Unvanı: ' + isyeriismi, style: 'normalsatir', margin: [80, 0, 0, 5] },
      { text: 'Katılımcı Adı Soyadı: ' + calisan.a, style: 'normalsatir', margin: [80, 0, 0, 5] },
      { text: 'Katılımcının Görev Unvanı: ' + calisan.u, style: 'normalsatir', margin: [80, 0, 0, 5] },
      { text: 'Tarih: ' + tarih, style: 'normalsatir', margin: [80, 0, 0, 5] },
      { text: 'Eğitim Süresi: ' + egitimtsaat, style: 'normalsatir', margin: [80, 0, 0, 5] },
      { text: 'Eğitim Şekli: ' + egitimyeri, style: 'normalsatir', margin: [80, 0, 0, 5] },
      { text: egitimicerik.paragraf, style: 'normalsatir', margin: [46, 0, 50, 5] },

      ...egitimicerik.maddeler.map(madde => ({
        columns: [
          {
            image: 'tickIcon',
            width: 11,
            height: 14,
            margin: [80, 0, 0, 0]
          },
          {
            text: madde,
            style: 'normalsatir',
            margin: [85, 0, 50, 0]
          }
        ],
        columnGap: 5,
        margin: [0, 2, 0, 2]
      })),

      { text: '', margin: [0, bosluk] },
      genelucluimzatablo(uzmanad, isverenvekili, hekimad, uzmanno, hekimno)
    ];

    if (index < calisanliste.length - 1) {
      content.push({ text: '', pageBreak: 'after' });
    }

    return content;
  }).flat()
};
    const sertifikaSekli = Number(digeregitimsertifikaseklioku());
    if (sertifikaSekli === 1)
    {
        sertifikakirmizi(docDefinition);
    }
    else if (sertifikaSekli === 0)
    {
        sertifikalacivert(docDefinition);
    }
    else
    {
        sertifikaarkaplan(docDefinition);
    }
    const pdfcikti = pdfMake.createPdf(docDefinition);
    pdfcikti.getBlob((blob) => {saveAs(blob, egitimturdosya + '.pdf');});
}

async function digerkatılımlistesiyaz()
{
    let uzmanad = store.get("uzmanad");
    let uzmanno = store.get("uzmanno");
    let digeregitimveri = store.get('digeregitimveri');
    digeregitimveri = JSON.parse(digeregitimveri || '{}');
    let bossatir = parseInt(digeregitimveri.bossatir || "0");
    let isyeri = jsoncevir(store.get('xjsonfirma')) || {};
    let hekimad = isyeri.hk;
    let hekimno = isyeri.hn;
    let calisanlistedata = store.get('calisansecimjsonx');
    let calisanliste = [];
    if (calisanlistedata)
    {
        try
        {
            calisanliste = JSON.parse(calisanlistedata);
        }
        catch (e) {
            calisanliste = [];
        }
    }
    const seciliCalisanlar = Array.isArray(calisanliste) ? [...calisanliste] : [];
    const ayriKatilimListesi = digeregitimkatilimlisteayrioku() === "1" && seciliCalisanlar.length > 0;
    if (!Array.isArray(calisanliste) || calisanliste.length === 0) {
        calisanliste = Array.from({ length: 13 }, () => ({ a: "", u: "" }));
    }
    else if (bossatir > 0)
    {
        calisanliste = calisanliste.concat(Array.from({ length: bossatir }, () => ({ a: "", u: "" })));
    }
    let isyeriismi = isyeri.fi;
    let egitimtsaat = digeregitimveri.saat || "2 Saat";
    let egitimyeri = digeregitimveri.egitimyeri || "Örgün";
    let tarih = digeregitimveri.tarih || "......./......./20.....";
    const katilimlistesi = { pageMargins: [25, 25, 25, 25], content: [] };

    let egitimturint = parseInt(digeregitimveri.egitimtur) || 1;
    egitimturint = digeregitimicerikkodu(egitimturint);
    if (egitimturint === 1)
    {egitimicerik = { "baslik": "İŞ EKİPMANLARIYLA GÜVENLİ ÇALIŞMA EĞİTİMİ KATILIM SERTİFİKASI", "katilim": "İŞ EKİPMANLARIYLA GÜVENLİ ÇALIŞMA - EĞİTİM KATILIM TUTANAĞI", "paragraf": "\u200B\t\t\tYukarıda adı soyadı yazılı çalışan, “İş Ekipmanlarının Kullanımında Sağlık ve Güvenlik Şartları Yönetmeliği” 10.ve 11.maddeleri çerçevesinde aşağıda yer alan konulardaki eğitim programına başarıyla tamamlayarak bu eğitim belgesini almaya hak kazanmıştır.", "maddeler": ["İş ekipmanı kumanda ve acil durdurma sistemleri", "İş ekipmanı bakım onarım işlerinde güvenlik", "İş ekipmanlarının ergonomik kullanımı", "İş ekipmanı kaynaklı iş kazaları ve meslek hastalıkları", "İş sağlığı ve güvenliği talimatı ve kullanım kılavuzları", "İş ekipmanlarının koruyucu donanımları"] }; }
    if (egitimturint === 2)
    {egitimicerik = { "baslik": "YÜKSEKTE ÇALIŞMA EĞİTİMİ KATILIM SERTİFİKASI", "katilim": "YÜKSEKTE GÜVENLİ ÇALIŞMA - EĞİTİM KATILIM TUTANAĞI", "paragraf": "\u200B\t\t\tYukarıda adı soyadı yazılı çalışan, “Yapı İşlerinde İş Sağlığı ve Güvenliği Yönetmeliği Ek-4 Madde-2/g” çerçevesinde aşağıda yer alan konulardaki eğitim programına başarıyla tamamlayarak bu eğitim belgesini almaya hak kazanmıştır.", "maddeler": ["Yükseklik ile ilgili tanımlar, yüksekte çalışmanın kuralları", "Toplu koruma yöntemleri ve kişisel korunma yöntemleri", "Kişisel koruyucu donanımlar ve doğru kullanım şekli", "Yüksekte çalışma ekipmanlarının güvenli kullanımı", "Yüksek düşmeye neden olan faktörler", "Yatay ve dikey yaşam hatlarının kullanımı"] }; }
    if (egitimturint === 3)
    {;egitimicerik = { "baslik": "KİMYASALLARLA GÜVENLİ ÇALIŞMA EĞİTİMİ KATILIM SERTİFİKASI", "katilim": "KİMYASALLARLA GÜVENLİ ÇALIŞMA - EĞİTİM KATILIM TUTANAĞI", "paragraf": "\u200B\t\t\tYukarıda adı soyadı yazılı çalışan, “Kimyasal Maddelerle Çalışmalarda Sağlık ve Güvenlik Önlemleri Hakkında Yönetmelik” 9. madde çerçevesinde aşağıda yer alan konulardaki eğitim programına başarıyla tamamlayarak bu eğitim belgesini almaya hak kazanmıştır.", "maddeler": ["Patlayıcı ortam ve patlamadan korunma tedbirleri", "Kimyasal risk işaretleri ve güvenlik tedbirleri", "Kimyasalların uygun şekilde depolanması", "Malzeme güvenlik bilgi formları", "Toplu koruma yöntemleri ve kişisel korunma yöntemleri"] }; }
    if (egitimturint === 4)
    {egitimicerik = { "baslik": "İŞ KAZASI SONRASI İŞE DÖNÜŞ EĞİTİM SERTİFİKASI", "katilim": "İŞ KAZASI SONRASI İŞE DÖNÜŞ - EĞİTİM KATILIM TUTANAĞI", "paragraf": "\u200B\t\t\tYukarıda adı soyadı yazılı çalışan, “Çalışanların İş Sağlığı ve Güvenliği Eğitimlerinin Usul ve Esasları Hakkında Yönetmelik” 6. madde çerçevesinde aşağıda yer alan konulardaki eğitim programına başarıyla tamamlayarak bu eğitim belgesini almaya hak kazanmıştır.", "maddeler": ["İş kazasının sebepleri", "İş kazasından korunma yöntemleri", "İş kazası ve meslek hastalığından doğan hukuki sonuçlar", "Güvenli çalışma yöntemleri", "Toplu koruma yöntemleri ve kişisel korunma yöntemleri", "Düzeltici ve önleyici faaliyetler hakkında bilgilendirme"] } };
    if (egitimturint === 5)
    {egitimicerik = { "baslik": "KİŞİSEL KORUYUCU DONANIM EĞİTİMİ SERTİFİKASI", "katilim": "KİŞİSEL KORUYUCU DONANIM - EĞİTİM KATILIM TUTANAĞI", "paragraf": "\u200B\t\t\tYukarıda adı soyadı yazılı çalışan, “Kişisel Koruyucu Donanımların İşyerlerinde Kullanılması Hakkında Yönetmelik” 5. madde çerçevesinde aşağıda yer alan konularda uygulamalı eğitim programını başarıyla tamamlayarak bu eğitim belgesini almaya hak kazanmıştır.", "maddeler": ["İş sağlığı ve güvenliği kültürü", "Toplu ve kişisel olarak korunma yöntemleri", "Kişisel koruyucu donanım tip ve çeşitleri", "Kişisel koruyucu donanım hijyeni ve temizliği", "Kişisel koruyucu donanım kullanımı önemi"] } };
    if (egitimturint === 6)
    { bosluk = 50, egitimicerik = { "baslik": "KALDIRMA AKSESUARLARININ GÜVENLİĞİ KULLANIMI EĞİTİMİ SERTİFİKASI", "katilim": "KALDIRMA AKSESUARLARININ GÜVENLİĞİ KULLANIMI - EĞİTİM KATILIM TUTANAĞI", "paragraf": "\u200B\t\t\tYukarıda adı soyadı yazılı çalışan, “İş Ekipmanlarının Kullanımında Sağlık ve Güvenlik Şartları Yönetmeliği” çerçevesinde aşağıda yer alan konulardaki eğitim programına başarıyla tamamlayarak bu eğitim belgesini almaya hak kazanmıştır.", "maddeler": ["Sapanlama temel kuralları", "Sapan çeşitleri ve doğru kullanım", "Kaldırma aksesuarlarının kontrolü ve bakımı", "Güvenli kaldırma uygulamaları", "Etiketleme ve kapasite tespiti"] } };
    if (egitimturint === 7)
    { bosluk = 50, egitimicerik = { "baslik": "YANGIN EĞİTİMİ SERTİFİKASI", "katilim": "YANGIN EĞİTİMİ - EĞİTİM KATILIM TUTANAĞI", "paragraf": "\u200B\t\t\tYukarıda adı soyadı yazılı çalışan, yangınla mücadele ve acil durumlarda güvenli hareket edilmesi kapsamında aşağıda yer alan konulardaki eğitim programını başarıyla tamamlayarak bu eğitim belgesini almaya hak kazanmıştır.", "maddeler": ["Yangının temel prensipleri ve yangın türleri", "Yangının çıkış nedenleri ve alınması gereken önleyici tedbirler", "Yangın söndürme cihazlarının türleri ve kullanım şekli", "Acil çıkış yolları, kaçış güzergâhları ve toplanma yeri", "Acil durum numaraları ve iletişim yöntemleri", "Yangın söndürme, kurtarma, koruma ve ilk yardım ekiplerinin görevleri"] } };
    if (egitimturint === 8)
    { bosluk = 50, egitimicerik = { "baslik": "GÜRÜLTÜLÜ ORTAMDA GÜVENLİ ÇALIŞMA EĞİTİMİ KATILIM SERTİFİKASI", "katilim": "GÜRÜLTÜLÜ ORTAMDA GÜVENLİ ÇALIŞMA - EĞİTİM KATILIM TUTANAĞI", "paragraf": "\u200B\t\t\tYukarıda adı soyadı yazılı çalışan, “Çalışanların Gürültü ile İlgili Risklerden Korunmalarına Dair Yönetmelik” 11. maddesi çerçevesinde aşağıda yer alan konulardaki eğitim programını başarıyla tamamlayarak bu eğitim belgesini almaya hak kazanmıştır.", "maddeler": ["Gürültüden kaynaklanabilecek riskler", "Gürültüye karşı alınan koruyucu ve önleyici tedbirler", "Maruziyet sınır değerleri ve maruziyet eylem değerleri", "Gürültü ölçüm sonuçlarının değerlendirilmesi ve önemi", "Kulak koruyucularının doğru seçimi ve kullanımı", "Gürültüye bağlı işitme kaybı belirtileri, sağlık gözetimi ve güvenli çalışma uygulamaları"] } };
    let konu = egitimicerik.maddeler.join(', ');
    function createParticipantTable(katilimCalisanlari, baslangicNo)
    {
        let tableBody = [];
        tableBody.push(...digerkatilimustbilgi(isyeriismi, tarih, egitimyeri, egitimtsaat, konu, egitimicerik.katilim));
        for (let i = 0; i < katilimCalisanlari.length; i++) {
            const calisan = katilimCalisanlari[i];
            tableBody.push([
                { text: (baslangicNo + i).toString(), alignment: 'center', fontSize: 10, margin: [0, 11, 0, 11] },
                { text: calisan.a || '', alignment: 'left', fontSize: 10, margin: [0, 11, 0, 11] },
                { text: calisan.u || '', alignment: 'left', fontSize: 10, margin: [0, 11, 0, 11] },
                { text: '' }
            ]);
        }
        tableBody.push(
            [
                { text: uzmanad, alignment: 'center', fontSize: 10, bold: true, colSpan: 2, margin: [0, 0] },
                { text: '' },
                { text: hekimad, alignment: 'center', fontSize: 10, bold: true, colSpan: 2, margin: [0, 0] },
                { text: '' },
            ],
            [
                { text: 'İş Güvenliği Uzmanı - Belge No: ' + uzmanno, alignment: 'center', fontSize: 10, colSpan: 2, margin: [0, 0] },
                { text: '' },
                { text: 'İşyeri Hekimi - Belge No: ' + hekimno, alignment: 'center', fontSize: 10, colSpan: 2, margin: [0, 0] },
                { text: '' },
            ],
            [
                { text: '', colSpan: 2, margin: [25, 25] },
                { text: '' },
                { text: '', colSpan: 2, margin: [25, 25] },
                { text: '' },
            ]
        );
        return {
            table: {
                widths: [25, "*", "auto", 100],
                body: tableBody
            },
        };
    }
    const chunkSize = 13;
    if (ayriKatilimListesi)
    {
        for (let i = 0; i < seciliCalisanlar.length; i++)
        {
            const tekKatilimciListesi = [seciliCalisanlar[i]].concat(Array.from({ length: bossatir }, () => ({ a: "", u: "" })));
            katilimlistesi.content.push(createParticipantTable(tekKatilimciListesi, 1));
            if (i < seciliCalisanlar.length - 1)
            {
                katilimlistesi.content.push({ text: '', pageBreak: 'after' });
            }
        }
    }
    else
    {
        for (let i = 0; i < calisanliste.length; i += chunkSize)
        {
            const endIndex = Math.min(i + chunkSize, calisanliste.length);
            katilimlistesi.content.push(createParticipantTable(calisanliste.slice(i, endIndex), i + 1));
            if (endIndex < calisanliste.length)
            {
                katilimlistesi.content.push({ text: '', pageBreak: 'after' });
            }
        }
    }
    pdfMake.createPdf(katilimlistesi).getBlob(function (blob) { saveAs(blob, 'Katılım Listesi.pdf');});
}

function digeregitimkatilimlisteayrioku()
{
    const settings = jsoncevir(store.get("settings"));
    if (!settings || typeof settings !== "object" || Array.isArray(settings)) return "0";
    const egitim = Array.isArray(settings.k) && settings.k.length > 0 ? settings.k[0] : null;
    if (!egitim || typeof egitim !== "object") return "0";
    return String(egitim.b ?? "0");
}

function digeregitimsertifikaseklioku()
{
    const settings = jsoncevir(store.get("settings"));
    if (!settings || typeof settings !== "object" || Array.isArray(settings)) return "0";
    const egitim = Array.isArray(settings.k) && settings.k.length > 0 ? settings.k[0] : null;
    if (!egitim || typeof egitim !== "object") return "0";
    return String(egitim.a ?? "0");
}

function digerkatilimustbilgi(i, t, e, s, k, bas)
{
    return [
        [{ text: bas, colSpan: 4, alignment: 'center', fontSize: 11, bold: true, margin: [2, 2] }, '', '', ''],
        [{ text: `İşyeri Unvanı: ${i}`, colSpan: 4, alignment: 'left', fontSize: 10, margin: [2, 2] }, '', '', ''],
        [{ colSpan: 4, alignment: 'left', fontSize: 10, margin: [2, 2], text: [{ text: `Eğitim Tarihi: ${t}\t\t\t\tEğitim Şekli: ${e}\t\t\t\tSüresi: ${s}` }] }, '', '', ''],
        [{ text: 'EĞİTİM KONULARI', colSpan: 4, alignment: 'center', fontSize: 11, bold: true, margin: [2, 2] }, '', '', ''],
        [{ text: k, colSpan: 4, alignment: 'justify', fontSize: 10, margin: [0, 5] }, '', '', ''],
        [{ text: 'Sıra', alignment: 'center', fontSize: 10, margin: [1, 1], bold: true }, { text: 'Ad Soyad', alignment: 'center', fontSize: 10, margin: [1, 1], bold: true }, { text: 'Unvan', alignment: 'center', fontSize: 10, margin: [1, 1], bold: true }, { text: 'İmza', alignment: 'center', fontSize: 10, margin: [1, 1], bold: true }]
    ];
}

function genelucluimzatablo(a,b,c,d,e){return{table:{widths:[47,207,207,207,47],body:[["",{text:a,alignment:"center",fontSize:11,bold:!0},{text:b,alignment:"center",fontSize:11,bold:!0},{text:c,alignment:"center",fontSize:11,bold:!0},""],["",{text:"İş Güvenliği Uzmanı",alignment:"center",fontSize:11},{text:isverenunvanioku(),alignment:"center",fontSize:11},{text:"İşyeri Hekimi",alignment:"center",fontSize:11},""],["",{text:"Belge No: "+d,alignment:"center",fontSize:11},"",{text:"Belge No: "+e,alignment:"center",fontSize:11},""]]},layout:"noBorders"}}
