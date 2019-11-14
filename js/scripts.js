document.addEventListener("DOMContentLoaded", function(event) {


    const Steps = [
        {},
        {
            question: 'Итак, твое первое задание. Искать конверт нужно там, где ты готовишь отличнейшую лапшу, он рядом с вилкой и ножом.',
            answer: '258',
            hint: 'Конверт в ящике стола, на кухне',
            successMessage: 'Дашулька, спасибо за отличные и вкусных блюда, которые ты для нас готовишь! Твой подарок в столе, открой дверцы.',
            timeOver: 2,
            nextBtnText: 'К следующему подарку!',
        },
        {
            question: 'Следующий конверт находится там, где ты поддерживаешь жизнь тем, кого дарят твои клиенты любимым людям.',
            answer: '555',
            hint: 'Это цветы, которые ты выращиваешь',
            successMessage: 'Спасибо за красоту, которую ты приносишь в этот мир, подарок ищи в шкафу ванной комнаты.',
            timeOver: 30,
            nextBtnText: 'Next',
        },
        {
            question: 'Поторопись к следующему конверту, он находится у хорошего кучерявого человека, живущего по соседству. Твой пароль - "Хочу халву ем, хочу пряники"',
            answer: '333',
            hint: 'Это Ирина',
            successMessage: 'Спасибо за твое общение, за новости и идеи, которыми ты делишься! Подарок в шкафу (в общем коридоре)',
            timeOver: 15,
            nextBtnText: 'Next',
        },
        {
            question: 'Следующий конверт ты найдешь там, куда попадают твои носочки после стирки.',
            answer: '157',
            hint: 'После того, как они высохли',
            successMessage: 'Спасибо за чистоту и порядок, которые ты для нас поддерживаешь! Твой следующий подарок в антресоли!',
            timeOver: 15,
            nextBtnText: 'Next',
        },
        {
            question: 'Итак, последнее задание. Ответ прячется в мешке набитом гусиными волосами.',
            answer: '369',
            hint: 'Это подушка',
            successMessage: 'Спасибо за любовь и ласку, которыми ты нас согреваешь! Твой подарок под матрасом.',
            timeOver: 15,
            nextBtnText: 'Next',
        },
    ];
    const Setup = {
        debug: true,
        secondsToDanger: 10,
        sounds: [
            {
                name: 'dasha',
                path: '/assets/sounds/dasha.mp3',
            },
            {
                name: 'applause',
                path: '/assets/sounds/applause.mp3',
            },
            {
                name: 'fireworks',
                path: '/assets/sounds/fireworks.mp3',
            },
            {
                name: 'alarm',
                path: '/assets/sounds/alarm.mp3',
            },
            {
                name: 'tick',
                path: '/assets/sounds/tick.mp3',
            },
        ],
        welcomeMessage: [
            {
                message: 'Привет, Дашулька! Сегодня твой день рождения, а в день рождения принято получать подарки.',
                btnText: 'ЮЮЮ',
            },
            {
                message: 'Добро пожаловать в приключение, Даша-путешественница! На твоём пути будут задания на поиск конвертов. В конвертах будет число, которое тебе нужно ввести. После этого ты узнаешь, где забрать подарок. Поехали?',
                btnText: 'VVV',
            },
        ],
    };


    let imagesLoaded = false;
    let soundsLoaded = false;

    document.addEventListener('assetIsLoaded', function (entity) {
        console.log(entity.source, ' is loaded');

        if (entity.source == 'sounds') {
            soundsLoaded = true;
        }

        if (entity.source == 'images') {
            imagesLoaded = true;
        }

        if (soundsLoaded && imagesLoaded) {
            document.dispatchEvent(new Event('allAssetsIsLoaded'));
        }


    });


    function preloadBackgroundImages(imagesArr) {

        let app = document.getElementById('app');
        let countOfLoaded = 0;
        let commonCount = imagesArr.length;

        function imageIsLoaded() {
            countOfLoaded++;
            if (countOfLoaded >= commonCount) {
                let event = new Event('assetIsLoaded');
                event.source = 'images';
                document.dispatchEvent(event);
            }
        }

        function imagePreloader(url) {
            let img = new Image();
            img.src = url;
            img.onload = function () {
                imageIsLoaded();
            }
            if (img.complete) img.onload();
        }

        for (let i = 0; i < imagesArr.length; i++) {

            let element = imagesArr[i];

            let style =
                element.currentStyle || window.getComputedStyle(element, false),
                url = style
                    .backgroundImage
                    .slice(4, -1)
                    .replace(/"/g, "");

            imagePreloader(url);

        }

    }

    let preloadingImagesElements = document.getElementsByClassName('preload-background');

    preloadBackgroundImages(preloadingImagesElements);

    const Sounds = [];

    for (let i = 0; i < Setup.sounds.length; i++) {
        Sounds.push({name: Setup.sounds[i].name, sound: new Audio(Setup.sounds[i].path)});
    }

    console.log(Sounds);


    function soundsPreloader(soundsArr) {

        //let app = document.getElementById('app');
        let countOfLoaded = 0;
        let commonCount = soundsArr.length;

        function soundIsLoaded() {
            countOfLoaded++;
            if (countOfLoaded >= commonCount) {
                let event = new Event('assetIsLoaded');
                event.source = 'sounds';
                document.dispatchEvent(event);
            }
        }

        for (let i = 0; i < soundsArr.length; i++) {
            soundsArr[i].sound.addEventListener('canplaythrough', function () {
                soundIsLoaded();
            })
        }

    }

    soundsPreloader(Sounds);







    // Main Component
    class Game {

        constructor() {

            this.app = document.getElementById('app');

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

            // Hide loading before loading
            //this.hideLoading();

        }

        // Bing Events
        initEvents() {

            let self = this;

            // Fullscreen Done
            this.app.addEventListener('fullscreenDone', function () {

                self.WelcomeComponent.show();

            });

            this.app.addEventListener('welcomeDone', function () {

                self.WelcomeComponent.hide();
                self.QuestComponent.show();
                self.CommonTimerComponent.start();

            });

            // Quest Done
            this.app.addEventListener('eventQuestSuccess', function () {

                self.CommonTimerComponent.stop();
                self.QuestComponent.hide();
                self.gameOverScreen.classList.add('show');
                console.log('Game Over!!!');
                console.log(self.CommonTimerComponent.getCommonTime());

            });

            // Pause Common Timer
            this.app.addEventListener('pauseTimer', function () {
                self.CommonTimerComponent.pause();
            });

            // Continue Common Timer
            this.app.addEventListener('continueTimer', function () {
                self.CommonTimerComponent.continue();
            });

            // App is Loaded
            document.addEventListener('allAssetsIsLoaded', function () {
                self.hideLoading();
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
            this.app = document.getElementById('app');
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
                    self.app.dispatchEvent(self.fullscreenDone);
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
            this.app = document.getElementById('app');
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
                this.app.dispatchEvent(this.eventDone);
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

            this.app = document.getElementById('app');
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

                        console.log('wrong...');

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

            this.app.addEventListener('failTimer', function () {
                self.hintBtn.classList.add('show');
            });

        }

        rightAnswer() {

            this.Timer.stop();

            this.app.dispatchEvent(this.pauseCommonTimer);

            this.successMessage.classList.add('show');
            this.successMessageText.focus();

            this.soundApplause.play();
            this.soundFireworks.play();

            this.app.dispatchEvent(this.stopTickSound);
            this.app.dispatchEvent(this.stopAlarmSound);

        }

        nextStep() {
            this.stepNumber++;
            if (this.stepNumber >= Steps.length) {
                this.app.dispatchEvent(this.succesEvent);
            } else {
                this.fillFields();
                this.app.dispatchEvent(this.continueCommonTimer);
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

            this.app = document.getElementById('app');
            this.container = document.getElementById('timer');
            this.availableSeconds = timeOver;

            this.showTimerValue();

            this.soundTick = new Player(Setup.sounds.tick, true);
            this.soundAlarm = new Player(Setup.sounds.alarm);

            this.failEvent = new Event('failTimer');

            this.secondsToDanger = Setup.secondsToDanger;

            let self = this;
            this.app.addEventListener('stopTickSound', function () {
                self.soundTick.stop();
            });
            this.app.addEventListener('stopAlarmSound', function () {
                self.soundAlarm.stop();
            });

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
                if (!this.soundTick.isPlaying()) {
                    this.soundTick.play();
                }
            }
        }

        checkTimeIsOver() {
            if (this.availableSeconds < 1) {
                clearInterval(this.timer);
                this.soundAlarm.play();
                this.soundTick.stop();
                this.app.dispatchEvent(this.failEvent);
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoic2NyaXB0cy5qcyIsInNvdXJjZXNDb250ZW50IjpbImRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJET01Db250ZW50TG9hZGVkXCIsIGZ1bmN0aW9uKGV2ZW50KSB7XG5cblxuICAgIGNvbnN0IFN0ZXBzID0gW1xuICAgICAgICB7fSxcbiAgICAgICAge1xuICAgICAgICAgICAgcXVlc3Rpb246ICfQmNGC0LDQuiwg0YLQstC+0LUg0L/QtdGA0LLQvtC1INC30LDQtNCw0L3QuNC1LiDQmNGB0LrQsNGC0Ywg0LrQvtC90LLQtdGA0YIg0L3Rg9C20L3QviDRgtCw0LwsINCz0LTQtSDRgtGLINCz0L7RgtC+0LLQuNGI0Ywg0L7RgtC70LjRh9C90LXQudGI0YPRjiDQu9Cw0L/RiNGDLCDQvtC9INGA0Y/QtNC+0Lwg0YEg0LLQuNC70LrQvtC5INC4INC90L7QttC+0LwuJyxcbiAgICAgICAgICAgIGFuc3dlcjogJzI1OCcsXG4gICAgICAgICAgICBoaW50OiAn0JrQvtC90LLQtdGA0YIg0LIg0Y/RidC40LrQtSDRgdGC0L7Qu9CwLCDQvdCwINC60YPRhdC90LUnLFxuICAgICAgICAgICAgc3VjY2Vzc01lc3NhZ2U6ICfQlNCw0YjRg9C70YzQutCwLCDRgdC/0LDRgdC40LHQviDQt9CwINC+0YLQu9C40YfQvdGL0LUg0Lgg0LLQutGD0YHQvdGL0YUg0LHQu9GO0LTQsCwg0LrQvtGC0L7RgNGL0LUg0YLRiyDQtNC70Y8g0L3QsNGBINCz0L7RgtC+0LLQuNGI0YwhINCi0LLQvtC5INC/0L7QtNCw0YDQvtC6INCyINGB0YLQvtC70LUsINC+0YLQutGA0L7QuSDQtNCy0LXRgNGG0YsuJyxcbiAgICAgICAgICAgIHRpbWVPdmVyOiAyLFxuICAgICAgICAgICAgbmV4dEJ0blRleHQ6ICfQmiDRgdC70LXQtNGD0Y7RidC10LzRgyDQv9C+0LTQsNGA0LrRgyEnLFxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgICBxdWVzdGlvbjogJ9Ch0LvQtdC00YPRjtGJ0LjQuSDQutC+0L3QstC10YDRgiDQvdCw0YXQvtC00LjRgtGB0Y8g0YLQsNC8LCDQs9C00LUg0YLRiyDQv9C+0LTQtNC10YDQttC40LLQsNC10YjRjCDQttC40LfQvdGMINGC0LXQvCwg0LrQvtCz0L4g0LTQsNGA0Y/RgiDRgtCy0L7QuCDQutC70LjQtdC90YLRiyDQu9GO0LHQuNC80YvQvCDQu9GO0LTRj9C8LicsXG4gICAgICAgICAgICBhbnN3ZXI6ICc1NTUnLFxuICAgICAgICAgICAgaGludDogJ9Ct0YLQviDRhtCy0LXRgtGLLCDQutC+0YLQvtGA0YvQtSDRgtGLINCy0YvRgNCw0YnQuNCy0LDQtdGI0YwnLFxuICAgICAgICAgICAgc3VjY2Vzc01lc3NhZ2U6ICfQodC/0LDRgdC40LHQviDQt9CwINC60YDQsNGB0L7RgtGDLCDQutC+0YLQvtGA0YPRjiDRgtGLINC/0YDQuNC90L7RgdC40YjRjCDQsiDRjdGC0L7RgiDQvNC40YAsINC/0L7QtNCw0YDQvtC6INC40YnQuCDQsiDRiNC60LDRhNGDINCy0LDQvdC90L7QuSDQutC+0LzQvdCw0YLRiy4nLFxuICAgICAgICAgICAgdGltZU92ZXI6IDMwLFxuICAgICAgICAgICAgbmV4dEJ0blRleHQ6ICdOZXh0JyxcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgcXVlc3Rpb246ICfQn9C+0YLQvtGA0L7Qv9C40YHRjCDQuiDRgdC70LXQtNGD0Y7RidC10LzRgyDQutC+0L3QstC10YDRgtGDLCDQvtC9INC90LDRhdC+0LTQuNGC0YHRjyDRgyDRhdC+0YDQvtGI0LXQs9C+INC60YPRh9C10YDRj9Cy0L7Qs9C+INGH0LXQu9C+0LLQtdC60LAsINC20LjQstGD0YnQtdCz0L4g0L/QviDRgdC+0YHQtdC00YHRgtCy0YMuINCi0LLQvtC5INC/0LDRgNC+0LvRjCAtIFwi0KXQvtGH0YMg0YXQsNC70LLRgyDQtdC8LCDRhdC+0YfRgyDQv9GA0Y/QvdC40LrQuFwiJyxcbiAgICAgICAgICAgIGFuc3dlcjogJzMzMycsXG4gICAgICAgICAgICBoaW50OiAn0K3RgtC+INCY0YDQuNC90LAnLFxuICAgICAgICAgICAgc3VjY2Vzc01lc3NhZ2U6ICfQodC/0LDRgdC40LHQviDQt9CwINGC0LLQvtC1INC+0LHRidC10L3QuNC1LCDQt9CwINC90L7QstC+0YHRgtC4INC4INC40LTQtdC4LCDQutC+0YLQvtGA0YvQvNC4INGC0Ysg0LTQtdC70LjRiNGM0YHRjyEg0J/QvtC00LDRgNC+0Log0LIg0YjQutCw0YTRgyAo0LIg0L7QsdGJ0LXQvCDQutC+0YDQuNC00L7RgNC1KScsXG4gICAgICAgICAgICB0aW1lT3ZlcjogMTUsXG4gICAgICAgICAgICBuZXh0QnRuVGV4dDogJ05leHQnLFxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgICBxdWVzdGlvbjogJ9Ch0LvQtdC00YPRjtGJ0LjQuSDQutC+0L3QstC10YDRgiDRgtGLINC90LDQudC00LXRiNGMINGC0LDQvCwg0LrRg9C00LAg0L/QvtC/0LDQtNCw0Y7RgiDRgtCy0L7QuCDQvdC+0YHQvtGH0LrQuCDQv9C+0YHQu9C1INGB0YLQuNGA0LrQuC4nLFxuICAgICAgICAgICAgYW5zd2VyOiAnMTU3JyxcbiAgICAgICAgICAgIGhpbnQ6ICfQn9C+0YHQu9C1INGC0L7Qs9C+LCDQutCw0Log0L7QvdC4INCy0YvRgdC+0YXQu9C4JyxcbiAgICAgICAgICAgIHN1Y2Nlc3NNZXNzYWdlOiAn0KHQv9Cw0YHQuNCx0L4g0LfQsCDRh9C40YHRgtC+0YLRgyDQuCDQv9C+0YDRj9C00L7Quiwg0LrQvtGC0L7RgNGL0LUg0YLRiyDQtNC70Y8g0L3QsNGBINC/0L7QtNC00LXRgNC20LjQstCw0LXRiNGMISDQotCy0L7QuSDRgdC70LXQtNGD0Y7RidC40Lkg0L/QvtC00LDRgNC+0Log0LIg0LDQvdGC0YDQtdGB0L7Qu9C4IScsXG4gICAgICAgICAgICB0aW1lT3ZlcjogMTUsXG4gICAgICAgICAgICBuZXh0QnRuVGV4dDogJ05leHQnLFxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgICBxdWVzdGlvbjogJ9CY0YLQsNC6LCDQv9C+0YHQu9C10LTQvdC10LUg0LfQsNC00LDQvdC40LUuINCe0YLQstC10YIg0L/RgNGP0YfQtdGC0YHRjyDQsiDQvNC10YjQutC1INC90LDQsdC40YLQvtC8INCz0YPRgdC40L3Ri9C80Lgg0LLQvtC70L7RgdCw0LzQuC4nLFxuICAgICAgICAgICAgYW5zd2VyOiAnMzY5JyxcbiAgICAgICAgICAgIGhpbnQ6ICfQrdGC0L4g0L/QvtC00YPRiNC60LAnLFxuICAgICAgICAgICAgc3VjY2Vzc01lc3NhZ2U6ICfQodC/0LDRgdC40LHQviDQt9CwINC70Y7QsdC+0LLRjCDQuCDQu9Cw0YHQutGDLCDQutC+0YLQvtGA0YvQvNC4INGC0Ysg0L3QsNGBINGB0L7Qs9GA0LXQstCw0LXRiNGMISDQotCy0L7QuSDQv9C+0LTQsNGA0L7QuiDQv9C+0LQg0LzQsNGC0YDQsNGB0L7QvC4nLFxuICAgICAgICAgICAgdGltZU92ZXI6IDE1LFxuICAgICAgICAgICAgbmV4dEJ0blRleHQ6ICdOZXh0JyxcbiAgICAgICAgfSxcbiAgICBdO1xuICAgIGNvbnN0IFNldHVwID0ge1xuICAgICAgICBkZWJ1ZzogdHJ1ZSxcbiAgICAgICAgc2Vjb25kc1RvRGFuZ2VyOiAxMCxcbiAgICAgICAgc291bmRzOiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgbmFtZTogJ2Rhc2hhJyxcbiAgICAgICAgICAgICAgICBwYXRoOiAnL2Fzc2V0cy9zb3VuZHMvZGFzaGEubXAzJyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgbmFtZTogJ2FwcGxhdXNlJyxcbiAgICAgICAgICAgICAgICBwYXRoOiAnL2Fzc2V0cy9zb3VuZHMvYXBwbGF1c2UubXAzJyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgbmFtZTogJ2ZpcmV3b3JrcycsXG4gICAgICAgICAgICAgICAgcGF0aDogJy9hc3NldHMvc291bmRzL2ZpcmV3b3Jrcy5tcDMnLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBuYW1lOiAnYWxhcm0nLFxuICAgICAgICAgICAgICAgIHBhdGg6ICcvYXNzZXRzL3NvdW5kcy9hbGFybS5tcDMnLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBuYW1lOiAndGljaycsXG4gICAgICAgICAgICAgICAgcGF0aDogJy9hc3NldHMvc291bmRzL3RpY2subXAzJyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICAgIHdlbGNvbWVNZXNzYWdlOiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgbWVzc2FnZTogJ9Cf0YDQuNCy0LXRgiwg0JTQsNGI0YPQu9GM0LrQsCEg0KHQtdCz0L7QtNC90Y8g0YLQstC+0Lkg0LTQtdC90Ywg0YDQvtC20LTQtdC90LjRjywg0LAg0LIg0LTQtdC90Ywg0YDQvtC20LTQtdC90LjRjyDQv9GA0LjQvdGP0YLQviDQv9C+0LvRg9GH0LDRgtGMINC/0L7QtNCw0YDQutC4LicsXG4gICAgICAgICAgICAgICAgYnRuVGV4dDogJ9Cu0K7QricsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIG1lc3NhZ2U6ICfQlNC+0LHRgNC+INC/0L7QttCw0LvQvtCy0LDRgtGMINCyINC/0YDQuNC60LvRjtGH0LXQvdC40LUsINCU0LDRiNCwLdC/0YPRgtC10YjQtdGB0YLQstC10L3QvdC40YbQsCEg0J3QsCDRgtCy0L7RkdC8INC/0YPRgtC4INCx0YPQtNGD0YIg0LfQsNC00LDQvdC40Y8g0L3QsCDQv9C+0LjRgdC6INC60L7QvdCy0LXRgNGC0L7Qsi4g0JIg0LrQvtC90LLQtdGA0YLQsNGFINCx0YPQtNC10YIg0YfQuNGB0LvQviwg0LrQvtGC0L7RgNC+0LUg0YLQtdCx0LUg0L3Rg9C20L3QviDQstCy0LXRgdGC0LguINCf0L7RgdC70LUg0Y3RgtC+0LPQviDRgtGLINGD0LfQvdCw0LXRiNGMLCDQs9C00LUg0LfQsNCx0YDQsNGC0Ywg0L/QvtC00LDRgNC+0LouINCf0L7QtdGF0LDQu9C4PycsXG4gICAgICAgICAgICAgICAgYnRuVGV4dDogJ1ZWVicsXG4gICAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgIH07XG5cblxuICAgIGxldCBpbWFnZXNMb2FkZWQgPSBmYWxzZTtcbiAgICBsZXQgc291bmRzTG9hZGVkID0gZmFsc2U7XG5cbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdhc3NldElzTG9hZGVkJywgZnVuY3Rpb24gKGVudGl0eSkge1xuICAgICAgICBjb25zb2xlLmxvZyhlbnRpdHkuc291cmNlLCAnIGlzIGxvYWRlZCcpO1xuXG4gICAgICAgIGlmIChlbnRpdHkuc291cmNlID09ICdzb3VuZHMnKSB7XG4gICAgICAgICAgICBzb3VuZHNMb2FkZWQgPSB0cnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGVudGl0eS5zb3VyY2UgPT0gJ2ltYWdlcycpIHtcbiAgICAgICAgICAgIGltYWdlc0xvYWRlZCA9IHRydWU7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoc291bmRzTG9hZGVkICYmIGltYWdlc0xvYWRlZCkge1xuICAgICAgICAgICAgZG9jdW1lbnQuZGlzcGF0Y2hFdmVudChuZXcgRXZlbnQoJ2FsbEFzc2V0c0lzTG9hZGVkJykpO1xuICAgICAgICB9XG5cblxuICAgIH0pO1xuXG5cbiAgICBmdW5jdGlvbiBwcmVsb2FkQmFja2dyb3VuZEltYWdlcyhpbWFnZXNBcnIpIHtcblxuICAgICAgICBsZXQgYXBwID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2FwcCcpO1xuICAgICAgICBsZXQgY291bnRPZkxvYWRlZCA9IDA7XG4gICAgICAgIGxldCBjb21tb25Db3VudCA9IGltYWdlc0Fyci5sZW5ndGg7XG5cbiAgICAgICAgZnVuY3Rpb24gaW1hZ2VJc0xvYWRlZCgpIHtcbiAgICAgICAgICAgIGNvdW50T2ZMb2FkZWQrKztcbiAgICAgICAgICAgIGlmIChjb3VudE9mTG9hZGVkID49IGNvbW1vbkNvdW50KSB7XG4gICAgICAgICAgICAgICAgbGV0IGV2ZW50ID0gbmV3IEV2ZW50KCdhc3NldElzTG9hZGVkJyk7XG4gICAgICAgICAgICAgICAgZXZlbnQuc291cmNlID0gJ2ltYWdlcyc7XG4gICAgICAgICAgICAgICAgZG9jdW1lbnQuZGlzcGF0Y2hFdmVudChldmVudCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBpbWFnZVByZWxvYWRlcih1cmwpIHtcbiAgICAgICAgICAgIGxldCBpbWcgPSBuZXcgSW1hZ2UoKTtcbiAgICAgICAgICAgIGltZy5zcmMgPSB1cmw7XG4gICAgICAgICAgICBpbWcub25sb2FkID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIGltYWdlSXNMb2FkZWQoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChpbWcuY29tcGxldGUpIGltZy5vbmxvYWQoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgaW1hZ2VzQXJyLmxlbmd0aDsgaSsrKSB7XG5cbiAgICAgICAgICAgIGxldCBlbGVtZW50ID0gaW1hZ2VzQXJyW2ldO1xuXG4gICAgICAgICAgICBsZXQgc3R5bGUgPVxuICAgICAgICAgICAgICAgIGVsZW1lbnQuY3VycmVudFN0eWxlIHx8IHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKGVsZW1lbnQsIGZhbHNlKSxcbiAgICAgICAgICAgICAgICB1cmwgPSBzdHlsZVxuICAgICAgICAgICAgICAgICAgICAuYmFja2dyb3VuZEltYWdlXG4gICAgICAgICAgICAgICAgICAgIC5zbGljZSg0LCAtMSlcbiAgICAgICAgICAgICAgICAgICAgLnJlcGxhY2UoL1wiL2csIFwiXCIpO1xuXG4gICAgICAgICAgICBpbWFnZVByZWxvYWRlcih1cmwpO1xuXG4gICAgICAgIH1cblxuICAgIH1cblxuICAgIGxldCBwcmVsb2FkaW5nSW1hZ2VzRWxlbWVudHMgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdwcmVsb2FkLWJhY2tncm91bmQnKTtcblxuICAgIHByZWxvYWRCYWNrZ3JvdW5kSW1hZ2VzKHByZWxvYWRpbmdJbWFnZXNFbGVtZW50cyk7XG5cbiAgICBjb25zdCBTb3VuZHMgPSBbXTtcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgU2V0dXAuc291bmRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIFNvdW5kcy5wdXNoKHtuYW1lOiBTZXR1cC5zb3VuZHNbaV0ubmFtZSwgc291bmQ6IG5ldyBBdWRpbyhTZXR1cC5zb3VuZHNbaV0ucGF0aCl9KTtcbiAgICB9XG5cbiAgICBjb25zb2xlLmxvZyhTb3VuZHMpO1xuXG5cbiAgICBmdW5jdGlvbiBzb3VuZHNQcmVsb2FkZXIoc291bmRzQXJyKSB7XG5cbiAgICAgICAgLy9sZXQgYXBwID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2FwcCcpO1xuICAgICAgICBsZXQgY291bnRPZkxvYWRlZCA9IDA7XG4gICAgICAgIGxldCBjb21tb25Db3VudCA9IHNvdW5kc0Fyci5sZW5ndGg7XG5cbiAgICAgICAgZnVuY3Rpb24gc291bmRJc0xvYWRlZCgpIHtcbiAgICAgICAgICAgIGNvdW50T2ZMb2FkZWQrKztcbiAgICAgICAgICAgIGlmIChjb3VudE9mTG9hZGVkID49IGNvbW1vbkNvdW50KSB7XG4gICAgICAgICAgICAgICAgbGV0IGV2ZW50ID0gbmV3IEV2ZW50KCdhc3NldElzTG9hZGVkJyk7XG4gICAgICAgICAgICAgICAgZXZlbnQuc291cmNlID0gJ3NvdW5kcyc7XG4gICAgICAgICAgICAgICAgZG9jdW1lbnQuZGlzcGF0Y2hFdmVudChldmVudCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHNvdW5kc0Fyci5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgc291bmRzQXJyW2ldLnNvdW5kLmFkZEV2ZW50TGlzdGVuZXIoJ2NhbnBsYXl0aHJvdWdoJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHNvdW5kSXNMb2FkZWQoKTtcbiAgICAgICAgICAgIH0pXG4gICAgICAgIH1cblxuICAgIH1cblxuICAgIHNvdW5kc1ByZWxvYWRlcihTb3VuZHMpO1xuXG5cblxuXG5cblxuXG4gICAgLy8gTWFpbiBDb21wb25lbnRcbiAgICBjbGFzcyBHYW1lIHtcblxuICAgICAgICBjb25zdHJ1Y3RvcigpIHtcblxuICAgICAgICAgICAgdGhpcy5hcHAgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYXBwJyk7XG5cbiAgICAgICAgICAgIC8vIFNjcmVlbnNcbiAgICAgICAgICAgIHRoaXMubG9hZGluZ1NjcmVlbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdsb2FkaW5nJyk7XG4gICAgICAgICAgICB0aGlzLnB5cm9TY3JlZW4gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncHlybycpO1xuICAgICAgICAgICAgdGhpcy5nYW1lT3ZlclNjcmVlbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdnYW1lLW92ZXInKTtcblxuXG4gICAgICAgICAgICAvLyBDb21wb25lbnRzXG4gICAgICAgICAgICB0aGlzLkZ1bGxzY3JlZW5Db21wb25lbnQgPSBuZXcgRnVsbHNjcmVlbkNvbXBvbmVudCgpO1xuICAgICAgICAgICAgdGhpcy5XZWxjb21lQ29tcG9uZW50ID0gbmV3IFdlbGNvbWUoKTtcbiAgICAgICAgICAgIHRoaXMuQ29tbW9uVGltZXJDb21wb25lbnQgPSBuZXcgQ29tbW9uVGltZXJDb21wb25lbnQoKTtcbiAgICAgICAgICAgIHRoaXMuUXVlc3RDb21wb25lbnQgPSBuZXcgUXVlc3RDb21wb25lbnQoKTtcblxuXG4gICAgICAgICAgICAvLyBCaW5kIEV2ZW50c1xuICAgICAgICAgICAgdGhpcy5pbml0RXZlbnRzKCk7XG5cbiAgICAgICAgICAgIC8vIEhpZGUgbG9hZGluZyBiZWZvcmUgbG9hZGluZ1xuICAgICAgICAgICAgLy90aGlzLmhpZGVMb2FkaW5nKCk7XG5cbiAgICAgICAgfVxuXG4gICAgICAgIC8vIEJpbmcgRXZlbnRzXG4gICAgICAgIGluaXRFdmVudHMoKSB7XG5cbiAgICAgICAgICAgIGxldCBzZWxmID0gdGhpcztcblxuICAgICAgICAgICAgLy8gRnVsbHNjcmVlbiBEb25lXG4gICAgICAgICAgICB0aGlzLmFwcC5hZGRFdmVudExpc3RlbmVyKCdmdWxsc2NyZWVuRG9uZScsIGZ1bmN0aW9uICgpIHtcblxuICAgICAgICAgICAgICAgIHNlbGYuV2VsY29tZUNvbXBvbmVudC5zaG93KCk7XG5cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICB0aGlzLmFwcC5hZGRFdmVudExpc3RlbmVyKCd3ZWxjb21lRG9uZScsIGZ1bmN0aW9uICgpIHtcblxuICAgICAgICAgICAgICAgIHNlbGYuV2VsY29tZUNvbXBvbmVudC5oaWRlKCk7XG4gICAgICAgICAgICAgICAgc2VsZi5RdWVzdENvbXBvbmVudC5zaG93KCk7XG4gICAgICAgICAgICAgICAgc2VsZi5Db21tb25UaW1lckNvbXBvbmVudC5zdGFydCgpO1xuXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgLy8gUXVlc3QgRG9uZVxuICAgICAgICAgICAgdGhpcy5hcHAuYWRkRXZlbnRMaXN0ZW5lcignZXZlbnRRdWVzdFN1Y2Nlc3MnLCBmdW5jdGlvbiAoKSB7XG5cbiAgICAgICAgICAgICAgICBzZWxmLkNvbW1vblRpbWVyQ29tcG9uZW50LnN0b3AoKTtcbiAgICAgICAgICAgICAgICBzZWxmLlF1ZXN0Q29tcG9uZW50LmhpZGUoKTtcbiAgICAgICAgICAgICAgICBzZWxmLmdhbWVPdmVyU2NyZWVuLmNsYXNzTGlzdC5hZGQoJ3Nob3cnKTtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnR2FtZSBPdmVyISEhJyk7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coc2VsZi5Db21tb25UaW1lckNvbXBvbmVudC5nZXRDb21tb25UaW1lKCkpO1xuXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgLy8gUGF1c2UgQ29tbW9uIFRpbWVyXG4gICAgICAgICAgICB0aGlzLmFwcC5hZGRFdmVudExpc3RlbmVyKCdwYXVzZVRpbWVyJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHNlbGYuQ29tbW9uVGltZXJDb21wb25lbnQucGF1c2UoKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAvLyBDb250aW51ZSBDb21tb24gVGltZXJcbiAgICAgICAgICAgIHRoaXMuYXBwLmFkZEV2ZW50TGlzdGVuZXIoJ2NvbnRpbnVlVGltZXInLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgc2VsZi5Db21tb25UaW1lckNvbXBvbmVudC5jb250aW51ZSgpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIC8vIEFwcCBpcyBMb2FkZWRcbiAgICAgICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2FsbEFzc2V0c0lzTG9hZGVkJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHNlbGYuaGlkZUxvYWRpbmcoKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgIH1cblxuICAgICAgICAvL0xvYWRpbmdcbiAgICAgICAgaGlkZUxvYWRpbmcoKSB7XG4gICAgICAgICAgICB0aGlzLmxvYWRpbmdTY3JlZW4uY2xhc3NMaXN0LnJlbW92ZSgnc2hvdycpO1xuICAgICAgICB9XG5cbiAgICB9XG5cbiAgICAvLyBGdWxsc2NyZWVuIENsYXNzXG4gICAgY2xhc3MgRnVsbHNjcmVlbkNvbXBvbmVudCB7XG5cbiAgICAgICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgICAgICB0aGlzLmFwcCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdhcHAnKTtcbiAgICAgICAgICAgIHRoaXMuY29udGFpbmVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2Z1bGxzY3JlZW4nKTtcbiAgICAgICAgICAgIHRoaXMuY29udGFpbmVyLmNsYXNzTGlzdC5hZGQoJ3Nob3cnKTtcbiAgICAgICAgICAgIHRoaXMuYnRuID0gdGhpcy5jb250YWluZXIucXVlcnlTZWxlY3RvcignYnV0dG9uJyk7XG4gICAgICAgICAgICB0aGlzLmZ1bGxzY3JlZW5Eb25lID0gbmV3IEV2ZW50KCdmdWxsc2NyZWVuRG9uZScpO1xuICAgICAgICAgICAgbGV0IHNlbGYgPSB0aGlzO1xuICAgICAgICAgICAgdGhpcy5idG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgaWYgKCFTZXR1cC5kZWJ1Zykge1xuICAgICAgICAgICAgICAgICAgICBzZWxmLmxhdW5jaEZ1bGxTY3JlZW4oZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgc2VsZi5idG4uY2xhc3NMaXN0LmFkZCgnc29mdF9oaWRlJyk7XG4gICAgICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIHNlbGYuY29udGFpbmVyLmNsYXNzTGlzdC5yZW1vdmUoJ3Nob3cnKTtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5hcHAuZGlzcGF0Y2hFdmVudChzZWxmLmZ1bGxzY3JlZW5Eb25lKTtcbiAgICAgICAgICAgICAgICB9LCAxMDAwKTtcbiAgICAgICAgICAgIH0pXG4gICAgICAgIH1cblxuICAgICAgICBsYXVuY2hGdWxsU2NyZWVuKGVsZW1lbnQpIHtcbiAgICAgICAgICAgIGlmKGVsZW1lbnQucmVxdWVzdEZ1bGxTY3JlZW4pIHtcbiAgICAgICAgICAgICAgICBlbGVtZW50LnJlcXVlc3RGdWxsU2NyZWVuKCk7XG4gICAgICAgICAgICB9IGVsc2UgaWYoZWxlbWVudC5tb3pSZXF1ZXN0RnVsbFNjcmVlbikge1xuICAgICAgICAgICAgICAgIGVsZW1lbnQubW96UmVxdWVzdEZ1bGxTY3JlZW4oKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZihlbGVtZW50LndlYmtpdFJlcXVlc3RGdWxsU2NyZWVuKSB7XG4gICAgICAgICAgICAgICAgZWxlbWVudC53ZWJraXRSZXF1ZXN0RnVsbFNjcmVlbigpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgY2FuY2VsRnVsbHNjcmVlbigpIHtcbiAgICAgICAgICAgIGlmKGRvY3VtZW50LmNhbmNlbEZ1bGxTY3JlZW4pIHtcbiAgICAgICAgICAgICAgICBkb2N1bWVudC5jYW5jZWxGdWxsU2NyZWVuKCk7XG4gICAgICAgICAgICB9IGVsc2UgaWYoZG9jdW1lbnQubW96Q2FuY2VsRnVsbFNjcmVlbikge1xuICAgICAgICAgICAgICAgIGRvY3VtZW50Lm1vekNhbmNlbEZ1bGxTY3JlZW4oKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZihkb2N1bWVudC53ZWJraXRDYW5jZWxGdWxsU2NyZWVuKSB7XG4gICAgICAgICAgICAgICAgZG9jdW1lbnQud2Via2l0Q2FuY2VsRnVsbFNjcmVlbigpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICB9XG5cbiAgICAvLyBXZWxjb21lIE1lc3NhZ2VzXG4gICAgY2xhc3MgV2VsY29tZSB7XG5cbiAgICAgICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgICAgICB0aGlzLmFwcCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdhcHAnKTtcbiAgICAgICAgICAgIHRoaXMuY29udGFpbmVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3dlbGNvbWUnKTtcbiAgICAgICAgICAgIHRoaXMuYXBwZWFydGluQmxvY2sgPSB0aGlzLmNvbnRhaW5lci5xdWVyeVNlbGVjdG9yKCcjd2VsY29tZS10ZXh0Jyk7XG4gICAgICAgICAgICB0aGlzLnRleHQgPSB0aGlzLmNvbnRhaW5lci5xdWVyeVNlbGVjdG9yKCcjd2VsY29tZS10ZXh0ID4gcCcpO1xuICAgICAgICAgICAgdGhpcy5uZXh0QnRuID0gdGhpcy5jb250YWluZXIucXVlcnlTZWxlY3RvcignYnV0dG9uI3dlbGNvbWUtbmV4dC1idG4nKTtcbiAgICAgICAgICAgIHRoaXMuZXZlbnREb25lID0gbmV3IEV2ZW50KCd3ZWxjb21lRG9uZScpO1xuICAgICAgICAgICAgdGhpcy5tdXNpY0Rhc2hhID0gbmV3IFBsYXllcihTZXR1cC5zb3VuZHMuZGFzaGEpO1xuICAgICAgICAgICAgdGhpcy5pbml0KCk7XG4gICAgICAgIH1cblxuICAgICAgICBpbml0KCkge1xuXG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRNZXNzYWdlID0gMDtcblxuICAgICAgICAgICAgdGhpcy5maWxsRmllbGRzKCk7XG5cbiAgICAgICAgICAgIGxldCBzZWxmID0gdGhpcztcbiAgICAgICAgICAgIHRoaXMubmV4dEJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBzZWxmLm5leHRNZXNzYWdlKCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZpbGxGaWVsZHMoKSB7XG4gICAgICAgICAgICB0aGlzLnRleHQuaW5uZXJUZXh0ID0gU2V0dXAud2VsY29tZU1lc3NhZ2VbdGhpcy5jdXJyZW50TWVzc2FnZV0ubWVzc2FnZTtcbiAgICAgICAgICAgIHRoaXMubmV4dEJ0bi5pbm5lclRleHQgPSBTZXR1cC53ZWxjb21lTWVzc2FnZVt0aGlzLmN1cnJlbnRNZXNzYWdlXS5idG5UZXh0O1xuICAgICAgICB9XG5cbiAgICAgICAgbmV4dE1lc3NhZ2UoKSB7XG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRNZXNzYWdlKys7XG4gICAgICAgICAgICBpZiAodGhpcy5jdXJyZW50TWVzc2FnZSA+PSBTZXR1cC53ZWxjb21lTWVzc2FnZS5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICB0aGlzLm11c2ljRGFzaGEuc3RvcCgpO1xuICAgICAgICAgICAgICAgIHRoaXMuYXBwLmRpc3BhdGNoRXZlbnQodGhpcy5ldmVudERvbmUpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5jdXJyZW50TWVzc2FnZSA9PSAxKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICghU2V0dXAuZGVidWcpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubXVzaWNEYXNoYS5wbGF5KCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdGhpcy5maWxsRmllbGRzKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBzaG93KCkge1xuICAgICAgICAgICAgdGhpcy5jb250YWluZXIuY2xhc3NMaXN0LmFkZCgnc2hvdycpO1xuICAgICAgICAgICAgdGhpcy5hcHBlYXJ0aW5CbG9jay5jbGFzc0xpc3QuYWRkKCdzaG93Jyk7XG4gICAgICAgICAgICB0aGlzLm5leHRCdG4uY2xhc3NMaXN0LmFkZCgnc2hvdycpO1xuICAgICAgICB9XG5cbiAgICAgICAgaGlkZSgpIHtcbiAgICAgICAgICAgIHRoaXMuY29udGFpbmVyLmNsYXNzTGlzdC5yZW1vdmUoJ3Nob3cnKTtcbiAgICAgICAgfVxuXG4gICAgfVxuXG4gICAgLy8gQ29tbW9uVGltZSBDbGFzc1xuICAgIGNsYXNzIENvbW1vblRpbWVyQ29tcG9uZW50IHtcblxuICAgICAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgICAgIHRoaXMuY3VycmVudFNlY29uZHMgPSAwO1xuICAgICAgICAgICAgdGhpcy5pc1BhdXNlZCA9IGZhbHNlO1xuICAgICAgICB9XG5cbiAgICAgICAgc3RhcnQoKSB7XG4gICAgICAgICAgICBsZXQgc2VsZiA9IHRoaXM7XG4gICAgICAgICAgICB0aGlzLnRpbWVyID0gc2V0SW50ZXJ2YWwoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIGlmICghc2VsZi5pc1BhdXNlZCkge1xuICAgICAgICAgICAgICAgICAgICBzZWxmLmN1cnJlbnRTZWNvbmRzICsrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sIDEwMDApO1xuICAgICAgICB9XG5cbiAgICAgICAgcGF1c2UoKSB7XG4gICAgICAgICAgICB0aGlzLmlzUGF1c2VkID0gdHJ1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnRpbnVlKCkge1xuICAgICAgICAgICAgdGhpcy5pc1BhdXNlZCA9IGZhbHNlO1xuICAgICAgICB9XG5cbiAgICAgICAgc3RvcCgpIHtcbiAgICAgICAgICAgIGNsZWFySW50ZXJ2YWwodGhpcy50aW1lcik7XG4gICAgICAgIH1cblxuICAgICAgICBnZXRDb21tb25UaW1lKCkge1xuXG4gICAgICAgICAgICBsZXQgbWludXRlcyA9IE1hdGguZmxvb3IodGhpcy5jdXJyZW50U2Vjb25kcyAvIDYwKTtcbiAgICAgICAgICAgIGxldCBzZWNvbmRzID0gdGhpcy5jdXJyZW50U2Vjb25kcyAlIDYwO1xuXG4gICAgICAgICAgICBpZiAobWludXRlcyA8IDEwKSB7XG4gICAgICAgICAgICAgICAgbWludXRlcyA9ICcwJyArIG1pbnV0ZXM7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChzZWNvbmRzIDwgMTApIHtcbiAgICAgICAgICAgICAgICBzZWNvbmRzID0gJzAnICsgc2Vjb25kcztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIG1pbnV0ZXMgKyAnOicgKyBzZWNvbmRzOztcbiAgICAgICAgfVxuXG4gICAgfVxuXG4gICAgLy8gUWVzdFN0ZXAgQ2xhc3NcbiAgICBjbGFzcyBRdWVzdENvbXBvbmVudCB7XG5cbiAgICAgICAgY29uc3RydWN0b3IoKSB7XG5cbiAgICAgICAgICAgIHRoaXMuYXBwID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2FwcCcpO1xuICAgICAgICAgICAgdGhpcy5jb250YWluZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncXVlc3QnKTtcblxuICAgICAgICAgICAgdGhpcy50ZXh0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3RleHQnKTtcbiAgICAgICAgICAgIHRoaXMuaW5wdXQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYW5zd2VyLWlucHV0Jyk7XG5cbiAgICAgICAgICAgIHRoaXMuc3VjY2Vzc01lc3NhZ2UgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc3VjY2Vzcy1tZXNzYWdlJyk7XG4gICAgICAgICAgICB0aGlzLnN1Y2Nlc3NNZXNzYWdlVGV4dCA9IHRoaXMuc3VjY2Vzc01lc3NhZ2UucXVlcnlTZWxlY3RvcigncCN0ZXh0LXN1Y2Nlc3MtbWVzc2FnZScpO1xuICAgICAgICAgICAgdGhpcy5uZXh0UXVlc3RCdG4gPSB0aGlzLnN1Y2Nlc3NNZXNzYWdlLnF1ZXJ5U2VsZWN0b3IoJ2J1dHRvbiNuZXh0LXF1ZXN0LWJ0bicpO1xuXG4gICAgICAgICAgICB0aGlzLmhpbnRCdG4gPSB0aGlzLmNvbnRhaW5lci5xdWVyeVNlbGVjdG9yKCdidXR0b24jaGludC1idG4nKTtcblxuICAgICAgICAgICAgdGhpcy5zdWNjZXNFdmVudCA9IG5ldyBFdmVudCgnZXZlbnRRdWVzdFN1Y2Nlc3MnKTtcbiAgICAgICAgICAgIHRoaXMucGF1c2VDb21tb25UaW1lciA9IG5ldyBFdmVudCgncGF1c2VUaW1lcicpO1xuICAgICAgICAgICAgdGhpcy5jb250aW51ZUNvbW1vblRpbWVyID0gbmV3IEV2ZW50KCdjb250aW51ZVRpbWVyJyk7XG4gICAgICAgICAgICB0aGlzLnN0b3BUaWNrU291bmQgPSBuZXcgRXZlbnQoJ3N0b3BUaWNrU291bmQnKTtcbiAgICAgICAgICAgIHRoaXMuc3RvcEFsYXJtU291bmQgPSBuZXcgRXZlbnQoJ3N0b3BBbGFybVNvdW5kJyk7XG5cbiAgICAgICAgICAgIHRoaXMuc291bmRBcHBsYXVzZSA9IG5ldyBQbGF5ZXIoU2V0dXAuc291bmRzLmFwcGxhdXNlKTtcbiAgICAgICAgICAgIHRoaXMuc291bmRGaXJld29ya3MgPSBuZXcgUGxheWVyKFNldHVwLnNvdW5kcy5maXJld29ya3MpO1xuXG4gICAgICAgICAgICB0aGlzLmluaXQoKTtcblxuICAgICAgICB9XG5cbiAgICAgICAgaW5pdCgpIHtcblxuICAgICAgICAgICAgdGhpcy5zdGVwTnVtYmVyID0gMTtcblxuICAgICAgICAgICAgdGhpcy5maWxsRmllbGRzKCk7XG5cbiAgICAgICAgICAgIGxldCBzZWxmID0gdGhpcztcblxuICAgICAgICAgICAgdGhpcy5pbnB1dC5zZXRBdHRyaWJ1dGUoJ21heGxlbmd0aCcsIHRoaXMuYW5zd2VyLmxlbmd0aCk7XG5cbiAgICAgICAgICAgIHRoaXMuaW5wdXQuYWRkRXZlbnRMaXN0ZW5lcignaW5wdXQnLCBmdW5jdGlvbiAoKSB7XG5cbiAgICAgICAgICAgICAgICBpZiAodGhpcy52YWx1ZS5sZW5ndGggPT0gc2VsZi5hbnN3ZXIubGVuZ3RoKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMudmFsdWUgPT0gc2VsZi5hbnN3ZXIpIHtcblxuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5yaWdodEFuc3dlcigpO1xuXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCd3cm9uZy4uLicpO1xuXG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHRoaXMuaGludEJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBzZWxmLkhpbnRDb21wb25lbnQuc2hvdygpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHRoaXMubmV4dFF1ZXN0QnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xuXG4gICAgICAgICAgICAgICAgc2VsZi5zdWNjZXNzTWVzc2FnZS5jbGFzc0xpc3QucmVtb3ZlKCdzaG93Jyk7XG5cbiAgICAgICAgICAgICAgICBzZWxmLm5leHRTdGVwKCk7XG5cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICB0aGlzLmFwcC5hZGRFdmVudExpc3RlbmVyKCdmYWlsVGltZXInLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgc2VsZi5oaW50QnRuLmNsYXNzTGlzdC5hZGQoJ3Nob3cnKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgIH1cblxuICAgICAgICByaWdodEFuc3dlcigpIHtcblxuICAgICAgICAgICAgdGhpcy5UaW1lci5zdG9wKCk7XG5cbiAgICAgICAgICAgIHRoaXMuYXBwLmRpc3BhdGNoRXZlbnQodGhpcy5wYXVzZUNvbW1vblRpbWVyKTtcblxuICAgICAgICAgICAgdGhpcy5zdWNjZXNzTWVzc2FnZS5jbGFzc0xpc3QuYWRkKCdzaG93Jyk7XG4gICAgICAgICAgICB0aGlzLnN1Y2Nlc3NNZXNzYWdlVGV4dC5mb2N1cygpO1xuXG4gICAgICAgICAgICB0aGlzLnNvdW5kQXBwbGF1c2UucGxheSgpO1xuICAgICAgICAgICAgdGhpcy5zb3VuZEZpcmV3b3Jrcy5wbGF5KCk7XG5cbiAgICAgICAgICAgIHRoaXMuYXBwLmRpc3BhdGNoRXZlbnQodGhpcy5zdG9wVGlja1NvdW5kKTtcbiAgICAgICAgICAgIHRoaXMuYXBwLmRpc3BhdGNoRXZlbnQodGhpcy5zdG9wQWxhcm1Tb3VuZCk7XG5cbiAgICAgICAgfVxuXG4gICAgICAgIG5leHRTdGVwKCkge1xuICAgICAgICAgICAgdGhpcy5zdGVwTnVtYmVyKys7XG4gICAgICAgICAgICBpZiAodGhpcy5zdGVwTnVtYmVyID49IFN0ZXBzLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgIHRoaXMuYXBwLmRpc3BhdGNoRXZlbnQodGhpcy5zdWNjZXNFdmVudCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMuZmlsbEZpZWxkcygpO1xuICAgICAgICAgICAgICAgIHRoaXMuYXBwLmRpc3BhdGNoRXZlbnQodGhpcy5jb250aW51ZUNvbW1vblRpbWVyKTtcbiAgICAgICAgICAgICAgICB0aGlzLlRpbWVyLnN0YXJ0KCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBmaWxsRmllbGRzKCkge1xuICAgICAgICAgICAgdGhpcy5xdWVzdGlvbiA9IFN0ZXBzW3RoaXMuc3RlcE51bWJlcl0ucXVlc3Rpb247XG4gICAgICAgICAgICB0aGlzLnRleHQuaW5uZXJUZXh0ID0gdGhpcy5xdWVzdGlvbjtcbiAgICAgICAgICAgIHRoaXMuYW5zd2VyID0gU3RlcHNbdGhpcy5zdGVwTnVtYmVyXS5hbnN3ZXI7XG5cbiAgICAgICAgICAgIHRoaXMuc3VjY2Vzc01lc3NhZ2VUZXh0LmlubmVyVGV4dCA9IFN0ZXBzW3RoaXMuc3RlcE51bWJlcl0uc3VjY2Vzc01lc3NhZ2U7XG4gICAgICAgICAgICB0aGlzLm5leHRRdWVzdEJ0bi5pbm5lclRleHQgPSBTdGVwc1t0aGlzLnN0ZXBOdW1iZXJdLm5leHRCdG5UZXh0O1xuXG4gICAgICAgICAgICB0aGlzLnRpbWVyT3ZlciA9IFN0ZXBzW3RoaXMuc3RlcE51bWJlcl0udGltZU92ZXI7XG4gICAgICAgICAgICB0aGlzLlRpbWVyID0gbmV3IFRpbWVyKHRoaXMudGltZXJPdmVyKTtcblxuICAgICAgICAgICAgdGhpcy5oaW50VGV4dCA9IFN0ZXBzW3RoaXMuc3RlcE51bWJlcl0uaGludDtcbiAgICAgICAgICAgIHRoaXMuSGludENvbXBvbmVudCA9IG5ldyBIaW50Q29tcG9uZW50KHRoaXMuaGludFRleHQpO1xuXG4gICAgICAgICAgICB0aGlzLmlucHV0LnZhbHVlID0gJyc7XG4gICAgICAgICAgICB0aGlzLmhpbnRCdG4uY2xhc3NMaXN0LnJlbW92ZSgnc2hvdycpO1xuICAgICAgICB9XG5cbiAgICAgICAgc2hvdygpIHtcbiAgICAgICAgICAgIHRoaXMuY29udGFpbmVyLmNsYXNzTGlzdC5hZGQoJ3Nob3cnKTtcbiAgICAgICAgICAgIHRoaXMuaW5wdXQuY2xhc3NMaXN0LmFkZCgnc2hvdycpO1xuICAgICAgICAgICAgdGhpcy5UaW1lci5zdGFydCgpO1xuICAgICAgICB9XG5cbiAgICAgICAgaGlkZSgpIHtcbiAgICAgICAgICAgIHRoaXMuY29udGFpbmVyLmNsYXNzTGlzdC5yZW1vdmUoJ3Nob3cnKTtcbiAgICAgICAgfVxuXG5cblxuICAgIH1cblxuICAgIC8vIFF1ZXN0IFRpbWVyXG4gICAgY2xhc3MgVGltZXIge1xuXG4gICAgICAgIGNvbnN0cnVjdG9yKHRpbWVPdmVyKSB7XG5cbiAgICAgICAgICAgIHRoaXMuYXBwID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2FwcCcpO1xuICAgICAgICAgICAgdGhpcy5jb250YWluZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndGltZXInKTtcbiAgICAgICAgICAgIHRoaXMuYXZhaWxhYmxlU2Vjb25kcyA9IHRpbWVPdmVyO1xuXG4gICAgICAgICAgICB0aGlzLnNob3dUaW1lclZhbHVlKCk7XG5cbiAgICAgICAgICAgIHRoaXMuc291bmRUaWNrID0gbmV3IFBsYXllcihTZXR1cC5zb3VuZHMudGljaywgdHJ1ZSk7XG4gICAgICAgICAgICB0aGlzLnNvdW5kQWxhcm0gPSBuZXcgUGxheWVyKFNldHVwLnNvdW5kcy5hbGFybSk7XG5cbiAgICAgICAgICAgIHRoaXMuZmFpbEV2ZW50ID0gbmV3IEV2ZW50KCdmYWlsVGltZXInKTtcblxuICAgICAgICAgICAgdGhpcy5zZWNvbmRzVG9EYW5nZXIgPSBTZXR1cC5zZWNvbmRzVG9EYW5nZXI7XG5cbiAgICAgICAgICAgIGxldCBzZWxmID0gdGhpcztcbiAgICAgICAgICAgIHRoaXMuYXBwLmFkZEV2ZW50TGlzdGVuZXIoJ3N0b3BUaWNrU291bmQnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgc2VsZi5zb3VuZFRpY2suc3RvcCgpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB0aGlzLmFwcC5hZGRFdmVudExpc3RlbmVyKCdzdG9wQWxhcm1Tb3VuZCcsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBzZWxmLnNvdW5kQWxhcm0uc3RvcCgpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgfVxuXG4gICAgICAgIHN0YXJ0KCkge1xuXG4gICAgICAgICAgICBsZXQgc2VsZiA9IHRoaXM7XG5cbiAgICAgICAgICAgIHRoaXMuY29udGFpbmVyLmNsYXNzTGlzdC5hZGQoJ2RhbmdlcicpO1xuXG4gICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBzZWxmLmNvbnRhaW5lci5jbGFzc0xpc3QucmVtb3ZlKCdkYW5nZXInKTtcbiAgICAgICAgICAgIH0sIDgwMCk7XG5cbiAgICAgICAgICAgIHRoaXMudGltZXIgPSBzZXRJbnRlcnZhbChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgc2VsZi5hdmFpbGFibGVTZWNvbmRzIC0tO1xuXG4gICAgICAgICAgICAgICAgc2VsZi5jaGVja0RhbmdlcigpO1xuICAgICAgICAgICAgICAgIHNlbGYuY2hlY2tUaW1lSXNPdmVyKCk7XG4gICAgICAgICAgICAgICAgc2VsZi5zaG93VGltZXJWYWx1ZSgpO1xuXG4gICAgICAgICAgICB9LCAxMDAwKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHN0b3AoKSB7XG4gICAgICAgICAgICBjbGVhckludGVydmFsKHRoaXMudGltZXIpO1xuICAgICAgICB9XG5cbiAgICAgICAgc2hvd1RpbWVyVmFsdWUoKSB7XG5cbiAgICAgICAgICAgIGxldCBtaW51dGVzID0gTWF0aC5mbG9vcih0aGlzLmF2YWlsYWJsZVNlY29uZHMgLyA2MCk7XG4gICAgICAgICAgICBsZXQgc2Vjb25kcyA9IHRoaXMuYXZhaWxhYmxlU2Vjb25kcyAlIDYwO1xuXG4gICAgICAgICAgICBpZiAobWludXRlcyA8IDEwKSB7XG4gICAgICAgICAgICAgICAgbWludXRlcyA9ICcwJyArIG1pbnV0ZXM7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChzZWNvbmRzIDwgMTApIHtcbiAgICAgICAgICAgICAgICBzZWNvbmRzID0gJzAnICsgc2Vjb25kcztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5jb250YWluZXIuaW5uZXJUZXh0ID0gbWludXRlcyArICc6JyArIHNlY29uZHM7XG5cbiAgICAgICAgfVxuXG4gICAgICAgIGNoZWNrRGFuZ2VyKCkge1xuICAgICAgICAgICAgaWYgKHRoaXMuYXZhaWxhYmxlU2Vjb25kcyA8IHRoaXMuc2Vjb25kc1RvRGFuZ2VyKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5jb250YWluZXIuY2xhc3NMaXN0LmFkZCgnZGFuZ2VyJyk7XG4gICAgICAgICAgICAgICAgaWYgKCF0aGlzLnNvdW5kVGljay5pc1BsYXlpbmcoKSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnNvdW5kVGljay5wbGF5KCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgY2hlY2tUaW1lSXNPdmVyKCkge1xuICAgICAgICAgICAgaWYgKHRoaXMuYXZhaWxhYmxlU2Vjb25kcyA8IDEpIHtcbiAgICAgICAgICAgICAgICBjbGVhckludGVydmFsKHRoaXMudGltZXIpO1xuICAgICAgICAgICAgICAgIHRoaXMuc291bmRBbGFybS5wbGF5KCk7XG4gICAgICAgICAgICAgICAgdGhpcy5zb3VuZFRpY2suc3RvcCgpO1xuICAgICAgICAgICAgICAgIHRoaXMuYXBwLmRpc3BhdGNoRXZlbnQodGhpcy5mYWlsRXZlbnQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICB9XG5cbiAgICAvLyBIaW50IENvbXBvbmVudFxuICAgIGNsYXNzIEhpbnRDb21wb25lbnQge1xuICAgICAgICBjb25zdHJ1Y3RvcihtZXNzYWdlKSB7XG4gICAgICAgICAgICB0aGlzLmNvbnRhaW5lciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdoaW50Jyk7XG4gICAgICAgICAgICB0aGlzLmhpbnRUZXh0ID0gdGhpcy5jb250YWluZXIucXVlcnlTZWxlY3RvcigncCNoaW50LXRleHQnKTtcbiAgICAgICAgICAgIHRoaXMuY2xvc2VCdG4gPSB0aGlzLmNvbnRhaW5lci5xdWVyeVNlbGVjdG9yKCdidXR0b24jY2xvc2UtaGludCcpO1xuXG4gICAgICAgICAgICB0aGlzLmhpbnRUZXh0LmlubmVyVGV4dCA9IG1lc3NhZ2U7XG5cbiAgICAgICAgICAgIHRoaXMuaW5pdCgpO1xuICAgICAgICB9XG5cbiAgICAgICAgaW5pdCgpIHtcbiAgICAgICAgICAgIGxldCBzZWxmID0gdGhpcztcbiAgICAgICAgICAgIHRoaXMuY2xvc2VCdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgc2VsZi5oaWRlKCk7XG4gICAgICAgICAgICB9KVxuICAgICAgICB9XG5cbiAgICAgICAgc2hvdygpIHtcbiAgICAgICAgICAgIHRoaXMuY29udGFpbmVyLmNsYXNzTGlzdC5hZGQoJ3Nob3cnKTtcbiAgICAgICAgfVxuICAgICAgICBoaWRlKCkge1xuICAgICAgICAgICAgdGhpcy5jb250YWluZXIuY2xhc3NMaXN0LnJlbW92ZSgnc2hvdycpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy8gUGxheWVyIENvbXBvbmVudFxuICAgIGNsYXNzIFBsYXllciB7XG5cbiAgICAgICAgY29uc3RydWN0b3IocGF0aFRvRmlsZSwgbG9vcCA9IGZhbHNlKSB7XG4gICAgICAgICAgICB0aGlzLnBsYXlCdG4gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncGxheScpO1xuICAgICAgICAgICAgdGhpcy5zdG9wQnRuID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3N0b3AnKTtcblxuXG4gICAgICAgICAgICB0aGlzLnNvdW5kID0gbmV3IEF1ZGlvKHBhdGhUb0ZpbGUpO1xuICAgICAgICAgICAgdGhpcy5zb3VuZC5sb29wID0gbG9vcDtcblxuICAgICAgICAgICAgdGhpcy5pbml0KCk7XG4gICAgICAgIH1cblxuICAgICAgICBpbml0KCkge1xuICAgICAgICAgICAgbGV0IHNlbGYgPSB0aGlzO1xuICAgICAgICAgICAgdGhpcy5wbGF5QnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHNlbGYucGxheSgpO1xuICAgICAgICAgICAgICAgIHNlbGYuc2hvd1N0b3BCdG4oKTtcbiAgICAgICAgICAgICAgICBzZWxmLmhpZGVQbGF5QnRuKCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHRoaXMuc3RvcEJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBzZWxmLnN0b3AoKVxuICAgICAgICAgICAgICAgIHNlbGYuc2hvd1BsYXlCdG4oKTtcbiAgICAgICAgICAgICAgICBzZWxmLmhpZGVTdG9wQnRuKCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHBsYXkoKSB7XG4gICAgICAgICAgICB0aGlzLnNvdW5kLnBsYXkoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHBhdXNlKCkge1xuICAgICAgICAgICAgdGhpcy5zb3VuZC5wYXVzZSgpO1xuICAgICAgICB9XG5cbiAgICAgICAgc3RvcCgpIHtcbiAgICAgICAgICAgIHRoaXMuc291bmQucGF1c2UoKTtcbiAgICAgICAgICAgIHRoaXMuc291bmQuY3VycmVudFRpbWUgPSAwO1xuICAgICAgICB9XG5cbiAgICAgICAgc2hvd1BsYXlCdG4oKSB7XG4gICAgICAgICAgICB0aGlzLnBsYXlCdG4uY2xhc3NMaXN0LmFkZCgnc2hvdycpO1xuICAgICAgICB9XG5cbiAgICAgICAgaGlkZVBsYXlCdG4oKSB7XG4gICAgICAgICAgICB0aGlzLnBsYXlCdG4uY2xhc3NMaXN0LnJlbW92ZSgnc2hvdycpO1xuICAgICAgICB9XG5cbiAgICAgICAgc2hvd1N0b3BCdG4oKSB7XG4gICAgICAgICAgICB0aGlzLnN0b3BCdG4uY2xhc3NMaXN0LmFkZCgnc2hvdycpO1xuICAgICAgICB9XG5cbiAgICAgICAgaGlkZVN0b3BCdG4oKSB7XG4gICAgICAgICAgICB0aGlzLnN0b3BCdG4uY2xhc3NMaXN0LnJlbW92ZSgnc2hvdycpO1xuICAgICAgICB9XG5cbiAgICAgICAgaXNQbGF5aW5nKG5hbWUpIHtcbiAgICAgICAgICAgIHJldHVybiAhdGhpcy5zb3VuZC5wYXVzZWQ7XG4gICAgICAgIH1cblxuICAgIH1cblxuXG5cblxuICAgIG5ldyBHYW1lKCk7XG5cbn0pOyJdfQ==
