function tatbikatekipjson(calisanjson)
{
    const ekipKodlari = { 0: "Görevli Değil", 1: "İlkyardım Ekibi - Ekip Başı", 2: "İlkyardım Ekibi - Ekip Personeli", 3: "Söndürme Ekibi - Ekip Başı", 4: "Söndürme Ekibi - Ekip Personeli", 5: "Koruma Ekibi - Ekip Başı + Koordinasyon", 6: "Koruma Ekibi - Ekip Personeli + Koordinasyon", 7: "Koruma Ekibi - Ekip Personeli", 8: "Kurtarma Ekibi - Ekip Başı", 9: "Kurtarma Ekibi - Ekip Personeli", 10: "Destek Elemanı" };
    calisanjson = jsoncevir(calisanjson);
    const sonuc = [];
    $.each(calisanjson, function (index, item) {
        if (item.a && item.a !== 0)
        {
            sonuc.push
            ({
                x: item.x,
                y: item.y,
                ekipgorev: ekipKodlari[item.a] || "Tanımsız",
                ekipkod: item.a
            });
        }
    });
    return sonuc;
}
function tatbikatimza(uzman, uzmanno, isveren) { return new docx.Table({ width: { size: 100, type: docx.WidthType.PERCENTAGE }, borders: { top: { style: docx.BorderStyle.NONE, size: 0, color: "FFFFFF" }, bottom: { style: docx.BorderStyle.NONE, size: 0, color: "FFFFFF" }, left: { style: docx.BorderStyle.NONE, size: 0, color: "FFFFFF" }, right: { style: docx.BorderStyle.NONE, size: 0, color: "FFFFFF" }, insideHorizontal: { style: docx.BorderStyle.NONE, size: 0, color: "FFFFFF" }, insideVertical: { style: docx.BorderStyle.NONE, size: 0, color: "FFFFFF" } }, rows: [new docx.TableRow({ children: [new docx.TableCell({ width: { size: 50, type: docx.WidthType.PERCENTAGE }, children: [new docx.Paragraph({ alignment: docx.AlignmentType.CENTER, children: [new docx.TextRun({ text: uzman, font: "Calibri", size: 22, bold: !0 })] })] }), new docx.TableCell({ width: { size: 50, type: docx.WidthType.PERCENTAGE }, children: [new docx.Paragraph({ alignment: docx.AlignmentType.CENTER, children: [new docx.TextRun({ text: isveren, font: "Calibri", size: 22, bold: !0 })] })] })] }), new docx.TableRow({ children: [new docx.TableCell({ children: [new docx.Paragraph({ alignment: docx.AlignmentType.CENTER, children: [new docx.TextRun({ text: "Tatbikatı Yürüten - İş Güvenliği Uzmanı", font: "Calibri", size: 22 })] })] }), new docx.TableCell({ children: [new docx.Paragraph({ alignment: docx.AlignmentType.CENTER, children: [new docx.TextRun({ text: isverenunvanioku(), font: "Calibri", size: 22 })] })] })] }), new docx.TableRow({ children: [new docx.TableCell({ children: [new docx.Paragraph({ alignment: docx.AlignmentType.CENTER, children: [new docx.TextRun({ text: "Belge No: " + uzmanno, font: "Calibri", size: 22 })] })] }), new docx.TableCell({ children: [new docx.Paragraph({ alignment: docx.AlignmentType.CENTER, children: [new docx.TextRun({ text: "Tatbikatı Onaylayan", font: "Calibri", size: 22 })] })] })] })] }) }

