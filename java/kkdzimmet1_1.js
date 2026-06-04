async function kkdzimmettutanakkontrol()
{
    $('#loading').show();
    $.when(kkdzimmettutanakcikti())
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

async function kkdzimmettutanakcikti()
{
    let sorumlulukbeyani = "\t6331 sayılı İş Sağlığı ve Güvenliği Kanunu’nun 19. maddesinin 2. fıkrasının (b) bendi uyarınca, “Kendilerine sağlanan kişisel koruyucu donanımı doğru kullanmak ve korumak” yükümlülüğümü, işverenin bu konudaki talimatları ve 4857 sayılı İş Kanunu’nun 25. maddesinin 2. fıkrasında belirtilen haklı fesih nedenleri kapsamında işlem yapılabileceği konusunda bilgilendirildim. Aşağıda listelenen kişisel koruyucu donanımları işveren vekilinden eksiksiz olarak teslim aldım. Bu donanımların doğru ve güvenli kullanımı konusunda gerekli eğitimi aldım ve yeterli bilgiye sahip olduğumu beyan ederim. Bu donanımları iş sağlığı ve güvenliği kurallarına uygun şekilde düzenli olarak kullanacağımı, kullanılmayacak duruma geldiklerinde durumu derhal işveren vekiline bildirerek yenilerini temin etmek üzere başvuracağım. Ayrıca, tarafıma teslim edilen kişisel koruyucu donanımları kasıtlı olarak kullanmamak, uygunsuz şekilde kullanmak ya da talimatlara aykırı davranmak suretiyle maruz kalabileceğim iş kazası veya meslek hastalığı gibi durumlarda, doğabilecek zarar ve sonuçlardan kişisel sorumluluğumun bulunduğunu kabul ederim.";
    let tarih = "Tarih: " + store.get('kkdzimmettarih');
    let isyeri = jsoncevir(store.get('xjsonfirma')) || {};
    let isyeriismi = isyeri.fi;
    let isyeriadresi = isyeri.ad;
    let isveren = isyeri.is;
    let kkdzimmetjson = jsoncevir(store.get('kkdzimmetsonliste'));
    let calisanliste = jsoncevir(store.get('calisansecimjsonx'));

    if (!Array.isArray(calisanliste) || calisanliste.length === 0)
    {
        calisanliste = [{ a: ".................", u: "................." }];
    }
    kkdzimmetjson = Array.isArray(kkdzimmetjson) ? kkdzimmetjson : [];
    const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, WidthType, AlignmentType, VerticalAlign, BorderStyle, Header, Footer } = window.docx;
    const header = new Header({
        children: [
            new Table({
                width: { size: 100, type: WidthType.PERCENTAGE },
                rows: [
                    new TableRow({
                        children: [
                            new TableCell({
                                width: { size: 100, type: WidthType.PERCENTAGE },
                                borders: { top: { style: "single", size: 1, color: "000000" }, bottom: { style: "single", size: 1, color: "000000" }, left: { style: "single", size: 1, color: "000000" }, right: { style: "single", size: 1, color: "000000" } },
                                children: [new Paragraph({ children: [new TextRun({ text: isyeriismi, font: "Calibri", size: 22 })], alignment: AlignmentType.CENTER })]
                            })
                        ]
                    })
                ]
            })
        ]
    });
    let footer = undefined;
    if (isyeriadresi && isyeriadresi.trim() !== "") {
        footer = new Footer({
            children: [
                new Table({
                    width: { size: 100, type: WidthType.PERCENTAGE },
                    rows: [
                        new TableRow({
                            children: [
                                new TableCell({
                                    width: { size: 100, type: WidthType.PERCENTAGE },
                                    borders: { top: { style: "single", size: 1, color: "000000" }, bottom: { style: "single", size: 1, color: "000000" }, left: { style: "single", size: 1, color: "000000" }, right: { style: "single", size: 1, color: "000000" } },
                                    children: [new Paragraph({ children: [new TextRun({ text: isyeriadresi, font: "Calibri", size: 22 })], alignment: AlignmentType.CENTER })]
                                })
                            ]
                        })
                    ]
                })
            ]
        });
    }
    const sections = [];

    calisanliste.forEach((calisan, index) => {
        const tarihparagraf = new Paragraph({
            children: [new TextRun({ text: tarih, font: { name: "Calibri" }, size: 22 })],
            alignment: AlignmentType.RIGHT
        });

        const baslik = new Paragraph({
            children: [new TextRun({ text: "KİŞİSEL KORUYUCU DONANIM ZİMMET TUTANAĞI", bold: true, font: { name: "Calibri" }, size: 22 })],
            alignment: AlignmentType.CENTER
        });

        const sorparagraf = new Paragraph({
            children: [new TextRun({ text: sorumlulukbeyani, font: { name: "Calibri" }, size: 22 })],
            alignment: AlignmentType.JUSTIFIED
        });
        const kkdzimmettablo = [];

        kkdzimmettablo.push(new TableRow({
            children: [
                new TableCell({
                    columnSpan: 4,
                    verticalAlign: VerticalAlign.CENTER,
                    children: [new Paragraph({
                        alignment: AlignmentType.CENTER,
                        children: [new TextRun({ text: "Kişisel Koruyucu Donanım Tablosu", bold: true, font: { name: "Calibri" }, size: 22 })]
                    })]
                })
            ]
        }));

        kkdzimmettablo.push(new TableRow({
            children: [
                new TableCell({ verticalAlign: VerticalAlign.CENTER, width: { size: 10, type: WidthType.PERCENTAGE }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "No", bold: true, font: { name: "Calibri" }, size: 22 })] })] }),
                new TableCell({ verticalAlign: VerticalAlign.CENTER, width: { size: 40, type: WidthType.PERCENTAGE }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Donanım Türü", bold: true, font: { name: "Calibri" }, size: 22 })] })] }),
                new TableCell({ verticalAlign: VerticalAlign.CENTER, width: { size: 40, type: WidthType.PERCENTAGE }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Standart", bold: true, font: { name: "Calibri" }, size: 22 })] })] }),
                new TableCell({ verticalAlign: VerticalAlign.CENTER, width: { size: 10, type: WidthType.PERCENTAGE }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Adet", bold: true, font: { name: "Calibri" }, size: 22 })] })] })
            ]
        }));

        kkdzimmetjson.forEach((item, index) => {
            kkdzimmettablo.push(new TableRow({
                children: [
                    new TableCell({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: String(index + 1), font: { name: "Calibri" }, size: 22 })] })] }),
                    new TableCell({ children: [new Paragraph({ alignment: AlignmentType.LEFT, children: [new TextRun({ text: item.k, font: { name: "Calibri" }, size: 22 })] })] }),
                    new TableCell({ children: [new Paragraph({ alignment: AlignmentType.LEFT, children: [new TextRun({ text: item.s, font: { name: "Calibri" }, size: 22 })] })] }),
                    new TableCell({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: item.a, font: { name: "Calibri" }, size: 22 })] })] })
                ]
            }));
        });

        const kkdzimmettabloicerik = new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            margins: { top: 70, bottom: 70, left: 50, right: 50 },
            rows: kkdzimmettablo
        });
        const imzatablo = new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            borders: {
                top: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
                bottom: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
                left: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
                right: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
                insideHorizontal: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
                insideVertical: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
            },
            rows: [
                new TableRow({
                    children: [
                        new TableCell({ verticalAlign: VerticalAlign.CENTER, width: { size: 50, type: WidthType.PERCENTAGE }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: isveren, bold: true, font: "Calibri", size: 22 })] })] }),
                        new TableCell({ verticalAlign: VerticalAlign.CENTER, width: { size: 50, type: WidthType.PERCENTAGE }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: calisan.a, bold: true, font: "Calibri", size: 22 })] })] })
                    ]
                }),
                new TableRow({
                    children: [
                        new TableCell({ verticalAlign: VerticalAlign.CENTER, width: { size: 50, type: WidthType.PERCENTAGE }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: isverenunvanioku(), font: "Calibri", size: 22 })] })] }),
                        new TableCell({ verticalAlign: VerticalAlign.CENTER, width: { size: 50, type: WidthType.PERCENTAGE }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: calisan.u, font: "Calibri", size: 22 })] })] })
                    ]
                }),
                new TableRow({
                    children: [
                        new TableCell({ verticalAlign: VerticalAlign.CENTER, width: { size: 50, type: WidthType.PERCENTAGE }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "İmza", font: "Calibri", size: 22 })] })] }),
                        new TableCell({ verticalAlign: VerticalAlign.CENTER, width: { size: 50, type: WidthType.PERCENTAGE }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "İmza", font: "Calibri", size: 22 })] })] })
                    ]
                })
            ]
        });
        sections.push({
            properties: { page: { margin: { top: 1134, right: 1134, bottom: 1134, left: 1134 } } },
            headers: { default: header },
            ...(footer ? { footers: { default: footer } } : {}),
            children: [tarihparagraf, new Paragraph(''), baslik, new Paragraph(''), sorparagraf, new Paragraph(''), kkdzimmettabloicerik, new Paragraph(''), imzatablo]
        });
    });
    const doc = new Document({ sections });
    Packer.toBlob(doc).then(blob =>
    {
        saveAs(blob, "KKD Zimmet.docx");
    });
}

