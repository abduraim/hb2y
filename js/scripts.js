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
        debug: false,
        secondsToDanger: 10,
        sounds: {
            'dasha': '/assets/sounds/dasha.mp3',
            'applause': '/assets/sounds/applause.mp3',
            'fireworks': '/assets/sounds/fireworks.mp3',
            'alarm': '/assets/sounds/alarm.mp3',
            'tick': '/assets/sounds/tick.mp3',
        },
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
            this.hideLoading();

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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6InNjcmlwdHMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwiRE9NQ29udGVudExvYWRlZFwiLCBmdW5jdGlvbihldmVudCkge1xuXG5cblxuICAgIGNvbnN0IFN0ZXBzID0gW1xuICAgICAgICB7fSxcbiAgICAgICAge1xuICAgICAgICAgICAgcXVlc3Rpb246ICfQmNGC0LDQuiwg0YLQstC+0LUg0L/QtdGA0LLQvtC1INC30LDQtNCw0L3QuNC1LiDQmNGB0LrQsNGC0Ywg0LrQvtC90LLQtdGA0YIg0L3Rg9C20L3QviDRgtCw0LwsINCz0LTQtSDRgtGLINCz0L7RgtC+0LLQuNGI0Ywg0L7RgtC70LjRh9C90LXQudGI0YPRjiDQu9Cw0L/RiNGDLCDQvtC9INGA0Y/QtNC+0Lwg0YEg0LLQuNC70LrQvtC5INC4INC90L7QttC+0LwuJyxcbiAgICAgICAgICAgIGFuc3dlcjogJzI1OCcsXG4gICAgICAgICAgICBoaW50OiAn0JrQvtC90LLQtdGA0YIg0LIg0Y/RidC40LrQtSDRgdGC0L7Qu9CwLCDQvdCwINC60YPRhdC90LUnLFxuICAgICAgICAgICAgc3VjY2Vzc01lc3NhZ2U6ICfQlNCw0YjRg9C70YzQutCwLCDRgdC/0LDRgdC40LHQviDQt9CwINC+0YLQu9C40YfQvdGL0LUg0Lgg0LLQutGD0YHQvdGL0YUg0LHQu9GO0LTQsCwg0LrQvtGC0L7RgNGL0LUg0YLRiyDQtNC70Y8g0L3QsNGBINCz0L7RgtC+0LLQuNGI0YwhINCi0LLQvtC5INC/0L7QtNCw0YDQvtC6INCyINGB0YLQvtC70LUsINC+0YLQutGA0L7QuSDQtNCy0LXRgNGG0YsuJyxcbiAgICAgICAgICAgIHRpbWVPdmVyOiAyLFxuICAgICAgICAgICAgbmV4dEJ0blRleHQ6ICfQmiDRgdC70LXQtNGD0Y7RidC10LzRgyDQv9C+0LTQsNGA0LrRgyEnLFxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgICBxdWVzdGlvbjogJ9Ch0LvQtdC00YPRjtGJ0LjQuSDQutC+0L3QstC10YDRgiDQvdCw0YXQvtC00LjRgtGB0Y8g0YLQsNC8LCDQs9C00LUg0YLRiyDQv9C+0LTQtNC10YDQttC40LLQsNC10YjRjCDQttC40LfQvdGMINGC0LXQvCwg0LrQvtCz0L4g0LTQsNGA0Y/RgiDRgtCy0L7QuCDQutC70LjQtdC90YLRiyDQu9GO0LHQuNC80YvQvCDQu9GO0LTRj9C8LicsXG4gICAgICAgICAgICBhbnN3ZXI6ICc1NTUnLFxuICAgICAgICAgICAgaGludDogJ9Ct0YLQviDRhtCy0LXRgtGLLCDQutC+0YLQvtGA0YvQtSDRgtGLINCy0YvRgNCw0YnQuNCy0LDQtdGI0YwnLFxuICAgICAgICAgICAgc3VjY2Vzc01lc3NhZ2U6ICfQodC/0LDRgdC40LHQviDQt9CwINC60YDQsNGB0L7RgtGDLCDQutC+0YLQvtGA0YPRjiDRgtGLINC/0YDQuNC90L7RgdC40YjRjCDQsiDRjdGC0L7RgiDQvNC40YAsINC/0L7QtNCw0YDQvtC6INC40YnQuCDQsiDRiNC60LDRhNGDINCy0LDQvdC90L7QuSDQutC+0LzQvdCw0YLRiy4nLFxuICAgICAgICAgICAgdGltZU92ZXI6IDMwLFxuICAgICAgICAgICAgbmV4dEJ0blRleHQ6ICdOZXh0JyxcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgcXVlc3Rpb246ICfQn9C+0YLQvtGA0L7Qv9C40YHRjCDQuiDRgdC70LXQtNGD0Y7RidC10LzRgyDQutC+0L3QstC10YDRgtGDLCDQvtC9INC90LDRhdC+0LTQuNGC0YHRjyDRgyDRhdC+0YDQvtGI0LXQs9C+INC60YPRh9C10YDRj9Cy0L7Qs9C+INGH0LXQu9C+0LLQtdC60LAsINC20LjQstGD0YnQtdCz0L4g0L/QviDRgdC+0YHQtdC00YHRgtCy0YMuINCi0LLQvtC5INC/0LDRgNC+0LvRjCAtIFwi0KXQvtGH0YMg0YXQsNC70LLRgyDQtdC8LCDRhdC+0YfRgyDQv9GA0Y/QvdC40LrQuFwiJyxcbiAgICAgICAgICAgIGFuc3dlcjogJzMzMycsXG4gICAgICAgICAgICBoaW50OiAn0K3RgtC+INCY0YDQuNC90LAnLFxuICAgICAgICAgICAgc3VjY2Vzc01lc3NhZ2U6ICfQodC/0LDRgdC40LHQviDQt9CwINGC0LLQvtC1INC+0LHRidC10L3QuNC1LCDQt9CwINC90L7QstC+0YHRgtC4INC4INC40LTQtdC4LCDQutC+0YLQvtGA0YvQvNC4INGC0Ysg0LTQtdC70LjRiNGM0YHRjyEg0J/QvtC00LDRgNC+0Log0LIg0YjQutCw0YTRgyAo0LIg0L7QsdGJ0LXQvCDQutC+0YDQuNC00L7RgNC1KScsXG4gICAgICAgICAgICB0aW1lT3ZlcjogMTUsXG4gICAgICAgICAgICBuZXh0QnRuVGV4dDogJ05leHQnLFxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgICBxdWVzdGlvbjogJ9Ch0LvQtdC00YPRjtGJ0LjQuSDQutC+0L3QstC10YDRgiDRgtGLINC90LDQudC00LXRiNGMINGC0LDQvCwg0LrRg9C00LAg0L/QvtC/0LDQtNCw0Y7RgiDRgtCy0L7QuCDQvdC+0YHQvtGH0LrQuCDQv9C+0YHQu9C1INGB0YLQuNGA0LrQuC4nLFxuICAgICAgICAgICAgYW5zd2VyOiAnMTU3JyxcbiAgICAgICAgICAgIGhpbnQ6ICfQn9C+0YHQu9C1INGC0L7Qs9C+LCDQutCw0Log0L7QvdC4INCy0YvRgdC+0YXQu9C4JyxcbiAgICAgICAgICAgIHN1Y2Nlc3NNZXNzYWdlOiAn0KHQv9Cw0YHQuNCx0L4g0LfQsCDRh9C40YHRgtC+0YLRgyDQuCDQv9C+0YDRj9C00L7Quiwg0LrQvtGC0L7RgNGL0LUg0YLRiyDQtNC70Y8g0L3QsNGBINC/0L7QtNC00LXRgNC20LjQstCw0LXRiNGMISDQotCy0L7QuSDRgdC70LXQtNGD0Y7RidC40Lkg0L/QvtC00LDRgNC+0Log0LIg0LDQvdGC0YDQtdGB0L7Qu9C4IScsXG4gICAgICAgICAgICB0aW1lT3ZlcjogMTUsXG4gICAgICAgICAgICBuZXh0QnRuVGV4dDogJ05leHQnLFxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgICBxdWVzdGlvbjogJ9CY0YLQsNC6LCDQv9C+0YHQu9C10LTQvdC10LUg0LfQsNC00LDQvdC40LUuINCe0YLQstC10YIg0L/RgNGP0YfQtdGC0YHRjyDQsiDQvNC10YjQutC1INC90LDQsdC40YLQvtC8INCz0YPRgdC40L3Ri9C80Lgg0LLQvtC70L7RgdCw0LzQuC4nLFxuICAgICAgICAgICAgYW5zd2VyOiAnMzY5JyxcbiAgICAgICAgICAgIGhpbnQ6ICfQrdGC0L4g0L/QvtC00YPRiNC60LAnLFxuICAgICAgICAgICAgc3VjY2Vzc01lc3NhZ2U6ICfQodC/0LDRgdC40LHQviDQt9CwINC70Y7QsdC+0LLRjCDQuCDQu9Cw0YHQutGDLCDQutC+0YLQvtGA0YvQvNC4INGC0Ysg0L3QsNGBINGB0L7Qs9GA0LXQstCw0LXRiNGMISDQotCy0L7QuSDQv9C+0LTQsNGA0L7QuiDQv9C+0LQg0LzQsNGC0YDQsNGB0L7QvC4nLFxuICAgICAgICAgICAgdGltZU92ZXI6IDE1LFxuICAgICAgICAgICAgbmV4dEJ0blRleHQ6ICdOZXh0JyxcbiAgICAgICAgfSxcbiAgICBdO1xuICAgIGNvbnN0IFNldHVwID0ge1xuICAgICAgICBkZWJ1ZzogZmFsc2UsXG4gICAgICAgIHNlY29uZHNUb0RhbmdlcjogMTAsXG4gICAgICAgIHNvdW5kczoge1xuICAgICAgICAgICAgJ2Rhc2hhJzogJy9hc3NldHMvc291bmRzL2Rhc2hhLm1wMycsXG4gICAgICAgICAgICAnYXBwbGF1c2UnOiAnL2Fzc2V0cy9zb3VuZHMvYXBwbGF1c2UubXAzJyxcbiAgICAgICAgICAgICdmaXJld29ya3MnOiAnL2Fzc2V0cy9zb3VuZHMvZmlyZXdvcmtzLm1wMycsXG4gICAgICAgICAgICAnYWxhcm0nOiAnL2Fzc2V0cy9zb3VuZHMvYWxhcm0ubXAzJyxcbiAgICAgICAgICAgICd0aWNrJzogJy9hc3NldHMvc291bmRzL3RpY2subXAzJyxcbiAgICAgICAgfSxcbiAgICAgICAgd2VsY29tZU1lc3NhZ2U6IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBtZXNzYWdlOiAn0J/RgNC40LLQtdGCLCDQlNCw0YjRg9C70YzQutCwISDQodC10LPQvtC00L3RjyDRgtCy0L7QuSDQtNC10L3RjCDRgNC+0LbQtNC10L3QuNGPLCDQsCDQsiDQtNC10L3RjCDRgNC+0LbQtNC10L3QuNGPINC/0YDQuNC90Y/RgtC+INC/0L7Qu9GD0YfQsNGC0Ywg0L/QvtC00LDRgNC60LguJyxcbiAgICAgICAgICAgICAgICBidG5UZXh0OiAn0K7QrtCuJyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgbWVzc2FnZTogJ9CU0L7QsdGA0L4g0L/QvtC20LDQu9C+0LLQsNGC0Ywg0LIg0L/RgNC40LrQu9GO0YfQtdC90LjQtSwg0JTQsNGI0LAt0L/Rg9GC0LXRiNC10YHRgtCy0LXQvdC90LjRhtCwISDQndCwINGC0LLQvtGR0Lwg0L/Rg9GC0Lgg0LHRg9C00YPRgiDQt9Cw0LTQsNC90LjRjyDQvdCwINC/0L7QuNGB0Log0LrQvtC90LLQtdGA0YLQvtCyLiDQkiDQutC+0L3QstC10YDRgtCw0YUg0LHRg9C00LXRgiDRh9C40YHQu9C+LCDQutC+0YLQvtGA0L7QtSDRgtC10LHQtSDQvdGD0LbQvdC+INCy0LLQtdGB0YLQuC4g0J/QvtGB0LvQtSDRjdGC0L7Qs9C+INGC0Ysg0YPQt9C90LDQtdGI0YwsINCz0LTQtSDQt9Cw0LHRgNCw0YLRjCDQv9C+0LTQsNGA0L7Qui4g0J/QvtC10YXQsNC70Lg/JyxcbiAgICAgICAgICAgICAgICBidG5UZXh0OiAnVlZWJyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgfTtcblxuXG5cbiAgICAvLyBNYWluIENvbXBvbmVudFxuICAgIGNsYXNzIEdhbWUge1xuXG4gICAgICAgIGNvbnN0cnVjdG9yKCkge1xuXG4gICAgICAgICAgICB0aGlzLmFwcCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdhcHAnKTtcblxuICAgICAgICAgICAgLy8gU2NyZWVuc1xuICAgICAgICAgICAgdGhpcy5sb2FkaW5nU2NyZWVuID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2xvYWRpbmcnKTtcbiAgICAgICAgICAgIHRoaXMucHlyb1NjcmVlbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdweXJvJyk7XG4gICAgICAgICAgICB0aGlzLmdhbWVPdmVyU2NyZWVuID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2dhbWUtb3ZlcicpO1xuXG5cbiAgICAgICAgICAgIC8vIENvbXBvbmVudHNcbiAgICAgICAgICAgIHRoaXMuRnVsbHNjcmVlbkNvbXBvbmVudCA9IG5ldyBGdWxsc2NyZWVuQ29tcG9uZW50KCk7XG4gICAgICAgICAgICB0aGlzLldlbGNvbWVDb21wb25lbnQgPSBuZXcgV2VsY29tZSgpO1xuICAgICAgICAgICAgdGhpcy5Db21tb25UaW1lckNvbXBvbmVudCA9IG5ldyBDb21tb25UaW1lckNvbXBvbmVudCgpO1xuICAgICAgICAgICAgdGhpcy5RdWVzdENvbXBvbmVudCA9IG5ldyBRdWVzdENvbXBvbmVudCgpO1xuXG5cbiAgICAgICAgICAgIC8vIEJpbmQgRXZlbnRzXG4gICAgICAgICAgICB0aGlzLmluaXRFdmVudHMoKTtcblxuICAgICAgICAgICAgLy8gSGlkZSBsb2FkaW5nIGJlZm9yZSBsb2FkaW5nXG4gICAgICAgICAgICB0aGlzLmhpZGVMb2FkaW5nKCk7XG5cbiAgICAgICAgfVxuXG4gICAgICAgIC8vIEJpbmcgRXZlbnRzXG4gICAgICAgIGluaXRFdmVudHMoKSB7XG5cbiAgICAgICAgICAgIGxldCBzZWxmID0gdGhpcztcblxuICAgICAgICAgICAgLy8gRnVsbHNjcmVlbiBEb25lXG4gICAgICAgICAgICB0aGlzLmFwcC5hZGRFdmVudExpc3RlbmVyKCdmdWxsc2NyZWVuRG9uZScsIGZ1bmN0aW9uICgpIHtcblxuICAgICAgICAgICAgICAgIHNlbGYuV2VsY29tZUNvbXBvbmVudC5zaG93KCk7XG5cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICB0aGlzLmFwcC5hZGRFdmVudExpc3RlbmVyKCd3ZWxjb21lRG9uZScsIGZ1bmN0aW9uICgpIHtcblxuICAgICAgICAgICAgICAgIHNlbGYuV2VsY29tZUNvbXBvbmVudC5oaWRlKCk7XG4gICAgICAgICAgICAgICAgc2VsZi5RdWVzdENvbXBvbmVudC5zaG93KCk7XG4gICAgICAgICAgICAgICAgc2VsZi5Db21tb25UaW1lckNvbXBvbmVudC5zdGFydCgpO1xuXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgLy8gUXVlc3QgRG9uZVxuICAgICAgICAgICAgdGhpcy5hcHAuYWRkRXZlbnRMaXN0ZW5lcignZXZlbnRRdWVzdFN1Y2Nlc3MnLCBmdW5jdGlvbiAoKSB7XG5cbiAgICAgICAgICAgICAgICBzZWxmLkNvbW1vblRpbWVyQ29tcG9uZW50LnN0b3AoKTtcbiAgICAgICAgICAgICAgICBzZWxmLlF1ZXN0Q29tcG9uZW50LmhpZGUoKTtcbiAgICAgICAgICAgICAgICBzZWxmLmdhbWVPdmVyU2NyZWVuLmNsYXNzTGlzdC5hZGQoJ3Nob3cnKTtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnR2FtZSBPdmVyISEhJyk7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coc2VsZi5Db21tb25UaW1lckNvbXBvbmVudC5nZXRDb21tb25UaW1lKCkpO1xuXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgLy8gUGF1c2UgQ29tbW9uIFRpbWVyXG4gICAgICAgICAgICB0aGlzLmFwcC5hZGRFdmVudExpc3RlbmVyKCdwYXVzZVRpbWVyJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHNlbGYuQ29tbW9uVGltZXJDb21wb25lbnQucGF1c2UoKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAvLyBDb250aW51ZSBDb21tb24gVGltZXJcbiAgICAgICAgICAgIHRoaXMuYXBwLmFkZEV2ZW50TGlzdGVuZXIoJ2NvbnRpbnVlVGltZXInLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgc2VsZi5Db21tb25UaW1lckNvbXBvbmVudC5jb250aW51ZSgpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgfVxuXG4gICAgICAgIC8vTG9hZGluZ1xuICAgICAgICBoaWRlTG9hZGluZygpIHtcbiAgICAgICAgICAgIHRoaXMubG9hZGluZ1NjcmVlbi5jbGFzc0xpc3QucmVtb3ZlKCdzaG93Jyk7XG4gICAgICAgIH1cblxuICAgIH1cblxuICAgIC8vIEZ1bGxzY3JlZW4gQ2xhc3NcbiAgICBjbGFzcyBGdWxsc2NyZWVuQ29tcG9uZW50IHtcblxuICAgICAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgICAgIHRoaXMuYXBwID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2FwcCcpO1xuICAgICAgICAgICAgdGhpcy5jb250YWluZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZnVsbHNjcmVlbicpO1xuICAgICAgICAgICAgdGhpcy5jb250YWluZXIuY2xhc3NMaXN0LmFkZCgnc2hvdycpO1xuICAgICAgICAgICAgdGhpcy5idG4gPSB0aGlzLmNvbnRhaW5lci5xdWVyeVNlbGVjdG9yKCdidXR0b24nKTtcbiAgICAgICAgICAgIHRoaXMuZnVsbHNjcmVlbkRvbmUgPSBuZXcgRXZlbnQoJ2Z1bGxzY3JlZW5Eb25lJyk7XG4gICAgICAgICAgICBsZXQgc2VsZiA9IHRoaXM7XG4gICAgICAgICAgICB0aGlzLmJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBpZiAoIVNldHVwLmRlYnVnKSB7XG4gICAgICAgICAgICAgICAgICAgIHNlbGYubGF1bmNoRnVsbFNjcmVlbihkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBzZWxmLmJ0bi5jbGFzc0xpc3QuYWRkKCdzb2Z0X2hpZGUnKTtcbiAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5jb250YWluZXIuY2xhc3NMaXN0LnJlbW92ZSgnc2hvdycpO1xuICAgICAgICAgICAgICAgICAgICBzZWxmLmFwcC5kaXNwYXRjaEV2ZW50KHNlbGYuZnVsbHNjcmVlbkRvbmUpO1xuICAgICAgICAgICAgICAgIH0sIDEwMDApO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgfVxuXG4gICAgICAgIGxhdW5jaEZ1bGxTY3JlZW4oZWxlbWVudCkge1xuICAgICAgICAgICAgaWYoZWxlbWVudC5yZXF1ZXN0RnVsbFNjcmVlbikge1xuICAgICAgICAgICAgICAgIGVsZW1lbnQucmVxdWVzdEZ1bGxTY3JlZW4oKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZihlbGVtZW50Lm1velJlcXVlc3RGdWxsU2NyZWVuKSB7XG4gICAgICAgICAgICAgICAgZWxlbWVudC5tb3pSZXF1ZXN0RnVsbFNjcmVlbigpO1xuICAgICAgICAgICAgfSBlbHNlIGlmKGVsZW1lbnQud2Via2l0UmVxdWVzdEZ1bGxTY3JlZW4pIHtcbiAgICAgICAgICAgICAgICBlbGVtZW50LndlYmtpdFJlcXVlc3RGdWxsU2NyZWVuKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBjYW5jZWxGdWxsc2NyZWVuKCkge1xuICAgICAgICAgICAgaWYoZG9jdW1lbnQuY2FuY2VsRnVsbFNjcmVlbikge1xuICAgICAgICAgICAgICAgIGRvY3VtZW50LmNhbmNlbEZ1bGxTY3JlZW4oKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZihkb2N1bWVudC5tb3pDYW5jZWxGdWxsU2NyZWVuKSB7XG4gICAgICAgICAgICAgICAgZG9jdW1lbnQubW96Q2FuY2VsRnVsbFNjcmVlbigpO1xuICAgICAgICAgICAgfSBlbHNlIGlmKGRvY3VtZW50LndlYmtpdENhbmNlbEZ1bGxTY3JlZW4pIHtcbiAgICAgICAgICAgICAgICBkb2N1bWVudC53ZWJraXRDYW5jZWxGdWxsU2NyZWVuKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgIH1cblxuICAgIC8vIFdlbGNvbWUgTWVzc2FnZXNcbiAgICBjbGFzcyBXZWxjb21lIHtcblxuICAgICAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgICAgIHRoaXMuYXBwID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2FwcCcpO1xuICAgICAgICAgICAgdGhpcy5jb250YWluZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnd2VsY29tZScpO1xuICAgICAgICAgICAgdGhpcy5hcHBlYXJ0aW5CbG9jayA9IHRoaXMuY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoJyN3ZWxjb21lLXRleHQnKTtcbiAgICAgICAgICAgIHRoaXMudGV4dCA9IHRoaXMuY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoJyN3ZWxjb21lLXRleHQgPiBwJyk7XG4gICAgICAgICAgICB0aGlzLm5leHRCdG4gPSB0aGlzLmNvbnRhaW5lci5xdWVyeVNlbGVjdG9yKCdidXR0b24jd2VsY29tZS1uZXh0LWJ0bicpO1xuICAgICAgICAgICAgdGhpcy5ldmVudERvbmUgPSBuZXcgRXZlbnQoJ3dlbGNvbWVEb25lJyk7XG4gICAgICAgICAgICB0aGlzLm11c2ljRGFzaGEgPSBuZXcgUGxheWVyKFNldHVwLnNvdW5kcy5kYXNoYSk7XG4gICAgICAgICAgICB0aGlzLmluaXQoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGluaXQoKSB7XG5cbiAgICAgICAgICAgIHRoaXMuY3VycmVudE1lc3NhZ2UgPSAwO1xuXG4gICAgICAgICAgICB0aGlzLmZpbGxGaWVsZHMoKTtcblxuICAgICAgICAgICAgbGV0IHNlbGYgPSB0aGlzO1xuICAgICAgICAgICAgdGhpcy5uZXh0QnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHNlbGYubmV4dE1lc3NhZ2UoKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgZmlsbEZpZWxkcygpIHtcbiAgICAgICAgICAgIHRoaXMudGV4dC5pbm5lclRleHQgPSBTZXR1cC53ZWxjb21lTWVzc2FnZVt0aGlzLmN1cnJlbnRNZXNzYWdlXS5tZXNzYWdlO1xuICAgICAgICAgICAgdGhpcy5uZXh0QnRuLmlubmVyVGV4dCA9IFNldHVwLndlbGNvbWVNZXNzYWdlW3RoaXMuY3VycmVudE1lc3NhZ2VdLmJ0blRleHQ7XG4gICAgICAgIH1cblxuICAgICAgICBuZXh0TWVzc2FnZSgpIHtcbiAgICAgICAgICAgIHRoaXMuY3VycmVudE1lc3NhZ2UrKztcbiAgICAgICAgICAgIGlmICh0aGlzLmN1cnJlbnRNZXNzYWdlID49IFNldHVwLndlbGNvbWVNZXNzYWdlLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgIHRoaXMubXVzaWNEYXNoYS5zdG9wKCk7XG4gICAgICAgICAgICAgICAgdGhpcy5hcHAuZGlzcGF0Y2hFdmVudCh0aGlzLmV2ZW50RG9uZSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLmN1cnJlbnRNZXNzYWdlID09IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFTZXR1cC5kZWJ1Zykge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5tdXNpY0Rhc2hhLnBsYXkoKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0aGlzLmZpbGxGaWVsZHMoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHNob3coKSB7XG4gICAgICAgICAgICB0aGlzLmNvbnRhaW5lci5jbGFzc0xpc3QuYWRkKCdzaG93Jyk7XG4gICAgICAgICAgICB0aGlzLmFwcGVhcnRpbkJsb2NrLmNsYXNzTGlzdC5hZGQoJ3Nob3cnKTtcbiAgICAgICAgICAgIHRoaXMubmV4dEJ0bi5jbGFzc0xpc3QuYWRkKCdzaG93Jyk7XG4gICAgICAgIH1cblxuICAgICAgICBoaWRlKCkge1xuICAgICAgICAgICAgdGhpcy5jb250YWluZXIuY2xhc3NMaXN0LnJlbW92ZSgnc2hvdycpO1xuICAgICAgICB9XG5cbiAgICB9XG5cbiAgICAvLyBDb21tb25UaW1lIENsYXNzXG4gICAgY2xhc3MgQ29tbW9uVGltZXJDb21wb25lbnQge1xuXG4gICAgICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICAgICAgdGhpcy5jdXJyZW50U2Vjb25kcyA9IDA7XG4gICAgICAgICAgICB0aGlzLmlzUGF1c2VkID0gZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgICBzdGFydCgpIHtcbiAgICAgICAgICAgIGxldCBzZWxmID0gdGhpcztcbiAgICAgICAgICAgIHRoaXMudGltZXIgPSBzZXRJbnRlcnZhbChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgaWYgKCFzZWxmLmlzUGF1c2VkKSB7XG4gICAgICAgICAgICAgICAgICAgIHNlbGYuY3VycmVudFNlY29uZHMgKys7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSwgMTAwMCk7XG4gICAgICAgIH1cblxuICAgICAgICBwYXVzZSgpIHtcbiAgICAgICAgICAgIHRoaXMuaXNQYXVzZWQgPSB0cnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgY29udGludWUoKSB7XG4gICAgICAgICAgICB0aGlzLmlzUGF1c2VkID0gZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgICBzdG9wKCkge1xuICAgICAgICAgICAgY2xlYXJJbnRlcnZhbCh0aGlzLnRpbWVyKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGdldENvbW1vblRpbWUoKSB7XG5cbiAgICAgICAgICAgIGxldCBtaW51dGVzID0gTWF0aC5mbG9vcih0aGlzLmN1cnJlbnRTZWNvbmRzIC8gNjApO1xuICAgICAgICAgICAgbGV0IHNlY29uZHMgPSB0aGlzLmN1cnJlbnRTZWNvbmRzICUgNjA7XG5cbiAgICAgICAgICAgIGlmIChtaW51dGVzIDwgMTApIHtcbiAgICAgICAgICAgICAgICBtaW51dGVzID0gJzAnICsgbWludXRlcztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHNlY29uZHMgPCAxMCkge1xuICAgICAgICAgICAgICAgIHNlY29uZHMgPSAnMCcgKyBzZWNvbmRzO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gbWludXRlcyArICc6JyArIHNlY29uZHM7O1xuICAgICAgICB9XG5cbiAgICB9XG5cbiAgICAvLyBRZXN0U3RlcCBDbGFzc1xuICAgIGNsYXNzIFF1ZXN0Q29tcG9uZW50IHtcblxuICAgICAgICBjb25zdHJ1Y3RvcigpIHtcblxuICAgICAgICAgICAgdGhpcy5hcHAgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYXBwJyk7XG4gICAgICAgICAgICB0aGlzLmNvbnRhaW5lciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdxdWVzdCcpO1xuXG4gICAgICAgICAgICB0aGlzLnRleHQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndGV4dCcpO1xuICAgICAgICAgICAgdGhpcy5pbnB1dCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdhbnN3ZXItaW5wdXQnKTtcblxuICAgICAgICAgICAgdGhpcy5zdWNjZXNzTWVzc2FnZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzdWNjZXNzLW1lc3NhZ2UnKTtcbiAgICAgICAgICAgIHRoaXMuc3VjY2Vzc01lc3NhZ2VUZXh0ID0gdGhpcy5zdWNjZXNzTWVzc2FnZS5xdWVyeVNlbGVjdG9yKCdwI3RleHQtc3VjY2Vzcy1tZXNzYWdlJyk7XG4gICAgICAgICAgICB0aGlzLm5leHRRdWVzdEJ0biA9IHRoaXMuc3VjY2Vzc01lc3NhZ2UucXVlcnlTZWxlY3RvcignYnV0dG9uI25leHQtcXVlc3QtYnRuJyk7XG5cbiAgICAgICAgICAgIHRoaXMuaGludEJ0biA9IHRoaXMuY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoJ2J1dHRvbiNoaW50LWJ0bicpO1xuXG4gICAgICAgICAgICB0aGlzLnN1Y2Nlc0V2ZW50ID0gbmV3IEV2ZW50KCdldmVudFF1ZXN0U3VjY2VzcycpO1xuICAgICAgICAgICAgdGhpcy5wYXVzZUNvbW1vblRpbWVyID0gbmV3IEV2ZW50KCdwYXVzZVRpbWVyJyk7XG4gICAgICAgICAgICB0aGlzLmNvbnRpbnVlQ29tbW9uVGltZXIgPSBuZXcgRXZlbnQoJ2NvbnRpbnVlVGltZXInKTtcbiAgICAgICAgICAgIHRoaXMuc3RvcFRpY2tTb3VuZCA9IG5ldyBFdmVudCgnc3RvcFRpY2tTb3VuZCcpO1xuICAgICAgICAgICAgdGhpcy5zdG9wQWxhcm1Tb3VuZCA9IG5ldyBFdmVudCgnc3RvcEFsYXJtU291bmQnKTtcblxuICAgICAgICAgICAgdGhpcy5zb3VuZEFwcGxhdXNlID0gbmV3IFBsYXllcihTZXR1cC5zb3VuZHMuYXBwbGF1c2UpO1xuICAgICAgICAgICAgdGhpcy5zb3VuZEZpcmV3b3JrcyA9IG5ldyBQbGF5ZXIoU2V0dXAuc291bmRzLmZpcmV3b3Jrcyk7XG5cbiAgICAgICAgICAgIHRoaXMuaW5pdCgpO1xuXG4gICAgICAgIH1cblxuICAgICAgICBpbml0KCkge1xuXG4gICAgICAgICAgICB0aGlzLnN0ZXBOdW1iZXIgPSAxO1xuXG4gICAgICAgICAgICB0aGlzLmZpbGxGaWVsZHMoKTtcblxuICAgICAgICAgICAgbGV0IHNlbGYgPSB0aGlzO1xuXG4gICAgICAgICAgICB0aGlzLmlucHV0LnNldEF0dHJpYnV0ZSgnbWF4bGVuZ3RoJywgdGhpcy5hbnN3ZXIubGVuZ3RoKTtcblxuICAgICAgICAgICAgdGhpcy5pbnB1dC5hZGRFdmVudExpc3RlbmVyKCdpbnB1dCcsIGZ1bmN0aW9uICgpIHtcblxuICAgICAgICAgICAgICAgIGlmICh0aGlzLnZhbHVlLmxlbmd0aCA9PSBzZWxmLmFuc3dlci5sZW5ndGgpIHtcblxuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy52YWx1ZSA9PSBzZWxmLmFuc3dlcikge1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxmLnJpZ2h0QW5zd2VyKCk7XG5cbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcblxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ3dyb25nLi4uJyk7XG5cbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgdGhpcy5oaW50QnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHNlbGYuSGludENvbXBvbmVudC5zaG93KCk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgdGhpcy5uZXh0UXVlc3RCdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbiAoKSB7XG5cbiAgICAgICAgICAgICAgICBzZWxmLnN1Y2Nlc3NNZXNzYWdlLmNsYXNzTGlzdC5yZW1vdmUoJ3Nob3cnKTtcblxuICAgICAgICAgICAgICAgIHNlbGYubmV4dFN0ZXAoKTtcblxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHRoaXMuYXBwLmFkZEV2ZW50TGlzdGVuZXIoJ2ZhaWxUaW1lcicsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBzZWxmLmhpbnRCdG4uY2xhc3NMaXN0LmFkZCgnc2hvdycpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgfVxuXG4gICAgICAgIHJpZ2h0QW5zd2VyKCkge1xuXG4gICAgICAgICAgICB0aGlzLlRpbWVyLnN0b3AoKTtcblxuICAgICAgICAgICAgdGhpcy5hcHAuZGlzcGF0Y2hFdmVudCh0aGlzLnBhdXNlQ29tbW9uVGltZXIpO1xuXG4gICAgICAgICAgICB0aGlzLnN1Y2Nlc3NNZXNzYWdlLmNsYXNzTGlzdC5hZGQoJ3Nob3cnKTtcbiAgICAgICAgICAgIHRoaXMuc3VjY2Vzc01lc3NhZ2VUZXh0LmZvY3VzKCk7XG5cbiAgICAgICAgICAgIHRoaXMuc291bmRBcHBsYXVzZS5wbGF5KCk7XG4gICAgICAgICAgICB0aGlzLnNvdW5kRmlyZXdvcmtzLnBsYXkoKTtcblxuICAgICAgICAgICAgdGhpcy5hcHAuZGlzcGF0Y2hFdmVudCh0aGlzLnN0b3BUaWNrU291bmQpO1xuICAgICAgICAgICAgdGhpcy5hcHAuZGlzcGF0Y2hFdmVudCh0aGlzLnN0b3BBbGFybVNvdW5kKTtcblxuICAgICAgICB9XG5cbiAgICAgICAgbmV4dFN0ZXAoKSB7XG4gICAgICAgICAgICB0aGlzLnN0ZXBOdW1iZXIrKztcbiAgICAgICAgICAgIGlmICh0aGlzLnN0ZXBOdW1iZXIgPj0gU3RlcHMubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5hcHAuZGlzcGF0Y2hFdmVudCh0aGlzLnN1Y2Nlc0V2ZW50KTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5maWxsRmllbGRzKCk7XG4gICAgICAgICAgICAgICAgdGhpcy5hcHAuZGlzcGF0Y2hFdmVudCh0aGlzLmNvbnRpbnVlQ29tbW9uVGltZXIpO1xuICAgICAgICAgICAgICAgIHRoaXMuVGltZXIuc3RhcnQoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGZpbGxGaWVsZHMoKSB7XG4gICAgICAgICAgICB0aGlzLnF1ZXN0aW9uID0gU3RlcHNbdGhpcy5zdGVwTnVtYmVyXS5xdWVzdGlvbjtcbiAgICAgICAgICAgIHRoaXMudGV4dC5pbm5lclRleHQgPSB0aGlzLnF1ZXN0aW9uO1xuICAgICAgICAgICAgdGhpcy5hbnN3ZXIgPSBTdGVwc1t0aGlzLnN0ZXBOdW1iZXJdLmFuc3dlcjtcblxuICAgICAgICAgICAgdGhpcy5zdWNjZXNzTWVzc2FnZVRleHQuaW5uZXJUZXh0ID0gU3RlcHNbdGhpcy5zdGVwTnVtYmVyXS5zdWNjZXNzTWVzc2FnZTtcbiAgICAgICAgICAgIHRoaXMubmV4dFF1ZXN0QnRuLmlubmVyVGV4dCA9IFN0ZXBzW3RoaXMuc3RlcE51bWJlcl0ubmV4dEJ0blRleHQ7XG5cbiAgICAgICAgICAgIHRoaXMudGltZXJPdmVyID0gU3RlcHNbdGhpcy5zdGVwTnVtYmVyXS50aW1lT3ZlcjtcbiAgICAgICAgICAgIHRoaXMuVGltZXIgPSBuZXcgVGltZXIodGhpcy50aW1lck92ZXIpO1xuXG4gICAgICAgICAgICB0aGlzLmhpbnRUZXh0ID0gU3RlcHNbdGhpcy5zdGVwTnVtYmVyXS5oaW50O1xuICAgICAgICAgICAgdGhpcy5IaW50Q29tcG9uZW50ID0gbmV3IEhpbnRDb21wb25lbnQodGhpcy5oaW50VGV4dCk7XG5cbiAgICAgICAgICAgIHRoaXMuaW5wdXQudmFsdWUgPSAnJztcbiAgICAgICAgICAgIHRoaXMuaGludEJ0bi5jbGFzc0xpc3QucmVtb3ZlKCdzaG93Jyk7XG4gICAgICAgIH1cblxuICAgICAgICBzaG93KCkge1xuICAgICAgICAgICAgdGhpcy5jb250YWluZXIuY2xhc3NMaXN0LmFkZCgnc2hvdycpO1xuICAgICAgICAgICAgdGhpcy5pbnB1dC5jbGFzc0xpc3QuYWRkKCdzaG93Jyk7XG4gICAgICAgICAgICB0aGlzLlRpbWVyLnN0YXJ0KCk7XG4gICAgICAgIH1cblxuICAgICAgICBoaWRlKCkge1xuICAgICAgICAgICAgdGhpcy5jb250YWluZXIuY2xhc3NMaXN0LnJlbW92ZSgnc2hvdycpO1xuICAgICAgICB9XG5cblxuXG4gICAgfVxuXG4gICAgLy8gUXVlc3QgVGltZXJcbiAgICBjbGFzcyBUaW1lciB7XG5cbiAgICAgICAgY29uc3RydWN0b3IodGltZU92ZXIpIHtcblxuICAgICAgICAgICAgdGhpcy5hcHAgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYXBwJyk7XG4gICAgICAgICAgICB0aGlzLmNvbnRhaW5lciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd0aW1lcicpO1xuICAgICAgICAgICAgdGhpcy5hdmFpbGFibGVTZWNvbmRzID0gdGltZU92ZXI7XG5cbiAgICAgICAgICAgIHRoaXMuc2hvd1RpbWVyVmFsdWUoKTtcblxuICAgICAgICAgICAgdGhpcy5zb3VuZFRpY2sgPSBuZXcgUGxheWVyKFNldHVwLnNvdW5kcy50aWNrLCB0cnVlKTtcbiAgICAgICAgICAgIHRoaXMuc291bmRBbGFybSA9IG5ldyBQbGF5ZXIoU2V0dXAuc291bmRzLmFsYXJtKTtcblxuICAgICAgICAgICAgdGhpcy5mYWlsRXZlbnQgPSBuZXcgRXZlbnQoJ2ZhaWxUaW1lcicpO1xuXG4gICAgICAgICAgICB0aGlzLnNlY29uZHNUb0RhbmdlciA9IFNldHVwLnNlY29uZHNUb0RhbmdlcjtcblxuICAgICAgICAgICAgbGV0IHNlbGYgPSB0aGlzO1xuICAgICAgICAgICAgdGhpcy5hcHAuYWRkRXZlbnRMaXN0ZW5lcignc3RvcFRpY2tTb3VuZCcsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBzZWxmLnNvdW5kVGljay5zdG9wKCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHRoaXMuYXBwLmFkZEV2ZW50TGlzdGVuZXIoJ3N0b3BBbGFybVNvdW5kJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHNlbGYuc291bmRBbGFybS5zdG9wKCk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICB9XG5cbiAgICAgICAgc3RhcnQoKSB7XG5cbiAgICAgICAgICAgIGxldCBzZWxmID0gdGhpcztcblxuICAgICAgICAgICAgdGhpcy5jb250YWluZXIuY2xhc3NMaXN0LmFkZCgnZGFuZ2VyJyk7XG5cbiAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHNlbGYuY29udGFpbmVyLmNsYXNzTGlzdC5yZW1vdmUoJ2RhbmdlcicpO1xuICAgICAgICAgICAgfSwgODAwKTtcblxuICAgICAgICAgICAgdGhpcy50aW1lciA9IHNldEludGVydmFsKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBzZWxmLmF2YWlsYWJsZVNlY29uZHMgLS07XG5cbiAgICAgICAgICAgICAgICBzZWxmLmNoZWNrRGFuZ2VyKCk7XG4gICAgICAgICAgICAgICAgc2VsZi5jaGVja1RpbWVJc092ZXIoKTtcbiAgICAgICAgICAgICAgICBzZWxmLnNob3dUaW1lclZhbHVlKCk7XG5cbiAgICAgICAgICAgIH0sIDEwMDApO1xuICAgICAgICB9XG5cbiAgICAgICAgc3RvcCgpIHtcbiAgICAgICAgICAgIGNsZWFySW50ZXJ2YWwodGhpcy50aW1lcik7XG4gICAgICAgIH1cblxuICAgICAgICBzaG93VGltZXJWYWx1ZSgpIHtcblxuICAgICAgICAgICAgbGV0IG1pbnV0ZXMgPSBNYXRoLmZsb29yKHRoaXMuYXZhaWxhYmxlU2Vjb25kcyAvIDYwKTtcbiAgICAgICAgICAgIGxldCBzZWNvbmRzID0gdGhpcy5hdmFpbGFibGVTZWNvbmRzICUgNjA7XG5cbiAgICAgICAgICAgIGlmIChtaW51dGVzIDwgMTApIHtcbiAgICAgICAgICAgICAgICBtaW51dGVzID0gJzAnICsgbWludXRlcztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHNlY29uZHMgPCAxMCkge1xuICAgICAgICAgICAgICAgIHNlY29uZHMgPSAnMCcgKyBzZWNvbmRzO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLmNvbnRhaW5lci5pbm5lclRleHQgPSBtaW51dGVzICsgJzonICsgc2Vjb25kcztcblxuICAgICAgICB9XG5cbiAgICAgICAgY2hlY2tEYW5nZXIoKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5hdmFpbGFibGVTZWNvbmRzIDwgdGhpcy5zZWNvbmRzVG9EYW5nZXIpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmNvbnRhaW5lci5jbGFzc0xpc3QuYWRkKCdkYW5nZXInKTtcbiAgICAgICAgICAgICAgICBpZiAoIXRoaXMuc291bmRUaWNrLmlzUGxheWluZygpKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc291bmRUaWNrLnBsYXkoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBjaGVja1RpbWVJc092ZXIoKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5hdmFpbGFibGVTZWNvbmRzIDwgMSkge1xuICAgICAgICAgICAgICAgIGNsZWFySW50ZXJ2YWwodGhpcy50aW1lcik7XG4gICAgICAgICAgICAgICAgdGhpcy5zb3VuZEFsYXJtLnBsYXkoKTtcbiAgICAgICAgICAgICAgICB0aGlzLnNvdW5kVGljay5zdG9wKCk7XG4gICAgICAgICAgICAgICAgdGhpcy5hcHAuZGlzcGF0Y2hFdmVudCh0aGlzLmZhaWxFdmVudCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgIH1cblxuICAgIC8vIEhpbnQgQ29tcG9uZW50XG4gICAgY2xhc3MgSGludENvbXBvbmVudCB7XG4gICAgICAgIGNvbnN0cnVjdG9yKG1lc3NhZ2UpIHtcbiAgICAgICAgICAgIHRoaXMuY29udGFpbmVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2hpbnQnKTtcbiAgICAgICAgICAgIHRoaXMuaGludFRleHQgPSB0aGlzLmNvbnRhaW5lci5xdWVyeVNlbGVjdG9yKCdwI2hpbnQtdGV4dCcpO1xuICAgICAgICAgICAgdGhpcy5jbG9zZUJ0biA9IHRoaXMuY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoJ2J1dHRvbiNjbG9zZS1oaW50Jyk7XG5cbiAgICAgICAgICAgIHRoaXMuaGludFRleHQuaW5uZXJUZXh0ID0gbWVzc2FnZTtcblxuICAgICAgICAgICAgdGhpcy5pbml0KCk7XG4gICAgICAgIH1cblxuICAgICAgICBpbml0KCkge1xuICAgICAgICAgICAgbGV0IHNlbGYgPSB0aGlzO1xuICAgICAgICAgICAgdGhpcy5jbG9zZUJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBzZWxmLmhpZGUoKTtcbiAgICAgICAgICAgIH0pXG4gICAgICAgIH1cblxuICAgICAgICBzaG93KCkge1xuICAgICAgICAgICAgdGhpcy5jb250YWluZXIuY2xhc3NMaXN0LmFkZCgnc2hvdycpO1xuICAgICAgICB9XG4gICAgICAgIGhpZGUoKSB7XG4gICAgICAgICAgICB0aGlzLmNvbnRhaW5lci5jbGFzc0xpc3QucmVtb3ZlKCdzaG93Jyk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBQbGF5ZXIgQ29tcG9uZW50XG4gICAgY2xhc3MgUGxheWVyIHtcblxuICAgICAgICBjb25zdHJ1Y3RvcihwYXRoVG9GaWxlLCBsb29wID0gZmFsc2UpIHtcbiAgICAgICAgICAgIHRoaXMucGxheUJ0biA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwbGF5Jyk7XG4gICAgICAgICAgICB0aGlzLnN0b3BCdG4gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc3RvcCcpO1xuXG5cbiAgICAgICAgICAgIHRoaXMuc291bmQgPSBuZXcgQXVkaW8ocGF0aFRvRmlsZSk7XG4gICAgICAgICAgICB0aGlzLnNvdW5kLmxvb3AgPSBsb29wO1xuXG4gICAgICAgICAgICB0aGlzLmluaXQoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGluaXQoKSB7XG4gICAgICAgICAgICBsZXQgc2VsZiA9IHRoaXM7XG4gICAgICAgICAgICB0aGlzLnBsYXlCdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgc2VsZi5wbGF5KCk7XG4gICAgICAgICAgICAgICAgc2VsZi5zaG93U3RvcEJ0bigpO1xuICAgICAgICAgICAgICAgIHNlbGYuaGlkZVBsYXlCdG4oKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdGhpcy5zdG9wQnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHNlbGYuc3RvcCgpXG4gICAgICAgICAgICAgICAgc2VsZi5zaG93UGxheUJ0bigpO1xuICAgICAgICAgICAgICAgIHNlbGYuaGlkZVN0b3BCdG4oKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgcGxheSgpIHtcbiAgICAgICAgICAgIHRoaXMuc291bmQucGxheSgpO1xuICAgICAgICB9XG5cbiAgICAgICAgcGF1c2UoKSB7XG4gICAgICAgICAgICB0aGlzLnNvdW5kLnBhdXNlKCk7XG4gICAgICAgIH1cblxuICAgICAgICBzdG9wKCkge1xuICAgICAgICAgICAgdGhpcy5zb3VuZC5wYXVzZSgpO1xuICAgICAgICAgICAgdGhpcy5zb3VuZC5jdXJyZW50VGltZSA9IDA7XG4gICAgICAgIH1cblxuICAgICAgICBzaG93UGxheUJ0bigpIHtcbiAgICAgICAgICAgIHRoaXMucGxheUJ0bi5jbGFzc0xpc3QuYWRkKCdzaG93Jyk7XG4gICAgICAgIH1cblxuICAgICAgICBoaWRlUGxheUJ0bigpIHtcbiAgICAgICAgICAgIHRoaXMucGxheUJ0bi5jbGFzc0xpc3QucmVtb3ZlKCdzaG93Jyk7XG4gICAgICAgIH1cblxuICAgICAgICBzaG93U3RvcEJ0bigpIHtcbiAgICAgICAgICAgIHRoaXMuc3RvcEJ0bi5jbGFzc0xpc3QuYWRkKCdzaG93Jyk7XG4gICAgICAgIH1cblxuICAgICAgICBoaWRlU3RvcEJ0bigpIHtcbiAgICAgICAgICAgIHRoaXMuc3RvcEJ0bi5jbGFzc0xpc3QucmVtb3ZlKCdzaG93Jyk7XG4gICAgICAgIH1cblxuICAgICAgICBpc1BsYXlpbmcobmFtZSkge1xuICAgICAgICAgICAgcmV0dXJuICF0aGlzLnNvdW5kLnBhdXNlZDtcbiAgICAgICAgfVxuXG4gICAgfVxuXG5cblxuXG5cbiAgICBuZXcgR2FtZSgpO1xuXG59KTsiXX0=
