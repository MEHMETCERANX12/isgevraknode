function calisantemsilcisitamam2(json)
{
    let calisanjson = JSON.stringify(json);
    store.set('calisanjson', calisanjson);
    store.set("dosyaciktitipi", "5");
    window.location = '/dosyacikti';
}
function calisantemsilcisigorevlendirmeyaz()
{
    if (!calisantemsilcisiverivar())
    {
        window.location.href = "/temsilcievrak";
        return false;
    }
    let temsilcijson = calisantemsilciekibi();
    if (!temsilcijson)
    {
        return false;
    }
    let gorevlendirmetarih =  store.get("gorevlendirmetarih");
    gorevlendirmetarih = tarihreturn(gorevlendirmetarih);
    let isyerijson = store.get('xjsonfirma');
    isyerijson = jsoncevir(isyerijson);
    const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell } = docx;
    const gorevlendirme = temsilcijson.map((json) =>
    {
        const temsilciaciklama =
        [
            new Paragraph({ children: [new TextRun({ text: `Tarih: ${gorevlendirmetarih}`, size: 24, font: "Calibri" })], alignment: "right", spacing: {after: 240}}),
            new Paragraph({ children: [new TextRun({ text: `İŞ SAĞLIĞI ve GÜVENLİĞİ ÇALIŞAN TEMSİLCİSİ ATAMA YAZISI`, bold: true, size: 24, font: "Calibri" })], alignment: "center", spacing: {after: 240}}),
            new Paragraph({ children: [new TextRun({ text: `\tİşyeri Unvanı: ${isyerijson.fi}`, size: 24, font: "Calibri" })], alignment: "left", spacing: {after: 120} }),
            ...(isyerijson.ad ? [new Paragraph({ children:[new TextRun({text:`\tİşyeri Adresi: ${isyerijson.ad}`,size:24,font:"Calibri"})], alignment:"left", spacing:{after:120} })] : []),
            ...(isyerijson.sc ? [new Paragraph({ children: [new TextRun({ text: `\tİşyeri Sicil No: ${isyerijson.sc}`, size: 24, font: "Calibri" })], alignment: "left", spacing: { after: 120 } })] : []),
            new Paragraph({ children: [new TextRun({ text: `\tÇalışan Adı Soyadı: ${json.x}`, size: 24, font: "Calibri" })], alignment: "left", spacing: { after: 120 } }),
            new Paragraph({ children: [new TextRun({ text: `\tÇalışan Görev/Unvan: ${json.y}`, size: 24, font: "Calibri" })], alignment: "left", spacing: {after: 240 } }),
            new Paragraph({ children: [new TextRun({ text: `\tYukarıda kimlik bilgileri yazılı çalışanımız 6331 sayılı İş Sağlığı ve Güvenliği Kanunu 20.Maddesinde belirtilen iş sağlığı ve güvenliği ile ilgili çalışmalara katılma, çalışmaları izleme, tedbir alınmasını isteme, tekliflerde bulunma ve benzeri konularda çalışanları temsil etme hususunda çalışan temsilcisi olarak atanmış ve iş bu görevi kabul etmiştir.`, size: 24, font: "Calibri" })], alignment: "both", spacing: { after: 240 } }),
        ];
        const imzatablo = new Table
        ({
            rows:
            [
                new TableRow({children:[new TableCell({width:{size:50,type:"pct"},children:[new Paragraph({alignment:"center",children:[new TextRun({text:json.x,font:"Calibri",bold:true,size:24})]})]}),new TableCell({width:{size:50,type:"pct"},children:[new Paragraph({alignment:"center",children:[new TextRun({text:isyerijson.is,font:"Calibri",bold:true,size:24})]})]})]}),
                new TableRow({children:[new TableCell({children:[new Paragraph({alignment:"center",children:[new TextRun({text:"Çalışan Temsilcisi",font:"Calibri",size:24})]})]}),new TableCell({children:[new Paragraph({alignment:"center",children:[new TextRun({text:isverenunvanioku(),font:"Calibri",size:24})]})]})]}),
                new TableRow({children:[new TableCell({children:[new Paragraph({alignment:"center",children:[new TextRun({text:"İmza",font:"Calibri",size:24})]})]}),new TableCell({children:[new Paragraph({alignment:"center",children:[new TextRun({text:"İmza",font:"Calibri",size:24})]})]})]})
            ],
            borders: { top: { size: 0, color: "FFFFFF" }, bottom: { size: 0, color: "FFFFFF" }, left: { size: 0, color: "FFFFFF" }, right: { size: 0, color: "FFFFFF" }, insideHorizontal: { size: 0, color: "FFFFFF" }, insideVertical: { size: 0, color: "FFFFFF" } },
            width: { size: 100, type: "pct" },
        });
        return { children: [...temsilciaciklama, imzatablo] };
    });
    if (temsilcijson.length > 1)
    {
        let calisanbastemsiciadsoyad = "";
        let calisanbastemsiciunvan = "";
        const bastemsilci = temsilcijson.find(x => x.ekipgorev === "Çalışan Baş Temsilcisi");
        if (bastemsilci)
        {
            calisanbastemsiciadsoyad = bastemsilci.x;
            calisanbastemsiciunvan = bastemsilci.y;
        }
        let bastemsilciaciklama =
        [
            new Paragraph({ children: [new TextRun({ text: `Tarih: ${gorevlendirmetarih}`, size: 24, font: "Calibri" })], alignment: "right", spacing: {after: 240}}),
            new Paragraph({ children: [new TextRun({ text: `İŞ SAĞLIĞI ve GÜVENLİĞİ ÇALIŞAN BAŞ TEMSİLCİSİ SEÇİM TUTANAĞI`, bold: true, size: 24, font: "Calibri" })], alignment: "center", spacing: {after: 240}}),
            new Paragraph({ children: [new TextRun({ text: `\tİşyeri Unvanı: ${isyerijson.fi}`, size: 24, font: "Calibri" })], alignment: "left", spacing: {after: 120} }),
            ...(isyerijson.ad ? [new Paragraph({ children:[new TextRun({text:`\tİşyeri Adresi: ${isyerijson.ad}`,size:24,font:"Calibri"})], alignment:"left", spacing:{after:120} })] : []),
            ...(isyerijson.sc ? [new Paragraph({ children: [new TextRun({ text: `\tİşyeri Sicil No: ${isyerijson.sc}`, size: 24, font: "Calibri" })], alignment: "left", spacing: { after: 120 } })] : []),
            new Paragraph({ children: [new TextRun({ text: `\tÇalışan Baş Temsilcisi Adı Soyadı: ${calisanbastemsiciadsoyad}`, size: 24, font: "Calibri" })], alignment: "left", spacing: {after: 120} }),
            new Paragraph({ children: [new TextRun({ text: `\tÇalışan Baş Temsilcisi Görev/Unvan: ${calisanbastemsiciunvan}`, size: 24, font: "Calibri" })], alignment: "left", spacing: {after: 240 } }),
            new Paragraph({ children: [new TextRun({ text: `\tİşyerinde görevli olan çalışan temsilcileri yukarıda adı soyadı ve unvanı yazılı olan kişiyi, çalışan baş temsilcisi olarak seçmişlerdir. Bu seçim, tüm temsilcilerin ortak onayı ile yapılmıştır.`, size: 24, font: "Calibri" })], alignment: "both", spacing: { after: 240 } }),
        ];
        const imzatablo = new Table
        ({
            rows:
            [
                new TableRow({children:[new TableCell({width:{size:50,type:"pct"},children:[new Paragraph({alignment:"center",children:[new TextRun({text:calisanbastemsiciadsoyad,font:"Calibri",bold:true,size:24})]})]}),new TableCell({width:{size:50,type:"pct"},children:[new Paragraph({alignment:"center",children:[new TextRun({text:isyerijson.is,font:"Calibri",bold:true,size:24})]})]})]}),
                new TableRow({children:[new TableCell({children:[new Paragraph({alignment:"center",children:[new TextRun({text:"Çalışan Baş Temsilcisi",font:"Calibri",size:24})]})]}),new TableCell({children:[new Paragraph({alignment:"center",children:[new TextRun({text:isverenunvanioku(),font:"Calibri",size:24})]})]})]}),
                new TableRow({children:[new TableCell({children:[new Paragraph({alignment:"center",children:[new TextRun({text:"İmza",font:"Calibri",size:24})]})]}),new TableCell({children:[new Paragraph({alignment:"center",children:[new TextRun({text:"İmza",font:"Calibri",size:24})]})]})]})
            ],
            borders: { top: { size: 0, color: "FFFFFF" }, bottom: { size: 0, color: "FFFFFF" }, left: { size: 0, color: "FFFFFF" }, right: { size: 0, color: "FFFFFF" }, insideHorizontal: { size: 0, color: "FFFFFF" }, insideVertical: { size: 0, color: "FFFFFF" } },
            width: { size: 100, type: "pct" },
        });
        const temsilcitablo = new Table
        ({
            rows:
            [
                new TableRow({height:{value:600,rule:"atLeast"},children:[new TableCell({verticalAlign:"center",width:{size:45,type:"pct"},children:[new Paragraph({alignment:"center",children:[new TextRun({text:"Çalışan Adı Soyadı",bold:true,font:"Calibri",size:24})]})]}),new TableCell({verticalAlign:"center",width:{size:25,type:"pct"},children:[new Paragraph({alignment:"center",children:[new TextRun({text:"Temsilci Görevi",bold:true,font:"Calibri",size:24})]})]}),new TableCell({verticalAlign:"center",width:{size:30,type:"pct"},children:[new Paragraph({alignment:"center",children:[new TextRun({text:"İmza",bold:true,font:"Calibri",size:24})]})]})]}),
                ...temsilcijson.map(item => new TableRow({height:{value:1000,rule:"atLeast"},children:[new TableCell({verticalAlign:"center",margins:{left:75},children:[new Paragraph({alignment:"left",children:[new TextRun({text:item.x,font:"Calibri",size:24})]})]}),new TableCell({verticalAlign:"center",margins:{left:75},children:[new Paragraph({alignment:"left",children:[new TextRun({text:item.ekipgorev,font:"Calibri",size:24})]})]}),new TableCell({verticalAlign:"center",children:[new Paragraph({alignment:"center",children:[new TextRun({text:"",font:"Calibri",size:24})]})]})]}))
            ],
            width: { size: 100, type: "pct" },
        });
        gorevlendirme.push({children:[...bastemsilciaciklama,imzatablo,new Paragraph({text:""}),new Paragraph({text:""}),new Paragraph({text:""}),new Paragraph({text:""}),new Paragraph({text:""}),new Paragraph({text:""}), temsilcitablo]});
    }
    const doc = new Document({sections:gorevlendirme.map(s=>({properties:{page:{size:{width:11906,height:16838,orientation:"portrait"},margin:{top:1134,right:1134,bottom:1134,left:1134}}},children:s.children}))});
    Packer.toBlob(doc).then(blob => saveAs(blob, "Temsilci Görevlendirme.docx"));
}

