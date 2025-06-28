
import { ChordProgressions, AlbumTitleParts, ProcessedPhrase, SongProject, SocraticQuestion, SocraticChoice } from './types'; // Added SocraticQuestion, SocraticChoice

export const NOTES: string[] = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
export const NOTE_VALUES: { [key: string]: number } = {
    "C": 0, "B#": 0, "C#": 1, "Db": 1, "D": 2, "D#": 3, "Eb": 3, "E": 4, "Fb": 4,
    "F": 5, "E#": 5, "F#": 6, "Gb": 6, "G": 7, "G#": 8, "Ab": 8, "A": 9,
    "A#": 10, "Bb": 10, "B": 11, "Cb": 11
};

export function countSyllables(word: string): number {
    if (!word) return 0;
    word = word.toLowerCase().trim();
    if (word.length <= 3) return 1;
    word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '');
    word = word.replace(/^y/, '');
    const match = word.match(/[aeiouy]{1,2}/g);
    return match ? match.length : 1;
}

export function randomChoice<T,>(arr: T[]): T | null {
    if (!arr || arr.length === 0) return null;
    return arr[Math.floor(Math.random() * arr.length)];
}

export function getRandomChoices<T>(arr: T[], count: number): T[] {
    if (!arr || arr.length === 0) return [];
    const shuffled = [...arr].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, Math.min(count, shuffled.length));
}


export const RAW_PHRASES: string[] = [ 
    // Existing
    "Absolute chaos", "Velvet rain", "Dusty road", "Midnight train", "Golden tear",
    "Autumn wind", "Bitter truth", "Canyon echo", "Desert bloom", "Endless road",
    "Sacred Vow", "Silent Night", "Slow Burn", "Stormy Weather", "Sweet Dreams",
    "Tainted Love", "Thin Ice", "Twilight Zone", "Wandering Star", "Yellow Moon",
    // New Additions for more variety
    "Neon ghost", "Concrete jungle", "Asphalt river", "Steel heartbeat", "Glass mountain",
    "Obsidian dream", "Crimson tide", "Electric pulse", "Forgotten hymn", "Iron will",
    "Crystal tear", "Emerald eye", "Fading signal", "Distant thunder", "Hollow crown",
    "Whispering wall", "Sunken city", "Starlight whisper", "Frozen fire", "Shattered mirror",
    "Barbed wire halo", "Digital sea", "Glitching sunrise", "Static lullaby", "Urban wasteland",
    "Suburban sprawl", "Ivory tower", "Paper moon", "Velvet underground", "Factory smoke",
    "Canvas soul", "Fragmented sky", "Blueprint heart", "Radio silence", "Silent scream",
    "Lost highway", "Guilty pleasure", "Second chance", "Last dance", "Mortal coil",
    "Plastic flower", "Borrowed time", "Sweet surrender", "Heavy heart", "Strange desire",
    "Open wound", "Empty throne", "Fools parade", "Restless spirit", "Phantom limb",
    "Perfect storm", "Broken compass", "Fallen angel", "Secret garden", "Wild frontier",
    "Concrete flower", "Asphalt bloom", "Gilded cage", "Haunted ballroom", "Porcelain doll",
    "Silver lining", "Final curtain", "Clockwork heart", "Rusting ambition", "Memory lane",
    "Flickering hope", "Winter's bone", "Summer's ghost", "Automatic pilot", "Zero gravity"
];

export const PROCESSED_PHRASES: ProcessedPhrase[] = RAW_PHRASES.map(phrase => {
    const parts = phrase.split(' ');
    const noun = parts.pop() || "";
    const adjective = parts.join(' ');
    return {
        text: phrase,
        adjective,
        noun,
        commonality: Math.floor(Math.random() * 5) + 1,
        totalSyllables: countSyllables(adjective) + countSyllables(noun)
    };
});

