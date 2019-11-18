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
        debug: true,
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoic2NyaXB0cy5qcyIsInNvdXJjZXNDb250ZW50IjpbImRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJET01Db250ZW50TG9hZGVkXCIsIGZ1bmN0aW9uKGV2ZW50KSB7XG5cblxuXG4gICAgY29uc3QgU3RlcHMgPSBbXG4gICAgICAgIHt9LFxuICAgICAgICB7XG4gICAgICAgICAgICBxdWVzdGlvbjogJ9CY0YLQsNC6LCDRgtCy0L7QtSDQv9C10YDQstC+0LUg0LfQsNC00LDQvdC40LUuINCY0YHQutCw0YLRjCDQutC+0L3QstC10YDRgiDQvdGD0LbQvdC+INGC0LDQvCwg0LPQtNC1INGC0Ysg0LPQvtGC0L7QstC40YjRjCDQvtGC0LvQuNGH0L3QtdC50YjRg9GOINC70LDQv9GI0YMsINC+0L0g0YDRj9C00L7QvCDRgSDQstC40LvQutC+0Lkg0Lgg0L3QvtC20L7QvC4nLFxuICAgICAgICAgICAgYW5zd2VyOiAnMjU4JyxcbiAgICAgICAgICAgIGhpbnQ6ICfQmtC+0L3QstC10YDRgiDQsiDRj9GJ0LjQutC1INGB0YLQvtC70LAsINC90LAg0LrRg9GF0L3QtScsXG4gICAgICAgICAgICBzdWNjZXNzTWVzc2FnZTogJ9CU0LDRiNGD0LvRjNC60LAsINGB0L/QsNGB0LjQsdC+INC30LAg0L7RgtC70LjRh9C90YvQtSDQuCDQstC60YPRgdC90YvRhSDQsdC70Y7QtNCwLCDQutC+0YLQvtGA0YvQtSDRgtGLINC00LvRjyDQvdCw0YEg0LPQvtGC0L7QstC40YjRjCEg0KLQstC+0Lkg0L/QvtC00LDRgNC+0Log0LIg0YHRgtC+0LvQtSwg0L7RgtC60YDQvtC5INC00LLQtdGA0YbRiy4nLFxuICAgICAgICAgICAgdGltZU92ZXI6IDE1LFxuICAgICAgICAgICAgbmV4dEJ0blRleHQ6ICfQmiDRgdC70LXQtNGD0Y7RidC10LzRgyDQv9C+0LTQsNGA0LrRgyEnLFxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgICBxdWVzdGlvbjogJ9Ch0LvQtdC00YPRjtGJ0LjQuSDQutC+0L3QstC10YDRgiDQvdCw0YXQvtC00LjRgtGB0Y8g0YLQsNC8LCDQs9C00LUg0YLRiyDQv9C+0LTQtNC10YDQttC40LLQsNC10YjRjCDQttC40LfQvdGMINGC0LXQvCwg0LrQvtCz0L4g0LTQsNGA0Y/RgiDRgtCy0L7QuCDQutC70LjQtdC90YLRiyDQu9GO0LHQuNC80YvQvCDQu9GO0LTRj9C8LicsXG4gICAgICAgICAgICBhbnN3ZXI6ICc1NTUnLFxuICAgICAgICAgICAgaGludDogJ9Ct0YLQviDRhtCy0LXRgtGLLCDQutC+0YLQvtGA0YvQtSDRgtGLINCy0YvRgNCw0YnQuNCy0LDQtdGI0YwnLFxuICAgICAgICAgICAgc3VjY2Vzc01lc3NhZ2U6ICfQodC/0LDRgdC40LHQviDQt9CwINC60YDQsNGB0L7RgtGDLCDQutC+0YLQvtGA0YPRjiDRgtGLINC/0YDQuNC90L7RgdC40YjRjCDQsiDRjdGC0L7RgiDQvNC40YAsINC/0L7QtNCw0YDQvtC6INC40YnQuCDQsiDRiNC60LDRhNGDINCy0LDQvdC90L7QuSDQutC+0LzQvdCw0YLRiy4nLFxuICAgICAgICAgICAgdGltZU92ZXI6IDMwLFxuICAgICAgICAgICAgbmV4dEJ0blRleHQ6ICfQmtC70LDRgdGBISDQlNCw0LvRjNGI0LUnLFxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgICBxdWVzdGlvbjogJ9Cf0L7RgtC+0YDQvtC/0LjRgdGMINC6INGB0LvQtdC00YPRjtGJ0LXQvNGDINC60L7QvdCy0LXRgNGC0YMsINC+0L0g0L3QsNGF0L7QtNC40YLRgdGPINGDINGF0L7RgNC+0YjQtdCz0L4g0LrRg9GH0LXRgNGP0LLQvtCz0L4g0YfQtdC70L7QstC10LrQsCwg0LbQuNCy0YPRidC10LPQviDQv9C+INGB0L7RgdC10LTRgdGC0LLRgy4g0KLQstC+0Lkg0L/QsNGA0L7Qu9GMIC0gXCLQpdC+0YfRgyDRhdCw0LvQstGDINC10LwsINGF0L7Rh9GDINC/0YDRj9C90LjQutC4XCInLFxuICAgICAgICAgICAgYW5zd2VyOiAnMzMzJyxcbiAgICAgICAgICAgIGhpbnQ6ICfQrdGC0L4g0JjRgNC40L3QsCcsXG4gICAgICAgICAgICBzdWNjZXNzTWVzc2FnZTogJ9Ch0L/QsNGB0LjQsdC+INC30LAg0YLQstC+0LUg0L7QsdGJ0LXQvdC40LUsINC30LAg0L3QvtCy0L7RgdGC0Lgg0Lgg0LjQtNC10LgsINC60L7RgtC+0YDRi9C80Lgg0YLRiyDQtNC10LvQuNGI0YzRgdGPISDQn9C+0LTQsNGA0L7QuiDQsiDRiNC60LDRhNGDICjQsiDQvtCx0YnQtdC8INC60L7RgNC40LTQvtGA0LUpJyxcbiAgICAgICAgICAgIHRpbWVPdmVyOiAxNSxcbiAgICAgICAgICAgIG5leHRCdG5UZXh0OiAn0JXRidC1IScsXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICAgIHF1ZXN0aW9uOiAn0KHQu9C10LTRg9GO0YnQuNC5INC60L7QvdCy0LXRgNGCINGC0Ysg0L3QsNC50LTQtdGI0Ywg0YLQsNC8LCDQutGD0LTQsCDQv9C+0L/QsNC00LDRjtGCINGC0LLQvtC4INC90L7RgdC+0YfQutC4INC/0L7RgdC70LUg0YHRgtC40YDQutC4LicsXG4gICAgICAgICAgICBhbnN3ZXI6ICcxNTcnLFxuICAgICAgICAgICAgaGludDogJ9Cf0L7RgdC70LUg0YLQvtCz0L4sINC60LDQuiDQvtC90Lgg0LLRi9GB0L7RhdC70LgnLFxuICAgICAgICAgICAgc3VjY2Vzc01lc3NhZ2U6ICfQodC/0LDRgdC40LHQviDQt9CwINGH0LjRgdGC0L7RgtGDINC4INC/0L7RgNGP0LTQvtC6LCDQutC+0YLQvtGA0YvQtSDRgtGLINC00LvRjyDQvdCw0YEg0L/QvtC00LTQtdGA0LbQuNCy0LDQtdGI0YwhINCi0LLQvtC5INGB0LvQtdC00YPRjtGJ0LjQuSDQv9C+0LTQsNGA0L7QuiDQsiDQsNC90YLRgNC10YHQvtC70LghJyxcbiAgICAgICAgICAgIHRpbWVPdmVyOiAxNSxcbiAgICAgICAgICAgIG5leHRCdG5UZXh0OiAn0KPRgNCwLiDQlNCw0LvRjNGI0LUhJyxcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgcXVlc3Rpb246ICfQmNGC0LDQuiwg0L/QvtGB0LvQtdC00L3QtdC1INC30LDQtNCw0L3QuNC1LiDQntGC0LLQtdGCINC/0YDRj9GH0LXRgtGB0Y8g0LIg0LzQtdGI0LrQtSDQvdCw0LHQuNGC0L7QvCDQs9GD0YHQuNC90YvQvNC4INCy0L7Qu9C+0YHQsNC80LguJyxcbiAgICAgICAgICAgIGFuc3dlcjogJzM2OScsXG4gICAgICAgICAgICBoaW50OiAn0K3RgtC+INC/0L7QtNGD0YjQutCwJyxcbiAgICAgICAgICAgIHN1Y2Nlc3NNZXNzYWdlOiAn0KHQv9Cw0YHQuNCx0L4g0LfQsCDQu9GO0LHQvtCy0Ywg0Lgg0LvQsNGB0LrRgywg0LrQvtGC0L7RgNGL0LzQuCDRgtGLINC90LDRgSDRgdC+0LPRgNC10LLQsNC10YjRjCEg0KLQstC+0Lkg0L/QvtC00LDRgNC+0Log0L/QvtC0INC80LDRgtGA0LDRgdC+0LwuJyxcbiAgICAgICAgICAgIHRpbWVPdmVyOiAxNSxcbiAgICAgICAgICAgIG5leHRCdG5UZXh0OiAn0Jgt0Lgt0LguLi4nLFxuICAgICAgICB9LFxuICAgIF07XG5cbiAgICBjb25zdCBTZXR1cCA9IHtcbiAgICAgICAgZGVidWc6IHRydWUsXG4gICAgICAgIHNlY29uZHNUb0RhbmdlcjogMTAsXG4gICAgICAgIHNvdW5kczoge1xuICAgICAgICAgICAgZGFzaGE6ICcvYXNzZXRzL3NvdW5kcy9kYXNoYS5tcDMnLFxuICAgICAgICAgICAgYXBwbGF1c2U6ICcvYXNzZXRzL3NvdW5kcy9hcHBsYXVzZS5tcDMnLFxuICAgICAgICAgICAgZmlyZXdvcmtzOiAnL2Fzc2V0cy9zb3VuZHMvZmlyZXdvcmtzLm1wMycsXG4gICAgICAgICAgICBhbGFybTogJy9hc3NldHMvc291bmRzL2FsYXJtLm1wMycsXG4gICAgICAgICAgICB0aWNrOiAnL2Fzc2V0cy9zb3VuZHMvdGljay5tcDMnLFxuICAgICAgICB9LFxuICAgICAgICB3ZWxjb21lTWVzc2FnZTogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIG1lc3NhZ2U6ICfQn9GA0LjQstC10YIsINCU0LDRiNGD0LvRjNC60LAhINCh0LXQs9C+0LTQvdGPINGC0LLQvtC5INC00LXQvdGMINGA0L7QttC00LXQvdC40Y8sINCwINCyINC00LXQvdGMINGA0L7QttC00LXQvdC40Y8g0L/RgNC40L3Rj9GC0L4g0L/QvtC70YPRh9Cw0YLRjCDQv9C+0LTQsNGA0LrQuC4g0JzQvtC5INC/0L7QtNCw0YDQvtC6IC0g0Y3RgtC+INC40LPRgNCwLCDQsiDQutC+0YLQvtGA0L7QuSDRgtC10LHQtSDQvdGD0LbQvdC+INCx0YPQtNC10YIg0L3QsNC50YLQuCDQv9C+0LTQsNGA0LrQuC4g0JjRgtCw0LosINCy0L7Qt9Cy0YDQsNGJ0LDQudGB0Y8g0LIg0LrQvtC80L3QsNGC0YMsINCwINC30LDRgtC10Lwg0L3QsNC20LzQuCDQlNCw0LvQtdC1Li4uJyxcbiAgICAgICAgICAgICAgICBidG5UZXh0OiAn0JTQsNC70LXQtScsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIG1lc3NhZ2U6ICfQlNC+0LHRgNC+INC/0L7QttCw0LvQvtCy0LDRgtGMINCyINC/0YDQuNC60LvRjtGH0LXQvdC40LUsINCU0LDRiNCwLdC/0YPRgtC10YjQtdGB0YLQstC10L3QvdC40YbQsCEg0J3QsCDRgtCy0L7RkdC8INC/0YPRgtC4INCx0YPQtNGD0YIg0LfQsNC00LDQvdC40Y8g0L3QsCDQv9C+0LjRgdC6INC60L7QvdCy0LXRgNGC0L7Qsi4g0JIg0LrQvtC90LLQtdGA0YLQsNGFINCx0YPQtNC10YIg0YfQuNGB0LvQviwg0LrQvtGC0L7RgNC+0LUg0YLQtdCx0LUg0L3Rg9C20L3QviDQstCy0LXRgdGC0LguINCf0L7RgdC70LUg0Y3RgtC+0LPQviDRgtGLINGD0LfQvdCw0LXRiNGMLCDQs9C00LUg0LfQsNCx0YDQsNGC0Ywg0L/QvtC00LDRgNC+0LouINCh0YPRidC10YHRgtCy0YPRjtGCINC/0L7QtNGB0LrQsNC30LrQuCAtINC+0L3QuCDQv9C+0Y/QstC70Y/RjtGC0YHRjyDRgtC+0LPQtNCwLCDQutC+0LPQtNCwINC30LDQutCw0L3Rh9C40LLQsNC10YLRgdGPINCy0YDQtdC80Y8uINCf0L7QtdGF0LDQu9C4PycsXG4gICAgICAgICAgICAgICAgYnRuVGV4dDogJ9Cf0L7QtdGF0LDQu9C4IScsXG4gICAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgIH07XG5cbiAgICBsZXQgU291bmRzID0ge307XG5cblxuXG4gICAgLy8gUHJlbG9hZGVyXG4gICAgY2xhc3MgUHJlbG9hZGVyIHtcblxuICAgICAgICBjb25zdHJ1Y3RvcigpIHtcblxuICAgICAgICAgICAgdGhpcy5pbWFnZXNJc0xvYWRlZCA9IGZhbHNlO1xuICAgICAgICAgICAgdGhpcy5zb3VuZHNJc0xvYWRlZCA9IGZhbHNlO1xuXG4gICAgICAgICAgICB0aGlzLnByZWxvYWRCYWNrZ3JvdW5kSW1hZ2VzKCk7XG4gICAgICAgICAgICB0aGlzLnByZWxvYWRTb3VuZHMoKTtcblxuICAgICAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignYXNzZXRJc0xvYWRlZCcsIGZ1bmN0aW9uIChldmVudCkge1xuXG4gICAgICAgICAgICAgICAgaWYgKGV2ZW50LnNvdXJjZSA9PSAnaW1hZ2VzJykge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmltYWdlc0lzTG9hZGVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAoZXZlbnQuc291cmNlID09ICdzb3VuZHMnKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc291bmRzSXNMb2FkZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmltYWdlc0lzTG9hZGVkICYmIHRoaXMuc291bmRzSXNMb2FkZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgZG9jdW1lbnQuZGlzcGF0Y2hFdmVudChuZXcgRXZlbnQoJ2FsbEFzc2V0c0lzTG9hZGVkJykpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgfVxuXG4gICAgICAgIHByZWxvYWRCYWNrZ3JvdW5kSW1hZ2VzKCkge1xuXG4gICAgICAgICAgICB0aGlzLnByZWxvYWRCYWNrZ3JvdW5kSW1hZ2VzRWxlbWVudHNBcnIgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdwcmVsb2FkLWJhY2tncm91bmQnKTtcblxuICAgICAgICAgICAgdGhpcy50b3RhbEFtb3VudE9mSW1hZ2VzID0gdGhpcy5wcmVsb2FkQmFja2dyb3VuZEltYWdlc0VsZW1lbnRzQXJyLmxlbmd0aDtcbiAgICAgICAgICAgIHRoaXMuY3VycmVudEFtb3VudE9mTG9hZGVkSW1hZ2VzID0gMDtcblxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLnRvdGFsQW1vdW50T2ZJbWFnZXM7IGkrKykge1xuXG4gICAgICAgICAgICAgICAgbGV0IGVsZW1lbnQgPSB0aGlzLnByZWxvYWRCYWNrZ3JvdW5kSW1hZ2VzRWxlbWVudHNBcnJbaV07XG5cbiAgICAgICAgICAgICAgICBsZXQgc3R5bGUgPVxuICAgICAgICAgICAgICAgICAgICBlbGVtZW50LmN1cnJlbnRTdHlsZSB8fCB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZShlbGVtZW50LCBmYWxzZSksXG4gICAgICAgICAgICAgICAgICAgIHVybCA9IHN0eWxlXG4gICAgICAgICAgICAgICAgICAgICAgICAuYmFja2dyb3VuZEltYWdlXG4gICAgICAgICAgICAgICAgICAgICAgICAuc2xpY2UoNCwgLTEpXG4gICAgICAgICAgICAgICAgICAgICAgICAucmVwbGFjZSgvXCIvZywgXCJcIik7XG5cbiAgICAgICAgICAgICAgICB0aGlzLmltYWdlUHJlbG9hZGVyKHVybCk7XG5cbiAgICAgICAgICAgIH1cblxuICAgICAgICB9XG5cbiAgICAgICAgaW1hZ2VQcmVsb2FkZXIodXJsKSB7XG4gICAgICAgICAgICBsZXQgc2VsZiA9IHRoaXM7XG4gICAgICAgICAgICBsZXQgaW1nID0gbmV3IEltYWdlKCk7XG4gICAgICAgICAgICBpbWcuc3JjID0gdXJsO1xuICAgICAgICAgICAgaW1nLm9ubG9hZCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBzZWxmLmltYWdlSXNMb2FkZWQoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChpbWcuY29tcGxldGUpIGltZy5vbmxvYWQoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGltYWdlSXNMb2FkZWQoKSB7XG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRBbW91bnRPZkxvYWRlZEltYWdlcysrO1xuICAgICAgICAgICAgaWYgKHRoaXMuY3VycmVudEFtb3VudE9mTG9hZGVkSW1hZ2VzID49IHRoaXMudG90YWxBbW91bnRPZkltYWdlcykge1xuICAgICAgICAgICAgICAgIGxldCBldmVudCA9IG5ldyBFdmVudCgnYXNzZXRJc0xvYWRlZCcpO1xuICAgICAgICAgICAgICAgIGV2ZW50LnNvdXJjZSA9ICdpbWFnZXMnO1xuICAgICAgICAgICAgICAgIGRvY3VtZW50LmRpc3BhdGNoRXZlbnQoZXZlbnQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcHJlbG9hZFNvdW5kcygpIHtcblxuICAgICAgICAgICAgbGV0IHNlbGYgPSB0aGlzO1xuXG4gICAgICAgICAgICB0aGlzLnByZWxvYWRTb3VuZHNBcnIgPSBTZXR1cC5zb3VuZHM7XG5cbiAgICAgICAgICAgIHRoaXMudG90YWxBbW91bnRPZlNvdW5kcyA9IE9iamVjdC5rZXlzKFNldHVwLnNvdW5kcykubGVuZ3RoO1xuICAgICAgICAgICAgdGhpcy5jdXJyZW50QW1vdW50T2ZMb2FkZWRTb3VuZHMgPSAwO1xuXG4gICAgICAgICAgICBsZXQgdGVtcFNvdW5kcyA9IHt9O1xuXG4gICAgICAgICAgICBmb3IgKGxldCBuYW1lIGluIFNldHVwLnNvdW5kcykge1xuXG4gICAgICAgICAgICAgICAgdGVtcFNvdW5kc1tuYW1lXSA9IG5ldyBBdWRpbyhTZXR1cC5zb3VuZHNbbmFtZV0pO1xuXG4gICAgICAgICAgICAgICAgdGVtcFNvdW5kc1tuYW1lXS5hZGRFdmVudExpc3RlbmVyKCdjYW5wbGF5dGhyb3VnaCcsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5zb3VuZElzTG9hZGVkKCk7XG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgU291bmRzID0gdGVtcFNvdW5kcztcblxuICAgICAgICB9XG5cbiAgICAgICAgc291bmRJc0xvYWRlZCgpIHtcbiAgICAgICAgICAgIHRoaXMuY3VycmVudEFtb3VudE9mTG9hZGVkU291bmRzICsrO1xuICAgICAgICAgICAgaWYgKHRoaXMuY3VycmVudEFtb3VudE9mTG9hZGVkU291bmRzID49IHRoaXMudG90YWxBbW91bnRPZlNvdW5kcykge1xuICAgICAgICAgICAgICAgIGxldCBldmVudCA9IG5ldyBFdmVudCgnYXNzZXRJc0xvYWRlZCcpO1xuICAgICAgICAgICAgICAgIGV2ZW50LnNvdXJjZSA9ICdzb3VuZHMnO1xuICAgICAgICAgICAgICAgIGRvY3VtZW50LmRpc3BhdGNoRXZlbnQoZXZlbnQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICB9XG5cbiAgICAvLyBNYWluIENvbXBvbmVudFxuICAgIGNsYXNzIEdhbWUge1xuXG4gICAgICAgIGNvbnN0cnVjdG9yKCkge1xuXG4gICAgICAgICAgICBuZXcgUHJlbG9hZGVyKCk7XG5cbiAgICAgICAgICAgIC8vIFNjcmVlbnNcbiAgICAgICAgICAgIHRoaXMubG9hZGluZ1NjcmVlbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdsb2FkaW5nJyk7XG4gICAgICAgICAgICB0aGlzLnB5cm9TY3JlZW4gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncHlybycpO1xuICAgICAgICAgICAgdGhpcy5nYW1lT3ZlclNjcmVlbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdnYW1lLW92ZXInKTtcblxuXG4gICAgICAgICAgICAvLyBDb21wb25lbnRzXG4gICAgICAgICAgICB0aGlzLkZ1bGxzY3JlZW5Db21wb25lbnQgPSBuZXcgRnVsbHNjcmVlbkNvbXBvbmVudCgpO1xuICAgICAgICAgICAgdGhpcy5XZWxjb21lQ29tcG9uZW50ID0gbmV3IFdlbGNvbWUoKTtcbiAgICAgICAgICAgIHRoaXMuQ29tbW9uVGltZXJDb21wb25lbnQgPSBuZXcgQ29tbW9uVGltZXJDb21wb25lbnQoKTtcbiAgICAgICAgICAgIHRoaXMuUXVlc3RDb21wb25lbnQgPSBuZXcgUXVlc3RDb21wb25lbnQoKTtcblxuXG4gICAgICAgICAgICAvLyBCaW5kIEV2ZW50c1xuICAgICAgICAgICAgdGhpcy5pbml0RXZlbnRzKCk7XG5cbiAgICAgICAgfVxuXG4gICAgICAgIC8vIEJpbmcgRXZlbnRzXG4gICAgICAgIGluaXRFdmVudHMoKSB7XG5cbiAgICAgICAgICAgIGxldCBzZWxmID0gdGhpcztcblxuICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgZG9jdW1lbnQuZGlzcGF0Y2hFdmVudChuZXcgRXZlbnQoJ2FsbEFzc2V0c0lzTG9hZGVkJykpO1xuICAgICAgICAgICAgfSwgMzAwMCk7XG5cbiAgICAgICAgICAgIC8vIEFwcCBpcyBMb2FkZWRcbiAgICAgICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2FsbEFzc2V0c0lzTG9hZGVkJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHNlbGYuaGlkZUxvYWRpbmcoKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAvLyBGdWxsc2NyZWVuIERvbmVcbiAgICAgICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2Z1bGxzY3JlZW5Eb25lJywgZnVuY3Rpb24gKCkge1xuXG4gICAgICAgICAgICAgICAgc2VsZi5XZWxjb21lQ29tcG9uZW50LnNob3coKTtcblxuICAgICAgICAgICAgfSk7XG5cblxuICAgICAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignd2VsY29tZURvbmUnLCBmdW5jdGlvbiAoKSB7XG5cbiAgICAgICAgICAgICAgICBzZWxmLldlbGNvbWVDb21wb25lbnQuaGlkZSgpO1xuICAgICAgICAgICAgICAgIHNlbGYuUXVlc3RDb21wb25lbnQuc2hvdygpO1xuICAgICAgICAgICAgICAgIHNlbGYuQ29tbW9uVGltZXJDb21wb25lbnQuc3RhcnQoKTtcblxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIC8vIFF1ZXN0IERvbmVcbiAgICAgICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2V2ZW50UXVlc3RTdWNjZXNzJywgZnVuY3Rpb24gKCkge1xuXG4gICAgICAgICAgICAgICAgc2VsZi5Db21tb25UaW1lckNvbXBvbmVudC5zdG9wKCk7XG4gICAgICAgICAgICAgICAgc2VsZi5RdWVzdENvbXBvbmVudC5oaWRlKCk7XG4gICAgICAgICAgICAgICAgc2VsZi5nYW1lT3ZlclNjcmVlbi5jbGFzc0xpc3QuYWRkKCdzaG93Jyk7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ0dhbWUgT3ZlciEhIScpO1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHNlbGYuQ29tbW9uVGltZXJDb21wb25lbnQuZ2V0Q29tbW9uVGltZSgpKTtcblxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIC8vIFBhdXNlIENvbW1vbiBUaW1lclxuICAgICAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigncGF1c2VUaW1lcicsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBzZWxmLkNvbW1vblRpbWVyQ29tcG9uZW50LnBhdXNlKCk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgLy8gQ29udGludWUgQ29tbW9uIFRpbWVyXG4gICAgICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdjb250aW51ZVRpbWVyJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHNlbGYuQ29tbW9uVGltZXJDb21wb25lbnQuY29udGludWUoKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgIH1cblxuICAgICAgICAvL0xvYWRpbmdcbiAgICAgICAgaGlkZUxvYWRpbmcoKSB7XG4gICAgICAgICAgICB0aGlzLmxvYWRpbmdTY3JlZW4uY2xhc3NMaXN0LnJlbW92ZSgnc2hvdycpO1xuICAgICAgICB9XG5cbiAgICB9XG5cbiAgICAvLyBGdWxsc2NyZWVuIENsYXNzXG4gICAgY2xhc3MgRnVsbHNjcmVlbkNvbXBvbmVudCB7XG5cbiAgICAgICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgICAgICB0aGlzLmNvbnRhaW5lciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdmdWxsc2NyZWVuJyk7XG4gICAgICAgICAgICB0aGlzLmNvbnRhaW5lci5jbGFzc0xpc3QuYWRkKCdzaG93Jyk7XG4gICAgICAgICAgICB0aGlzLmJ0biA9IHRoaXMuY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoJ2J1dHRvbicpO1xuICAgICAgICAgICAgdGhpcy5mdWxsc2NyZWVuRG9uZSA9IG5ldyBFdmVudCgnZnVsbHNjcmVlbkRvbmUnKTtcbiAgICAgICAgICAgIGxldCBzZWxmID0gdGhpcztcbiAgICAgICAgICAgIHRoaXMuYnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIGlmICghU2V0dXAuZGVidWcpIHtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5sYXVuY2hGdWxsU2NyZWVuKGRvY3VtZW50LmRvY3VtZW50RWxlbWVudCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHNlbGYuYnRuLmNsYXNzTGlzdC5hZGQoJ3NvZnRfaGlkZScpO1xuICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICBzZWxmLmNvbnRhaW5lci5jbGFzc0xpc3QucmVtb3ZlKCdzaG93Jyk7XG4gICAgICAgICAgICAgICAgICAgIGRvY3VtZW50LmRpc3BhdGNoRXZlbnQoc2VsZi5mdWxsc2NyZWVuRG9uZSk7XG4gICAgICAgICAgICAgICAgfSwgMTAwMCk7XG4gICAgICAgICAgICB9KVxuICAgICAgICB9XG5cbiAgICAgICAgbGF1bmNoRnVsbFNjcmVlbihlbGVtZW50KSB7XG4gICAgICAgICAgICBpZihlbGVtZW50LnJlcXVlc3RGdWxsU2NyZWVuKSB7XG4gICAgICAgICAgICAgICAgZWxlbWVudC5yZXF1ZXN0RnVsbFNjcmVlbigpO1xuICAgICAgICAgICAgfSBlbHNlIGlmKGVsZW1lbnQubW96UmVxdWVzdEZ1bGxTY3JlZW4pIHtcbiAgICAgICAgICAgICAgICBlbGVtZW50Lm1velJlcXVlc3RGdWxsU2NyZWVuKCk7XG4gICAgICAgICAgICB9IGVsc2UgaWYoZWxlbWVudC53ZWJraXRSZXF1ZXN0RnVsbFNjcmVlbikge1xuICAgICAgICAgICAgICAgIGVsZW1lbnQud2Via2l0UmVxdWVzdEZ1bGxTY3JlZW4oKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGNhbmNlbEZ1bGxzY3JlZW4oKSB7XG4gICAgICAgICAgICBpZihkb2N1bWVudC5jYW5jZWxGdWxsU2NyZWVuKSB7XG4gICAgICAgICAgICAgICAgZG9jdW1lbnQuY2FuY2VsRnVsbFNjcmVlbigpO1xuICAgICAgICAgICAgfSBlbHNlIGlmKGRvY3VtZW50Lm1vekNhbmNlbEZ1bGxTY3JlZW4pIHtcbiAgICAgICAgICAgICAgICBkb2N1bWVudC5tb3pDYW5jZWxGdWxsU2NyZWVuKCk7XG4gICAgICAgICAgICB9IGVsc2UgaWYoZG9jdW1lbnQud2Via2l0Q2FuY2VsRnVsbFNjcmVlbikge1xuICAgICAgICAgICAgICAgIGRvY3VtZW50LndlYmtpdENhbmNlbEZ1bGxTY3JlZW4oKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgfVxuXG4gICAgLy8gV2VsY29tZSBNZXNzYWdlc1xuICAgIGNsYXNzIFdlbGNvbWUge1xuXG4gICAgICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICAgICAgdGhpcy5jb250YWluZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnd2VsY29tZScpO1xuICAgICAgICAgICAgdGhpcy5hcHBlYXJ0aW5CbG9jayA9IHRoaXMuY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoJyN3ZWxjb21lLXRleHQnKTtcbiAgICAgICAgICAgIHRoaXMudGV4dCA9IHRoaXMuY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoJyN3ZWxjb21lLXRleHQgPiBwJyk7XG4gICAgICAgICAgICB0aGlzLm5leHRCdG4gPSB0aGlzLmNvbnRhaW5lci5xdWVyeVNlbGVjdG9yKCdidXR0b24jd2VsY29tZS1uZXh0LWJ0bicpO1xuICAgICAgICAgICAgdGhpcy5ldmVudERvbmUgPSBuZXcgRXZlbnQoJ3dlbGNvbWVEb25lJyk7XG4gICAgICAgICAgICB0aGlzLm11c2ljRGFzaGEgPSBuZXcgUGxheWVyKFNldHVwLnNvdW5kcy5kYXNoYSk7XG4gICAgICAgICAgICB0aGlzLmluaXQoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGluaXQoKSB7XG5cbiAgICAgICAgICAgIHRoaXMuY3VycmVudE1lc3NhZ2UgPSAwO1xuXG4gICAgICAgICAgICB0aGlzLmZpbGxGaWVsZHMoKTtcblxuICAgICAgICAgICAgbGV0IHNlbGYgPSB0aGlzO1xuICAgICAgICAgICAgdGhpcy5uZXh0QnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIGlmIChzZWxmLmN1cnJlbnRNZXNzYWdlID09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFTZXR1cC5kZWJ1Zykge1xuICAgICAgICAgICAgICAgICAgICAgICAgU291bmRzLmRhc2hhLnBsYXkoKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoc2VsZi5jdXJyZW50TWVzc2FnZSA9PSAxKSB7XG4gICAgICAgICAgICAgICAgICAgIFNvdW5kcy50aWNrLnZvbHVtZSA9IDA7XG4gICAgICAgICAgICAgICAgICAgIFNvdW5kcy50aWNrLmxvb3AgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICBTb3VuZHMudGljay5wbGF5KCk7XG4gICAgICAgICAgICAgICAgICAgIFNvdW5kcy5hbGFybS52b2x1bWUgPSAwO1xuICAgICAgICAgICAgICAgICAgICBTb3VuZHMuYWxhcm0ubG9vcCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIFNvdW5kcy5hbGFybS5wbGF5KCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHNlbGYubmV4dE1lc3NhZ2UoKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgIH1cblxuICAgICAgICBmaWxsRmllbGRzKCkge1xuICAgICAgICAgICAgdGhpcy50ZXh0LmlubmVyVGV4dCA9IFNldHVwLndlbGNvbWVNZXNzYWdlW3RoaXMuY3VycmVudE1lc3NhZ2VdLm1lc3NhZ2U7XG4gICAgICAgICAgICB0aGlzLm5leHRCdG4uaW5uZXJUZXh0ID0gU2V0dXAud2VsY29tZU1lc3NhZ2VbdGhpcy5jdXJyZW50TWVzc2FnZV0uYnRuVGV4dDtcbiAgICAgICAgfVxuXG4gICAgICAgIG5leHRNZXNzYWdlKCkge1xuICAgICAgICAgICAgdGhpcy5jdXJyZW50TWVzc2FnZSsrO1xuICAgICAgICAgICAgaWYgKHRoaXMuY3VycmVudE1lc3NhZ2UgPj0gU2V0dXAud2VsY29tZU1lc3NhZ2UubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5tdXNpY0Rhc2hhLnN0b3AoKTtcbiAgICAgICAgICAgICAgICBkb2N1bWVudC5kaXNwYXRjaEV2ZW50KHRoaXMuZXZlbnREb25lKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuY3VycmVudE1lc3NhZ2UgPT0gMSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoIVNldHVwLmRlYnVnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm11c2ljRGFzaGEucGxheSgpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRoaXMuZmlsbEZpZWxkcygpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgc2hvdygpIHtcbiAgICAgICAgICAgIHRoaXMuY29udGFpbmVyLmNsYXNzTGlzdC5hZGQoJ3Nob3cnKTtcbiAgICAgICAgICAgIHRoaXMuYXBwZWFydGluQmxvY2suY2xhc3NMaXN0LmFkZCgnc2hvdycpO1xuICAgICAgICAgICAgdGhpcy5uZXh0QnRuLmNsYXNzTGlzdC5hZGQoJ3Nob3cnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGhpZGUoKSB7XG4gICAgICAgICAgICB0aGlzLmNvbnRhaW5lci5jbGFzc0xpc3QucmVtb3ZlKCdzaG93Jyk7XG4gICAgICAgIH1cblxuICAgIH1cblxuICAgIC8vIENvbW1vblRpbWUgQ2xhc3NcbiAgICBjbGFzcyBDb21tb25UaW1lckNvbXBvbmVudCB7XG5cbiAgICAgICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRTZWNvbmRzID0gMDtcbiAgICAgICAgICAgIHRoaXMuaXNQYXVzZWQgPSBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHN0YXJ0KCkge1xuICAgICAgICAgICAgbGV0IHNlbGYgPSB0aGlzO1xuICAgICAgICAgICAgdGhpcy50aW1lciA9IHNldEludGVydmFsKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBpZiAoIXNlbGYuaXNQYXVzZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5jdXJyZW50U2Vjb25kcyArKztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LCAxMDAwKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHBhdXNlKCkge1xuICAgICAgICAgICAgdGhpcy5pc1BhdXNlZCA9IHRydWU7XG4gICAgICAgIH1cblxuICAgICAgICBjb250aW51ZSgpIHtcbiAgICAgICAgICAgIHRoaXMuaXNQYXVzZWQgPSBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHN0b3AoKSB7XG4gICAgICAgICAgICBjbGVhckludGVydmFsKHRoaXMudGltZXIpO1xuICAgICAgICB9XG5cbiAgICAgICAgZ2V0Q29tbW9uVGltZSgpIHtcblxuICAgICAgICAgICAgbGV0IG1pbnV0ZXMgPSBNYXRoLmZsb29yKHRoaXMuY3VycmVudFNlY29uZHMgLyA2MCk7XG4gICAgICAgICAgICBsZXQgc2Vjb25kcyA9IHRoaXMuY3VycmVudFNlY29uZHMgJSA2MDtcblxuICAgICAgICAgICAgaWYgKG1pbnV0ZXMgPCAxMCkge1xuICAgICAgICAgICAgICAgIG1pbnV0ZXMgPSAnMCcgKyBtaW51dGVzO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoc2Vjb25kcyA8IDEwKSB7XG4gICAgICAgICAgICAgICAgc2Vjb25kcyA9ICcwJyArIHNlY29uZHM7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBtaW51dGVzICsgJzonICsgc2Vjb25kczs7XG4gICAgICAgIH1cblxuICAgIH1cblxuICAgIC8vIFFlc3RTdGVwIENsYXNzXG4gICAgY2xhc3MgUXVlc3RDb21wb25lbnQge1xuXG4gICAgICAgIGNvbnN0cnVjdG9yKCkge1xuXG4gICAgICAgICAgICB0aGlzLmNvbnRhaW5lciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdxdWVzdCcpO1xuXG4gICAgICAgICAgICB0aGlzLnRleHQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndGV4dCcpO1xuICAgICAgICAgICAgdGhpcy5pbnB1dCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdhbnN3ZXItaW5wdXQnKTtcblxuICAgICAgICAgICAgdGhpcy5zdWNjZXNzTWVzc2FnZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzdWNjZXNzLW1lc3NhZ2UnKTtcbiAgICAgICAgICAgIHRoaXMuc3VjY2Vzc01lc3NhZ2VUZXh0ID0gdGhpcy5zdWNjZXNzTWVzc2FnZS5xdWVyeVNlbGVjdG9yKCdwI3RleHQtc3VjY2Vzcy1tZXNzYWdlJyk7XG4gICAgICAgICAgICB0aGlzLm5leHRRdWVzdEJ0biA9IHRoaXMuc3VjY2Vzc01lc3NhZ2UucXVlcnlTZWxlY3RvcignYnV0dG9uI25leHQtcXVlc3QtYnRuJyk7XG5cbiAgICAgICAgICAgIHRoaXMuaGludEJ0biA9IHRoaXMuY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoJ2J1dHRvbiNoaW50LWJ0bicpO1xuXG4gICAgICAgICAgICB0aGlzLnN1Y2Nlc0V2ZW50ID0gbmV3IEV2ZW50KCdldmVudFF1ZXN0U3VjY2VzcycpO1xuICAgICAgICAgICAgdGhpcy5wYXVzZUNvbW1vblRpbWVyID0gbmV3IEV2ZW50KCdwYXVzZVRpbWVyJyk7XG4gICAgICAgICAgICB0aGlzLmNvbnRpbnVlQ29tbW9uVGltZXIgPSBuZXcgRXZlbnQoJ2NvbnRpbnVlVGltZXInKTtcbiAgICAgICAgICAgIHRoaXMuc3RvcFRpY2tTb3VuZCA9IG5ldyBFdmVudCgnc3RvcFRpY2tTb3VuZCcpO1xuICAgICAgICAgICAgdGhpcy5zdG9wQWxhcm1Tb3VuZCA9IG5ldyBFdmVudCgnc3RvcEFsYXJtU291bmQnKTtcblxuICAgICAgICAgICAgdGhpcy5zb3VuZEFwcGxhdXNlID0gbmV3IFBsYXllcihTZXR1cC5zb3VuZHMuYXBwbGF1c2UpO1xuICAgICAgICAgICAgdGhpcy5zb3VuZEZpcmV3b3JrcyA9IG5ldyBQbGF5ZXIoU2V0dXAuc291bmRzLmZpcmV3b3Jrcyk7XG5cbiAgICAgICAgICAgIHRoaXMuaW5pdCgpO1xuXG4gICAgICAgIH1cblxuICAgICAgICBpbml0KCkge1xuXG4gICAgICAgICAgICB0aGlzLnN0ZXBOdW1iZXIgPSAxO1xuXG4gICAgICAgICAgICB0aGlzLmZpbGxGaWVsZHMoKTtcblxuICAgICAgICAgICAgbGV0IHNlbGYgPSB0aGlzO1xuXG4gICAgICAgICAgICB0aGlzLmlucHV0LnNldEF0dHJpYnV0ZSgnbWF4bGVuZ3RoJywgdGhpcy5hbnN3ZXIubGVuZ3RoKTtcblxuICAgICAgICAgICAgdGhpcy5pbnB1dC5hZGRFdmVudExpc3RlbmVyKCdpbnB1dCcsIGZ1bmN0aW9uICgpIHtcblxuICAgICAgICAgICAgICAgIGlmICh0aGlzLnZhbHVlLmxlbmd0aCA9PSBzZWxmLmFuc3dlci5sZW5ndGgpIHtcblxuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy52YWx1ZSA9PSBzZWxmLmFuc3dlcikge1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxmLnJpZ2h0QW5zd2VyKCk7XG5cbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcblxuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5pbnB1dC5jbGFzc0xpc3QuYWRkKCd3cm9uZycpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZWxmLmlucHV0LmNsYXNzTGlzdC5yZW1vdmUoJ3dyb25nJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5pbnB1dC52YWx1ZSA9ICcnO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSwgMTUwMCk7XG5cbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgdGhpcy5oaW50QnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHNlbGYuSGludENvbXBvbmVudC5zaG93KCk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgdGhpcy5uZXh0UXVlc3RCdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbiAoKSB7XG5cbiAgICAgICAgICAgICAgICBzZWxmLnN1Y2Nlc3NNZXNzYWdlLmNsYXNzTGlzdC5yZW1vdmUoJ3Nob3cnKTtcblxuICAgICAgICAgICAgICAgIHNlbGYubmV4dFN0ZXAoKTtcblxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2ZhaWxUaW1lcicsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBzZWxmLmhpbnRCdG4uY2xhc3NMaXN0LmFkZCgnc2hvdycpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgfVxuXG4gICAgICAgIHJpZ2h0QW5zd2VyKCkge1xuXG4gICAgICAgICAgICB0aGlzLlRpbWVyLnN0b3AoKTtcblxuICAgICAgICAgICAgZG9jdW1lbnQuZGlzcGF0Y2hFdmVudCh0aGlzLnBhdXNlQ29tbW9uVGltZXIpO1xuXG4gICAgICAgICAgICB0aGlzLnN1Y2Nlc3NNZXNzYWdlLmNsYXNzTGlzdC5hZGQoJ3Nob3cnKTtcbiAgICAgICAgICAgIHRoaXMuc3VjY2Vzc01lc3NhZ2VUZXh0LmZvY3VzKCk7XG5cbiAgICAgICAgICAgIFNvdW5kcy5hcHBsYXVzZS5wbGF5KCk7XG4gICAgICAgICAgICBTb3VuZHMuZmlyZXdvcmtzLnBsYXkoKTtcbiAgICAgICAgICAgIFNvdW5kcy50aWNrLnZvbHVtZSA9IDA7XG4gICAgICAgICAgICBTb3VuZHMuYWxhcm0udm9sdW1lID0gMDtcblxuICAgICAgICB9XG5cbiAgICAgICAgbmV4dFN0ZXAoKSB7XG4gICAgICAgICAgICB0aGlzLnN0ZXBOdW1iZXIrKztcbiAgICAgICAgICAgIGlmICh0aGlzLnN0ZXBOdW1iZXIgPj0gU3RlcHMubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgZG9jdW1lbnQuZGlzcGF0Y2hFdmVudCh0aGlzLnN1Y2Nlc0V2ZW50KTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5maWxsRmllbGRzKCk7XG4gICAgICAgICAgICAgICAgZG9jdW1lbnQuZGlzcGF0Y2hFdmVudCh0aGlzLmNvbnRpbnVlQ29tbW9uVGltZXIpO1xuICAgICAgICAgICAgICAgIHRoaXMuVGltZXIuc3RhcnQoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGZpbGxGaWVsZHMoKSB7XG4gICAgICAgICAgICB0aGlzLnF1ZXN0aW9uID0gU3RlcHNbdGhpcy5zdGVwTnVtYmVyXS5xdWVzdGlvbjtcbiAgICAgICAgICAgIHRoaXMudGV4dC5pbm5lclRleHQgPSB0aGlzLnF1ZXN0aW9uO1xuICAgICAgICAgICAgdGhpcy5hbnN3ZXIgPSBTdGVwc1t0aGlzLnN0ZXBOdW1iZXJdLmFuc3dlcjtcblxuICAgICAgICAgICAgdGhpcy5zdWNjZXNzTWVzc2FnZVRleHQuaW5uZXJUZXh0ID0gU3RlcHNbdGhpcy5zdGVwTnVtYmVyXS5zdWNjZXNzTWVzc2FnZTtcbiAgICAgICAgICAgIHRoaXMubmV4dFF1ZXN0QnRuLmlubmVyVGV4dCA9IFN0ZXBzW3RoaXMuc3RlcE51bWJlcl0ubmV4dEJ0blRleHQ7XG5cbiAgICAgICAgICAgIHRoaXMudGltZXJPdmVyID0gU3RlcHNbdGhpcy5zdGVwTnVtYmVyXS50aW1lT3ZlcjtcbiAgICAgICAgICAgIHRoaXMuVGltZXIgPSBuZXcgVGltZXIodGhpcy50aW1lck92ZXIpO1xuXG4gICAgICAgICAgICB0aGlzLmhpbnRUZXh0ID0gU3RlcHNbdGhpcy5zdGVwTnVtYmVyXS5oaW50O1xuICAgICAgICAgICAgdGhpcy5IaW50Q29tcG9uZW50ID0gbmV3IEhpbnRDb21wb25lbnQodGhpcy5oaW50VGV4dCk7XG5cbiAgICAgICAgICAgIHRoaXMuaW5wdXQudmFsdWUgPSAnJztcbiAgICAgICAgICAgIHRoaXMuaGludEJ0bi5jbGFzc0xpc3QucmVtb3ZlKCdzaG93Jyk7XG4gICAgICAgIH1cblxuICAgICAgICBzaG93KCkge1xuICAgICAgICAgICAgdGhpcy5jb250YWluZXIuY2xhc3NMaXN0LmFkZCgnc2hvdycpO1xuICAgICAgICAgICAgdGhpcy5pbnB1dC5jbGFzc0xpc3QuYWRkKCdzaG93Jyk7XG4gICAgICAgICAgICB0aGlzLlRpbWVyLnN0YXJ0KCk7XG4gICAgICAgIH1cblxuICAgICAgICBoaWRlKCkge1xuICAgICAgICAgICAgdGhpcy5jb250YWluZXIuY2xhc3NMaXN0LnJlbW92ZSgnc2hvdycpO1xuICAgICAgICB9XG5cblxuXG4gICAgfVxuXG4gICAgLy8gUXVlc3QgVGltZXJcbiAgICBjbGFzcyBUaW1lciB7XG5cbiAgICAgICAgY29uc3RydWN0b3IodGltZU92ZXIpIHtcblxuICAgICAgICAgICAgdGhpcy5jb250YWluZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndGltZXInKTtcbiAgICAgICAgICAgIHRoaXMuYXZhaWxhYmxlU2Vjb25kcyA9IHRpbWVPdmVyO1xuXG4gICAgICAgICAgICB0aGlzLnNob3dUaW1lclZhbHVlKCk7XG5cbiAgICAgICAgICAgIHRoaXMuZmFpbEV2ZW50ID0gbmV3IEV2ZW50KCdmYWlsVGltZXInKTtcblxuICAgICAgICAgICAgdGhpcy5zZWNvbmRzVG9EYW5nZXIgPSBTZXR1cC5zZWNvbmRzVG9EYW5nZXI7XG5cbiAgICAgICAgfVxuXG4gICAgICAgIHN0YXJ0KCkge1xuXG4gICAgICAgICAgICBsZXQgc2VsZiA9IHRoaXM7XG5cbiAgICAgICAgICAgIHRoaXMuY29udGFpbmVyLmNsYXNzTGlzdC5hZGQoJ2RhbmdlcicpO1xuXG4gICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBzZWxmLmNvbnRhaW5lci5jbGFzc0xpc3QucmVtb3ZlKCdkYW5nZXInKTtcbiAgICAgICAgICAgIH0sIDgwMCk7XG5cbiAgICAgICAgICAgIHRoaXMudGltZXIgPSBzZXRJbnRlcnZhbChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgc2VsZi5hdmFpbGFibGVTZWNvbmRzIC0tO1xuXG4gICAgICAgICAgICAgICAgc2VsZi5jaGVja0RhbmdlcigpO1xuICAgICAgICAgICAgICAgIHNlbGYuY2hlY2tUaW1lSXNPdmVyKCk7XG4gICAgICAgICAgICAgICAgc2VsZi5zaG93VGltZXJWYWx1ZSgpO1xuXG4gICAgICAgICAgICB9LCAxMDAwKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHN0b3AoKSB7XG4gICAgICAgICAgICBjbGVhckludGVydmFsKHRoaXMudGltZXIpO1xuICAgICAgICB9XG5cbiAgICAgICAgc2hvd1RpbWVyVmFsdWUoKSB7XG5cbiAgICAgICAgICAgIGxldCBtaW51dGVzID0gTWF0aC5mbG9vcih0aGlzLmF2YWlsYWJsZVNlY29uZHMgLyA2MCk7XG4gICAgICAgICAgICBsZXQgc2Vjb25kcyA9IHRoaXMuYXZhaWxhYmxlU2Vjb25kcyAlIDYwO1xuXG4gICAgICAgICAgICBpZiAobWludXRlcyA8IDEwKSB7XG4gICAgICAgICAgICAgICAgbWludXRlcyA9ICcwJyArIG1pbnV0ZXM7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChzZWNvbmRzIDwgMTApIHtcbiAgICAgICAgICAgICAgICBzZWNvbmRzID0gJzAnICsgc2Vjb25kcztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5jb250YWluZXIuaW5uZXJUZXh0ID0gbWludXRlcyArICc6JyArIHNlY29uZHM7XG5cbiAgICAgICAgfVxuXG4gICAgICAgIGNoZWNrRGFuZ2VyKCkge1xuICAgICAgICAgICAgaWYgKHRoaXMuYXZhaWxhYmxlU2Vjb25kcyA8IHRoaXMuc2Vjb25kc1RvRGFuZ2VyKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5jb250YWluZXIuY2xhc3NMaXN0LmFkZCgnZGFuZ2VyJyk7XG4gICAgICAgICAgICAgICAgU291bmRzLnRpY2sudm9sdW1lID0gMTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGNoZWNrVGltZUlzT3ZlcigpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLmF2YWlsYWJsZVNlY29uZHMgPCAxKSB7XG4gICAgICAgICAgICAgICAgY2xlYXJJbnRlcnZhbCh0aGlzLnRpbWVyKTtcbiAgICAgICAgICAgICAgICBTb3VuZHMuYWxhcm0udm9sdW1lID0gMTtcbiAgICAgICAgICAgICAgICBTb3VuZHMudGljay52b2x1bWUgPSAwO1xuICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICBTb3VuZHMuYWxhcm0udm9sdW1lID0gMDtcbiAgICAgICAgICAgICAgICB9LCAyMDAwKTtcbiAgICAgICAgICAgICAgICBkb2N1bWVudC5kaXNwYXRjaEV2ZW50KHRoaXMuZmFpbEV2ZW50KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgfVxuXG4gICAgLy8gSGludCBDb21wb25lbnRcbiAgICBjbGFzcyBIaW50Q29tcG9uZW50IHtcbiAgICAgICAgY29uc3RydWN0b3IobWVzc2FnZSkge1xuICAgICAgICAgICAgdGhpcy5jb250YWluZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnaGludCcpO1xuICAgICAgICAgICAgdGhpcy5oaW50VGV4dCA9IHRoaXMuY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoJ3AjaGludC10ZXh0Jyk7XG4gICAgICAgICAgICB0aGlzLmNsb3NlQnRuID0gdGhpcy5jb250YWluZXIucXVlcnlTZWxlY3RvcignYnV0dG9uI2Nsb3NlLWhpbnQnKTtcblxuICAgICAgICAgICAgdGhpcy5oaW50VGV4dC5pbm5lclRleHQgPSBtZXNzYWdlO1xuXG4gICAgICAgICAgICB0aGlzLmluaXQoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGluaXQoKSB7XG4gICAgICAgICAgICBsZXQgc2VsZiA9IHRoaXM7XG4gICAgICAgICAgICB0aGlzLmNsb3NlQnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHNlbGYuaGlkZSgpO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgfVxuXG4gICAgICAgIHNob3coKSB7XG4gICAgICAgICAgICB0aGlzLmNvbnRhaW5lci5jbGFzc0xpc3QuYWRkKCdzaG93Jyk7XG4gICAgICAgIH1cbiAgICAgICAgaGlkZSgpIHtcbiAgICAgICAgICAgIHRoaXMuY29udGFpbmVyLmNsYXNzTGlzdC5yZW1vdmUoJ3Nob3cnKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vIFBsYXllciBDb21wb25lbnRcbiAgICBjbGFzcyBQbGF5ZXIge1xuXG4gICAgICAgIGNvbnN0cnVjdG9yKHBhdGhUb0ZpbGUsIGxvb3AgPSBmYWxzZSkge1xuICAgICAgICAgICAgdGhpcy5wbGF5QnRuID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3BsYXknKTtcbiAgICAgICAgICAgIHRoaXMuc3RvcEJ0biA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzdG9wJyk7XG5cblxuICAgICAgICAgICAgdGhpcy5zb3VuZCA9IG5ldyBBdWRpbyhwYXRoVG9GaWxlKTtcbiAgICAgICAgICAgIHRoaXMuc291bmQubG9vcCA9IGxvb3A7XG5cbiAgICAgICAgICAgIHRoaXMuaW5pdCgpO1xuICAgICAgICB9XG5cbiAgICAgICAgaW5pdCgpIHtcbiAgICAgICAgICAgIGxldCBzZWxmID0gdGhpcztcbiAgICAgICAgICAgIHRoaXMucGxheUJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBzZWxmLnBsYXkoKTtcbiAgICAgICAgICAgICAgICBzZWxmLnNob3dTdG9wQnRuKCk7XG4gICAgICAgICAgICAgICAgc2VsZi5oaWRlUGxheUJ0bigpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB0aGlzLnN0b3BCdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgc2VsZi5zdG9wKClcbiAgICAgICAgICAgICAgICBzZWxmLnNob3dQbGF5QnRuKCk7XG4gICAgICAgICAgICAgICAgc2VsZi5oaWRlU3RvcEJ0bigpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICBwbGF5KCkge1xuICAgICAgICAgICAgdGhpcy5zb3VuZC5wbGF5KCk7XG4gICAgICAgIH1cblxuICAgICAgICBwYXVzZSgpIHtcbiAgICAgICAgICAgIHRoaXMuc291bmQucGF1c2UoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHN0b3AoKSB7XG4gICAgICAgICAgICB0aGlzLnNvdW5kLnBhdXNlKCk7XG4gICAgICAgICAgICB0aGlzLnNvdW5kLmN1cnJlbnRUaW1lID0gMDtcbiAgICAgICAgfVxuXG4gICAgICAgIHNob3dQbGF5QnRuKCkge1xuICAgICAgICAgICAgdGhpcy5wbGF5QnRuLmNsYXNzTGlzdC5hZGQoJ3Nob3cnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGhpZGVQbGF5QnRuKCkge1xuICAgICAgICAgICAgdGhpcy5wbGF5QnRuLmNsYXNzTGlzdC5yZW1vdmUoJ3Nob3cnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHNob3dTdG9wQnRuKCkge1xuICAgICAgICAgICAgdGhpcy5zdG9wQnRuLmNsYXNzTGlzdC5hZGQoJ3Nob3cnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGhpZGVTdG9wQnRuKCkge1xuICAgICAgICAgICAgdGhpcy5zdG9wQnRuLmNsYXNzTGlzdC5yZW1vdmUoJ3Nob3cnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlzUGxheWluZyhuYW1lKSB7XG4gICAgICAgICAgICByZXR1cm4gIXRoaXMuc291bmQucGF1c2VkO1xuICAgICAgICB9XG5cbiAgICB9XG5cblxuXG5cbiAgICBuZXcgR2FtZSgpO1xuXG59KTsiXX0=
