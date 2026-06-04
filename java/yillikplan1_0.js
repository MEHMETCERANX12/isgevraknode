function yillikegitimveplan2load()
{
    let json = jsoncevir(store.get("yillikplandata"));
    let konular = json.isgegitim;
    $('#egitimicerik').DataTable
    ({
        data: konular,
        dom: 't',
        pageLength: -1,
        columns:
        [
            {data: null, orderable: false, render: DataTable.render.select(), width: "80px" },
            {data:"konu",title:"İSG Eğitim Konuları",orderable:!1,render:(d,t,r,m)=>t==="display"?`<input name="konuicerik" type="text" class="csstextbox100" value="${d}">`:d}
        ],
        select: { style: "multi", selector: "td:first-child" },
        order: [],
        createdRow: function (r) { $(r).find("td").eq(1).css("text-align", "left"); },
        headerCallback: function (thead) { $(thead).find('th').css('text-align', 'center'); },
    });
    $('#egitimicerik').DataTable().rows([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19]).select();
}

function yillikegitimveplandevam2()
{
    let table = $('#egitimicerik').DataTable();
    let sonuc = [];
    table.rows({ selected: true }).every(function () {
        let tr = this.node();
        let val = $(tr).find('input[name="konuicerik"]').val();
        sonuc.push(val);
    });
    store.set("egitimkonuicerik", sonuc);
    window.location.href = "/yillikegitimveplan3";
}

function yillikegitimveplan5load()
{
    $('#riskdegerlendirme').trigger('change');
    $('#acildurumplani').trigger('change');
    store.set("riskdegerlendirme", "1");
    store.set("acildurumplani", "1");
    $('#riskdegerlendirme').on('change', function ()
    {
        if (this.value === "0")
        {
            $('#riskgizli').show();
            store.set("riskdegerlendirme", "0");
        }
        else
        {
            $('#riskgizli').hide();
            store.set("riskdegerlendirme", "1");
        }
    });

    $('#acildurumplani').on('change', function ()
    {
        if (this.value === "0")
        {
            $('#acildurumgizli').show();
            store.set("acildurumplani", "0");
        }
        else
        {
            $('#acildurumgizli').hide();
            store.set("acildurumplani", "1");
        }
    });
}

async function yillikegitimveplan3load()
{
    let json = jsoncevir(store.get("yillikplandata"));
    let ekipmankontrol = json.ekipmankontrol;
    $('#muhendislikkontrol').DataTable
        ({
            data: ekipmankontrol,
            dom: 't',
            pageLength: -1,
            order: [[2, 'asc']],
            rowGroup: { dataSrc: "grup" },
            columns:
            [
                { data: null, orderable: false, render: DataTable.render.select(), width: "80px" },
                { data: "kontrol", title: "İş Ekipmanı ve Ortam Ölçümleri", orderable: !1, render: (d, t, r, m) => t === "display" ? `<input name="kontroladi" type="text" class="csstextbox100" value="${d}">` : d },
                { data: "grup", visible: false},
                { data: "tur", visible: false},
            ],
            select: { style: "multi", selector: "td:first-child" },
            order: [],
            createdRow: function (r) { $(r).find("td").eq(1).css("text-align", "left"); },
            headerCallback: function (thead) { $(thead).find('th').css('text-align', 'center'); },
    });
}
function yillikegitimveplandevam3()
{
    let table = $('#muhendislikkontrol').DataTable();
    let muhendislikolcum = [];
    let ortamolcum = [];
    table.rows({ selected: true }).every(function ()
    {
        let rowData = this.data();
        let tr = this.node();
        let kontrolAdi = $(tr).find('input[name="kontroladi"]').val();
        if (rowData.tur === "1")
        {
            muhendislikolcum.push(kontrolAdi);
        }
        else if (rowData.tur === "2")
        {
            ortamolcum.push(kontrolAdi);
        }
    });
    store.set("muhendislikolcum", muhendislikolcum);
    store.set("ortamolcum", ortamolcum);
    window.location.href = "/yillikegitimveplan4";
}

function yillikegitimveplan4load()
{
    let json = jsoncevir(store.get("yillikplandata"));
    let sagliktarama = json.sagliktarama;
    $('#sagliktarama').DataTable
    ({
        data: sagliktarama,
        dom: 't',
        pageLength: -1,
        order: [[2, 'asc']],
        columns:
        [
            { data: null, orderable: false, render: DataTable.render.select(), width: "80px" },
            { data: "tarama", title: "Sağlık Taraması Adı", orderable: !1, render: (d, t, r, m) => t === "display" ? `<input name="kontroladi" type="text" class="csstextbox100" value="${d}">` : d },
        ],
        select: { style: "multi", selector: "td:first-child" },
        order: [],
        createdRow: function (r) { $(r).find("td").eq(1).css("text-align", "left"); },
        headerCallback: function (thead) { $(thead).find('th').css('text-align', 'center'); },
    });
}

function yillikegitimveplandevam4()
{
    let table = $('#sagliktarama').DataTable();
    let sonuc = [];
    table.rows({ selected: true }).every(function ()
    {
        let tr = this.node();
        let val = $(tr).find('input[name="kontroladi"]').val();
        sonuc.push(val);
    });
    store.set("sagliktarama", sonuc);
    window.location.href = "/yillikegitimveplan5";
}

async function yillikegitimveplan1load()
{
    store.set("indirmetamam", "0");
    isyerigetir();
    $('#gundrop').on('change', function () { const i = this.selectedIndex; for (let j = 1; j <= 4; j++)$('#alan' + j).toggle(j <= i + 1) }).trigger('change');
    try
    {
        let yillikplandata = await githuboku("https://cdn.jsdelivr.net/gh/MEHMETCERANX12/isgevrak@main/kaynak/yillikplan1_4.json");
        store.set("yillikplandata", yillikplandata);
        store.set("indirmetamam", "1");
    }
    catch
    {
        store.set("indirmetamam", "0");
        alertify.error("Yıllık plan verisi indirilemedi");
    }
}

