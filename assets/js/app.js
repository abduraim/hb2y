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