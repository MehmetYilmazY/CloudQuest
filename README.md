# ☁️ CloudQuest

Cloud Engineering'i **oynayarak** öğren. Bir IT specialist'i, full-time
**Cloud Engineer** pozisyonuna hazırlayan; canlı terminal, story questler ve
level/XP mekanikleri olan bir RPG. Tam yeni başlayanlar için tasarlandı.

## İki sürüm

| Sürüm | Nerede çalışır | Nasıl başlatılır |
|-------|----------------|------------------|
| 🌐 **Web app** | Tarayıcı (kurulum yok) | `web/index.html` dosyasına çift tıkla |
| 🖥️ **Terminal (PowerShell)** | Windows PowerShell 5.1+ | `powershell -ExecutionPolicy Bypass -File .\cloudquest.ps1` |

> İkisi de aynı içeriği paylaşır: aynı bölümler, aynı questler, aynı mentör (Aria).
> İlerlemen web'de tarayıcıya (localStorage), terminalde `data/save.json`'a kaydedilir.

## Web app'i açmak

`web/index.html` dosyasına çift tıklaman yeterli. (Bazı tarayıcılarda `file://`
üzerinden yerel JS/crypto kısıtlıysa, klasörü basit bir statik sunucuyla ver ve
`http://localhost:...` üzerinden aç — hesap şifre hash'i için önerilir.)

### Görsel & hesap özellikleri
- **Hikâye modu ("Meridian" startup dramı)** — gerçekçi bir startup'a ilk gün girer,
  çaylaklıktan Platform Lead'e yükselirsin. Mentör Aria + CTO Deniz eşliğinde her modül
  bir **PERDE**: prolog + perde açılış/kapanış sinematikleri olay örgüsünü ilerletir
  (launch, yatırım, ölçek krizi, gece 3 on-call'ları, güvenlik/maliyet denetimi).
  Öğrenme merkezde kalır; beat'ler bir kez gösterilir (`player.story`'de izlenir).
- **Cyberpunk loading ekranı** — glitch efektli boot sekansı.
- **Animasyonlu ana sayfa (hub)** — login sonrası açılır (anime.js ile animasyonlu giriş).
  Buradan **Story kampanyasını** ya da bir **Lab**'ı seçip terminale girersin; terminalden
  `home` komutu veya HUD'daki "ana sayfa" linkiyle geri dönersin. Story kartında ilerleme
  halkası (%) ve bölüm rozetleri gösterilir. *(anime.js `web/js/lib/anime.min.js` olarak
  yerel vendor'landı — çevrimdışı çalışır.)*
- **Profil / "hesap" (auth SİMÜLASYONU)** — e-posta + şifre ile kayıt/giriş, her
  profilin kendi ilerlemesi. ⚠️ **Bu gerçek güvenlik değildir**: tüm kod tarayıcıda
  açıkta çalışır, veri `localStorage`'da durur. SHA-256 + salt yalnızca düz-metin
  şifreyi saklamamak içindir (hijyen), koruma değil. Gerçek auth = sunucu + DB;
  API yüzeyi ileride `fetch` tabanlı bir backend'e taşınacak şekilde soyutlandı.
- **6 tech-anime avatar** — Netrunner, Ronin, Techno, Oracle, Pilot, Ghost (kod ile
  çizilmiş SVG). Kayıtta ve profil sayfasından değiştirilebilir.
- **Profil sayfası** — avatar, rank, level/XP, credits, rozetler, **tamamlanan
  eğitimler** (bölüm bazında ilerleme) ve "Cloud Engineer hazırlığı %".

## Mimari (Single Source of Truth)

Müfredat **tek yerde** yaşar: [`data/curriculum.json`](data/curriculum.json) (chapters,
tracks, quests, modules, shop). Her iki runtime de buradan beslenir:

- **PowerShell** ([`cloudquest.ps1`](cloudquest.ps1)) JSON'u doğrudan okur.
- **Web** için `build.ps1` çalıştırılır → `web/js/content.generated.js` üretilir
  (çift-tıkla `file://` açılırlık korunur; içerik değişince yeniden build edilir):
  ```
  powershell -ExecutionPolicy Bypass -File .\build.ps1
  ```

**Komut doğrulama regex değil, yapısal parser** ile yapılır: girdi pipe/`&&`/`;` ile
segmentlere ayrılır, quote-farkında tokenize edilir, baştaki `sudo` atılır; sonra
her objective'in bildirimsel `expect` spec'i (`{cmd, need, anyOf}`) ile eşleşir.
Böylece flag sırası, fazladan flag ve pipe kullanıcıyı yanlış cevaba düşürmez.
Aynı mantık web'de [`web/js/parser.js`](web/js/parser.js), terminalde `cloudquest.ps1`
içindeki `CQ-Match` fonksiyonlarında.

**Advanced Labs** (hikâyeden bağımsız yan modüller): ana sayfadaki grid'de "yakında" olanlar
placeholder; `status:"active"` + `quests[]` dolu olan **oynanabilir**. Aktif olanlar:
**🛰️ Network Ops** (`netq1-4`) · **📜 Scripting** (`scrq1-4`) · **🐳 Docker Deep Dive** (`dkq1-4`) ·
**🌍 Terraform Pro** (`tfq1-4`). Hâlâ "yakında": ⚙️ Ansible · ☸️ Kubernetes.
Lab dokümanları: [Network Ops](docs/CURRICULUM-LAB-NETWORK-OPS.md) · [Scripting](docs/CURRICULUM-LAB-SCRIPTING.md).
Lab'lar XP/rozet verir ama "hazırlık %" (story) sayacını etkilemez.

> ⚠️ **Auth notu:** Web'deki kayıt/giriş bir **auth simülasyonudur**, gerçek güvenlik
> değildir (tüm kod tarayıcıda açıkta; veri `localStorage`'da). Gerçek auth = sunucu + DB.

Dosya yapısı: `data/curriculum.json` (SSOT) · `build.ps1` · `cloudquest.ps1` (terminal) ·
`web/index.html` · `web/css/style.css` · `web/js/{content.generated,parser,avatars,auth,game}.js` ·
`web/js/lib/{anime.min,sweetalert2.all.min}.js` (vendor, çevrimdışı).

Dialog/onay/toast'lar **SweetAlert2** ile (reset & çıkış onayı, "yakında" bildirimleri) —
cyberpunk temalı, yerel vendor'lı (CDN'siz).

## Nasıl oynanır

1. Kayıt ol (ad + e-posta + şifre + avatar) ya da giriş yap.
2. Ana sayfada **Story** ya da bir **Lab** seç → terminale gir.
3. `quests` → görev listesini gör.
3. `quest c1q1` → ilk göreve başla. Mentör Aria sana ne yazacağını öğretir.
4. Terminale gerçek komutları yaz (`pwd`, `ls`, `chmod +x ...`, `aws ...`, `terraform ...`, `docker ...`, `kubectl ...`).
5. Takılırsan `hint` yaz. **3 yanlış denemeden sonra** doğru komut otomatik gösterilir. Quest içinde <kbd>Tab</kbd> = doğru komutu doldurur.
6. XP kazan → level atla → rank yüksel (Intern → … → Principal Cloud Wizard). `credits` ile `shop`'tan ödül al.

### Komutlar
`quests` · `quest <id>` · `map` · `status` · `shop` · `buy <n>` · `roadmap` · `clear` · `reset` · `help`

## Bölümler (8) — `docs/ROADMAP.md` ile birebir

1. Terminal & Linux · 2. Networking & Git · 3. AWS Core · 4. Infrastructure as Code
5. Containers · 6. CI/CD · 7. Observability · 8. Security & Cost

## Öğrenme döngüsü

**Öğren** (teori) → **Oyna** (bu oyun, kas hafızası) → **Uygula** (gerçek AWS Free Tier).
%20 teori, %80 elin klavyede. Detaylı 6 aylık program: [`docs/ROADMAP.md`](docs/ROADMAP.md).