function yillikegitimveplandevam1()
{
    if (store.get("indirmetamam") === "1")
    {
        let yillikcalismatarih = $('#yillikcalismatarih').val().trim();
        if (!tarihkontrol(yillikcalismatarih)) {
            alertify.error("Lütfen yıllık çalışma planı için giriniz");
            return;
        }
        let yillikegitimtarih = $('#yillikegitimtarih').val().trim();
        if (!tarihkontrol(yillikegitimtarih)) {
            alertify.error("Lütfen yıllık eğitim planı için tarih giriniz");
            return;
        }
        let yilsecim = $('#yilsecim').val().trim();
        if (!yilsecim) {
            alertify.error("Lütfen hangi yılın planını yaptığınızı yazınız");
            return;
        }
        let firmaid = firmasecimoku();
        if (!firmaid) {
            alertify.error("Lütfen işyeri seçiniz");
            return;
        }
        let gun = parseInt($('#gundrop').val());
        let egitimgun = [];
        for (let i = 1; i <= gun; i++)
        {
            let t = $('#tarih' + i).val().trim();
            if (!tarihkontrol(t)) {
                alertify.error(`Lütfen ${i}. gün için tarih giriniz`);
                return;
            }
            egitimgun.push({ gun: i, tarih: t });
        }
        store.set("egitimgunleri", egitimgun);
        store.set("yilsecim", yilsecim);
        store.set("yillikcalismatarih", yillikcalismatarih);
        store.set("yillikegitimtarih", yillikegitimtarih);
        window.location.href = "/yillikegitimveplan2";
    }
    else
    {
        alertify.error("İndirme işlemi devam etmektedir. Lütfen bekleyip bir daha deneyiniz.");
        return;
    }
}

function yillikegitimveplandevam5()
{
    let riskdegerlendirme = $('input[name="risk"]:checked').val() || "0";
    let acildurumplani = $('input[name="acil"]:checked').val() || "0";
    let acildurumtatbikati = $('input[name="tatb"]:checked').val() || "0";
    let ekipmanjson = [];
    for (let i = 1; i <= 12; i++) { ekipmanjson.push($('#olc' + i).is(':checked') ? 1 : 0); }
    let ortamjson = [];
    for (let i = 1; i <= 12; i++) { ortamjson.push($('#ort' + i).is(':checked') ? 1 : 0); }
    let taramajson = [];
    for (let i = 1; i <= 12; i++) { taramajson.push($('#tar' + i).is(':checked') ? 1 : 0); }
    let periyodikjson = [];
    for (let i = 1; i <= 12; i++) { periyodikjson.push($('#sgl' + i).is(':checked') ? 1 : 0); }
    let kuruljson = [];
    for (let i = 1; i <= 12; i++) { kuruljson.push($('#krl' + i).is(':checked') ? 1 : 0); }
    let ilkyardimjson = [];
    for (let i = 1; i <= 12; i++) { ilkyardimjson.push($('#ilk' + i).is(':checked') ? 1 : 0); }
    let yuksektejson = [];
    for (let i = 1; i <= 12; i++) { yuksektejson.push($('#yuk' + i).is(':checked') ? 1 : 0); }
    let isekipmanegitimjson = [];
    for (let i = 1; i <= 12; i++) { isekipmanegitimjson.push($('#isk' + i).is(':checked') ? 1 : 0); }
    let kimyasaljson = [];
    for (let i = 1; i <= 12; i++) { kimyasaljson.push($('#kim' + i).is(':checked') ? 1 : 0); }
    let kaldirmajson = [];
    for (let i = 1; i <= 12; i++) { kaldirmajson.push($('#kal' + i).is(':checked') ? 1 : 0); }
    let acilegitimjson = [];
    for (let i = 1; i <= 12; i++) { acilegitimjson.push($('#acl' + i).is(':checked') ? 1 : 0); }
    let kkdjson = [];
    for (let i = 1; i <= 12; i++) { kkdjson.push($('#kkd' + i).is(':checked') ? 1 : 0); }
    store.set("riskdegerlendirmesecim", riskdegerlendirme);//Tamam
    store.set("acildurumplanisecim", acildurumplani);//Tamam
    store.set("acildurumtatbikati", acildurumtatbikati);//Tamam
    store.set("ekipmanjson", ekipmanjson);//Tamam
    store.set("ortamjson", ortamjson);//Tamam
    store.set("taramajson", taramajson);//Tamam
    store.set("periyodikjson", periyodikjson);//Tamam
    store.set("kuruljson", kuruljson);//Tamam
    store.set("ilkyardimjson", ilkyardimjson);//Tamam
    store.set("yuksektejson", yuksektejson);//Tamam
    store.set("isekipmanegitimjson", isekipmanegitimjson);//Tamam
    store.set("kimyasaljson", kimyasaljson);//Tamam
    store.set("kaldirmajson", kaldirmajson);//Tamam
    store.set("acilegitimjson", acilegitimjson);//Tamam
    store.set("kkdjson", kkdjson);//Tamam
    store.set("dosyaciktitipi", "9");
    window.location.href = "/dosyacikti";
}

