/* global React, ReactDOM, useTweaks, TweaksPanel, TweakSection, TweakSelect, TweakToggle, TweakText */
const { useState, useEffect } = React;

// ---------------- i18n ----------------
// Language is decided by URL: /cn -> Simplified, /tw -> Traditional, else English.
// LangToggle switches via navigation (preserves the #hash).
const LANG = (() => {
  if (typeof window === "undefined") return "en";
  const p = window.location.pathname.replace(/\/+$/, "").replace(/\.html$/i, "");
  if (p === "/tw" || p.endsWith("/tw")) return "tw";
  if (p === "/cn" || p.endsWith("/cn")) return "cn";
  return "en";
})();
// tr(en, cn, tw) — `tw` falls back to `cn` if not supplied.
const tr = (en, cn, tw) => {
  if (LANG === "tw") return tw !== undefined ? tw : cn;
  if (LANG === "cn") return cn;
  return en;
};

const LANG_LABELS = [
  { key: "en", label: "EN",   path: "/"   },
  { key: "cn", label: "简体", path: "/cn" },
  { key: "tw", label: "繁體", path: "/tw" },
];
function LangToggle() {
  const hash = (typeof window !== "undefined" ? window.location.hash : "");
  return (
    <div className="lang-toggle" role="group" aria-label="Language">
      {LANG_LABELS.map((l, i) => (
        <React.Fragment key={l.key}>
          {i > 0 && <span className="lt-sep">·</span>}
          <a
            href={l.path + hash}
            className={`lt-opt ${LANG === l.key ? "active" : ""}`}
          >{l.label}</a>
        </React.Fragment>
      ))}
    </div>
  );
}

// ---------------- Bella's favorite friends ----------------
// Uses cropped regions of Bella's uploaded photos as portraits, so each card
// shows the actual character she loves. (User-supplied imagery.)
// Each friend gets a tinted "character chip" portrait — initial + decorative emoji,
// no shared-image cropping (the source image is a packed group shot so per-character
// crops don't reliably line up).
// Bella's top 5 — using her uploaded images as portraits.
const FRIENDS = [
  { id: "cinna",  name: "Cinnamoroll",   rank: 1,
    role: tr("main bestie",  "我的头号宝贝",  "我的頭號寶貝"),
    bio:  tr("the floppiest little flying puppy. literally my whole heart ☁️♡", "软软的会飞的小狗狗,完全就是我的心头肉啦 ☁️♡", "軟軟的會飛的小狗狗,完全就是我的心頭肉啦 ☁️♡"),
    chip: "linear-gradient(135deg, #e0f1ff 0%, #b6dcff 100%)", emoji: "☁️", img: "images/cinnamoroll.png" },
  { id: "pompom", name: "Pompompurin",   rank: 2,
    role: tr("pudding king",  "布丁国王",  "布丁國王"),
    bio:  tr("the beret. the booty. lives for snacks just like me 🍮", "贝雷帽!圆屁屁!跟我一样为零食而生 🍮", "貝雷帽!圓屁屁!跟我一樣為零食而生 🍮"),
    chip: "linear-gradient(135deg, #fff3b0 0%, #ffe18a 100%)", emoji: "🍮", img: "images/pompompurin.webp" },
  { id: "cogi",   name: "Cogimyun",      rank: 3,
    role: tr("cherry cloud",  "樱桃小云朵",  "櫻桃小云朵"),
    bio:  tr("tiny flour fairy with a cherry on top. precious precious precious", "顶着一颗樱桃的小面粉精灵,可爱可爱超级可爱", "頂著一顆櫻桃的小麵粉精靈,可愛可愛超級可愛"),
    chip: "linear-gradient(135deg, #ffe0e8 0%, #ffc4d0 100%)", emoji: "🍒", img: "images/cogimyun.jpeg" },
  { id: "hana",   name: "Hanamaruobake", rank: 4,
    role: tr("study buddy",   "学习搭子",   "學習搭子"),
    bio:  tr("ghost holding a giant red pencil. my entire homework aesthetic ✏️", "拿着大红铅笔的小幽灵,完美诠释我的写作业美学 ✏️", "拿著大紅鉛筆的小幽靈,完美詮釋我的寫作業美學 ✏️"),
    chip: "linear-gradient(135deg, #f4f4f4 0%, #ffd1d1 100%)", emoji: "✏️", img: "images/hanamaruobake-2.jpeg" },
  { id: "gude",   name: "Gudetama",      rank: 5,
    role: tr("mood forever",  "永远的心情代言",  "永遠的心情代言"),
    bio:  tr("the lazy egg himself. on bad days i feel deeply spiritually aligned", "本人懒蛋!emo的日子简直跟它灵魂同步~", "本人懶蛋!emo的日子簡直跟它靈魂同步~"),
    chip: "linear-gradient(135deg, #fff7d6 0%, #ffd97a 100%)", emoji: "🍳", img: "images/gudetama.webp" },
];