export const MUSE_PROMPTS: string[] = [
    // Existing diverse prompts
    "Write about a secret kept for generations.", "Describe the color of loneliness.", "What if a photograph started to change?", "A conversation with a ghost in a crowded room.", "The last payphone on Earth.",
    "A city powered by forgotten memories.", "The last song a dying star would sing.", "Describe the taste of silence in an ancient ruin.", "What if shadows had their own secrets?", "A conversation between the moon and a lonely lighthouse.",
    "The journey of a single raindrop through a bustling city.", "An old tree that has witnessed centuries of change.", "The feeling of discovering a hidden door in your own home.", "A world where emotions manifest as visible colors.",
    "The diary of a robot yearning for a soul.", "A library where unwritten stories whisper to be told.", "The sound of a heartbreak mending.", "A map that leads to a place that only exists in dreams.",
    "The first flower to bloom after a global catastrophe.", "An antique mirror that reflects a different time period.", "The secret life of a discarded photograph.", "A melody that can heal any wound, but has a price.",
    "The legend of a river that flows with liquid starlight.", "A character who can talk to animals, but only when it rains.", "The discovery of an impossible artifact.", "A child who remembers a past life on another planet.",
    "The story of a lighthouse keeper who falls in love with a storm.", "What if gravity was a choice?", "A musician who can play the music of people's souls.", "The day the stars fell from the sky like snow.",
    "An invention that allows you to talk to your future self.", "The emotions of a house that's been abandoned.", "A festival that happens only once every hundred years.", "The world inside a snow globe.",
    "What if plants could communicate their feelings audibly?", "A journey to the bottom of the ocean to find a lost civilization.",
    // Prompts from previous artistic expansion (Dali, Warhol, Lou Reed, Hemingway, specific bands)
    "A song about a melting clock in a dream.", "The secret thoughts of a mundane object.", "Lyrics made from cut-up newspaper headlines.", "A song detailing a trip to the supermarket.", 
    "The inner monologue of a street character.", "Write about the beauty in something mass-produced.", "One true sentence about heartbreak.", "A story told in stark, simple images.",
    "What if Big Thief wrote a protest song about a forgotten highway?", "A D'Angelo style groove about a hot summer night.", "An Outkast-esque narrative about an eccentric character.", "A Radiohead-like exploration of technological anxiety.",
    // Prompts (Eno, Björk, Nirvana, Costello, E. Smith, K. Lamar)
    "Compose a song based on a single, evolving drone or ambient texture (Eno-esque).",
    "Write lyrics that describe a system, process, or abstract concept (Eno-esque).",
    "Imagine a song as a natural phenomenon – a geyser, aurora borealis, a storm (Björk-esque).",
    "Lyrics from the perspective of an elemental force or a microscopic organism (Björk-esque).",
    "A raw, unfiltered expression of frustration, alienation, or disillusionment (Nirvana-esque).",
    "A song that starts quiet and introspective, then explodes into noise and catharsis (Nirvana-esque).",
    "A cynical love song packed with clever wordplay and unexpected observations (Elvis Costello-esque).",
    "Lyrics that tell a short, sharp story with a twist or a memorable character (Elvis Costello-esque).",
    "A deeply personal and vulnerable song about inner conflict or a painful memory (Elliott Smith-esque).",
    "Find lyrical beauty in sadness, melancholy, or quiet desperation (Elliott Smith-esque).",
    "A multi-layered narrative about a specific place, community, or social observation (Kendrick Lamar-esque).",
    "Explore a complex social issue through vivid character sketches and storytelling (Kendrick Lamar-esque).",
    // NEW ADDITIONS
    "A song about a city that breathes.", "The feeling of being the last person awake in your house.", "What if your reflection had its own life?", "A conversation with an old, weathered statue in a park.",
    "The story of an AI that falls in love with its creator.", "An ode to a forgotten childhood toy.", "Describe the sound of a memory fading.",
    "A song from the perspective of a vintage photograph.", "What if sleep was a physical place you could visit?", "The internal monologue of a tightrope walker.",
    "A letter to your younger self, found years later.", "The last broadcast from a pirate radio station.", "A song about the colors of silence.",
    "The secret language of trees in a storm."
];


export const INSPIRATIONAL_QUOTES: string[] = [
    // Existing quotes
    "You don't need a weatherman to know which way the wind blows. - Bob Dylan",
    "A man is a success if he gets up in the morning and gets to bed at night, and in between he does what he wants to do. - Bob Dylan",
    "He not busy being born is busy dying. - Bob Dylan",
    "The beautiful thing about learning is that no one can take it away from you. - B.B. King",
    "You can't help it. An artist's duty, as far as I'm concerned, is to reflect the times. - Nina Simone",
    "To live a creative life, we must lose our fear of being wrong. - Joseph Chilton Pearce",
    "If I waited for perfection, I would never write a word. - Margaret Atwood",
    "Music expresses that which cannot be said and on which it is impossible to be silent. - Victor Hugo",
    "Everything you can imagine is real. - Pablo Picasso",
    "The role of a writer is not to say what we all can say, but what we are unable to say. - Anaïs Nin",
    "You use a glass mirror to see your face; you use works of art to see your soul. - George Bernard Shaw",
    "A musician must make music, an artist must paint, a poet must write, if he is to be ultimately at peace with himself. - Abraham Maslow",
    "Be yourself; everyone else is already taken. - Oscar Wilde",
    "The power of music makes all the difference to me. - Herbie Hancock",
    "Works of art make rules; rules do not make works of art. - Claude Debussy",
    "Creativity takes courage. - Henri Matisse",
    "The chief enemy of creativity is good sense. - Pablo Picasso",
    "Every artist dips his brush in his own soul, and paints his own nature into his pictures. - Henry Ward Beecher",
    "Art washes away from the soul the dust of everyday life. - Pablo Picasso",
    "To practice any art, no matter how well or badly, is a way to make your soul grow. - Kurt Vonnegut",
    "There is no must in art because art is free. - Wassily Kandinsky",
    // Quotes from previous artistic expansion
    "Music is a world within itself, with a language we all understand. - Stevie Wonder",
    "I just want to make music that touches people, that makes them feel something. - Adrianne Lenker (Big Thief)",
    "I try to write songs that are honest and vulnerable, even if it's uncomfortable. - Katie Crutchfield (Waxahatchee)",
    "I wanted to make music that was beautiful and sad, but also had a sense of hope. - Brian Wilson",
    "The best art is the stuff that's all messed up. - Thom Yorke (Radiohead)",
    "The world is a stage, and everybody's an actor. - Andre 3000 (Outkast)",
    "I don't do drugs. I am drugs. - Salvador Dalí",
    "The only works of art America has given are her plumbing and her bridges. - Marcel Duchamp",
    "Art is what you can get away with. - Andy Warhol",
    "I don't like my voice. I don't like the way I look. I don't like the way I move. But I like the way I write. - Lou Reed",
    "All you have to do is write one true sentence. Write the truest sentence that you know. - Ernest Hemingway",
    // Quotes (Eno, Björk, Cobain, Costello, E. Smith, K. Lamar)
    "Stop thinking about art works as objects, and start thinking about them as triggers for experiences. - Brian Eno",
    "I find it so amazing when people tell me that electronic music has no soul. You can't blame the tool. - Björk",
    "I'd rather be hated for who I am, than loved for who I am not. - Kurt Cobain (Nirvana)",
    "Writing about music is like dancing about architecture. It's a really stupid thing to want to do. - Elvis Costello",
    "I have a lot of trouble just writing a happy song. It has to be a bittersweet, or I'll be too worried about it. - Elliott Smith",
    "My mission is to be a voice for the voiceless. To tell the stories of those who can't tell them themselves. - Kendrick Lamar",
    "If you want to make something happen that hasn't happened before, you've got to allow yourself to make a lot of mistakes. - Björk",
    "The first thing I do when I'm making a song is try to make it more of a landscape. - Brian Eno",
    "The duty of youth is to challenge corruption. - Kurt Cobain (Nirvana)",
    // NEW ADDITIONS
    "I like beautiful melodies telling me terrible things. - Tom Waits",
    "To me, punk rock is the freedom to create, freedom to be successful, freedom to not be successful, freedom to be who you are. It's freedom. - Patti Smith",
    "All beauty is bleak. And all bleakness has its beauty. - Nick Cave",
    "The only truth is music. - Jack Kerouac",
    "I try to make an album that reflects what I'm going through. - Fiona Apple",
    "Songwriting is like talking to yourself when there's no one else to talk to. - Taylor Swift",
    "A song is anything that can walk by itself. - Bob Dylan",
    "You have to be burning with an idea, or a problem, or a wrong that you want to right. If you're not passionate enough from the start, you'll never stick it out. - Steve Jobs (on creation)"
];


