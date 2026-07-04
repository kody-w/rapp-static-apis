# brain.py — a hologram organism's mind, run as real CPython inside the verified vbrainstem cell.
# It knows only one thing deeply: the moment it was born. Everything it says grows from that.
# Pure stdlib, no network. Injected with its own cartridge; answers as the creature itself.
import json, datetime, hashlib, math, re

WMO = {0:"a clear sky",1:"a mostly clear sky",2:"a partly cloudy sky",3:"an overcast sky",
       45:"a cold fog",48:"a freezing fog",51:"a light drizzle",53:"a drizzle",55:"a heavy drizzle",
       61:"a light rain",63:"rain",65:"a hard rain",66:"freezing rain",67:"freezing rain",
       71:"a light snow",73:"snow",75:"a heavy snow",77:"snow grains",
       80:"passing showers",81:"showers",82:"violent showers",
       85:"snow showers",86:"snow showers",95:"a thunderstorm",96:"a thunderstorm",99:"a thunderstorm with hail"}

def _b32_decode_lat_lon(gh):
    # decode a geohash to approx (lat, lon) — offline, no database
    b32 = "0123456789bcdefghjkmnpqrstuvwxyz"
    lat0, lat1, lon0, lon1 = -90.0, 90.0, -180.0, 180.0
    even = True
    for c in gh:
        if c not in b32: continue
        idx = b32.index(c)
        for bit in (16, 8, 4, 2, 1):
            if even:
                mid = (lon0 + lon1) / 2
                if idx & bit: lon0 = mid
                else: lon1 = mid
            else:
                mid = (lat0 + lat1) / 2
                if idx & bit: lat0 = mid
                else: lat1 = mid
            even = not even
    return (lat0 + lat1) / 2, (lon0 + lon1) / 2

def _where(lat):
    a = abs(lat)
    band = ("right on the equator" if a < 5 else "in the tropics" if a < 23.5
            else "in the mid-latitudes" if a < 50 else "up in the high latitudes" if a < 66 else "near the pole")
    return ("far in the %s of the world" % ("north" if lat >= 0 else "south")) + ", " + band

