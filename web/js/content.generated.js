/* ======================================================================
   AUTO-GENERATED from data/curriculum.json — DO NOT EDIT.
   Uret: npm run build

   DIKKAT: Bu dosyada CEVAP ANAHTARI YOKTUR. Her objective'in 'expect'
   spec'i ve 'hint' (dogru komut) metni SUNUCUDA tutulur; dogrulama
   supabase/functions/verify icinde yapilir. Buraya elle cevap eklemek
   Katman 1'in tum guvenlik modelini gecersiz kilar.
   ====================================================================== */
const CQ_DATA = {
 "_meta": {
  "note": "AUTO-GENERATED. Cevap anahtari (expect/hint/success) BU DOSYADA YOKTUR; dogrulama supabase/functions/verify icinde yapilir."
 },
 "chapters": [
  {
   "n": 1,
   "title": "Terminal & Linux",
   "desc": "Bulutun dili: kabuk, dosyalar, metin, izinler, surecler, paket/servis."
  },
  {
   "n": 2,
   "title": "Networking & Git",
   "desc": "Paketler nasil akar, sunucuya nasil baglanilir, kod nasil versiyonlanir."
  },
  {
   "n": 3,
   "title": "AWS Core",
   "desc": "IAM, EC2, VPC, S3 - bulutun cekirdegi."
  },
  {
   "n": 4,
   "title": "Infrastructure as Code",
   "desc": "Terraform ile altyapiyi kodla."
  },
  {
   "n": 5,
   "title": "Containers",
   "desc": "Docker ile paketle ve dagit."
  },
  {
   "n": 6,
   "title": "CI/CD",
   "desc": "Otomatik build -> test -> deploy pipeline'i."
  },
  {
   "n": 7,
   "title": "Observability",
   "desc": "Log, metrik, dashboard, alarm."
  },
  {
   "n": 8,
   "title": "Security & Cost",
   "desc": "Least privilege, maliyet kontrolu, sertifika."
  }
 ],
 "tracks": [
  {
   "id": "fundamentals",
   "icon": "🧱",
   "title": "Fundamentals",
   "chapters": [
    1,
    2
   ]
  },
  {
   "id": "cloud-core",
   "icon": "☁️",
   "title": "Cloud Core",
   "chapters": [
    3
   ]
  },
  {
   "id": "iac",
   "icon": "🌍",
   "title": "IaC",
   "chapters": [
    4
   ]
  },
  {
   "id": "containers",
   "icon": "🐳",
   "title": "Containers",
   "chapters": [
    5
   ]
  },
  {
   "id": "automation",
   "icon": "🔁",
   "title": "Automation",
   "chapters": [
    6,
    7
   ]
  },
  {
   "id": "mastery",
   "icon": "🎓",
   "title": "Mastery",
   "chapters": [
    8
   ]
  }
 ],
 "story": {
  "startup": "Meridian",
  "prologue": [
   "── MERIDIAN ──  Pazartesi, 09:14.  İlk günün.",
   "[Deniz — CEO]: Hoş geldin. Kötü haber: tek altyapı mühendisimiz Null cuma günü istifa etti.",
   "[Deniz]: İyi haber: yerini sen alıyorsun. 6 hafta sonra yatırımcı demosu var ve sistem şu an kâğıttan bir kule.",
   "[Nova — Senior Engineer]: Selam, ben Nova. Panik yok — seni yalnız bırakmayacağım.",
   "[Nova]: Bu bir maraton. Terminalden başlayıp Meridian'ı ayakta duracak bir platforma çevireceğiz.",
   "[Nova]: Hazırsan ilk yangını birlikte söndürelim. 'quests' yazıp göreve bak."
  ],
  "acts": {
   "fundamentals": {
    "title": "PERDE I — Vaftiz Ateşi",
    "intro": [
     "[Nova]: Prod tek bir sunucuda dönüyor ve şu an deploy bozuk.",
     "[Nova]: Önce terminalde ayaklarının üstünde durmayı öğreneceksin — her komutu birlikte gireceğiz.",
     "[Nova]: Günün sonunda buranın dilini konuşuyor olacaksın."
    ],
    "outro": [
     "[Nova]: İlk haftan bitti ve hâlâ ayaktasın. Terminal artık düşmanın değil, aletin.",
     "[Deniz]: Fena değilmiş çaylak. Ama asıl iş şimdi: bu tek sunucu bizi öldürecek. Buluta taşınıyoruz."
    ]
   },
   "cloud-core": {
    "title": "PERDE II — Buluta Çıkış",
    "intro": [
     "[Deniz]: Kiralık tek sunucuyla yatırımcı demosuna gidemeyiz. AWS'e geçiyoruz.",
     "[Nova]: Sıfırdan sağlam bir bulut temeli kuracağız: kimlik, ağ, sunucu, depo, veritabanı. Sırayla."
    ],
    "outro": [
     "[Nova]: Meridian artık gerçek bulutta. Demo sunucusu çökmeyecek.",
     "[Deniz]: Güzel. Ama dün gece bir ayarı elle değiştirdim, 20 dakika down olduk. Bu bir daha olmayacak."
    ]
   },
   "iac": {
    "title": "PERDE III — Bir Daha Elle Yok",
    "intro": [
     "[Nova]: Dünkü kesinti elle yapılan bir değişiklikten çıktı. Çözüm: altyapıyı koda dökmek.",
     "[Nova]: Terraform'la öyle kuralım ki, her şey silinse tek komutla geri gelsin."
    ],
    "outro": [
     "[Nova]: Artık altyapımız kod. Kimse yanlışlıkla kalıcı bir şey bozamaz.",
     "[Deniz]: Demo mükemmeldi — yatırım geldi! Ama kullanıcı sayısı patladı, sistem yükü zor kaldırıyor."
    ]
   },
   "containers": {
    "title": "PERDE IV — Ölçek Sınavı",
    "intro": [
     "[Deniz]: Bir gecede 10 kat kullanıcı. Sunucular kıpkırmızı.",
     "[Nova]: Uygulamayı container'la, Kubernetes'le ölçekle. Bir pod ölse bile kimse fark etmesin."
    ],
    "outro": [
     "[Nova]: Yük dağıldı, sistem kendini iyileştiriyor. İlk kez gece telefonun çalmadı.",
     "[Deniz]: Hızlı büyüyoruz ama her deploy'da kalbimiz ağzımıza geliyor. Gece 3 alarmlarından da bıktım."
    ]
   },
   "automation": {
    "title": "PERDE V — Uyuyabilmek",
    "intro": [
     "[Nova]: Her release'i elle yapmayı bırakıyoruz. Pipeline: her push otomatik build, test, deploy.",
     "[Nova]: Bir de sistemin içini göreceğiz — log, metrik, alarm. Sorunu kullanıcıdan önce biz görelim."
    ],
    "outro": [
     "[Nova]: Kod kendini test edip dağıtıyor, sorunları önceden yakalıyoruz. Gece 3 alarmları neredeyse bitti.",
     "[Deniz]: Denetim geliyor — güvenlik ve maliyet incelemesi. Bir de şu AWS faturasını gördün mü?"
    ]
   },
   "mastery": {
    "title": "PERDE VI — Mimar",
    "intro": [
     "[Deniz]: İki sorun: güvenlik açığı riski ve kontrolden çıkan fatura. İkisini de sen kapatacaksın.",
     "[Nova]: Son perde. Yetkileri kıs, sırları koru, maliyeti dizginle."
    ],
    "outro": [
     "[Nova]: Başardın. Sistem güvenli, maliyet kontrol altında, ekip sana güveniyor.",
     "[Deniz]: Meridian'ın Platform Lead'i sensin artık. Altı hafta önce terminalden korkuyordun; bugün belkemiğimizsin.",
     "[Deniz]: Null'u yalnız bıraktık, tükendi. Seni bırakmadık — hatadan öğrendik. Sen de kimseyi yalnız bırakma.",
     "[Nova]: Git, artık kendi çaylaklarını yetiştir. 🚀"
    ]
   }
  },
  "beats": {
   "c1q3": {
    "when": "complete",
    "title": "◇ İZ",
    "lines": [
     "[Nova]: Şu 'permission denied' — bunu Null eklemiş. Senden önceki tek mühendis.",
     "[Nova]: Aylarca burayı yalnız taşıdı, böyle acele yamalar bıraktı. Her biri birer saatli bomba."
    ]
   },
   "c3q1": {
    "when": "complete",
    "title": "◇ İZ",
    "lines": [
     "[Nova]: IAM'i kurcalarken gördüm: Null 'app-bot' diye full yetkili bir kimlik bırakmış.",
     "[Nova]: Şimdi sırası değil ama o botu temizleyeceğiz. Not aldım."
    ]
   },
   "c5q3": {
    "when": "intro",
    "title": "◇ 03:14",
    "lines": [
     "[Deniz]: Dürüst olayım — bu gece yarısı çökmeleri Null gittiğinden beri sürüyor.",
     "[Deniz]: Onun yamalarını yamıyoruz. Bu döngüyü kıracak biri lazım. Umarım sensindir."
    ]
   },
   "c7q1": {
    "when": "complete",
    "title": "◇ KÖK NEDEN",
    "lines": [
     "[Nova]: İzler tek bir yere çıkıyor: Null'un elle kurduğu bir cron her gece DB'yi kilitliyormuş.",
     "[Nova]: Rastgele değilmiş. Tek bir kırılgan kestirme aylardır uykumuzu kaçırıyormuş — artık görünür."
    ]
   },
   "c8q1": {
    "when": "complete",
    "title": "◇ SON KESTİRME",
    "lines": [
     "[Nova]: O söktüğün full-yetkili bot — Null'un son kestirmesiydi.",
     "[Nova]: Artık onun bıraktığı tek bir saatli bomba bile kalmadı. Sistem ilk kez gerçekten senin."
    ]
   }
  }
 },
 "quests": [
  {
   "id": "c1q1",
   "chapter": 1,
   "title": "Cold Boot",
   "requires": [],
   "xp": 60,
   "credits": 15,
   "badge": "🐧 First Login",
   "brief": [
    "[Nova]: Tamam, ilk görev. Bu prod sunucusunda yön bulmayı öğrenelim —",
    "panik yok, sana ne yazacağını tek tek söyleyeceğim."
   ],
   "objectives": [
    {
     "task": "Nerede olduğunu öğren (çalışma dizinini yazdır).",
     "teach": "Her şey 'neredeyim?' ile başlar. pwd = print working directory.",
     "verb": "pwd"
    },
    {
     "task": "Bu dizindeki dosyaları listele.",
     "teach": "ls komutu dizindeki dosya/klasörleri gösterir (Windows'ta dir).",
     "verb": "ls"
    },
    {
     "task": "README.md dosyasını oku.",
     "teach": "cat <dosya> = dosya içeriğini ekrana basar. Bir sunucuda ilk iş: notları oku.",
     "verb": "cat"
    },
    {
     "task": "logs klasörüne gir.",
     "teach": "cd = change directory. Klasörler arasında böyle gezersin.",
     "verb": "cd"
    }
   ],
   "complete": [
    "[Nova]: Terminalde yön bulmayı öğrendin. Şimdi şu dağınık dosyaları toparlayalım."
   ]
  },
  {
   "id": "c1q2",
   "chapter": 1,
   "title": "Dosya Matrisi",
   "requires": [
    "c1q1"
   ],
   "xp": 70,
   "credits": 15,
   "badge": "🗂️ File Wrangler",
   "brief": [
    "[Nova]: Deploy için düzenli bir klasör lazım. Dosya sistemini yönetmeyi öğrenelim:",
    "oluştur, kopyala, taşı, sil. Bunlar bir engineer'ın günlük ekmeği."
   ],
   "objectives": [
    {
     "task": "Bir üst dizine (ana dizine) dön.",
     "teach": ".. = bir üst klasör, ~ = ev dizinin (home). Gezinmenin yarısı budur.",
     "verb": "cd"
    },
    {
     "task": "release adında yeni bir klasör oluştur.",
     "teach": "mkdir <ad> = make directory. Yayınlanacak dosyalar için düzenli yer.",
     "verb": "mkdir"
    },
    {
     "task": "Bir dosyayı release klasörüne kopyala (veya taşı).",
     "teach": "cp <kaynak> <hedef> kopyalar, mv taşır/yeniden adlandırır.",
     "verb": "cp"
    },
    {
     "task": "Gereksiz geçici dosyayı sil.",
     "teach": "rm <dosya> = sil. DİKKAT: Linux'ta geri dönüşüm kutusu yoktur, kalıcıdır!",
     "verb": "rm"
    }
   ],
   "complete": [
    "[Nova]: Dosya sistemine hükmediyorsun. Sırada: patlayan deploy'un sebebini loglarda avlamak."
   ]
  },
  {
   "id": "c1q3",
   "chapter": 1,
   "title": "İz Sürücü",
   "requires": [
    "c1q2"
   ],
   "xp": 85,
   "credits": 15,
   "badge": "🔎 Log Hunter",
   "brief": [
    "[Nova]: Deploy sürekli patlıyor ve sebep loglarda saklı.",
    "Binlerce satırın içinden doğru ipucunu çekip çıkarmayı öğrenelim: metin işleme."
   ],
   "objectives": [
    {
     "task": "Log dosyasının son satırlarını gör.",
     "teach": "tail <dosya> = dosyanın sonunu gösterir; tail -f canlı akıtır. Yeni hatalar sonda olur.",
     "verb": "tail"
    },
    {
     "task": "Loglarda 'error' geçen satırları filtrele.",
     "teach": "grep <desen> <dosya> = içinde deseni geçen satırları süzer. Log okumanın kalbi.",
     "verb": "grep"
    },
    {
     "task": "deploy.sh dosyasının yerini bul.",
     "teach": "find <yer> -name <ad> = dosya sisteminde arar. Nerede olduğunu bilmediğinde kullan.",
     "verb": "find"
    },
    {
     "task": "Hata kaç kez tekrarlanmış say.",
     "teach": "wc -l = satır sayar; grep -c = eşleşme sayar. Sorunun büyüklüğünü ölçmek önemli.",
     "verb": "grep"
    }
   ],
   "complete": [
    "[Nova]: Metni işleyip kök nedene indin. Bir engineer'ın en sık yaptığı iş budur."
   ]
  },
  {
   "id": "c1q4",
   "chapter": 1,
   "title": "Access Denied",
   "requires": [
    "c1q3"
   ],
   "xp": 85,
   "credits": 15,
   "badge": "🔐 chmod Master",
   "brief": [
    "[Nova]: Suçlu belli: deploy.sh çalıştırılamıyor — 'permission denied'.",
    "Linux izinlerini öğrenme vakti: okuma / yazma / çalıştırma (rwx)."
   ],
   "objectives": [
    {
     "task": "Dosyaların izinlerini detaylı listele.",
     "teach": "ls -l her dosyanın izinlerini gösterir: rwx = read/write/execute.",
     "verb": "ls"
    },
    {
     "task": "deploy.sh dosyasına çalıştırma izni ver.",
     "teach": "chmod +x <dosya> = execute izni ekler. chmod = change mode.",
     "verb": "chmod"
    },
    {
     "task": "Script'i çalıştır.",
     "teach": "./script = bulunduğun dizindeki script'i çalıştırır.",
     "verb": "./deploy.sh"
    }
   ],
   "complete": [
    "[Nova]: İzinler cloud'da güvenliğin temelidir. İyi iş."
   ]
  },
  {
   "id": "c1q5",
   "chapter": 1,
   "title": "Hayalet Süreç",
   "requires": [
    "c1q4"
   ],
   "xp": 90,
   "credits": 15,
   "badge": "🩺 Process Hunter",
   "brief": [
    "[Nova]: Deploy sonrası sunucu CPU'yu %100 yemiş. Bir süreç kaçak yapıyor.",
    "Sunucunun durumunu oku, suçluyu bul ve durdur."
   ],
   "objectives": [
    {
     "task": "Çalışan süreçleri listele.",
     "teach": "ps aux = tüm süreçleri kullanıcı/CPU/bellek ile listeler; top canlı gösterir.",
     "verb": "ps"
    },
    {
     "task": "4711 numaralı süreci sonlandır.",
     "teach": "kill <PID> süreci durdurur. Direnirse kill -9 <PID> zorlar (process signals).",
     "verb": "kill"
    },
    {
     "task": "Disk doluluğunu kontrol et.",
     "teach": "df -h = diskteki boş/dolu alanı insan-okur birimlerde gösterir (server review).",
     "verb": "df"
    }
   ],
   "complete": [
    "[Nova]: Bir sistemi teşhis edebilmek seni gerçek engineer yapar."
   ]
  },
  {
   "id": "c1q6",
   "chapter": 1,
   "title": "Daemon Uyanışı",
   "requires": [
    "c1q5"
   ],
   "xp": 95,
   "credits": 20,
   "badge": "🛠️ Sysadmin Initiate",
   "brief": [
    "[Nova]: Sunucuda izleme aracı ve web servisi eksik.",
    "Paket kur, servisi başlat, ortam değişkenini ayarla — bir sunucuyu ayağa kaldırmanın temeli."
   ],
   "objectives": [
    {
     "task": "Bir paket kur (ör. htop).",
     "teach": "apt install (Debian/Ubuntu) veya yum/dnf install (RHEL) = paket kurar.",
     "verb": "sudo"
    },
    {
     "task": "nginx servisini başlat.",
     "teach": "systemctl start <servis> = servisi başlatır; enable = açılışta otomatik başlatır.",
     "verb": "sudo"
    },
    {
     "task": "Servisin durumunu kontrol et.",
     "teach": "systemctl status <servis> = çalışıyor mu, loglar ne diyor gösterir.",
     "verb": "systemctl"
    },
    {
     "task": "Bir ortam değişkeni ayarla.",
     "teach": "export AD=değer = ortam değişkeni tanımlar. Uygulamalar config'i böyle okur (env/PATH).",
     "verb": "export"
    }
   ],
   "complete": [
    "[Nova]: Paket, servis ve ortam — Linux temellerini bitirdin. Sırada ağ ve Git."
   ]
  },
  {
   "id": "c2q1",
   "chapter": 2,
   "title": "Kayıp Paket",
   "requires": [
    "c1q6"
   ],
   "xp": 95,
   "credits": 20,
   "badge": "🕵️ Network Detective",
   "brief": [
    "[Nova]: Uygulama api.internal'e bağlanamıyor.",
    "Ağ sorununu katman katman teşhis edelim: erişim → isim çözümü → servis."
   ],
   "objectives": [
    {
     "task": "Sunucuya paket ulaşıyor mu diye ping at.",
     "teach": "ping <host> = temel erişilebilirlik testi (ICMP protokolü).",
     "verb": "ping"
    },
    {
     "task": "Alan adının DNS kaydını sorgula.",
     "teach": "dig / nslookup = DNS'in host'u hangi IP'ye çevirdiğini gösterir (DNS resolution).",
     "verb": "nslookup"
    },
    {
     "task": "HTTP servisine curl ile istek at.",
     "teach": "curl <URL> = komut satırından HTTP isteği. API test etmenin ekmek-suyu.",
     "verb": "curl"
    }
   ],
   "complete": [
    "[Nova]: Ağ sorunlarını katman katman kovalamak bir süpergüçtür."
   ]
  },
  {
   "id": "c2q2",
   "chapter": 2,
   "title": "Katman 7",
   "requires": [
    "c2q1"
   ],
   "xp": 110,
   "credits": 20,
   "badge": "🧭 Net Navigator",
   "brief": [
    "[Nova]: Bağlantı hâlâ tuhaf. Paketin yolunu izleyelim, portları görelim,",
    "sonra sunucuya uzaktan bağlanıp dosya gönderelim. (TCP/IP, routing, SSH)"
   ],
   "objectives": [
    {
     "task": "Paketin sunucuya giden rotasını izle.",
     "teach": "traceroute <host> = paketin geçtiği her durağı (hop) gösterir. Nerede takıldığını bulur.",
     "verb": "traceroute"
    },
    {
     "task": "Açık portları / dinleyen servisleri listele.",
     "teach": "ss -tulpn (veya netstat) = hangi port hangi servisçe dinleniyor gösterir.",
     "verb": "ss"
    },
    {
     "task": "Sunucuya SSH ile bağlan.",
     "teach": "ssh kullanıcı@host = uzak sunucuya güvenli bağlantı. Cloud'un günlük işi budur.",
     "verb": "ssh"
    },
    {
     "task": "Bir config dosyasını sunucuya gönder.",
     "teach": "scp <yerel> kullanıcı@host:<yol> = SSH üzerinden güvenli dosya kopyalar.",
     "verb": "scp"
    }
   ],
   "complete": [
    "[Nova]: Ağı katman katman çözüp uzak sunucuya hükmettin. Şimdi kodu versiyonlayalım."
   ]
  },
  {
   "id": "c2q3",
   "chapter": 2,
   "title": "Dal Ayrımı",
   "requires": [
    "c2q2"
   ],
   "xp": 110,
   "credits": 20,
   "badge": "🌿 Git Initiate",
   "brief": [
    "[Nova]: Değişikliklerini takımla paylaşman lazım. Git zamanı.",
    "Klasik akış: klonla → branch aç → değiştir → commit → push → PR."
   ],
   "objectives": [
    {
     "task": "Takımın reposunu klonla.",
     "teach": "git clone <URL> = uzak repoyu lokale indirir.",
     "verb": "git"
    },
    {
     "task": "Yeni bir feature branch aç.",
     "teach": "git checkout -b <ad> ya da git switch -c <ad> = yeni dal oluştur + geç.",
     "verb": "git"
    },
    {
     "task": "Değişikliklerini commit'le (mesajlı).",
     "teach": "git add . sonra git commit -m 'mesaj' = anlık kaydı oluşturur.",
     "verb": "git"
    },
    {
     "task": "Branch'i uzak repoya gönder.",
     "teach": "git push = commit'leri uzak repoya yollar. Sonra PR açarsın.",
     "verb": "git"
    }
   ],
   "complete": [
    "[Nova]: Artık takımla güvenle çalışabilirsin. Versiyon kontrolü = zaman makinesi."
   ]
  },
  {
   "id": "c2q4",
   "chapter": 2,
   "title": "Chronos",
   "requires": [
    "c2q3"
   ],
   "xp": 110,
   "credits": 20,
   "badge": "🕰️ Git Historian",
   "brief": [
    "[Nova]: Kod paylaşmak yetmez; geçmişi okumak, güncel kalmak ve birleştirmek de gerekir.",
    "Git'in 'zaman makinesi' tarafını öğrenelim — Fundamentals'ın finali."
   ],
   "objectives": [
    {
     "task": "Çalışma alanının durumunu gör.",
     "teach": "git status = neyin değiştiğini, neyin commit'e hazır olduğunu gösterir.",
     "verb": "git"
    },
    {
     "task": "Yaptığın değişiklikleri satır satır incele.",
     "teach": "git diff = son commit'ten bu yana değişen satırları gösterir.",
     "verb": "git"
    },
    {
     "task": "Commit geçmişini görüntüle.",
     "teach": "git log --oneline = geçmiş commit'leri özet listeler. Kim ne zaman ne yapmış.",
     "verb": "git"
    },
    {
     "task": "Takımın son değişikliklerini çek.",
     "teach": "git pull = uzak repodaki yeni commit'leri lokale getirir + birleştirir.",
     "verb": "git"
    },
    {
     "task": "Bir branch'i mevcut dala birleştir.",
     "teach": "git merge <branch> = başka bir dalın değişikliklerini birleştirir.",
     "verb": "git"
    }
   ],
   "complete": [
    "[Nova]: Versiyon kontrolünü de kavradın. Terminal, ağ ve Git — temelin artık sağlam."
   ]
  },
  {
   "id": "c3q1",
   "chapter": 3,
   "title": "Kimlik Matrisi",
   "requires": [
    "c2q4"
   ],
   "xp": 150,
   "credits": 30,
   "badge": "🔑 IAM Keeper",
   "brief": [
    "[Nova]: Gerçek buluta giriyoruz! Ama önce kimlik. Bulutun kuralı: önce KİM, sonra NE.",
    "AWS'te her şey IAM ile başlar — kullanıcı, politika, rol. Az yetki = az risk."
   ],
   "objectives": [
    {
     "task": "AWS CLI kimlik bilgilerini yapılandır.",
     "teach": "aws configure = access key, secret ve region'ı ayarlar. Erişimin kapısı.",
     "verb": "aws"
    },
    {
     "task": "Uygulama için sınırlı yetkili bir IAM kullanıcısı oluştur.",
     "teach": "IAM user = bir kimlik. Kök (root) hesabı asla günlük işte kullanma.",
     "verb": "aws"
    },
    {
     "task": "Kullanıcıya SADECE ihtiyaç duyduğu izni ver (policy).",
     "teach": "Policy = izin belgesi. Least privilege: mümkün olan en az yetki, en az risk.",
     "verb": "aws"
    },
    {
     "task": "Servislerin birbirine güvenli erişmesi için bir rol (role) oluştur.",
     "teach": "Role = kimlik ödünç verme. EC2, anahtar saklamadan S3'e rol ile erişir.",
     "verb": "aws"
    }
   ],
   "complete": [
    "[Nova]: Kimlik ve erişimi kurdun — bulut güvenliğinin temeli. Şimdi ağı örelim."
   ]
  },
  {
   "id": "c3q2",
   "chapter": 3,
   "title": "Sanal Omurga",
   "requires": [
    "c3q1"
   ],
   "xp": 150,
   "credits": 30,
   "badge": "🏗️ Network Builder",
   "brief": [
    "[Nova]: Sunucuların yaşayacağı özel ağı kuralım: VPC.",
    "CIDR ile IP aralığı, subnet ile bölme, gateway ile internet, security group ile duvar."
   ],
   "objectives": [
    {
     "task": "10.0.0.0/16 aralığında bir VPC oluştur.",
     "teach": "VPC = kendi izole ağın. CIDR bloğu IP aralığını belirler (10.0.0.0/16 ≈ 65k adres).",
     "verb": "aws"
    },
    {
     "task": "VPC içinde bir public subnet oluştur.",
     "teach": "Subnet = VPC'nin bir dilimi. Public subnet internete açılır, private açılmaz.",
     "verb": "aws"
    },
    {
     "task": "İnternet geçidi (Internet Gateway) oluştur.",
     "teach": "Internet Gateway = VPC'yi internete bağlar. Olmadan dışarı çıkamazsın.",
     "verb": "aws"
    },
    {
     "task": "Trafiği kontrol eden bir security group (firewall) oluştur.",
     "teach": "Security Group = sunucu seviyesinde güvenlik duvarı. Hangi port kime açık, sen belirlersin.",
     "verb": "aws"
    }
   ],
   "complete": [
    "[Nova]: Kendi bulut ağını sıfırdan kurdun. VPC, cloud mühendisliğinin belkemiğidir."
   ]
  },
  {
   "id": "c3q3",
   "chapter": 3,
   "title": "Makine Uyanışı",
   "requires": [
    "c3q2"
   ],
   "xp": 160,
   "credits": 35,
   "badge": "🖥️ EC2 Operator",
   "brief": [
    "[Nova]: Ağ hazır; şimdi içine bir sunucu koyalım: EC2.",
    "Anahtar çifti, instance tipi, çalıştır, sonra sabit adres için Elastic IP."
   ],
   "objectives": [
    {
     "task": "Sunucuya SSH için bir anahtar çifti (key pair) oluştur.",
     "teach": "Key pair = SSH anahtarın. Private key'i güvende tut; şifre yerine bununla bağlanırsın.",
     "verb": "aws"
    },
    {
     "task": "t3.micro tipinde bir EC2 sunucusu başlat (Free Tier).",
     "teach": "Instance type = CPU/RAM boyutu. t3.micro Free Tier'a uygundur.",
     "verb": "aws"
    },
    {
     "task": "Çalışan instance'ları kontrol et.",
     "teach": "describe-instances = durumu ve IP'yi gösterir. 'running' olmalı.",
     "verb": "aws"
    },
    {
     "task": "Sabit bir genel IP (Elastic IP) ayır.",
     "teach": "Elastic IP = sunucu yeniden başlasa da değişmeyen sabit genel IP.",
     "verb": "aws"
    }
   ],
   "complete": [
    "[Nova]: İlk sunucunu ağın içinde ayağa kaldırdın. Compute senin elinde."
   ]
  },
  {
   "id": "c3q4",
   "chapter": 3,
   "title": "Nesne Kasası",
   "requires": [
    "c3q3"
   ],
   "xp": 160,
   "credits": 30,
   "badge": "🪣 S3 Handler",
   "brief": [
    "[Nova]: Uygulamanın dosyalarını dayanıklı depoya koyalım: S3.",
    "Bucket oluştur, yükle, sonra kazara silmelere karşı versioning aç."
   ],
   "objectives": [
    {
     "task": "Yeni bir S3 bucket oluştur.",
     "teach": "aws s3 mb s3://<ad> = 'make bucket'. İsimler global benzersiz olmalı.",
     "verb": "aws"
    },
    {
     "task": "Bir dosyayı bucket'a yükle.",
     "teach": "aws s3 cp <kaynak> <hedef> = kopyala/yükle.",
     "verb": "aws"
    },
    {
     "task": "Bucket'ta versioning'i aç (kazara silme koruması).",
     "teach": "Versioning = her sürümü saklar; yanlış silersen geri alırsın. Storage class (Standard/IA/Glacier) maliyeti ayarlar.",
     "verb": "aws"
    }
   ],
   "complete": [
    "[Nova]: Object storage'ı çözdün: ölçeklenir, ucuz, dayanıklı."
   ]
  },
  {
   "id": "c3q5",
   "chapter": 3,
   "title": "Veri Çekirdeği",
   "requires": [
    "c3q4"
   ],
   "xp": 170,
   "credits": 35,
   "badge": "🗄️ RDS Admin",
   "brief": [
    "[Nova]: Uygulamanın verisi lazım. Veritabanını kendin yönetme — AWS yönetsin: RDS.",
    "Kur, durumu izle, kullanılmadığında durdur (maliyet!). Free Tier: db.t3.micro."
   ],
   "objectives": [
    {
     "task": "db.t3.micro bir MySQL RDS örneği oluştur.",
     "teach": "RDS = yönetilen veritabanı. Yedek, yama, replikasyon AWS'te; sen sadece kullanırsın.",
     "verb": "aws"
    },
    {
     "task": "Veritabanının durumunu kontrol et.",
     "teach": "describe-db-instances = 'available' olunca bağlanmaya hazır demektir.",
     "verb": "aws"
    },
    {
     "task": "Kullanmadığın veritabanını durdur (Free Tier / maliyet).",
     "teach": "Boşta duran DB para yakar. Kullanmadığında stop et — bir engineer'ın maliyet refleksi.",
     "verb": "aws"
    }
   ],
   "complete": [
    "[Nova]: IAM, VPC, EC2, S3, RDS — bir uygulamayı AWS'te uçtan uca kurabilirsin artık."
   ]
  },
  {
   "id": "c4q1",
   "chapter": 4,
   "title": "Genesis",
   "requires": [
    "c3q5"
   ],
   "xp": 170,
   "credits": 35,
   "badge": "📜 IaC Believer",
   "brief": [
    "[Nova]: Elle tıklamak hataya açık ve tekrar edilemez. Altyapıyı KODLA — Terraform.",
    "Temel döngü: başlat → biçimlendir → doğrula → önizle → uygula. Aynı sonuç, her seferinde."
   ],
   "objectives": [
    {
     "task": "Terraform çalışma dizinini başlat.",
     "teach": "terraform init = provider'ları ve modülleri indirir, dizini hazırlar. Her projede ilk komut.",
     "verb": "terraform"
    },
    {
     "task": "Kodu standart biçime sok.",
     "teach": "terraform fmt = HCL dosyalarını otomatik hizalar. Takımda tutarlılık sağlar.",
     "verb": "terraform"
    },
    {
     "task": "Kodun geçerliliğini doğrula.",
     "teach": "terraform validate = sözdizimi ve tutarlılık kontrolü (uygulamadan).",
     "verb": "terraform"
    },
    {
     "task": "Ne olacağını önizle.",
     "teach": "terraform plan = UYGULAMADAN ne değişeceğini gösterir. Her zaman önce plan.",
     "verb": "terraform"
    },
    {
     "task": "Altyapıyı uygula.",
     "teach": "terraform apply = planı gerçeğe çevirir.",
     "verb": "terraform"
    }
   ],
   "complete": [
    "[Nova]: IaC döngüsünü kurdun. Artık altyapı = kod = güvenilirlik."
   ]
  },
  {
   "id": "c4q2",
   "chapter": 4,
   "title": "Parametrik Sistem",
   "requires": [
    "c4q1"
   ],
   "xp": 170,
   "credits": 35,
   "badge": "✍️ HCL Scripter",
   "brief": [
    "[Nova]: Sabit değerler kötüdür. Kodu değişkenlerle esnet, sonuçları output ile paylaş."
   ],
   "objectives": [
    {
     "task": "Bir input değişkeniyle plan al.",
     "teach": "Input variable = kodun parametresi. -var ile dışarıdan değer verirsin.",
     "verb": "terraform"
    },
    {
     "task": "Ortama özel değişken dosyasıyla uygula.",
     "teach": "prod.tfvars gibi dosyalar ortam bazlı değerleri taşır (-var-file).",
     "verb": "terraform"
    },
    {
     "task": "Oluşan değerleri (IP, URL) göster.",
     "teach": "output = altyapının döndürdüğü değerler. terraform output ile okunur.",
     "verb": "terraform"
    },
    {
     "task": "İfadeleri interaktif değerlendir.",
     "teach": "terraform console = HCL ifadelerini/değişkenleri denemek için REPL.",
     "verb": "terraform"
    }
   ],
   "complete": [
    "[Nova]: Değişken ve çıktılarla kodun yeniden kullanılabilir hale geldi."
   ]
  },
  {
   "id": "c4q3",
   "chapter": 4,
   "title": "Durum Haritası",
   "requires": [
    "c4q2"
   ],
   "xp": 170,
   "credits": 35,
   "badge": "🗺️ State Keeper",
   "brief": [
    "[Nova]: Terraform gerçekliği 'state' dosyasında tutar. Onu okumayı ve düzeltmeyi öğren."
   ],
   "objectives": [
    {
     "task": "State'teki kaynakları listele.",
     "teach": "terraform state list = Terraform'un yönettiği tüm kaynakları listeler.",
     "verb": "terraform"
    },
    {
     "task": "Bir kaynağın detayını incele.",
     "teach": "terraform state show <adres> = tek kaynağın tüm alanlarını gösterir.",
     "verb": "terraform"
    },
    {
     "task": "Elle oluşturulmuş bir kaynağı Terraform'a al.",
     "teach": "terraform import = mevcut (elle açılmış) kaynağı state'e ekler; yeniden oluşturmadan yönetime alır.",
     "verb": "terraform"
    },
    {
     "task": "Bozuk bir kaynağı yeniden oluştur.",
     "teach": "terraform apply -replace=<adres> = tek kaynağı silip yeniden yaratır (eski adı: taint).",
     "verb": "terraform"
    }
   ],
   "complete": [
    "[Nova]: State'i okuyup düzeltebilmek, gerçek dünyada seni kurtaran beceridir."
   ]
  },
  {
   "id": "c4q4",
   "chapter": 4,
   "title": "Modüler Mimari",
   "requires": [
    "c4q3"
   ],
   "xp": 180,
   "credits": 40,
   "badge": "🏛️ IaC Architect",
   "brief": [
    "[Nova]: Tekrarı modüllerle önle, ortamları workspace ile ayır, sonra düzgün temizle."
   ],
   "objectives": [
    {
     "task": "Koddaki modülleri indir/güncelle.",
     "teach": "terraform get = kaynak koddaki modülleri indirir. (init de yapar; get sadece modüller için.)",
     "verb": "terraform"
    },
    {
     "task": "Ayrı bir ortam (workspace) oluştur.",
     "teach": "Workspace = aynı kodla izole state'ler (dev/prod). terraform workspace new prod.",
     "verb": "terraform"
    },
    {
     "task": "Bağımlılık grafiğini üret.",
     "teach": "terraform graph = kaynakların bağımlılık grafiğini (DOT) verir. Ne neye bağlı görürsün.",
     "verb": "terraform"
    },
    {
     "task": "Her şeyi tek komutla yık (maliyet!).",
     "teach": "terraform destroy = oluşturulan her şeyi siler. Test sonrası temizlik = maliyet kontrolü.",
     "verb": "terraform"
    }
   ],
   "complete": [
    "[Nova]: Modül, workspace ve temiz yaşam döngüsü — altyapıyı artık profesyonelce kodluyorsun."
   ]
  },
  {
   "id": "c5q1",
   "chapter": 5,
   "title": "Konteyner Doğuşu",
   "requires": [
    "c4q4"
   ],
   "xp": 180,
   "credits": 40,
   "badge": "🐳 Container Captain",
   "brief": [
    "[Nova]: 'Benim makinemde çalışıyordu' devri bitti. Docker ile paketle.",
    "Uygulama + bağımlılıkları tek image'de. Her yerde aynı çalışır."
   ],
   "objectives": [
    {
     "task": "Dockerfile'dan bir image build et.",
     "teach": "docker build -t <ad> . = Dockerfile'ı okuyup image üretir.",
     "verb": "docker"
    },
    {
     "task": "Image'den bir container çalıştır.",
     "teach": "docker run = image'i ayağa kaldırır. -p ile port yayınlarsın.",
     "verb": "docker"
    },
    {
     "task": "Çalışan container'ları listele.",
     "teach": "docker ps = çalışan container'ları gösterir.",
     "verb": "docker"
    },
    {
     "task": "Tüm stack'i compose ile ayağa kaldır.",
     "teach": "docker compose up = birden fazla servisi (app+db) tek komutla başlatır.",
     "verb": "docker"
    }
   ],
   "complete": [
    "[Nova]: Docker'ın temelini kurdun. Şimdi veriyi kalıcı kıl ve imajı paylaş."
   ]
  },
  {
   "id": "c5q2",
   "chapter": 5,
   "title": "Kalıcı Bellek",
   "requires": [
    "c5q1"
   ],
   "xp": 180,
   "credits": 40,
   "badge": "🚢 Image Shipper",
   "brief": [
    "[Nova]: İmajı çalıştırmak yetmez; içine gir, veriyi kalıcı yap, sonra registry'ye gönder.",
    "Başkaları imajını 'pull' ile çeksin — takım böyle çalışır."
   ],
   "objectives": [
    {
     "task": "Çalışan container'ın içine gir.",
     "teach": "docker exec -it <container> sh = çalışan container'da komut/kabuk çalıştırır. Debug için birebir.",
     "verb": "docker"
    },
    {
     "task": "Kalıcı veri için bir volume oluştur.",
     "teach": "Container fs'i geçicidir (ephemeral) — silinince veri gider. Volume = kalıcı depo.",
     "verb": "docker"
    },
    {
     "task": "İmajı registry için etiketle (tag).",
     "teach": "docker tag <imaj> <registry/kullanıcı/ad:etiket> = registry'ye push için isimlendirir.",
     "verb": "docker"
    },
    {
     "task": "İmajı registry'ye gönder (push).",
     "teach": "docker push = imajı DockerHub/ECR gibi registry'ye yükler; başkaları 'pull' ile çeker.",
     "verb": "docker"
    }
   ],
   "complete": [
    "[Nova]: Veri kalıcılığı ve registry ile Docker'da profesyonelleştin. Şimdi orkestra: Kubernetes."
   ]
  },
  {
   "id": "c5q3",
   "chapter": 5,
   "title": "Orkestrasyon",
   "requires": [
    "c5q2"
   ],
   "xp": 190,
   "credits": 40,
   "badge": "☸️ kubectl Pilot",
   "brief": [
    "[Nova]: Tek container yeterli değil. Kubernetes ile ölçekle ve dayanıklı kıl.",
    "kubectl = Kubernetes'in komut satırı. Pod, deployment, service kavramları."
   ],
   "objectives": [
    {
     "task": "Cluster'daki node'ları listele.",
     "teach": "kubectl get nodes = cluster'daki makineleri gösterir.",
     "verb": "kubectl"
    },
    {
     "task": "Bir deployment oluştur.",
     "teach": "kubectl create deployment <ad> --image=<img> = uygulamayı deploy eder.",
     "verb": "kubectl"
    },
    {
     "task": "Çalışan pod'ları görüntüle.",
     "teach": "kubectl get pods = ayağa kalkan pod'ları listeler.",
     "verb": "kubectl"
    },
    {
     "task": "Deployment'ı bir Service ile dışarı aç.",
     "teach": "Service = pod'lara sabit erişim + load balancing. Pod'lar gelip gitse de Service sabittir.",
     "verb": "kubectl"
    }
   ],
   "complete": [
    "[Nova]: Deployment ve Service ile uygulamanı cluster'da yayınladın."
   ]
  },
  {
   "id": "c5q4",
   "chapter": 5,
   "title": "Ölçek Motoru",
   "requires": [
    "c5q3"
   ],
   "xp": 200,
   "credits": 45,
   "badge": "🎛️ K8s Operator",
   "brief": [
    "[Nova]: Yayınlamak başlangıç. Şimdi ölçekle, yapılandır, sürüm yönet ve hata ayıkla."
   ],
   "objectives": [
    {
     "task": "Deployment'ı 3 replikaya ölçekle.",
     "teach": "kubectl scale = kopya sayısını değiştirir. Yük dağılır, bir pod ölse bile servis ayakta kalır.",
     "verb": "kubectl"
    },
    {
     "task": "Yapılandırmayı ConfigMap ile enjekte et.",
     "teach": "ConfigMap = koddan ayrı yapılandırma (ENV, ayarlar). Hassas veriler için Secret kullanılır.",
     "verb": "kubectl"
    },
    {
     "task": "Hatalı sürümü geri al (rollback).",
     "teach": "kubectl rollout = rolling update/rollback yönetir. undo ile bir önceki sağlam sürüme dönersin.",
     "verb": "kubectl"
    },
    {
     "task": "Bir pod'un loglarına bakıp hata ayıkla.",
     "teach": "kubectl logs <pod> = pod loglarını gösterir. describe ile de olayları/nedeni görürsün.",
     "verb": "kubectl"
    }
   ],
   "complete": [
    "[Nova]: Ölçek, config, sürüm ve debug — Kubernetes'i işletebiliyorsun artık."
   ]
  },
  {
   "id": "c6q1",
   "chapter": 6,
   "title": "Otonom Hat",
   "requires": [
    "c5q4"
   ],
   "xp": 200,
   "credits": 45,
   "badge": "🚀 Pipeline Builder",
   "brief": [
    "[Nova]: Her push'ta elle test/deploy yapmak sürdürülemez.",
    "GitHub Actions ile pipeline kur: build → test → deploy, tamamen otomatik."
   ],
   "objectives": [
    {
     "task": "Workflow dosyaları için klasörü oluştur.",
     "teach": "GitHub Actions .github/workflows/ altındaki YAML dosyalarını çalıştırır.",
     "verb": "mkdir"
    },
    {
     "task": "Projeyi derle (build).",
     "teach": "CI'ın ilk adımı derlemedir. Derlenmiyorsa test bile edilmez — hızlı geri bildirim.",
     "verb": "npm"
    },
    {
     "task": "Testleri lokalde çalıştır (pipeline'a koymadan önce).",
     "teach": "CI'ın kalbi testtir. Önce lokalde geçmeli: npm test / pytest vb.",
     "verb": "npm"
    },
    {
     "task": "Workflow'u commit'leyip push'la (pipeline tetiklensin).",
     "teach": "Push, workflow'u tetikler. GitHub sunucularında build + test otomatik koşar.",
     "verb": "git"
    }
   ],
   "complete": [
    "[Nova]: Artık kodun kendi kendini derleyip test ediyor. Şimdi güvenli otomatik dağıtım (CD)."
   ]
  },
  {
   "id": "c6q2",
   "chapter": 6,
   "title": "Deploy Kapısı",
   "requires": [
    "c6q1"
   ],
   "xp": 200,
   "credits": 45,
   "badge": "🚦 Release Conductor",
   "brief": [
    "[Nova]: Test yeşil ama iş bitmedi. Şimdi güvenli, otomatik DAĞITIM: sırlar, tetikleme, izleme, deploy.",
    "Bir daha 'elle prod'a atmak' yok."
   ],
   "objectives": [
    {
     "task": "Deploy sırlarını repo secret'larına ekle.",
     "teach": "Deploy anahtarlarını koda YAZMA. GitHub repo secret'larında tut; Actions çalışırken okur.",
     "verb": "gh"
    },
    {
     "task": "Pipeline'ı manuel tetikle (workflow_dispatch).",
     "teach": "Bazı işleri (deploy gibi) elle tetiklemek istersin. gh workflow run bunu yapar.",
     "verb": "gh"
    },
    {
     "task": "Çalışan pipeline'ı canlı izle.",
     "teach": "gh run watch/list = pipeline durumunu terminalden takip eder. Kırmızıysa müdahale.",
     "verb": "gh"
    },
    {
     "task": "Yeni sürümü cluster'a uygula (deploy adımı).",
     "teach": "CD'nin son adımı: yeni sürümü ortama uygulamak. kubectl apply manifest'leri gerçeğe çevirir.",
     "verb": "kubectl"
    }
   ],
   "complete": [
    "[Nova]: Artık her onaylı değişiklik güvenle, otomatik ve izlenebilir şekilde canlıya gidiyor."
   ]
  },
  {
   "id": "c7q1",
   "chapter": 7,
   "title": "Görünmez Katman",
   "requires": [
    "c6q2"
   ],
   "xp": 210,
   "credits": 50,
   "badge": "👁️ Observer",
   "brief": [
    "[Nova]: Gece 3'te alarm çaldı. 'Yavaşlık' şikayeti var ama nerede?",
    "Gözlemlenebilirliğin 3 sütunu: loglar, metrikler, izler (traces)."
   ],
   "objectives": [
    {
     "task": "Uygulama loglarını canlı izle.",
     "teach": "tail -f = dosyanın sonuna eklenen yeni satırları canlı gösterir.",
     "verb": "tail"
    },
    {
     "task": "Container/servis metriklerine bak.",
     "teach": "CPU/bellek/istek metrikleri darboğazı gösterir. Örn: kubectl top pods.",
     "verb": "kubectl"
    },
    {
     "task": "Sağlık ucuna (health endpoint) istek atıp doğrula.",
     "teach": "Health endpoint hızlı bir nabız kontrolüdür. Otomatik alarmlar buna bakar.",
     "verb": "curl"
    }
   ],
   "complete": [
    "[Nova]: Ölçemediğini yönetemezsin. Ama tek tek bakmak yetmez — sistem sana haber vermeli."
   ]
  },
  {
   "id": "c7q2",
   "chapter": 7,
   "title": "Sinyal Ağı",
   "requires": [
    "c7q1"
   ],
   "xp": 220,
   "credits": 50,
   "badge": "🔔 Signal Master",
   "brief": [
    "[Nova]: Log tek tek bakmak değil. Metrikleri sorgula, alarm kur, dağıtık izleri gör, dashboard'a bak.",
    "Amaç: sorunu kullanıcıdan ÖNCE yakalamak."
   ],
   "objectives": [
    {
     "task": "Prometheus'tan bir metrik sorgula (PromQL).",
     "teach": "Prometheus metrikleri PromQL ile sorgulanır (up, http_requests_total, latency...).",
     "verb": "curl"
    },
    {
     "task": "Alarm kurallarını doğrula.",
     "teach": "Alarm kuralları (yüksek hata oranı, gecikme) yayına çıkmadan doğrulanır: promtool.",
     "verb": "promtool"
    },
    {
     "task": "Grafana dashboard'una eriş.",
     "teach": "Grafana metrikleri görselleştirir. port-forward ile lokalden dashboard'a bağlanırsın.",
     "verb": "kubectl"
    },
    {
     "task": "Bir isteğin dağıtık izini (trace) incele.",
     "teach": "Distributed tracing (Jaeger/OpenTelemetry) bir isteğin servisler arası yolunu gösterir; yavaşlık nerede belli olur.",
     "verb": "curl"
    }
   ],
   "complete": [
    "[Nova]: Metrik, alarm, dashboard ve iz — artık sistemin sinir sistemini görüyorsun."
   ]
  },
  {
   "id": "c8q1",
   "chapter": 8,
   "title": "Erişim Kalkanı",
   "requires": [
    "c7q2"
   ],
   "xp": 230,
   "credits": 55,
   "badge": "🛡️ Cloud Guardian",
   "brief": [
    "[Nova]: Son perde: güvenlik ve maliyet — bir engineer'ı senior yapan iki şey.",
    "Önce erişim ve sırlar. Az yetki, kilitli sır, izlenebilir hesap."
   ],
   "objectives": [
    {
     "task": "Bir IAM kullanıcısının yetkilerini denetle.",
     "teach": "Fazla yetki = risk. Önce kimin neye erişebildiğini gör (least privilege).",
     "verb": "aws"
    },
    {
     "task": "Aşırı yetkiyi kaldır (least privilege uygula).",
     "teach": "detach-user-policy = gereksiz izni söker. İhtiyaç kadar yetki, fazlası değil.",
     "verb": "aws"
    },
    {
     "task": "Sırrı kod yerine secret manager'da sakla.",
     "teach": "API key'i repoya YAZMA. Secrets Manager gibi kasalarda tut.",
     "verb": "aws"
    },
    {
     "task": "Denetim izi (audit log) aç — kim ne yaptı görünsün.",
     "teach": "CloudTrail tüm API çağrılarını kaydeder. Bir olayda 'kim, ne zaman, ne yaptı' buradan çıkar.",
     "verb": "aws"
    }
   ],
   "complete": [
    "[Nova]: Erişim ve sırlar güvende. Ama veri hâlâ açıkta olabilir — onu koruyalım."
   ]
  },
  {
   "id": "c8q2",
   "chapter": 8,
   "title": "Şifreleme Katmanı",
   "requires": [
    "c8q1"
   ],
   "xp": 240,
   "credits": 55,
   "badge": "🔒 Data Protector",
   "brief": [
    "[Nova]: En sık ihlal: yanlışlıkla herkese açık bir bucket. Veriyi kapat, şifrele, kodunu tara."
   ],
   "objectives": [
    {
     "task": "S3 bucket'ının herkese açık erişimini kapat.",
     "teach": "Public access block = bucket'ın kazara internete açılmasını engeller. Varsayılan: kapalı.",
     "verb": "aws"
    },
    {
     "task": "Bucket'ta dinlenen veriyi şifrele (encryption at rest).",
     "teach": "put-bucket-encryption = diskteki veriyi otomatik şifreler (SSE). Çalınsa bile okunamaz.",
     "verb": "aws"
    },
    {
     "task": "İmajı/kodu güvenlik açıkları için tara.",
     "teach": "Trivy (imaj) / Checkov (IaC) = bilinen açıkları ve yanlış yapılandırmayı yayından önce yakalar.",
     "verb": "trivy"
    }
   ],
   "complete": [
    "[Nova]: Veri kilitli ve şifreli, kod taranmış. Geriye tek şey kaldı: fatura."
   ]
  },
  {
   "id": "c8q3",
   "chapter": 8,
   "title": "Bütçe Kilidi",
   "requires": [
    "c8q2"
   ],
   "xp": 260,
   "credits": 65,
   "badge": "💰 Cost Sentinel",
   "brief": [
    "[Nova]: Büyüme güzel, sürpriz fatura değil. Maliyeti gör, sınırla, etiketle, israfı kes.",
    "Bunu yaparsan artık çaylak değilsin — Meridian'ın mimarısın."
   ],
   "objectives": [
    {
     "task": "Bu ayki bulut maliyetini raporla.",
     "teach": "Cost Explorer (ce) harcamayı servis/gün bazında gösterir. Düzenli bakılır.",
     "verb": "aws"
    },
    {
     "task": "Eşik aşılırsa uyaracak bir bütçe kur.",
     "teach": "Budgets = harcama eşiği + alarm. Fatura şişmeden e-posta/uyarı gelir.",
     "verb": "aws"
    },
    {
     "task": "Kaynakları etiketle (hangi takım/proje harcıyor).",
     "teach": "Cost allocation tag'leri = maliyeti takıma/projeye böler. 'Bu para nereye gidiyor?' cevabı.",
     "verb": "aws"
    },
    {
     "task": "Boşta duran kaynağı durdur (israfı kes).",
     "teach": "Kullanılmayan instance para yakar. Kapatmak = anında tasarruf.",
     "verb": "aws"
    }
   ],
   "complete": [
    "[Nova]: Güvenlik ve maliyet — ikisini de kapattın. Yolculuk tamamlandı.",
    "Terminal, ağ, AWS, IaC, container, CI/CD, gözlemlenebilirlik ve güvenlik: hepsi artık senin.",
    "Sırada gerçek dünya: portföyünü GitHub'da büyüt, AWS SAA sertifikasına hazırlan."
   ]
  }
 ],
 "modules": [
  {
   "id": "net",
   "icon": "🛰️",
   "title": "Network Ops",
   "status": "active",
   "desc": "port tarama, DNS/routing, paket yakalama, firewall ile ağ teşhis oyunları",
   "topics": [
    "port tarama",
    "DNS & routing",
    "paket yakalama",
    "firewall/route debug"
   ],
   "quests": [
    {
     "id": "netq1",
     "title": "Port Haritası",
     "requires": [],
     "xp": 120,
     "credits": 25,
     "badge": "🔌 Port Hunter",
     "brief": [
      "[Nova]: Ağ dojosuna hoş geldin. Gerçek arızalar, gerçek komutlar.",
      "Bir servise erişilemiyor. Önce hangi portlar açık, kim dinliyor — onu bul."
     ],
     "objectives": [
      {
       "task": "Hedef makinede açık portları tara.",
       "teach": "nmap = uzak hostta hangi portların açık olduğunu tarar. Teşhisin ilk adımı.",
       "verb": "nmap"
      },
      {
       "task": "Yerelde dinleyen servisleri/portları listele.",
       "teach": "ss -tulpn (veya netstat) = bu makinede hangi port hangi süreççe dinleniyor.",
       "verb": "ss"
      },
      {
       "task": "Belirli bir portu hangi süreç tutuyor bul.",
       "teach": "lsof -i :PORT (veya fuser) = portu kullanan süreci gösterir.",
       "verb": "lsof"
      },
      {
       "task": "Porta bağlanmayı test et.",
       "teach": "nc -zv host port = porta TCP bağlantısı dener (tarama/doğrulama). telnet de olur.",
       "verb": "nc"
      }
     ],
     "complete": [
      "[Nova]: Portları haritaladın. Sorun 443'ün hiç dinlenmemesi — not al, devam."
     ]
    },
    {
     "id": "netq2",
     "title": "DNS Labirenti",
     "requires": [
      "netq1"
     ],
     "xp": 130,
     "credits": 30,
     "badge": "📡 Route Tracer",
     "brief": [
      "[Nova]: Bazen sorun makinede değil, adres çözümünde ya da yolda olur.",
      "DNS zincirini ve paketin gittiği rotayı çöz."
     ],
     "objectives": [
      {
       "task": "DNS çözümünü kök sunuculardan izle.",
       "teach": "dig +trace = alan adının kökten itibaren nasıl çözüldüğünü adım adım gösterir.",
       "verb": "dig"
      },
      {
       "task": "Ters DNS ya da özel kayıt tipini sorgula.",
       "teach": "dig -x IP = ters DNS; dig MX/NS/TXT ad = belirli kayıt tipi.",
       "verb": "dig"
      },
      {
       "task": "Yönlendirme (routing) tablosunu incele.",
       "teach": "ip route = paketlerin hangi ağ geçidinden çıktığını gösterir. Yanlış rota = ulaşılamaz.",
       "verb": "ip"
      },
      {
       "task": "Yolu ve gecikmeyi hop hop izle.",
       "teach": "mtr / traceroute = paketin geçtiği her durağı ve gecikmeyi canlı gösterir.",
       "verb": "mtr"
      }
     ],
     "complete": [
      "[Nova]: İsim çözümü ve rotayı çözdün. Ağın haritası artık kafanda."
     ]
    },
    {
     "id": "netq3",
     "title": "Paket Avcısı",
     "requires": [
      "netq2"
     ],
     "xp": 140,
     "credits": 35,
     "badge": "🕸️ Packet Catcher",
     "brief": [
      "[Nova]: Loglar sustuğunda telin üstündeki gerçeğe bakarız: paketler.",
      "Trafiği yakala, TLS el sıkışmasını incele."
     ],
     "objectives": [
      {
       "task": "İlgili trafiği canlı yakala.",
       "teach": "tcpdump -i <arayüz> <filtre> = ağdan geçen paketleri yakalar. Filtre şart, yoksa boğulursun.",
       "verb": "tcpdump"
      },
      {
       "task": "curl ile bağlantının ayrıntısını (verbose) gör.",
       "teach": "curl -v = DNS, TCP, TLS ve HTTP adımlarını tek tek yazar. Nerede patladığı belli olur.",
       "verb": "curl"
      },
      {
       "task": "TLS sertifikasını doğrudan incele.",
       "teach": "openssl s_client -connect host:443 = sunucunun sunduğu sertifikayı gösterir.",
       "verb": "openssl"
      },
      {
       "task": "Yakalanan paketleri (pcap) analiz et.",
       "teach": "tshark -r dosya.pcap = kaydedilmiş yakalamayı okur/filtreler (Wireshark'ın CLI'ı).",
       "verb": "tshark"
      }
     ],
     "complete": [
      "[Nova]: Paket seviyesine indin. Bu beceri seni 'sihirbaz' yapan şeydir."
     ]
    },
    {
     "id": "netq4",
     "title": "Duvar Ardında",
     "requires": [
      "netq3"
     ],
     "xp": 150,
     "credits": 35,
     "badge": "🚧 Firewall Tamer",
     "brief": [
      "[Nova]: Son teşhis: trafiği bir duvar mı kesiyor? Kuralları oku, test et, düzelt, doğrula."
     ],
     "objectives": [
      {
       "task": "Firewall kurallarını listele.",
       "teach": "iptables -L / nft list ruleset / ufw status = mevcut güvenlik duvarı kurallarını gösterir.",
       "verb": "sudo"
      },
      {
       "task": "Portu dışarıdan test et.",
       "teach": "nc -zv host port = portun gerçekten açık/kapalı olduğunu dışarıdan doğrular.",
       "verb": "nc"
      },
      {
       "task": "Kuralı ekleyip portu aç.",
       "teach": "ufw allow / iptables -A = izin kuralı ekler. Sadece gereken portu aç, hepsini değil.",
       "verb": "sudo"
      },
      {
       "task": "Düzeltmeyi doğrula.",
       "teach": "curl -I = sadece başlıkları çeker; servis artık cevap veriyor mu hızlıca görürsün.",
       "verb": "curl"
      }
     ],
     "complete": [
      "[Nova]: Port, DNS, paket ve duvar — bir ağ mühendisinin teşhis cephanesi artık sende. 🛰️"
     ]
    }
   ]
  },
  {
   "id": "scripting",
   "icon": "📜",
   "title": "Scripting",
   "status": "active",
   "desc": "Bash ile otomasyon: script, döngü/koşul, log parsing, cron",
   "topics": [
    "argüman & exit code",
    "değişken/döngü/koşul",
    "log parsing",
    "cron"
   ],
   "quests": [
    {
     "id": "scrq1",
     "title": "Script Çekirdeği",
     "requires": [],
     "xp": 120,
     "credits": 25,
     "badge": "🐚 Shell Novice",
     "brief": [
      "[Nova]: Aynı işi iki kez elle yaptıysan, üçüncüsünü yazmalısın. İlk script'in: yedekleme.",
      "Çalıştır, argüman ver, çıkış kodunu oku, hata ayıkla."
     ],
     "objectives": [
      {
       "task": "backup.sh'ı çalıştırılabilir yap.",
       "teach": "Bir script'i çalıştırmak için execute izni gerekir: chmod +x. İlk satır #!/bin/bash (shebang) hangi yorumlayıcı çalışacağını söyler.",
       "verb": "chmod"
      },
      {
       "task": "Script'i bir argümanla çalıştır.",
       "teach": "Script'e verdiğin kelimeler $1, $2... olur; $@ hepsi. Böylece aynı script farklı ortamlara hizmet eder.",
       "verb": "./backup.sh"
      },
      {
       "task": "Son komutun çıkış kodunu (exit code) kontrol et.",
       "teach": "Her komut bir exit code döndürür: 0 = başarı, değilse hata. $? son kodu tutar. Otomasyonun temeli budur.",
       "verb": "echo"
      },
      {
       "task": "Script'i satır satır izleyerek hata ayıkla.",
       "teach": "bash -x script = her satırı çalışırken ekrana basar. 'Neden çalışmadı?' sorusunun cevabı burada.",
       "verb": "bash"
      }
     ],
     "complete": [
      "[Nova]: İlk script'in çalışıyor. Argüman ve exit code — otomasyonun tuğlaları."
     ]
    },
    {
     "id": "scrq2",
     "title": "Mantık Devresi",
     "requires": [
      "scrq1"
     ],
     "xp": 130,
     "credits": 30,
     "badge": "🌀 Flow Scripter",
     "brief": [
      "[Nova]: Script'i akıllı yapan şey: değişken, döngü, koşul. Tekrarı makineye yıkalım."
     ],
     "objectives": [
      {
       "task": "Bir değişkeni oku/yazdır.",
       "teach": "ad=deger ile atarsın, $ad ile okursun. Çift tırnak içinde genişler: \"$ad\".",
       "verb": "echo"
      },
      {
       "task": "Bir döngüyle tüm log dosyalarını gez.",
       "teach": "for x in LİSTE; do ...; done = her öğe için tekrarlar. Toplu işlerin belkemiği.",
       "verb": "for"
      },
      {
       "task": "Bir koşulla dosya var mı diye bak.",
       "teach": "if [ KOŞUL ]; then ...; fi. -f dosya var mı, -d dizin mi, -z boş mu test eder.",
       "verb": "if"
      },
      {
       "task": "Bir dosyayı satır satır oku.",
       "teach": "while read line; do ...; done < dosya = dosyayı satır satır işler. Log işlemenin klasiği.",
       "verb": "while"
      }
     ],
     "complete": [
      "[Nova]: Değişken, döngü, koşul — artık script'in düşünebiliyor."
     ]
    },
    {
     "id": "scrq3",
     "title": "Metin Madenciliği",
     "requires": [
      "scrq2"
     ],
     "xp": 140,
     "credits": 35,
     "badge": "🧵 Text Weaver",
     "brief": [
      "[Nova]: Loglar altın madeni ama ham. grep/awk/sed üçlüsüyle işleyip anlam çıkar."
     ],
     "objectives": [
      {
       "task": "Hata satırlarını filtrele.",
       "teach": "grep <desen> <dosya> = deseni içeren satırları süzer. -i büyük/küçük harf duyarsız.",
       "verb": "grep"
      },
      {
       "task": "Belirli bir sütunu (alanı) ayıkla.",
       "teach": "awk '{print $N}' = N. alanı basar. Boşlukla ayrılmış loglarda IP/kod/süre çekmenin yolu.",
       "verb": "awk"
      },
      {
       "task": "Metinde toplu değişiklik yap.",
       "teach": "sed 's/eski/yeni/g' = akıştaki metni değiştirir. Log temizleme/normalizasyonun aracı.",
       "verb": "sed"
      },
      {
       "task": "En sık tekrarlayanı bul (say + sırala).",
       "teach": "sort | uniq -c | sort -rn = tekrarları sayıp en çoktan aza sıralar. 'En çok hangi IP vuruyor?' sorusunu çözer.",
       "verb": "sort"
      }
     ],
     "complete": [
      "[Nova]: grep-awk-sed üçlüsü — bir engineer'ın İsviçre çakısı. Ustalaştın."
     ]
    },
    {
     "id": "scrq4",
     "title": "Zamanlayıcı",
     "requires": [
      "scrq3"
     ],
     "xp": 150,
     "credits": 35,
     "badge": "⏰ Cron Master",
     "brief": [
      "[Nova]: Son adım: script'i sen uyurken çalıştır. cron + sağlam script yazımı."
     ],
     "objectives": [
      {
       "task": "Zamanlanmış işleri listele.",
       "teach": "crontab -l = mevcut zamanlanmış işleri gösterir. -e ile düzenlersin.",
       "verb": "crontab"
      },
      {
       "task": "Yeni bir cron işi eklemek için düzenleyiciyi aç.",
       "teach": "crontab -e. Format: dk saat gün ay haftanıngünü komut. Ör: '0 3 * * * /opt/backup.sh' = her gün 03:00.",
       "verb": "crontab"
      },
      {
       "task": "Script'i çalıştırmadan sözdizimi hatasına karşı kontrol et.",
       "teach": "bash -n script = script'i çalıştırmadan yalnızca sözdizimini denetler. Prod'a atmadan önce şart.",
       "verb": "bash"
      },
      {
       "task": "Script'i hataya karşı sağlamlaştır.",
       "teach": "set -euo pipefail = hatada dur, tanımsız değişkende dur, pipe hatasını yut-ma. Profesyonel script'in ilk satırı.",
       "verb": "set"
      }
     ],
     "complete": [
      "[Nova]: Yazdın, işledin, zamanladın, sağlamlaştırdın. Artık makineler senin için çalışıyor. 📜"
     ]
    }
   ]
  },
  {
   "id": "docker",
   "icon": "🐳",
   "title": "Docker Deep Dive",
   "status": "active",
   "desc": "imaj katmanları, volume/network, registry, compose ustalığı",
   "topics": [
    "Dockerfile optimizasyonu",
    "volume/network",
    "registry",
    "compose"
   ],
   "quests": [
    {
     "id": "dkq1",
     "title": "İmaj Fabrikası",
     "requires": [],
     "xp": 130,
     "credits": 30,
     "badge": "🐋 Image Smith",
     "brief": [
      "[Nova]: Temel build'i biliyorsun. Şimdi imajı KÜÇÜK ve HIZLI yapmayı öğren — katmanlar ve multi-stage."
     ],
     "objectives": [
      {
       "task": "Bir imaj build et.",
       "teach": "docker build -t ad:etiket . = Dockerfile'ı katman katman okuyup imaj üretir. Her satır bir katman = cache.",
       "verb": "docker"
      },
      {
       "task": "İmajın katman geçmişini incele.",
       "teach": "docker history = her katmanın boyutunu/komutunu gösterir. Şişkin katmanı böyle bulursun.",
       "verb": "docker"
      },
      {
       "task": "İmaj boyutlarını listele.",
       "teach": "docker images = yerel imajları ve boyutlarını gösterir. Küçük imaj = hızlı deploy, az saldırı yüzeyi.",
       "verb": "docker"
      },
      {
       "task": "Multi-stage build ile sadece gerekeni al.",
       "teach": "--target ile Dockerfile'daki belirli aşamayı build edersin. Derleme araçlarını atıp yalnız çalışan artefaktı taşırsın.",
       "verb": "docker"
      }
     ],
     "complete": [
      "[Nova]: 412MB'tan 74MB'a. Katmanları ve multi-stage'i çözdün — imaj artık zarif."
     ]
    },
    {
     "id": "dkq2",
     "title": "Kalıcı Bağlantı",
     "requires": [
      "dkq1"
     ],
     "xp": 140,
     "credits": 35,
     "badge": "🔗 Volume Keeper",
     "brief": [
      "[Nova]: Container'lar geçici. Kalıcı veri = volume; container'lar arası konuşma = network."
     ],
     "objectives": [
      {
       "task": "Kalıcı veri için bir volume oluştur.",
       "teach": "docker volume create = container silinse de yaşayan depo. DB verisi asla container fs'inde tutulmaz.",
       "verb": "docker"
      },
      {
       "task": "Container'ı volume bağlayarak çalıştır.",
       "teach": "docker run -v volume:/yol = volume'ü container içine bağlar. Veri artık container'dan bağımsız.",
       "verb": "docker"
      },
      {
       "task": "Container'lar için özel bir ağ oluştur.",
       "teach": "docker network create = container'ların isimle birbirine ulaştığı izole ağ.",
       "verb": "docker"
      },
      {
       "task": "Container'ı bu ağa bağlayarak çalıştır.",
       "teach": "docker run --network appnet = container'ı ağa koyar; artık 'db' gibi isimle diğerine erişir.",
       "verb": "docker"
      }
     ],
     "complete": [
      "[Nova]: Kalıcılık ve ağ — container'ları gerçek bir sistem gibi bağladın."
     ]
    },
    {
     "id": "dkq3",
     "title": "Registry Ağı",
     "requires": [
      "dkq2"
     ],
     "xp": 140,
     "credits": 35,
     "badge": "📦 Registry Runner",
     "brief": [
      "[Nova]: İmaj paylaşılmazsa işe yaramaz. Registry'ye gönder, sonra derinlemesine incele."
     ],
     "objectives": [
      {
       "task": "Bir container registry'sine giriş yap.",
       "teach": "docker login = DockerHub/GHCR/ECR gibi registry'ye kimlik doğrular. Push'tan önce şart.",
       "verb": "docker"
      },
      {
       "task": "İmajı registry adıyla etiketle.",
       "teach": "docker tag <yerel> <registry/kullanıcı/ad:etiket> = push için doğru isim.",
       "verb": "docker"
      },
      {
       "task": "İmajı registry'ye gönder.",
       "teach": "docker push = imajı registry'ye yükler; başkaları pull ile çeker. CI/CD'nin de kalbi.",
       "verb": "docker"
      },
      {
       "task": "İmajı/container'ı derinlemesine incele.",
       "teach": "docker inspect = env, mount, network, entrypoint... her şeyin JSON detayı. Debug'ın son durağı.",
       "verb": "docker"
      }
     ],
     "complete": [
      "[Nova]: Paylaş ve incele — bir imajı baştan sona yönetebiliyorsun."
     ]
    },
    {
     "id": "dkq4",
     "title": "Stack Komutası",
     "requires": [
      "dkq3"
     ],
     "xp": 150,
     "credits": 35,
     "badge": "🧹 Compose Commander",
     "brief": [
      "[Nova]: Çok servisli stack'i tek dosyayla yönet, ölçekle, hata ayıkla — ve arkanı temiz bırak."
     ],
     "objectives": [
      {
       "task": "Tüm stack'i compose ile ayağa kaldır.",
       "teach": "docker compose up = compose.yml'deki tüm servisleri (app+db+cache) tek komutla başlatır.",
       "verb": "docker"
      },
      {
       "task": "Bir servisi yatayda ölçekle.",
       "teach": "--scale servis=N = o servisten N kopya çalıştırır. Yükü dağıtmanın compose yolu.",
       "verb": "docker"
      },
      {
       "task": "Bir servisin loglarına bakıp hata ayıkla.",
       "teach": "docker logs / docker compose logs = servisin çıktısını gösterir. İlk teşhis aracı.",
       "verb": "docker"
      },
      {
       "task": "Kullanılmayan imaj/container/ağları temizle.",
       "teach": "docker system prune = boşta duran kaynakları siler; disk ve karmaşayı azaltır. Düzenli yap.",
       "verb": "docker"
      }
     ],
     "complete": [
      "[Nova]: Compose, ölçek, debug ve temizlik — Docker'da artık uzmansın. 🐳"
     ]
    }
   ]
  },
  {
   "id": "terraform",
   "icon": "🌍",
   "title": "Terraform Pro",
   "status": "active",
   "desc": "modül tasarımı, remote state & kilit, drift, CI-güvenli apply",
   "topics": [
    "module tasarımı",
    "remote/locked state",
    "drift",
    "CI apply"
   ],
   "quests": [
    {
     "id": "tfq1",
     "title": "Modül Şeması",
     "requires": [],
     "xp": 140,
     "credits": 35,
     "badge": "🧩 Module Architect",
     "brief": [
      "[Nova]: Kopyala-yapıştır HCL değil, yeniden kullanılabilir modüller. Pro işi budur."
     ],
     "objectives": [
      {
       "task": "Koddaki modülleri indir/güncelle.",
       "teach": "terraform get -update = kaynak koddaki (registry/git/local) modülleri çeker ve günceller.",
       "verb": "terraform"
      },
      {
       "task": "Sağlayıcı/modül bağımlılık ağacını gör.",
       "teach": "terraform providers = hangi modülün hangi provider'a ve sürüme bağlı olduğunu gösterir.",
       "verb": "terraform"
      },
      {
       "task": "Tüm modülleri özyinelemeli biçimlendir.",
       "teach": "terraform fmt -recursive = alt klasörlerdeki tüm modül dosyalarını hizalar.",
       "verb": "terraform"
      },
      {
       "task": "Modül çıktısını makine-okur formatta al.",
       "teach": "terraform output -json = çıktıları JSON verir; başka araç/scriptler tüketebilir.",
       "verb": "terraform"
      }
     ],
     "complete": [
      "[Nova]: Modüller = az tekrar, çok tutarlılık. Altyapın artık lego gibi."
     ]
    },
    {
     "id": "tfq2",
     "title": "Uzak Durum Kilidi",
     "requires": [
      "tfq1"
     ],
     "xp": 150,
     "credits": 35,
     "badge": "🗃️ State Broker",
     "brief": [
      "[Nova]: State laptopunda durmaz. Takımca paylaşılan, kilitli bir remote state şart — yoksa çakışır."
     ],
     "objectives": [
      {
       "task": "State'i uzak backend'e (S3+DynamoDB) taşı/yapılandır.",
       "teach": "terraform init -backend-config=... = state'i S3 gibi paylaşımlı bir backend'e taşır; kilit için DynamoDB.",
       "verb": "terraform"
      },
      {
       "task": "Uzak state'i çek ve incele.",
       "teach": "terraform state pull = remote state'i indirir (JSON). Neyin izlendiğini görürsün.",
       "verb": "terraform"
      },
      {
       "task": "Takılı kalmış bir kilidi (lock) serbest bırak.",
       "teach": "Bir apply çökerse kilit takılı kalır. terraform force-unlock <ID> onu güvenle açar.",
       "verb": "terraform"
      },
      {
       "task": "Bir kaynağı state içinde yeniden adlandır (refactor).",
       "teach": "terraform state mv eski.adres yeni.adres = kaynağı silmeden state'te taşır; refactor'ün anahtarı.",
       "verb": "terraform"
      }
     ],
     "complete": [
      "[Nova]: Remote state ve kilit — takımla güvenle çalışmanın temeli."
     ]
    },
    {
     "id": "tfq3",
     "title": "Drift Tespiti",
     "requires": [
      "tfq2"
     ],
     "xp": 150,
     "credits": 35,
     "badge": "🌊 Drift Catcher",
     "brief": [
      "[Nova]: Birileri konsoldan elle değişiklik yaptı — 'drift'. Yakala, uzlaştır, gerektiğinde nokta atışı müdahale et."
     ],
     "objectives": [
      {
       "task": "Gerçek dünya ile kod arasındaki farkı (drift) tespit et.",
       "teach": "terraform plan -refresh-only = kaynakları uygulamadan yalnız gerçek durumla karşılaştırır. Elle yapılan değişiklikler ortaya çıkar.",
       "verb": "terraform"
      },
      {
       "task": "State'i gerçek durumla uzlaştır.",
       "teach": "terraform apply -refresh-only = kodu değil, state'i gerçeğe eşitler (kaynak değiştirmez).",
       "verb": "terraform"
      },
      {
       "task": "Sadece tek bir kaynağı hedefleyerek planla.",
       "teach": "terraform plan -target=ADRES = büyük altyapıda yalnız o kaynağı ele alır. Dikkatli kullan, geneli maskeler.",
       "verb": "terraform"
      },
      {
       "task": "Mevcut durumu insan-okur biçimde göster.",
       "teach": "terraform show = kaydedilmiş plan ya da güncel state'i okunur biçimde döker.",
       "verb": "terraform"
      }
     ],
     "complete": [
      "[Nova]: Drift'i görüp uzlaştırdın. 'Kod ne diyorsa o' disiplinini koruyorsun."
     ]
    },
    {
     "id": "tfq4",
     "title": "Otonom Apply",
     "requires": [
      "tfq3"
     ],
     "xp": 160,
     "credits": 40,
     "badge": "🤖 Plan Automator",
     "brief": [
      "[Nova]: Pipeline'da 'apply' rulet olmamalı. Planı kaydet, aynısını uygula, kapıları koy."
     ],
     "objectives": [
      {
       "task": "Planı bir dosyaya kaydet (deterministik).",
       "teach": "terraform plan -out=tfplan = planı dosyaya yazar; böylece uygulanan tam olarak onaylanan plandır.",
       "verb": "terraform"
      },
      {
       "task": "Kaydedilen planı birebir uygula.",
       "teach": "terraform apply tfplan = onay istemez, tam o planı uygular. CI için ideal.",
       "verb": "terraform"
      },
      {
       "task": "Biçim kapısı: CI'da formatı zorunlu kıl.",
       "teach": "terraform fmt -check = biçimsiz dosya varsa hata döner (exit != 0). CI'da merge'i engeller.",
       "verb": "terraform"
      },
      {
       "task": "Güvenlik/uyum taraması çalıştır.",
       "teach": "tfsec / checkov / tflint = HCL'de güvenlik açığı ve yanlış yapılandırmayı merge'den önce yakalar.",
       "verb": "tfsec"
      }
     ],
     "complete": [
      "[Nova]: Deterministik plan, biçim ve güvenlik kapıları — altyapını CI'da güvenle sürüyorsun. 🌍"
     ]
    }
   ]
  },
  {
   "id": "ansible",
   "icon": "⚙️",
   "title": "Ansible",
   "status": "active",
   "desc": "envanter, playbook, rol ve vault ile configuration management",
   "topics": [
    "inventory & ad-hoc",
    "playbook & dry-run",
    "rol & tag",
    "vault & idempotency"
   ],
   "quests": [
    {
     "id": "ansq1",
     "title": "Envanter Taraması",
     "requires": [],
     "xp": 120,
     "credits": 25,
     "badge": "📋 Inventory Scout",
     "brief": [
      "[Nova]: 50 sunucuya elle SSH atmak yok. Ansible ajansız çalışır — sadece SSH yeter.",
      "Önce envanteri tanı: kim var, ulaşılabiliyor mu, üzerinde ne dönüyor?"
     ],
     "objectives": [
      {
       "task": "Envanterdeki tüm hostları listele.",
       "teach": "ansible-inventory --list = envanter dosyandaki host ve grupları JSON olarak döker. İlk iş envanteri doğrulamaktır.",
       "verb": "ansible-inventory"
      },
      {
       "task": "Tüm hostlara bağlantı testi yap.",
       "teach": "ansible all -m ping = her hosta 'ping' modülünü çalıştırır (ICMP değil, SSH+Python testi).",
       "verb": "ansible"
      },
      {
       "task": "Bir grupta ad-hoc komut çalıştır.",
       "teach": "ansible <grup> -a \"komut\" = playbook yazmadan tek seferlik komut. Hızlı teşhis için birebir.",
       "verb": "ansible"
      },
      {
       "task": "Hostlardan sistem bilgisi (facts) topla.",
       "teach": "setup modülü = hostun OS, IP, RAM gibi tüm 'facts' bilgisini döndürür. Playbook'larda koşul yazmanın temeli.",
       "verb": "ansible"
      }
     ],
     "complete": [
      "[Nova]: Envanteri tanıdın. Ansible'ın gücü buradan başlar: tek komut, elli sunucu."
     ]
    },
    {
     "id": "ansq2",
     "title": "Playbook Çekirdeği",
     "requires": [
      "ansq1"
     ],
     "xp": 130,
     "credits": 30,
     "badge": "📘 Playbook Author",
     "brief": [
      "[Nova]: Ad-hoc komut geçici. Kalıcı olan playbook: YAML ile 'sistem şöyle olsun' dersin.",
      "Ama prod'a atmadan önce: sözdizimini kontrol et, kuru çalıştır, sonra uygula."
     ],
     "objectives": [
      {
       "task": "Playbook'un sözdizimini kontrol et.",
       "teach": "--syntax-check = YAML ve görev yapısını çalıştırmadan doğrular. İlk kapı budur.",
       "verb": "ansible-playbook"
      },
      {
       "task": "Kuru çalıştır (dry-run): ne değişecek gör.",
       "teach": "--check = hiçbir şeyi değiştirmeden neyin değişeceğini raporlar. Terraform'daki 'plan' gibi.",
       "verb": "ansible-playbook"
      },
      {
       "task": "Sadece tek bir grupta çalıştır.",
       "teach": "--limit <grup> = playbook'u yalnız seçili hostlara uygular. Kademeli yayının (canary) yolu.",
       "verb": "ansible-playbook"
      },
      {
       "task": "Playbook'u gerçekten uygula.",
       "teach": "Kontroller geçtiyse çalıştır. Çıktıdaki ok/changed/failed sayıları sonucu özetler.",
       "verb": "ansible-playbook"
      }
     ],
     "complete": [
      "[Nova]: Syntax → check → limit → apply. Bu dört adım seni gece yarısı felaketinden korur."
     ]
    },
    {
     "id": "ansq3",
     "title": "Rol Mimarisi",
     "requires": [
      "ansq2"
     ],
     "xp": 140,
     "credits": 35,
     "badge": "🧱 Role Builder",
     "brief": [
      "[Nova]: Tek dev playbook bakımı imkânsız hale gelir. Rollere böl — Terraform'daki modül mantığı."
     ],
     "objectives": [
      {
       "task": "Yeni bir rol iskeleti oluştur.",
       "teach": "ansible-galaxy init roles/<ad> = tasks/, handlers/, templates/, defaults/ klasörlerini standart yapıda kurar.",
       "verb": "ansible-galaxy"
      },
      {
       "task": "Dış bağımlılıkları (hazır rolleri) indir.",
       "teach": "requirements.yml içindeki toplulukta yazılmış rolleri indirir. Tekerleği yeniden icat etme.",
       "verb": "ansible-galaxy"
      },
      {
       "task": "Playbook'un yapacağı görevleri listele.",
       "teach": "--list-tasks = çalıştırmadan hangi rolün hangi görevleri koşacağını gösterir. Büyük playbook'u anlamanın yolu.",
       "verb": "ansible-playbook"
      },
      {
       "task": "Sadece belirli etiketli görevleri çalıştır.",
       "teach": "--tags = playbook'un yalnız ilgili kısmını koşturur. 'Sadece config güncelle' demenin yolu.",
       "verb": "ansible-playbook"
      }
     ],
     "complete": [
      "[Nova]: Roller ve etiketler — altyapı kodun artık okunabilir ve parça parça yönetilebilir."
     ]
    },
    {
     "id": "ansq4",
     "title": "Kasa Protokolü",
     "requires": [
      "ansq3"
     ],
     "xp": 150,
     "credits": 35,
     "badge": "🔏 Vault Keeper",
     "brief": [
      "[Nova]: Son iki ders: sırları şifrele, sonra idempotency'yi kanıtla.",
      "Ansible'ın vaadi şu: aynı playbook'u 100 kez çalıştır, sistem hep aynı kalsın."
     ],
     "objectives": [
      {
       "task": "Sır dosyasını şifrele.",
       "teach": "ansible-vault encrypt = parolaları/anahtarları AES ile şifreler; şifreli hâlde repoya koyabilirsin.",
       "verb": "ansible-vault"
      },
      {
       "task": "Şifreli dosyayı çöz(meden) görüntüle.",
       "teach": "ansible-vault view = dosyayı diske çözmeden ekranda gösterir. edit ile de düzenlersin.",
       "verb": "ansible-vault"
      },
      {
       "task": "Vault parolasıyla playbook'u çalıştır.",
       "teach": "--ask-vault-pass (ya da --vault-password-file) = çalışma anında sırları çözer.",
       "verb": "ansible-playbook"
      },
      {
       "task": "Aynı playbook'u tekrar çalıştırıp farkı gör (idempotency).",
       "teach": "--diff = neyin değiştiğini satır satır gösterir. Doğru yazılmış playbook ikinci koşuda changed=0 verir.",
       "verb": "ansible-playbook"
      }
     ],
     "complete": [
      "[Nova]: Şifreli sırlar ve changed=0. Artık configuration management'ı gerçekten anlıyorsun. ⚙️"
     ]
    }
   ]
  },
  {
   "id": "kubernetes",
   "icon": "☸️",
   "title": "Kubernetes",
   "status": "active",
   "desc": "namespace & kota, probe & autoscale, secret & storage, teşhis & Helm",
   "topics": [
    "namespace & kota",
    "probe & HPA",
    "secret & volume",
    "teşhis & Helm"
   ],
   "quests": [
    {
     "id": "k8sq1",
     "title": "İzole Bölge",
     "requires": [],
     "xp": 130,
     "credits": 30,
     "badge": "🏷️ Namespace Ranger",
     "brief": [
      "[Nova]: Temelleri biliyorsun (deployment, service). Şimdi cluster'ı gerçek bir üretim ortamı gibi böl.",
      "Namespace = izolasyon. Kota = bir takımın tüm cluster'ı yemesini engeller."
     ],
     "objectives": [
      {
       "task": "prod için ayrı bir namespace oluştur.",
       "teach": "Namespace = cluster içinde mantıksal bölme. dev/staging/prod aynı cluster'da çakışmadan yaşar.",
       "verb": "kubectl"
      },
      {
       "task": "Namespace'e kaynak kotası koy.",
       "teach": "ResourceQuota = o namespace'in kullanabileceği toplam CPU/RAM/pod sayısını sınırlar. Komşu takımı korur.",
       "verb": "kubectl"
      },
      {
       "task": "Varsayılan namespace'i prod yap.",
       "teach": "Her komuta -n prod yazmak yorucu. set-context ile varsayılanı değiştirirsin (ve yanlış ortama deploy riskini azaltırsın).",
       "verb": "kubectl"
      },
      {
       "task": "Namespace'teki tüm kaynakları listele.",
       "teach": "kubectl get all -n <ns> = o bölgedeki pod/service/deployment'ları tek bakışta gösterir.",
       "verb": "kubectl"
      }
     ],
     "complete": [
      "[Nova]: Cluster'ı böldün ve sınırladın. Çok takımlı ortamın ilk kuralı budur."
     ]
    },
    {
     "id": "k8sq2",
     "title": "Nabız & Ölçek",
     "requires": [
      "k8sq1"
     ],
     "xp": 140,
     "credits": 35,
     "badge": "💓 Health Warden",
     "brief": [
      "[Nova]: Kubernetes senin yerine iyileştirir — ama yalnızca 'sağlıklı' ne demek onu söylersen.",
      "Probe'ları oku, sonra yükü otomatik karşılayacak şekilde ölçeklendir."
     ],
     "objectives": [
      {
       "task": "Pod'un sağlık kontrollerini (probe) incele.",
       "teach": "describe = liveness/readiness probe durumunu, restart sayısını ve olayları gösterir. Pod neden yeniden başlıyor buradan anlaşılır.",
       "verb": "kubectl"
      },
      {
       "task": "Otomatik ölçeklendirme (HPA) kur.",
       "teach": "autoscale = CPU'ya göre replika sayısını otomatik artırır/azaltır. Gece trafiğinde uyumanı sağlar.",
       "verb": "kubectl"
      },
      {
       "task": "HPA'nın durumunu kontrol et.",
       "teach": "get hpa = mevcut/hedef CPU ve replika sayısını gösterir. Ölçeklemenin çalışıp çalışmadığı buradan görülür.",
       "verb": "kubectl"
      },
      {
       "task": "Gerçek kaynak tüketimini ölç.",
       "teach": "kubectl top = pod'ların anlık CPU/bellek kullanımı. Kota ve limit ayarlarken buna bakılır.",
       "verb": "kubectl"
      }
     ],
     "complete": [
      "[Nova]: Sağlık kontrolü + otomatik ölçek = kendi kendini yöneten sistem."
     ]
    },
    {
     "id": "k8sq3",
     "title": "Kasa & Depo",
     "requires": [
      "k8sq2"
     ],
     "xp": 140,
     "credits": 35,
     "badge": "🗝️ Secret Custodian",
     "brief": [
      "[Nova]: ConfigMap'i gördün. Şimdi hassas veri (Secret) ve kalıcı depolama (PVC).",
      "Pod ölür, veri ölmez — bunu garanti altına alacağız."
     ],
     "objectives": [
      {
       "task": "Veritabanı parolası için bir Secret oluştur.",
       "teach": "Secret = hassas veri (parola, token). ConfigMap'ten farkı: base64 saklanır ve erişimi RBAC ile kısıtlanır.",
       "verb": "kubectl"
      },
      {
       "task": "Secret'ları listele (değerleri sızdırmadan).",
       "teach": "get secrets = adları ve türleri gösterir, değerleri değil. Değeri görmek ayrı bir komut ve ayrı bir yetki ister.",
       "verb": "kubectl"
      },
      {
       "task": "Kalıcı depolama talebi (PVC) oluştur.",
       "teach": "PersistentVolumeClaim = 'bana 10Gi disk ver' talebi. Pod silinse de veri kalır.",
       "verb": "kubectl"
      },
      {
       "task": "Depolama talebinin karşılandığını doğrula.",
       "teach": "get pvc = talebin Bound (bağlandı) mı Pending mi olduğunu gösterir. Pending kalırsa StorageClass sorunu vardır.",
       "verb": "kubectl"
      }
     ],
     "complete": [
      "[Nova]: Sırlar korunuyor, veri kalıcı. Stateful iş yükleri artık güvende."
     ]
    },
    {
     "id": "k8sq4",
     "title": "Teşhis Ağı",
     "requires": [
      "k8sq3"
     ],
     "xp": 160,
     "credits": 40,
     "badge": "⛵ Helm Navigator",
     "brief": [
      "[Nova]: Son ders: bir şey bozulduğunda nasıl teşhis edersin, ve tüm bunları nasıl paketlersin (Helm)."
     ],
     "objectives": [
      {
       "task": "Cluster olaylarını zaman sırasına göre incele.",
       "teach": "events = 'neden bu pod başlamadı?' sorusunun cevabı. OOMKilled, ImagePullBackOff gibi gerçek sebepler burada.",
       "verb": "kubectl"
      },
      {
       "task": "Çalışan pod'un içine girip kontrol et.",
       "teach": "kubectl exec = container içinde komut çalıştırır. Config gerçekten mount olmuş mu, DNS çözülüyor mu — canlı bakarsın.",
       "verb": "kubectl"
      },
      {
       "task": "Servisi lokal makinene yönlendir.",
       "teach": "port-forward = cluster içindeki servisi localhost'a bağlar. Ingress kurmadan hızlıca test etmenin yolu.",
       "verb": "kubectl"
      },
      {
       "task": "Uygulamayı Helm chart'ı olarak kur.",
       "teach": "Helm = Kubernetes'in paket yöneticisi. Onlarca YAML yerine tek chart + değer dosyası; sürümleme ve rollback hazır gelir.",
       "verb": "helm"
      }
     ],
     "complete": [
      "[Nova]: Teşhis refleksin ve Helm'in var. Cluster artık sana yabancı değil. ☸️"
     ]
    }
   ]
  }
 ],
 "shop": [
  {
   "id": 1,
   "name": "Espresso Shot",
   "icon": "☕",
   "cost": 40,
   "desc": "anlık +30 XP",
   "effect": {
    "xp": 30
   }
  },
  {
   "id": 2,
   "name": "'Cloud Ninja' ünvanı",
   "icon": "🎖️",
   "cost": 150,
   "desc": "kalıcı rozet",
   "effect": {
    "badge": "🥷 Cloud Ninja"
   }
  },
  {
   "id": 3,
   "name": "Mentor Tavsiyesi",
   "icon": "🧠",
   "cost": 60,
   "desc": "sonraki 3 quest ipucu bedava",
   "effect": {
    "freeHints": 3
   }
  }
 ]
};
const CHAPTERS = CQ_DATA.chapters;
const TRACKS   = CQ_DATA.tracks;
const QUESTS   = CQ_DATA.quests;
const MODULES  = CQ_DATA.modules;
const SHOP     = CQ_DATA.shop;
const STORY    = CQ_DATA.story;
