function genelucluimzatablo(a,b,c,d,e){return{table:{widths:[47,207,207,207,47],body:[["",{text:a,alignment:"center",fontSize:11,bold:!0},{text:b,alignment:"center",fontSize:11,bold:!0},{text:c,alignment:"center",fontSize:11,bold:!0},""],["",{text:"İş Güvenliği Uzmanı",alignment:"center",fontSize:11},{text:isverenunvanioku(),alignment:"center",fontSize:11},{text:"İşyeri Hekimi",alignment:"center",fontSize:11},""],["",{text:"Belge No: "+d,alignment:"center",fontSize:11},"",{text:"Belge No: "+e,alignment:"center",fontSize:11},""]]},layout:"noBorders"}}
function docxucluimzadikey(uzman,uzmanno,hekim,hekimno,isveren){return new docx.Table({width:{size:100,type:docx.WidthType.PERCENTAGE},borders:{top:{style:docx.BorderStyle.NONE,size:0,color:"FFFFFF"},bottom:{style:docx.BorderStyle.NONE,size:0,color:"FFFFFF"},left:{style:docx.BorderStyle.NONE,size:0,color:"FFFFFF"},right:{style:docx.BorderStyle.NONE,size:0,color:"FFFFFF"},insideHorizontal:{style:docx.BorderStyle.NONE,size:0,color:"FFFFFF"},insideVertical:{style:docx.BorderStyle.NONE,size:0,color:"FFFFFF"}},rows:[new docx.TableRow({children:[new docx.TableCell({width:{size:33,type:docx.WidthType.PERCENTAGE},children:[new docx.Paragraph({alignment:docx.AlignmentType.CENTER,children:[new docx.TextRun({text:uzman,font:"Calibri",size:22,bold:!0})]})]}),new docx.TableCell({width:{size:34,type:docx.WidthType.PERCENTAGE},children:[new docx.Paragraph({alignment:docx.AlignmentType.CENTER,children:[new docx.TextRun({text:isveren,font:"Calibri",size:22,bold:!0})]})]}),new docx.TableCell({width:{size:33,type:docx.WidthType.PERCENTAGE},children:[new docx.Paragraph({alignment:docx.AlignmentType.CENTER,children:[new docx.TextRun({text:hekim,font:"Calibri",size:22,bold:!0})]})]})]}),new docx.TableRow({children:[new docx.TableCell({children:[new docx.Paragraph({alignment:docx.AlignmentType.CENTER,children:[new docx.TextRun({text:"İş Güvenliği Uzmanı",font:"Calibri",size:22})]})]}),new docx.TableCell({children:[new docx.Paragraph({alignment:docx.AlignmentType.CENTER,children:[new docx.TextRun({text:isverenunvanioku(),font:"Calibri",size:22})]})]}),new docx.TableCell({children:[new docx.Paragraph({alignment:docx.AlignmentType.CENTER,children:[new docx.TextRun({text:"İşyeri Hekimi",font:"Calibri",size:22})]})]})]}),new docx.TableRow({children:[new docx.TableCell({children:[new docx.Paragraph({alignment:docx.AlignmentType.CENTER,children:[new docx.TextRun({text:"Belge No: "+uzmanno,font:"Calibri",size:22})]})]}),new docx.TableCell({children:[new docx.Paragraph({alignment:docx.AlignmentType.CENTER,children:[new docx.TextRun({text:"",font:"Calibri",size:22})]})]}),new docx.TableCell({children:[new docx.Paragraph({alignment:docx.AlignmentType.CENTER,children:[new docx.TextRun({text:"Belge No: "+hekimno,font:"Calibri",size:22})]})]})]})]})}
function isyeribaslikayar(a, v) { if (!v || typeof v !== "string" || v.trim().length === 0) { alert("Lütfen geçerli bir veri girin!"); return } const k = v.trim().split(" ").filter(k => k.length > 0); if (k.length === 0) { alert("Geçerli veri girin!"); return } let s = {}; switch (a) { case 1: s = { ustbaslik: k[0], altbaslik: k.slice(1).join(" ") }; break; case 2: if (k.length < 2) { alert("Script 2 için en az 2 kelime gerekli!"); return } s = { ustbaslik: k.slice(0, 2).join(" "), altbaslik: k.slice(2).join(" ") }; break; case 3: if (k.length < 3) { alert("Script 3 için en az 3 kelime gerekli!"); return } s = { ustbaslik: k.slice(0, 3).join(" "), altbaslik: k.slice(3).join(" ") }; break; default: alertify.error("Geçersiz giriş (1, 2 veya 3 olmalı)"); return }return s }
function admegorevlendirme1load()
{
    isyerigetir();
}
function admegorevlendiredevam1()
{
    let firmaid = firmasecimoku();
    window.location.href = "/admegorevlendirme2?id=" + encodeURIComponent(firmaid);
}


function acildurumkonuliste(){const a={yangin:"Yangın",deprem:"Deprem",sel:"Sel",sabotaj:"Sabotaj",iskaza:"İş Kazası",elektrik:"Elektrik Çarpması",salgin:"Salgın Hastalık (Covid - 19 vb.)",gida:"Gıda Zehirlenmesi",yildirim:"Yıldırım Düşmesi",basinc:"Basınçlı Kap Patlaması",kmaruziyet:"Kimyasal Maruziyet",ksizinti:"Kimyasal Sızıntı",patlama:"Patlayıcı Ortam",bakim:"Bakım Onarım",hayvan:"Hayvan Sokması Isırması"},b=store.get("acildurumkonusecim");if(!b)return[];const c=[];$.each(b,function(d,e){e==1&&a[d]&&c.push({ad:a[d]})});return c}

async function acildurumisyeririsk()
{
    const liste = [];
    $('table.gridtablo tbody tr').each(function ()
    {
        const unvan = $(this).find('input[name="isyeriunvani"]').val()?.trim();
        const faaliyet = $(this).find('input[name="faaliyetkonu"]').val()?.trim();
        const select = $(this).find('select[name="riskseviyesi"]');
        const riskval = select.val();
        const risktext = select.find('option:selected').text().trim();
        if (!riskval || riskval === "0") return;
        liste.push({isyeri: unvan || '', faaliyet: faaliyet || '', risk: risktext});
    });
    if (liste.length === 0)
    {
        for (let i = 0; i < 3; i++)
        {
            liste.push({ isyeri: '', faaliyet: '', risk: '' });
        }
    }
    let uzmanad = store.get("uzmanad");
    let uzmanno = store.get("uzmanno");
    let isyeri = jsoncevir(store.get('xjsonfirma')) || {};
    let isveren = isyeri.is;
    let hekimad = isyeri.hk;
    let hekimno = isyeri.hn;
    const { Document, Packer, TextRun, Paragraph, Table, TableRow, TableCell, WidthType, BorderStyle, AlignmentType, PageOrientation  } = docx;
    const baslik =
    [
        new Paragraph({children:[new TextRun({text:"İŞYERİNİ DIŞARIDAN ETKİLEYEBİLECEK DİĞER İŞYERLERİ",bold:true,size:24,font:"Calibri"})],spacing:{before:0,after:100},alignment:AlignmentType.CENTER}),
    ];
    const aciklama =
    [
        new Paragraph({children:[new TextRun({text:"\tKabul Edilebilir Risk Seviyesi:",bold:true,font:"Calibri",size:22}),new TextRun({text:" İşyeri çevresinde bulunan diğer işyerlerinde yangın vb. bir durum anında işyerimizde fiziksel hasar oluşma ihtimali mümkün, yaralanma veya can kaybı beklenmemektedir.",font:"Calibri",size:22})],alignment:AlignmentType.JUSTIFIED,spacing:{after:100}}),
        new Paragraph({children:[new TextRun({text:"\tOlası Risk Seviyesi:",bold:true,font:"Calibri",size:22}),new TextRun({text:" İşyeri çevresinde bulunan diğer işyerlerinde yangın vb. bir durum anında işyerimizde fiziksel hasar oluşur, yaralanma ihtimali düşük ve can kaybı beklenmemektedir.",font:"Calibri",size:22})],alignment:AlignmentType.JUSTIFIED,spacing:{after:100}}),
        new Paragraph({children:[new TextRun({text:"\tÖnemli Risk Seviyesi:",bold:true,font:"Calibri",size:22}),new TextRun({text:" İşyeri çevresinde bulunan diğer işyerlerinde yangın vb. bir durum anında işyerimizde fiziksel hasar ve yaralanma meydana gelebilir ve can kaybı olma ihtimali düşüktür.",font:"Calibri",size:22})],alignment:AlignmentType.JUSTIFIED,spacing:{after:100}}),
        new Paragraph({children:[new TextRun({text:"\tYüksek Risk Seviyesi:",bold:true,font:"Calibri",size:22}),new TextRun({text:" İşyeri çevresinde bulunan diğer işyerlerinde yangın vb. bir durum anında işyerimizde fiziksel hasar ve yaralanma meydana gelebilir ve can kaybı olma ihtimali yüksektir.",font:"Calibri",size:22})],alignment:AlignmentType.JUSTIFIED,spacing:{after:100}}),
        new Paragraph({children:[new TextRun({text:"\tRisk seviyesinin belirlenmesinde, işyerinin kaçış mesafesi, acil durum kapı sayısı ve bulunduğu yönler, işyerinin kat sayısı, çalışan sayısı ve yoğunluğu ve diğer işyerinin oluşturabileceği maksimum risk seviyesine göre değerlendirme yapılmıştır.",font:"Calibri",size:22})],spacing:{before:100,after:100},alignment:AlignmentType.JUSTIFIED})
    ];
    const tablosatirlari = [];
    tablosatirlari.push(new TableRow({
        children:
        [
            new TableCell({width:{size:4,type:WidthType.PERCENTAGE},children:[new Paragraph({alignment:AlignmentType.CENTER,spacing:{before:140,after:140},children:[new TextRun({text:"NO",bold:true,size:22,font:"Calibri"})]})]}),
            new TableCell({width:{size:38,type:WidthType.PERCENTAGE},children:[new Paragraph({alignment:AlignmentType.CENTER,spacing:{before:140,after:140},children:[new TextRun({text:"İŞYERİ UNVANI",bold:true,size:22,font:"Calibri"})]})]}),
            new TableCell({width:{size:38,type:WidthType.PERCENTAGE},children:[new Paragraph({alignment:AlignmentType.CENTER,spacing:{before:140,after:140},children:[new TextRun({text:"FAALİYET KONUSU",bold:true,size:22,font:"Calibri"})]})]}),
            new TableCell({width:{size:20,type:WidthType.PERCENTAGE},children:[new Paragraph({alignment:AlignmentType.CENTER,spacing:{before:140,after:140},children:[new TextRun({text:"ACİL DURUM RİSK SEVİYESİ",bold:true,size:22,font:"Calibri"})]})]})
        ]
    }));
    liste.forEach((item, index) => {
        tablosatirlari.push(new TableRow({
            children:
            [
                new TableCell({width:{size:4,type:WidthType.PERCENTAGE},children:[new Paragraph({alignment:AlignmentType.CENTER,spacing:{before:140,after:140},children:[new TextRun({text:(index+1).toString(),bold:true,size:22,font:"Calibri"})]})]}),
                new TableCell({width:{size:38,type:WidthType.PERCENTAGE},children:[new Paragraph({alignment:AlignmentType.LEFT,spacing:{before:140,after:140},indent:{left:60},children:[new TextRun({text:item.isyeri,size:22,font:"Calibri"})]})]}),
                new TableCell({width:{size:38,type:WidthType.PERCENTAGE},children:[new Paragraph({alignment:AlignmentType.LEFT,spacing:{before:140,after:140},indent:{left:60},children:[new TextRun({text:item.faaliyet,size:22,font:"Calibri"})]})]}),
                new TableCell({width:{size:20,type:WidthType.PERCENTAGE},children:[new Paragraph({alignment:AlignmentType.CENTER,spacing:{before:140,after:140},children:[new TextRun({text:item.risk,size:22,font:"Calibri"})]})]})
            ]
        }));
    });
    const tablo=new Table({width:{size:100,type:WidthType.PERCENTAGE},rows:tablosatirlari,borders:{top:{style:BorderStyle.SINGLE,size:1,color:"000000"},bottom:{style:BorderStyle.SINGLE,size:1,color:"000000"},left:{style:BorderStyle.SINGLE,size:1,color:"000000"},right:{style:BorderStyle.SINGLE,size:1,color:"000000"},insideHorizontal:{style:BorderStyle.SINGLE,size:1,color:"000000"},insideVertical:{style:BorderStyle.SINGLE,size:1,color:"000000"}}});
    const doc = new Document
    ({
        sections:
        [{
            properties:{page:{size:{orientation:PageOrientation.LANDSCAPE},margin:{top:1134,bottom:1134,left:1134,right:1134}}},
            children: [...baslik, new Paragraph({ text: "" }), tablo, new Paragraph({ text: "" }), ...aciklama],
            footers: { default: new docx.Footer({ children: [docxucluimzadikey(uzmanad, uzmanno, hekimad, hekimno, isveren)]})}
        }]
    });
    const blob = await Packer.toBlob(doc);
    saveAs(blob, "Acil Durum Diğer İşyerleri.docx");
}