async function yillikcalismaplaniwordyaz()
{
    function varyok(json) { return Array.isArray(json) && json.includes(1) ? 1 : 0; };
    let pagebreakkontrol = 0;
    let isyeri = jsoncevir(store.get("xjsonfirma"));
    let isyeriunvan = isyeri.fi;
    let isyeriadres = isyeri.ad;
    let isyerisicil = isyeri.sc;
    let isveren = isyeri.is;
    let tehlikesinifimap = { 1: "Az Tehlikeli", 2: "Tehlikeli", 3: "Çok Tehlikeli" };
    let tehlikesinifi = parseInt(isyeri.ts);
    let ilkyardimmetin = "her on kişide en az bir kişinin ilkyardım eğitimine/sertifikasına sahip olması gerekmektedir.";
    let egitimyillikperiyot = "yılda en az bir kez";
    let egitimsuresi = "16 Saat";
    let kurulperiyot = "ayda en az bir kez";
    if (tehlikesinifi === 1)
    {
        egitimsuresi = "8 Saat";
        egitimyillikperiyot = "üç yılda en az bir kez";
        kurulperiyot = "üç ayda en az bir kez"
        ilkyardimmetin = "her yirmi kişide en az bir kişinin ilkyardım eğitimine/sertifikasına sahip olması gerekmektedir.";
    }
    else if (tehlikesinifi === 2)
    {
        egitimsuresi = "12 Saat";
        egitimyillikperiyot = "iki yılda en az bir kez";
        kurulperiyot = "iki ayda en az bir kez"
        ilkyardimmetin = "her on beş kişide en az bir kişinin ilkyardım eğitimine/sertifikasına sahip olması gerekmektedir.";
    }
    tehlikesinifi = tehlikesinifimap[tehlikesinifi];
    let hekimad = isyeri.hk;
    let hekimno = isyeri.hn;
    let uzmanad = store.get("uzmanad");
    let uzmanno = store.get("uzmanno");
    let tarih = store.get("yillikegitimtarih");
    let egitimtarih = jsoncevir(store.get("egitimgunleri"));
    egitimtarih = egitimtarih.map(x => x.tarih).join(" - ");
    let yilsecim = store.get("yilsecim");
    let riskmetin = "";
    let acildurummetin = "";
    let tatbikatmetin = planaybul(store.get("acildurumtatbikati")) + " - " + yilsecim;
    tatbikatmetin = "İşyerlerinde Acil Durumlar Hakkında Yönetmelik kapsamında, işyerlerinde yılda en az bir kez acil durum tatbikatı yapılması gerekmektedir. Bu doğrultuda; acil durum planında yer alan uygulama adımlarının etkinliğinin izlenmesi, planın uygulanabilirliğinin değerlendirilmesi ve çalışanların acil durumlara hazırlık düzeyinin artırılması amacıyla, tüm çalışanların katılımıyla " + tatbikatmetin + " ayında acil durum tatbikatı yapılmasına karar verilmiştir. Tatbikatın tamamlanmasının ardından, tatbikat değerlendirme kriterleri esas alınarak sonuçlar ve tespit edilen eksiklikler kayıt altına alınacak, ilgili taraflarca imza altına alınacaktır.";
    let isgegitimmetin = "Çalışanların İş Sağlığı ve Güvenliği Eğitimlerinin Usul ve Esasları Hakkında Yönetmelik hükümleri doğrultusunda; " + tehlikesinifi +  " sınıfta yer alan işyerlerinde çalışanlara " + egitimyillikperiyot + " olmak üzere toplam " + egitimsuresi + " İş Sağlığı ve Güvenliği eğitimi verilmesi öngörülmektedir. Bu kapsamda, çalışanların iş sağlığı ve güvenliği bilincinin artırılması, risklerin azaltılması ve mevzuata uyumun sağlanması amacıyla söz konusu eğitimin " + egitimtarih + " gerçekleştirilmesine karar verilmiştir.";
    if (store.get("riskdegerlendirme") === "1")
    {
        riskmetin = "İşyeri çalışma ortamında mevcut tehlike ve riskler dikkate alınarak hazırlanmış, yürürlükte olan ve geçerliliğini koruyan bir risk değerlendirmesi bulunmaktadır.";
    }
    else if(store.get("riskdegerlendirme") === "0")
    {
        riskmetin = planaybul(store.get("riskdegerlendirmesecim"));
        riskmetin = riskmetin + " - " + yilsecim + " tarihinde, işyeri çalışma ortamında mevcut olan tehlike ve riskler dikkate alınarak, risk değerlendirme ekibinin katılımı ile birlikte, İş Sağlığı ve Güvenliği Risk Değerlendirmesi Yönetmeliği hükümlerine uygun şekilde yeni bir risk değerlendirmesi gerçekleştirilecektir.";
    }
    if (store.get("acildurumplani") === "1")
    {
        acildurummetin = "İşyeri çalışma ortamı ve çevresel koşullar dikkate alınarak hazırlanmış ve geçerliliğini halen koruyan bir Acil Durum Planı bulunmaktadır. Bu plan; işyerinde tanımlanmış acil durumları etkileyebilecek ya da yeni acil durumların ortaya çıkmasına yol açabilecek her türlü değişikliğin meydana gelmesi halinde, söz konusu değişikliğin etkisinin büyüklüğüne bağlı olarak tamamen veya kısmen gözden geçirilerek revize edilecektir.";
    }
    else if (store.get("acildurumplani") === "0")
    {
        acildurummetin = planaybul(store.get("acildurumplanisecim"));
        acildurummetin = acildurummetin + " - " + yilsecim + " tarihinde İşyeri çalışma ortamı, yapılan faaliyetler ve çevresel etkiler ayrıntılı olarak değerlendirilerek, İşyerlerinde Acil Durumlar Hakkında Yönetmelik hükümlerine uygun şekilde yeni bir Acil Durum Planı hazırlanacaktır. Bu plan; işyerinde tanımlanmış acil durumları etkileyebilecek ya da yeni acil durumların ortaya çıkmasına yol açabilecek her türlü değişikliğin meydana gelmesi halinde, söz konusu değişikliğin etkisinin büyüklüğüne bağlı olarak tamamen veya kısmen gözden geçirilerek revize edilecektir.";
    }
    const { Document, Packer, TextRun, Paragraph, Table, TableRow, TableCell, WidthType, BorderStyle, AlignmentType, HeightRule, VerticalAlign, PageBreak } = docx;
    let planustbilgi = [];
    planustbilgi.push(new Paragraph({ text: `Tarih: ` + tarih, spacing: { after: 100 }, style: "Sagayasli" }));
    planustbilgi.push(new Paragraph({ text: yilsecim + ` YILI - YILLIK ÇALIŞMA PLANI`, spacing: { after: 100 }, style: "Kalin" }));
    planustbilgi.push(new Paragraph({ text: `\tİşyeri Unvanı: ` + isyeriunvan, spacing: { after: 100 }, style: "Normal" }));
    planustbilgi.push(new Paragraph({ text: `\tİşyeri Adresi: ` + isyeriadres, spacing: { after: 100 }, style: "Normal" }));
    planustbilgi.push(new Paragraph({ text: `\tTehlike Sınıfı: ` + tehlikesinifi, spacing: { after: 100 }, style: "Normal" }));
    planustbilgi.push(new Paragraph({ text: `\tSGK Sicil No: ` + isyerisicil, spacing: { after: 100 }, style: "Normal" }));
    planustbilgi.push(new Paragraph({ text: `\tRİSK DEĞERLENDİRMESİ`, spacing: { after: 100 }, style: "Kalinsol" }));
    planustbilgi.push(new Paragraph({ text: `\t` + riskmetin, spacing: { after: 100 }, style: "Normal" }));
    planustbilgi.push(new Paragraph({ text: `\tHazırlanan bu risk değerlendirmesi; işyerinin taşınması veya binalarda değişiklik yapılması, işyerinde uygulanan teknoloji, kullanılan madde ve ekipmanlarda değişiklikler meydana gelmesi, Üretim yönteminde değişiklikler olması, iş kazası, meslek hastalığı veya ramak kala olay meydana gelmesi, çalışma ortamına ait sınır değerlere ilişkin bir mevzuat değişikliği olması halinde risk değerlendirme ekibi ile birlikte yeniden gözden geçirilecek ve gerekli revizyonlar yapılarak güncellenecektir.`, spacing: { after: 100 }, style: "Normal" }));
    planustbilgi.push(new Paragraph({ text: `\tACİL DURUM PLANI`, spacing: { after: 100 }, style: "Kalinsol" }));
    planustbilgi.push(new Paragraph({ text: `\t` + acildurummetin, spacing: { after: 100 }, style: "Normal" }));
    planustbilgi.push(new Paragraph({ text: `\tTEMEL İŞ SAĞLIĞI ve GÜVENLİĞİ EĞİTİMİ`, spacing: { after: 100 }, style: "Kalinsol" }));
    planustbilgi.push(new Paragraph({ text: `\t` + isgegitimmetin, spacing: { after: 100 }, style: "Normal" }));
    planustbilgi.push(new Paragraph({ text: `\tACİL DURUM TATBİKATI`, spacing: { after: 100 }, style: "Kalinsol" }));
    planustbilgi.push(new Paragraph({ text: `\t` + tatbikatmetin, spacing: { after: 100 }, style: "Normal" }));
    let kontrol = 0;
    let children = [...planustbilgi];
    planustbilgi = [];
    if (varyok(store.get("ekipmanjson")) === 1)
    {
        pagebreakkontrol = 0;
        kontrol = kontrol + 1;
        planustbilgi.push(new Paragraph({ text: `\tİŞ EKİPMANI KONTROLÜ`, spacing: { before: 100, after: 100 }, style: "Kalinsol" }));
        planustbilgi.push(new Paragraph({ text: `\tİşyerinde kullanılacak iş ekipmanının yapılacak işe uygun olması ve bu ekipmanın çalışanlara sağlık ve güvenlik yönünden zarar vermemesi için “İş Ekipmanlarının Kullanımında Sağlık ve Güvenlik Şartları Yönetmeliği” çerçevesinde tablo-1'de belirtilen kontrollerin yetkili kişiler tarafından yapılmasına karar verilmiştir.`, spacing: { after: 200 }, style: "Normal" }));
        children.push(...planustbilgi);
        children.push(yillikcalismaplaniaytablo(store.get("ekipmanjson")));
        children.push(new Paragraph({children: [new PageBreak()]}));
    }
    planustbilgi = [];
    if (varyok(store.get("ortamjson")) === 1)
    {
        pagebreakkontrol = 0;
        kontrol = kontrol + 1;
        planustbilgi.push(new Paragraph({ text: `\tORTAM ÖLÇÜM KONTROLÜ`, spacing: { before: 100, after: 100 }, style: "Kalinsol" }));
        planustbilgi.push(new Paragraph({ text: `\tÇalışanların işyerinde bulunan, kullanılan, oluşan ya da herhangi bir şekilde maruz kalınan maddeler ile çalışma ortamı koşullarının sağlık ve güvenlik üzerindeki olası zararlı etkilerinin belirlenmesi amacıyla, tablo-1'de belirtilen ortam ölçümlerinin yapılmasına karar verilmiştir.`, spacing: { after: 200 }, style: "Normal" }));
        children.push(...planustbilgi);
        children.push(yillikcalismaplaniaytablo(store.get("ortamjson")));
        if (kontrol === 1)
        {
            children.push(new Paragraph({ children: [new PageBreak()] }));
            pagebreakkontrol = 1;
        }
    }
    planustbilgi = [];
    if (varyok(store.get("taramajson")) === 1)
    {
        pagebreakkontrol = 0;
        kontrol = kontrol + 1;
        planustbilgi.push(new Paragraph({ text: `\tSAĞLIK GÖZETİMİ`, spacing: { before: 100, after: 100 }, style: "Kalinsol" }));
        planustbilgi.push(new Paragraph({ text: `\tÇalışanların yaptıkları işin niteliği, maruz kaldıkları mesleki riskler ve çalışma ortamı koşulları dikkate alınarak, sağlık gözetiminin sağlanması, meslek hastalıklarının ve işe bağlı sağlık sorunlarının erken dönemde tespit edilmesi amacıyla, aşağıda belirtilen tarihte periyodik sağlık muayenelerinin işyeri hekimi tarafından gerçekleştirilmesine karar verilmiştir.`, spacing: { after: 200 }, style: "Normal" }));
        children.push(...planustbilgi);
        children.push(yillikcalismaplaniaytablo(store.get("taramajson")));
        if (kontrol === 1)
        {
            children.push(new Paragraph({ children: [new PageBreak()] }));
            pagebreakkontrol = 1;
        }
    }
    planustbilgi = [];
    if (varyok(store.get("periyodikjson")) === 1)
    {
        pagebreakkontrol = 0;
        kontrol = kontrol + 1;
        planustbilgi.push(new Paragraph({ text: `\tEK-2 PERİYODİK SAĞLIK MUAYENESİ`, spacing: { before: 100, after: 100 }, style: "Kalinsol" }));
        planustbilgi.push(new Paragraph({ text: `\tÇalışanların yaptıkları işin niteliği, maruz kaldıkları mesleki riskler ve çalışma ortamı koşulları dikkate alınarak; çalışanların sağlık durumlarının izlenmesi, meslek hastalıklarının ve işe bağlı sağlık sorunlarının erken dönemde tespit edilmesi amacıyla, gerekli EK-2 Sağlık Raporlarının aşağıda belirtilen tarihte çalışanların periyodik sağlık muayenelerinin yapılmasına karar verilmiştir. Yapılacak periyodik muayeneler sonucunda çalışanların sağlık durumları işyeri hekimi tarafından değerlendirilecek olup, gerekli görülmesi halinde görev değişikliği önerilmesi, ilave tetkik ve muayenelerin yapılması talep edilebilecektir.`, spacing: { after: 200 }, style: "Normal" }));
        children.push(...planustbilgi);
        children.push(yillikcalismaplaniaytablo(store.get("periyodikjson")));
        if (kontrol === 1)
        {
            children.push(new Paragraph({ children: [new PageBreak()] }));
            pagebreakkontrol = 1;
        }
    }
    planustbilgi = [];
    if (varyok(store.get("kuruljson")) === 1)
    {
        pagebreakkontrol = 0;
        kontrol = kontrol + 1;
        planustbilgi.push(new Paragraph({ text: `\tİŞ SAĞLIĞI ve GÜVENLİĞİ KURULU`, spacing: { before: 100, after: 100 }, style: "Kalinsol" }));
        planustbilgi.push(new Paragraph({ text: `\tİşyeri ` + tehlikesinifi + ` sınıfta olup “İş Sağlığı ve Güvenliği Kurulları Hakkında Yönetmeliğe” göre ` + kurulperiyot + ` iş sağlığı ve güvenliği kurulunun işverenin koordinasyonuyla toplanması gerekmektedir. İş sağlığı ve güvenliği kurulunun aşağıda belirtilen aylarda toplanması planlanmıştır.`, spacing: { after: 200 }, style: "Normal" }));
        children.push(...planustbilgi);
        children.push(yillikcalismaplaniaytablo(store.get("kuruljson")));
        if (kontrol === 5)
        {
            children.push(new Paragraph({ children: [new PageBreak()] }));
            pagebreakkontrol = 1;
        }
    }
    planustbilgi = [];
    if (varyok(store.get("ilkyardimjson")) === 1)
    {
        pagebreakkontrol = 0;
        kontrol = kontrol + 1;
        planustbilgi.push(new Paragraph({ text: `\tİLKYARDIM EĞİTİMİ`, spacing: { before: 100, after: 100 }, style: "Kalinsol" }));
        planustbilgi.push(new Paragraph({ text: `\tİşyeri ` + tehlikesinifi + ` sınıfta olup “İlkyardım Yönetmeliğine” göre ` + ilkyardimmetin + ` Bu çerçevede yönetmeliğe uygun ve yeterli sayıda çalışana aşağıda belirtilen tarihte eğitim verilmesi planlanmıştır.`, spacing: { after: 200 }, style: "Normal" }));
        children.push(...planustbilgi);
        children.push(yillikcalismaplaniaytablo(store.get("ilkyardimjson")));
        if (kontrol === 5)
        {
            children.push(new Paragraph({ children: [new PageBreak()] }));
            pagebreakkontrol = 1;
        }
    }
    planustbilgi = [];
    if (varyok(store.get("yuksektejson")) === 1)
    {
        pagebreakkontrol = 0;
        kontrol = kontrol + 1;
        planustbilgi.push(new Paragraph({ text: `\tYÜKSEKTE ÇALIŞMA EĞİTİMİ`, spacing: { before: 100, after: 100 }, style: "Kalinsol" }));
        planustbilgi.push(new Paragraph({ text: `\tYüksekte çalışanlara, yüksekte çalışmalarda kullanılan ekipmanların doğru kullanımı, toplu korunma tedbirleri ve kişisel koruyucu donanımları da kapsayacak şekilde yüksekte çalışma eğitimi aşağıda belirtilen tarihte eğitim verilmesi planlanmıştır.`, spacing: { after: 200 }, style: "Normal" }));
        children.push(...planustbilgi);
        children.push(yillikcalismaplaniaytablo(store.get("yuksektejson")));
        if (kontrol === 5)
        {
            children.push(new Paragraph({ children: [new PageBreak()] }));
            pagebreakkontrol = 1;
        }
    }
    planustbilgi = [];
    if (varyok(store.get("isekipmanegitimjson")) === 1)
    {
        pagebreakkontrol = 0;
        kontrol = kontrol + 1;
        planustbilgi.push(new Paragraph({ text: `\tİŞ EKİPMANLARI İLE GÜVENLİ ÇALIŞMA EĞİTİMİ`, spacing: { before: 100, after: 100 }, style: "Kalinsol" }));
        planustbilgi.push(new Paragraph({ text: `\tÇalışanlara, işyerinde kullanılan iş ekipmanlarının güvenlik donanımları, oluşturabileceği iş kazaları ve meslek hastalıkları ile iş ekipmanlarının güvenli kullanımı konusunda aşağıda belirtilen tarihte eğitim verilmesi planlanmıştır.`, spacing: { after: 200 }, style: "Normal" }));
        children.push(...planustbilgi);
        children.push(yillikcalismaplaniaytablo(store.get("isekipmanegitimjson")));
        if (kontrol === 5)
        {
            children.push(new Paragraph({ children: [new PageBreak()] }));
            pagebreakkontrol = 1;
        }
    }
    planustbilgi = [];
    if (varyok(store.get("kimyasaljson")) === 1)
    {
        pagebreakkontrol = 0;
        kontrol = kontrol + 1;
        planustbilgi.push(new Paragraph({ text: `\tKİMYASALLARLA GÜVENLİ ÇALIŞMA EĞİTİMİ`, spacing: { before: 100, after: 100 }, style: "Kalinsol" }));
        planustbilgi.push(new Paragraph({ text: `\t“Kimyasal Maddelerle Çalışmalarda Sağlık ve Güvenlik Önlemleri Hakkında Yönetmelik” 9. madde çerçevesinde kimyasal maddeler ile çalışanlara, kimyasalların doğru ve güvenli kullanımı konusunda aşağıda belirtilen tarihte eğitim verilmesi planlanmıştır.`, spacing: { after: 200 }, style: "Normal" }));
        children.push(...planustbilgi);
        children.push(yillikcalismaplaniaytablo(store.get("kimyasaljson")));
        if (kontrol === 5)
        {
            children.push(new Paragraph({ children: [new PageBreak()] }));
            pagebreakkontrol = 1;
        }
    }
    planustbilgi = [];
    if (varyok(store.get("kaldirmajson")) === 1)
    {
        pagebreakkontrol = 0;
        kontrol = kontrol + 1;
        planustbilgi.push(new Paragraph({ text: `\tKALDIRMA AKSESUARLARININ GÜVENLİ KULLANIM EĞİTİMİ`, spacing: { before: 100, after: 100 }, style: "Kalinsol" }));
        planustbilgi.push(new Paragraph({ text: `\tKaldırma ekipmanları ile bu ekipmanlara ait kaldırma aksesuarlarını kullanan çalışanlara; kaldırma aksesuarlarının güvenli kullanımı, güvenli kaldırma teknikleri ile ekipmanların kaldırma kapasiteleri ve etiket bilgilerinin doğru şekilde okunması ve uygulanmasını kapsayacak biçimde, aşağıda belirtilen tarihte eğitim verilmesi planlanmıştır.`, spacing: { after: 200 }, style: "Normal" }));
        children.push(...planustbilgi);
        children.push(yillikcalismaplaniaytablo(store.get("kaldirmajson")));
        if (kontrol === 5 || kontrol == 9)
        {
            children.push(new Paragraph({ children: [new PageBreak()] }));
            pagebreakkontrol = 1;
        }
    }
    planustbilgi = [];
    if (varyok(store.get("acilegitimjson")) === 1)
    {
        pagebreakkontrol = 0;
        kontrol = kontrol + 1;
        planustbilgi.push(new Paragraph({ text: `\tACİL DURUM EĞİTİMİ`, spacing: { before: 100, after: 100 }, style: "Kalinsol" }));
        planustbilgi.push(new Paragraph({ text: `\tAcil durumların meydana gelmesi halinde çalışanların can güvenliğinin sağlanması, panik oluşmasının önlenmesi ve tahliye sürecinin hızlı, düzenli ve güvenli bir şekilde gerçekleştirilebilmesi amacıyla; acil durumlarda izlenecek yollar, toplanma alanları, alarm ve uyarı sistemlerinin kullanımı, görevli ekiplerin sorumlulukları ile doğru davranış şekillerini kapsayan kapsamlı bir eğitimin, aşağıda belirtilen tarihte tüm çalışanlara yönelik olarak verilmesi planlanmıştır.`, spacing: { after: 200 }, style: "Normal" }));
        children.push(...planustbilgi);
        children.push(yillikcalismaplaniaytablo(store.get("acilegitimjson")));
        if (kontrol === 5 || kontrol == 9)
        {
            children.push(new Paragraph({ children: [new PageBreak()] }));
            pagebreakkontrol = 1;
        }
    }
    planustbilgi = [];
    if (varyok(store.get("kkdjson")) === 1)
    {
        pagebreakkontrol = 0;
        kontrol = kontrol + 1;
        planustbilgi.push(new Paragraph({ text: `\tKİŞİSEL KORUYUCU DONANIM`, spacing: { before: 100, after: 100 }, style: "Kalinsol" }));
        planustbilgi.push(new Paragraph({ text: `\t“Kişisel Koruyucu Donanımların İşyerlerinde Kullanılması Hakkında Yönetmelik” hükümleri doğrultusunda; çalışanların yaptıkları işin niteliğine, karşı karşıya kalabilecekleri risklere ve mevsimsel koşullara uygun olarak seçilen, termal konfor şartlarını sağlayacak nitelikteki kişisel koruyucu donanımların, çalışanların sağlığını ve güvenliğini korumak amacıyla aşağıda belirtilen tarihte dağıtılması planlanmaktadır.`, spacing: { after: 200 }, style: "Normal" }));
        children.push(...planustbilgi);
        children.push(yillikcalismaplaniaytablo(store.get("kkdjson")));
        if (kontrol === 5 || kontrol == 9)
        {
            children.push(new Paragraph({ children: [new PageBreak()] }));
            pagebreakkontrol = 1;
        }
    }
    let muhendislikolcum = jsoncevir(store.get("muhendislikolcum"));
    let ortamolcum = jsoncevir(store.get("ortamolcum"));
    let sagliktarama = jsoncevir(store.get("sagliktarama"));
    ////////BU KISMI YAZ//////////////
    if (pagebreakkontrol === 0)
    {
        children.push(new Paragraph({ children: [new PageBreak()] }));
    }    
    store.set("baslikvaryok", "0")
    let muhTablo = yillikcalismaplanikontrollistesi("İş Ekipmanı Kontrolleri", muhendislikolcum);
    if (muhTablo) children.push(muhTablo);
    let ortamTablo = yillikcalismaplanikontrollistesi("Ortam Ölçümleri", ortamolcum);
    if (ortamTablo) children.push(ortamTablo);
    let saglikTablo = yillikcalismaplanikontrollistesi("Sağlık Taraması", sagliktarama);
    if (saglikTablo) children.push(saglikTablo);
    const doc = new Document
    ({
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
        [{
            properties: { page: { margin: { top: 1000, right: 850, bottom: 1000, left: 850, header: 500, footer: 850 } } },
            children: children,
            footers: { default: new docx.Footer({ children: [docxucluimzadikey(uzmanad, uzmanno, hekimad, hekimno, isveren)] }) }
        }]
    });
    const blob = await Packer.toBlob(doc);
    saveAs(blob, "Yıllık Çalışma Planı - " + metinuret(3) + ".docx");
}
function yillikcalismaplanikontrollistesi(baslik, liste)
{
    const { Paragraph, Table, TableRow, TableCell, WidthType, AlignmentType, VerticalAlign, TextRun, HeightRule} = docx;
    if (!Array.isArray(liste) || liste.length === 0) return null;
    let rows = [];
    //Tablo 1 - İş Sağlığı ve Güvenliği Açısından Yapılması Gerekli Kontroller
    if(store.get("baslikvaryok")!=="1"){rows.push(new TableRow({height:{value:400,rule:HeightRule.ATLEAST},children:[new TableCell({columnSpan:2,verticalAlign:VerticalAlign.CENTER,children:[new Paragraph({alignment:AlignmentType.CENTER,children:[new TextRun({text:"Tablo 1 - İş Sağlığı ve Güvenliği Açısından Yapılması Gerekli Kontroller",bold:true,font:"Calibri",size:22})]})]})]}));store.set("baslikvaryok","1");}
    //Tablo 1 - Üst Başlık
    rows.push(new TableRow({ height: { value: 400, rule: HeightRule.ATLEAST }, children: [new TableCell({ columnSpan: 2, verticalAlign: VerticalAlign.CENTER, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: baslik, bold: true, font: "Calibri", size: 22 })] })] })] }));
    //Tablo 1 - Alt Başlığa Ait Kontroller
    liste.forEach((item,i)=>{rows.push(new TableRow({height:{value:400,rule:HeightRule.ATLEAST},children:[new TableCell({width:{size:8,type:WidthType.PERCENTAGE},verticalAlign:VerticalAlign.CENTER,children:[new Paragraph({alignment:AlignmentType.CENTER,children:[new TextRun({text:String(i+1),font:"Calibri",size:22})]})]}),new TableCell({width:{size:92,type:WidthType.PERCENTAGE},verticalAlign:VerticalAlign.CENTER,children:[new Paragraph({indent:{left:75},children:[new TextRun({text:item,font:"Calibri",size:22})]})]})]}));});
    return new Table({ width: { size: 100, type: WidthType.PERCENTAGE }, rows: rows});
}
function yillikcalismaplaniaytablo(data)
{
    const { TextRun, Paragraph, Table, TableRow, TableCell, WidthType, BorderStyle, AlignmentType, HeightRule, VerticalAlign } = docx;
    if (!Array.isArray(data) || data.length !== 12) { throw new Error("acilegitimjson 12 elemanlı olmalıdır"); }
    const aylarUst = ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran"];
    const aylarAlt = ["Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"];
    const hucreGenislik = { size: 16.66, type: WidthType.PERCENTAGE };
    function ayHucre(text, fill = "FFFFFF", bold = true) { return new TableCell({ width: hucreGenislik, verticalAlign: VerticalAlign.CENTER, shading: { fill }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text, bold, font: "Calibri", size: 22 })] })] }); }
    function isaretHucre(value) { const isaret = value === 1 ? "✓" : "", fill = value === 1 ? "8C8C8C" : "FFFFFF"; return new TableCell({ width: hucreGenislik, verticalAlign: VerticalAlign.CENTER, shading: { fill }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: isaret, bold: true, size: 26, color: value === 1 ? "FFFFFF" : "000000" })] })] }); }
    return new Table
    ({
        width: { size: 100, type: WidthType.PERCENTAGE },
        rows:
        [
            new TableRow({ height: { value: 400, rule: HeightRule.ATLEAST }, children: aylarUst.map(a => ayHucre(a))}),
            new TableRow({ height: { value: 400, rule: HeightRule.ATLEAST }, children: data.slice(0, 6).map(v => isaretHucre(v))}),
            new TableRow({ height: { value: 400, rule: HeightRule.ATLEAST }, children: aylarAlt.map(a => ayHucre(a))}),
            new TableRow({ height: { value: 400, rule: HeightRule.ATLEAST }, children: data.slice(6, 12).map(v => isaretHucre(v))})
        ],
        borders: { top: { style: BorderStyle.SINGLE, size: 2 }, bottom: { style: BorderStyle.SINGLE, size: 2 }, left: { style: BorderStyle.SINGLE, size: 2 }, right: { style: BorderStyle.SINGLE, size: 2 }, insideHorizontal: { style: BorderStyle.SINGLE, size: 2 }, insideVertical: { style: BorderStyle.SINGLE, size: 2 } }
    });
}
function planaybul(a){return["","Ocak","Şubat","Mart","Nisan","Mayıs","Haziran","Temmuz","Ağustos","Eylül","Ekim","Kasım","Aralık"][parseInt(a,10)]||""}

