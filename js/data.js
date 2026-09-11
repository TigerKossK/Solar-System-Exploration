/* ============================================================
   Solar System — canonical planet data (single source of truth)
   ------------------------------------------------------------
   Values follow NASA's planetary fact sheets. Physical constants
   (mass, radius, gravity, distance, periods, temperature) are stable;
   MOON COUNTS change as new moons are confirmed — the counts below are
   as of 2026 (NASA Science / IAU) and should be re-verified over time.

   Sources:
   - NASA Planetary Fact Sheet — https://nssdc.gsfc.nasa.gov/planetary/factsheet/
   - NASA Science, Solar System / Moons — https://science.nasa.gov/
   - Textures: Solar System Scope (CC BY 4.0), based on NASA/USGS imagery

   `viz` values (orbit radius, size, period) are ILLUSTRATIVE for the
   orbital diagram — the Solar System is NOT drawn to true scale.
   ============================================================ */

const SOLAR_SYSTEM = {
  meta: {
    scaleNote:
      "Orbit spacing and planet sizes in the map are illustrative, not to true scale — " +
      "real distances and sizes span far too many orders of magnitude for one screen.",
    source: "NASA Planetary Fact Sheet",
    sourceUrl: "https://nssdc.gsfc.nasa.gov/planetary/factsheet/",
    moonsAsOf: "2026",
    sources: [
      { name: "NASA Planetary Fact Sheet", url: "https://nssdc.gsfc.nasa.gov/planetary/factsheet/" },
      { name: "NASA Science — Solar System", url: "https://science.nasa.gov/solar-system/" },
      { name: "NASA Science — Moons", url: "https://science.nasa.gov/solar-system/moons/" },
    ],
  },

  planets: [
    {
      id: "mercury",
      name: "Mercury",
      type: "Terrestrial planet",
      order: 1,
      tagline: "The swift, sun-scorched world",
      description:
        "The smallest planet and the closest to the Sun, Mercury races around its orbit " +
        "while turning on its axis only slowly — so its day is far longer than its year.",
      color: "#a9a29b",
      viz: { orbit: 0.22, size: 12, period: 16 },
      texture: "assets/textures/mercury.jpg",
      facts: {
        mass: { value: "3.30 × 10²³", unit: "kg", vsEarth: "0.055× Earth" },
        radius: { value: "2,440", unit: "km", vsEarth: "0.38× Earth" },
        gravity: { value: "3.7", unit: "m/s²", vsEarth: "0.38 g" },
        distance: { au: "0.39", km: "57.9 million km" },
        orbital: { days: 88.0, human: "88 Earth days", context: "A year here is under three Earth months." },
        rotation: { hours: 1407.6, human: "58.6 Earth days", context: "One day lasts about two-thirds of its year." },
        temperature: { mean: "167", unit: "°C", range: "−173 to 427 °C" },
        moons: { count: 0, note: "No known moons.", notable: [] },
        density: { value: "5.43", unit: "g/cm³" },
        escapeVelocity: { value: "4.3", unit: "km/s" },
        orbitalVelocity: { value: "47.4", unit: "km/s" },
        axialTilt: { value: "0.03°", note: "Almost perfectly upright — virtually no seasons." },
      },
      atmosphere: {
        composition: "Almost none — a trace exosphere of hydrogen, helium, oxygen, sodium and potassium.",
        pressure: "< 10⁻¹⁴ bar",
        note: "Effectively a vacuum, blasted away by the Sun.",
      },
      rings: null,
      discovery: "Known since antiquity",
      magneticField: "Weak global field, about 1% the strength of Earth's.",
      features: ["Caloris Basin — a ~1,550 km impact basin ringed by mile-high mountains."],
      missions: [
        { name: "Mariner 10", years: "1974–75", note: "First flybys; mapped about 45% of the surface." },
        { name: "MESSENGER", years: "2011–15", note: "First orbiter; found polar ice and mapped composition." },
        { name: "BepiColombo", years: "2018–", note: "ESA/JAXA mission arriving to orbit Mercury." },
      ],
      composition: "Rocky world with a large iron core and almost no atmosphere.",
      funFacts: [
        "Mercury has ice in permanently shadowed polar craters, despite being the closest planet to the Sun.",
        "Its axial tilt is near zero — the smallest of any planet — so Mercury has virtually no seasons.",
        "Surface temperatures swing from about −180 °C at night to 430 °C in daylight.",
        "One solar day on Mercury (sunrise to sunrise) lasts about 176 Earth days — two Mercury years.",
        "Its oversized iron core makes up roughly 60% of the planet's mass.",
      ],
      imagery: { alt: "Mercury — a heavily cratered grey rocky planet." },
    },
    {
      id: "venus",
      name: "Venus",
      type: "Terrestrial planet",
      order: 2,
      tagline: "The veiled furnace world",
      description:
        "Similar to Earth in size, Venus is wrapped in a thick carbon-dioxide atmosphere that traps heat, " +
        "making it the hottest planet in the Solar System.",
      color: "#e0b768",
      viz: { orbit: 0.32, size: 15, period: 24 },
      texture: "assets/textures/venus.jpg",
      facts: {
        mass: { value: "4.87 × 10²⁴", unit: "kg", vsEarth: "0.815× Earth" },
        radius: { value: "6,052", unit: "km", vsEarth: "0.95× Earth" },
        gravity: { value: "8.87", unit: "m/s²", vsEarth: "0.90 g" },
        distance: { au: "0.72", km: "108.2 million km" },
        orbital: { days: 224.7, human: "224.7 Earth days", context: "Its year is shorter than its day." },
        rotation: { hours: 5832.5, human: "243 Earth days (retrograde)", context: "Venus spins backwards, and slowest of all planets." },
        temperature: { mean: "464", unit: "°C", range: "~464 °C, nearly uniform" },
        moons: { count: 0, note: "No known moons.", notable: [] },
        density: { value: "5.24", unit: "g/cm³" },
        escapeVelocity: { value: "10.4", unit: "km/s" },
        orbitalVelocity: { value: "35.0", unit: "km/s" },
        axialTilt: { value: "177.4°", note: "Tipped almost upside-down; it rotates retrograde." },
      },
      atmosphere: {
        composition: "96.5% carbon dioxide, 3.5% nitrogen, with clouds of sulphuric acid.",
        pressure: "≈ 92× Earth",
        note: "A crushing, runaway greenhouse — like being 900 m under the ocean.",
      },
      rings: null,
      discovery: "Known since antiquity",
      magneticField: "No global magnetic field.",
      features: [
        "Maxwell Montes — its highest mountains, about 11 km tall.",
        "Volcanoes and lava plains have resurfaced almost the entire planet.",
      ],
      missions: [
        { name: "Pioneer Venus", years: "1978–92", note: "First US orbiter; early radar mapping." },
        { name: "Magellan", years: "1990–94", note: "Radar-mapped 98% of the surface." },
        { name: "Akatsuki", years: "2015–", note: "JAXA orbiter studying the atmosphere and clouds." },
      ],
      composition: "Thick CO₂ atmosphere with sulphuric-acid clouds; a runaway greenhouse.",
      funFacts: [
        "A day on Venus (one spin) is longer than a Venusian year (one orbit around the Sun).",
        "Venus spins backwards — from its surface the Sun would rise in the west.",
        "Its surface pressure is about 92 times Earth's, enough to crush an unprotected craft.",
        "A runaway greenhouse keeps the surface near 465 °C — hotter than Mercury's.",
        "Bright sulphuric-acid clouds make Venus the most brilliant planet in our sky.",
      ],
      imagery: { alt: "Venus — a pale yellow planet shrouded in dense cloud." },
    },
    {
      id: "earth",
      name: "Earth",
      type: "Terrestrial planet",
      order: 3,
      tagline: "Our home world",
      description:
        "The only place known to host life, Earth sits in the Sun's habitable zone with liquid water, " +
        "a protective atmosphere, and a single large Moon.",
      color: "#4a9fd8",
      viz: { orbit: 0.43, size: 16, period: 32 },
      texture: "assets/textures/earth.jpg",
      facts: {
        mass: { value: "5.97 × 10²⁴", unit: "kg", vsEarth: "1× (reference)" },
        radius: { value: "6,371", unit: "km", vsEarth: "1× (reference)" },
        gravity: { value: "9.8", unit: "m/s²", vsEarth: "1 g (reference)" },
        distance: { au: "1.00", km: "149.6 million km" },
        orbital: { days: 365.2, human: "365.2 days", context: "This is the reference year for the whole system." },
        rotation: { hours: 23.9, human: "23.9 hours", context: "The reference day for every comparison here." },
        temperature: { mean: "15", unit: "°C", range: "−88 to 58 °C" },
        moons: { count: 1, note: "One moon — the Moon.", notable: ["The Moon"] },
        density: { value: "5.51", unit: "g/cm³" },
        escapeVelocity: { value: "11.2", unit: "km/s" },
        orbitalVelocity: { value: "29.8", unit: "km/s" },
        axialTilt: { value: "23.4°", note: "This tilt is what gives Earth its seasons." },
      },
      atmosphere: {
        composition: "78% nitrogen, 21% oxygen, 0.9% argon, ~0.04% carbon dioxide.",
        pressure: "1 bar (reference)",
        note: "The only known atmosphere rich in free oxygen — made by living things.",
      },
      rings: null,
      discovery: "The only known world with life",
      magneticField: "A strong dipole field that shields the surface from the solar wind.",
      features: ["The Mariana Trench (~11 km deep) and Mount Everest (~8.8 km tall) mark its extremes."],
      missions: [
        { name: "Apollo 11–17", years: "1969–72", note: "Carried twelve astronauts to the Moon." },
        { name: "International Space Station", years: "1998–", note: "A continuously crewed orbital laboratory." },
        { name: "Landsat", years: "1972–", note: "Half a century of continuous Earth observation." },
      ],
      composition: "Nitrogen–oxygen atmosphere, liquid-water oceans, active plate tectonics.",
      funFacts: [
        "Earth is the densest planet in the Solar System and the only one not named after a god.",
        "It is the only known world with liquid water on its surface — and with life.",
        "Its molten-iron core generates a magnetic field that shields us from the solar wind.",
        "The Moon drifts away from Earth by about 3.8 cm every year.",
        "Earth's oxygen-rich air is produced by photosynthetic life over billions of years.",
      ],
      imagery: { alt: "Earth — a blue planet with white clouds and green continents." },
    },
    {
      id: "mars",
      name: "Mars",
      type: "Terrestrial planet",
      order: 4,
      tagline: "The rusted frontier",
      description:
        "A cold desert world half the size of Earth, Mars carries dry riverbeds and the largest volcano " +
        "in the Solar System — evidence of a more active past.",
      color: "#d1603a",
      viz: { orbit: 0.53, size: 13, period: 42 },
      texture: "assets/textures/mars.jpg",
      facts: {
        mass: { value: "6.42 × 10²³", unit: "kg", vsEarth: "0.107× Earth" },
        radius: { value: "3,390", unit: "km", vsEarth: "0.53× Earth" },
        gravity: { value: "3.7", unit: "m/s²", vsEarth: "0.38 g" },
        distance: { au: "1.52", km: "228.0 million km" },
        orbital: { days: 687.0, human: "687 Earth days (1.88 years)", context: "One Martian year is nearly two Earth years." },
        rotation: { hours: 24.6, human: "24.6 hours", context: "A Martian day is remarkably close to Earth's." },
        temperature: { mean: "−65", unit: "°C", range: "−140 to 30 °C" },
        moons: { count: 2, note: "Two small moons: Phobos and Deimos.", notable: ["Phobos", "Deimos"] },
        density: { value: "3.93", unit: "g/cm³" },
        escapeVelocity: { value: "5.0", unit: "km/s" },
        orbitalVelocity: { value: "24.1", unit: "km/s" },
        axialTilt: { value: "25.2°", note: "Close to Earth's tilt, so Mars has similar seasons." },
      },
      atmosphere: {
        composition: "95% carbon dioxide, 2.7% nitrogen, 1.6% argon.",
        pressure: "≈ 0.6% of Earth's",
        note: "Far too thin to hold liquid water on the surface today.",
      },
      rings: null,
      discovery: "Known since antiquity",
      magneticField: "No global field today — only patchy magnetism frozen into the crust.",
      features: [
        "Olympus Mons — the tallest volcano in the Solar System, about 22 km high.",
        "Valles Marineris — a canyon system more than 4,000 km long.",
      ],
      missions: [
        { name: "Viking 1 & 2", years: "1976", note: "First spacecraft to land and operate on Mars." },
        { name: "Curiosity", years: "2012–", note: "Nuclear-powered rover studying Gale Crater." },
        { name: "Perseverance", years: "2021–", note: "Caching samples; flew the Ingenuity helicopter." },
      ],
      composition: "Thin CO₂ atmosphere; iron-oxide dust gives the surface its red colour.",
      funFacts: [
        "Olympus Mons on Mars is about three times the height of Mount Everest.",
        "Valles Marineris is so long it would stretch across the United States.",
        "Mars has seasons like Earth because its axis is tilted about 25°.",
        "Its two tiny moons, Phobos and Deimos, were discovered only in 1877.",
        "Phobos orbits so close that it will break apart or crash into Mars within ~50 million years.",
      ],
      imagery: { alt: "Mars — a rusty red-orange desert planet." },
    },
    {
      id: "jupiter",
      name: "Jupiter",
      type: "Gas giant",
      order: 5,
      tagline: "The giant of the system",
      description:
        "The largest planet by far, Jupiter is a ball of hydrogen and helium with a centuries-old storm — " +
        "the Great Red Spot — wider than Earth.",
      color: "#d8b48a",
      viz: { orbit: 0.67, size: 30, period: 60 },
      texture: "assets/textures/jupiter.jpg",
      facts: {
        mass: { value: "1.90 × 10²⁷", unit: "kg", vsEarth: "317.8× Earth" },
        radius: { value: "69,911", unit: "km", vsEarth: "11.0× Earth" },
        gravity: { value: "23.1", unit: "m/s²", vsEarth: "2.36 g" },
        distance: { au: "5.20", km: "778.5 million km" },
        orbital: { days: 4331, human: "11.9 Earth years", context: "Jupiter takes almost 12 years to circle the Sun once." },
        rotation: { hours: 9.9, human: "9.9 hours", context: "The fastest spin of any planet, despite its size." },
        temperature: { mean: "−110", unit: "°C", range: "cloud-top average" },
        moons: { count: 115, note: "115 confirmed moons, including the four large Galilean moons.", notable: ["Io", "Europa", "Ganymede", "Callisto"] },
        density: { value: "1.33", unit: "g/cm³" },
        escapeVelocity: { value: "59.5", unit: "km/s" },
        orbitalVelocity: { value: "13.1", unit: "km/s" },
        axialTilt: { value: "3.1°", note: "Nearly upright, so Jupiter has little seasonal change." },
      },
      atmosphere: {
        composition: "About 90% hydrogen and 10% helium, with traces of methane and ammonia.",
        note: "No solid surface — banded clouds deepen into liquid metallic hydrogen.",
      },
      rings: {
        has: true,
        description: "A faint dust system — a main ring, an inner halo, and two wide gossamer rings.",
      },
      discovery: "Known since antiquity",
      magneticField: "The strongest planetary magnetic field, with intense radiation belts.",
      features: ["The Great Red Spot — a storm wider than Earth that has raged for centuries."],
      missions: [
        { name: "Voyager 1 & 2", years: "1979", note: "Revealed the rings and volcanically active Io." },
        { name: "Galileo", years: "1995–2003", note: "First orbiter; dropped a probe into the atmosphere." },
        { name: "Juno", years: "2016–", note: "Mapping the interior, gravity and magnetic field." },
      ],
      composition: "Mostly hydrogen and helium; no solid surface. Faint ring system.",
      funFacts: [
        "Jupiter is more than twice the mass of all the other planets combined.",
        "It has no solid surface — just deepening layers of hydrogen and helium.",
        "The Great Red Spot is a storm wider than Earth that has been observed for over 300 years.",
        "Jupiter spins fastest of any planet — a day there lasts under 10 hours.",
        "Its largest moon, Ganymede, is bigger than the planet Mercury.",
      ],
      imagery: { alt: "Jupiter — a banded tan-and-cream gas giant with a red storm." },
    },
    {
      id: "saturn",
      name: "Saturn",
      type: "Gas giant",
      order: 6,
      tagline: "The ringed jewel",
      description:
        "Famous for its brilliant rings of ice and rock, Saturn is the second-largest planet and the least " +
        "dense — it would float in water if a bath were big enough.",
      color: "#e6ce96",
      ringed: true,
      viz: { orbit: 0.78, size: 26, period: 78 },
      texture: "assets/textures/saturn.jpg",
      facts: {
        mass: { value: "5.68 × 10²⁶", unit: "kg", vsEarth: "95.2× Earth" },
        radius: { value: "58,232", unit: "km", vsEarth: "9.1× Earth" },
        gravity: { value: "9.0", unit: "m/s²", vsEarth: "0.92 g" },
        distance: { au: "9.54", km: "1.43 billion km" },
        orbital: { days: 10747, human: "29.4 Earth years", context: "A single Saturnian year spans almost three Earth decades." },
        rotation: { hours: 10.7, human: "10.7 hours", context: "Short days, like the other giants." },
        temperature: { mean: "−140", unit: "°C", range: "cloud-top average" },
        moons: { count: 293, note: "293 confirmed moons — the most of any planet, including Titan.", notable: ["Titan", "Enceladus", "Rhea", "Iapetus", "Mimas"] },
        density: { value: "0.69", unit: "g/cm³" },
        escapeVelocity: { value: "35.5", unit: "km/s" },
        orbitalVelocity: { value: "9.7", unit: "km/s" },
        axialTilt: { value: "26.7°", note: "An Earth-like tilt that tips its rings toward and away from us." },
      },
      atmosphere: {
        composition: "About 96% hydrogen and 3% helium, with traces of methane and ammonia.",
        note: "Fierce equatorial winds reach roughly 1,800 km/h.",
      },
      rings: {
        has: true,
        description: "The brightest rings in the Solar System — mostly water ice, split by the Cassini Division.",
      },
      discovery: "Known since antiquity (rings first seen by Huygens, 1655)",
      magneticField: "A strong field, unusually well aligned with the planet's rotation axis.",
      features: [
        "The bright ring system, spanning about 280,000 km yet only tens of metres thick.",
        "A six-sided polar jet stream — Saturn's 'hexagon'.",
      ],
      missions: [
        { name: "Pioneer 11", years: "1979", note: "First spacecraft to fly past Saturn." },
        { name: "Voyager 1 & 2", years: "1980–81", note: "Detailed the rings and hazy Titan." },
        { name: "Cassini–Huygens", years: "2004–17", note: "Orbited Saturn; landed a probe on Titan." },
      ],
      composition: "Hydrogen and helium; spectacular rings of ice, dust and rock.",
      funFacts: [
        "Saturn is the least dense planet — it would float in water if you had a big enough bath.",
        "Its rings are made mostly of water ice and may be only 100–200 million years old.",
        "The moon Titan has a thick atmosphere and lakes of liquid methane.",
        "Enceladus shoots geysers of water ice into space from a hidden ocean.",
        "A persistent six-sided jet stream circles Saturn's north pole.",
      ],
      imagery: { alt: "Saturn — a pale gold gas giant encircled by bright rings." },
    },
    {
      id: "uranus",
      name: "Uranus",
      type: "Ice giant",
      order: 7,
      tagline: "The tilted ice giant",
      description:
        "An icy world of water, methane and ammonia, Uranus is tipped almost completely on its side, " +
        "so it appears to roll along its orbit.",
      color: "#a7d8de",
      viz: { orbit: 0.88, size: 21, period: 96 },
      texture: "assets/textures/uranus.jpg",
      facts: {
        mass: { value: "8.68 × 10²⁵", unit: "kg", vsEarth: "14.5× Earth" },
        radius: { value: "25,362", unit: "km", vsEarth: "4.0× Earth" },
        gravity: { value: "8.7", unit: "m/s²", vsEarth: "0.89 g" },
        distance: { au: "19.19", km: "2.87 billion km" },
        orbital: { days: 30589, human: "84 Earth years", context: "It has completed only a couple of orbits since its 1781 discovery." },
        rotation: { hours: 17.2, human: "17.2 hours (retrograde)", context: "Uranus spins on its side, tipped about 98°." },
        temperature: { mean: "−195", unit: "°C", range: "coldest planetary atmosphere" },
        moons: { count: 29, note: "29 confirmed moons, named after literary characters.", notable: ["Titania", "Oberon", "Umbriel", "Ariel", "Miranda"] },
        density: { value: "1.27", unit: "g/cm³" },
        escapeVelocity: { value: "21.3", unit: "km/s" },
        orbitalVelocity: { value: "6.8", unit: "km/s" },
        axialTilt: { value: "97.8°", note: "Tipped past 90° — Uranus rolls along its orbit on its side." },
      },
      atmosphere: {
        composition: "About 83% hydrogen, 15% helium and 2% methane.",
        note: "Methane absorbs red light, giving Uranus its pale cyan colour.",
      },
      rings: {
        has: true,
        description: "Thirteen narrow, dark rings of rocky and icy debris — faint and hard to see.",
      },
      discovery: "William Herschel, 1781 — the first planet found with a telescope",
      magneticField: "A lopsided field, tilted 59° from the axis and offset from the planet's centre.",
      features: ["Miranda — a moon of chasms and cliffs more than 10 km high."],
      missions: [
        { name: "Voyager 2", years: "1986", note: "The only spacecraft to visit — found 10 new moons." },
        { name: "James Webb Telescope", years: "2023–", note: "Imaged its rings and auroras from afar." },
      ],
      composition: "Water, methane and ammonia ices over a small rocky core; methane tints it blue-green.",
      funFacts: [
        "Uranus's extreme tilt gives each pole roughly 42 years of continuous sunlight, then 42 of darkness.",
        "It rotates almost on its side, as if rolling along its orbit.",
        "Uranus was the first planet discovered with a telescope, by William Herschel in 1781.",
        "Methane in its air absorbs red light, giving the planet its cyan colour.",
        "Its magnetic field is tilted 59° from its axis and offset from the planet's centre.",
      ],
      imagery: { alt: "Uranus — a smooth pale cyan ice giant." },
    },
    {
      id: "neptune",
      name: "Neptune",
      type: "Ice giant",
      order: 8,
      tagline: "The windswept deep",
      description:
        "The most distant planet, Neptune is a deep-blue ice giant with the fastest winds in the Solar System, " +
        "found by mathematics before it was ever seen.",
      color: "#3f66c9",
      viz: { orbit: 0.96, size: 20, period: 116 },
      texture: "assets/textures/neptune.jpg",
      facts: {
        mass: { value: "1.02 × 10²⁶", unit: "kg", vsEarth: "17.1× Earth" },
        radius: { value: "24,622", unit: "km", vsEarth: "3.9× Earth" },
        gravity: { value: "11.0", unit: "m/s²", vsEarth: "1.12 g" },
        distance: { au: "30.07", km: "4.50 billion km" },
        orbital: { days: 59800, human: "164.8 Earth years", context: "Neptune completed its first orbit since discovery only in 2011." },
        rotation: { hours: 16.1, human: "16.1 hours", context: "A short day for such a distant world." },
        temperature: { mean: "−200", unit: "°C", range: "cloud-top average" },
        moons: { count: 16, note: "16 confirmed moons, the largest being Triton.", notable: ["Triton", "Proteus", "Nereid"] },
        density: { value: "1.64", unit: "g/cm³" },
        escapeVelocity: { value: "23.5", unit: "km/s" },
        orbitalVelocity: { value: "5.4", unit: "km/s" },
        axialTilt: { value: "28.3°", note: "An Earth-like tilt, so Neptune has seasons — each lasting ~40 years." },
      },
      atmosphere: {
        composition: "About 80% hydrogen, 19% helium and 1.5% methane.",
        note: "Methane deepens its blue; winds top 2,000 km/h — the fastest of any planet.",
      },
      rings: {
        has: true,
        description: "Five faint rings of dark dust, named after astronomers such as Adams and Galle.",
      },
      discovery: "Johann Galle, 1846 — found within 1° of Le Verrier's mathematical prediction",
      magneticField: "A tilted, off-centre field, inclined about 47° from the rotation axis.",
      features: ["The Great Dark Spot — an Earth-sized storm seen by Voyager 2 in 1989."],
      missions: [
        { name: "Voyager 2", years: "1989", note: "The only visit — revealed the Great Dark Spot and Triton's geysers." },
        { name: "Hubble Telescope", years: "1994–", note: "Tracks the birth and death of its giant storms." },
      ],
      composition: "Water, methane and ammonia ices; methane gives its vivid blue colour.",
      funFacts: [
        "Neptune was predicted by mathematics from Uranus's orbit, then found within a degree.",
        "It has the fastest winds in the Solar System — over 2,000 km/h.",
        "Neptune radiates more heat than it receives from the distant Sun.",
        "Its moon Triton orbits backwards and has active nitrogen geysers.",
        "Neptune completed its first orbit since discovery only in 2011.",
      ],
      imagery: { alt: "Neptune — a deep blue ice giant streaked with white clouds." },
    },
  ],

  sun: {
    id: "sun",
    name: "The Sun",
    type: "G-type main-sequence star",
    tagline: "The star at the centre",
    description:
      "The Sun holds 99.86% of the Solar System's mass and anchors every orbit with its gravity. " +
      "It is a vast sphere of hydrogen and helium plasma, fusing hydrogen into helium in its core.",
    color: "#f5b942",
    texture: "assets/textures/sun.jpg",
    facts: {
      type: { value: "G-type star (yellow dwarf)" },
      diameter: { value: "1.39 million km", vsEarth: "≈ 109× Earth" },
      surface: { value: "≈ 5,500 °C" },
      core: { value: "≈ 15 million °C" },
      mass: { value: "1.989 × 10³⁰ kg", vsEarth: "≈ 333,000× Earth" },
      massShare: { value: "99.86% of the Solar System" },
      composition: { value: "≈ 91% hydrogen, 9% helium" },
      age: { value: "≈ 4.6 billion years" },
    },
    composition: "A sphere of hydrogen and helium plasma, fusing ~600 million tonnes of hydrogen every second.",
    features: [
      "Granulation — a shifting carpet of convection cells, each ~1,000 km across.",
      "Sunspots — cooler magnetic regions that follow an 11-year cycle.",
    ],
    funFacts: [
      "The Sun's core fuses about 600 million tonnes of hydrogen into helium every second.",
      "Sunlight takes about 8 minutes 20 seconds to reach Earth.",
      "The Sun holds 99.86% of all the mass in the Solar System.",
      "Its magnetic field flips roughly every 11 years, driving the solar cycle.",
      "Sunspots are cooler regions — about 4,000 °C against the 5,500 °C surface.",
    ],
    imagery: { alt: "The Sun — a churning yellow-white sphere of plasma." },
  },

  /* system-level content for the landing's Statistics + Missions sections */
  system: {
    stats: {
      planets: 8,
      dwarfPlanets: 5,
      moons: { count: 456, note: "known moons orbiting the eight planets", asOf: "2026" },
      ageBillionYears: 4.6,
      sunMassShare: "99.86%",
      voyager1: "Voyager 1 is over 25 billion km away — the most distant human-made object.",
      asteroidBelt: "Millions of asteroids orbit between Mars and Jupiter; Ceres is the largest.",
    },
    landmarkMissions: [
      { name: "Voyager 1", agency: "NASA", year: 1977, note: "First spacecraft to reach interstellar space (2012)." },
      { name: "Voyager 2", agency: "NASA", year: 1977, note: "The only craft to visit all four giant planets." },
      { name: "Galileo", agency: "NASA", year: 1989, note: "Orbited Jupiter for 8 years; found signs of Europa's ocean." },
      { name: "Cassini–Huygens", agency: "NASA / ESA / ASI", year: 1997, note: "Orbited Saturn; landed a probe on Titan." },
      { name: "New Horizons", agency: "NASA", year: 2006, note: "First flyby of Pluto (2015); now exploring the Kuiper Belt." },
      { name: "Juno", agency: "NASA", year: 2011, note: "Probing Jupiter's interior and magnetic field." },
      { name: "Perseverance", agency: "NASA", year: 2020, note: "Caching Mars samples; flew the first helicopter on another world." },
      { name: "Parker Solar Probe", agency: "NASA", year: 2018, note: "Flying through the Sun's outer atmosphere, faster than any craft." },
    ],
    textures: {
      credit: "Planet & Sun textures © Solar System Scope (CC BY 4.0), based on NASA/USGS imagery.",
      source: "https://www.solarsystemscope.com/textures/",
    },
  },
};

/* ---- helpers ------------------------------------------------ */
function getPlanet(id) {
  return SOLAR_SYSTEM.planets.find((p) => p.id === id) || null;
}
function getNeighbours(id) {
  const list = SOLAR_SYSTEM.planets;
  const i = list.findIndex((p) => p.id === id);
  if (i === -1) return { prev: null, next: null };
  return {
    prev: list[(i - 1 + list.length) % list.length],
    next: list[(i + 1) % list.length],
  };
}

/* expose for classic (non-module) browser scripts */
if (typeof window !== "undefined") {
  window.SOLAR_SYSTEM = SOLAR_SYSTEM;
  window.getPlanet = getPlanet;
  window.getNeighbours = getNeighbours;
}
/* dual-use: allow the static-page generator to require this file in Node */
if (typeof module !== "undefined" && module.exports) {
  module.exports = { SOLAR_SYSTEM: SOLAR_SYSTEM, getPlanet: getPlanet, getNeighbours: getNeighbours };
}
