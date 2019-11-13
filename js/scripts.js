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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJzY3JpcHRzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcIkRPTUNvbnRlbnRMb2FkZWRcIiwgZnVuY3Rpb24oZXZlbnQpIHtcblxuXG5cbiAgICBjb25zdCBTdGVwcyA9IFtcbiAgICAgICAge30sXG4gICAgICAgIHtcbiAgICAgICAgICAgIHF1ZXN0aW9uOiAn0JjRgtCw0LosINGC0LLQvtC1INC/0LXRgNCy0L7QtSDQt9Cw0LTQsNC90LjQtS4g0JjRgdC60LDRgtGMINC60L7QvdCy0LXRgNGCINC90YPQttC90L4g0YLQsNC8LCDQs9C00LUg0YLRiyDQs9C+0YLQvtCy0LjRiNGMINC+0YLQu9C40YfQvdC10LnRiNGD0Y4g0LvQsNC/0YjRgywg0L7QvSDRgNGP0LTQvtC8INGBINCy0LjQu9C60L7QuSDQuCDQvdC+0LbQvtC8LicsXG4gICAgICAgICAgICBhbnN3ZXI6ICcyNTgnLFxuICAgICAgICAgICAgaGludDogJ9Ca0L7QvdCy0LXRgNGCINCyINGP0YnQuNC60LUg0YHRgtC+0LvQsCwg0L3QsCDQutGD0YXQvdC1JyxcbiAgICAgICAgICAgIHN1Y2Nlc3NNZXNzYWdlOiAn0JTQsNGI0YPQu9GM0LrQsCwg0YHQv9Cw0YHQuNCx0L4g0LfQsCDQvtGC0LvQuNGH0L3Ri9C1INC4INCy0LrRg9GB0L3Ri9GFINCx0LvRjtC00LAsINC60L7RgtC+0YDRi9C1INGC0Ysg0LTQu9GPINC90LDRgSDQs9C+0YLQvtCy0LjRiNGMISDQotCy0L7QuSDQv9C+0LTQsNGA0L7QuiDQsiDRgdGC0L7Qu9C1LCDQvtGC0LrRgNC+0Lkg0LTQstC10YDRhtGLLicsXG4gICAgICAgICAgICB0aW1lT3ZlcjogMixcbiAgICAgICAgICAgIG5leHRCdG5UZXh0OiAn0Jog0YHQu9C10LTRg9GO0YnQtdC80YMg0L/QvtC00LDRgNC60YMhJyxcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgcXVlc3Rpb246ICfQodC70LXQtNGD0Y7RidC40Lkg0LrQvtC90LLQtdGA0YIg0L3QsNGF0L7QtNC40YLRgdGPINGC0LDQvCwg0LPQtNC1INGC0Ysg0L/QvtC00LTQtdGA0LbQuNCy0LDQtdGI0Ywg0LbQuNC30L3RjCDRgtC10LwsINC60L7Qs9C+INC00LDRgNGP0YIg0YLQstC+0Lgg0LrQu9C40LXQvdGC0Ysg0LvRjtCx0LjQvNGL0Lwg0LvRjtC00Y/QvC4nLFxuICAgICAgICAgICAgYW5zd2VyOiAnNTU1JyxcbiAgICAgICAgICAgIGhpbnQ6ICfQrdGC0L4g0YbQstC10YLRiywg0LrQvtGC0L7RgNGL0LUg0YLRiyDQstGL0YDQsNGJ0LjQstCw0LXRiNGMJyxcbiAgICAgICAgICAgIHN1Y2Nlc3NNZXNzYWdlOiAn0KHQv9Cw0YHQuNCx0L4g0LfQsCDQutGA0LDRgdC+0YLRgywg0LrQvtGC0L7RgNGD0Y4g0YLRiyDQv9GA0LjQvdC+0YHQuNGI0Ywg0LIg0Y3RgtC+0YIg0LzQuNGALCDQv9C+0LTQsNGA0L7QuiDQuNGJ0Lgg0LIg0YjQutCw0YTRgyDQstCw0L3QvdC+0Lkg0LrQvtC80L3QsNGC0YsuJyxcbiAgICAgICAgICAgIHRpbWVPdmVyOiAzMCxcbiAgICAgICAgICAgIG5leHRCdG5UZXh0OiAnTmV4dCcsXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICAgIHF1ZXN0aW9uOiAn0J/QvtGC0L7RgNC+0L/QuNGB0Ywg0Log0YHQu9C10LTRg9GO0YnQtdC80YMg0LrQvtC90LLQtdGA0YLRgywg0L7QvSDQvdCw0YXQvtC00LjRgtGB0Y8g0YMg0YXQvtGA0L7RiNC10LPQviDQutGD0YfQtdGA0Y/QstC+0LPQviDRh9C10LvQvtCy0LXQutCwLCDQttC40LLRg9GJ0LXQs9C+INC/0L4g0YHQvtGB0LXQtNGB0YLQstGDLiDQotCy0L7QuSDQv9Cw0YDQvtC70YwgLSBcItCl0L7Rh9GDINGF0LDQu9Cy0YMg0LXQvCwg0YXQvtGH0YMg0L/RgNGP0L3QuNC60LhcIicsXG4gICAgICAgICAgICBhbnN3ZXI6ICczMzMnLFxuICAgICAgICAgICAgaGludDogJ9Ct0YLQviDQmNGA0LjQvdCwJyxcbiAgICAgICAgICAgIHN1Y2Nlc3NNZXNzYWdlOiAn0KHQv9Cw0YHQuNCx0L4g0LfQsCDRgtCy0L7QtSDQvtCx0YnQtdC90LjQtSwg0LfQsCDQvdC+0LLQvtGB0YLQuCDQuCDQuNC00LXQuCwg0LrQvtGC0L7RgNGL0LzQuCDRgtGLINC00LXQu9C40YjRjNGB0Y8hINCf0L7QtNCw0YDQvtC6INCyINGI0LrQsNGE0YMgKNCyINC+0LHRidC10Lwg0LrQvtGA0LjQtNC+0YDQtSknLFxuICAgICAgICAgICAgdGltZU92ZXI6IDE1LFxuICAgICAgICAgICAgbmV4dEJ0blRleHQ6ICdOZXh0JyxcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgcXVlc3Rpb246ICfQodC70LXQtNGD0Y7RidC40Lkg0LrQvtC90LLQtdGA0YIg0YLRiyDQvdCw0LnQtNC10YjRjCDRgtCw0LwsINC60YPQtNCwINC/0L7Qv9Cw0LTQsNGO0YIg0YLQstC+0Lgg0L3QvtGB0L7Rh9C60Lgg0L/QvtGB0LvQtSDRgdGC0LjRgNC60LguJyxcbiAgICAgICAgICAgIGFuc3dlcjogJzE1NycsXG4gICAgICAgICAgICBoaW50OiAn0J/QvtGB0LvQtSDRgtC+0LPQviwg0LrQsNC6INC+0L3QuCDQstGL0YHQvtGF0LvQuCcsXG4gICAgICAgICAgICBzdWNjZXNzTWVzc2FnZTogJ9Ch0L/QsNGB0LjQsdC+INC30LAg0YfQuNGB0YLQvtGC0YMg0Lgg0L/QvtGA0Y/QtNC+0LosINC60L7RgtC+0YDRi9C1INGC0Ysg0LTQu9GPINC90LDRgSDQv9C+0LTQtNC10YDQttC40LLQsNC10YjRjCEg0KLQstC+0Lkg0YHQu9C10LTRg9GO0YnQuNC5INC/0L7QtNCw0YDQvtC6INCyINCw0L3RgtGA0LXRgdC+0LvQuCEnLFxuICAgICAgICAgICAgdGltZU92ZXI6IDE1LFxuICAgICAgICAgICAgbmV4dEJ0blRleHQ6ICdOZXh0JyxcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgcXVlc3Rpb246ICfQmNGC0LDQuiwg0L/QvtGB0LvQtdC00L3QtdC1INC30LDQtNCw0L3QuNC1LiDQntGC0LLQtdGCINC/0YDRj9GH0LXRgtGB0Y8g0LIg0LzQtdGI0LrQtSDQvdCw0LHQuNGC0L7QvCDQs9GD0YHQuNC90YvQvNC4INCy0L7Qu9C+0YHQsNC80LguJyxcbiAgICAgICAgICAgIGFuc3dlcjogJzM2OScsXG4gICAgICAgICAgICBoaW50OiAn0K3RgtC+INC/0L7QtNGD0YjQutCwJyxcbiAgICAgICAgICAgIHN1Y2Nlc3NNZXNzYWdlOiAn0KHQv9Cw0YHQuNCx0L4g0LfQsCDQu9GO0LHQvtCy0Ywg0Lgg0LvQsNGB0LrRgywg0LrQvtGC0L7RgNGL0LzQuCDRgtGLINC90LDRgSDRgdC+0LPRgNC10LLQsNC10YjRjCEg0KLQstC+0Lkg0L/QvtC00LDRgNC+0Log0L/QvtC0INC80LDRgtGA0LDRgdC+0LwuJyxcbiAgICAgICAgICAgIHRpbWVPdmVyOiAxNSxcbiAgICAgICAgICAgIG5leHRCdG5UZXh0OiAnTmV4dCcsXG4gICAgICAgIH0sXG4gICAgXTtcbiAgICBjb25zdCBTZXR1cCA9IHtcbiAgICAgICAgZGVidWc6IGZhbHNlLFxuICAgICAgICBzZWNvbmRzVG9EYW5nZXI6IDEwLFxuICAgICAgICBzb3VuZHM6IHtcbiAgICAgICAgICAgICdkYXNoYSc6ICcvYXNzZXRzL3NvdW5kcy9kYXNoYS5tcDMnLFxuICAgICAgICAgICAgJ2FwcGxhdXNlJzogJy9hc3NldHMvc291bmRzL2FwcGxhdXNlLm1wMycsXG4gICAgICAgICAgICAnZmlyZXdvcmtzJzogJy9hc3NldHMvc291bmRzL2ZpcmV3b3Jrcy5tcDMnLFxuICAgICAgICAgICAgJ2FsYXJtJzogJy9hc3NldHMvc291bmRzL2FsYXJtLm1wMycsXG4gICAgICAgICAgICAndGljayc6ICcvYXNzZXRzL3NvdW5kcy90aWNrLm1wMycsXG4gICAgICAgIH0sXG4gICAgICAgIHdlbGNvbWVNZXNzYWdlOiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgbWVzc2FnZTogJ9Cf0YDQuNCy0LXRgiwg0JTQsNGI0YPQu9GM0LrQsCEg0KHQtdCz0L7QtNC90Y8g0YLQstC+0Lkg0LTQtdC90Ywg0YDQvtC20LTQtdC90LjRjywg0LAg0LIg0LTQtdC90Ywg0YDQvtC20LTQtdC90LjRjyDQv9GA0LjQvdGP0YLQviDQv9C+0LvRg9GH0LDRgtGMINC/0L7QtNCw0YDQutC4LicsXG4gICAgICAgICAgICAgICAgYnRuVGV4dDogJ9Cu0K7QricsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIG1lc3NhZ2U6ICfQlNC+0LHRgNC+INC/0L7QttCw0LvQvtCy0LDRgtGMINCyINC/0YDQuNC60LvRjtGH0LXQvdC40LUsINCU0LDRiNCwLdC/0YPRgtC10YjQtdGB0YLQstC10L3QvdC40YbQsCEg0J3QsCDRgtCy0L7RkdC8INC/0YPRgtC4INCx0YPQtNGD0YIg0LfQsNC00LDQvdC40Y8g0L3QsCDQv9C+0LjRgdC6INC60L7QvdCy0LXRgNGC0L7Qsi4g0JIg0LrQvtC90LLQtdGA0YLQsNGFINCx0YPQtNC10YIg0YfQuNGB0LvQviwg0LrQvtGC0L7RgNC+0LUg0YLQtdCx0LUg0L3Rg9C20L3QviDQstCy0LXRgdGC0LguINCf0L7RgdC70LUg0Y3RgtC+0LPQviDRgtGLINGD0LfQvdCw0LXRiNGMLCDQs9C00LUg0LfQsNCx0YDQsNGC0Ywg0L/QvtC00LDRgNC+0LouINCf0L7QtdGF0LDQu9C4PycsXG4gICAgICAgICAgICAgICAgYnRuVGV4dDogJ1ZWVicsXG4gICAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgIH07XG5cblxuXG4gICAgLy8gTWFpbiBDb21wb25lbnRcbiAgICBjbGFzcyBHYW1lIHtcblxuICAgICAgICBjb25zdHJ1Y3RvcigpIHtcblxuICAgICAgICAgICAgdGhpcy5hcHAgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYXBwJyk7XG5cbiAgICAgICAgICAgIC8vIFNjcmVlbnNcbiAgICAgICAgICAgIHRoaXMubG9hZGluZ1NjcmVlbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdsb2FkaW5nJyk7XG4gICAgICAgICAgICB0aGlzLnB5cm9TY3JlZW4gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncHlybycpO1xuICAgICAgICAgICAgdGhpcy5nYW1lT3ZlclNjcmVlbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdnYW1lLW92ZXInKTtcblxuXG4gICAgICAgICAgICAvLyBDb21wb25lbnRzXG4gICAgICAgICAgICB0aGlzLkZ1bGxzY3JlZW5Db21wb25lbnQgPSBuZXcgRnVsbHNjcmVlbkNvbXBvbmVudCgpO1xuICAgICAgICAgICAgdGhpcy5XZWxjb21lQ29tcG9uZW50ID0gbmV3IFdlbGNvbWUoKTtcbiAgICAgICAgICAgIHRoaXMuQ29tbW9uVGltZXJDb21wb25lbnQgPSBuZXcgQ29tbW9uVGltZXJDb21wb25lbnQoKTtcbiAgICAgICAgICAgIHRoaXMuUXVlc3RDb21wb25lbnQgPSBuZXcgUXVlc3RDb21wb25lbnQoKTtcblxuXG4gICAgICAgICAgICAvLyBCaW5kIEV2ZW50c1xuICAgICAgICAgICAgdGhpcy5pbml0RXZlbnRzKCk7XG5cbiAgICAgICAgICAgIC8vIEhpZGUgbG9hZGluZyBiZWZvcmUgbG9hZGluZ1xuICAgICAgICAgICAgdGhpcy5oaWRlTG9hZGluZygpO1xuXG4gICAgICAgIH1cblxuICAgICAgICAvLyBCaW5nIEV2ZW50c1xuICAgICAgICBpbml0RXZlbnRzKCkge1xuXG4gICAgICAgICAgICBsZXQgc2VsZiA9IHRoaXM7XG5cbiAgICAgICAgICAgIC8vIEZ1bGxzY3JlZW4gRG9uZVxuICAgICAgICAgICAgdGhpcy5hcHAuYWRkRXZlbnRMaXN0ZW5lcignZnVsbHNjcmVlbkRvbmUnLCBmdW5jdGlvbiAoKSB7XG5cbiAgICAgICAgICAgICAgICBzZWxmLldlbGNvbWVDb21wb25lbnQuc2hvdygpO1xuXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgdGhpcy5hcHAuYWRkRXZlbnRMaXN0ZW5lcignd2VsY29tZURvbmUnLCBmdW5jdGlvbiAoKSB7XG5cbiAgICAgICAgICAgICAgICBzZWxmLldlbGNvbWVDb21wb25lbnQuaGlkZSgpO1xuICAgICAgICAgICAgICAgIHNlbGYuUXVlc3RDb21wb25lbnQuc2hvdygpO1xuICAgICAgICAgICAgICAgIHNlbGYuQ29tbW9uVGltZXJDb21wb25lbnQuc3RhcnQoKTtcblxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIC8vIFF1ZXN0IERvbmVcbiAgICAgICAgICAgIHRoaXMuYXBwLmFkZEV2ZW50TGlzdGVuZXIoJ2V2ZW50UXVlc3RTdWNjZXNzJywgZnVuY3Rpb24gKCkge1xuXG4gICAgICAgICAgICAgICAgc2VsZi5Db21tb25UaW1lckNvbXBvbmVudC5zdG9wKCk7XG4gICAgICAgICAgICAgICAgc2VsZi5RdWVzdENvbXBvbmVudC5oaWRlKCk7XG4gICAgICAgICAgICAgICAgc2VsZi5nYW1lT3ZlclNjcmVlbi5jbGFzc0xpc3QuYWRkKCdzaG93Jyk7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ0dhbWUgT3ZlciEhIScpO1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHNlbGYuQ29tbW9uVGltZXJDb21wb25lbnQuZ2V0Q29tbW9uVGltZSgpKTtcblxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIC8vIFBhdXNlIENvbW1vbiBUaW1lclxuICAgICAgICAgICAgdGhpcy5hcHAuYWRkRXZlbnRMaXN0ZW5lcigncGF1c2VUaW1lcicsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBzZWxmLkNvbW1vblRpbWVyQ29tcG9uZW50LnBhdXNlKCk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgLy8gQ29udGludWUgQ29tbW9uIFRpbWVyXG4gICAgICAgICAgICB0aGlzLmFwcC5hZGRFdmVudExpc3RlbmVyKCdjb250aW51ZVRpbWVyJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHNlbGYuQ29tbW9uVGltZXJDb21wb25lbnQuY29udGludWUoKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgIH1cblxuICAgICAgICAvL0xvYWRpbmdcbiAgICAgICAgaGlkZUxvYWRpbmcoKSB7XG4gICAgICAgICAgICB0aGlzLmxvYWRpbmdTY3JlZW4uY2xhc3NMaXN0LnJlbW92ZSgnc2hvdycpO1xuICAgICAgICB9XG5cbiAgICB9XG5cbiAgICAvLyBGdWxsc2NyZWVuIENsYXNzXG4gICAgY2xhc3MgRnVsbHNjcmVlbkNvbXBvbmVudCB7XG5cbiAgICAgICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgICAgICB0aGlzLmFwcCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdhcHAnKTtcbiAgICAgICAgICAgIHRoaXMuY29udGFpbmVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2Z1bGxzY3JlZW4nKTtcbiAgICAgICAgICAgIHRoaXMuY29udGFpbmVyLmNsYXNzTGlzdC5hZGQoJ3Nob3cnKTtcbiAgICAgICAgICAgIHRoaXMuYnRuID0gdGhpcy5jb250YWluZXIucXVlcnlTZWxlY3RvcignYnV0dG9uJyk7XG4gICAgICAgICAgICB0aGlzLmZ1bGxzY3JlZW5Eb25lID0gbmV3IEV2ZW50KCdmdWxsc2NyZWVuRG9uZScpO1xuICAgICAgICAgICAgbGV0IHNlbGYgPSB0aGlzO1xuICAgICAgICAgICAgdGhpcy5idG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgaWYgKCFTZXR1cC5kZWJ1Zykge1xuICAgICAgICAgICAgICAgICAgICBzZWxmLmxhdW5jaEZ1bGxTY3JlZW4oZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgc2VsZi5idG4uY2xhc3NMaXN0LmFkZCgnc29mdF9oaWRlJyk7XG4gICAgICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIHNlbGYuY29udGFpbmVyLmNsYXNzTGlzdC5yZW1vdmUoJ3Nob3cnKTtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5hcHAuZGlzcGF0Y2hFdmVudChzZWxmLmZ1bGxzY3JlZW5Eb25lKTtcbiAgICAgICAgICAgICAgICB9LCAxMDAwKTtcbiAgICAgICAgICAgIH0pXG4gICAgICAgIH1cblxuICAgICAgICBsYXVuY2hGdWxsU2NyZWVuKGVsZW1lbnQpIHtcbiAgICAgICAgICAgIGlmKGVsZW1lbnQucmVxdWVzdEZ1bGxTY3JlZW4pIHtcbiAgICAgICAgICAgICAgICBlbGVtZW50LnJlcXVlc3RGdWxsU2NyZWVuKCk7XG4gICAgICAgICAgICB9IGVsc2UgaWYoZWxlbWVudC5tb3pSZXF1ZXN0RnVsbFNjcmVlbikge1xuICAgICAgICAgICAgICAgIGVsZW1lbnQubW96UmVxdWVzdEZ1bGxTY3JlZW4oKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZihlbGVtZW50LndlYmtpdFJlcXVlc3RGdWxsU2NyZWVuKSB7XG4gICAgICAgICAgICAgICAgZWxlbWVudC53ZWJraXRSZXF1ZXN0RnVsbFNjcmVlbigpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgY2FuY2VsRnVsbHNjcmVlbigpIHtcbiAgICAgICAgICAgIGlmKGRvY3VtZW50LmNhbmNlbEZ1bGxTY3JlZW4pIHtcbiAgICAgICAgICAgICAgICBkb2N1bWVudC5jYW5jZWxGdWxsU2NyZWVuKCk7XG4gICAgICAgICAgICB9IGVsc2UgaWYoZG9jdW1lbnQubW96Q2FuY2VsRnVsbFNjcmVlbikge1xuICAgICAgICAgICAgICAgIGRvY3VtZW50Lm1vekNhbmNlbEZ1bGxTY3JlZW4oKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZihkb2N1bWVudC53ZWJraXRDYW5jZWxGdWxsU2NyZWVuKSB7XG4gICAgICAgICAgICAgICAgZG9jdW1lbnQud2Via2l0Q2FuY2VsRnVsbFNjcmVlbigpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICB9XG5cbiAgICAvLyBXZWxjb21lIE1lc3NhZ2VzXG4gICAgY2xhc3MgV2VsY29tZSB7XG5cbiAgICAgICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgICAgICB0aGlzLmFwcCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdhcHAnKTtcbiAgICAgICAgICAgIHRoaXMuY29udGFpbmVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3dlbGNvbWUnKTtcbiAgICAgICAgICAgIHRoaXMuYXBwZWFydGluQmxvY2sgPSB0aGlzLmNvbnRhaW5lci5xdWVyeVNlbGVjdG9yKCcjd2VsY29tZS10ZXh0Jyk7XG4gICAgICAgICAgICB0aGlzLnRleHQgPSB0aGlzLmNvbnRhaW5lci5xdWVyeVNlbGVjdG9yKCcjd2VsY29tZS10ZXh0ID4gcCcpO1xuICAgICAgICAgICAgdGhpcy5uZXh0QnRuID0gdGhpcy5jb250YWluZXIucXVlcnlTZWxlY3RvcignYnV0dG9uI3dlbGNvbWUtbmV4dC1idG4nKTtcbiAgICAgICAgICAgIHRoaXMuZXZlbnREb25lID0gbmV3IEV2ZW50KCd3ZWxjb21lRG9uZScpO1xuICAgICAgICAgICAgdGhpcy5tdXNpY0Rhc2hhID0gbmV3IFBsYXllcihTZXR1cC5zb3VuZHMuZGFzaGEpO1xuICAgICAgICAgICAgdGhpcy5pbml0KCk7XG4gICAgICAgIH1cblxuICAgICAgICBpbml0KCkge1xuXG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRNZXNzYWdlID0gMDtcblxuICAgICAgICAgICAgdGhpcy5maWxsRmllbGRzKCk7XG5cbiAgICAgICAgICAgIGxldCBzZWxmID0gdGhpcztcbiAgICAgICAgICAgIHRoaXMubmV4dEJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBzZWxmLm5leHRNZXNzYWdlKCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZpbGxGaWVsZHMoKSB7XG4gICAgICAgICAgICB0aGlzLnRleHQuaW5uZXJUZXh0ID0gU2V0dXAud2VsY29tZU1lc3NhZ2VbdGhpcy5jdXJyZW50TWVzc2FnZV0ubWVzc2FnZTtcbiAgICAgICAgICAgIHRoaXMubmV4dEJ0bi5pbm5lclRleHQgPSBTZXR1cC53ZWxjb21lTWVzc2FnZVt0aGlzLmN1cnJlbnRNZXNzYWdlXS5idG5UZXh0O1xuICAgICAgICB9XG5cbiAgICAgICAgbmV4dE1lc3NhZ2UoKSB7XG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRNZXNzYWdlKys7XG4gICAgICAgICAgICBpZiAodGhpcy5jdXJyZW50TWVzc2FnZSA+PSBTZXR1cC53ZWxjb21lTWVzc2FnZS5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICB0aGlzLm11c2ljRGFzaGEuc3RvcCgpO1xuICAgICAgICAgICAgICAgIHRoaXMuYXBwLmRpc3BhdGNoRXZlbnQodGhpcy5ldmVudERvbmUpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5jdXJyZW50TWVzc2FnZSA9PSAxKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICghU2V0dXAuZGVidWcpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubXVzaWNEYXNoYS5wbGF5KCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdGhpcy5maWxsRmllbGRzKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBzaG93KCkge1xuICAgICAgICAgICAgdGhpcy5jb250YWluZXIuY2xhc3NMaXN0LmFkZCgnc2hvdycpO1xuICAgICAgICAgICAgdGhpcy5hcHBlYXJ0aW5CbG9jay5jbGFzc0xpc3QuYWRkKCdzaG93Jyk7XG4gICAgICAgICAgICB0aGlzLm5leHRCdG4uY2xhc3NMaXN0LmFkZCgnc2hvdycpO1xuICAgICAgICB9XG5cbiAgICAgICAgaGlkZSgpIHtcbiAgICAgICAgICAgIHRoaXMuY29udGFpbmVyLmNsYXNzTGlzdC5yZW1vdmUoJ3Nob3cnKTtcbiAgICAgICAgfVxuXG4gICAgfVxuXG4gICAgLy8gQ29tbW9uVGltZSBDbGFzc1xuICAgIGNsYXNzIENvbW1vblRpbWVyQ29tcG9uZW50IHtcblxuICAgICAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgICAgIHRoaXMuY3VycmVudFNlY29uZHMgPSAwO1xuICAgICAgICAgICAgdGhpcy5pc1BhdXNlZCA9IGZhbHNlO1xuICAgICAgICB9XG5cbiAgICAgICAgc3RhcnQoKSB7XG4gICAgICAgICAgICBsZXQgc2VsZiA9IHRoaXM7XG4gICAgICAgICAgICB0aGlzLnRpbWVyID0gc2V0SW50ZXJ2YWwoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIGlmICghc2VsZi5pc1BhdXNlZCkge1xuICAgICAgICAgICAgICAgICAgICBzZWxmLmN1cnJlbnRTZWNvbmRzICsrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sIDEwMDApO1xuICAgICAgICB9XG5cbiAgICAgICAgcGF1c2UoKSB7XG4gICAgICAgICAgICB0aGlzLmlzUGF1c2VkID0gdHJ1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnRpbnVlKCkge1xuICAgICAgICAgICAgdGhpcy5pc1BhdXNlZCA9IGZhbHNlO1xuICAgICAgICB9XG5cbiAgICAgICAgc3RvcCgpIHtcbiAgICAgICAgICAgIGNsZWFySW50ZXJ2YWwodGhpcy50aW1lcik7XG4gICAgICAgIH1cblxuICAgICAgICBnZXRDb21tb25UaW1lKCkge1xuXG4gICAgICAgICAgICBsZXQgbWludXRlcyA9IE1hdGguZmxvb3IodGhpcy5jdXJyZW50U2Vjb25kcyAvIDYwKTtcbiAgICAgICAgICAgIGxldCBzZWNvbmRzID0gdGhpcy5jdXJyZW50U2Vjb25kcyAlIDYwO1xuXG4gICAgICAgICAgICBpZiAobWludXRlcyA8IDEwKSB7XG4gICAgICAgICAgICAgICAgbWludXRlcyA9ICcwJyArIG1pbnV0ZXM7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChzZWNvbmRzIDwgMTApIHtcbiAgICAgICAgICAgICAgICBzZWNvbmRzID0gJzAnICsgc2Vjb25kcztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIG1pbnV0ZXMgKyAnOicgKyBzZWNvbmRzOztcbiAgICAgICAgfVxuXG4gICAgfVxuXG4gICAgLy8gUWVzdFN0ZXAgQ2xhc3NcbiAgICBjbGFzcyBRdWVzdENvbXBvbmVudCB7XG5cbiAgICAgICAgY29uc3RydWN0b3IoKSB7XG5cbiAgICAgICAgICAgIHRoaXMuYXBwID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2FwcCcpO1xuICAgICAgICAgICAgdGhpcy5jb250YWluZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncXVlc3QnKTtcblxuICAgICAgICAgICAgdGhpcy50ZXh0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3RleHQnKTtcbiAgICAgICAgICAgIHRoaXMuaW5wdXQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYW5zd2VyLWlucHV0Jyk7XG5cbiAgICAgICAgICAgIHRoaXMuc3VjY2Vzc01lc3NhZ2UgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc3VjY2Vzcy1tZXNzYWdlJyk7XG4gICAgICAgICAgICB0aGlzLnN1Y2Nlc3NNZXNzYWdlVGV4dCA9IHRoaXMuc3VjY2Vzc01lc3NhZ2UucXVlcnlTZWxlY3RvcigncCN0ZXh0LXN1Y2Nlc3MtbWVzc2FnZScpO1xuICAgICAgICAgICAgdGhpcy5uZXh0UXVlc3RCdG4gPSB0aGlzLnN1Y2Nlc3NNZXNzYWdlLnF1ZXJ5U2VsZWN0b3IoJ2J1dHRvbiNuZXh0LXF1ZXN0LWJ0bicpO1xuXG4gICAgICAgICAgICB0aGlzLmhpbnRCdG4gPSB0aGlzLmNvbnRhaW5lci5xdWVyeVNlbGVjdG9yKCdidXR0b24jaGludC1idG4nKTtcblxuICAgICAgICAgICAgdGhpcy5zdWNjZXNFdmVudCA9IG5ldyBFdmVudCgnZXZlbnRRdWVzdFN1Y2Nlc3MnKTtcbiAgICAgICAgICAgIHRoaXMucGF1c2VDb21tb25UaW1lciA9IG5ldyBFdmVudCgncGF1c2VUaW1lcicpO1xuICAgICAgICAgICAgdGhpcy5jb250aW51ZUNvbW1vblRpbWVyID0gbmV3IEV2ZW50KCdjb250aW51ZVRpbWVyJyk7XG4gICAgICAgICAgICB0aGlzLnN0b3BUaWNrU291bmQgPSBuZXcgRXZlbnQoJ3N0b3BUaWNrU291bmQnKTtcbiAgICAgICAgICAgIHRoaXMuc3RvcEFsYXJtU291bmQgPSBuZXcgRXZlbnQoJ3N0b3BBbGFybVNvdW5kJyk7XG5cbiAgICAgICAgICAgIHRoaXMuc291bmRBcHBsYXVzZSA9IG5ldyBQbGF5ZXIoU2V0dXAuc291bmRzLmFwcGxhdXNlKTtcbiAgICAgICAgICAgIHRoaXMuc291bmRGaXJld29ya3MgPSBuZXcgUGxheWVyKFNldHVwLnNvdW5kcy5maXJld29ya3MpO1xuXG4gICAgICAgICAgICB0aGlzLmluaXQoKTtcblxuICAgICAgICB9XG5cbiAgICAgICAgaW5pdCgpIHtcblxuICAgICAgICAgICAgdGhpcy5zdGVwTnVtYmVyID0gMTtcblxuICAgICAgICAgICAgdGhpcy5maWxsRmllbGRzKCk7XG5cbiAgICAgICAgICAgIGxldCBzZWxmID0gdGhpcztcblxuICAgICAgICAgICAgdGhpcy5pbnB1dC5zZXRBdHRyaWJ1dGUoJ21heGxlbmd0aCcsIHRoaXMuYW5zd2VyLmxlbmd0aCk7XG5cbiAgICAgICAgICAgIHRoaXMuaW5wdXQuYWRkRXZlbnRMaXN0ZW5lcignaW5wdXQnLCBmdW5jdGlvbiAoKSB7XG5cbiAgICAgICAgICAgICAgICBpZiAodGhpcy52YWx1ZS5sZW5ndGggPT0gc2VsZi5hbnN3ZXIubGVuZ3RoKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMudmFsdWUgPT0gc2VsZi5hbnN3ZXIpIHtcblxuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5yaWdodEFuc3dlcigpO1xuXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCd3cm9uZy4uLicpO1xuXG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHRoaXMuaGludEJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBzZWxmLkhpbnRDb21wb25lbnQuc2hvdygpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHRoaXMubmV4dFF1ZXN0QnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xuXG4gICAgICAgICAgICAgICAgc2VsZi5zdWNjZXNzTWVzc2FnZS5jbGFzc0xpc3QucmVtb3ZlKCdzaG93Jyk7XG5cbiAgICAgICAgICAgICAgICBzZWxmLm5leHRTdGVwKCk7XG5cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICB0aGlzLmFwcC5hZGRFdmVudExpc3RlbmVyKCdmYWlsVGltZXInLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgc2VsZi5oaW50QnRuLmNsYXNzTGlzdC5hZGQoJ3Nob3cnKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgIH1cblxuICAgICAgICByaWdodEFuc3dlcigpIHtcblxuICAgICAgICAgICAgdGhpcy5UaW1lci5zdG9wKCk7XG5cbiAgICAgICAgICAgIHRoaXMuYXBwLmRpc3BhdGNoRXZlbnQodGhpcy5wYXVzZUNvbW1vblRpbWVyKTtcblxuICAgICAgICAgICAgdGhpcy5zdWNjZXNzTWVzc2FnZS5jbGFzc0xpc3QuYWRkKCdzaG93Jyk7XG5cbiAgICAgICAgICAgIHRoaXMuc291bmRBcHBsYXVzZS5wbGF5KCk7XG4gICAgICAgICAgICB0aGlzLnNvdW5kRmlyZXdvcmtzLnBsYXkoKTtcblxuICAgICAgICAgICAgdGhpcy5hcHAuZGlzcGF0Y2hFdmVudCh0aGlzLnN0b3BUaWNrU291bmQpO1xuICAgICAgICAgICAgdGhpcy5hcHAuZGlzcGF0Y2hFdmVudCh0aGlzLnN0b3BBbGFybVNvdW5kKTtcblxuICAgICAgICB9XG5cbiAgICAgICAgbmV4dFN0ZXAoKSB7XG4gICAgICAgICAgICB0aGlzLnN0ZXBOdW1iZXIrKztcbiAgICAgICAgICAgIGlmICh0aGlzLnN0ZXBOdW1iZXIgPj0gU3RlcHMubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5hcHAuZGlzcGF0Y2hFdmVudCh0aGlzLnN1Y2Nlc0V2ZW50KTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5maWxsRmllbGRzKCk7XG4gICAgICAgICAgICAgICAgdGhpcy5hcHAuZGlzcGF0Y2hFdmVudCh0aGlzLmNvbnRpbnVlQ29tbW9uVGltZXIpO1xuICAgICAgICAgICAgICAgIHRoaXMuVGltZXIuc3RhcnQoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGZpbGxGaWVsZHMoKSB7XG4gICAgICAgICAgICB0aGlzLnF1ZXN0aW9uID0gU3RlcHNbdGhpcy5zdGVwTnVtYmVyXS5xdWVzdGlvbjtcbiAgICAgICAgICAgIHRoaXMudGV4dC5pbm5lclRleHQgPSB0aGlzLnF1ZXN0aW9uO1xuICAgICAgICAgICAgdGhpcy5hbnN3ZXIgPSBTdGVwc1t0aGlzLnN0ZXBOdW1iZXJdLmFuc3dlcjtcblxuICAgICAgICAgICAgdGhpcy5zdWNjZXNzTWVzc2FnZVRleHQuaW5uZXJUZXh0ID0gU3RlcHNbdGhpcy5zdGVwTnVtYmVyXS5zdWNjZXNzTWVzc2FnZTtcbiAgICAgICAgICAgIHRoaXMubmV4dFF1ZXN0QnRuLmlubmVyVGV4dCA9IFN0ZXBzW3RoaXMuc3RlcE51bWJlcl0ubmV4dEJ0blRleHQ7XG5cbiAgICAgICAgICAgIHRoaXMudGltZXJPdmVyID0gU3RlcHNbdGhpcy5zdGVwTnVtYmVyXS50aW1lT3ZlcjtcbiAgICAgICAgICAgIHRoaXMuVGltZXIgPSBuZXcgVGltZXIodGhpcy50aW1lck92ZXIpO1xuXG4gICAgICAgICAgICB0aGlzLmhpbnRUZXh0ID0gU3RlcHNbdGhpcy5zdGVwTnVtYmVyXS5oaW50O1xuICAgICAgICAgICAgdGhpcy5IaW50Q29tcG9uZW50ID0gbmV3IEhpbnRDb21wb25lbnQodGhpcy5oaW50VGV4dCk7XG5cbiAgICAgICAgICAgIHRoaXMuaW5wdXQudmFsdWUgPSAnJztcbiAgICAgICAgICAgIHRoaXMuaGludEJ0bi5jbGFzc0xpc3QucmVtb3ZlKCdzaG93Jyk7XG4gICAgICAgIH1cblxuICAgICAgICBzaG93KCkge1xuICAgICAgICAgICAgdGhpcy5jb250YWluZXIuY2xhc3NMaXN0LmFkZCgnc2hvdycpO1xuICAgICAgICAgICAgdGhpcy5pbnB1dC5jbGFzc0xpc3QuYWRkKCdzaG93Jyk7XG4gICAgICAgICAgICB0aGlzLlRpbWVyLnN0YXJ0KCk7XG4gICAgICAgIH1cblxuICAgICAgICBoaWRlKCkge1xuICAgICAgICAgICAgdGhpcy5jb250YWluZXIuY2xhc3NMaXN0LnJlbW92ZSgnc2hvdycpO1xuICAgICAgICB9XG5cblxuXG4gICAgfVxuXG4gICAgLy8gUXVlc3QgVGltZXJcbiAgICBjbGFzcyBUaW1lciB7XG5cbiAgICAgICAgY29uc3RydWN0b3IodGltZU92ZXIpIHtcblxuICAgICAgICAgICAgdGhpcy5hcHAgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYXBwJyk7XG4gICAgICAgICAgICB0aGlzLmNvbnRhaW5lciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd0aW1lcicpO1xuICAgICAgICAgICAgdGhpcy5hdmFpbGFibGVTZWNvbmRzID0gdGltZU92ZXI7XG5cbiAgICAgICAgICAgIHRoaXMuc2hvd1RpbWVyVmFsdWUoKTtcblxuICAgICAgICAgICAgdGhpcy5zb3VuZFRpY2sgPSBuZXcgUGxheWVyKFNldHVwLnNvdW5kcy50aWNrLCB0cnVlKTtcbiAgICAgICAgICAgIHRoaXMuc291bmRBbGFybSA9IG5ldyBQbGF5ZXIoU2V0dXAuc291bmRzLmFsYXJtKTtcblxuICAgICAgICAgICAgdGhpcy5mYWlsRXZlbnQgPSBuZXcgRXZlbnQoJ2ZhaWxUaW1lcicpO1xuXG4gICAgICAgICAgICB0aGlzLnNlY29uZHNUb0RhbmdlciA9IFNldHVwLnNlY29uZHNUb0RhbmdlcjtcblxuICAgICAgICAgICAgbGV0IHNlbGYgPSB0aGlzO1xuICAgICAgICAgICAgdGhpcy5hcHAuYWRkRXZlbnRMaXN0ZW5lcignc3RvcFRpY2tTb3VuZCcsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBzZWxmLnNvdW5kVGljay5zdG9wKCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHRoaXMuYXBwLmFkZEV2ZW50TGlzdGVuZXIoJ3N0b3BBbGFybVNvdW5kJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHNlbGYuc291bmRBbGFybS5zdG9wKCk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICB9XG5cbiAgICAgICAgc3RhcnQoKSB7XG5cbiAgICAgICAgICAgIGxldCBzZWxmID0gdGhpcztcblxuICAgICAgICAgICAgdGhpcy5jb250YWluZXIuY2xhc3NMaXN0LmFkZCgnZGFuZ2VyJyk7XG5cbiAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHNlbGYuY29udGFpbmVyLmNsYXNzTGlzdC5yZW1vdmUoJ2RhbmdlcicpO1xuICAgICAgICAgICAgfSwgODAwKTtcblxuICAgICAgICAgICAgdGhpcy50aW1lciA9IHNldEludGVydmFsKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBzZWxmLmF2YWlsYWJsZVNlY29uZHMgLS07XG5cbiAgICAgICAgICAgICAgICBzZWxmLmNoZWNrRGFuZ2VyKCk7XG4gICAgICAgICAgICAgICAgc2VsZi5jaGVja1RpbWVJc092ZXIoKTtcbiAgICAgICAgICAgICAgICBzZWxmLnNob3dUaW1lclZhbHVlKCk7XG5cbiAgICAgICAgICAgIH0sIDEwMDApO1xuICAgICAgICB9XG5cbiAgICAgICAgc3RvcCgpIHtcbiAgICAgICAgICAgIGNsZWFySW50ZXJ2YWwodGhpcy50aW1lcik7XG4gICAgICAgIH1cblxuICAgICAgICBzaG93VGltZXJWYWx1ZSgpIHtcblxuICAgICAgICAgICAgbGV0IG1pbnV0ZXMgPSBNYXRoLmZsb29yKHRoaXMuYXZhaWxhYmxlU2Vjb25kcyAvIDYwKTtcbiAgICAgICAgICAgIGxldCBzZWNvbmRzID0gdGhpcy5hdmFpbGFibGVTZWNvbmRzICUgNjA7XG5cbiAgICAgICAgICAgIGlmIChtaW51dGVzIDwgMTApIHtcbiAgICAgICAgICAgICAgICBtaW51dGVzID0gJzAnICsgbWludXRlcztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHNlY29uZHMgPCAxMCkge1xuICAgICAgICAgICAgICAgIHNlY29uZHMgPSAnMCcgKyBzZWNvbmRzO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLmNvbnRhaW5lci5pbm5lclRleHQgPSBtaW51dGVzICsgJzonICsgc2Vjb25kcztcblxuICAgICAgICB9XG5cbiAgICAgICAgY2hlY2tEYW5nZXIoKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5hdmFpbGFibGVTZWNvbmRzIDwgdGhpcy5zZWNvbmRzVG9EYW5nZXIpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmNvbnRhaW5lci5jbGFzc0xpc3QuYWRkKCdkYW5nZXInKTtcbiAgICAgICAgICAgICAgICBpZiAoIXRoaXMuc291bmRUaWNrLmlzUGxheWluZygpKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc291bmRUaWNrLnBsYXkoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBjaGVja1RpbWVJc092ZXIoKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5hdmFpbGFibGVTZWNvbmRzIDwgMSkge1xuICAgICAgICAgICAgICAgIGNsZWFySW50ZXJ2YWwodGhpcy50aW1lcik7XG4gICAgICAgICAgICAgICAgdGhpcy5zb3VuZEFsYXJtLnBsYXkoKTtcbiAgICAgICAgICAgICAgICB0aGlzLnNvdW5kVGljay5zdG9wKCk7XG4gICAgICAgICAgICAgICAgdGhpcy5hcHAuZGlzcGF0Y2hFdmVudCh0aGlzLmZhaWxFdmVudCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgIH1cblxuICAgIC8vIEhpbnQgQ29tcG9uZW50XG4gICAgY2xhc3MgSGludENvbXBvbmVudCB7XG4gICAgICAgIGNvbnN0cnVjdG9yKG1lc3NhZ2UpIHtcbiAgICAgICAgICAgIHRoaXMuY29udGFpbmVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2hpbnQnKTtcbiAgICAgICAgICAgIHRoaXMuaGludFRleHQgPSB0aGlzLmNvbnRhaW5lci5xdWVyeVNlbGVjdG9yKCdwI2hpbnQtdGV4dCcpO1xuICAgICAgICAgICAgdGhpcy5jbG9zZUJ0biA9IHRoaXMuY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoJ2J1dHRvbiNjbG9zZS1oaW50Jyk7XG5cbiAgICAgICAgICAgIHRoaXMuaGludFRleHQuaW5uZXJUZXh0ID0gbWVzc2FnZTtcblxuICAgICAgICAgICAgdGhpcy5pbml0KCk7XG4gICAgICAgIH1cblxuICAgICAgICBpbml0KCkge1xuICAgICAgICAgICAgbGV0IHNlbGYgPSB0aGlzO1xuICAgICAgICAgICAgdGhpcy5jbG9zZUJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBzZWxmLmhpZGUoKTtcbiAgICAgICAgICAgIH0pXG4gICAgICAgIH1cblxuICAgICAgICBzaG93KCkge1xuICAgICAgICAgICAgdGhpcy5jb250YWluZXIuY2xhc3NMaXN0LmFkZCgnc2hvdycpO1xuICAgICAgICB9XG4gICAgICAgIGhpZGUoKSB7XG4gICAgICAgICAgICB0aGlzLmNvbnRhaW5lci5jbGFzc0xpc3QucmVtb3ZlKCdzaG93Jyk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBQbGF5ZXIgQ29tcG9uZW50XG4gICAgY2xhc3MgUGxheWVyIHtcblxuICAgICAgICBjb25zdHJ1Y3RvcihwYXRoVG9GaWxlLCBsb29wID0gZmFsc2UpIHtcbiAgICAgICAgICAgIHRoaXMucGxheUJ0biA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwbGF5Jyk7XG4gICAgICAgICAgICB0aGlzLnN0b3BCdG4gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc3RvcCcpO1xuXG5cbiAgICAgICAgICAgIHRoaXMuc291bmQgPSBuZXcgQXVkaW8ocGF0aFRvRmlsZSk7XG4gICAgICAgICAgICB0aGlzLnNvdW5kLmxvb3AgPSBsb29wO1xuXG4gICAgICAgICAgICB0aGlzLmluaXQoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGluaXQoKSB7XG4gICAgICAgICAgICBsZXQgc2VsZiA9IHRoaXM7XG4gICAgICAgICAgICB0aGlzLnBsYXlCdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgc2VsZi5wbGF5KCk7XG4gICAgICAgICAgICAgICAgc2VsZi5zaG93U3RvcEJ0bigpO1xuICAgICAgICAgICAgICAgIHNlbGYuaGlkZVBsYXlCdG4oKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdGhpcy5zdG9wQnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHNlbGYuc3RvcCgpXG4gICAgICAgICAgICAgICAgc2VsZi5zaG93UGxheUJ0bigpO1xuICAgICAgICAgICAgICAgIHNlbGYuaGlkZVN0b3BCdG4oKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgcGxheSgpIHtcbiAgICAgICAgICAgIHRoaXMuc291bmQucGxheSgpO1xuICAgICAgICB9XG5cbiAgICAgICAgcGF1c2UoKSB7XG4gICAgICAgICAgICB0aGlzLnNvdW5kLnBhdXNlKCk7XG4gICAgICAgIH1cblxuICAgICAgICBzdG9wKCkge1xuICAgICAgICAgICAgdGhpcy5zb3VuZC5wYXVzZSgpO1xuICAgICAgICAgICAgdGhpcy5zb3VuZC5jdXJyZW50VGltZSA9IDA7XG4gICAgICAgIH1cblxuICAgICAgICBzaG93UGxheUJ0bigpIHtcbiAgICAgICAgICAgIHRoaXMucGxheUJ0bi5jbGFzc0xpc3QuYWRkKCdzaG93Jyk7XG4gICAgICAgIH1cblxuICAgICAgICBoaWRlUGxheUJ0bigpIHtcbiAgICAgICAgICAgIHRoaXMucGxheUJ0bi5jbGFzc0xpc3QucmVtb3ZlKCdzaG93Jyk7XG4gICAgICAgIH1cblxuICAgICAgICBzaG93U3RvcEJ0bigpIHtcbiAgICAgICAgICAgIHRoaXMuc3RvcEJ0bi5jbGFzc0xpc3QuYWRkKCdzaG93Jyk7XG4gICAgICAgIH1cblxuICAgICAgICBoaWRlU3RvcEJ0bigpIHtcbiAgICAgICAgICAgIHRoaXMuc3RvcEJ0bi5jbGFzc0xpc3QucmVtb3ZlKCdzaG93Jyk7XG4gICAgICAgIH1cblxuICAgICAgICBpc1BsYXlpbmcobmFtZSkge1xuICAgICAgICAgICAgcmV0dXJuICF0aGlzLnNvdW5kLnBhdXNlZDtcbiAgICAgICAgfVxuXG4gICAgfVxuXG5cblxuXG5cbiAgICBuZXcgR2FtZSgpO1xuXG59KTsiXX0=