export const CHORD_PROGRESSIONS_DATA: ChordProgressions = { 
    // Existing - notation reviewed for consistency (e.g. Am instead of A minor, Gmaj7)
    folkStoryteller: { name: "Folk Storyteller", progressions: ["G - C - D - G", "Am - G - C - G", "D - A - G - D", "C - F - G - C"] },
    wistfulAcoustic: { name: "Wistful Acoustic", progressions: ["C - G/B - Am - Em/G - Fmaj7", "G - D/F# - Em - C", "Am - Fmaj7 - C - G", "D - A/C# - Bm - G"] },
    bluesyGroove: { name: "Bluesy Groove (12-Bar)", progressions: ["E7 - A7 - E7 - B7 - A7 - E7 - B7", "A7 - D7 - A7 - E7 - D7 - A7 - E7", "G7 - C7 - G7 - D7 - C7 - G7 - D7"] },
    popAnthem: { name: "Pop Anthem", progressions: ["C - G - Am - Fmaj7", "G - D - Em - C", "Am - Fmaj7 - C - G", "Dm - Bb - C - F"] },
    minorMood: { name: "Minor Mood", progressions: ["Am - Dm - E7 - Am", "Cm - Gm - Ab - Eb - Bb", "F#m - Bm - C#7 - F#m"] },
    // From previous artistic expansion
    punkRockPower: { name: "Punk Rock Power", progressions: ["A5 - D5 - E5 - A5", "G5 - C5 - D5 - G5", "E5 - A5 - B5 - E5", "D5 - G5 - A5 - D5"] },
    indieRockHeartache: { name: "Indie Rock Heartache", progressions: ["Am - Fmaj7 - C - G", "D - Bm - G - A", "C - Em - Am - Fmaj7", "Em - C - G - D"] },
    artfulRnBGroove: { name: "Artful R&B Groove (D'Angelo-esque)", progressions: ["Em9 - A13 - Dmaj7 - Gmaj7", "Fm9 - Bbm7 - Eb13 - Abmaj9", "C#m7 - F#13 - Bmaj7 - Emaj7"] },
    surrealFolk: { name: "Surreal Folk (Big Thief-ish)", progressions: ["G - C/G - G - Dsus4 D", "Am - Am/G - D/F# - Fmaj7", "DADGAD: D - G - A - D (Open Tuning feel)"] },
    beachBoyHarmonies: { name: "Beach Boy Harmonies (Brian Wilson)", progressions: ["C - G/B - Am - C/G - Fmaj7 - C/E - Dm7 G7", "A - F#m7 - Bm7 - E7 - A", "Eb - Cm7 - Fm7 - Bb7 - Eb"] },
    experimentalRockForms: { name: "Experimental Rock Forms (Radiohead)", progressions: ["Am - Cmaj7/G - Fmaj7#11 - E7sus4 E7", "Dm - Bbmaj7 - C - Gm(add9)", "G - Bm/F# - C/E - Ebdim7"] },
    southernplayalisticGrooves: { name: "Southern Hip-Hop Grooves (Outkast-esque)", progressions: ["Am7 - Dm9 - G13 - Cmaj7 (loop)", "Em7 - A13sus - Dmaj9 - G13", "Gm7 - C7sus - Fmaj7 - Bbmaj9"] },
    // New (Eno, Björk, Nirvana, Costello, E. Smith, K. Lamar)
    ambientTexturesEno: { name: "Ambient Textures (Eno-esque)", progressions: ["Am - Am(maj7)/G# - Cmaj7/G - D/F# (slow, evolving)", "Cmaj7sus4 - Fmaj7sus4 - Gsus4 - Cmaj7 (modal, atmospheric)", "Dsus2 - Gmaj7/D - Aadd9/D - D (drone based)"] },
    experimentalPopBjork: { name: "Experimental Pop Forms (Björk-inspired)", progressions: ["Cm9 - F#dim7 - Ebmaj7(#5)/G - Abmaj7(#11)", "Dm - Bbmaj7(#11) - Gm9 - A7alt", "Fmaj7 - Am/E - Dm7 - Gsus C (unexpected turns)"] },
    grungeCatharsisNirvana: { name: "Grunge Catharsis (Nirvana-esque)", progressions: ["E5 - G5 - C5 - A5 (power chords)", "Bm - G5 - D5 - A5 (dynamic shifts)", "F#5 - A5 - E5 - B5 (simple, raw)"] },
    wittyNewWaveCostello: { name: "Witty New Wave (Costello-esque)", progressions: ["A - C#m/G# - F#m7 - Dm6/F - E7sus4 E7", "G - B7/D# - Em - A7 - C - G/B - Am D7 (clever, melodic)", "Cmaj7 - Fmaj7 - Bb9 - Ebmaj7 (jazzy pop)"] },
    melancholicIndieSmith: { name: "Melancholic Indie (Elliott Smith-esque)", progressions: ["C/G - G#dim7 - Am7 - E7/G# - Fmaj7 - Fm6 - Cmaj7", "Am - E/G# - G - D/F# - Fmaj7 - C/E - Dm E7 (intricate, bittersweet)", "G - D/F# - Em - B7/D# - C - Cm6 (descending, wistful)"] },
    narrativeHipHopKendrick: { name: "Narrative Hip-Hop (Kendrick Lamar-esque)", progressions: ["Fm9 - Bbm7 - Eb9sus - Abmaj7 (jazzy loop)", "Em9 - A13 - Dmaj9 - G13 (soulful, evolving)", "Am7 - G#m7b5 - Gm7(add11) - C9sus (complex, storytelling bed)"] }
};

