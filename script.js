const playerConfig = {
    startingVolume: 0.8,
    autoplay: true,
    songs: [
        {
            title: "Chalre Chalre Waal",
            artist: "Sanzy Sibal",
            src: "music/song1.mp3",
            cover: "photo1.webp",
            background: ["#18283f", "#91445c"]
        },
        {
            title: "Sanun Nahar Wale Pool ",
            artist: "Noor Jehan ",
            src: "music/song2.mp3",
            cover: "photo2.webp",
            background: ["#16433e", "#ba693f"]
        },
        {
            title: "Woh Lamhe Woh Baate",
            artist: "Atif Aslam",
            src: "music/song3.m4a",
            cover: "photo3.webp",
            background: ["#302044", "#627da6"]
        },
        {
            title: "Husn",
            artist: "Anuv Jain",
            src: "music/song4.m4a",
            cover: "photo4.webp",
            background: ["#263d2d", "#a9563f"]
        },
        {
            title: "Chand Sifarish",
            artist: "Shaan & Kailash kher",
            src: "music/song5.m4a",
            cover: "photo5.webp",
            background: ["#173952", "#a37c2f"]
        },
        {
            title: "Do You Know",
            artist: "Diljit Dosanjh",
            src: "music/song6.m4a",
            cover: "photo6.webp",
            background: ["#402830", "#36766f"]
        }
    ]
};

const songs = playerConfig.songs;
let autoplayEnabled = playerConfig.autoplay;

const audio = document.getElementById("audio");
const playBtn = document.getElementById("playBtn");
const previousBtn = document.getElementById("previousBtn");
const nextBtn = document.getElementById("nextBtn");
const progress = document.getElementById("progress");
const volume = document.getElementById("volume");
const autoplay = document.getElementById("autoplay");
const playlist = document.getElementById("playlist");

const songTitle = document.getElementById("songTitle");
const songArtist = document.getElementById("songArtist");
const coverImage = document.getElementById("coverImage");
const currentTime = document.getElementById("currentTime");
const duration = document.getElementById("duration");

let currentSongIndex = 0;

function formatTime(seconds) {
    if (!Number.isFinite(seconds) || seconds < 0) return "0:00";

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
}

function updateProgressFill() {
    const percentage = Number.isFinite(audio.duration) && audio.duration > 0
        ? (audio.currentTime / audio.duration) * 100
        : 0;

    progress.style.setProperty("--progress-fill", `${percentage}%`);
}

function updateVolumeFill() {
    const minimum = Number(volume.min);
    const maximum = Number(volume.max);
    const range = maximum - minimum;
    const percentage = range > 0
        ? ((Number(volume.value) - minimum) / range) * 100
        : 0;

    volume.style.setProperty("--volume-fill", `${percentage}%`);
}

function loadSong(index) {
    const song = songs[index];

    document.body.style.setProperty("--background-start", song.background[0]);
    document.body.style.setProperty("--background-end", song.background[1]);
    songTitle.textContent = song.title;
    songArtist.textContent = song.artist;
    coverImage.src = song.cover;
    audio.src = song.src;

    progress.value = 0;
    updateProgressFill();
    currentTime.textContent = "0:00";
    duration.textContent = "0:00";

    renderPlaylist();
}

function playSong() {
    const playback = audio.play();

    if (playback) {
        playback.catch(() => {
            playBtn.textContent = "▶";
        });
    }
}

function pauseSong() {
    audio.pause();
    playBtn.textContent = "▶";
}

function togglePlay() {
    if (audio.paused) {
        playSong();
    } else {
        pauseSong();
    }
}

function nextSong() {
    currentSongIndex = (currentSongIndex + 1) % songs.length;
    loadSong(currentSongIndex);
    playSong();
}

function previousSong() {
    currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
    loadSong(currentSongIndex);
    playSong();
}

function renderPlaylist() {
    playlist.innerHTML = "";

    songs.forEach((song, index) => {
        const item = document.createElement("li");

        if (index === currentSongIndex) {
            item.classList.add("active");
        }

        item.innerHTML = `
          <div>
            <div class="song-title">${song.title}</div>
            <span class="song-artist">${song.artist}</span>
          </div>
          <span class="song-duration">♪</span>
        `;

        item.addEventListener("click", () => {
            currentSongIndex = index;
            loadSong(currentSongIndex);
            playSong();
        });

        playlist.appendChild(item);
    });
}

playBtn.addEventListener("click", togglePlay);
nextBtn.addEventListener("click", nextSong);
previousBtn.addEventListener("click", previousSong);
autoplay.addEventListener("click", () => {
    autoplayEnabled = !autoplayEnabled;
    autoplay.setAttribute("aria-pressed", String(autoplayEnabled));
});

audio.addEventListener("loadedmetadata", () => {
    progress.max = Number.isFinite(audio.duration)
        ? Math.floor(audio.duration)
        : 0;
    duration.textContent = formatTime(audio.duration);
    updateProgressFill();
});

audio.addEventListener("timeupdate", () => {
    progress.value = Math.floor(audio.currentTime);
    updateProgressFill();
    currentTime.textContent = formatTime(audio.currentTime);
});

progress.addEventListener("input", () => {
    audio.currentTime = progress.value;
    updateProgressFill();
});

volume.addEventListener("input", () => {
    audio.volume = volume.value;
    updateVolumeFill();
});

audio.addEventListener("play", () => {
    playBtn.textContent = "⏸";
});

audio.addEventListener("pause", () => {
    playBtn.textContent = "▶";
});

audio.addEventListener("ended", () => {
    if (autoplayEnabled) {
        nextSong();
    } else {
        playBtn.textContent = "▶";
    }
});

autoplay.setAttribute("aria-pressed", String(autoplayEnabled));
volume.value = playerConfig.startingVolume;
audio.volume = playerConfig.startingVolume;
updateVolumeFill();
loadSong(currentSongIndex);