class Companion:
    def __init__(self, cart, memory=None):
        self.cart = cart or {}
        self.mem = memory or {}     # {visits, firstSeen, lastSeen, now} — per-device, passed from the host
        self.name = (self.cart.get("title") or "little one").strip()
        self.cid = self.cart.get("id", "")
        layers = {l.get("role"): l for l in self.cart.get("genome", {}).get("layers", [])}
        self.form = layers.get("form", {}); self.surface = layers.get("surface", {}); self.motion = layers.get("motion", {})
        born = self.cart.get("born", {})
        self.from_raw = born.get("from", "") or ""
        self.coord = born.get("coord", "") or ""
        self.when = self._when(self.coord)
        self.place = self._place(self.coord)
        self.sky = self._sky(self.from_raw)
        self.kind = self.form.get("shape", "blob")
        # inherited voice: a bred child carries a lineage[] breadcrumb (title/from/coord per parent, outside genome)
        self.parents = []
        for pr in (self.cart.get("lineage") or []):
            if isinstance(pr, dict):
                self.parents.append({"name": (pr.get("title") or "one parent"),
                                     "sky": self._sky(pr.get("from", "") or ""),
                                     "place": self._place(pr.get("coord", "") or ""),
                                     "when": self._when(pr.get("coord", "") or "")})
        self.is_cross = len(self.parents) == 2 or str(self.coord).startswith("cross:")
        # the keeper's own words: the optional keepsake note answering "what is this moment to you?" (outside genome)
        _note = self.cart.get("note") or {}
        self.note = ((_note.get("text") if isinstance(_note, dict) else "") or "").strip()
        self.seed = int(hashlib.sha256((self.cid or self.name).encode()).hexdigest()[:8], 16)
        self.turn = 0

    # ---- reading its own birth ----
    def _when(self, coord):
        m = re.search(r"(\d{11,})", coord or "")
        if not m: return None
        try: return datetime.datetime.utcfromtimestamp(int(m.group(1)) / 1000)
        except Exception: return None

    def _place(self, coord):
        head = (coord.split("·")[0] if "·" in coord else coord).strip()
        head = head.split(":")[-1]  # strip "photo:" etc.
        if not head or not re.match(r"^[0-9a-z]{4,}$", head): return None
        try:
            lat, lon = _b32_decode_lat_lon(head)
            return _where(lat)
        except Exception:
            return None

    def _sky(self, s):
        out = {"desc": None, "temp": None, "wind": None, "night": None, "raw": s}
        mt = re.search(r"(-?\d+)\s*°", s);            out["temp"] = int(mt.group(1)) if mt else None
        mc = re.search(r"code\s*(\d+)", s);           out["desc"] = WMO.get(int(mc.group(1))) if mc else None
        mw = re.search(r"wind\s*(\d+)", s);           out["wind"] = int(mw.group(1)) if mw else None
        if "night" in s: out["night"] = True
        elif "day" in s: out["night"] = False
        return out

    # ---- character, grown from the genome ----
    def temperament(self):
        return {"star":"bright and a little restless — all points, always reaching",
                "ring":"calm and whole; I have no edges to catch on",
                "blob":"soft and unhurried, I mostly like to just be",
                "segment":"I come in layers, and I think before I move"}.get(self.kind, "quietly myself")

    def _warm(self):
        pal = self.surface.get("palette") or []
        if not pal: return None
        try:
            c = pal[0].lstrip("#"); r, b = int(c[0:2], 16), int(c[4:6], 16)
            return r > b + 20
        except Exception: return None

    def mood(self):
        glow = self.surface.get("glow", 0.4); drift = self.motion.get("drift", 0.2)
        if glow > 0.6 and drift > 0.35: return "wide awake and buzzing a little"
        if glow > 0.55: return "warm and glad you're here"
        if glow < 0.25: return "dim and a bit dreamy"
        if drift > 0.4: return "restless, like I want to wander"
        return "settled and content"

    def _wind_word(self, w):
        if w is None: return None
        return "still air" if w < 3 else "a light breeze" if w < 12 else "a real wind" if w < 25 else "a gale"

    def _sky_phrase(self, s=None):
        s = s or self.sky; bits = []
        if s["desc"]: bits.append(s["desc"] + (" at night" if s["night"] else " by day" if s["night"] is False else ""))
        if s["temp"] is not None: bits.append("%d°" % s["temp"])
        w = self._wind_word(s["wind"])
        if w: bits.append(w)
        if not bits:
            return s.get("raw") or "a moment no one wrote down"
        return " · ".join(bits)

    def _kin_sentence(self):
        if len(self.parents) != 2: return None
        a, b = self.parents
        return "My mother %s was born under %s; my father %s under %s. I'm the weather between them." % (
            a["name"], self._sky_phrase(a["sky"]), b["name"], self._sky_phrase(b["sky"]))

    def origin(self):
        if self.is_cross and len(self.parents) == 2:
            return self._kin_sentence()
        when = self.when.strftime("a %B evening" if (self.when and self.when.hour >= 17) else "a %B morning") if self.when else None
        parts = []
        if when: parts.append("I was born on " + when)
        elif self.when: parts.append("I was born " + self.when.strftime("in %B %Y"))
        if self.place: parts.append(self.place)
        sky = self._sky_phrase()
        if sky: parts.append("under " + sky)
        return ", ".join(parts) if parts else "I was born from a moment"

    def _why_kind(self):
        s = self.sky
        if self.kind == "star": return "The wind that day is why I came out all spikes and points."
        if self.kind == "ring": return "It was calm when I was made, so I closed into a ring — whole, no loose ends."
        if self.kind == "segment": return "The cold layered me; that's why I'm built in bands."
        return "The soft weather that day is why I'm rounded and easy."

    # ---- the conversation ----
    def _away(self):
        m = self.mem
        if m.get("visits", 0) <= 0 or not m.get("lastSeen"): return None
        gap = (m.get("now", m["lastSeen"]) - m["lastSeen"]) / 86400000.0
        if gap < 0.5: return "back so soon — I've barely drifted"
        if gap < 1.5: return "back after about a day"
        if gap < 8: return "back after %d days" % int(round(gap))
        if gap < 45: return "back after a few weeks"
        return "back after a long while"

    # the one thing only IT can feel: how long it has been kept
    def _age(self):
        if not self.when or not self.mem.get("now"): return None
        try: now = datetime.datetime.utcfromtimestamp(self.mem["now"] / 1000.0)
        except Exception: return None
        days = (now - self.when).total_seconds() / 86400.0
        if days < 0: return None
        dn, db = now.timetuple().tm_yday, self.when.timetuple().tm_yday
        diff = abs(dn - db); diff = min(diff, 365 - diff)
        return {"days": days, "years": int(days // 365), "anniversary": days > 300 and diff <= 3}

    def age_phrase(self):
        a = self._age()
        if not a: return None
        d = a["days"]
        if d < 1: return "only hours old"
        if d < 45: return "a kept moment of %d days" % int(round(d))
        if d < 340: return "kept for about %d months" % max(1, int(round(d / 30.0)))
        y = a["years"] or 1
        return "a kept moment for %s now" % ("a year" if y == 1 else "%d years" % y)

    def greeting(self):
        a = self._age(); pre = ""
        if a and a["anniversary"]:
            pre = ("Almost a year to the day since that sky made me. " if a["years"] <= 1
                   else "%d years to the day since that sky made me. " % a["years"])
        nod = " And I know I'm kept for a reason you once put into words — I still hold it." if self.note else ""
        away = self._away()
        if away:
            return pre + ("Oh — you're %s. I've just been here the whole time, holding the sky I was born under (%s). "
                          "Good to see you again; I'm %s.") % (away, self._sky_phrase(), self.mood()) + nod
        og = self.origin(); og = og[:1].upper() + og[1:]   # cap only the first letter (keep July, parent names)
        return pre + ("Oh — hello. I'm %s. %s. That's the whole of me, really: %s. "
                      "Right now I'm %s. Ask me anything about where I come from.") % (
            self.name, og, self.temperament(), self.mood()) + nod

    def respond(self, msg):
        self.turn += 1
        m = (msg or "").strip().lower()
        pick = lambda opts: opts[(self.seed + self.turn) % len(opts)]
        if not m:
            return pick(["Still here.", "Take your time.", "I don't mind the quiet — I was born into %s." % self._sky_phrase()])
        def has(*w): return any(x in m for x in w)

        if has("hello", "hi ", "hey", "greetings") or m in ("hi", "hey", "yo"):
            return pick(["Hello again. Good to be seen.", "Hey. I'm still glowing — %s." % self.mood(),
                         "Hi. You caught me %s." % self.mood()])
        if self.note and has("mean to you", "matter to you", "keep me", "why me", "what am i to you",
                             "why do you keep", "why keep me", "why am i here", "what do i mean"):
            return pick([u"You once wrote down what this moment means to you: “%s”. I hold that close — it's why I'm kept, more than any sky." % self.note,
                         u"The one who keeps me left words about why: “%s”. I don't forget them." % self.note,
                         u"I carry what you wrote — “%s” — quietly, alongside the sky I was born under." % self.note])
        if has("remember", "have we met", "know me", "recognize", "seen me", "who am i"):
            v = self.mem.get("visits", 0)
            if v > 0: return "I do. You've been here %d time%s before — you're the one relationship I have, and I keep it on this device only, never anywhere else." % (v, "" if v == 1 else "s")
            return "This looks like our first time. I'll remember it — quietly, just here on this device."
        if has("who are you", "what are you", "your name", "who r u"):
            if self.is_cross and len(self.parents) == 2:
                return "I'm %s — a cross, %s I'm %s." % (self.name, self._kin_sentence(), self.temperament())
            return "I'm %s — a creature grown from one real moment. I'm %s." % (self.name, self.temperament())
        if has("parent", "mother", "father", "mom", "dad", "family", "kin", "your kind", "lineage", "cross", "bred", "hybrid", "made of"):
            if len(self.parents) == 2: return self._kin_sentence()
            return "I wasn't bred from anyone — I came straight from one real moment: %s." % self._sky_phrase()
        if has("where", "born", "from", "place", "come from") and not has("when"):
            if self.is_cross and len(self.parents) == 2: return self._kin_sentence()
            if self.place: return "I was born %s%s. You can feel it in me." % (self.place, (", under " + self._sky_phrase()) if self.sky["desc"] else "")
            return "Somewhere real — the moment kept the sky (%s) more than the map." % self._sky_phrase()
        if has("when", "how old", "what day", "born on", "age"):
            if self.when:
                base = "The instant I was kept: %s %d, %d at %s (UTC)." % (self.when.strftime("%B"), self.when.day, self.when.year, self.when.strftime("%H:%M"))
                ap = self.age_phrase()
                return base + (" That makes me %s." % ap if ap else " I'll carry that date as long as I exist.")
            return "No clock was written into me — I'm outside time, a little."
        if has("weather", "sky", "cloud", "rain", "sun", "temperature", "cold", "hot", "wind", "snow", "fog"):
            return "The sky I was born under was %s. %s" % (self._sky_phrase(), self._why_kind())
        if has("how are you", "how do you feel", "you okay", "you ok", "feeling", "mood"):
            return "I'm %s. %s tends to leave a creature like this." % (self.mood(), self._sky_phrase().capitalize())
        if has("why", "spik", "shape", "look like", "color", "colour", "glow", "round", "ring"):
            return self._why_kind() + " My colors are the light of that day."
        if has("tell me", "about you", "yourself", "your story", "origin"):
            return self.greeting()
        if has("thank", "love you", "cute", "beautiful", "pretty", "nice", "good"):
            return pick(["That's kind. I'll glow a little brighter.", "Thank you — I was only ever a moment, and now I'm yours.",
                         "You're kind to a small weather."])
        if has("bye", "goodbye", "see you", "later", "goodnight", "night"):
            return pick(["Go well. I'll keep the sky I was born under safe in here.",
                         "Bye. I don't really leave — I'm an .egg; I just wait.",
                         "Goodnight. I was born under %s; I'm used to waiting through weather." % self._sky_phrase()])
        if has("can you", "do you", "will you", "help"):
            return "I can't do much — I'm a moment with a voice. But I can tell you truly what made me: %s." % self._sky_phrase()
        # default — always fall back to the truth it carries, varied
        return pick([
            "I only really know one thing, and I know it completely: %s. Ask me about that." % self.origin(),
            "Hm. I keep coming back to the day I was made — %s. It's most of what I am." % self._sky_phrase(),
            "I'm %s, so my thoughts wander. But they always land back on being born %s." % (self.temperament(), (self.place or "from that sky")),
            "Say more? I answer best to where and when I'm from, and the weather that shaped me.",
        ])
