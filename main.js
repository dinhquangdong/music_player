const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const cd = $(".cd");
const heading = $("header h2");
const cdThumbnail = $(".cd-thumb");
const audio = $("#audio");
const player = $(".player");
const playBtn = $(".btn-toggle-play");
const prevBtn = $(".btn-prev");
const nextBtn = $(".btn-next");
const randomBtn = $(".btn-random");
const progress = $("#progress");

const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    songs: [
        {
            name: "Tinh vệ",
            singer: "JAPANDEE",
            path: "./assets/music/tinh_ve.mp3",
            image: "./assets/img/tinh_ve.jpg",
        },
        {
            name: "Nơi này có anh",
            singer: "Sơn Tùng M-TP",
            path: "./assets/music/noi_nay_co_anh.mp3",
            image: "./assets/img/noi_nay_co_anh.jpg",
        },
        {
            name: "Lạc trôi",
            singer: "Sơn Tùng M-TP",
            path: "./assets/music/lac_troi.mp3",
            image: "./assets/img/lac_troi.jpg",
        },
        {
            name: "Người lạ ơi",
            singer: "Superbrothers x Karik x Orange",
            path: "./assets/music/nguoi_la_oi.mp3",
            image: "./assets/img/nguoi_la_oi.jpg",
        },
        {
            name: "Tuý âm",
            singer: "Xesi x Masew x Nhatnguyen",
            path: "./assets/music/tuy_am.mp3",
            image: "./assets/img/tuy_am.jpg",
        },
        {
            name: "Tháng tư là lời nói dối của em",
            singer: "Hà Anh Tuấn",
            path: "./assets/music/thang_tu_la_loi_noi_doi_cua_em.mp3",
            image: "./assets/img/thang_tu_la_loi_noi_doi_cua_em.jpg",
        },
        {
            name: "Nàng thơ",
            singer: "Hoàng Dũng",
            path: "./assets/music/nang_tho.mp3",
            image: "./assets/img/nang_tho.jpg",
        },
        {
            name: "Bài Này Chill Phết",
            singer: "Đen ft. MIN",
            path: "./assets/music/bai_nay_chill_phet.mp3",
            image: "./assets/img/bai_nay_chill_phet.jpg",
        },
        {
            name: "Đôi lời",
            singer: "Hoàng Dũng",
            path: "./assets/music/doi_loi.mp3",
            image: "./assets/img/doi_loi.jpg",
        },
        {
            name: "Ai mang cô đơn đi",
            singer: "K-ICM FT. APJ",
            path: "./assets/music/ai_mang_co_don_di.mp3",
            image: "./assets/img/ai_mang_co_don_di.jpg",
        }
    ],

    render: function() {
        const htmls = this.songs.map(song => {
            return `
            <div class="song">
                <div class="thumb" 
                    style="background-image: url('${song.image}')">
                </div>
                <div class="body">
                    <h3 class="title">${song.name}</h3>
                    <p class="author">${song.singer}</p>
                </div>
                <div class="option">
                    <i class="fas fa-ellipsis-h"></i>
                </div>
            </div>
            `
        });

        $(".playlist").innerHTML = htmls.join("");
    },

    defineProperties: function() {
        Object.defineProperty(this, "currentSong", {
            get: function() {
                return this.songs[this.currentIndex];
            }
        });
    },

    handleEvents: function() {
        const _this = this;
        const cdWidth = cd.offsetWidth;

        // Xử lý CD quay/ dừng khi phát nhạc
        cdThumbnailAnimate = cdThumbnail.animate([
            {transform: 'rotate(360deg)'}
        ], {
            duration: 25000,
            iterations: Infinity
        });
        cdThumbnailAnimate.pause();

        // Xử lý phóng to, thu nhỏ CD
        document.onscroll = () => {
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            const newCdWidth = cdWidth - scrollTop;
            cd.style.width = newCdWidth > 0? newCdWidth + "px": 0;
            cd.style.opacity = newCdWidth / cdWidth;
        };

        // Xử lý khi click Play/ Pause
        playBtn.onclick = () => {
            if(_this.isPlaying){
                audio.pause();
            }
            else{
                audio.play();
            }
        };

        // Khi bài hát được play
        audio.onplay = () => {
            _this.isPlaying = true;
            player.classList.add("playing");
            cdThumbnailAnimate.play();
        };

        // Khi bài hát được pause
        audio.onpause = () => {
            _this.isPlaying = false;
            player.classList.remove("playing");
            cdThumbnailAnimate.pause();
        };

        // Khi tiến độ bài hát thay đổi, cập nhật thanh progress
        audio.ontimeupdate = () => {
            progress.value = audio.duration? parseInt(audio.currentTime / audio.duration * 100): 0;
        };

        // Khi tua thời gian của bài hát trên thanh progress
        progress.oninput = (e) => {
            const seekTime = (e.target.value / 100 * audio.duration);
            audio.currentTime = seekTime;
        };

        // Khi chuyển về bài hát trước
        prevBtn.onclick = () => {
            if(_this.isRandom)
                _this.randomSong();
            else
                _this.prevSong();
            audio.play();
        }

        // Khi chuyển sang bài hát tiếp theo
        nextBtn.onclick = () => {
            if(_this.isRandom)
                _this.randomSong();
            else
                _this.nextSong();
            audio.play();
        };

        // Khi bấm vào nút random
        randomBtn.onclick = (e) => {
            _this.isRandom = !_this.isRandom;
            randomBtn.classList.toggle("active", _this.isRandom);
        };

        // Khi kết thúc bài hát, thì tự động sang bài mới
        audio.onended = () => {
            setTimeout(() => {
                nextBtn.click();
            }, 2000);
        }
    },

    loadCurrentSong: function() {
        heading.innerText = this.currentSong.name;
        cdThumbnail.style.backgroundImage = `url("${this.currentSong.image}")`;
        audio.src = this.currentSong.path;
    },

    prevSong: function() {
        this.currentIndex -= 1;
        if(this.currentIndex < 0)
            this.currentIndex = this.songs.length - 1;
        this.loadCurrentSong();
    },

    nextSong: function() {
        this.currentIndex += 1;
        if(this.currentIndex >= this.songs.length)
            this.currentIndex = 0;
        this.loadCurrentSong();
    },

    randomSong: function() {
        let newIndex;
        do{
            newIndex = Math.floor(Math.random() * this.songs.length);
        }while(newIndex !== this.currentIndex)
        this.currentIndex = newIndex;
        this.loadCurrentSong();
    },
    
    start: function() {
        // Định nghĩa các thuộc tính cho Object
        this.defineProperties();

        // Lắng nghe/ xử lý các sự kiện
        this.handleEvents();

        // Tải thông tin bài hát đầu tiên vào UI khi chạy ứng dụng
        this.loadCurrentSong();

        // Render playlist
        this.render();
    }
};

app.start(); // Start the app
