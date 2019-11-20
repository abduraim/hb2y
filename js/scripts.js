document.addEventListener("DOMContentLoaded", function(event) {



    const Steps = [
        {},
        {
            question: "Итак, твое первое задание. Искать конверт нужно там, где ты&nbsp;готовишь отличнейшую лапшу, он&nbsp;рядом с&nbsp;вилкой и&nbsp;ножом.",
            answer: '258',
            hint: 'Конверт в ящике стола, на кухне',
            successMessage: "Дашулька, спасибо за&nbsp;отличные и&nbsp;вкусных&nbsp;блюда, которые ты для&nbsp;нас&nbsp;готовишь! Твой подарок в&nbsp;столе, открой&nbsp;дверцы.",
            timeOver: 60,
            nextBtnText: 'К следующему подарку!',
        },
        {
            question: "Следующий конверт находится там, где ты поддерживаешь жизнь тем, кого дарят твои клиенты любимым&nbsp;людям.",
            answer: '555',
            hint: 'Это цветы, которые ты выращиваешь',
            successMessage: "Спасибо за&nbsp;красоту, которую ты приносишь в&nbsp;этот&nbsp;мир, подарок ищи в&nbsp;шкафу ванной комнаты.",
            timeOver: 60,
            nextBtnText: 'Класс! Дальше',
        },
        {
            question: 'Поторопись к&nbsp;следующему конверту, он&nbsp;находится у&nbsp;хорошего кучерявого человека, живущего по&nbsp;соседству. Твой пароль - "Хочу халву&nbsp;ем, хочу пряники!"',
            answer: '333',
            hint: 'Это Ирина',
            successMessage: 'Спасибо за&nbsp;твое общение, за&nbsp;новости и&nbsp;идеи, которыми ты&nbsp;делишься! Подарок в&nbsp;шкафу (в&nbsp;общем коридоре)',
            timeOver: 60,
            nextBtnText: 'Еще!',
        },
        {
            question: 'Следующий конверт ты&nbsp;найдешь там, куда попадают твои носочки после стирки.',
            answer: '157',
            hint: 'После того, как они высохли',
            successMessage: 'Спасибо за&nbsp;чистоту и&nbsp;порядок, которые ты для&nbsp;нас поддерживаешь! Твой следующий подарок в&nbsp;антресоли!',
            timeOver: 60,
            nextBtnText: 'Ура. Дальше!',
        },
        {
            question: 'Итак, последнее задание. Ответ прячется в&nbsp;мешке набитом гусиными волосами.',
            answer: '369',
            hint: 'Это подушка',
            successMessage: 'Это было послднее задание. На&nbsp;этом поздравление подходит к&nbsp;концу. Спасибо за&nbsp;любовь и&nbsp;ласку, которыми ты нас согреваешь! Целую, обнимаю и&nbsp;люблю&nbsp;тебя, Сладкая! Твой последний подарок под&nbsp;матрасом.',
            timeOver: 60,
            nextBtnText: 'Результаты',
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
                message: "Привет, Дашулька! Сегодня твой день&nbsp;рождения, а в день&nbsp;рождения принято получать подарки. Мой подарок - это&nbsp;игра, в&nbsp;которой тебе нужно будет найти&nbsp;подарки. Итак, возвращайся в&nbsp;комнату, а&nbsp;затем нажми Далее...",
                btnText: 'Далее',
            },
            {
                message: 'Добро пожаловать в&nbsp;приключение, Даша-путешественница! На твоём пути будут задания на поиск конвертов. В&nbsp;конвертах будет число, которое тебе нужно ввести. После этого ты&nbsp;узнаешь, где забрать подарок. Существуют подсказки - они появляются тогда, когда заканчивается время. Поехали?',
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


            // Results
            this.resultTime = this.gameOverScreen.querySelector('#result-time');
            this.hintAmount = this.gameOverScreen.querySelector('#hint-amount');


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

                // load results
                self.resultTime.innerText = self.CommonTimerComponent.getCommonTime();
                self.hintAmount.innerText = self.QuestComponent.hintAmount;

                self.CommonTimerComponent.stop();
                self.QuestComponent.hide();
                self.gameOverScreen.classList.add('show');

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
                    Sounds.dasha.play();
                }
                if (self.currentMessage == 1) {
                    Sounds.dasha.pause();
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
            this.text.innerHTML = Setup.welcomeMessage[this.currentMessage].message;
            this.nextBtn.innerText = Setup.welcomeMessage[this.currentMessage].btnText;
        }

        nextMessage() {
            this.currentMessage++;
            if (this.currentMessage >= Setup.welcomeMessage.length) {
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
            this.hintAmount = 0;

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
                        }, 1000);

                    }

                }

            });

            this.hintBtn.addEventListener('click', function () {
                self.hintAmount ++;
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
            this.nextQuestBtn.focus();

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
            this.text.innerHTML = this.question;
            this.answer = Steps[this.stepNumber].answer;

            this.successMessageText.innerHTML = Steps[this.stepNumber].successMessage;
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



    // Start The Game!
    new Game();

});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJzY3JpcHRzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcIkRPTUNvbnRlbnRMb2FkZWRcIiwgZnVuY3Rpb24oZXZlbnQpIHtcblxuXG5cbiAgICBjb25zdCBTdGVwcyA9IFtcbiAgICAgICAge30sXG4gICAgICAgIHtcbiAgICAgICAgICAgIHF1ZXN0aW9uOiBcItCY0YLQsNC6LCDRgtCy0L7QtSDQv9C10YDQstC+0LUg0LfQsNC00LDQvdC40LUuINCY0YHQutCw0YLRjCDQutC+0L3QstC10YDRgiDQvdGD0LbQvdC+INGC0LDQvCwg0LPQtNC1INGC0YsmbmJzcDvQs9C+0YLQvtCy0LjRiNGMINC+0YLQu9C40YfQvdC10LnRiNGD0Y4g0LvQsNC/0YjRgywg0L7QvSZuYnNwO9GA0Y/QtNC+0Lwg0YEmbmJzcDvQstC40LvQutC+0Lkg0LgmbmJzcDvQvdC+0LbQvtC8LlwiLFxuICAgICAgICAgICAgYW5zd2VyOiAnMjU4JyxcbiAgICAgICAgICAgIGhpbnQ6ICfQmtC+0L3QstC10YDRgiDQsiDRj9GJ0LjQutC1INGB0YLQvtC70LAsINC90LAg0LrRg9GF0L3QtScsXG4gICAgICAgICAgICBzdWNjZXNzTWVzc2FnZTogXCLQlNCw0YjRg9C70YzQutCwLCDRgdC/0LDRgdC40LHQviDQt9CwJm5ic3A70L7RgtC70LjRh9C90YvQtSDQuCZuYnNwO9Cy0LrRg9GB0L3Ri9GFJm5ic3A70LHQu9GO0LTQsCwg0LrQvtGC0L7RgNGL0LUg0YLRiyDQtNC70Y8mbmJzcDvQvdCw0YEmbmJzcDvQs9C+0YLQvtCy0LjRiNGMISDQotCy0L7QuSDQv9C+0LTQsNGA0L7QuiDQsiZuYnNwO9GB0YLQvtC70LUsINC+0YLQutGA0L7QuSZuYnNwO9C00LLQtdGA0YbRiy5cIixcbiAgICAgICAgICAgIHRpbWVPdmVyOiA2MCxcbiAgICAgICAgICAgIG5leHRCdG5UZXh0OiAn0Jog0YHQu9C10LTRg9GO0YnQtdC80YMg0L/QvtC00LDRgNC60YMhJyxcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgcXVlc3Rpb246IFwi0KHQu9C10LTRg9GO0YnQuNC5INC60L7QvdCy0LXRgNGCINC90LDRhdC+0LTQuNGC0YHRjyDRgtCw0LwsINCz0LTQtSDRgtGLINC/0L7QtNC00LXRgNC20LjQstCw0LXRiNGMINC20LjQt9C90Ywg0YLQtdC8LCDQutC+0LPQviDQtNCw0YDRj9GCINGC0LLQvtC4INC60LvQuNC10L3RgtGLINC70Y7QsdC40LzRi9C8Jm5ic3A70LvRjtC00Y/QvC5cIixcbiAgICAgICAgICAgIGFuc3dlcjogJzU1NScsXG4gICAgICAgICAgICBoaW50OiAn0K3RgtC+INGG0LLQtdGC0YssINC60L7RgtC+0YDRi9C1INGC0Ysg0LLRi9GA0LDRidC40LLQsNC10YjRjCcsXG4gICAgICAgICAgICBzdWNjZXNzTWVzc2FnZTogXCLQodC/0LDRgdC40LHQviDQt9CwJm5ic3A70LrRgNCw0YHQvtGC0YMsINC60L7RgtC+0YDRg9GOINGC0Ysg0L/RgNC40L3QvtGB0LjRiNGMINCyJm5ic3A70Y3RgtC+0YImbmJzcDvQvNC40YAsINC/0L7QtNCw0YDQvtC6INC40YnQuCDQsiZuYnNwO9GI0LrQsNGE0YMg0LLQsNC90L3QvtC5INC60L7QvNC90LDRgtGLLlwiLFxuICAgICAgICAgICAgdGltZU92ZXI6IDYwLFxuICAgICAgICAgICAgbmV4dEJ0blRleHQ6ICfQmtC70LDRgdGBISDQlNCw0LvRjNGI0LUnLFxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgICBxdWVzdGlvbjogJ9Cf0L7RgtC+0YDQvtC/0LjRgdGMINC6Jm5ic3A70YHQu9C10LTRg9GO0YnQtdC80YMg0LrQvtC90LLQtdGA0YLRgywg0L7QvSZuYnNwO9C90LDRhdC+0LTQuNGC0YHRjyDRgyZuYnNwO9GF0L7RgNC+0YjQtdCz0L4g0LrRg9GH0LXRgNGP0LLQvtCz0L4g0YfQtdC70L7QstC10LrQsCwg0LbQuNCy0YPRidC10LPQviDQv9C+Jm5ic3A70YHQvtGB0LXQtNGB0YLQstGDLiDQotCy0L7QuSDQv9Cw0YDQvtC70YwgLSBcItCl0L7Rh9GDINGF0LDQu9Cy0YMmbmJzcDvQtdC8LCDRhdC+0YfRgyDQv9GA0Y/QvdC40LrQuCFcIicsXG4gICAgICAgICAgICBhbnN3ZXI6ICczMzMnLFxuICAgICAgICAgICAgaGludDogJ9Ct0YLQviDQmNGA0LjQvdCwJyxcbiAgICAgICAgICAgIHN1Y2Nlc3NNZXNzYWdlOiAn0KHQv9Cw0YHQuNCx0L4g0LfQsCZuYnNwO9GC0LLQvtC1INC+0LHRidC10L3QuNC1LCDQt9CwJm5ic3A70L3QvtCy0L7RgdGC0Lgg0LgmbmJzcDvQuNC00LXQuCwg0LrQvtGC0L7RgNGL0LzQuCDRgtGLJm5ic3A70LTQtdC70LjRiNGM0YHRjyEg0J/QvtC00LDRgNC+0Log0LImbmJzcDvRiNC60LDRhNGDICjQsiZuYnNwO9C+0LHRidC10Lwg0LrQvtGA0LjQtNC+0YDQtSknLFxuICAgICAgICAgICAgdGltZU92ZXI6IDYwLFxuICAgICAgICAgICAgbmV4dEJ0blRleHQ6ICfQldGJ0LUhJyxcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgcXVlc3Rpb246ICfQodC70LXQtNGD0Y7RidC40Lkg0LrQvtC90LLQtdGA0YIg0YLRiyZuYnNwO9C90LDQudC00LXRiNGMINGC0LDQvCwg0LrRg9C00LAg0L/QvtC/0LDQtNCw0Y7RgiDRgtCy0L7QuCDQvdC+0YHQvtGH0LrQuCDQv9C+0YHQu9C1INGB0YLQuNGA0LrQuC4nLFxuICAgICAgICAgICAgYW5zd2VyOiAnMTU3JyxcbiAgICAgICAgICAgIGhpbnQ6ICfQn9C+0YHQu9C1INGC0L7Qs9C+LCDQutCw0Log0L7QvdC4INCy0YvRgdC+0YXQu9C4JyxcbiAgICAgICAgICAgIHN1Y2Nlc3NNZXNzYWdlOiAn0KHQv9Cw0YHQuNCx0L4g0LfQsCZuYnNwO9GH0LjRgdGC0L7RgtGDINC4Jm5ic3A70L/QvtGA0Y/QtNC+0LosINC60L7RgtC+0YDRi9C1INGC0Ysg0LTQu9GPJm5ic3A70L3QsNGBINC/0L7QtNC00LXRgNC20LjQstCw0LXRiNGMISDQotCy0L7QuSDRgdC70LXQtNGD0Y7RidC40Lkg0L/QvtC00LDRgNC+0Log0LImbmJzcDvQsNC90YLRgNC10YHQvtC70LghJyxcbiAgICAgICAgICAgIHRpbWVPdmVyOiA2MCxcbiAgICAgICAgICAgIG5leHRCdG5UZXh0OiAn0KPRgNCwLiDQlNCw0LvRjNGI0LUhJyxcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgcXVlc3Rpb246ICfQmNGC0LDQuiwg0L/QvtGB0LvQtdC00L3QtdC1INC30LDQtNCw0L3QuNC1LiDQntGC0LLQtdGCINC/0YDRj9GH0LXRgtGB0Y8g0LImbmJzcDvQvNC10YjQutC1INC90LDQsdC40YLQvtC8INCz0YPRgdC40L3Ri9C80Lgg0LLQvtC70L7RgdCw0LzQuC4nLFxuICAgICAgICAgICAgYW5zd2VyOiAnMzY5JyxcbiAgICAgICAgICAgIGhpbnQ6ICfQrdGC0L4g0L/QvtC00YPRiNC60LAnLFxuICAgICAgICAgICAgc3VjY2Vzc01lc3NhZ2U6ICfQrdGC0L4g0LHRi9C70L4g0L/QvtGB0LvQtNC90LXQtSDQt9Cw0LTQsNC90LjQtS4g0J3QsCZuYnNwO9GN0YLQvtC8INC/0L7Qt9C00YDQsNCy0LvQtdC90LjQtSDQv9C+0LTRhdC+0LTQuNGCINC6Jm5ic3A70LrQvtC90YbRgy4g0KHQv9Cw0YHQuNCx0L4g0LfQsCZuYnNwO9C70Y7QsdC+0LLRjCDQuCZuYnNwO9C70LDRgdC60YMsINC60L7RgtC+0YDRi9C80Lgg0YLRiyDQvdCw0YEg0YHQvtCz0YDQtdCy0LDQtdGI0YwhINCm0LXQu9GD0Y4sINC+0LHQvdC40LzQsNGOINC4Jm5ic3A70LvRjtCx0LvRjiZuYnNwO9GC0LXQsdGPLCDQodC70LDQtNC60LDRjyEg0KLQstC+0Lkg0L/QvtGB0LvQtdC00L3QuNC5INC/0L7QtNCw0YDQvtC6INC/0L7QtCZuYnNwO9C80LDRgtGA0LDRgdC+0LwuJyxcbiAgICAgICAgICAgIHRpbWVPdmVyOiA2MCxcbiAgICAgICAgICAgIG5leHRCdG5UZXh0OiAn0KDQtdC30YPQu9GM0YLQsNGC0YsnLFxuICAgICAgICB9LFxuICAgIF07XG5cbiAgICBjb25zdCBTZXR1cCA9IHtcbiAgICAgICAgZGVidWc6IGZhbHNlLFxuICAgICAgICBzZWNvbmRzVG9EYW5nZXI6IDEwLFxuICAgICAgICBzb3VuZHM6IHtcbiAgICAgICAgICAgIGRhc2hhOiAnL2Fzc2V0cy9zb3VuZHMvZGFzaGEubXAzJyxcbiAgICAgICAgICAgIGFwcGxhdXNlOiAnL2Fzc2V0cy9zb3VuZHMvYXBwbGF1c2UubXAzJyxcbiAgICAgICAgICAgIGZpcmV3b3JrczogJy9hc3NldHMvc291bmRzL2ZpcmV3b3Jrcy5tcDMnLFxuICAgICAgICAgICAgYWxhcm06ICcvYXNzZXRzL3NvdW5kcy9hbGFybS5tcDMnLFxuICAgICAgICAgICAgdGljazogJy9hc3NldHMvc291bmRzL3RpY2subXAzJyxcbiAgICAgICAgfSxcbiAgICAgICAgd2VsY29tZU1lc3NhZ2U6IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBtZXNzYWdlOiBcItCf0YDQuNCy0LXRgiwg0JTQsNGI0YPQu9GM0LrQsCEg0KHQtdCz0L7QtNC90Y8g0YLQstC+0Lkg0LTQtdC90YwmbmJzcDvRgNC+0LbQtNC10L3QuNGPLCDQsCDQsiDQtNC10L3RjCZuYnNwO9GA0L7QttC00LXQvdC40Y8g0L/RgNC40L3Rj9GC0L4g0L/QvtC70YPRh9Cw0YLRjCDQv9C+0LTQsNGA0LrQuC4g0JzQvtC5INC/0L7QtNCw0YDQvtC6IC0g0Y3RgtC+Jm5ic3A70LjQs9GA0LAsINCyJm5ic3A70LrQvtGC0L7RgNC+0Lkg0YLQtdCx0LUg0L3Rg9C20L3QviDQsdGD0LTQtdGCINC90LDQudGC0LgmbmJzcDvQv9C+0LTQsNGA0LrQuC4g0JjRgtCw0LosINCy0L7Qt9Cy0YDQsNGJ0LDQudGB0Y8g0LImbmJzcDvQutC+0LzQvdCw0YLRgywg0LAmbmJzcDvQt9Cw0YLQtdC8INC90LDQttC80Lgg0JTQsNC70LXQtS4uLlwiLFxuICAgICAgICAgICAgICAgIGJ0blRleHQ6ICfQlNCw0LvQtdC1JyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgbWVzc2FnZTogJ9CU0L7QsdGA0L4g0L/QvtC20LDQu9C+0LLQsNGC0Ywg0LImbmJzcDvQv9GA0LjQutC70Y7Rh9C10L3QuNC1LCDQlNCw0YjQsC3Qv9GD0YLQtdGI0LXRgdGC0LLQtdC90L3QuNGG0LAhINCd0LAg0YLQstC+0ZHQvCDQv9GD0YLQuCDQsdGD0LTRg9GCINC30LDQtNCw0L3QuNGPINC90LAg0L/QvtC40YHQuiDQutC+0L3QstC10YDRgtC+0LIuINCSJm5ic3A70LrQvtC90LLQtdGA0YLQsNGFINCx0YPQtNC10YIg0YfQuNGB0LvQviwg0LrQvtGC0L7RgNC+0LUg0YLQtdCx0LUg0L3Rg9C20L3QviDQstCy0LXRgdGC0LguINCf0L7RgdC70LUg0Y3RgtC+0LPQviDRgtGLJm5ic3A70YPQt9C90LDQtdGI0YwsINCz0LTQtSDQt9Cw0LHRgNCw0YLRjCDQv9C+0LTQsNGA0L7Qui4g0KHRg9GJ0LXRgdGC0LLRg9GO0YIg0L/QvtC00YHQutCw0LfQutC4IC0g0L7QvdC4INC/0L7Rj9Cy0LvRj9GO0YLRgdGPINGC0L7Qs9C00LAsINC60L7Qs9C00LAg0LfQsNC60LDQvdGH0LjQstCw0LXRgtGB0Y8g0LLRgNC10LzRjy4g0J/QvtC10YXQsNC70Lg/JyxcbiAgICAgICAgICAgICAgICBidG5UZXh0OiAn0J/QvtC10YXQsNC70LghJyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgfTtcblxuICAgIGxldCBTb3VuZHMgPSB7fTtcblxuXG5cbiAgICAvLyBQcmVsb2FkZXJcbiAgICBjbGFzcyBQcmVsb2FkZXIge1xuXG4gICAgICAgIGNvbnN0cnVjdG9yKCkge1xuXG4gICAgICAgICAgICB0aGlzLmltYWdlc0lzTG9hZGVkID0gZmFsc2U7XG4gICAgICAgICAgICB0aGlzLnNvdW5kc0lzTG9hZGVkID0gZmFsc2U7XG5cbiAgICAgICAgICAgIHRoaXMucHJlbG9hZEJhY2tncm91bmRJbWFnZXMoKTtcbiAgICAgICAgICAgIHRoaXMucHJlbG9hZFNvdW5kcygpO1xuXG4gICAgICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdhc3NldElzTG9hZGVkJywgZnVuY3Rpb24gKGV2ZW50KSB7XG5cbiAgICAgICAgICAgICAgICBpZiAoZXZlbnQuc291cmNlID09ICdpbWFnZXMnKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaW1hZ2VzSXNMb2FkZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmIChldmVudC5zb3VyY2UgPT0gJ3NvdW5kcycpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zb3VuZHNJc0xvYWRlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuaW1hZ2VzSXNMb2FkZWQgJiYgdGhpcy5zb3VuZHNJc0xvYWRlZCkge1xuICAgICAgICAgICAgICAgICAgICBkb2N1bWVudC5kaXNwYXRjaEV2ZW50KG5ldyBFdmVudCgnYWxsQXNzZXRzSXNMb2FkZWQnKSk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICB9XG5cbiAgICAgICAgcHJlbG9hZEJhY2tncm91bmRJbWFnZXMoKSB7XG5cbiAgICAgICAgICAgIHRoaXMucHJlbG9hZEJhY2tncm91bmRJbWFnZXNFbGVtZW50c0FyciA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ3ByZWxvYWQtYmFja2dyb3VuZCcpO1xuXG4gICAgICAgICAgICB0aGlzLnRvdGFsQW1vdW50T2ZJbWFnZXMgPSB0aGlzLnByZWxvYWRCYWNrZ3JvdW5kSW1hZ2VzRWxlbWVudHNBcnIubGVuZ3RoO1xuICAgICAgICAgICAgdGhpcy5jdXJyZW50QW1vdW50T2ZMb2FkZWRJbWFnZXMgPSAwO1xuXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMudG90YWxBbW91bnRPZkltYWdlczsgaSsrKSB7XG5cbiAgICAgICAgICAgICAgICBsZXQgZWxlbWVudCA9IHRoaXMucHJlbG9hZEJhY2tncm91bmRJbWFnZXNFbGVtZW50c0FycltpXTtcblxuICAgICAgICAgICAgICAgIGxldCBzdHlsZSA9XG4gICAgICAgICAgICAgICAgICAgIGVsZW1lbnQuY3VycmVudFN0eWxlIHx8IHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKGVsZW1lbnQsIGZhbHNlKSxcbiAgICAgICAgICAgICAgICAgICAgdXJsID0gc3R5bGVcbiAgICAgICAgICAgICAgICAgICAgICAgIC5iYWNrZ3JvdW5kSW1hZ2VcbiAgICAgICAgICAgICAgICAgICAgICAgIC5zbGljZSg0LCAtMSlcbiAgICAgICAgICAgICAgICAgICAgICAgIC5yZXBsYWNlKC9cIi9nLCBcIlwiKTtcblxuICAgICAgICAgICAgICAgIHRoaXMuaW1hZ2VQcmVsb2FkZXIodXJsKTtcblxuICAgICAgICAgICAgfVxuXG4gICAgICAgIH1cblxuICAgICAgICBpbWFnZVByZWxvYWRlcih1cmwpIHtcbiAgICAgICAgICAgIGxldCBzZWxmID0gdGhpcztcbiAgICAgICAgICAgIGxldCBpbWcgPSBuZXcgSW1hZ2UoKTtcbiAgICAgICAgICAgIGltZy5zcmMgPSB1cmw7XG4gICAgICAgICAgICBpbWcub25sb2FkID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHNlbGYuaW1hZ2VJc0xvYWRlZCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGltZy5jb21wbGV0ZSkgaW1nLm9ubG9hZCgpO1xuICAgICAgICB9XG5cbiAgICAgICAgaW1hZ2VJc0xvYWRlZCgpIHtcbiAgICAgICAgICAgIHRoaXMuY3VycmVudEFtb3VudE9mTG9hZGVkSW1hZ2VzKys7XG4gICAgICAgICAgICBpZiAodGhpcy5jdXJyZW50QW1vdW50T2ZMb2FkZWRJbWFnZXMgPj0gdGhpcy50b3RhbEFtb3VudE9mSW1hZ2VzKSB7XG4gICAgICAgICAgICAgICAgbGV0IGV2ZW50ID0gbmV3IEV2ZW50KCdhc3NldElzTG9hZGVkJyk7XG4gICAgICAgICAgICAgICAgZXZlbnQuc291cmNlID0gJ2ltYWdlcyc7XG4gICAgICAgICAgICAgICAgZG9jdW1lbnQuZGlzcGF0Y2hFdmVudChldmVudCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBwcmVsb2FkU291bmRzKCkge1xuXG4gICAgICAgICAgICBsZXQgc2VsZiA9IHRoaXM7XG5cbiAgICAgICAgICAgIHRoaXMucHJlbG9hZFNvdW5kc0FyciA9IFNldHVwLnNvdW5kcztcblxuICAgICAgICAgICAgdGhpcy50b3RhbEFtb3VudE9mU291bmRzID0gT2JqZWN0LmtleXMoU2V0dXAuc291bmRzKS5sZW5ndGg7XG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRBbW91bnRPZkxvYWRlZFNvdW5kcyA9IDA7XG5cbiAgICAgICAgICAgIGxldCB0ZW1wU291bmRzID0ge307XG5cbiAgICAgICAgICAgIGZvciAobGV0IG5hbWUgaW4gU2V0dXAuc291bmRzKSB7XG5cbiAgICAgICAgICAgICAgICB0ZW1wU291bmRzW25hbWVdID0gbmV3IEF1ZGlvKFNldHVwLnNvdW5kc1tuYW1lXSk7XG5cbiAgICAgICAgICAgICAgICB0ZW1wU291bmRzW25hbWVdLmFkZEV2ZW50TGlzdGVuZXIoJ2NhbnBsYXl0aHJvdWdoJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICBzZWxmLnNvdW5kSXNMb2FkZWQoKTtcbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBTb3VuZHMgPSB0ZW1wU291bmRzO1xuXG4gICAgICAgIH1cblxuICAgICAgICBzb3VuZElzTG9hZGVkKCkge1xuICAgICAgICAgICAgdGhpcy5jdXJyZW50QW1vdW50T2ZMb2FkZWRTb3VuZHMgKys7XG4gICAgICAgICAgICBpZiAodGhpcy5jdXJyZW50QW1vdW50T2ZMb2FkZWRTb3VuZHMgPj0gdGhpcy50b3RhbEFtb3VudE9mU291bmRzKSB7XG4gICAgICAgICAgICAgICAgbGV0IGV2ZW50ID0gbmV3IEV2ZW50KCdhc3NldElzTG9hZGVkJyk7XG4gICAgICAgICAgICAgICAgZXZlbnQuc291cmNlID0gJ3NvdW5kcyc7XG4gICAgICAgICAgICAgICAgZG9jdW1lbnQuZGlzcGF0Y2hFdmVudChldmVudCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgIH1cblxuICAgIC8vIE1haW4gQ29tcG9uZW50XG4gICAgY2xhc3MgR2FtZSB7XG5cbiAgICAgICAgY29uc3RydWN0b3IoKSB7XG5cbiAgICAgICAgICAgIG5ldyBQcmVsb2FkZXIoKTtcblxuICAgICAgICAgICAgLy8gU2NyZWVuc1xuICAgICAgICAgICAgdGhpcy5sb2FkaW5nU2NyZWVuID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2xvYWRpbmcnKTtcbiAgICAgICAgICAgIHRoaXMucHlyb1NjcmVlbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdweXJvJyk7XG4gICAgICAgICAgICB0aGlzLmdhbWVPdmVyU2NyZWVuID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2dhbWUtb3ZlcicpO1xuXG5cbiAgICAgICAgICAgIC8vIFJlc3VsdHNcbiAgICAgICAgICAgIHRoaXMucmVzdWx0VGltZSA9IHRoaXMuZ2FtZU92ZXJTY3JlZW4ucXVlcnlTZWxlY3RvcignI3Jlc3VsdC10aW1lJyk7XG4gICAgICAgICAgICB0aGlzLmhpbnRBbW91bnQgPSB0aGlzLmdhbWVPdmVyU2NyZWVuLnF1ZXJ5U2VsZWN0b3IoJyNoaW50LWFtb3VudCcpO1xuXG5cbiAgICAgICAgICAgIC8vIENvbXBvbmVudHNcbiAgICAgICAgICAgIHRoaXMuRnVsbHNjcmVlbkNvbXBvbmVudCA9IG5ldyBGdWxsc2NyZWVuQ29tcG9uZW50KCk7XG4gICAgICAgICAgICB0aGlzLldlbGNvbWVDb21wb25lbnQgPSBuZXcgV2VsY29tZSgpO1xuICAgICAgICAgICAgdGhpcy5Db21tb25UaW1lckNvbXBvbmVudCA9IG5ldyBDb21tb25UaW1lckNvbXBvbmVudCgpO1xuICAgICAgICAgICAgdGhpcy5RdWVzdENvbXBvbmVudCA9IG5ldyBRdWVzdENvbXBvbmVudCgpO1xuXG5cbiAgICAgICAgICAgIC8vIEJpbmQgRXZlbnRzXG4gICAgICAgICAgICB0aGlzLmluaXRFdmVudHMoKTtcblxuICAgICAgICB9XG5cbiAgICAgICAgLy8gQmluZyBFdmVudHNcbiAgICAgICAgaW5pdEV2ZW50cygpIHtcblxuICAgICAgICAgICAgbGV0IHNlbGYgPSB0aGlzO1xuXG4gICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBkb2N1bWVudC5kaXNwYXRjaEV2ZW50KG5ldyBFdmVudCgnYWxsQXNzZXRzSXNMb2FkZWQnKSk7XG4gICAgICAgICAgICB9LCAzMDAwKTtcblxuICAgICAgICAgICAgLy8gQXBwIGlzIExvYWRlZFxuICAgICAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignYWxsQXNzZXRzSXNMb2FkZWQnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgc2VsZi5oaWRlTG9hZGluZygpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIC8vIEZ1bGxzY3JlZW4gRG9uZVxuICAgICAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignZnVsbHNjcmVlbkRvbmUnLCBmdW5jdGlvbiAoKSB7XG5cbiAgICAgICAgICAgICAgICBzZWxmLldlbGNvbWVDb21wb25lbnQuc2hvdygpO1xuXG4gICAgICAgICAgICB9KTtcblxuXG4gICAgICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCd3ZWxjb21lRG9uZScsIGZ1bmN0aW9uICgpIHtcblxuICAgICAgICAgICAgICAgIHNlbGYuV2VsY29tZUNvbXBvbmVudC5oaWRlKCk7XG4gICAgICAgICAgICAgICAgc2VsZi5RdWVzdENvbXBvbmVudC5zaG93KCk7XG4gICAgICAgICAgICAgICAgc2VsZi5Db21tb25UaW1lckNvbXBvbmVudC5zdGFydCgpO1xuXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgLy8gUXVlc3QgRG9uZVxuICAgICAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignZXZlbnRRdWVzdFN1Y2Nlc3MnLCBmdW5jdGlvbiAoKSB7XG5cbiAgICAgICAgICAgICAgICAvLyBsb2FkIHJlc3VsdHNcbiAgICAgICAgICAgICAgICBzZWxmLnJlc3VsdFRpbWUuaW5uZXJUZXh0ID0gc2VsZi5Db21tb25UaW1lckNvbXBvbmVudC5nZXRDb21tb25UaW1lKCk7XG4gICAgICAgICAgICAgICAgc2VsZi5oaW50QW1vdW50LmlubmVyVGV4dCA9IHNlbGYuUXVlc3RDb21wb25lbnQuaGludEFtb3VudDtcblxuICAgICAgICAgICAgICAgIHNlbGYuQ29tbW9uVGltZXJDb21wb25lbnQuc3RvcCgpO1xuICAgICAgICAgICAgICAgIHNlbGYuUXVlc3RDb21wb25lbnQuaGlkZSgpO1xuICAgICAgICAgICAgICAgIHNlbGYuZ2FtZU92ZXJTY3JlZW4uY2xhc3NMaXN0LmFkZCgnc2hvdycpO1xuXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgLy8gUGF1c2UgQ29tbW9uIFRpbWVyXG4gICAgICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdwYXVzZVRpbWVyJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHNlbGYuQ29tbW9uVGltZXJDb21wb25lbnQucGF1c2UoKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAvLyBDb250aW51ZSBDb21tb24gVGltZXJcbiAgICAgICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2NvbnRpbnVlVGltZXInLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgc2VsZi5Db21tb25UaW1lckNvbXBvbmVudC5jb250aW51ZSgpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgfVxuXG4gICAgICAgIC8vTG9hZGluZ1xuICAgICAgICBoaWRlTG9hZGluZygpIHtcbiAgICAgICAgICAgIHRoaXMubG9hZGluZ1NjcmVlbi5jbGFzc0xpc3QucmVtb3ZlKCdzaG93Jyk7XG4gICAgICAgIH1cblxuICAgIH1cblxuICAgIC8vIEZ1bGxzY3JlZW4gQ2xhc3NcbiAgICBjbGFzcyBGdWxsc2NyZWVuQ29tcG9uZW50IHtcblxuICAgICAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgICAgIHRoaXMuY29udGFpbmVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2Z1bGxzY3JlZW4nKTtcbiAgICAgICAgICAgIHRoaXMuY29udGFpbmVyLmNsYXNzTGlzdC5hZGQoJ3Nob3cnKTtcbiAgICAgICAgICAgIHRoaXMuYnRuID0gdGhpcy5jb250YWluZXIucXVlcnlTZWxlY3RvcignYnV0dG9uJyk7XG4gICAgICAgICAgICB0aGlzLmZ1bGxzY3JlZW5Eb25lID0gbmV3IEV2ZW50KCdmdWxsc2NyZWVuRG9uZScpO1xuICAgICAgICAgICAgbGV0IHNlbGYgPSB0aGlzO1xuICAgICAgICAgICAgdGhpcy5idG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgaWYgKCFTZXR1cC5kZWJ1Zykge1xuICAgICAgICAgICAgICAgICAgICBzZWxmLmxhdW5jaEZ1bGxTY3JlZW4oZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgc2VsZi5idG4uY2xhc3NMaXN0LmFkZCgnc29mdF9oaWRlJyk7XG4gICAgICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIHNlbGYuY29udGFpbmVyLmNsYXNzTGlzdC5yZW1vdmUoJ3Nob3cnKTtcbiAgICAgICAgICAgICAgICAgICAgZG9jdW1lbnQuZGlzcGF0Y2hFdmVudChzZWxmLmZ1bGxzY3JlZW5Eb25lKTtcbiAgICAgICAgICAgICAgICB9LCAxMDAwKTtcbiAgICAgICAgICAgIH0pXG4gICAgICAgIH1cblxuICAgICAgICBsYXVuY2hGdWxsU2NyZWVuKGVsZW1lbnQpIHtcbiAgICAgICAgICAgIGlmKGVsZW1lbnQucmVxdWVzdEZ1bGxTY3JlZW4pIHtcbiAgICAgICAgICAgICAgICBlbGVtZW50LnJlcXVlc3RGdWxsU2NyZWVuKCk7XG4gICAgICAgICAgICB9IGVsc2UgaWYoZWxlbWVudC5tb3pSZXF1ZXN0RnVsbFNjcmVlbikge1xuICAgICAgICAgICAgICAgIGVsZW1lbnQubW96UmVxdWVzdEZ1bGxTY3JlZW4oKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZihlbGVtZW50LndlYmtpdFJlcXVlc3RGdWxsU2NyZWVuKSB7XG4gICAgICAgICAgICAgICAgZWxlbWVudC53ZWJraXRSZXF1ZXN0RnVsbFNjcmVlbigpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgY2FuY2VsRnVsbHNjcmVlbigpIHtcbiAgICAgICAgICAgIGlmKGRvY3VtZW50LmNhbmNlbEZ1bGxTY3JlZW4pIHtcbiAgICAgICAgICAgICAgICBkb2N1bWVudC5jYW5jZWxGdWxsU2NyZWVuKCk7XG4gICAgICAgICAgICB9IGVsc2UgaWYoZG9jdW1lbnQubW96Q2FuY2VsRnVsbFNjcmVlbikge1xuICAgICAgICAgICAgICAgIGRvY3VtZW50Lm1vekNhbmNlbEZ1bGxTY3JlZW4oKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZihkb2N1bWVudC53ZWJraXRDYW5jZWxGdWxsU2NyZWVuKSB7XG4gICAgICAgICAgICAgICAgZG9jdW1lbnQud2Via2l0Q2FuY2VsRnVsbFNjcmVlbigpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICB9XG5cbiAgICAvLyBXZWxjb21lIE1lc3NhZ2VzXG4gICAgY2xhc3MgV2VsY29tZSB7XG5cbiAgICAgICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgICAgICB0aGlzLmNvbnRhaW5lciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd3ZWxjb21lJyk7XG4gICAgICAgICAgICB0aGlzLmFwcGVhcnRpbkJsb2NrID0gdGhpcy5jb250YWluZXIucXVlcnlTZWxlY3RvcignI3dlbGNvbWUtdGV4dCcpO1xuICAgICAgICAgICAgdGhpcy50ZXh0ID0gdGhpcy5jb250YWluZXIucXVlcnlTZWxlY3RvcignI3dlbGNvbWUtdGV4dCA+IHAnKTtcbiAgICAgICAgICAgIHRoaXMubmV4dEJ0biA9IHRoaXMuY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoJ2J1dHRvbiN3ZWxjb21lLW5leHQtYnRuJyk7XG4gICAgICAgICAgICB0aGlzLmV2ZW50RG9uZSA9IG5ldyBFdmVudCgnd2VsY29tZURvbmUnKTtcbiAgICAgICAgICAgIHRoaXMubXVzaWNEYXNoYSA9IG5ldyBQbGF5ZXIoU2V0dXAuc291bmRzLmRhc2hhKTtcbiAgICAgICAgICAgIHRoaXMuaW5pdCgpO1xuICAgICAgICB9XG5cbiAgICAgICAgaW5pdCgpIHtcblxuICAgICAgICAgICAgdGhpcy5jdXJyZW50TWVzc2FnZSA9IDA7XG5cbiAgICAgICAgICAgIHRoaXMuZmlsbEZpZWxkcygpO1xuXG4gICAgICAgICAgICBsZXQgc2VsZiA9IHRoaXM7XG4gICAgICAgICAgICB0aGlzLm5leHRCdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgaWYgKHNlbGYuY3VycmVudE1lc3NhZ2UgPT0gMCkge1xuICAgICAgICAgICAgICAgICAgICBTb3VuZHMuZGFzaGEucGxheSgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoc2VsZi5jdXJyZW50TWVzc2FnZSA9PSAxKSB7XG4gICAgICAgICAgICAgICAgICAgIFNvdW5kcy5kYXNoYS5wYXVzZSgpO1xuICAgICAgICAgICAgICAgICAgICBTb3VuZHMudGljay52b2x1bWUgPSAwO1xuICAgICAgICAgICAgICAgICAgICBTb3VuZHMudGljay5sb29wID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgU291bmRzLnRpY2sucGxheSgpO1xuICAgICAgICAgICAgICAgICAgICBTb3VuZHMuYWxhcm0udm9sdW1lID0gMDtcbiAgICAgICAgICAgICAgICAgICAgU291bmRzLmFsYXJtLmxvb3AgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICBTb3VuZHMuYWxhcm0ucGxheSgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBzZWxmLm5leHRNZXNzYWdlKCk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICB9XG5cbiAgICAgICAgZmlsbEZpZWxkcygpIHtcbiAgICAgICAgICAgIHRoaXMudGV4dC5pbm5lckhUTUwgPSBTZXR1cC53ZWxjb21lTWVzc2FnZVt0aGlzLmN1cnJlbnRNZXNzYWdlXS5tZXNzYWdlO1xuICAgICAgICAgICAgdGhpcy5uZXh0QnRuLmlubmVyVGV4dCA9IFNldHVwLndlbGNvbWVNZXNzYWdlW3RoaXMuY3VycmVudE1lc3NhZ2VdLmJ0blRleHQ7XG4gICAgICAgIH1cblxuICAgICAgICBuZXh0TWVzc2FnZSgpIHtcbiAgICAgICAgICAgIHRoaXMuY3VycmVudE1lc3NhZ2UrKztcbiAgICAgICAgICAgIGlmICh0aGlzLmN1cnJlbnRNZXNzYWdlID49IFNldHVwLndlbGNvbWVNZXNzYWdlLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgIGRvY3VtZW50LmRpc3BhdGNoRXZlbnQodGhpcy5ldmVudERvbmUpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5jdXJyZW50TWVzc2FnZSA9PSAxKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICghU2V0dXAuZGVidWcpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubXVzaWNEYXNoYS5wbGF5KCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdGhpcy5maWxsRmllbGRzKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBzaG93KCkge1xuICAgICAgICAgICAgdGhpcy5jb250YWluZXIuY2xhc3NMaXN0LmFkZCgnc2hvdycpO1xuICAgICAgICAgICAgdGhpcy5hcHBlYXJ0aW5CbG9jay5jbGFzc0xpc3QuYWRkKCdzaG93Jyk7XG4gICAgICAgICAgICB0aGlzLm5leHRCdG4uY2xhc3NMaXN0LmFkZCgnc2hvdycpO1xuICAgICAgICB9XG5cbiAgICAgICAgaGlkZSgpIHtcbiAgICAgICAgICAgIHRoaXMuY29udGFpbmVyLmNsYXNzTGlzdC5yZW1vdmUoJ3Nob3cnKTtcbiAgICAgICAgfVxuXG4gICAgfVxuXG4gICAgLy8gQ29tbW9uVGltZSBDbGFzc1xuICAgIGNsYXNzIENvbW1vblRpbWVyQ29tcG9uZW50IHtcblxuICAgICAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgICAgIHRoaXMuY3VycmVudFNlY29uZHMgPSAwO1xuICAgICAgICAgICAgdGhpcy5pc1BhdXNlZCA9IGZhbHNlO1xuICAgICAgICB9XG5cbiAgICAgICAgc3RhcnQoKSB7XG4gICAgICAgICAgICBsZXQgc2VsZiA9IHRoaXM7XG4gICAgICAgICAgICB0aGlzLnRpbWVyID0gc2V0SW50ZXJ2YWwoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIGlmICghc2VsZi5pc1BhdXNlZCkge1xuICAgICAgICAgICAgICAgICAgICBzZWxmLmN1cnJlbnRTZWNvbmRzICsrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sIDEwMDApO1xuICAgICAgICB9XG5cbiAgICAgICAgcGF1c2UoKSB7XG4gICAgICAgICAgICB0aGlzLmlzUGF1c2VkID0gdHJ1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnRpbnVlKCkge1xuICAgICAgICAgICAgdGhpcy5pc1BhdXNlZCA9IGZhbHNlO1xuICAgICAgICB9XG5cbiAgICAgICAgc3RvcCgpIHtcbiAgICAgICAgICAgIGNsZWFySW50ZXJ2YWwodGhpcy50aW1lcik7XG4gICAgICAgIH1cblxuICAgICAgICBnZXRDb21tb25UaW1lKCkge1xuXG4gICAgICAgICAgICBsZXQgbWludXRlcyA9IE1hdGguZmxvb3IodGhpcy5jdXJyZW50U2Vjb25kcyAvIDYwKTtcbiAgICAgICAgICAgIGxldCBzZWNvbmRzID0gdGhpcy5jdXJyZW50U2Vjb25kcyAlIDYwO1xuXG4gICAgICAgICAgICBpZiAobWludXRlcyA8IDEwKSB7XG4gICAgICAgICAgICAgICAgbWludXRlcyA9ICcwJyArIG1pbnV0ZXM7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChzZWNvbmRzIDwgMTApIHtcbiAgICAgICAgICAgICAgICBzZWNvbmRzID0gJzAnICsgc2Vjb25kcztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIG1pbnV0ZXMgKyAnOicgKyBzZWNvbmRzOztcbiAgICAgICAgfVxuXG4gICAgfVxuXG4gICAgLy8gUWVzdFN0ZXAgQ2xhc3NcbiAgICBjbGFzcyBRdWVzdENvbXBvbmVudCB7XG5cbiAgICAgICAgY29uc3RydWN0b3IoKSB7XG5cbiAgICAgICAgICAgIHRoaXMuY29udGFpbmVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3F1ZXN0Jyk7XG5cbiAgICAgICAgICAgIHRoaXMudGV4dCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd0ZXh0Jyk7XG4gICAgICAgICAgICB0aGlzLmlucHV0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2Fuc3dlci1pbnB1dCcpO1xuXG4gICAgICAgICAgICB0aGlzLnN1Y2Nlc3NNZXNzYWdlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3N1Y2Nlc3MtbWVzc2FnZScpO1xuICAgICAgICAgICAgdGhpcy5zdWNjZXNzTWVzc2FnZVRleHQgPSB0aGlzLnN1Y2Nlc3NNZXNzYWdlLnF1ZXJ5U2VsZWN0b3IoJ3AjdGV4dC1zdWNjZXNzLW1lc3NhZ2UnKTtcbiAgICAgICAgICAgIHRoaXMubmV4dFF1ZXN0QnRuID0gdGhpcy5zdWNjZXNzTWVzc2FnZS5xdWVyeVNlbGVjdG9yKCdidXR0b24jbmV4dC1xdWVzdC1idG4nKTtcblxuICAgICAgICAgICAgdGhpcy5oaW50QnRuID0gdGhpcy5jb250YWluZXIucXVlcnlTZWxlY3RvcignYnV0dG9uI2hpbnQtYnRuJyk7XG5cbiAgICAgICAgICAgIHRoaXMuc3VjY2VzRXZlbnQgPSBuZXcgRXZlbnQoJ2V2ZW50UXVlc3RTdWNjZXNzJyk7XG4gICAgICAgICAgICB0aGlzLnBhdXNlQ29tbW9uVGltZXIgPSBuZXcgRXZlbnQoJ3BhdXNlVGltZXInKTtcbiAgICAgICAgICAgIHRoaXMuY29udGludWVDb21tb25UaW1lciA9IG5ldyBFdmVudCgnY29udGludWVUaW1lcicpO1xuICAgICAgICAgICAgdGhpcy5zdG9wVGlja1NvdW5kID0gbmV3IEV2ZW50KCdzdG9wVGlja1NvdW5kJyk7XG4gICAgICAgICAgICB0aGlzLnN0b3BBbGFybVNvdW5kID0gbmV3IEV2ZW50KCdzdG9wQWxhcm1Tb3VuZCcpO1xuXG4gICAgICAgICAgICB0aGlzLnNvdW5kQXBwbGF1c2UgPSBuZXcgUGxheWVyKFNldHVwLnNvdW5kcy5hcHBsYXVzZSk7XG4gICAgICAgICAgICB0aGlzLnNvdW5kRmlyZXdvcmtzID0gbmV3IFBsYXllcihTZXR1cC5zb3VuZHMuZmlyZXdvcmtzKTtcblxuICAgICAgICAgICAgdGhpcy5pbml0KCk7XG5cbiAgICAgICAgfVxuXG4gICAgICAgIGluaXQoKSB7XG5cbiAgICAgICAgICAgIHRoaXMuc3RlcE51bWJlciA9IDE7XG4gICAgICAgICAgICB0aGlzLmhpbnRBbW91bnQgPSAwO1xuXG4gICAgICAgICAgICB0aGlzLmZpbGxGaWVsZHMoKTtcblxuICAgICAgICAgICAgbGV0IHNlbGYgPSB0aGlzO1xuXG4gICAgICAgICAgICB0aGlzLmlucHV0LnNldEF0dHJpYnV0ZSgnbWF4bGVuZ3RoJywgdGhpcy5hbnN3ZXIubGVuZ3RoKTtcblxuICAgICAgICAgICAgdGhpcy5pbnB1dC5hZGRFdmVudExpc3RlbmVyKCdpbnB1dCcsIGZ1bmN0aW9uICgpIHtcblxuICAgICAgICAgICAgICAgIGlmICh0aGlzLnZhbHVlLmxlbmd0aCA9PSBzZWxmLmFuc3dlci5sZW5ndGgpIHtcblxuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy52YWx1ZSA9PSBzZWxmLmFuc3dlcikge1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxmLnJpZ2h0QW5zd2VyKCk7XG5cbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcblxuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5pbnB1dC5jbGFzc0xpc3QuYWRkKCd3cm9uZycpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZWxmLmlucHV0LmNsYXNzTGlzdC5yZW1vdmUoJ3dyb25nJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5pbnB1dC52YWx1ZSA9ICcnO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSwgMTAwMCk7XG5cbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgdGhpcy5oaW50QnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHNlbGYuaGludEFtb3VudCArKztcbiAgICAgICAgICAgICAgICBzZWxmLkhpbnRDb21wb25lbnQuc2hvdygpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHRoaXMubmV4dFF1ZXN0QnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xuXG4gICAgICAgICAgICAgICAgc2VsZi5zdWNjZXNzTWVzc2FnZS5jbGFzc0xpc3QucmVtb3ZlKCdzaG93Jyk7XG5cbiAgICAgICAgICAgICAgICBzZWxmLm5leHRTdGVwKCk7XG5cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdmYWlsVGltZXInLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgc2VsZi5oaW50QnRuLmNsYXNzTGlzdC5hZGQoJ3Nob3cnKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgIH1cblxuICAgICAgICByaWdodEFuc3dlcigpIHtcblxuICAgICAgICAgICAgdGhpcy5UaW1lci5zdG9wKCk7XG5cbiAgICAgICAgICAgIGRvY3VtZW50LmRpc3BhdGNoRXZlbnQodGhpcy5wYXVzZUNvbW1vblRpbWVyKTtcblxuICAgICAgICAgICAgdGhpcy5zdWNjZXNzTWVzc2FnZS5jbGFzc0xpc3QuYWRkKCdzaG93Jyk7XG4gICAgICAgICAgICB0aGlzLm5leHRRdWVzdEJ0bi5mb2N1cygpO1xuXG4gICAgICAgICAgICBTb3VuZHMuYXBwbGF1c2UucGxheSgpO1xuICAgICAgICAgICAgU291bmRzLmZpcmV3b3Jrcy5wbGF5KCk7XG4gICAgICAgICAgICBTb3VuZHMudGljay52b2x1bWUgPSAwO1xuICAgICAgICAgICAgU291bmRzLmFsYXJtLnZvbHVtZSA9IDA7XG5cbiAgICAgICAgfVxuXG4gICAgICAgIG5leHRTdGVwKCkge1xuICAgICAgICAgICAgdGhpcy5zdGVwTnVtYmVyKys7XG4gICAgICAgICAgICBpZiAodGhpcy5zdGVwTnVtYmVyID49IFN0ZXBzLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgIGRvY3VtZW50LmRpc3BhdGNoRXZlbnQodGhpcy5zdWNjZXNFdmVudCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMuZmlsbEZpZWxkcygpO1xuICAgICAgICAgICAgICAgIGRvY3VtZW50LmRpc3BhdGNoRXZlbnQodGhpcy5jb250aW51ZUNvbW1vblRpbWVyKTtcbiAgICAgICAgICAgICAgICB0aGlzLlRpbWVyLnN0YXJ0KCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBmaWxsRmllbGRzKCkge1xuICAgICAgICAgICAgdGhpcy5xdWVzdGlvbiA9IFN0ZXBzW3RoaXMuc3RlcE51bWJlcl0ucXVlc3Rpb247XG4gICAgICAgICAgICB0aGlzLnRleHQuaW5uZXJIVE1MID0gdGhpcy5xdWVzdGlvbjtcbiAgICAgICAgICAgIHRoaXMuYW5zd2VyID0gU3RlcHNbdGhpcy5zdGVwTnVtYmVyXS5hbnN3ZXI7XG5cbiAgICAgICAgICAgIHRoaXMuc3VjY2Vzc01lc3NhZ2VUZXh0LmlubmVySFRNTCA9IFN0ZXBzW3RoaXMuc3RlcE51bWJlcl0uc3VjY2Vzc01lc3NhZ2U7XG4gICAgICAgICAgICB0aGlzLm5leHRRdWVzdEJ0bi5pbm5lclRleHQgPSBTdGVwc1t0aGlzLnN0ZXBOdW1iZXJdLm5leHRCdG5UZXh0O1xuXG4gICAgICAgICAgICB0aGlzLnRpbWVyT3ZlciA9IFN0ZXBzW3RoaXMuc3RlcE51bWJlcl0udGltZU92ZXI7XG4gICAgICAgICAgICB0aGlzLlRpbWVyID0gbmV3IFRpbWVyKHRoaXMudGltZXJPdmVyKTtcblxuICAgICAgICAgICAgdGhpcy5oaW50VGV4dCA9IFN0ZXBzW3RoaXMuc3RlcE51bWJlcl0uaGludDtcbiAgICAgICAgICAgIHRoaXMuSGludENvbXBvbmVudCA9IG5ldyBIaW50Q29tcG9uZW50KHRoaXMuaGludFRleHQpO1xuXG4gICAgICAgICAgICB0aGlzLmlucHV0LnZhbHVlID0gJyc7XG4gICAgICAgICAgICB0aGlzLmhpbnRCdG4uY2xhc3NMaXN0LnJlbW92ZSgnc2hvdycpO1xuICAgICAgICB9XG5cbiAgICAgICAgc2hvdygpIHtcbiAgICAgICAgICAgIHRoaXMuY29udGFpbmVyLmNsYXNzTGlzdC5hZGQoJ3Nob3cnKTtcbiAgICAgICAgICAgIHRoaXMuaW5wdXQuY2xhc3NMaXN0LmFkZCgnc2hvdycpO1xuICAgICAgICAgICAgdGhpcy5UaW1lci5zdGFydCgpO1xuICAgICAgICB9XG5cbiAgICAgICAgaGlkZSgpIHtcbiAgICAgICAgICAgIHRoaXMuY29udGFpbmVyLmNsYXNzTGlzdC5yZW1vdmUoJ3Nob3cnKTtcbiAgICAgICAgfVxuXG5cblxuICAgIH1cblxuICAgIC8vIFF1ZXN0IFRpbWVyXG4gICAgY2xhc3MgVGltZXIge1xuXG4gICAgICAgIGNvbnN0cnVjdG9yKHRpbWVPdmVyKSB7XG5cbiAgICAgICAgICAgIHRoaXMuY29udGFpbmVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3RpbWVyJyk7XG4gICAgICAgICAgICB0aGlzLmF2YWlsYWJsZVNlY29uZHMgPSB0aW1lT3ZlcjtcblxuICAgICAgICAgICAgdGhpcy5zaG93VGltZXJWYWx1ZSgpO1xuXG4gICAgICAgICAgICB0aGlzLmZhaWxFdmVudCA9IG5ldyBFdmVudCgnZmFpbFRpbWVyJyk7XG5cbiAgICAgICAgICAgIHRoaXMuc2Vjb25kc1RvRGFuZ2VyID0gU2V0dXAuc2Vjb25kc1RvRGFuZ2VyO1xuXG4gICAgICAgIH1cblxuICAgICAgICBzdGFydCgpIHtcblxuICAgICAgICAgICAgbGV0IHNlbGYgPSB0aGlzO1xuXG4gICAgICAgICAgICB0aGlzLmNvbnRhaW5lci5jbGFzc0xpc3QuYWRkKCdkYW5nZXInKTtcblxuICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgc2VsZi5jb250YWluZXIuY2xhc3NMaXN0LnJlbW92ZSgnZGFuZ2VyJyk7XG4gICAgICAgICAgICB9LCA4MDApO1xuXG4gICAgICAgICAgICB0aGlzLnRpbWVyID0gc2V0SW50ZXJ2YWwoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHNlbGYuYXZhaWxhYmxlU2Vjb25kcyAtLTtcblxuICAgICAgICAgICAgICAgIHNlbGYuY2hlY2tEYW5nZXIoKTtcbiAgICAgICAgICAgICAgICBzZWxmLmNoZWNrVGltZUlzT3ZlcigpO1xuICAgICAgICAgICAgICAgIHNlbGYuc2hvd1RpbWVyVmFsdWUoKTtcblxuICAgICAgICAgICAgfSwgMTAwMCk7XG4gICAgICAgIH1cblxuICAgICAgICBzdG9wKCkge1xuICAgICAgICAgICAgY2xlYXJJbnRlcnZhbCh0aGlzLnRpbWVyKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHNob3dUaW1lclZhbHVlKCkge1xuXG4gICAgICAgICAgICBsZXQgbWludXRlcyA9IE1hdGguZmxvb3IodGhpcy5hdmFpbGFibGVTZWNvbmRzIC8gNjApO1xuICAgICAgICAgICAgbGV0IHNlY29uZHMgPSB0aGlzLmF2YWlsYWJsZVNlY29uZHMgJSA2MDtcblxuICAgICAgICAgICAgaWYgKG1pbnV0ZXMgPCAxMCkge1xuICAgICAgICAgICAgICAgIG1pbnV0ZXMgPSAnMCcgKyBtaW51dGVzO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoc2Vjb25kcyA8IDEwKSB7XG4gICAgICAgICAgICAgICAgc2Vjb25kcyA9ICcwJyArIHNlY29uZHM7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMuY29udGFpbmVyLmlubmVyVGV4dCA9IG1pbnV0ZXMgKyAnOicgKyBzZWNvbmRzO1xuXG4gICAgICAgIH1cblxuICAgICAgICBjaGVja0RhbmdlcigpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLmF2YWlsYWJsZVNlY29uZHMgPCB0aGlzLnNlY29uZHNUb0Rhbmdlcikge1xuICAgICAgICAgICAgICAgIHRoaXMuY29udGFpbmVyLmNsYXNzTGlzdC5hZGQoJ2RhbmdlcicpO1xuICAgICAgICAgICAgICAgIFNvdW5kcy50aWNrLnZvbHVtZSA9IDE7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBjaGVja1RpbWVJc092ZXIoKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5hdmFpbGFibGVTZWNvbmRzIDwgMSkge1xuICAgICAgICAgICAgICAgIGNsZWFySW50ZXJ2YWwodGhpcy50aW1lcik7XG4gICAgICAgICAgICAgICAgU291bmRzLmFsYXJtLnZvbHVtZSA9IDE7XG4gICAgICAgICAgICAgICAgU291bmRzLnRpY2sudm9sdW1lID0gMDtcbiAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgU291bmRzLmFsYXJtLnZvbHVtZSA9IDA7XG4gICAgICAgICAgICAgICAgfSwgMjAwMCk7XG4gICAgICAgICAgICAgICAgZG9jdW1lbnQuZGlzcGF0Y2hFdmVudCh0aGlzLmZhaWxFdmVudCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgIH1cblxuICAgIC8vIEhpbnQgQ29tcG9uZW50XG4gICAgY2xhc3MgSGludENvbXBvbmVudCB7XG4gICAgICAgIGNvbnN0cnVjdG9yKG1lc3NhZ2UpIHtcbiAgICAgICAgICAgIHRoaXMuY29udGFpbmVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2hpbnQnKTtcbiAgICAgICAgICAgIHRoaXMuaGludFRleHQgPSB0aGlzLmNvbnRhaW5lci5xdWVyeVNlbGVjdG9yKCdwI2hpbnQtdGV4dCcpO1xuICAgICAgICAgICAgdGhpcy5jbG9zZUJ0biA9IHRoaXMuY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoJ2J1dHRvbiNjbG9zZS1oaW50Jyk7XG5cbiAgICAgICAgICAgIHRoaXMuaGludFRleHQuaW5uZXJUZXh0ID0gbWVzc2FnZTtcblxuICAgICAgICAgICAgdGhpcy5pbml0KCk7XG4gICAgICAgIH1cblxuICAgICAgICBpbml0KCkge1xuICAgICAgICAgICAgbGV0IHNlbGYgPSB0aGlzO1xuICAgICAgICAgICAgdGhpcy5jbG9zZUJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBzZWxmLmhpZGUoKTtcbiAgICAgICAgICAgIH0pXG4gICAgICAgIH1cblxuICAgICAgICBzaG93KCkge1xuICAgICAgICAgICAgdGhpcy5jb250YWluZXIuY2xhc3NMaXN0LmFkZCgnc2hvdycpO1xuICAgICAgICB9XG4gICAgICAgIGhpZGUoKSB7XG4gICAgICAgICAgICB0aGlzLmNvbnRhaW5lci5jbGFzc0xpc3QucmVtb3ZlKCdzaG93Jyk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBQbGF5ZXIgQ29tcG9uZW50XG4gICAgY2xhc3MgUGxheWVyIHtcblxuICAgICAgICBjb25zdHJ1Y3RvcihwYXRoVG9GaWxlLCBsb29wID0gZmFsc2UpIHtcbiAgICAgICAgICAgIHRoaXMucGxheUJ0biA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwbGF5Jyk7XG4gICAgICAgICAgICB0aGlzLnN0b3BCdG4gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc3RvcCcpO1xuXG5cbiAgICAgICAgICAgIHRoaXMuc291bmQgPSBuZXcgQXVkaW8ocGF0aFRvRmlsZSk7XG4gICAgICAgICAgICB0aGlzLnNvdW5kLmxvb3AgPSBsb29wO1xuXG4gICAgICAgICAgICB0aGlzLmluaXQoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGluaXQoKSB7XG4gICAgICAgICAgICBsZXQgc2VsZiA9IHRoaXM7XG4gICAgICAgICAgICB0aGlzLnBsYXlCdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgc2VsZi5wbGF5KCk7XG4gICAgICAgICAgICAgICAgc2VsZi5zaG93U3RvcEJ0bigpO1xuICAgICAgICAgICAgICAgIHNlbGYuaGlkZVBsYXlCdG4oKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdGhpcy5zdG9wQnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHNlbGYuc3RvcCgpXG4gICAgICAgICAgICAgICAgc2VsZi5zaG93UGxheUJ0bigpO1xuICAgICAgICAgICAgICAgIHNlbGYuaGlkZVN0b3BCdG4oKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgcGxheSgpIHtcbiAgICAgICAgICAgIHRoaXMuc291bmQucGxheSgpO1xuICAgICAgICB9XG5cbiAgICAgICAgcGF1c2UoKSB7XG4gICAgICAgICAgICB0aGlzLnNvdW5kLnBhdXNlKCk7XG4gICAgICAgIH1cblxuICAgICAgICBzdG9wKCkge1xuICAgICAgICAgICAgdGhpcy5zb3VuZC5wYXVzZSgpO1xuICAgICAgICAgICAgdGhpcy5zb3VuZC5jdXJyZW50VGltZSA9IDA7XG4gICAgICAgIH1cblxuICAgICAgICBzaG93UGxheUJ0bigpIHtcbiAgICAgICAgICAgIHRoaXMucGxheUJ0bi5jbGFzc0xpc3QuYWRkKCdzaG93Jyk7XG4gICAgICAgIH1cblxuICAgICAgICBoaWRlUGxheUJ0bigpIHtcbiAgICAgICAgICAgIHRoaXMucGxheUJ0bi5jbGFzc0xpc3QucmVtb3ZlKCdzaG93Jyk7XG4gICAgICAgIH1cblxuICAgICAgICBzaG93U3RvcEJ0bigpIHtcbiAgICAgICAgICAgIHRoaXMuc3RvcEJ0bi5jbGFzc0xpc3QuYWRkKCdzaG93Jyk7XG4gICAgICAgIH1cblxuICAgICAgICBoaWRlU3RvcEJ0bigpIHtcbiAgICAgICAgICAgIHRoaXMuc3RvcEJ0bi5jbGFzc0xpc3QucmVtb3ZlKCdzaG93Jyk7XG4gICAgICAgIH1cblxuICAgICAgICBpc1BsYXlpbmcobmFtZSkge1xuICAgICAgICAgICAgcmV0dXJuICF0aGlzLnNvdW5kLnBhdXNlZDtcbiAgICAgICAgfVxuXG4gICAgfVxuXG5cblxuICAgIC8vIFN0YXJ0IFRoZSBHYW1lIVxuICAgIG5ldyBHYW1lKCk7XG5cbn0pOyJdfQ==
