document.addEventListener("DOMContentLoaded", function(event) {



    const Steps = [
        {},
        {
            question: "Итак, твое первое задание. Искать конверт нужно там, где ты&nbsp;готовишь отличнейшую лапшу, он&nbsp;рядом с&nbsp;вилкой и&nbsp;ножом.",
            answer: '258',
            hint: 'Конверт в ящике стола, на кухне',
            successMessage: "Дашулька, спасибо за&nbsp;отличные и&nbsp;вкусных&nbsp;блюда, которые ты для&nbsp;нас&nbsp;готовишь! Твой подарок в&nbsp;столе, открой&nbsp;дверцы.",
            timeOver: 15,
            nextBtnText: 'К следующему подарку!',
        },
        {
            question: "Следующий конверт находится там, где ты поддерживаешь жизнь тем, кого дарят твои клиенты любимым&nbsp;людям.",
            answer: '555',
            hint: 'Это цветы, которые ты выращиваешь',
            successMessage: "Спасибо за&nbsp;красоту, которую ты приносишь в&nbsp;этот&nbsp;мир, подарок ищи в&nbsp;шкафу ванной комнаты.",
            timeOver: 30,
            nextBtnText: 'Класс! Дальше',
        },
        {
            question: 'Поторопись к&nbsp;следующему конверту, он&nbsp;находится у&nbsp;хорошего кучерявого человека, живущего по&nbsp;соседству. Твой пароль - "Хочу халву&nbsp;ем, хочу пряники!"',
            answer: '333',
            hint: 'Это Ирина',
            successMessage: 'Спасибо за&nbsp;твое общение, за&nbsp;новости и&nbsp;идеи, которыми ты&nbsp;делишься! Подарок в&nbsp;шкафу (в&nbsp;общем коридоре)',
            timeOver: 15,
            nextBtnText: 'Еще!',
        },
        {
            question: 'Следующий конверт ты&nbsp;найдешь там, куда попадают твои носочки после стирки.',
            answer: '157',
            hint: 'После того, как они высохли',
            successMessage: 'Спасибо за&nbsp;чистоту и&nbsp;порядок, которые ты для&nbsp;нас поддерживаешь! Твой следующий подарок в&nbsp;антресоли!',
            timeOver: 15,
            nextBtnText: 'Ура. Дальше!',
        },
        {
            question: 'Итак, последнее задание. Ответ прячется в&nbsp;мешке набитом гусиными волосами.',
            answer: '369',
            hint: 'Это подушка',
            successMessage: 'Это было послднее задание. На&nbsp;этом поздравление подходит к&nbsp;концу. Спасибо за&nbsp;любовь и&nbsp;ласку, которыми ты нас согреваешь! Целую, обнимаю и&nbsp;люблю&nbsp;тебя, Сладкая! Твой последний подарок под&nbsp;матрасом.',
            timeOver: 15,
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




    new Game();

});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoic2NyaXB0cy5qcyIsInNvdXJjZXNDb250ZW50IjpbImRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJET01Db250ZW50TG9hZGVkXCIsIGZ1bmN0aW9uKGV2ZW50KSB7XG5cblxuXG4gICAgY29uc3QgU3RlcHMgPSBbXG4gICAgICAgIHt9LFxuICAgICAgICB7XG4gICAgICAgICAgICBxdWVzdGlvbjogXCLQmNGC0LDQuiwg0YLQstC+0LUg0L/QtdGA0LLQvtC1INC30LDQtNCw0L3QuNC1LiDQmNGB0LrQsNGC0Ywg0LrQvtC90LLQtdGA0YIg0L3Rg9C20L3QviDRgtCw0LwsINCz0LTQtSDRgtGLJm5ic3A70LPQvtGC0L7QstC40YjRjCDQvtGC0LvQuNGH0L3QtdC50YjRg9GOINC70LDQv9GI0YMsINC+0L0mbmJzcDvRgNGP0LTQvtC8INGBJm5ic3A70LLQuNC70LrQvtC5INC4Jm5ic3A70L3QvtC20L7QvC5cIixcbiAgICAgICAgICAgIGFuc3dlcjogJzI1OCcsXG4gICAgICAgICAgICBoaW50OiAn0JrQvtC90LLQtdGA0YIg0LIg0Y/RidC40LrQtSDRgdGC0L7Qu9CwLCDQvdCwINC60YPRhdC90LUnLFxuICAgICAgICAgICAgc3VjY2Vzc01lc3NhZ2U6IFwi0JTQsNGI0YPQu9GM0LrQsCwg0YHQv9Cw0YHQuNCx0L4g0LfQsCZuYnNwO9C+0YLQu9C40YfQvdGL0LUg0LgmbmJzcDvQstC60YPRgdC90YvRhSZuYnNwO9Cx0LvRjtC00LAsINC60L7RgtC+0YDRi9C1INGC0Ysg0LTQu9GPJm5ic3A70L3QsNGBJm5ic3A70LPQvtGC0L7QstC40YjRjCEg0KLQstC+0Lkg0L/QvtC00LDRgNC+0Log0LImbmJzcDvRgdGC0L7Qu9C1LCDQvtGC0LrRgNC+0LkmbmJzcDvQtNCy0LXRgNGG0YsuXCIsXG4gICAgICAgICAgICB0aW1lT3ZlcjogMTUsXG4gICAgICAgICAgICBuZXh0QnRuVGV4dDogJ9CaINGB0LvQtdC00YPRjtGJ0LXQvNGDINC/0L7QtNCw0YDQutGDIScsXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICAgIHF1ZXN0aW9uOiBcItCh0LvQtdC00YPRjtGJ0LjQuSDQutC+0L3QstC10YDRgiDQvdCw0YXQvtC00LjRgtGB0Y8g0YLQsNC8LCDQs9C00LUg0YLRiyDQv9C+0LTQtNC10YDQttC40LLQsNC10YjRjCDQttC40LfQvdGMINGC0LXQvCwg0LrQvtCz0L4g0LTQsNGA0Y/RgiDRgtCy0L7QuCDQutC70LjQtdC90YLRiyDQu9GO0LHQuNC80YvQvCZuYnNwO9C70Y7QtNGP0LwuXCIsXG4gICAgICAgICAgICBhbnN3ZXI6ICc1NTUnLFxuICAgICAgICAgICAgaGludDogJ9Ct0YLQviDRhtCy0LXRgtGLLCDQutC+0YLQvtGA0YvQtSDRgtGLINCy0YvRgNCw0YnQuNCy0LDQtdGI0YwnLFxuICAgICAgICAgICAgc3VjY2Vzc01lc3NhZ2U6IFwi0KHQv9Cw0YHQuNCx0L4g0LfQsCZuYnNwO9C60YDQsNGB0L7RgtGDLCDQutC+0YLQvtGA0YPRjiDRgtGLINC/0YDQuNC90L7RgdC40YjRjCDQsiZuYnNwO9GN0YLQvtGCJm5ic3A70LzQuNGALCDQv9C+0LTQsNGA0L7QuiDQuNGJ0Lgg0LImbmJzcDvRiNC60LDRhNGDINCy0LDQvdC90L7QuSDQutC+0LzQvdCw0YLRiy5cIixcbiAgICAgICAgICAgIHRpbWVPdmVyOiAzMCxcbiAgICAgICAgICAgIG5leHRCdG5UZXh0OiAn0JrQu9Cw0YHRgSEg0JTQsNC70YzRiNC1JyxcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgcXVlc3Rpb246ICfQn9C+0YLQvtGA0L7Qv9C40YHRjCDQuiZuYnNwO9GB0LvQtdC00YPRjtGJ0LXQvNGDINC60L7QvdCy0LXRgNGC0YMsINC+0L0mbmJzcDvQvdCw0YXQvtC00LjRgtGB0Y8g0YMmbmJzcDvRhdC+0YDQvtGI0LXQs9C+INC60YPRh9C10YDRj9Cy0L7Qs9C+INGH0LXQu9C+0LLQtdC60LAsINC20LjQstGD0YnQtdCz0L4g0L/QviZuYnNwO9GB0L7RgdC10LTRgdGC0LLRgy4g0KLQstC+0Lkg0L/QsNGA0L7Qu9GMIC0gXCLQpdC+0YfRgyDRhdCw0LvQstGDJm5ic3A70LXQvCwg0YXQvtGH0YMg0L/RgNGP0L3QuNC60LghXCInLFxuICAgICAgICAgICAgYW5zd2VyOiAnMzMzJyxcbiAgICAgICAgICAgIGhpbnQ6ICfQrdGC0L4g0JjRgNC40L3QsCcsXG4gICAgICAgICAgICBzdWNjZXNzTWVzc2FnZTogJ9Ch0L/QsNGB0LjQsdC+INC30LAmbmJzcDvRgtCy0L7QtSDQvtCx0YnQtdC90LjQtSwg0LfQsCZuYnNwO9C90L7QstC+0YHRgtC4INC4Jm5ic3A70LjQtNC10LgsINC60L7RgtC+0YDRi9C80Lgg0YLRiyZuYnNwO9C00LXQu9C40YjRjNGB0Y8hINCf0L7QtNCw0YDQvtC6INCyJm5ic3A70YjQutCw0YTRgyAo0LImbmJzcDvQvtCx0YnQtdC8INC60L7RgNC40LTQvtGA0LUpJyxcbiAgICAgICAgICAgIHRpbWVPdmVyOiAxNSxcbiAgICAgICAgICAgIG5leHRCdG5UZXh0OiAn0JXRidC1IScsXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICAgIHF1ZXN0aW9uOiAn0KHQu9C10LTRg9GO0YnQuNC5INC60L7QvdCy0LXRgNGCINGC0YsmbmJzcDvQvdCw0LnQtNC10YjRjCDRgtCw0LwsINC60YPQtNCwINC/0L7Qv9Cw0LTQsNGO0YIg0YLQstC+0Lgg0L3QvtGB0L7Rh9C60Lgg0L/QvtGB0LvQtSDRgdGC0LjRgNC60LguJyxcbiAgICAgICAgICAgIGFuc3dlcjogJzE1NycsXG4gICAgICAgICAgICBoaW50OiAn0J/QvtGB0LvQtSDRgtC+0LPQviwg0LrQsNC6INC+0L3QuCDQstGL0YHQvtGF0LvQuCcsXG4gICAgICAgICAgICBzdWNjZXNzTWVzc2FnZTogJ9Ch0L/QsNGB0LjQsdC+INC30LAmbmJzcDvRh9C40YHRgtC+0YLRgyDQuCZuYnNwO9C/0L7RgNGP0LTQvtC6LCDQutC+0YLQvtGA0YvQtSDRgtGLINC00LvRjyZuYnNwO9C90LDRgSDQv9C+0LTQtNC10YDQttC40LLQsNC10YjRjCEg0KLQstC+0Lkg0YHQu9C10LTRg9GO0YnQuNC5INC/0L7QtNCw0YDQvtC6INCyJm5ic3A70LDQvdGC0YDQtdGB0L7Qu9C4IScsXG4gICAgICAgICAgICB0aW1lT3ZlcjogMTUsXG4gICAgICAgICAgICBuZXh0QnRuVGV4dDogJ9Cj0YDQsC4g0JTQsNC70YzRiNC1IScsXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICAgIHF1ZXN0aW9uOiAn0JjRgtCw0LosINC/0L7RgdC70LXQtNC90LXQtSDQt9Cw0LTQsNC90LjQtS4g0J7RgtCy0LXRgiDQv9GA0Y/Rh9C10YLRgdGPINCyJm5ic3A70LzQtdGI0LrQtSDQvdCw0LHQuNGC0L7QvCDQs9GD0YHQuNC90YvQvNC4INCy0L7Qu9C+0YHQsNC80LguJyxcbiAgICAgICAgICAgIGFuc3dlcjogJzM2OScsXG4gICAgICAgICAgICBoaW50OiAn0K3RgtC+INC/0L7QtNGD0YjQutCwJyxcbiAgICAgICAgICAgIHN1Y2Nlc3NNZXNzYWdlOiAn0K3RgtC+INCx0YvQu9C+INC/0L7RgdC70LTQvdC10LUg0LfQsNC00LDQvdC40LUuINCd0LAmbmJzcDvRjdGC0L7QvCDQv9C+0LfQtNGA0LDQstC70LXQvdC40LUg0L/QvtC00YXQvtC00LjRgiDQuiZuYnNwO9C60L7QvdGG0YMuINCh0L/QsNGB0LjQsdC+INC30LAmbmJzcDvQu9GO0LHQvtCy0Ywg0LgmbmJzcDvQu9Cw0YHQutGDLCDQutC+0YLQvtGA0YvQvNC4INGC0Ysg0L3QsNGBINGB0L7Qs9GA0LXQstCw0LXRiNGMISDQptC10LvRg9GOLCDQvtCx0L3QuNC80LDRjiDQuCZuYnNwO9C70Y7QsdC70Y4mbmJzcDvRgtC10LHRjywg0KHQu9Cw0LTQutCw0Y8hINCi0LLQvtC5INC/0L7RgdC70LXQtNC90LjQuSDQv9C+0LTQsNGA0L7QuiDQv9C+0LQmbmJzcDvQvNCw0YLRgNCw0YHQvtC8LicsXG4gICAgICAgICAgICB0aW1lT3ZlcjogMTUsXG4gICAgICAgICAgICBuZXh0QnRuVGV4dDogJ9Cg0LXQt9GD0LvRjNGC0LDRgtGLJyxcbiAgICAgICAgfSxcbiAgICBdO1xuXG4gICAgY29uc3QgU2V0dXAgPSB7XG4gICAgICAgIGRlYnVnOiBmYWxzZSxcbiAgICAgICAgc2Vjb25kc1RvRGFuZ2VyOiAxMCxcbiAgICAgICAgc291bmRzOiB7XG4gICAgICAgICAgICBkYXNoYTogJy9hc3NldHMvc291bmRzL2Rhc2hhLm1wMycsXG4gICAgICAgICAgICBhcHBsYXVzZTogJy9hc3NldHMvc291bmRzL2FwcGxhdXNlLm1wMycsXG4gICAgICAgICAgICBmaXJld29ya3M6ICcvYXNzZXRzL3NvdW5kcy9maXJld29ya3MubXAzJyxcbiAgICAgICAgICAgIGFsYXJtOiAnL2Fzc2V0cy9zb3VuZHMvYWxhcm0ubXAzJyxcbiAgICAgICAgICAgIHRpY2s6ICcvYXNzZXRzL3NvdW5kcy90aWNrLm1wMycsXG4gICAgICAgIH0sXG4gICAgICAgIHdlbGNvbWVNZXNzYWdlOiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgbWVzc2FnZTogXCLQn9GA0LjQstC10YIsINCU0LDRiNGD0LvRjNC60LAhINCh0LXQs9C+0LTQvdGPINGC0LLQvtC5INC00LXQvdGMJm5ic3A70YDQvtC20LTQtdC90LjRjywg0LAg0LIg0LTQtdC90YwmbmJzcDvRgNC+0LbQtNC10L3QuNGPINC/0YDQuNC90Y/RgtC+INC/0L7Qu9GD0YfQsNGC0Ywg0L/QvtC00LDRgNC60LguINCc0L7QuSDQv9C+0LTQsNGA0L7QuiAtINGN0YLQviZuYnNwO9C40LPRgNCwLCDQsiZuYnNwO9C60L7RgtC+0YDQvtC5INGC0LXQsdC1INC90YPQttC90L4g0LHRg9C00LXRgiDQvdCw0LnRgtC4Jm5ic3A70L/QvtC00LDRgNC60LguINCY0YLQsNC6LCDQstC+0LfQstGA0LDRidCw0LnRgdGPINCyJm5ic3A70LrQvtC80L3QsNGC0YMsINCwJm5ic3A70LfQsNGC0LXQvCDQvdCw0LbQvNC4INCU0LDQu9C10LUuLi5cIixcbiAgICAgICAgICAgICAgICBidG5UZXh0OiAn0JTQsNC70LXQtScsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIG1lc3NhZ2U6ICfQlNC+0LHRgNC+INC/0L7QttCw0LvQvtCy0LDRgtGMINCyJm5ic3A70L/RgNC40LrQu9GO0YfQtdC90LjQtSwg0JTQsNGI0LAt0L/Rg9GC0LXRiNC10YHRgtCy0LXQvdC90LjRhtCwISDQndCwINGC0LLQvtGR0Lwg0L/Rg9GC0Lgg0LHRg9C00YPRgiDQt9Cw0LTQsNC90LjRjyDQvdCwINC/0L7QuNGB0Log0LrQvtC90LLQtdGA0YLQvtCyLiDQkiZuYnNwO9C60L7QvdCy0LXRgNGC0LDRhSDQsdGD0LTQtdGCINGH0LjRgdC70L4sINC60L7RgtC+0YDQvtC1INGC0LXQsdC1INC90YPQttC90L4g0LLQstC10YHRgtC4LiDQn9C+0YHQu9C1INGN0YLQvtCz0L4g0YLRiyZuYnNwO9GD0LfQvdCw0LXRiNGMLCDQs9C00LUg0LfQsNCx0YDQsNGC0Ywg0L/QvtC00LDRgNC+0LouINCh0YPRidC10YHRgtCy0YPRjtGCINC/0L7QtNGB0LrQsNC30LrQuCAtINC+0L3QuCDQv9C+0Y/QstC70Y/RjtGC0YHRjyDRgtC+0LPQtNCwLCDQutC+0LPQtNCwINC30LDQutCw0L3Rh9C40LLQsNC10YLRgdGPINCy0YDQtdC80Y8uINCf0L7QtdGF0LDQu9C4PycsXG4gICAgICAgICAgICAgICAgYnRuVGV4dDogJ9Cf0L7QtdGF0LDQu9C4IScsXG4gICAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgIH07XG5cbiAgICBsZXQgU291bmRzID0ge307XG5cblxuXG4gICAgLy8gUHJlbG9hZGVyXG4gICAgY2xhc3MgUHJlbG9hZGVyIHtcblxuICAgICAgICBjb25zdHJ1Y3RvcigpIHtcblxuICAgICAgICAgICAgdGhpcy5pbWFnZXNJc0xvYWRlZCA9IGZhbHNlO1xuICAgICAgICAgICAgdGhpcy5zb3VuZHNJc0xvYWRlZCA9IGZhbHNlO1xuXG4gICAgICAgICAgICB0aGlzLnByZWxvYWRCYWNrZ3JvdW5kSW1hZ2VzKCk7XG4gICAgICAgICAgICB0aGlzLnByZWxvYWRTb3VuZHMoKTtcblxuICAgICAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignYXNzZXRJc0xvYWRlZCcsIGZ1bmN0aW9uIChldmVudCkge1xuXG4gICAgICAgICAgICAgICAgaWYgKGV2ZW50LnNvdXJjZSA9PSAnaW1hZ2VzJykge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmltYWdlc0lzTG9hZGVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAoZXZlbnQuc291cmNlID09ICdzb3VuZHMnKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc291bmRzSXNMb2FkZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmltYWdlc0lzTG9hZGVkICYmIHRoaXMuc291bmRzSXNMb2FkZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgZG9jdW1lbnQuZGlzcGF0Y2hFdmVudChuZXcgRXZlbnQoJ2FsbEFzc2V0c0lzTG9hZGVkJykpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgfVxuXG4gICAgICAgIHByZWxvYWRCYWNrZ3JvdW5kSW1hZ2VzKCkge1xuXG4gICAgICAgICAgICB0aGlzLnByZWxvYWRCYWNrZ3JvdW5kSW1hZ2VzRWxlbWVudHNBcnIgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdwcmVsb2FkLWJhY2tncm91bmQnKTtcblxuICAgICAgICAgICAgdGhpcy50b3RhbEFtb3VudE9mSW1hZ2VzID0gdGhpcy5wcmVsb2FkQmFja2dyb3VuZEltYWdlc0VsZW1lbnRzQXJyLmxlbmd0aDtcbiAgICAgICAgICAgIHRoaXMuY3VycmVudEFtb3VudE9mTG9hZGVkSW1hZ2VzID0gMDtcblxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLnRvdGFsQW1vdW50T2ZJbWFnZXM7IGkrKykge1xuXG4gICAgICAgICAgICAgICAgbGV0IGVsZW1lbnQgPSB0aGlzLnByZWxvYWRCYWNrZ3JvdW5kSW1hZ2VzRWxlbWVudHNBcnJbaV07XG5cbiAgICAgICAgICAgICAgICBsZXQgc3R5bGUgPVxuICAgICAgICAgICAgICAgICAgICBlbGVtZW50LmN1cnJlbnRTdHlsZSB8fCB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZShlbGVtZW50LCBmYWxzZSksXG4gICAgICAgICAgICAgICAgICAgIHVybCA9IHN0eWxlXG4gICAgICAgICAgICAgICAgICAgICAgICAuYmFja2dyb3VuZEltYWdlXG4gICAgICAgICAgICAgICAgICAgICAgICAuc2xpY2UoNCwgLTEpXG4gICAgICAgICAgICAgICAgICAgICAgICAucmVwbGFjZSgvXCIvZywgXCJcIik7XG5cbiAgICAgICAgICAgICAgICB0aGlzLmltYWdlUHJlbG9hZGVyKHVybCk7XG5cbiAgICAgICAgICAgIH1cblxuICAgICAgICB9XG5cbiAgICAgICAgaW1hZ2VQcmVsb2FkZXIodXJsKSB7XG4gICAgICAgICAgICBsZXQgc2VsZiA9IHRoaXM7XG4gICAgICAgICAgICBsZXQgaW1nID0gbmV3IEltYWdlKCk7XG4gICAgICAgICAgICBpbWcuc3JjID0gdXJsO1xuICAgICAgICAgICAgaW1nLm9ubG9hZCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBzZWxmLmltYWdlSXNMb2FkZWQoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChpbWcuY29tcGxldGUpIGltZy5vbmxvYWQoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGltYWdlSXNMb2FkZWQoKSB7XG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRBbW91bnRPZkxvYWRlZEltYWdlcysrO1xuICAgICAgICAgICAgaWYgKHRoaXMuY3VycmVudEFtb3VudE9mTG9hZGVkSW1hZ2VzID49IHRoaXMudG90YWxBbW91bnRPZkltYWdlcykge1xuICAgICAgICAgICAgICAgIGxldCBldmVudCA9IG5ldyBFdmVudCgnYXNzZXRJc0xvYWRlZCcpO1xuICAgICAgICAgICAgICAgIGV2ZW50LnNvdXJjZSA9ICdpbWFnZXMnO1xuICAgICAgICAgICAgICAgIGRvY3VtZW50LmRpc3BhdGNoRXZlbnQoZXZlbnQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcHJlbG9hZFNvdW5kcygpIHtcblxuICAgICAgICAgICAgbGV0IHNlbGYgPSB0aGlzO1xuXG4gICAgICAgICAgICB0aGlzLnByZWxvYWRTb3VuZHNBcnIgPSBTZXR1cC5zb3VuZHM7XG5cbiAgICAgICAgICAgIHRoaXMudG90YWxBbW91bnRPZlNvdW5kcyA9IE9iamVjdC5rZXlzKFNldHVwLnNvdW5kcykubGVuZ3RoO1xuICAgICAgICAgICAgdGhpcy5jdXJyZW50QW1vdW50T2ZMb2FkZWRTb3VuZHMgPSAwO1xuXG4gICAgICAgICAgICBsZXQgdGVtcFNvdW5kcyA9IHt9O1xuXG4gICAgICAgICAgICBmb3IgKGxldCBuYW1lIGluIFNldHVwLnNvdW5kcykge1xuXG4gICAgICAgICAgICAgICAgdGVtcFNvdW5kc1tuYW1lXSA9IG5ldyBBdWRpbyhTZXR1cC5zb3VuZHNbbmFtZV0pO1xuXG4gICAgICAgICAgICAgICAgdGVtcFNvdW5kc1tuYW1lXS5hZGRFdmVudExpc3RlbmVyKCdjYW5wbGF5dGhyb3VnaCcsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5zb3VuZElzTG9hZGVkKCk7XG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgU291bmRzID0gdGVtcFNvdW5kcztcblxuICAgICAgICB9XG5cbiAgICAgICAgc291bmRJc0xvYWRlZCgpIHtcbiAgICAgICAgICAgIHRoaXMuY3VycmVudEFtb3VudE9mTG9hZGVkU291bmRzICsrO1xuICAgICAgICAgICAgaWYgKHRoaXMuY3VycmVudEFtb3VudE9mTG9hZGVkU291bmRzID49IHRoaXMudG90YWxBbW91bnRPZlNvdW5kcykge1xuICAgICAgICAgICAgICAgIGxldCBldmVudCA9IG5ldyBFdmVudCgnYXNzZXRJc0xvYWRlZCcpO1xuICAgICAgICAgICAgICAgIGV2ZW50LnNvdXJjZSA9ICdzb3VuZHMnO1xuICAgICAgICAgICAgICAgIGRvY3VtZW50LmRpc3BhdGNoRXZlbnQoZXZlbnQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICB9XG5cbiAgICAvLyBNYWluIENvbXBvbmVudFxuICAgIGNsYXNzIEdhbWUge1xuXG4gICAgICAgIGNvbnN0cnVjdG9yKCkge1xuXG4gICAgICAgICAgICBuZXcgUHJlbG9hZGVyKCk7XG5cbiAgICAgICAgICAgIC8vIFNjcmVlbnNcbiAgICAgICAgICAgIHRoaXMubG9hZGluZ1NjcmVlbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdsb2FkaW5nJyk7XG4gICAgICAgICAgICB0aGlzLnB5cm9TY3JlZW4gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncHlybycpO1xuICAgICAgICAgICAgdGhpcy5nYW1lT3ZlclNjcmVlbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdnYW1lLW92ZXInKTtcblxuXG4gICAgICAgICAgICAvLyBSZXN1bHRzXG4gICAgICAgICAgICB0aGlzLnJlc3VsdFRpbWUgPSB0aGlzLmdhbWVPdmVyU2NyZWVuLnF1ZXJ5U2VsZWN0b3IoJyNyZXN1bHQtdGltZScpO1xuICAgICAgICAgICAgdGhpcy5oaW50QW1vdW50ID0gdGhpcy5nYW1lT3ZlclNjcmVlbi5xdWVyeVNlbGVjdG9yKCcjaGludC1hbW91bnQnKTtcblxuXG4gICAgICAgICAgICAvLyBDb21wb25lbnRzXG4gICAgICAgICAgICB0aGlzLkZ1bGxzY3JlZW5Db21wb25lbnQgPSBuZXcgRnVsbHNjcmVlbkNvbXBvbmVudCgpO1xuICAgICAgICAgICAgdGhpcy5XZWxjb21lQ29tcG9uZW50ID0gbmV3IFdlbGNvbWUoKTtcbiAgICAgICAgICAgIHRoaXMuQ29tbW9uVGltZXJDb21wb25lbnQgPSBuZXcgQ29tbW9uVGltZXJDb21wb25lbnQoKTtcbiAgICAgICAgICAgIHRoaXMuUXVlc3RDb21wb25lbnQgPSBuZXcgUXVlc3RDb21wb25lbnQoKTtcblxuXG4gICAgICAgICAgICAvLyBCaW5kIEV2ZW50c1xuICAgICAgICAgICAgdGhpcy5pbml0RXZlbnRzKCk7XG5cbiAgICAgICAgfVxuXG4gICAgICAgIC8vIEJpbmcgRXZlbnRzXG4gICAgICAgIGluaXRFdmVudHMoKSB7XG5cbiAgICAgICAgICAgIGxldCBzZWxmID0gdGhpcztcblxuICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgZG9jdW1lbnQuZGlzcGF0Y2hFdmVudChuZXcgRXZlbnQoJ2FsbEFzc2V0c0lzTG9hZGVkJykpO1xuICAgICAgICAgICAgfSwgMzAwMCk7XG5cbiAgICAgICAgICAgIC8vIEFwcCBpcyBMb2FkZWRcbiAgICAgICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2FsbEFzc2V0c0lzTG9hZGVkJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHNlbGYuaGlkZUxvYWRpbmcoKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAvLyBGdWxsc2NyZWVuIERvbmVcbiAgICAgICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2Z1bGxzY3JlZW5Eb25lJywgZnVuY3Rpb24gKCkge1xuXG4gICAgICAgICAgICAgICAgc2VsZi5XZWxjb21lQ29tcG9uZW50LnNob3coKTtcblxuICAgICAgICAgICAgfSk7XG5cblxuICAgICAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignd2VsY29tZURvbmUnLCBmdW5jdGlvbiAoKSB7XG5cbiAgICAgICAgICAgICAgICBzZWxmLldlbGNvbWVDb21wb25lbnQuaGlkZSgpO1xuICAgICAgICAgICAgICAgIHNlbGYuUXVlc3RDb21wb25lbnQuc2hvdygpO1xuICAgICAgICAgICAgICAgIHNlbGYuQ29tbW9uVGltZXJDb21wb25lbnQuc3RhcnQoKTtcblxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIC8vIFF1ZXN0IERvbmVcbiAgICAgICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2V2ZW50UXVlc3RTdWNjZXNzJywgZnVuY3Rpb24gKCkge1xuXG4gICAgICAgICAgICAgICAgLy8gbG9hZCByZXN1bHRzXG4gICAgICAgICAgICAgICAgc2VsZi5yZXN1bHRUaW1lLmlubmVyVGV4dCA9IHNlbGYuQ29tbW9uVGltZXJDb21wb25lbnQuZ2V0Q29tbW9uVGltZSgpO1xuICAgICAgICAgICAgICAgIHNlbGYuaGludEFtb3VudC5pbm5lclRleHQgPSBzZWxmLlF1ZXN0Q29tcG9uZW50LmhpbnRBbW91bnQ7XG5cbiAgICAgICAgICAgICAgICBzZWxmLkNvbW1vblRpbWVyQ29tcG9uZW50LnN0b3AoKTtcbiAgICAgICAgICAgICAgICBzZWxmLlF1ZXN0Q29tcG9uZW50LmhpZGUoKTtcbiAgICAgICAgICAgICAgICBzZWxmLmdhbWVPdmVyU2NyZWVuLmNsYXNzTGlzdC5hZGQoJ3Nob3cnKTtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnR2FtZSBPdmVyISEhJyk7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coc2VsZi5Db21tb25UaW1lckNvbXBvbmVudC5nZXRDb21tb25UaW1lKCkpO1xuXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgLy8gUGF1c2UgQ29tbW9uIFRpbWVyXG4gICAgICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdwYXVzZVRpbWVyJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHNlbGYuQ29tbW9uVGltZXJDb21wb25lbnQucGF1c2UoKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAvLyBDb250aW51ZSBDb21tb24gVGltZXJcbiAgICAgICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2NvbnRpbnVlVGltZXInLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgc2VsZi5Db21tb25UaW1lckNvbXBvbmVudC5jb250aW51ZSgpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgfVxuXG4gICAgICAgIC8vTG9hZGluZ1xuICAgICAgICBoaWRlTG9hZGluZygpIHtcbiAgICAgICAgICAgIHRoaXMubG9hZGluZ1NjcmVlbi5jbGFzc0xpc3QucmVtb3ZlKCdzaG93Jyk7XG4gICAgICAgIH1cblxuICAgIH1cblxuICAgIC8vIEZ1bGxzY3JlZW4gQ2xhc3NcbiAgICBjbGFzcyBGdWxsc2NyZWVuQ29tcG9uZW50IHtcblxuICAgICAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgICAgIHRoaXMuY29udGFpbmVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2Z1bGxzY3JlZW4nKTtcbiAgICAgICAgICAgIHRoaXMuY29udGFpbmVyLmNsYXNzTGlzdC5hZGQoJ3Nob3cnKTtcbiAgICAgICAgICAgIHRoaXMuYnRuID0gdGhpcy5jb250YWluZXIucXVlcnlTZWxlY3RvcignYnV0dG9uJyk7XG4gICAgICAgICAgICB0aGlzLmZ1bGxzY3JlZW5Eb25lID0gbmV3IEV2ZW50KCdmdWxsc2NyZWVuRG9uZScpO1xuICAgICAgICAgICAgbGV0IHNlbGYgPSB0aGlzO1xuICAgICAgICAgICAgdGhpcy5idG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgaWYgKCFTZXR1cC5kZWJ1Zykge1xuICAgICAgICAgICAgICAgICAgICBzZWxmLmxhdW5jaEZ1bGxTY3JlZW4oZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgc2VsZi5idG4uY2xhc3NMaXN0LmFkZCgnc29mdF9oaWRlJyk7XG4gICAgICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIHNlbGYuY29udGFpbmVyLmNsYXNzTGlzdC5yZW1vdmUoJ3Nob3cnKTtcbiAgICAgICAgICAgICAgICAgICAgZG9jdW1lbnQuZGlzcGF0Y2hFdmVudChzZWxmLmZ1bGxzY3JlZW5Eb25lKTtcbiAgICAgICAgICAgICAgICB9LCAxMDAwKTtcbiAgICAgICAgICAgIH0pXG4gICAgICAgIH1cblxuICAgICAgICBsYXVuY2hGdWxsU2NyZWVuKGVsZW1lbnQpIHtcbiAgICAgICAgICAgIGlmKGVsZW1lbnQucmVxdWVzdEZ1bGxTY3JlZW4pIHtcbiAgICAgICAgICAgICAgICBlbGVtZW50LnJlcXVlc3RGdWxsU2NyZWVuKCk7XG4gICAgICAgICAgICB9IGVsc2UgaWYoZWxlbWVudC5tb3pSZXF1ZXN0RnVsbFNjcmVlbikge1xuICAgICAgICAgICAgICAgIGVsZW1lbnQubW96UmVxdWVzdEZ1bGxTY3JlZW4oKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZihlbGVtZW50LndlYmtpdFJlcXVlc3RGdWxsU2NyZWVuKSB7XG4gICAgICAgICAgICAgICAgZWxlbWVudC53ZWJraXRSZXF1ZXN0RnVsbFNjcmVlbigpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgY2FuY2VsRnVsbHNjcmVlbigpIHtcbiAgICAgICAgICAgIGlmKGRvY3VtZW50LmNhbmNlbEZ1bGxTY3JlZW4pIHtcbiAgICAgICAgICAgICAgICBkb2N1bWVudC5jYW5jZWxGdWxsU2NyZWVuKCk7XG4gICAgICAgICAgICB9IGVsc2UgaWYoZG9jdW1lbnQubW96Q2FuY2VsRnVsbFNjcmVlbikge1xuICAgICAgICAgICAgICAgIGRvY3VtZW50Lm1vekNhbmNlbEZ1bGxTY3JlZW4oKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZihkb2N1bWVudC53ZWJraXRDYW5jZWxGdWxsU2NyZWVuKSB7XG4gICAgICAgICAgICAgICAgZG9jdW1lbnQud2Via2l0Q2FuY2VsRnVsbFNjcmVlbigpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICB9XG5cbiAgICAvLyBXZWxjb21lIE1lc3NhZ2VzXG4gICAgY2xhc3MgV2VsY29tZSB7XG5cbiAgICAgICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgICAgICB0aGlzLmNvbnRhaW5lciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd3ZWxjb21lJyk7XG4gICAgICAgICAgICB0aGlzLmFwcGVhcnRpbkJsb2NrID0gdGhpcy5jb250YWluZXIucXVlcnlTZWxlY3RvcignI3dlbGNvbWUtdGV4dCcpO1xuICAgICAgICAgICAgdGhpcy50ZXh0ID0gdGhpcy5jb250YWluZXIucXVlcnlTZWxlY3RvcignI3dlbGNvbWUtdGV4dCA+IHAnKTtcbiAgICAgICAgICAgIHRoaXMubmV4dEJ0biA9IHRoaXMuY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoJ2J1dHRvbiN3ZWxjb21lLW5leHQtYnRuJyk7XG4gICAgICAgICAgICB0aGlzLmV2ZW50RG9uZSA9IG5ldyBFdmVudCgnd2VsY29tZURvbmUnKTtcbiAgICAgICAgICAgIHRoaXMubXVzaWNEYXNoYSA9IG5ldyBQbGF5ZXIoU2V0dXAuc291bmRzLmRhc2hhKTtcbiAgICAgICAgICAgIHRoaXMuaW5pdCgpO1xuICAgICAgICB9XG5cbiAgICAgICAgaW5pdCgpIHtcblxuICAgICAgICAgICAgdGhpcy5jdXJyZW50TWVzc2FnZSA9IDA7XG5cbiAgICAgICAgICAgIHRoaXMuZmlsbEZpZWxkcygpO1xuXG4gICAgICAgICAgICBsZXQgc2VsZiA9IHRoaXM7XG4gICAgICAgICAgICB0aGlzLm5leHRCdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgaWYgKHNlbGYuY3VycmVudE1lc3NhZ2UgPT0gMCkge1xuICAgICAgICAgICAgICAgICAgICBTb3VuZHMuZGFzaGEucGxheSgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoc2VsZi5jdXJyZW50TWVzc2FnZSA9PSAxKSB7XG4gICAgICAgICAgICAgICAgICAgIFNvdW5kcy5kYXNoYS5wYXVzZSgpO1xuICAgICAgICAgICAgICAgICAgICBTb3VuZHMudGljay52b2x1bWUgPSAwO1xuICAgICAgICAgICAgICAgICAgICBTb3VuZHMudGljay5sb29wID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgU291bmRzLnRpY2sucGxheSgpO1xuICAgICAgICAgICAgICAgICAgICBTb3VuZHMuYWxhcm0udm9sdW1lID0gMDtcbiAgICAgICAgICAgICAgICAgICAgU291bmRzLmFsYXJtLmxvb3AgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICBTb3VuZHMuYWxhcm0ucGxheSgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBzZWxmLm5leHRNZXNzYWdlKCk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICB9XG5cbiAgICAgICAgZmlsbEZpZWxkcygpIHtcbiAgICAgICAgICAgIHRoaXMudGV4dC5pbm5lckhUTUwgPSBTZXR1cC53ZWxjb21lTWVzc2FnZVt0aGlzLmN1cnJlbnRNZXNzYWdlXS5tZXNzYWdlO1xuICAgICAgICAgICAgdGhpcy5uZXh0QnRuLmlubmVyVGV4dCA9IFNldHVwLndlbGNvbWVNZXNzYWdlW3RoaXMuY3VycmVudE1lc3NhZ2VdLmJ0blRleHQ7XG4gICAgICAgIH1cblxuICAgICAgICBuZXh0TWVzc2FnZSgpIHtcbiAgICAgICAgICAgIHRoaXMuY3VycmVudE1lc3NhZ2UrKztcbiAgICAgICAgICAgIGlmICh0aGlzLmN1cnJlbnRNZXNzYWdlID49IFNldHVwLndlbGNvbWVNZXNzYWdlLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgIGRvY3VtZW50LmRpc3BhdGNoRXZlbnQodGhpcy5ldmVudERvbmUpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5jdXJyZW50TWVzc2FnZSA9PSAxKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICghU2V0dXAuZGVidWcpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubXVzaWNEYXNoYS5wbGF5KCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdGhpcy5maWxsRmllbGRzKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBzaG93KCkge1xuICAgICAgICAgICAgdGhpcy5jb250YWluZXIuY2xhc3NMaXN0LmFkZCgnc2hvdycpO1xuICAgICAgICAgICAgdGhpcy5hcHBlYXJ0aW5CbG9jay5jbGFzc0xpc3QuYWRkKCdzaG93Jyk7XG4gICAgICAgICAgICB0aGlzLm5leHRCdG4uY2xhc3NMaXN0LmFkZCgnc2hvdycpO1xuICAgICAgICB9XG5cbiAgICAgICAgaGlkZSgpIHtcbiAgICAgICAgICAgIHRoaXMuY29udGFpbmVyLmNsYXNzTGlzdC5yZW1vdmUoJ3Nob3cnKTtcbiAgICAgICAgfVxuXG4gICAgfVxuXG4gICAgLy8gQ29tbW9uVGltZSBDbGFzc1xuICAgIGNsYXNzIENvbW1vblRpbWVyQ29tcG9uZW50IHtcblxuICAgICAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgICAgIHRoaXMuY3VycmVudFNlY29uZHMgPSAwO1xuICAgICAgICAgICAgdGhpcy5pc1BhdXNlZCA9IGZhbHNlO1xuICAgICAgICB9XG5cbiAgICAgICAgc3RhcnQoKSB7XG4gICAgICAgICAgICBsZXQgc2VsZiA9IHRoaXM7XG4gICAgICAgICAgICB0aGlzLnRpbWVyID0gc2V0SW50ZXJ2YWwoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIGlmICghc2VsZi5pc1BhdXNlZCkge1xuICAgICAgICAgICAgICAgICAgICBzZWxmLmN1cnJlbnRTZWNvbmRzICsrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sIDEwMDApO1xuICAgICAgICB9XG5cbiAgICAgICAgcGF1c2UoKSB7XG4gICAgICAgICAgICB0aGlzLmlzUGF1c2VkID0gdHJ1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnRpbnVlKCkge1xuICAgICAgICAgICAgdGhpcy5pc1BhdXNlZCA9IGZhbHNlO1xuICAgICAgICB9XG5cbiAgICAgICAgc3RvcCgpIHtcbiAgICAgICAgICAgIGNsZWFySW50ZXJ2YWwodGhpcy50aW1lcik7XG4gICAgICAgIH1cblxuICAgICAgICBnZXRDb21tb25UaW1lKCkge1xuXG4gICAgICAgICAgICBsZXQgbWludXRlcyA9IE1hdGguZmxvb3IodGhpcy5jdXJyZW50U2Vjb25kcyAvIDYwKTtcbiAgICAgICAgICAgIGxldCBzZWNvbmRzID0gdGhpcy5jdXJyZW50U2Vjb25kcyAlIDYwO1xuXG4gICAgICAgICAgICBpZiAobWludXRlcyA8IDEwKSB7XG4gICAgICAgICAgICAgICAgbWludXRlcyA9ICcwJyArIG1pbnV0ZXM7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChzZWNvbmRzIDwgMTApIHtcbiAgICAgICAgICAgICAgICBzZWNvbmRzID0gJzAnICsgc2Vjb25kcztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIG1pbnV0ZXMgKyAnOicgKyBzZWNvbmRzOztcbiAgICAgICAgfVxuXG4gICAgfVxuXG4gICAgLy8gUWVzdFN0ZXAgQ2xhc3NcbiAgICBjbGFzcyBRdWVzdENvbXBvbmVudCB7XG5cbiAgICAgICAgY29uc3RydWN0b3IoKSB7XG5cbiAgICAgICAgICAgIHRoaXMuY29udGFpbmVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3F1ZXN0Jyk7XG5cbiAgICAgICAgICAgIHRoaXMudGV4dCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd0ZXh0Jyk7XG4gICAgICAgICAgICB0aGlzLmlucHV0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2Fuc3dlci1pbnB1dCcpO1xuXG4gICAgICAgICAgICB0aGlzLnN1Y2Nlc3NNZXNzYWdlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3N1Y2Nlc3MtbWVzc2FnZScpO1xuICAgICAgICAgICAgdGhpcy5zdWNjZXNzTWVzc2FnZVRleHQgPSB0aGlzLnN1Y2Nlc3NNZXNzYWdlLnF1ZXJ5U2VsZWN0b3IoJ3AjdGV4dC1zdWNjZXNzLW1lc3NhZ2UnKTtcbiAgICAgICAgICAgIHRoaXMubmV4dFF1ZXN0QnRuID0gdGhpcy5zdWNjZXNzTWVzc2FnZS5xdWVyeVNlbGVjdG9yKCdidXR0b24jbmV4dC1xdWVzdC1idG4nKTtcblxuICAgICAgICAgICAgdGhpcy5oaW50QnRuID0gdGhpcy5jb250YWluZXIucXVlcnlTZWxlY3RvcignYnV0dG9uI2hpbnQtYnRuJyk7XG5cbiAgICAgICAgICAgIHRoaXMuc3VjY2VzRXZlbnQgPSBuZXcgRXZlbnQoJ2V2ZW50UXVlc3RTdWNjZXNzJyk7XG4gICAgICAgICAgICB0aGlzLnBhdXNlQ29tbW9uVGltZXIgPSBuZXcgRXZlbnQoJ3BhdXNlVGltZXInKTtcbiAgICAgICAgICAgIHRoaXMuY29udGludWVDb21tb25UaW1lciA9IG5ldyBFdmVudCgnY29udGludWVUaW1lcicpO1xuICAgICAgICAgICAgdGhpcy5zdG9wVGlja1NvdW5kID0gbmV3IEV2ZW50KCdzdG9wVGlja1NvdW5kJyk7XG4gICAgICAgICAgICB0aGlzLnN0b3BBbGFybVNvdW5kID0gbmV3IEV2ZW50KCdzdG9wQWxhcm1Tb3VuZCcpO1xuXG4gICAgICAgICAgICB0aGlzLnNvdW5kQXBwbGF1c2UgPSBuZXcgUGxheWVyKFNldHVwLnNvdW5kcy5hcHBsYXVzZSk7XG4gICAgICAgICAgICB0aGlzLnNvdW5kRmlyZXdvcmtzID0gbmV3IFBsYXllcihTZXR1cC5zb3VuZHMuZmlyZXdvcmtzKTtcblxuICAgICAgICAgICAgdGhpcy5pbml0KCk7XG5cbiAgICAgICAgfVxuXG4gICAgICAgIGluaXQoKSB7XG5cbiAgICAgICAgICAgIHRoaXMuc3RlcE51bWJlciA9IDE7XG4gICAgICAgICAgICB0aGlzLmhpbnRBbW91bnQgPSAwO1xuXG4gICAgICAgICAgICB0aGlzLmZpbGxGaWVsZHMoKTtcblxuICAgICAgICAgICAgbGV0IHNlbGYgPSB0aGlzO1xuXG4gICAgICAgICAgICB0aGlzLmlucHV0LnNldEF0dHJpYnV0ZSgnbWF4bGVuZ3RoJywgdGhpcy5hbnN3ZXIubGVuZ3RoKTtcblxuICAgICAgICAgICAgdGhpcy5pbnB1dC5hZGRFdmVudExpc3RlbmVyKCdpbnB1dCcsIGZ1bmN0aW9uICgpIHtcblxuICAgICAgICAgICAgICAgIGlmICh0aGlzLnZhbHVlLmxlbmd0aCA9PSBzZWxmLmFuc3dlci5sZW5ndGgpIHtcblxuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy52YWx1ZSA9PSBzZWxmLmFuc3dlcikge1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxmLnJpZ2h0QW5zd2VyKCk7XG5cbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcblxuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5pbnB1dC5jbGFzc0xpc3QuYWRkKCd3cm9uZycpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZWxmLmlucHV0LmNsYXNzTGlzdC5yZW1vdmUoJ3dyb25nJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5pbnB1dC52YWx1ZSA9ICcnO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSwgMTAwMCk7XG5cbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgdGhpcy5oaW50QnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHNlbGYuaGludEFtb3VudCArKztcbiAgICAgICAgICAgICAgICBzZWxmLkhpbnRDb21wb25lbnQuc2hvdygpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHRoaXMubmV4dFF1ZXN0QnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xuXG4gICAgICAgICAgICAgICAgc2VsZi5zdWNjZXNzTWVzc2FnZS5jbGFzc0xpc3QucmVtb3ZlKCdzaG93Jyk7XG5cbiAgICAgICAgICAgICAgICBzZWxmLm5leHRTdGVwKCk7XG5cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdmYWlsVGltZXInLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgc2VsZi5oaW50QnRuLmNsYXNzTGlzdC5hZGQoJ3Nob3cnKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgIH1cblxuICAgICAgICByaWdodEFuc3dlcigpIHtcblxuICAgICAgICAgICAgdGhpcy5UaW1lci5zdG9wKCk7XG5cbiAgICAgICAgICAgIGRvY3VtZW50LmRpc3BhdGNoRXZlbnQodGhpcy5wYXVzZUNvbW1vblRpbWVyKTtcblxuICAgICAgICAgICAgdGhpcy5zdWNjZXNzTWVzc2FnZS5jbGFzc0xpc3QuYWRkKCdzaG93Jyk7XG4gICAgICAgICAgICB0aGlzLm5leHRRdWVzdEJ0bi5mb2N1cygpO1xuXG4gICAgICAgICAgICBTb3VuZHMuYXBwbGF1c2UucGxheSgpO1xuICAgICAgICAgICAgU291bmRzLmZpcmV3b3Jrcy5wbGF5KCk7XG4gICAgICAgICAgICBTb3VuZHMudGljay52b2x1bWUgPSAwO1xuICAgICAgICAgICAgU291bmRzLmFsYXJtLnZvbHVtZSA9IDA7XG5cbiAgICAgICAgfVxuXG4gICAgICAgIG5leHRTdGVwKCkge1xuICAgICAgICAgICAgdGhpcy5zdGVwTnVtYmVyKys7XG4gICAgICAgICAgICBpZiAodGhpcy5zdGVwTnVtYmVyID49IFN0ZXBzLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgIGRvY3VtZW50LmRpc3BhdGNoRXZlbnQodGhpcy5zdWNjZXNFdmVudCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMuZmlsbEZpZWxkcygpO1xuICAgICAgICAgICAgICAgIGRvY3VtZW50LmRpc3BhdGNoRXZlbnQodGhpcy5jb250aW51ZUNvbW1vblRpbWVyKTtcbiAgICAgICAgICAgICAgICB0aGlzLlRpbWVyLnN0YXJ0KCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBmaWxsRmllbGRzKCkge1xuICAgICAgICAgICAgdGhpcy5xdWVzdGlvbiA9IFN0ZXBzW3RoaXMuc3RlcE51bWJlcl0ucXVlc3Rpb247XG4gICAgICAgICAgICB0aGlzLnRleHQuaW5uZXJIVE1MID0gdGhpcy5xdWVzdGlvbjtcbiAgICAgICAgICAgIHRoaXMuYW5zd2VyID0gU3RlcHNbdGhpcy5zdGVwTnVtYmVyXS5hbnN3ZXI7XG5cbiAgICAgICAgICAgIHRoaXMuc3VjY2Vzc01lc3NhZ2VUZXh0LmlubmVySFRNTCA9IFN0ZXBzW3RoaXMuc3RlcE51bWJlcl0uc3VjY2Vzc01lc3NhZ2U7XG4gICAgICAgICAgICB0aGlzLm5leHRRdWVzdEJ0bi5pbm5lclRleHQgPSBTdGVwc1t0aGlzLnN0ZXBOdW1iZXJdLm5leHRCdG5UZXh0O1xuXG4gICAgICAgICAgICB0aGlzLnRpbWVyT3ZlciA9IFN0ZXBzW3RoaXMuc3RlcE51bWJlcl0udGltZU92ZXI7XG4gICAgICAgICAgICB0aGlzLlRpbWVyID0gbmV3IFRpbWVyKHRoaXMudGltZXJPdmVyKTtcblxuICAgICAgICAgICAgdGhpcy5oaW50VGV4dCA9IFN0ZXBzW3RoaXMuc3RlcE51bWJlcl0uaGludDtcbiAgICAgICAgICAgIHRoaXMuSGludENvbXBvbmVudCA9IG5ldyBIaW50Q29tcG9uZW50KHRoaXMuaGludFRleHQpO1xuXG4gICAgICAgICAgICB0aGlzLmlucHV0LnZhbHVlID0gJyc7XG4gICAgICAgICAgICB0aGlzLmhpbnRCdG4uY2xhc3NMaXN0LnJlbW92ZSgnc2hvdycpO1xuICAgICAgICB9XG5cbiAgICAgICAgc2hvdygpIHtcbiAgICAgICAgICAgIHRoaXMuY29udGFpbmVyLmNsYXNzTGlzdC5hZGQoJ3Nob3cnKTtcbiAgICAgICAgICAgIHRoaXMuaW5wdXQuY2xhc3NMaXN0LmFkZCgnc2hvdycpO1xuICAgICAgICAgICAgdGhpcy5UaW1lci5zdGFydCgpO1xuICAgICAgICB9XG5cbiAgICAgICAgaGlkZSgpIHtcbiAgICAgICAgICAgIHRoaXMuY29udGFpbmVyLmNsYXNzTGlzdC5yZW1vdmUoJ3Nob3cnKTtcbiAgICAgICAgfVxuXG5cblxuICAgIH1cblxuICAgIC8vIFF1ZXN0IFRpbWVyXG4gICAgY2xhc3MgVGltZXIge1xuXG4gICAgICAgIGNvbnN0cnVjdG9yKHRpbWVPdmVyKSB7XG5cbiAgICAgICAgICAgIHRoaXMuY29udGFpbmVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3RpbWVyJyk7XG4gICAgICAgICAgICB0aGlzLmF2YWlsYWJsZVNlY29uZHMgPSB0aW1lT3ZlcjtcblxuICAgICAgICAgICAgdGhpcy5zaG93VGltZXJWYWx1ZSgpO1xuXG4gICAgICAgICAgICB0aGlzLmZhaWxFdmVudCA9IG5ldyBFdmVudCgnZmFpbFRpbWVyJyk7XG5cbiAgICAgICAgICAgIHRoaXMuc2Vjb25kc1RvRGFuZ2VyID0gU2V0dXAuc2Vjb25kc1RvRGFuZ2VyO1xuXG4gICAgICAgIH1cblxuICAgICAgICBzdGFydCgpIHtcblxuICAgICAgICAgICAgbGV0IHNlbGYgPSB0aGlzO1xuXG4gICAgICAgICAgICB0aGlzLmNvbnRhaW5lci5jbGFzc0xpc3QuYWRkKCdkYW5nZXInKTtcblxuICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgc2VsZi5jb250YWluZXIuY2xhc3NMaXN0LnJlbW92ZSgnZGFuZ2VyJyk7XG4gICAgICAgICAgICB9LCA4MDApO1xuXG4gICAgICAgICAgICB0aGlzLnRpbWVyID0gc2V0SW50ZXJ2YWwoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHNlbGYuYXZhaWxhYmxlU2Vjb25kcyAtLTtcblxuICAgICAgICAgICAgICAgIHNlbGYuY2hlY2tEYW5nZXIoKTtcbiAgICAgICAgICAgICAgICBzZWxmLmNoZWNrVGltZUlzT3ZlcigpO1xuICAgICAgICAgICAgICAgIHNlbGYuc2hvd1RpbWVyVmFsdWUoKTtcblxuICAgICAgICAgICAgfSwgMTAwMCk7XG4gICAgICAgIH1cblxuICAgICAgICBzdG9wKCkge1xuICAgICAgICAgICAgY2xlYXJJbnRlcnZhbCh0aGlzLnRpbWVyKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHNob3dUaW1lclZhbHVlKCkge1xuXG4gICAgICAgICAgICBsZXQgbWludXRlcyA9IE1hdGguZmxvb3IodGhpcy5hdmFpbGFibGVTZWNvbmRzIC8gNjApO1xuICAgICAgICAgICAgbGV0IHNlY29uZHMgPSB0aGlzLmF2YWlsYWJsZVNlY29uZHMgJSA2MDtcblxuICAgICAgICAgICAgaWYgKG1pbnV0ZXMgPCAxMCkge1xuICAgICAgICAgICAgICAgIG1pbnV0ZXMgPSAnMCcgKyBtaW51dGVzO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoc2Vjb25kcyA8IDEwKSB7XG4gICAgICAgICAgICAgICAgc2Vjb25kcyA9ICcwJyArIHNlY29uZHM7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMuY29udGFpbmVyLmlubmVyVGV4dCA9IG1pbnV0ZXMgKyAnOicgKyBzZWNvbmRzO1xuXG4gICAgICAgIH1cblxuICAgICAgICBjaGVja0RhbmdlcigpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLmF2YWlsYWJsZVNlY29uZHMgPCB0aGlzLnNlY29uZHNUb0Rhbmdlcikge1xuICAgICAgICAgICAgICAgIHRoaXMuY29udGFpbmVyLmNsYXNzTGlzdC5hZGQoJ2RhbmdlcicpO1xuICAgICAgICAgICAgICAgIFNvdW5kcy50aWNrLnZvbHVtZSA9IDE7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBjaGVja1RpbWVJc092ZXIoKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5hdmFpbGFibGVTZWNvbmRzIDwgMSkge1xuICAgICAgICAgICAgICAgIGNsZWFySW50ZXJ2YWwodGhpcy50aW1lcik7XG4gICAgICAgICAgICAgICAgU291bmRzLmFsYXJtLnZvbHVtZSA9IDE7XG4gICAgICAgICAgICAgICAgU291bmRzLnRpY2sudm9sdW1lID0gMDtcbiAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgU291bmRzLmFsYXJtLnZvbHVtZSA9IDA7XG4gICAgICAgICAgICAgICAgfSwgMjAwMCk7XG4gICAgICAgICAgICAgICAgZG9jdW1lbnQuZGlzcGF0Y2hFdmVudCh0aGlzLmZhaWxFdmVudCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgIH1cblxuICAgIC8vIEhpbnQgQ29tcG9uZW50XG4gICAgY2xhc3MgSGludENvbXBvbmVudCB7XG4gICAgICAgIGNvbnN0cnVjdG9yKG1lc3NhZ2UpIHtcbiAgICAgICAgICAgIHRoaXMuY29udGFpbmVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2hpbnQnKTtcbiAgICAgICAgICAgIHRoaXMuaGludFRleHQgPSB0aGlzLmNvbnRhaW5lci5xdWVyeVNlbGVjdG9yKCdwI2hpbnQtdGV4dCcpO1xuICAgICAgICAgICAgdGhpcy5jbG9zZUJ0biA9IHRoaXMuY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoJ2J1dHRvbiNjbG9zZS1oaW50Jyk7XG5cbiAgICAgICAgICAgIHRoaXMuaGludFRleHQuaW5uZXJUZXh0ID0gbWVzc2FnZTtcblxuICAgICAgICAgICAgdGhpcy5pbml0KCk7XG4gICAgICAgIH1cblxuICAgICAgICBpbml0KCkge1xuICAgICAgICAgICAgbGV0IHNlbGYgPSB0aGlzO1xuICAgICAgICAgICAgdGhpcy5jbG9zZUJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBzZWxmLmhpZGUoKTtcbiAgICAgICAgICAgIH0pXG4gICAgICAgIH1cblxuICAgICAgICBzaG93KCkge1xuICAgICAgICAgICAgdGhpcy5jb250YWluZXIuY2xhc3NMaXN0LmFkZCgnc2hvdycpO1xuICAgICAgICB9XG4gICAgICAgIGhpZGUoKSB7XG4gICAgICAgICAgICB0aGlzLmNvbnRhaW5lci5jbGFzc0xpc3QucmVtb3ZlKCdzaG93Jyk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBQbGF5ZXIgQ29tcG9uZW50XG4gICAgY2xhc3MgUGxheWVyIHtcblxuICAgICAgICBjb25zdHJ1Y3RvcihwYXRoVG9GaWxlLCBsb29wID0gZmFsc2UpIHtcbiAgICAgICAgICAgIHRoaXMucGxheUJ0biA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwbGF5Jyk7XG4gICAgICAgICAgICB0aGlzLnN0b3BCdG4gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc3RvcCcpO1xuXG5cbiAgICAgICAgICAgIHRoaXMuc291bmQgPSBuZXcgQXVkaW8ocGF0aFRvRmlsZSk7XG4gICAgICAgICAgICB0aGlzLnNvdW5kLmxvb3AgPSBsb29wO1xuXG4gICAgICAgICAgICB0aGlzLmluaXQoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGluaXQoKSB7XG4gICAgICAgICAgICBsZXQgc2VsZiA9IHRoaXM7XG4gICAgICAgICAgICB0aGlzLnBsYXlCdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgc2VsZi5wbGF5KCk7XG4gICAgICAgICAgICAgICAgc2VsZi5zaG93U3RvcEJ0bigpO1xuICAgICAgICAgICAgICAgIHNlbGYuaGlkZVBsYXlCdG4oKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdGhpcy5zdG9wQnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHNlbGYuc3RvcCgpXG4gICAgICAgICAgICAgICAgc2VsZi5zaG93UGxheUJ0bigpO1xuICAgICAgICAgICAgICAgIHNlbGYuaGlkZVN0b3BCdG4oKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgcGxheSgpIHtcbiAgICAgICAgICAgIHRoaXMuc291bmQucGxheSgpO1xuICAgICAgICB9XG5cbiAgICAgICAgcGF1c2UoKSB7XG4gICAgICAgICAgICB0aGlzLnNvdW5kLnBhdXNlKCk7XG4gICAgICAgIH1cblxuICAgICAgICBzdG9wKCkge1xuICAgICAgICAgICAgdGhpcy5zb3VuZC5wYXVzZSgpO1xuICAgICAgICAgICAgdGhpcy5zb3VuZC5jdXJyZW50VGltZSA9IDA7XG4gICAgICAgIH1cblxuICAgICAgICBzaG93UGxheUJ0bigpIHtcbiAgICAgICAgICAgIHRoaXMucGxheUJ0bi5jbGFzc0xpc3QuYWRkKCdzaG93Jyk7XG4gICAgICAgIH1cblxuICAgICAgICBoaWRlUGxheUJ0bigpIHtcbiAgICAgICAgICAgIHRoaXMucGxheUJ0bi5jbGFzc0xpc3QucmVtb3ZlKCdzaG93Jyk7XG4gICAgICAgIH1cblxuICAgICAgICBzaG93U3RvcEJ0bigpIHtcbiAgICAgICAgICAgIHRoaXMuc3RvcEJ0bi5jbGFzc0xpc3QuYWRkKCdzaG93Jyk7XG4gICAgICAgIH1cblxuICAgICAgICBoaWRlU3RvcEJ0bigpIHtcbiAgICAgICAgICAgIHRoaXMuc3RvcEJ0bi5jbGFzc0xpc3QucmVtb3ZlKCdzaG93Jyk7XG4gICAgICAgIH1cblxuICAgICAgICBpc1BsYXlpbmcobmFtZSkge1xuICAgICAgICAgICAgcmV0dXJuICF0aGlzLnNvdW5kLnBhdXNlZDtcbiAgICAgICAgfVxuXG4gICAgfVxuXG5cblxuXG4gICAgbmV3IEdhbWUoKTtcblxufSk7Il19
