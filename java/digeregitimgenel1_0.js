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
    if (/^[1-9]$/.test(egitimId))
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
    const egitimtur = new Map([[0,"Lütfen Seçiniz"],[1,"İş Ekipmanı Eğitimi"],[2,"Yüksekte Çalışma Eğitimi"],[3,"Kimyasal Eğitimi"],[4,"İş Kazası Eğitimi"],[5,"KKD Eğitimi"],[6,"Kaldırma Aksesuarı"],[7,"Yangın Eğitimi"],[8,"Gürültülü Ortamda Güvenli Çalışma Eğitimi"],[9,"İSG Kurul Üye Eğitimi"]]);
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
    if (egitimturint === 9)
    { bosluk = 30; egitimicerik = {"baslik": "İSG KURUL ÜYE EĞİTİMİ KATILIM SERTİFİKASI", "katilim": "İSG KURUL ÜYE EĞİTİMİ - EĞİTİM KATILIM TUTANAĞI", "paragraf": "​\t\t\tYukarıda adı soyadı yazılı katılımcı, iş sağlığı ve güvenliği kurul üyelerine yönelik aşağıda yer alan konulardaki eğitim programını tamamlayarak bu eğitim belgesini almaya hak kazanmıştır.", "maddeler": ["Kurulun görev ve yetkileri", "İletişim teknikleri", "İş sağlığı ve güvenliği konularında ulusal mevzuat ve standartlar", "Sıkça rastlanan iş kazaları ve tehlikeli vakaların nedenleri", "İş hijyeninin temel ilkeleri", "Risk değerlendirmesi ve Acil durum önlemleri", "Meslek hastalıkları", "İşyerlerine ait özel riskler"]}; }
    const tickSvgResponse = await fetch('https://mehmetceranx12.github.io/isgevraknode/svg/tick.svg');
    if (!tickSvgResponse.ok) { throw new Error('Tik ikonu yüklenemedi.'); }
    const tickSvg = await tickSvgResponse.text();
const docDefinition = {
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
            svg: tickSvg,
            width: 12,
            height: 12,
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
    (sertifikaSekli === 1 ? sertifikakirmizi : sertifikalacivert)(docDefinition);
    const blob = await pdfMake.createPdf(docDefinition).getBlob();
    saveAs(blob, egitimturdosya + '.pdf');
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
    if (egitimturint === 9)
    { egitimicerik = {"baslik": "İSG KURUL ÜYE EĞİTİMİ KATILIM SERTİFİKASI", "katilim": "İSG KURUL ÜYE EĞİTİMİ - EĞİTİM KATILIM TUTANAĞI", "paragraf": "​\t\t\tYukarıda adı soyadı yazılı katılımcı, iş sağlığı ve güvenliği kurul üyelerine yönelik aşağıda yer alan konulardaki eğitim programını tamamlayarak bu eğitim belgesini almaya hak kazanmıştır.", "maddeler": ["Kurulun görev ve yetkileri", "İletişim teknikleri", "İş sağlığı ve güvenliği konularında ulusal mevzuat ve standartlar", "Sıkça rastlanan iş kazaları ve tehlikeli vakaların nedenleri", "İş hijyeninin temel ilkeleri", "Risk değerlendirmesi ve Acil durum önlemleri", "Meslek hastalıkları", "İşyerlerine ait özel riskler"]}; }
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
    const blob = await pdfMake.createPdf(katilimlistesi).getBlob();
    saveAs(blob, 'Katılım Listesi.pdf');
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
