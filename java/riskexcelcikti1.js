/* global ExcelJS, store, saveAs, alertify, $ */
// Her baskı sayfası ayrı çalışma sayfasıdır; birleşimler sayfa sınırını geçmez.
(function ()
{
    'use strict';

    const widths = [2.5, 6, 17, 17, 6, 29, 23, 3, 11, 3, 2.5, 2.5, 2.5, 5.5, 2.5, 2.5, 2.5, 5.5];
    const sharedColumns = [1, 2, 3, 4, 5, 11, 12, 13, 14, 15, 16, 17, 18];
    const rotatedColumns = [1, 2, 5, 11, 12, 13, 14, 15, 16, 17, 18];
    const border = Object.fromEntries(['top', 'left', 'bottom', 'right'].map(side =>
        [side, { style: 'thin', color: { argb: 'FF000000' } }]));
    const fill = color => ({ type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF' + color } });

    function text(value)
    {
        // JSON.parse gerçek kaçışları açar; eski kayıtlardaki çift kaçışları da destekle.
        return String(value ?? '').replace(/\\(u[0-9a-fA-F]{4}|n|r|t|"|\\)/g, (match, code) =>
        {
            if (code[0] === 'u') return String.fromCharCode(parseInt(code.slice(1), 16));
            return ({ n: '\n', r: '\r', t: '\t', '"': '"', '\\': '\\' })[code];
        }).replace(/\r\n?/g, '\n');
    }

    function filename(firma, konu)
    {
        const clean = value => value.replace(/[<>:"/\\|?*\x00-\x1f]/g, ' ').replace(/\s+/g, ' ').trim().replace(/[. ]+$/, '');
        const company = clean(firma.trim().split(/\s+/).slice(0, 2).join(' ')) || 'Firma';
        return company + ' - ' + (clean(konu) || 'Risk Değerlendirmesi') + '.xlsx';
    }

    function riskLevel(score)
    {
        if (score > 400) return ['R>400 Tolere\nEdilemez Risk', 'E74C3C', 'FFFFFF'];
        if (score > 200) return ['400>R≥200\nYüksek Risk', '8E44AD', 'FFFFFF'];
        if (score > 70) return ['200≥R>70\nÖnemli Risk', '2980B9', 'FFFFFF'];
        if (score > 20) return ['70≥R>20\nOlası Risk', 'F7DC6F', '000000'];
        return ['20≥R Kabul\nEdilebilir Risk', '27AE60', 'FFFFFF'];
    }

    function measurer()
    {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) throw new Error('Metin ölçümü başlatılamadı.');
        // Excel sütun birimleri Calibri 11'in rakam genişliğine dayanır (yaklaşık 7px).
        const pixels = column => Math.max(4, widths[column - 1] * 7 - 4);
        function measure(value, size = 11, bold = false)
        {
            ctx.font = (bold ? 'bold ' : '') + (size * 96 / 72) + 'px Calibri, Arial, sans-serif';
            return ctx.measureText(value).width * 1.05;
        }
        function lines(value, width, size = 11, bold = false)
        {
            const result = [];
            for (const paragraph of String(value).split('\n'))
            {
                let line = '';
                for (const word of paragraph.split(/(\s+)/).filter(Boolean))
                {
                    if (line && measure(line + word, size, bold) > width)
                    {
                        result.push(line.trimEnd());
                        line = '';
                    }
                    // Boşluksuz uzun sözcükler de hücre genişliğine göre bölünür.
                    for (const char of word)
                    {
                        if (line && measure(line + char, size, bold) > width)
                        {
                            result.push(line);
                            line = '';
                        }
                        if (line || !/\s/.test(char)) line += char;
                    }
                }
                result.push(line.trimEnd());
            }
            return result;
        }
        function height(value, column, rotated = false, size = 11, bold = false)
        {
            if (!rotated) return lines(value, pixels(column), size, bold).length * size * 1.4 + 8;
            // Döndürülmüş metin sütun genişliğine sığan sayıda satıra kaydırılır.
            const capacity = Math.max(String(value).split('\n').length,
                Math.floor((widths[column - 1] * 7 + 5) / (size * 96 / 72 * 1.1)), 1);
            let low = 1;
            let high = Math.max(1, ...String(value).split('\n').map(line => measure(line, size, bold)));
            for (let step = 0; step < 16; step++)
            {
                const mid = (low + high) / 2;
                if (lines(value, mid, size, bold).length <= capacity) high = mid;
                else low = mid;
            }
            return high * 0.75 + 12;
        }
        return { lines, pixels, height, measure };
    }

    async function build(risk, firma, signatures = {})
    {
        if (!risk || !Array.isArray(risk.w) || !risk.w.length || !Array.isArray(risk.x) || !risk.x[0])
            throw new Error('Bu konunun risk değerlendirme içeriği bulunamadı.');
        if (document.fonts)
        {
            await document.fonts.load('11pt Calibri');
            await document.fonts.ready;
        }
        const metrics = measurer();
        const workbook = new ExcelJS.Workbook();
        const konu = text(risk.x[0]);
        const sheetBase = konu.replace(/[\\/*?:\[\]\x00-\x1f]/g, ' ').replace(/^'+|'+$/g, '').trim() || 'Risk Değerlendirmesi';
        let sheet;
        let nextRow;
        let usedHeight;
        let bodyHeight;
        let pageNumber = 0;

        function newPage()
        {
            if (sheet) finishPage();
            pageNumber++;
            const suffix = '-' + pageNumber;
            const name = sheetBase.slice(0, 31 - suffix.length).replace(/'+$/, '') + suffix;
            sheet = workbook.addWorksheet(name, {
                pageSetup: {
                    paperSize: 9, orientation: 'landscape', fitToPage: true,
                    fitToWidth: 1, fitToHeight: 1,
                    horizontalCentered: true, verticalCentered: false,
                    margins: { top: 0.4 / 2.54, bottom: 0.4 / 2.54, left: 0.4 / 2.54, right: 0.4 / 2.54, header: 0, footer: 0 }
                }
            });
            sheet.columns = widths.map(width => ({ width }));
            writeHeader();
            // Sabit eski bir başlık payı yerine her sayfanın gerçek dört satırını kullan.
            const headerHeight = [1, 2, 3, 4].reduce((sum, row) => sum + sheet.getRow(row).height, 0);
            const pageWidth = (29.7 - 0.8) * 72 / 2.54;
            const tableWidth = widths.reduce((sum, width) => sum + Math.floor(width * 7 + 5), 0) * 0.75;
            const widthScale = Math.min(1, pageWidth / tableWidth);
            // İçerik bölünmesini aynen koru: önceki 0,8 + 0,8 + 0,2 cm hesabı.
            // Yeni baskı kenarları ve sonradan eklenen imzalar içerik kapasitesini değiştirmez.
            const printableHeight = (21 - 0.8 - 0.8 - 0.2) * 72 / 2.54;
            bodyHeight = Math.max(80, Math.floor(printableHeight / widthScale - headerHeight));
            nextRow = 5;
            usedHeight = 0;
        }

        function finishPage()
        {
            const spacer = nextRow;
            const row = nextRow + 1;
            sheet.mergeCells(spacer, 1, spacer, 18);
            sheet.getRow(spacer).height = 15;
            const employees = Array.isArray(signatures.employees) ? signatures.employees : [];
            const name = value =>
            {
                const words = String(value || '').trim().replace(/\s+/g, ' ').toLocaleLowerCase('tr-TR').split(' ');
                return words.map((word, i) => i === words.length - 1
                    ? word.toLocaleUpperCase('tr-TR')
                    : word.charAt(0).toLocaleUpperCase('tr-TR') + word.slice(1)).join(' ');
            };
            const team = role => employees.filter(person => Number(person.r) === role)
                .map(person => name(person.x)).filter(Boolean).join(', ');
            const blocks = [
                { from: 1, to: 3, name: name(signatures.expert), title: 'İş Güvenliği Uzmanı', certificate: signatures.expertNo },
                { from: 4, to: 5, name: name(signatures.doctor), title: 'İşyeri Hekimi', certificate: signatures.doctorNo },
                { from: 6, to: 6, name: name(signatures.employer), title: 'İşveren Vekili' },
                { from: 7, to: 7, name: team(1), title: 'Destek Elemanı' },
                { from: 8, to: 11, name: team(2), title: 'Çalışan Temsilcisi' },
                { from: 12, to: 18, name: team(3), title: 'Bilgi Sahibi Çalışan' }
            ];
            let height = 51;
            blocks.forEach(block =>
            {
                if (block.from !== block.to) sheet.mergeCells(row, block.from, row, block.to);
                const cell = sheet.getCell(row, block.from);
                const details = block.title + (Object.hasOwn(block, 'certificate') ? '\nBelge No: ' + String(block.certificate || '') : '');
                // Boş ekip rollerinde ad/unvan basılmaz; uzman/hekim/işveren alanları korunur.
                if (block.from >= 7 && !block.name) return;
                cell.value = { richText: [
                    { text: block.name, font: { name: 'Calibri', size: 10, bold: true } },
                    { text: '\n' + details, font: { name: 'Calibri', size: 10 } }
                ] };
                cell.font = { name: 'Calibri', size: 10 };
                cell.alignment = { horizontal: 'center', vertical: 'top', wrapText: true };
                const width = widths.slice(block.from - 1, block.to).reduce((sum, value) => sum + value * 7, 0) - 8;
                const lines = metrics.lines(block.name, width, 10, true).length + metrics.lines(details, width, 10).length;
                height = Math.max(height, lines * 14 + 8);
            });
            sheet.getRow(row).height = Math.min(400, height);
            sheet.pageSetup.printArea = 'A1:R' + row;
        }

        function cell(row, col, value, options = {})
        {
            const target = sheet.getCell(row, col);
            if (typeof value === 'string' && value.length > 32767)
                throw new Error('Bir hücredeki metin Excel’in 32767 karakter sınırını aşıyor.');
            target.value = value;
            target.font = { name: 'Calibri', size: 11, ...options.font };
            target.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true, ...options.alignment };
            target.border = border;
            if (options.fill) target.fill = options.fill;
            return target;
        }
        function writeHeader()
        {
            for (let row = 1; row <= 4; row++)
            {
                for (let col = 1; col <= 18; col++)
                    cell(row, col, '', { font: { size: row === 1 || row === 4 ? 12 : 9 }, fill: fill(row === 1 || row === 4 ? '008080' : 'F2F2F2') });
            }
            ['A1:R1', 'A4:R4', 'A2:B2', 'C2:C3', 'D2:D3', 'E2:E3', 'F2:F3', 'G2:G3', 'H2:H3', 'I2:I3', 'J2:J3', 'K2:N2', 'O2:R2'].forEach(range => sheet.mergeCells(range));
            const titles = {
                A1: firma.toLocaleUpperCase('tr-TR') + ' RİSK DEĞERLENDİRMESİ', A2: 'SAYFA NO\n',
                A3: 'RİSK NO', B3: 'TEHLİKE KAYNAĞI', C2: 'TEHLİKE', D2: 'RİSK - OLASI ETKİ',
                E2: 'RİSKE MARUZ KALAN ÇALIŞANLAR', F2: 'DÜZELTİCİ ÖNLEYİCİ KONTROL TEDBİRLERİ',
                G2: 'RİSK DEĞERLENDİRMESİNİN YAPILDIĞI TARİHTE MEVCUT DURUMUN DEĞERLENDİRMESİ ve ÖNERİLER',
                H2: 'DURUM UYGUNLUK', I2: 'TERMİN TARİHİ ve SORUMLU KİŞİ', J2: 'TEDBİRİ ALINDI MI',
                K2: 'ÖNLEMLERİN ALINMAMASI HALİNDE RİSKİN SEVİYESİ',
                O2: 'ÖNLEMLERİN ALINMASI HALİNDE RİSKİN SEVİYESİ',
                K3: 'ŞİDDET', L3: 'FREKANS', M3: 'OLASILIK', N3: 'RİSK',
                O3: 'ŞİDDET', P3: 'FREKANS', Q3: 'OLASILIK', R3: 'RİSK', A4: konu.toLocaleUpperCase('tr-TR')
            };
            Object.entries(titles).forEach(([address, value]) => { sheet.getCell(address).value = value; });
            ['A1', 'A4'].forEach(address => { sheet.getCell(address).font = { name: 'Calibri', size: 12, bold: true, color: { argb: 'FFFFFFFF' } }; });
            sheet.getCell('A2').font = { name: 'Calibri', size: 9, bold: true };
            ['A3', 'B3', 'E2', 'H2', 'J2', 'K3', 'L3', 'M3', 'N3', 'O3', 'P3', 'Q3', 'R3'].forEach(address =>
            {
                sheet.getCell(address).alignment = { horizontal: 'center', vertical: 'middle', wrapText: true, textRotation: 90 };
            });
            // Başlıkların da metni saklamaması için Windows yükseklikleri asgari değerdir.
            const totalWidth = widths.reduce((sum, width) => sum + width * 7, 0) - 8;
            sheet.getRow(1).height = Math.max(20, metrics.lines(titles.A1, totalWidth, 12, true).length * 17 + 4);
            sheet.getRow(4).height = Math.max(20, metrics.lines(titles.A4, totalWidth, 12, true).length * 17 + 4);
            // Excel Web'de doğrulanan kompakt başlık yükseklikleri (punto).
            // newPage, içerik kapasitesini bu gerçek yükseklikleri çıkararak hesaplar.
            sheet.getRow(2).height = 66.75;
            sheet.getRow(3).height = 42;

        }

        function writeSegment(rows, values, level, requiredHeight)
        {
            const firstRow = nextRow;
            let segmentHeight = 0;
            rows.forEach(row =>
            {
                for (let col = 1; col <= 18; col++) cell(nextRow, col, '');
                sheet.getCell(nextRow, 6).value = row.f;
                sheet.getCell(nextRow, 7).value = row.g;
                sheet.getRow(nextRow).height = row.height;
                segmentHeight += row.height;
                const status = sheet.getCell(nextRow, 8);
                status.value = '✔';
                status.font = { name: 'Calibri', size: 12, bold: true };
                status.dataValidation = { type: 'list', allowBlank: true, formulae: ['"✔,❌"'], showErrorMessage: true, errorStyle: 'stop', errorTitle: 'Geçersiz Giriş', error: 'Lütfen yalnızca listeden bir değer seçin: ✔ veya ❌' };
                nextRow++;
            });
            // Sol/sağ birleşik hücrelerdeki metin için de yeterli yükseklik ayır.
            while (segmentHeight < requiredHeight)
            {
                const last = sheet.getRow(nextRow - 1);
                const extra = Math.min(400 - last.height, requiredHeight - segmentHeight);
                last.height += extra;
                segmentHeight += extra;
                if (segmentHeight < requiredHeight)
                {
                    for (let col = 1; col <= 18; col++) cell(nextRow, col, '');
                    sheet.getRow(nextRow).height = Math.min(400, requiredHeight - segmentHeight);
                    segmentHeight += sheet.getRow(nextRow).height;
                    nextRow++;
                }
            }
            sharedColumns.forEach(col =>
            {
                if (nextRow - firstRow > 1) sheet.mergeCells(firstRow, col, nextRow - 1, col);
                const target = cell(firstRow, col, values[col], {
                    alignment: rotatedColumns.includes(col) ? { textRotation: 90 } : {}
                });
                if (typeof values[col] === 'number')
                {
                    const decimals = String(values[col]).split('.')[1]?.length || 0;
                    target.numFmt = decimals ? '0.' + '0'.repeat(decimals) : '0';
                }
            });
            [[14, level], [18, riskLevel(0)]].forEach(([col, style]) =>
            {
                const target = sheet.getCell(firstRow, col);
                target.fill = fill(style[1]);
                target.font = { name: 'Calibri', size: 11, bold: true, color: { argb: 'FF' + style[2] } };
            });
            usedHeight += segmentHeight;
        }

        newPage();
        risk.w.forEach((item, index) =>
        {
            if (!item || ![item.k, item.l, item.m].every(value => value !== null && value !== '' && Number.isFinite(Number(value))))
                throw new Error((index + 1) + '. tehlikenin risk puanları geçersiz.');
            const level = riskLevel(Number(item.k) * Number(item.l) * Number(item.m));
            const values = { 1: index + 1, 2: text(item.b), 3: text(item.c), 4: text(item.d), 5: text(item.e),
                11: Number(item.k), 12: Number(item.l), 13: Number(item.m), 14: level[0],
                15: Number(item.k), 16: 0.5, 17: 0.2, 18: riskLevel(0)[0] };
            const requiredHeight = Math.max(...sharedColumns.map(col =>
                metrics.height(values[col], col, rotatedColumns.includes(col), 11, col === 14 || col === 18)));
            const rows = [];
            const measures = Array.isArray(item.q) && item.q.length ? item.q : [{ f: '', g: '' }];
            // Tek önlem bile bir sayfadan uzunsa metni kaybetmeden devam satırlarına böl.
            const paddingPoints = 6;
            const lineHeight = 15.4;
            // Ek satır yok; 6 punto pay sayfa kapasitesine dahil edilir.
            const linesPerRow = Math.max(1, Math.min(22, Math.floor((bodyHeight - paddingPoints) / lineHeight)));
            measures.forEach(measure =>
            {
                const fText = text(measure?.f);
                const gText = text(measure?.g);
                const f = metrics.lines(fText, metrics.pixels(6));
                const g = metrics.lines(gText, metrics.pixels(7));
                const count = Math.max(1, Math.ceil(Math.max(f.length, g.length) / linesPerRow));
                for (let part = 0; part < count; part++)
                {
                    const fPart = f.slice(part * linesPerRow, (part + 1) * linesPerRow);
                    const gPart = g.slice(part * linesPerRow, (part + 1) * linesPerRow);
                    // Normal metnin kendi satır sonlarını koru; ölçümün kırımlarını yazma.
                    // Yalnızca uzun metinlerde mevcut devam satırı bölünmesini kullan.
                    rows.push({
                        f: f.length <= linesPerRow ? (part === 0 ? fText : '') : fPart.join('\n'),
                        g: g.length <= linesPerRow ? (part === 0 ? gText : '') : gPart.join('\n'),
                        height: Math.max(fPart.length, gPart.length) * lineHeight + paddingPoints
                    });
                }
            });
            let offset = 0;
            while (offset < rows.length)
            {
                const remaining = bodyHeight - usedHeight;
                let end = offset;
                let height = 0;
                while (end < rows.length && Math.max(height + rows[end].height, requiredHeight) <= remaining)
                {
                    height += rows[end].height;
                    end++;
                }
                if (end === offset)
                {
                    if (usedHeight > 0)
                    {
                        newPage();
                        continue;
                    }
                    // Olağandışı uzun ortak açıklama: tamamını göster, 1×1 sığdırma küçültsün.
                    end++;
                }
                writeSegment(rows.slice(offset, end), values, level, requiredHeight);
                offset = end;
                // Devam sayfasında aynı numara, tehlike ve puanlar yeniden yazılır.
                if (offset < rows.length) newPage();
            }
        });
        finishPage();
        return { workbook, filename: filename(firma, konu) };
    }

    async function download(button)
    {
        if (button.disabled) return;
        const label = button.value;
        button.disabled = true;
        button.value = 'Hazırlanıyor…';
        try
        {
            const stored = store.get('xjsonfirma');
            const firma = typeof stored === 'string' ? JSON.parse(stored) : stored;
            if (!firma || !firma.fi) throw new Error('İşyeri bilgileri bulunamadı. Lütfen işyerini yeniden seçiniz.');
            const selected = new URLSearchParams(window.location.search).get('id');
            if (selected && String(store.get('xfirmaid')) !== selected)
                throw new Error('İşyeri seçimi değişmiş. Lütfen bu sayfada işyerini yeniden seçiniz.');
            const response = await fetch('/riskcikti2/excelveri/' + encodeURIComponent(button.dataset.id));
            const risk = await response.json();
            if (!response.ok) throw new Error(risk.error || 'Risk değerlendirme verisi alınamadı.');
            const teamQuery = new URLSearchParams({ firmaid: selectedCompany() });
            const teamResponse = await fetch('/riskcikti2/verigetir?' + teamQuery);
            const teamData = await teamResponse.json();
            if (!teamResponse.ok) throw new Error(teamData.error || 'İmza ekibi alınamadı.');
            const result = await build(risk, String(firma.fi), {
                expert: store.get('uzmanad'), expertNo: store.get('uzmanno'),
                doctor: firma.hk, doctorNo: firma.hn, employer: firma.is,
                employees: teamData.calisanjson
            });
            const buffer = await result.workbook.xlsx.writeBuffer();
            saveAs(new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }), result.filename);
        }
        catch (error)
        {
            console.error('Risk Excel çıktısı oluşturulamadı', error);
            alertify.error(error.message || 'Excel çıktısı oluşturulamadı.');
        }
        finally
        {
            button.disabled = false;
            button.value = label;
        }
    }

function loadTables()
{    
    let json = riskStoreJsonOku("riskciktigenelliste");
    if (!Array.isArray(json))
    {
        json = [];
    }
    const ozelliste = [3, 4, 9, 11, 12, 55, 63, 68, 84, 87, 113, 114, 129, 140, 142, 153, 167, 300];
    const ozeljson = json.filter(item => ozelliste.includes(item.i));
    json.sort((x, y) => x.a.localeCompare(y.a, 'tr'));
    ozeljson.sort((x, y) => x.a.localeCompare(y.a, 'tr'));
    function genelRiskTableYukle(data)
    {
        if ($.fn.DataTable.isDataTable('#genelrisktablo'))
        {
            $('#genelrisktablo').DataTable().destroy();
            $('#genelrisktablo').empty();
        }
        $('#genelrisktablo').DataTable(
            {
                ordering: false,
                pageLength: 10,
                lengthMenu: [[10, 25, 50, -1], [10, 25, 50, 'Tümü']],
                data: data,
                columns:
                    [
                        { data: 'a', title: 'Risk Değerlendirme Adı', width: '80%' },
                        { data: 'o', title: 'Onay', width: '10%', render: d => d == 1 ? '✓' : '' },
                        {
                            data: 'i',
                            title: 'Ekle',
                            orderable: false,
                            width: '10%',
                            render: d =>
                                `<input name="ekle" type="button" class="cssbutontamam" value="Ekle" data-id="${d}"/>`
                        }
                    ],
                language:
                {
                    search: "Risk Değerlendirme Ara:",
                    lengthMenu: "Sayfa başına _MENU_ kayıt göster",
                    zeroRecords: "Eşleşen kayıt bulunamadı",
                    info: "_TOTAL_ kayıttan _START_ ile _END_ arası gösteriliyor",
                    infoEmpty: "Kayıt yok",
                    infoFiltered: "(toplam _MAX_ kayıttan filtrelendi)",
                    emptyTable: "Risk değerlendirmesi bulunamadı"
                },
                headerCallback: t => $(t).find('th').css('text-align', 'center'),
                createdRow: row => $(row).find('td').eq(0).css('text-align', 'left')
            });

        $('.dt-search input').css({ "background-color": "white" }).attr("autocomplete", "off");
        $('.dt-length select').css({ "background-color": "white" });
    }
    genelRiskTableYukle(json);
    $('#riskfiltre').on('change', function ()
    {
        if (this.value === "1") {
            genelRiskTableYukle(ozeljson);
        }
        else
        {
            genelRiskTableYukle(json);
        }            
    });

    let anatablo = $('#risktablocikti').DataTable
    ({
        dom: 't',
        pageLength: -1,
        ordering: false,
        columns:
        [
            { data: null, title: 'Sıra', width: '14%', orderable: false, render: () => '<input type="button" class="cssbutontamam" name="risksiratasi" value="↑" title="Yukarı taşı" aria-label="Yukarı taşı" data-direction="-1" style="min-width:0;width:40px;margin-right:4px;"/><input type="button" class="cssbutontamam" name="risksiratasi" value="↓" title="Aşağı taşı" aria-label="Aşağı taşı" data-direction="1" style="min-width:0;width:40px;"/>' },
            { data: 'a', title: "Risk Değerlendirme Listesi", width: "66%" },
            { data: 'i', title: 'Sil', width: '10%', render: d => `<input name="sil" type="button" class="cssbutontamam" value="Sil" data-id="${d}" />` },
            { data: 'i', title: 'Yazdır', width: '10%', render: d => `<input name="riskexcelyazdir" type="button" class="cssbutontamam" value="Yazdır" data-id="${Number(d)}" />` }
        ],
        headerCallback: thead => $(thead).find('th').css('text-align', 'center'),
        createdRow: row => {
            $(row).find('td').eq(0).css({ 'text-align': 'center', 'white-space': 'nowrap' });
            $(row).find('td').eq(1).css({ 'text-align': 'left' });
        }
    });
    $('#risktablocikti').off('click.riskSira', 'input[name="risksiratasi"]')
        .on('click.riskSira', 'input[name="risksiratasi"]', function ()
        {
            const row = anatablo.row($(this).closest('tr'));
            const index = anatablo.rows().nodes().toArray().indexOf(row.node());
            const target = index + Number(this.dataset.direction);
            const rows = anatablo.rows().data().toArray();
            if (index < 0 || target < 0 || target >= rows.length) return;
            [rows[index], rows[target]] = [rows[target], rows[index]];
            anatablo.clear().rows.add(rows).draw(false);
        });
    $(document).on('click', 'input[name="ekle"]', function ()
    {
        const id = $(this).data('id');
        const table = $(this).closest('table').attr('id');
        const sourceTable = $('#' + table).DataTable();
        const satirVerisi = sourceTable.data().toArray().find(x => x.i == id);
        if (satirVerisi)
        {
            anatablo.row.add({ a: satirVerisi.a, i: satirVerisi.i }).draw();
        }
        $("#diyaloggenelrisktablo").fadeOut();
        $("#diyalogsikrisktablo").fadeOut();
        $("#risktablodiv").fadeIn();
        if (anatablo.rows().count() === 50)
        {
            $("#riskeklebuton").fadeOut();
            alertify.error("En fazla üç tane İSG talimatı ekleyebilirsiniz");
        }
        else
        {
            $("#riskeklebuton").fadeIn();
        }
        if (anatablo.rows().count() > 1) $("#bilgi").fadeIn();
        else $("#bilgi").fadeOut();
    });
    $(document).on('click', 'input[name="sil"]', function ()
    {
        const id = $(this).data('id');
        anatablo.rows().every(function ()
        {
            const data = this.data();
            if (data.i == id)
            {
                this.remove().draw();
                return false;
            }
        });
        if (anatablo.rows().count() === 0) $("#risktablodiv").fadeOut();
        if (anatablo.rows().count() !== 50) $("#riskeklebuton").fadeIn();
        else $("#riskeklebuton").fadeOut();
        if (anatablo.rows().count() > 1) $("#bilgi").fadeIn();
        else $("#bilgi").fadeOut();
    });
}

    function selectedCompany()
    {
        const id = new URLSearchParams(window.location.search).get('id');
        if (!id || id !== String(store.get('xfirmaid')))
            throw new Error('İşyeri seçimi değişmiş. Lütfen işyerini yeniden seçiniz.');
        return id;
    }

    async function outputData(ids)
    {
        const query = new URLSearchParams({ firmaid: selectedCompany(), ids: ids.join(',') });
        const response = await fetch('/riskcikti2/verigetir?' + query);
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Çıktı verileri alınamadı.');
        // Önceki işyerinden kalan verilerle çıktı üretme; her tıklamada yeniden oku.
        store.set('riskcikticalisanliste', data.calisanjson);
        store.set('riskciktiseciliriskler', data.riskjson);
    }

    async function output(button, kind)
    {
        if (button.disabled) return;
        button.disabled = true;
        try
        {
            const ids = kind === 'json' ? Array.from(document.querySelectorAll('#risktablocikti tbody input[name="sil"]'), el => Number(el.dataset.id)) : [];
            if (kind === 'json' && !ids.length) throw new Error('Risk Değerlendirmesi Bulunamadı');
            await outputData(ids);
            if (kind === 'json') riskdosyajsonindir();
            else await riskgirispdfyazdir();
        }
        catch (error) { alertify.error(error.message || 'Çıktı oluşturulamadı.'); }
        finally { button.disabled = false; }
    }

    async function init()
    {
        $('#riskkapakbutton').off('click').on('click', function () { output(this, 'pdf'); });
        $('#riskcikti2button').off('click').on('click', function () { output(this, 'json'); });
        try
        {
            const { response, json } = await riskcikti2genelgetir();
            if (!response.ok) throw new Error(json.error || 'Risk değerlendirme listesi alınamadı.');
            store.set('riskciktigenelliste', Array.isArray(json) ? json : []);
            loadTables();
            $('#diyaloggenelrisktablo').fadeIn();
        }
        catch (error) { alertify.error(error.message || 'Risk değerlendirme listesi alınamadı.'); }
    }

    window.RiskExcel = { build, init };
    $(document).off('click.riskExcel', '#risktablocikti input[name="riskexcelyazdir"]')
        .on('click.riskExcel', '#risktablocikti input[name="riskexcelyazdir"]', function () { download(this); });
})();
