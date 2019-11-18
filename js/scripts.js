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
            nextBtnText: '...',
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJzY3JpcHRzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcIkRPTUNvbnRlbnRMb2FkZWRcIiwgZnVuY3Rpb24oZXZlbnQpIHtcblxuXG5cbiAgICBjb25zdCBTdGVwcyA9IFtcbiAgICAgICAge30sXG4gICAgICAgIHtcbiAgICAgICAgICAgIHF1ZXN0aW9uOiBcItCY0YLQsNC6LCDRgtCy0L7QtSDQv9C10YDQstC+0LUg0LfQsNC00LDQvdC40LUuINCY0YHQutCw0YLRjCDQutC+0L3QstC10YDRgiDQvdGD0LbQvdC+INGC0LDQvCwg0LPQtNC1INGC0YsmbmJzcDvQs9C+0YLQvtCy0LjRiNGMINC+0YLQu9C40YfQvdC10LnRiNGD0Y4g0LvQsNC/0YjRgywg0L7QvSZuYnNwO9GA0Y/QtNC+0Lwg0YEmbmJzcDvQstC40LvQutC+0Lkg0LgmbmJzcDvQvdC+0LbQvtC8LlwiLFxuICAgICAgICAgICAgYW5zd2VyOiAnMjU4JyxcbiAgICAgICAgICAgIGhpbnQ6ICfQmtC+0L3QstC10YDRgiDQsiDRj9GJ0LjQutC1INGB0YLQvtC70LAsINC90LAg0LrRg9GF0L3QtScsXG4gICAgICAgICAgICBzdWNjZXNzTWVzc2FnZTogXCLQlNCw0YjRg9C70YzQutCwLCDRgdC/0LDRgdC40LHQviDQt9CwJm5ic3A70L7RgtC70LjRh9C90YvQtSDQuCZuYnNwO9Cy0LrRg9GB0L3Ri9GFJm5ic3A70LHQu9GO0LTQsCwg0LrQvtGC0L7RgNGL0LUg0YLRiyDQtNC70Y8mbmJzcDvQvdCw0YEmbmJzcDvQs9C+0YLQvtCy0LjRiNGMISDQotCy0L7QuSDQv9C+0LTQsNGA0L7QuiDQsiZuYnNwO9GB0YLQvtC70LUsINC+0YLQutGA0L7QuSZuYnNwO9C00LLQtdGA0YbRiy5cIixcbiAgICAgICAgICAgIHRpbWVPdmVyOiAxNSxcbiAgICAgICAgICAgIG5leHRCdG5UZXh0OiAn0Jog0YHQu9C10LTRg9GO0YnQtdC80YMg0L/QvtC00LDRgNC60YMhJyxcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgcXVlc3Rpb246IFwi0KHQu9C10LTRg9GO0YnQuNC5INC60L7QvdCy0LXRgNGCINC90LDRhdC+0LTQuNGC0YHRjyDRgtCw0LwsINCz0LTQtSDRgtGLINC/0L7QtNC00LXRgNC20LjQstCw0LXRiNGMINC20LjQt9C90Ywg0YLQtdC8LCDQutC+0LPQviDQtNCw0YDRj9GCINGC0LLQvtC4INC60LvQuNC10L3RgtGLINC70Y7QsdC40LzRi9C8Jm5ic3A70LvRjtC00Y/QvC5cIixcbiAgICAgICAgICAgIGFuc3dlcjogJzU1NScsXG4gICAgICAgICAgICBoaW50OiAn0K3RgtC+INGG0LLQtdGC0YssINC60L7RgtC+0YDRi9C1INGC0Ysg0LLRi9GA0LDRidC40LLQsNC10YjRjCcsXG4gICAgICAgICAgICBzdWNjZXNzTWVzc2FnZTogXCLQodC/0LDRgdC40LHQviDQt9CwJm5ic3A70LrRgNCw0YHQvtGC0YMsINC60L7RgtC+0YDRg9GOINGC0Ysg0L/RgNC40L3QvtGB0LjRiNGMINCyJm5ic3A70Y3RgtC+0YImbmJzcDvQvNC40YAsINC/0L7QtNCw0YDQvtC6INC40YnQuCDQsiZuYnNwO9GI0LrQsNGE0YMg0LLQsNC90L3QvtC5INC60L7QvNC90LDRgtGLLlwiLFxuICAgICAgICAgICAgdGltZU92ZXI6IDMwLFxuICAgICAgICAgICAgbmV4dEJ0blRleHQ6ICfQmtC70LDRgdGBISDQlNCw0LvRjNGI0LUnLFxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgICBxdWVzdGlvbjogJ9Cf0L7RgtC+0YDQvtC/0LjRgdGMINC6Jm5ic3A70YHQu9C10LTRg9GO0YnQtdC80YMg0LrQvtC90LLQtdGA0YLRgywg0L7QvSZuYnNwO9C90LDRhdC+0LTQuNGC0YHRjyDRgyZuYnNwO9GF0L7RgNC+0YjQtdCz0L4g0LrRg9GH0LXRgNGP0LLQvtCz0L4g0YfQtdC70L7QstC10LrQsCwg0LbQuNCy0YPRidC10LPQviDQv9C+Jm5ic3A70YHQvtGB0LXQtNGB0YLQstGDLiDQotCy0L7QuSDQv9Cw0YDQvtC70YwgLSBcItCl0L7Rh9GDINGF0LDQu9Cy0YMmbmJzcDvQtdC8LCDRhdC+0YfRgyDQv9GA0Y/QvdC40LrQuCFcIicsXG4gICAgICAgICAgICBhbnN3ZXI6ICczMzMnLFxuICAgICAgICAgICAgaGludDogJ9Ct0YLQviDQmNGA0LjQvdCwJyxcbiAgICAgICAgICAgIHN1Y2Nlc3NNZXNzYWdlOiAn0KHQv9Cw0YHQuNCx0L4g0LfQsCZuYnNwO9GC0LLQvtC1INC+0LHRidC10L3QuNC1LCDQt9CwJm5ic3A70L3QvtCy0L7RgdGC0Lgg0LgmbmJzcDvQuNC00LXQuCwg0LrQvtGC0L7RgNGL0LzQuCDRgtGLJm5ic3A70LTQtdC70LjRiNGM0YHRjyEg0J/QvtC00LDRgNC+0Log0LImbmJzcDvRiNC60LDRhNGDICjQsiZuYnNwO9C+0LHRidC10Lwg0LrQvtGA0LjQtNC+0YDQtSknLFxuICAgICAgICAgICAgdGltZU92ZXI6IDE1LFxuICAgICAgICAgICAgbmV4dEJ0blRleHQ6ICfQldGJ0LUhJyxcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgcXVlc3Rpb246ICfQodC70LXQtNGD0Y7RidC40Lkg0LrQvtC90LLQtdGA0YIg0YLRiyZuYnNwO9C90LDQudC00LXRiNGMINGC0LDQvCwg0LrRg9C00LAg0L/QvtC/0LDQtNCw0Y7RgiDRgtCy0L7QuCDQvdC+0YHQvtGH0LrQuCDQv9C+0YHQu9C1INGB0YLQuNGA0LrQuC4nLFxuICAgICAgICAgICAgYW5zd2VyOiAnMTU3JyxcbiAgICAgICAgICAgIGhpbnQ6ICfQn9C+0YHQu9C1INGC0L7Qs9C+LCDQutCw0Log0L7QvdC4INCy0YvRgdC+0YXQu9C4JyxcbiAgICAgICAgICAgIHN1Y2Nlc3NNZXNzYWdlOiAn0KHQv9Cw0YHQuNCx0L4g0LfQsCZuYnNwO9GH0LjRgdGC0L7RgtGDINC4Jm5ic3A70L/QvtGA0Y/QtNC+0LosINC60L7RgtC+0YDRi9C1INGC0Ysg0LTQu9GPJm5ic3A70L3QsNGBINC/0L7QtNC00LXRgNC20LjQstCw0LXRiNGMISDQotCy0L7QuSDRgdC70LXQtNGD0Y7RidC40Lkg0L/QvtC00LDRgNC+0Log0LImbmJzcDvQsNC90YLRgNC10YHQvtC70LghJyxcbiAgICAgICAgICAgIHRpbWVPdmVyOiAxNSxcbiAgICAgICAgICAgIG5leHRCdG5UZXh0OiAn0KPRgNCwLiDQlNCw0LvRjNGI0LUhJyxcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgcXVlc3Rpb246ICfQmNGC0LDQuiwg0L/QvtGB0LvQtdC00L3QtdC1INC30LDQtNCw0L3QuNC1LiDQntGC0LLQtdGCINC/0YDRj9GH0LXRgtGB0Y8g0LImbmJzcDvQvNC10YjQutC1INC90LDQsdC40YLQvtC8INCz0YPRgdC40L3Ri9C80Lgg0LLQvtC70L7RgdCw0LzQuC4nLFxuICAgICAgICAgICAgYW5zd2VyOiAnMzY5JyxcbiAgICAgICAgICAgIGhpbnQ6ICfQrdGC0L4g0L/QvtC00YPRiNC60LAnLFxuICAgICAgICAgICAgc3VjY2Vzc01lc3NhZ2U6ICfQrdGC0L4g0LHRi9C70L4g0L/QvtGB0LvQtNC90LXQtSDQt9Cw0LTQsNC90LjQtS4g0J3QsCZuYnNwO9GN0YLQvtC8INC/0L7Qt9C00YDQsNCy0LvQtdC90LjQtSDQv9C+0LTRhdC+0LTQuNGCINC6Jm5ic3A70LrQvtC90YbRgy4g0KHQv9Cw0YHQuNCx0L4g0LfQsCZuYnNwO9C70Y7QsdC+0LLRjCDQuCZuYnNwO9C70LDRgdC60YMsINC60L7RgtC+0YDRi9C80Lgg0YLRiyDQvdCw0YEg0YHQvtCz0YDQtdCy0LDQtdGI0YwhINCm0LXQu9GD0Y4sINC+0LHQvdC40LzQsNGOINC4Jm5ic3A70LvRjtCx0LvRjiZuYnNwO9GC0LXQsdGPLCDQodC70LDQtNC60LDRjyEg0KLQstC+0Lkg0L/QvtGB0LvQtdC00L3QuNC5INC/0L7QtNCw0YDQvtC6INC/0L7QtCZuYnNwO9C80LDRgtGA0LDRgdC+0LwuJyxcbiAgICAgICAgICAgIHRpbWVPdmVyOiAxNSxcbiAgICAgICAgICAgIG5leHRCdG5UZXh0OiAnLi4uJyxcbiAgICAgICAgfSxcbiAgICBdO1xuXG4gICAgY29uc3QgU2V0dXAgPSB7XG4gICAgICAgIGRlYnVnOiBmYWxzZSxcbiAgICAgICAgc2Vjb25kc1RvRGFuZ2VyOiAxMCxcbiAgICAgICAgc291bmRzOiB7XG4gICAgICAgICAgICBkYXNoYTogJy9hc3NldHMvc291bmRzL2Rhc2hhLm1wMycsXG4gICAgICAgICAgICBhcHBsYXVzZTogJy9hc3NldHMvc291bmRzL2FwcGxhdXNlLm1wMycsXG4gICAgICAgICAgICBmaXJld29ya3M6ICcvYXNzZXRzL3NvdW5kcy9maXJld29ya3MubXAzJyxcbiAgICAgICAgICAgIGFsYXJtOiAnL2Fzc2V0cy9zb3VuZHMvYWxhcm0ubXAzJyxcbiAgICAgICAgICAgIHRpY2s6ICcvYXNzZXRzL3NvdW5kcy90aWNrLm1wMycsXG4gICAgICAgIH0sXG4gICAgICAgIHdlbGNvbWVNZXNzYWdlOiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgbWVzc2FnZTogXCLQn9GA0LjQstC10YIsINCU0LDRiNGD0LvRjNC60LAhINCh0LXQs9C+0LTQvdGPINGC0LLQvtC5INC00LXQvdGMJm5ic3A70YDQvtC20LTQtdC90LjRjywg0LAg0LIg0LTQtdC90YwmbmJzcDvRgNC+0LbQtNC10L3QuNGPINC/0YDQuNC90Y/RgtC+INC/0L7Qu9GD0YfQsNGC0Ywg0L/QvtC00LDRgNC60LguINCc0L7QuSDQv9C+0LTQsNGA0L7QuiAtINGN0YLQviZuYnNwO9C40LPRgNCwLCDQsiZuYnNwO9C60L7RgtC+0YDQvtC5INGC0LXQsdC1INC90YPQttC90L4g0LHRg9C00LXRgiDQvdCw0LnRgtC4Jm5ic3A70L/QvtC00LDRgNC60LguINCY0YLQsNC6LCDQstC+0LfQstGA0LDRidCw0LnRgdGPINCyJm5ic3A70LrQvtC80L3QsNGC0YMsINCwJm5ic3A70LfQsNGC0LXQvCDQvdCw0LbQvNC4INCU0LDQu9C10LUuLi5cIixcbiAgICAgICAgICAgICAgICBidG5UZXh0OiAn0JTQsNC70LXQtScsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIG1lc3NhZ2U6ICfQlNC+0LHRgNC+INC/0L7QttCw0LvQvtCy0LDRgtGMINCyJm5ic3A70L/RgNC40LrQu9GO0YfQtdC90LjQtSwg0JTQsNGI0LAt0L/Rg9GC0LXRiNC10YHRgtCy0LXQvdC90LjRhtCwISDQndCwINGC0LLQvtGR0Lwg0L/Rg9GC0Lgg0LHRg9C00YPRgiDQt9Cw0LTQsNC90LjRjyDQvdCwINC/0L7QuNGB0Log0LrQvtC90LLQtdGA0YLQvtCyLiDQkiZuYnNwO9C60L7QvdCy0LXRgNGC0LDRhSDQsdGD0LTQtdGCINGH0LjRgdC70L4sINC60L7RgtC+0YDQvtC1INGC0LXQsdC1INC90YPQttC90L4g0LLQstC10YHRgtC4LiDQn9C+0YHQu9C1INGN0YLQvtCz0L4g0YLRiyZuYnNwO9GD0LfQvdCw0LXRiNGMLCDQs9C00LUg0LfQsNCx0YDQsNGC0Ywg0L/QvtC00LDRgNC+0LouINCh0YPRidC10YHRgtCy0YPRjtGCINC/0L7QtNGB0LrQsNC30LrQuCAtINC+0L3QuCDQv9C+0Y/QstC70Y/RjtGC0YHRjyDRgtC+0LPQtNCwLCDQutC+0LPQtNCwINC30LDQutCw0L3Rh9C40LLQsNC10YLRgdGPINCy0YDQtdC80Y8uINCf0L7QtdGF0LDQu9C4PycsXG4gICAgICAgICAgICAgICAgYnRuVGV4dDogJ9Cf0L7QtdGF0LDQu9C4IScsXG4gICAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgIH07XG5cbiAgICBsZXQgU291bmRzID0ge307XG5cblxuXG4gICAgLy8gUHJlbG9hZGVyXG4gICAgY2xhc3MgUHJlbG9hZGVyIHtcblxuICAgICAgICBjb25zdHJ1Y3RvcigpIHtcblxuICAgICAgICAgICAgdGhpcy5pbWFnZXNJc0xvYWRlZCA9IGZhbHNlO1xuICAgICAgICAgICAgdGhpcy5zb3VuZHNJc0xvYWRlZCA9IGZhbHNlO1xuXG4gICAgICAgICAgICB0aGlzLnByZWxvYWRCYWNrZ3JvdW5kSW1hZ2VzKCk7XG4gICAgICAgICAgICB0aGlzLnByZWxvYWRTb3VuZHMoKTtcblxuICAgICAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignYXNzZXRJc0xvYWRlZCcsIGZ1bmN0aW9uIChldmVudCkge1xuXG4gICAgICAgICAgICAgICAgaWYgKGV2ZW50LnNvdXJjZSA9PSAnaW1hZ2VzJykge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmltYWdlc0lzTG9hZGVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAoZXZlbnQuc291cmNlID09ICdzb3VuZHMnKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc291bmRzSXNMb2FkZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmltYWdlc0lzTG9hZGVkICYmIHRoaXMuc291bmRzSXNMb2FkZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgZG9jdW1lbnQuZGlzcGF0Y2hFdmVudChuZXcgRXZlbnQoJ2FsbEFzc2V0c0lzTG9hZGVkJykpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgfVxuXG4gICAgICAgIHByZWxvYWRCYWNrZ3JvdW5kSW1hZ2VzKCkge1xuXG4gICAgICAgICAgICB0aGlzLnByZWxvYWRCYWNrZ3JvdW5kSW1hZ2VzRWxlbWVudHNBcnIgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdwcmVsb2FkLWJhY2tncm91bmQnKTtcblxuICAgICAgICAgICAgdGhpcy50b3RhbEFtb3VudE9mSW1hZ2VzID0gdGhpcy5wcmVsb2FkQmFja2dyb3VuZEltYWdlc0VsZW1lbnRzQXJyLmxlbmd0aDtcbiAgICAgICAgICAgIHRoaXMuY3VycmVudEFtb3VudE9mTG9hZGVkSW1hZ2VzID0gMDtcblxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLnRvdGFsQW1vdW50T2ZJbWFnZXM7IGkrKykge1xuXG4gICAgICAgICAgICAgICAgbGV0IGVsZW1lbnQgPSB0aGlzLnByZWxvYWRCYWNrZ3JvdW5kSW1hZ2VzRWxlbWVudHNBcnJbaV07XG5cbiAgICAgICAgICAgICAgICBsZXQgc3R5bGUgPVxuICAgICAgICAgICAgICAgICAgICBlbGVtZW50LmN1cnJlbnRTdHlsZSB8fCB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZShlbGVtZW50LCBmYWxzZSksXG4gICAgICAgICAgICAgICAgICAgIHVybCA9IHN0eWxlXG4gICAgICAgICAgICAgICAgICAgICAgICAuYmFja2dyb3VuZEltYWdlXG4gICAgICAgICAgICAgICAgICAgICAgICAuc2xpY2UoNCwgLTEpXG4gICAgICAgICAgICAgICAgICAgICAgICAucmVwbGFjZSgvXCIvZywgXCJcIik7XG5cbiAgICAgICAgICAgICAgICB0aGlzLmltYWdlUHJlbG9hZGVyKHVybCk7XG5cbiAgICAgICAgICAgIH1cblxuICAgICAgICB9XG5cbiAgICAgICAgaW1hZ2VQcmVsb2FkZXIodXJsKSB7XG4gICAgICAgICAgICBsZXQgc2VsZiA9IHRoaXM7XG4gICAgICAgICAgICBsZXQgaW1nID0gbmV3IEltYWdlKCk7XG4gICAgICAgICAgICBpbWcuc3JjID0gdXJsO1xuICAgICAgICAgICAgaW1nLm9ubG9hZCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBzZWxmLmltYWdlSXNMb2FkZWQoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChpbWcuY29tcGxldGUpIGltZy5vbmxvYWQoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGltYWdlSXNMb2FkZWQoKSB7XG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRBbW91bnRPZkxvYWRlZEltYWdlcysrO1xuICAgICAgICAgICAgaWYgKHRoaXMuY3VycmVudEFtb3VudE9mTG9hZGVkSW1hZ2VzID49IHRoaXMudG90YWxBbW91bnRPZkltYWdlcykge1xuICAgICAgICAgICAgICAgIGxldCBldmVudCA9IG5ldyBFdmVudCgnYXNzZXRJc0xvYWRlZCcpO1xuICAgICAgICAgICAgICAgIGV2ZW50LnNvdXJjZSA9ICdpbWFnZXMnO1xuICAgICAgICAgICAgICAgIGRvY3VtZW50LmRpc3BhdGNoRXZlbnQoZXZlbnQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcHJlbG9hZFNvdW5kcygpIHtcblxuICAgICAgICAgICAgbGV0IHNlbGYgPSB0aGlzO1xuXG4gICAgICAgICAgICB0aGlzLnByZWxvYWRTb3VuZHNBcnIgPSBTZXR1cC5zb3VuZHM7XG5cbiAgICAgICAgICAgIHRoaXMudG90YWxBbW91bnRPZlNvdW5kcyA9IE9iamVjdC5rZXlzKFNldHVwLnNvdW5kcykubGVuZ3RoO1xuICAgICAgICAgICAgdGhpcy5jdXJyZW50QW1vdW50T2ZMb2FkZWRTb3VuZHMgPSAwO1xuXG4gICAgICAgICAgICBsZXQgdGVtcFNvdW5kcyA9IHt9O1xuXG4gICAgICAgICAgICBmb3IgKGxldCBuYW1lIGluIFNldHVwLnNvdW5kcykge1xuXG4gICAgICAgICAgICAgICAgdGVtcFNvdW5kc1tuYW1lXSA9IG5ldyBBdWRpbyhTZXR1cC5zb3VuZHNbbmFtZV0pO1xuXG4gICAgICAgICAgICAgICAgdGVtcFNvdW5kc1tuYW1lXS5hZGRFdmVudExpc3RlbmVyKCdjYW5wbGF5dGhyb3VnaCcsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5zb3VuZElzTG9hZGVkKCk7XG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgU291bmRzID0gdGVtcFNvdW5kcztcblxuICAgICAgICB9XG5cbiAgICAgICAgc291bmRJc0xvYWRlZCgpIHtcbiAgICAgICAgICAgIHRoaXMuY3VycmVudEFtb3VudE9mTG9hZGVkU291bmRzICsrO1xuICAgICAgICAgICAgaWYgKHRoaXMuY3VycmVudEFtb3VudE9mTG9hZGVkU291bmRzID49IHRoaXMudG90YWxBbW91bnRPZlNvdW5kcykge1xuICAgICAgICAgICAgICAgIGxldCBldmVudCA9IG5ldyBFdmVudCgnYXNzZXRJc0xvYWRlZCcpO1xuICAgICAgICAgICAgICAgIGV2ZW50LnNvdXJjZSA9ICdzb3VuZHMnO1xuICAgICAgICAgICAgICAgIGRvY3VtZW50LmRpc3BhdGNoRXZlbnQoZXZlbnQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICB9XG5cbiAgICAvLyBNYWluIENvbXBvbmVudFxuICAgIGNsYXNzIEdhbWUge1xuXG4gICAgICAgIGNvbnN0cnVjdG9yKCkge1xuXG4gICAgICAgICAgICBuZXcgUHJlbG9hZGVyKCk7XG5cbiAgICAgICAgICAgIC8vIFNjcmVlbnNcbiAgICAgICAgICAgIHRoaXMubG9hZGluZ1NjcmVlbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdsb2FkaW5nJyk7XG4gICAgICAgICAgICB0aGlzLnB5cm9TY3JlZW4gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncHlybycpO1xuICAgICAgICAgICAgdGhpcy5nYW1lT3ZlclNjcmVlbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdnYW1lLW92ZXInKTtcblxuXG4gICAgICAgICAgICAvLyBDb21wb25lbnRzXG4gICAgICAgICAgICB0aGlzLkZ1bGxzY3JlZW5Db21wb25lbnQgPSBuZXcgRnVsbHNjcmVlbkNvbXBvbmVudCgpO1xuICAgICAgICAgICAgdGhpcy5XZWxjb21lQ29tcG9uZW50ID0gbmV3IFdlbGNvbWUoKTtcbiAgICAgICAgICAgIHRoaXMuQ29tbW9uVGltZXJDb21wb25lbnQgPSBuZXcgQ29tbW9uVGltZXJDb21wb25lbnQoKTtcbiAgICAgICAgICAgIHRoaXMuUXVlc3RDb21wb25lbnQgPSBuZXcgUXVlc3RDb21wb25lbnQoKTtcblxuXG4gICAgICAgICAgICAvLyBCaW5kIEV2ZW50c1xuICAgICAgICAgICAgdGhpcy5pbml0RXZlbnRzKCk7XG5cbiAgICAgICAgfVxuXG4gICAgICAgIC8vIEJpbmcgRXZlbnRzXG4gICAgICAgIGluaXRFdmVudHMoKSB7XG5cbiAgICAgICAgICAgIGxldCBzZWxmID0gdGhpcztcblxuICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgZG9jdW1lbnQuZGlzcGF0Y2hFdmVudChuZXcgRXZlbnQoJ2FsbEFzc2V0c0lzTG9hZGVkJykpO1xuICAgICAgICAgICAgfSwgMzAwMCk7XG5cbiAgICAgICAgICAgIC8vIEFwcCBpcyBMb2FkZWRcbiAgICAgICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2FsbEFzc2V0c0lzTG9hZGVkJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHNlbGYuaGlkZUxvYWRpbmcoKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAvLyBGdWxsc2NyZWVuIERvbmVcbiAgICAgICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2Z1bGxzY3JlZW5Eb25lJywgZnVuY3Rpb24gKCkge1xuXG4gICAgICAgICAgICAgICAgc2VsZi5XZWxjb21lQ29tcG9uZW50LnNob3coKTtcblxuICAgICAgICAgICAgfSk7XG5cblxuICAgICAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignd2VsY29tZURvbmUnLCBmdW5jdGlvbiAoKSB7XG5cbiAgICAgICAgICAgICAgICBzZWxmLldlbGNvbWVDb21wb25lbnQuaGlkZSgpO1xuICAgICAgICAgICAgICAgIHNlbGYuUXVlc3RDb21wb25lbnQuc2hvdygpO1xuICAgICAgICAgICAgICAgIHNlbGYuQ29tbW9uVGltZXJDb21wb25lbnQuc3RhcnQoKTtcblxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIC8vIFF1ZXN0IERvbmVcbiAgICAgICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2V2ZW50UXVlc3RTdWNjZXNzJywgZnVuY3Rpb24gKCkge1xuXG4gICAgICAgICAgICAgICAgc2VsZi5Db21tb25UaW1lckNvbXBvbmVudC5zdG9wKCk7XG4gICAgICAgICAgICAgICAgc2VsZi5RdWVzdENvbXBvbmVudC5oaWRlKCk7XG4gICAgICAgICAgICAgICAgc2VsZi5nYW1lT3ZlclNjcmVlbi5jbGFzc0xpc3QuYWRkKCdzaG93Jyk7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ0dhbWUgT3ZlciEhIScpO1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHNlbGYuQ29tbW9uVGltZXJDb21wb25lbnQuZ2V0Q29tbW9uVGltZSgpKTtcblxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIC8vIFBhdXNlIENvbW1vbiBUaW1lclxuICAgICAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigncGF1c2VUaW1lcicsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBzZWxmLkNvbW1vblRpbWVyQ29tcG9uZW50LnBhdXNlKCk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgLy8gQ29udGludWUgQ29tbW9uIFRpbWVyXG4gICAgICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdjb250aW51ZVRpbWVyJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHNlbGYuQ29tbW9uVGltZXJDb21wb25lbnQuY29udGludWUoKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgIH1cblxuICAgICAgICAvL0xvYWRpbmdcbiAgICAgICAgaGlkZUxvYWRpbmcoKSB7XG4gICAgICAgICAgICB0aGlzLmxvYWRpbmdTY3JlZW4uY2xhc3NMaXN0LnJlbW92ZSgnc2hvdycpO1xuICAgICAgICB9XG5cbiAgICB9XG5cbiAgICAvLyBGdWxsc2NyZWVuIENsYXNzXG4gICAgY2xhc3MgRnVsbHNjcmVlbkNvbXBvbmVudCB7XG5cbiAgICAgICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgICAgICB0aGlzLmNvbnRhaW5lciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdmdWxsc2NyZWVuJyk7XG4gICAgICAgICAgICB0aGlzLmNvbnRhaW5lci5jbGFzc0xpc3QuYWRkKCdzaG93Jyk7XG4gICAgICAgICAgICB0aGlzLmJ0biA9IHRoaXMuY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoJ2J1dHRvbicpO1xuICAgICAgICAgICAgdGhpcy5mdWxsc2NyZWVuRG9uZSA9IG5ldyBFdmVudCgnZnVsbHNjcmVlbkRvbmUnKTtcbiAgICAgICAgICAgIGxldCBzZWxmID0gdGhpcztcbiAgICAgICAgICAgIHRoaXMuYnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIGlmICghU2V0dXAuZGVidWcpIHtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5sYXVuY2hGdWxsU2NyZWVuKGRvY3VtZW50LmRvY3VtZW50RWxlbWVudCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHNlbGYuYnRuLmNsYXNzTGlzdC5hZGQoJ3NvZnRfaGlkZScpO1xuICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICBzZWxmLmNvbnRhaW5lci5jbGFzc0xpc3QucmVtb3ZlKCdzaG93Jyk7XG4gICAgICAgICAgICAgICAgICAgIGRvY3VtZW50LmRpc3BhdGNoRXZlbnQoc2VsZi5mdWxsc2NyZWVuRG9uZSk7XG4gICAgICAgICAgICAgICAgfSwgMTAwMCk7XG4gICAgICAgICAgICB9KVxuICAgICAgICB9XG5cbiAgICAgICAgbGF1bmNoRnVsbFNjcmVlbihlbGVtZW50KSB7XG4gICAgICAgICAgICBpZihlbGVtZW50LnJlcXVlc3RGdWxsU2NyZWVuKSB7XG4gICAgICAgICAgICAgICAgZWxlbWVudC5yZXF1ZXN0RnVsbFNjcmVlbigpO1xuICAgICAgICAgICAgfSBlbHNlIGlmKGVsZW1lbnQubW96UmVxdWVzdEZ1bGxTY3JlZW4pIHtcbiAgICAgICAgICAgICAgICBlbGVtZW50Lm1velJlcXVlc3RGdWxsU2NyZWVuKCk7XG4gICAgICAgICAgICB9IGVsc2UgaWYoZWxlbWVudC53ZWJraXRSZXF1ZXN0RnVsbFNjcmVlbikge1xuICAgICAgICAgICAgICAgIGVsZW1lbnQud2Via2l0UmVxdWVzdEZ1bGxTY3JlZW4oKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGNhbmNlbEZ1bGxzY3JlZW4oKSB7XG4gICAgICAgICAgICBpZihkb2N1bWVudC5jYW5jZWxGdWxsU2NyZWVuKSB7XG4gICAgICAgICAgICAgICAgZG9jdW1lbnQuY2FuY2VsRnVsbFNjcmVlbigpO1xuICAgICAgICAgICAgfSBlbHNlIGlmKGRvY3VtZW50Lm1vekNhbmNlbEZ1bGxTY3JlZW4pIHtcbiAgICAgICAgICAgICAgICBkb2N1bWVudC5tb3pDYW5jZWxGdWxsU2NyZWVuKCk7XG4gICAgICAgICAgICB9IGVsc2UgaWYoZG9jdW1lbnQud2Via2l0Q2FuY2VsRnVsbFNjcmVlbikge1xuICAgICAgICAgICAgICAgIGRvY3VtZW50LndlYmtpdENhbmNlbEZ1bGxTY3JlZW4oKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgfVxuXG4gICAgLy8gV2VsY29tZSBNZXNzYWdlc1xuICAgIGNsYXNzIFdlbGNvbWUge1xuXG4gICAgICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICAgICAgdGhpcy5jb250YWluZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnd2VsY29tZScpO1xuICAgICAgICAgICAgdGhpcy5hcHBlYXJ0aW5CbG9jayA9IHRoaXMuY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoJyN3ZWxjb21lLXRleHQnKTtcbiAgICAgICAgICAgIHRoaXMudGV4dCA9IHRoaXMuY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoJyN3ZWxjb21lLXRleHQgPiBwJyk7XG4gICAgICAgICAgICB0aGlzLm5leHRCdG4gPSB0aGlzLmNvbnRhaW5lci5xdWVyeVNlbGVjdG9yKCdidXR0b24jd2VsY29tZS1uZXh0LWJ0bicpO1xuICAgICAgICAgICAgdGhpcy5ldmVudERvbmUgPSBuZXcgRXZlbnQoJ3dlbGNvbWVEb25lJyk7XG4gICAgICAgICAgICB0aGlzLm11c2ljRGFzaGEgPSBuZXcgUGxheWVyKFNldHVwLnNvdW5kcy5kYXNoYSk7XG4gICAgICAgICAgICB0aGlzLmluaXQoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGluaXQoKSB7XG5cbiAgICAgICAgICAgIHRoaXMuY3VycmVudE1lc3NhZ2UgPSAwO1xuXG4gICAgICAgICAgICB0aGlzLmZpbGxGaWVsZHMoKTtcblxuICAgICAgICAgICAgbGV0IHNlbGYgPSB0aGlzO1xuICAgICAgICAgICAgdGhpcy5uZXh0QnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIGlmIChzZWxmLmN1cnJlbnRNZXNzYWdlID09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgU291bmRzLmRhc2hhLnBsYXkoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKHNlbGYuY3VycmVudE1lc3NhZ2UgPT0gMSkge1xuICAgICAgICAgICAgICAgICAgICBTb3VuZHMuZGFzaGEucGF1c2UoKTtcbiAgICAgICAgICAgICAgICAgICAgU291bmRzLnRpY2sudm9sdW1lID0gMDtcbiAgICAgICAgICAgICAgICAgICAgU291bmRzLnRpY2subG9vcCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIFNvdW5kcy50aWNrLnBsYXkoKTtcbiAgICAgICAgICAgICAgICAgICAgU291bmRzLmFsYXJtLnZvbHVtZSA9IDA7XG4gICAgICAgICAgICAgICAgICAgIFNvdW5kcy5hbGFybS5sb29wID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgU291bmRzLmFsYXJtLnBsYXkoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgc2VsZi5uZXh0TWVzc2FnZSgpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgfVxuXG4gICAgICAgIGZpbGxGaWVsZHMoKSB7XG4gICAgICAgICAgICB0aGlzLnRleHQuaW5uZXJIVE1MID0gU2V0dXAud2VsY29tZU1lc3NhZ2VbdGhpcy5jdXJyZW50TWVzc2FnZV0ubWVzc2FnZTtcbiAgICAgICAgICAgIHRoaXMubmV4dEJ0bi5pbm5lclRleHQgPSBTZXR1cC53ZWxjb21lTWVzc2FnZVt0aGlzLmN1cnJlbnRNZXNzYWdlXS5idG5UZXh0O1xuICAgICAgICB9XG5cbiAgICAgICAgbmV4dE1lc3NhZ2UoKSB7XG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRNZXNzYWdlKys7XG4gICAgICAgICAgICBpZiAodGhpcy5jdXJyZW50TWVzc2FnZSA+PSBTZXR1cC53ZWxjb21lTWVzc2FnZS5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICBkb2N1bWVudC5kaXNwYXRjaEV2ZW50KHRoaXMuZXZlbnREb25lKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuY3VycmVudE1lc3NhZ2UgPT0gMSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoIVNldHVwLmRlYnVnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm11c2ljRGFzaGEucGxheSgpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRoaXMuZmlsbEZpZWxkcygpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgc2hvdygpIHtcbiAgICAgICAgICAgIHRoaXMuY29udGFpbmVyLmNsYXNzTGlzdC5hZGQoJ3Nob3cnKTtcbiAgICAgICAgICAgIHRoaXMuYXBwZWFydGluQmxvY2suY2xhc3NMaXN0LmFkZCgnc2hvdycpO1xuICAgICAgICAgICAgdGhpcy5uZXh0QnRuLmNsYXNzTGlzdC5hZGQoJ3Nob3cnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGhpZGUoKSB7XG4gICAgICAgICAgICB0aGlzLmNvbnRhaW5lci5jbGFzc0xpc3QucmVtb3ZlKCdzaG93Jyk7XG4gICAgICAgIH1cblxuICAgIH1cblxuICAgIC8vIENvbW1vblRpbWUgQ2xhc3NcbiAgICBjbGFzcyBDb21tb25UaW1lckNvbXBvbmVudCB7XG5cbiAgICAgICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRTZWNvbmRzID0gMDtcbiAgICAgICAgICAgIHRoaXMuaXNQYXVzZWQgPSBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHN0YXJ0KCkge1xuICAgICAgICAgICAgbGV0IHNlbGYgPSB0aGlzO1xuICAgICAgICAgICAgdGhpcy50aW1lciA9IHNldEludGVydmFsKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBpZiAoIXNlbGYuaXNQYXVzZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5jdXJyZW50U2Vjb25kcyArKztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LCAxMDAwKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHBhdXNlKCkge1xuICAgICAgICAgICAgdGhpcy5pc1BhdXNlZCA9IHRydWU7XG4gICAgICAgIH1cblxuICAgICAgICBjb250aW51ZSgpIHtcbiAgICAgICAgICAgIHRoaXMuaXNQYXVzZWQgPSBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHN0b3AoKSB7XG4gICAgICAgICAgICBjbGVhckludGVydmFsKHRoaXMudGltZXIpO1xuICAgICAgICB9XG5cbiAgICAgICAgZ2V0Q29tbW9uVGltZSgpIHtcblxuICAgICAgICAgICAgbGV0IG1pbnV0ZXMgPSBNYXRoLmZsb29yKHRoaXMuY3VycmVudFNlY29uZHMgLyA2MCk7XG4gICAgICAgICAgICBsZXQgc2Vjb25kcyA9IHRoaXMuY3VycmVudFNlY29uZHMgJSA2MDtcblxuICAgICAgICAgICAgaWYgKG1pbnV0ZXMgPCAxMCkge1xuICAgICAgICAgICAgICAgIG1pbnV0ZXMgPSAnMCcgKyBtaW51dGVzO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoc2Vjb25kcyA8IDEwKSB7XG4gICAgICAgICAgICAgICAgc2Vjb25kcyA9ICcwJyArIHNlY29uZHM7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBtaW51dGVzICsgJzonICsgc2Vjb25kczs7XG4gICAgICAgIH1cblxuICAgIH1cblxuICAgIC8vIFFlc3RTdGVwIENsYXNzXG4gICAgY2xhc3MgUXVlc3RDb21wb25lbnQge1xuXG4gICAgICAgIGNvbnN0cnVjdG9yKCkge1xuXG4gICAgICAgICAgICB0aGlzLmNvbnRhaW5lciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdxdWVzdCcpO1xuXG4gICAgICAgICAgICB0aGlzLnRleHQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndGV4dCcpO1xuICAgICAgICAgICAgdGhpcy5pbnB1dCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdhbnN3ZXItaW5wdXQnKTtcblxuICAgICAgICAgICAgdGhpcy5zdWNjZXNzTWVzc2FnZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzdWNjZXNzLW1lc3NhZ2UnKTtcbiAgICAgICAgICAgIHRoaXMuc3VjY2Vzc01lc3NhZ2VUZXh0ID0gdGhpcy5zdWNjZXNzTWVzc2FnZS5xdWVyeVNlbGVjdG9yKCdwI3RleHQtc3VjY2Vzcy1tZXNzYWdlJyk7XG4gICAgICAgICAgICB0aGlzLm5leHRRdWVzdEJ0biA9IHRoaXMuc3VjY2Vzc01lc3NhZ2UucXVlcnlTZWxlY3RvcignYnV0dG9uI25leHQtcXVlc3QtYnRuJyk7XG5cbiAgICAgICAgICAgIHRoaXMuaGludEJ0biA9IHRoaXMuY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoJ2J1dHRvbiNoaW50LWJ0bicpO1xuXG4gICAgICAgICAgICB0aGlzLnN1Y2Nlc0V2ZW50ID0gbmV3IEV2ZW50KCdldmVudFF1ZXN0U3VjY2VzcycpO1xuICAgICAgICAgICAgdGhpcy5wYXVzZUNvbW1vblRpbWVyID0gbmV3IEV2ZW50KCdwYXVzZVRpbWVyJyk7XG4gICAgICAgICAgICB0aGlzLmNvbnRpbnVlQ29tbW9uVGltZXIgPSBuZXcgRXZlbnQoJ2NvbnRpbnVlVGltZXInKTtcbiAgICAgICAgICAgIHRoaXMuc3RvcFRpY2tTb3VuZCA9IG5ldyBFdmVudCgnc3RvcFRpY2tTb3VuZCcpO1xuICAgICAgICAgICAgdGhpcy5zdG9wQWxhcm1Tb3VuZCA9IG5ldyBFdmVudCgnc3RvcEFsYXJtU291bmQnKTtcblxuICAgICAgICAgICAgdGhpcy5zb3VuZEFwcGxhdXNlID0gbmV3IFBsYXllcihTZXR1cC5zb3VuZHMuYXBwbGF1c2UpO1xuICAgICAgICAgICAgdGhpcy5zb3VuZEZpcmV3b3JrcyA9IG5ldyBQbGF5ZXIoU2V0dXAuc291bmRzLmZpcmV3b3Jrcyk7XG5cbiAgICAgICAgICAgIHRoaXMuaW5pdCgpO1xuXG4gICAgICAgIH1cblxuICAgICAgICBpbml0KCkge1xuXG4gICAgICAgICAgICB0aGlzLnN0ZXBOdW1iZXIgPSAxO1xuXG4gICAgICAgICAgICB0aGlzLmZpbGxGaWVsZHMoKTtcblxuICAgICAgICAgICAgbGV0IHNlbGYgPSB0aGlzO1xuXG4gICAgICAgICAgICB0aGlzLmlucHV0LnNldEF0dHJpYnV0ZSgnbWF4bGVuZ3RoJywgdGhpcy5hbnN3ZXIubGVuZ3RoKTtcblxuICAgICAgICAgICAgdGhpcy5pbnB1dC5hZGRFdmVudExpc3RlbmVyKCdpbnB1dCcsIGZ1bmN0aW9uICgpIHtcblxuICAgICAgICAgICAgICAgIGlmICh0aGlzLnZhbHVlLmxlbmd0aCA9PSBzZWxmLmFuc3dlci5sZW5ndGgpIHtcblxuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy52YWx1ZSA9PSBzZWxmLmFuc3dlcikge1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxmLnJpZ2h0QW5zd2VyKCk7XG5cbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcblxuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5pbnB1dC5jbGFzc0xpc3QuYWRkKCd3cm9uZycpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZWxmLmlucHV0LmNsYXNzTGlzdC5yZW1vdmUoJ3dyb25nJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5pbnB1dC52YWx1ZSA9ICcnO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSwgMTUwMCk7XG5cbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgdGhpcy5oaW50QnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHNlbGYuSGludENvbXBvbmVudC5zaG93KCk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgdGhpcy5uZXh0UXVlc3RCdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbiAoKSB7XG5cbiAgICAgICAgICAgICAgICBzZWxmLnN1Y2Nlc3NNZXNzYWdlLmNsYXNzTGlzdC5yZW1vdmUoJ3Nob3cnKTtcblxuICAgICAgICAgICAgICAgIHNlbGYubmV4dFN0ZXAoKTtcblxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2ZhaWxUaW1lcicsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBzZWxmLmhpbnRCdG4uY2xhc3NMaXN0LmFkZCgnc2hvdycpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgfVxuXG4gICAgICAgIHJpZ2h0QW5zd2VyKCkge1xuXG4gICAgICAgICAgICB0aGlzLlRpbWVyLnN0b3AoKTtcblxuICAgICAgICAgICAgZG9jdW1lbnQuZGlzcGF0Y2hFdmVudCh0aGlzLnBhdXNlQ29tbW9uVGltZXIpO1xuXG4gICAgICAgICAgICB0aGlzLnN1Y2Nlc3NNZXNzYWdlLmNsYXNzTGlzdC5hZGQoJ3Nob3cnKTtcbiAgICAgICAgICAgIHRoaXMuc3VjY2Vzc01lc3NhZ2VUZXh0LmZvY3VzKCk7XG5cbiAgICAgICAgICAgIFNvdW5kcy5hcHBsYXVzZS5wbGF5KCk7XG4gICAgICAgICAgICBTb3VuZHMuZmlyZXdvcmtzLnBsYXkoKTtcbiAgICAgICAgICAgIFNvdW5kcy50aWNrLnZvbHVtZSA9IDA7XG4gICAgICAgICAgICBTb3VuZHMuYWxhcm0udm9sdW1lID0gMDtcblxuICAgICAgICB9XG5cbiAgICAgICAgbmV4dFN0ZXAoKSB7XG4gICAgICAgICAgICB0aGlzLnN0ZXBOdW1iZXIrKztcbiAgICAgICAgICAgIGlmICh0aGlzLnN0ZXBOdW1iZXIgPj0gU3RlcHMubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgZG9jdW1lbnQuZGlzcGF0Y2hFdmVudCh0aGlzLnN1Y2Nlc0V2ZW50KTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5maWxsRmllbGRzKCk7XG4gICAgICAgICAgICAgICAgZG9jdW1lbnQuZGlzcGF0Y2hFdmVudCh0aGlzLmNvbnRpbnVlQ29tbW9uVGltZXIpO1xuICAgICAgICAgICAgICAgIHRoaXMuVGltZXIuc3RhcnQoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGZpbGxGaWVsZHMoKSB7XG4gICAgICAgICAgICB0aGlzLnF1ZXN0aW9uID0gU3RlcHNbdGhpcy5zdGVwTnVtYmVyXS5xdWVzdGlvbjtcbiAgICAgICAgICAgIHRoaXMudGV4dC5pbm5lckhUTUwgPSB0aGlzLnF1ZXN0aW9uO1xuICAgICAgICAgICAgdGhpcy5hbnN3ZXIgPSBTdGVwc1t0aGlzLnN0ZXBOdW1iZXJdLmFuc3dlcjtcblxuICAgICAgICAgICAgdGhpcy5zdWNjZXNzTWVzc2FnZVRleHQuaW5uZXJIVE1MID0gU3RlcHNbdGhpcy5zdGVwTnVtYmVyXS5zdWNjZXNzTWVzc2FnZTtcbiAgICAgICAgICAgIHRoaXMubmV4dFF1ZXN0QnRuLmlubmVyVGV4dCA9IFN0ZXBzW3RoaXMuc3RlcE51bWJlcl0ubmV4dEJ0blRleHQ7XG5cbiAgICAgICAgICAgIHRoaXMudGltZXJPdmVyID0gU3RlcHNbdGhpcy5zdGVwTnVtYmVyXS50aW1lT3ZlcjtcbiAgICAgICAgICAgIHRoaXMuVGltZXIgPSBuZXcgVGltZXIodGhpcy50aW1lck92ZXIpO1xuXG4gICAgICAgICAgICB0aGlzLmhpbnRUZXh0ID0gU3RlcHNbdGhpcy5zdGVwTnVtYmVyXS5oaW50O1xuICAgICAgICAgICAgdGhpcy5IaW50Q29tcG9uZW50ID0gbmV3IEhpbnRDb21wb25lbnQodGhpcy5oaW50VGV4dCk7XG5cbiAgICAgICAgICAgIHRoaXMuaW5wdXQudmFsdWUgPSAnJztcbiAgICAgICAgICAgIHRoaXMuaGludEJ0bi5jbGFzc0xpc3QucmVtb3ZlKCdzaG93Jyk7XG4gICAgICAgIH1cblxuICAgICAgICBzaG93KCkge1xuICAgICAgICAgICAgdGhpcy5jb250YWluZXIuY2xhc3NMaXN0LmFkZCgnc2hvdycpO1xuICAgICAgICAgICAgdGhpcy5pbnB1dC5jbGFzc0xpc3QuYWRkKCdzaG93Jyk7XG4gICAgICAgICAgICB0aGlzLlRpbWVyLnN0YXJ0KCk7XG4gICAgICAgIH1cblxuICAgICAgICBoaWRlKCkge1xuICAgICAgICAgICAgdGhpcy5jb250YWluZXIuY2xhc3NMaXN0LnJlbW92ZSgnc2hvdycpO1xuICAgICAgICB9XG5cblxuXG4gICAgfVxuXG4gICAgLy8gUXVlc3QgVGltZXJcbiAgICBjbGFzcyBUaW1lciB7XG5cbiAgICAgICAgY29uc3RydWN0b3IodGltZU92ZXIpIHtcblxuICAgICAgICAgICAgdGhpcy5jb250YWluZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndGltZXInKTtcbiAgICAgICAgICAgIHRoaXMuYXZhaWxhYmxlU2Vjb25kcyA9IHRpbWVPdmVyO1xuXG4gICAgICAgICAgICB0aGlzLnNob3dUaW1lclZhbHVlKCk7XG5cbiAgICAgICAgICAgIHRoaXMuZmFpbEV2ZW50ID0gbmV3IEV2ZW50KCdmYWlsVGltZXInKTtcblxuICAgICAgICAgICAgdGhpcy5zZWNvbmRzVG9EYW5nZXIgPSBTZXR1cC5zZWNvbmRzVG9EYW5nZXI7XG5cbiAgICAgICAgfVxuXG4gICAgICAgIHN0YXJ0KCkge1xuXG4gICAgICAgICAgICBsZXQgc2VsZiA9IHRoaXM7XG5cbiAgICAgICAgICAgIHRoaXMuY29udGFpbmVyLmNsYXNzTGlzdC5hZGQoJ2RhbmdlcicpO1xuXG4gICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBzZWxmLmNvbnRhaW5lci5jbGFzc0xpc3QucmVtb3ZlKCdkYW5nZXInKTtcbiAgICAgICAgICAgIH0sIDgwMCk7XG5cbiAgICAgICAgICAgIHRoaXMudGltZXIgPSBzZXRJbnRlcnZhbChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgc2VsZi5hdmFpbGFibGVTZWNvbmRzIC0tO1xuXG4gICAgICAgICAgICAgICAgc2VsZi5jaGVja0RhbmdlcigpO1xuICAgICAgICAgICAgICAgIHNlbGYuY2hlY2tUaW1lSXNPdmVyKCk7XG4gICAgICAgICAgICAgICAgc2VsZi5zaG93VGltZXJWYWx1ZSgpO1xuXG4gICAgICAgICAgICB9LCAxMDAwKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHN0b3AoKSB7XG4gICAgICAgICAgICBjbGVhckludGVydmFsKHRoaXMudGltZXIpO1xuICAgICAgICB9XG5cbiAgICAgICAgc2hvd1RpbWVyVmFsdWUoKSB7XG5cbiAgICAgICAgICAgIGxldCBtaW51dGVzID0gTWF0aC5mbG9vcih0aGlzLmF2YWlsYWJsZVNlY29uZHMgLyA2MCk7XG4gICAgICAgICAgICBsZXQgc2Vjb25kcyA9IHRoaXMuYXZhaWxhYmxlU2Vjb25kcyAlIDYwO1xuXG4gICAgICAgICAgICBpZiAobWludXRlcyA8IDEwKSB7XG4gICAgICAgICAgICAgICAgbWludXRlcyA9ICcwJyArIG1pbnV0ZXM7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChzZWNvbmRzIDwgMTApIHtcbiAgICAgICAgICAgICAgICBzZWNvbmRzID0gJzAnICsgc2Vjb25kcztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5jb250YWluZXIuaW5uZXJUZXh0ID0gbWludXRlcyArICc6JyArIHNlY29uZHM7XG5cbiAgICAgICAgfVxuXG4gICAgICAgIGNoZWNrRGFuZ2VyKCkge1xuICAgICAgICAgICAgaWYgKHRoaXMuYXZhaWxhYmxlU2Vjb25kcyA8IHRoaXMuc2Vjb25kc1RvRGFuZ2VyKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5jb250YWluZXIuY2xhc3NMaXN0LmFkZCgnZGFuZ2VyJyk7XG4gICAgICAgICAgICAgICAgU291bmRzLnRpY2sudm9sdW1lID0gMTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGNoZWNrVGltZUlzT3ZlcigpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLmF2YWlsYWJsZVNlY29uZHMgPCAxKSB7XG4gICAgICAgICAgICAgICAgY2xlYXJJbnRlcnZhbCh0aGlzLnRpbWVyKTtcbiAgICAgICAgICAgICAgICBTb3VuZHMuYWxhcm0udm9sdW1lID0gMTtcbiAgICAgICAgICAgICAgICBTb3VuZHMudGljay52b2x1bWUgPSAwO1xuICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICBTb3VuZHMuYWxhcm0udm9sdW1lID0gMDtcbiAgICAgICAgICAgICAgICB9LCAyMDAwKTtcbiAgICAgICAgICAgICAgICBkb2N1bWVudC5kaXNwYXRjaEV2ZW50KHRoaXMuZmFpbEV2ZW50KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgfVxuXG4gICAgLy8gSGludCBDb21wb25lbnRcbiAgICBjbGFzcyBIaW50Q29tcG9uZW50IHtcbiAgICAgICAgY29uc3RydWN0b3IobWVzc2FnZSkge1xuICAgICAgICAgICAgdGhpcy5jb250YWluZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnaGludCcpO1xuICAgICAgICAgICAgdGhpcy5oaW50VGV4dCA9IHRoaXMuY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoJ3AjaGludC10ZXh0Jyk7XG4gICAgICAgICAgICB0aGlzLmNsb3NlQnRuID0gdGhpcy5jb250YWluZXIucXVlcnlTZWxlY3RvcignYnV0dG9uI2Nsb3NlLWhpbnQnKTtcblxuICAgICAgICAgICAgdGhpcy5oaW50VGV4dC5pbm5lclRleHQgPSBtZXNzYWdlO1xuXG4gICAgICAgICAgICB0aGlzLmluaXQoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGluaXQoKSB7XG4gICAgICAgICAgICBsZXQgc2VsZiA9IHRoaXM7XG4gICAgICAgICAgICB0aGlzLmNsb3NlQnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHNlbGYuaGlkZSgpO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgfVxuXG4gICAgICAgIHNob3coKSB7XG4gICAgICAgICAgICB0aGlzLmNvbnRhaW5lci5jbGFzc0xpc3QuYWRkKCdzaG93Jyk7XG4gICAgICAgIH1cbiAgICAgICAgaGlkZSgpIHtcbiAgICAgICAgICAgIHRoaXMuY29udGFpbmVyLmNsYXNzTGlzdC5yZW1vdmUoJ3Nob3cnKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vIFBsYXllciBDb21wb25lbnRcbiAgICBjbGFzcyBQbGF5ZXIge1xuXG4gICAgICAgIGNvbnN0cnVjdG9yKHBhdGhUb0ZpbGUsIGxvb3AgPSBmYWxzZSkge1xuICAgICAgICAgICAgdGhpcy5wbGF5QnRuID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3BsYXknKTtcbiAgICAgICAgICAgIHRoaXMuc3RvcEJ0biA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzdG9wJyk7XG5cblxuICAgICAgICAgICAgdGhpcy5zb3VuZCA9IG5ldyBBdWRpbyhwYXRoVG9GaWxlKTtcbiAgICAgICAgICAgIHRoaXMuc291bmQubG9vcCA9IGxvb3A7XG5cbiAgICAgICAgICAgIHRoaXMuaW5pdCgpO1xuICAgICAgICB9XG5cbiAgICAgICAgaW5pdCgpIHtcbiAgICAgICAgICAgIGxldCBzZWxmID0gdGhpcztcbiAgICAgICAgICAgIHRoaXMucGxheUJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBzZWxmLnBsYXkoKTtcbiAgICAgICAgICAgICAgICBzZWxmLnNob3dTdG9wQnRuKCk7XG4gICAgICAgICAgICAgICAgc2VsZi5oaWRlUGxheUJ0bigpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB0aGlzLnN0b3BCdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgc2VsZi5zdG9wKClcbiAgICAgICAgICAgICAgICBzZWxmLnNob3dQbGF5QnRuKCk7XG4gICAgICAgICAgICAgICAgc2VsZi5oaWRlU3RvcEJ0bigpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICBwbGF5KCkge1xuICAgICAgICAgICAgdGhpcy5zb3VuZC5wbGF5KCk7XG4gICAgICAgIH1cblxuICAgICAgICBwYXVzZSgpIHtcbiAgICAgICAgICAgIHRoaXMuc291bmQucGF1c2UoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHN0b3AoKSB7XG4gICAgICAgICAgICB0aGlzLnNvdW5kLnBhdXNlKCk7XG4gICAgICAgICAgICB0aGlzLnNvdW5kLmN1cnJlbnRUaW1lID0gMDtcbiAgICAgICAgfVxuXG4gICAgICAgIHNob3dQbGF5QnRuKCkge1xuICAgICAgICAgICAgdGhpcy5wbGF5QnRuLmNsYXNzTGlzdC5hZGQoJ3Nob3cnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGhpZGVQbGF5QnRuKCkge1xuICAgICAgICAgICAgdGhpcy5wbGF5QnRuLmNsYXNzTGlzdC5yZW1vdmUoJ3Nob3cnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHNob3dTdG9wQnRuKCkge1xuICAgICAgICAgICAgdGhpcy5zdG9wQnRuLmNsYXNzTGlzdC5hZGQoJ3Nob3cnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGhpZGVTdG9wQnRuKCkge1xuICAgICAgICAgICAgdGhpcy5zdG9wQnRuLmNsYXNzTGlzdC5yZW1vdmUoJ3Nob3cnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlzUGxheWluZyhuYW1lKSB7XG4gICAgICAgICAgICByZXR1cm4gIXRoaXMuc291bmQucGF1c2VkO1xuICAgICAgICB9XG5cbiAgICB9XG5cblxuXG5cbiAgICBuZXcgR2FtZSgpO1xuXG59KTsiXX0=
