const ADVENTURE_CATEGORIES = {
  tarih: {
    title: "Tarih",
    icon: "🏛️",
    color: "#c0392b",
    colorLight: "#fff0ee",
    cards: [
      { emoji: "🔺", title: "Mısır Piramitleri", fact: "Büyük Piramit yaklaşık 4500 yıl önce inşa edildi. 2.3 milyon taş bloktan oluşuyor — her biri ortalama 2.5 ton ağırlığında!", bonus: "İnşaatı 20 yıl sürdü ve on binlerce işçi çalıştı." },
      { emoji: "🚲", title: "İlk Bisiklet", fact: "İlk bisiklet 1817'de Karl von Drais tarafından icat edildi. Pedalı yoktu! Sürücü ayaklarıyla yere basarak ilerliyordu.", bonus: "Adı 'koşu makinesi' (Laufmaschine) idi." },
      { emoji: "✏️", title: "Yazının Doğuşu", fact: "Yazı yaklaşık 5500 yıl önce Mezopotamya'da (bugünkü Irak) icat edildi. İlk yazılar çivi biçiminde taş üzerine kazındı.", bonus: "Bu yazı sistemine 'Çivi Yazısı' (Cuneiform) denir." },
      { emoji: "📖", title: "Matbaa", fact: "Johannes Gutenberg 1440'ta matbaayı icat etti. Artık kitaplar elle kopyalanmak zorunda kalmıyordu — binlerce kopya basılabiliyordu!", bonus: "İlk baskı İncil oldu." },
      { emoji: "🏅", title: "İlk Olimpiyat", fact: "İlk Olimpiyat Oyunları MÖ 776'da Antik Yunanistan'da düzenlendi. Sadece Yunan erkekler katılabiliyordu.", bonus: "Modern Olimpiyatlar 1896'da Atina'da yeniden başladı." },
      { emoji: "📞", title: "Telefon", fact: "Alexander Graham Bell 1876'da telefonu icat etti. İlk telefon konuşmasında şunu söyledi: 'Bay Watson, gelin sizi görmek istiyorum!'", bonus: "O dönemde 'telefon' kelimesi 'uzaktan ses' anlamına geliyordu." },
      { emoji: "🛸", title: "Uzay Çağı", fact: "Uzay çağı 1957'de SSCB'nin Sputnik uydusunu fırlatmasıyla başladı. İnsanlık ilk kez uzaya bir nesne gönderdi!", bonus: "1969'da Neil Armstrong Ay'a ilk adımı attı." },
      { emoji: "🎨", title: "Leonardo da Vinci", fact: "Leonardo da Vinci 500 yıl önce uçan makine, tank ve güneş enerjisi tasarımları çizdi. Bunların çoğu ancak yüzyıllar sonra yapılabildi!", bonus: "Hem ressam hem de mucit hem de bilim insanıydı." },
      { emoji: "🏯", title: "Çin Seddi", fact: "Çin Seddi 21.000 km uzunluğuyla dünyanın en uzun yapısıdır. MS 7. yüzyılda tamamlandı ama inşaatı yüzyıllarca sürdü.", bonus: "Ay'dan görüldüğü efsanesi doğru değil — çok ince kalıyor!" },
      { emoji: "⚓", title: "Amerika'nın Keşfi", fact: "Kristof Kolomb 1492'de Amerika kıtasına ulaştı. Aslında Hindistan'a gitmek istiyordu ama yanlış yönde giderek yeni bir kıta keşfetti!", bonus: "Kıtaya Columbus'un adı değil, Amerigo Vespucci'nin adı verildi." }
    ]
  },

  fen: {
    title: "Fen",
    icon: "🔭",
    color: "#2980b9",
    colorLight: "#eef6ff",
    cards: [
      { emoji: "☀️", title: "Güneş Ne Kadar Büyük?", fact: "Güneş o kadar büyük ki içine tam 1.300.000 Dünya sığar! Ama yine de evrendeki en büyük yıldız değil.", bonus: "Güneşten çıkan ışık Dünya'ya 8 dakikada ulaşır." },
      { emoji: "⚡", title: "Işığın Hızı", fact: "Işık saniyede 300.000 km yol alır. Bu hızda Dünya'yı 1 saniyede 7.5 kez dolaşabilirsin!", bonus: "Işıktan hızlı seyahat etmek fizik yasalarına göre imkânsız." },
      { emoji: "💧", title: "Suyun Sırrı", fact: "Su 0°C'de donar, 100°C'de kaynar. Ama yüksek dağlarda hava basıncı düşük olduğu için su 90°C'de kaynar!", bonus: "Dünyanın su miktarı hiç değişmiyor — döngü içinde tekrar tekrar kullanılıyor." },
      { emoji: "🌈", title: "Gökkuşağı Gerçeği", fact: "Gökkuşağı aslında tam bir daire şeklindedir! Yerden sadece yarısını görebiliriz; tam çemberi uçaktan görülür.", bonus: "Her gözlemcinin gördüğü gökkuşağı birbirinden farklıdır." },
      { emoji: "🌩️", title: "Yıldırım", fact: "Bir yıldırımın sıcaklığı yaklaşık 30.000°C'dir — bu Güneşin yüzeyinden 5 kat daha sıcak!", bonus: "Dünyaya her saniye yaklaşık 100 yıldırım düşer." },
      { emoji: "🧬", title: "İnsan Vücudu", fact: "İnsan vücudunda yaklaşık 37 trilyon hücre var. Her hücre içinde senin tüm DNA bilgin saklı!", bonus: "DNA'nı dümdüz açsan Güneş'e kadar uzar ve geri döner." },
      { emoji: "🌊", title: "Okyanusların Gizemi", fact: "Okyanusların %80'i henüz keşfedilmedi. Ay'ın yüzeyini, okyanusların derinliklerinden daha iyi biliyoruz!", bonus: "En derin nokta Mariana Çukuru: 11 km derinlik." },
      { emoji: "💎", title: "En Sert Madde", fact: "Elmas dünyadaki en sert doğal maddedir. Onu sadece başka bir elmas kesebilir!", bonus: "Elmaslar karbon atomlarından oluşur — kaleminin ucundaki grafit de!" },
      { emoji: "☁️", title: "Bulutlar", fact: "Ortalama bir bulut yaklaşık 500 ton su buharı içerir. O kadar hafif görünmesinin sebebi milyonlarca küçücük damlacığa bölünmüş olması!", bonus: "Kümülüs bulutları saatte 50 km hızla hareket edebilir." },
      { emoji: "🐝", title: "Arılar Uyur mu?", fact: "Arılar uyur! Geceleri kanatlarını katlayıp baş aşağı sallanarak uyurlar. Araştırmacılar bunu küçük titreşimlerle tespit etti.", bonus: "Bir arı ömrü boyunca sadece 1 çay kaşığı bal üretir." }
    ]
  },

  kultur: {
    title: "Genel Kültür",
    icon: "🗺️",
    color: "#27ae60",
    colorLight: "#edfff4",
    cards: [
      { emoji: "🇹🇷", title: "Türkiye", fact: "Türkiye'nin başkenti Ankara'dır. En kalabalık şehir ise İstanbul'dur. Türkiye hem Avrupa'da hem Asya'da toprak sahibi olan tek ülkedir!", bonus: "Türkiye dünyada en fazla fındık ve kiraz üreten ülkedir." },
      { emoji: "🌊", title: "En Uzun Nehir", fact: "Nil Nehri 6650 km uzunluğuyla dünyanın en uzun nehridir. Mısır, Sudan ve Uganda'dan geçer.", bonus: "Amazon Nehri ise en geniş ve en fazla su taşıyan nehirdir." },
      { emoji: "🌳", title: "Amazon Ormanı", fact: "Amazon Ormanı dünyadaki oksijenin %20'sini üretiyor! Bu yüzden 'Dünyanın Akciğerleri' denir.", bonus: "Amazon'da 10 milyondan fazla farklı canlı türü yaşıyor." },
      { emoji: "🗾", title: "Japonya", fact: "Japonya 'Yükselen Güneş Ülkesi' olarak bilinir. 6800'den fazla adadan oluşur ve dünyanın en uzun yaşayan insanları orada yaşar!", bonus: "Japonya her yıl yaklaşık 1500 deprem yaşar." },
      { emoji: "🗣️", title: "Dünya Dilleri", fact: "Dünyada yaklaşık 7000 farklı dil konuşuluyor! Bunların yarısından fazlası gelecek 100 yılda yok olma tehlikesiyle karşı karşıya.", bonus: "En çok konuşulan dil Mandarin Çincesidir." },
      { emoji: "🏔️", title: "Everest Dağı", fact: "Everest Dağı 8848 m yüksekliğiyle dünyanın en yüksek noktasıdır. Zirveye ilk kez 1953'te Edmund Hillary ve Tenzing Norgay çıktı.", bonus: "Dağ her yıl birkaç milimetre daha büyüyor." },
      { emoji: "🧊", title: "Antarktika", fact: "Antarktika dünyanın en soğuk kıtasıdır. Ortalama sıcaklık -57°C, en düşük ölçülen sıcaklık -89°C!", bonus: "Dünyadaki tatlı suyun %70'i Antarktika'daki buzullarda saklı." },
      { emoji: "🌏", title: "Pasifik Okyanusu", fact: "Pasifik Okyanusu Dünya yüzeyinin üçte birini kaplar. İçine tüm kıtalar sığar ve yine de yer kalır!", bonus: "Pasifik, 'Barışçıl Okyanus' anlamına gelir — adını Magellan koydu." },
      { emoji: "🏙️", title: "En Kalabalık Şehir", fact: "Tokyo, yaklaşık 37 milyon nüfusuyla dünyanın en kalabalık şehridir. İstanbul ise Avrupa'nın en kalabalık şehridir!", bonus: "Tokyo aynı zamanda dünyanın en güvenli büyük şehirleri arasında." },
      { emoji: "📚", title: "Türkiye'de İller", fact: "Türkiye 81 ilden oluşur. En büyük il yüzölçümü bakımından Konya'dır. En kalabalık il ise İstanbul'dur.", bonus: "Türkiye'nin en genç ili Osmaniye'dir (1996)." }
    ]
  },

  istanbul: {
    title: "İstanbul",
    icon: "🕌",
    color: "#8e44ad",
    colorLight: "#f9f0ff",
    cards: [
      { emoji: "🏛️", title: "Byzantion — MÖ 667", fact: "Megara kolonicileri İstanbul'un ilk adı olan Byzantion şehrini kurdu. Şehre adını kurucu komutan Byzas'tan aldı.", bonus: "Byzantion, Boğaz'a hâkim konumuyla hemen stratejik önem kazandı." },
      { emoji: "👑", title: "Konstantinopolis — MS 330", fact: "Roma İmparatoru Büyük Konstantin, şehri imparatorluğun yeni başkenti yaptı ve Konstantinopolis adını verdi. Şehir Roma'dan daha büyük hale geldi!", bonus: "Konstantin, şehri 'Yeni Roma' olarak tasarladı." },
      { emoji: "⛪", title: "Ayasofya — MS 537", fact: "İmparator Justinianus Ayasofya'yı inşa ettirdi. 1000 yıl boyunca dünyanın en büyük kilisesi oldu. Kubbesi mühendislik harikasıdır!", bonus: "İçindeki sütunlar Roma'daki Artemis Tapınağı'ndan getirildi." },
      { emoji: "⚔️", title: "Fetih — 1453", fact: "21 yaşındaki Fatih Sultan Mehmet 53 günlük kuşatmanın ardından İstanbul'u fethetti. Bu olay Orta Çağ'ın sonu olarak tarihe geçti!", bonus: "Fatih, topları taşımak için yağlı tomruklar kullandı." },
      { emoji: "🏰", title: "Topkapı Sarayı — 1465", fact: "Topkapı Sarayı inşaatı başladı. 400 yıl boyunca Osmanlı sultanlarına ev sahipliği yaptı. İçinde 4000'den fazla oda var!", bonus: "Sarayda aynı anda 4000 kişi yaşayabiliyordu." },
      { emoji: "🕌", title: "Süleymaniye Camii — 1557", fact: "Mimar Sinan başyapıtı Süleymaniye Camii'ni 7 yılda tamamladı. 4 minaresi ve dev kubbesiyle İstanbul siluetinin simgesi oldu.", bonus: "Mimar Sinan 90'dan fazla cami inşa etti." },
      { emoji: "🚃", title: "İlk Tramvay — 1863", fact: "Dünyanın ilk tramvay hatlarından biri İstanbul'da açıldı! Başlangıçta atlar tarafından çekiliyordu.", bonus: "İstanbul'daki nostalji tramvayı bugün hâlâ İstiklal Caddesi'nde çalışıyor." },
      { emoji: "🌉", title: "Boğaziçi Köprüsü — 1973", fact: "Boğaziçi Köprüsü açıldı ve Avrupa ile Asya iki kıtayı karadan ilk kez birbirine bağladı. Köprü 1560 m uzunluğundadır!", bonus: "Köprüde her gün yaklaşık 180.000 araç geçiyor." },
      { emoji: "🎭", title: "Avrupa Kültür Başkenti — 2010", fact: "İstanbul, Avrupa Kültür Başkenti seçildi. 2000'den fazla sanatsal etkinlik düzenlendi ve milyonlarca turist ağırlandı.", bonus: "İstanbul bu unvanı alan ilk Türk şehridir." },
      { emoji: "🌆", title: "İstanbul Bugün", fact: "15 milyonun üzerinde nüfusuyla İstanbul, Avrupa'nın en kalabalık şehridir. Hem tarihi mirası hem modern yapısıyla eşsiz bir şehir!", bonus: "İstanbul'da 3000'den fazla cami, 40'tan fazla müze bulunuyor." }
    ]
  }
};