function kkdsablonolusturload()
{
    store.set("kkdjsonsecim", []);
    $('#sablonkaydet').hide();
    fetch("https://cdn.jsdelivr.net/gh/MEHMETCERANX12/isgevrak@main/kkd.json").then(response => response.json()).then(data =>
    {
        store.set("kkdjsonveri", data);
        let kkdjson = data;
        kkdjson.sort((a, b) => a.sira - b.sira);
        let table = $('#tablo').DataTable
        ({
            data: kkdjson,
            pageLength: -1,
            ordering: false,
            dom: 't',
            columns:
            [
                { data: "tur", title: "KKD Adı"},
                { data: "aciklama", title: "Açıklama"},
                { data: "s", title: "Standart"},
                { data: null, title:"Ekle",render:(d,t,r)=>`<input type="button" class="cssbutontamam" value="Ekle" data-id="${r.i}" onclick="kkdsablonekle(this);"/>`}
            ],
            createdRow:function(r){$(r).find("td").eq(0).css("text-align","left");$(r).find("td").eq(1).css("text-align","left");$(r).find("td").eq(2).css("text-align","left");},
            headerCallback: function (thead) { $(thead).find('th').css('text-align', 'center');}
        });
        $('#kkdselect').on('change', function ()
        {
            const secilen = $(this).val();
            const index = this.selectedIndex;
            if (index === 0)
            {
                table.clear().rows.add(kkdjson).draw();
            }
            else
            {
                const filtreli = kkdjson.filter(item => item.tur === secilen);
                table.clear().rows.add(filtreli).draw();
            }
        });
        $('#diyalogkkd').fadeIn()
    })
}