function calisantemsilciekibi()
{
    const ekipliste = {0:"Görevli Değil",1:"Çalışan Temsilcisi",2:"Çalışan Baş Temsilcisi"};
    let json = jsoncevir(store.get('calisanjson'));
    if (!json || json.length === 0) { alertify.error("Kayıtlı çalışan bulunamadı"); return false; }
    json = json.filter(x => x.t !== 0);
    if (!json || json.length === 0) { alertify.error("Çalışan temsilcisi bulunamadı"); return false; }
    if (json.length === 1)
    {
        if (json[0].t !== 1)
        {
            alertify.error("Çalışan baş temsilcisisi değil, çalışan temsilcisi görevlendiriniz.");
            return false;
        }            
    }
    else
    {
        const t2Count = json.filter(x => x.t === 2).length;
        const tInvalid = json.some(x => x.t !== 1 && x.t !== 2);
        if (t2Count !== 1 || tInvalid)
        {
            alertify.error("Bir çalışan baş temsilcisi, diğerlerini çalışan temsilcisi olarak görevlendiriniz.");
            return false;
        }
    }
    json.sort((a, b) => b.t - a.t);
    const temsilcijson=json.map(item=>({x:item.x,y:item.y,ekipgorev:ekipliste[item.t]||"Bilinmiyor"}));
    return temsilcijson;
}

