export const MOCK_BLOGS = [
  {
    id: "blog-1",
    title: "Chasing Sunsets in Southeast Asia",
    author: "alex_wanders",
    thumbnail: "https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=800&q=80",
    createdAt: "2025-11-01T10:00:00Z",
    views: 14820,
    likes: 2340,
    paragraphs: [
      {
        id: "p1-1",
        heading: "Bangkok: The City That Never Sleeps",
        body: "Stepping off the plane in Bangkok is like walking into a wall of warm, fragrant air. The streets hum with tuk-tuks weaving between golden temple spires and neon-lit night markets. We spent three days lost in Chinatown's alleyways, eating pad see ew at 2am and haggling for silk scarves at Chatuchak. The Grand Palace alone is worth the trip — its mosaicked chedis catch the afternoon light in a way no photograph can quite capture.",
        location: { name: "Bangkok, Thailand", lat: 13.7563, lng: 100.5018 }
      },
      {
        id: "p1-2",
        heading: "Chiang Mai: Mountains and Monks",
        body: "A short flight north and the landscape transforms entirely. Chiang Mai sits in a valley ringed by misty jungle mountains, its old city enclosed by a moat and crumbling brick walls. We woke at 6am to offer alms to saffron-robed monks on Ratchadamnoen Road — a humbling, silent ritual. Later, we hiked to Doi Inthanon, Thailand's highest peak, where cloud forest wrapped the trail in cool mist and birdsong replaced traffic noise.",
        location: { name: "Chiang Mai, Thailand", lat: 18.7883, lng: 98.9853 }
      },
      {
        id: "p1-3",
        heading: "Hoi An: Lanterns on the River",
        body: "Crossing into Vietnam, Hoi An is a fairytale town where the Thu Bon river reflects a thousand paper lanterns every evening. Tailor shops line the ancient streets, offering custom suits in 24 hours. We kayaked through the flooded rice fields at sunrise, our paddles barely disturbing the glassy water, egrets lifting silently from the reeds ahead.",
        location: { name: "Hoi An, Vietnam", lat: 15.8801, lng: 108.3380 }
      },
      {
        id: "p1-4",
        heading: "Ha Long Bay: Limestone Giants",
        body: "No photograph prepares you for Ha Long Bay. Nearly 2,000 limestone karsts jut from emerald water, their bases hollowed by caves and arches. We slept on a wooden junk boat, waking to fog dissolving between the towers as the sun rose. Kayaking through sea caves into hidden lagoons, you feel both enormously small and enormously lucky.",
        location: { name: "Ha Long Bay, Vietnam", lat: 20.9101, lng: 107.1839 }
      }
    ],
    comments: [
      { id: "c1-1", author: "marina_travels", text: "Ha Long Bay changed my life. Amazing write-up!", createdAt: "2025-11-05T14:22:00Z" },
      { id: "c1-2", author: "nomad_pete", text: "Hoi An is absolutely on my list now.", createdAt: "2025-11-06T09:10:00Z" }
    ]
  },
  {
    id: "blog-2",
    title: "Patagonia: At the End of the World",
    author: "sofia_explores",
    thumbnail: "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800&q=80",
    createdAt: "2025-10-15T08:00:00Z",
    views: 21450,
    likes: 3870,
    paragraphs: [
      {
        id: "p2-1",
        heading: "Puerto Natales: Gateway to Torres del Paine",
        body: "Puerto Natales is a wind-scoured fishing town where everyone either just finished the W Trek or is about to start it. We arrived after a 3-day ferry ride through the fjords, watching dolphins race the bow wave while glaciers slid past in the rain. The town has a rough, frontier energy — gear shops, hearty lamb stew, and a sky that shifts from grey to blinding blue in minutes.",
        location: { name: "Puerto Natales, Chile", lat: -51.7322, lng: -72.4867 }
      },
      {
        id: "p2-2",
        heading: "Torres del Paine: The Towers",
        body: "The ascent to the Mirador Las Torres begins at 3am with headlamps and chattering teeth. After four hours of uphill scrambling over boulders in a river valley, the lake appears — a milky turquoise disc below three granite towers that glow amber, then rose, then blazing orange as the sun crests the ridge behind you. Every exhausted muscle is instantly forgotten.",
        location: { name: "Torres del Paine, Chile", lat: -50.9423, lng: -73.4068 }
      },
      {
        id: "p2-3",
        heading: "El Calafate: Perito Moreno Glacier",
        body: "Crossing into Argentina, the Perito Moreno Glacier is one of the few glaciers in the world that is not retreating — it advances 2 metres per day. Standing on the viewing platforms, the ice wall rises six stories above the lake. Every few minutes a crack like a cannon shot echoes across the water, and a bus-sized block of ice calves into the turquoise depths below.",
        location: { name: "El Calafate, Argentina", lat: -50.3399, lng: -72.2647 }
      }
    ],
    comments: [
      { id: "c2-1", author: "trekker_rob", text: "Did the W Trek last January — absolute bucket list experience.", createdAt: "2025-10-20T11:30:00Z" }
    ]
  },
  {
    id: "blog-3",
    title: "Morocco: Spices, Sahara and Silence",
    author: "leila_roams",
    thumbnail: "https://images.unsplash.com/photo-1489493585363-d69421e0edd3?w=800&q=80",
    createdAt: "2025-09-20T12:00:00Z",
    views: 9870,
    likes: 1560,
    paragraphs: [
      {
        id: "p3-1",
        heading: "Marrakech: The Red City",
        body: "Djemaa el-Fna square is the beating heart of Marrakech, a UNESCO-listed spectacle of snake charmers, storytellers, and smoking tagine pots. We navigated the medina's labyrinthine souks by smell — leather in one lane, cumin in the next. The Saadian Tombs were deserted at 8am, their cedar-carved arches glowing gold in the early light.",
        location: { name: "Marrakech, Morocco", lat: 31.6295, lng: -7.9811 }
      },
      {
        id: "p3-2",
        heading: "Fès: Medieval Tanneries",
        body: "Fès el-Bali is the world's largest car-free urban area and it feels like stepping into the 12th century. The Chouara tannery, viewed from leather-shop balconies, is a riot of dye vats — honeycomb yellow, poppy red, indigo blue. Workers stand knee-deep in pigeon dung and lime, beating hides on stone slabs, the smell so overpowering that shopkeepers hand you sprigs of mint to hold under your nose.",
        location: { name: "Fès, Morocco", lat: 34.0181, lng: -5.0078 }
      },
      {
        id: "p3-3",
        heading: "Merzouga: Sleeping in the Sahara",
        body: "The Erg Chebbi dunes near Merzouga rise 150 metres from the flat hammada. We rode camels at sunset, the animals grumbling theatrically, to a Berber camp in the dune sea. After dinner with local musicians under a canopy of stars so dense they blurred into the Milky Way, the silence was total — no wind, no insects, just the occasional creak of the tent fabric.",
        location: { name: "Merzouga, Morocco", lat: 31.0995, lng: -3.9732 }
      }
    ],
    comments: []
  },
  {
    id: "blog-4",
    title: "Japan in Cherry Blossom Season",
    author: "kenji_roadtrip",
    thumbnail: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&q=80",
    createdAt: "2025-08-05T06:00:00Z",
    views: 31200,
    likes: 5420,
    paragraphs: [
      {
        id: "p4-1",
        heading: "Tokyo: Chaos and Calm",
        body: "Tokyo is famously overwhelming but equally kind — every person I stopped for directions went out of their way to help, sometimes walking me to my destination. Shinjuku at night is a blaze of competing neon and perfume advertisements; Yanaka at noon is wooden gates, pottery shops and a cemetery full of fat cats sleeping on graves.",
        location: { name: "Tokyo, Japan", lat: 35.6762, lng: 139.6503 }
      },
      {
        id: "p4-2",
        heading: "Kyoto: Temples Without Crowds",
        body: "Arriving at Fushimi Inari at 5:30am, before the tour buses, the thousands of vermilion torii gates climbing Mount Inari are genuinely mysterious — tunnels of orange light disappearing into forest fog. By 9am, 200 people will be taking selfies in the same spot. The lesson of Kyoto is simple: go early, go late, go in the rain.",
        location: { name: "Kyoto, Japan", lat: 35.0116, lng: 135.7681 }
      },
      {
        id: "p4-3",
        heading: "Hiroshima and Miyajima",
        body: "The Peace Memorial Park in Hiroshima is quietly devastating — the Atomic Bomb Dome preserved as a ruin, the Children's Peace Monument draped in paper cranes. A 15-minute ferry from Hiroshima brings you to Miyajima Island, where the torii gate of Itsukushima Shrine appears to float on the sea at high tide and sacred deer wander the village streets stealing tourist snacks.",
        location: { name: "Hiroshima, Japan", lat: 34.3853, lng: 132.4553 }
      }
    ],
    comments: [
      { id: "c4-1", author: "sakura_fan", text: "Fushimi Inari at sunrise — exactly as magical as you describe.", createdAt: "2025-08-10T07:45:00Z" },
      { id: "c4-2", author: "ramen_rick", text: "Don't sleep on Osaka if you're going to Kyoto!", createdAt: "2025-08-11T13:00:00Z" }
    ]
  },
  {
    id: "blog-5",
    title: "Iceland: Fire and Ice",
    author: "bjorn_adventures",
    thumbnail: "https://images.unsplash.com/photo-1476610182048-b716b8518aae?w=800&q=80",
    createdAt: "2025-07-22T09:00:00Z",
    views: 18630,
    likes: 2980,
    paragraphs: [
      {
        id: "p5-1",
        heading: "Reykjavik: Colourful and Caffeinated",
        body: "Reykjavik might be the world's northernmost capital but it runs on strong coffee, bright house paint and an extraordinary density of bookshops per capita. Hallgrímskirkja church looms over the city from its hilltop, its concrete rocket-ship silhouette visible from every street. We ate skyr for breakfast and lamb soup for dinner every single day and never tired of either.",
        location: { name: "Reykjavik, Iceland", lat: 64.1265, lng: -21.8174 }
      },
      {
        id: "p5-2",
        heading: "The Golden Circle",
        body: "The Golden Circle route connects three geological wonders within 300km of the capital: Þingvellir National Park where the North American and Eurasian tectonic plates are visibly pulling apart; the Geysir hot spring area where Strokkur erupts every 10 minutes with a satisfying glug-and-whoosh; and Gullfoss, a double-tiered waterfall that generates its own perpetual rainbow.",
        location: { name: "Þingvellir, Iceland", lat: 64.2558, lng: -21.1303 }
      },
      {
        id: "p5-3",
        heading: "Jökulsárlón Glacier Lagoon",
        body: "At the terminus of the Breiðamerkurjökull glacier, icebergs calve continuously into a lagoon before drifting to the sea. We sat on the black sand beach as Atlantic waves rolled translucent blue ice sculptures onto the shore — Diamond Beach, they call it, and the name is apt. At midnight in summer, the sun touched the horizon and painted everything a sustained amber that lasted for hours.",
        location: { name: "Jökulsárlón, Iceland", lat: 64.0784, lng: -16.2306 }
      }
    ],
    comments: [
      { id: "c5-1", author: "northern_lights_fan", text: "Did you see the aurora? When's the best time to go?", createdAt: "2025-07-28T19:00:00Z" }
    ]
  },
  {
    id: "blog-6",
    title: "Peru: Ancient Paths to Machu Picchu",
    author: "elena_hikes",
    thumbnail: "https://images.unsplash.com/photo-1526392060635-9d6019884377?w=800&q=80",
    createdAt: "2025-06-10T11:00:00Z",
    views: 7650,
    likes: 1240,
    paragraphs: [
      {
        id: "p6-1",
        heading: "Lima: Ceviche Capital of the World",
        body: "Lima's Miraflores district perches on cliffs above the Pacific, paragliders launching off the edge while below surfers paddle cold grey swells. The city's food scene is genuinely world-class: we ate ceviche leche de tigre and causa at La Mar and spent a happy afternoon at the Larco Museum admiring pre-Columbian gold.",
        location: { name: "Lima, Peru", lat: -12.0464, lng: -77.0428 }
      },
      {
        id: "p6-2",
        heading: "Cusco: High Altitude Acclimatisation",
        body: "At 3,400m, Cusco stops you immediately. Climbing a single flight of stairs leaves you breathless. We spent two days drinking coca tea and eating light, ascending slowly to the Sacsayhuamán fortress where the Inca masonry — stone blocks fitted without mortar so precisely that a knife blade cannot be slid between them — still defies modern understanding.",
        location: { name: "Cusco, Peru", lat: -13.5320, lng: -71.9675 }
      },
      {
        id: "p6-3",
        heading: "Machu Picchu: Worth Every Step",
        body: "We took the train to Aguas Calientes and walked up rather than taking the bus — 90 minutes of zig-zagging stone steps through cloud forest, arriving at the Sun Gate just as the morning mist lifted from the citadel below. Machu Picchu reveals itself slowly: first the terraces, then the temples, then the full scale of it — a city built on a mountain saddle, surrounded by higher peaks, hidden from the Spanish for 400 years.",
        location: { name: "Machu Picchu, Peru", lat: -13.1631, lng: -72.5450 }
      }
    ],
    comments: []
  },
  {
    id: "blog-7",
    title: "New Zealand Road Trip",
    author: "kiwi_chronicles",
    thumbnail: "https://images.unsplash.com/photo-1507699622108-4be3abd695ad?w=800&q=80",
    createdAt: "2025-05-03T07:00:00Z",
    views: 11340,
    likes: 2100,
    paragraphs: [
      {
        id: "p7-1",
        heading: "Auckland to the Bay of Islands",
        body: "We rented a campervan in Auckland — the only sensible way to see New Zealand — and drove north to the Bay of Islands, 144 islands scattered in a sparkling harbour that the Māori called Pekapeka-tahi. Dolphins escorted our ferry to Russell, the country's first capital, a sleepy town of Victorian buildings and excellent whitebait fritters.",
        location: { name: "Bay of Islands, New Zealand", lat: -35.1831, lng: 174.0940 }
      },
      {
        id: "p7-2",
        heading: "Rotorua: Geothermal Wonderland",
        body: "Rotorua smells of sulphur permanently, a fact locals claim not to notice. The geothermal parks are spectacular: boiling mud pools the colour of chocolate mousse, geysers erupting on schedule, rainbow-hued silica terraces. We joined a Māori cultural evening at Te Puia — haka, hangi-cooked food, and carving demonstrations — that was entirely without the cringe of a tourist trap.",
        location: { name: "Rotorua, New Zealand", lat: -38.1368, lng: 176.2497 }
      }
    ],
    comments: [
      { id: "c7-1", author: "hobbit_fan", text: "Did you do the Hobbiton tour? Was it worth it?", createdAt: "2025-05-10T12:00:00Z" }
    ]
  },
  {
    id: "blog-8",
    title: "Norway Fjords by Kayak",
    author: "nordic_paddle",
    thumbnail: "https://images.unsplash.com/photo-1513519245088-0e12902e35a4?w=800&q=80",
    createdAt: "2025-04-18T14:00:00Z",
    views: 6430,
    likes: 980,
    paragraphs: [
      {
        id: "p8-1",
        heading: "Bergen: Gateway to the Fjords",
        body: "Bergen is soaked in rain 200 days a year and its people wear this as a badge of pride. The Bryggen wharf, a row of crooked medieval warehouses now filled with craft shops and cafés, was inscribed as a UNESCO site despite — or because of — its perpetual state of elegant decay. We took the Fløibanen funicular up to Mount Fløyen at dusk and watched clouds drift through the city far below.",
        location: { name: "Bergen, Norway", lat: 60.3913, lng: 5.3221 }
      },
      {
        id: "p8-2",
        heading: "Nærøyfjord: Paddling the Narrowest Fjord",
        body: "Nærøyfjord is UNESCO-listed and barely 250 metres wide at its narrowest point, sheer walls rising 1,700 metres on both sides. Kayaking in silence between those walls, only the drip of paddle and the distant rumble of a waterfall, is as close to being inside a cathedral as I've ever felt outdoors. A seal joined us for half an hour, surfacing to stare at us with enormous black eyes.",
        location: { name: "Nærøyfjord, Norway", lat: 60.9307, lng: 6.7267 }
      }
    ],
    comments: []
  }
];

export const MOCK_USERS = [
  {
    username: "alex_wanders",
    password: "password123",
    blogIds: ["blog-1"]
  },
  {
    username: "sofia_explores",
    password: "password123",
    blogIds: ["blog-2"]
  }
];