function kkdsablonekle(button)
{
    let kkdjsonsecim = store.get("kkdjsonsecim") || [];
    let kkdjsonveri = store.get("kkdjsonveri");
    let i = button.getAttribute("data-id");
    if (kkdjsonsecim.some(item => item.i === i))
    {
        alertify.error("Bu KKD zaten listede var");
        return;
    }
    const satir = kkdjsonveri.find(item => item.i === i);
    if (satir)
    {
        kkdjsonsecim.push({ k: satir.k, s: satir.s, i: satir.i, a: 1 });
    }
    else
    {
        alertify.error("Beklenmedik bir hata oluştu");
        return;
    }
    $('#diyalogkkd').fadeOut();
    store.set("kkdjsonsecim", kkdjsonsecim);
    kkdsablontablo(kkdjsonsecim);
}

function kkdsablontablo(kkdjsonsecim)
{
    const jsonliste = kkdjsonsecim || [];
    if (jsonliste.length > 0)
    {
        $('#sablonkaydet').show();
    }
    else
    {
        $('#sablonkaydet').hide();
    }
    if ($.fn.DataTable.isDataTable('#kkdtablo'))
    {
        let kkdtablo = $('#kkdtablo').DataTable();
        kkdtablo.clear().rows.add(jsonliste).draw();
        return;
    }
    $('#kkdtablo').DataTable
    ({
        data: jsonliste,
        ordering: false,
        dom: 't',
        pageLength: -1,
        language:{zeroRecords:"Eklenmiş Kişisel Koruyucu Donanım Yok",infoEmpty:"Eklenmiş Kişisel Koruyucu Donanım Yok",emptyTable:"Eklenmiş Kişisel Koruyucu Donanım Yok"},
        columns:
        [
            {data:"k",title:"KKD Adı",width:"30%",render:d=>`<input type="text" class="csstextbox100" value="${d}" />`},
            {data:"s",title:"Standardı",width:"40%",render:d=>`<input type="text" class="csstextbox100" value="${d}" />`},
            {data:"a",title:"Adet",width:"12%",render:d=>`<input type="text" class="csstextbox100" style="text-align:center;" value="${d}" />`},
            {data:"i",title:"Sil",width:"18%",render:d=>`<input type="button" class="cssbutontamam" value="Sil" data-id="${d}" onclick="kkdsablonsil(this);"/>`}
        ],
        headerCallback: thead => { $(thead).find('th').css('text-align', 'center'); }
    });
}