// ---------------- Nav ----------------
function Nav({ name }) {
  return (
    <nav className="nav">
      <div className="nav-inner">
        <a href="#top" className="brand">
          <span className="brand-mark">✿</span>
          {tr(<>{name}<span className="heart">'s</span>&nbsp;World</>, <>{name}<span className="heart">的</span>&nbsp;小世界</>)}
        </a>
        <ul className="nav-links">
          <li><a href="#about">{tr("about me", "关于我", "關於我")}</a></li>
          <li><a href="#friends">{tr("my faves", "我的最爱", "我的最愛")}</a></li>
          <li><a href="#diary">{tr("diary", "日记", "日記")}</a></li>
          <li><a href="#wall">{tr("photos", "照片墙", "照片牆")}</a></li>
          <li><a href="/violin/">{tr("violin ♪", "小提琴 ♪")}</a></li>
          <li><a href="#guest">{tr("guestbook", "留言板")}</a></li>
        </ul>
        <a href="#guest" className="nav-cta">{tr("sign my page", "来给我留言", "來給我留言")} <span>♡</span></a>
      </div>
    </nav>
  );
}

// ---------------- Marquee ----------------
function Marquee() {
  const items = tr(
    [
      "♡ welcome to my world ♡",
      "✦ best viewed with snacks ✦",
      "★ kawaii forever ★",
      "♡ sign my guestbook!! ♡",
      "✿ thx 4 visiting ✿",
      "✦ sparkle sparkle ✦",
    ],
    [
      "♡ 欢迎来到我的小世界 ♡",
      "✦ 配着零食一起看效果最佳 ✦",
      "★ 永远的卡哇伊 ★",
      "♡ 来给我留言呀!! ♡",
      "✿ 谢谢你来玩 ✿",
      "✦ 闪闪发光 ✦",
    ],
    [
      "♡ 歡迎來到我的小世界 ♡",
      "✦ 配著零食一起看效果最佳 ✦",
      "★ 永遠的卡哇伊 ★",
      "♡ 來給我留言呀!! ♡",
      "✿ 謝謝你來玩 ✿",
      "✦ 閃閃發光 ✦",
    ]
  );
  const all = [...items, ...items, ...items];
  return (
    <div className="marquee">
      <div className="marquee-track">
        {all.map((t, i) => <span key={i}>{t}</span>)}
      </div>
    </div>
  );
}

// ---------------- Hero ----------------
function Hero({ name, tagline }) {
  const localTagline = tr(
    tagline,
    `我是 ${name},今年 8 岁,在 Episcopal Academy 上学,我超超超喜欢三丽鸥!! 这里是我在网上的小角落 —— 你能来,我超开心 ♡`,
    `我是 ${name},今年 8 歲,在 Episcopal Academy 上學,我超超超喜歡三麗鷗!! 這裡是我在網上的小角落 —— 你能來,我超開心 ♡`
  );
  return (
    <section className="hero" id="top">
      <div className="container">
        <div className="hero-eyebrow">
          <span className="dot"></span>
          {tr("♡ a personal corner of the internet ♡", "♡ 我在网上的小角落 ♡", "♡ 我在網上的小角落 ♡")}
        </div>
        <h1>
          {tr(
            <>welcome to <span className="name">{name}'s</span><br />world <span className="swirl">✿</span></>,
            <>欢迎来到 <span className="name">{name}</span> 的<br />小世界 <span className="swirl">✿</span></>,
            <>歡迎來到 <span className="name">{name}</span> 的<br />小世界 <span className="swirl">✿</span></>
          )}
        </h1>
        <p className="lede">{localTagline}</p>
        <div className="hero-actions">
          <a href="#friends" className="btn btn-primary">{tr("see my favorite characters →", "看看我最喜欢的角色 →", "看看我最喜歡的角色 →")}</a>
          <a href="#diary" className="btn btn-ghost">{tr("read my diary", "读我的日记", "讀我的日記")}</a>
        </div>

        <div className="hero-banner">
          <div className="tape t1"></div>
          <div className="tape t2"></div>
          <span className="sparkle s1">✦</span>
          <span className="sparkle s2">♡</span>
          <span className="sparkle s3">✿</span>
          <span className="sparkle s4">✦</span>
          <span className="sparkle s5">★</span>
          <span className="sparkle s6">♡</span>
          <img src="images/banner-thankchu.webp" alt={tr("Bella's favorite cute character collage", "Bella 最爱的可爱角色合集", "Bella 最愛的可愛角色合集")} />
        </div>
      </div>
    </section>
  );
}

// ---------------- About Bella ----------------
function About({ name, age, location, mood, useUploadedSelfie }) {
  return (
    <section className="section" id="about">
      <div className="container">
        <div className="section-head">
          <span className="section-eyebrow">{tr("hi hi hi !!", "嗨嗨嗨!!")}</span>
          <h2>{tr("a little about me", "关于我自己~", "關於我自己~")} <span className="heart">♡</span></h2>
          <p className="section-sub">{tr("your friendly neighborhood sanrio enjoyer.", "邻家三丽鸥小迷妹一枚~", "鄰家三麗鷗小迷妹一枚~")}</p>
        </div>
        <div className="about-grid">
          <div className="about-photo">
            <div className="polaroid">
              <span className="heart-sticker">♡</span>
              {useUploadedSelfie ? (
                <image-slot id="bella-selfie" shape="rect" placeholder={tr("drop a selfie here ♡", "把自拍放到这里 ♡", "把自拍放到這裡 ♡")}></image-slot>
              ) : (
                <img src="images/hanamaruobake.jpeg" alt={tr("bella's profile pic", "Bella 的头像", "Bella 的頭像")} style={{ width: 280, height: 280, objectFit: "cover", display: "block", borderRadius: 4 }} />
              )}
              <div className="caption">{tr("that's me ♡", "这就是我啦 ♡", "這就是我啦 ♡")}</div>
            </div>
          </div>
          <div className="about-card">
            <h3>{tr(<>hi, i'm {name}!! ♡</>, <>嗨~我是 {name}!! ♡</>)}</h3>
            {tr(
              <p>
                i'm 8 years old and i live in west chester, pa! i go to <b>episcopal academy</b>
                and i'm in <b>second grade</b>. my teachers are <b>mrs. wylam</b> and <b>mr. l</b>
                and they are the BEST.
              </p>,
              <p>
                我今年 8 岁啦,住在宾州的西彻斯特!我在 <b>Episcopal Academy</b> 上学,
                现在读 <b>二年级</b>。我的老师是 <b>Wylam 老师</b>和 <b>L 老师</b>,
                她们是世界上最棒的老师啦!!
              </p>,
              <p>
                我今年 8 歲啦,住在賓州的西徹斯特!我在 <b>Episcopal Academy</b> 上學,
                現在讀 <b>二年級</b>。我的老師是 <b>Wylam 老師</b>和 <b>L 老師</b>,
                她們是世界上最棒的老師啦!!
              </p>
            )}
            {tr(
              <p>
                my best friends in the whole world are <b>lou</b> and <b>clara</b> 💖 — we read
                books together, trade stuffies, and i make them sign my guestbook all the time.
                welcome to my little corner of the internet, make yourself comfy!! ✿
              </p>,
              <p>
                我全世界最好的朋友是 <b>Lou</b> 和 <b>Clara</b> 💖 ——
                我们一起看书、互换毛绒玩偶,而且我老是叫她们来给我留言哈哈。
                欢迎来我的小角落,随便逛~随便玩~ ✿
              </p>,
              <p>
                我全世界最好的朋友是 <b>Lou</b> 和 <b>Clara</b> 💖 ——
                我們一起看書、互換絨毛玩偶,而且我老是叫她們來給我留言哈哈。
                歡迎來我的小角落,隨便逛~隨便玩~ ✿
              </p>
            )}
            <div className="tag-row">
              <span className="tag">{tr("2nd grade", "二年级", "二年級")}</span>
              <span className="tag b">{tr("strawberry milk", "草莓牛奶")}</span>
              <span className="tag y">{tr("stickers", "贴纸", "貼紙")}</span>
              <span className="tag g">{tr("reading", "看书", "看書")}</span>
              <span className="tag v">{tr("cinnamoroll!!", "Cinnamoroll!!")}</span>
              <span className="tag p">{tr("my besties", "我的好朋友")}</span>
              <span className="tag">{tr("plushies", "毛绒玩偶", "毛絨玩偶")}</span>
            </div>
            <div className="about-stats">
              <div className="stat"><div className="label">{tr("age", "年龄", "年齡")}</div><div className="val">{age}</div></div>
              <div className="stat"><div className="label">{tr("grade", "年级", "年級")}</div><div className="val">{tr("2nd", "二年级", "二年級")}</div></div>
              <div className="stat"><div className="label">{tr("school", "学校", "學校")}</div><div className="val">EA</div></div>
              <div className="stat"><div className="label">{tr("teachers", "老师", "老師")}</div><div className="val" style={{ fontSize: 16 }}>{tr(<>Mrs. Wylam<br/>+ Mr. L</>, <>Wylam 老师<br/>+ L 老师</>, <>Wylam 老師<br/>+ L 老師</>)}</div></div>
              <div className="stat"><div className="label">{tr("based in", "坐标", "座標")}</div><div className="val" style={{ fontSize: 16 }}>{tr(location, "宾州西彻斯特", "賓州西徹斯特")}</div></div>
              <div className="stat"><div className="label">{tr("mood", "心情")}</div><div className="val" style={{ fontSize: 18 }}>{tr(mood, "开心 ♡", "開心 ♡")}</div></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ---------------- Friends section ----------------
function FriendsSection() {
  return (
    <section className="section" id="friends">
      <div className="container">
        <div className="section-head">
          <span className="section-eyebrow">{tr("my top 5 ♡", "我的 TOP 5 ♡")}</span>
          <h2>{tr("my favorite characters", "我最喜欢的角色", "我最喜歡的角色")} <span className="heart">♡</span></h2>
          <p className="section-sub">{tr("ranked, but the order changes every week.", "有排名啦,不过每周都会换顺序~", "有排名啦,不過每週都會換順序~")}</p>
        </div>
        <div className="friends-grid">
          {FRIENDS.map(f => (
            <div className="friend-card" key={f.id} style={{ "--bg-tint": f.tint }}>
              <span className="rank">#{f.rank}</span>
              <span className="heart-mini">♡</span>
              <div className="friend-portrait" style={{ background: f.chip }}>
                <span className="deco-sparkle">✦</span>
                <img src={f.img} alt={f.name} className="portrait-img" />
                <span className="deco-emoji">{f.emoji}</span>
              </div>
              <h3>{f.name}</h3>
              <div className="role">{f.role}</div>
              <p>{f.bio}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ---------------- Diary ----------------
function Diary() {
  return (
    <section className="section" id="diary" style={{ paddingTop: 40 }}>
      <div className="container">
        <div className="section-head">
          <span className="section-eyebrow">{tr("today's entry", "今日日记", "今日日記")}</span>
          <h2>{tr("bella's diary", "Bella 的小日记", "Bella 的小日記")}</h2>
          <p className="section-sub">{tr("a tiny update, every now & then.", "时不时更新一点点小心情~", "時不時更新一點點小心情~")}</p>
        </div>
        <div className="diary-wrap">
          <div className="diary-card">
            <div className="diary-tape"></div>
            <div className="diary-date">{tr("★ sunday, may 10th ★", "★ 5月10日 星期日 ★")}</div>
            <h3>{tr("i finally got the strawberry plushie!!!", "我终于买到草莓玩偶啦!!!", "我終於買到草莓玩偶啦!!!")}</h3>
            {tr(
              <p>
                ok so today was kind of perfect?? i woke up early (rare), made strawberry pancakes,
                and then me + sof + jules walked to the new sanrio cafe downtown. the matcha latte
                had a little kitty foam print on top — i nearly cried. i didn't even drink it for
                like ten minutes i just stared at it.
              </p>,
              <p>
                今天真的太完美啦?? 早上居然起得早(很罕见),做了草莓松饼,
                然后我跟 Sof、Jules 一起走去市中心新开的三丽鸥咖啡馆。
                抹茶拿铁上面有个小猫咪奶泡图案 —— 我差点哭出来。
                足足盯了它十分钟才舍得喝!
              </p>,
              <p>
                今天真的太完美啦?? 早上居然起得早(很罕見),做了草莓鬆餅,
                然後我跟 Sof、Jules 一起走去市中心新開的三麗鷗咖啡館。
                抹茶拿鐵上面有個小貓咪奶泡圖案 —— 我差點哭出來。
                足足盯了它十分鐘才捨得喝!
              </p>
            )}
            {tr(
              <p>
                after, i FINALLY found the limited edition strawberry plush i've been hunting for
                months 🍓 i'm putting it right next to my reading nook. she fits perfectly. life
                is good. xoxo
              </p>,
              <p>
                之后,我终于!! 找到那只我找了好几个月的限定版草莓玩偶啦 🍓
                我要把她放在我看书角落的旁边,完美契合。生活真美好~ 么么哒
              </p>,
              <p>
                之後,我終於!! 找到那隻我找了好幾個月的限定版草莓玩偶啦 🍓
                我要把她放在我看書角落的旁邊,完美契合。生活真美好~ 麼麼噠
              </p>
            )}
            <div>
              <span className="diary-mood">{tr("today's mood · giddy 🍓", "今日心情 · 飘飘然 🍓", "今日心情 · 飄飄然 🍓")}</span>
              <span className="diary-mood">{tr("soundtrack · soft pop ☁", "BGM · 软软流行乐 ☁", "BGM · 軟軟流行樂 ☁")}</span>
            </div>
          </div>
          <div className="diary-photo">
            <div className="polaroid">
              <img src="images/group-cream.png" alt={tr("bella's character collage", "Bella 的角色合集")} style={{ width: 320, height: 320, objectFit: "cover", display: "block", borderRadius: 4 }} />
              <div className="caption">{tr("my whole crew ♡", "我的小分队 ♡", "我的小分隊 ♡")}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ---------------- Faves grid ----------------
const FAVES = [
  { icon: "🍘", lbl: tr("favorite snack",    "最爱的零食",    "最愛的零食"),       name: tr("crackers",              "饼干",              "餅乾"),              desc: tr("any kind!! ritz, goldfish, the buttery ones — yes pls.",     "什么口味都行!! 乐之、小金鱼、奶香的统统来一份~",     "什麼口味都行!! 樂之、小金魚、奶香的統統來一份~"),  bg: "#ffe9a8" },
  { icon: "🎶", lbl: tr("current song",      "最近在听",      "最近在聽"),         name: tr("Golden",                "Golden"),            desc: tr("from kpop demon hunters!! it's literally playing rn ♡",      "K-Pop Demon Hunters 的歌!! 现在就在放哦 ♡",      "K-Pop Demon Hunters 的歌!! 現在就在放哦 ♡"),       bg: "#d9c8ff" },
  { icon: "📚", lbl: tr("now reading",       "正在看"),           name: tr("My Weird School",       "《我的怪兽学校》",       "《我的怪獸學校》"),  desc: tr("funniest series ever, i can't put it down lol.",             "全宇宙最搞笑的书,我根本停不下来哈哈哈",             "全宇宙最搞笑的書,我根本停不下來哈哈哈"),          bg: "#cfe8ff" },
  { icon: "🎨", lbl: tr("favorite color",    "最爱的颜色",    "最愛的顏色"),       name: tr("pink & blue",           "粉色 + 蓝色",           "粉色 + 藍色"),       desc: tr("best combo ever — total cinnamoroll vibes ✿",                "最棒的组合 —— 完全 Cinnamoroll 的氛围感 ✿",                "最棒的組合 —— 完全 Cinnamoroll 的氛圍感 ✿"),       bg: "#ffb6d5" },
  { icon: "🎲", lbl: tr("current obsession", "最近超痴迷"),       name: tr("Nana (the board game)", "Nana(桌游)", "Nana(桌遊)"),       desc: tr("we play it like every day, i can't stop thinking about it.", "我们几乎天天玩,我满脑子都是它~", "我們幾乎天天玩,我滿腦子都是它~"),                  bg: "#fff3b0" },
  { icon: "🍰", lbl: tr("best dessert",      "最爱的甜点",      "最愛的甜點"),       name: tr("cake",                  "蛋糕"),              desc: tr("any flavor honestly!! with frosting roses ideally ♡",        "什么口味都爱!! 最好上面有奶油花 ♡",        "什麼口味都愛!! 最好上面有奶油花 ♡"),               bg: "#ffd6b8" },
  { icon: "🐊", lbl: tr("dream destination", "梦想去的地方", "夢想去的地方"),     name: tr("the Everglades",        "大沼泽地国家公园",        "大沼澤地國家公園"),  desc: tr("alligators!! airboats!! a whole entire adventure.",          "鳄鱼!! 气垫船!! 一整个大冒险~",          "鱷魚!! 氣墊船!! 一整個大冒險~"),                    bg: "#c4ecd5" },
  { icon: "💎", lbl: tr("lucky charm",       "幸运物",       "幸運物"),           name: tr("blue diamond",          "蓝钻石",          "藍鑽石"),            desc: tr("sparkly + my favorite color = perfect.",                     "闪闪的 + 我最爱的颜色 = 完美.",                     "閃閃的 + 我最愛的顏色 = 完美."),                    bg: "#cfe8ff" },
];
function Faves() {
  return (
    <section className="section" id="faves">
      <div className="container">
        <div className="section-head">
          <span className="section-eyebrow">{tr("a few of my favorite things", "我的几样心头好", "我的幾樣心頭好")}</span>
          <h2>{tr("bella's faves", "Bella 的最爱", "Bella 的最愛")}</h2>
          <p className="section-sub">{tr("updated whenever i discover something new.", "发现新欢就会更新~", "發現新歡就會更新~")}</p>
        </div>
        <div className="faves-grid">
          {FAVES.map((f, i) => (
            <div className="fave-card" key={i}>
              <div className="icon" style={{ background: f.bg }}>{f.icon}</div>
              <div className="lbl">{f.lbl}</div>
              <h4>{f.name}</h4>
              <p>{f.desc}</p>
              <span className="deco">{f.icon}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ---------------- Photo wall ----------------
function PhotoWall() {
  return (
    <section className="section" id="wall">
      <div className="container">
        <div className="section-head">
          <span className="section-eyebrow">{tr("collection corner", "收藏小角落")}</span>
          <h2>{tr("my photo wall", "我的照片墙", "我的照片牆")} <span className="heart">♡</span></h2>
          <p className="section-sub">{tr("snapshots from my plush shelf, my desk, and the sanrio store haul of dreams.", "玩偶架、书桌,还有梦中的三丽鸥战利品~随手拍的小照片", "玩偶架、書桌,還有夢中的三麗鷗戰利品~隨手拍的小照片")}</p>
        </div>
        <div className="photo-wall">
          <div className="wall-photo p1"><img src="images/group-rainbow.webp" alt={tr("rainbow group", "彩虹合照")} /><div className="caption">{tr("in the clerb ✨", "派对中 ✨", "派對中 ✨")}</div></div>
          <div className="wall-photo p2"><img src="images/banner-thankchu.webp" alt={tr("thank chu collage", "Thank chu 合集")} /><div className="caption">{tr("thank chu ♡", "Thank chu ♡")}</div></div>
          <div className="wall-photo p3"><img src="images/group-cream.png" alt={tr("cream group", "奶油色合照")} /><div className="caption">{tr("the whole gang!!", "全员到齐!!", "全員到齊!!")}</div></div>
          <div className="wall-photo p4"><img src="images/hanamaruobake.jpeg" alt={tr("cute mascot", "可爱小吉祥物", "可愛小吉祥物")} /><div className="caption">{tr("study buddy 📓", "学习搭子 📓", "學習搭子 📓")}</div></div>
          <div className="wall-photo p5"><img src="images/group-rainbow.webp" alt={tr("rainbow group", "彩虹合照")} style={{ objectPosition: "left center" }} /><div className="caption">{tr("kuromi era", "Kuromi 时代", "Kuromi 時代")}</div></div>
          <div className="wall-photo p6"><img src="images/banner-thankchu.webp" alt={tr("thank chu", "Thank chu")} style={{ objectPosition: "right center" }} /><div className="caption">{tr("heart attack ♡", "心动暴击 ♡", "心動暴擊 ♡")}</div></div>

          <span className="wall-sticker heart">♡</span>
          <span className="wall-sticker star">★</span>
          <span className="wall-sticker bow">✿</span>
        </div>
      </div>
    </section>
  );
}

// ---------------- Guestbook ----------------
const TONES = ["", "alt", "alt2", "alt3"];
const RT_WS_URL = "wss://bellas-guestbook-rt.quake0day.workers.dev/ws";
const TYPING_TTL = 3500;        // how long a typing indicator stays visible
const TYPING_THROTTLE = 1500;   // min ms between outbound typing pings

function timeAgo(ts) {
  const s = Math.max(1, Math.floor((Date.now() - ts) / 1000));
  if (LANG === "cn" || LANG === "tw") {
    const isTw = LANG === "tw";
    if (s < 60) return isTw ? "剛剛" : "刚刚";
    const m = Math.floor(s / 60);
    if (m < 60) return isTw ? `${m} 分鐘前` : `${m} 分钟前`;
    const h = Math.floor(m / 60);
    if (h < 24) return isTw ? `${h} 小時前` : `${h} 小时前`;
    const d = Math.floor(h / 24);
    if (d === 1) return isTw ? "昨天" : "昨天";
    if (d < 30) return isTw ? `${d} 天前` : `${d} 天前`;
    return new Date(ts).toLocaleDateString(isTw ? "zh-TW" : "zh-CN");
  }
  if (s < 60) return "just now";
  const m = Math.floor(s / 60);
  if (m < 60) return `${m} min${m === 1 ? "" : "s"} ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h} hr${h === 1 ? "" : "s"} ago`;
  const d = Math.floor(h / 24);
  if (d === 1) return "yesterday";
  if (d < 30) return `${d} days ago`;
  return new Date(ts).toLocaleDateString();
}

function formatTypers(names) {
  if (names.length === 0) return "";
  if (LANG === "cn") {
    if (names.length === 1) return `${names[0]} 正在输入`;
    if (names.length === 2) return `${names[0]} 和 ${names[1]} 正在输入`;
    return `${names[0]}、${names[1]} 等 ${names.length} 人正在输入`;
  }
  if (LANG === "tw") {
    if (names.length === 1) return `${names[0]} 正在輸入`;
    if (names.length === 2) return `${names[0]} 和 ${names[1]} 正在輸入`;
    return `${names[0]}、${names[1]} 等 ${names.length} 人正在輸入`;
  }
  if (names.length === 1) return `${names[0]} is typing`;
  if (names.length === 2) return `${names[0]} & ${names[1]} are typing`;
  return `${names[0]}, ${names[1]} & ${names.length - 2} more are typing`;
}

function Guestbook() {
  const [name, setName] = useState("");
  const [msg, setMsg] = useState("");
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);
  const [error, setError] = useState("");
  const [connected, setConnected] = useState(false);
  const [typers, setTypers] = useState([]);   // [{who, expiresAt}]

  const wsRef = React.useRef(null);
  const lastTypingSentRef = React.useRef(0);
  const stopTypingTimerRef = React.useRef(null);
  const tickRef = React.useRef(0);
  const [, forceTick] = useState(0);

  // Initial load
  useEffect(() => {
    fetch("/api/guestbook")
      .then(r => r.json())
      .then(d => setList(d.messages || []))
      .catch(() => setError(tr("couldn't load messages :(", "留言加载失败了 :(", "留言載入失敗了 :(")))
      .finally(() => setLoading(false));
  }, []);

  // WebSocket lifecycle (with reconnect + visibility pause)
  useEffect(() => {
    let cancelled = false;
    let retryDelay = 1000;

    const connect = () => {
      if (cancelled) return;
      const ws = new WebSocket(RT_WS_URL);
      wsRef.current = ws;

      ws.addEventListener("open", () => {
        retryDelay = 1000;
        setConnected(true);
      });

      ws.addEventListener("message", (e) => {
        let data;
        try { data = JSON.parse(e.data); } catch { return; }

        if (data.type === "new" && data.message) {
          setList(prev => {
            if (prev.some(m => m.id === data.message.id)) return prev;
            return [data.message, ...prev];
          });
          // clear that author's typing indicator if any
          setTypers(prev => prev.filter(t => t.who !== data.message.who));
        } else if (data.type === "typing" && data.who) {
          const expiresAt = Date.now() + TYPING_TTL;
          setTypers(prev => {
            const others = prev.filter(t => t.who !== data.who);
            return [...others, { who: data.who, expiresAt }];
          });
        } else if (data.type === "stop-typing" && data.who) {
          setTypers(prev => prev.filter(t => t.who !== data.who));
        }
      });

      ws.addEventListener("close", () => {
        setConnected(false);
        if (cancelled) return;
        setTimeout(connect, retryDelay);
        retryDelay = Math.min(retryDelay * 2, 15000);
      });

      ws.addEventListener("error", () => {
        try { ws.close(); } catch {}
      });
    };

    connect();
    return () => {
      cancelled = true;
      if (wsRef.current) try { wsRef.current.close(); } catch {}
    };
  }, []);

  // Tick to expire stale typers (keeps the indicator self-cleaning)
  useEffect(() => {
    if (typers.length === 0) return;
    const id = setInterval(() => {
      setTypers(prev => prev.filter(t => t.expiresAt > Date.now()));
      tickRef.current++;
      forceTick(tickRef.current);
    }, 700);
    return () => clearInterval(id);
  }, [typers.length]);

  const sendTyping = (currentName) => {
    const ws = wsRef.current;
    if (!ws || ws.readyState !== 1) return;
    const who = (currentName || "someone").trim().slice(0, 40) || "someone";
    const now = Date.now();
    if (now - lastTypingSentRef.current < TYPING_THROTTLE) return;
    lastTypingSentRef.current = now;
    try { ws.send(JSON.stringify({ type: "typing", who })); } catch {}

    // schedule a stop-typing ping after a short pause
    if (stopTypingTimerRef.current) clearTimeout(stopTypingTimerRef.current);
    stopTypingTimerRef.current = setTimeout(() => {
      try { ws.send(JSON.stringify({ type: "stop-typing", who })); } catch {}
    }, TYPING_TTL);
  };

  const handleMsgChange = (e) => {
    setMsg(e.target.value);
    if (e.target.value.trim()) sendTyping(name);
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !msg.trim() || posting) return;
    setPosting(true);
    setError("");
    try {
      const res = await fetch("/api/guestbook", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ who: name.trim(), msg: msg.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || tr("post failed", "发送失败", "傳送失敗"));
      // Optimistic add (WS broadcast will be deduped by id)
      setList(prev => prev.some(m => m.id === data.message.id) ? prev : [data.message, ...prev]);
      setMsg("");
      // proactively tell others I'm done typing
      const ws = wsRef.current;
      if (ws && ws.readyState === 1) {
        try { ws.send(JSON.stringify({ type: "stop-typing", who: name.trim() })); } catch {}
      }
    } catch (err) {
      setError(err.message || tr("couldn't post :(", "发送失败了 :(", "傳送失敗了 :("));
    } finally {
      setPosting(false);
    }
  };

  const visibleTypers = typers
    .filter(t => t.expiresAt > Date.now() && t.who !== name.trim())
    .map(t => t.who);

  return (
    <section className="section" id="guest">
      <div className="container">
        <div className="section-head">
          <span className="section-eyebrow">{tr("leave me a note", "给我留个言~", "給我留個言~")}</span>
          <h2>{tr("guestbook", "留言板")} <span className="heart">♡</span></h2>
          <p className="section-sub">{tr("sign before u go!! tell me your favorite character ✿", "走之前留个言呀!! 告诉我你最喜欢哪个角色 ✿", "走之前留個言呀!! 告訴我你最喜歡哪個角色 ✿")}</p>
        </div>
        <div className="guestbook">
          <form className="gb-form" onSubmit={submit}>
            <h3>
              {tr("say hi to bella ✦", "跟 Bella 打个招呼吧 ✦", "跟 Bella 打個招呼吧 ✦")}
              <span className={`gb-dot ${connected ? "live" : "off"}`} title={connected ? tr("live", "在线", "線上") : tr("reconnecting…", "重连中…", "重連中…")} />
            </h3>
            <p>{tr("your message will appear right over there →", "你的留言会出现在右边哦 →", "你的留言會出現在右邊哦 →")}</p>
            <input
              className="field"
              placeholder={tr("your name (or a cute alias)", "你的名字(或一个可爱的昵称)", "你的名字(或一個可愛的暱稱)")}
              value={name}
              maxLength={40}
              onChange={e => setName(e.target.value)}
            />
            <textarea
              className="field"
              placeholder={tr("leave a sweet note...", "留下一句甜甜的话…", "留下一句甜甜的話…")}
              value={msg}
              maxLength={500}
              onChange={handleMsgChange}
            />
            <button type="submit" disabled={posting}>{posting ? tr("posting…", "发送中…", "傳送中…") : tr("post message →", "发送留言 →", "傳送留言 →")}</button>
            {error && <p style={{ color: "#d6336c", marginTop: 8 }}>{error}</p>}
          </form>
          <div className="gb-list">
            <div className={`gb-typing ${visibleTypers.length ? "show" : ""}`}>
              {visibleTypers.length > 0 && (
                <span>
                  {formatTypers(visibleTypers)}
                  <span className="gb-dots"><span>.</span><span>.</span><span>.</span></span>
                </span>
              )}
            </div>
            {loading && <p>{tr("loading sweet notes…", "正在加载留言…", "正在載入留言…")}</p>}
            {!loading && list.length === 0 && <p>{tr("be the first to sign!! ♡", "来当第一个留言的人吧!! ♡", "來當第一個留言的人吧!! ♡")}</p>}
            {list.map((m, i) => (
              <div key={m.id ?? i} className={`gb-msg ${TONES[i % TONES.length]}`}>
                <div className="who"><span>{m.who} ♡</span><span className="when">{timeAgo(m.created_at)}</span></div>
                <p>{m.msg}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ---------------- Background Music ----------------
function BgMusic() {
  const audioRef = React.useRef(null);
  const [playing, setPlaying] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    a.volume = 0.45;
    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    const onCanPlay = () => setReady(true);
    a.addEventListener("play", onPlay);
    a.addEventListener("pause", onPause);
    a.addEventListener("canplay", onCanPlay);

    // If user previously enabled music, try to resume on first interaction
    if (localStorage.getItem("bg-music") === "on") {
      const tryPlay = () => {
        a.play().catch(() => {});
        window.removeEventListener("pointerdown", tryPlay);
        window.removeEventListener("keydown", tryPlay);
      };
      window.addEventListener("pointerdown", tryPlay, { once: true });
      window.addEventListener("keydown", tryPlay, { once: true });
    }

    return () => {
      a.removeEventListener("play", onPlay);
      a.removeEventListener("pause", onPause);
      a.removeEventListener("canplay", onCanPlay);
    };
  }, []);

  const toggle = async () => {
    const a = audioRef.current;
    if (!a) return;
    if (a.paused) {
      try {
        await a.play();
        localStorage.setItem("bg-music", "on");
      } catch {}
    } else {
      a.pause();
      localStorage.setItem("bg-music", "off");
    }
  };

  return (
    <>
      <audio ref={audioRef} src="/audio/golden.m4a" loop preload="auto" />
      <button
        type="button"
        className={`bg-music ${playing ? "playing" : ""}`}
        onClick={toggle}
        aria-label={playing ? tr("pause music", "暂停音乐", "暫停音樂") : tr("play music", "播放音乐", "播放音樂")}
        title={playing ? tr("pause Golden ♡", "暂停 Golden ♡", "暫停 Golden ♡") : tr("play Golden ♡", "播放 Golden ♡")}
      >
        <span className="bg-music-disc" aria-hidden="true">
          <span className="bg-music-icon">{playing ? "❚❚" : "♪"}</span>
        </span>
        <span className="bg-music-label">{playing ? tr("now playing", "正在播放") : tr("play music", "播放音乐", "播放音樂")}</span>
      </button>
    </>
  );
}

// ---------------- Newsletter ----------------
function Mailbox() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const submit = (e) => {
    e.preventDefault();
    if (!email.includes("@")) return;
    setSent(true);
    setEmail("");
    setTimeout(() => setSent(false), 4000);
  };
  return (
    <section className="section" id="mail">
      <div className="container">
        <div className="mailbox">
          <div className="mailbox-inner">
            <h3>{tr("get bella mail ♡", "订阅 Bella 的小信件 ♡", "訂閱 Bella 的小信件 ♡")}</h3>
            <p>{tr("occasionally i send a tiny letter with new faves, doodles, & sanrio finds.", "偶尔我会发一封小信件,分享新发现、小涂鸦和三丽鸥的好东西~", "偶爾我會發一封小信件,分享新發現、小塗鴉和三麗鷗的好東西~")}</p>
            <form className="mail-form" onSubmit={submit}>
              <input
                type="email"
                placeholder={tr("your@email.cute", "你的@邮箱.com", "你的@郵箱.com")}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <button type="submit">{tr("subscribe →", "订阅 →", "訂閱 →")}</button>
            </form>
            <div className={`mail-confirm ${sent ? "show" : ""}`}>
              {tr("✿ yay!! a tiny letter is on its way ♡", "✿ 耶!! 小信件马上飞过来 ♡", "✿ 耶!! 小信件馬上飛過來 ♡")}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ---------------- Visit counter ----------------
function VisitCounter() {
  const [count, setCount] = useState(null);

  useEffect(() => {
    let cancelled = false;
    const visited = sessionStorage.getItem("bg-visited") === "1";
    const method = visited ? "GET" : "POST";
    fetch("/api/visit", { method })
      .then(r => r.json())
      .then(d => {
        if (cancelled) return;
        setCount(d.count);
        if (!visited) sessionStorage.setItem("bg-visited", "1");
      })
      .catch(() => {});
    return () => { cancelled = true; };
  }, []);

  const display = count == null ? "······" : String(count).padStart(6, "0").replace(/(\d{3})(\d{3})/, "$1,$2");
  return <span className="visit-counter">{tr("visitors:", "访客:", "訪客:")} {display}</span>;
}

// ---------------- Footer ----------------
function Footer({ name }) {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <div className="brand">
              <span className="brand-mark">✿</span>
              {tr(<>{name}'s World</>, <>{name} 的小世界</>)}
            </div>
            <p>{tr("a tiny corner of the internet, made with too much pink & not enough sleep.", "网上的一个小角落,粉色超多,睡眠超少~", "網上的一個小角落,粉色超多,睡眠超少~")}</p>
            <div className="socials">
              <a href="#" aria-label="instagram">📷</a>
              <a href="#" aria-label="tiktok">🎵</a>
              <a href="#" aria-label="pinterest">📌</a>
              <a href="#" aria-label="email">✉</a>
            </div>
          </div>
          <div>
            <h5>{tr("visit", "去看看")}</h5>
            <ul>
              <li><a href="#about">{tr("about me", "关于我", "關於我")}</a></li>
              <li><a href="#friends">{tr("my faves", "我的最爱", "我的最愛")}</a></li>
              <li><a href="#diary">{tr("diary", "日记", "日記")}</a></li>
              <li><a href="#wall">{tr("photo wall", "照片墙", "照片牆")}</a></li>
              <li><a href="/violin/">{tr("violin ♪", "小提琴 ♪")}</a></li>
            </ul>
          </div>
          <div>
            <h5>♡</h5>
            <ul>
              <li><a href="#faves">{tr("favorite things", "最爱的东西", "最愛的東西")}</a></li>
              <li><a href="#guest">{tr("guestbook", "留言板")}</a></li>
              <li><a href="#mail">{tr("bella mail", "Bella 小信件")}</a></li>
              <li><a href="#">{tr("link to my page", "把我的页面分享出去", "把我的頁面分享出去")}</a></li>
            </ul>
          </div>
          <div>
            <h5>{tr("now playing", "正在播放")}</h5>
            <ul>
              <li>{tr("🎵 sparkle pop mix", "🎵 闪闪流行歌单", "🎵 閃閃流行歌單")}</li>
              <li>{tr("🍓 strawberry milk", "🍓 草莓牛奶")}</li>
              <li>{tr("📚 vol 6 of my manga", "📚 漫画第 6 卷", "📚 漫畫第 6 卷")}</li>
              <li>{tr("☁️ daydreaming", "☁️ 走神中")}</li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <span>{tr(<>© 2026 {name}'s World · made with ♡ at 2am</>, <>© 2026 {name} 的小世界 · 凌晨两点用 ♡ 做出来的</>, <>© 2026 {name} 的小世界 · 凌晨兩點用 ♡ 做出來的</>)}</span>
          <VisitCounter />
        </div>
      </div>
    </footer>
  );
}

// ---------------- Tweaks ----------------
const PALETTES = {
  bubblegum: { bg: "#ffeaf4", pink: "#ffb6d5", pinkDeep: "#ff6fa8", pinkHot: "#ff3d8c", sky: "#b6e0ff", skyDeep: "#6fb3e8", ink: "#4a2a5b" },
  blueberry: { bg: "#e6f0ff", pink: "#cfd6ff", pinkDeep: "#7a8fff", pinkHot: "#4a6bff", sky: "#b6e0ff", skyDeep: "#6fb3e8", ink: "#2a3a6b" },
  matcha:    { bg: "#eaf7e8", pink: "#c9e8b8", pinkDeep: "#7fb86b", pinkHot: "#4f9836", sky: "#cfe8ff", skyDeep: "#6fb3e8", ink: "#2a4a2b" },
  butter:    { bg: "#fff8e6", pink: "#ffe9a8", pinkDeep: "#e6b94a", pinkHot: "#c89320", sky: "#ffd1dc", skyDeep: "#ff7fa6", ink: "#5a3a1b" },
  lilac:     { bg: "#f0eaff", pink: "#d9c8ff", pinkDeep: "#9d7ee0", pinkHot: "#7a5ad0", sky: "#ffd1f0", skyDeep: "#e87fc6", ink: "#3a2a5b" },
};
function applyPalette(key) {
  const p = PALETTES[key] || PALETTES.bubblegum;
  const r = document.documentElement.style;
  r.setProperty("--bg", p.bg);
  r.setProperty("--pink", p.pink);
  r.setProperty("--pink-deep", p.pinkDeep);
  r.setProperty("--pink-hot", p.pinkHot);
  r.setProperty("--sky", p.sky);
  r.setProperty("--sky-deep", p.skyDeep);
  r.setProperty("--ink", p.ink);
}

function App() {
  const [t, setTweak] = useTweaks({
    name: "Bella",
    age: "8",
    location: "West Chester, PA",
    mood: "happy ♡",
    tagline: "i'm bella, i'm 8, i go to episcopal academy, and i LOVE sanrio!! this is my little corner of the internet — i'm so glad you're here ♡",
    palette: "bubblegum",
    motion: true,
    useUploadedSelfie: false,
  });

  useEffect(() => { applyPalette(t.palette); }, [t.palette]);
  useEffect(() => { document.body.classList.toggle("no-motion", !t.motion); }, [t.motion]);
  useEffect(() => {
    document.documentElement.lang = LANG === "tw" ? "zh-TW" : LANG === "cn" ? "zh-CN" : "en";
    document.title =
      LANG === "tw" ? `${t.name} 的小世界 ♡ 一個超可愛的小角落` :
      LANG === "cn" ? `${t.name} 的小世界 ♡ 一个超可爱的小角落` :
      `${t.name}'s World ♡ a super cute personal page`;
  }, [t.name]);

  return (
    <>
      <Marquee />
      <div className="sky" aria-hidden="true">
        <div className="cloud c1"></div>
        <div className="cloud c2"></div>
        <div className="cloud c3"></div>
      </div>

      <Nav name={t.name} />
      <main>
        <Hero name={t.name} tagline={t.tagline} />
        <About name={t.name} age={t.age} location={t.location} mood={t.mood} useUploadedSelfie={t.useUploadedSelfie} />
        <FriendsSection />
        <Diary />
        <Faves />
        <PhotoWall />
        <Guestbook />
        <Mailbox />
      </main>
      <Footer name={t.name} />
      <BgMusic />
      <LangToggle />

      <TweaksPanel title="Tweaks">
        <TweakSection title="About">
          <TweakText label="Name"     value={t.name}     onChange={(v) => setTweak("name", v)} />
          <TweakText label="Age"      value={t.age}      onChange={(v) => setTweak("age", v)} />
          <TweakText label="Location" value={t.location} onChange={(v) => setTweak("location", v)} />
          <TweakText label="Mood"     value={t.mood}     onChange={(v) => setTweak("mood", v)} />
        </TweakSection>
        <TweakSection title="Vibe">
          <TweakSelect
            label="Palette"
            value={t.palette}
            onChange={(v) => setTweak("palette", v)}
            options={[
              { value: "bubblegum", label: "Bubblegum 🍓" },
              { value: "blueberry", label: "Blueberry 💙" },
              { value: "matcha",    label: "Matcha 🍵" },
              { value: "butter",    label: "Butter 🧈" },
              { value: "lilac",     label: "Lilac 💜" },
            ]}
          />
          <TweakToggle label="Motion" value={t.motion} onChange={(v) => setTweak("motion", v)} />
          <TweakToggle label="Custom selfie" value={t.useUploadedSelfie} onChange={(v) => setTweak("useUploadedSelfie", v)} />
        </TweakSection>
      </TweaksPanel>
    </>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