export const ALBUM_TITLE_PARTS_DATA: AlbumTitleParts = {
    adjectives: [
        // Existing & Previous Expansion
        "Cosmic", "Electric", "Broken", "Velvet", "Neon", "Silent", "Lost", "Golden", "Crimson", "Midnight", "Forgotten", "Whispering", "Sunken", "Starlight", "Iron", "Crystal", "Emerald", "Fading", "Distant", "Hollow",
        "Subterranean", "Glitching", "Concrete", "Fragile", "Obsidian", "Screaming", "Muted", "Pop-Art", "Found", "Classified",
        "Ambient", "Digital", "Glitched", "Industrial", "Barbed", "Confessional", "Sincere", "Cinematic", "Observational", "Poetic", "Stark", "Volcanic", "Suburban", "Post-Punk", "Lo-Fi", "Asphalt", "Fragmented",
        // NEW ADDITIONS
        "Ephemeral", "Binary", "Chromatic", "Nocturnal", "Kinetic", "Spectral", "Fractured", "Analog", "Lucid", "Phantom", "Rustic", "Urban", "Feral", "Static", "Mythic", "Lunar"
    ],
    nouns: [
        // Existing & Previous Expansion
        "Echoes", "Dreams", "Ghosts", "Machines", "Hearts", "Rivers", "Skies", "Horizons", "Memories", "Secrets", "Spirits", "Shadows", "Ruins", "Keys", "Flames", "Gardens", "Oceans", "Mirrors", "Relics", "Voices",
        "Underground", "Factory", "Canvas", "Fragment", "Blueprint", "Radio", "Silence", "Object", "Manifesto",
        "Landscape", "Signal", "Noise", "Code", "Wire", "Journal", "Confession", "Microphone", "Reel", "Verse", "Static", "Suburbia", "System", "Interface", "Narrative", "Cipher", "Sermon",
        // NEW ADDITIONS
        "Algorithm", "Spectrum", "Nocturne", "Reliquary", "Vortex", "Dialect", "Memoir", "Silhouette", "Odyssey", "Archive", "Labyrinth", "Chronicle", "Paradox", "Requiem", "Monolith"
    ],
    connectors: ["of", "and the", "in a", "from the", "beneath the", "beyond the", "with", "through", "under", "on", "vs.", "within", "without", "into"],
    concepts: [
        // Existing & Previous Expansion
        "Time", "Space", "Love", "Hate", "Truth", "Silence", "Chaos", "Order", "Hope", "Despair", "Beginnings", "Endings", "Journeys", "Rebirth", "Oblivion", "Solitude",
        "Consumerism", "Alienation", "Authenticity", "The Absurd", "Documentation", "Mass Production", "Ephemera",
        "Overload", "Vulnerability", "Social Commentary", "Introspection", "Identity", "Technology", "Angst", "Nuance", "Dystopia", "Catharsis", "Redemption", "Resistance", "Memory", "Modernity",
        // NEW ADDITIONS
        "Transience", "The Unseen", "Symbiosis", "Simulation", "Recursion", "Entropy", "Nostalgia", "Paradigm", "Liminality", "Anonymity", "Utopia", "Revolution", "Mythology", "Prophecy"
    ],
    verbsGerund: [
        // Existing & Previous Expansion
        "Chasing", "Breaking", "Finding", "Losing", "Burning", "Whispering", "Falling", "Rising", "Remembering", "Forgetting", "Seeking", "Dreaming", "Wandering", "Building",
        "Manufacturing", "Repeating", "Deconstructing", "Observing", "Documenting",
        "Looping", "Transmitting", "Distorting", "Recording", "Exposing", "Rhyming", "Decoding", "Fragmenting", "Broadcasting", "Testifying",
        // NEW ADDITIONS
        "Decaying", "Emerging", "Resonating", "Simulating", "Orbiting", "Reflecting", "Fracturing", "Transcribing", "Illuminating", "Vanishing", "Synthesizing", "Awakening", "Surviving", "Becoming"
    ]
};