function kkdsablonsil(button)
{
    const id = button.getAttribute("data-id");
    let kkdjsonsecim = store.get("kkdjsonsecim");
    kkdjsonsecim = kkdjsonsecim.filter(item => item.i !== id);
    store.set("kkdjsonsecim", kkdjsonsecim);
    kkdsablontablo(kkdjsonsecim);
}

async function kkdsablonkaydet()
{
    let ad = $('#kkdad').val().trim();    
    if (ad.length < 3)
    {
        alertify.error("Lütfen en az 3 karakterden oluşan bir şablon adı giriniz.");
        return false;
    }
    ad = basharfbuyuk(ad);
    const yeniListe = [];
    $('#kkdtablo tbody tr').each(function ()
    {
        const k = $(this).find('td:eq(0) input').val().trim();
        const s = $(this).find('td:eq(1) input').val().trim();
        const a = $(this).find('td:eq(2) input').val().trim();
        yeniListe.push({k, s, a});
    });
    const id = metinuret(3);
    const yeniSablon = { ad: ad, id: id, x: yeniListe };
    try
    {
        const basarili = await kkdekle(yeniSablon);
        if (!basarili)
        {
            return false;
        }
        window.location.href = "/kkdsablonduzenle1?id=0";
        return true;
    }
    catch
    {
        alertify.error("Beklenmedik bir hata oluştu");
        return false;
    }
}

function kkdzimmettamam1()
{
    let firmaid = firmasecimoku();
    if (!firmaid)
    {
        return;
    }
    if (!kkdzimmetsecimsakla())
    {
        return;
    }
    let tarih = $('#tarih').val() || '....../....../20...';
    store.set('kkdzimmettarih', tarih);
    window.location.href = "/kkdzimmetcikti2?id=" + encodeURIComponent(firmaid);
}

function kkdzimmettamam2()
{
    const secilenler = dokumancalisansecim();
    const kkdzimmetsonliste = jsoncevir(store.get("kkdzimmetsonliste"));
    if (!Array.isArray(kkdzimmetsonliste) || kkdzimmetsonliste.length === 0)
    {
        alertify.error("Lütfen önce bir KKD şablonu seçiniz.");
        return;
    }
    if (!Array.isArray(secilenler))
    {
        alertify.error("Çalışan seçimi alınamadı.");
        return;
    }
    store.set("dosyaciktitipi", "4");
    window.location.href = "/dosyacikti?id=4";
}

function digeregitimdevam2()
{
    kkdzimmettamam2();
}

