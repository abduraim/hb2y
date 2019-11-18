document.addEventListener("DOMContentLoaded", function(event) {



    const Steps = [
        {},
        {
            question: 'Итак, твое первое задание. Искать конверт нужно там, где ты готовишь отличнейшую лапшу, он рядом с вилкой и ножом.',
            answer: '258',
            hint: 'Конверт в ящике стола, на кухне',
            successMessage: 'Дашулька, спасибо за отличные и вкусных блюда, которые ты для нас готовишь! Твой подарок в столе, открой дверцы.',
            timeOver: 15,
            nextBtnText: 'К следующему подарку!',
        },
        {
            question: 'Следующий конверт находится там, где ты поддерживаешь жизнь тем, кого дарят твои клиенты любимым людям.',
            answer: '555',
            hint: 'Это цветы, которые ты выращиваешь',
            successMessage: 'Спасибо за красоту, которую ты приносишь в этот мир, подарок ищи в шкафу ванной комнаты.',
            timeOver: 30,
            nextBtnText: 'Класс! Дальше',
        },
        {
            question: 'Поторопись к следующему конверту, он находится у хорошего кучерявого человека, живущего по соседству. Твой пароль - "Хочу халву ем, хочу пряники"',
            answer: '333',
            hint: 'Это Ирина',
            successMessage: 'Спасибо за твое общение, за новости и идеи, которыми ты делишься! Подарок в шкафу (в общем коридоре)',
            timeOver: 15,
            nextBtnText: 'Еще!',
        },
        {
            question: 'Следующий конверт ты найдешь там, куда попадают твои носочки после стирки.',
            answer: '157',
            hint: 'После того, как они высохли',
            successMessage: 'Спасибо за чистоту и порядок, которые ты для нас поддерживаешь! Твой следующий подарок в антресоли!',
            timeOver: 15,
            nextBtnText: 'Ура. Дальше!',
        },
        {
            question: 'Итак, последнее задание. Ответ прячется в мешке набитом гусиными волосами.',
            answer: '369',
            hint: 'Это подушка',
            successMessage: 'Спасибо за любовь и ласку, которыми ты нас согреваешь! Твой подарок под матрасом.',
            timeOver: 15,
            nextBtnText: 'И-и-и...',
        },
    ];

    const Setup = {
        debug: false,
        secondsToDanger: 10,
        sounds: {
            dasha: '/assets/sounds/dasha.mp3',
            applause: '/assets/sounds/applause.mp3',
            fireworks: '/assets/sounds/fireworks.mp3',
            alarm: '/assets/sounds/alarm.mp3',
            tick: '/assets/sounds/tick.mp3',
        },
        welcomeMessage: [
            {
                message: 'Привет, Дашулька! Сегодня твой день рождения, а в день рождения принято получать подарки. Мой подарок - это игра, в которой тебе нужно будет найти подарки. Итак, возвращайся в комнату, а затем нажми Далее...',
                btnText: 'Далее',
            },
            {
                message: 'Добро пожаловать в приключение, Даша-путешественница! На твоём пути будут задания на поиск конвертов. В конвертах будет число, которое тебе нужно ввести. После этого ты узнаешь, где забрать подарок. Существуют подсказки - они появляются тогда, когда заканчивается время. Поехали?',
                btnText: 'Поехали!',
            },
        ],
    };

    let Sounds = {};



    // Preloader
    class Preloader {

        constructor() {

            this.imagesIsLoaded = false;
            this.soundsIsLoaded = false;

            this.preloadBackgroundImages();
            this.preloadSounds();

            document.addEventListener('assetIsLoaded', function (event) {

                if (event.source == 'images') {
                    this.imagesIsLoaded = true;
                }

                if (event.source == 'sounds') {
                    this.soundsIsLoaded = true;
                }

                if (this.imagesIsLoaded && this.soundsIsLoaded) {
                    document.dispatchEvent(new Event('allAssetsIsLoaded'));
                }

            });

        }

        preloadBackgroundImages() {

            this.preloadBackgroundImagesElementsArr = document.getElementsByClassName('preload-background');

            this.totalAmountOfImages = this.preloadBackgroundImagesElementsArr.length;
            this.currentAmountOfLoadedImages = 0;

            for (let i = 0; i < this.totalAmountOfImages; i++) {

                let element = this.preloadBackgroundImagesElementsArr[i];

                let style =
                    element.currentStyle || window.getComputedStyle(element, false),
                    url = style
                        .backgroundImage
                        .slice(4, -1)
                        .replace(/"/g, "");

                this.imagePreloader(url);

            }

        }

        imagePreloader(url) {
            let self = this;
            let img = new Image();
            img.src = url;
            img.onload = function () {
                self.imageIsLoaded();
            }
            if (img.complete) img.onload();
        }

        imageIsLoaded() {
            this.currentAmountOfLoadedImages++;
            if (this.currentAmountOfLoadedImages >= this.totalAmountOfImages) {
                let event = new Event('assetIsLoaded');
                event.source = 'images';
                document.dispatchEvent(event);
            }
        }

        preloadSounds() {

            let self = this;

            this.preloadSoundsArr = Setup.sounds;

            this.totalAmountOfSounds = Object.keys(Setup.sounds).length;
            this.currentAmountOfLoadedSounds = 0;

            let tempSounds = {};

            for (let name in Setup.sounds) {

                tempSounds[name] = new Audio(Setup.sounds[name]);

                tempSounds[name].addEventListener('canplaythrough', function () {
                    self.soundIsLoaded();
                });

            }

            Sounds = tempSounds;

        }

        soundIsLoaded() {
            this.currentAmountOfLoadedSounds ++;
            if (this.currentAmountOfLoadedSounds >= this.totalAmountOfSounds) {
                let event = new Event('assetIsLoaded');
                event.source = 'sounds';
                document.dispatchEvent(event);
            }
        }

    }

    // Main Component
    class Game {

        constructor() {

            new Preloader();

            // Screens
            this.loadingScreen = document.getElementById('loading');
            this.pyroScreen = document.getElementById('pyro');
            this.gameOverScreen = document.getElementById('game-over');


            // Components
            this.FullscreenComponent = new FullscreenComponent();
            this.WelcomeComponent = new Welcome();
            this.CommonTimerComponent = new CommonTimerComponent();
            this.QuestComponent = new QuestComponent();


            // Bind Events
            this.initEvents();

        }

        // Bing Events
        initEvents() {

            let self = this;

            setTimeout(function () {
                document.dispatchEvent(new Event('allAssetsIsLoaded'));
            }, 3000);

            // App is Loaded
            document.addEventListener('allAssetsIsLoaded', function () {
                self.hideLoading();
            });

            // Fullscreen Done
            document.addEventListener('fullscreenDone', function () {

                self.WelcomeComponent.show();

            });


            document.addEventListener('welcomeDone', function () {

                self.WelcomeComponent.hide();
                self.QuestComponent.show();
                self.CommonTimerComponent.start();

            });

            // Quest Done
            document.addEventListener('eventQuestSuccess', function () {

                self.CommonTimerComponent.stop();
                self.QuestComponent.hide();
                self.gameOverScreen.classList.add('show');
                console.log('Game Over!!!');
                console.log(self.CommonTimerComponent.getCommonTime());

            });

            // Pause Common Timer
            document.addEventListener('pauseTimer', function () {
                self.CommonTimerComponent.pause();
            });

            // Continue Common Timer
            document.addEventListener('continueTimer', function () {
                self.CommonTimerComponent.continue();
            });

        }

        //Loading
        hideLoading() {
            this.loadingScreen.classList.remove('show');
        }

    }

    // Fullscreen Class
    class FullscreenComponent {

        constructor() {
            this.container = document.getElementById('fullscreen');
            this.container.classList.add('show');
            this.btn = this.container.querySelector('button');
            this.fullscreenDone = new Event('fullscreenDone');
            let self = this;
            this.btn.addEventListener('click', function () {
                if (!Setup.debug) {
                    self.launchFullScreen(document.documentElement);
                }
                self.btn.classList.add('soft_hide');
                setTimeout(function () {
                    self.container.classList.remove('show');
                    document.dispatchEvent(self.fullscreenDone);
                }, 1000);
            })
        }

        launchFullScreen(element) {
            if(element.requestFullScreen) {
                element.requestFullScreen();
            } else if(element.mozRequestFullScreen) {
                element.mozRequestFullScreen();
            } else if(element.webkitRequestFullScreen) {
                element.webkitRequestFullScreen();
            }
        }

        cancelFullscreen() {
            if(document.cancelFullScreen) {
                document.cancelFullScreen();
            } else if(document.mozCancelFullScreen) {
                document.mozCancelFullScreen();
            } else if(document.webkitCancelFullScreen) {
                document.webkitCancelFullScreen();
            }
        }

    }

    // Welcome Messages
    class Welcome {

        constructor() {
            this.container = document.getElementById('welcome');
            this.appeartinBlock = this.container.querySelector('#welcome-text');
            this.text = this.container.querySelector('#welcome-text > p');
            this.nextBtn = this.container.querySelector('button#welcome-next-btn');
            this.eventDone = new Event('welcomeDone');
            this.musicDasha = new Player(Setup.sounds.dasha);
            this.init();
        }

        init() {

            this.currentMessage = 0;

            this.fillFields();

            let self = this;
            this.nextBtn.addEventListener('click', function () {
                if (self.currentMessage == 0) {
                    if (!Setup.debug) {
                        Sounds.dasha.play();
                    }
                }
                if (self.currentMessage == 1) {
                    Sounds.tick.volume = 0;
                    Sounds.tick.loop = true;
                    Sounds.tick.play();
                    Sounds.alarm.volume = 0;
                    Sounds.alarm.loop = true;
                    Sounds.alarm.play();
                }
                self.nextMessage();
            });

        }

        fillFields() {
            this.text.innerText = Setup.welcomeMessage[this.currentMessage].message;
            this.nextBtn.innerText = Setup.welcomeMessage[this.currentMessage].btnText;
        }

        nextMessage() {
            this.currentMessage++;
            if (this.currentMessage >= Setup.welcomeMessage.length) {
                this.musicDasha.stop();
                document.dispatchEvent(this.eventDone);
            } else {
                if (this.currentMessage == 1) {
                    if (!Setup.debug) {
                        this.musicDasha.play();
                    }
                }
                this.fillFields();
            }
        }

        show() {
            this.container.classList.add('show');
            this.appeartinBlock.classList.add('show');
            this.nextBtn.classList.add('show');
        }

        hide() {
            this.container.classList.remove('show');
        }

    }

    // CommonTime Class
    class CommonTimerComponent {

        constructor() {
            this.currentSeconds = 0;
            this.isPaused = false;
        }

        start() {
            let self = this;
            this.timer = setInterval(function () {
                if (!self.isPaused) {
                    self.currentSeconds ++;
                }
            }, 1000);
        }

        pause() {
            this.isPaused = true;
        }

        continue() {
            this.isPaused = false;
        }

        stop() {
            clearInterval(this.timer);
        }

        getCommonTime() {

            let minutes = Math.floor(this.currentSeconds / 60);
            let seconds = this.currentSeconds % 60;

            if (minutes < 10) {
                minutes = '0' + minutes;
            }

            if (seconds < 10) {
                seconds = '0' + seconds;
            }

            return minutes + ':' + seconds;;
        }

    }

    // QestStep Class
    class QuestComponent {

        constructor() {

            this.container = document.getElementById('quest');

            this.text = document.getElementById('text');
            this.input = document.getElementById('answer-input');

            this.successMessage = document.getElementById('success-message');
            this.successMessageText = this.successMessage.querySelector('p#text-success-message');
            this.nextQuestBtn = this.successMessage.querySelector('button#next-quest-btn');

            this.hintBtn = this.container.querySelector('button#hint-btn');

            this.succesEvent = new Event('eventQuestSuccess');
            this.pauseCommonTimer = new Event('pauseTimer');
            this.continueCommonTimer = new Event('continueTimer');
            this.stopTickSound = new Event('stopTickSound');
            this.stopAlarmSound = new Event('stopAlarmSound');

            this.soundApplause = new Player(Setup.sounds.applause);
            this.soundFireworks = new Player(Setup.sounds.fireworks);

            this.init();

        }

        init() {

            this.stepNumber = 1;

            this.fillFields();

            let self = this;

            this.input.setAttribute('maxlength', this.answer.length);

            this.input.addEventListener('input', function () {

                if (this.value.length == self.answer.length) {

                    if (this.value == self.answer) {

                        self.rightAnswer();

                    } else {

                        self.input.classList.add('wrong');

                        setTimeout(function () {
                            self.input.classList.remove('wrong');
                            self.input.value = '';
                        }, 1500);

                    }

                }

            });

            this.hintBtn.addEventListener('click', function () {
                self.HintComponent.show();
            });

            this.nextQuestBtn.addEventListener('click', function () {

                self.successMessage.classList.remove('show');

                self.nextStep();

            });

            document.addEventListener('failTimer', function () {
                self.hintBtn.classList.add('show');
            });

        }

        rightAnswer() {

            this.Timer.stop();

            document.dispatchEvent(this.pauseCommonTimer);

            this.successMessage.classList.add('show');
            this.successMessageText.focus();

            Sounds.applause.play();
            Sounds.fireworks.play();
            Sounds.tick.volume = 0;
            Sounds.alarm.volume = 0;

        }

        nextStep() {
            this.stepNumber++;
            if (this.stepNumber >= Steps.length) {
                document.dispatchEvent(this.succesEvent);
            } else {
                this.fillFields();
                document.dispatchEvent(this.continueCommonTimer);
                this.Timer.start();
            }
        }

        fillFields() {
            this.question = Steps[this.stepNumber].question;
            this.text.innerText = this.question;
            this.answer = Steps[this.stepNumber].answer;

            this.successMessageText.innerText = Steps[this.stepNumber].successMessage;
            this.nextQuestBtn.innerText = Steps[this.stepNumber].nextBtnText;

            this.timerOver = Steps[this.stepNumber].timeOver;
            this.Timer = new Timer(this.timerOver);

            this.hintText = Steps[this.stepNumber].hint;
            this.HintComponent = new HintComponent(this.hintText);

            this.input.value = '';
            this.hintBtn.classList.remove('show');
        }

        show() {
            this.container.classList.add('show');
            this.input.classList.add('show');
            this.Timer.start();
        }

        hide() {
            this.container.classList.remove('show');
        }



    }

    // Quest Timer
    class Timer {

        constructor(timeOver) {

            this.container = document.getElementById('timer');
            this.availableSeconds = timeOver;

            this.showTimerValue();

            this.failEvent = new Event('failTimer');

            this.secondsToDanger = Setup.secondsToDanger;

        }

        start() {

            let self = this;

            this.container.classList.add('danger');

            setTimeout(function () {
                self.container.classList.remove('danger');
            }, 800);

            this.timer = setInterval(function () {
                self.availableSeconds --;

                self.checkDanger();
                self.checkTimeIsOver();
                self.showTimerValue();

            }, 1000);
        }

        stop() {
            clearInterval(this.timer);
        }

        showTimerValue() {

            let minutes = Math.floor(this.availableSeconds / 60);
            let seconds = this.availableSeconds % 60;

            if (minutes < 10) {
                minutes = '0' + minutes;
            }

            if (seconds < 10) {
                seconds = '0' + seconds;
            }

            this.container.innerText = minutes + ':' + seconds;

        }

        checkDanger() {
            if (this.availableSeconds < this.secondsToDanger) {
                this.container.classList.add('danger');
                Sounds.tick.volume = 1;
            }
        }

        checkTimeIsOver() {
            if (this.availableSeconds < 1) {
                clearInterval(this.timer);
                Sounds.alarm.volume = 1;
                Sounds.tick.volume = 0;
                setTimeout(function () {
                    Sounds.alarm.volume = 0;
                }, 2000);
                document.dispatchEvent(this.failEvent);
            }
        }

    }

    // Hint Component
    class HintComponent {
        constructor(message) {
            this.container = document.getElementById('hint');
            this.hintText = this.container.querySelector('p#hint-text');
            this.closeBtn = this.container.querySelector('button#close-hint');

            this.hintText.innerText = message;

            this.init();
        }

        init() {
            let self = this;
            this.closeBtn.addEventListener('click', function () {
                self.hide();
            })
        }

        show() {
            this.container.classList.add('show');
        }
        hide() {
            this.container.classList.remove('show');
        }
    }

    // Player Component
    class Player {

        constructor(pathToFile, loop = false) {
            this.playBtn = document.getElementById('play');
            this.stopBtn = document.getElementById('stop');


            this.sound = new Audio(pathToFile);
            this.sound.loop = loop;

            this.init();
        }

        init() {
            let self = this;
            this.playBtn.addEventListener('click', function () {
                self.play();
                self.showStopBtn();
                self.hidePlayBtn();
            });
            this.stopBtn.addEventListener('click', function () {
                self.stop()
                self.showPlayBtn();
                self.hideStopBtn();
            });
        }

        play() {
            this.sound.play();
        }

        pause() {
            this.sound.pause();
        }

        stop() {
            this.sound.pause();
            this.sound.currentTime = 0;
        }

        showPlayBtn() {
            this.playBtn.classList.add('show');
        }

        hidePlayBtn() {
            this.playBtn.classList.remove('show');
        }

        showStopBtn() {
            this.stopBtn.classList.add('show');
        }

        hideStopBtn() {
            this.stopBtn.classList.remove('show');
        }

        isPlaying(name) {
            return !this.sound.paused;
        }

    }




    new Game();

});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoic2NyaXB0cy5qcyIsInNvdXJjZXNDb250ZW50IjpbImRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJET01Db250ZW50TG9hZGVkXCIsIGZ1bmN0aW9uKGV2ZW50KSB7XG5cblxuXG4gICAgY29uc3QgU3RlcHMgPSBbXG4gICAgICAgIHt9LFxuICAgICAgICB7XG4gICAgICAgICAgICBxdWVzdGlvbjogJ9CY0YLQsNC6LCDRgtCy0L7QtSDQv9C10YDQstC+0LUg0LfQsNC00LDQvdC40LUuINCY0YHQutCw0YLRjCDQutC+0L3QstC10YDRgiDQvdGD0LbQvdC+INGC0LDQvCwg0LPQtNC1INGC0Ysg0LPQvtGC0L7QstC40YjRjCDQvtGC0LvQuNGH0L3QtdC50YjRg9GOINC70LDQv9GI0YMsINC+0L0g0YDRj9C00L7QvCDRgSDQstC40LvQutC+0Lkg0Lgg0L3QvtC20L7QvC4nLFxuICAgICAgICAgICAgYW5zd2VyOiAnMjU4JyxcbiAgICAgICAgICAgIGhpbnQ6ICfQmtC+0L3QstC10YDRgiDQsiDRj9GJ0LjQutC1INGB0YLQvtC70LAsINC90LAg0LrRg9GF0L3QtScsXG4gICAgICAgICAgICBzdWNjZXNzTWVzc2FnZTogJ9CU0LDRiNGD0LvRjNC60LAsINGB0L/QsNGB0LjQsdC+INC30LAg0L7RgtC70LjRh9C90YvQtSDQuCDQstC60YPRgdC90YvRhSDQsdC70Y7QtNCwLCDQutC+0YLQvtGA0YvQtSDRgtGLINC00LvRjyDQvdCw0YEg0LPQvtGC0L7QstC40YjRjCEg0KLQstC+0Lkg0L/QvtC00LDRgNC+0Log0LIg0YHRgtC+0LvQtSwg0L7RgtC60YDQvtC5INC00LLQtdGA0YbRiy4nLFxuICAgICAgICAgICAgdGltZU92ZXI6IDE1LFxuICAgICAgICAgICAgbmV4dEJ0blRleHQ6ICfQmiDRgdC70LXQtNGD0Y7RidC10LzRgyDQv9C+0LTQsNGA0LrRgyEnLFxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgICBxdWVzdGlvbjogJ9Ch0LvQtdC00YPRjtGJ0LjQuSDQutC+0L3QstC10YDRgiDQvdCw0YXQvtC00LjRgtGB0Y8g0YLQsNC8LCDQs9C00LUg0YLRiyDQv9C+0LTQtNC10YDQttC40LLQsNC10YjRjCDQttC40LfQvdGMINGC0LXQvCwg0LrQvtCz0L4g0LTQsNGA0Y/RgiDRgtCy0L7QuCDQutC70LjQtdC90YLRiyDQu9GO0LHQuNC80YvQvCDQu9GO0LTRj9C8LicsXG4gICAgICAgICAgICBhbnN3ZXI6ICc1NTUnLFxuICAgICAgICAgICAgaGludDogJ9Ct0YLQviDRhtCy0LXRgtGLLCDQutC+0YLQvtGA0YvQtSDRgtGLINCy0YvRgNCw0YnQuNCy0LDQtdGI0YwnLFxuICAgICAgICAgICAgc3VjY2Vzc01lc3NhZ2U6ICfQodC/0LDRgdC40LHQviDQt9CwINC60YDQsNGB0L7RgtGDLCDQutC+0YLQvtGA0YPRjiDRgtGLINC/0YDQuNC90L7RgdC40YjRjCDQsiDRjdGC0L7RgiDQvNC40YAsINC/0L7QtNCw0YDQvtC6INC40YnQuCDQsiDRiNC60LDRhNGDINCy0LDQvdC90L7QuSDQutC+0LzQvdCw0YLRiy4nLFxuICAgICAgICAgICAgdGltZU92ZXI6IDMwLFxuICAgICAgICAgICAgbmV4dEJ0blRleHQ6ICfQmtC70LDRgdGBISDQlNCw0LvRjNGI0LUnLFxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgICBxdWVzdGlvbjogJ9Cf0L7RgtC+0YDQvtC/0LjRgdGMINC6INGB0LvQtdC00YPRjtGJ0LXQvNGDINC60L7QvdCy0LXRgNGC0YMsINC+0L0g0L3QsNGF0L7QtNC40YLRgdGPINGDINGF0L7RgNC+0YjQtdCz0L4g0LrRg9GH0LXRgNGP0LLQvtCz0L4g0YfQtdC70L7QstC10LrQsCwg0LbQuNCy0YPRidC10LPQviDQv9C+INGB0L7RgdC10LTRgdGC0LLRgy4g0KLQstC+0Lkg0L/QsNGA0L7Qu9GMIC0gXCLQpdC+0YfRgyDRhdCw0LvQstGDINC10LwsINGF0L7Rh9GDINC/0YDRj9C90LjQutC4XCInLFxuICAgICAgICAgICAgYW5zd2VyOiAnMzMzJyxcbiAgICAgICAgICAgIGhpbnQ6ICfQrdGC0L4g0JjRgNC40L3QsCcsXG4gICAgICAgICAgICBzdWNjZXNzTWVzc2FnZTogJ9Ch0L/QsNGB0LjQsdC+INC30LAg0YLQstC+0LUg0L7QsdGJ0LXQvdC40LUsINC30LAg0L3QvtCy0L7RgdGC0Lgg0Lgg0LjQtNC10LgsINC60L7RgtC+0YDRi9C80Lgg0YLRiyDQtNC10LvQuNGI0YzRgdGPISDQn9C+0LTQsNGA0L7QuiDQsiDRiNC60LDRhNGDICjQsiDQvtCx0YnQtdC8INC60L7RgNC40LTQvtGA0LUpJyxcbiAgICAgICAgICAgIHRpbWVPdmVyOiAxNSxcbiAgICAgICAgICAgIG5leHRCdG5UZXh0OiAn0JXRidC1IScsXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICAgIHF1ZXN0aW9uOiAn0KHQu9C10LTRg9GO0YnQuNC5INC60L7QvdCy0LXRgNGCINGC0Ysg0L3QsNC50LTQtdGI0Ywg0YLQsNC8LCDQutGD0LTQsCDQv9C+0L/QsNC00LDRjtGCINGC0LLQvtC4INC90L7RgdC+0YfQutC4INC/0L7RgdC70LUg0YHRgtC40YDQutC4LicsXG4gICAgICAgICAgICBhbnN3ZXI6ICcxNTcnLFxuICAgICAgICAgICAgaGludDogJ9Cf0L7RgdC70LUg0YLQvtCz0L4sINC60LDQuiDQvtC90Lgg0LLRi9GB0L7RhdC70LgnLFxuICAgICAgICAgICAgc3VjY2Vzc01lc3NhZ2U6ICfQodC/0LDRgdC40LHQviDQt9CwINGH0LjRgdGC0L7RgtGDINC4INC/0L7RgNGP0LTQvtC6LCDQutC+0YLQvtGA0YvQtSDRgtGLINC00LvRjyDQvdCw0YEg0L/QvtC00LTQtdGA0LbQuNCy0LDQtdGI0YwhINCi0LLQvtC5INGB0LvQtdC00YPRjtGJ0LjQuSDQv9C+0LTQsNGA0L7QuiDQsiDQsNC90YLRgNC10YHQvtC70LghJyxcbiAgICAgICAgICAgIHRpbWVPdmVyOiAxNSxcbiAgICAgICAgICAgIG5leHRCdG5UZXh0OiAn0KPRgNCwLiDQlNCw0LvRjNGI0LUhJyxcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgcXVlc3Rpb246ICfQmNGC0LDQuiwg0L/QvtGB0LvQtdC00L3QtdC1INC30LDQtNCw0L3QuNC1LiDQntGC0LLQtdGCINC/0YDRj9GH0LXRgtGB0Y8g0LIg0LzQtdGI0LrQtSDQvdCw0LHQuNGC0L7QvCDQs9GD0YHQuNC90YvQvNC4INCy0L7Qu9C+0YHQsNC80LguJyxcbiAgICAgICAgICAgIGFuc3dlcjogJzM2OScsXG4gICAgICAgICAgICBoaW50OiAn0K3RgtC+INC/0L7QtNGD0YjQutCwJyxcbiAgICAgICAgICAgIHN1Y2Nlc3NNZXNzYWdlOiAn0KHQv9Cw0YHQuNCx0L4g0LfQsCDQu9GO0LHQvtCy0Ywg0Lgg0LvQsNGB0LrRgywg0LrQvtGC0L7RgNGL0LzQuCDRgtGLINC90LDRgSDRgdC+0LPRgNC10LLQsNC10YjRjCEg0KLQstC+0Lkg0L/QvtC00LDRgNC+0Log0L/QvtC0INC80LDRgtGA0LDRgdC+0LwuJyxcbiAgICAgICAgICAgIHRpbWVPdmVyOiAxNSxcbiAgICAgICAgICAgIG5leHRCdG5UZXh0OiAn0Jgt0Lgt0LguLi4nLFxuICAgICAgICB9LFxuICAgIF07XG5cbiAgICBjb25zdCBTZXR1cCA9IHtcbiAgICAgICAgZGVidWc6IGZhbHNlLFxuICAgICAgICBzZWNvbmRzVG9EYW5nZXI6IDEwLFxuICAgICAgICBzb3VuZHM6IHtcbiAgICAgICAgICAgIGRhc2hhOiAnL2Fzc2V0cy9zb3VuZHMvZGFzaGEubXAzJyxcbiAgICAgICAgICAgIGFwcGxhdXNlOiAnL2Fzc2V0cy9zb3VuZHMvYXBwbGF1c2UubXAzJyxcbiAgICAgICAgICAgIGZpcmV3b3JrczogJy9hc3NldHMvc291bmRzL2ZpcmV3b3Jrcy5tcDMnLFxuICAgICAgICAgICAgYWxhcm06ICcvYXNzZXRzL3NvdW5kcy9hbGFybS5tcDMnLFxuICAgICAgICAgICAgdGljazogJy9hc3NldHMvc291bmRzL3RpY2subXAzJyxcbiAgICAgICAgfSxcbiAgICAgICAgd2VsY29tZU1lc3NhZ2U6IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBtZXNzYWdlOiAn0J/RgNC40LLQtdGCLCDQlNCw0YjRg9C70YzQutCwISDQodC10LPQvtC00L3RjyDRgtCy0L7QuSDQtNC10L3RjCDRgNC+0LbQtNC10L3QuNGPLCDQsCDQsiDQtNC10L3RjCDRgNC+0LbQtNC10L3QuNGPINC/0YDQuNC90Y/RgtC+INC/0L7Qu9GD0YfQsNGC0Ywg0L/QvtC00LDRgNC60LguINCc0L7QuSDQv9C+0LTQsNGA0L7QuiAtINGN0YLQviDQuNCz0YDQsCwg0LIg0LrQvtGC0L7RgNC+0Lkg0YLQtdCx0LUg0L3Rg9C20L3QviDQsdGD0LTQtdGCINC90LDQudGC0Lgg0L/QvtC00LDRgNC60LguINCY0YLQsNC6LCDQstC+0LfQstGA0LDRidCw0LnRgdGPINCyINC60L7QvNC90LDRgtGDLCDQsCDQt9Cw0YLQtdC8INC90LDQttC80Lgg0JTQsNC70LXQtS4uLicsXG4gICAgICAgICAgICAgICAgYnRuVGV4dDogJ9CU0LDQu9C10LUnLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBtZXNzYWdlOiAn0JTQvtCx0YDQviDQv9C+0LbQsNC70L7QstCw0YLRjCDQsiDQv9GA0LjQutC70Y7Rh9C10L3QuNC1LCDQlNCw0YjQsC3Qv9GD0YLQtdGI0LXRgdGC0LLQtdC90L3QuNGG0LAhINCd0LAg0YLQstC+0ZHQvCDQv9GD0YLQuCDQsdGD0LTRg9GCINC30LDQtNCw0L3QuNGPINC90LAg0L/QvtC40YHQuiDQutC+0L3QstC10YDRgtC+0LIuINCSINC60L7QvdCy0LXRgNGC0LDRhSDQsdGD0LTQtdGCINGH0LjRgdC70L4sINC60L7RgtC+0YDQvtC1INGC0LXQsdC1INC90YPQttC90L4g0LLQstC10YHRgtC4LiDQn9C+0YHQu9C1INGN0YLQvtCz0L4g0YLRiyDRg9C30L3QsNC10YjRjCwg0LPQtNC1INC30LDQsdGA0LDRgtGMINC/0L7QtNCw0YDQvtC6LiDQodGD0YnQtdGB0YLQstGD0Y7RgiDQv9C+0LTRgdC60LDQt9C60LggLSDQvtC90Lgg0L/QvtGP0LLQu9GP0Y7RgtGB0Y8g0YLQvtCz0LTQsCwg0LrQvtCz0LTQsCDQt9Cw0LrQsNC90YfQuNCy0LDQtdGC0YHRjyDQstGA0LXQvNGPLiDQn9C+0LXRhdCw0LvQuD8nLFxuICAgICAgICAgICAgICAgIGJ0blRleHQ6ICfQn9C+0LXRhdCw0LvQuCEnLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICB9O1xuXG4gICAgbGV0IFNvdW5kcyA9IHt9O1xuXG5cblxuICAgIC8vIFByZWxvYWRlclxuICAgIGNsYXNzIFByZWxvYWRlciB7XG5cbiAgICAgICAgY29uc3RydWN0b3IoKSB7XG5cbiAgICAgICAgICAgIHRoaXMuaW1hZ2VzSXNMb2FkZWQgPSBmYWxzZTtcbiAgICAgICAgICAgIHRoaXMuc291bmRzSXNMb2FkZWQgPSBmYWxzZTtcblxuICAgICAgICAgICAgdGhpcy5wcmVsb2FkQmFja2dyb3VuZEltYWdlcygpO1xuICAgICAgICAgICAgdGhpcy5wcmVsb2FkU291bmRzKCk7XG5cbiAgICAgICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2Fzc2V0SXNMb2FkZWQnLCBmdW5jdGlvbiAoZXZlbnQpIHtcblxuICAgICAgICAgICAgICAgIGlmIChldmVudC5zb3VyY2UgPT0gJ2ltYWdlcycpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5pbWFnZXNJc0xvYWRlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKGV2ZW50LnNvdXJjZSA9PSAnc291bmRzJykge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnNvdW5kc0lzTG9hZGVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAodGhpcy5pbWFnZXNJc0xvYWRlZCAmJiB0aGlzLnNvdW5kc0lzTG9hZGVkKSB7XG4gICAgICAgICAgICAgICAgICAgIGRvY3VtZW50LmRpc3BhdGNoRXZlbnQobmV3IEV2ZW50KCdhbGxBc3NldHNJc0xvYWRlZCcpKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgIH1cblxuICAgICAgICBwcmVsb2FkQmFja2dyb3VuZEltYWdlcygpIHtcblxuICAgICAgICAgICAgdGhpcy5wcmVsb2FkQmFja2dyb3VuZEltYWdlc0VsZW1lbnRzQXJyID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgncHJlbG9hZC1iYWNrZ3JvdW5kJyk7XG5cbiAgICAgICAgICAgIHRoaXMudG90YWxBbW91bnRPZkltYWdlcyA9IHRoaXMucHJlbG9hZEJhY2tncm91bmRJbWFnZXNFbGVtZW50c0Fyci5sZW5ndGg7XG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRBbW91bnRPZkxvYWRlZEltYWdlcyA9IDA7XG5cbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy50b3RhbEFtb3VudE9mSW1hZ2VzOyBpKyspIHtcblxuICAgICAgICAgICAgICAgIGxldCBlbGVtZW50ID0gdGhpcy5wcmVsb2FkQmFja2dyb3VuZEltYWdlc0VsZW1lbnRzQXJyW2ldO1xuXG4gICAgICAgICAgICAgICAgbGV0IHN0eWxlID1cbiAgICAgICAgICAgICAgICAgICAgZWxlbWVudC5jdXJyZW50U3R5bGUgfHwgd2luZG93LmdldENvbXB1dGVkU3R5bGUoZWxlbWVudCwgZmFsc2UpLFxuICAgICAgICAgICAgICAgICAgICB1cmwgPSBzdHlsZVxuICAgICAgICAgICAgICAgICAgICAgICAgLmJhY2tncm91bmRJbWFnZVxuICAgICAgICAgICAgICAgICAgICAgICAgLnNsaWNlKDQsIC0xKVxuICAgICAgICAgICAgICAgICAgICAgICAgLnJlcGxhY2UoL1wiL2csIFwiXCIpO1xuXG4gICAgICAgICAgICAgICAgdGhpcy5pbWFnZVByZWxvYWRlcih1cmwpO1xuXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfVxuXG4gICAgICAgIGltYWdlUHJlbG9hZGVyKHVybCkge1xuICAgICAgICAgICAgbGV0IHNlbGYgPSB0aGlzO1xuICAgICAgICAgICAgbGV0IGltZyA9IG5ldyBJbWFnZSgpO1xuICAgICAgICAgICAgaW1nLnNyYyA9IHVybDtcbiAgICAgICAgICAgIGltZy5vbmxvYWQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgc2VsZi5pbWFnZUlzTG9hZGVkKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoaW1nLmNvbXBsZXRlKSBpbWcub25sb2FkKCk7XG4gICAgICAgIH1cblxuICAgICAgICBpbWFnZUlzTG9hZGVkKCkge1xuICAgICAgICAgICAgdGhpcy5jdXJyZW50QW1vdW50T2ZMb2FkZWRJbWFnZXMrKztcbiAgICAgICAgICAgIGlmICh0aGlzLmN1cnJlbnRBbW91bnRPZkxvYWRlZEltYWdlcyA+PSB0aGlzLnRvdGFsQW1vdW50T2ZJbWFnZXMpIHtcbiAgICAgICAgICAgICAgICBsZXQgZXZlbnQgPSBuZXcgRXZlbnQoJ2Fzc2V0SXNMb2FkZWQnKTtcbiAgICAgICAgICAgICAgICBldmVudC5zb3VyY2UgPSAnaW1hZ2VzJztcbiAgICAgICAgICAgICAgICBkb2N1bWVudC5kaXNwYXRjaEV2ZW50KGV2ZW50KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHByZWxvYWRTb3VuZHMoKSB7XG5cbiAgICAgICAgICAgIGxldCBzZWxmID0gdGhpcztcblxuICAgICAgICAgICAgdGhpcy5wcmVsb2FkU291bmRzQXJyID0gU2V0dXAuc291bmRzO1xuXG4gICAgICAgICAgICB0aGlzLnRvdGFsQW1vdW50T2ZTb3VuZHMgPSBPYmplY3Qua2V5cyhTZXR1cC5zb3VuZHMpLmxlbmd0aDtcbiAgICAgICAgICAgIHRoaXMuY3VycmVudEFtb3VudE9mTG9hZGVkU291bmRzID0gMDtcblxuICAgICAgICAgICAgbGV0IHRlbXBTb3VuZHMgPSB7fTtcblxuICAgICAgICAgICAgZm9yIChsZXQgbmFtZSBpbiBTZXR1cC5zb3VuZHMpIHtcblxuICAgICAgICAgICAgICAgIHRlbXBTb3VuZHNbbmFtZV0gPSBuZXcgQXVkaW8oU2V0dXAuc291bmRzW25hbWVdKTtcblxuICAgICAgICAgICAgICAgIHRlbXBTb3VuZHNbbmFtZV0uYWRkRXZlbnRMaXN0ZW5lcignY2FucGxheXRocm91Z2gnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIHNlbGYuc291bmRJc0xvYWRlZCgpO1xuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIFNvdW5kcyA9IHRlbXBTb3VuZHM7XG5cbiAgICAgICAgfVxuXG4gICAgICAgIHNvdW5kSXNMb2FkZWQoKSB7XG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRBbW91bnRPZkxvYWRlZFNvdW5kcyArKztcbiAgICAgICAgICAgIGlmICh0aGlzLmN1cnJlbnRBbW91bnRPZkxvYWRlZFNvdW5kcyA+PSB0aGlzLnRvdGFsQW1vdW50T2ZTb3VuZHMpIHtcbiAgICAgICAgICAgICAgICBsZXQgZXZlbnQgPSBuZXcgRXZlbnQoJ2Fzc2V0SXNMb2FkZWQnKTtcbiAgICAgICAgICAgICAgICBldmVudC5zb3VyY2UgPSAnc291bmRzJztcbiAgICAgICAgICAgICAgICBkb2N1bWVudC5kaXNwYXRjaEV2ZW50KGV2ZW50KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgfVxuXG4gICAgLy8gTWFpbiBDb21wb25lbnRcbiAgICBjbGFzcyBHYW1lIHtcblxuICAgICAgICBjb25zdHJ1Y3RvcigpIHtcblxuICAgICAgICAgICAgbmV3IFByZWxvYWRlcigpO1xuXG4gICAgICAgICAgICAvLyBTY3JlZW5zXG4gICAgICAgICAgICB0aGlzLmxvYWRpbmdTY3JlZW4gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbG9hZGluZycpO1xuICAgICAgICAgICAgdGhpcy5weXJvU2NyZWVuID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3B5cm8nKTtcbiAgICAgICAgICAgIHRoaXMuZ2FtZU92ZXJTY3JlZW4gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZ2FtZS1vdmVyJyk7XG5cblxuICAgICAgICAgICAgLy8gQ29tcG9uZW50c1xuICAgICAgICAgICAgdGhpcy5GdWxsc2NyZWVuQ29tcG9uZW50ID0gbmV3IEZ1bGxzY3JlZW5Db21wb25lbnQoKTtcbiAgICAgICAgICAgIHRoaXMuV2VsY29tZUNvbXBvbmVudCA9IG5ldyBXZWxjb21lKCk7XG4gICAgICAgICAgICB0aGlzLkNvbW1vblRpbWVyQ29tcG9uZW50ID0gbmV3IENvbW1vblRpbWVyQ29tcG9uZW50KCk7XG4gICAgICAgICAgICB0aGlzLlF1ZXN0Q29tcG9uZW50ID0gbmV3IFF1ZXN0Q29tcG9uZW50KCk7XG5cblxuICAgICAgICAgICAgLy8gQmluZCBFdmVudHNcbiAgICAgICAgICAgIHRoaXMuaW5pdEV2ZW50cygpO1xuXG4gICAgICAgIH1cblxuICAgICAgICAvLyBCaW5nIEV2ZW50c1xuICAgICAgICBpbml0RXZlbnRzKCkge1xuXG4gICAgICAgICAgICBsZXQgc2VsZiA9IHRoaXM7XG5cbiAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIGRvY3VtZW50LmRpc3BhdGNoRXZlbnQobmV3IEV2ZW50KCdhbGxBc3NldHNJc0xvYWRlZCcpKTtcbiAgICAgICAgICAgIH0sIDMwMDApO1xuXG4gICAgICAgICAgICAvLyBBcHAgaXMgTG9hZGVkXG4gICAgICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdhbGxBc3NldHNJc0xvYWRlZCcsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBzZWxmLmhpZGVMb2FkaW5nKCk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgLy8gRnVsbHNjcmVlbiBEb25lXG4gICAgICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdmdWxsc2NyZWVuRG9uZScsIGZ1bmN0aW9uICgpIHtcblxuICAgICAgICAgICAgICAgIHNlbGYuV2VsY29tZUNvbXBvbmVudC5zaG93KCk7XG5cbiAgICAgICAgICAgIH0pO1xuXG5cbiAgICAgICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ3dlbGNvbWVEb25lJywgZnVuY3Rpb24gKCkge1xuXG4gICAgICAgICAgICAgICAgc2VsZi5XZWxjb21lQ29tcG9uZW50LmhpZGUoKTtcbiAgICAgICAgICAgICAgICBzZWxmLlF1ZXN0Q29tcG9uZW50LnNob3coKTtcbiAgICAgICAgICAgICAgICBzZWxmLkNvbW1vblRpbWVyQ29tcG9uZW50LnN0YXJ0KCk7XG5cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAvLyBRdWVzdCBEb25lXG4gICAgICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdldmVudFF1ZXN0U3VjY2VzcycsIGZ1bmN0aW9uICgpIHtcblxuICAgICAgICAgICAgICAgIHNlbGYuQ29tbW9uVGltZXJDb21wb25lbnQuc3RvcCgpO1xuICAgICAgICAgICAgICAgIHNlbGYuUXVlc3RDb21wb25lbnQuaGlkZSgpO1xuICAgICAgICAgICAgICAgIHNlbGYuZ2FtZU92ZXJTY3JlZW4uY2xhc3NMaXN0LmFkZCgnc2hvdycpO1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdHYW1lIE92ZXIhISEnKTtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhzZWxmLkNvbW1vblRpbWVyQ29tcG9uZW50LmdldENvbW1vblRpbWUoKSk7XG5cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAvLyBQYXVzZSBDb21tb24gVGltZXJcbiAgICAgICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ3BhdXNlVGltZXInLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgc2VsZi5Db21tb25UaW1lckNvbXBvbmVudC5wYXVzZSgpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIC8vIENvbnRpbnVlIENvbW1vbiBUaW1lclxuICAgICAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignY29udGludWVUaW1lcicsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBzZWxmLkNvbW1vblRpbWVyQ29tcG9uZW50LmNvbnRpbnVlKCk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICB9XG5cbiAgICAgICAgLy9Mb2FkaW5nXG4gICAgICAgIGhpZGVMb2FkaW5nKCkge1xuICAgICAgICAgICAgdGhpcy5sb2FkaW5nU2NyZWVuLmNsYXNzTGlzdC5yZW1vdmUoJ3Nob3cnKTtcbiAgICAgICAgfVxuXG4gICAgfVxuXG4gICAgLy8gRnVsbHNjcmVlbiBDbGFzc1xuICAgIGNsYXNzIEZ1bGxzY3JlZW5Db21wb25lbnQge1xuXG4gICAgICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICAgICAgdGhpcy5jb250YWluZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZnVsbHNjcmVlbicpO1xuICAgICAgICAgICAgdGhpcy5jb250YWluZXIuY2xhc3NMaXN0LmFkZCgnc2hvdycpO1xuICAgICAgICAgICAgdGhpcy5idG4gPSB0aGlzLmNvbnRhaW5lci5xdWVyeVNlbGVjdG9yKCdidXR0b24nKTtcbiAgICAgICAgICAgIHRoaXMuZnVsbHNjcmVlbkRvbmUgPSBuZXcgRXZlbnQoJ2Z1bGxzY3JlZW5Eb25lJyk7XG4gICAgICAgICAgICBsZXQgc2VsZiA9IHRoaXM7XG4gICAgICAgICAgICB0aGlzLmJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBpZiAoIVNldHVwLmRlYnVnKSB7XG4gICAgICAgICAgICAgICAgICAgIHNlbGYubGF1bmNoRnVsbFNjcmVlbihkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBzZWxmLmJ0bi5jbGFzc0xpc3QuYWRkKCdzb2Z0X2hpZGUnKTtcbiAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5jb250YWluZXIuY2xhc3NMaXN0LnJlbW92ZSgnc2hvdycpO1xuICAgICAgICAgICAgICAgICAgICBkb2N1bWVudC5kaXNwYXRjaEV2ZW50KHNlbGYuZnVsbHNjcmVlbkRvbmUpO1xuICAgICAgICAgICAgICAgIH0sIDEwMDApO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgfVxuXG4gICAgICAgIGxhdW5jaEZ1bGxTY3JlZW4oZWxlbWVudCkge1xuICAgICAgICAgICAgaWYoZWxlbWVudC5yZXF1ZXN0RnVsbFNjcmVlbikge1xuICAgICAgICAgICAgICAgIGVsZW1lbnQucmVxdWVzdEZ1bGxTY3JlZW4oKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZihlbGVtZW50Lm1velJlcXVlc3RGdWxsU2NyZWVuKSB7XG4gICAgICAgICAgICAgICAgZWxlbWVudC5tb3pSZXF1ZXN0RnVsbFNjcmVlbigpO1xuICAgICAgICAgICAgfSBlbHNlIGlmKGVsZW1lbnQud2Via2l0UmVxdWVzdEZ1bGxTY3JlZW4pIHtcbiAgICAgICAgICAgICAgICBlbGVtZW50LndlYmtpdFJlcXVlc3RGdWxsU2NyZWVuKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBjYW5jZWxGdWxsc2NyZWVuKCkge1xuICAgICAgICAgICAgaWYoZG9jdW1lbnQuY2FuY2VsRnVsbFNjcmVlbikge1xuICAgICAgICAgICAgICAgIGRvY3VtZW50LmNhbmNlbEZ1bGxTY3JlZW4oKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZihkb2N1bWVudC5tb3pDYW5jZWxGdWxsU2NyZWVuKSB7XG4gICAgICAgICAgICAgICAgZG9jdW1lbnQubW96Q2FuY2VsRnVsbFNjcmVlbigpO1xuICAgICAgICAgICAgfSBlbHNlIGlmKGRvY3VtZW50LndlYmtpdENhbmNlbEZ1bGxTY3JlZW4pIHtcbiAgICAgICAgICAgICAgICBkb2N1bWVudC53ZWJraXRDYW5jZWxGdWxsU2NyZWVuKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgIH1cblxuICAgIC8vIFdlbGNvbWUgTWVzc2FnZXNcbiAgICBjbGFzcyBXZWxjb21lIHtcblxuICAgICAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgICAgIHRoaXMuY29udGFpbmVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3dlbGNvbWUnKTtcbiAgICAgICAgICAgIHRoaXMuYXBwZWFydGluQmxvY2sgPSB0aGlzLmNvbnRhaW5lci5xdWVyeVNlbGVjdG9yKCcjd2VsY29tZS10ZXh0Jyk7XG4gICAgICAgICAgICB0aGlzLnRleHQgPSB0aGlzLmNvbnRhaW5lci5xdWVyeVNlbGVjdG9yKCcjd2VsY29tZS10ZXh0ID4gcCcpO1xuICAgICAgICAgICAgdGhpcy5uZXh0QnRuID0gdGhpcy5jb250YWluZXIucXVlcnlTZWxlY3RvcignYnV0dG9uI3dlbGNvbWUtbmV4dC1idG4nKTtcbiAgICAgICAgICAgIHRoaXMuZXZlbnREb25lID0gbmV3IEV2ZW50KCd3ZWxjb21lRG9uZScpO1xuICAgICAgICAgICAgdGhpcy5tdXNpY0Rhc2hhID0gbmV3IFBsYXllcihTZXR1cC5zb3VuZHMuZGFzaGEpO1xuICAgICAgICAgICAgdGhpcy5pbml0KCk7XG4gICAgICAgIH1cblxuICAgICAgICBpbml0KCkge1xuXG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRNZXNzYWdlID0gMDtcblxuICAgICAgICAgICAgdGhpcy5maWxsRmllbGRzKCk7XG5cbiAgICAgICAgICAgIGxldCBzZWxmID0gdGhpcztcbiAgICAgICAgICAgIHRoaXMubmV4dEJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBpZiAoc2VsZi5jdXJyZW50TWVzc2FnZSA9PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICghU2V0dXAuZGVidWcpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIFNvdW5kcy5kYXNoYS5wbGF5KCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKHNlbGYuY3VycmVudE1lc3NhZ2UgPT0gMSkge1xuICAgICAgICAgICAgICAgICAgICBTb3VuZHMudGljay52b2x1bWUgPSAwO1xuICAgICAgICAgICAgICAgICAgICBTb3VuZHMudGljay5sb29wID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgU291bmRzLnRpY2sucGxheSgpO1xuICAgICAgICAgICAgICAgICAgICBTb3VuZHMuYWxhcm0udm9sdW1lID0gMDtcbiAgICAgICAgICAgICAgICAgICAgU291bmRzLmFsYXJtLmxvb3AgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICBTb3VuZHMuYWxhcm0ucGxheSgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBzZWxmLm5leHRNZXNzYWdlKCk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICB9XG5cbiAgICAgICAgZmlsbEZpZWxkcygpIHtcbiAgICAgICAgICAgIHRoaXMudGV4dC5pbm5lclRleHQgPSBTZXR1cC53ZWxjb21lTWVzc2FnZVt0aGlzLmN1cnJlbnRNZXNzYWdlXS5tZXNzYWdlO1xuICAgICAgICAgICAgdGhpcy5uZXh0QnRuLmlubmVyVGV4dCA9IFNldHVwLndlbGNvbWVNZXNzYWdlW3RoaXMuY3VycmVudE1lc3NhZ2VdLmJ0blRleHQ7XG4gICAgICAgIH1cblxuICAgICAgICBuZXh0TWVzc2FnZSgpIHtcbiAgICAgICAgICAgIHRoaXMuY3VycmVudE1lc3NhZ2UrKztcbiAgICAgICAgICAgIGlmICh0aGlzLmN1cnJlbnRNZXNzYWdlID49IFNldHVwLndlbGNvbWVNZXNzYWdlLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgIHRoaXMubXVzaWNEYXNoYS5zdG9wKCk7XG4gICAgICAgICAgICAgICAgZG9jdW1lbnQuZGlzcGF0Y2hFdmVudCh0aGlzLmV2ZW50RG9uZSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLmN1cnJlbnRNZXNzYWdlID09IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFTZXR1cC5kZWJ1Zykge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5tdXNpY0Rhc2hhLnBsYXkoKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0aGlzLmZpbGxGaWVsZHMoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHNob3coKSB7XG4gICAgICAgICAgICB0aGlzLmNvbnRhaW5lci5jbGFzc0xpc3QuYWRkKCdzaG93Jyk7XG4gICAgICAgICAgICB0aGlzLmFwcGVhcnRpbkJsb2NrLmNsYXNzTGlzdC5hZGQoJ3Nob3cnKTtcbiAgICAgICAgICAgIHRoaXMubmV4dEJ0bi5jbGFzc0xpc3QuYWRkKCdzaG93Jyk7XG4gICAgICAgIH1cblxuICAgICAgICBoaWRlKCkge1xuICAgICAgICAgICAgdGhpcy5jb250YWluZXIuY2xhc3NMaXN0LnJlbW92ZSgnc2hvdycpO1xuICAgICAgICB9XG5cbiAgICB9XG5cbiAgICAvLyBDb21tb25UaW1lIENsYXNzXG4gICAgY2xhc3MgQ29tbW9uVGltZXJDb21wb25lbnQge1xuXG4gICAgICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICAgICAgdGhpcy5jdXJyZW50U2Vjb25kcyA9IDA7XG4gICAgICAgICAgICB0aGlzLmlzUGF1c2VkID0gZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgICBzdGFydCgpIHtcbiAgICAgICAgICAgIGxldCBzZWxmID0gdGhpcztcbiAgICAgICAgICAgIHRoaXMudGltZXIgPSBzZXRJbnRlcnZhbChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgaWYgKCFzZWxmLmlzUGF1c2VkKSB7XG4gICAgICAgICAgICAgICAgICAgIHNlbGYuY3VycmVudFNlY29uZHMgKys7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSwgMTAwMCk7XG4gICAgICAgIH1cblxuICAgICAgICBwYXVzZSgpIHtcbiAgICAgICAgICAgIHRoaXMuaXNQYXVzZWQgPSB0cnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgY29udGludWUoKSB7XG4gICAgICAgICAgICB0aGlzLmlzUGF1c2VkID0gZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgICBzdG9wKCkge1xuICAgICAgICAgICAgY2xlYXJJbnRlcnZhbCh0aGlzLnRpbWVyKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGdldENvbW1vblRpbWUoKSB7XG5cbiAgICAgICAgICAgIGxldCBtaW51dGVzID0gTWF0aC5mbG9vcih0aGlzLmN1cnJlbnRTZWNvbmRzIC8gNjApO1xuICAgICAgICAgICAgbGV0IHNlY29uZHMgPSB0aGlzLmN1cnJlbnRTZWNvbmRzICUgNjA7XG5cbiAgICAgICAgICAgIGlmIChtaW51dGVzIDwgMTApIHtcbiAgICAgICAgICAgICAgICBtaW51dGVzID0gJzAnICsgbWludXRlcztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHNlY29uZHMgPCAxMCkge1xuICAgICAgICAgICAgICAgIHNlY29uZHMgPSAnMCcgKyBzZWNvbmRzO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gbWludXRlcyArICc6JyArIHNlY29uZHM7O1xuICAgICAgICB9XG5cbiAgICB9XG5cbiAgICAvLyBRZXN0U3RlcCBDbGFzc1xuICAgIGNsYXNzIFF1ZXN0Q29tcG9uZW50IHtcblxuICAgICAgICBjb25zdHJ1Y3RvcigpIHtcblxuICAgICAgICAgICAgdGhpcy5jb250YWluZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncXVlc3QnKTtcblxuICAgICAgICAgICAgdGhpcy50ZXh0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3RleHQnKTtcbiAgICAgICAgICAgIHRoaXMuaW5wdXQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYW5zd2VyLWlucHV0Jyk7XG5cbiAgICAgICAgICAgIHRoaXMuc3VjY2Vzc01lc3NhZ2UgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc3VjY2Vzcy1tZXNzYWdlJyk7XG4gICAgICAgICAgICB0aGlzLnN1Y2Nlc3NNZXNzYWdlVGV4dCA9IHRoaXMuc3VjY2Vzc01lc3NhZ2UucXVlcnlTZWxlY3RvcigncCN0ZXh0LXN1Y2Nlc3MtbWVzc2FnZScpO1xuICAgICAgICAgICAgdGhpcy5uZXh0UXVlc3RCdG4gPSB0aGlzLnN1Y2Nlc3NNZXNzYWdlLnF1ZXJ5U2VsZWN0b3IoJ2J1dHRvbiNuZXh0LXF1ZXN0LWJ0bicpO1xuXG4gICAgICAgICAgICB0aGlzLmhpbnRCdG4gPSB0aGlzLmNvbnRhaW5lci5xdWVyeVNlbGVjdG9yKCdidXR0b24jaGludC1idG4nKTtcblxuICAgICAgICAgICAgdGhpcy5zdWNjZXNFdmVudCA9IG5ldyBFdmVudCgnZXZlbnRRdWVzdFN1Y2Nlc3MnKTtcbiAgICAgICAgICAgIHRoaXMucGF1c2VDb21tb25UaW1lciA9IG5ldyBFdmVudCgncGF1c2VUaW1lcicpO1xuICAgICAgICAgICAgdGhpcy5jb250aW51ZUNvbW1vblRpbWVyID0gbmV3IEV2ZW50KCdjb250aW51ZVRpbWVyJyk7XG4gICAgICAgICAgICB0aGlzLnN0b3BUaWNrU291bmQgPSBuZXcgRXZlbnQoJ3N0b3BUaWNrU291bmQnKTtcbiAgICAgICAgICAgIHRoaXMuc3RvcEFsYXJtU291bmQgPSBuZXcgRXZlbnQoJ3N0b3BBbGFybVNvdW5kJyk7XG5cbiAgICAgICAgICAgIHRoaXMuc291bmRBcHBsYXVzZSA9IG5ldyBQbGF5ZXIoU2V0dXAuc291bmRzLmFwcGxhdXNlKTtcbiAgICAgICAgICAgIHRoaXMuc291bmRGaXJld29ya3MgPSBuZXcgUGxheWVyKFNldHVwLnNvdW5kcy5maXJld29ya3MpO1xuXG4gICAgICAgICAgICB0aGlzLmluaXQoKTtcblxuICAgICAgICB9XG5cbiAgICAgICAgaW5pdCgpIHtcblxuICAgICAgICAgICAgdGhpcy5zdGVwTnVtYmVyID0gMTtcblxuICAgICAgICAgICAgdGhpcy5maWxsRmllbGRzKCk7XG5cbiAgICAgICAgICAgIGxldCBzZWxmID0gdGhpcztcblxuICAgICAgICAgICAgdGhpcy5pbnB1dC5zZXRBdHRyaWJ1dGUoJ21heGxlbmd0aCcsIHRoaXMuYW5zd2VyLmxlbmd0aCk7XG5cbiAgICAgICAgICAgIHRoaXMuaW5wdXQuYWRkRXZlbnRMaXN0ZW5lcignaW5wdXQnLCBmdW5jdGlvbiAoKSB7XG5cbiAgICAgICAgICAgICAgICBpZiAodGhpcy52YWx1ZS5sZW5ndGggPT0gc2VsZi5hbnN3ZXIubGVuZ3RoKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMudmFsdWUgPT0gc2VsZi5hbnN3ZXIpIHtcblxuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5yaWdodEFuc3dlcigpO1xuXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuaW5wdXQuY2xhc3NMaXN0LmFkZCgnd3JvbmcnKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5pbnB1dC5jbGFzc0xpc3QucmVtb3ZlKCd3cm9uZycpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuaW5wdXQudmFsdWUgPSAnJztcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sIDE1MDApO1xuXG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHRoaXMuaGludEJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBzZWxmLkhpbnRDb21wb25lbnQuc2hvdygpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHRoaXMubmV4dFF1ZXN0QnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xuXG4gICAgICAgICAgICAgICAgc2VsZi5zdWNjZXNzTWVzc2FnZS5jbGFzc0xpc3QucmVtb3ZlKCdzaG93Jyk7XG5cbiAgICAgICAgICAgICAgICBzZWxmLm5leHRTdGVwKCk7XG5cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdmYWlsVGltZXInLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgc2VsZi5oaW50QnRuLmNsYXNzTGlzdC5hZGQoJ3Nob3cnKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgIH1cblxuICAgICAgICByaWdodEFuc3dlcigpIHtcblxuICAgICAgICAgICAgdGhpcy5UaW1lci5zdG9wKCk7XG5cbiAgICAgICAgICAgIGRvY3VtZW50LmRpc3BhdGNoRXZlbnQodGhpcy5wYXVzZUNvbW1vblRpbWVyKTtcblxuICAgICAgICAgICAgdGhpcy5zdWNjZXNzTWVzc2FnZS5jbGFzc0xpc3QuYWRkKCdzaG93Jyk7XG4gICAgICAgICAgICB0aGlzLnN1Y2Nlc3NNZXNzYWdlVGV4dC5mb2N1cygpO1xuXG4gICAgICAgICAgICBTb3VuZHMuYXBwbGF1c2UucGxheSgpO1xuICAgICAgICAgICAgU291bmRzLmZpcmV3b3Jrcy5wbGF5KCk7XG4gICAgICAgICAgICBTb3VuZHMudGljay52b2x1bWUgPSAwO1xuICAgICAgICAgICAgU291bmRzLmFsYXJtLnZvbHVtZSA9IDA7XG5cbiAgICAgICAgfVxuXG4gICAgICAgIG5leHRTdGVwKCkge1xuICAgICAgICAgICAgdGhpcy5zdGVwTnVtYmVyKys7XG4gICAgICAgICAgICBpZiAodGhpcy5zdGVwTnVtYmVyID49IFN0ZXBzLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgIGRvY3VtZW50LmRpc3BhdGNoRXZlbnQodGhpcy5zdWNjZXNFdmVudCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMuZmlsbEZpZWxkcygpO1xuICAgICAgICAgICAgICAgIGRvY3VtZW50LmRpc3BhdGNoRXZlbnQodGhpcy5jb250aW51ZUNvbW1vblRpbWVyKTtcbiAgICAgICAgICAgICAgICB0aGlzLlRpbWVyLnN0YXJ0KCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBmaWxsRmllbGRzKCkge1xuICAgICAgICAgICAgdGhpcy5xdWVzdGlvbiA9IFN0ZXBzW3RoaXMuc3RlcE51bWJlcl0ucXVlc3Rpb247XG4gICAgICAgICAgICB0aGlzLnRleHQuaW5uZXJUZXh0ID0gdGhpcy5xdWVzdGlvbjtcbiAgICAgICAgICAgIHRoaXMuYW5zd2VyID0gU3RlcHNbdGhpcy5zdGVwTnVtYmVyXS5hbnN3ZXI7XG5cbiAgICAgICAgICAgIHRoaXMuc3VjY2Vzc01lc3NhZ2VUZXh0LmlubmVyVGV4dCA9IFN0ZXBzW3RoaXMuc3RlcE51bWJlcl0uc3VjY2Vzc01lc3NhZ2U7XG4gICAgICAgICAgICB0aGlzLm5leHRRdWVzdEJ0bi5pbm5lclRleHQgPSBTdGVwc1t0aGlzLnN0ZXBOdW1iZXJdLm5leHRCdG5UZXh0O1xuXG4gICAgICAgICAgICB0aGlzLnRpbWVyT3ZlciA9IFN0ZXBzW3RoaXMuc3RlcE51bWJlcl0udGltZU92ZXI7XG4gICAgICAgICAgICB0aGlzLlRpbWVyID0gbmV3IFRpbWVyKHRoaXMudGltZXJPdmVyKTtcblxuICAgICAgICAgICAgdGhpcy5oaW50VGV4dCA9IFN0ZXBzW3RoaXMuc3RlcE51bWJlcl0uaGludDtcbiAgICAgICAgICAgIHRoaXMuSGludENvbXBvbmVudCA9IG5ldyBIaW50Q29tcG9uZW50KHRoaXMuaGludFRleHQpO1xuXG4gICAgICAgICAgICB0aGlzLmlucHV0LnZhbHVlID0gJyc7XG4gICAgICAgICAgICB0aGlzLmhpbnRCdG4uY2xhc3NMaXN0LnJlbW92ZSgnc2hvdycpO1xuICAgICAgICB9XG5cbiAgICAgICAgc2hvdygpIHtcbiAgICAgICAgICAgIHRoaXMuY29udGFpbmVyLmNsYXNzTGlzdC5hZGQoJ3Nob3cnKTtcbiAgICAgICAgICAgIHRoaXMuaW5wdXQuY2xhc3NMaXN0LmFkZCgnc2hvdycpO1xuICAgICAgICAgICAgdGhpcy5UaW1lci5zdGFydCgpO1xuICAgICAgICB9XG5cbiAgICAgICAgaGlkZSgpIHtcbiAgICAgICAgICAgIHRoaXMuY29udGFpbmVyLmNsYXNzTGlzdC5yZW1vdmUoJ3Nob3cnKTtcbiAgICAgICAgfVxuXG5cblxuICAgIH1cblxuICAgIC8vIFF1ZXN0IFRpbWVyXG4gICAgY2xhc3MgVGltZXIge1xuXG4gICAgICAgIGNvbnN0cnVjdG9yKHRpbWVPdmVyKSB7XG5cbiAgICAgICAgICAgIHRoaXMuY29udGFpbmVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3RpbWVyJyk7XG4gICAgICAgICAgICB0aGlzLmF2YWlsYWJsZVNlY29uZHMgPSB0aW1lT3ZlcjtcblxuICAgICAgICAgICAgdGhpcy5zaG93VGltZXJWYWx1ZSgpO1xuXG4gICAgICAgICAgICB0aGlzLmZhaWxFdmVudCA9IG5ldyBFdmVudCgnZmFpbFRpbWVyJyk7XG5cbiAgICAgICAgICAgIHRoaXMuc2Vjb25kc1RvRGFuZ2VyID0gU2V0dXAuc2Vjb25kc1RvRGFuZ2VyO1xuXG4gICAgICAgIH1cblxuICAgICAgICBzdGFydCgpIHtcblxuICAgICAgICAgICAgbGV0IHNlbGYgPSB0aGlzO1xuXG4gICAgICAgICAgICB0aGlzLmNvbnRhaW5lci5jbGFzc0xpc3QuYWRkKCdkYW5nZXInKTtcblxuICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgc2VsZi5jb250YWluZXIuY2xhc3NMaXN0LnJlbW92ZSgnZGFuZ2VyJyk7XG4gICAgICAgICAgICB9LCA4MDApO1xuXG4gICAgICAgICAgICB0aGlzLnRpbWVyID0gc2V0SW50ZXJ2YWwoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHNlbGYuYXZhaWxhYmxlU2Vjb25kcyAtLTtcblxuICAgICAgICAgICAgICAgIHNlbGYuY2hlY2tEYW5nZXIoKTtcbiAgICAgICAgICAgICAgICBzZWxmLmNoZWNrVGltZUlzT3ZlcigpO1xuICAgICAgICAgICAgICAgIHNlbGYuc2hvd1RpbWVyVmFsdWUoKTtcblxuICAgICAgICAgICAgfSwgMTAwMCk7XG4gICAgICAgIH1cblxuICAgICAgICBzdG9wKCkge1xuICAgICAgICAgICAgY2xlYXJJbnRlcnZhbCh0aGlzLnRpbWVyKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHNob3dUaW1lclZhbHVlKCkge1xuXG4gICAgICAgICAgICBsZXQgbWludXRlcyA9IE1hdGguZmxvb3IodGhpcy5hdmFpbGFibGVTZWNvbmRzIC8gNjApO1xuICAgICAgICAgICAgbGV0IHNlY29uZHMgPSB0aGlzLmF2YWlsYWJsZVNlY29uZHMgJSA2MDtcblxuICAgICAgICAgICAgaWYgKG1pbnV0ZXMgPCAxMCkge1xuICAgICAgICAgICAgICAgIG1pbnV0ZXMgPSAnMCcgKyBtaW51dGVzO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoc2Vjb25kcyA8IDEwKSB7XG4gICAgICAgICAgICAgICAgc2Vjb25kcyA9ICcwJyArIHNlY29uZHM7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMuY29udGFpbmVyLmlubmVyVGV4dCA9IG1pbnV0ZXMgKyAnOicgKyBzZWNvbmRzO1xuXG4gICAgICAgIH1cblxuICAgICAgICBjaGVja0RhbmdlcigpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLmF2YWlsYWJsZVNlY29uZHMgPCB0aGlzLnNlY29uZHNUb0Rhbmdlcikge1xuICAgICAgICAgICAgICAgIHRoaXMuY29udGFpbmVyLmNsYXNzTGlzdC5hZGQoJ2RhbmdlcicpO1xuICAgICAgICAgICAgICAgIFNvdW5kcy50aWNrLnZvbHVtZSA9IDE7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBjaGVja1RpbWVJc092ZXIoKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5hdmFpbGFibGVTZWNvbmRzIDwgMSkge1xuICAgICAgICAgICAgICAgIGNsZWFySW50ZXJ2YWwodGhpcy50aW1lcik7XG4gICAgICAgICAgICAgICAgU291bmRzLmFsYXJtLnZvbHVtZSA9IDE7XG4gICAgICAgICAgICAgICAgU291bmRzLnRpY2sudm9sdW1lID0gMDtcbiAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgU291bmRzLmFsYXJtLnZvbHVtZSA9IDA7XG4gICAgICAgICAgICAgICAgfSwgMjAwMCk7XG4gICAgICAgICAgICAgICAgZG9jdW1lbnQuZGlzcGF0Y2hFdmVudCh0aGlzLmZhaWxFdmVudCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgIH1cblxuICAgIC8vIEhpbnQgQ29tcG9uZW50XG4gICAgY2xhc3MgSGludENvbXBvbmVudCB7XG4gICAgICAgIGNvbnN0cnVjdG9yKG1lc3NhZ2UpIHtcbiAgICAgICAgICAgIHRoaXMuY29udGFpbmVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2hpbnQnKTtcbiAgICAgICAgICAgIHRoaXMuaGludFRleHQgPSB0aGlzLmNvbnRhaW5lci5xdWVyeVNlbGVjdG9yKCdwI2hpbnQtdGV4dCcpO1xuICAgICAgICAgICAgdGhpcy5jbG9zZUJ0biA9IHRoaXMuY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoJ2J1dHRvbiNjbG9zZS1oaW50Jyk7XG5cbiAgICAgICAgICAgIHRoaXMuaGludFRleHQuaW5uZXJUZXh0ID0gbWVzc2FnZTtcblxuICAgICAgICAgICAgdGhpcy5pbml0KCk7XG4gICAgICAgIH1cblxuICAgICAgICBpbml0KCkge1xuICAgICAgICAgICAgbGV0IHNlbGYgPSB0aGlzO1xuICAgICAgICAgICAgdGhpcy5jbG9zZUJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBzZWxmLmhpZGUoKTtcbiAgICAgICAgICAgIH0pXG4gICAgICAgIH1cblxuICAgICAgICBzaG93KCkge1xuICAgICAgICAgICAgdGhpcy5jb250YWluZXIuY2xhc3NMaXN0LmFkZCgnc2hvdycpO1xuICAgICAgICB9XG4gICAgICAgIGhpZGUoKSB7XG4gICAgICAgICAgICB0aGlzLmNvbnRhaW5lci5jbGFzc0xpc3QucmVtb3ZlKCdzaG93Jyk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBQbGF5ZXIgQ29tcG9uZW50XG4gICAgY2xhc3MgUGxheWVyIHtcblxuICAgICAgICBjb25zdHJ1Y3RvcihwYXRoVG9GaWxlLCBsb29wID0gZmFsc2UpIHtcbiAgICAgICAgICAgIHRoaXMucGxheUJ0biA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwbGF5Jyk7XG4gICAgICAgICAgICB0aGlzLnN0b3BCdG4gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc3RvcCcpO1xuXG5cbiAgICAgICAgICAgIHRoaXMuc291bmQgPSBuZXcgQXVkaW8ocGF0aFRvRmlsZSk7XG4gICAgICAgICAgICB0aGlzLnNvdW5kLmxvb3AgPSBsb29wO1xuXG4gICAgICAgICAgICB0aGlzLmluaXQoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGluaXQoKSB7XG4gICAgICAgICAgICBsZXQgc2VsZiA9IHRoaXM7XG4gICAgICAgICAgICB0aGlzLnBsYXlCdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgc2VsZi5wbGF5KCk7XG4gICAgICAgICAgICAgICAgc2VsZi5zaG93U3RvcEJ0bigpO1xuICAgICAgICAgICAgICAgIHNlbGYuaGlkZVBsYXlCdG4oKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdGhpcy5zdG9wQnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHNlbGYuc3RvcCgpXG4gICAgICAgICAgICAgICAgc2VsZi5zaG93UGxheUJ0bigpO1xuICAgICAgICAgICAgICAgIHNlbGYuaGlkZVN0b3BCdG4oKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgcGxheSgpIHtcbiAgICAgICAgICAgIHRoaXMuc291bmQucGxheSgpO1xuICAgICAgICB9XG5cbiAgICAgICAgcGF1c2UoKSB7XG4gICAgICAgICAgICB0aGlzLnNvdW5kLnBhdXNlKCk7XG4gICAgICAgIH1cblxuICAgICAgICBzdG9wKCkge1xuICAgICAgICAgICAgdGhpcy5zb3VuZC5wYXVzZSgpO1xuICAgICAgICAgICAgdGhpcy5zb3VuZC5jdXJyZW50VGltZSA9IDA7XG4gICAgICAgIH1cblxuICAgICAgICBzaG93UGxheUJ0bigpIHtcbiAgICAgICAgICAgIHRoaXMucGxheUJ0bi5jbGFzc0xpc3QuYWRkKCdzaG93Jyk7XG4gICAgICAgIH1cblxuICAgICAgICBoaWRlUGxheUJ0bigpIHtcbiAgICAgICAgICAgIHRoaXMucGxheUJ0bi5jbGFzc0xpc3QucmVtb3ZlKCdzaG93Jyk7XG4gICAgICAgIH1cblxuICAgICAgICBzaG93U3RvcEJ0bigpIHtcbiAgICAgICAgICAgIHRoaXMuc3RvcEJ0bi5jbGFzc0xpc3QuYWRkKCdzaG93Jyk7XG4gICAgICAgIH1cblxuICAgICAgICBoaWRlU3RvcEJ0bigpIHtcbiAgICAgICAgICAgIHRoaXMuc3RvcEJ0bi5jbGFzc0xpc3QucmVtb3ZlKCdzaG93Jyk7XG4gICAgICAgIH1cblxuICAgICAgICBpc1BsYXlpbmcobmFtZSkge1xuICAgICAgICAgICAgcmV0dXJuICF0aGlzLnNvdW5kLnBhdXNlZDtcbiAgICAgICAgfVxuXG4gICAgfVxuXG5cblxuXG4gICAgbmV3IEdhbWUoKTtcblxufSk7Il19