async function yillikegitimplaniwordyaz()
{
    let isyeri = jsoncevir(store.get("xjsonfirma"));
    let isyeriunvan = isyeri.fi;
    let isyeriadres = isyeri.ad;
    let isveren = isyeri.is;
    let tehlikesinifimap = { 1: "Az Tehlikeli", 2: "Tehlikeli", 3: "Çok Tehlikeli" };
    let tehlikesinifi = parseInt(isyeri.ts);
    let egitimsuresi = "16 Saat";
    if (tehlikesinifi === 1)
    {
        egitimsuresi = "8 Saat";
    }
    else if (tehlikesinifi === 2)
    {
        egitimsuresi = "12 Saat";
    }
    tehlikesinifi = tehlikesinifimap[tehlikesinifi];
    let hekimad = isyeri.hk;
    let hekimno = isyeri.hn;
    let uzmanad = store.get("uzmanad");
    let uzmanno = store.get("uzmanno");
    let tarih = store.get("yillikegitimtarih");
    let egitimtarih = jsoncevir(store.get("egitimgunleri"));
    egitimtarih = egitimtarih.map(x => x.tarih).join(" - ");
    let yilsecim = store.get("yilsecim");
    let egitimkonuicerik = jsoncevir(store.get("egitimkonuicerik"));
    const { Document, Packer, TextRun, Paragraph, Table, TableRow, TableCell, WidthType, BorderStyle, AlignmentType, HeightRule, VerticalAlign } = docx;
    let egitimustbilgi = [];
    egitimustbilgi.push(new Paragraph({ text: `Tarih: ` + tarih, spacing: { after: 100 }, style: "Sagayasli" }));
    egitimustbilgi.push(new Paragraph({ text: yilsecim + ` YILI - YILLIK EĞİTİM PLANI`, spacing: { after: 100 }, style: "Kalin" }));
    egitimustbilgi.push(new Paragraph({ text: `\tİşyeri Unvanı: ` + isyeriunvan, spacing: { after: 100 }, style: "Normal" }));
    egitimustbilgi.push(new Paragraph({ text: `\tİşyeri Adresi: ` + isyeriadres, spacing: { after: 100 }, style: "Normal" }));
    egitimustbilgi.push(new Paragraph({ text: `\tTehlike Sınıfı: ` + tehlikesinifi, spacing: { after: 100 }, style: "Normal" }));
    egitimustbilgi.push(new Paragraph({ text: `\tPlanlanan İSG Eğitim Tarihi: ` + egitimtarih, spacing: { after: 100 }, style: "Normal" }));
    egitimustbilgi.push(new Paragraph({ text: `\tYeni işe başlayan çalışanlar ile temel iş sağlığı ve güvenliği eğitiminin geçerlilik süresi dolmak üzere olan çalışanlara, iş sağlığı ve güvenliği temel eğitiminin aşağıda belirtilen tarihlerde verilmesine karar verilmiştir. Yeni işe başlayan çalışanlara, işe başlamadan önce ve çalışacakları işe özgü olacak şekilde, yetkin ve görevli kişiler tarafından işe başlama eğitimi verilecektir.`, spacing: { after: 100 }, style: "Normal" }));
    egitimustbilgi.push(new Paragraph({ text: `\tİşe başlama eğitimleri; temel iş sağlığı ve güvenliği eğitimi tamamlanıncaya kadar geçen süre içerisinde, çalışanın maruz kalabileceği tehlike ve risklere karşı korunmasını sağlayacak nitelikte olacak, teorik ve uygulamalı olarak gerçekleştirilecektir. Bu eğitimler kapsamında çalışanlara; işyerinde karşılaşabilecekleri riskler, güvenli çalışma yöntemleri, acil durumlarda yapılması gerekenler ve kişisel koruyucu donanımların doğru kullanımı hakkında bilgilendirme yapılacaktır.`, spacing: { after: 100 }, style: "Normal" }));
    egitimustbilgi.push(new Paragraph({ text: `\tTemel iş sağlığı ve güvenliği eğitimi; çalışanların yürüttükleri iş sırasında karşılaştıkları tehlikeleri tanımalarını, bu tehlikelere karşı alınması gerekli önleyici ve koruyucu tedbirleri öğrenmelerini sağlamak amacıyla planlanmıştır. Eğitim ile iş kazaları ve meslek hastalıklarının önlenmesi, çalışanların sağlık ve güvenlik bilincinin artırılması, iş gücü kayıplarının azaltılması ve işin yürütümünün sağlıklı ve güvenli bir şekilde sürdürülmesi hedeflenmektedir. Temel iş sağlığı ve güvenliği eğitiminin toplam süresi ` + egitimsuresi + ` olup, eğitimler işyerinde yüz yüze, yukarıda belirtilen tarihlerde mevzuata uygun şekilde gerçekleştirilecektir. Eğitimlerin sonunda, çalışanların katılım durumları kayıt altına alınacak ve gerekli belgelendirme işlemleri yapılacaktır.`, spacing: { after: 100 }, style: "Normal" }));
    const egitimkonutablo = [];
    egitimkonutablo.push(new TableRow({ height: { value: 400, rule: HeightRule.EXACT }, children: [new TableCell({ columnSpan: 2, verticalAlign: VerticalAlign.CENTER, width: { size: 100, type: WidthType.PERCENTAGE }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "İş Sağlığı ve Güvenliği Eğitimi Konuları", bold: true, size: 22, font: "Calibri" })] })] })] }));
    const toplam = egitimkonuicerik.length;
    const solAdet = Math.ceil(toplam / 2);
    for (let i = 0; i < solAdet; i++)
    {
        const solMetin = egitimkonuicerik[i] || "";
        const sagMetin = egitimkonuicerik[i + solAdet] || "";
        egitimkonutablo.push(new TableRow
        ({
            height: { value: 400, rule: HeightRule.ATLEAST },
            children:
            [
                new TableCell({ verticalAlign: VerticalAlign.CENTER, children: [new Paragraph({ alignment: AlignmentType.LEFT, children: [new TextRun({ text: solMetin, font: { name: "Calibri" }, size: 22 })] })] }),
                new TableCell({ verticalAlign: VerticalAlign.CENTER, margins: { left: 100 }, children: [new Paragraph({ alignment: AlignmentType.LEFT, children: [new TextRun({ text: sagMetin, font: { name: "Calibri" }, size: 22 })] })] })
            ]
        }));
    }
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
                properties: { page: { margin: { top: 1000, right: 650, bottom: 1000, left: 650, header: 500, footer: 850 }}},
                children: [...egitimustbilgi, new Table({ width: { size: 100, type: WidthType.PERCENTAGE }, rows: egitimkonutablo })],
                footers: { default: new docx.Footer({ children: [docxucluimzadikey(uzmanad, uzmanno, hekimad, hekimno, isveren)] }) }
            }
        ]
    });
    const blob = await Packer.toBlob(doc);
    saveAs(blob, "Yıllık Eğitim Planı - " + metinuret(3) + ".docx");
}