function kkdzimmetcikti1load(kkdjson)
{
    isyerigetir();
    const tarih = store.get('kkdzimmettarih');
    if (tarih)
    {
        $('#tarih').val(tarih);
    }
    kkdzimmetcikti3load(kkdjson);
}

function kkdzimmetcikti2load()
{
    let calisanlar = store.get("calisanjsonx");
    calisanlar = jsoncevir(calisanlar);
    store.set("calisanjsonx", Array.isArray(calisanlar) ? calisanlar : []);
    dokumancalisanload();
}

function tumunusec()
{
    $('#tablo').DataTable().rows().select();
}

function tumunukaldir()
{
    $('#tablo').DataTable().rows().deselect();
}

function kkdzimmetcikti3load(kkdjson)
{
    kkdjson = Array.isArray(kkdjson) ? kkdjson : [];
    kkdjson.sort((a, b) => (a.ad || "").localeCompare(b.ad || "", "tr", { sensitivity: "base" }));  
    store.set("jsonkkdliste", kkdjson);
    const select = $('#kkddrop');
    select.empty();
    if ($.fn.DataTable.isDataTable('#kkdtablo'))
    {
        $('#kkdtablo').DataTable().clear().destroy();
        $('#kkdtablo').empty();
    }
    if (Array.isArray(kkdjson) && kkdjson.length > 0)
    {
        select.append('<option value="" disabled selected>Lütfen bir şablon seçiniz</option>');
        kkdjson.forEach(item => { select.append(`<option value="${item.id}">${item.ad}</option>`); });
    }
    else
    {
        select.append('<option disabled value="" selected>KKD şablonu bulunamadı</option>');
        return;
    }
    let table = $('#kkdtablo').DataTable
    ({
        data: [],
        ordering: false,
        dom: 't',
        columns:
        [
            {data:"k",title:"KKD Adı",width:"30%",render:d=>`<input type="text" class="csstextbox100" value="${d}" />`},
            {data:"s",title:"Standardı",width:"40%",render:d=>`<input type="text" class="csstextbox100" value="${d}" />`},
            {data:"a",title:"Adet",width:"12%",render:d=>`<input type="text" class="csstextbox100" style="text-align:center;" value="${d}" />`}
        ],
        language: { zeroRecords: "Kayıtlı KKD Yok", infoEmpty: "Kayıtlı KKD Yok", emptyTable: "Kayıtlı KKD Yok"},
        headerCallback: (thead) => { $(thead).find('th').css('text-align', 'center');}
    });
    $('#kkdtablo').hide();
    $('#tamam').hide();
    $('#kkddrop').on('change', function ()
    {
        $('#tamam').show();
        $('#kkdtablo').show();
        const secilenId = $(this).val();
        const sablon = kkdjson.find(item => item.id === secilenId);

        if (!sablon || !Array.isArray(sablon.x))
        {
            table.clear().draw();
            return;
        }
        table.clear().rows.add(sablon.x).draw();
    });
    const seciliSablon = String(store.get('kkdzimmetsablonid') || '');
    if (seciliSablon && select.find('option[value="' + seciliSablon + '"]').length > 0)
    {
        select.val(seciliSablon).trigger('change');
    }
}
function kkdzimmettamam3()
{
    if (!kkdzimmetsecimsakla())
    {
        return;
    }
    store.set("dosyaciktitipi", "4");
    window.location.href = "/dosyacikti?id=4";
}

function kkdzimmetsecimsakla()
{
    const $select = $("#kkddrop");
    const secilenId = String($select.val() || "").trim();
    if (!secilenId)
    {
        alertify.error("Lütfen bir şablon seçiniz.");
        return false;
    }
    const liste = [];
    $("#kkdtablo tbody tr").each(function ()
    {
        const $td = $(this).find("td");
        liste.push({
            k: $td.eq(0).find("input").val().trim(),
            s: $td.eq(1).find("input").val().trim(),
            a: $td.eq(2).find("input").val().trim()
        });
    });
    if (liste.length === 0)
    {
        alertify.error("Seçilen şablonda KKD bulunamadı.");
        return false;
    }
    store.set("kkdzimmetsablonid", secilenId);
    store.set("kkdzimmetsonliste", liste);
    return true;
}