async function acildurumsayfaacilis()
{
    try
    {
        const acildurumplani = await githuboku("https://mehmetceranx12.github.io/isgevraknode/json/acildurumplan.json");
        const acildurumjsononlem = acildurumplani.acildurumgenel || [];
        const acildurumjsonozel = acildurumplani.acildurumozel || [];
        const hastaneListesi = acildurumplani.hastane || [];
        store.set("acildurumgeneljson", acildurumjsononlem);
        store.set("acildurumozeljson", acildurumjsonozel);
        store.set("hastanebilgi", hastaneListesi);
        let hastaneil = [...new Set(hastaneListesi.map(h => h.il))].sort((a, b) => a.localeCompare(b, 'tr', { sensitivity: 'base' }));
        const $hastaneselect = $('#hastaneil');
        $hastaneselect.empty();
        $hastaneselect.append('<option value="">İl Seçiniz</option>');
        hastaneil.forEach(il => $hastaneselect.append(`<option value="${il}">${il}</option>`));
        $('#hastaneil').on('change', function ()
        {
            const secilenIl = $(this).val();
            const hastaneListesi = store.get("hastanebilgi") || [];
            const ilceler = [...new Set(hastaneListesi.filter(h => h.il === secilenIl).map(h => h.ilce))].sort((a, b) => a.localeCompare(b, 'tr', { sensitivity: 'base' }));
            const $ilceSelect = $('#hastaneilce');
            $ilceSelect.empty();
            $ilceSelect.append('<option value="">İlçe Seçiniz</option>');
            ilceler.forEach(ilce => { $ilceSelect.append(`<option value="${ilce}">${ilce}</option>`);   });
        });
        $('#hastaneilce').on('change', function ()
        {
            const secilenIl = $('#hastaneil').val();
            const secilenIlce = $(this).val();
            const hastaneListesi = store.get("hastanebilgi") || [];
            const hastaneler = hastaneListesi.filter(h => h.il === secilenIl && h.ilce === secilenIlce).map(h => h.hastane).filter((value, index, self) => self.indexOf(value) === index).sort((a, b) => a.localeCompare(b, 'tr', { sensitivity: 'base' }));
            const $hastaneisimSelect = $('#hastaneisim');
            $hastaneisimSelect.empty();
            $hastaneisimSelect.append('<option value="">Hastane Seçiniz</option>');
            hastaneler.forEach(h => {$hastaneisimSelect.append(`<option value="${h}">${h}</option>`);});
        });
        let acldurumekiplistesijson = acildurumekipjson();
        $('#acildurumekiptablo').DataTable({
            data: acldurumekiplistesijson,
            ordering: false,
            dom: 't',
            pageLength: -1,
            columns:
            [
                { title: "Ad Soyad", data: "x", orderable: false },
                { title: "Unvan", data: "y", orderable: false },
                { title: "Acil Durum Görevi", data: "ekipgorev", orderable: false }
            ],
            createdRow: function (row, data)
            {
                $(row).find('td').eq(0).css('text-align', 'left');
                $(row).find('td').eq(1).css('text-align', 'left');
                $(row).find('td').eq(2).css('text-align', 'left');
            },
            headerCallback: function (thead)
            {
                $(thead).find('th').css('text-align', 'center');
            }
        });        
        const tarih = store.get("acildurumtarih");
        if (tarih) $("#tarih").val(tarih);
        const acildurumliste = acildurumkonuliste();
        $('#acildurumlistesi').DataTable({
            data: acildurumliste,
            ordering: false,
            dom: 't',
            pageLength: -1,
            columns: [{ title: "Acil Durum Plan Konuları", data: "ad", orderable: false }],
            createdRow: row => $(row).find('td').eq(0).css('text-align', 'left'),
            headerCallback: thead => $(thead).find('th').css('text-align', 'center')
        });
        $('#digerisyeri').on('change', 'select[name="riskseviyesi"]', function ()
        {
            const v = $(this).val(), r = $(this).closest('tr');
            let h = '', y = '', c = '';
            switch (v) {
                case '1': h = 'Mümkün'; y = 'Yok'; c = 'Yok'; break;
                case '2': h = 'Oluşur'; y = 'Düşük'; c = 'Yok'; break;
                case '3': h = 'Oluşur'; y = 'Oluşur'; c = 'Düşük'; break;
                case '4': h = 'Oluşur'; y = 'Oluşur'; c = 'Yüksek'; break;
            }
            r.find('td').eq(3).css('text-align', 'center').text(h);
            r.find('td').eq(4).css('text-align', 'center').text(y);
            r.find('td').eq(5).css('text-align', 'center').text(c);
        });
        const acildurumsecim = store.get("acildurumkonusecim");
        if (!acildurumsecim || typeof acildurumsecim !== 'object') {
            console.warn("Seçim verisi bulunamadı veya geçersiz.");
            return;
        }
        let geneltabloveri = [];
        let ozeltabloveri = [];
        const seviyetedbir = parseInt($("#seviyetedbir").val());
        geneltabloveri = acildurumfiltregenel(acildurumjsononlem, seviyetedbir, acildurumsecim);
        ozeltabloveri = acildurumfiltreozel(acildurumjsonozel, seviyetedbir, acildurumsecim);
        $("#seviyetedbir").on("change", function ()
        {
            const yeniseviye = parseInt($(this).val());
            geneltabloveri = acildurumfiltregenel(acildurumjsononlem, yeniseviye, acildurumsecim);
            ozeltabloveri = acildurumfiltreozel(acildurumjsonozel, yeniseviye, acildurumsecim);
            geneltabo.clear().rows.add(geneltabloveri).draw();
            ozeltabo.clear().rows.add(ozeltabloveri).draw();
        });
        var geneltabo = $('#geneltablo').DataTable(
        {
            data: geneltabloveri,
            dom: 'ft',
            pageLength: -1,
            lengthChange: false,
            orderable: false,
            ordering: false,
            columns:
            [
                {title:"Konu",data:"konu",orderable:false},
                {title:"Acil Durum Tedbirleri (Genel)",data:"onlem",orderable:false},
                {title:"Dahil Et",data:null,orderable:false,render:function(){return'<input type="checkbox" class="onlemsec" checked>';}},
                {title:"Uygun",data:null,orderable:false},
                {title: "Uygun Değil", data: null, orderable: false },
                {data: "id", visible: false },
            ],
            language:
            {
                search: "Önlem Ara:",
                zeroRecords: "Böyle bir önlem bulunamadı",
                emptyTable: "Böyle bir önlem bulunamadı"
            },
            createdRow: function (row, data, rowIndex)
            {
                const randomName = "secim_" + Math.random().toString(36).substring(2, 10);
                $(row).find('td').eq(0).css('text-align', 'left');
                $(row).find('td').eq(1).css('text-align', 'left');
                $(row).find('td').eq(2).css('text-align', 'center');
                $(row).find('td').eq(3).html(`<input type="radio" name="${randomName}" value="1" checked>`).css('text-align', 'center');
                $(row).find('td').eq(4).html(`<input type="radio" name="${randomName}" value="0">`).css('text-align', 'center');
            },
            headerCallback: function (thead)
            {
                $(thead).find('th').css('text-align', 'center');
            }
        });
        var ozeltabo = $('#ozeltablo').DataTable(
        {
            data: ozeltabloveri,
            dom: 'ft',
            pageLength: -1,
            lengthChange: false,
            orderable: false,
            ordering: false,
            columns:
            [
                {title:"Konu",data:"konu",orderable:false},
                {title:"Acil Durum Tedbirleri (Konulara Göre)",data:"onlem",orderable:false},
                {title:"Dahil Et",data:null,orderable:false,render:function(){return'<input type="checkbox" class="onlemsec" checked>';}},
                {title:"Uygun",data:null,orderable:false},
                {title: "Uygun Değil", data: null, orderable: false },
                {data: "konuindex", visible: false },
            ],
            language:
            {
                search: "Önlem Ara:",
                zeroRecords: "Böyle bir önlem bulunamadı",
                emptyTable: "Böyle bir önlem bulunamadı"
            },
            createdRow: function (row, data, rowIndex)
            {
                const randomName = "secim_" + Math.random().toString(36).substring(2, 10);
                $(row).find('td').eq(0).css('text-align', 'left');
                $(row).find('td').eq(1).css('text-align', 'left');
                $(row).find('td').eq(2).css('text-align', 'center');
                $(row).find('td').eq(3).html(`<input type="radio" name="${randomName}" value="1" checked>`).css('text-align', 'center');
                $(row).find('td').eq(4).html(`<input type="radio" name="${randomName}" value="0">`).css('text-align', 'center');
            },
            headerCallback: function (thead)
            {
                $(thead).find('th').css('text-align', 'center');
            }
        });
        let acildurumgooglelink = [{ "acildurum": "Yangın", "link": "https://drive.google.com/uc?export=download&id=1K0idDKFidSghUpVnG2UPAOiYJBazVDjL", "konu": "yangin" }, { "acildurum": "Deprem", "link": "https://drive.google.com/uc?export=download&id=1YOQ5X9krcn55vx0jJiolTV1PAdPc1oH1", "konu": "deprem" }, { "acildurum": "Sel", "link": "https://drive.google.com/uc?export=download&id=1GQDqRWm-T6N0EFgm1f6LsPfx7bu9t9JF", "konu": "sel" }, { "acildurum": "Sabotaj", "link": "https://drive.google.com/uc?export=download&id=1J55hgcFR85ZSHC6dybC4lm2A3cTJDFTI", "konu": "sabotaj" }, { "acildurum": "İş Kazası", "link": "https://drive.google.com/uc?export=download&id=1ZRAENBf-RrBT9eT6VBp0S6rPSzOH_lZ7", "konu": "iskaza" }, { "acildurum": "Elektrik Çarpması", "link": "https://drive.google.com/uc?export=download&id=1n3d2lu8wFqCeoV0yX_Lp0bNY8zQBO2qj", "konu": "elektrik" }, { "acildurum": "Salgın Hastalık (Covid - 19 vb.)", "link": "https://drive.google.com/uc?export=download&id=1dJp6Rix_YT9NjlocTRNlLNgzzPnDoA5o", "konu": "salgin" }, { "acildurum": "Gıda Zehirlenmesi", "link": "https://drive.google.com/uc?export=download&id=1eumlJE9GHzEZiwx_VNrryP4BPy8yof8z", "konu": "gida" }, { "acildurum": "Yıldırım Düşmesi", "link": "https://drive.google.com/uc?export=download&id=1_J6G1QIAfD_ydMcYGAVWJOACg3Q9a-QI", "konu": "yildirim" }, { "acildurum": "Basınçlı Kap Patlaması", "link": "https://drive.google.com/uc?export=download&id=1gTiwQuIfJIKxBldX4Oe2LjWkuX0DmNTE", "konu": "basinc" }, { "acildurum": "Kimyasal Maruziyet", "link": "https://drive.google.com/uc?export=download&id=13qvbOMkoLTVSR4IlA36AR9higd6BsA_j", "konu": "kmaruziyet" }, { "acildurum": "Kimyasal Sızıntı", "link": "https://drive.google.com/uc?export=download&id=1M6aKr0kVO0rtu48ddRsZSfHs-gouruYv", "konu": "ksizinti" }, { "acildurum": "Patlayıcı Ortam", "link": "https://drive.google.com/uc?export=download&id=1KVUpzRsfRhUg5988_Ih37FCW-icumoPt", "konu": "patlama" }, { "acildurum": "Bakım Onarım", "link": "https://drive.google.com/uc?export=download&id=1zqvfOiLz51VVo7oZjmpfatruS91XYKhX", "konu": "bakim" }, { "acildurum": "Hayvan Sokması Isırması", "link": "https://drive.google.com/uc?export=download&id=1CWMa-5gaeXNsnc6f9H2QOHE7w8PruJgf", "konu": "hayvan" }];
        const acildurumlistelink = store.get("acildurumkonusecim");
        acildurumgooglelink = acildurumgooglelink.filter(item => acildurumlistelink[item.konu] === 1);
        $('#acildurumyontem').DataTable
        ({
            data: acildurumgooglelink,
            ordering: false,
            dom: 't',
            pageLength: -1,
            columns:
            [
                { title: "Acil Durum Müdahale Yöntemleri", data: "acildurum", orderable: false },
                { title: "Acil Durum Plan Konuları", data: "link", orderable: false, render: function (data) {return `<input type="button" class="cssbutontamam" value="İndir" onclick='alertify.error("Lütfen Bekleyiniz...", 2);window.location.href="${data}";' />`;}}
            ],
            createdRow: function (row, data, rowIndex)
            {
                $(row).find('td').eq(0).css('text-align', 'left');
                $(row).find('td').eq(1).css('text-align', 'center');
            },
            headerCallback: thead => $(thead).find('th').css('text-align', 'center')
        });        
        $('.dt-search input').css({"background-color": "white", 'margin-bottom': '0.7vw'}).attr("autocomplete", "off");
        $('.dt-length select').css({ "background-color": "white" });        
    }
    catch (err)
    {
        alertify.error("Beklenmedik bir hata oluştu: " + err);
    }
}




function acildurumekipjson(){const e={0:"Görevli Değil",1:"İlkyardım Ekibi - Ekip Başı",2:"İlkyardım Ekibi - Ekip Personeli",3:"Söndürme Ekibi - Ekip Başı",4:"Söndürme Ekibi - Ekip Personeli",5:"Koruma Ekibi - Ekip Başı + Koordinasyon",6:"Koruma Ekibi - Ekip Personeli + Koordinasyon",7:"Koruma Ekibi - Ekip Personeli",8:"Kurtarma Ekibi - Ekip Başı",9:"Kurtarma Ekibi - Ekip Personeli",10:"Destek Elemanı"};let n=store.get("plancalisanjson")||[];if("string"==typeof n)try{n=JSON.parse(n)}catch(t){console.error("JSON parse hatası:",t),n=[]}const i=[];return $.each(n,function(n,t){t.a&&0!==t.a&&i.push({x:t.x,y:t.y,ekipgorev:e[t.a]||"Tanımsız",ekipkod:t.a})}),i}