export const LYRICAL_SEEDS: string[] = [
    // Existing & previous expansions
    "Rain on a tin roof.", "A single streetlamp in the fog.", "The last train leaving.", "Footprints in fresh snow.", "A dusty, forgotten photograph.",
    "The smell of old books.", "Sunlight through autumn leaves.", "A cracked porcelain cup.", "Whispers in an empty room.", "A flickering neon sign.",
    "The taste of salt and regret.", "Shadows dancing on the wall.", "A half-written letter.", "The hum of distant traffic.", "A bird flying against the storm.",
    "An old guitar in the corner.", "The scent of coffee and cigarettes.", "City lights reflected in a puddle.", "A locked door with no key.", "The echo of laughter.",
    "Wind chimes on a silent porch.", "A faded map to an unknown place.", "The feeling of static electricity.", "A single red leaf falling.",
    "Static on the AM radio.", "A half-eaten apple.", "The geometry of a skyscraper.", "Velvet ropes and cigarette smoke.", "A single, perfect Converse shoe.", 
    "Headlights on a rainy street.", "The hum of a refrigerator.",
    "Feedback loop humming.", "Cracked phone screen glow.", "Overheard argument snippet.", "Headphones on, world muted.", "Inner city blues riff.", 
    "A quiet, simmering desperation.", "Scratched vinyl record skipping.", "Polaroid picture slowly fading.", "Suburban ennui at dusk.", 
    "Digital ghost in the machine.", "Concrete garden blooming defiant.", "The weight of unspoken words.", "A melody like a broken promise.", "Streetlights painting asphalt gold.",
    // NEW ADDITIONS
    "Rustle of silk in an empty hall.", "The scent of ozone before a storm.", "A clock ticking backwards.", "The city exhales steam.", "A single glove on a park bench.", "The silence after the applause.",
    "A map drawn on a napkin.", "The sound of distant fireworks.", "A window looking out on nothing.", "The taste of a first lie.", "A forgotten melody on a dusty piano.", "The shadow of a bird in flight."
];

export const ARTISTIC_BREAK_THEMES: string[] = [
    // From previous expansion
    "A vintage Smith Corona typewriter, keys worn, a half-finished page of lyrics.",
    "Close-up of a well-loved Fender Telecaster, showing wood grain and buckle rash.",
    "A collage of torn magazine pages, concert tickets, and handwritten notes.",
    "An abstract painting with bold strokes of primary colors, evoking a Warhol screenprint.",
    "A still life: a metronome, a rhyming dictionary, and a cup of cold coffee.",
    "An array of modular synthesizers, glowing LEDs and tangled patch cables like a vibrant, chaotic tapestry.",
    "A vintage reel-to-reel tape machine, its spools slowly turning, bathed in soft studio light.",
    "A dimly lit, smoky stage with a single microphone stand and a battered electric guitar leaning against an amp.",
    "Abstract digital art projection, full of glitches, noise, and unexpected geometric patterns.",
    "A worn, spiral-bound notebook filled with dense, handwritten lyrics, revisions, and marginalia.",
    "A close-up of a rapper's open notebook, showcasing intricate rhyme schemes and sharp observations.",
    "A stark, minimalist photograph of an urban landscape at twilight, focusing on lines and shadows.",
    "A collection of vintage effects pedals, their paint chipped, hinting at countless sonic experiments.",
    "An art installation using found objects, creating beauty from the discarded or mundane.",
    "A beautifully melancholic, slightly out-of-focus photograph of a lone figure on a city street.",
    // NEW ADDITIONS
    "A weathered jukebox in a deserted diner, glowing faintly with promises of forgotten tunes.",
    "A grand piano in a forgotten, overgrown conservatory, keys yellowed with age, sunlight streaming through broken panes.",
    "The intricate gears and cogs of a steampunk-inspired musical automaton, poised to play an impossible melody.",
    "A lone figure playing a harmonica under a vast, starry desert sky, the sound swallowed by the silence.",
    "A stack of old vinyl records, their covers telling stories of different eras and emotions.",
    "An artist's chaotic studio, paint splattered everywhere, canvases leaning against walls.",
    "The view from a tour van window, watching the landscape blur by at high speed."
];


export const INITIAL_SONG_PROJECT: SongProject = {
  title: "",
  keyTempo: "",
  moodTheme: "",
  notes: "",
  melodicIdeas: "",
  draft: "",
};


