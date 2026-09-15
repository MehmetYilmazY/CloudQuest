/* ======================================================================
   AUTO-GENERATED from data/curriculum.json (+ data/i18n/*) — DO NOT EDIT.
   Uret: npm run build

   Komut kontrolu TARAYICIDA yapilir (anlik geri bildirim), bu yuzden
   'expect' spec'leri ve 'success' ciktilari burada. 'hint' (dogru komutun
   metni) BURADA DEGIL — sunucudan istenir. Odulu de sunucu verir
   (supabase/functions/game).

   Her dil icin AYRI bir tam kopya uretilir. Calisma zamaninda birlestirme
   yok: oyun hangi dilde acilirsa acilsin tek bir nesneyi okur, boylece
   "yari cevrilmis obje" gibi bir ara durum hic olusmaz. Yapinin tek
   kaynagi yine data/curriculum.json — kopyalari bu script uretir.
   ====================================================================== */
const CQ_BUNDLES = {
 "tr": {
 "_meta": {
  "note": "AUTO-GENERATED. Komut kontrolu tarayicida (expect burada). Ipucu metni (hint) sunucuda; odul supabase/functions/game tarafindan verilir."
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
     "verb": "pwd",
     "expect": {
      "cmd": [
       "pwd"
      ]
     },
     "success": "/home/engineer dizinindesin."
    },
    {
     "task": "Bu dizindeki dosyaları listele.",
     "teach": "ls komutu dizindeki dosya/klasörleri gösterir (Windows'ta dir).",
     "verb": "ls",
     "expect": {
      "cmd": [
       "ls|dir"
      ]
     },
     "success": "Görünenler:  deploy/   logs/   README.md"
    },
    {
     "task": "README.md dosyasını oku.",
     "teach": "cat <dosya> = dosya içeriğini ekrana basar. Bir sunucuda ilk iş: notları oku.",
     "verb": "cat",
     "expect": {
      "cmd": [
       "cat|less|more|head"
      ],
      "need": [
       "README.md"
      ]
     },
     "success": "README: 'Workspace dağınık — önce dosyaları düzenle, sonra deploy et.'"
    },
    {
     "task": "logs klasörüne gir.",
     "teach": "cd = change directory. Klasörler arasında böyle gezersin.",
     "verb": "cd",
     "expect": {
      "cmd": [
       "cd"
      ],
      "need": [
       "logs|logs/"
      ]
     },
     "success": "logs/ içindesin. İçini birazdan kurcalayacağız."
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
     "verb": "cd",
     "expect": {
      "cmd": [
       "cd"
      ],
      "need": [
       "..|~"
      ]
     },
     "success": "Ana dizine döndün: /home/engineer"
    },
    {
     "task": "release adında yeni bir klasör oluştur.",
     "teach": "mkdir <ad> = make directory. Yayınlanacak dosyalar için düzenli yer.",
     "verb": "mkdir",
     "expect": {
      "cmd": [
       "mkdir"
      ],
      "need": [
       "re:.+"
      ]
     },
     "success": "release/ klasörü oluştu."
    },
    {
     "task": "Bir dosyayı release klasörüne kopyala (veya taşı).",
     "teach": "cp <kaynak> <hedef> kopyalar, mv taşır/yeniden adlandırır.",
     "verb": "cp",
     "expect": {
      "cmd": [
       "cp|mv"
      ],
      "need": [
       "re:.+",
       "re:.+"
      ]
     },
     "success": "app.jar release/ içine kopyalandı."
    },
    {
     "task": "Gereksiz geçici dosyayı sil.",
     "teach": "rm <dosya> = sil. DİKKAT: Linux'ta geri dönüşüm kutusu yoktur, kalıcıdır!",
     "verb": "rm",
     "expect": {
      "cmd": [
       "rm"
      ],
      "need": [
       "re:.+"
      ]
     },
     "success": "Geçici dosya silindi. Düzen tamam."
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
     "verb": "tail",
     "expect": {
      "cmd": [
       "tail"
      ],
      "need": [
       "re:.+"
      ]
     },
     "success": "Son satırlar çok kalabalık — filtrelemek lazım."
    },
    {
     "task": "Loglarda 'error' geçen satırları filtrele.",
     "teach": "grep <desen> <dosya> = içinde deseni geçen satırları süzer. Log okumanın kalbi.",
     "verb": "grep",
     "expect": {
      "cmd": [
       "grep"
      ],
      "need": [
       "re:.+"
      ]
     },
     "success": "grep buldu: 'Permission denied: deploy.sh'"
    },
    {
     "task": "deploy.sh dosyasının yerini bul.",
     "teach": "find <yer> -name <ad> = dosya sisteminde arar. Nerede olduğunu bilmediğinde kullan.",
     "verb": "find",
     "expect": {
      "cmd": [
       "find"
      ],
      "need": [
       "re:.+"
      ]
     },
     "success": "Bulundu: ./deploy/deploy.sh"
    },
    {
     "task": "Hata kaç kez tekrarlanmış say.",
     "teach": "wc -l = satır sayar; grep -c = eşleşme sayar. Sorunun büyüklüğünü ölçmek önemli.",
     "verb": "grep",
     "expect": {
      "anyOf": [
       {
        "cmd": [
         "wc"
        ],
        "need": [
         "-l"
        ]
       },
       {
        "cmd": [
         "grep"
        ],
        "need": [
         "-c"
        ]
       }
      ]
     },
     "success": "12 kez! Kök neden kesin: izin sorunu. Sıradaki quest çözecek."
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
     "verb": "ls",
     "expect": {
      "cmd": [
       "ls"
      ],
      "need": [
       "re:^-l"
      ]
     },
     "success": "deploy.sh satırında x (execute) izni eksik: -rw-r--r--"
    },
    {
     "task": "deploy.sh dosyasına çalıştırma izni ver.",
     "teach": "chmod +x <dosya> = execute izni ekler. chmod = change mode.",
     "verb": "chmod",
     "expect": {
      "cmd": [
       "chmod"
      ],
      "need": [
       "re:^(\\+x|u\\+x|a\\+x|[0-7]{3})$",
       "deploy.sh"
      ]
     },
     "success": "İzin verildi: -rwxr-xr-x"
    },
    {
     "task": "Script'i çalıştır.",
     "teach": "./script = bulunduğun dizindeki script'i çalıştırır.",
     "verb": "./deploy.sh",
     "expect": {
      "cmd": [
       "./deploy.sh"
      ]
     },
     "success": ">> Deploying... OK. Prod ayakta!"
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
     "verb": "ps",
     "expect": {
      "anyOf": [
       {
        "cmd": [
         "ps"
        ]
       },
       {
        "cmd": [
         "top"
        ]
       }
      ]
     },
     "success": "PID 4711  node  99% CPU — işte kaçak süreç."
    },
    {
     "task": "4711 numaralı süreci sonlandır.",
     "teach": "kill <PID> süreci durdurur. Direnirse kill -9 <PID> zorlar (process signals).",
     "verb": "kill",
     "expect": {
      "cmd": [
       "kill"
      ],
      "need": [
       "4711"
      ]
     },
     "success": "Süreç sonlandı. CPU normale döndü."
    },
    {
     "task": "Disk doluluğunu kontrol et.",
     "teach": "df -h = diskteki boş/dolu alanı insan-okur birimlerde gösterir (server review).",
     "verb": "df",
     "expect": {
      "cmd": [
       "df"
      ]
     },
     "success": "Disk %64 dolu. Sorun yok. Sistem sağlıklı."
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
     "verb": "sudo",
     "expect": {
      "cmd": [
       "apt|apt-get|yum|dnf",
       "install"
      ],
      "need": [
       "re:.+"
      ]
     },
     "success": "htop kuruldu."
    },
    {
     "task": "nginx servisini başlat.",
     "teach": "systemctl start <servis> = servisi başlatır; enable = açılışta otomatik başlatır.",
     "verb": "sudo",
     "expect": {
      "cmd": [
       "systemctl",
       "start|enable|restart"
      ],
      "need": [
       "re:.+"
      ]
     },
     "success": "nginx servisi çalışıyor."
    },
    {
     "task": "Servisin durumunu kontrol et.",
     "teach": "systemctl status <servis> = çalışıyor mu, loglar ne diyor gösterir.",
     "verb": "systemctl",
     "expect": {
      "cmd": [
       "systemctl",
       "status"
      ],
      "need": [
       "re:.+"
      ]
     },
     "success": "active (running). Sağlıklı."
    },
    {
     "task": "Bir ortam değişkeni ayarla.",
     "teach": "export AD=değer = ortam değişkeni tanımlar. Uygulamalar config'i böyle okur (env/PATH).",
     "verb": "export",
     "expect": {
      "cmd": [
       "export"
      ],
      "need": [
       "re:.+=.*"
      ]
     },
     "success": "APP_ENV=prod ayarlandı. Uygulama doğru moda geçti. Ch1 tamam! 🎉"
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
     "verb": "ping",
     "expect": {
      "cmd": [
       "ping"
      ],
      "need": [
       "re:.+"
      ]
     },
     "success": "Cevap var ama isim çözülemiyor gibi... DNS?"
    },
    {
     "task": "Alan adının DNS kaydını sorgula.",
     "teach": "dig / nslookup = DNS'in host'u hangi IP'ye çevirdiğini gösterir (DNS resolution).",
     "verb": "nslookup",
     "expect": {
      "cmd": [
       "dig|nslookup|host"
      ],
      "need": [
       "re:.+"
      ]
     },
     "success": "DNS doğru IP'yi veriyor. Peki servis cevap veriyor mu?"
    },
    {
     "task": "HTTP servisine curl ile istek at.",
     "teach": "curl <URL> = komut satırından HTTP isteği. API test etmenin ekmek-suyu.",
     "verb": "curl",
     "expect": {
      "cmd": [
       "curl"
      ],
      "need": [
       "re:.+"
      ]
     },
     "success": "200 OK! Meğer security group 443'ü kapatıyormuş. Çözüldü."
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
     "verb": "traceroute",
     "expect": {
      "cmd": [
       "traceroute|tracert|mtr"
      ],
      "need": [
       "re:.+"
      ]
     },
     "success": "5. hop'ta gecikme var — ağ yolu artık görünür."
    },
    {
     "task": "Açık portları / dinleyen servisleri listele.",
     "teach": "ss -tulpn (veya netstat) = hangi port hangi servisçe dinleniyor gösterir.",
     "verb": "ss",
     "expect": {
      "cmd": [
       "ss|netstat"
      ]
     },
     "success": "Servis :8080'de dinliyor. Port açık."
    },
    {
     "task": "Sunucuya SSH ile bağlan.",
     "teach": "ssh kullanıcı@host = uzak sunucuya güvenli bağlantı. Cloud'un günlük işi budur.",
     "verb": "ssh",
     "expect": {
      "cmd": [
       "ssh"
      ],
      "need": [
       "re:.+"
      ]
     },
     "success": "Sunucudasın. Uzaktan yönetim aktif."
    },
    {
     "task": "Bir config dosyasını sunucuya gönder.",
     "teach": "scp <yerel> kullanıcı@host:<yol> = SSH üzerinden güvenli dosya kopyalar.",
     "verb": "scp",
     "expect": {
      "cmd": [
       "scp"
      ],
      "need": [
       "re:.+",
       "re:.+"
      ]
     },
     "success": "config gönderildi. Bağlantı tamamen çözüldü."
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
     "verb": "git",
     "expect": {
      "cmd": [
       "git",
       "clone"
      ],
      "need": [
       "re:.+"
      ]
     },
     "success": "Repo indirildi."
    },
    {
     "task": "Yeni bir feature branch aç.",
     "teach": "git checkout -b <ad> ya da git switch -c <ad> = yeni dal oluştur + geç.",
     "verb": "git",
     "expect": {
      "cmd": [
       "git",
       "checkout|switch"
      ],
      "need": [
       "-b|-c",
       "re:.+"
      ]
     },
     "success": "fix/timeout branch'indesin."
    },
    {
     "task": "Değişikliklerini commit'le (mesajlı).",
     "teach": "git add . sonra git commit -m 'mesaj' = anlık kaydı oluşturur.",
     "verb": "git",
     "expect": {
      "cmd": [
       "git",
       "commit"
      ]
     },
     "success": "Commit oluştu."
    },
    {
     "task": "Branch'i uzak repoya gönder.",
     "teach": "git push = commit'leri uzak repoya yollar. Sonra PR açarsın.",
     "verb": "git",
     "expect": {
      "cmd": [
       "git",
       "push"
      ]
     },
     "success": "Push edildi. PR açmaya hazır!"
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
     "verb": "git",
     "expect": {
      "cmd": [
       "git",
       "status"
      ]
     },
     "success": "2 değişmiş, 1 yeni dosya. Durum net."
    },
    {
     "task": "Yaptığın değişiklikleri satır satır incele.",
     "teach": "git diff = son commit'ten bu yana değişen satırları gösterir.",
     "verb": "git",
     "expect": {
      "cmd": [
       "git",
       "diff"
      ]
     },
     "success": "Değişiklikleri gördün — sürprizsiz commit."
    },
    {
     "task": "Commit geçmişini görüntüle.",
     "teach": "git log --oneline = geçmiş commit'leri özet listeler. Kim ne zaman ne yapmış.",
     "verb": "git",
     "expect": {
      "cmd": [
       "git",
       "log"
      ]
     },
     "success": "Son commit'ler ekranda. İşte zaman makinesi."
    },
    {
     "task": "Takımın son değişikliklerini çek.",
     "teach": "git pull = uzak repodaki yeni commit'leri lokale getirir + birleştirir.",
     "verb": "git",
     "expect": {
      "cmd": [
       "git",
       "pull"
      ]
     },
     "success": "Takımın değişiklikleri geldi. Güncelsin."
    },
    {
     "task": "Bir branch'i mevcut dala birleştir.",
     "teach": "git merge <branch> = başka bir dalın değişikliklerini birleştirir.",
     "verb": "git",
     "expect": {
      "cmd": [
       "git",
       "merge"
      ],
      "need": [
       "re:.+"
      ]
     },
     "success": "Branch birleşti. FUNDAMENTALS tamamlandı! 🎓"
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
     "verb": "aws",
     "expect": {
      "cmd": [
       "aws",
       "configure"
      ]
     },
     "success": "Credentials ayarlandı (region: eu-central-1)."
    },
    {
     "task": "Uygulama için sınırlı yetkili bir IAM kullanıcısı oluştur.",
     "teach": "IAM user = bir kimlik. Kök (root) hesabı asla günlük işte kullanma.",
     "verb": "aws",
     "expect": {
      "cmd": [
       "aws",
       "iam",
       "create-user"
      ]
     },
     "success": "app-bot kullanıcısı hazır."
    },
    {
     "task": "Kullanıcıya SADECE ihtiyaç duyduğu izni ver (policy).",
     "teach": "Policy = izin belgesi. Least privilege: mümkün olan en az yetki, en az risk.",
     "verb": "aws",
     "expect": {
      "cmd": [
       "aws",
       "iam",
       "attach-user-policy"
      ]
     },
     "success": "S3 salt-okuma izni verildi. Fazlası yok."
    },
    {
     "task": "Servislerin birbirine güvenli erişmesi için bir rol (role) oluştur.",
     "teach": "Role = kimlik ödünç verme. EC2, anahtar saklamadan S3'e rol ile erişir.",
     "verb": "aws",
     "expect": {
      "cmd": [
       "aws",
       "iam",
       "create-role"
      ]
     },
     "success": "Rol hazır. Sunucular artık anahtar taşımadan erişecek."
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
     "verb": "aws",
     "expect": {
      "cmd": [
       "aws",
       "ec2",
       "create-vpc"
      ]
     },
     "success": "VPC oluştu: vpc-0a1b2c"
    },
    {
     "task": "VPC içinde bir public subnet oluştur.",
     "teach": "Subnet = VPC'nin bir dilimi. Public subnet internete açılır, private açılmaz.",
     "verb": "aws",
     "expect": {
      "cmd": [
       "aws",
       "ec2",
       "create-subnet"
      ]
     },
     "success": "Subnet hazır: subnet-0d4e5f"
    },
    {
     "task": "İnternet geçidi (Internet Gateway) oluştur.",
     "teach": "Internet Gateway = VPC'yi internete bağlar. Olmadan dışarı çıkamazsın.",
     "verb": "aws",
     "expect": {
      "cmd": [
       "aws",
       "ec2",
       "create-internet-gateway"
      ]
     },
     "success": "IGW oluştu. Ağ dışarıya açılabilir."
    },
    {
     "task": "Trafiği kontrol eden bir security group (firewall) oluştur.",
     "teach": "Security Group = sunucu seviyesinde güvenlik duvarı. Hangi port kime açık, sen belirlersin.",
     "verb": "aws",
     "expect": {
      "cmd": [
       "aws",
       "ec2",
       "create-security-group"
      ]
     },
     "success": "web-sg hazır. Ağ katmanı tamam."
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
     "verb": "aws",
     "expect": {
      "cmd": [
       "aws",
       "ec2",
       "create-key-pair"
      ]
     },
     "success": "cq-key oluşturuldu. Private key'i kaydet."
    },
    {
     "task": "t3.micro tipinde bir EC2 sunucusu başlat (Free Tier).",
     "teach": "Instance type = CPU/RAM boyutu. t3.micro Free Tier'a uygundur.",
     "verb": "aws",
     "expect": {
      "cmd": [
       "aws",
       "ec2",
       "run-instances"
      ]
     },
     "success": "EC2 çalışıyor: i-0abc123"
    },
    {
     "task": "Çalışan instance'ları kontrol et.",
     "teach": "describe-instances = durumu ve IP'yi gösterir. 'running' olmalı.",
     "verb": "aws",
     "expect": {
      "cmd": [
       "aws",
       "ec2",
       "describe-instances"
      ]
     },
     "success": "i-0abc123 running. Sunucu ayakta."
    },
    {
     "task": "Sabit bir genel IP (Elastic IP) ayır.",
     "teach": "Elastic IP = sunucu yeniden başlasa da değişmeyen sabit genel IP.",
     "verb": "aws",
     "expect": {
      "cmd": [
       "aws",
       "ec2",
       "allocate-address"
      ]
     },
     "success": "Elastic IP ayrıldı. Adres artık sabit."
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
     "verb": "aws",
     "expect": {
      "cmd": [
       "aws",
       "s3",
       "mb"
      ],
      "need": [
       "re:^s3://.+"
      ]
     },
     "success": "Bucket oluşturuldu."
    },
    {
     "task": "Bir dosyayı bucket'a yükle.",
     "teach": "aws s3 cp <kaynak> <hedef> = kopyala/yükle.",
     "verb": "aws",
     "expect": {
      "cmd": [
       "aws",
       "s3",
       "cp"
      ],
      "need": [
       "re:.+",
       "re:^s3://.+"
      ]
     },
     "success": "Dosya yüklendi. Statik site yayında!"
    },
    {
     "task": "Bucket'ta versioning'i aç (kazara silme koruması).",
     "teach": "Versioning = her sürümü saklar; yanlış silersen geri alırsın. Storage class (Standard/IA/Glacier) maliyeti ayarlar.",
     "verb": "aws",
     "expect": {
      "cmd": [
       "aws",
       "s3api",
       "put-bucket-versioning"
      ]
     },
     "success": "Versioning açık. Artık silmeler geri alınabilir."
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
     "verb": "aws",
     "expect": {
      "cmd": [
       "aws",
       "rds",
       "create-db-instance"
      ]
     },
     "success": "RDS oluşturuluyor: cq-db"
    },
    {
     "task": "Veritabanının durumunu kontrol et.",
     "teach": "describe-db-instances = 'available' olunca bağlanmaya hazır demektir.",
     "verb": "aws",
     "expect": {
      "cmd": [
       "aws",
       "rds",
       "describe-db-instances"
      ]
     },
     "success": "cq-db available. Bağlanmaya hazır."
    },
    {
     "task": "Kullanmadığın veritabanını durdur (Free Tier / maliyet).",
     "teach": "Boşta duran DB para yakar. Kullanmadığında stop et — bir engineer'ın maliyet refleksi.",
     "verb": "aws",
     "expect": {
      "cmd": [
       "aws",
       "rds",
       "stop-db-instance"
      ]
     },
     "success": "cq-db durduruldu. Fatura kontrol altında. Cloud Core tamam! 🎉"
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
     "verb": "terraform",
     "expect": {
      "cmd": [
       "terraform",
       "init"
      ]
     },
     "success": "Terraform initialized. AWS provider indirildi."
    },
    {
     "task": "Kodu standart biçime sok.",
     "teach": "terraform fmt = HCL dosyalarını otomatik hizalar. Takımda tutarlılık sağlar.",
     "verb": "terraform",
     "expect": {
      "cmd": [
       "terraform",
       "fmt"
      ]
     },
     "success": "main.tf biçimlendirildi."
    },
    {
     "task": "Kodun geçerliliğini doğrula.",
     "teach": "terraform validate = sözdizimi ve tutarlılık kontrolü (uygulamadan).",
     "verb": "terraform",
     "expect": {
      "cmd": [
       "terraform",
       "validate"
      ]
     },
     "success": "Success! Configuration is valid."
    },
    {
     "task": "Ne olacağını önizle.",
     "teach": "terraform plan = UYGULAMADAN ne değişeceğini gösterir. Her zaman önce plan.",
     "verb": "terraform",
     "expect": {
      "cmd": [
       "terraform",
       "plan"
      ]
     },
     "success": "Plan: 3 to add, 0 to change, 0 to destroy."
    },
    {
     "task": "Altyapıyı uygula.",
     "teach": "terraform apply = planı gerçeğe çevirir.",
     "verb": "terraform",
     "expect": {
      "cmd": [
       "terraform",
       "apply"
      ]
     },
     "success": "Apply complete! 3 kaynak oluştu — tıklama yok, tekrar üretilebilir."
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
     "verb": "terraform",
     "expect": {
      "cmd": [
       "terraform",
       "plan"
      ],
      "need": [
       "re:^-var"
      ]
     },
     "success": "3 instance planlandı. Kod artık esnek."
    },
    {
     "task": "Ortama özel değişken dosyasıyla uygula.",
     "teach": "prod.tfvars gibi dosyalar ortam bazlı değerleri taşır (-var-file).",
     "verb": "terraform",
     "expect": {
      "cmd": [
       "terraform",
       "apply"
      ],
      "need": [
       "re:^-var-file"
      ]
     },
     "success": "prod değerleriyle uygulandı."
    },
    {
     "task": "Oluşan değerleri (IP, URL) göster.",
     "teach": "output = altyapının döndürdüğü değerler. terraform output ile okunur.",
     "verb": "terraform",
     "expect": {
      "cmd": [
       "terraform",
       "output"
      ]
     },
     "success": "instance_ip = 3.120.x.x. Çıktılar hazır."
    },
    {
     "task": "İfadeleri interaktif değerlendir.",
     "teach": "terraform console = HCL ifadelerini/değişkenleri denemek için REPL.",
     "verb": "terraform",
     "expect": {
      "cmd": [
       "terraform",
       "console"
      ]
     },
     "success": "> var.region -> 'eu-central-1'. Konsol çalışıyor."
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
     "verb": "terraform",
     "expect": {
      "cmd": [
       "terraform",
       "state",
       "list"
      ]
     },
     "success": "aws_instance.web, aws_s3_bucket.assets ... listelendi."
    },
    {
     "task": "Bir kaynağın detayını incele.",
     "teach": "terraform state show <adres> = tek kaynağın tüm alanlarını gösterir.",
     "verb": "terraform",
     "expect": {
      "cmd": [
       "terraform",
       "state",
       "show"
      ],
      "need": [
       "re:.+"
      ]
     },
     "success": "web instance'ının tüm nitelikleri ekranda."
    },
    {
     "task": "Elle oluşturulmuş bir kaynağı Terraform'a al.",
     "teach": "terraform import = mevcut (elle açılmış) kaynağı state'e ekler; yeniden oluşturmadan yönetime alır.",
     "verb": "terraform",
     "expect": {
      "cmd": [
       "terraform",
       "import"
      ],
      "need": [
       "re:.+",
       "re:.+"
      ]
     },
     "success": "Eski bucket artık Terraform yönetiminde."
    },
    {
     "task": "Bozuk bir kaynağı yeniden oluştur.",
     "teach": "terraform apply -replace=<adres> = tek kaynağı silip yeniden yaratır (eski adı: taint).",
     "verb": "terraform",
     "expect": {
      "cmd": [
       "terraform",
       "apply"
      ],
      "need": [
       "re:^-replace"
      ]
     },
     "success": "web instance yeniden oluşturuldu."
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
     "verb": "terraform",
     "expect": {
      "cmd": [
       "terraform",
       "get"
      ]
     },
     "success": "vpc ve ec2 modülleri indirildi."
    },
    {
     "task": "Ayrı bir ortam (workspace) oluştur.",
     "teach": "Workspace = aynı kodla izole state'ler (dev/prod). terraform workspace new prod.",
     "verb": "terraform",
     "expect": {
      "cmd": [
       "terraform",
       "workspace",
       "new"
      ],
      "need": [
       "re:.+"
      ]
     },
     "success": "prod workspace oluşturuldu ve geçildi."
    },
    {
     "task": "Bağımlılık grafiğini üret.",
     "teach": "terraform graph = kaynakların bağımlılık grafiğini (DOT) verir. Ne neye bağlı görürsün.",
     "verb": "terraform",
     "expect": {
      "cmd": [
       "terraform",
       "graph"
      ]
     },
     "success": "Bağımlılık grafiği üretildi."
    },
    {
     "task": "Her şeyi tek komutla yık (maliyet!).",
     "teach": "terraform destroy = oluşturulan her şeyi siler. Test sonrası temizlik = maliyet kontrolü.",
     "verb": "terraform",
     "expect": {
      "cmd": [
       "terraform",
       "destroy"
      ]
     },
     "success": "Destroy complete! Kaynaklar silindi. IaC modülü tamam! 🎉"
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
     "verb": "docker",
     "expect": {
      "cmd": [
       "docker",
       "build"
      ]
     },
     "success": "Image built: myapp:1.0"
    },
    {
     "task": "Image'den bir container çalıştır.",
     "teach": "docker run = image'i ayağa kaldırır. -p ile port yayınlarsın.",
     "verb": "docker",
     "expect": {
      "cmd": [
       "docker",
       "run"
      ]
     },
     "success": "Container ayakta, :8080'de yayında."
    },
    {
     "task": "Çalışan container'ları listele.",
     "teach": "docker ps = çalışan container'ları gösterir.",
     "verb": "docker",
     "expect": {
      "cmd": [
       "docker",
       "ps"
      ]
     },
     "success": "1 container çalışıyor. Sağlıklı."
    },
    {
     "task": "Tüm stack'i compose ile ayağa kaldır.",
     "teach": "docker compose up = birden fazla servisi (app+db) tek komutla başlatır.",
     "verb": "docker",
     "expect": {
      "anyOf": [
       {
        "cmd": [
         "docker",
         "compose",
         "up"
        ]
       },
       {
        "cmd": [
         "docker-compose",
         "up"
        ]
       }
      ]
     },
     "success": "app + db birlikte ayakta. Full stack container'da!"
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
     "verb": "docker",
     "expect": {
      "cmd": [
       "docker",
       "exec"
      ]
     },
     "success": "Container'ın içindesin: / #"
    },
    {
     "task": "Kalıcı veri için bir volume oluştur.",
     "teach": "Container fs'i geçicidir (ephemeral) — silinince veri gider. Volume = kalıcı depo.",
     "verb": "docker",
     "expect": {
      "cmd": [
       "docker",
       "volume",
       "create"
      ],
      "need": [
       "re:.+"
      ]
     },
     "success": "appdata volume'ü hazır. Veri artık container'dan bağımsız."
    },
    {
     "task": "İmajı registry için etiketle (tag).",
     "teach": "docker tag <imaj> <registry/kullanıcı/ad:etiket> = registry'ye push için isimlendirir.",
     "verb": "docker",
     "expect": {
      "cmd": [
       "docker",
       "tag"
      ],
      "need": [
       "re:.+",
       "re:.+"
      ]
     },
     "success": "İmaj etiketlendi: mehmet/myapp:1.0"
    },
    {
     "task": "İmajı registry'ye gönder (push).",
     "teach": "docker push = imajı DockerHub/ECR gibi registry'ye yükler; başkaları 'pull' ile çeker.",
     "verb": "docker",
     "expect": {
      "cmd": [
       "docker",
       "push"
      ],
      "need": [
       "re:.+"
      ]
     },
     "success": "Push tamam. İmaj artık her yerden erişilebilir."
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
     "verb": "kubectl",
     "expect": {
      "cmd": [
       "kubectl",
       "get",
       "nodes"
      ]
     },
     "success": "2 node hazır (Ready)."
    },
    {
     "task": "Bir deployment oluştur.",
     "teach": "kubectl create deployment <ad> --image=<img> = uygulamayı deploy eder.",
     "verb": "kubectl",
     "expect": {
      "cmd": [
       "kubectl",
       "create",
       "deployment"
      ],
      "need": [
       "re:.+"
      ]
     },
     "success": "deployment.apps/web created"
    },
    {
     "task": "Çalışan pod'ları görüntüle.",
     "teach": "kubectl get pods = ayağa kalkan pod'ları listeler.",
     "verb": "kubectl",
     "expect": {
      "cmd": [
       "kubectl",
       "get",
       "pods"
      ]
     },
     "success": "web-xxxx  1/1  Running. Uygulama ayakta."
    },
    {
     "task": "Deployment'ı bir Service ile dışarı aç.",
     "teach": "Service = pod'lara sabit erişim + load balancing. Pod'lar gelip gitse de Service sabittir.",
     "verb": "kubectl",
     "expect": {
      "cmd": [
       "kubectl",
       "expose"
      ],
      "need": [
       "re:.+"
      ]
     },
     "success": "service/web açıldı. Trafik artık dağıtılıyor."
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
     "verb": "kubectl",
     "expect": {
      "cmd": [
       "kubectl",
       "scale"
      ],
      "need": [
       "re:replicas=?\\d|^\\d+$"
      ]
     },
     "success": "3 replika çalışıyor. Dayanıklılık arttı."
    },
    {
     "task": "Yapılandırmayı ConfigMap ile enjekte et.",
     "teach": "ConfigMap = koddan ayrı yapılandırma (ENV, ayarlar). Hassas veriler için Secret kullanılır.",
     "verb": "kubectl",
     "expect": {
      "cmd": [
       "kubectl",
       "create",
       "configmap"
      ],
      "need": [
       "re:.+"
      ]
     },
     "success": "app-config oluşturuldu. Config koddan ayrıldı."
    },
    {
     "task": "Hatalı sürümü geri al (rollback).",
     "teach": "kubectl rollout = rolling update/rollback yönetir. undo ile bir önceki sağlam sürüme dönersin.",
     "verb": "kubectl",
     "expect": {
      "cmd": [
       "kubectl",
       "rollout"
      ],
      "need": [
       "undo|status|history|restart"
      ]
     },
     "success": "Önceki sürüme dönüldü. Kesinti yok."
    },
    {
     "task": "Bir pod'un loglarına bakıp hata ayıkla.",
     "teach": "kubectl logs <pod> = pod loglarını gösterir. describe ile de olayları/nedeni görürsün.",
     "verb": "kubectl",
     "expect": {
      "cmd": [
       "kubectl",
       "logs"
      ],
      "need": [
       "re:.+"
      ]
     },
     "success": "Loglar ekranda. Kök nedene indin. Containers modülü tamam! 🎉"
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
     "verb": "mkdir",
     "expect": {
      "cmd": [
       "mkdir"
      ],
      "need": [
       "re:\\.github/workflows"
      ]
     },
     "success": ".github/workflows/ oluşturuldu."
    },
    {
     "task": "Projeyi derle (build).",
     "teach": "CI'ın ilk adımı derlemedir. Derlenmiyorsa test bile edilmez — hızlı geri bildirim.",
     "verb": "npm",
     "expect": {
      "anyOf": [
       {
        "cmd": [
         "npm",
         "run",
         "build"
        ]
       },
       {
        "cmd": [
         "make",
         "build"
        ]
       },
       {
        "cmd": [
         "docker",
         "build"
        ]
       }
      ]
     },
     "success": "Build başarılı. Artefakt hazır."
    },
    {
     "task": "Testleri lokalde çalıştır (pipeline'a koymadan önce).",
     "teach": "CI'ın kalbi testtir. Önce lokalde geçmeli: npm test / pytest vb.",
     "verb": "npm",
     "expect": {
      "anyOf": [
       {
        "cmd": [
         "npm",
         "test"
        ]
       },
       {
        "cmd": [
         "npm",
         "run",
         "test"
        ]
       },
       {
        "cmd": [
         "pytest"
        ]
       },
       {
        "cmd": [
         "make",
         "test"
        ]
       }
      ]
     },
     "success": "Tüm testler geçti (12 passed)."
    },
    {
     "task": "Workflow'u commit'leyip push'la (pipeline tetiklensin).",
     "teach": "Push, workflow'u tetikler. GitHub sunucularında build + test otomatik koşar.",
     "verb": "git",
     "expect": {
      "cmd": [
       "git",
       "push"
      ]
     },
     "success": "Actions tetiklendi: build ✔ test ✔. Yeşil pipeline!"
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
     "verb": "gh",
     "expect": {
      "cmd": [
       "gh",
       "secret",
       "set"
      ],
      "need": [
       "re:.+"
      ]
     },
     "success": "AWS_DEPLOY_KEY güvenle saklandı."
    },
    {
     "task": "Pipeline'ı manuel tetikle (workflow_dispatch).",
     "teach": "Bazı işleri (deploy gibi) elle tetiklemek istersin. gh workflow run bunu yapar.",
     "verb": "gh",
     "expect": {
      "cmd": [
       "gh",
       "workflow",
       "run"
      ],
      "need": [
       "re:.+"
      ]
     },
     "success": "deploy.yml tetiklendi."
    },
    {
     "task": "Çalışan pipeline'ı canlı izle.",
     "teach": "gh run watch/list = pipeline durumunu terminalden takip eder. Kırmızıysa müdahale.",
     "verb": "gh",
     "expect": {
      "cmd": [
       "gh",
       "run"
      ],
      "need": [
       "watch|list|view"
      ]
     },
     "success": "Tüm adımlar yeşil. Deploy job'ı başladı."
    },
    {
     "task": "Yeni sürümü cluster'a uygula (deploy adımı).",
     "teach": "CD'nin son adımı: yeni sürümü ortama uygulamak. kubectl apply manifest'leri gerçeğe çevirir.",
     "verb": "kubectl",
     "expect": {
      "cmd": [
       "kubectl",
       "apply"
      ],
      "need": [
       "re:.+"
      ]
     },
     "success": "Yeni sürüm canlıda. Elle dokunmadan, izlenebilir şekilde."
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
     "verb": "tail",
     "expect": {
      "anyOf": [
       {
        "cmd": [
         "tail"
        ],
        "need": [
         "-f"
        ]
       },
       {
        "cmd": [
         "kubectl",
         "logs"
        ]
       }
      ]
     },
     "success": "Loglarda tekrarlayan 'DB timeout' var. İpucu bu."
    },
    {
     "task": "Container/servis metriklerine bak.",
     "teach": "CPU/bellek/istek metrikleri darboğazı gösterir. Örn: kubectl top pods.",
     "verb": "kubectl",
     "expect": {
      "anyOf": [
       {
        "cmd": [
         "kubectl",
         "top"
        ]
       },
       {
        "cmd": [
         "docker",
         "stats"
        ]
       },
       {
        "cmd": [
         "top"
        ]
       }
      ]
     },
     "success": "DB pod'u bellekte kırmızıda. Kaynak yetmiyor."
    },
    {
     "task": "Sağlık ucuna (health endpoint) istek atıp doğrula.",
     "teach": "Health endpoint hızlı bir nabız kontrolüdür. Otomatik alarmlar buna bakar.",
     "verb": "curl",
     "expect": {
      "cmd": [
       "curl"
      ],
      "need": [
       "re:/(health|healthz|status)"
      ]
     },
     "success": "{db: degraded} — kök neden onaylandı. Grafana'da alarm kuruldu."
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
     "verb": "curl",
     "expect": {
      "cmd": [
       "curl"
      ],
      "need": [
       "re:query|prometheus|9090"
      ]
     },
     "success": "up{job=\"web\"} = 1. Servis ayakta, metrikler akıyor."
    },
    {
     "task": "Alarm kurallarını doğrula.",
     "teach": "Alarm kuralları (yüksek hata oranı, gecikme) yayına çıkmadan doğrulanır: promtool.",
     "verb": "promtool",
     "expect": {
      "cmd": [
       "promtool",
       "check",
       "rules"
      ],
      "need": [
       "re:.+"
      ]
     },
     "success": "SUCCESS: 3 kural geçerli (HighErrorRate, HighLatency, PodDown)."
    },
    {
     "task": "Grafana dashboard'una eriş.",
     "teach": "Grafana metrikleri görselleştirir. port-forward ile lokalden dashboard'a bağlanırsın.",
     "verb": "kubectl",
     "expect": {
      "cmd": [
       "kubectl",
       "port-forward"
      ],
      "need": [
       "re:.+"
      ]
     },
     "success": "Grafana :3000'de. Latency grafiği ekranda."
    },
    {
     "task": "Bir isteğin dağıtık izini (trace) incele.",
     "teach": "Distributed tracing (Jaeger/OpenTelemetry) bir isteğin servisler arası yolunu gösterir; yavaşlık nerede belli olur.",
     "verb": "curl",
     "expect": {
      "cmd": [
       "curl"
      ],
      "need": [
       "re:jaeger|traces|16686"
      ]
     },
     "success": "İz: gecikme DB çağrısında (820ms). Kök neden görünür. Automation modülü tamam! 🎉"
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
     "verb": "aws",
     "expect": {
      "anyOf": [
       {
        "cmd": [
         "aws",
         "iam",
         "list-attached-user-policies"
        ]
       },
       {
        "cmd": [
         "aws",
         "iam",
         "list-user-policies"
        ]
       }
      ]
     },
     "success": "app-bot'ta AdministratorAccess var — çok geniş! Daraltmalı."
    },
    {
     "task": "Aşırı yetkiyi kaldır (least privilege uygula).",
     "teach": "detach-user-policy = gereksiz izni söker. İhtiyaç kadar yetki, fazlası değil.",
     "verb": "aws",
     "expect": {
      "cmd": [
       "aws",
       "iam",
       "detach-user-policy"
      ]
     },
     "success": "AdministratorAccess söküldü. app-bot artık sadece gerekene erişiyor."
    },
    {
     "task": "Sırrı kod yerine secret manager'da sakla.",
     "teach": "API key'i repoya YAZMA. Secrets Manager gibi kasalarda tut.",
     "verb": "aws",
     "expect": {
      "cmd": [
       "aws",
       "secretsmanager",
       "create-secret"
      ]
     },
     "success": "Sır kasaya kondu. Repoda düz metin parola kalmadı."
    },
    {
     "task": "Denetim izi (audit log) aç — kim ne yaptı görünsün.",
     "teach": "CloudTrail tüm API çağrılarını kaydeder. Bir olayda 'kim, ne zaman, ne yaptı' buradan çıkar.",
     "verb": "aws",
     "expect": {
      "cmd": [
       "aws",
       "cloudtrail",
       "create-trail"
      ]
     },
     "success": "audit trail açık. Artık her hareket kayıt altında."
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
     "verb": "aws",
     "expect": {
      "cmd": [
       "aws",
       "s3api",
       "put-public-access-block"
      ]
     },
     "success": "Public erişim kapandı. Veri artık dışarıdan görünmüyor."
    },
    {
     "task": "Bucket'ta dinlenen veriyi şifrele (encryption at rest).",
     "teach": "put-bucket-encryption = diskteki veriyi otomatik şifreler (SSE). Çalınsa bile okunamaz.",
     "verb": "aws",
     "expect": {
      "cmd": [
       "aws",
       "s3api",
       "put-bucket-encryption"
      ]
     },
     "success": "Şifreleme aktif (AES256). Rest'te veri güvende."
    },
    {
     "task": "İmajı/kodu güvenlik açıkları için tara.",
     "teach": "Trivy (imaj) / Checkov (IaC) = bilinen açıkları ve yanlış yapılandırmayı yayından önce yakalar.",
     "verb": "trivy",
     "expect": {
      "anyOf": [
       {
        "cmd": [
         "trivy",
         "image"
        ],
        "need": [
         "re:.+"
        ]
       },
       {
        "cmd": [
         "trivy"
        ]
       },
       {
        "cmd": [
         "checkov"
        ]
       }
      ]
     },
     "success": "Tarama bitti: 2 kritik açık bulundu ve yamalandı. Temiz."
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
     "verb": "aws",
     "expect": {
      "cmd": [
       "aws",
       "ce",
       "get-cost-and-usage"
      ]
     },
     "success": "Bu ay $842. Geçen aya göre %60 artış — kontrol şart."
    },
    {
     "task": "Eşik aşılırsa uyaracak bir bütçe kur.",
     "teach": "Budgets = harcama eşiği + alarm. Fatura şişmeden e-posta/uyarı gelir.",
     "verb": "aws",
     "expect": {
      "cmd": [
       "aws",
       "budgets",
       "create-budget"
      ]
     },
     "success": "$1000 aylık bütçe + %80 alarmı kuruldu. Sürpriz yok."
    },
    {
     "task": "Kaynakları etiketle (hangi takım/proje harcıyor).",
     "teach": "Cost allocation tag'leri = maliyeti takıma/projeye böler. 'Bu para nereye gidiyor?' cevabı.",
     "verb": "aws",
     "expect": {
      "cmd": [
       "aws",
       "ec2",
       "create-tags"
      ],
      "need": [
       "re:.+"
      ]
     },
     "success": "Kaynaklar etiketlendi. Maliyet artık takım bazında görünür."
    },
    {
     "task": "Boşta duran kaynağı durdur (israfı kes).",
     "teach": "Kullanılmayan instance para yakar. Kapatmak = anında tasarruf.",
     "verb": "aws",
     "expect": {
      "cmd": [
       "aws",
       "ec2",
       "stop-instances"
      ],
      "need": [
       "re:.+"
      ]
     },
     "success": "Test sunucusu durduruldu. Fatura düşüşe geçti. 🎉"
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
       "verb": "nmap",
       "expect": {
        "cmd": [
         "nmap"
        ],
        "need": [
         "re:.+"
        ]
       },
       "success": "22, 80, 8080 açık; 443 KAPALI. İlginç."
      },
      {
       "task": "Yerelde dinleyen servisleri/portları listele.",
       "teach": "ss -tulpn (veya netstat) = bu makinede hangi port hangi süreççe dinleniyor.",
       "verb": "ss",
       "expect": {
        "cmd": [
         "ss|netstat"
        ]
       },
       "success": "8080'i 'api' süreci dinliyor, 443'ü dinleyen yok."
      },
      {
       "task": "Belirli bir portu hangi süreç tutuyor bul.",
       "teach": "lsof -i :PORT (veya fuser) = portu kullanan süreci gösterir.",
       "verb": "lsof",
       "expect": {
        "anyOf": [
         {
          "cmd": [
           "lsof"
          ]
         },
         {
          "cmd": [
           "fuser"
          ]
         }
        ]
       },
       "success": "PID 3120 / api. Süreç ayakta ama yanlış portta."
      },
      {
       "task": "Porta bağlanmayı test et.",
       "teach": "nc -zv host port = porta TCP bağlantısı dener (tarama/doğrulama). telnet de olur.",
       "verb": "nc",
       "expect": {
        "anyOf": [
         {
          "cmd": [
           "nc"
          ],
          "need": [
           "re:.+"
          ]
         },
         {
          "cmd": [
           "ncat"
          ],
          "need": [
           "re:.+"
          ]
         },
         {
          "cmd": [
           "telnet"
          ],
          "need": [
           "re:.+"
          ]
         }
        ]
       },
       "success": "80 açık, 443 reddediyor. Servis yanlış portta ayakta."
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
       "verb": "dig",
       "expect": {
        "cmd": [
         "dig"
        ],
        "need": [
         "re:trace"
        ]
       },
       "success": "Yetkili sunucu eski IP döndürüyor — kayıt güncellenmemiş."
      },
      {
       "task": "Ters DNS ya da özel kayıt tipini sorgula.",
       "teach": "dig -x IP = ters DNS; dig MX/NS/TXT ad = belirli kayıt tipi.",
       "verb": "dig",
       "expect": {
        "cmd": [
         "dig|nslookup|host"
        ],
        "need": [
         "re:^-x$|MX|mx|NS|ns|TXT|txt|ANY|any"
        ]
       },
       "success": "Ters kayıt başka hosta işaret ediyor. Kafa karışıklığı doğrulandı."
      },
      {
       "task": "Yönlendirme (routing) tablosunu incele.",
       "teach": "ip route = paketlerin hangi ağ geçidinden çıktığını gösterir. Yanlış rota = ulaşılamaz.",
       "verb": "ip",
       "expect": {
        "anyOf": [
         {
          "cmd": [
           "ip",
           "route"
          ]
         },
         {
          "cmd": [
           "route"
          ]
         },
         {
          "cmd": [
           "netstat"
          ],
          "need": [
           "-r|-rn"
          ]
         }
        ]
       },
       "success": "10.0.0.0/24 için gateway yanlış. İşte kopukluk."
      },
      {
       "task": "Yolu ve gecikmeyi hop hop izle.",
       "teach": "mtr / traceroute = paketin geçtiği her durağı ve gecikmeyi canlı gösterir.",
       "verb": "mtr",
       "expect": {
        "cmd": [
         "mtr|traceroute|tracert"
        ],
        "need": [
         "re:.+"
        ]
       },
       "success": "3. hop'ta paketler kayboluyor — rota düzeltilince açılacak."
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
       "verb": "tcpdump",
       "expect": {
        "cmd": [
         "tcpdump"
        ],
        "need": [
         "re:.+"
        ]
       },
       "success": "SYN gidiyor ama SYN-ACK dönmüyor — karşı taraf reddediyor."
      },
      {
       "task": "curl ile bağlantının ayrıntısını (verbose) gör.",
       "teach": "curl -v = DNS, TCP, TLS ve HTTP adımlarını tek tek yazar. Nerede patladığı belli olur.",
       "verb": "curl",
       "expect": {
        "cmd": [
         "curl"
        ],
        "need": [
         "re:^-v"
        ]
       },
       "success": "TLS handshake'te takılıyor: sertifika uyuşmazlığı."
      },
      {
       "task": "TLS sertifikasını doğrudan incele.",
       "teach": "openssl s_client -connect host:443 = sunucunun sunduğu sertifikayı gösterir.",
       "verb": "openssl",
       "expect": {
        "cmd": [
         "openssl",
         "s_client"
        ]
       },
       "success": "Sertifika yanlış alan adına ait, süresi de dolmuş. Kök neden bu."
      },
      {
       "task": "Yakalanan paketleri (pcap) analiz et.",
       "teach": "tshark -r dosya.pcap = kaydedilmiş yakalamayı okur/filtreler (Wireshark'ın CLI'ı).",
       "verb": "tshark",
       "expect": {
        "anyOf": [
         {
          "cmd": [
           "tshark"
          ]
         },
         {
          "cmd": [
           "wireshark"
          ]
         },
         {
          "cmd": [
           "tcpdump"
          ],
          "need": [
           "-r"
          ]
         }
        ]
       },
       "success": "Analiz net: her şey sertifikaya çıkıyor. Yenilemeli."
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
       "verb": "sudo",
       "expect": {
        "anyOf": [
         {
          "cmd": [
           "iptables"
          ]
         },
         {
          "cmd": [
           "nft"
          ]
         },
         {
          "cmd": [
           "ufw"
          ]
         }
        ]
       },
       "success": "443 için DROP kuralı var — trafiği duvar kesiyormuş."
      },
      {
       "task": "Portu dışarıdan test et.",
       "teach": "nc -zv host port = portun gerçekten açık/kapalı olduğunu dışarıdan doğrular.",
       "verb": "nc",
       "expect": {
        "anyOf": [
         {
          "cmd": [
           "nc"
          ],
          "need": [
           "re:.+"
          ]
         },
         {
          "cmd": [
           "telnet"
          ],
          "need": [
           "re:.+"
          ]
         },
         {
          "cmd": [
           "ncat"
          ],
          "need": [
           "re:.+"
          ]
         }
        ]
       },
       "success": "443 timeout — duvar onayladı, sorun kesin firewall."
      },
      {
       "task": "Kuralı ekleyip portu aç.",
       "teach": "ufw allow / iptables -A = izin kuralı ekler. Sadece gereken portu aç, hepsini değil.",
       "verb": "sudo",
       "expect": {
        "anyOf": [
         {
          "cmd": [
           "ufw",
           "allow"
          ]
         },
         {
          "cmd": [
           "iptables"
          ],
          "need": [
           "-A|-I"
          ]
         }
        ]
       },
       "success": "443'e izin verildi."
      },
      {
       "task": "Düzeltmeyi doğrula.",
       "teach": "curl -I = sadece başlıkları çeker; servis artık cevap veriyor mu hızlıca görürsün.",
       "verb": "curl",
       "expect": {
        "cmd": [
         "curl"
        ],
        "need": [
         "re:^-I|--head|^-sI"
        ]
       },
       "success": "200 OK! Ağ arızası çözüldü. Network Ops lab'ı tamam! 🎉"
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
       "verb": "chmod",
       "expect": {
        "cmd": [
         "chmod"
        ],
        "need": [
         "re:^(\\+x|u\\+x|a\\+x|[0-7]{3})$",
         "backup.sh"
        ]
       },
       "success": "backup.sh artık çalıştırılabilir."
      },
      {
       "task": "Script'i bir argümanla çalıştır.",
       "teach": "Script'e verdiğin kelimeler $1, $2... olur; $@ hepsi. Böylece aynı script farklı ortamlara hizmet eder.",
       "verb": "./backup.sh",
       "expect": {
        "cmd": [
         "./backup.sh"
        ],
        "need": [
         "re:.+"
        ]
       },
       "success": ">> prod yedekleniyor... OK"
      },
      {
       "task": "Son komutun çıkış kodunu (exit code) kontrol et.",
       "teach": "Her komut bir exit code döndürür: 0 = başarı, değilse hata. $? son kodu tutar. Otomasyonun temeli budur.",
       "verb": "echo",
       "expect": {
        "cmd": [
         "echo"
        ],
        "need": [
         "re:\\$\\?"
        ]
       },
       "success": "0 — yedekleme başarıyla bitti."
      },
      {
       "task": "Script'i satır satır izleyerek hata ayıkla.",
       "teach": "bash -x script = her satırı çalışırken ekrana basar. 'Neden çalışmadı?' sorusunun cevabı burada.",
       "verb": "bash",
       "expect": {
        "cmd": [
         "bash"
        ],
        "need": [
         "-x"
        ]
       },
       "success": "İzleme akıyor; hangi satırda ne olduğu görünür."
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
       "verb": "echo",
       "expect": {
        "cmd": [
         "echo"
        ],
        "need": [
         "re:\\$"
        ]
       },
       "success": "Ortam: prod"
      },
      {
       "task": "Bir döngüyle tüm log dosyalarını gez.",
       "teach": "for x in LİSTE; do ...; done = her öğe için tekrarlar. Toplu işlerin belkemiği.",
       "verb": "for",
       "expect": {
        "cmd": [
         "for"
        ],
        "need": [
         "in"
        ]
       },
       "success": "app.log, db.log, web.log — hepsi tek döngüde."
      },
      {
       "task": "Bir koşulla dosya var mı diye bak.",
       "teach": "if [ KOŞUL ]; then ...; fi. -f dosya var mı, -d dizin mi, -z boş mu test eder.",
       "verb": "if",
       "expect": {
        "cmd": [
         "if"
        ],
        "need": [
         "\\[|test|-f|-d|-z|-n"
        ]
       },
       "success": "app.pid var — servis çalışıyor."
      },
      {
       "task": "Bir dosyayı satır satır oku.",
       "teach": "while read line; do ...; done < dosya = dosyayı satır satır işler. Log işlemenin klasiği.",
       "verb": "while",
       "expect": {
        "cmd": [
         "while"
        ],
        "need": [
         "read"
        ]
       },
       "success": "Satırlar tek tek işlendi."
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
       "verb": "grep",
       "expect": {
        "cmd": [
         "grep"
        ],
        "need": [
         "re:.+"
        ]
       },
       "success": "42 hata satırı süzüldü."
      },
      {
       "task": "Belirli bir sütunu (alanı) ayıkla.",
       "teach": "awk '{print $N}' = N. alanı basar. Boşlukla ayrılmış loglarda IP/kod/süre çekmenin yolu.",
       "verb": "awk",
       "expect": {
        "cmd": [
         "awk"
        ],
        "need": [
         "re:.+"
        ]
       },
       "success": "İlk sütun (IP'ler) çekildi."
      },
      {
       "task": "Metinde toplu değişiklik yap.",
       "teach": "sed 's/eski/yeni/g' = akıştaki metni değiştirir. Log temizleme/normalizasyonun aracı.",
       "verb": "sed",
       "expect": {
        "cmd": [
         "sed"
        ],
        "need": [
         "re:.+"
        ]
       },
       "success": "Tüm DEBUG etiketleri INFO oldu."
      },
      {
       "task": "En sık tekrarlayanı bul (say + sırala).",
       "teach": "sort | uniq -c | sort -rn = tekrarları sayıp en çoktan aza sıralar. 'En çok hangi IP vuruyor?' sorusunu çözer.",
       "verb": "sort",
       "expect": {
        "cmd": [
         "uniq"
        ],
        "need": [
         "-c"
        ]
       },
       "success": "En sık IP: 10.0.0.9 (1284 istek). Şüpheli."
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
       "verb": "crontab",
       "expect": {
        "cmd": [
         "crontab"
        ],
        "need": [
         "-l"
        ]
       },
       "success": "Henüz iş yok. Ekleyelim."
      },
      {
       "task": "Yeni bir cron işi eklemek için düzenleyiciyi aç.",
       "teach": "crontab -e. Format: dk saat gün ay haftanıngünü komut. Ör: '0 3 * * * /opt/backup.sh' = her gün 03:00.",
       "verb": "crontab",
       "expect": {
        "cmd": [
         "crontab"
        ],
        "need": [
         "-e"
        ]
       },
       "success": "Yedekleme artık her gece 03:00'te otomatik."
      },
      {
       "task": "Script'i çalıştırmadan sözdizimi hatasına karşı kontrol et.",
       "teach": "bash -n script = script'i çalıştırmadan yalnızca sözdizimini denetler. Prod'a atmadan önce şart.",
       "verb": "bash",
       "expect": {
        "cmd": [
         "bash"
        ],
        "need": [
         "-n"
        ]
       },
       "success": "Sözdizimi temiz."
      },
      {
       "task": "Script'i hataya karşı sağlamlaştır.",
       "teach": "set -euo pipefail = hatada dur, tanımsız değişkende dur, pipe hatasını yut-ma. Profesyonel script'in ilk satırı.",
       "verb": "set",
       "expect": {
        "cmd": [
         "set"
        ],
        "need": [
         "re:euo|pipefail|^-e"
        ]
       },
       "success": "Script artık sessizce hata yutmuyor. Scripting lab'ı tamam! 🎉"
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
       "verb": "docker",
       "expect": {
        "cmd": [
         "docker",
         "build"
        ],
        "need": [
         "re:.+"
        ]
       },
       "success": "Image built: app:1.0 (412MB)."
      },
      {
       "task": "İmajın katman geçmişini incele.",
       "teach": "docker history = her katmanın boyutunu/komutunu gösterir. Şişkin katmanı böyle bulursun.",
       "verb": "docker",
       "expect": {
        "cmd": [
         "docker",
         "history"
        ],
        "need": [
         "re:.+"
        ]
       },
       "success": "En büyük katman: apt install (280MB). Hedef belli."
      },
      {
       "task": "İmaj boyutlarını listele.",
       "teach": "docker images = yerel imajları ve boyutlarını gösterir. Küçük imaj = hızlı deploy, az saldırı yüzeyi.",
       "verb": "docker",
       "expect": {
        "cmd": [
         "docker",
         "images"
        ]
       },
       "success": "app:1.0 → 412MB. Bunu düşüreceğiz."
      },
      {
       "task": "Multi-stage build ile sadece gerekeni al.",
       "teach": "--target ile Dockerfile'daki belirli aşamayı build edersin. Derleme araçlarını atıp yalnız çalışan artefaktı taşırsın.",
       "verb": "docker",
       "expect": {
        "cmd": [
         "docker",
         "build"
        ],
        "need": [
         "re:target"
        ]
       },
       "success": "app:slim → 74MB! Multi-stage sihiri."
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
       "verb": "docker",
       "expect": {
        "cmd": [
         "docker",
         "volume",
         "create"
        ],
        "need": [
         "re:.+"
        ]
       },
       "success": "dbdata volume'ü hazır."
      },
      {
       "task": "Container'ı volume bağlayarak çalıştır.",
       "teach": "docker run -v volume:/yol = volume'ü container içine bağlar. Veri artık container'dan bağımsız.",
       "verb": "docker",
       "expect": {
        "cmd": [
         "docker",
         "run"
        ],
        "need": [
         "re:^-v$|^--volume$|^-v.+"
        ]
       },
       "success": "MySQL verisi dbdata'da; container yeniden kurulsa da kalıcı."
      },
      {
       "task": "Container'lar için özel bir ağ oluştur.",
       "teach": "docker network create = container'ların isimle birbirine ulaştığı izole ağ.",
       "verb": "docker",
       "expect": {
        "cmd": [
         "docker",
         "network",
         "create"
        ],
        "need": [
         "re:.+"
        ]
       },
       "success": "appnet ağı oluştu."
      },
      {
       "task": "Container'ı bu ağa bağlayarak çalıştır.",
       "teach": "docker run --network appnet = container'ı ağa koyar; artık 'db' gibi isimle diğerine erişir.",
       "verb": "docker",
       "expect": {
        "cmd": [
         "docker",
         "run"
        ],
        "need": [
         "re:network"
        ]
       },
       "success": "app artık 'db' adıyla veritabanına ulaşıyor."
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
       "verb": "docker",
       "expect": {
        "cmd": [
         "docker",
         "login"
        ],
        "need": [
         "re:.+"
        ]
       },
       "success": "ghcr.io'ya giriş yapıldı."
      },
      {
       "task": "İmajı registry adıyla etiketle.",
       "teach": "docker tag <yerel> <registry/kullanıcı/ad:etiket> = push için doğru isim.",
       "verb": "docker",
       "expect": {
        "cmd": [
         "docker",
         "tag"
        ],
        "need": [
         "re:.+",
         "re:.+"
        ]
       },
       "success": "Etiketlendi: ghcr.io/mehmet/app:1.0"
      },
      {
       "task": "İmajı registry'ye gönder.",
       "teach": "docker push = imajı registry'ye yükler; başkaları pull ile çeker. CI/CD'nin de kalbi.",
       "verb": "docker",
       "expect": {
        "cmd": [
         "docker",
         "push"
        ],
        "need": [
         "re:.+"
        ]
       },
       "success": "Push tamam. İmaj her yerden erişilebilir."
      },
      {
       "task": "İmajı/container'ı derinlemesine incele.",
       "teach": "docker inspect = env, mount, network, entrypoint... her şeyin JSON detayı. Debug'ın son durağı.",
       "verb": "docker",
       "expect": {
        "cmd": [
         "docker",
         "inspect"
        ],
        "need": [
         "re:.+"
        ]
       },
       "success": "Env, portlar, volume'ler — hepsi görünür."
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
       "verb": "docker",
       "expect": {
        "anyOf": [
         {
          "cmd": [
           "docker",
           "compose",
           "up"
          ]
         },
         {
          "cmd": [
           "docker-compose",
           "up"
          ]
         }
        ]
       },
       "success": "app + db + redis ayakta."
      },
      {
       "task": "Bir servisi yatayda ölçekle.",
       "teach": "--scale servis=N = o servisten N kopya çalıştırır. Yükü dağıtmanın compose yolu.",
       "verb": "docker",
       "expect": {
        "anyOf": [
         {
          "cmd": [
           "docker",
           "compose",
           "up"
          ],
          "need": [
           "re:scale"
          ]
         },
         {
          "cmd": [
           "docker-compose",
           "up"
          ],
          "need": [
           "re:scale"
          ]
         }
        ]
       },
       "success": "web servisi 3 kopya. Trafik dağılıyor."
      },
      {
       "task": "Bir servisin loglarına bakıp hata ayıkla.",
       "teach": "docker logs / docker compose logs = servisin çıktısını gösterir. İlk teşhis aracı.",
       "verb": "docker",
       "expect": {
        "anyOf": [
         {
          "cmd": [
           "docker",
           "logs"
          ],
          "need": [
           "re:.+"
          ]
         },
         {
          "cmd": [
           "docker",
           "compose",
           "logs"
          ]
         },
         {
          "cmd": [
           "docker-compose",
           "logs"
          ]
         }
        ]
       },
       "success": "Loglar akıyor; sorun görünür."
      },
      {
       "task": "Kullanılmayan imaj/container/ağları temizle.",
       "teach": "docker system prune = boşta duran kaynakları siler; disk ve karmaşayı azaltır. Düzenli yap.",
       "verb": "docker",
       "expect": {
        "anyOf": [
         {
          "cmd": [
           "docker",
           "system",
           "prune"
          ]
         },
         {
          "cmd": [
           "docker",
           "image",
           "prune"
          ]
         },
         {
          "cmd": [
           "docker",
           "container",
           "prune"
          ]
         }
        ]
       },
       "success": "3.2GB geri kazanıldı. Docker Deep Dive lab'ı tamam! 🎉"
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
       "verb": "terraform",
       "expect": {
        "cmd": [
         "terraform",
         "get"
        ],
        "need": [
         "-update|-u"
        ]
       },
       "success": "vpc, ec2, rds modülleri güncellendi."
      },
      {
       "task": "Sağlayıcı/modül bağımlılık ağacını gör.",
       "teach": "terraform providers = hangi modülün hangi provider'a ve sürüme bağlı olduğunu gösterir.",
       "verb": "terraform",
       "expect": {
        "cmd": [
         "terraform",
         "providers"
        ]
       },
       "success": "3 modül, tek aws provider (~> 5.0). Temiz."
      },
      {
       "task": "Tüm modülleri özyinelemeli biçimlendir.",
       "teach": "terraform fmt -recursive = alt klasörlerdeki tüm modül dosyalarını hizalar.",
       "verb": "terraform",
       "expect": {
        "cmd": [
         "terraform",
         "fmt"
        ],
        "need": [
         "re:recursive|^-r$"
        ]
       },
       "success": "Tüm modüller biçimlendirildi."
      },
      {
       "task": "Modül çıktısını makine-okur formatta al.",
       "teach": "terraform output -json = çıktıları JSON verir; başka araç/scriptler tüketebilir.",
       "verb": "terraform",
       "expect": {
        "cmd": [
         "terraform",
         "output"
        ],
        "need": [
         "re:json|-raw"
        ]
       },
       "success": "{\"vpc_id\":{\"value\":\"vpc-0a1b\"}} — otomasyona hazır."
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
       "verb": "terraform",
       "expect": {
        "cmd": [
         "terraform",
         "init"
        ],
        "need": [
         "re:backend"
        ]
       },
       "success": "State S3'e taşındı; kilit DynamoDB'de. Takım güvende."
      },
      {
       "task": "Uzak state'i çek ve incele.",
       "teach": "terraform state pull = remote state'i indirir (JSON). Neyin izlendiğini görürsün.",
       "verb": "terraform",
       "expect": {
        "cmd": [
         "terraform",
         "state",
         "pull"
        ]
       },
       "success": "Remote state çekildi."
      },
      {
       "task": "Takılı kalmış bir kilidi (lock) serbest bırak.",
       "teach": "Bir apply çökerse kilit takılı kalır. terraform force-unlock <ID> onu güvenle açar.",
       "verb": "terraform",
       "expect": {
        "cmd": [
         "terraform",
         "force-unlock"
        ],
        "need": [
         "re:.+"
        ]
       },
       "success": "Kilit açıldı; ekip yeniden apply atabilir."
      },
      {
       "task": "Bir kaynağı state içinde yeniden adlandır (refactor).",
       "teach": "terraform state mv eski.adres yeni.adres = kaynağı silmeden state'te taşır; refactor'ün anahtarı.",
       "verb": "terraform",
       "expect": {
        "cmd": [
         "terraform",
         "state",
         "mv"
        ],
        "need": [
         "re:.+",
         "re:.+"
        ]
       },
       "success": "Adres güncellendi; kaynak yeniden yaratılmadı."
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
       "verb": "terraform",
       "expect": {
        "cmd": [
         "terraform",
         "plan"
        ],
        "need": [
         "re:refresh"
        ]
       },
       "success": "Drift bulundu: security group elle değişmiş."
      },
      {
       "task": "State'i gerçek durumla uzlaştır.",
       "teach": "terraform apply -refresh-only = kodu değil, state'i gerçeğe eşitler (kaynak değiştirmez).",
       "verb": "terraform",
       "expect": {
        "cmd": [
         "terraform",
         "apply"
        ],
        "need": [
         "re:refresh"
        ]
       },
       "success": "State gerçeğe eşitlendi."
      },
      {
       "task": "Sadece tek bir kaynağı hedefleyerek planla.",
       "teach": "terraform plan -target=ADRES = büyük altyapıda yalnız o kaynağı ele alır. Dikkatli kullan, geneli maskeler.",
       "verb": "terraform",
       "expect": {
        "cmd": [
         "terraform",
         "plan"
        ],
        "need": [
         "re:target"
        ]
       },
       "success": "Yalnız security group planlandı."
      },
      {
       "task": "Mevcut durumu insan-okur biçimde göster.",
       "teach": "terraform show = kaydedilmiş plan ya da güncel state'i okunur biçimde döker.",
       "verb": "terraform",
       "expect": {
        "cmd": [
         "terraform",
         "show"
        ]
       },
       "success": "Güncel durum ekranda; drift kapandı."
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
       "verb": "terraform",
       "expect": {
        "cmd": [
         "terraform",
         "plan"
        ],
        "need": [
         "re:-out|out="
        ]
       },
       "success": "Plan tfplan'a kaydedildi."
      },
      {
       "task": "Kaydedilen planı birebir uygula.",
       "teach": "terraform apply tfplan = onay istemez, tam o planı uygular. CI için ideal.",
       "verb": "terraform",
       "expect": {
        "cmd": [
         "terraform",
         "apply"
        ],
        "need": [
         "re:tfplan|plan$"
        ]
       },
       "success": "Onaylanan plan aynen uygulandı."
      },
      {
       "task": "Biçim kapısı: CI'da formatı zorunlu kıl.",
       "teach": "terraform fmt -check = biçimsiz dosya varsa hata döner (exit != 0). CI'da merge'i engeller.",
       "verb": "terraform",
       "expect": {
        "cmd": [
         "terraform",
         "fmt"
        ],
        "need": [
         "re:check"
        ]
       },
       "success": "Tüm dosyalar biçimli. Kapı yeşil."
      },
      {
       "task": "Güvenlik/uyum taraması çalıştır.",
       "teach": "tfsec / checkov / tflint = HCL'de güvenlik açığı ve yanlış yapılandırmayı merge'den önce yakalar.",
       "verb": "tfsec",
       "expect": {
        "anyOf": [
         {
          "cmd": [
           "tfsec"
          ]
         },
         {
          "cmd": [
           "checkov"
          ]
         },
         {
          "cmd": [
           "tflint"
          ]
         }
        ]
       },
       "success": "1 uyarı: public S3. Düzeltildi. Terraform Pro lab'ı tamam! 🎉"
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
       "verb": "ansible-inventory",
       "expect": {
        "cmd": [
         "ansible-inventory"
        ],
        "need": [
         "re:list|graph"
        ]
       },
       "success": "3 grup bulundu: web(4), db(2), cache(1)."
      },
      {
       "task": "Tüm hostlara bağlantı testi yap.",
       "teach": "ansible all -m ping = her hosta 'ping' modülünü çalıştırır (ICMP değil, SSH+Python testi).",
       "verb": "ansible",
       "expect": {
        "cmd": [
         "ansible"
        ],
        "need": [
         "-m",
         "ping"
        ]
       },
       "success": "6 host SUCCESS, 1 UNREACHABLE (db02). Not alındı."
      },
      {
       "task": "Bir grupta ad-hoc komut çalıştır.",
       "teach": "ansible <grup> -a \"komut\" = playbook yazmadan tek seferlik komut. Hızlı teşhis için birebir.",
       "verb": "ansible",
       "expect": {
        "cmd": [
         "ansible"
        ],
        "need": [
         "-a",
         "re:.+"
        ]
       },
       "success": "4 web sunucusunun uptime'ı geldi. Biri 200 gün ayakta."
      },
      {
       "task": "Hostlardan sistem bilgisi (facts) topla.",
       "teach": "setup modülü = hostun OS, IP, RAM gibi tüm 'facts' bilgisini döndürür. Playbook'larda koşul yazmanın temeli.",
       "verb": "ansible",
       "expect": {
        "cmd": [
         "ansible"
        ],
        "need": [
         "-m",
         "setup"
        ]
       },
       "success": "Facts toplandı: Ubuntu 22.04, 4 vCPU, 8GB RAM."
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
       "verb": "ansible-playbook",
       "expect": {
        "cmd": [
         "ansible-playbook"
        ],
        "need": [
         "re:syntax-check",
         "re:.+\\.ya?ml"
        ]
       },
       "success": "playbook: site.yml — sözdizimi temiz."
      },
      {
       "task": "Kuru çalıştır (dry-run): ne değişecek gör.",
       "teach": "--check = hiçbir şeyi değiştirmeden neyin değişeceğini raporlar. Terraform'daki 'plan' gibi.",
       "verb": "ansible-playbook",
       "expect": {
        "cmd": [
         "ansible-playbook"
        ],
        "need": [
         "re:^--check$|^-C$"
        ]
       },
       "success": "changed=7 (kuru). nginx kurulacak, config güncellenecek."
      },
      {
       "task": "Sadece tek bir grupta çalıştır.",
       "teach": "--limit <grup> = playbook'u yalnız seçili hostlara uygular. Kademeli yayının (canary) yolu.",
       "verb": "ansible-playbook",
       "expect": {
        "cmd": [
         "ansible-playbook"
        ],
        "need": [
         "re:limit"
        ]
       },
       "success": "Yalnız web grubu güncellendi. Kademeli yayın başladı."
      },
      {
       "task": "Playbook'u gerçekten uygula.",
       "teach": "Kontroller geçtiyse çalıştır. Çıktıdaki ok/changed/failed sayıları sonucu özetler.",
       "verb": "ansible-playbook",
       "expect": {
        "cmd": [
         "ansible-playbook"
        ],
        "need": [
         "re:.+\\.ya?ml"
        ]
       },
       "success": "ok=12 changed=7 failed=0. Tüm filo aynı yapılandırmada."
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
       "verb": "ansible-galaxy",
       "expect": {
        "cmd": [
         "ansible-galaxy",
         "init"
        ],
        "need": [
         "re:.+"
        ]
       },
       "success": "roles/nginx iskeleti hazır (tasks, handlers, templates, defaults)."
      },
      {
       "task": "Dış bağımlılıkları (hazır rolleri) indir.",
       "teach": "requirements.yml içindeki toplulukta yazılmış rolleri indirir. Tekerleği yeniden icat etme.",
       "verb": "ansible-galaxy",
       "expect": {
        "cmd": [
         "ansible-galaxy",
         "install"
        ],
        "need": [
         "re:^-r$|requirements"
        ]
       },
       "success": "geerlingguy.postgresql indirildi."
      },
      {
       "task": "Playbook'un yapacağı görevleri listele.",
       "teach": "--list-tasks = çalıştırmadan hangi rolün hangi görevleri koşacağını gösterir. Büyük playbook'u anlamanın yolu.",
       "verb": "ansible-playbook",
       "expect": {
        "cmd": [
         "ansible-playbook"
        ],
        "need": [
         "re:list-tasks|list-hosts"
        ]
       },
       "success": "3 rol / 24 görev listelendi."
      },
      {
       "task": "Sadece belirli etiketli görevleri çalıştır.",
       "teach": "--tags = playbook'un yalnız ilgili kısmını koşturur. 'Sadece config güncelle' demenin yolu.",
       "verb": "ansible-playbook",
       "expect": {
        "cmd": [
         "ansible-playbook"
        ],
        "need": [
         "re:tags"
        ]
       },
       "success": "Yalnız nginx görevleri koştu (6 saniye)."
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
       "verb": "ansible-vault",
       "expect": {
        "cmd": [
         "ansible-vault",
         "encrypt|create"
        ],
        "need": [
         "re:.+"
        ]
       },
       "success": "Encryption successful. Repoda artık düz parola yok."
      },
      {
       "task": "Şifreli dosyayı çöz(meden) görüntüle.",
       "teach": "ansible-vault view = dosyayı diske çözmeden ekranda gösterir. edit ile de düzenlersin.",
       "verb": "ansible-vault",
       "expect": {
        "cmd": [
         "ansible-vault",
         "view|edit|decrypt"
        ],
        "need": [
         "re:.+"
        ]
       },
       "success": "İçerik ekranda; dosya diskte şifreli kaldı."
      },
      {
       "task": "Vault parolasıyla playbook'u çalıştır.",
       "teach": "--ask-vault-pass (ya da --vault-password-file) = çalışma anında sırları çözer.",
       "verb": "ansible-playbook",
       "expect": {
        "cmd": [
         "ansible-playbook"
        ],
        "need": [
         "re:vault"
        ]
       },
       "success": "Sırlar çözüldü, playbook koştu. changed=3"
      },
      {
       "task": "Aynı playbook'u tekrar çalıştırıp farkı gör (idempotency).",
       "teach": "--diff = neyin değiştiğini satır satır gösterir. Doğru yazılmış playbook ikinci koşuda changed=0 verir.",
       "verb": "ansible-playbook",
       "expect": {
        "cmd": [
         "ansible-playbook"
        ],
        "need": [
         "re:diff"
        ]
       },
       "success": "changed=0 — sistem zaten istenen durumda. İşte idempotency! Ansible lab'ı tamam! 🎉"
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
       "verb": "kubectl",
       "expect": {
        "cmd": [
         "kubectl",
         "create",
         "namespace|ns"
        ],
        "need": [
         "re:.+"
        ]
       },
       "success": "namespace/prod created"
      },
      {
       "task": "Namespace'e kaynak kotası koy.",
       "teach": "ResourceQuota = o namespace'in kullanabileceği toplam CPU/RAM/pod sayısını sınırlar. Komşu takımı korur.",
       "verb": "kubectl",
       "expect": {
        "cmd": [
         "kubectl",
         "create",
         "quota"
        ],
        "need": [
         "re:.+"
        ]
       },
       "success": "Kota kondu: 4 CPU / 8Gi / 10 pod."
      },
      {
       "task": "Varsayılan namespace'i prod yap.",
       "teach": "Her komuta -n prod yazmak yorucu. set-context ile varsayılanı değiştirirsin (ve yanlış ortama deploy riskini azaltırsın).",
       "verb": "kubectl",
       "expect": {
        "cmd": [
         "kubectl",
         "config",
         "set-context"
        ],
        "need": [
         "re:namespace"
        ]
       },
       "success": "Artık varsayılan namespace: prod"
      },
      {
       "task": "Namespace'teki tüm kaynakları listele.",
       "teach": "kubectl get all -n <ns> = o bölgedeki pod/service/deployment'ları tek bakışta gösterir.",
       "verb": "kubectl",
       "expect": {
        "cmd": [
         "kubectl",
         "get",
         "all"
        ]
       },
       "success": "prod bölgesi hazır ve izole."
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
       "verb": "kubectl",
       "expect": {
        "cmd": [
         "kubectl",
         "describe"
        ],
        "need": [
         "re:.+"
        ]
       },
       "success": "Liveness OK, Readiness fail x3 — uygulama geç açılıyor."
      },
      {
       "task": "Otomatik ölçeklendirme (HPA) kur.",
       "teach": "autoscale = CPU'ya göre replika sayısını otomatik artırır/azaltır. Gece trafiğinde uyumanı sağlar.",
       "verb": "kubectl",
       "expect": {
        "cmd": [
         "kubectl",
         "autoscale"
        ],
        "need": [
         "re:.+"
        ]
       },
       "success": "horizontalpodautoscaler.autoscaling/web created"
      },
      {
       "task": "HPA'nın durumunu kontrol et.",
       "teach": "get hpa = mevcut/hedef CPU ve replika sayısını gösterir. Ölçeklemenin çalışıp çalışmadığı buradan görülür.",
       "verb": "kubectl",
       "expect": {
        "cmd": [
         "kubectl",
         "get",
         "hpa"
        ]
       },
       "success": "web  45%/70%  2/10 replika. Sistem nefes alıyor."
      },
      {
       "task": "Gerçek kaynak tüketimini ölç.",
       "teach": "kubectl top = pod'ların anlık CPU/bellek kullanımı. Kota ve limit ayarlarken buna bakılır.",
       "verb": "kubectl",
       "expect": {
        "cmd": [
         "kubectl",
         "top"
        ]
       },
       "success": "En yüksek pod 380m CPU / 512Mi. Kota içinde."
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
       "verb": "kubectl",
       "expect": {
        "cmd": [
         "kubectl",
         "create",
         "secret"
        ],
        "need": [
         "re:.+"
        ]
       },
       "success": "secret/db-cred created"
      },
      {
       "task": "Secret'ları listele (değerleri sızdırmadan).",
       "teach": "get secrets = adları ve türleri gösterir, değerleri değil. Değeri görmek ayrı bir komut ve ayrı bir yetki ister.",
       "verb": "kubectl",
       "expect": {
        "cmd": [
         "kubectl",
         "get",
         "secret|secrets"
        ]
       },
       "success": "db-cred (Opaque, 1 data). Değer görünmüyor — doğru davranış."
      },
      {
       "task": "Kalıcı depolama talebi (PVC) oluştur.",
       "teach": "PersistentVolumeClaim = 'bana 10Gi disk ver' talebi. Pod silinse de veri kalır.",
       "verb": "kubectl",
       "expect": {
        "cmd": [
         "kubectl",
         "apply"
        ],
        "need": [
         "re:pvc|volume|storage"
        ]
       },
       "success": "persistentvolumeclaim/db-data created"
      },
      {
       "task": "Depolama talebinin karşılandığını doğrula.",
       "teach": "get pvc = talebin Bound (bağlandı) mı Pending mi olduğunu gösterir. Pending kalırsa StorageClass sorunu vardır.",
       "verb": "kubectl",
       "expect": {
        "cmd": [
         "kubectl",
         "get",
         "pvc|persistentvolumeclaim"
        ]
       },
       "success": "db-data  Bound  10Gi  gp3. Veri artık kalıcı."
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
       "verb": "kubectl",
       "expect": {
        "cmd": [
         "kubectl",
         "get",
         "events"
        ]
       },
       "success": "FailedScheduling: yetersiz CPU. Kök neden bulundu."
      },
      {
       "task": "Çalışan pod'un içine girip kontrol et.",
       "teach": "kubectl exec = container içinde komut çalıştırır. Config gerçekten mount olmuş mu, DNS çözülüyor mu — canlı bakarsın.",
       "verb": "kubectl",
       "expect": {
        "cmd": [
         "kubectl",
         "exec"
        ],
        "need": [
         "re:.+"
        ]
       },
       "success": "Container içindesin. Env ve mount'lar doğrulandı."
      },
      {
       "task": "Servisi lokal makinene yönlendir.",
       "teach": "port-forward = cluster içindeki servisi localhost'a bağlar. Ingress kurmadan hızlıca test etmenin yolu.",
       "verb": "kubectl",
       "expect": {
        "cmd": [
         "kubectl",
         "port-forward"
        ],
        "need": [
         "re:.+"
        ]
       },
       "success": "localhost:8080 → cluster'daki web servisi. Test edilebilir."
      },
      {
       "task": "Uygulamayı Helm chart'ı olarak kur.",
       "teach": "Helm = Kubernetes'in paket yöneticisi. Onlarca YAML yerine tek chart + değer dosyası; sürümleme ve rollback hazır gelir.",
       "verb": "helm",
       "expect": {
        "anyOf": [
         {
          "cmd": [
           "helm",
           "install"
          ],
          "need": [
           "re:.+"
          ]
         },
         {
          "cmd": [
           "helm",
           "upgrade"
          ],
          "need": [
           "re:.+"
          ]
         }
        ]
       },
       "success": "Release myapp deployed. Kubernetes lab'ı tamam! 🎉"
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
},
 "en": {
 "_meta": {
  "note": "AUTO-GENERATED. Komut kontrolu tarayicida (expect burada). Ipucu metni (hint) sunucuda; odul supabase/functions/game tarafindan verilir."
 },
 "chapters": [
  {
   "n": 1,
   "title": "Terminal & Linux",
   "desc": "The language of the cloud: shell, files, text, permissions, processes, packages/services."
  },
  {
   "n": 2,
   "title": "Networking & Git",
   "desc": "How packets flow, how you reach a server, how code gets versioned."
  },
  {
   "n": 3,
   "title": "AWS Core",
   "desc": "IAM, EC2, VPC, S3 - the core of the cloud."
  },
  {
   "n": 4,
   "title": "Infrastructure as Code",
   "desc": "Describe your infrastructure in code with Terraform."
  },
  {
   "n": 5,
   "title": "Containers",
   "desc": "Package and ship it with Docker."
  },
  {
   "n": 6,
   "title": "CI/CD",
   "desc": "An automatic build -> test -> deploy pipeline."
  },
  {
   "n": 7,
   "title": "Observability",
   "desc": "Logs, metrics, dashboards, alarms."
  },
  {
   "n": 8,
   "title": "Security & Cost",
   "desc": "Least privilege, cost control, certification."
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
   "── MERIDIAN ──  Monday, 09:14.  Your first day.",
   "[Deniz — CEO]: Welcome. The bad news: Null, our only infrastructure engineer, quit on Friday.",
   "[Deniz]: The good news: you're taking their place. The investor demo is 6 weeks out and the system is a house of cards.",
   "[Nova — Senior Engineer]: Hey, I'm Nova. Don't panic — I'm not leaving you on your own.",
   "[Nova]: This is a marathon. We start at the terminal and turn Meridian into a platform that actually stays up.",
   "[Nova]: If you're ready, let's put out the first fire together. Type 'quests' to see your assignment."
  ],
  "acts": {
   "fundamentals": {
    "title": "ACT I — Trial by Fire",
    "intro": [
     "[Nova]: Prod runs on a single server and the deploy is broken right now.",
     "[Nova]: First you'll learn to stand on your own feet in the terminal — we'll type every command together.",
     "[Nova]: By the end of the day you'll be speaking this place's language."
    ],
    "outro": [
     "[Nova]: First week done and you're still standing. The terminal isn't your enemy anymore — it's your tool.",
     "[Deniz]: Not bad, rookie. But the real work starts now: this single server is going to kill us. We're moving to the cloud."
    ]
   },
   "cloud-core": {
    "title": "ACT II — Into the Cloud",
    "intro": [
     "[Deniz]: We can't walk into an investor demo on one rented server. We're going to AWS.",
     "[Nova]: We'll build a solid cloud foundation from scratch: identity, network, compute, storage, database. In order."
    ],
    "outro": [
     "[Nova]: Meridian is on a real cloud now. The demo server won't fall over.",
     "[Deniz]: Good. But last night I changed one setting by hand and we were down for 20 minutes. That will not happen again."
    ]
   },
   "iac": {
    "title": "ACT III — Never By Hand Again",
    "intro": [
     "[Nova]: Yesterday's outage came from a hand-made change. The fix: put the infrastructure into code.",
     "[Nova]: We'll build it with Terraform so that if everything is wiped, one command brings it all back."
    ],
    "outro": [
     "[Nova]: Our infrastructure is code now. Nobody can break something permanent by accident.",
     "[Deniz]: The demo was perfect — the funding came through! But user count exploded and the system is barely holding."
    ]
   },
   "containers": {
    "title": "ACT IV — The Scale Test",
    "intro": [
     "[Deniz]: Ten times the users overnight. The servers are deep in the red.",
     "[Nova]: Containerize the app, scale it with Kubernetes. A pod can die and nobody should notice."
    ],
    "outro": [
     "[Nova]: The load is spread, the system heals itself. For the first time your phone didn't ring at night.",
     "[Deniz]: We're growing fast, but every deploy is a heart attack. And I'm done with 3 a.m. alarms."
    ]
   },
   "automation": {
    "title": "ACT V — Sleeping Through the Night",
    "intro": [
     "[Nova]: We're done releasing by hand. Pipeline: every push builds, tests and deploys itself.",
     "[Nova]: And we'll see inside the system — logs, metrics, alarms. Let's find the problem before the users do."
    ],
    "outro": [
     "[Nova]: The code tests and ships itself, and we catch problems early. The 3 a.m. alarms are nearly gone.",
     "[Deniz]: An audit is coming — security and cost review. Also, have you seen this AWS bill?"
    ]
   },
   "mastery": {
    "title": "ACT VI — The Architect",
    "intro": [
     "[Deniz]: Two problems: the risk of a security hole, and a bill that's out of control. You're closing both.",
     "[Nova]: Final act. Tighten permissions, protect secrets, rein in the cost."
    ],
    "outro": [
     "[Nova]: You did it. The system is secure, the cost is under control, and the team trusts you.",
     "[Deniz]: You're Meridian's Platform Lead now. Six weeks ago the terminal scared you; today you're our backbone.",
     "[Deniz]: We left Null alone and they burned out. We didn't leave you — we learned. Don't leave anyone alone either.",
     "[Nova]: Go on, raise your own rookies now. 🚀"
    ]
   }
  },
  "beats": {
   "c1q3": {
    "when": "complete",
    "title": "◇ A TRACE",
    "lines": [
     "[Nova]: That 'permission denied' — Null added that. The one engineer before you.",
     "[Nova]: They carried this place alone for months and left rushed patches like this. Every one of them is a time bomb."
    ]
   },
   "c3q1": {
    "when": "complete",
    "title": "◇ A TRACE",
    "lines": [
     "[Nova]: I saw it while poking at IAM: Null left an identity called 'app-bot' with full admin rights.",
     "[Nova]: Not now, but we're cleaning that bot up. Noted."
    ]
   },
   "c5q3": {
    "when": "intro",
    "title": "◇ 03:14",
    "lines": [
     "[Deniz]: Let me be honest — these midnight crashes have been going on since Null left.",
     "[Deniz]: We keep patching their patches. We need someone to break the cycle. I hope that's you."
    ]
   },
   "c7q1": {
    "when": "complete",
    "title": "◇ ROOT CAUSE",
    "lines": [
     "[Nova]: Every trail leads to one place: a cron Null set up by hand has been locking the DB every night.",
     "[Nova]: It was never random. One fragile shortcut cost us months of sleep — and now it's visible."
    ]
   },
   "c8q1": {
    "when": "complete",
    "title": "◇ THE LAST SHORTCUT",
    "lines": [
     "[Nova]: That full-admin bot you just tore out — it was Null's last shortcut.",
     "[Nova]: Not a single time bomb they left is still ticking. For the first time the system is truly yours."
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
    "[Nova]: Alright, first assignment. Let's learn to find your way around this prod box —",
    "no panic, I'll tell you exactly what to type, one step at a time."
   ],
   "objectives": [
    {
     "task": "Find out where you are (print the working directory).",
     "teach": "Everything starts with 'where am I?'. pwd = print working directory.",
     "verb": "pwd",
     "expect": {
      "cmd": [
       "pwd"
      ]
     },
     "success": "You're in /home/engineer."
    },
    {
     "task": "List the files in this directory.",
     "teach": "ls shows the files/folders in a directory (dir on Windows).",
     "verb": "ls",
     "expect": {
      "cmd": [
       "ls|dir"
      ]
     },
     "success": "What's here:  deploy/   logs/   README.md"
    },
    {
     "task": "Read the README.md file.",
     "teach": "cat <file> = print the file's contents. First thing on a new server: read the notes.",
     "verb": "cat",
     "expect": {
      "cmd": [
       "cat|less|more|head"
      ],
      "need": [
       "README.md"
      ]
     },
     "success": "README: 'Workspace is a mess — tidy the files first, then deploy.'"
    },
    {
     "task": "Go into the logs folder.",
     "teach": "cd = change directory. This is how you move between folders.",
     "verb": "cd",
     "expect": {
      "cmd": [
       "cd"
      ],
      "need": [
       "logs|logs/"
      ]
     },
     "success": "You're inside logs/. We'll dig through it shortly."
    }
   ],
   "complete": [
    "[Nova]: You can navigate a terminal now. Let's clean up those scattered files."
   ]
  },
  {
   "id": "c1q2",
   "chapter": 1,
   "title": "The File Matrix",
   "requires": [
    "c1q1"
   ],
   "xp": 70,
   "credits": 15,
   "badge": "🗂️ File Wrangler",
   "brief": [
    "[Nova]: We need a tidy folder for the deploy. Time to learn to manage the filesystem:",
    "create, copy, move, delete. This is an engineer's daily bread."
   ],
   "objectives": [
    {
     "task": "Go back up one level (to your home directory).",
     "teach": ".. = one folder up, ~ = your home directory. That's half of navigation right there.",
     "verb": "cd",
     "expect": {
      "cmd": [
       "cd"
      ],
      "need": [
       "..|~"
      ]
     },
     "success": "Back home: /home/engineer"
    },
    {
     "task": "Create a new folder called release.",
     "teach": "mkdir <name> = make directory. A tidy place for the files you'll ship.",
     "verb": "mkdir",
     "expect": {
      "cmd": [
       "mkdir"
      ],
      "need": [
       "re:.+"
      ]
     },
     "success": "release/ created."
    },
    {
     "task": "Copy (or move) a file into the release folder.",
     "teach": "cp <source> <target> copies, mv moves/renames.",
     "verb": "cp",
     "expect": {
      "cmd": [
       "cp|mv"
      ],
      "need": [
       "re:.+",
       "re:.+"
      ]
     },
     "success": "app.jar copied into release/."
    },
    {
     "task": "Delete the leftover temp file.",
     "teach": "rm <file> = delete. CAREFUL: Linux has no recycle bin — it's permanent!",
     "verb": "rm",
     "expect": {
      "cmd": [
       "rm"
      ],
      "need": [
       "re:.+"
      ]
     },
     "success": "Temp file gone. Everything's in order."
    }
   ],
   "complete": [
    "[Nova]: You own the filesystem. Next up: hunting down why the deploy keeps blowing up, in the logs."
   ]
  },
  {
   "id": "c1q3",
   "chapter": 1,
   "title": "Trail Tracker",
   "requires": [
    "c1q2"
   ],
   "xp": 85,
   "credits": 15,
   "badge": "🔎 Log Hunter",
   "brief": [
    "[Nova]: The deploy keeps failing and the reason is buried in the logs.",
    "Let's learn to pull the right clue out of thousands of lines: text processing."
   ],
   "objectives": [
    {
     "task": "Look at the last lines of the log file.",
     "teach": "tail <file> = shows the end of a file; tail -f streams it live. New errors land at the end.",
     "verb": "tail",
     "expect": {
      "cmd": [
       "tail"
      ],
      "need": [
       "re:.+"
      ]
     },
     "success": "The last lines are far too noisy — we need to filter."
    },
    {
     "task": "Filter the log lines that contain 'error'.",
     "teach": "grep <pattern> <file> = keeps only the lines matching the pattern. The heart of reading logs.",
     "verb": "grep",
     "expect": {
      "cmd": [
       "grep"
      ],
      "need": [
       "re:.+"
      ]
     },
     "success": "grep found it: 'Permission denied: deploy.sh'"
    },
    {
     "task": "Find where the deploy.sh file lives.",
     "teach": "find <where> -name <name> = searches the filesystem. Use it when you don't know where something is.",
     "verb": "find",
     "expect": {
      "cmd": [
       "find"
      ],
      "need": [
       "re:.+"
      ]
     },
     "success": "Found: ./deploy/deploy.sh"
    },
    {
     "task": "Count how many times the error repeated.",
     "teach": "wc -l counts lines; grep -c counts matches. Measuring the size of a problem matters.",
     "verb": "grep",
     "expect": {
      "anyOf": [
       {
        "cmd": [
         "wc"
        ],
        "need": [
         "-l"
        ]
       },
       {
        "cmd": [
         "grep"
        ],
        "need": [
         "-c"
        ]
       }
      ]
     },
     "success": "12 times! The root cause is clear: a permission problem. The next quest fixes it."
    }
   ],
   "complete": [
    "[Nova]: You processed the text and got down to the root cause. That's what an engineer does most often."
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
    "[Nova]: We've got our culprit: deploy.sh can't be executed — 'permission denied'.",
    "Time to learn Linux permissions: read / write / execute (rwx)."
   ],
   "objectives": [
    {
     "task": "List the files with their permissions in detail.",
     "teach": "ls -l shows each file's permissions: rwx = read/write/execute.",
     "verb": "ls",
     "expect": {
      "cmd": [
       "ls"
      ],
      "need": [
       "re:^-l"
      ]
     },
     "success": "The deploy.sh row is missing the x (execute) bit: -rw-r--r--"
    },
    {
     "task": "Give deploy.sh the execute permission.",
     "teach": "chmod +x <file> = adds the execute bit. chmod = change mode.",
     "verb": "chmod",
     "expect": {
      "cmd": [
       "chmod"
      ],
      "need": [
       "re:^(\\+x|u\\+x|a\\+x|[0-7]{3})$",
       "deploy.sh"
      ]
     },
     "success": "Permission granted: -rwxr-xr-x"
    },
    {
     "task": "Run the script.",
     "teach": "./script runs a script in the directory you're standing in.",
     "verb": "./deploy.sh",
     "expect": {
      "cmd": [
       "./deploy.sh"
      ]
     },
     "success": ">> Deploying... OK. Prod is up!"
    }
   ],
   "complete": [
    "[Nova]: Permissions are the foundation of security in the cloud. Nice work."
   ]
  },
  {
   "id": "c1q5",
   "chapter": 1,
   "title": "Ghost Process",
   "requires": [
    "c1q4"
   ],
   "xp": 90,
   "credits": 15,
   "badge": "🩺 Process Hunter",
   "brief": [
    "[Nova]: After the deploy the server is pinned at 100% CPU. Some process is running away.",
    "Read the machine's state, find the culprit and stop it."
   ],
   "objectives": [
    {
     "task": "List the running processes.",
     "teach": "ps aux = lists every process with its user/CPU/memory; top shows it live.",
     "verb": "ps",
     "expect": {
      "anyOf": [
       {
        "cmd": [
         "ps"
        ]
       },
       {
        "cmd": [
         "top"
        ]
       }
      ]
     },
     "success": "PID 4711  node  99% CPU — there's your runaway."
    },
    {
     "task": "Terminate process 4711.",
     "teach": "kill <PID> stops a process. If it resists, kill -9 <PID> forces it (process signals).",
     "verb": "kill",
     "expect": {
      "cmd": [
       "kill"
      ],
      "need": [
       "4711"
      ]
     },
     "success": "Process terminated. CPU is back to normal."
    },
    {
     "task": "Check how full the disk is.",
     "teach": "df -h = shows free/used disk space in human-readable units (server review).",
     "verb": "df",
     "expect": {
      "cmd": [
       "df"
      ]
     },
     "success": "Disk is 64% full. No problem. The system is healthy."
    }
   ],
   "complete": [
    "[Nova]: Being able to diagnose a system is what makes you a real engineer."
   ]
  },
  {
   "id": "c1q6",
   "chapter": 1,
   "title": "Daemon Awakening",
   "requires": [
    "c1q5"
   ],
   "xp": 95,
   "credits": 20,
   "badge": "🛠️ Sysadmin Initiate",
   "brief": [
    "[Nova]: The server is missing a monitoring tool and a web service.",
    "Install a package, start a service, set an environment variable — the basics of bringing a server up."
   ],
   "objectives": [
    {
     "task": "Install a package (e.g. htop).",
     "teach": "apt install (Debian/Ubuntu) or yum/dnf install (RHEL) = installs a package.",
     "verb": "sudo",
     "expect": {
      "cmd": [
       "apt|apt-get|yum|dnf",
       "install"
      ],
      "need": [
       "re:.+"
      ]
     },
     "success": "htop installed."
    },
    {
     "task": "Start the nginx service.",
     "teach": "systemctl start <service> = starts a service; enable makes it start at boot.",
     "verb": "sudo",
     "expect": {
      "cmd": [
       "systemctl",
       "start|enable|restart"
      ],
      "need": [
       "re:.+"
      ]
     },
     "success": "The nginx service is running."
    },
    {
     "task": "Check the service's status.",
     "teach": "systemctl status <service> = shows whether it's running and what the logs say.",
     "verb": "systemctl",
     "expect": {
      "cmd": [
       "systemctl",
       "status"
      ],
      "need": [
       "re:.+"
      ]
     },
     "success": "active (running). Healthy."
    },
    {
     "task": "Set an environment variable.",
     "teach": "export NAME=value = defines an environment variable. This is how apps read their config (env/PATH).",
     "verb": "export",
     "expect": {
      "cmd": [
       "export"
      ],
      "need": [
       "re:.+=.*"
      ]
     },
     "success": "APP_ENV=prod is set. The app switched to the right mode. Ch1 done! 🎉"
    }
   ],
   "complete": [
    "[Nova]: Packages, services and environment — you've finished the Linux fundamentals. Networking and Git are next."
   ]
  },
  {
   "id": "c2q1",
   "chapter": 2,
   "title": "The Lost Packet",
   "requires": [
    "c1q6"
   ],
   "xp": 95,
   "credits": 20,
   "badge": "🕵️ Network Detective",
   "brief": [
    "[Nova]: The app can't reach api.internal.",
    "Let's diagnose the network layer by layer: reachability → name resolution → service."
   ],
   "objectives": [
    {
     "task": "Ping the server to see whether packets get through.",
     "teach": "ping <host> = the basic reachability test (the ICMP protocol).",
     "verb": "ping",
     "expect": {
      "cmd": [
       "ping"
      ],
      "need": [
       "re:.+"
      ]
     },
     "success": "We get a reply, but the name doesn't seem to resolve... DNS?"
    },
    {
     "task": "Query the domain's DNS record.",
     "teach": "dig / nslookup = shows which IP DNS maps the host to (DNS resolution).",
     "verb": "nslookup",
     "expect": {
      "cmd": [
       "dig|nslookup|host"
      ],
      "need": [
       "re:.+"
      ]
     },
     "success": "DNS returns the right IP. So is the service answering?"
    },
    {
     "task": "Send a request to the HTTP service with curl.",
     "teach": "curl <URL> = an HTTP request from the command line. The bread and butter of testing an API.",
     "verb": "curl",
     "expect": {
      "cmd": [
       "curl"
      ],
      "need": [
       "re:.+"
      ]
     },
     "success": "200 OK! Turns out a security group was blocking 443. Solved."
    }
   ],
   "complete": [
    "[Nova]: Chasing network problems layer by layer is a superpower."
   ]
  },
  {
   "id": "c2q2",
   "chapter": 2,
   "title": "Layer 7",
   "requires": [
    "c2q1"
   ],
   "xp": 110,
   "credits": 20,
   "badge": "🧭 Net Navigator",
   "brief": [
    "[Nova]: The connection is still odd. Let's trace the packet's route, look at the ports,",
    "then connect to the server remotely and ship a file. (TCP/IP, routing, SSH)"
   ],
   "objectives": [
    {
     "task": "Trace the packet's route to the server.",
     "teach": "traceroute <host> = shows every stop (hop) the packet passes through. It finds where things stall.",
     "verb": "traceroute",
     "expect": {
      "cmd": [
       "traceroute|tracert|mtr"
      ],
      "need": [
       "re:.+"
      ]
     },
     "success": "There's latency at hop 5 — the network path is visible now."
    },
    {
     "task": "List the open ports / listening services.",
     "teach": "ss -tulpn (or netstat) = shows which port is being listened on by which service.",
     "verb": "ss",
     "expect": {
      "cmd": [
       "ss|netstat"
      ]
     },
     "success": "The service is listening on :8080. The port is open."
    },
    {
     "task": "Connect to the server over SSH.",
     "teach": "ssh user@host = a secure connection to a remote server. This is daily life in the cloud.",
     "verb": "ssh",
     "expect": {
      "cmd": [
       "ssh"
      ],
      "need": [
       "re:.+"
      ]
     },
     "success": "You're on the server. Remote management is live."
    },
    {
     "task": "Send a config file to the server.",
     "teach": "scp <local> user@host:<path> = copies files securely over SSH.",
     "verb": "scp",
     "expect": {
      "cmd": [
       "scp"
      ],
      "need": [
       "re:.+",
       "re:.+"
      ]
     },
     "success": "config delivered. The connectivity issue is fully resolved."
    }
   ],
   "complete": [
    "[Nova]: You unpicked the network layer by layer and took command of a remote server. Now let's version the code."
   ]
  },
  {
   "id": "c2q3",
   "chapter": 2,
   "title": "The Branch Point",
   "requires": [
    "c2q2"
   ],
   "xp": 110,
   "credits": 20,
   "badge": "🌿 Git Initiate",
   "brief": [
    "[Nova]: You need to share your changes with the team. Git time.",
    "The classic flow: clone → branch → change → commit → push → PR."
   ],
   "objectives": [
    {
     "task": "Clone the team's repository.",
     "teach": "git clone <URL> = pulls a remote repo down to your machine.",
     "verb": "git",
     "expect": {
      "cmd": [
       "git",
       "clone"
      ],
      "need": [
       "re:.+"
      ]
     },
     "success": "Repository cloned."
    },
    {
     "task": "Create a new feature branch.",
     "teach": "git checkout -b <name> or git switch -c <name> = create a new branch + switch to it.",
     "verb": "git",
     "expect": {
      "cmd": [
       "git",
       "checkout|switch"
      ],
      "need": [
       "-b|-c",
       "re:.+"
      ]
     },
     "success": "You're on the fix/timeout branch."
    },
    {
     "task": "Commit your changes (with a message).",
     "teach": "git add . then git commit -m 'message' = takes a snapshot.",
     "verb": "git",
     "expect": {
      "cmd": [
       "git",
       "commit"
      ]
     },
     "success": "Commit created."
    },
    {
     "task": "Push the branch to the remote.",
     "teach": "git push = sends your commits to the remote repo. Then you open a PR.",
     "verb": "git",
     "expect": {
      "cmd": [
       "git",
       "push"
      ]
     },
     "success": "Pushed. Ready to open a PR!"
    }
   ],
   "complete": [
    "[Nova]: Now you can work with a team safely. Version control = a time machine."
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
    "[Nova]: Sharing code isn't enough; you also need to read history, stay current and merge.",
    "Let's learn Git's 'time machine' side — the Fundamentals finale."
   ],
   "objectives": [
    {
     "task": "Check the state of your working tree.",
     "teach": "git status = shows what changed and what's staged for commit.",
     "verb": "git",
     "expect": {
      "cmd": [
       "git",
       "status"
      ]
     },
     "success": "2 modified, 1 new file. The picture is clear."
    },
    {
     "task": "Review your changes line by line.",
     "teach": "git diff = shows the lines that changed since the last commit.",
     "verb": "git",
     "expect": {
      "cmd": [
       "git",
       "diff"
      ]
     },
     "success": "You've seen the changes — no surprises in this commit."
    },
    {
     "task": "View the commit history.",
     "teach": "git log --oneline = lists past commits in summary. Who did what, and when.",
     "verb": "git",
     "expect": {
      "cmd": [
       "git",
       "log"
      ]
     },
     "success": "The recent commits are on screen. That's the time machine."
    },
    {
     "task": "Pull the team's latest changes.",
     "teach": "git pull = fetches new commits from the remote and merges them in.",
     "verb": "git",
     "expect": {
      "cmd": [
       "git",
       "pull"
      ]
     },
     "success": "The team's changes are in. You're up to date."
    },
    {
     "task": "Merge a branch into the current one.",
     "teach": "git merge <branch> = brings another branch's changes together with yours.",
     "verb": "git",
     "expect": {
      "cmd": [
       "git",
       "merge"
      ],
      "need": [
       "re:.+"
      ]
     },
     "success": "Branch merged. FUNDAMENTALS complete! 🎓"
    }
   ],
   "complete": [
    "[Nova]: You've got version control down too. Terminal, networking and Git — your foundation is solid now."
   ]
  },
  {
   "id": "c3q1",
   "chapter": 3,
   "title": "The Identity Matrix",
   "requires": [
    "c2q4"
   ],
   "xp": 150,
   "credits": 30,
   "badge": "🔑 IAM Keeper",
   "brief": [
    "[Nova]: We're entering the real cloud! But identity comes first. The rule of the cloud: WHO before WHAT.",
    "In AWS everything starts with IAM — users, policies, roles. Less privilege = less risk."
   ],
   "objectives": [
    {
     "task": "Configure your AWS CLI credentials.",
     "teach": "aws configure = sets your access key, secret and region. The door to everything.",
     "verb": "aws",
     "expect": {
      "cmd": [
       "aws",
       "configure"
      ]
     },
     "success": "Credentials configured (region: eu-central-1)."
    },
    {
     "task": "Create an IAM user with limited privileges for the app.",
     "teach": "An IAM user = an identity. Never use the root account for day-to-day work.",
     "verb": "aws",
     "expect": {
      "cmd": [
       "aws",
       "iam",
       "create-user"
      ]
     },
     "success": "The app-bot user is ready."
    },
    {
     "task": "Grant the user ONLY the permission it needs (a policy).",
     "teach": "A policy = a permission document. Least privilege: the least access possible, the least risk.",
     "verb": "aws",
     "expect": {
      "cmd": [
       "aws",
       "iam",
       "attach-user-policy"
      ]
     },
     "success": "Read-only S3 access granted. Nothing more."
    },
    {
     "task": "Create a role so services can reach each other securely.",
     "teach": "A role = lending an identity. EC2 reaches S3 through a role instead of storing keys.",
     "verb": "aws",
     "expect": {
      "cmd": [
       "aws",
       "iam",
       "create-role"
      ]
     },
     "success": "Role ready. Servers will now get access without carrying keys."
    }
   ],
   "complete": [
    "[Nova]: You've set up identity and access — the foundation of cloud security. Now let's weave the network."
   ]
  },
  {
   "id": "c3q2",
   "chapter": 3,
   "title": "The Virtual Backbone",
   "requires": [
    "c3q1"
   ],
   "xp": 150,
   "credits": 30,
   "badge": "🏗️ Network Builder",
   "brief": [
    "[Nova]: Let's build the private network our servers will live in: a VPC.",
    "CIDR for the IP range, subnets to divide it, a gateway for the internet, a security group for the wall."
   ],
   "objectives": [
    {
     "task": "Create a VPC in the 10.0.0.0/16 range.",
     "teach": "A VPC = your own isolated network. The CIDR block sets its IP range (10.0.0.0/16 ≈ 65k addresses).",
     "verb": "aws",
     "expect": {
      "cmd": [
       "aws",
       "ec2",
       "create-vpc"
      ]
     },
     "success": "VPC created: vpc-0a1b2c"
    },
    {
     "task": "Create a public subnet inside the VPC.",
     "teach": "A subnet = a slice of the VPC. A public subnet faces the internet; a private one doesn't.",
     "verb": "aws",
     "expect": {
      "cmd": [
       "aws",
       "ec2",
       "create-subnet"
      ]
     },
     "success": "Subnet ready: subnet-0d4e5f"
    },
    {
     "task": "Create an Internet Gateway.",
     "teach": "An Internet Gateway = connects the VPC to the internet. Without it you can't get out.",
     "verb": "aws",
     "expect": {
      "cmd": [
       "aws",
       "ec2",
       "create-internet-gateway"
      ]
     },
     "success": "IGW created. The network can face outward."
    },
    {
     "task": "Create a security group (firewall) to control the traffic.",
     "teach": "A security group = a firewall at the instance level. You decide which port is open to whom.",
     "verb": "aws",
     "expect": {
      "cmd": [
       "aws",
       "ec2",
       "create-security-group"
      ]
     },
     "success": "web-sg ready. The network layer is done."
    }
   ],
   "complete": [
    "[Nova]: You built your own cloud network from scratch. The VPC is the backbone of cloud engineering."
   ]
  },
  {
   "id": "c3q3",
   "chapter": 3,
   "title": "Machine Awakening",
   "requires": [
    "c3q2"
   ],
   "xp": 160,
   "credits": 35,
   "badge": "🖥️ EC2 Operator",
   "brief": [
    "[Nova]: The network is ready; now let's put a server inside it: EC2.",
    "A key pair, an instance type, launch it, then an Elastic IP for a fixed address."
   ],
   "objectives": [
    {
     "task": "Create a key pair for SSH access to the server.",
     "teach": "A key pair = your SSH key. Keep the private key safe; you connect with it instead of a password.",
     "verb": "aws",
     "expect": {
      "cmd": [
       "aws",
       "ec2",
       "create-key-pair"
      ]
     },
     "success": "cq-key created. Save the private key."
    },
    {
     "task": "Launch a t3.micro EC2 instance (Free Tier).",
     "teach": "The instance type = the CPU/RAM size. t3.micro is Free Tier eligible.",
     "verb": "aws",
     "expect": {
      "cmd": [
       "aws",
       "ec2",
       "run-instances"
      ]
     },
     "success": "EC2 running: i-0abc123"
    },
    {
     "task": "Check the running instances.",
     "teach": "describe-instances = shows the state and IP. It should say 'running'.",
     "verb": "aws",
     "expect": {
      "cmd": [
       "aws",
       "ec2",
       "describe-instances"
      ]
     },
     "success": "i-0abc123 running. The server is up."
    },
    {
     "task": "Allocate a fixed public IP (an Elastic IP).",
     "teach": "An Elastic IP = a fixed public IP that survives a server restart.",
     "verb": "aws",
     "expect": {
      "cmd": [
       "aws",
       "ec2",
       "allocate-address"
      ]
     },
     "success": "Elastic IP allocated. The address is stable now."
    }
   ],
   "complete": [
    "[Nova]: You brought your first server up inside your own network. Compute is yours."
   ]
  },
  {
   "id": "c3q4",
   "chapter": 3,
   "title": "The Object Vault",
   "requires": [
    "c3q3"
   ],
   "xp": 160,
   "credits": 30,
   "badge": "🪣 S3 Handler",
   "brief": [
    "[Nova]: Let's put the app's files into durable storage: S3.",
    "Create a bucket, upload, then turn on versioning to guard against accidental deletes."
   ],
   "objectives": [
    {
     "task": "Create a new S3 bucket.",
     "teach": "aws s3 mb s3://<name> = 'make bucket'. Names must be globally unique.",
     "verb": "aws",
     "expect": {
      "cmd": [
       "aws",
       "s3",
       "mb"
      ],
      "need": [
       "re:^s3://.+"
      ]
     },
     "success": "Bucket created."
    },
    {
     "task": "Upload a file to the bucket.",
     "teach": "aws s3 cp <source> <target> = copy/upload.",
     "verb": "aws",
     "expect": {
      "cmd": [
       "aws",
       "s3",
       "cp"
      ],
      "need": [
       "re:.+",
       "re:^s3://.+"
      ]
     },
     "success": "File uploaded. The static site is live!"
    },
    {
     "task": "Enable versioning on the bucket (accidental-delete protection).",
     "teach": "Versioning = keeps every version; delete the wrong thing and you can roll it back. Storage classes (Standard/IA/Glacier) tune the cost.",
     "verb": "aws",
     "expect": {
      "cmd": [
       "aws",
       "s3api",
       "put-bucket-versioning"
      ]
     },
     "success": "Versioning on. Deletes are reversible now."
    }
   ],
   "complete": [
    "[Nova]: You've got object storage: scalable, cheap, durable."
   ]
  },
  {
   "id": "c3q5",
   "chapter": 3,
   "title": "The Data Core",
   "requires": [
    "c3q4"
   ],
   "xp": 170,
   "credits": 35,
   "badge": "🗄️ RDS Admin",
   "brief": [
    "[Nova]: The app needs data. Don't run the database yourself — let AWS run it: RDS.",
    "Create it, watch its state, stop it when unused (cost!). Free Tier: db.t3.micro."
   ],
   "objectives": [
    {
     "task": "Create a db.t3.micro MySQL RDS instance.",
     "teach": "RDS = a managed database. Backups, patching and replication are AWS's job; you just use it.",
     "verb": "aws",
     "expect": {
      "cmd": [
       "aws",
       "rds",
       "create-db-instance"
      ]
     },
     "success": "RDS creating: cq-db"
    },
    {
     "task": "Check the database's status.",
     "teach": "describe-db-instances = once it says 'available', it's ready for connections.",
     "verb": "aws",
     "expect": {
      "cmd": [
       "aws",
       "rds",
       "describe-db-instances"
      ]
     },
     "success": "cq-db available. Ready to connect."
    },
    {
     "task": "Stop the database you aren't using (Free Tier / cost).",
     "teach": "An idle DB burns money. Stop it when you're not using it — an engineer's cost reflex.",
     "verb": "aws",
     "expect": {
      "cmd": [
       "aws",
       "rds",
       "stop-db-instance"
      ]
     },
     "success": "cq-db stopped. The bill is under control. Cloud Core done! 🎉"
    }
   ],
   "complete": [
    "[Nova]: IAM, VPC, EC2, S3, RDS — you can stand an application up on AWS end to end now."
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
    "[Nova]: Clicking by hand is error-prone and impossible to repeat. Put the infrastructure IN CODE — Terraform.",
    "The core loop: init → format → validate → preview → apply. The same result, every time."
   ],
   "objectives": [
    {
     "task": "Initialize the Terraform working directory.",
     "teach": "terraform init = downloads providers and modules and prepares the directory. The first command in any project.",
     "verb": "terraform",
     "expect": {
      "cmd": [
       "terraform",
       "init"
      ]
     },
     "success": "Terraform initialized. The AWS provider was downloaded."
    },
    {
     "task": "Put the code into standard formatting.",
     "teach": "terraform fmt = auto-aligns your HCL files. Keeps a team consistent.",
     "verb": "terraform",
     "expect": {
      "cmd": [
       "terraform",
       "fmt"
      ]
     },
     "success": "main.tf formatted."
    },
    {
     "task": "Validate that the code is well-formed.",
     "teach": "terraform validate = checks syntax and consistency (without applying).",
     "verb": "terraform",
     "expect": {
      "cmd": [
       "terraform",
       "validate"
      ]
     },
     "success": "Success! Configuration is valid."
    },
    {
     "task": "Preview what will happen.",
     "teach": "terraform plan = shows what would change WITHOUT applying it. Always plan first.",
     "verb": "terraform",
     "expect": {
      "cmd": [
       "terraform",
       "plan"
      ]
     },
     "success": "Plan: 3 to add, 0 to change, 0 to destroy."
    },
    {
     "task": "Apply the infrastructure.",
     "teach": "terraform apply = turns the plan into reality.",
     "verb": "terraform",
     "expect": {
      "cmd": [
       "terraform",
       "apply"
      ]
     },
     "success": "Apply complete! 3 resources created — no clicking, fully reproducible."
    }
   ],
   "complete": [
    "[Nova]: You've set up the IaC loop. From here on, infrastructure = code = reliability."
   ]
  },
  {
   "id": "c4q2",
   "chapter": 4,
   "title": "The Parametric System",
   "requires": [
    "c4q1"
   ],
   "xp": 170,
   "credits": 35,
   "badge": "✍️ HCL Scripter",
   "brief": [
    "[Nova]: Hard-coded values are bad. Flex the code with variables, share the results with outputs."
   ],
   "objectives": [
    {
     "task": "Run a plan with an input variable.",
     "teach": "An input variable = a parameter of your code. You pass a value from outside with -var.",
     "verb": "terraform",
     "expect": {
      "cmd": [
       "terraform",
       "plan"
      ],
      "need": [
       "re:^-var"
      ]
     },
     "success": "3 instances planned. The code is flexible now."
    },
    {
     "task": "Apply using an environment-specific variable file.",
     "teach": "Files like prod.tfvars carry per-environment values (-var-file).",
     "verb": "terraform",
     "expect": {
      "cmd": [
       "terraform",
       "apply"
      ],
      "need": [
       "re:^-var-file"
      ]
     },
     "success": "Applied with the prod values."
    },
    {
     "task": "Show the resulting values (IP, URL).",
     "teach": "output = the values your infrastructure hands back. You read them with terraform output.",
     "verb": "terraform",
     "expect": {
      "cmd": [
       "terraform",
       "output"
      ]
     },
     "success": "instance_ip = 3.120.x.x. The outputs are ready."
    },
    {
     "task": "Evaluate expressions interactively.",
     "teach": "terraform console = a REPL for trying out HCL expressions and variables.",
     "verb": "terraform",
     "expect": {
      "cmd": [
       "terraform",
       "console"
      ]
     },
     "success": "> var.region -> 'eu-central-1'. The console works."
    }
   ],
   "complete": [
    "[Nova]: With variables and outputs your code is reusable now."
   ]
  },
  {
   "id": "c4q3",
   "chapter": 4,
   "title": "The State Map",
   "requires": [
    "c4q2"
   ],
   "xp": 170,
   "credits": 35,
   "badge": "🗺️ State Keeper",
   "brief": [
    "[Nova]: Terraform keeps reality in a 'state' file. Learn to read it and to repair it."
   ],
   "objectives": [
    {
     "task": "List the resources in the state.",
     "teach": "terraform state list = lists every resource Terraform manages.",
     "verb": "terraform",
     "expect": {
      "cmd": [
       "terraform",
       "state",
       "list"
      ]
     },
     "success": "aws_instance.web, aws_s3_bucket.assets ... listed."
    },
    {
     "task": "Inspect one resource in detail.",
     "teach": "terraform state show <address> = shows every field of a single resource.",
     "verb": "terraform",
     "expect": {
      "cmd": [
       "terraform",
       "state",
       "show"
      ],
      "need": [
       "re:.+"
      ]
     },
     "success": "All of the web instance's attributes are on screen."
    },
    {
     "task": "Bring a hand-created resource under Terraform.",
     "teach": "terraform import = adds an existing (manually created) resource to the state; it takes over management without recreating it.",
     "verb": "terraform",
     "expect": {
      "cmd": [
       "terraform",
       "import"
      ],
      "need": [
       "re:.+",
       "re:.+"
      ]
     },
     "success": "The old bucket is under Terraform management now."
    },
    {
     "task": "Recreate a broken resource.",
     "teach": "terraform apply -replace=<address> = destroys and recreates a single resource (formerly: taint).",
     "verb": "terraform",
     "expect": {
      "cmd": [
       "terraform",
       "apply"
      ],
      "need": [
       "re:^-replace"
      ]
     },
     "success": "The web instance was recreated."
    }
   ],
   "complete": [
    "[Nova]: Being able to read and repair state is the skill that saves you in the real world."
   ]
  },
  {
   "id": "c4q4",
   "chapter": 4,
   "title": "Modular Architecture",
   "requires": [
    "c4q3"
   ],
   "xp": 180,
   "credits": 40,
   "badge": "🏛️ IaC Architect",
   "brief": [
    "[Nova]: Kill the repetition with modules, separate environments with workspaces, then clean up properly."
   ],
   "objectives": [
    {
     "task": "Download/update the modules used by the code.",
     "teach": "terraform get = downloads the modules referenced in your source. (init does it too; get is modules only.)",
     "verb": "terraform",
     "expect": {
      "cmd": [
       "terraform",
       "get"
      ]
     },
     "success": "The vpc and ec2 modules were downloaded."
    },
    {
     "task": "Create a separate environment (workspace).",
     "teach": "A workspace = isolated state for the same code (dev/prod). terraform workspace new prod.",
     "verb": "terraform",
     "expect": {
      "cmd": [
       "terraform",
       "workspace",
       "new"
      ],
      "need": [
       "re:.+"
      ]
     },
     "success": "The prod workspace was created and selected."
    },
    {
     "task": "Generate the dependency graph.",
     "teach": "terraform graph = emits the resources' dependency graph (DOT). You see what depends on what.",
     "verb": "terraform",
     "expect": {
      "cmd": [
       "terraform",
       "graph"
      ]
     },
     "success": "Dependency graph generated."
    },
    {
     "task": "Tear everything down with one command (cost!).",
     "teach": "terraform destroy = deletes everything it created. Cleaning up after a test = cost control.",
     "verb": "terraform",
     "expect": {
      "cmd": [
       "terraform",
       "destroy"
      ]
     },
     "success": "Destroy complete! Resources deleted. The IaC module is done! 🎉"
    }
   ],
   "complete": [
    "[Nova]: Modules, workspaces and a clean lifecycle — you code infrastructure like a professional now."
   ]
  },
  {
   "id": "c5q1",
   "chapter": 5,
   "title": "Container Genesis",
   "requires": [
    "c4q4"
   ],
   "xp": 180,
   "credits": 40,
   "badge": "🐳 Container Captain",
   "brief": [
    "[Nova]: The 'works on my machine' era is over. Package it with Docker.",
    "The app plus its dependencies in a single image. It runs the same everywhere."
   ],
   "objectives": [
    {
     "task": "Build an image from the Dockerfile.",
     "teach": "docker build -t <name> . = reads the Dockerfile and produces an image.",
     "verb": "docker",
     "expect": {
      "cmd": [
       "docker",
       "build"
      ]
     },
     "success": "Image built: myapp:1.0"
    },
    {
     "task": "Run a container from the image.",
     "teach": "docker run = brings the image to life. -p publishes a port.",
     "verb": "docker",
     "expect": {
      "cmd": [
       "docker",
       "run"
      ]
     },
     "success": "Container up, serving on :8080."
    },
    {
     "task": "List the running containers.",
     "teach": "docker ps = shows the running containers.",
     "verb": "docker",
     "expect": {
      "cmd": [
       "docker",
       "ps"
      ]
     },
     "success": "1 container running. Healthy."
    },
    {
     "task": "Bring the whole stack up with compose.",
     "teach": "docker compose up = starts several services (app+db) with one command.",
     "verb": "docker",
     "expect": {
      "anyOf": [
       {
        "cmd": [
         "docker",
         "compose",
         "up"
        ]
       },
       {
        "cmd": [
         "docker-compose",
         "up"
        ]
       }
      ]
     },
     "success": "app + db are up together. Full stack in containers!"
    }
   ],
   "complete": [
    "[Nova]: You've laid Docker's foundation. Now make the data durable and share the image."
   ]
  },
  {
   "id": "c5q2",
   "chapter": 5,
   "title": "Persistent Memory",
   "requires": [
    "c5q1"
   ],
   "xp": 180,
   "credits": 40,
   "badge": "🚢 Image Shipper",
   "brief": [
    "[Nova]: Running the image isn't enough; get inside it, make the data durable, then push it to a registry.",
    "So other people can 'pull' your image — that's how a team works."
   ],
   "objectives": [
    {
     "task": "Get inside the running container.",
     "teach": "docker exec -it <container> sh = runs a command/shell inside a running container. Perfect for debugging.",
     "verb": "docker",
     "expect": {
      "cmd": [
       "docker",
       "exec"
      ]
     },
     "success": "You're inside the container: / #"
    },
    {
     "task": "Create a volume for persistent data.",
     "teach": "A container's filesystem is ephemeral — delete it and the data is gone. A volume = durable storage.",
     "verb": "docker",
     "expect": {
      "cmd": [
       "docker",
       "volume",
       "create"
      ],
      "need": [
       "re:.+"
      ]
     },
     "success": "The appdata volume is ready. The data outlives the container now."
    },
    {
     "task": "Tag the image for the registry.",
     "teach": "docker tag <image> <registry/user/name:tag> = names it for a push to a registry.",
     "verb": "docker",
     "expect": {
      "cmd": [
       "docker",
       "tag"
      ],
      "need": [
       "re:.+",
       "re:.+"
      ]
     },
     "success": "Image tagged: mehmet/myapp:1.0"
    },
    {
     "task": "Push the image to the registry.",
     "teach": "docker push = uploads the image to a registry like DockerHub/ECR; others fetch it with 'pull'.",
     "verb": "docker",
     "expect": {
      "cmd": [
       "docker",
       "push"
      ],
      "need": [
       "re:.+"
      ]
     },
     "success": "Push complete. The image is reachable from anywhere now."
    }
   ],
   "complete": [
    "[Nova]: With persistence and a registry you've gone pro on Docker. Now for the orchestra: Kubernetes."
   ]
  },
  {
   "id": "c5q3",
   "chapter": 5,
   "title": "Orchestration",
   "requires": [
    "c5q2"
   ],
   "xp": 190,
   "credits": 40,
   "badge": "☸️ kubectl Pilot",
   "brief": [
    "[Nova]: One container isn't enough. Scale it and make it resilient with Kubernetes.",
    "kubectl = Kubernetes' command line. The concepts: pod, deployment, service."
   ],
   "objectives": [
    {
     "task": "List the nodes in the cluster.",
     "teach": "kubectl get nodes = shows the machines in the cluster.",
     "verb": "kubectl",
     "expect": {
      "cmd": [
       "kubectl",
       "get",
       "nodes"
      ]
     },
     "success": "2 nodes Ready."
    },
    {
     "task": "Create a deployment.",
     "teach": "kubectl create deployment <name> --image=<img> = deploys the application.",
     "verb": "kubectl",
     "expect": {
      "cmd": [
       "kubectl",
       "create",
       "deployment"
      ],
      "need": [
       "re:.+"
      ]
     },
     "success": "deployment.apps/web created"
    },
    {
     "task": "View the running pods.",
     "teach": "kubectl get pods = lists the pods that came up.",
     "verb": "kubectl",
     "expect": {
      "cmd": [
       "kubectl",
       "get",
       "pods"
      ]
     },
     "success": "web-xxxx  1/1  Running. The app is up."
    },
    {
     "task": "Expose the deployment with a Service.",
     "teach": "A Service = stable access to your pods plus load balancing. Pods come and go; the Service stays put.",
     "verb": "kubectl",
     "expect": {
      "cmd": [
       "kubectl",
       "expose"
      ],
      "need": [
       "re:.+"
      ]
     },
     "success": "service/web exposed. Traffic is being distributed now."
    }
   ],
   "complete": [
    "[Nova]: With a Deployment and a Service you've published your app on the cluster."
   ]
  },
  {
   "id": "c5q4",
   "chapter": 5,
   "title": "The Scale Engine",
   "requires": [
    "c5q3"
   ],
   "xp": 200,
   "credits": 45,
   "badge": "🎛️ K8s Operator",
   "brief": [
    "[Nova]: Publishing is the start. Now scale it, configure it, manage versions and debug it."
   ],
   "objectives": [
    {
     "task": "Scale the deployment to 3 replicas.",
     "teach": "kubectl scale = changes the replica count. Load spreads out, and the service survives a dead pod.",
     "verb": "kubectl",
     "expect": {
      "cmd": [
       "kubectl",
       "scale"
      ],
      "need": [
       "re:replicas=?\\d|^\\d+$"
      ]
     },
     "success": "3 replicas running. Resilience is up."
    },
    {
     "task": "Inject configuration with a ConfigMap.",
     "teach": "A ConfigMap = configuration kept out of the code (env vars, settings). For sensitive values you use a Secret.",
     "verb": "kubectl",
     "expect": {
      "cmd": [
       "kubectl",
       "create",
       "configmap"
      ],
      "need": [
       "re:.+"
      ]
     },
     "success": "app-config created. Config is separated from the code."
    },
    {
     "task": "Roll back a bad release.",
     "teach": "kubectl rollout = manages rolling updates and rollbacks. undo returns you to the last good version.",
     "verb": "kubectl",
     "expect": {
      "cmd": [
       "kubectl",
       "rollout"
      ],
      "need": [
       "undo|status|history|restart"
      ]
     },
     "success": "Rolled back to the previous version. No downtime."
    },
    {
     "task": "Debug by looking at a pod's logs.",
     "teach": "kubectl logs <pod> = shows a pod's logs. describe shows you the events and the reason as well.",
     "verb": "kubectl",
     "expect": {
      "cmd": [
       "kubectl",
       "logs"
      ],
      "need": [
       "re:.+"
      ]
     },
     "success": "The logs are on screen. You got to the root cause. The Containers module is done! 🎉"
    }
   ],
   "complete": [
    "[Nova]: Scaling, config, releases and debugging — you can operate Kubernetes now."
   ]
  },
  {
   "id": "c6q1",
   "chapter": 6,
   "title": "The Autonomous Line",
   "requires": [
    "c5q4"
   ],
   "xp": 200,
   "credits": 45,
   "badge": "🚀 Pipeline Builder",
   "brief": [
    "[Nova]: Testing and deploying by hand on every push isn't sustainable.",
    "Build a pipeline with GitHub Actions: build → test → deploy, fully automatic."
   ],
   "objectives": [
    {
     "task": "Create the folder for workflow files.",
     "teach": "GitHub Actions runs the YAML files under .github/workflows/.",
     "verb": "mkdir",
     "expect": {
      "cmd": [
       "mkdir"
      ],
      "need": [
       "re:\\.github/workflows"
      ]
     },
     "success": ".github/workflows/ created."
    },
    {
     "task": "Build the project.",
     "teach": "The first step of CI is the build. If it doesn't compile it won't even be tested — fast feedback.",
     "verb": "npm",
     "expect": {
      "anyOf": [
       {
        "cmd": [
         "npm",
         "run",
         "build"
        ]
       },
       {
        "cmd": [
         "make",
         "build"
        ]
       },
       {
        "cmd": [
         "docker",
         "build"
        ]
       }
      ]
     },
     "success": "Build succeeded. The artifact is ready."
    },
    {
     "task": "Run the tests locally (before putting them in the pipeline).",
     "teach": "Tests are the heart of CI. They have to pass locally first: npm test / pytest and so on.",
     "verb": "npm",
     "expect": {
      "anyOf": [
       {
        "cmd": [
         "npm",
         "test"
        ]
       },
       {
        "cmd": [
         "npm",
         "run",
         "test"
        ]
       },
       {
        "cmd": [
         "pytest"
        ]
       },
       {
        "cmd": [
         "make",
         "test"
        ]
       }
      ]
     },
     "success": "All tests passed (12 passed)."
    },
    {
     "task": "Commit and push the workflow (let the pipeline fire).",
     "teach": "The push triggers the workflow. Build and test run automatically on GitHub's servers.",
     "verb": "git",
     "expect": {
      "cmd": [
       "git",
       "push"
      ]
     },
     "success": "Actions triggered: build ✔ test ✔. A green pipeline!"
    }
   ],
   "complete": [
    "[Nova]: Your code builds and tests itself now. Next: safe automatic delivery (CD)."
   ]
  },
  {
   "id": "c6q2",
   "chapter": 6,
   "title": "The Deploy Gate",
   "requires": [
    "c6q1"
   ],
   "xp": 200,
   "credits": 45,
   "badge": "🚦 Release Conductor",
   "brief": [
    "[Nova]: The tests are green but we're not done. Now for safe, automatic DELIVERY: secrets, triggers, monitoring, deploy.",
    "No more 'pushing to prod by hand'."
   ],
   "objectives": [
    {
     "task": "Add the deploy secrets to the repository secrets.",
     "teach": "NEVER write deploy keys into the code. Keep them in GitHub repo secrets; Actions reads them at runtime.",
     "verb": "gh",
     "expect": {
      "cmd": [
       "gh",
       "secret",
       "set"
      ],
      "need": [
       "re:.+"
      ]
     },
     "success": "AWS_DEPLOY_KEY stored safely."
    },
    {
     "task": "Trigger the pipeline manually (workflow_dispatch).",
     "teach": "Some jobs (like a deploy) you want to trigger by hand. gh workflow run does exactly that.",
     "verb": "gh",
     "expect": {
      "cmd": [
       "gh",
       "workflow",
       "run"
      ],
      "need": [
       "re:.+"
      ]
     },
     "success": "deploy.yml triggered."
    },
    {
     "task": "Watch the running pipeline live.",
     "teach": "gh run watch/list = follows the pipeline's state from your terminal. If it goes red, you step in.",
     "verb": "gh",
     "expect": {
      "cmd": [
       "gh",
       "run"
      ],
      "need": [
       "watch|list|view"
      ]
     },
     "success": "Every step green. The deploy job has started."
    },
    {
     "task": "Apply the new version to the cluster (the deploy step).",
     "teach": "The last step of CD: apply the new version to the environment. kubectl apply turns manifests into reality.",
     "verb": "kubectl",
     "expect": {
      "cmd": [
       "kubectl",
       "apply"
      ],
      "need": [
       "re:.+"
      ]
     },
     "success": "The new version is live. No hands, fully traceable."
    }
   ],
   "complete": [
    "[Nova]: Every approved change now reaches production safely, automatically and traceably."
   ]
  },
  {
   "id": "c7q1",
   "chapter": 7,
   "title": "The Invisible Layer",
   "requires": [
    "c6q2"
   ],
   "xp": 210,
   "credits": 50,
   "badge": "👁️ Observer",
   "brief": [
    "[Nova]: The alarm went off at 3 a.m. Someone reports 'it's slow' — but where?",
    "The 3 pillars of observability: logs, metrics, traces."
   ],
   "objectives": [
    {
     "task": "Follow the application logs live.",
     "teach": "tail -f = shows new lines as they're appended to the file, live.",
     "verb": "tail",
     "expect": {
      "anyOf": [
       {
        "cmd": [
         "tail"
        ],
        "need": [
         "-f"
        ]
       },
       {
        "cmd": [
         "kubectl",
         "logs"
        ]
       }
      ]
     },
     "success": "The logs keep repeating 'DB timeout'. That's the clue."
    },
    {
     "task": "Look at the container/service metrics.",
     "teach": "CPU/memory/request metrics point at the bottleneck. For example: kubectl top pods.",
     "verb": "kubectl",
     "expect": {
      "anyOf": [
       {
        "cmd": [
         "kubectl",
         "top"
        ]
       },
       {
        "cmd": [
         "docker",
         "stats"
        ]
       },
       {
        "cmd": [
         "top"
        ]
       }
      ]
     },
     "success": "The DB pod is in the red on memory. It doesn't have enough resources."
    },
    {
     "task": "Hit the health endpoint to confirm.",
     "teach": "A health endpoint is a quick pulse check. Automated alarms watch it.",
     "verb": "curl",
     "expect": {
      "cmd": [
       "curl"
      ],
      "need": [
       "re:/(health|healthz|status)"
      ]
     },
     "success": "{db: degraded} — root cause confirmed. An alarm is set up in Grafana."
    }
   ],
   "complete": [
    "[Nova]: You can't manage what you can't measure. But checking by hand isn't enough — the system should tell you."
   ]
  },
  {
   "id": "c7q2",
   "chapter": 7,
   "title": "The Signal Network",
   "requires": [
    "c7q1"
   ],
   "xp": 220,
   "credits": 50,
   "badge": "🔔 Signal Master",
   "brief": [
    "[Nova]: Observability isn't reading logs one by one. Query metrics, set alarms, follow distributed traces, watch a dashboard.",
    "The goal: catch the problem BEFORE the user does."
   ],
   "objectives": [
    {
     "task": "Query a metric from Prometheus (PromQL).",
     "teach": "Prometheus metrics are queried with PromQL (up, http_requests_total, latency...).",
     "verb": "curl",
     "expect": {
      "cmd": [
       "curl"
      ],
      "need": [
       "re:query|prometheus|9090"
      ]
     },
     "success": "up{job=\"web\"} = 1. The service is up and metrics are flowing."
    },
    {
     "task": "Validate the alerting rules.",
     "teach": "Alerting rules (high error rate, latency) get validated before they ship: promtool.",
     "verb": "promtool",
     "expect": {
      "cmd": [
       "promtool",
       "check",
       "rules"
      ],
      "need": [
       "re:.+"
      ]
     },
     "success": "SUCCESS: 3 rules valid (HighErrorRate, HighLatency, PodDown)."
    },
    {
     "task": "Reach your Grafana dashboard.",
     "teach": "Grafana visualizes metrics. port-forward connects you to the dashboard from your machine.",
     "verb": "kubectl",
     "expect": {
      "cmd": [
       "kubectl",
       "port-forward"
      ],
      "need": [
       "re:.+"
      ]
     },
     "success": "Grafana is on :3000. The latency graph is on screen."
    },
    {
     "task": "Inspect one request's distributed trace.",
     "teach": "Distributed tracing (Jaeger/OpenTelemetry) shows a request's path across services; the slow part becomes obvious.",
     "verb": "curl",
     "expect": {
      "cmd": [
       "curl"
      ],
      "need": [
       "re:jaeger|traces|16686"
      ]
     },
     "success": "Trace: the latency is in the DB call (820ms). Root cause visible. The Automation module is done! 🎉"
    }
   ],
   "complete": [
    "[Nova]: Metrics, alarms, dashboards and traces — you can see the system's nervous system now."
   ]
  },
  {
   "id": "c8q1",
   "chapter": 8,
   "title": "The Access Shield",
   "requires": [
    "c7q2"
   ],
   "xp": 230,
   "credits": 55,
   "badge": "🛡️ Cloud Guardian",
   "brief": [
    "[Nova]: The final act: security and cost — the two things that make an engineer senior.",
    "Access and secrets first. Least privilege, locked-up secrets, an auditable account."
   ],
   "objectives": [
    {
     "task": "Audit an IAM user's permissions.",
     "teach": "Excess privilege = risk. First see who can reach what (least privilege).",
     "verb": "aws",
     "expect": {
      "anyOf": [
       {
        "cmd": [
         "aws",
         "iam",
         "list-attached-user-policies"
        ]
       },
       {
        "cmd": [
         "aws",
         "iam",
         "list-user-policies"
        ]
       }
      ]
     },
     "success": "app-bot has AdministratorAccess — far too broad! It needs narrowing."
    },
    {
     "task": "Remove the excess privilege (apply least privilege).",
     "teach": "detach-user-policy = strips an unnecessary permission. As much access as needed, not one bit more.",
     "verb": "aws",
     "expect": {
      "cmd": [
       "aws",
       "iam",
       "detach-user-policy"
      ]
     },
     "success": "AdministratorAccess detached. app-bot can only reach what it needs now."
    },
    {
     "task": "Store the secret in a secret manager instead of in code.",
     "teach": "NEVER write an API key into the repo. Keep it in a vault like Secrets Manager.",
     "verb": "aws",
     "expect": {
      "cmd": [
       "aws",
       "secretsmanager",
       "create-secret"
      ]
     },
     "success": "The secret is in the vault. No plaintext passwords left in the repo."
    },
    {
     "task": "Turn on the audit log — make it visible who did what.",
     "teach": "CloudTrail records every API call. During an incident, 'who, when, what' comes from here.",
     "verb": "aws",
     "expect": {
      "cmd": [
       "aws",
       "cloudtrail",
       "create-trail"
      ]
     },
     "success": "The audit trail is on. Every move is recorded now."
    }
   ],
   "complete": [
    "[Nova]: Access and secrets are safe. But the data itself may still be exposed — let's protect it."
   ]
  },
  {
   "id": "c8q2",
   "chapter": 8,
   "title": "The Encryption Layer",
   "requires": [
    "c8q1"
   ],
   "xp": 240,
   "credits": 55,
   "badge": "🔒 Data Protector",
   "brief": [
    "[Nova]: The most common breach: a bucket accidentally left open to the world. Close the data off, encrypt it, scan your code."
   ],
   "objectives": [
    {
     "task": "Block public access on the S3 bucket.",
     "teach": "A public access block = stops the bucket being opened to the internet by accident. Default: blocked.",
     "verb": "aws",
     "expect": {
      "cmd": [
       "aws",
       "s3api",
       "put-public-access-block"
      ]
     },
     "success": "Public access blocked. The data isn't visible from outside anymore."
    },
    {
     "task": "Encrypt the data at rest in the bucket.",
     "teach": "put-bucket-encryption = encrypts data on disk automatically (SSE). Even if it's stolen it can't be read.",
     "verb": "aws",
     "expect": {
      "cmd": [
       "aws",
       "s3api",
       "put-bucket-encryption"
      ]
     },
     "success": "Encryption active (AES256). Data at rest is safe."
    },
    {
     "task": "Scan the image/code for vulnerabilities.",
     "teach": "Trivy (images) / Checkov (IaC) = catch known vulnerabilities and misconfigurations before they ship.",
     "verb": "trivy",
     "expect": {
      "anyOf": [
       {
        "cmd": [
         "trivy",
         "image"
        ],
        "need": [
         "re:.+"
        ]
       },
       {
        "cmd": [
         "trivy"
        ]
       },
       {
        "cmd": [
         "checkov"
        ]
       }
      ]
     },
     "success": "Scan complete: 2 critical issues found and patched. Clean."
    }
   ],
   "complete": [
    "[Nova]: The data is locked and encrypted, the code is scanned. One thing left: the bill."
   ]
  },
  {
   "id": "c8q3",
   "chapter": 8,
   "title": "The Budget Lock",
   "requires": [
    "c8q2"
   ],
   "xp": 260,
   "credits": 65,
   "badge": "💰 Cost Sentinel",
   "brief": [
    "[Nova]: Growth is great, a surprise invoice isn't. See the cost, cap it, tag it, cut the waste.",
    "Do this and you're not a rookie anymore — you're Meridian's architect."
   ],
   "objectives": [
    {
     "task": "Report this month's cloud cost.",
     "teach": "Cost Explorer (ce) breaks spend down by service and by day. Check it regularly.",
     "verb": "aws",
     "expect": {
      "cmd": [
       "aws",
       "ce",
       "get-cost-and-usage"
      ]
     },
     "success": "$842 this month. Up 60% from last month — this needs control."
    },
    {
     "task": "Set up a budget that warns you when a threshold is crossed.",
     "teach": "Budgets = a spending threshold plus an alarm. You get an email/alert before the bill balloons.",
     "verb": "aws",
     "expect": {
      "cmd": [
       "aws",
       "budgets",
       "create-budget"
      ]
     },
     "success": "A $1000 monthly budget with an 80% alarm is set. No surprises."
    },
    {
     "task": "Tag the resources (which team/project is spending).",
     "teach": "Cost allocation tags = split the cost by team or project. The answer to 'where is this money going?'.",
     "verb": "aws",
     "expect": {
      "cmd": [
       "aws",
       "ec2",
       "create-tags"
      ],
      "need": [
       "re:.+"
      ]
     },
     "success": "Resources tagged. Cost is visible per team now."
    },
    {
     "task": "Stop the idle resource (cut the waste).",
     "teach": "An unused instance burns money. Shutting it down = instant savings.",
     "verb": "aws",
     "expect": {
      "cmd": [
       "aws",
       "ec2",
       "stop-instances"
      ],
      "need": [
       "re:.+"
      ]
     },
     "success": "The test server is stopped. The bill is trending down. 🎉"
    }
   ],
   "complete": [
    "[Nova]: Security and cost — you closed both. The journey is complete.",
    "Terminal, networking, AWS, IaC, containers, CI/CD, observability and security: all yours now.",
    "Next comes the real world: grow your portfolio on GitHub, get ready for the AWS SAA certification."
   ]
  }
 ],
 "modules": [
  {
   "id": "net",
   "icon": "🛰️",
   "title": "Network Ops",
   "status": "active",
   "desc": "network diagnosis games: port scanning, DNS/routing, packet capture, firewalls",
   "topics": [
    "port scanning",
    "DNS & routing",
    "packet capture",
    "firewall/route debug"
   ],
   "quests": [
    {
     "id": "netq1",
     "title": "The Port Map",
     "requires": [],
     "xp": 120,
     "credits": 25,
     "badge": "🔌 Port Hunter",
     "brief": [
      "[Nova]: Welcome to the network dojo. Real faults, real commands.",
      "A service is unreachable. First find out which ports are open and who's listening."
     ],
     "objectives": [
      {
       "task": "Scan the open ports on the target machine.",
       "teach": "nmap = scans which ports are open on a remote host. The first step of diagnosis.",
       "verb": "nmap",
       "expect": {
        "cmd": [
         "nmap"
        ],
        "need": [
         "re:.+"
        ]
       },
       "success": "22, 80, 8080 open; 443 CLOSED. Interesting."
      },
      {
       "task": "List the services/ports listening locally.",
       "teach": "ss -tulpn (or netstat) = which port is listened on by which process on this machine.",
       "verb": "ss",
       "expect": {
        "cmd": [
         "ss|netstat"
        ]
       },
       "success": "The 'api' process is listening on 8080, nothing is listening on 443."
      },
      {
       "task": "Find which process is holding a given port.",
       "teach": "lsof -i :PORT (or fuser) = shows the process using that port.",
       "verb": "lsof",
       "expect": {
        "anyOf": [
         {
          "cmd": [
           "lsof"
          ]
         },
         {
          "cmd": [
           "fuser"
          ]
         }
        ]
       },
       "success": "PID 3120 / api. The process is up, just on the wrong port."
      },
      {
       "task": "Test connecting to the port.",
       "teach": "nc -zv host port = tries a TCP connection to the port (scan/verify). telnet works too.",
       "verb": "nc",
       "expect": {
        "anyOf": [
         {
          "cmd": [
           "nc"
          ],
          "need": [
           "re:.+"
          ]
         },
         {
          "cmd": [
           "ncat"
          ],
          "need": [
           "re:.+"
          ]
         },
         {
          "cmd": [
           "telnet"
          ],
          "need": [
           "re:.+"
          ]
         }
        ]
       },
       "success": "80 is open, 443 refuses. The service is up on the wrong port."
      }
     ],
     "complete": [
      "[Nova]: You've mapped the ports. The problem is that nothing ever listens on 443 — note it and keep going."
     ]
    },
    {
     "id": "netq2",
     "title": "The DNS Labyrinth",
     "requires": [
      "netq1"
     ],
     "xp": 130,
     "credits": 30,
     "badge": "📡 Route Tracer",
     "brief": [
      "[Nova]: Sometimes the problem isn't the machine but the name resolution, or the route.",
      "Untangle the DNS chain and the path the packet takes."
     ],
     "objectives": [
      {
       "task": "Trace DNS resolution from the root servers.",
       "teach": "dig +trace = shows step by step how a domain resolves, starting at the root.",
       "verb": "dig",
       "expect": {
        "cmd": [
         "dig"
        ],
        "need": [
         "re:trace"
        ]
       },
       "success": "The authoritative server returns the old IP — the record was never updated."
      },
      {
       "task": "Query a reverse DNS entry or a specific record type.",
       "teach": "dig -x IP = reverse DNS; dig MX/NS/TXT name = a specific record type.",
       "verb": "dig",
       "expect": {
        "cmd": [
         "dig|nslookup|host"
        ],
        "need": [
         "re:^-x$|MX|mx|NS|ns|TXT|txt|ANY|any"
        ]
       },
       "success": "The reverse record points at a different host. The confusion is confirmed."
      },
      {
       "task": "Inspect the routing table.",
       "teach": "ip route = shows which gateway packets leave through. A wrong route = unreachable.",
       "verb": "ip",
       "expect": {
        "anyOf": [
         {
          "cmd": [
           "ip",
           "route"
          ]
         },
         {
          "cmd": [
           "route"
          ]
         },
         {
          "cmd": [
           "netstat"
          ],
          "need": [
           "-r|-rn"
          ]
         }
        ]
       },
       "success": "The gateway for 10.0.0.0/24 is wrong. There's the break."
      },
      {
       "task": "Follow the path and latency hop by hop.",
       "teach": "mtr / traceroute = shows every stop the packet passes and the latency, live.",
       "verb": "mtr",
       "expect": {
        "cmd": [
         "mtr|traceroute|tracert"
        ],
        "need": [
         "re:.+"
        ]
       },
       "success": "Packets vanish at hop 3 — it'll clear once the route is fixed."
      }
     ],
     "complete": [
      "[Nova]: You solved name resolution and routing. The map of the network is in your head now."
     ]
    },
    {
     "id": "netq3",
     "title": "Packet Hunter",
     "requires": [
      "netq2"
     ],
     "xp": 140,
     "credits": 35,
     "badge": "🕸️ Packet Catcher",
     "brief": [
      "[Nova]: When the logs go quiet we look at the truth on the wire: the packets.",
      "Capture the traffic, inspect the TLS handshake."
     ],
     "objectives": [
      {
       "task": "Capture the relevant traffic live.",
       "teach": "tcpdump -i <interface> <filter> = captures packets crossing the network. The filter is essential or you'll drown.",
       "verb": "tcpdump",
       "expect": {
        "cmd": [
         "tcpdump"
        ],
        "need": [
         "re:.+"
        ]
       },
       "success": "SYN goes out but no SYN-ACK comes back — the other side is refusing."
      },
      {
       "task": "See the connection's details with curl (verbose).",
       "teach": "curl -v = prints the DNS, TCP, TLS and HTTP steps one by one. Where it breaks becomes obvious.",
       "verb": "curl",
       "expect": {
        "cmd": [
         "curl"
        ],
        "need": [
         "re:^-v"
        ]
       },
       "success": "It stalls at the TLS handshake: a certificate mismatch."
      },
      {
       "task": "Inspect the TLS certificate directly.",
       "teach": "openssl s_client -connect host:443 = shows the certificate the server presents.",
       "verb": "openssl",
       "expect": {
        "cmd": [
         "openssl",
         "s_client"
        ]
       },
       "success": "The certificate belongs to the wrong domain, and it's expired. That's the root cause."
      },
      {
       "task": "Analyze the captured packets (pcap).",
       "teach": "tshark -r file.pcap = reads/filters a saved capture (Wireshark's CLI).",
       "verb": "tshark",
       "expect": {
        "anyOf": [
         {
          "cmd": [
           "tshark"
          ]
         },
         {
          "cmd": [
           "wireshark"
          ]
         },
         {
          "cmd": [
           "tcpdump"
          ],
          "need": [
           "-r"
          ]
         }
        ]
       },
       "success": "The analysis is clear: everything points at the certificate. It needs renewing."
      }
     ],
     "complete": [
      "[Nova]: You went down to the packet level. That skill is what makes people call you a wizard."
     ]
    },
    {
     "id": "netq4",
     "title": "Behind the Wall",
     "requires": [
      "netq3"
     ],
     "xp": 150,
     "credits": 35,
     "badge": "🚧 Firewall Tamer",
     "brief": [
      "[Nova]: The last diagnosis: is a wall cutting the traffic? Read the rules, test, fix, verify."
     ],
     "objectives": [
      {
       "task": "List the firewall rules.",
       "teach": "iptables -L / nft list ruleset / ufw status = shows the current firewall rules.",
       "verb": "sudo",
       "expect": {
        "anyOf": [
         {
          "cmd": [
           "iptables"
          ]
         },
         {
          "cmd": [
           "nft"
          ]
         },
         {
          "cmd": [
           "ufw"
          ]
         }
        ]
       },
       "success": "There's a DROP rule for 443 — the wall was cutting the traffic."
      },
      {
       "task": "Test the port from outside.",
       "teach": "nc -zv host port = confirms from outside whether the port is really open or closed.",
       "verb": "nc",
       "expect": {
        "anyOf": [
         {
          "cmd": [
           "nc"
          ],
          "need": [
           "re:.+"
          ]
         },
         {
          "cmd": [
           "telnet"
          ],
          "need": [
           "re:.+"
          ]
         },
         {
          "cmd": [
           "ncat"
          ],
          "need": [
           "re:.+"
          ]
         }
        ]
       },
       "success": "443 times out — the wall is confirmed, the firewall is definitely the problem."
      },
      {
       "task": "Add a rule and open the port.",
       "teach": "ufw allow / iptables -A = adds an allow rule. Open only the port you need, not all of them.",
       "verb": "sudo",
       "expect": {
        "anyOf": [
         {
          "cmd": [
           "ufw",
           "allow"
          ]
         },
         {
          "cmd": [
           "iptables"
          ],
          "need": [
           "-A|-I"
          ]
         }
        ]
       },
       "success": "443 allowed."
      },
      {
       "task": "Verify the fix.",
       "teach": "curl -I = fetches headers only; a quick way to see whether the service answers now.",
       "verb": "curl",
       "expect": {
        "cmd": [
         "curl"
        ],
        "need": [
         "re:^-I|--head|^-sI"
        ]
       },
       "success": "200 OK! The network fault is resolved. The Network Ops lab is done! 🎉"
      }
     ],
     "complete": [
      "[Nova]: Ports, DNS, packets and firewalls — a network engineer's diagnostic arsenal is yours now. 🛰️"
     ]
    }
   ]
  },
  {
   "id": "scripting",
   "icon": "📜",
   "title": "Scripting",
   "status": "active",
   "desc": "automation with Bash: scripts, loops/conditions, log parsing, cron",
   "topics": [
    "arguments & exit codes",
    "variables/loops/conditions",
    "log parsing",
    "cron"
   ],
   "quests": [
    {
     "id": "scrq1",
     "title": "The Script Core",
     "requires": [],
     "xp": 120,
     "credits": 25,
     "badge": "🐚 Shell Novice",
     "brief": [
      "[Nova]: If you've done the same thing by hand twice, write the third one. Your first script: a backup.",
      "Run it, pass arguments, read the exit code, debug it."
     ],
     "objectives": [
      {
       "task": "Make backup.sh executable.",
       "teach": "Running a script needs the execute bit: chmod +x. The first line, #!/bin/bash (the shebang), says which interpreter runs it.",
       "verb": "chmod",
       "expect": {
        "cmd": [
         "chmod"
        ],
        "need": [
         "re:^(\\+x|u\\+x|a\\+x|[0-7]{3})$",
         "backup.sh"
        ]
       },
       "success": "backup.sh is executable now."
      },
      {
       "task": "Run the script with an argument.",
       "teach": "The words you pass become $1, $2...; $@ is all of them. That's how one script serves several environments.",
       "verb": "./backup.sh",
       "expect": {
        "cmd": [
         "./backup.sh"
        ],
        "need": [
         "re:.+"
        ]
       },
       "success": ">> backing up prod... OK"
      },
      {
       "task": "Check the last command's exit code.",
       "teach": "Every command returns an exit code: 0 = success, anything else = failure. $? holds the last one. This is the foundation of automation.",
       "verb": "echo",
       "expect": {
        "cmd": [
         "echo"
        ],
        "need": [
         "re:\\$\\?"
        ]
       },
       "success": "0 — the backup finished successfully."
      },
      {
       "task": "Debug the script by tracing it line by line.",
       "teach": "bash -x script = prints each line as it runs. The answer to 'why didn't it work?' lives here.",
       "verb": "bash",
       "expect": {
        "cmd": [
         "bash"
        ],
        "need": [
         "-x"
        ]
       },
       "success": "The trace is streaming; you can see what happened on which line."
      }
     ],
     "complete": [
      "[Nova]: Your first script runs. Arguments and exit codes — the bricks of automation."
     ]
    },
    {
     "id": "scrq2",
     "title": "The Logic Circuit",
     "requires": [
      "scrq1"
     ],
     "xp": 130,
     "credits": 30,
     "badge": "🌀 Flow Scripter",
     "brief": [
      "[Nova]: What makes a script smart: variables, loops, conditions. Let's dump the repetition on the machine."
     ],
     "objectives": [
      {
       "task": "Read/print a variable.",
       "teach": "You assign with name=value and read with $name. It expands inside double quotes: \"$name\".",
       "verb": "echo",
       "expect": {
        "cmd": [
         "echo"
        ],
        "need": [
         "re:\\$"
        ]
       },
       "success": "Environment: prod"
      },
      {
       "task": "Walk every log file with a loop.",
       "teach": "for x in LIST; do ...; done = repeats for each item. The backbone of batch work.",
       "verb": "for",
       "expect": {
        "cmd": [
         "for"
        ],
        "need": [
         "in"
        ]
       },
       "success": "app.log, db.log, web.log — all in one loop."
      },
      {
       "task": "Use a condition to check whether a file exists.",
       "teach": "if [ CONDITION ]; then ...; fi. -f tests for a file, -d for a directory, -z for emptiness.",
       "verb": "if",
       "expect": {
        "cmd": [
         "if"
        ],
        "need": [
         "\\[|test|-f|-d|-z|-n"
        ]
       },
       "success": "app.pid exists — the service is running."
      },
      {
       "task": "Read a file line by line.",
       "teach": "while read line; do ...; done < file = processes a file line by line. The classic of log processing.",
       "verb": "while",
       "expect": {
        "cmd": [
         "while"
        ],
        "need": [
         "read"
        ]
       },
       "success": "The lines were processed one by one."
      }
     ],
     "complete": [
      "[Nova]: Variables, loops, conditions — your script can think now."
     ]
    },
    {
     "id": "scrq3",
     "title": "Text Mining",
     "requires": [
      "scrq2"
     ],
     "xp": 140,
     "credits": 35,
     "badge": "🧵 Text Weaver",
     "brief": [
      "[Nova]: Logs are a gold mine, but raw ore. Process them with the grep/awk/sed trio and pull meaning out."
     ],
     "objectives": [
      {
       "task": "Filter the error lines.",
       "teach": "grep <pattern> <file> = keeps the lines containing the pattern. -i makes it case-insensitive.",
       "verb": "grep",
       "expect": {
        "cmd": [
         "grep"
        ],
        "need": [
         "re:.+"
        ]
       },
       "success": "42 error lines filtered out."
      },
      {
       "task": "Extract a specific column (field).",
       "teach": "awk '{print $N}' = prints field N. The way to pull an IP/status/duration out of space-separated logs.",
       "verb": "awk",
       "expect": {
        "cmd": [
         "awk"
        ],
        "need": [
         "re:.+"
        ]
       },
       "success": "The first column (the IPs) was extracted."
      },
      {
       "task": "Make a bulk change in the text.",
       "teach": "sed 's/old/new/g' = rewrites text in a stream. The tool for cleaning and normalizing logs.",
       "verb": "sed",
       "expect": {
        "cmd": [
         "sed"
        ],
        "need": [
         "re:.+"
        ]
       },
       "success": "Every DEBUG tag became INFO."
      },
      {
       "task": "Find the most frequent entry (count + sort).",
       "teach": "sort | uniq -c | sort -rn = counts duplicates and sorts them most-first. It answers 'which IP is hitting us hardest?'.",
       "verb": "sort",
       "expect": {
        "cmd": [
         "uniq"
        ],
        "need": [
         "-c"
        ]
       },
       "success": "Top IP: 10.0.0.9 (1284 requests). Suspicious."
      }
     ],
     "complete": [
      "[Nova]: The grep-awk-sed trio — an engineer's Swiss army knife. You've mastered it."
     ]
    },
    {
     "id": "scrq4",
     "title": "The Scheduler",
     "requires": [
      "scrq3"
     ],
     "xp": 150,
     "credits": 35,
     "badge": "⏰ Cron Master",
     "brief": [
      "[Nova]: The last step: make the script run while you sleep. cron plus writing scripts that hold up."
     ],
     "objectives": [
      {
       "task": "List the scheduled jobs.",
       "teach": "crontab -l = shows the current scheduled jobs. You edit them with -e.",
       "verb": "crontab",
       "expect": {
        "cmd": [
         "crontab"
        ],
        "need": [
         "-l"
        ]
       },
       "success": "No jobs yet. Let's add one."
      },
      {
       "task": "Open the editor to add a new cron job.",
       "teach": "crontab -e. The format: min hour day month weekday command. E.g. '0 3 * * * /opt/backup.sh' = every day at 03:00.",
       "verb": "crontab",
       "expect": {
        "cmd": [
         "crontab"
        ],
        "need": [
         "-e"
        ]
       },
       "success": "The backup now runs automatically at 03:00 every night."
      },
      {
       "task": "Check the script for syntax errors without running it.",
       "teach": "bash -n script = checks only the syntax, without executing. Essential before you ship to prod.",
       "verb": "bash",
       "expect": {
        "cmd": [
         "bash"
        ],
        "need": [
         "-n"
        ]
       },
       "success": "Syntax clean."
      },
      {
       "task": "Harden the script against failure.",
       "teach": "set -euo pipefail = stop on error, stop on an undefined variable, don't swallow a pipe failure. The first line of a professional script.",
       "verb": "set",
       "expect": {
        "cmd": [
         "set"
        ],
        "need": [
         "re:euo|pipefail|^-e"
        ]
       },
       "success": "The script no longer swallows errors silently. The Scripting lab is done! 🎉"
      }
     ],
     "complete": [
      "[Nova]: You wrote it, processed with it, scheduled it and hardened it. The machines work for you now. 📜"
     ]
    }
   ]
  },
  {
   "id": "docker",
   "icon": "🐳",
   "title": "Docker Deep Dive",
   "status": "active",
   "desc": "image layers, volumes/networks, registries, mastering compose",
   "topics": [
    "Dockerfile optimization",
    "volumes/networks",
    "registries",
    "compose"
   ],
   "quests": [
    {
     "id": "dkq1",
     "title": "The Image Factory",
     "requires": [],
     "xp": 130,
     "credits": 30,
     "badge": "🐋 Image Smith",
     "brief": [
      "[Nova]: You know the basic build. Now learn to make an image SMALL and FAST — layers and multi-stage."
     ],
     "objectives": [
      {
       "task": "Build an image.",
       "teach": "docker build -t name:tag . = reads the Dockerfile layer by layer and produces an image. Each line is a layer = cache.",
       "verb": "docker",
       "expect": {
        "cmd": [
         "docker",
         "build"
        ],
        "need": [
         "re:.+"
        ]
       },
       "success": "Image built: app:1.0 (412MB)."
      },
      {
       "task": "Inspect the image's layer history.",
       "teach": "docker history = shows each layer's size and command. This is how you find the bloated one.",
       "verb": "docker",
       "expect": {
        "cmd": [
         "docker",
         "history"
        ],
        "need": [
         "re:.+"
        ]
       },
       "success": "Biggest layer: apt install (280MB). Target acquired."
      },
      {
       "task": "List the image sizes.",
       "teach": "docker images = shows local images and their sizes. A small image = a fast deploy and a smaller attack surface.",
       "verb": "docker",
       "expect": {
        "cmd": [
         "docker",
         "images"
        ]
       },
       "success": "app:1.0 → 412MB. We're going to bring that down."
      },
      {
       "task": "Take only what you need with a multi-stage build.",
       "teach": "--target builds a specific stage from the Dockerfile. You drop the build tools and carry only the runnable artifact.",
       "verb": "docker",
       "expect": {
        "cmd": [
         "docker",
         "build"
        ],
        "need": [
         "re:target"
        ]
       },
       "success": "app:slim → 74MB! The magic of multi-stage."
      }
     ],
     "complete": [
      "[Nova]: From 412MB to 74MB. You've got layers and multi-stage — the image is elegant now."
     ]
    },
    {
     "id": "dkq2",
     "title": "The Persistent Link",
     "requires": [
      "dkq1"
     ],
     "xp": 140,
     "credits": 35,
     "badge": "🔗 Volume Keeper",
     "brief": [
      "[Nova]: Containers are temporary. Durable data = a volume; containers talking to each other = a network."
     ],
     "objectives": [
      {
       "task": "Create a volume for persistent data.",
       "teach": "docker volume create = storage that outlives the container. DB data never belongs on a container's filesystem.",
       "verb": "docker",
       "expect": {
        "cmd": [
         "docker",
         "volume",
         "create"
        ],
        "need": [
         "re:.+"
        ]
       },
       "success": "The dbdata volume is ready."
      },
      {
       "task": "Run the container with the volume mounted.",
       "teach": "docker run -v volume:/path = mounts the volume inside the container. The data is independent of the container now.",
       "verb": "docker",
       "expect": {
        "cmd": [
         "docker",
         "run"
        ],
        "need": [
         "re:^-v$|^--volume$|^-v.+"
        ]
       },
       "success": "MySQL's data lives in dbdata; it survives rebuilding the container."
      },
      {
       "task": "Create a dedicated network for the containers.",
       "teach": "docker network create = an isolated network where containers reach each other by name.",
       "verb": "docker",
       "expect": {
        "cmd": [
         "docker",
         "network",
         "create"
        ],
        "need": [
         "re:.+"
        ]
       },
       "success": "The appnet network was created."
      },
      {
       "task": "Run the container attached to that network.",
       "teach": "docker run --network appnet = puts the container on the network; it can now reach others by a name like 'db'.",
       "verb": "docker",
       "expect": {
        "cmd": [
         "docker",
         "run"
        ],
        "need": [
         "re:network"
        ]
       },
       "success": "app reaches the database by the name 'db' now."
      }
     ],
     "complete": [
      "[Nova]: Persistence and networking — you've wired the containers together like a real system."
     ]
    },
    {
     "id": "dkq3",
     "title": "The Registry Network",
     "requires": [
      "dkq2"
     ],
     "xp": 140,
     "credits": 35,
     "badge": "📦 Registry Runner",
     "brief": [
      "[Nova]: An image nobody can pull is useless. Push it to a registry, then inspect it in depth."
     ],
     "objectives": [
      {
       "task": "Log in to a container registry.",
       "teach": "docker login = authenticates against a registry like DockerHub/GHCR/ECR. Required before a push.",
       "verb": "docker",
       "expect": {
        "cmd": [
         "docker",
         "login"
        ],
        "need": [
         "re:.+"
        ]
       },
       "success": "Logged in to ghcr.io."
      },
      {
       "task": "Tag the image with the registry name.",
       "teach": "docker tag <local> <registry/user/name:tag> = the right name for a push.",
       "verb": "docker",
       "expect": {
        "cmd": [
         "docker",
         "tag"
        ],
        "need": [
         "re:.+",
         "re:.+"
        ]
       },
       "success": "Tagged: ghcr.io/mehmet/app:1.0"
      },
      {
       "task": "Push the image to the registry.",
       "teach": "docker push = uploads the image to the registry; others pull it. It's the heart of CI/CD too.",
       "verb": "docker",
       "expect": {
        "cmd": [
         "docker",
         "push"
        ],
        "need": [
         "re:.+"
        ]
       },
       "success": "Push complete. The image is reachable from anywhere."
      },
      {
       "task": "Inspect the image/container in depth.",
       "teach": "docker inspect = the full JSON detail: env, mounts, network, entrypoint... The last stop of debugging.",
       "verb": "docker",
       "expect": {
        "cmd": [
         "docker",
         "inspect"
        ],
        "need": [
         "re:.+"
        ]
       },
       "success": "Env, ports, volumes — all visible."
      }
     ],
     "complete": [
      "[Nova]: Share and inspect — you can manage an image end to end."
     ]
    },
    {
     "id": "dkq4",
     "title": "Stack Command",
     "requires": [
      "dkq3"
     ],
     "xp": 150,
     "credits": 35,
     "badge": "🧹 Compose Commander",
     "brief": [
      "[Nova]: Manage a multi-service stack from one file, scale it, debug it — and leave the place tidy."
     ],
     "objectives": [
      {
       "task": "Bring the whole stack up with compose.",
       "teach": "docker compose up = starts every service in compose.yml (app+db+cache) with one command.",
       "verb": "docker",
       "expect": {
        "anyOf": [
         {
          "cmd": [
           "docker",
           "compose",
           "up"
          ]
         },
         {
          "cmd": [
           "docker-compose",
           "up"
          ]
         }
        ]
       },
       "success": "app + db + redis are up."
      },
      {
       "task": "Scale one service horizontally.",
       "teach": "--scale service=N = runs N copies of that service. Compose's way of spreading load.",
       "verb": "docker",
       "expect": {
        "anyOf": [
         {
          "cmd": [
           "docker",
           "compose",
           "up"
          ],
          "need": [
           "re:scale"
          ]
         },
         {
          "cmd": [
           "docker-compose",
           "up"
          ],
          "need": [
           "re:scale"
          ]
         }
        ]
       },
       "success": "The web service is at 3 copies. Traffic is spreading."
      },
      {
       "task": "Debug by looking at a service's logs.",
       "teach": "docker logs / docker compose logs = shows a service's output. Your first diagnostic tool.",
       "verb": "docker",
       "expect": {
        "anyOf": [
         {
          "cmd": [
           "docker",
           "logs"
          ],
          "need": [
           "re:.+"
          ]
         },
         {
          "cmd": [
           "docker",
           "compose",
           "logs"
          ]
         },
         {
          "cmd": [
           "docker-compose",
           "logs"
          ]
         }
        ]
       },
       "success": "The logs are streaming; the problem is visible."
      },
      {
       "task": "Clean up unused images/containers/networks.",
       "teach": "docker system prune = deletes idle resources; it reclaims disk and reduces clutter. Do it regularly.",
       "verb": "docker",
       "expect": {
        "anyOf": [
         {
          "cmd": [
           "docker",
           "system",
           "prune"
          ]
         },
         {
          "cmd": [
           "docker",
           "image",
           "prune"
          ]
         },
         {
          "cmd": [
           "docker",
           "container",
           "prune"
          ]
         }
        ]
       },
       "success": "3.2GB reclaimed. The Docker Deep Dive lab is done! 🎉"
      }
     ],
     "complete": [
      "[Nova]: Compose, scaling, debugging and cleanup — you're a Docker expert now. 🐳"
     ]
    }
   ]
  },
  {
   "id": "terraform",
   "icon": "🌍",
   "title": "Terraform Pro",
   "status": "active",
   "desc": "module design, remote state & locking, drift, CI-safe apply",
   "topics": [
    "module design",
    "remote/locked state",
    "drift",
    "CI apply"
   ],
   "quests": [
    {
     "id": "tfq1",
     "title": "The Module Blueprint",
     "requires": [],
     "xp": 140,
     "credits": 35,
     "badge": "🧩 Module Architect",
     "brief": [
      "[Nova]: Not copy-pasted HCL — reusable modules. That's the professional move."
     ],
     "objectives": [
      {
       "task": "Download/update the modules used by the code.",
       "teach": "terraform get -update = fetches and refreshes the modules (registry/git/local) referenced in your source.",
       "verb": "terraform",
       "expect": {
        "cmd": [
         "terraform",
         "get"
        ],
        "need": [
         "-update|-u"
        ]
       },
       "success": "The vpc, ec2 and rds modules were updated."
      },
      {
       "task": "See the provider/module dependency tree.",
       "teach": "terraform providers = shows which module depends on which provider and version.",
       "verb": "terraform",
       "expect": {
        "cmd": [
         "terraform",
         "providers"
        ]
       },
       "success": "3 modules, a single aws provider (~> 5.0). Clean."
      },
      {
       "task": "Format every module recursively.",
       "teach": "terraform fmt -recursive = aligns every module file in the subdirectories.",
       "verb": "terraform",
       "expect": {
        "cmd": [
         "terraform",
         "fmt"
        ],
        "need": [
         "re:recursive|^-r$"
        ]
       },
       "success": "All modules formatted."
      },
      {
       "task": "Get the module output in a machine-readable format.",
       "teach": "terraform output -json = emits outputs as JSON; other tools and scripts can consume it.",
       "verb": "terraform",
       "expect": {
        "cmd": [
         "terraform",
         "output"
        ],
        "need": [
         "re:json|-raw"
        ]
       },
       "success": "{\"vpc_id\":{\"value\":\"vpc-0a1b\"}} — ready for automation."
      }
     ],
     "complete": [
      "[Nova]: Modules = less repetition, far more consistency. Your infrastructure is Lego now."
     ]
    },
    {
     "id": "tfq2",
     "title": "The Remote State Lock",
     "requires": [
      "tfq1"
     ],
     "xp": 150,
     "credits": 35,
     "badge": "🗃️ State Broker",
     "brief": [
      "[Nova]: State doesn't live on your laptop. You need shared, locked remote state — otherwise people collide."
     ],
     "objectives": [
      {
       "task": "Move/configure the state to a remote backend (S3+DynamoDB).",
       "teach": "terraform init -backend-config=... = moves the state to a shared backend like S3; DynamoDB provides the lock.",
       "verb": "terraform",
       "expect": {
        "cmd": [
         "terraform",
         "init"
        ],
        "need": [
         "re:backend"
        ]
       },
       "success": "State moved to S3; the lock lives in DynamoDB. The team is safe."
      },
      {
       "task": "Pull the remote state and inspect it.",
       "teach": "terraform state pull = downloads the remote state (JSON). You see exactly what's tracked.",
       "verb": "terraform",
       "expect": {
        "cmd": [
         "terraform",
         "state",
         "pull"
        ]
       },
       "success": "Remote state pulled."
      },
      {
       "task": "Release a stuck lock.",
       "teach": "If an apply crashes the lock stays stuck. terraform force-unlock <ID> releases it safely.",
       "verb": "terraform",
       "expect": {
        "cmd": [
         "terraform",
         "force-unlock"
        ],
        "need": [
         "re:.+"
        ]
       },
       "success": "Lock released; the team can apply again."
      },
      {
       "task": "Rename a resource inside the state (refactor).",
       "teach": "terraform state mv old.address new.address = moves the resource in state without deleting it; the key to refactoring.",
       "verb": "terraform",
       "expect": {
        "cmd": [
         "terraform",
         "state",
         "mv"
        ],
        "need": [
         "re:.+",
         "re:.+"
        ]
       },
       "success": "The address is updated; the resource was not recreated."
      }
     ],
     "complete": [
      "[Nova]: Remote state and locking — the foundation of working safely with a team."
     ]
    },
    {
     "id": "tfq3",
     "title": "Drift Detection",
     "requires": [
      "tfq2"
     ],
     "xp": 150,
     "credits": 35,
     "badge": "🌊 Drift Catcher",
     "brief": [
      "[Nova]: Someone made a change by hand in the console — 'drift'. Catch it, reconcile it, and intervene surgically when you must."
     ],
     "objectives": [
      {
       "task": "Detect the gap between the real world and the code (drift).",
       "teach": "terraform plan -refresh-only = compares resources to reality without applying anything. Manual changes surface.",
       "verb": "terraform",
       "expect": {
        "cmd": [
         "terraform",
         "plan"
        ],
        "need": [
         "re:refresh"
        ]
       },
       "success": "Drift found: the security group was changed by hand."
      },
      {
       "task": "Reconcile the state with reality.",
       "teach": "terraform apply -refresh-only = syncs the state to reality, not the code (it changes no resources).",
       "verb": "terraform",
       "expect": {
        "cmd": [
         "terraform",
         "apply"
        ],
        "need": [
         "re:refresh"
        ]
       },
       "success": "State synced to reality."
      },
      {
       "task": "Plan against a single targeted resource.",
       "teach": "terraform plan -target=ADDRESS = handles only that resource in a large estate. Use it carefully — it hides the bigger picture.",
       "verb": "terraform",
       "expect": {
        "cmd": [
         "terraform",
         "plan"
        ],
        "need": [
         "re:target"
        ]
       },
       "success": "Only the security group was planned."
      },
      {
       "task": "Show the current state in human-readable form.",
       "teach": "terraform show = dumps a saved plan or the current state in readable form.",
       "verb": "terraform",
       "expect": {
        "cmd": [
         "terraform",
         "show"
        ]
       },
       "success": "The current state is on screen; the drift is closed."
      }
     ],
     "complete": [
      "[Nova]: You spotted the drift and reconciled it. You're keeping the 'the code is the truth' discipline."
     ]
    },
    {
     "id": "tfq4",
     "title": "Autonomous Apply",
     "requires": [
      "tfq3"
     ],
     "xp": 160,
     "credits": 40,
     "badge": "🤖 Plan Automator",
     "brief": [
      "[Nova]: 'apply' in a pipeline must not be roulette. Save the plan, apply exactly that, put the gates in place."
     ],
     "objectives": [
      {
       "task": "Save the plan to a file (deterministic).",
       "teach": "terraform plan -out=tfplan = writes the plan to a file, so what gets applied is exactly what was approved.",
       "verb": "terraform",
       "expect": {
        "cmd": [
         "terraform",
         "plan"
        ],
        "need": [
         "re:-out|out="
        ]
       },
       "success": "Plan saved to tfplan."
      },
      {
       "task": "Apply the saved plan verbatim.",
       "teach": "terraform apply tfplan = asks for no confirmation and applies exactly that plan. Ideal for CI.",
       "verb": "terraform",
       "expect": {
        "cmd": [
         "terraform",
         "apply"
        ],
        "need": [
         "re:tfplan|plan$"
        ]
       },
       "success": "The approved plan was applied as-is."
      },
      {
       "task": "The format gate: enforce formatting in CI.",
       "teach": "terraform fmt -check = returns an error (exit != 0) if any file is unformatted. It blocks the merge in CI.",
       "verb": "terraform",
       "expect": {
        "cmd": [
         "terraform",
         "fmt"
        ],
        "need": [
         "re:check"
        ]
       },
       "success": "Every file is formatted. The gate is green."
      },
      {
       "task": "Run a security/compliance scan.",
       "teach": "tfsec / checkov / tflint = catch vulnerabilities and misconfiguration in HCL before the merge.",
       "verb": "tfsec",
       "expect": {
        "anyOf": [
         {
          "cmd": [
           "tfsec"
          ]
         },
         {
          "cmd": [
           "checkov"
          ]
         },
         {
          "cmd": [
           "tflint"
          ]
         }
        ]
       },
       "success": "1 warning: a public S3 bucket. Fixed. The Terraform Pro lab is done! 🎉"
      }
     ],
     "complete": [
      "[Nova]: A deterministic plan plus format and security gates — you drive your infrastructure through CI with confidence. 🌍"
     ]
    }
   ]
  },
  {
   "id": "ansible",
   "icon": "⚙️",
   "title": "Ansible",
   "status": "active",
   "desc": "configuration management with inventories, playbooks, roles and vault",
   "topics": [
    "inventory & ad-hoc",
    "playbooks & dry-run",
    "roles & tags",
    "vault & idempotency"
   ],
   "quests": [
    {
     "id": "ansq1",
     "title": "Inventory Scan",
     "requires": [],
     "xp": 120,
     "credits": 25,
     "badge": "📋 Inventory Scout",
     "brief": [
      "[Nova]: No more SSH-ing into 50 servers by hand. Ansible is agentless — SSH is all it needs.",
      "Get to know the inventory first: who's out there, are they reachable, what's running on them?"
     ],
     "objectives": [
      {
       "task": "List every host in the inventory.",
       "teach": "ansible-inventory --list = dumps the hosts and groups from your inventory file as JSON. Verifying the inventory is always step one.",
       "verb": "ansible-inventory",
       "expect": {
        "cmd": [
         "ansible-inventory"
        ],
        "need": [
         "re:list|graph"
        ]
       },
       "success": "3 groups found: web(4), db(2), cache(1)."
      },
      {
       "task": "Test connectivity to every host.",
       "teach": "ansible all -m ping = runs the 'ping' module against each host (not ICMP — an SSH+Python check).",
       "verb": "ansible",
       "expect": {
        "cmd": [
         "ansible"
        ],
        "need": [
         "-m",
         "ping"
        ]
       },
       "success": "6 hosts SUCCESS, 1 UNREACHABLE (db02). Noted."
      },
      {
       "task": "Run an ad-hoc command against a group.",
       "teach": "ansible <group> -a \"command\" = a one-off command without writing a playbook. Perfect for quick diagnosis.",
       "verb": "ansible",
       "expect": {
        "cmd": [
         "ansible"
        ],
        "need": [
         "-a",
         "re:.+"
        ]
       },
       "success": "Uptime came back from all 4 web servers. One has been up for 200 days."
      },
      {
       "task": "Gather system information (facts) from the hosts.",
       "teach": "The setup module = returns all of a host's 'facts': OS, IP, RAM and more. The basis for writing conditions in playbooks.",
       "verb": "ansible",
       "expect": {
        "cmd": [
         "ansible"
        ],
        "need": [
         "-m",
         "setup"
        ]
       },
       "success": "Facts gathered: Ubuntu 22.04, 4 vCPU, 8GB RAM."
      }
     ],
     "complete": [
      "[Nova]: You know the inventory. That's where Ansible's power starts: one command, fifty servers."
     ]
    },
    {
     "id": "ansq2",
     "title": "The Playbook Core",
     "requires": [
      "ansq1"
     ],
     "xp": 130,
     "credits": 30,
     "badge": "📘 Playbook Author",
     "brief": [
      "[Nova]: An ad-hoc command is temporary. The playbook is what lasts: in YAML you say 'the system shall look like this'.",
      "But before it hits prod: check the syntax, dry-run it, then apply."
     ],
     "objectives": [
      {
       "task": "Check the playbook's syntax.",
       "teach": "--syntax-check = validates the YAML and task structure without running it. That's the first gate.",
       "verb": "ansible-playbook",
       "expect": {
        "cmd": [
         "ansible-playbook"
        ],
        "need": [
         "re:syntax-check",
         "re:.+\\.ya?ml"
        ]
       },
       "success": "playbook: site.yml — syntax clean."
      },
      {
       "task": "Dry-run it: see what would change.",
       "teach": "--check = reports what would change without changing anything. Like Terraform's 'plan'.",
       "verb": "ansible-playbook",
       "expect": {
        "cmd": [
         "ansible-playbook"
        ],
        "need": [
         "re:^--check$|^-C$"
        ]
       },
       "success": "changed=7 (dry). nginx will be installed, the config updated."
      },
      {
       "task": "Run it against a single group only.",
       "teach": "--limit <group> = applies the playbook only to the selected hosts. The way to do a staged (canary) rollout.",
       "verb": "ansible-playbook",
       "expect": {
        "cmd": [
         "ansible-playbook"
        ],
        "need": [
         "re:limit"
        ]
       },
       "success": "Only the web group was updated. The staged rollout has begun."
      },
      {
       "task": "Actually apply the playbook.",
       "teach": "Run it once the checks pass. The ok/changed/failed counts in the output summarize the result.",
       "verb": "ansible-playbook",
       "expect": {
        "cmd": [
         "ansible-playbook"
        ],
        "need": [
         "re:.+\\.ya?ml"
        ]
       },
       "success": "ok=12 changed=7 failed=0. The whole fleet is on the same configuration."
      }
     ],
     "complete": [
      "[Nova]: Syntax → check → limit → apply. Those four steps save you from a midnight disaster."
     ]
    },
    {
     "id": "ansq3",
     "title": "Role Architecture",
     "requires": [
      "ansq2"
     ],
     "xp": 140,
     "credits": 35,
     "badge": "🧱 Role Builder",
     "brief": [
      "[Nova]: One giant playbook becomes impossible to maintain. Split it into roles — the same logic as Terraform modules."
     ],
     "objectives": [
      {
       "task": "Scaffold a new role.",
       "teach": "ansible-galaxy init roles/<name> = creates tasks/, handlers/, templates/ and defaults/ in the standard layout.",
       "verb": "ansible-galaxy",
       "expect": {
        "cmd": [
         "ansible-galaxy",
         "init"
        ],
        "need": [
         "re:.+"
        ]
       },
       "success": "The roles/nginx scaffold is ready (tasks, handlers, templates, defaults)."
      },
      {
       "task": "Download the external dependencies (off-the-shelf roles).",
       "teach": "It downloads the community-written roles listed in requirements.yml. Don't reinvent the wheel.",
       "verb": "ansible-galaxy",
       "expect": {
        "cmd": [
         "ansible-galaxy",
         "install"
        ],
        "need": [
         "re:^-r$|requirements"
        ]
       },
       "success": "geerlingguy.postgresql downloaded."
      },
      {
       "task": "List the tasks the playbook will run.",
       "teach": "--list-tasks = shows which role runs which tasks, without executing. The way to understand a big playbook.",
       "verb": "ansible-playbook",
       "expect": {
        "cmd": [
         "ansible-playbook"
        ],
        "need": [
         "re:list-tasks|list-hosts"
        ]
       },
       "success": "3 roles / 24 tasks listed."
      },
      {
       "task": "Run only the tasks with a given tag.",
       "teach": "--tags = runs only the relevant part of the playbook. The way to say 'just update the config'.",
       "verb": "ansible-playbook",
       "expect": {
        "cmd": [
         "ansible-playbook"
        ],
        "need": [
         "re:tags"
        ]
       },
       "success": "Only the nginx tasks ran (6 seconds)."
      }
     ],
     "complete": [
      "[Nova]: Roles and tags — your infrastructure code is readable and manageable piece by piece now."
     ]
    },
    {
     "id": "ansq4",
     "title": "The Vault Protocol",
     "requires": [
      "ansq3"
     ],
     "xp": 150,
     "credits": 35,
     "badge": "🔏 Vault Keeper",
     "brief": [
      "[Nova]: Two last lessons: encrypt the secrets, then prove idempotency.",
      "Ansible's promise is this: run the same playbook 100 times and the system stays exactly the same."
     ],
     "objectives": [
      {
       "task": "Encrypt the secrets file.",
       "teach": "ansible-vault encrypt = encrypts passwords/keys with AES; you can commit the encrypted form.",
       "verb": "ansible-vault",
       "expect": {
        "cmd": [
         "ansible-vault",
         "encrypt|create"
        ],
        "need": [
         "re:.+"
        ]
       },
       "success": "Encryption successful. No plaintext passwords in the repo anymore."
      },
      {
       "task": "View the encrypted file without decrypting it to disk.",
       "teach": "ansible-vault view = shows the file on screen without decrypting it to disk. edit lets you change it the same way.",
       "verb": "ansible-vault",
       "expect": {
        "cmd": [
         "ansible-vault",
         "view|edit|decrypt"
        ],
        "need": [
         "re:.+"
        ]
       },
       "success": "The contents are on screen; the file stayed encrypted on disk."
      },
      {
       "task": "Run the playbook with the vault password.",
       "teach": "--ask-vault-pass (or --vault-password-file) = decrypts the secrets at runtime.",
       "verb": "ansible-playbook",
       "expect": {
        "cmd": [
         "ansible-playbook"
        ],
        "need": [
         "re:vault"
        ]
       },
       "success": "Secrets decrypted, playbook ran. changed=3"
      },
      {
       "task": "Run the same playbook again and look at the diff (idempotency).",
       "teach": "--diff = shows line by line what changed. A well-written playbook reports changed=0 on the second run.",
       "verb": "ansible-playbook",
       "expect": {
        "cmd": [
         "ansible-playbook"
        ],
        "need": [
         "re:diff"
        ]
       },
       "success": "changed=0 — the system is already in the desired state. That's idempotency! The Ansible lab is done! 🎉"
      }
     ],
     "complete": [
      "[Nova]: Encrypted secrets and changed=0. You genuinely understand configuration management now. ⚙️"
     ]
    }
   ]
  },
  {
   "id": "kubernetes",
   "icon": "☸️",
   "title": "Kubernetes",
   "status": "active",
   "desc": "namespaces & quotas, probes & autoscaling, secrets & storage, diagnosis & Helm",
   "topics": [
    "namespaces & quotas",
    "probes & HPA",
    "secrets & volumes",
    "diagnosis & Helm"
   ],
   "quests": [
    {
     "id": "k8sq1",
     "title": "The Isolated Zone",
     "requires": [],
     "xp": 130,
     "credits": 30,
     "badge": "🏷️ Namespace Ranger",
     "brief": [
      "[Nova]: You know the basics (deployments, services). Now carve the cluster up like a real production environment.",
      "A namespace = isolation. A quota = stops one team eating the whole cluster."
     ],
     "objectives": [
      {
       "task": "Create a separate namespace for prod.",
       "teach": "A namespace = a logical partition inside the cluster. dev/staging/prod coexist in one cluster without colliding.",
       "verb": "kubectl",
       "expect": {
        "cmd": [
         "kubectl",
         "create",
         "namespace|ns"
        ],
        "need": [
         "re:.+"
        ]
       },
       "success": "namespace/prod created"
      },
      {
       "task": "Put a resource quota on the namespace.",
       "teach": "A ResourceQuota = caps the total CPU/RAM/pod count that namespace can use. It protects the neighbouring team.",
       "verb": "kubectl",
       "expect": {
        "cmd": [
         "kubectl",
         "create",
         "quota"
        ],
        "need": [
         "re:.+"
        ]
       },
       "success": "Quota set: 4 CPU / 8Gi / 10 pods."
      },
      {
       "task": "Make prod your default namespace.",
       "teach": "Typing -n prod on every command gets old. set-context changes the default (and cuts the risk of deploying to the wrong environment).",
       "verb": "kubectl",
       "expect": {
        "cmd": [
         "kubectl",
         "config",
         "set-context"
        ],
        "need": [
         "re:namespace"
        ]
       },
       "success": "Default namespace is now: prod"
      },
      {
       "task": "List every resource in the namespace.",
       "teach": "kubectl get all -n <ns> = shows that zone's pods/services/deployments at a glance.",
       "verb": "kubectl",
       "expect": {
        "cmd": [
         "kubectl",
         "get",
         "all"
        ]
       },
       "success": "The prod zone is ready and isolated."
      }
     ],
     "complete": [
      "[Nova]: You partitioned and capped the cluster. That's rule one of a multi-team environment."
     ]
    },
    {
     "id": "k8sq2",
     "title": "Pulse & Scale",
     "requires": [
      "k8sq1"
     ],
     "xp": 140,
     "credits": 35,
     "badge": "💓 Health Warden",
     "brief": [
      "[Nova]: Kubernetes heals things for you — but only if you tell it what 'healthy' means.",
      "Read the probes, then scale so the load handles itself."
     ],
     "objectives": [
      {
       "task": "Inspect the pod's health checks (probes).",
       "teach": "describe = shows liveness/readiness probe state, restart count and events. This is where you learn why a pod keeps restarting.",
       "verb": "kubectl",
       "expect": {
        "cmd": [
         "kubectl",
         "describe"
        ],
        "need": [
         "re:.+"
        ]
       },
       "success": "Liveness OK, Readiness failed x3 — the app is slow to start."
      },
      {
       "task": "Set up autoscaling (HPA).",
       "teach": "autoscale = raises and lowers the replica count based on CPU. It's what lets you sleep through a traffic spike.",
       "verb": "kubectl",
       "expect": {
        "cmd": [
         "kubectl",
         "autoscale"
        ],
        "need": [
         "re:.+"
        ]
       },
       "success": "horizontalpodautoscaler.autoscaling/web created"
      },
      {
       "task": "Check the HPA's status.",
       "teach": "get hpa = shows current/target CPU and the replica count. This tells you whether scaling actually works.",
       "verb": "kubectl",
       "expect": {
        "cmd": [
         "kubectl",
         "get",
         "hpa"
        ]
       },
       "success": "web  45%/70%  2/10 replicas. The system is breathing."
      },
      {
       "task": "Measure the real resource usage.",
       "teach": "kubectl top = live CPU/memory usage per pod. You look at this when setting quotas and limits.",
       "verb": "kubectl",
       "expect": {
        "cmd": [
         "kubectl",
         "top"
        ]
       },
       "success": "The busiest pod is at 380m CPU / 512Mi. Within quota."
      }
     ],
     "complete": [
      "[Nova]: Health checks plus autoscaling = a system that runs itself."
     ]
    },
    {
     "id": "k8sq3",
     "title": "Vault & Storage",
     "requires": [
      "k8sq2"
     ],
     "xp": 140,
     "credits": 35,
     "badge": "🗝️ Secret Custodian",
     "brief": [
      "[Nova]: You've seen ConfigMaps. Now sensitive data (Secrets) and persistent storage (PVCs).",
      "Pods die, data doesn't — we're going to guarantee that."
     ],
     "objectives": [
      {
       "task": "Create a Secret for the database password.",
       "teach": "A Secret = sensitive data (passwords, tokens). Unlike a ConfigMap it's stored base64-encoded and access is restricted via RBAC.",
       "verb": "kubectl",
       "expect": {
        "cmd": [
         "kubectl",
         "create",
         "secret"
        ],
        "need": [
         "re:.+"
        ]
       },
       "success": "secret/db-cred created"
      },
      {
       "task": "List the secrets (without leaking the values).",
       "teach": "get secrets = shows names and types, not values. Seeing a value takes a separate command and a separate permission.",
       "verb": "kubectl",
       "expect": {
        "cmd": [
         "kubectl",
         "get",
         "secret|secrets"
        ]
       },
       "success": "db-cred (Opaque, 1 data). The value isn't shown — that's the correct behaviour."
      },
      {
       "task": "Create a persistent storage claim (PVC).",
       "teach": "A PersistentVolumeClaim = a request saying 'give me 10Gi of disk'. The data survives the pod being deleted.",
       "verb": "kubectl",
       "expect": {
        "cmd": [
         "kubectl",
         "apply"
        ],
        "need": [
         "re:pvc|volume|storage"
        ]
       },
       "success": "persistentvolumeclaim/db-data created"
      },
      {
       "task": "Verify the storage claim was fulfilled.",
       "teach": "get pvc = shows whether the claim is Bound or Pending. If it stays Pending, you have a StorageClass problem.",
       "verb": "kubectl",
       "expect": {
        "cmd": [
         "kubectl",
         "get",
         "pvc|persistentvolumeclaim"
        ]
       },
       "success": "db-data  Bound  10Gi  gp3. The data is durable now."
      }
     ],
     "complete": [
      "[Nova]: Secrets are protected and data persists. Stateful workloads are safe now."
     ]
    },
    {
     "id": "k8sq4",
     "title": "The Diagnostic Net",
     "requires": [
      "k8sq3"
     ],
     "xp": 160,
     "credits": 40,
     "badge": "⛵ Helm Navigator",
     "brief": [
      "[Nova]: Final lesson: how you diagnose things when they break, and how you package all of it (Helm)."
     ],
     "objectives": [
      {
       "task": "Review the cluster events in chronological order.",
       "teach": "events = the answer to 'why didn't this pod start?'. The real causes — OOMKilled, ImagePullBackOff — live here.",
       "verb": "kubectl",
       "expect": {
        "cmd": [
         "kubectl",
         "get",
         "events"
        ]
       },
       "success": "FailedScheduling: insufficient CPU. Root cause found."
      },
      {
       "task": "Get inside the running pod and check.",
       "teach": "kubectl exec = runs a command inside the container. Did the config really mount, does DNS resolve — you look live.",
       "verb": "kubectl",
       "expect": {
        "cmd": [
         "kubectl",
         "exec"
        ],
        "need": [
         "re:.+"
        ]
       },
       "success": "You're inside the container. Env and mounts verified."
      },
      {
       "task": "Forward the service to your local machine.",
       "teach": "port-forward = binds a service inside the cluster to localhost. The quick way to test without setting up an Ingress.",
       "verb": "kubectl",
       "expect": {
        "cmd": [
         "kubectl",
         "port-forward"
        ],
        "need": [
         "re:.+"
        ]
       },
       "success": "localhost:8080 → the web service in the cluster. Testable."
      },
      {
       "task": "Install the application as a Helm chart.",
       "teach": "Helm = Kubernetes' package manager. One chart plus a values file instead of dozens of YAMLs; versioning and rollback come built in.",
       "verb": "helm",
       "expect": {
        "anyOf": [
         {
          "cmd": [
           "helm",
           "install"
          ],
          "need": [
           "re:.+"
          ]
         },
         {
          "cmd": [
           "helm",
           "upgrade"
          ],
          "need": [
           "re:.+"
          ]
         }
        ]
       },
       "success": "Release myapp deployed. The Kubernetes lab is done! 🎉"
      }
     ],
     "complete": [
      "[Nova]: You've got the diagnostic reflex and Helm. The cluster isn't a stranger anymore. ☸️"
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
   "desc": "+30 XP instantly",
   "effect": {
    "xp": 30
   }
  },
  {
   "id": 2,
   "name": "The 'Cloud Ninja' title",
   "icon": "🎖️",
   "cost": 150,
   "desc": "a permanent badge",
   "effect": {
    "badge": "🥷 Cloud Ninja"
   }
  },
  {
   "id": 3,
   "name": "Mentor's Advice",
   "icon": "🧠",
   "cost": 60,
   "desc": "hints free for the next 3 quests",
   "effect": {
    "freeHints": 3
   }
  }
 ]
}
};
const CQ_LANG = (typeof I18N !== "undefined" && CQ_BUNDLES[I18N.lang]) ? I18N.lang : "tr";
const CQ_DATA = CQ_BUNDLES[CQ_LANG];
const CHAPTERS = CQ_DATA.chapters;
const TRACKS   = CQ_DATA.tracks;
const QUESTS   = CQ_DATA.quests;
const MODULES  = CQ_DATA.modules;
const SHOP     = CQ_DATA.shop;
const STORY    = CQ_DATA.story;