function acildurumfiltregenel(veri, seciliseviye, secimler)
{
    return veri.filter(item =>
    {
        if (seciliseviye === 1 && item.seviye !== 1) return false;
        let secilenVarMi = false;
        for (const key in secimler) {
            if (secimler[key] === 1 && item[key] === 1) {
                secilenVarMi = true;
                break;
            }
        }
        return secilenVarMi;
    });
}
function acildurumfiltreozel(veri, seciliseviye, secimler)
{
    return veri.filter(item => {
        if (seciliseviye === 1 && item.seviye !== 1) return false;
        for (const key in secimler) {
            const kullaniciSecimi = secimler[key];
            const kayitDegeri = item[key];
            if (kullaniciSecimi === 0 && kayitDegeri === 1) {
                return false;
            }
        }
        return true;
    });
}
function acildurumtedbirjsonuret()
{
    const genelData = [];
    const ozelData = [];
    $('#geneltablo tbody tr').each(function () {
        const row = $(this);
        const onlem = row.find('td').eq(1).text().trim();
        const dahilet = row.find('input[type="checkbox"]').is(':checked') ? 1 : 0;

        if (dahilet === 1) {
            const uygunluk = row.find('input[type="radio"]:checked').val() === "1" ? "Uygun" : "Uygun Değil";
            const id = $('#geneltablo').DataTable().row(row).data().id;
            genelData.push({
                onlem: onlem,
                dahil: dahilet,
                uygun: uygunluk,
                id: id
            });
        }
    });

    $('#ozeltablo tbody tr').each(function () {
        const row = $(this);
        const acildurumkonusu = row.find('td').eq(0).text().trim();
        const onlem = row.find('td').eq(1).text().trim();
        const index = $('#ozeltablo').DataTable().row(row).data().konuindex;
        const dahilet = row.find('input[type="checkbox"]').is(':checked') ? 1 : 0;

        if (dahilet === 1) {
            const uygunluk = row.find('input[type="radio"]:checked').val() === "1" ? "Uygun" : "Uygun Değil";
            ozelData.push({
                konu: acildurumkonusu,
                onlem: onlem,
                uygun: uygunluk,
                konuindex: index
            });
        }
    });
    const sonuc =
    {
        genel: genelData,
        ozel: ozelData
    };
    let acildurumgeneljson = acildurumgenelhususlar(genelData);
    let acildurumozeljson = ozelData;
    let konular = [{ "konu": "Yangın", "konuindex": 10, "id": "yangin" }, { "konu": "Deprem", "konuindex": 11, "id": "deprem" }, { "konu": "Sel", "konuindex": 12, "id": "sel" }, { "konu": "Sabotaj", "konuindex": 13, "id": "sabotaj" }, { "konu": "Elektrik Çarpması", "konuindex": 14, "id": "elektrik" }, { "konu": "Biyolojik Risk (Salgın)", "konuindex": 15, "id": "salgin" }, { "konu": "Gıda Zehirlenmesi", "konuindex": 16, "id": "gida" }, { "konu": "Yıldırım", "konuindex": 17, "id": "yildirim" }, { "konu": "Basınçlı Kap Patlaması", "konuindex": 18, "id": "basinc" }, { "konu": "Patlayıcı Ortam", "konuindex": 19, "id": "kmaruziyet" }, { "konu": "Kimyasal Sızıntı", "konuindex": 20, "id": "ksizinti" }, { "konu": "Kimyasal Maruziyet", "konuindex": 21, "id": "patlama" }, { "konu": "Hayvan Sokması", "konuindex": 22, "id": "bakim" }, { "konu": "Bakım Onarım", "konuindex": 23, "id": "hayvan" }, { "konu": "İş Kazası", "konuindex": 99, "id": "iskaza" }];
    let genelsecim = store.get("acildurumkonusecim");
    konular = konular.filter(k => genelsecim[k.id] === 1);
    const acildurumgenelsonuc = [];
    konular.forEach(k => {
      acildurumgeneljson.forEach(item => {
        if (item[k.id] === 1) {
          acildurumgenelsonuc.push({
            konu: k.konu,
            konuindex: k.konuindex,
            onlem: item.onlem,
            uygun: item.uygun === 1 || item.uygun === "Uygun" ? "Uygun" : "Uygun Değil"
          });
        }
      });
    });
    let wordjson = [];
    let tumIndexler = [...new Set([...acildurumgenelsonuc.map(x => x.konuindex), ...acildurumozeljson.map(x => x.konuindex)])];
    tumIndexler.sort((a, b) => a - b);
        tumIndexler.forEach(index =>
        {
      acildurumgenelsonuc
        .filter(x => x.konuindex === index)
        .forEach(x => wordjson.push(x));
      acildurumozeljson
        .filter(x => x.konuindex === index)
        .forEach(x => wordjson.push(x));
    });
    return wordjson;
}

function acildurumgenelhususlar(genelData)
{
    const acildurumgeneljson = store.get("acildurumgeneljson") || [];

    return genelData
        .map(gItem =>
        {
            const detay = acildurumgeneljson.find(jItem => jItem.id == gItem.id);

            if (!detay) return null;

            return {
                onlem: gItem.onlem,
                id: gItem.id,
                uygun: gItem.uygun,
                yangin: detay.yangin,
                deprem: detay.deprem,
                sel: detay.sel,
                sabotaj: detay.sabotaj,
                iskaza: detay.iskaza,
                elektrik: detay.elektrik,
                salgin: detay.salgin,
                gida: detay.gida,
                yildirim: detay.yildirim,
                basinc: detay.basinc,
                kmaruziyet: detay.kmaruziyet,
                ksizinti: detay.ksizinti,
                patlama: detay.patlama,
                bakim: detay.bakim,
                hayvan: detay.hayvan
            };
        })
        .filter(item => item !== null);
}

function acildurumtedbirdocxyaz()
{
    let uzmanad = store.get("uzmanad");
    let uzmanno = store.get("uzmanno");
    let wordjson = acildurumtedbirjsonuret();
    let isyeri = jsoncevir(store.get('xjsonfirma')) || {};
    let isveren = isyeri.is;
    let hekimad = isyeri.hk;
    let hekimno = isyeri.hn;
    const { Document, Packer, Paragraph, Table, TableCell, TableRow, WidthType, TextRun, AlignmentType, PageOrientation, HeightRule  } = docx;
    const tableRows = [];
    const headerRow = () => new docx.TableRow({
        height: { value: 680, rule: docx.HeightRule.EXACT },
        children:
        [
            new docx.TableCell({width: { size: 15, type: WidthType.PERCENTAGE },verticalAlign: docx.VerticalAlign.CENTER, children: [new docx.Paragraph({ alignment: docx.AlignmentType.CENTER, children: [new docx.TextRun({ text: "ACİL DURUM", bold: true, font: "Calibri", size: 22 })]})]}),
            new docx.TableCell({width: { size: 75, type: WidthType.PERCENTAGE },verticalAlign:docx.VerticalAlign.CENTER,children:[new docx.Paragraph({alignment: docx.AlignmentType.CENTER, children:[new docx.TextRun({text:"ÖNLEYİCİ ve SINIRLANDIRICI TEDBİRLER",bold:true,font:"Calibri",size:22})]})]}),
            new docx.TableCell({width: { size: 10, type: WidthType.PERCENTAGE },verticalAlign: docx.VerticalAlign.CENTER, children: [new docx.Paragraph({ alignment: docx.AlignmentType.CENTER, children: [new docx.TextRun({ text: "UYGUNLUK", bold: true, font: "Calibri", size: 22 })] })] })
        ]
    });
    tableRows.push(headerRow());
    wordjson.forEach((item, index) => {

        if (index > 0 && index % 12 === 0)
        {
            tableRows.push(headerRow());
        }
        tableRows.push(new TableRow(
        {
            height: { value: 680, rule: HeightRule.EXACT },
            children:
            [
                new TableCell({verticalAlign:docx.VerticalAlign.CENTER,children:[new Paragraph({alignment:docx.AlignmentType.CENTER,children:[new TextRun({text:item.konu,font:"Calibri",size:22})]})]}),
                new TableCell({margins:{left:150, right:150},verticalAlign:docx.VerticalAlign.CENTER,children:[new Paragraph({alignment:docx.AlignmentType.JUSTIFIED,children:[new TextRun({text:item.onlem,font:"Calibri",size:22})]})]}),
                new TableCell({verticalAlign:docx.VerticalAlign.CENTER,children:[new Paragraph({alignment:docx.AlignmentType.CENTER,children:[new TextRun({text:item.uygun,font:"Calibri",size:22})]})]})
            ]
        }
        ));
    });

    const table = new Table({
        rows: tableRows,
        width: {
            size: 100,
            type: WidthType.PERCENTAGE
        }
    });

    const doc = new Document({
        sections: [{
            properties: {
                page: {
                    margin: {top: 850, bottom: 1950, left: 850, right: 850, footer:1100},
                    size:
                    {
                        orientation: PageOrientation.LANDSCAPE,
                    }
                }
            },
            children: [table],
            footers: { default: new docx.Footer({ children: [docxucluimzadikey(uzmanad, uzmanno, hekimad, hekimno, isveren)]})}
        }]
    });
    Packer.toBlob(doc).then(blob => { saveAs(blob, "Acil Durum Kontrol Listesi.docx");});
}

async function ulusalacildurumnumarayaz()
{
    let uzmanad = store.get("uzmanad");
    let uzmanno = store.get("uzmanno");
    let isyeri = jsoncevir(store.get('xjsonfirma')) || {};
    let isveren = isyeri.is;
    let hekimad = isyeri.hk;
    let hekimno = isyeri.hn;
    const { Document, Packer, Paragraph, Table, TableRow, TableCell, WidthType, TextRun, AlignmentType, BorderStyle } = window.docx;
    const tableRows = [];
    tableRows.push(
    new docx.TableRow
    ({
        height: { value: 566, rule: docx.HeightRule.EXACT },
        children:[new docx.TableCell({columnSpan:2,children:[new docx.Paragraph({alignment:docx.AlignmentType.CENTER,children:[new docx.TextRun({text:"Ulusal Acil Durum Numaraları",bold:true,font:"Calibri",size:22})]})],width:{size:100,type:docx.WidthType.PERCENTAGE},verticalAlign:docx.VerticalAlign.CENTER})]
    }));
    tableRows.push(new docx.TableRow
    ({
        height: { value: 566, rule: docx.HeightRule.EXACT },
        children:
        [
            new docx.TableCell({children:[new docx.Paragraph({alignment:docx.AlignmentType.CENTER,children:[new docx.TextRun({text:"Kurum Adı",bold:true,font:"Calibri",size:22})]})],width:{size:80,type:docx.WidthType.PERCENTAGE},verticalAlign:docx.VerticalAlign.CENTER}),
            new docx.TableCell({children:[new docx.Paragraph({alignment:docx.AlignmentType.CENTER,children:[new docx.TextRun({text:"Telefon No",bold:true,font:"Calibri",size:22})]})],width:{size:20,type:docx.WidthType.PERCENTAGE},verticalAlign:docx.VerticalAlign.CENTER})
        ]
    }));
    tableRows.push(new docx.TableRow
    ({
        height: { value: 566, rule: docx.HeightRule.EXACT },
        children:
        [
            new docx.TableCell({margins:{left:75},children:[new docx.Paragraph({alignment:docx.AlignmentType.LEFT,children:[new docx.TextRun({text:"İtfaiye",font:"Calibri",size:22,bold:false})]})],verticalAlign:docx.VerticalAlign.CENTER}),
            new docx.TableCell({children:[new docx.Paragraph({alignment:docx.AlignmentType.CENTER,children:[new docx.TextRun({text:"112",bold:false,font:"Calibri",size:22})]})],rowSpan:7,verticalAlign:docx.VerticalAlign.CENTER})
        ]
    }));
    ["Polis", "Sağlık - Ambulans", "AFAD", "Jandarma", "Orman Yangın", "Sahil Güvenlik"].forEach(name =>{
    tableRows.push(new docx.TableRow
    ({
        height: { value: 566, rule: docx.HeightRule.EXACT },
        children:[new docx.TableCell({margins:{left:75},children:[new docx.Paragraph({alignment:docx.AlignmentType.LEFT,children:[new docx.TextRun({text:name,bold:false,font:"Calibri",size:22})]})],verticalAlign:docx.VerticalAlign.CENTER})]}));
    });
    const others =
    [
        { kurum: "Ulusal Zehir Danışma Merkezi", tel: "114" },
        { kurum: "Sağlık Bakanlığı İletişim Merkezi", tel: "184" },
        { kurum: "Doğalgaz Arıza", tel: "187" },
        { kurum: "Telefon Arıza", tel: "121" },
        { kurum: "Su Arıza", tel: "185" },
        { kurum: "Elektrik Arıza", tel: "186" },
        { kurum: "Gıda İhbar Hattı", tel: "174" },
        { kurum: "Zabıta", tel: "153" },
    ];
    others.forEach(({ kurum, tel }) =>
    {
        tableRows.push(new docx.TableRow({
            height: { value: 566, rule: docx.HeightRule.EXACT },
            children:
            [
                new docx.TableCell({ children: [new docx.Paragraph({ children: [new docx.TextRun({ text: kurum, font: "Calibri", size: 22 })] })], verticalAlign: docx.VerticalAlign.CENTER, margins: { left: 75 } }),
                new docx.TableCell({ children: [new docx.Paragraph({ alignment: docx.AlignmentType.CENTER, children: [new docx.TextRun({ text: tel, font: "Calibri", size: 22 })] })], verticalAlign: docx.VerticalAlign.CENTER })
            ]
        }));
    });
    let hastaneadi = $('#hastaneadi').val();
    let hastaneadres = $('#hastaneadres').val();
    let hastanetel = $('#hastanetel').val();
    if (hastaneadi && hastaneadi.trim() !== "")
    {
        tableRows.push(new docx.TableRow({
            height: { value: 566, rule: docx.HeightRule.AT_LEAST },
            children:
            [
                new docx.TableCell({ children: [new docx.Paragraph({ children: [new docx.TextRun({ text: hastaneadi, font: "Calibri", size: 22 }), new docx.TextRun({ break: 1 }), new docx.TextRun({ text: hastaneadres, font: "Calibri", size: 22 })] })], verticalAlign: docx.VerticalAlign.CENTER, margins: { left: 75 } }),
                new docx.TableCell({ children: [new docx.Paragraph({ alignment: docx.AlignmentType.CENTER, children: [new docx.TextRun({ text: hastanetel, font: "Calibri", size: 22 })] })], verticalAlign: docx.VerticalAlign.CENTER })
            ]
        }));
    }
    const table = new Table
    ({
        rows: tableRows,
        width: { size: 100, type: WidthType.PERCENTAGE },
        alignment: AlignmentType.CENTER,
    });
    const doc = new Document({
        sections:
        [{
            properties: { page: {margin: {top: 850, bottom: 1950, left: 850, right: 850, footer:1100}}},
            children: [table],
            footers: { default: new docx.Footer({ children: [docxucluimzadikey(uzmanad, uzmanno, hekimad, hekimno, isveren)]})}
        }]
    });
    const blob = await Packer.toBlob(doc);
    saveAs(blob, "Acil Durum Numaraları.docx");
}