function docxucluimzadikey(uzman,uzmanno,hekim,hekimno,isveren){return new docx.Table({width:{size:100,type:docx.WidthType.PERCENTAGE},borders:{top:{style:docx.BorderStyle.NONE,size:0,color:"FFFFFF"},bottom:{style:docx.BorderStyle.NONE,size:0,color:"FFFFFF"},left:{style:docx.BorderStyle.NONE,size:0,color:"FFFFFF"},right:{style:docx.BorderStyle.NONE,size:0,color:"FFFFFF"},insideHorizontal:{style:docx.BorderStyle.NONE,size:0,color:"FFFFFF"},insideVertical:{style:docx.BorderStyle.NONE,size:0,color:"FFFFFF"}},rows:[new docx.TableRow({children:[new docx.TableCell({width:{size:33,type:docx.WidthType.PERCENTAGE},children:[new docx.Paragraph({alignment:docx.AlignmentType.CENTER,children:[new docx.TextRun({text:uzman,font:"Calibri",size:22,bold:!0})]})]}),new docx.TableCell({width:{size:34,type:docx.WidthType.PERCENTAGE},children:[new docx.Paragraph({alignment:docx.AlignmentType.CENTER,children:[new docx.TextRun({text:isveren,font:"Calibri",size:22,bold:!0})]})]}),new docx.TableCell({width:{size:33,type:docx.WidthType.PERCENTAGE},children:[new docx.Paragraph({alignment:docx.AlignmentType.CENTER,children:[new docx.TextRun({text:hekim,font:"Calibri",size:22,bold:!0})]})]})]}),new docx.TableRow({children:[new docx.TableCell({children:[new docx.Paragraph({alignment:docx.AlignmentType.CENTER,children:[new docx.TextRun({text:"İş Güvenliği Uzmanı",font:"Calibri",size:22})]})]}),new docx.TableCell({children:[new docx.Paragraph({alignment:docx.AlignmentType.CENTER,children:[new docx.TextRun({text:isverenunvanioku(),font:"Calibri",size:22})]})]}),new docx.TableCell({children:[new docx.Paragraph({alignment:docx.AlignmentType.CENTER,children:[new docx.TextRun({text:"İşyeri Hekimi",font:"Calibri",size:22})]})]})]}),new docx.TableRow({children:[new docx.TableCell({children:[new docx.Paragraph({alignment:docx.AlignmentType.CENTER,children:[new docx.TextRun({text:"Belge No: "+uzmanno,font:"Calibri",size:22})]})]}),new docx.TableCell({children:[new docx.Paragraph({alignment:docx.AlignmentType.CENTER,children:[new docx.TextRun({text:"",font:"Calibri",size:22})]})]}),new docx.TableCell({children:[new docx.Paragraph({alignment:docx.AlignmentType.CENTER,children:[new docx.TextRun({text:"Belge No: "+hekimno,font:"Calibri",size:22})]})]})]})]})}
