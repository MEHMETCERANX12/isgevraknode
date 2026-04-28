function hekimlistesix2(data)
{
    const $hk = $("#hk");
    let list;
    try
    {
        list = Array.isArray(data) ? data : jsoncevir(data);
    }
    catch
    {
        alertify.error("Hekim listesi okunamadı (JSON hatası).");
        return;
    }
    if (!Array.isArray(list) || list.length === 0)
    {
        $hk.empty();
        return;
    }
    list.sort((a, b) => (a?.ad ?? "").localeCompare((b?.ad ?? ""), "tr", { sensitivity: "base" }));
    const frag = document.createDocumentFragment();
    frag.appendChild(new Option("Henüz Bilmiyorum", ""));
    for (const item of list)
    {
        const ad = (item?.ad ?? "").toString().trim();
        const no = (item?.no ?? "").toString().trim();
        if (!ad) continue;
        frag.appendChild(new Option(ad, `${ad}|${no}`));
    }
    $hk.empty()[0].appendChild(frag);
}

function duzenleloadx4()
{
    const link = new URLSearchParams(window.location.search);
    const id = link.get('id');
    let firmajson = jsoncevir(store.get('firmajson')) || {};
    firmajson = firmajson.find(item => item.id === id);
    if (firmajson)
    {
        $("#fi").val(firmajson.fi || "");
        $("#is").val(firmajson.is || "");
        $("#sh").val(firmajson.sh || "");
        $("#ts").val(firmajson.ts || "");
        let hkAd = firmajson.hk || "";
        $("#hk option").each(function(){let t=$(this).val();if(t.startsWith(hkAd+"|")){$("#hk").val(t);return false}});
        $("#fk").val(firmajson.fk || "");
        $("#sc").val(firmajson.sc || "");
        $("#ad").val(firmajson.ad || "");
    }
    else
    {
        alertify.error('Beklenmedik bir hata oluştu');
    }
}

function duzenledevamx5()
{
    const link = new URLSearchParams(window.location.search);
    const id = link.get('id');
    if (!id || id.length !== 10)
    {
        window.location.href = "/isyeriliste";
        return false;
    }
    let firmajson = jsoncevir(store.get('firmajson')) || {};
    if (!Array.isArray(firmajson) || firmajson.length === 0)
    {
        alertify.error("Beklenmedik bir hata oluştu");
        return false;
    }
    let fi = $('#fi').val().trim();
    let isv = $('#is').val().trim();
    let sh = $('#sh').val();
    let ts = parseInt($('#ts').val(), 10) || 0;
    if (!fi || !isv || !sh || ts === 0)
    {
        alertify.error("Zorunlu alanları doldurunuz.");
        return false;
    }
    let guncelVeri = { id: id, fi: $("#fi").val().trim(), fk: $("#fk").val().trim(), is: $("#is").val().trim(), ad: $("#ad").val().trim(), ts: $("#ts").val(), sh: $("#sh").val().trim(), sc: $("#sc").val().trim(), hk: "", hn: "" };
    let hkVal = ($("#hk").val() || "").toString();
    if(hkVal.includes("|")){let p=hkVal.split("|");guncelVeri.hk=p[0].trim();guncelVeri.hn=p[1].trim();}
    let index = firmajson.findIndex(f => f.id === id);
    if (index !== -1)
    {
        firmajson[index] = guncelVeri;
        store.set("firmajson", firmajson);
        return true;
    }
    else
    {
        alertify.error("Firma bulunamadı.");
        return false;
    }
}

async function duzenlekaydetx9()
{
    if (!duzenledevamx5())
    {
        return false;
    }
    try
    {
        const firmajson = jsoncevir(store.get("firmajson")) || [];
        const response = await fetch("/isyeriduzenle/isyeriguncelle",
        {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(firmajson)
        });
        const result = await response.json();
        if (!response.ok)
        {
            alertify.error(result.error || "Güncelleme hatası");
            return false;
        }
        alertify.success("İşyeri güncellendi");
        window.location.href = "/isyeriliste";
        return true;
    }
    catch (e)
    {
        alertify.error("Hata: " + e.message);
        return false;
    }
}