function kkdsablonduzenleload1(kkdjson)
{
    kkdjson = Array.isArray(kkdjson) ? kkdjson : [];
    kkdjson.sort((a, b) => (a.ad || "").localeCompare(b.ad || "", "tr", { sensitivity: "base" }));    
    store.set("jsonkkdliste", kkdjson);
    if ($.fn.DataTable.isDataTable('#tablo'))
    {
        $('#tablo').DataTable().clear().destroy();
    }
    $('#tablo').DataTable
    ({
        data: kkdjson,
        pageLength: -1,
        order: false,
        lengthMenu: [[10, 25, 50, 100, -1], [10, 25, 50, 100, "Tümü"]],
        columns:
        [
            { data: "ad", title: "KKD Şablon Adı", orderable: false, width: "60%" },
            { data:null,title:"Düzenle",orderable:!1,width:"20%",render:(d,t,r)=>`<input type="button" class="cssbutontamam" value="Düzenle" data-id="${r.id}" onclick="jsonkkdsablonduzenle(this);"/>`},
            { data:null,title:"Sil",orderable:!1,width:"20%",render:(d,t,r)=>`<input type="button" class="cssbutontamam" value="Sil" data-id="${r.id}" onclick="sildialog(this);"/>`}
        ],
        language:{search:"KKD Ara:",lengthMenu:"Sayfa başına _MENU_ kayıt göster",zeroRecords:"KKD şablon bulunamadı",info:"_TOTAL_ kayıttan _START_ ile _END_ arası gösteriliyor",infoEmpty:"KKD şablon bulunamadı",infoFiltered:"(toplam _MAX_ kayıttan filtrelendi)",emptyTable:"KKD şablon bulunamadı"},
        createdRow: function (row) { $(row).find('td').eq(0).css('text-align', 'left'); },
        headerCallback: function (thead) { $(thead).find('th').css('text-align', 'center');}
    });
    $('.dt-search input').css({ "background-color": "white" }).attr("autocomplete", "off");
    $('.dt-length select').css({ "background-color": "white" });
}
function sildialog(button)
{
    let kkdsilid = button.getAttribute("data-id");
    store.set("kkdsilid", kkdsilid);
    $('#diyolagkkdsil').fadeIn();
}

async function jsonkkdsablonsil()
{
    try
    {
        let kkdsilid = store.get("kkdsilid");
        if (!kkdsilid)
        {
            alertify.error("Silinecek öğe bulunamadı.");
            return false;
        }
        let table = $('#tablo').DataTable();
        let liste = jsoncevir(store.get("jsonkkdliste"));
        const guncelListe = liste.filter(item => item.id !== kkdsilid);
        const basarili = await kkdsablonsil(guncelListe, "Silme işlemi sırasında bir hata oluştu.");
        if (!basarili)
        {
            return false;
        }
        store.set("jsonkkdliste", guncelListe);
        const rowsToRemove = table.rows((idx, data) => String(data.id) === String(kkdsilid));
        rowsToRemove.remove().draw();
        $('#diyolagkkdsil').fadeOut();
        kkdsilid = null;
        return true;
    }
    catch (e)
    {
        alertify.error("Silme işlemi sırasında bir hata oluştu.");
        return false;
    }
}
function jsonkkdsablonduzenle(button)
{
    const id = button.getAttribute("data-id");
    let liste = store.get("jsonkkdliste");
    liste = jsoncevir(liste);
    liste = liste.find(item => item.id === id);
    if (liste)
    {
        store.set("jsonkkdsablonsecim", [liste]);
    }
    else
    {
        store.set("jsonkkdsablonsecim", []);
    }
    window.location.href = "/kkdsablonduzenle2";
}

