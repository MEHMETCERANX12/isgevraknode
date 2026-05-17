function iskazasitutanak1load()
{
    isyerigetir();
    $("#hastanebolum").hide();
    $("#tibbimudahale").on("change", function ()
    {
        let deger = $(this).val();
        if (deger === "1")
        {
            $("#hastanebolum").slideDown();
        }
        else
        {
            $("#hastanebolum").slideUp();
        }
    });
}
function iskazatutanakdevam1()
{
    let firmaid = firmasecimoku();
    if (!firmaid)
    {
        alertify.error("Lütfen işyeri seçiniz");
        return;
    }
    let tibbimudahale = $("#tibbimudahale").val();
    if (!tibbimudahale)
    {
        alertify.error("Sağlık Kuruluşunda Tıbbi Müdahale Yapılıp Yapılmadığını Seçiniz");
        return;
    }
    let tutanaktarih = $("#tutanaktarih").val();
    let kazatarih = $("#kazatarih").val();
    let saat = $("#saat").val();
    let kazayeri = $("#kazayeri").val();
    let kazaadsoyad = $("#kazaadsoyad").val();
    kazaadsoyad = adsoyadduzelt(kazaadsoyad);
    let kazasiddet = $("#kazasiddet").val();
    let yapilanis = $("#yapilanis").val();
    let hastanead = $("#hastanead").val();
    let kazaanlatim = $("#kazaanlatim").val();
    if (tibbimudahale === "1" && !hastanead)
    {
        alertify.error("Lütfen sağlık kuruluşunun adını giriniz");
        return;
    }
    let tutanakjson={firmaid:firmaid,kazaadsoyad:kazaadsoyad,tutanaktarih:tutanaktarih,kazatarih:kazatarih,saat:saat,kazayeri:kazayeri,kazasiddet:kazasiddet,yapilanis:yapilanis,tibbimudahale:tibbimudahale,hastanead:hastanead,kazaanlatim:kazaanlatim};
    store.set("iskazasiicerik", tutanakjson);
    window.location.href = "/iskazatutanak2";
}

function iskazatutanakload2()
{
    let firmajson = isyersecimfirmaoku();
    let isveren = firmajson.is || "";
    let uzmanad = store.get("uzmanad") || "";
    var veri = Array.from({ length: 10 }, function (_, i)
    {
        if (i === 0)
        { return { adsoyad: isveren, unvan: isverenunvanioku() }; }
        else if (i === 1)
        { return { adsoyad: uzmanad, unvan: "İş Güvenliği Uzmanı" }; }
        else
        { return { adsoyad: "", unvan: "" }; }        
    });
    $('#kurultablo').DataTable
    ({
        data: veri,
        dom: 't',
        pageLength: -1,
        ordering: false,
        columns:
        [
            {data:null,title:'No',width: "50px", render:function(d,t,r,m){return m.row+1;}},
            {data:'adsoyad',title:'Ad Soyad',width: "425px",render:function(d,t,r){return`<input type="text" value="${d}" class="csstextbox90" onblur="adsoyadduzelt(this)" autocomplete="off">`;}},
            {data:'unvan',title:'Unvan',width: "425px",render:function(d,t,r){return`<input type="text" value="${d}" class="csstextbox90">`;}},
        ],
        createdRow: function (r) { $(r).find('td').eq(0).css('text-align', 'center'); },
        headerCallback: function (t) { $(t).find('th').css('text-align', 'center'); }
    });
}