function acildurumhastaneyaz()
{
    const secilenIl = $('#hastaneil').val();
    const secilenIlce = $('#hastaneilce').val();
    const secilenHastane = $('#hastaneisim').val();
    if (!secilenIl || !secilenIlce || !secilenHastane)
    {
        alert('Lütfen İl, İlçe ve Hastane seçiniz.');
        return;
    }
    const hastaneListesi = store.get("hastanebilgi") || [];
    const secilen = hastaneListesi.find(h =>
        h.il === secilenIl &&
        h.ilce === secilenIlce &&
        h.hastane === secilenHastane
    );
    if (secilen)
    {
        $('#hastaneadi').val(secilen.hastane);
        $('#hastaneadres').val(secilen.adres);
        $('#hastanetel').val(secilen.telefon);
        $('#hastanebulucu').fadeOut();
    }
    else
    {
        alert('Seçilen hastane bilgisi bulunamadı.');
    }
}

async function acildurumekiplistesidocx()
{
    let uzmanad = store.get("uzmanad");
    let uzmanno = store.get("uzmanno");
    let isyeri = jsoncevir(store.get('xjsonfirma')) || {};
    let adres = isyeri.ad;
    let isyerisicil = isyeri.sc;
    let isveren = isyeri.is;
    let isyeriadi = isyeri.fi;
    let hekimad = isyeri.hk;
    let hekimno = isyeri.hn;
    let acldurumekiplistesijson = acildurumekipjson();
    const { Document, Packer, Paragraph, TextRun, TableCell, WidthType, AlignmentType, PageBreak} = window.docx;
    let analiste = [];
    analiste.push(new docx.TableRow
    ({
        height: { value: 567, rule: docx.HeightRule.EXACT },
        children:
        [
            new TableCell({ width: { size: 25, type: WidthType.PERCENTAGE }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Çalışan Ad Soyadı", font: "Calibri", size: 24, bold: true })] })], verticalAlign: docx.VerticalAlign.CENTER }),
            new TableCell({ width: { size: 30, type: WidthType.PERCENTAGE }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Acil Durum Ekip Görevi", font: "Calibri", size: 24, bold: true })] })], verticalAlign: docx.VerticalAlign.CENTER }),
            new TableCell({ width: { size: 15, type: WidthType.PERCENTAGE }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Sorumluluk Alanı", font: "Calibri", size: 24, bold: true })] })], verticalAlign: docx.VerticalAlign.CENTER }),
            new TableCell({ width: { size: 15, type: WidthType.PERCENTAGE }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "İletişim No", font: "Calibri", size: 24, bold: true })] })], verticalAlign: docx.VerticalAlign.CENTER }),
            new TableCell({ width: { size: 15, type: WidthType.PERCENTAGE }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "İmza", font: "Calibri", size: 24, bold: true })] })], verticalAlign: docx.VerticalAlign.CENTER })
        ]
    }));
    acldurumekiplistesijson.forEach(person =>
    {
        analiste.push(new docx.TableRow({
            height: { value: 850, rule: docx.HeightRule.EXACT },
            children: [
                new TableCell({margins: { left: 75 }, children: [new Paragraph({ alignment: AlignmentType.LEFT, children: [new TextRun({ text: person.x, font: "Calibri", size: 22 })] })], verticalAlign: docx.VerticalAlign.CENTER }),
                new TableCell({margins: { left: 75 }, children: [new Paragraph({ alignment: AlignmentType.LEFT, children: [new TextRun({ text: person.ekipgorev, font: "Calibri", size: 22 })] })], verticalAlign: docx.VerticalAlign.CENTER }),
                new TableCell({margins: { left: 75 }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: " ", font: "Calibri", size: 22 })] })], verticalAlign: docx.VerticalAlign.CENTER }),
                new TableCell({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: " ", font: "Calibri", size: 22 })] })], verticalAlign: docx.VerticalAlign.CENTER }),
                new TableCell({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: " ", font: "Calibri", size: 22 })] })], verticalAlign: docx.VerticalAlign.CENTER })
            ],
            
        }));
    });
    let acildurumanatablo = new docx.Table({ rows: analiste, width: { size: 100, type: docx.WidthType.PERCENTAGE } });
    ////////////////////////////////////////
    const gorevlendirmesayfa = [];
    let calisanunvan = "";
    acldurumekiplistesijson.forEach((calisan, index) =>
    {
        const ekipindex = parseInt(calisan.ekipkod, 10);
        let imzaliste = [];
        if(ekipindex===5||ekipindex===6||ekipindex===7)calisanunvan="Koruma Ekibi";else if(ekipindex===3||ekipindex===4)calisanunvan="Söndürme Ekibi";else if(ekipindex===1||ekipindex===2)calisanunvan="İlkyardım Ekibi";else if(ekipindex===8||ekipindex===9)calisanunvan="Kurtarma Ekibi";else calisanunvan="Destek Elemanı";
        imzaliste.push
        (
            new docx.TableRow
            ({
                height: { value: 300, rule: docx.HeightRule.EXACT },
                children:
                [
                    new TableCell({ width: { size: 50, type: docx.WidthType.PERCENTAGE }, borders: { top: { size: 0, color: "FFFFFF" }, bottom: { size: 0, color: "FFFFFF" }, left: { size: 0, color: "FFFFFF" }, right: { size: 0, color: "FFFFFF" } }, verticalAlign: docx.VerticalAlign.CENTER, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: calisan.x, font: "Calibri", size: 22, bold: true })] })] }),
                    new TableCell({width:{size:50,type:docx.WidthType.PERCENTAGE},borders:{top:{size:0,color:"FFFFFF"},bottom:{size:0,color:"FFFFFF"},left:{size:0,color:"FFFFFF"},right:{size:0,color:"FFFFFF"}},verticalAlign:docx.VerticalAlign.CENTER,children:[new Paragraph({alignment:AlignmentType.CENTER,children:[new TextRun({text:isveren,font:"Calibri",size:22, bold: true })]})]})
                ],            
            }),
            new docx.TableRow
            ({
                height: { value: 300, rule: docx.HeightRule.EXACT },
                children:
                [
                    new TableCell({ borders: { top: { size: 0, color: "FFFFFF" }, bottom: { size: 0, color: "FFFFFF" }, left: { size: 0, color: "FFFFFF" }, right: { size: 0, color: "FFFFFF" } }, verticalAlign: docx.VerticalAlign.CENTER, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: calisanunvan, font: "Calibri", size: 22})] })] }),
                    new TableCell({ borders:{top:{size:0,color:"FFFFFF"},bottom:{size:0,color:"FFFFFF"},left:{size:0,color:"FFFFFF"},right:{size:0,color:"FFFFFF"}},verticalAlign:docx.VerticalAlign.CENTER,children:[new Paragraph({alignment:AlignmentType.CENTER,children:[new TextRun({text:isverenunvanioku() ,font:"Calibri",size:22})]})]})
                ],            
            }),
            new docx.TableRow
            ({
                height: { value: 300, rule: docx.HeightRule.EXACT },
                children:
                [
                    new TableCell({ borders: { top: { size: 0, color: "FFFFFF" }, bottom: { size: 0, color: "FFFFFF" }, left: { size: 0, color: "FFFFFF" }, right: { size: 0, color: "FFFFFF" } }, verticalAlign: docx.VerticalAlign.CENTER, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "İmza", font: "Calibri", size: 22})] })] }),
                    new TableCell({ borders:{top:{size:0,color:"FFFFFF"},bottom:{size:0,color:"FFFFFF"},left:{size:0,color:"FFFFFF"},right:{size:0,color:"FFFFFF"}},verticalAlign:docx.VerticalAlign.CENTER,children:[new Paragraph({alignment:AlignmentType.CENTER,children:[new TextRun({text:"İmza" ,font:"Calibri",size:22})]})]})
                ],            
            })
        );
        let imzatablo = new docx.Table({ rows: imzaliste, width: { size: 100, type: docx.WidthType.PERCENTAGE } });
        gorevlendirmesayfa.push
        (
            new Paragraph({ text: `ACİL DURUM MÜDAHALE EKİP GÖREVLENDİRMESİ`, spacing: { after: 200 }, style: "Baslik" }),
            new Paragraph({ text: `\tİşyeri Unvanı: ${isyeriadi}`, spacing: { after: 100 }, style: "Normal" }),
        );
        if (adres && adres.trim() !== "")
        {
            gorevlendirmesayfa.push(new Paragraph({ text: `\tAdres: ${adres}`, spacing: { after: 100 }, style: "Normal" }));
        }
        if (isyerisicil && isyerisicil.trim() !== "")
        {
            gorevlendirmesayfa.push(new Paragraph({ text: `\tSGK Sicil No: ${isyerisicil}`, spacing: { after: 100 }, style: "Normal" }));
        }
        gorevlendirmesayfa.push(new Paragraph({ text: `\tÇalışan Ad Soyadı: ${calisan.x}`, spacing: { after: 100 }, style: "Normal" }));
        if (calisan.y && calisan.y.trim() !== "")
        {
            gorevlendirmesayfa.push(new Paragraph({ text: `\tÇalışan Unvan: ${calisan.y}`, spacing: { after: 100 }, style: "Normal" }));
        };
        gorevlendirmesayfa.push(new Paragraph({ text: `\tEkip Görevi: ${calisan.ekipgorev || ""}`, spacing: { after: 200 }, style: "Normal" }));
        gorevlendirmesayfa.push(new Paragraph({ text: `\tİşyeri unvanı ve adı soyadı yukarıda yazılı olan çalışan, 6331 Sayılı İş Sağlığı ve Güvenliği Kanununu 11.Maddesi ile İşyerlerinde Acil Durumlar Hakkında Yönetmelik kapsamında aşağıda belirtilen görevleri yürütmek ve uygulamak amacı ile atama yolu ile görevlendirilmiştir. 6698 Sayılı Kişisel Verilerin Korunması Kanunu çerçevesinde kimlik ve iletişim bilgilerimin işyerinde ilan edilerek aktarılacağı konusunda bilgilendirildim ve özgür iradem ile açık rıza gösterdim.`, spacing: { after: 200 }, style: "Normal" }));
        if (ekipindex === 5 || ekipindex === 6 || ekipindex === 7)
        {
            gorevlendirmesayfa.push(new Paragraph({ text: `\tKoruma Ekibinin Görevleri`, spacing: { after: 100 }, style: "Kalin" }));
            gorevlendirmesayfa.push(new Paragraph({ text: `\t1-) Acil durum planında belirtilen müdahale ve hareket planına uygun şekilde hızlı ve etkin hareket etmek,`, spacing: { after: 100 }, style: "Normal" }));
            gorevlendirmesayfa.push(new Paragraph({ text: `\t2-) Olay yerine gelen çalışan yakınlarını sakinleştirmek ve uygun bilgilendirmeyi sağlamak,`, spacing: { after: 100 }, style: "Normal" }));
            gorevlendirmesayfa.push(new Paragraph({ text: `\t3-) Güvenlik amacıyla olay yerinde kontrollü alan oluşturmak, sadece yetkili kişilerin (İtfaiye, ambulans, polis vb.) geçişine izin vermek,`, spacing: { after: 100 }, style: "Normal" }));
            gorevlendirmesayfa.push(new Paragraph({ text: `\t4-) Söndürme, ilkyardım ve diğer ekiplerle etkin iletişim ve koordinasyonu sağlamak,`, spacing: { after: 100 }, style: "Normal" }));
            gorevlendirmesayfa.push(new Paragraph({ text: `\t5-) Acil çıkış yollarının ve toplanma alanlarının açık ve güvenli kalmasını sağlamak, kalabalık veya panik oluşumunu önlemek,`, spacing: { after: 100 }, style: "Normal" }));
            gorevlendirmesayfa.push(new Paragraph({ text: `\t6-) Tahliye sırasında özel ihtiyaç sahibi çalışanlara yardımcı olmak. (engelliler, hamileler vb.)`, spacing: { after: 100 }, style: "Normal" }));
            gorevlendirmesayfa.push(new Paragraph({ text: `\t`, style: "Normal" }), imzatablo);
        }
        else if (ekipindex === 3 || ekipindex === 4)
        {
            gorevlendirmesayfa.push(new Paragraph({ text: `\tSöndürme Ekibinin Görevleri`, spacing: { after: 100 }, style: "Kalin" }));
            gorevlendirmesayfa.push(new Paragraph({ text: `\t1-) İşyerinde hazırlanmış acil durum planındaki müdahale adımlarına uygun şekilde yangın olaylarına müdahale etmek.`, spacing: { after: 100 }, style: "Normal" }));
            gorevlendirmesayfa.push(new Paragraph({ text: `\t2-) Yangın söndürme ekipmanlarının (yangın tüpleri, hortumlar vb.) sürekli çalışır durumda ve erişilebilir olmasını sağlamak.`, spacing: { after: 100 }, style: "Normal" }));
            gorevlendirmesayfa.push(new Paragraph({ text: `\t3-) Yangın çıktığında, en kısa sürede olay yerine intikal ederek yangına uygun ekipmanla güvenli şekilde ilk müdahaleyi yapmak.`, spacing: { after: 100 }, style: "Normal" }));
            gorevlendirmesayfa.push(new Paragraph({ text: `\t4-) Yangın tamamen söndürüldükten sonra, yeniden alevlenme riskine karşı olay yerini gözetim altında tutmak ve terk etmemek.`, spacing: { after: 100 }, style: "Normal" }));
            gorevlendirmesayfa.push(new Paragraph({ text: `\t5-) Koruma, Kurtarma ve İlkyardım ekipleriyle koordinasyon içinde çalışarak yangının büyümesini ve can kaybını önlemeye yönelik görev almak.`, spacing: { after: 100 }, style: "Normal" }));
            gorevlendirmesayfa.push(new Paragraph({ text: `\t`, style: "Normal" }), imzatablo);
        }
        else if (ekipindex === 1 || ekipindex === 2)
        {
            gorevlendirmesayfa.push(new Paragraph({ text: `\tİlkyardım Ekibinin Görevleri`, spacing: { after: 100 }, style: "Kalin" }));
            gorevlendirmesayfa.push(new Paragraph({ text: `\t1-) İşyerinde hazırlanmış acil durum planındaki hareket ve müdahale adımlarına uygun şekilde hareket etmek,`, spacing: { after: 100 }, style: "Normal" }));
            gorevlendirmesayfa.push(new Paragraph({ text: `\t2-) Acil durumda anında yaralıların tespitini yapmak; durumu ağır olandan başlamak üzere ilkyardım uygulamak,`, spacing: { after: 100 }, style: "Normal" }));
            gorevlendirmesayfa.push(new Paragraph({ text: `\t3-) Yaralının ambulans gelene kadar hayati fonksiyonlarını sürdürebilmesi için gerekli müdahaleleri yapmak,`, spacing: { after: 100 }, style: "Normal" }));
            gorevlendirmesayfa.push(new Paragraph({ text: `\t4-) Sağlık ekipleri geldikten sonra durumu aktarmak ve sağlık ekiplerine gerekli desteği sağlamak,`, spacing: { after: 100 }, style: "Normal" }));
            gorevlendirmesayfa.push(new Paragraph({ text: `\t5-) Olay yeri ve kişisel güvenliği sağlamak; yaralıları tehlike kaynağından uzaklaştırarak güvenli bir alanda müdahale etmek,`, spacing: { after: 100 }, style: "Normal" }));
            gorevlendirmesayfa.push(new Paragraph({ text: `\t`, style: "Normal" }), imzatablo);
        }
        else if (ekipindex === 8 || ekipindex === 9)
        {
            gorevlendirmesayfa.push(new Paragraph({ text: `\tKurtarma Ekibinin Görevleri`, spacing: { after: 100 }, style: "Kalin" }));
            gorevlendirmesayfa.push(new Paragraph({ text: `\tİşyerinde hazırlanmış acil durum planında belirtilen hareket ve müdahale planına uygun şekilde müdahale etmek,`, spacing: { after: 100 }, style: "Normal" }));
            gorevlendirmesayfa.push(new Paragraph({ text: `\tAcil durum anında tehlikeli bölgede bulunan kişileri hızlı ve güvenli bir şekilde tahliye etmek,`, spacing: { after: 100 }, style: "Normal" }));
            gorevlendirmesayfa.push(new Paragraph({ text: `\tYaralı veya kendi başına tahliye olamayan kişilerin güvenli bir şekilde tehlikeli bölgeden çıkarılmasını sağlamak,`, spacing: { after: 100 }, style: "Normal" }));
            gorevlendirmesayfa.push(new Paragraph({ text: `\tPolis, İtfaiye, AFAD, Ambulans vb. resmi müdahale ekipleriyle koordinasyon sağlamak ve ihtiyaç duyulursa olayla veya kişilerin durumu ile ilgili bilgi vermek,`, spacing: { after: 100 }, style: "Normal" }));
            gorevlendirmesayfa.push(new Paragraph({ text: `\tKoruma, Söndürme ve İlkyardım ekipleriyle koordineli şekilde çalışmak.`, spacing: { after: 100 }, style: "Normal" }));
            gorevlendirmesayfa.push(new Paragraph({ text: `\t`, style: "Normal" }), imzatablo);
        }
        else if (ekipindex === 10)
        {
            gorevlendirmesayfa.push(new Paragraph({ text: `\t`, style: "Normal" }), imzatablo);
        }
        if (index !== acldurumekiplistesijson.length - 1)
        {
            gorevlendirmesayfa.push(new Paragraph({ children: [new PageBreak()] }));
        }
    });
    const doc = new docx.Document
    ({
        styles:
        {
            paragraphStyles:
            [
                {id: "Normal", run: { font: "Calibri", size: 22 }, paragraph: {alignment: AlignmentType.JUSTIFIED }},
                {id: "Kalin", run: { font: "Calibri", size: 22, bold: true }, paragraph: {alignment: AlignmentType.JUSTIFIED }},
                {id: "Baslik", run: { font: "Calibri", size: 24, bold: true }, paragraph: { alignment: AlignmentType.CENTER }}
            ]
        },
        sections:
        [
            {properties:{page:{size:{orientation:docx.PageOrientation.PORTRAIT},margin:{top:1134,right:851,bottom:1134,left:851}}},children:[...gorevlendirmesayfa],footers:{default:new docx.Footer({children:[]})}},
            {properties:{page: { size: { orientation: docx.PageOrientation.LANDSCAPE }, margin: { top: 1134, right: 851, bottom: 1134, left: 851 } } }, children: [acildurumanatablo], footers: { default: new docx.Footer({ children: [docxucluimzadikey(uzmanad, uzmanno, hekimad, hekimno, isveren)] }) } },
        ]
    });
    const blob = await Packer.toBlob(doc);
    saveAs(blob, "Acil Durum Ekip Listesi.docx");
}