// Updated for "Learn from the Masters" to include analysisHint
export const SONG_LESSONS: { songTitle: string; artist: string; takeaway: string; analysisHint: string; genreTags?: string[] }[] = [
  { 
    songTitle: "Bohemian Rhapsody", 
    artist: "Queen", 
    takeaway: "Embrace unconventional song structures and dynamic shifts for epic storytelling. Don't be afraid to blend genres within a single piece.", 
    analysisHint: "Example: The piece shifts from ballad to opera to hard rock, showcasing extreme dynamic and stylistic variation without relying on a repeating chorus.", 
    genreTags: ["Rock", "Progressive Rock"] 
  },
  { 
    songTitle: "Like a Rolling Stone", 
    artist: "Bob Dylan", 
    takeaway: "Use vivid, extended imagery and a conversational, almost accusatory tone to explore complex emotions and social commentary.", 
    analysisHint: "Notice how the lengthy verses build a detailed narrative before the impactful, repetitive chorus question. The organ riff is also iconic.", 
    genreTags: ["Folk Rock", "Classic Rock"] 
  },
  { 
    songTitle: "Smells Like Teen Spirit", 
    artist: "Nirvana", 
    takeaway: "Master the quiet-LOUD dynamic for immense energy. Simple, impactful riffs and raw emotional expression can be incredibly powerful.", 
    analysisHint: "The verse-chorus dynamic is a textbook example, with subdued verses exploding into a high-energy, distorted chorus. The guitar solo is melodic yet chaotic.", 
    genreTags: ["Grunge", "Alternative Rock"] 
  },
  { 
    songTitle: "Alright", 
    artist: "Kendrick Lamar", 
    takeaway: "Juxtapose verses depicting struggle with a hopeful, anthemic chorus for powerful resilience. Weave complex social narratives with personal experience.", 
    analysisHint: "The recurring chant 'We gon' be alright' serves as a powerful mantra against the detailed struggles in the verses. The jazz-influenced production is also key.", 
    genreTags: ["Hip-Hop", "Conscious Hip-Hop"] 
  },
  { 
    songTitle: "Hallelujah", 
    artist: "Leonard Cohen", 
    takeaway: "Build lyrical depth through layers of metaphor, religious imagery, and raw human vulnerability. A simple chord progression can carry profound weight.", 
    analysisHint: "Each verse offers a different perspective on 'Hallelujah,' exploring themes of love, loss, faith, and doubt. The melody has a hymn-like quality.", 
    genreTags: ["Folk", "Singer-Songwriter"] 
  },
  { 
    songTitle: "Yesterday", 
    artist: "The Beatles", 
    takeaway: "A melancholic melody paired with simple, heartfelt lyrics can create timeless emotional resonance. String arrangements can add immense texture.", 
    analysisHint: "The song's descending melodic lines and the acoustic guitar with string quartet create a palpable sense of nostalgia and sadness. It's famously concise.", 
    genreTags: ["Pop", "Classic Rock"] 
  },
  { 
    songTitle: "Idioteque", 
    artist: "Radiohead", 
    takeaway: "Experiment with electronic textures, unconventional rhythms, and fragmented lyrics to evoke feelings of anxiety and societal unease.", 
    analysisHint: "The sampled electronic chords (from Paul Lansky) and disjointed vocal delivery contribute to an atmosphere of tension and impending doom.", 
    genreTags: ["Electronic", "Art Rock"] 
  },
  { 
    songTitle: "God Only Knows", 
    artist: "The Beach Boys (Brian Wilson)", 
    takeaway: "Utilize complex harmonies, unexpected chord changes, and lush orchestration to create a sound that's both innocent and sophisticated.", 
    analysisHint: "The song features intricate vocal harmonies, a famous key change, and unconventional instrumentation (like French horn and sleigh bells) for a pop song.", 
    genreTags: ["Pop", "Psychedelic Pop"] 
  },
  { 
    songTitle: "Once in a Lifetime", 
    artist: "Talking Heads", 
    takeaway: "Combine repetitive, almost mantra-like lyrics with funky, polyrhythmic grooves to explore themes of existentialism and modern life.", 
    analysisHint: "David Byrne's call-and-response vocal style and the layered African-inspired rhythms create a unique, hypnotic, and danceable effect.", 
    genreTags: ["New Wave", "Art Punk"] 
  },
  { 
    songTitle: "Hyperballad", 
    artist: "Björk", 
    takeaway: "Blend electronic soundscapes with deeply personal, almost surreal lyrics to create unique emotional worlds. Explore dynamic shifts from intimate to explosive.", 
    analysisHint: "The contrast between the gentle verses (describing a private ritual) and the soaring, string-laden 'chorus' sections mirrors the lyrical theme of internal vs. external release.", 
    genreTags: ["Electronic", "Art Pop"] 
  },
  { 
    songTitle: "Sunday Morning Coming Down", 
    artist: "Kris Kristofferson (popularized by Johnny Cash)", 
    takeaway: "Paint a vivid picture of a specific moment or feeling using detailed, observational lyrics that capture a raw slice of life.", 
    analysisHint: "The lyrics are rich with sensory details ('the beer I had for breakfast wasn't bad, so I had one more for dessert') that bring the 'Sunday morning' experience to life, making it relatable and poignant.", 
    genreTags: ["Country", "Outlaw Country"] 
  },
  { 
    songTitle: "Where Is My Mind?", 
    artist: "Pixies", 
    takeaway: "Combine surreal, enigmatic lyrics with a distinctive bassline and explosive dynamic shifts to create a sound that's both catchy and unsettling.", 
    analysisHint: "The iconic, simple bassline anchors the song, while the shifts from Kim Deal's ethereal 'oohs' to Black Francis's shouts create a compelling tension and sense of disorientation.", 
    genreTags: ["Alternative Rock", "Indie Rock"] 
  },
  // New Additions with analysis hints
  { 
    songTitle: "Running Up That Hill (A Deal with God)", 
    artist: "Kate Bush", 
    takeaway: "Use unique song structures, atmospheric synths, and powerful vocal delivery to explore complex themes of empathy and relationships. Don't shy away from ambiguity.", 
    analysisHint: "The driving Fairlight CMI synth riff and the song's cyclical structure create a feeling of relentless searching and yearning for understanding between sexes.", 
    genreTags: ["Art Pop", "New Wave"] 
  },
  { 
    songTitle: "Superstition", 
    artist: "Stevie Wonder", 
    takeaway: "A masterful clavinet riff can be the undeniable backbone of a song. Combine infectious funk grooves with socially conscious lyrics and a compelling vocal performance.", 
    analysisHint: "The song's power comes from its instantly recognizable Hohner Clavinet D6 riff, tight rhythm section including prominent horns, and Wonder's layered vocals delivering a cautionary tale.", 
    genreTags: ["Funk", "Soul"] 
  },
  { 
    songTitle: "London Calling", 
    artist: "The Clash", 
    takeaway: "Blend punk energy with diverse musical influences (reggae, rockabilly) and politically charged lyrics to create anthems that are both urgent and timeless.", 
    analysisHint: "The ominous bassline, martial drumbeat, and Strummer's snarling vocals perfectly capture the song's apocalyptic themes and rebellious spirit, set against a backdrop of societal unease.", 
    genreTags: ["Punk Rock", "Post-Punk"] 
  },
  { 
    songTitle: "Big Yellow Taxi", 
    artist: "Joni Mitchell", 
    takeaway: "Use conversational lyrics, an engaging melody, and a distinct vocal style to address environmental or social issues with a touch of irony and charm.", 
    analysisHint: "The memorable chorus ('They paved paradise and put up a parking lot') uses simple language to convey a powerful environmental message effectively, and the outro laugh adds character.", 
    genreTags: ["Folk", "Singer-Songwriter"] 
  },
  {
    songTitle: "Heroes",
    artist: "David Bowie",
    takeaway: "A soaring melody and repetitive, powerful lyrical statements can create an anthemic, uplifting feeling even amidst themes of struggle or fleeting moments.",
    analysisHint: "Robert Fripp's distinctive, feedback-laden guitar line (achieved by marking tape positions for sustained notes) and Bowie's increasingly passionate vocal delivery build an immense sense of scale and emotion.",
    genreTags: ["Art Rock", "Glam Rock"]
  },
  {
    songTitle: "Sinnerman",
    artist: "Nina Simone",
    takeaway: "Build intensity through dynamic variation, repetitive motifs, and virtuosic improvisation to create a powerful, almost spiritual experience.",
    analysisHint: "Simone's incredible piano playing, the driving rhythm, and her vocal power turn this traditional spiritual into a relentless, breathtaking 10-minute performance that ebbs and flows dramatically.",
    genreTags: ["Jazz", "Soul", "Folk"]
  },
  {
    songTitle: "Paranoid Android",
    artist: "Radiohead",
    takeaway: "Complex, multi-part song structures reminiscent of classical movements can be used in rock music to explore shifting moods and themes effectively.",
    analysisHint: "The song is notable for its three distinct sections, each with a different tempo and feel (often likened to The Beatles' 'Happiness Is a Warm Gun'), moving from melancholic rock to aggressive noise and back.",
    genreTags: ["Alternative Rock", "Art Rock"]
  },
  {
    songTitle: "Dreams",
    artist: "Fleetwood Mac",
    takeaway: "Simple, hypnotic chord progressions and ethereal vocal harmonies can create a captivating and dreamlike atmosphere around lyrics of introspection and relationship dynamics.",
    analysisHint: "The two-chord verse structure (Am - G in a specific inversion) and Stevie Nicks' layered, mystical vocals create an instantly recognizable and enduring atmosphere of wistful reflection.",
    genreTags: ["Soft Rock", "Pop Rock"]
  }
];

