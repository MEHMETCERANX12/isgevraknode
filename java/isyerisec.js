function isyerisecimtamam()
{
    let firmajson = jsoncevir(store.get('firmajson')) || {};
    const firmaid = $('#isyeri').val();
    if (!firmaid)
    {
        mesajmetin("Lütfen işyeri seçiniz");
        return;
    }
    firmajson = firmajson.find(f => f.id == firmaid);
    store.set('xjsonfirma', firmajson);
    store.set('xfirmaid', firmajson.id);
    const link = new URLSearchParams(window.location.search);
    const secim = link.get("id");
    if (secim === '01')
    {
        window.location.href = "/calisanliste?id=" + encodeURIComponent(firmajson.id);
    }    
    if (secim === '02')
    {
        window.location.href = "/calisanexcel1?id=" + encodeURIComponent(firmajson.id);
    }    
    if (secim === '03')
    {
        window.location.href = "/gorevlendirmeacil?id=" + encodeURIComponent(firmajson.id);
    }    
    if (secim === '04')
    {
        window.location.href = "/gorevlendirmetemsilci?id=" + encodeURIComponent(firmajson.id);
    }    
    if (secim === '05')
    {
        window.location.href = "/gorevlendirmerisk?id=" + encodeURIComponent(firmajson.id);
    }    
    if (secim === '06')
    {
        window.location.href = "/gorevlendirmekurul?id=" + encodeURIComponent(firmajson.id);
    }    
    if (secim === '07')
    {
        window.location.href = "/evrakcalisan?id=" + encodeURIComponent(firmajson.id);
    }    
    if (secim === '08')
    {
        window.location.href = "/evrakisyeri?id=" + encodeURIComponent(firmajson.id);
    }    
    if (secim === '09')
    {
        window.location.href = "/raporlama?id=" + encodeURIComponent(firmajson.id);
    }    
}

function isyerisecimload()
{
    const dropdown = $('#isyeri');
    dropdown.empty();
    dropdown.append($('<option>', { text: 'Lütfen işyerini seçiniz', value: '', disabled: true, selected: true }));
    let firmajson = jsoncevir(store.get('firmajson')) || {};
    if (firmajson.length > 0)
    {
        firmajson.sort((a, b) => a.fk.localeCompare(b.fk, 'tr', { sensitivity: 'base' }));
        $.each(firmajson, function (_, row) { dropdown.append($('<option>', { text: row.fk, value: row.id }));});
    }
    else
    {
        alertify.error("Kayıtlı işyeri bulunamadı");
    }
    dropdown.select2({ placeholder: "Lütfen işyerini seçiniz", theme: "classic",  allowClear: true, language: { noResults: function () { return "Sonuç bulunamadı";}}});
    const link = new URLSearchParams(window.location.search);
    const secim = link.get("id");
    if (secim === '01')
    {
        $("#baslik").text("ÇALIŞAN, EKLEME DÜZENLEME ve SİLME");
    } 
    else if (secim === '02')
    {
        $("#baslik").text("EXCEL İLE ÇALIŞAN EKLEME, DÜZENLEME ve SİLME");
    } 
    else if (secim === '03')
    {
        $("#baslik").text("ACİL DURUM EKİBİ GÖREVLENDİRME");
    } 
    else if (secim === '04')
    {
        $("#baslik").text("ÇALIŞAN TEMSİLCİSİ GÖREVLENDİRME");
    } 
    else if (secim === '05')
    {
        $("#baslik").text("RİSK DEĞERLENDİRME EKİBİ GÖREVLENDİRME");
    } 
    else if (secim === '06')
    {
        $("#baslik").text("İŞ SAĞLIĞI ve GÜVENLİĞİ KURULU ÜYELERİ");
    } 
    else if (secim === '07')
    {
        $("#baslik").text("ÇALIŞAN EVRAK KAYIT");
    }
    else if (secim === '08')
    {
        $("#baslik").text("İŞYERİ EVRAK KAYIT");
    } 
    else if (secim === '09')
    {
        $("#baslik").text("RAPORLAMA");
    } 
}