function acildurumsertifikakontrol()
{
    $('#loading').show();
    $.when(acildurumegitimpdf())
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

async function acildurumegitimpdf()
{
    const iconBase64 = 'data:image/png;base64,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AADGPwAIACACAGD8A4AAACIAAMY/AAgAIAIAYPwDgAAAIgAAxj8ACAAgAgAY/8Y/AAgAIAIAGP8AgAAAIgCA8Q8ACAAgAgAY/wAgAAAiAIDxDwACACACABj/ACAAgAgAgPEPAAIAiAAAGP8AIACACABg/AMAAgCIAADGPwAgAIAIAGD8AwACAIgAAMY/AAgAgAgAYPwDgAAAiAAAxj8ACACACABg/AOAAAAigAgAGP8AgAAAIgCA8Q8ACAAgAgAY/wCAAAAiAIDxDwAIACACABj/ACAAACIAgPEPAAIAIAIAGP8AIAAAIgCA8Q8AAgAgAgDGPwAgAAAiAGD8AwACAIgAAMY/ACAAgAgAYPwDAAIAiAAAxj8ACACOAEQAAOMfAAQAQAQAMP4BQAAARADA+AcABABABACMfwBAAABEAMD4BwAEAEAEAIx/AEAAABFABACMfwBAAAARAMD4BwAEABABAIx/ABAAABEAMP4BAAEAEAEA4x8AEAAAEQAw/gEAAQAQAQDjHwAQAAARADD+AQABABABAOMfABAAABEAMP4BAAEARAAA4x8ABABABACMfwBAAABEAMD4BwAEAEAEAIx/AEAAAEQAwPgHAAQAQAQAjH8AQAAARADA+AcABABABACMfwBAAABEADD+AQABABABRAAw/gEAAQAQAQDjHwAQAAARADD+AQABABABAOMfABAAABEAMP4BAAEAEAEA4x8AEAAAEQCMf+MfABAAABEAjH8AAAEAEAHA+AcABAAAEQCMfwBAAABEAMD4BwAEAEAEAIx/AEAAAEQAwPgHAAQAQAQAjH8AQAAARAAw/gEABABABADjHwBAAABEADD+AQABAEAEAOMfABAAAEQAMP4BAAEAEAFEADD+AQABABABAOMfABAAABEAjH8AAAEAEAHA+AcAEAAAEQCMfwAAAQAQAcD4BwAEAAARAIx/AEAAABABwPgHAAQAABEAjH8AQAAAEAHA+AcABABABADjHwBAAABEADD+AQAEAEAEAOMfAEAAAEQAMP4BAAQAQAQA4x8AEAAARAAw/gEAAQBABADjHwAQAABEAIx/AAABAEAEwPgHABAAAEQAjH8AAAEAEAHA+AcAEAAAEQCMfwAAAQAQAcD4BwAEAAARAIx/AEAAABABMP4BAAQAABEA4x8AQAAAEAEw/gEABAAAEQDjHwBAAAAQATD+AQAEAEAEEAEw/gEABABABADjHwAQAABEADD+AQABAEAEwPgHABAAAEQAjH8AAAEAQATA+AcAEAAARACMfwAAAQBABMD4BwAQAABEAIx/AAABAEAEwPgHABAAABEA4x8AQAAAEAEw/gEABAAAEQDjHwBAAAAQATD+AQAEAAARAOMfAEAAABABMP4BAAQAABEA4x8AQAAAOHcEMBiNfwCAsG46AoCiaNv2l/R6XZZllf5y6kSMfwAAAQAgdggQAYYp38Xx5zT+/+ooAAA+zkcAAP5PGpEP0tsDJzGo8X83/b4dOQoAAAEAYNMIcJje7nXjkv7KD2/8Kv1+eYgjAIAAAHDuCJB/ouwbAvrrsFj/5F+kAQA4gx1HAHC63d3dSXp7kV57TqM3POwPAGBDHgII8AndNwT8rSzLn9Nf3kmvW07l2uS7Mf6Yxv/fHQUAwGZ8BADgjNLofFb4SMB1en/+Pu8PAHA+PgIAcA67u7tP0ttjJ3EllsX6lv+5owAAOD93AACcQxqjOQDcLtwNcNnyT/1vG/8AANtzBwDAlnZ3dx8V67sBJk7jwuSwsm/4AwAIAAB9iwB5/B+k18xpbGXVDf9DRwEAIAAA9DkEVF0I8JWBmw//5+n1LI3/leMAABAAAIYSAupi/bGA2mkY/gAAAgDAOELA/cJHAwx/AAABAGAUIaAq1ncE5I8GjPlhgctu+B8a/gAAAgBA5BAw6SLAw/Sajugf/TC9XnqqPwCAAAAwxhiQA8D9LghUAf8R81f55Z/2H/lpPwCAAABArBgwT6/X3ehf+p0FABAAAPjtGFB1IeCbYv0tAn1+ZsDyg9E/95N+AAABAIDzB4F8d8C0CwInv74Oedzn2/qPu/eFn/IDAAgAAFx+FKi6GPBl9+vJBcWBefd+/MFfL419AAABAID+BYKNYoCn8wMAAAAAAARwwxEAAACAAAAAAAAIAAAAAIAAAAAAAAgAAAAAgAAAAAAACAAAAACAAAAAAAAIAAAAACAAAAAAAAIAAAAAIAAAAAAAAgAAAAAgAAAAAAACAAAAACAAAAAAAAIAAAAACAAAAACAAAAAAAAIAAAAAIAAAAAAAAgAAAAAgAAAAAAACAAAAACAAAAAAAACAAAAACAAAAAAAAIAAAAAIAAAAAAAAgAAAAAgAAAAAAACAAAAACAAAAAAAAIAAAAACAAAAACAAAAAAAAIAAAAAIAAAAAAAAgAAAAAgAAAAAAACAAAAACAAAAAAAACAAAAACAAAAAAAAIAAAAAIAAAAAAAAgAAAAAgAAAAAAACAAAAACAAAAAAgAAAAAAACAAAAACAAAAAAAAIAAAAAIAAAAAAAAgAAAAAgAAAAAAACAAAAACAAAAAAAACAAAAACAAAAAAAAIAAAAAIAAAAAAAAgAAAAAgAAAAAAACAAAAACAAAAAAgAAAAAAACAAAAACAAAAAAAAIAAAAAIAAAAAAAAgAAAAAgAAAAAAACAAAAAAgAAAAAAACAAAAACAAAAAAAAIAAAAAIAAAAAAAAgAAAAAgAAAAAAACAAAAACAAAAAAgAAAAAAACAAAAACAAAAAAAAIAAAAAIAAAAAAAAgAAAAAgAAAAAAACAAAAAAgAAAAAAACAAAAACAAAAAAAAIAAAAAIAAAAAAAAgAAAAAgAAAAAAACAAAAAAgAAAAAgAAAAAAACAAAAACAAAAAAAAIAAAAAIAAAAAAAAgAAAAAgAAAAAAACAAAAAAgAAAAAAACAAAAACAAAAAAAAIAAAAAIAAAAAAAAgAAAAAgAAAAAAACAAAAAAgAAAAAgAAAAAAACAAAAACAAAAAAAAIAAAAAIAAAAAAAAgAAAAAgAAAAAAAAgAAAAAgAAAAAAACAAAAACAAAAAAAAIAAAAAIAAAAAAAAgAAAAAgAAAAAAACAAAAAAgAAAAAgAAAAAAACAAAAACAAAAAAAAIAAAAAIAAAAAAAAgAAAAAgAAAAAAAAgAAAAAgAAAAAAACAAAAACAAAAAAAAIAAAAAIAAAAAAAAgAAAAAgAAAAAIAAAAAAAAgAAAAAgAAAAAAACAAAAMB/2bEDGQAAAIBB/tb3+AojAAEAAAAACAAAAABAAAAAAAACAAAAABAAAAAAIAAAAAAAAQAAAAAIAAAAAEAAAAAAAAIAAAAAEAAAAACAAAAAAAAEAAAAAAgAAAAAQAAAAAAAAgAAAAAQAAAAAIAAAAAAAAQAAAAAIAAAAAAAAQAAAAACAAAAABAAAAAAgAAAAAAABAAAAAAgAAAAAAABAAAAAAgAAAAAQAAAAAAAAgAAAAAEAAAAACAAAAAAAAEAAAAACAAAAABAAAAAAAACAAAAABAAAAAAgAAAAAAAAQAAAAAIAAAAAEAAAAAAAAIAAAAAEAAAAACAAAAAAAAEAAAAACAAAAAAQAAAAAAAAgAAAAAQAAAAAIAAAAAAAAQAAAAAIAAAAAAAAQAAAAAIAAAAAEAAAAAAgAAAAAAAFhJAgAEApKo6nvcfVk8AAAAASUVORK5CYII=';
    let uzmanad = store.get("uzmanad");
    let uzmanno = store.get("uzmanno");
    let isyeri = jsoncevir(store.get('xjsonfirma')) || {};
    let hekimad = isyeri.hk;
    let hekimno = isyeri.hn;
    let calisanliste = acildurumekipjson();
    let isyeriadi = isyeri.fi;
    let isverenvekili = isyeri.is;
    let egitimtarih = $("#admetarih").val() || "......./......./20...";
    let egitimsaat = $("#admesaat").val();
    let egitimyeri = "Örgün";
    let bosluk = 45;
    let egitimicerik = { "baslik": "ACİL DURUM EĞİTİMİ KATILIM SERTİFİKASI", "paragraf": "\u200B\t\t\tAdı ve soyadı yukarıda yazılı olan çalışan, “İşyerlerinde Acil Durumlar Hakkında Yönetmeliği Madde-15” kapsamında aşağıda yer alan konularda eğitim programına katılmış ve başarılı olmuştur.", "maddeler": ["İşyerinde oluşabilecek acil durumlar", "Acil durum sırasında alınacak tedbirler ve hareket planı", "İlkyardım ekibinin görev ve sorumlulukları", "Yangın söndürme ekibinin görev ve sorumlulukları", "Arama, kurtarma ve tahliye ekibinin görev ve sorumlulukları", "Koordinasyon ve koruma ekibinin görev ve sorumlulukları"] };
    const docDefinition =
    {
        images: { tickIcon: iconBase64,}, styles: {ustbaslik: { fontSize: 14, bold: true, alignment: 'center' }, normalsatir: { fontSize: 11, alignment: 'justify' }},
        pageOrientation: 'landscape',
        content: calisanliste.map((calisan, index) =>
        {
            const ekipindex = parseInt(calisan.ekipkod, 10);
            let calisanunvan = "";
            if(ekipindex===5||ekipindex===6||ekipindex===7)calisanunvan="Koruma Ekibi";else if(ekipindex===3||ekipindex===4)calisanunvan="Söndürme Ekibi";else if(ekipindex===1||ekipindex===2)calisanunvan="İlkyardım Ekibi";else if(ekipindex===8||ekipindex===9)calisanunvan="Kurtarma Ekibi";else calisanunvan="Destek Elemanı";
            const content =
            [
                { text: egitimicerik.baslik, style: 'ustbaslik', margin: [0, 50, 0, 10] },
                { text: 'İşyeri Unvanı: ' + isyeriadi, style: 'normalsatir', margin: [80, 0, 0, 5] },
                { text: 'Katılımcı Adı Soyadı: ' + calisan.x, style: 'normalsatir', margin: [80, 0, 0, 5] },
                { text: 'Katılımcının Görev Unvanı: ' + calisanunvan, style: 'normalsatir', margin: [80, 0, 0, 5] },
                { text: 'Tarih: ' + egitimtarih, style: 'normalsatir', margin: [80, 0, 0, 5] },
                { text: 'Eğitim Süresi: ' + egitimsaat, style: 'normalsatir', margin: [80, 0, 0, 5] },
                { text: 'Eğitim Şekli: ' + egitimyeri, style: 'normalsatir', margin: [80, 0, 0, 5] },
                { text: egitimicerik.paragraf, style: 'normalsatir', margin: [46, 0, 50, 5] },
                ...egitimicerik.maddeler.map(madde => ({
                columns:
                [
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
            if (index < calisanliste.length - 1)
            {
                content.push({ text: '', pageBreak: 'after' });
            }
            return content;
        }).flat()
    };
    sertifikaarkaplan(docDefinition);
    const blob = await new Promise((resolve, reject) =>
    {
        pdfMake.createPdf(docDefinition).getBlob((blob) => blob ? resolve(blob) : reject(new Error("PDF oluşturulamadı")));
    });
    saveAs(blob, 'ADME Eğitim.pdf');
}

async function acildurumkatılımlistesiyaz()
{
    let uzmanad = store.get("uzmanad");
    let uzmanno = store.get("uzmanno");
    let isyeri = jsoncevir(store.get('xjsonfirma')) || {};
    let hekimad = isyeri.hk;
    let hekimno = isyeri.hn;
    let calisanliste = acildurumekipjson();
    if (!Array.isArray(calisanliste) || calisanliste.length === 0)
    {
        calisanliste = Array.from({ length: 13 }, () => ({ x: "", ekipgorev: "" }));
    }
    let isyeriismi = isyeri.fi;
    let egitimsaat = $("#admesaat").val();
    let egitimyeri = "Örgün";
    let egitimtarih = $("#admetarih").val() || "......./......./20...";
    const katilimlistesi = { pageMargins: [25, 25, 25, 25], content: [] };
    let egitimicerik = {"katilim": "ACİL DURUM EĞİTİMİ - EĞİTİM KATILIM TUTANAĞI", "baslik": "ACİL DURUM EĞİTİMİ KATILIM SERTİFİKASI", "paragraf": "\u200B\t\t\tAdı ve soyadı yukarıda yazılı olan çalışan, “İşyerlerinde Acil Durumlar Hakkında Yönetmeliği Madde-15” kapsamında aşağıda yer alan konularda eğitim programına katılmış ve başarılı olmuştur.", "maddeler": ["İşyerinde oluşabilecek acil durumlar", "Acil durum sırasında alınacak tedbirler ve hareket planı", "İlkyardım ekibinin görev ve sorumlulukları", "Yangın söndürme ekibinin görev ve sorumlulukları", "Arama, kurtarma ve tahliye ekibinin görev ve sorumlulukları", "Koordinasyon ve koruma ekibinin görev ve sorumlulukları"] };
    let konu = egitimicerik.maddeler.join(', ');
    function createParticipantTable(startIndex, endIndex)
    {
        let tableBody = [];
        tableBody.push(...digerkatilimustbilgi(isyeriismi, egitimtarih, egitimyeri, egitimsaat, konu, egitimicerik.katilim));
        for (let i = startIndex; i < endIndex; i++)
        {
            const calisan = calisanliste[i];
            tableBody.push([
                { text: (i + 1).toString(), alignment: 'center', fontSize: 10, margin: [0, 11, 0, 11] },
                { text: calisan.x || '', alignment: 'left', fontSize: 10, margin: [0, 11, 0, 11] },
                { text: calisan.ekipgorev || '', alignment: 'left', fontSize: 10, margin: [0, 11, 0, 11] },
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
    for (let i = 0; i < calisanliste.length; i += chunkSize)
    {
        const endIndex = Math.min(i + chunkSize, calisanliste.length);
        katilimlistesi.content.push(createParticipantTable(i, endIndex));
        if (endIndex < calisanliste.length)
        {
        katilimlistesi.content.push({ text: '', pageBreak: 'after' });
        }
    }
    pdfMake.createPdf(katilimlistesi).getBlob(function (blob) { saveAs(blob, 'Katılım Listesi.pdf');});
}

function acildurumustbilgi(i, t, e, s, k, bas)
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

async function acildurumgirisyazdocx()
{
    let acildurumkonusecim = store.get("acildurumkonusecim");
    let uzmanad = store.get("uzmanad");
    let uzmanno = store.get("uzmanno");
    let isyeri = jsoncevir(store.get('xjsonfirma'));
    var tehlikesinifimap = { 1: "Az Tehlikeli", 2: "Tehlikeli", 3: "Çok Tehlikeli"};
    let tehlikesinifi = tehlikesinifimap[isyeri.ts];
    let tehlikeno = isyeri.ts;
    let acildurumtarih = store.get("acildurumtarih");
    let acildurumyil = acildurumtarih.split('.')[2];
    let gecerlitarih = acildurumgecerlilik(acildurumtarih, parseInt(tehlikeno));
    let isyeriismi = isyeri.fi;
    let isyeriadresi = isyeri.ad;
    let isyerisehir = isyeri.sh;
    let isveren = isyeri.is;
    let hekimad = isyeri.hk;
    let hekimno = isyeri.hn;
    let sicil = isyeri.sc;
    let kapaksecim = parseInt($('#kapaksecim').val());
    let isyeribaslik = isyeribaslikayar(kapaksecim, isyeriismi);
    let ustbaslik = "";
    let altbaslik = "";
    if (isyeribaslik)
    {
        ustbaslik = isyeribaslik.ustbaslik.toLocaleUpperCase("tr-TR");
        altbaslik = isyeribaslik.altbaslik.toLocaleLowerCase('tr-TR').split(' ').map(w => w.charAt(0).toLocaleUpperCase('tr-TR') + w.slice(1)).join(' ');
    }
    const { Document, Packer, TextRun, Paragraph, BorderStyle, PageBreak, AlignmentType } = docx; 
    const girisparagraflar =
        [
            new Paragraph({ children: [new TextRun({ text: "ACİL DURUM PLANI", bold: true, size: 24, font: "Calibri" })], spacing: { before: 0, after: 100 }, alignment: "center" }),
            new Paragraph({ children: [new TextRun({ text: "İşyeri Unvanı", bold: true, size: 22, font: "Calibri" })], spacing: { before: 100, after: 100 }, alignment: "left" }),
            new Paragraph({ children: [new TextRun({ text: isyeriismi, size: 22, font: "Calibri" })], spacing: { before: 100, after: 100 }, alignment: "left" }),
            new Paragraph({ children: [new TextRun({ text: "İşyeri Adresi", bold: true, size: 22, font: "Calibri" })], spacing: { before: 100, after: 100 }, alignment: "left" }),
            new Paragraph({ children: [new TextRun({ text: isyeriadresi, size: 22, font: "Calibri" })], spacing: { before: 100, after: 100 }, alignment: "left" }),
            new Paragraph({ children: [new TextRun({ text: "İşyeri SGK Sicil No", bold: true, size: 22, font: "Calibri" })], spacing: { before: 100, after: 100 }, alignment: "left" }),
            new Paragraph({ children: [new TextRun({ text: sicil, size: 22, font: "Calibri" })], spacing: { before: 100, after: 100 }, alignment: "left" }),
            new Paragraph({ children: [new TextRun({ text: isverenadsoyadetiketi(), bold: true, size: 22, font: "Calibri" })], spacing: { before: 100, after: 100 }, alignment: "left" }),
            new Paragraph({ children: [new TextRun({ text: isveren, size: 22, font: "Calibri" })], spacing: { before: 100, after: 100 }, alignment: "left" }),
            new Paragraph({ children: [new TextRun({ text: "Acil Durum Plan Tarihi", bold: true, size: 22, font: "Calibri" })], spacing: { before: 100, after: 100 }, alignment: "left" }),
            new Paragraph({ children: [new TextRun({ text: acildurumtarih, bold: false, size: 22, font: "Calibri" })], spacing: { before: 100, after: 100 }, alignment: "left" }),
            new Paragraph({ children: [new TextRun({ text: "Acil Durum Planı Son Geçerlilik Tarihi", bold: true, size: 22, font: "Calibri" })], spacing: { before: 100, after: 100 }, alignment: "left" }),
            new Paragraph({ children: [new TextRun({ text: gecerlitarih, size: 22, font: "Calibri" })], spacing: { before: 100, after: 100 }, alignment: "left" }),
            new Paragraph({ children: [new TextRun({ text: "Acil Eylem Planı Revizyon Tarihi – Revizyon No", bold: true, size: 22, font: "Calibri" })], spacing: { before: 100, after: 100 }, alignment: "left" }),
            new Paragraph({ children: [new TextRun({ text: "01.10.2024-3", size: 22, font: "Calibri" })], spacing: { before: 100, after: 100 }, alignment: "left" }),
            new Paragraph({ children: [new TextRun({ text: "Hazırlayan Adı Soyadı - Unvanı", bold: true, size: 22, font: "Calibri" })], spacing: { before: 100, after: 100 }, alignment: "left" }),
            new Paragraph({ children: [new TextRun({ text: uzmanad + " - İş Güvenliği Uzmanı / " + hekimad + " İşyeri Hekimi", bold: false, size: 22, font: "Calibri" })], spacing: { before: 100, after: 100 }, alignment: "left" }),
            new Paragraph({ children: [new TextRun({ text: "Tehlike Sınıfı", bold: true, size: 22, font: "Calibri" })], spacing: { before: 100, after: 100 }, alignment: "left" }),
            new Paragraph({ children: [new TextRun({ text: tehlikesinifi, size: 22, font: "Calibri" })], spacing: { before: 100, after: 100 }, alignment: "left" }),
            new Paragraph({ children: [new TextRun({ text: "Çalışan Sayısı", bold: true, size: 22, font: "Calibri" })], spacing: { before: 100, after: 100 }, alignment: "left" }),
            new Paragraph({ children: [new TextRun({ text: $("#calisansayi").val(), size: 22, font: "Calibri" })], spacing: { before: 100, after: 100 }, alignment: "left" }),
            new Paragraph({ children: [new TextRun({ text: "İşyeri İletişim Bilgileri", bold: true, size: 22, font: "Calibri" })], spacing: { before: 100, after: 100 }, alignment: "left" }),
            new Paragraph({ children: [new TextRun({ text: $("#isyeriiletisim").val(), size: 22, font: "Calibri" })], spacing: { before: 100, after: 100 }, alignment: "left" }),
            ...Array(3).fill().map(() => new Paragraph({ text: "" })),
            new Paragraph({ children: [new PageBreak()] }),
            new Paragraph({ children: [new TextRun({ text: "\tTANIMLAR", bold: true, size: 24, font: "Calibri" })], spacing: { before: 0, after: 100 }, alignment: "left" }),
            new Paragraph({ children: [new TextRun({ text: "\tAcil durum:", bold: true, font: "Calibri", size: 22 }), new TextRun({ text: " İşyerinin tamamında veya bir kısmında meydana gelebilecek veya işyerini dışarıdan etkileyebilecek yangın, patlama, tehlikeli kimyasal maddelerden kaynaklanan yayılım, zehirlenme, salgın hastalık, radyoaktif sızıntı, sabotaj ve doğal afet gibi ivedilikle müdahale gerektiren olayları ifade eder.", font: "Calibri", size: 22 })], alignment: AlignmentType.JUSTIFIED, spacing: { after: 100 } }),
            new Paragraph({ children: [new TextRun({ text: "\tAcil durum planı:", bold: true, font: "Calibri", size: 22 }), new TextRun({ text: " İşyerlerinde meydana gelebilecek acil durumlarda yapılacak iş ve işlemler ile uygulamaya yönelik eylemlerin yer aldığı planı ifade eder.", font: "Calibri", size: 22 })], alignment: AlignmentType.JUSTIFIED, spacing: { after: 100 } }),
            new Paragraph({ children: [new TextRun({ text: "\tToplanma yeri:", bold: true, font: "Calibri", size: 22 }), new TextRun({ text: " Acil durumların olumsuz sonuçlarından çalışanların etkilenmeyeceği mesafede veya korunakta belirlenmiş güvenli yeri ifade eder.", font: "Calibri", size: 22 })], alignment: AlignmentType.JUSTIFIED, spacing: { after: 100 } }),
            new Paragraph({ children: [new TextRun({ text: "\tAcil Çağrı:", bold: true, font: "Calibri", size: 22 }), new TextRun({ text: " Acil durumlarda, etkilenen veya etkilenenleri gören kişi ya da acil durum algılayıcı cihazlar tarafından, telefon, telsiz, kısa mesaj, otomatik mesaj, sosyal medya, internet ve diğer iletişim araçları ile acil çağrı merkezlerine yapılan başvuruyu ifade eder.", font: "Calibri", size: 22 })], alignment: AlignmentType.JUSTIFIED, spacing: { after: 100 } }),
            new Paragraph({ children: [new TextRun({ text: "\tAcil Çağrı Merkezi (112):", bold: true, font: "Calibri", size: 22 }), new TextRun({ text: " Kullanıcıların veya acil durum algılayıcı cihazların acil yardım talebinde bulunmak amacıyla acil yardım çağrı hizmeti numaralarına doğru yapacakları çağrılara cevap vermekle yetkili kurum veya kuruluşu ifade eder. Bu kapsamda, yasal düzenlemeye göre ülkemizde 112 acil çağrı merkezini ifade eder.", font: "Calibri", size: 22 })], alignment: AlignmentType.JUSTIFIED, spacing: { after: 100 } }),
            new Paragraph({ children: [new TextRun({ text: "\tAcil Çıkış:", bold: true, font: "Calibri", size: 22 }), new TextRun({ text: " Tehlike anında kapalı mekândaki insanların süratle ve güvenli bir şekilde tahliye edilmesine imkân verecek yolu ve dışarıya doğru açılan kapıyı ifade eder.", font: "Calibri", size: 22 })], alignment: AlignmentType.JUSTIFIED, spacing: { after: 100 } }),
            new Paragraph({ children: [new TextRun({ text: "\tAFAD:", bold: true, font: "Calibri", size: 22 }), new TextRun({ text: " Afet ve Acil Durum Yönetimi Başkanlığını ifade eder.", font: "Calibri", size: 22 })], alignment: AlignmentType.JUSTIFIED, spacing: { after: 100 } }),
            new Paragraph({ children: [new TextRun({ text: "\tAcil Durum Risk Seviyesi:", bold: true, font: "Calibri", size: 22 }), new TextRun({ text: " Acil durumun yol açtığı ve acil duruma bağlı nedenlerle oluşabilecek can kayıpları, yaralanma ve sakat kalmalar, yapı ve altyapı hasarları gibi fiziksel hasarlarla ekonomik, sosyal ve psikolojik kayıpların tümünü ifade eder.", font: "Calibri", size: 22 })], alignment: AlignmentType.JUSTIFIED, spacing: { after: 100 } }),
            new Paragraph({ children: [new TextRun({ text: "\tBoğulma:", bold: true, font: "Calibri", size: 22 }), new TextRun({ text: " Sel, deniz, göl, kuyu, sıvı birikintisi oluşabilecek çukurlar vb. alanlarda nefes borusuna sıvı dolması, suda nefessiz kalma, tank vb. kapalı alanlarda gazla zehirlenme, yangın anında oluşan karbon monoksit nedeniyle vücuttaki dokulara yeterli oksijen gitmemesi sonucu dokularda bozulma meydana gelmesi durumunu ifade eder.", font: "Calibri", size: 22 })], alignment: AlignmentType.JUSTIFIED, spacing: { after: 100 } }),
        ];
        if (acildurumkonusecim.yangin === 1)
        {
            girisparagraflar.push(new Paragraph({ children: [new TextRun({ text: "\tYangın:", bold: true, font: "Calibri", size: 22 }), new TextRun({ text: " Maddenin yeterli derecede ısı ve oksijen (hava) ile birleşmesi sonucunda yanarak kimyasal şekil değişliğine uğraması olayını ifade eder. Yangının oluşabilmesi için yanıcı madde, yüksek ısı ve oksijene ihtiyaç vardır. Kontrolsüz veya kontrol edilemeyen şekilde açığa çıkan, yakıcı etkisiyle madde ve eşyaları kullanılmaz hâle getiren, boğucu etkisiyle canlıların yaşamına son veren tehlikedir.", font: "Calibri", size: 22 })], alignment: AlignmentType.JUSTIFIED, spacing: { after: 100 } }),);
        }
        if (acildurumkonusecim.deprem === 1)
        {
            girisparagraflar.push(new Paragraph({ children: [new TextRun({ text: "\tDeprem:", bold: true, font: "Calibri", size: 22 }), new TextRun({ text: " Tektonik kuvvetlerin veya volkan faaliyetlerinin etkisiyle yer kabuğunun kırılması sonucunda ortaya çıkan enerjinin sismik dalgalar hâlinde yayılarak geçtikleri ortamları ve yeryüzünü kuvvetle sarsması olayını ifade eder.", font: "Calibri", size: 22 })], alignment: AlignmentType.JUSTIFIED, spacing: { after: 100 } }),);
        }
        if (acildurumkonusecim.sel === 1)
        {
            girisparagraflar.push(new Paragraph({ children: [new TextRun({ text: "\tSel:", bold: true, font: "Calibri", size: 22 }), new TextRun({ text: " Suların bulunduğu yerde yükselerek veya başka bir yerden gelerek, genellikle kuru olan yüzeyleri kaplaması olayı.", font: "Calibri", size: 22 })], alignment: AlignmentType.JUSTIFIED, spacing: { after: 100 } }),);
        }
        if (acildurumkonusecim.sabotaj === 1)
        {
            girisparagraflar.push(new Paragraph({ children: [new TextRun({ text: "\tSabotaj:", bold: true, font: "Calibri", size: 22 }), new TextRun({ text: " İşyeri veya çalışanlarını hedef alan ve idari yapının tamamen veya geçici bir süre için faaliyet dışı kalmasını sağlamak amacıyla tahribine yönelik saldırgan bir yıkıcı faaliyet şeklini ifade eder.", font: "Calibri", size: 22 })], alignment: AlignmentType.JUSTIFIED, spacing: { after: 100 } }),);
            girisparagraflar.push(new Paragraph({ children: [new TextRun({ text: "\tGasp:", bold: true, font: "Calibri", size: 22 }), new TextRun({ text: " Başkasının zilyetliğindeki taşınabilir bir malı, zilyedinin rızası olmaksızın, faydalanmak amacıyla, cebir veya tehdit kullanarak bulunduğu yerden almayı ifade eder.", font: "Calibri", size: 22 })], alignment: AlignmentType.JUSTIFIED, spacing: { after: 100 } }),);
            girisparagraflar.push(new Paragraph({ children: [new TextRun({ text: "\tKaçırılma:", bold: true, font: "Calibri", size: 22 }), new TextRun({ text: " Kişiyi hürriyetinden yoksun bırakmak amacıyla bir kişiyi hukuka aykırı yollarla, iradesi dışında, bir yere götürmek veya bir yerde bulundurmayı, alıkoymayı ifade eder.", font: "Calibri", size: 22 })], alignment: AlignmentType.JUSTIFIED, spacing: { after: 100 } }),);
        }
        if (acildurumkonusecim.elektrik === 1)
        {
            girisparagraflar.push(new Paragraph({ children: [new TextRun({ text: "\tElektrik:", bold: true, font: "Calibri", size: 22 }), new TextRun({ text: " Elektrik tesisatında veya elektrikli ekipmanlardan kaynaklanan hata akımı, yanlış müdahale/temas veya atlama sonucunda insanda oluşturduğu olumsuz etkiyi ifade eder. Alternatif akımda 50 Volt ve üzeri, doğru akımda ise 120 volt üzeri elektrik çarpması tehlikeli olarak kabul edilir.", font: "Calibri", size: 22 })], alignment: AlignmentType.JUSTIFIED, spacing: { after: 100 } }),);
        }
        if (acildurumkonusecim.salgin === 1)
        {
            girisparagraflar.push(new Paragraph({ children: [new TextRun({ text: "\tSalgın Hastalık:", bold: true, font: "Calibri", size: 22 }), new TextRun({ text: " Belirli bir alanda, belirli bir grup insan arasında, belirli bir süre boyunca bir biyolojik risk etmeninden kaynaklanan hastalığın bireylerde beklenenden daha fazla görülmesi, anormal miktarda artması durumu ve bulaşmasını ifade eder. Covid-19 bu hastalığa örnek gösterilebilir. Bir hastalığın beklenen görülme sıklığı ve salgın hastalık olup olmadığı Dünya Sağlık Örgütü ve T.C. Sağlık Bakanlığı tarafından belirlenir.", font: "Calibri", size: 22 })], alignment: AlignmentType.JUSTIFIED, spacing: { after: 100 } }),);
            girisparagraflar.push(new Paragraph({ children: [new TextRun({ text: "\tBiyolojik Kaynaklı Yayılım/Sızıntı:", bold: true, font: "Calibri", size: 22 }), new TextRun({ text: " Biyolojik etkenle doğrudan çalışılan veya biyolojik etkenin kullanıldığı bir işyerinden biyolojik risk etmeninin sızıntısını ifade eder.", font: "Calibri", size: 22 })], alignment: AlignmentType.JUSTIFIED, spacing: { after: 100 } }),);
        }
        if (acildurumkonusecim.iskaza === 1)
        {
            girisparagraflar.push(new Paragraph({ children: [new TextRun({ text: "\tİş Kazası:", bold: true, font: "Calibri", size: 22 }), new TextRun({ text: " İşyerinde veya işin yürütümü nedeniyle meydana gelen, ölüme sebebiyet veren veya vücut bütünlüğünü ruhen ya da bedenen engelli hâle getiren olayı ifade eder.", font: "Calibri", size: 22 })], alignment: AlignmentType.JUSTIFIED, spacing: { after: 100 } }),);
        }
        if (acildurumkonusecim.gida === 1)
        {
            girisparagraflar.push(new Paragraph({ children: [new TextRun({ text: "\t Zehirlenme", bold: true, font: "Calibri", size: 22 }), new TextRun({ text: " Az miktarlarda solunduğunda, ağız yoluyla alındığında, deri yoluyla emildiğinde insan sağlığı üzerinde akut veya kronik hasarlar meydana getiren olayı ifade eder.", font: "Calibri", size: 22 })], alignment: AlignmentType.JUSTIFIED, spacing: { after: 100 } }),);
        }
        if (acildurumkonusecim.yildirim === 1)
        {
            girisparagraflar.push(new Paragraph({ children: [new TextRun({ text: "\tYıldırım Düşmesi:", bold: true, font: "Calibri", size: 22 }), new TextRun({ text: " Yeryüzü ile bulutlar arasında meydana gelen elektrik boşalması sonucunda oluşan yıldırımın, işyerine veya bir canlıya isabet etmesini ifade eder.", font: "Calibri", size: 22 })], alignment: AlignmentType.JUSTIFIED, spacing: { after: 100 } }),);
        }
        if (acildurumkonusecim.basiclikap === 1)
        {
            girisparagraflar.push(new Paragraph({ children: [new TextRun({ text: "\tBasınçlı Kap Patlaması:", bold: true, font: "Calibri", size: 22 }), new TextRun({ text: " Kaynaklı, 0,5 bar’dan daha yüksek iç basınca tabi tutulması amaçlanan bir kabın, içinde bulunan gazın azami basınç seviyesinin üzerine çıkarak aniden, kontrolsüz bir biçimde boşalması ve metal aksamın parçalanarak hızlı bir şekilde etrafa yayılmasıdır.", font: "Calibri", size: 22 })], alignment: AlignmentType.JUSTIFIED, spacing: { after: 100 } }),);
        }
        if (acildurumkonusecim.kmaruziyet === 1)
        {
            girisparagraflar.push(new Paragraph({ children: [new TextRun({ text: "\tKimyasal Maruziyet:", bold: true, font: "Calibri", size: 22 }), new TextRun({ text: " Belirli bir referans sürede çalışanların solunum bölgesindeki havada bulunan kimyasal madde konsantrasyonunun zaman ağırlıklı ortalamasının üst sınırını (STEL) veya çalışma süresinin herhangi bir anında çalışanların solunum bölgesindeki havada bulunan kimyasal madde konsantrasyonunun aşılmaması gereken üst sınırın aşılması sonucu oluşabilecek AKUT zehirlenme", font: "Calibri", size: 22 })], alignment: AlignmentType.JUSTIFIED, spacing: { after: 100 } }),);
        }
        if (acildurumkonusecim.ksizinti === 1)
        {
            girisparagraflar.push(new Paragraph({ children: [new TextRun({ text: "\tKimyasal Sızıntı:", bold: true, font: "Calibri", size: 22 }), new TextRun({ text: " Canlılar üzerinde tahriş edici, yakıcı, felç edici veya öldürücü etkileri olan, deri, solunum veya sindirim sistemi yoluyla bünyeye girebilen gaz, sıvı ya da katı şekildeki toksik kimyasal maddelerin kasten veya kazaen çevreye yayılmasına neden olabilecek her türlü olayı ifade eder.", font: "Calibri", size: 22 })], alignment: AlignmentType.JUSTIFIED, spacing: { after: 100 } }),);
        }
        if (acildurumkonusecim.patlama === 1)
        {
            girisparagraflar.push(new Paragraph({ children: [new TextRun({ text: "\tPatlayıcı Ortam:", bold: true, font: "Calibri", size: 22 }), new TextRun({ text: " Yanıcı maddelerin gaz, buhar, sis ve tozlarının atmosferik şartlar altında hava ile oluşturduğu ve herhangi bir tutuşturucu kaynakla temasında tümüyle yanabilen karışımı ifade eder.", font: "Calibri", size: 22 })], alignment: AlignmentType.JUSTIFIED, spacing: { after: 100 } }),);
        }
        if (acildurumkonusecim.bakimonarim === 1)
        {
            girisparagraflar.push(new Paragraph({ children: [new TextRun({ text: "\tBakım Onarım:", bold: true, font: "Calibri", size: 22 }), new TextRun({ text: " İşyeri iş akışında planlı/periyodik bakım işleri ile beklenmedik bir şekilde oluşan arızların ivedilikle yapılması için gerekli her türlü müdahaleyi ifade eder.", font: "Calibri", size: 22 })], alignment: AlignmentType.JUSTIFIED, spacing: { after: 100 } }),);
        }
        if (acildurumkonusecim.hayvansokma === 1)
        {
            girisparagraflar.push(new Paragraph({ children: [new TextRun({ text: "\tHayvan Sokması/Isırması:", bold: true, font: "Calibri", size: 22 }), new TextRun({ text: " Çalışma alanında veya çevresinde bulunan arı, akrep, yılan, böcek, köpek gibi hayvanların sokması, ısırması veya saldırması sonucu çalışanlarda meydana gelen zehirlenme, alerjik reaksiyon, yara, enfeksiyon gibi sağlık sorunlarını ifade eder.", font: "Calibri", size: 22 })], alignment: AlignmentType.JUSTIFIED, spacing: { after: 100 } }),);
        }        
        girisparagraflar.push(new Paragraph({ children: [new TextRun({ text: "\tAMAÇ", bold: true, size: 24, font: "Calibri" })], spacing: { before: 0, after: 100 }, alignment: "left" }));
        girisparagraflar.push(new Paragraph({ children: [new TextRun({ text: "\tİşyerinde yürütülen çalışma sırasında, olağan dışı olayların sonuçlarından en az kayıp ve zararla kurtulabilmesi için yapılması gereken iş ve işlemlerin, olaylar olmadan önce planlaması ve olay sırasında; uygulanmasını gerektiren tüm faaliyetler zamanında, hızlı ve etkili bir şekilde uygulanmasını amaçlamaktadır.", size: 22, font: "Calibri" })], spacing: { before: 100, after: 100 }, alignment: AlignmentType.JUSTIFIED }));
        girisparagraflar.push(new Paragraph({ children: [new TextRun({ text: "\tDAYANAK", bold: true, size: 24, font: "Calibri" })], spacing: { before: 0, after: 100 }, alignment: "left" }));
        girisparagraflar.push(new Paragraph({ children: [new TextRun({ text: "\tBu plan, İş sağlığı ve güvenliği kanunu 11,12 ve 30. maddeleri ile 18.06.2013 tarihli “İşyerlerinde Acil Durumlar Hakkında Yönetmelik” ve yine aynı yönetmeliğin 01.10.2021 tarihinde yapılan değişikliklere göre hazırlanmıştır.", size: 22, font: "Calibri" })], spacing: { before: 100, after: 100 }, alignment: AlignmentType.JUSTIFIED }));
        girisparagraflar.push(new Paragraph({ children: [new TextRun({ text: "\tACİL DURUM EKİPLERİ GÖREV TANIMLARI", bold: true, size: 24, font: "Calibri" })], spacing: { before: 0, after: 100 }, alignment: "left" }));
        girisparagraflar.push(new Paragraph({ children: [new TextRun({ text: "\tSöndürme ekibi:", bold: true, font: "Calibri", size: 22 }), new TextRun({ text: " İşyerinde çıkabilecek yangınlara derhal müdahale ederek mümkünse yangını kontrol altına almak, yangının genişlemesine mani olmak ve söndürme faaliyetlerini yürütmek.", font: "Calibri", size: 22 })], alignment: AlignmentType.JUSTIFIED, spacing: { after: 100 } }),);
        girisparagraflar.push(new Paragraph({ children: [new TextRun({ text: "\tKurtarma ekibi:", bold: true, font: "Calibri", size: 22 }), new TextRun({ text: " İşyerlerinde acil durum sonrası; çalışanların, ziyaretçilerin ve diğer kişilerin arama ve kurtarma işlerini gerçekleştirmek.", font: "Calibri", size: 22 })], alignment: AlignmentType.JUSTIFIED, spacing: { after: 100 } }),);
        girisparagraflar.push(new Paragraph({ children: [new TextRun({ text: "\tKoruma ekibi:", bold: true, font: "Calibri", size: 22 }), new TextRun({ text: " Acil durum nedeniyle ortaya çıkması muhtemel panik ve kargaşayı önlemek, acil durum ekipleri arasındaki koordinasyon işlerini gerçekleştirmek, sayım işlerini yürütmek, gerektiğinde ilgili ulusal ve yerel kurumların müdahale ekiplerine bilgi vermek.", font: "Calibri", size: 22 })], alignment: AlignmentType.JUSTIFIED, spacing: { after: 100 } }),);
        girisparagraflar.push(new Paragraph({ children: [new TextRun({ text: "\tİlkyardım ekibi:", bold: true, font: "Calibri", size: 22 }), new TextRun({ text: " Acil durumdan olumsuz etkilenen kişilerin ilk yardım müdahalelerini gerçekleştirmek.", font: "Calibri", size: 22 })], alignment: AlignmentType.JUSTIFIED, spacing: { after: 100 } }),);
        girisparagraflar.push(new Paragraph({ children: [new TextRun({ text: "\tDestek elemanı:", bold: true, font: "Calibri", size: 22 }), new TextRun({ text: " Asli görevinin yanında acil durumlara ilişkin ulusal ve yerel kurum ve kuruluşlarla irtibatı sağlamak, iş sağlığı ve güvenliği ile ilgili önleme, koruma, tahliye, yangınla mücadele, ilk yardım ve benzeri konularda özel olarak görevli olan kişidir.", font: "Calibri", size: 22 })], alignment: AlignmentType.JUSTIFIED, spacing: { after: 100 } }),);
        girisparagraflar.push(new Paragraph({ children: [new TextRun({ text: "\tSorumluluk alanı:", bold: true, font: "Calibri", size: 22 }), new TextRun({ text: " Ekiplerde yer alan görevli kişilerin (destek elemanlarının) acil duruma ilişkin görevini gerçekleştireceği birim veya bölümü ifade eder.", font: "Calibri", size: 22 })], alignment: AlignmentType.JUSTIFIED, spacing: { after: 100 } }),);
        girisparagraflar.push(new Paragraph({ children: [new TextRun({ text: "\tKoordinasyon:", bold: true, font: "Calibri", size: 22 }), new TextRun({ text: " Koordinasyonla görevli olan kişi, koruma ekibinde yer alıp ayrıca ekipler arasında iletişimi ve organizasyonu yapmakla da ayrıca görevlidirler.", font: "Calibri", size: 22 })], alignment: AlignmentType.JUSTIFIED, spacing: { after: 100 } }),);
    const doc = new Document
    ({
        sections:
        [
            {
                properties: { page: { margin: { top: 567, bottom: 567, left: 567, right: 567 }, borders: { pageBorderTop: { style: BorderStyle.SINGLE, size: 8, color: "000000" }, pageBorderBottom: { style: BorderStyle.SINGLE, size: 8, color: "000000" }, pageBorderLeft: { style: BorderStyle.SINGLE, size: 8, color: "000000" }, pageBorderRight: { style: BorderStyle.SINGLE, size: 8, color: "000000" }, pageBorders: { display: docx.PageBorderDisplay.FIRST_PAGE, offsetFrom: docx.PageBorderOffsetFrom.TEXT, zOrder: docx.PageBorderZOrder.FRONT } } } },
                children:
                [
                    new Paragraph({ children: [new TextRun({ text: ustbaslik, bold: true, size: 36, font: "Tahoma" })], spacing: { before: 350, after: 200 }, alignment: "center" }),
                    new Paragraph({ children: [new TextRun({ text: altbaslik, size: 28, font: "Tahoma" })], spacing: { before: 200, after: 100 }, alignment: "center" }),
                    ...Array(26).fill().map(() => new Paragraph({ text: "" })),
                    new Paragraph({ children: [new TextRun({ text: "ACİL DURUM PLANI", bold: true, size: 36, font: "Tahoma" })], alignment: "center" }),
                    ...Array(31).fill().map(() => new Paragraph({ text: "" })),
                    new Paragraph({ children: [new TextRun({ text: isyerisehir + " - " + acildurumyil, bold: true, size: 36, font: "Tahoma" })], alignment: "center" }),
                ]
            },
            {
                properties:{page:{margin:{top:1134,bottom:1701,left:1134,right:1134,footer: 1134}}},
                children: [...girisparagraflar],
                footers:
                {
                    default: new docx.Footer({ children: [docxucluimzadikey(uzmanad, uzmanno, hekimad, hekimno, isveren)]})
                }
            }
        ],
    });
    const blob = await Packer.toBlob(doc);
    saveAs(blob, "Acil Durum Giriş.docx");
}

function acildurumgecerlilik(tarih, tehlike) { if (!tarih) return ""; const [g, a, y] = tarih.split(".").map(Number); if (!g || !a || !y) return ""; let e = 0; switch (tehlike) { case 1: e = 6; break; case 2: e = 4; break; case 3: e = 2; break; default: return "" }const d = new Date(y + e, a - 1, g), p = n => n.toString().padStart(2, "0"); return `${p(d.getDate())}.${p(d.getMonth() + 1)}.${d.getFullYear()}` }

async function acildurumkonusecimdocx()
{
    let acildurumkonular = acildurumkonuliste();
    let uzmanad = store.get("uzmanad");
    let uzmanno = store.get("uzmanno");
    let isyeri = jsoncevir(store.get('xjsonfirma')) || {};
    let isveren = isyeri.is;
    let hekimad = isyeri.hk;
    let hekimno = isyeri.hn;
    const { Document, Packer, TextRun, Paragraph, Table, TableRow, TableCell, WidthType, BorderStyle, AlignmentType } = docx;
    const girisparagraflar =
    [
        new Paragraph({children:[new TextRun({text:"İŞYERİ İÇİN BELİRLENEN ACİL DURUMLAR",bold:true,size:24,font:"Calibri"})],spacing:{before:0,after:100},alignment:AlignmentType.CENTER}),
        new Paragraph({children:[new TextRun({text:"\tİşyerinin tamamında veya bir kısmında meydana gelebilecek veya işyerini dışarıdan etkileyebilecek ve ivedilikle müdahale gerektiren acil durumlar aşağıda listelenmiştir.",size:22,font:"Calibri"})],spacing:{before:100,after:100},alignment:AlignmentType.JUSTIFIED})
    ];
    const tablosatirlari = [];
    tablosatirlari.push(new TableRow({
        children:
        [
            new TableCell({width:{size:10,type:WidthType.PERCENTAGE},children:[new Paragraph({alignment:AlignmentType.CENTER,spacing:{before:140,after:140},children:[new TextRun({text:"NO",bold:true,size:22,font:"Calibri"})]})]}),
            new TableCell({width:{size:90,type:WidthType.PERCENTAGE},children:[new Paragraph({alignment:AlignmentType.CENTER,spacing:{before:140,after:140},children:[new TextRun({text:"ACİL DURUM PLAN KONULARI",bold:true,size:22,font:"Calibri"})]})]})
        ]
    }));
    acildurumkonular.forEach((item, index) =>
    {
        tablosatirlari.push(new TableRow({
            children:
            [
                new TableCell({width:{size:10,type:WidthType.PERCENTAGE},children:[new Paragraph({alignment:AlignmentType.CENTER,spacing:{before:140,after:140},children:[new TextRun({text:(index+1).toString(),bold:true,size:22,font:"Calibri"})]})]}),
                new TableCell({width:{size:90,type:WidthType.PERCENTAGE},children:[new Paragraph({alignment:AlignmentType.LEFT,spacing:{before:140,after:140},indent:{left:60},children:[new TextRun({text:item.ad,size:22,font:"Calibri"})]})]})
            ]
        }));
    });
    const tablo=new Table({width:{size:100,type:WidthType.PERCENTAGE},rows:tablosatirlari,borders:{top:{style:BorderStyle.SINGLE,size:1,color:"000000"},bottom:{style:BorderStyle.SINGLE,size:1,color:"000000"},left:{style:BorderStyle.SINGLE,size:1,color:"000000"},right:{style:BorderStyle.SINGLE,size:1,color:"000000"},insideHorizontal:{style:BorderStyle.SINGLE,size:1,color:"000000"},insideVertical:{style:BorderStyle.SINGLE,size:1,color:"000000"}}});
    const doc = new Document
    ({
        sections:
        [{
            properties: {},
            children: [...girisparagraflar, new Paragraph({ text: ""}), tablo],
            footers: { default: new docx.Footer({ children: [docxucluimzadikey(uzmanad, uzmanno, hekimad, hekimno, isveren)]})}
        }]
    });
    const blob = await Packer.toBlob(doc);
    saveAs(blob, "Acil Durum Plan Konuları.docx");
}

function acildurumdevam1()
{
    let tarih = $('#tarih').val().trim();
    if (tarihkontrol(tarih) === false)
    {
        alertify.error("Lütfen geçerli bir tarih giriniz");
        return;
    }
    store.set("acildurumtarih", tarih);
    let sonuc = {};
    $('.csscheckbox').each(function () { const id = $(this).attr('id'); if (id) { sonuc[id] = $(this).is(':checked') ? 1 : 0; }});
    store.set("acildurumkonusecim", sonuc);
    let firmaid = firmasecimoku();
    window.location.href = "/acildurum2?id=" + encodeURIComponent(firmaid);
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