function calisantemsilcisikatilimyaz()
{
    if (!calisantemsilcisiverivar())
    {
        window.location.href = "/temsilcievrak";
        return false;
    }
    let temsilcijson = calisantemsilciekibi();
    if (!temsilcijson)
    {
        return false;
    }
    let egitimtarih =  store.get("egitimtarih");
    egitimtarih = tarihreturn(egitimtarih);
    let egitimsaat =  store.get("egitimsaat");
    let isyerijson = store.get('xjsonfirma');
    isyerijson = jsoncevir(isyerijson);
    let uzmanad = store.get("uzmanad");
    let uzmanno = store.get("uzmanno");
    let hekimad = isyerijson.hk;
    let hekimno = isyerijson.hn;
    let isyeriismi = isyerijson.fi;
    let egitimyeri = "Örgün";
    let konu = "Çalışan temsilcilerinin görev, yetki ve sorumlulukları, Risk değerlendirme süreci, İş kazaları ve meslek hastalıkları, Acil durum önlemleri, İş sağlığı ve güvenliği mevzuatı, çalışanların hakları ve yükümlülükleri";
    let katilimlistesi = [];
    katilimlistesi.push(...temscilcikatilimustbilgi(isyeriismi, egitimtarih, egitimyeri, egitimsaat, konu));
    temsilcijson.forEach((item, index) =>
    {
    katilimlistesi.push
    ([
        { text: (index + 1).toString(), alignment: 'center', fontSize: 10, margin:[0,15] },
        { text: item.x, alignment: 'left', fontSize: 10, margin:[0,15] },
        { text: item.ekipgorev, alignment: 'left', fontSize: 10, margin:[0,15] },
        { text: '', alignment: 'center', fontSize: 10, margin:[0,15] }
    ]);
    });
    katilimlistesi.push([{text:uzmanad,alignment:'center',fontSize:10,bold:true,colSpan:2,margin:[0,0]},{},{text:hekimad,alignment:'center',fontSize:10,bold:true,colSpan:2,margin:[0,0]},{}]);
    katilimlistesi.push([{text:'İş Güvenliği Uzmanı - Belge No: '+uzmanno,alignment:'center',fontSize:10,colSpan:2,margin:[0,0]},{},{text:'İşyeri Hekimi - Belge No: '+hekimno,alignment:'center',fontSize:10,colSpan:2,margin:[0,0]},{}]);
    katilimlistesi.push([{text:'',colSpan:2,margin:[25,25]}, {}, {text:'',colSpan:2,margin:[25,25]}, {}]);
    let pdficerik =
    {
        pageOrientation: 'portrait',
        pageSize: 'A4',
        content: [{table: { widths: ['7%', '43%', '25%', '25%'], body: katilimlistesi}}]
    };
    pdfMake.createPdf(pdficerik).download("Temsilci Katılım Listesi.pdf");
}