async function kkdsablonduzenleload2()
{
    let veri = store.get("jsonkkdsablonsecim");
    veri = jsoncevir(veri);
    if (!Array.isArray(veri) || veri.length === 0 || !veri[0] || !Array.isArray(veri[0].x))
    {
        alertify.error("Düzenlenecek KKD şablonu bulunamadı.");
        window.location.href = "/kkdsablonduzenle1";
        return;
    }
    $('#kkdad').val(veri[0].ad);
    veri = veri[0].x.map(item => ({...item, i: metinuret(3)}));
    store.set("kkdjsonsecim", veri);
    kkdsablontablo(veri);
    let kkdjson = [];
    try
    {
        const response = await fetch("https://cdn.jsdelivr.net/gh/MEHMETCERANX12/isgevrak@main/kkd.json");
        const data = await response.json();
        if (!response.ok)
        {
            alertify.error("KKD listesi getirilemedi.");
            return;
        }
        kkdjson = Array.isArray(data) ? data : [];
    }
    catch
    {
        alertify.error("KKD listesi getirilemedi.");
        return;
    }
    kkdjson = Array.isArray(kkdjson) ? kkdjson : [];
    store.set("kkdjsonveri", kkdjson);
    kkdjson.sort((a, b) => a.sira - b.sira);
    let table = $('#tablo').DataTable
    ({
        data: kkdjson,
        pageLength: -1,
        ordering: false,
        dom: 't',
        columns:
        [
            { data: "tur", title: "KKD Adı"},
            { data: "aciklama", title: "Açıklama"},
            { data: "s", title: "Standart"},
            { data: null, title:"Ekle",render:(d,t,r)=>`<input type="button" class="cssbutontamam" value="Ekle" data-id="${r.i}" onclick="kkdsablonekle(this);"/>`}
        ],
        createdRow:function(r){$(r).find("td").eq(0).css("text-align","left");$(r).find("td").eq(1).css("text-align","left");},
        headerCallback: function (thead) { $(thead).find('th').css('text-align', 'center');}
    });
    $('#kkdselect').on('change', function ()
    {
        const secilen = $(this).val();
        const index = this.selectedIndex;
        if (index === 0)
        {
            table.clear().rows.add(kkdjson).draw();
        }
        else
        {
            const filtreli = kkdjson.filter(item => item.tur === secilen);
            table.clear().rows.add(filtreli).draw();
        }
    });
}
async function kkdsablonduzenlekaydet()
{
    const ad = $('#kkdad').val().trim();
    if (ad.length < 3)
    {
        alertify.error("Lütfen en az 3 karakterden oluşan bir şablon adı giriniz.");
        return false;
    }
    let mevcutliste = store.get("jsonkkdliste") || [];
    if (typeof mevcutliste === "string")
    {
        try
        {
            mevcutliste = JSON.parse(mevcutliste);
        }
        catch
        {
            mevcutliste = [];
        }
    }
    let yeniliste = [];
    $('#kkdtablo tbody tr').each(function ()
    {
        const k = $(this).find('td:eq(0) input').val().trim();
        const s = $(this).find('td:eq(1) input').val().trim();
        const a = $(this).find('td:eq(2) input').val().trim();
        yeniliste.push({ k, s, a });
    });
    /////////////////////////////////////////////////////
    let secim = store.get("jsonkkdsablonsecim");
    secim = jsoncevir(secim);
    let kkdid = null;

    if (Array.isArray(secim) && secim.length > 0)
    {
        kkdid = secim[0].id;
    }
    for (let i = 0; i < mevcutliste.length; i++)
    {
        if (mevcutliste[i].id === kkdid) {
            mevcutliste[i].ad = ad;
            mevcutliste[i].x = yeniliste;
            store.set("jsonkkdsablonsecim", [{ id: mevcutliste[i].id, ad: mevcutliste[i].ad, x: yeniliste }]);
            break;
        }
    }
    try
    {
        const basarili = await kkdsablonguncellejs(mevcutliste);
        if (!basarili)
        {
            return false;
        }
        store.set("jsonkkdliste", mevcutliste);
        window.location.href = "/kkdsablonduzenle1?id=0";
        return true;
    }
    catch
    {
        alertify.error("Beklenmedik bir hata oluştu");
        return false;
    }
}