async function iskazatutanakwordcikti()
{
    let tablo = $('#kurultablo').DataTable();
    let json = [];
    tablo.rows().every(function ()
    {
        let row = $(this.node());
        let adsoyad = row.find('td:eq(1) input').val().trim();
        adsoyad = adsoyadduzelt(adsoyad);
        let unvan = row.find('td:eq(2) input').val().trim();

        if (adsoyad !== "")
        {
            json.push({ adsoyad: adsoyad, unvan: unvan});
        }
    });
    let tutanak = store.get("iskazasiicerik") || {};
    let tutanaktarih = tutanak.tutanaktarih || "......../......../20....";
    let isyeri = jsoncevir(store.get("xjsonfirma"));
    let isyeriunvan = isyeri.fi;
    let isyeriadres = isyeri.ad;
    let isyerisicil = isyeri.sc || "";
    let kazatarih = tutanak.kazatarih || "......../......../20....";
    let saat = tutanak.saat || ".....:.....";
    let kazayeri = tutanak.kazayeri || "";
    let kazaadsoyad = tutanak.kazaadsoyad || "";
    let kazasiddet = tutanak.kazasiddet || "";
    let yapilanis = tutanak.yapilanis || "";
    let hastanead = tutanak.hastanead || "";
    let kazaanlatim = tutanak.kazaanlatim || "";
    let tehlikesinifimap = { 1: "Az Tehlikeli", 2: "Tehlikeli", 3: "Çok Tehlikeli" };
    let tehlikesinifi = tehlikesinifimap[parseInt(isyeri.ts)];
    const { Document, Packer, TextRun, Paragraph, Table, TableRow, TableCell, WidthType, BorderStyle, AlignmentType, HeightRule, VerticalAlign, PageBreak } = docx;
    let planustbilgi = [];
    planustbilgi.push(new Paragraph({ spacing: { after: 100 }, children: [ new TextRun({ text: "Tarih: ", bold: true }), new TextRun({ text: tutanaktarih }) ], style: "Sagayasli" }));
    planustbilgi.push(new Paragraph({ text: "İŞ KAZASI TUTANAĞI", spacing: { after: 250 }, style: "Baslik" }));
    planustbilgi.push(new Paragraph({ spacing: { after: 100 }, children: [ new TextRun({ text: "\tİşyeri Unvanı: ", bold: true }), new TextRun({ text: isyeriunvan })], style: "Normal" }));
    planustbilgi.push(new Paragraph({ spacing: { after: 100 }, children: [ new TextRun({ text: "\tİşyeri Adresi: ", bold: true }), new TextRun({ text: isyeriadres })], style: "Normal" }));
    planustbilgi.push(new Paragraph({ spacing: { after: 100 }, children: [ new TextRun({ text: "\tTehlike Sınıfı: ", bold: true }), new TextRun({ text: tehlikesinifi })], style: "Normal"}));
    if (isyerisicil)
    {
        planustbilgi.push(new Paragraph({ spacing: { after: 100 }, children: [new TextRun({ text: "\tSGK Sicil No: ", bold: true }), new TextRun({ text: isyerisicil })], style: "Normal" }));
    }
    planustbilgi.push(new Paragraph({ spacing: { after: 100 }, children: [new TextRun({ text: "\tİş Kazası Geçiren Kişi Ad Soyad: ", bold: true }), new TextRun({ text: kazaadsoyad })], style: "Normal" }));
    planustbilgi.push(new Paragraph({ spacing: { after: 100 }, children: [new TextRun({ text: "\tİş Kazasının Gerçekleştiği Tarih: ", bold: true }), new TextRun({ text: kazatarih })], style: "Normal" }));
    planustbilgi.push(new Paragraph({ spacing: { after:100 }, children:[new TextRun({text:"\tİş Kazası Saati: ",bold:true}),new TextRun({text:saat})],style:"Normal"}));
    planustbilgi.push(new Paragraph({ spacing: { after: 100 }, children: [ new TextRun({ text: "\tİş Kazasının Gerçekleştiği Yer: ", bold: true }), new TextRun({ text: kazayeri })], style: "Normal"}));
    if (hastanead)
    {
        planustbilgi.push(new Paragraph({ spacing: { after: 100 }, children: [new TextRun({ text: "\tTedavinin Yapıldığı Sağlık Kuruluşunun Adı: ", bold: true }), new TextRun({ text: hastanead })], style: "Normal" }));
    }
    planustbilgi.push(new Paragraph({ spacing: { after: 100 }, children: [new TextRun({ text: "\tİş Kazası Sırasında Yürütülen Faaliyet: ", bold: true }), new TextRun({ text: yapilanis })], style: "Normal" }));
    planustbilgi.push(new Paragraph({ spacing: { after: 100 }, children: [new TextRun({ text: "\tİş Kazası Nedeniyle Meydana Gelen Yaralanma: ", bold: true }), new TextRun({ text: kazasiddet })], style: "Normal" }));
    planustbilgi.push(new Paragraph({ text: "\tİş Kazasının Meydana Geliş Şekli ve Detayları:", spacing: { after: 100 }, style: "Kalinsol" }));
    planustbilgi.push(new Paragraph({ text: "\t" + kazaanlatim, spacing: { after: 100 }, style: "Normal" }));
    if (json.length)
    {
        planustbilgi.push(new Paragraph({text:"",spacing:{after:300}}));
        planustbilgi.push(iskazasiimza(json));
    }
    let children = [...planustbilgi];
    const doc = new Document
    ({
        styles:
        {
            paragraphStyles:
            [
                { id: "Normal", run: { font: "Calibri", size: 22 }, paragraph: { alignment: AlignmentType.JUSTIFIED } },
                { id: "Kalin", run: { font: "Calibri", size: 22, bold: true }, paragraph: { alignment: AlignmentType.CENTER } },
                { id: "Baslik", run: { font: "Calibri", size: 24, bold: true }, paragraph: { alignment: AlignmentType.CENTER } },
                { id: "Kalinsol", run: { font: "Calibri", size: 22, bold: true }, paragraph: { alignment: AlignmentType.LEFT } },
                { id: "Sagayasli", run: { font: "Calibri", size: 22 }, paragraph: { alignment: AlignmentType.RIGHT } },
            ]
        },
        sections:
        [{
            properties: { page: { margin: { top: 1000, right: 850, bottom: 1000, left: 850, header: 500, footer: 850 } } },
            children: children,
        }]
    });
    const blob = await Packer.toBlob(doc);
    saveAs(blob, "İş Kazası Tutanağı - " + metinuret(3) + ".docx");
}
function iskazasiimza(json){const rows=[];const{TextRun,Paragraph,Table,TableRow,TableCell,WidthType,BorderStyle,AlignmentType,HeightRule,VerticalAlign}=docx;const chunkSize=3;for(let i=0;i<json.length;i+=chunkSize){const grup=json.slice(i,i+chunkSize);rows.push(new TableRow({children:grup.map(x=>new TableCell({borders:{top:{style:BorderStyle.NONE},bottom:{style:BorderStyle.NONE},left:{style:BorderStyle.NONE},right:{style:BorderStyle.NONE}},verticalAlign:VerticalAlign.CENTER,children:[new Paragraph({alignment:AlignmentType.CENTER,children:[new TextRun({text:x.adsoyad,bold:true,font:"Calibri",size:22})]})]}))}));rows.push(new TableRow({children:grup.map(x=>new TableCell({borders:{top:{style:BorderStyle.NONE},bottom:{style:BorderStyle.NONE},left:{style:BorderStyle.NONE},right:{style:BorderStyle.NONE}},verticalAlign:VerticalAlign.CENTER,children:[new Paragraph({alignment:AlignmentType.CENTER,children:[new TextRun({text:x.unvan,font:"Calibri",size:22})]})]}))}));rows.push(new TableRow({children:grup.map(()=>new TableCell({borders:{top:{style:BorderStyle.NONE},bottom:{style:BorderStyle.NONE},left:{style:BorderStyle.NONE},right:{style:BorderStyle.NONE}},verticalAlign:VerticalAlign.CENTER,children:[new Paragraph({alignment:AlignmentType.CENTER,children:[new TextRun({text:"İmza",font:"Calibri",size:22})]})]}))}));rows.push(new TableRow({height:{value:1100,rule:HeightRule.EXACT},children:grup.map(()=>new TableCell({borders:{top:{style:BorderStyle.NONE},bottom:{style:BorderStyle.NONE},left:{style:BorderStyle.NONE},right:{style:BorderStyle.NONE}},children:[new Paragraph(" ")]}))}));}return new Table({width:{size:100,type:WidthType.PERCENTAGE},borders:{top:{style:BorderStyle.NONE},bottom:{style:BorderStyle.NONE},left:{style:BorderStyle.NONE},right:{style:BorderStyle.NONE},insideHorizontal:{style:BorderStyle.NONE},insideVertical:{style:BorderStyle.NONE}},rows:rows});}

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
        return veri.value;
    }
    if (typeof veri === "string")
    {
        return formatla(veri);
    }
    return "";
}
