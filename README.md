# ☁️ CloudQuest

Cloud Engineering'i **oynayarak** öğren. Bir IT specialist'i, full-time
**Cloud Engineer** pozisyonuna hazırlayan; canlı terminal, story questler ve
level/XP mekanikleri olan bir RPG. Tam yeni başlayanlar için tasarlandı.

## İki sürüm

| Sürüm | Nerede çalışır | Nasıl başlatılır |
|-------|----------------|------------------|
| 🌐 **Web app** | Tarayıcı (Supabase hesabı gerekir) | statik sunucu + deploy edilmiş `game` fonksiyonu |
| 🖥️ **Terminal (PowerShell)** | Windows PowerShell 5.1+ | `powershell -ExecutionPolicy Bypass -File .\cloudquest.ps1` |

> İkisi de aynı içeriği paylaşır: aynı bölümler, aynı questler, aynı mentör (Nova).
> Web'de ilerleme **sunucuda** (Postgres) tutulur; terminal sürümü yereldir (`data/save.json`).

## Web app'i açmak

> ⚠️ **Değişti (Katman 1):** `web/index.html`'e çift tıklayarak `file://`
> üzerinden oynamak artık mümkün değil. Komut doğrulama ve ödüller sunucuya
> taşındı — oyun bir Supabase projesi ve deploy edilmiş `game` Edge
> Function'ı ister. Nedeni ve kurulumu:
> [`docs/LAYER-1-SERVER-AUTHORITY.md`](docs/LAYER-1-SERVER-AUTHORITY.md)

```bash
npm install && npm run build          # müfredatı derle (public + secret bundle)
npx supabase functions deploy game    # hakemi yayına al
```

Ardından `web/` klasörünü herhangi bir statik sunucuyla (veya Vercel ile) ver.

### Görsel & hesap özellikleri
- **Hikâye modu ("Meridian" startup dramı)** — gerçekçi bir startup'a ilk gün girer,
  çaylaklıktan Platform Lead'e yükselirsin. Mentör Nova + CEO Deniz eşliğinde her modül
  bir **PERDE**: prolog + perde açılış/kapanış sinematikleri olay örgüsünü ilerletir
  (launch, yatırım, ölçek krizi, gece 3 on-call'ları, güvenlik/maliyet denetimi).
  Öğrenme merkezde kalır; beat'ler bir kez gösterilir (`player.story`'de izlenir).