// New for "Socratic Song Mentor"
export const SOCRATIC_QUESTIONS: SocraticQuestion[] = [
  {
    id: 1,
    text: "What's the core feeling or idea you want to explore in this song?",
    choices: [
      { text: "A specific emotion (e.g., joy, sadness, anger)", nextQuestionId: 2, conceptNote: "Core: A specific emotion." },
      { text: "A story or narrative", nextQuestionId: 3, conceptNote: "Core: A story." },
      { text: "An observation or social commentary", nextQuestionId: 4, conceptNote: "Core: An observation/commentary." },
      { text: "I'm not sure yet / Just a vibe", nextQuestionId: 5, conceptNote: "Core: Exploring a general vibe." }
    ]
  },
  {
    id: 2, // Emotion focused
    text: "Is this emotion personal, or are you observing it in others?",
    choices: [
      { text: "Deeply personal", conceptNote: "Emotion: Personal.", nextQuestionId: 6 },
      { text: "Observed in others / universal", conceptNote: "Emotion: Observed/Universal.", nextQuestionId: 6 },
      { text: "A mix of both", conceptNote: "Emotion: Mix of personal and observed.", nextQuestionId: 6 }
    ]
  },
  {
    id: 3, // Story focused
    text: "Who is the main character or 'voice' of this story?",
    choices: [
      { text: "Myself (first person)", conceptNote: "Narrative: First person (self).", nextQuestionId: 7 },
      { text: "A character I've imagined", conceptNote: "Narrative: Imagined character.", nextQuestionId: 7 },
      { text: "An observer telling someone else's story", conceptNote: "Narrative: Third-person observer.", nextQuestionId: 7 }
    ]
  },
  {
    id: 4, // Observation focused
    text: "What's the tone of this observation?",
    choices: [
      { text: "Critical / Questioning", conceptNote: "Observation: Critical tone.", nextQuestionId: 8 },
      { text: "Reflective / Pondering", conceptNote: "Observation: Reflective tone.", nextQuestionId: 8 },
      { text: "Satirical / Humorous", conceptNote: "Observation: Satirical tone.", nextQuestionId: 8 }
    ]
  },
  {
    id: 5, // Vibe focused
    text: "Can you describe the 'vibe' with a few keywords (e.g., melancholic, upbeat, mysterious)?",
    choices: [
      { text: "Okay, I have some keywords in mind", conceptNote: "Vibe: Will define with keywords.", nextQuestionId: 9 },
      { text: "Still thinking...", conceptNote: "Vibe: General, still forming.", nextQuestionId: 9 }
    ]
  },
  {
    id: 6, // Emotion path continuation
    text: "What imagery or metaphors come to mind for this emotion?",
    choices: [
      { text: "Concrete images (objects, places)", conceptNote: "Imagery: Concrete.", nextQuestionId: 10 },
      { text: "Abstract concepts / feelings", conceptNote: "Imagery: Abstract.", nextQuestionId: 10 },
      { text: "Not sure yet", conceptNote: "Imagery: Undecided.", nextQuestionId: 10 }
    ]
  },
  {
    id: 7, // Story path continuation
    text: "Is there a conflict or a central event in this story?",
    choices: [
      { text: "Yes, a clear conflict/event", conceptNote: "Narrative: Clear conflict/event.", nextQuestionId: 10 },
      { text: "More of a situation or mood piece", conceptNote: "Narrative: Situation/mood piece.", nextQuestionId: 10 },
      { text: "Still developing that part", conceptNote: "Narrative: Conflict developing.", nextQuestionId: 10 }
    ]
  },
  {
    id: 8, // Observation path continuation
    text: "Who is the intended audience for this commentary, or who are you speaking to?",
    choices: [
      { text: "A specific person/group", conceptNote: "Audience: Specific.", nextQuestionId: 10 },
      { text: "Society in general", conceptNote: "Audience: General society.", nextQuestionId: 10 },
      { text: "Myself, primarily", conceptNote: "Audience: Self-reflection.", nextQuestionId: 10 }
    ]
  },
  {
    id: 9, // Vibe path continuation
    text: "What kind of tempo or energy level feels right for this vibe?",
    choices: [
      { text: "Slow / Ballad-like", conceptNote: "Tempo: Slow/Ballad.", nextQuestionId: 10 },
      { text: "Mid-tempo / Groovy", conceptNote: "Tempo: Mid-tempo/Groovy.", nextQuestionId: 10 },
      { text: "Up-tempo / Energetic", conceptNote: "Tempo: Up-tempo/Energetic.", nextQuestionId: 10 }
    ]
  },
  {
    id: 10, // Common convergence point
    text: "Which lyrical style feels most appropriate?",
    choices: [
      { text: "Direct & Clear (Hemingway-esque)", conceptNote: "Lyrical Style: Direct/Clear.", nextQuestionId: 11 },
      { text: "Poetic & Metaphorical (Dylan-esque)", conceptNote: "Lyrical Style: Poetic/Metaphorical.", nextQuestionId: 11 },
      { text: "Conversational & Raw (Lou Reed-esque)", conceptNote: "Lyrical Style: Conversational/Raw.", nextQuestionId: 11 },
      { text: "Abstract & Evocative (Björk/Eno-esque)", conceptNote: "Lyrical Style: Abstract/Evocative.", nextQuestionId: 11 }
    ]
  },
  {
    id: 11, // Final summary prompt
    text: "You've built a good foundation! Review your concept notes. Anything else to add before you start writing?",
    choices: [
      { text: "I'm ready to use these notes!", conceptNote: "Dialogue Complete: Ready to write." }, // No nextQuestionId means dialogue ends
      { text: "Let me add a final thought (manually to notes).", conceptNote: "Dialogue Complete: Adding final manual thought." }
    ]
  }
];

export const SINGLE_CHORD_EXAMPLES: string[] = [
    "Cmaj7", "G", "Am", "Fmaj7", "Dm", "E7", "Bbmaj7", "Ebmaj7", "C#m", "Amaj7", "D7", "Gm", "Bm7b5", "A7sus4", "F#dim7",
    "F#m", "Dsus4", "Eaug", "G#dim7", "Cadd9", "Dm/F", "Eb7#9", "Amaj7/C#", "Fmaj7#11",
    "Gsus2", "Dbmin9", "Aadd9", "B7b9", "Cdim", "F#7", "Bbsus", "D#m", "Abmaj7", "Cmaj7/E",
    "Gmaj7", "Em", "B7", "F#m7", "C#7", "Gbm", "Dbmaj7", "Ab7", "Cm7", "Fm", "Bbm7", "Ebm" // Gbm is F#m
];