function temscilcikatilimustbilgi(i, t, e, s, k)
{
    return [
        [{ text: 'ÇALIŞAN TEMSİLCİSİ EĞİTİMİ - KATILIM TUTANAĞI', colSpan: 4, alignment: 'center', fontSize: 11, bold: true, margin: [2, 2] }, '', '', ''],
        [{ text: `İşyeri Unvanı: ${i}`, colSpan: 4, alignment: 'left', fontSize: 10, margin: [2, 2] }, '', '', ''],
        [{ colSpan: 4, alignment: 'left', fontSize: 10, margin: [2, 2], text: [{ text: `Eğitim Tarihi: ${t}\t\t\t\tEğitim Şekli: ${e}\t\t\t\tSüresi: ${s}` }] }, '', '', ''],
        [{ text: 'EĞİTİM KONULARI', colSpan: 4, alignment: 'center', fontSize: 11, bold: true, margin: [2, 2] }, '', '', ''],
        [{ text: k, colSpan: 4, alignment: 'justify', fontSize: 10, margin: [0, 5] }, '', '', ''],
        [
            { text: 'Sıra', alignment: 'center', fontSize: 10, margin: [0, 5], bold: true },
            { text: 'Ad Soyad', alignment: 'center', fontSize: 10, margin: [0, 5], bold: true },
            { text: 'Unvan', alignment: 'center', fontSize: 10, margin: [0, 5], bold: true },
            { text: 'İmza', alignment: 'center', fontSize: 10, margin: [0, 5], bold: true }
        ]
    ];
}

