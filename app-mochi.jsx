/* global React, ReactDOM, useTweaks, TweaksPanel, TweakSection, TweakRadio, TweakColor, TweakToggle, TweakText */
const { useState, useEffect } = React;

// ---------------- Drawn mascot (CSS-only original character) ----------------
function DrawnMascot({ tint = "tint-sky", className = "" }) {
  return (
    <div className={`drawn ${tint} ${className}`}>
      <div className="ear-l"></div>
      <div className="ear-r"></div>
      <div className="face"></div>
      <div className="eye-l"></div>
      <div className="eye-r"></div>
      <div className="blush-l"></div>
      <div className="blush-r"></div>
      <div className="mouth"></div>
    </div>
  );
}

// ---------------- Friends data ----------------
const FRIENDS = [
  { id: "mochi",  name: "Mochi",  role: "The dreamer",  pin: "color-sky",   tint: "tint-sky",
    bio: "A cloud puppy with floppy ears who loves long naps and warm cinnamon buns.", emoji: "☁️" },
  { id: "pip",    name: "Pip",    role: "The sweetie",  pin: "color-pink",  tint: "tint-pink",
    bio: "A tiny bunny who collects strawberry stickers and writes letters to friends.", emoji: "🍓" },
  { id: "bao",    name: "Bao",    role: "The sleepy",   pin: "color-lemon", tint: "tint-lemon",
    bio: "A duckling who falls asleep mid-sentence. Best napping spot: a sunny windowsill.", emoji: "🌼" },
  { id: "luna",   name: "Luna",   role: "The dreamer",  pin: "color-lav",   tint: "tint-lav",
    bio: "A lavender kitten who studies the stars and bakes moon-shaped cookies.", emoji: "🌙" },
  { id: "sprout", name: "Sprout", role: "The brave",    pin: "color-mint",  tint: "tint-mint",
    bio: "A little frog who waters the garden and gives the best high-fives.", emoji: "🌱" },
];

// ---------------- Nav ----------------
function Nav({ name }) {
  return (
    <nav className="nav">
      <div className="nav-inner">
        <a href="#top" className="brand">
          <span className="brand-mark">☁️</span>
          {name}
        </a>
        <ul className="nav-links">
          <li><a href="#friends">Friends</a></li>
          <li><a href="#diary">Cloud Diary</a></li>
          <li><a href="#weather">Weather</a></li>
          <li><a href="#shop">Shop</a></li>
          <li><a href="#news">News</a></li>
        </ul>
        <a href="#mail" className="nav-cta">Join the club <span>♡</span></a>
      </div>
    </nav>
  );
}

