var Player = function (id, title, file, format) {
    this.id = id;
    this.title = title;
    this.file = file;
    this.howl = null;
    this.format = format;
    this.prevPos = 0;
    this.curPos = 0;

    this.width = parseInt($('.player-container').css('width'), 10);

    this.blockStep = false;

    $(this.id).find('h2').text(this.title);
};


Player.prototype = {

    setPrevPos: function (value) {
        self = this;
        self.prevPos = value;
    },
    getPrevPos: function (value) {
        self = this;
        return self.prevPos;
    },

    setCurPos: function (value) {
        self = this;
        self.curPos = value;
    },
    getCurPos: function (value) {
        self = this;
        return self.curPos;
    },

    setBlockStep: function (value) {
        self = this;
        self.blockStep = value;
    },

    play: function () {
        self = this;
        let sound;

        if (self.howl) {
            sound = self.howl;
        } else {
            sound = self.howl = new Howl({
                src: [self.file],
                format: [self.format],
                html5: true,
                onplay: function () {

                    requestAnimationFrame(self.step.bind(self));
                },
                onload: function () {
                    $(self.id).find('h3').text(self.formatTime(Math.round(sound.duration())));

                },
                onend: function () {
                    let sound = self.howl;
                    if (!sound.playing()) {
                        let playBtn = $(self.id).find('.play-btn');
                        $(playBtn).removeClass("fa-pause");
                        $(playBtn).addClass("fa-play");
                    }
                },
                onpause: function () {
                },
                onstop: function () {
                },
                onseek: function () {
                    requestAnimationFrame(self.step.bind(self));
                }
            });
        }

        sound.play();
    },
    pause: function () {
        var self = this;

        var sound = self.howl;

        sound.pause();

    },

    moveForward: function (value) {
        var self = this;
        let sound = self.howl;
        let seek = (sound.seek() || 0);
        let newBarPos = ((seek + value) / sound.duration() * self.width || 0);
        self.curPos = newBarPos;
        self.seek(newBarPos);
    },

    moveBackward: function (value) {
        var self = this;
        let sound = self.howl;
        let seek = (sound.seek() || 0);
        let newBarPos = ((seek - value) / sound.duration() * self.width || 0);
        self.curPos = newBarPos;
        self.seek(newBarPos);
    },

    volume: function (val) {
        var self = this;

    },

    seek: function (value) {
        var self = this;
        value = 100 * value / self.width;
        var sound = self.howl;
        if (sound.playing()) {
            sound.seek(sound.duration() * value / 100);
        }
    },

    step: function () {
        let self = this;
        if (!self.blockStep) {
            let seekAdjusted = false;
            let sound = self.howl;
            let seek = (sound.seek() || 0);
            if (typeof seek === 'object' && seek !== null) {
                seek = sound.duration() * (self.curPos / self.width);
                seekAdjusted = true;
            }
            $(self.id).find('h3').text(self.formatTime(Math.round(seek)));
            let progressWidth = (((seek / sound.duration()) * self.width) || 0);
            $(self.id).find('.player-progress_bar')[0].value = Math.round(progressWidth);

            if (sound.playing() || seekAdjusted) {
                requestAnimationFrame(self.step.bind(self));
            }
        }
    },

    formatTime: function (secs) {
        var minutes = Math.floor(secs / 60) || 0;
        var seconds = (secs - minutes * 60) || 0;

        return minutes + ':' + (seconds < 10 ? '0' : '') + seconds;
    }
};

function initPlayers(players) {
    for (let i = 0; i < players.length; ++i) {
        $(players[i].id).find('.play-btn').click(function () {
            if ($(this).hasClass("fa-play")) {
                players[i].play();
                $(this).removeClass("fa-play");
                $(this).addClass("fa-pause");
            } else {
                players[i].pause();
                $(this).removeClass("fa-pause");
                $(this).addClass("fa-play");
            }
        });
        $(players[i].id).find('.player-progress_bar').on('change', function () {
            let value = Number($(this).val());
            players[i].setCurPos(value);
            players[i].seek(value);
            players[i].setBlockStep(false);
        });
        $(players[i].id).find('.player-progress_bar').on('input', function () {
            let value = Number($(this).val());
            players[i].setBlockStep(true);
        });
        $(players[i].id).find('.player-progress_bar').mousedown(function () {
            let value = Number($(this).val());
            players[i].setPrevPos(value);
        });
        $('.player-column').click(function () {
            $(this).toggleClass("active");
        });
        $(players[i].id).find('.fa-step-forward').click(function () {
            players[i].moveForward(10);
        });
        $(players[i].id).find('.fa-step-backward').click(function () {
            players[i].moveBackward(10);
        });
    }
}