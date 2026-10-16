function gptriskdurumgoster(mesaj)
{
    $('#gptriskdurum').text(String(mesaj || '')).show();
}

function gptriskuzmanadoku()
{
    try
    {
        var uzmanlar = store.get('uzmanjson');
        uzmanlar = typeof uzmanlar === 'string' ? JSON.parse(uzmanlar) : uzmanlar;
        return Array.isArray(uzmanlar) ? String(uzmanlar[0]?.uz || '').trim() : '';
    }
    catch (err)
    {
        return '';
    }
}

function gptriskimportload()
{
    $('#gptriskkaydet').off('click.gptriskimport').on('click.gptriskimport', async function ()
    {
        var metin = String($('#riskdegerlendirme').val() || '').trim();
        if (!metin)
        {
            alertify.error('Lütfen ChatGPT tarafından oluşturulan JSON verisini yapıştırınız.');
            return;
        }

        var jsonData;
        try
        {
            jsonData = JSON.parse(metin);
        }
        catch (err)
        {
            alertify.error('Yapıştırılan veri geçerli bir JSON değil.');
            return;
        }

        if (!jsonData || typeof jsonData !== 'object' || Array.isArray(jsonData) ||
            !Array.isArray(jsonData.x) || !jsonData.x.length ||
            !Array.isArray(jsonData.w) || !jsonData.w.length)
        {
            alertify.error('Risk verisi beklenen biçimde değil; x ve w listelerini kontrol ediniz.');
            return;
        }

        var ad = String(jsonData.x[0] || '').trim();
        var yazar = gptriskuzmanadoku();
        if (!ad)
        {
            alertify.error('Risk değerlendirmesi adı JSON içindeki x alanında bulunamadı.');
            return;
        }
        if (!yazar)
        {
            alertify.error('Uzman adı bulunamadı. Önce uzman bilgilerinizi tanımlayınız.');
            return;
        }
        $('#gptriskkaydet').prop('disabled', true);
        await kayit(jsonData, ad, yazar);
    });
}