async function calisantemsilcisisertifikakontrol()
{
    if (!calisantemsilcisiverivar())
    {
        window.location.href = "/temsilcievrak";
        return false;
    }
    $('#loading').show();
    $.when(calisantemsilcisisertifikayaz())
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

async function calisantemsilcisisertifikayaz()
{
    let uzmanad = store.get("uzmanad");
    let uzmanno = store.get("uzmanno");
    let isyeri = jsoncevir(store.get('xjsonfirma'));
    let hekimad = isyeri.hk;
    let hekimno = isyeri.hn;
    let temsilcijson = calisantemsilciekibi();
    let isyeriismi = isyeri.fi;
    let isverenvekili = isyeri.is;
    let tarih = tarihreturn(store.get("egitimtarih"));
    let egitimsaat =  store.get("egitimsaat");
    let egitimyeri = "Örgün";
    let egitimicerik = {"baslik":"ÇALIŞAN TEMSİLCİSİ EĞİTİM KATILIM SERTİFİKASI","paragraf":"\u200B\t\t\tAdı ve soyadı yukarıda belirtilen çalışan, ‘Çalışanların İş Sağlığı ve Güvenliği Eğitimlerinin Usul ve Esasları Hakkında Yönetmeliği’ kapsamında düzenlenen çalışan temsilcisi eğitim programına katılmış ve başarıyla tamamlamıştır.","maddeler":["Çalışan temsilcilerinin görev, yetki ve sorumlulukları","Risk değerlendirmesi","İş kazaları ve meslek hastalıkları","Acil durum önlemleri","İş sağlığı ve güvenliği mevzuatı, çalışanların hakları ve yükümlülükleri"]};
    let bosluk = 60;
    const iconBase64 = 'data:image/png;base64,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AADGPwAIACACAGD8A4AAACIAAMY/AAgAIAIAYPwDgAAAIgAAxj8ACAAgAgAY/8Y/AAgAIAIAGP8AgAAAIgCA8Q8ACAAgAgAY/wAgAAAiAIDxDwACACACABj/ACAAgAgAgPEPAAIAiAAAGP8AIACACABg/AMAAgCIAADGPwAgAIAIAGD8AwACAIgAAMY/AAgAgAgAYPwDgAAAiAAAxj8ACACACABg/AOAAAAigAgAGP8AgAAAIgCA8Q8ACAAgAgAY/wCAAAAiAIDxDwAIACACABj/ACAAACIAgPEPAAIAIAIAGP8AIAAAIgCA8Q8AAgAgAgDGPwAgAAAiAGD8AwACAIgAAMY/ACAAgAgAYPwDAAIAiAAAxj8ACACOAEQAAOMfAAQAQAQAMP4BQAAARADA+AcABABABACMfwBAAABEAMD4BwAEAEAEAIx/AEAAABFABACMfwBAAAARAMD4BwAEABABAIx/ABAAABEAMP4BAAEAEAEA4x8AEAAAEQAw/gEAAQAQAQDjHwAQAAARADD+AQABABABAOMfABAAABEAMP4BAAEARAAA4x8ABABABACMfwBAAABEAMD4BwAEAEAEAIx/AEAAAEQAwPgHAAQAQAQAjH8AQAAARADA+AcABABABACMfwBAAABEADD+AQABABABRAAw/gEAAQAQAQDjHwAQAAARADD+AQABABABAOMfABAAABEAMP4BAAEAEAEA4x8AEAAAEQCMf+MfABAAABEAjH8AAAEAEAHA+AcABAAAEQCMfwBAAABEAMD4BwAEAEAEAIx/AEAAAEQAwPgHAAQAQAQAjH8AQAAARAAw/gEABABABADjHwBAAABEADD+AQABAEAEAOMfABAAAEQAMP4BAAEAEAFEADD+AQABABABAOMfABAAABEAjH8AAAEAEAHA+AcAEAAAEQCMfwAAAQAQAcD4BwAEAAARAIx/AEAAABABwPgHAAQAABEAjH8AQAAAEAHA+AcABABABADjHwBAAABEADD+AQAEAEAEAOMfAEAAAEQAMP4BAAQAQAQA4x8AEAAARAAw/gEAAQBABADjHwAQAABEAIx/AAABAEAEwPgHABAAAEQAjH8AAAEAEAHA+AcAEAAAEQCMfwAAAQAQAcD4BwAEAAARAIx/AEAAABABMP4BAAQAABEA4x8AQAAAEAEw/gEABAAAEQDjHwBAAAAQATD+AQAEAEAEEAEw/gEABABABADjHwAQAABEADD+AQABAEAEwPgHABAAAEQAjH8AAAEAQATA+AcAEAAARACMfwAAAQBABMD4BwAQAABEAIx/AAABAEAEwPgHABAAABEA4x8AQAAAEAEw/gEABAAAEQDjHwBAAAAQATD+AQAEAAARAOMfAEAAABABMP4BAAQAABEA4x8AQAAAOHcEMBiNfwCAsG46AoCiaNv2l/R6XZZllf5y6kSMfwAAAQAgdggQAYYp38Xx5zT+/+ooAAA+zkcAAP5PGpEP0tsDJzGo8X83/b4dOQoAAAEAYNMIcJje7nXjkv7KD2/8Kv1+eYgjAIAAAHDuCJB/ouwbAvrrsFj/5F+kAQA4gx1HAHC63d3dSXp7kV57TqM3POwPAGBDHgII8AndNwT8rSzLn9Nf3kmvW07l2uS7Mf6Yxv/fHQUAwGZ8BADgjNLofFb4SMB1en/+Pu8PAHA+PgIAcA67u7tP0ttjJ3EllsX6lv+5owAAOD93AACcQxqjOQDcLtwNcNnyT/1vG/8AANtzBwDAlnZ3dx8V67sBJk7jwuSwsm/4AwAIAAB9iwB5/B+k18xpbGXVDf9DRwEAIAAA9DkEVF0I8JWBmw//5+n1LI3/leMAABAAAIYSAupi/bGA2mkY/gAAAgDAOELA/cJHAwx/AAABAGAUIaAq1ncE5I8GjPlhgctu+B8a/gAAAgBA5BAw6SLAw/Sajugf/TC9XnqqPwCAAAAwxhiQA8D9LghUAf8R81f55Z/2H/lpPwCAAABArBgwT6/X3ehf+p0FABAAAPjtGFB1IeCbYv0tAn1+ZsDyg9E/95N+AAABAIDzB4F8d8C0CwInv74Oedzn2/qPu/eFn/IDAAgAAFx+FKi6GPBl9+vJBcWBefd+/MFfL419AAABAID+BYKNYoCn8wMAAAAAAARwwxEAAACAAAAAAAAIAAAAAIAAAAAAAAgAAAAAgAAAAAAACAAAAACAAAAAAAAIAAAAACAAAAAAAAIAAAAAIAAAAAAAAgAAAAAgAAAAAAACAAAAACAAAAAAAAIAAAAACAAAAACAAAAAAAAIAAAAAIAAAAAAAAgAAAAAgAAAAAAACAAAAACAAAAAAAACAAAAACAAAAAAAAIAAAAAIAAAAAAAAgAAAAAgAAAAAAACAAAAACAAAAAAAAIAAAAACAAAAACAAAAAAAAIAAAAAIAAAAAAAAgAAAAAgAAAAAAACAAAAACAAAAAAAACAAAAACAAAAAAAAIAAAAAIAAAAAAAAgAAAAAgAAAAAAACAAAAACAAAAAAgAAAAAAACAAAAACAAAAAAAAIAAAAAIAAAAAAAAgAAAAAgAAAAAAACAAAAACAAAAAAAACAAAAACAAAAAAAAIAAAAAIAAAAAAAAgAAAAAgAAAAAAACAAAAACAAAAAAgAAAAAAACAAAAACAAAAAAAAIAAAAAIAAAAAAAAgAAAAAgAAAAAAACAAAAAAgAAAAAAACAAAAACAAAAAAAAIAAAAAIAAAAAAAAgAAAAAgAAAAAAACAAAAACAAAAAAgAAAAAAACAAAAACAAAAAAAAIAAAAAIAAAAAAAAgAAAAAgAAAAAAACAAAAAAgAAAAAAACAAAAACAAAAAAAAIAAAAAIAAAAAAAAgAAAAAgAAAAAAACAAAAAAgAAAAAgAAAAAAACAAAAACAAAAAAAAIAAAAAIAAAAAAAAgAAAAAgAAAAAAACAAAAAAgAAAAAAACAAAAACAAAAAAAAIAAAAAIAAAAAAAAgAAAAAgAAAAAAACAAAAAAgAAAAAgAAAAAAACAAAAACAAAAAAAAIAAAAAIAAAAAAAAgAAAAAgAAAAAAAAgAAAAAgAAAAAAACAAAAACAAAAAAAAIAAAAAIAAAAAAAAgAAAAAgAAAAAAACAAAAAAgAAAAAgAAAAAAACAAAAACAAAAAAAAIAAAAAIAAAAAAAAgAAAAAgAAAAAAAAgAAAAAgAAAAAAACAAAAACAAAAAAAAIAAAAAIAAAAAAAAgAAAAAgAAAAAIAAAAAAAAgAAAAAgAAAAAAACAAAAMB/2bEDGQAAAIBB/tb3+AojAAEAAAAACAAAAABAAAAAAAACAAAAABAAAAAAIAAAAAAAAQAAAAAIAAAAAEAAAAAAAAIAAAAAEAAAAACAAAAAAAAEAAAAAAgAAAAAQAAAAAAAAgAAAAAQAAAAAIAAAAAAAAQAAAAAIAAAAAAAAQAAAAACAAAAABAAAAAAgAAAAAAABAAAAAAgAAAAAAABAAAAAAgAAAAAQAAAAAAAAgAAAAAEAAAAACAAAAAAAAEAAAAACAAAAABAAAAAAAACAAAAABAAAAAAgAAAAAAAAQAAAAAIAAAAAEAAAAAAAAIAAAAAEAAAAACAAAAAAAAEAAAAACAAAAAAQAAAAAAAAgAAAAAQAAAAAIAAAAAAAAQAAAAAIAAAAAAAAQAAAAAIAAAAAEAAAAAAgAAAAAAAFhJAgAEApKo6nvcfVk8AAAAASUVORK5CYII=';
    const dokumanicerik =
    {
        images: { tickIcon: iconBase64, },
        styles:{ustbaslik:{fontSize:14,bold:true,alignment:'center'},normalsatir:{fontSize:11,alignment:'justify'}},
        pageOrientation: 'landscape',
        content: temsilcijson.map((calisan, index) =>
        {
            const content =
            [
                { text: egitimicerik.baslik, style: 'ustbaslik', margin: [0, 50, 0, 10] },
                { text: 'İşyeri Unvanı: ' + isyeriismi, style: 'normalsatir', margin: [80, 0, 0, 5] },
                { text: 'Katılımcı Adı Soyadı: ' + calisan.x, style: 'normalsatir', margin: [80, 0, 0, 5] },
                { text: 'Katılımcının Görev Unvanı: ' + calisan.y + " - " + calisan.ekipgorev, style: 'normalsatir', margin: [80, 0, 0, 5] },
                { text: 'Tarih: ' + tarih, style: 'normalsatir', margin: [80, 0, 0, 5] },
                { text: 'Eğitim Süresi: ' + egitimsaat, style: 'normalsatir', margin: [80, 0, 0, 5] },
                { text: 'Eğitim Şekli: ' + egitimyeri, style: 'normalsatir', margin: [80, 0, 0, 5] },
                { text: egitimicerik.paragraf, style: 'normalsatir', margin: [46, 0, 50, 5] },
                ...egitimicerik.maddeler.map(madde =>
                ({
                    columns:
                    [
                        {image:'tickIcon',width:11,height:14,margin:[80,0,0,0]},
                        {text:madde,style:'normalsatir',margin:[85,0,50,0]}
                    ],
                    columnGap: 5,
                    margin: [0, 2, 0, 2]
                })),
                { text: '', margin: [0, bosluk] },
                genelucluimzatablo(uzmanad, isverenvekili, hekimad, uzmanno, hekimno)
            ];
            if (index < temsilcijson.length - 1)
            {
                content.push({ text: '', pageBreak: 'after' });
            }
            return content;
        }).flat()
    };
    sertifikaarkaplan(dokumanicerik);
    const pdfcikti = pdfMake.createPdf(dokumanicerik);
    pdfcikti.getBlob((blob) => {saveAs(blob, 'Temsilci Sertifika.pdf');});
}

function calisantemsilcisiverivar()
{
    const json = jsoncevir(store.get('calisanjson'));
    return Array.isArray(json) && json.length > 0;
}

function genelucluimzatablo(a,b,c,d,e){return{table:{widths:[47,207,207,207,47],body:[["",{text:a,alignment:"center",fontSize:11,bold:!0},{text:b,alignment:"center",fontSize:11,bold:!0},{text:c,alignment:"center",fontSize:11,bold:!0},""],["",{text:"İş Güvenliği Uzmanı",alignment:"center",fontSize:11},{text:isverenunvanioku(),alignment:"center",fontSize:11},{text:"İşyeri Hekimi",alignment:"center",fontSize:11},""],["",{text:"Belge No: "+d,alignment:"center",fontSize:11},"",{text:"Belge No: "+e,alignment:"center",fontSize:11},""]]},layout:"noBorders"}}
