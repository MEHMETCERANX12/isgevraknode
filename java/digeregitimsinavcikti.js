(function (window, $)
{
    "use strict";

    const DIGER_SINAV_JSON_URL = "https://mehmetceranx12.github.io/isgevraknode/json/digersinav.json";
    const DIGER_SINAV_LISTE_STORE = "digersinavsablonliste";
    const DIGER_SINAV_ID_STORE = "digeregitimsinavsablonid";
    const DIGER_SINAV_ICERIK_STORE = "digersinavicerik";

    const egitimTurleri = new Map([
        [1, "Yüksekte Çalışma Eğitimi"],
        [2, "İş Ekipmanı Eğitimi"],
        [3, "Kimyasallarla Güvenli Çalışma"],
        [4, "İş Kazası Eğitimi"],
        [5, "KKD Eğitimi"],
        [6, "Kaldırma Aksesuarı Eğitimi"],
        [7, "Yangın Eğitimi"],
        [8, "Gürültülü Ortamda Güvenli Çalışma"]
    ]);

    window.digerEgitimSinavCiktiKontrol = async function ()
    {
        $("#loading").show();
        try
        {
            await digerEgitimSinavSorusu();
            if (typeof alertify !== "undefined" && alertify.error)
            {
                alertify.error("Dosya indirildi", 7);
            }
        }
        catch (err)
        {
            console.error("diğer eğitim sınav çıktı hata", err);
            if (typeof alertify !== "undefined" && alertify.error)
            {
                alertify.error("Sınav dosyası oluşturulamadı.", 7);
            }
        }
        finally
        {
            $("#loading").hide();
        }
    };

    window.digerEgitimSinavCiktiButonuHazirla = function ()
    {
        const $butonAlani = $("#alan3 .cssbutonortala");
        if (!$butonAlani.length)
        {
            return;
        }

        if (!$("#fonksiyoncalistir7").length)
        {
            $butonAlani.append("<input id='fonksiyoncalistir7' value='SINAV' type='button' class='cssbutontumu' />");
        }

        $("#fonksiyoncalistir7").off("click.digeregitimsinav").on("click.digeregitimsinav", window.digerEgitimSinavCiktiKontrol);
        $("#alan3").show();
    };

    async function digerEgitimSinavSorusu()
    {
        const digeregitimveri = jsoncevir(store.get("digeregitimveri")) || {};
        const sinavSablon = await digerEgitimSeciliSinavSablonOku(digeregitimveri);
        const sinavSecim = digerEgitimSayiDizisi(sinavSablon && sinavSablon.sinav);

        if (sinavSecim.length === 0)
        {
            throw new Error("Sınav şablonu içinde soru seçimi bulunamadı.");
        }

        const sinavverisi = await digerEgitimSinavSoruVerisiOku();
        const sinavSorular = Array.isArray(sinavverisi.sinav) ? sinavverisi.sinav : [];
        const secilenSoruAdedi = sinavSorular.filter(function (soru)
        {
            return sinavSecim.includes(Number(soru && soru.id));
        }).length;

        if (secilenSoruAdedi === 0)
        {
            throw new Error("Seçili sınav şablonundaki sorular, sınav soru içeriği ile eşleşmedi.");
        }

        let calisanlar = digerEgitimSeciliCalisanlariOku();

        if (!Array.isArray(calisanlar) || calisanlar.length === 0)
        {
            calisanlar = [{ a: "", u: "" }];
        }

        await digerEgitimSinavYazdir(
            calisanlar,
            digeregitimveri.tarih || "....../....../20.....",
            digerEgitimSinavBasligi(digeregitimveri),
            digerEgitimSinavImzaAlaniOku(),
            sinavSorular,
            sinavSecim,
            store.get("uzmanad") || "",
            digerEgitimSinavDosyaAdi(digeregitimveri)
        );
    }

    async function digerEgitimSeciliSinavSablonOku(digeregitimveri)
    {
        if (digeregitimveri && digeregitimveri.sinavsablonveri)
        {
            return digeregitimveri.sinavsablonveri;
        }

        const sablonId = String((digeregitimveri && digeregitimveri.sinavid) || store.get(DIGER_SINAV_ID_STORE) || "").trim();
        if (!sablonId)
        {
            return null;
        }

        const liste = jsoncevir(store.get(DIGER_SINAV_LISTE_STORE));
        let sablon = Array.isArray(liste) ? liste.find(function (item, index)
        {
            return digerEgitimSinavSablonAnahtari(item, index, liste) === sablonId;
        }) : null;

        if (sablon)
        {
            return sablon;
        }

        const guncelListe = await digerEgitimSinavSablonListesiOku();
        sablon = guncelListe.find(function (item, index)
        {
            return digerEgitimSinavSablonAnahtari(item, index, guncelListe) === sablonId;
        });

        return sablon || null;
    }

    async function digerEgitimSinavSablonListesiOku()
    {
        const response = await fetch("/sinav/oku/0");
        const sonuc = await response.json().catch(function () { return {}; });
        if (!response.ok || !sonuc.success)
        {
            return [];
        }

        const liste = (Array.isArray(sonuc.data) ? sonuc.data : []).filter(function (item)
        {
            return String(item && item.tur ? item.tur : "") === "diger";
        });
        store.set(DIGER_SINAV_LISTE_STORE, JSON.stringify(liste));
        return liste;
    }

    function digerEgitimSinavSablonAnahtari(item, index, kaynakListe)
    {
        const id = String(item && item.id ? item.id : "").trim();
        const kaynakIndex = Array.isArray(kaynakListe) ? kaynakListe.indexOf(item) : -1;
        return id || ("__index_" + String(kaynakIndex >= 0 ? kaynakIndex : index));
    }

    function digerEgitimSayiDizisi(dizi)
    {
        return (Array.isArray(dizi) ? dizi : []).map(function (deger)
        {
            return Number(deger);
        }).filter(function (deger)
        {
            return Number.isFinite(deger);
        });
    }

    async function digerEgitimSinavSoruVerisiOku()
    {
        const mevcut = store.get(DIGER_SINAV_ICERIK_STORE);
        const mevcutJson = typeof mevcut === "string" ? jsoncevir(mevcut) : mevcut;
        if (mevcutJson && Array.isArray(mevcutJson.sinav) && mevcutJson.sinav.length > 0)
        {
            return mevcutJson;
        }

        const response = await fetch(DIGER_SINAV_JSON_URL);
        const veri = await response.json().catch(function () { return null; });
        if (!response.ok || !veri || !Array.isArray(veri.sinav) || veri.sinav.length === 0)
        {
            throw new Error("Sınav soru içeriği okunamadı.");
        }

        store.set(DIGER_SINAV_ICERIK_STORE, JSON.stringify(veri));
        return veri;
    }

    function digerEgitimSeciliCalisanlariOku()
    {
        const calisanlistedata = store.get("calisansecimjsonx");
        const calisanliste = jsoncevir(calisanlistedata);
        return Array.isArray(calisanliste) ? calisanliste : [];
    }

    function digerEgitimSinavImzaAlaniOku()
    {
        const settings = jsoncevir(store.get("settings"));
        if (!settings || typeof settings !== "object" || Array.isArray(settings))
        {
            return false;
        }

        const egitim = Array.isArray(settings.e) && settings.e.length > 0 ? settings.e[0] : null;
        if (!egitim || typeof egitim !== "object")
        {
            return false;
        }

        return String(egitim.b ?? "0") === "1";
    }

    function digerEgitimSinavDosyaAdi(digeregitimveri)
    {
        const egitimTurInt = parseInt(digeregitimveri && digeregitimveri.egitimtur, 10) || 1;
        return (egitimTurleri.get(egitimTurInt) || "Diğer Eğitim") + " Sınav.pdf";
    }

    function digerEgitimSinavBasligi(digeregitimveri)
    {
        const egitimTurInt = parseInt(digeregitimveri && digeregitimveri.egitimtur, 10) || 1;
        return (egitimTurleri.get(egitimTurInt) || "DİĞER EĞİTİM").toLocaleUpperCase("tr-TR");
    }

    function digerEgitimSinavYazdir(calisanjson, tarih, sinavBasligi, sinavimzaalani, sorular, sinavsecim, uzmanad, dosyaAdi)
    {
        const calisanlar = Array.isArray(calisanjson) ? calisanjson : [calisanjson];
        const icerik = digerEgitimSinavIcerigiOlustur(calisanlar, tarih, sinavBasligi, sinavimzaalani, sorular, sinavsecim, uzmanad);

        const docDefinition =
        {
            pageSize: "A4",
            pageMargins: [30, 20, 30, 20],
            defaultStyle:
            {
                font: "Roboto",
                fontSize: 10,
                lineHeight: 1
            },
            content: icerik
        };

        return new Promise(function (resolve)
        {
            pdfMake.createPdf(docDefinition).getBlob(function (blob)
            {
                saveAs(blob, dosyaAdi);
                resolve();
            });
        });
    }

    function digerEgitimSinavIcerigiOlustur(calisanjson, tarih, sinavBasligi, sinavimzaalani, sorular, sinavsecim, uzmanad)
    {
        const secenekHarfleri = ["a", "b", "c"];
        const kenarlikRengi = "#333333";
        const ortakHucre = { margin: [5, 6, 5, 6], fontSize: 10 };
        const tabloSutunlari = sinavimzaalani ? ["12%", "46%", "12%", "30%"] : ["12%", "88%"];
        const calisanlar = Array.isArray(calisanjson) ? calisanjson : [calisanjson];
        const icerik = [];

        const secilenSorular = (Array.isArray(sorular) ? sorular : []).filter(function (soru)
        {
            return sinavsecim.includes(Number(soru.id));
        });

        function baslikSatiriOlustur()
        {
            return [
                { text: sinavBasligi + " ÖLÇME ve DEĞERLENDİRME SINAVI - " + tarih, colSpan: sinavimzaalani ? 4 : 2, alignment: "center", bold: true, fontSize: 11, margin: [0, 0, 0, 0] },
                {}
            ].concat(sinavimzaalani ? [{}, {}] : []);
        }

        function imzaHucreleriOlustur(calisan)
        {
            return sinavimzaalani ?
                [
                    { text: "Ad Soyad", bold: true, margin: ortakHucre.margin, fontSize: ortakHucre.fontSize },
                    { text: calisan.a || "", margin: ortakHucre.margin, fontSize: ortakHucre.fontSize },
                    { text: "İmza", bold: true, alignment: "center", margin: ortakHucre.margin, fontSize: ortakHucre.fontSize },
                    { text: "", margin: ortakHucre.margin, fontSize: ortakHucre.fontSize }
                ]
                :
                [
                    { text: "Ad Soyad", bold: true, margin: ortakHucre.margin, fontSize: ortakHucre.fontSize },
                    { text: calisan.a || "", margin: ortakHucre.margin, fontSize: ortakHucre.fontSize }
                ];
        }

        function baslikTablosuOlustur(calisan, calisanIndex)
        {
            return {
                pageBreak: calisanIndex > 0 ? "before" : undefined,
                table:
                {
                    widths: tabloSutunlari,
                    body:
                    [
                        baslikSatiriOlustur(),
                        imzaHucreleriOlustur(calisan)
                    ]
                },
                layout:
                {
                    hLineColor: function () { return kenarlikRengi; },
                    vLineColor: function () { return kenarlikRengi; },
                    hLineWidth: function () { return 0.7; },
                    vLineWidth: function () { return 0.7; }
                },
                margin: [0, 0, 0, 8]
            };
        }

        function sorulariKaristir(soruListesi)
        {
            const karisikSorular = soruListesi.slice();
            for (let i = karisikSorular.length - 1; i > 0; i -= 1)
            {
                const rastgeleIndex = Math.floor(Math.random() * (i + 1));
                const gecici = karisikSorular[i];
                karisikSorular[i] = karisikSorular[rastgeleIndex];
                karisikSorular[rastgeleIndex] = gecici;
            }
            return karisikSorular;
        }

        function cevapSirasiniAyarla(secenekler, soruIndex)
        {
            const siraliSecenekler = (Array.isArray(secenekler) ? secenekler : []).slice();
            const dogruCevapIndex = siraliSecenekler.findIndex(function (secenek)
            {
                return secenek && secenek.y === true;
            });

            if (dogruCevapIndex === -1)
            {
                return siraliSecenekler;
            }

            const hedefIndex = soruIndex % secenekHarfleri.length;
            const dogruCevap = siraliSecenekler.splice(dogruCevapIndex, 1)[0];
            siraliSecenekler.splice(hedefIndex, 0, dogruCevap);
            return siraliSecenekler;
        }

        function bosKutu()
        {
            return { canvas: [{ type: "rect", x: 0, y: 0, w: 8, h: 8, lineWidth: 0.7, lineColor: "black" }], margin: [0, 1, 0, 0] };
        }

        function puanTablosuOlustur()
        {
            return {
                margin: [0, 6, 0, 0],
                table:
                {
                    widths: [10, 50, 10, 50, 10, 50, 10, 50, 10, 50, 10, 50, "*"],
                    body:
                    [
                        [
                            bosKutu(),
                            { text: "10 Puan", fontSize: 10 },
                            bosKutu(),
                            { text: "30 Puan", fontSize: 10 },
                            bosKutu(),
                            { text: "50 Puan", fontSize: 10 },
                            bosKutu(),
                            { text: "70 Puan", fontSize: 10 },
                            bosKutu(),
                            { text: "90 Puan", fontSize: 10 },
                            bosKutu(),
                            { text: "Başarılı", fontSize: 10 },
                            { text: uzmanad || "", bold: true, fontSize: 10, alignment: "center" }
                        ],
                        [
                            bosKutu(),
                            { text: "20 Puan", fontSize: 10 },
                            bosKutu(),
                            { text: "40 Puan", fontSize: 10 },
                            bosKutu(),
                            { text: "60 Puan", fontSize: 10 },
                            bosKutu(),
                            { text: "80 Puan", fontSize: 10 },
                            bosKutu(),
                            { text: "100 Puan", fontSize: 10 },
                            bosKutu(),
                            { text: "Başarısız", fontSize: 10 },
                            { text: "" }
                        ]
                    ]
                },
                layout:
                {
                    hLineWidth: function () { return 0; },
                    vLineWidth: function () { return 0; },
                    paddingLeft: function () { return 0; },
                    paddingRight: function () { return 0; },
                    paddingTop: function () { return 0; },
                    paddingBottom: function () { return 8; }
                }
            };
        }

        calisanlar.forEach(function (calisan, calisanIndex)
        {
            const karisikSorular = sorulariKaristir(secilenSorular);
            icerik.push(baslikTablosuOlustur(calisan || {}, calisanIndex));

            karisikSorular.forEach(function (soru, index)
            {
                const soruSatirlari = [{ text: (index + 1) + ". " + (soru.s || ""), bold: true, margin: [0, 5, 0, 5] }];
                const secenekler = cevapSirasiniAyarla(soru.c || [], index);

                secenekler.forEach(function (secenek, secenekIndex)
                {
                    soruSatirlari.push(
                    {
                        text: secenekHarfleri[secenekIndex] + ") " + (secenek.x || ""),
                        margin: [0, 0, 0, 3]
                    });
                });

                icerik.push({ stack: soruSatirlari, unbreakable: true, margin: [0, 0, 0, 0] });
            });

            icerik.push(
            {
                text: "Her soru 10 puan değerindedir. Sınavda başarılı sayılmak için en az 60 puan alınması gerekmektedir.",
                bold: true,
                margin: [0, 0, 0, 6]
            });
            icerik.push(puanTablosuOlustur());
        });

        return icerik;
    }
})(window, jQuery);