function aciltatbikatload2()
{
    var tatbikatkriter = [{konu:"Yangın algılamasının ardından tüm çalışanlara yangın ihbarı, alarm butonuna basılarak uyarıldı mı?"},{konu:"Yangın senaryosuna uygun şekilde sözlü uyarı prosedürü uygulanarak 'Yangın Var' diye bağırılarak çalışanlar bilgilendirildi mi?"},{konu:"Senaryo gereği acil çağrı merkezi 112’ye bildirim uygun şekilde yapıldı mı?"},{konu:"Tahliye sürecinde acil çıkış yollarında engel, tıkanma veya erişim zafiyeti oluşturacak herhangi bir durum tespit edildi mi?"},{konu:"Tüm çalışanların belirlenen tahliye planına uygun olarak toplanma bölgesine güvenli şekilde ulaşması sağlandı mı?"},{konu:"Toplanma bölgesine yönlendirme ve tahliye hızı, tahliye planında belirtilen süre ve güvenlik kriterlerine uygun şekilde gerçekleştirildi mi?"},{konu:"Senaryo gereği oluşturulan kontrollü yangına, söndürme ekibi müdahalesi eğitimlerde belirlenen tekniklere uygun ve etkili şekilde gerçekleştirildi mi?"},{konu:"Yangın söndürme ekipmanlarına erişim, acil durumda gecikmeye neden olmayacak şekilde sağlandı mı?"},{konu:"Yangın söndürme ekipmanlarının kullanılabilirliği ve işlevselliği müdahale sırasında teknik açıdan yeterli bulundu mu?"},{konu:"Toplanma bölgesi, yönlendirme işaretleri ve acil durum talimatlarına uygun şekilde tüm çalışanlar tarafından hızlı ve doğru biçimde tespit edilebildi mi?"},{konu:"Senaryo gereği ilkyardım ekibi, kazazedeye müdahaleyi ilkyardım standartlarına uygun şekilde gerçekleştirdi mi?"},{konu:"Senaryo gereği söndürme ekibi yangını, yangın söndürme kurallarına uygun şekilde müdahale etti mi?"},{konu:"Senaryo kapsamında koruma ekibi, bina giriş ve çıkışlarını güvenliğini uygun şekilde sağlayarak alan kontrolünü gerçekleştirdi mi?"},{konu:"Senaryo gereği kurtarma ekibi, çalışanların tahliyesini uygun şekilde gerçekleştirdi mi?"}];
    var cikarilansonuclar = [{konu:"Değerlendirme kriterleri göz önünde bulundurularak yapılan incelemeler sonucunda, yangın tatbikatının başarılı bir şekilde gerçekleştirildiği tespit edilmiştir."},{konu:"Acil durum planı ile bu kapsamda verilen eğitimlerin uygulamada etkin biçimde karşılık bulduğu gözlemlenmiştir."},{konu:"Çalışanların acil çıkış yollarını hızlı ve doğru şekilde kullanabildiği, yönlendirme işaretlerinin yeterli düzeyde fark edilebilir olduğu değerlendirilmiştir."},{konu:"Acil durum tatbikatı, acil durumlara hazırlık seviyesinin iyi olduğunu göstermiş ve süreç boyunca herhangi bir aksaklık tespit edilmemiştir."},{konu:"112 Acil çağrı merkezi ile iletişimin sağlıklı bir şekilde kurulduğu gözlemlenmiştir."},{konu:"Çalışanlar tarafından toplanma alanının bilindiği ve acil bir durum anında bu alana toplanabildikleri gözlemlenmiştir."},{konu:"Kurtarma ekibinin yangına dayanıklı kişisel koruyucu donanımlarını eksiksiz şekilde kullandığı görülmüştür."},{konu:"Tatbikat kapsamında işyerinde bulunan sedyenin kullanılmasıyla çalışanların tahliye ve taşıma süreçlerine ilişkin pratik deneyim kazandığı anlaşılmıştır."}];
    $('#tatbikatkriter').DataTable({
        data: tatbikatkriter,
        dom: 't',
        pageLength: -1,
        columns:
            [
                { data: null, orderable: false, render: DataTable.render.select(), width: "80px" },
                { data: "konu", orderable: false,  title: "Acil Durum Değerlendirme Tatbikat Kriterleri" },
                { data: null, title: "Uygunluk", orderable: false, width: "200px", render: function () { return '<select class="cssdropdown100" style="text-align:center"><option value="1">Uygun</option><option value="0">Uygun Değil</option></select>'; } }
            ],
        select: { style: "multi", selector: "td:first-child" },
        order: [],
        createdRow: function (r) { $(r).find("td").eq(1).css("text-align", "left"); },
        headerCallback: function (thead) { $(thead).find('th').css('text-align', 'center'); },
    });
    $('#tatbikatkriter').DataTable().rows().select();
    $('#cikarilansonuclar').DataTable
    ({
        data: cikarilansonuclar,
        dom: 't',
        pageLength: -1,
        columns:
            [
                { data: null, orderable: false, render: DataTable.render.select(), width: "80px" },
                { data: "konu", title: "Acil Durum Tatbikatından Çıkarılan Sonuçlar", orderable: false },
            ],
        select: { style: "multi", selector: "td:first-child" },
        order: [],
        createdRow: function (r) { $(r).find("td").eq(1).css("text-align", "left"); },
        headerCallback: function (thead) { $(thead).find('th').css('text-align', 'center'); },
    });
    $('#cikarilansonuclar').DataTable().rows([0,1,2,3,4,5]).select();
}
function acildurumtatbikatdevam2()
{
    try
    {
        let toplamcalisan = $('#toplamcalisan').val().trim() || "";
        let baslangic = $('#baslangic').val() || "";
        let nokta = $('#nokta').val().trim() || "";
        let katilan = $('#katilan').val().trim() || "";
        let bitis = $('#bitis').val() || "";
        let sayim = $('#sayim').val().trim() || "";
        store.set("tatbikattoplamcalisan", toplamcalisan);
        store.set("tatbikatbaslangic", baslangic);
        store.set("tatbikatnokta", nokta);
        store.set("tatbikatkatilan", katilan);
        store.set("tatbikatbitis", bitis);
        store.set("tatbikatsayim", sayim);
        var tablo = $('#tatbikatkriter').DataTable();
        var selected = tablo.rows({ selected: true }).count();
        if (selected < 1)
        {
            alertify.error("Lütfen en az bir kriter seçiniz");
            return false;
        }
        var sonuc = [];
        tablo.rows({ selected: true }).every(function ()
        {
            var d = this.data();
            var tr = this.node();
            var uygunluk = $(tr).find("select option:selected").text();
            sonuc.push({ konu: d.konu, uygunluk: uygunluk });
        });
        store.set("tatbikatkriterleri", sonuc);
        var sonuctablo = $('#cikarilansonuclar').DataTable();
        selected = sonuctablo.rows({ selected: true }).count();
        if (selected < 1)
        {
            alertify.error("Lütfen en az bir sonuç seçiniz");
            return false;
        }
        sonuc = [];
        sonuctablo.rows({ selected: true }).every(function ()
        {
            var d = this.data();
            sonuc.push(d.konu.trim());
        });
        var sonucparagraf = sonuc.join(" ");
        store.set("sonucparagraf", sonucparagraf);
        store.set("dosyaciktitipi", "8");
        window.location.href = "/dosyacikti";
        return true;
    }
    catch (err)
    {
        alertify.error("Beklenmedik bir hata oluştu");
        return false;
    }
}
function acildurumtatbikatdevam1()
{
    let tarih = $('#tarih').val().trim();
    if (!tarihkontrol(tarih))
    {
        alertify.error("Lütfen geçerli bir tarih giriniz");
        return;
    }
    let tatbikat = Number($('#tatbikat').val());
    if (tatbikat < 1)
    {
        alertify.error("Tatbikat tipini seçiniz");
        return;
    }
    let firmaid = firmasecimoku();
    if (!firmaid)
    {
        alertify.error("Lütfen işyeri seçiniz");
        return;
    }
    store.set("acildurumtatbikattarih", tarih);
    store.set("acildurumtatbikattip", tatbikat);
    window.location.href = "/acildurumtatbikati2?id=" + encodeURIComponent(firmaid);
}
function acildurumtatbikattarih(tarih){if(!tarih)return"";const[g,a,y]=tarih.split(".").map(Number);if(!g||!a||!y)return"";const d=new Date(y+1,a-1,g),p=n=>n.toString().padStart(2,"0");return`${p(d.getDate())}.${p(d.getMonth()+1)}.${d.getFullYear()}`}



