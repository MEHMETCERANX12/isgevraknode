function yeniloadx1()
{
    $("#fi").on("blur", function () { if ($("#fiduzelt").prop("checked")) { basharfbuyuk(this); tekbosluk(this) } }); $("#fiduzelt").on("change", function () { if ($(this).prop("checked")) { basharfbuyuk($("#fi")[0]); tekbosluk($("#fi")[0]); } });
    $("#ad").on("blur", function () { if ($("#adresduzelt").prop("checked")) { adresduzelt(this); tekbosluk(this) } }); $("#adresduzelt").on("change", function () { if ($(this).prop("checked")) { adresduzelt($("#ad")[0]); tekbosluk($("#ad")[0]); } });
}

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

async function yenidevamx3()
{
    try
    {
        let id = metinuret(10);
        let fi = $('#fi').val().trim();
        let fk = $('#fk').val().trim();
        let isv = $('#is').val().trim();
        let ad = $('#ad').val().trim();
        let sh = $('#sh').val();
        let sc = $('#sc').val().trim();
        let hkVal = ($('#hk').val() || "").toString();
        let hk = "", hn = "";
        if (hkVal.includes("|"))
        {
            let p = hkVal.split("|");
            hk = p[0].trim();
            hn = p[1].trim();
        }
        let ts = parseInt($('#ts').val(), 10) || 0;
        if (!fi || !isv || !sh || ts === 0)
        {
            alertify.error("Zorunlu alanları doldurunuz.");
            return false;
        }
        let yeniFirma = { id, fi, fk, is: isv, ad, ts, sh, sc, hk, hn };
        let firmajson = store.get('firmajson') || [];
        if (typeof firmajson === "string")
            firmajson = JSON.parse(firmajson);

        if (!Array.isArray(firmajson))
            firmajson = [];

        if (firmajson.some(x => x.id === id))
        {
            alertify.error("ID zaten var");
            return false;
        }
        firmajson.push(yeniFirma);
        const response = await fetch("/isyeriyeni/isyeriguncelle",
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
            alertify.error(result.error || "Kayıt hatası");
            return false;
        }
        store.set('firmajson', firmajson);
        window.location.href = "/isyeriliste";
        return true;
    }
    catch (e)
    {
        alertify.error("Hata: " + e.message);
        return false;
    }
}
