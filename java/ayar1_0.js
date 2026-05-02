$(document).ready(async function ()
{ 
    ayarhiddenokua5();
    ayarmastermenurenkbagla();
    var t = store.get('ayarActiveTab');
    ayartabgecisa2(t || "5");
    ayarserveroku();
 });

async function ayarserveroku()
{
    try
    {
        const response = await fetch('/ayar/oku');
        const data = await response.json().catch(function () { return {}; });
        if (!response.ok)
        {
            if (response.status !== 401)
            {
                console.error("settings oku hata:", response);
            }
            return;
        }
        if (!data || typeof data !== "object" || Array.isArray(data))
        {
            return;
        }
        const json = JSON.stringify(data);
        store.set("settings", json);
        ayarhiddenokua5();
        ayarmastermenurenkbagla();
    }
    catch (err)
    {
        console.error("settings oku hata:", err);
    }
}

async function ayarkaydet()
{
    if (!ayargetjsona4())
    {
        return false;
    }
    const json = jsoncevir(store.get("settings"));
    try
    {
        const response = await fetch('/ayar/kaydet',
        {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(json)
        });
        if (!response.ok)
        {
            mesaj('9');
            return false;
        }
        mesaj('2');
        ayarmastermenurenkbagla();
    }
    catch
    {
        mesaj('9');
    }
    return false;
}

function ayartabgecisa2(t)
{
    $(".tab,.tab-content").removeClass("active");
    let hedef = String(t || "1");
    let tab = document.getElementById(hedef + "-tab");
    let content = document.getElementById(hedef);
    if (!tab || !content)
    {
        hedef = "5";
        tab = document.getElementById("5-tab");
        content = document.getElementById("5");
    }
    if (tab) tab.classList.add("active");
    if (content)
    {
        content.classList.add("active");
    }
    store.set('ayarActiveTab', hedef);
}

function ayartabkeya3(id)
{
    const map={"1":"e","2":"y","3":"k","4":"i","5":"g","6":"a","7":"r","8":"c","9":"t","10":"p","11":"d"};
    return map[String(id)]||"tab"+String(id);
}

function ayargetjsona4()
{
    const sonuc = {};
    $(".tab-content").each(function ()
    {
        const tabId = this.id;
        const tabKey = ayartabkeya3(tabId);
        const tabObj = {};
        $(this).find("input[name], select[name], textarea[name]").each(function ()
        {
            const el = $(this);
            const name = String(el.attr("name") || "").trim();
            if (!name) return;
            let value = "";
            if (el.is("select"))
            {
                value = String(el.val() || "");
            }
            else if (el.is(":checkbox"))
            {
                value = el.is(":checked") ? "1" : "0";
            }
            else if (el.is(":radio"))
            {
                if (!el.is(":checked")) return;
                value = String(el.val() || "");
            }
            else
            {
                value = String(el.val() || "");
            }

            tabObj[name] = value;
        });
        sonuc[tabKey] = [tabObj];
    });
    store.set("settings", JSON.stringify(sonuc));
    return true;
}

function ayarhiddenokua5()
{
    const hiddenValue = store.get("settings");
    if (!hiddenValue) return;
    const parsedData = jsoncevir(hiddenValue);
    if (!parsedData || typeof parsedData !== 'object') return;
    const eskiAlanMap = {
        y: { k: "a", l: "b", m: "c", n: "q", o: "w", p: "x", r: "z", s: "v" }
    };
    const tabIdMap = { e: "1", y: "2", k: "3", i: "4", g: "5", a: "6", r: "7", c: "8", t: "9", p: "10", d: "11" };

    function elemanaDegerYaz($container, elementName, value)
    {
        const selectorName = String(elementName || "").replace(/\\/g, "\\\\").replace(/"/g, '\\"');
        const $element = $container.find('[name="' + selectorName + '"]');
        if (!$element.length) return;

        const normalizedValue = String(value ?? '');
        if ($element.is(':checkbox'))
        {
            $element.prop('checked', normalizedValue === '1' || normalizedValue.toLowerCase() === 'true');
            return;
        }

        if ($element.is(':radio'))
        {
            $container.find('input[type="radio"][name="' + selectorName + '"][value="' + normalizedValue + '"]').prop('checked', true);
            return;
        }

        $element.val(normalizedValue);
    }
    Object.keys(parsedData).forEach(function (tabKey)
    {
        const sectionList = parsedData[tabKey];
        if (!Array.isArray(sectionList) || sectionList.length === 0) return;
        const tabId = tabIdMap[tabKey];
        if (!tabId) return;
        const $tab = $("#" + tabId);
        if (!$tab.length) return;

        const firstSection = sectionList[0];
        if (!firstSection || typeof firstSection !== 'object') return;
        if ('key' in firstSection) return;

        Object.keys(firstSection).forEach(function (elementName)
        {
            const normalizedName = (eskiAlanMap[tabKey] && eskiAlanMap[tabKey][elementName]) ? eskiAlanMap[tabKey][elementName] : elementName;
            elemanaDegerYaz($tab, normalizedName, firstSection[elementName]);
        });
    });
}

function ayarmastermenurenkbagla()
{
    const $secim = $('#5 select[name="b"]');
    if (!$secim.length) return;

    mastermenurenkleriniuygula($secim.val());
    $secim.off('change.ayarmenu').on('change.ayarmenu', function ()
    {
        mastermenurenkleriniuygula($(this).val());
    });
}