// ---------------- Hero ----------------
function Hero({ name, useDrawn }) {
  return (
    <section className="hero" id="top">
      <div className="container">
        <div className="hero-eyebrow">
          <span className="dot"></span>
          A super soft little world
        </div>
        <h1>
          Hello, I'm <span className="swirl">{name}</span><br />
          welcome to my<br />
          fluffy day ♡
        </h1>
        <p className="lede">
          A cozy corner of the internet where a cloud-puppy and friends share
          tiny adventures, sleepy thoughts, and very good snacks.
        </p>
        <div className="hero-actions">
          <a href="#friends" className="btn btn-primary">Meet the friends →</a>
          <a href="#diary" className="btn btn-ghost">Read today's diary</a>
        </div>

        <div className="hero-stage">
          <span className="sparkle s1">✦</span>
          <span className="sparkle s2">♡</span>
          <span className="sparkle s3">✦</span>
          <span className="sparkle s4">✿</span>
          <span className="sparkle s5">✦</span>
          <span className="sparkle s6">♡</span>

          <div className="mascot-blob">
            {useDrawn ? (
              <DrawnMascot tint="tint-sky" />
            ) : (
              <image-slot
                id="hero-mascot"
                shape="circle"
                placeholder="Drop your mascot art here"
                class="mascot-slot"
              ></image-slot>
            )}
            <div className="shadow-pad"></div>
          </div>

          {FRIENDS.slice(1).map((f, i) => (
            <div key={f.id} className={`friend-orbit f${i + 1}`}>
              {useDrawn ? (
                <div className="friend-slot" style={{ borderRadius: "50%", overflow: "hidden" }}>
                  <DrawnMascot tint={f.tint} />
                </div>
              ) : (
                <image-slot
                  id={`hero-${f.id}`}
                  shape="circle"
                  placeholder={f.name}
                  class="friend-slot"
                ></image-slot>
              )}
              <span className="label">{f.name} {f.emoji}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ---------------- Friends section ----------------
function FriendsSection({ useDrawn }) {
  return (
    <section className="section" id="friends">
      <div className="container">
        <div className="section-head">
          <span className="section-eyebrow">The whole gang</span>
          <h2>Meet the friends <span className="heart">♡</span></h2>
          <p className="section-sub">
            Five tiny pals, infinite tiny adventures. Hover for a hello.
          </p>
        </div>
        <div className="friends-grid">
          {FRIENDS.map(f => (
            <div className="friend-card" key={f.id}>
              <span className={`pin ${f.pin}`}>{f.emoji}</span>
              <div className="friend-portrait">
                {useDrawn ? (
                  <DrawnMascot tint={f.tint} />
                ) : (
                  <image-slot
                    id={`portrait-${f.id}`}
                    shape="circle"
                    placeholder={f.name}
                  ></image-slot>
                )}
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
function Diary({ name, useDrawn }) {
  return (
    <section className="section" id="diary" style={{ paddingTop: 40 }}>
      <div className="container">
        <div className="section-head">
          <span className="section-eyebrow">Today's entry</span>
          <h2>Cloud Diary</h2>
          <p className="section-sub">
            A little note from {name} every morning, with extra sparkles.
          </p>
        </div>
        <div className="diary-wrap">
          <div className="diary-card">
            <div className="diary-tape"></div>
            <div className="diary-date">★ Sunday, may the 10th</div>
            <h3>woke up to a marshmallow sky</h3>
            <p>
              Today the clouds looked like little dumplings and Pip brought
              over fresh strawberries from the garden. We made tiny sandwiches
              and watched Bao snooze on the windowsill (he snores, but only a
              little). Sprout taught us how to whistle through a blade of
              grass — mine sounded like a teakettle. Luna says the moon will
              be extra round tonight, so we're packing pillows for a picnic.
            </p>
            <p>If you see a cloud that looks like a bun, wave at it for me ♡</p>
            <div className="diary-mood">Today's mood · soft & sleepy ☁️</div>
          </div>
          <div className="diary-photo">
            <div className="polaroid tilt-l">
              {useDrawn ? (
                <div style={{ width: 320, height: 320, borderRadius: 8, background: "linear-gradient(135deg, #ffe0c2 0%, #ffd1dc 100%)", display: "grid", placeItems: "center", position: "relative" }}>
                  <div style={{ width: "55%", height: "55%" }}>
                    <DrawnMascot tint="tint-sky" />
                  </div>
                  <span style={{ position: "absolute", top: 16, right: 16, fontSize: 24 }}>☁️</span>
                  <span style={{ position: "absolute", bottom: 24, left: 20, fontSize: 20 }}>✦</span>
                </div>
              ) : (
                <image-slot id="diary-photo" shape="rect" placeholder="Today's snapshot"></image-slot>
              )}
              <div className="caption">marshmallow sky ♡</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ---------------- Weather ----------------
const WEATHER = [
  { day: "Mon", icon: "🌤️", temp: "68°", mood: "drowsy" },
  { day: "Tue", icon: "☁️",  temp: "65°", mood: "fluffy" },
  { day: "Wed", icon: "🌧️", temp: "61°", mood: "cozy"   },
  { day: "Thu", icon: "🌈", temp: "70°", mood: "happy"  },
  { day: "Fri", icon: "☀️",  temp: "74°", mood: "sunny"  },
  { day: "Sat", icon: "⭐",  temp: "66°", mood: "starry" },
  { day: "Sun", icon: "☁️",  temp: "69°", mood: "soft"   },
];
function Weather() {
  return (
    <section className="section" id="weather" style={{ paddingTop: 30 }}>
      <div className="container">
        <div className="section-head">
          <span className="section-eyebrow">A week in the sky</span>
          <h2>Cloud weather</h2>
          <p className="section-sub">
            How fluffy is it outside? We check every morning.
          </p>
        </div>
        <div className="weather-row">
          {WEATHER.map((d, i) => (
            <div key={d.day} className={`weather-day ${i === 6 ? "today" : ""}`}>
              <div className="day">{d.day}</div>
              <span className="icon">{d.icon}</span>
              <div className="temp">{d.temp}</div>
              <div className="mood">{d.mood}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ---------------- Shop ----------------
const SHOP = [
  { id: "plush",  name: "Cloud Plush",        price: "$28",  tag: "new", tagLabel: "new",     tint: "tint-sky"   },
  { id: "tote",   name: "Strawberry Tote",    price: "$22",  tag: "hot", tagLabel: "favorite",tint: "tint-pink"  },
  { id: "mug",    name: "Sleepy Mug",         price: "$16",  tag: null,  tagLabel: "",        tint: "tint-lemon" },
  { id: "stick",  name: "Sticker Pack ×24",   price: "$8",   tag: "new", tagLabel: "new",     tint: "tint-lav"   },
];
function Shop({ useDrawn }) {
  return (
    <section className="section" id="shop">
      <div className="container">
        <div className="section-head">
          <span className="section-eyebrow">Tiny treasures</span>
          <h2>Cloud shop</h2>
          <p className="section-sub">
            Soft things to carry, cuddle, and sip from. Made in tiny batches.
          </p>
        </div>
        <div className="shop-grid">
          {SHOP.map(item => (
            <div key={item.id} className="shop-card">
              <div className="shop-img">
                {item.tag && <span className={`shop-tag ${item.tag}`}>{item.tagLabel}</span>}
                {useDrawn ? (
                  <div className={item.tint} style={{ width: "100%", height: "100%", display: "grid", placeItems: "center" }}>
                    <div style={{ width: "65%", height: "65%" }}>
                      <DrawnMascot tint="tint-sky" />
                    </div>
                  </div>
                ) : (
                  <image-slot id={`shop-${item.id}`} shape="rect" placeholder={item.name}></image-slot>
                )}
              </div>
              <div className="shop-info">
                <button className="heart-btn" aria-label="favorite">♡</button>
                <h4>{item.name}</h4>
                <div className="price">{item.price}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ---------------- News ----------------
const NEWS = [
  { id: "n1", big: true,  cat: "diary",   date: "May 8",  title: "We had a picnic in the clouds (and forgot the napkins)",
    excerpt: "Mochi, Pip, and Sprout packed every snack imaginable but somehow the most important thing — napkins — got left at home. Here's how the day went anyway.", tint: "tint-pink" },
  { id: "n2", big: false, cat: "events",  date: "May 6",  title: "Star-gazing night with Luna ★",
    excerpt: "Bring a blanket and your favorite mug. Cookies provided.", tint: "tint-lav" },
  { id: "n3", big: false, cat: "shop",    date: "May 3",  title: "New plush in the shop — meet Bao!",
    excerpt: "He's sleepy. He's squishy. He's now available in two sizes.", tint: "tint-lemon" },
];
function News({ useDrawn }) {
  return (
    <section className="section" id="news">
      <div className="container">
        <div className="section-head">
          <span className="section-eyebrow">Happenings</span>
          <h2>Latest from the clouds</h2>
          <p className="section-sub">
            Diary entries, shop drops, and very small adventures.
          </p>
        </div>
        <div className="news-grid">
          {NEWS.map(n => (
            <article key={n.id} className={`news-card ${n.big ? "big" : ""}`}>
              <div className="news-img">
                {useDrawn ? (
                  <div className={n.tint} style={{ width: "100%", height: "100%", display: "grid", placeItems: "center" }}>
                    <div style={{ width: "45%", height: "70%" }}>
                      <DrawnMascot tint="tint-sky" />
                    </div>
                  </div>
                ) : (
                  <image-slot id={`news-${n.id}`} shape="rect" placeholder={n.title}></image-slot>
                )}
              </div>
              <div className="news-body">
                <div className="news-meta">
                  <span className="pill">{n.cat}</span>
                  <span>{n.date}</span>
                </div>
                <h4>{n.title}</h4>
                <p>{n.excerpt}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
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
            <h3>Get cloud mail ♡</h3>
            <p>One sleepy newsletter a month. Doodles, recipes, and tiny news.</p>
            <form className="mail-form" onSubmit={submit}>
              <input
                type="email"
                placeholder="your@email.cloud"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <button type="submit">Subscribe →</button>
            </form>
            <div className={`mail-confirm ${sent ? "show" : ""}`}>
              ☁️ welcome to the club! a tiny letter is on its way.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ---------------- Footer ----------------
function Footer({ name }) {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <div className="brand">
              <span className="brand-mark">☁️</span>
              {name}
            </div>
            <p>A cozy corner of the internet, made with too much love and not enough naps.</p>
            <div className="socials">
              <a href="#" aria-label="instagram">📷</a>
              <a href="#" aria-label="tiktok">🎵</a>
              <a href="#" aria-label="youtube">▶</a>
              <a href="#" aria-label="email">✉</a>
            </div>
          </div>
          <div>
            <h5>Explore</h5>
            <ul>
              <li><a href="#friends">Friends</a></li>
              <li><a href="#diary">Cloud diary</a></li>
              <li><a href="#weather">Weather</a></li>
              <li><a href="#news">News</a></li>
            </ul>
          </div>
          <div>
            <h5>Shop</h5>
            <ul>
              <li><a href="#shop">Plushies</a></li>
              <li><a href="#shop">Stickers</a></li>
              <li><a href="#shop">Mugs</a></li>
              <li><a href="#shop">Gift sets</a></li>
            </ul>
          </div>
          <div>
            <h5>Hello</h5>
            <ul>
              <li><a href="#">About</a></li>
              <li><a href="#">Contact</a></li>
              <li><a href="#">Press kit</a></li>
              <li><a href="#">Pen pals</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© 2026 {name} & friends · made on a fluffy day</span>
          <span>brewed with ☁️ + ♡</span>
        </div>
      </div>
    </footer>
  );
}

// ---------------- Tweaks ----------------
const PALETTES = {
  sky:    { bg: "#eaf4ff", primary: "#a8d5ff", primaryDeep: "#6fb3e8", pink: "#ffd1dc", pinkDeep: "#ff9ec1" },
  pink:   { bg: "#ffeef3", primary: "#ffc8dc", primaryDeep: "#ff7fa6", pink: "#ffe0e0", pinkDeep: "#ff7a9e" },
  mint:   { bg: "#eaf7ef", primary: "#bfe7d0", primaryDeep: "#5fb98a", pink: "#ffd8c8", pinkDeep: "#ff9c83" },
  butter: { bg: "#fff8e6", primary: "#ffe9a8", primaryDeep: "#e6b94a", pink: "#ffd8c8", pinkDeep: "#ff9c83" },
  lilac:  { bg: "#f0eaff", primary: "#d9c8ff", primaryDeep: "#9d7ee0", pink: "#ffd1f0", pinkDeep: "#e87fc6" },
};

function applyPalette(key) {
  const p = PALETTES[key] || PALETTES.sky;
  const r = document.documentElement.style;
  r.setProperty("--bg", p.bg);
  r.setProperty("--primary", p.primary);
  r.setProperty("--primary-deep", p.primaryDeep);
  r.setProperty("--pink", p.pink);
  r.setProperty("--pink-deep", p.pinkDeep);
}

function App() {
  const [t, setTweak] = useTweaks({
    mascotName: "Mochi",
    palette: "sky",
    artStyle: "drawn",   // "drawn" | "slots"
    motion: true,
  });

  useEffect(() => { applyPalette(t.palette); }, [t.palette]);
  useEffect(() => {
    document.body.classList.toggle("no-motion", !t.motion);
  }, [t.motion]);

  const useDrawn = t.artStyle === "drawn";

  return (
    <>
      <div className="sky" aria-hidden="true">
        <div className="cloud c1"></div>
        <div className="cloud c2"></div>
        <div className="cloud c3"></div>
        <div className="cloud c4"></div>
      </div>

      <Nav name={t.mascotName} />
      <main>
        <Hero name={t.mascotName} useDrawn={useDrawn} />
        <FriendsSection useDrawn={useDrawn} />
        <Diary name={t.mascotName} useDrawn={useDrawn} />
        <Weather />
        <Shop useDrawn={useDrawn} />
        <News useDrawn={useDrawn} />
        <Mailbox />
      </main>
      <Footer name={t.mascotName} />

      <TweaksPanel title="Tweaks">
        <TweakSection title="Mascot">
          <TweakText
            label="Mascot name"
            value={t.mascotName}
            onChange={(v) => setTweak("mascotName", v)}
          />
        </TweakSection>
        <TweakSection title="Palette">
          <TweakSelect
            label="Theme"
            value={t.palette}
            onChange={(v) => setTweak("palette", v)}
            options={[
              { value: "sky",    label: "Sky blue ☁️" },
              { value: "pink",   label: "Strawberry 🍓" },
              { value: "mint",   label: "Mint leaf 🌿" },
              { value: "butter", label: "Butter ☀️" },
              { value: "lilac",  label: "Lilac 💜" },
            ]}
          />
        </TweakSection>
        <TweakSection title="Art">
          <TweakRadio
            label="Style"
            value={t.artStyle}
            onChange={(v) => setTweak("artStyle", v)}
            options={[
              { value: "drawn", label: "Drawn" },
              { value: "slots", label: "Drop art" },
            ]}
          />
          <TweakToggle
            label="Floating clouds"
            value={t.motion}
            onChange={(v) => setTweak("motion", v)}
          />
        </TweakSection>
      </TweaksPanel>
    </>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
