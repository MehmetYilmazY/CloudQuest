---
type: command
command: chmod
chapter: 1
title: "chmod komutu: dosya izinleri nasıl değiştirilir?"
description: "chmod +x ne işe yarar, 755 ile 644 arasındaki fark ne? Linux dosya izinlerini örneklerle, en sık yapılan hatalarla birlikte anlatan Türkçe rehber."
targetQuery: "chmod komutu"
alsoRanksFor:
  - "chmod +x ne işe yarar"
  - "linux dosya izinleri"
  - "chmod 755 nedir"
relatedCommands:
  - ls
  - chown
practiceQuest: c1q2
updated: 2026-08-19
---

`chmod` (change mode), bir dosyanın kimler tarafından okunabileceğini,
yazılabileceğini ve çalıştırılabileceğini belirler. Linux'ta izinlerle ilgili
hemen her sorunun çözümü bu komuttan geçer.

## En sık kullanılan hâli

```
chmod +x deploy.sh
```

"Bu dosyaya çalıştırma izni ekle" demek. Yeni yazdığın bir script'i
çalıştırmaya kalkıp şu hatayı alıyorsan ihtiyacın olan şey budur:

```
bash: ./deploy.sh: Permission denied
```

Dosya oradadır, içeriği doğrudur — sadece işletim sistemi onu "çalıştırılabilir"
saymamaktadır. `chmod +x` bunu düzeltir.

## İzinler nasıl okunur

`ls -l` çıktısının başındaki dizi, dosyanın izin haritasıdır:

```
-rwxr-xr--  1 engineer  staff  482 Aug 19 14:02 deploy.sh
 │└┬┘└┬┘└┬┘
 │ │  │  └── diğerleri : sadece okuma
 │ │  └───── grup      : okuma + çalıştırma
 │ └──────── sahip     : okuma + yazma + çalıştırma
 └────────── dosya tipi (- dosya, d dizin, l sembolik link)
```

Üç harf tekrar eder: `r` okuma (read), `w` yazma (write), `x` çalıştırma
(execute). Yerinde `-` varsa o izin yok demektir.

## İki yazım biçimi

**Sembolik** — ne eklediğini/çıkardığını söylersin. Okunması kolay:

```
chmod +x   script.sh      # herkese çalıştırma izni ekle
chmod u+x  script.sh      # sadece sahibine ekle
chmod -w   config.yml     # yazma iznini kaldır
chmod go-r secret.env     # grup ve diğerlerinin okumasını kes
```

Buradaki `u` sahip (user), `g` grup, `o` diğerleri (others), `a` hepsi.

**Sayısal** — izinleri tek seferde ayarlarsın. Her hane bir grup içindir ve
`r=4`, `w=2`, `x=1` toplanır:

```
chmod 755 deploy.sh       # sahip rwx(7), grup r-x(5), diğerleri r-x(5)
chmod 644 config.yml      # sahip rw-(6), grup r--(4), diğerleri r--(4)
chmod 600 id_rsa          # sahip rw-(6), başka kimse hiçbir şey
```

Pratikte üç sayıyı bilmen yeterli:

| Değer | Ne için |
|---|---|
| `755` | Script'ler ve dizinler — herkes çalıştırabilir, kimse değiştiremez |
| `644` | Normal dosyalar — herkes okur, sadece sahip yazar |
| `600` | Sırlar (SSH anahtarı, .env) — sadece sahip erişir |

## En sık yapılan üç hata

**1. Her şeye 777 vermek.** "İzin hatası aldım, 777 yapayım geçsin" refleksi
sorunu gizler, çözmez — ve sunucudaki herkese o dosyayı değiştirme yetkisi
verir. Güvenlik denetimlerinde ilk bakılan yerlerden biridir. Doğru soru
"kim erişmeli?" olmalı.

**2. SSH anahtarına geniş izin.** OpenSSH, özel anahtarın başkaları tarafından
okunabildiğini görürse bağlantıyı reddeder:

```
Permissions 0644 for 'id_rsa' are too open.
```

Çözüm `chmod 600 ~/.ssh/id_rsa`. Bu bir katılık değil, koruma.

**3. Dizinde `x`'in ne demek olduğunu bilmemek.** Dizinlerde `x` "çalıştır"
değil, **"içine gir"** anlamına gelir. `x` izni olmayan bir dizinin içindeki
dosyaları adlarıyla bilsen bile açamazsın.

## Yinelemeli değiştirme

`-R` bayrağı alt klasörlere de uygular:

```
chmod -R 755 /var/www/html
```

Dikkatli kullan: bir dizin ağacındaki dosya ve klasörlere aynı izni vermek
genelde istediğin şey değildir. Dizinlere `755`, dosyalara `644` gerekir —
ikisini ayırmak için `find` ile birlikte kullanılır.

## chmod mu, chown mu?

Karıştırılır ama farkları nettir:

- `chmod` → izinleri değiştirir (**ne** yapılabilir)
- `chown` → sahibi değiştirir (**kim** yapabilir)

Dosya yanlış kullanıcıya aitse `chmod` seni kurtarmaz; `chown` gerekir.