- **Cyberpunk loading ekranı** — glitch efektli boot sekansı.
- **Animasyonlu ana sayfa (hub)** — login sonrası açılır (anime.js ile animasyonlu giriş).
  Buradan **Story kampanyasını** ya da bir **Lab**'ı seçip terminale girersin; terminalden
  `home` komutu veya HUD'daki "ana sayfa" linkiyle geri dönersin. Story kartında ilerleme
  halkası (%) ve bölüm rozetleri gösterilir. *(anime.js `web/js/lib/anime.min.js` olarak
  yerel vendor'landı — çevrimdışı çalışır.)*
- **Gerçek kullanıcı hesabı (Supabase)** — e-posta + şifre ile kayıt/giriş, e-posta
  doğrulama ve şifre sıfırlama. Kimlik doğrulama **sunucuda** yapılır; ilerleme
  Postgres'te saklanır ve **cihazlar arasında senkronlanır**. Güvenlik **Row Level
  Security** ile: her kullanıcı yalnızca kendi satırına erişir. Oynamak için giriş
  gerekir. ⚙️ Kurulum (~5 dk, ücretsiz, kart yok): [`docs/SETUP-SUPABASE.md`](docs/SETUP-SUPABASE.md)
- **6 tech-anime avatar** — Netrunner, Ronin, Techno, Oracle, Pilot, Ghost (kod ile
  çizilmiş SVG). Kayıtta ve profil sayfasından değiştirilebilir.
- **Profil sayfası** — avatar, rank, level/XP, credits, rozetler, **tamamlanan
  eğitimler** (bölüm bazında ilerleme) ve "Cloud Engineer hazırlığı %".

## Mimari (Single Source of Truth)

Müfredat **tek yerde** yaşar: [`data/curriculum.json`](data/curriculum.json) (chapters,
tracks, quests, modules, shop). Her iki runtime de buradan beslenir:

- **PowerShell** ([`cloudquest.ps1`](cloudquest.ps1)) JSON'u doğrudan okur.
- **Web** için `npm run build` çalıştırılır ve **iki** çıktı üretilir:
  - `web/js/content.generated.js` — **public** bundle (tarayıcıya gider)
  - `supabase/functions/_shared/curriculum.json` — **secret** bundle (sunucuda kalır)

  ```bash
  npm run build
  ```

  Public bundle'da **cevap anahtarı yoktur**: her objective'in `expect` spec'i ve
  `hint` (doğru komut) metni yalnızca sunucu tarafındadır. Bu ayrım CI'da da
  denetlenir — cevap sızarsa build kırmızı olur.

**Komut doğrulama regex değil, yapısal parser** ile yapılır: girdi pipe/`&&`/`;` ile
segmentlere ayrılır, quote-farkında tokenize edilir, baştaki `sudo` atılır; sonra
her objective'in bildirimsel `expect` spec'i (`{cmd, need, anyOf}`) ile eşleşir.
Böylece flag sırası, fazladan flag ve pipe kullanıcıyı yanlış cevaba düşürmez.

Parser'ın **tek kaynağı** [`shared/parser.ts`](shared/parser.ts) ve **sunucuda**
çalışır ([`supabase/functions/game`](supabase/functions/game/index.ts)).
`web/js/parser.js` artık yalnızca sahne panelini çizmek için tokenize eder —
doğru/yanlış kararı vermez. Terminal sürümü kendi `CQ-Match` fonksiyonlarını
kullanmaya devam eder (yerel, çevrimdışı).

**Ekonomi kuralları** ([`shared/progression.ts`](shared/progression.ts)) de sunucuda:
XP, level, rank, credits ve rozetleri yalnızca Edge Function yazabilir.

**Advanced Labs** (hikâyeden bağımsız yan modüller): ana sayfadaki grid'de "yakında" olanlar
placeholder; `status:"active"` + `quests[]` dolu olan **oynanabilir**. Aktif olanlar:
**🛰️ Network Ops** (`netq1-4`) · **📜 Scripting** (`scrq1-4`) · **🐳 Docker Deep Dive** (`dkq1-4`) ·
**🌍 Terraform Pro** (`tfq1-4`). Hâlâ "yakında": ⚙️ Ansible · ☸️ Kubernetes.
Lab dokümanları: [Network Ops](docs/CURRICULUM-LAB-NETWORK-OPS.md) · [Scripting](docs/CURRICULUM-LAB-SCRIPTING.md).
Lab'lar XP/rozet verir ama "hazırlık %" (story) sayacını etkilemez.

**Hesap katmanı:** [`web/js/auth.js`](web/js/auth.js) Supabase Auth + `profiles` tablosunu
sarar; [`web/js/api.js`](web/js/api.js) ise sunucudaki hakemle konuşan tek kapıdır.
İstemci artık **ilerleme yazmaz**: `profiles` üzerinde kolon bazlı GRANT var, yalnızca
`name`, `avatar` ve `story` (kozmetik) yazılabilir. Level, XP, credits, rozet ve
tamamlanan questleri sadece `game` Edge Function yazabilir.
Şema + RLS + GRANT: [`supabase/schema.sql`](supabase/schema.sql).
`web/js/config.js` içindeki **anon key gizli değildir** (tasarım gereği); koruma RLS +
GRANT'tedir. `service_role` anahtarı repoda **yoktur ve olmamalıdır**.

Ayrıntı: [`docs/LAYER-1-SERVER-AUTHORITY.md`](docs/LAYER-1-SERVER-AUTHORITY.md)

Dosya yapısı: `data/curriculum.json` (SSOT) · `shared/{parser,progression,curriculum.schema,curriculum.validate}.ts` ·
`scripts/build.ts` · `cloudquest.ps1` (terminal) · `supabase/schema.sql` ·
`supabase/functions/game/index.ts` (hakem) · `web/index.html` · `web/css/style.css` ·
`web/js/{config,content.generated,api,parser,avatars,auth,game}.js` ·
`web/js/lib/{anime.min,sweetalert2.all.min,supabase.min}.js` (vendor, çevrimdışı).

Dialog/onay/toast'lar **SweetAlert2** ile (reset & çıkış onayı, "yakında" bildirimleri) —
cyberpunk temalı, yerel vendor'lı (CDN'siz).

## Nasıl oynanır

1. Kayıt ol (ad + e-posta + şifre + avatar) ya da giriş yap.
2. Ana sayfada **Story** ya da bir **Lab** seç → terminale gir.
3. `quests` → görev listesini gör.
3. `quest c1q1` → ilk göreve başla. Mentör Nova sana ne yazacağını öğretir.
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