async function acildurumtatbikatwordyaz()
{
    let tarih = store.get("acildurumtatbikattarih");
    let tatbikat = store.get("acildurumtatbikattip");
    let toplamcalisan = store.get("tatbikattoplamcalisan");
    let baslangic = store.get("tatbikatbaslangic");
    let nokta = store.get("tatbikatnokta");
    let katilan = store.get("tatbikatkatilan");
    let bitis = store.get("tatbikatbitis");
    let sayim = store.get("tatbikatsayim");
    let tatbikatekip = tatbikatekipjson(store.get("tatbikatcalisanjson"));
    let tatbikatkritericerik = jsoncevir(store.get("tatbikatkriterleri"));
    let isyeri = jsoncevir(store.get("xjsonfirma"));
    let isyeriunvan = isyeri.fi;
    let isyeriadres = isyeri.ad;
    let isveren = isyeri.is;
    let uzmanad = store.get("uzmanad");
    let uzmanno = store.get("uzmanno");
    let geciciadres = isyeriadres;
    let cikarilansonuc = store.get("sonucparagraf");
    if (!geciciadres)
    {
        geciciadres = ".................................................................................................";
    }
    let tatbikatad = "";
    if (tatbikat === 1)
    {
        tatbikatad = "Yangın Tatbikatı";
    }
    let tehlikesinifimap = { 1: "Az Tehlikeli", 2: "Tehlikeli", 3: "Çok Tehlikeli" };
    let tehlikesinifi = parseInt(isyeri.ts);
    tehlikesinifi = tehlikesinifimap[tehlikesinifi];
    const { Document, Packer, TextRun, Paragraph, Table, TableRow, TableCell, WidthType, BorderStyle, AlignmentType, HeightRule, VerticalAlign } = docx;
    let tatbikatbilgi1 = [];
    tatbikatbilgi1.push(new Paragraph({ text: `Tarih: ` + tarih, spacing: { after: 100 }, style: "Sagayasli" }));
    tatbikatbilgi1.push(new Paragraph({ text: `İŞYERLERİNDE ACİL DURUMLAR HAKKINDA YÖNETMELİK`, spacing: { after: 100 }, style: "Kalin" }));
    tatbikatbilgi1.push(new Paragraph({ text: `EK-2 / ACİL DURUM TATBİKAT FORMU`, spacing: { after: 100 }, style: "Kalin" }));
    tatbikatbilgi1.push(new Paragraph({ text: `\t1.1-Tatbikat Bilgileri`, spacing: { after: 100 }, style: "Kalinsol" }));
    tatbikatbilgi1.push(new Paragraph({ text: `\tİşyeri Unvanı: ` + isyeriunvan, spacing: { after: 100 }, style: "Normal" }));
    tatbikatbilgi1.push(new Paragraph({ text: `\tİşyeri Adresi: ` + isyeriadres, spacing: { after: 100 }, style: "Normal" }));
    tatbikatbilgi1.push(new Paragraph({ text: `\tTehlike Sınıfı: ` + tehlikesinifi, spacing: { after: 100 }, style: "Normal" }));
    tatbikatbilgi1.push(new Paragraph({ text: `\tTatbikat Ad: ` + tatbikatad, spacing: { after: 100 }, style: "Normal" }));
    tatbikatbilgi1.push(new Paragraph({ text: `\tTatbikat Tarihi: ` + tarih, spacing: { after: 100 }, style: "Normal" }));
    tatbikatbilgi1.push(new Paragraph({ text: `\tTatbikat Türü: ` + tatbikatad, spacing: { after: 100 }, style: "Normal" }));
    tatbikatbilgi1.push(new Paragraph({ text: `\tToplam Çalışan Sayısı: ` + toplamcalisan, spacing: { after: 100 }, style: "Normal" }));
    tatbikatbilgi1.push(new Paragraph({ text: `\tTatbikata Katılan Kişi Sayısı: ` + katilan, spacing: { after: 100 }, style: "Normal" }));
    tatbikatbilgi1.push(new Paragraph({ text: `\tToplanma Yerindeki Sayım Sonucu: ` + sayim, spacing: { after: 100 }, style: "Normal" }));
    tatbikatbilgi1.push(new Paragraph({ text: `\tTatbikat Başlangıç Saati: ` + baslangic, spacing: { after: 100 }, style: "Normal" }));
    tatbikatbilgi1.push(new Paragraph({ text: `\tTatbikat Bitiş Saati: ` + bitis, spacing: { after: 100 }, style: "Normal" }));
    tatbikatbilgi1.push(new Paragraph({ text: `\tTatbikat Konumu: ` + nokta, spacing: { after: 100 }, style: "Normal" }));
    tatbikatbilgi1.push(new Paragraph({ text: `\t1.2-Tatbikatın Amacı`, spacing: { after: 100 }, style: "Kalinsol" }));
    tatbikatbilgi1.push(new Paragraph({ text: `\tÇalışanlara işyerindeki olası yangın tehlikesi konusunda farkındalık kazandırmak, yangın anında panik yapmadan soğukkanlılıkla hareket etmeyi öğretmek.`, spacing: { after: 100 }, style: "Normal" }));
    tatbikatbilgi1.push(new Paragraph({ text: `\tYangın söndürme ve ilk yardım ekipmanlarının yerini ve nasıl kullanılacağını uygulamalı olarak göstermek.`, spacing: { after: 100 }, style: "Normal" }));
    tatbikatbilgi1.push(new Paragraph({ text: `\tYangın anında hangi ekiplerin ne görev yapacağını belirleyerek, hızlı ve koordineli müdahale alışkanlığını kazandırmak.`, spacing: { after: 100 }, style: "Normal" }));
    tatbikatbilgi1.push(new Paragraph({ text: `\tTahliye prosedürlerini tekrar ederek toplu hareket kabiliyetini artırmak.`, spacing: { after: 100 }, style: "Normal" }));
    tatbikatbilgi1.push(new Paragraph({ text: `\tTatbikat sonrası değerlendirme yaparak, plan ve uygulamada varsa eksiklikleri tespit etmek ve giderilmesi için önlemler almak.`, spacing: { after: 100 }, style: "Normal" }));
    tatbikatbilgi1.push(new Paragraph({ text: `\t1.3-Tatbikat Öncesi Hazırlık`, spacing: { after: 100 }, style: "Kalinsol" }));
    tatbikatbilgi1.push(new Paragraph({ text: `\tTüm katılımcılara (özellikle acil durum ekiplerine) tatbikat planı ve bu plandaki görev dağılımları önceden duyurulur.`, spacing: { after: 100 }, style: "Normal" }));
    tatbikatbilgi1.push(new Paragraph({ text: `\tAcil çıkış yolları, toplanma alanı ve yangın söndürme ekipmanlarının yerleri tüm çalışanlara gösterilir. Acil durum krokisinde belirtilen yol ve toplanma alanına uyulur.`, spacing: { after: 100 }, style: "Normal" }));
    tatbikatbilgi1.push(new Paragraph({ text: `\tSenaryo gereği bir çalışan 112 Acil Çağrı Merkezi’ni arayacak ancak itfaiye/ambulans gerçek olarak yönlendirilmeyecektir.`, spacing: { after: 100 }, style: "Normal" }));
    tatbikatbilgi1.push(new Paragraph({ text: `\t1.4-Acil Durum Ekibi ve Görevleri`, spacing: { after: 100 }, style: "Kalinsol" }));
    tatbikatbilgi1.push(new Paragraph({ text: `\tYangın Söndürme Ekibi: Yangın söndürme ekipmanı (yangın tüpü, hortum vb.) kullanarak yangına ilk müdahaleyi senaryo gereği yapar.`, spacing: { after: 100 }, style: "Normal" }));
    tatbikatbilgi1.push(new Paragraph({ text: `\tİlkyardım Ekibi: Yangın esnasında dumandan etkilenen veya yaralanan kişilere acil ilk yardım uygular. Gerekirse kurtarma ekibine yardım ederek yaralıları güvenli bölgeye taşır. İlkyardım ekibi, yalnızca ilkyardım sertifikasına sahip olan çalışanlardan oluşturulmuştur.`, spacing: { after: 100 }, style: "Normal" }));
    tatbikatbilgi1.push(new Paragraph({ text: `\tKoruma Ekibi: Tatbikat alanını güvenlik altına alır; yangın mahalline itfaiye, ambulans gibi resmi görevliler dışındaki kişilerin girişini engeller. Elektrik ve doğalgaz vanalarını keserek ikincil riskleri önler.`, spacing: { after: 100 }, style: "Normal" }));
    tatbikatbilgi1.push(new Paragraph({ text: `\tKurtarma Ekibi: Tahliye edilemeyen, acil yardıma ihtiyacı olan veya engelli çalışanları güvenli şekilde tahliye eder.`, spacing: { after: 100 }, style: "Normal" }));
    tatbikatbilgi1.push(new Paragraph({ text: `\tDiğer Çalışanlar: Tatbikat senaryosu başladığında, bilgilendirilen tahliye prosedürüne uygun şekilde tahliye edilir. Toplanma alanına hızla ulaşır ve sayımda yerini alır. Görevli olmayan çalışanlar panik yapmadan görevli ekiplerin yönlendirmelerini izler.`, spacing: { after: 100 }, style: "Normal" }));
    let tatbikatbilgi2 = [];
    tatbikatbilgi2.push(new Paragraph({ text: ``, spacing: { after: 100 }, style: "Normal" }));
    tatbikatbilgi2.push(new Paragraph({ text: `\t1.5-Tatbikat Senaryosu ve Uygulama Planı`, spacing: { after: 100 }, style: "Kalinsol" }));
    tatbikatbilgi2.push(new Paragraph({ text: `\t1.1 bölümünde belirtilen tatbikat tarihi/saatte ve tatbikat konumunda senaryo gereği yangın çıkmıştır. Acil durum planına uygun hareket şu şekilde gerçekleştirilir:`, spacing: { after: 100 }, style: "Normal" }));
    tatbikatbilgi2.push(new Paragraph({ text: `\tYangını fark eden herhangi bir çalışan alarm düğmesine basacak ve “Yangın var!” diye sesli uyarı verecektir. Bu esnada çalışanlar panik yapmadan soğukkanlılığı koruyacaktır. Koruma ekibi doğalgaz ve elektrik ana vanalarını kapatacaktır.`, spacing: { after: 100 }, style: "Normal" }));
    tatbikatbilgi2.push(new Paragraph({ text: `\t112 Aranması: Yangını tespit eden çalışan, senaryoya göre derhal 112 Acil Çağrı Merkezi’ni arayacak ve açık adresi eksiksiz aktaracaktır. Arama sırasında kısa, net bilgi verilecektir. Adres: ` + geciciadres, spacing: { after: 100 }, style: "Normal" }));
    tatbikatbilgi2.push(new Paragraph({ text: `\tTahliye: Acil durum ekibinde görevli olmayan tüm personel hızla belirlenen acil çıkış yollarını kullanarak tahliye olacak, toplanma alanına geçecek ve sıra ile sayımları yapılacaktır. Tahliye sırasında koridor ve kapılar açık tutulacak, merdivenler acil durum yönlendirme işaretlerine göre kullanılacaktır. Acil durum krokisine uygun şekilde tahliye sağlanacaktır.`, spacing: { after: 100 }, style: "Normal" }));
    tatbikatbilgi2.push(new Paragraph({ text: `\tYangın Söndürme Müdahalesi: Yangın söndürme ekibi hızla yangın bölgesine intikal edip, uygun yangın tüpleri veya hortumlarla müdahaleye başlayacaktır. Ekip başı, müdahaleyi planlayarak yangının kontrol altına alınmasını sağlayacak, senaryo gereği itfaiye olay yerine geldiğinde itfaiye ekibine yardımcı olacaktır.`, spacing: { after: 100 }, style: "Normal" }));
    tatbikatbilgi2.push(new Paragraph({ text: `\tİlkyardım Müdahalesi: İlkyardım ekibi, duman nedeniyle etkilenmiş, yaralanmış veya kendini kötü hisseden personele ulaşacak; gerekli sağlık müdahalesini yaparak yaralılara ilk yardım uygulayacaktır. Senaryo gereği ambulans gelene kadar ilk müdahale devam edecektir.`, spacing: { after: 100 }, style: "Normal" }));
    tatbikatbilgi2.push(new Paragraph({ text: `\tKoruma ve Güvenlik: Yangın bölgesine itfaiye, polis ve ambulans dışındaki kimsenin girmesine izin vermeyecektir. Ekip, olay yeri güvenliğini sağlayarak herhangi bir müdahale veya can kaybı riskini en aza indirgeyecektir.`, spacing: { after: 100 }, style: "Normal" }));
    tatbikatbilgi2.push(new Paragraph({ text: `\tKurtarma: Kurtarma ekibi, acil durum esnasında içeride mahsur kalan veya hareket etmekte güçlük çeken kimseleri bularak onları acil çıkış noktalarına yönlendirecek veya güvenli şekilde tahliye edecektir.`, spacing: { after: 100 }, style: "Normal" }));
    tatbikatbilgi2.push(new Paragraph({ text: `\t1.6-Tatbikat Sonrası Değerlendirme`, spacing: { after: 100 }, style: "Kalinsol" }));
    let tatbikatsonuc = [];
    tatbikatsonuc.push(new Paragraph({ text: ``, spacing: { after: 100 }, style: "Normal" }));
    tatbikatsonuc.push(new Paragraph({ text: `\t1.7-Çıkarılan Sonuçlar`, spacing: { after: 100 }, style: "Kalinsol" }));
    tatbikatsonuc.push(new Paragraph({ text: `\t` + cikarilansonuc, spacing: { after: 100 }, style: "Normal" }));
    const tatbikatekiptablo = [];
    tatbikatekiptablo.push(new TableRow
    ({
        height: { value: 400, rule: HeightRule.EXACT },
        children:
            [
                new TableCell({ verticalAlign: VerticalAlign.CENTER, width: { size: 5, type: WidthType.PERCENTAGE }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "No", bold: true, size: 22, font: "Calibri" })] })] }),
                new TableCell({ verticalAlign: VerticalAlign.CENTER, width: { size: 48, type: WidthType.PERCENTAGE }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Ad Soyad", bold: true, size: 22, font: "Calibri" })] })] }),
                new TableCell({ verticalAlign: VerticalAlign.CENTER, width: { size: 47, type: WidthType.PERCENTAGE }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Acil Durum Ekip Görevleri", bold: true, size: 22, font: "Calibri" })] })] }),
            ]
        })
    );
    tatbikatekip.forEach((item, index) =>
    {
        tatbikatekiptablo.push(new TableRow
        ({
            height: { value: 400, rule: HeightRule.EXACT },
            children:
            [
                new TableCell({ verticalAlign: VerticalAlign.CENTER, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: String(index + 1), font: { name: "Calibri" }, size: 22 })] })] }),
                new TableCell({ verticalAlign: VerticalAlign.CENTER, margins: { left: 100 },children: [new Paragraph({ alignment: AlignmentType.LEFT, children: [new TextRun({ text: item.x, font: { name: "Calibri" }, size: 22 })] })] }),
                new TableCell({ verticalAlign: VerticalAlign.CENTER, margins: { left: 100 },children: [new Paragraph({ alignment: AlignmentType.LEFT, children: [new TextRun({ text: item.ekipgorev, font: { name: "Calibri" }, size: 22 })] })] }),
            ]
        }));
    });
    const tatbikatkriter = [];
    tatbikatkriter.push(new TableRow
        ({
            height: { value: 400, rule: HeightRule.EXACT },
            children:
                [
                    new TableCell({ verticalAlign: VerticalAlign.CENTER, width: { size: 5, type: WidthType.PERCENTAGE }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "No", bold: true, size: 22, font: "Calibri" })] })] }),
                    new TableCell({ verticalAlign: VerticalAlign.CENTER, width: { size: 80, type: WidthType.PERCENTAGE }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Tatbikat Değerlendirme Kriter,", bold: true, size: 22, font: "Calibri" })] })] }),
                    new TableCell({ verticalAlign: VerticalAlign.CENTER, width: { size: 15, type: WidthType.PERCENTAGE }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Uygunluk", bold: true, size: 22, font: "Calibri" })] })] }),
                ]
        })
    );
    tatbikatkritericerik.forEach((item, index) => {
        tatbikatkriter.push(new TableRow
            ({
                height: { value: 600, rule: HeightRule.EXACT },
                children:
                    [
                        new TableCell({ verticalAlign: VerticalAlign.CENTER, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: String(index + 1), font: { name: "Calibri" }, size: 22 })] })] }),
                        new TableCell({ verticalAlign: VerticalAlign.CENTER, margins: { left: 100 }, children: [new Paragraph({ alignment: AlignmentType.LEFT, children: [new TextRun({ text: item.konu, font: { name: "Calibri" }, size: 22 })] })] }),
                        new TableCell({ verticalAlign: VerticalAlign.CENTER, margins: { left: 100 }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: item.uygunluk, font: { name: "Calibri" }, size: 22 })] })] }),
                    ]
            }));
    });
    const doc = new Document({
        styles:
        {
            paragraphStyles:
            [
                { id: "Normal", run: { font: "Calibri", size: 22 }, paragraph: { alignment: AlignmentType.JUSTIFIED } },
                { id: "Kalin", run: { font: "Calibri", size: 22, bold: true }, paragraph: { alignment: AlignmentType.CENTER } },
                { id: "Kalinsol", run: { font: "Calibri", size: 22, bold: true }, paragraph: { alignment: AlignmentType.LEFT } },
                { id: "Sagayasli", run: { font: "Calibri", size: 22 }, paragraph: { alignment: AlignmentType.RIGHT } },
            ]
        },
        sections:
        [
            {
                properties: { page: { margin: { top: 850, right: 850, bottom: 850, left: 850 } } },
                children: [...tatbikatbilgi1, new Table({ width: { size: 100, type: WidthType.PERCENTAGE }, rows: tatbikatekiptablo }), ...tatbikatbilgi2, new Table({ width: { size: 100, type: WidthType.PERCENTAGE }, rows: tatbikatkriter }), ...tatbikatsonuc],
                footers: { default: new docx.Footer({ children: [tatbikatimza(uzmanad, uzmanno, isveren)] }) }
            }
        ]
    });
    const blob = await Packer.toBlob(doc);
    saveAs(blob, "Acil Durum Tatbikatı - " + metinuret(3) + ".docx");
}
async function tatbikatkatilimlistesiyaz()
{
    let tatbikatekip = jsoncevir(store.get("tatbikatcalisanjson"));
    let ekipteolmayanlar = tatbikatekip.filter(x => x.a === 0);
    let ekipteolanlar = tatbikatekip.filter(x => x.a !== 0);
    ekipteolanlar = tatbikatekipjson(ekipteolanlar);
    let tatbikatkatilimlistesijson = [];
    ekipteolanlar.forEach(e => { tatbikatkatilimlistesijson.push({ ad: e.x, ekipgorev: e.ekipgorev});});
    ekipteolmayanlar.forEach(e => { tatbikatkatilimlistesijson.push({ ad: e.x, ekipgorev: e.y});});
    tatbikatkatilimlistesijson.sort((a, b) => { return a.ad.localeCompare(b.ad, 'tr', { sensitivity: 'base' }); });
    const tabloGovdesi =
    [
        [
            { text: 'ACİL DURUM TATBİKAT LİSTESİ', style: 'title', colSpan: 4, alignment: 'center' },
            {}, {}, {}
        ],
        [
            { text: 'Sıra', style: 'tableHeader' },
            { text: 'Ad Soyad', style: 'tableHeader' },
            { text: 'Unvan', style: 'tableHeader' },
            { text: 'İmza', style: 'tableHeader' },
        ],
        ...tatbikatkatilimlistesijson.map((kayit, index) =>
        [
            { text: (index + 1).toString(), style: 'tableCell', alignment: 'center' },
            { text: kayit.ad, style: 'tableCell' },
            { text: kayit.ekipgorev, style: 'tableCell' },
            { text: "", style: 'tableCell', alignment: 'center' },
        ]
    )];
    const belgeTanim =
    {
        pageMargins: [30, 30, 30, 30],
        content:
        [
            {
                table:{headerRows:2,widths:[20,'*','auto',90],body:tabloGovdesi},
                layout: { fillColor: (rowIndex) => (rowIndex === 0 || rowIndex === 1 ? '#eeeeee' : null), paddingTop: (rowIndex) => { return rowIndex > 1 ? 12 : 4; }, paddingBottom: (rowIndex) => { return rowIndex > 1 ? 12 : 4; }, hLineWidth: () => 0.5, vLineWidth: () => 0.5 }
            }
        ],
        styles:
        {
            title: { fontSize: 14, bold: true, alignment: 'center' },
            tableHeader: { bold: true, fontSize: 11, alignment: 'center' },
            tableCell: { fontSize: 10 }
        }
    };
    pdfMake.createPdf(belgeTanim).download('Tatbikat Katılım Listesi - ' + '.pdf');    
}
