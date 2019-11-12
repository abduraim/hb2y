document.addEventListener("DOMContentLoaded", function(event) {



    const Steps = [
        {},
        {
            question: 'Итак, твое первое задание. Искать конверт нужно там, где ты готовишь отличнейшую лапшу, он рядом с вилкой и ножом.',
            answer: '258',
            hint: 'Конверт в ящике стола, на кухне',
            successMessage: 'Дашулька, спасибо за отличные и вкусных блюда, которые ты для нас готовишь! Твой подарок в столе, открой дверцы.',
            timeOver: 2,
        },
        {
            question: 'Следующий конверт находится там, где ты поддерживаешь жизнь тем, кого дарят твои клиенты любимым людям.',
            answer: '555',
            hint: 'Это цветы, которые ты выращиваешь',
            successMessage: 'Спасибо за красоту, которую ты приносишь в этот мир, подарок ищи в шкафу ванной комнаты.',
            timeOver: 30,
        },
        {
            question: 'Поторопись к следующему конверту, он находится у хорошего кучерявого человека, живущего по соседству. Твой пароль - "Хочу халву ем, хочу пряники"',
            answer: '333',
            hint: 'Это Ирина',
            successMessage: 'Спасибо за твое общение, за новости и идеи, которыми ты делишься! Подарок в шкафу (в общем коридоре)',
            timeOver: 15,
        },
        {
            question: 'Следующий конверт ты найдешь там, куда попадают твои носочки после стирки.',
            answer: '157',
            hint: 'После того, как они высохли',
            successMessage: 'Спасибо за чистоту и порядок, которые ты для нас поддерживаешь! Твой следующий подарок в антресоли!',
            timeOver: 15,
        },
        {
            question: 'Итак, последнее задание. Ответ прячется в мешке набитом гусиными волосами.',
            answer: '369',
            hint: 'Это подушка',
            successMessage: 'Спасибо за любовь и ласку, которыми ты нас согреваешь! Твой подарок под матрасом.',
            timeOver: 15,
        },
    ];
    const Setup = {
        debug: true,
        sounds: {
            'dasha': '/assets/sounds/dasha.mp3',
            'applause': '/assets/sounds/applause.mp3',
            'fireworks': '/assets/sounds/fireworks.mp3',
            'alarm': '/assets/sounds/alarm.mp3',
            'tick': '/assets/sounds/tick.mp3',
        },
        welcomeMessage: [
            'Привет, Дашулька! Сегодня твой день рождения, а в день рождения принято получать подарки.',
            'Добро пожаловать в приключение, Даша-путешественница! На твоём пути будут задания на поиск конвертов. В конвертах будет число, которое тебе нужно ввести. После этого ты узнаешь, где забрать подарок. Поехали?',
        ],
    };



    class Game {

        constructor() {

            this.app = document.getElementById('app');

            // Screens
            this.loadingScreen = document.getElementById('loading');
            this.pyroScreen = document.getElementById('pyro');



            // Buttons







            // Components
            this.FullscreenComponent = new FullscreenComponent();
            this.WelcomeComponent = new Welcome();

            this.CommonTimerComponent = new CommonTimerComponent();

            this.QuestComponent = new QuestComponent();






            //this.MessageBox = new MessageBox();

            this.musicDasha = new Player(Setup.sounds.dasha);




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

            });

            // Quest Done
            this.app.addEventListener('eventQuestSuccess', function () {

                console.log('Game Over!!!');

            });

        }

        // Start The Game!
        startGame() {
            if (!Setup.debug) {
                this.musicDasha.play();
            }
            this.CommonTimer.start();
            this.StepFrame.showStep(this.currentStep);
        }

        //Loading
        showLoading() {
            this.loadingScreen.classList.add('show');
        }
        hideLoading() {
            this.loadingScreen.classList.remove('show');
        }

        //Pyro
        showPyro() {
            this.pyroScreen.classList.add('show');
        }
        hidePyro() {
            this.pyroScreen.classList.remove('show');
        }
        volleyPyro() {
            let self = this;
            this.showPyro();
            setTimeout(function () {
                self.hidePyro();
            }, 3000);
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

    // CommonTime Class
    class CommonTimerComponent {

        constructor() {
            this.currentSeconds = 0;
        }

        start() {
            let self = this;
            this.timer = setInterval(function () {
                self.currentSeconds ++;
            }, 1000);
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

            this.successMessage.classList.add('show');

        }

        nextStep() {
            this.stepNumber++;
            if (this.stepNumber >= Steps.length) {
                this.app.dispatchEvent(this.succesEvent);
            } else {
                this.fillFields();
                this.Timer.start();
            }
        }

        fillFields() {
            this.question = Steps[this.stepNumber].question;
            this.text.innerText = this.question;
            this.answer = Steps[this.stepNumber].answer;

            this.successMessageText.innerText = Steps[this.stepNumber].successMessage;

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
            this.init();
        }

        init() {

            this.currentMessage = 0;
            this.text.innerText = Setup.welcomeMessage[this.currentMessage];

            let self = this;
            this.nextBtn.addEventListener('click', function () {
                self.nextMessage();
            });
        }

        nextMessage() {
            this.currentMessage++;
            if (this.currentMessage >= Setup.welcomeMessage.length) {
                this.app.dispatchEvent(this.eventDone);
            } else {
                this.text.innerText = Setup.welcomeMessage[this.currentMessage];
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
    





    // class MessageBox {
    //
    //     constructor() {
    //         this.container = document.getElementById('message');
    //         this.message = this.container.querySelector('.message');
    //         this.okBtn = this.container.querySelector('#message-ok')
    //         this.init();
    //     }
    //
    //     init() {
    //         let self = this;
    //         this.okBtn.addEventListener('click', function () {
    //             self.hide();
    //         });
    //     }
    //
    //     setMessage(message) {
    //         this.message.innerHTML = message;
    //     }
    //
    //     show() {
    //         this.container.classList.add('show');
    //     }
    //
    //     hide() {
    //         this.container.classList.remove('show');
    //     }
    //
    // }



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





    class Timer {

        constructor(timeOver) {

            this.app = document.getElementById('app');
            this.container = document.getElementById('timer');
            this.availableSeconds = timeOver;

            this.showTimerValue();

            this.soundTick = new Player(Setup.sounds.tick, true);
            this.soundAlarm = new Player(Setup.sounds.alarm);

            this.failEvent = new Event('failTimer');

            this.secondsToDanger = 10;

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


    // Helpers
    //Text
    function textAnimation(element, speed) {
        let text = element.innerText;
        element.innerText = '';
        let i = 0;
        let timer = setInterval(function () {
            if (i < text.length) {
                element.append(text.charAt(i));
                i++;
            } else {
                clearInterval(timer);
            }
        }, 40);
        return speed * text.length;
    }



    new Game(Steps);

});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJzY3JpcHRzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcIkRPTUNvbnRlbnRMb2FkZWRcIiwgZnVuY3Rpb24oZXZlbnQpIHtcblxuXG5cbiAgICBjb25zdCBTdGVwcyA9IFtcbiAgICAgICAge30sXG4gICAgICAgIHtcbiAgICAgICAgICAgIHF1ZXN0aW9uOiAn0JjRgtCw0LosINGC0LLQvtC1INC/0LXRgNCy0L7QtSDQt9Cw0LTQsNC90LjQtS4g0JjRgdC60LDRgtGMINC60L7QvdCy0LXRgNGCINC90YPQttC90L4g0YLQsNC8LCDQs9C00LUg0YLRiyDQs9C+0YLQvtCy0LjRiNGMINC+0YLQu9C40YfQvdC10LnRiNGD0Y4g0LvQsNC/0YjRgywg0L7QvSDRgNGP0LTQvtC8INGBINCy0LjQu9C60L7QuSDQuCDQvdC+0LbQvtC8LicsXG4gICAgICAgICAgICBhbnN3ZXI6ICcyNTgnLFxuICAgICAgICAgICAgaGludDogJ9Ca0L7QvdCy0LXRgNGCINCyINGP0YnQuNC60LUg0YHRgtC+0LvQsCwg0L3QsCDQutGD0YXQvdC1JyxcbiAgICAgICAgICAgIHN1Y2Nlc3NNZXNzYWdlOiAn0JTQsNGI0YPQu9GM0LrQsCwg0YHQv9Cw0YHQuNCx0L4g0LfQsCDQvtGC0LvQuNGH0L3Ri9C1INC4INCy0LrRg9GB0L3Ri9GFINCx0LvRjtC00LAsINC60L7RgtC+0YDRi9C1INGC0Ysg0LTQu9GPINC90LDRgSDQs9C+0YLQvtCy0LjRiNGMISDQotCy0L7QuSDQv9C+0LTQsNGA0L7QuiDQsiDRgdGC0L7Qu9C1LCDQvtGC0LrRgNC+0Lkg0LTQstC10YDRhtGLLicsXG4gICAgICAgICAgICB0aW1lT3ZlcjogMixcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgcXVlc3Rpb246ICfQodC70LXQtNGD0Y7RidC40Lkg0LrQvtC90LLQtdGA0YIg0L3QsNGF0L7QtNC40YLRgdGPINGC0LDQvCwg0LPQtNC1INGC0Ysg0L/QvtC00LTQtdGA0LbQuNCy0LDQtdGI0Ywg0LbQuNC30L3RjCDRgtC10LwsINC60L7Qs9C+INC00LDRgNGP0YIg0YLQstC+0Lgg0LrQu9C40LXQvdGC0Ysg0LvRjtCx0LjQvNGL0Lwg0LvRjtC00Y/QvC4nLFxuICAgICAgICAgICAgYW5zd2VyOiAnNTU1JyxcbiAgICAgICAgICAgIGhpbnQ6ICfQrdGC0L4g0YbQstC10YLRiywg0LrQvtGC0L7RgNGL0LUg0YLRiyDQstGL0YDQsNGJ0LjQstCw0LXRiNGMJyxcbiAgICAgICAgICAgIHN1Y2Nlc3NNZXNzYWdlOiAn0KHQv9Cw0YHQuNCx0L4g0LfQsCDQutGA0LDRgdC+0YLRgywg0LrQvtGC0L7RgNGD0Y4g0YLRiyDQv9GA0LjQvdC+0YHQuNGI0Ywg0LIg0Y3RgtC+0YIg0LzQuNGALCDQv9C+0LTQsNGA0L7QuiDQuNGJ0Lgg0LIg0YjQutCw0YTRgyDQstCw0L3QvdC+0Lkg0LrQvtC80L3QsNGC0YsuJyxcbiAgICAgICAgICAgIHRpbWVPdmVyOiAzMCxcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgcXVlc3Rpb246ICfQn9C+0YLQvtGA0L7Qv9C40YHRjCDQuiDRgdC70LXQtNGD0Y7RidC10LzRgyDQutC+0L3QstC10YDRgtGDLCDQvtC9INC90LDRhdC+0LTQuNGC0YHRjyDRgyDRhdC+0YDQvtGI0LXQs9C+INC60YPRh9C10YDRj9Cy0L7Qs9C+INGH0LXQu9C+0LLQtdC60LAsINC20LjQstGD0YnQtdCz0L4g0L/QviDRgdC+0YHQtdC00YHRgtCy0YMuINCi0LLQvtC5INC/0LDRgNC+0LvRjCAtIFwi0KXQvtGH0YMg0YXQsNC70LLRgyDQtdC8LCDRhdC+0YfRgyDQv9GA0Y/QvdC40LrQuFwiJyxcbiAgICAgICAgICAgIGFuc3dlcjogJzMzMycsXG4gICAgICAgICAgICBoaW50OiAn0K3RgtC+INCY0YDQuNC90LAnLFxuICAgICAgICAgICAgc3VjY2Vzc01lc3NhZ2U6ICfQodC/0LDRgdC40LHQviDQt9CwINGC0LLQvtC1INC+0LHRidC10L3QuNC1LCDQt9CwINC90L7QstC+0YHRgtC4INC4INC40LTQtdC4LCDQutC+0YLQvtGA0YvQvNC4INGC0Ysg0LTQtdC70LjRiNGM0YHRjyEg0J/QvtC00LDRgNC+0Log0LIg0YjQutCw0YTRgyAo0LIg0L7QsdGJ0LXQvCDQutC+0YDQuNC00L7RgNC1KScsXG4gICAgICAgICAgICB0aW1lT3ZlcjogMTUsXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICAgIHF1ZXN0aW9uOiAn0KHQu9C10LTRg9GO0YnQuNC5INC60L7QvdCy0LXRgNGCINGC0Ysg0L3QsNC50LTQtdGI0Ywg0YLQsNC8LCDQutGD0LTQsCDQv9C+0L/QsNC00LDRjtGCINGC0LLQvtC4INC90L7RgdC+0YfQutC4INC/0L7RgdC70LUg0YHRgtC40YDQutC4LicsXG4gICAgICAgICAgICBhbnN3ZXI6ICcxNTcnLFxuICAgICAgICAgICAgaGludDogJ9Cf0L7RgdC70LUg0YLQvtCz0L4sINC60LDQuiDQvtC90Lgg0LLRi9GB0L7RhdC70LgnLFxuICAgICAgICAgICAgc3VjY2Vzc01lc3NhZ2U6ICfQodC/0LDRgdC40LHQviDQt9CwINGH0LjRgdGC0L7RgtGDINC4INC/0L7RgNGP0LTQvtC6LCDQutC+0YLQvtGA0YvQtSDRgtGLINC00LvRjyDQvdCw0YEg0L/QvtC00LTQtdGA0LbQuNCy0LDQtdGI0YwhINCi0LLQvtC5INGB0LvQtdC00YPRjtGJ0LjQuSDQv9C+0LTQsNGA0L7QuiDQsiDQsNC90YLRgNC10YHQvtC70LghJyxcbiAgICAgICAgICAgIHRpbWVPdmVyOiAxNSxcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgcXVlc3Rpb246ICfQmNGC0LDQuiwg0L/QvtGB0LvQtdC00L3QtdC1INC30LDQtNCw0L3QuNC1LiDQntGC0LLQtdGCINC/0YDRj9GH0LXRgtGB0Y8g0LIg0LzQtdGI0LrQtSDQvdCw0LHQuNGC0L7QvCDQs9GD0YHQuNC90YvQvNC4INCy0L7Qu9C+0YHQsNC80LguJyxcbiAgICAgICAgICAgIGFuc3dlcjogJzM2OScsXG4gICAgICAgICAgICBoaW50OiAn0K3RgtC+INC/0L7QtNGD0YjQutCwJyxcbiAgICAgICAgICAgIHN1Y2Nlc3NNZXNzYWdlOiAn0KHQv9Cw0YHQuNCx0L4g0LfQsCDQu9GO0LHQvtCy0Ywg0Lgg0LvQsNGB0LrRgywg0LrQvtGC0L7RgNGL0LzQuCDRgtGLINC90LDRgSDRgdC+0LPRgNC10LLQsNC10YjRjCEg0KLQstC+0Lkg0L/QvtC00LDRgNC+0Log0L/QvtC0INC80LDRgtGA0LDRgdC+0LwuJyxcbiAgICAgICAgICAgIHRpbWVPdmVyOiAxNSxcbiAgICAgICAgfSxcbiAgICBdO1xuICAgIGNvbnN0IFNldHVwID0ge1xuICAgICAgICBkZWJ1ZzogdHJ1ZSxcbiAgICAgICAgc291bmRzOiB7XG4gICAgICAgICAgICAnZGFzaGEnOiAnL2Fzc2V0cy9zb3VuZHMvZGFzaGEubXAzJyxcbiAgICAgICAgICAgICdhcHBsYXVzZSc6ICcvYXNzZXRzL3NvdW5kcy9hcHBsYXVzZS5tcDMnLFxuICAgICAgICAgICAgJ2ZpcmV3b3Jrcyc6ICcvYXNzZXRzL3NvdW5kcy9maXJld29ya3MubXAzJyxcbiAgICAgICAgICAgICdhbGFybSc6ICcvYXNzZXRzL3NvdW5kcy9hbGFybS5tcDMnLFxuICAgICAgICAgICAgJ3RpY2snOiAnL2Fzc2V0cy9zb3VuZHMvdGljay5tcDMnLFxuICAgICAgICB9LFxuICAgICAgICB3ZWxjb21lTWVzc2FnZTogW1xuICAgICAgICAgICAgJ9Cf0YDQuNCy0LXRgiwg0JTQsNGI0YPQu9GM0LrQsCEg0KHQtdCz0L7QtNC90Y8g0YLQstC+0Lkg0LTQtdC90Ywg0YDQvtC20LTQtdC90LjRjywg0LAg0LIg0LTQtdC90Ywg0YDQvtC20LTQtdC90LjRjyDQv9GA0LjQvdGP0YLQviDQv9C+0LvRg9GH0LDRgtGMINC/0L7QtNCw0YDQutC4LicsXG4gICAgICAgICAgICAn0JTQvtCx0YDQviDQv9C+0LbQsNC70L7QstCw0YLRjCDQsiDQv9GA0LjQutC70Y7Rh9C10L3QuNC1LCDQlNCw0YjQsC3Qv9GD0YLQtdGI0LXRgdGC0LLQtdC90L3QuNGG0LAhINCd0LAg0YLQstC+0ZHQvCDQv9GD0YLQuCDQsdGD0LTRg9GCINC30LDQtNCw0L3QuNGPINC90LAg0L/QvtC40YHQuiDQutC+0L3QstC10YDRgtC+0LIuINCSINC60L7QvdCy0LXRgNGC0LDRhSDQsdGD0LTQtdGCINGH0LjRgdC70L4sINC60L7RgtC+0YDQvtC1INGC0LXQsdC1INC90YPQttC90L4g0LLQstC10YHRgtC4LiDQn9C+0YHQu9C1INGN0YLQvtCz0L4g0YLRiyDRg9C30L3QsNC10YjRjCwg0LPQtNC1INC30LDQsdGA0LDRgtGMINC/0L7QtNCw0YDQvtC6LiDQn9C+0LXRhdCw0LvQuD8nLFxuICAgICAgICBdLFxuICAgIH07XG5cblxuXG4gICAgY2xhc3MgR2FtZSB7XG5cbiAgICAgICAgY29uc3RydWN0b3IoKSB7XG5cbiAgICAgICAgICAgIHRoaXMuYXBwID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2FwcCcpO1xuXG4gICAgICAgICAgICAvLyBTY3JlZW5zXG4gICAgICAgICAgICB0aGlzLmxvYWRpbmdTY3JlZW4gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbG9hZGluZycpO1xuICAgICAgICAgICAgdGhpcy5weXJvU2NyZWVuID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3B5cm8nKTtcblxuXG5cbiAgICAgICAgICAgIC8vIEJ1dHRvbnNcblxuXG5cblxuXG5cblxuICAgICAgICAgICAgLy8gQ29tcG9uZW50c1xuICAgICAgICAgICAgdGhpcy5GdWxsc2NyZWVuQ29tcG9uZW50ID0gbmV3IEZ1bGxzY3JlZW5Db21wb25lbnQoKTtcbiAgICAgICAgICAgIHRoaXMuV2VsY29tZUNvbXBvbmVudCA9IG5ldyBXZWxjb21lKCk7XG5cbiAgICAgICAgICAgIHRoaXMuQ29tbW9uVGltZXJDb21wb25lbnQgPSBuZXcgQ29tbW9uVGltZXJDb21wb25lbnQoKTtcblxuICAgICAgICAgICAgdGhpcy5RdWVzdENvbXBvbmVudCA9IG5ldyBRdWVzdENvbXBvbmVudCgpO1xuXG5cblxuXG5cblxuICAgICAgICAgICAgLy90aGlzLk1lc3NhZ2VCb3ggPSBuZXcgTWVzc2FnZUJveCgpO1xuXG4gICAgICAgICAgICB0aGlzLm11c2ljRGFzaGEgPSBuZXcgUGxheWVyKFNldHVwLnNvdW5kcy5kYXNoYSk7XG5cblxuXG5cbiAgICAgICAgICAgIC8vIEJpbmQgRXZlbnRzXG4gICAgICAgICAgICB0aGlzLmluaXRFdmVudHMoKTtcblxuICAgICAgICAgICAgLy8gSGlkZSBsb2FkaW5nIGJlZm9yZSBsb2FkaW5nXG4gICAgICAgICAgICB0aGlzLmhpZGVMb2FkaW5nKCk7XG5cbiAgICAgICAgfVxuXG4gICAgICAgIC8vIEJpbmcgRXZlbnRzXG4gICAgICAgIGluaXRFdmVudHMoKSB7XG4gICAgICAgICAgICBsZXQgc2VsZiA9IHRoaXM7XG5cbiAgICAgICAgICAgIC8vIEZ1bGxzY3JlZW4gRG9uZVxuICAgICAgICAgICAgdGhpcy5hcHAuYWRkRXZlbnRMaXN0ZW5lcignZnVsbHNjcmVlbkRvbmUnLCBmdW5jdGlvbiAoKSB7XG5cbiAgICAgICAgICAgICAgICBzZWxmLldlbGNvbWVDb21wb25lbnQuc2hvdygpO1xuXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgdGhpcy5hcHAuYWRkRXZlbnRMaXN0ZW5lcignd2VsY29tZURvbmUnLCBmdW5jdGlvbiAoKSB7XG5cbiAgICAgICAgICAgICAgICBzZWxmLldlbGNvbWVDb21wb25lbnQuaGlkZSgpO1xuICAgICAgICAgICAgICAgIHNlbGYuUXVlc3RDb21wb25lbnQuc2hvdygpO1xuXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgLy8gUXVlc3QgRG9uZVxuICAgICAgICAgICAgdGhpcy5hcHAuYWRkRXZlbnRMaXN0ZW5lcignZXZlbnRRdWVzdFN1Y2Nlc3MnLCBmdW5jdGlvbiAoKSB7XG5cbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnR2FtZSBPdmVyISEhJyk7XG5cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgIH1cblxuICAgICAgICAvLyBTdGFydCBUaGUgR2FtZSFcbiAgICAgICAgc3RhcnRHYW1lKCkge1xuICAgICAgICAgICAgaWYgKCFTZXR1cC5kZWJ1Zykge1xuICAgICAgICAgICAgICAgIHRoaXMubXVzaWNEYXNoYS5wbGF5KCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLkNvbW1vblRpbWVyLnN0YXJ0KCk7XG4gICAgICAgICAgICB0aGlzLlN0ZXBGcmFtZS5zaG93U3RlcCh0aGlzLmN1cnJlbnRTdGVwKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vTG9hZGluZ1xuICAgICAgICBzaG93TG9hZGluZygpIHtcbiAgICAgICAgICAgIHRoaXMubG9hZGluZ1NjcmVlbi5jbGFzc0xpc3QuYWRkKCdzaG93Jyk7XG4gICAgICAgIH1cbiAgICAgICAgaGlkZUxvYWRpbmcoKSB7XG4gICAgICAgICAgICB0aGlzLmxvYWRpbmdTY3JlZW4uY2xhc3NMaXN0LnJlbW92ZSgnc2hvdycpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy9QeXJvXG4gICAgICAgIHNob3dQeXJvKCkge1xuICAgICAgICAgICAgdGhpcy5weXJvU2NyZWVuLmNsYXNzTGlzdC5hZGQoJ3Nob3cnKTtcbiAgICAgICAgfVxuICAgICAgICBoaWRlUHlybygpIHtcbiAgICAgICAgICAgIHRoaXMucHlyb1NjcmVlbi5jbGFzc0xpc3QucmVtb3ZlKCdzaG93Jyk7XG4gICAgICAgIH1cbiAgICAgICAgdm9sbGV5UHlybygpIHtcbiAgICAgICAgICAgIGxldCBzZWxmID0gdGhpcztcbiAgICAgICAgICAgIHRoaXMuc2hvd1B5cm8oKTtcbiAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHNlbGYuaGlkZVB5cm8oKTtcbiAgICAgICAgICAgIH0sIDMwMDApO1xuICAgICAgICB9XG5cbiAgICB9XG5cbiAgICAvLyBGdWxsc2NyZWVuIENsYXNzXG4gICAgY2xhc3MgRnVsbHNjcmVlbkNvbXBvbmVudCB7XG5cbiAgICAgICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgICAgICB0aGlzLmFwcCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdhcHAnKTtcbiAgICAgICAgICAgIHRoaXMuY29udGFpbmVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2Z1bGxzY3JlZW4nKTtcbiAgICAgICAgICAgIHRoaXMuY29udGFpbmVyLmNsYXNzTGlzdC5hZGQoJ3Nob3cnKTtcbiAgICAgICAgICAgIHRoaXMuYnRuID0gdGhpcy5jb250YWluZXIucXVlcnlTZWxlY3RvcignYnV0dG9uJyk7XG4gICAgICAgICAgICB0aGlzLmZ1bGxzY3JlZW5Eb25lID0gbmV3IEV2ZW50KCdmdWxsc2NyZWVuRG9uZScpO1xuICAgICAgICAgICAgbGV0IHNlbGYgPSB0aGlzO1xuICAgICAgICAgICAgdGhpcy5idG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgaWYgKCFTZXR1cC5kZWJ1Zykge1xuICAgICAgICAgICAgICAgICAgICBzZWxmLmxhdW5jaEZ1bGxTY3JlZW4oZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgc2VsZi5idG4uY2xhc3NMaXN0LmFkZCgnc29mdF9oaWRlJyk7XG4gICAgICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIHNlbGYuY29udGFpbmVyLmNsYXNzTGlzdC5yZW1vdmUoJ3Nob3cnKTtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5hcHAuZGlzcGF0Y2hFdmVudChzZWxmLmZ1bGxzY3JlZW5Eb25lKTtcbiAgICAgICAgICAgICAgICB9LCAxMDAwKTtcbiAgICAgICAgICAgIH0pXG4gICAgICAgIH1cblxuICAgICAgICBsYXVuY2hGdWxsU2NyZWVuKGVsZW1lbnQpIHtcbiAgICAgICAgICAgIGlmKGVsZW1lbnQucmVxdWVzdEZ1bGxTY3JlZW4pIHtcbiAgICAgICAgICAgICAgICBlbGVtZW50LnJlcXVlc3RGdWxsU2NyZWVuKCk7XG4gICAgICAgICAgICB9IGVsc2UgaWYoZWxlbWVudC5tb3pSZXF1ZXN0RnVsbFNjcmVlbikge1xuICAgICAgICAgICAgICAgIGVsZW1lbnQubW96UmVxdWVzdEZ1bGxTY3JlZW4oKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZihlbGVtZW50LndlYmtpdFJlcXVlc3RGdWxsU2NyZWVuKSB7XG4gICAgICAgICAgICAgICAgZWxlbWVudC53ZWJraXRSZXF1ZXN0RnVsbFNjcmVlbigpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgY2FuY2VsRnVsbHNjcmVlbigpIHtcbiAgICAgICAgICAgIGlmKGRvY3VtZW50LmNhbmNlbEZ1bGxTY3JlZW4pIHtcbiAgICAgICAgICAgICAgICBkb2N1bWVudC5jYW5jZWxGdWxsU2NyZWVuKCk7XG4gICAgICAgICAgICB9IGVsc2UgaWYoZG9jdW1lbnQubW96Q2FuY2VsRnVsbFNjcmVlbikge1xuICAgICAgICAgICAgICAgIGRvY3VtZW50Lm1vekNhbmNlbEZ1bGxTY3JlZW4oKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZihkb2N1bWVudC53ZWJraXRDYW5jZWxGdWxsU2NyZWVuKSB7XG4gICAgICAgICAgICAgICAgZG9jdW1lbnQud2Via2l0Q2FuY2VsRnVsbFNjcmVlbigpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICB9XG5cbiAgICAvLyBDb21tb25UaW1lIENsYXNzXG4gICAgY2xhc3MgQ29tbW9uVGltZXJDb21wb25lbnQge1xuXG4gICAgICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICAgICAgdGhpcy5jdXJyZW50U2Vjb25kcyA9IDA7XG4gICAgICAgIH1cblxuICAgICAgICBzdGFydCgpIHtcbiAgICAgICAgICAgIGxldCBzZWxmID0gdGhpcztcbiAgICAgICAgICAgIHRoaXMudGltZXIgPSBzZXRJbnRlcnZhbChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgc2VsZi5jdXJyZW50U2Vjb25kcyArKztcbiAgICAgICAgICAgIH0sIDEwMDApO1xuICAgICAgICB9XG5cbiAgICAgICAgc3RvcCgpIHtcbiAgICAgICAgICAgIGNsZWFySW50ZXJ2YWwodGhpcy50aW1lcik7XG4gICAgICAgIH1cblxuICAgICAgICBnZXRDb21tb25UaW1lKCkge1xuXG4gICAgICAgICAgICBsZXQgbWludXRlcyA9IE1hdGguZmxvb3IodGhpcy5jdXJyZW50U2Vjb25kcyAvIDYwKTtcbiAgICAgICAgICAgIGxldCBzZWNvbmRzID0gdGhpcy5jdXJyZW50U2Vjb25kcyAlIDYwO1xuXG4gICAgICAgICAgICBpZiAobWludXRlcyA8IDEwKSB7XG4gICAgICAgICAgICAgICAgbWludXRlcyA9ICcwJyArIG1pbnV0ZXM7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChzZWNvbmRzIDwgMTApIHtcbiAgICAgICAgICAgICAgICBzZWNvbmRzID0gJzAnICsgc2Vjb25kcztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIG1pbnV0ZXMgKyAnOicgKyBzZWNvbmRzOztcbiAgICAgICAgfVxuXG4gICAgfVxuXG4gICAgLy8gUWVzdFN0ZXAgQ2xhc3NcbiAgICBjbGFzcyBRdWVzdENvbXBvbmVudCB7XG5cbiAgICAgICAgY29uc3RydWN0b3IoKSB7XG5cbiAgICAgICAgICAgIHRoaXMuYXBwID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2FwcCcpO1xuICAgICAgICAgICAgdGhpcy5jb250YWluZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncXVlc3QnKTtcblxuICAgICAgICAgICAgdGhpcy50ZXh0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3RleHQnKTtcbiAgICAgICAgICAgIHRoaXMuaW5wdXQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYW5zd2VyLWlucHV0Jyk7XG5cbiAgICAgICAgICAgIHRoaXMuc3VjY2Vzc01lc3NhZ2UgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc3VjY2Vzcy1tZXNzYWdlJyk7XG4gICAgICAgICAgICB0aGlzLnN1Y2Nlc3NNZXNzYWdlVGV4dCA9IHRoaXMuc3VjY2Vzc01lc3NhZ2UucXVlcnlTZWxlY3RvcigncCN0ZXh0LXN1Y2Nlc3MtbWVzc2FnZScpO1xuICAgICAgICAgICAgdGhpcy5uZXh0UXVlc3RCdG4gPSB0aGlzLnN1Y2Nlc3NNZXNzYWdlLnF1ZXJ5U2VsZWN0b3IoJ2J1dHRvbiNuZXh0LXF1ZXN0LWJ0bicpO1xuXG4gICAgICAgICAgICB0aGlzLmhpbnRCdG4gPSB0aGlzLmNvbnRhaW5lci5xdWVyeVNlbGVjdG9yKCdidXR0b24jaGludC1idG4nKTtcblxuICAgICAgICAgICAgdGhpcy5zdWNjZXNFdmVudCA9IG5ldyBFdmVudCgnZXZlbnRRdWVzdFN1Y2Nlc3MnKTtcblxuICAgICAgICAgICAgdGhpcy5pbml0KCk7XG5cbiAgICAgICAgfVxuXG4gICAgICAgIGluaXQoKSB7XG5cbiAgICAgICAgICAgIHRoaXMuc3RlcE51bWJlciA9IDE7XG5cbiAgICAgICAgICAgIHRoaXMuZmlsbEZpZWxkcygpO1xuXG4gICAgICAgICAgICBsZXQgc2VsZiA9IHRoaXM7XG5cbiAgICAgICAgICAgIHRoaXMuaW5wdXQuc2V0QXR0cmlidXRlKCdtYXhsZW5ndGgnLCB0aGlzLmFuc3dlci5sZW5ndGgpO1xuXG4gICAgICAgICAgICB0aGlzLmlucHV0LmFkZEV2ZW50TGlzdGVuZXIoJ2lucHV0JywgZnVuY3Rpb24gKCkge1xuXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMudmFsdWUubGVuZ3RoID09IHNlbGYuYW5zd2VyLmxlbmd0aCkge1xuXG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLnZhbHVlID09IHNlbGYuYW5zd2VyKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYucmlnaHRBbnN3ZXIoKTtcblxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnd3JvbmcuLi4nKTtcblxuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICB0aGlzLmhpbnRCdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgc2VsZi5IaW50Q29tcG9uZW50LnNob3coKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICB0aGlzLm5leHRRdWVzdEJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uICgpIHtcblxuICAgICAgICAgICAgICAgIHNlbGYuc3VjY2Vzc01lc3NhZ2UuY2xhc3NMaXN0LnJlbW92ZSgnc2hvdycpO1xuXG4gICAgICAgICAgICAgICAgc2VsZi5uZXh0U3RlcCgpO1xuXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgdGhpcy5hcHAuYWRkRXZlbnRMaXN0ZW5lcignZmFpbFRpbWVyJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHNlbGYuaGludEJ0bi5jbGFzc0xpc3QuYWRkKCdzaG93Jyk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICB9XG5cbiAgICAgICAgcmlnaHRBbnN3ZXIoKSB7XG5cbiAgICAgICAgICAgIHRoaXMuVGltZXIuc3RvcCgpO1xuXG4gICAgICAgICAgICB0aGlzLnN1Y2Nlc3NNZXNzYWdlLmNsYXNzTGlzdC5hZGQoJ3Nob3cnKTtcblxuICAgICAgICB9XG5cbiAgICAgICAgbmV4dFN0ZXAoKSB7XG4gICAgICAgICAgICB0aGlzLnN0ZXBOdW1iZXIrKztcbiAgICAgICAgICAgIGlmICh0aGlzLnN0ZXBOdW1iZXIgPj0gU3RlcHMubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5hcHAuZGlzcGF0Y2hFdmVudCh0aGlzLnN1Y2Nlc0V2ZW50KTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5maWxsRmllbGRzKCk7XG4gICAgICAgICAgICAgICAgdGhpcy5UaW1lci5zdGFydCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgZmlsbEZpZWxkcygpIHtcbiAgICAgICAgICAgIHRoaXMucXVlc3Rpb24gPSBTdGVwc1t0aGlzLnN0ZXBOdW1iZXJdLnF1ZXN0aW9uO1xuICAgICAgICAgICAgdGhpcy50ZXh0LmlubmVyVGV4dCA9IHRoaXMucXVlc3Rpb247XG4gICAgICAgICAgICB0aGlzLmFuc3dlciA9IFN0ZXBzW3RoaXMuc3RlcE51bWJlcl0uYW5zd2VyO1xuXG4gICAgICAgICAgICB0aGlzLnN1Y2Nlc3NNZXNzYWdlVGV4dC5pbm5lclRleHQgPSBTdGVwc1t0aGlzLnN0ZXBOdW1iZXJdLnN1Y2Nlc3NNZXNzYWdlO1xuXG4gICAgICAgICAgICB0aGlzLnRpbWVyT3ZlciA9IFN0ZXBzW3RoaXMuc3RlcE51bWJlcl0udGltZU92ZXI7XG4gICAgICAgICAgICB0aGlzLlRpbWVyID0gbmV3IFRpbWVyKHRoaXMudGltZXJPdmVyKTtcblxuICAgICAgICAgICAgdGhpcy5oaW50VGV4dCA9IFN0ZXBzW3RoaXMuc3RlcE51bWJlcl0uaGludDtcbiAgICAgICAgICAgIHRoaXMuSGludENvbXBvbmVudCA9IG5ldyBIaW50Q29tcG9uZW50KHRoaXMuaGludFRleHQpO1xuXG4gICAgICAgICAgICB0aGlzLmlucHV0LnZhbHVlID0gJyc7XG4gICAgICAgICAgICB0aGlzLmhpbnRCdG4uY2xhc3NMaXN0LnJlbW92ZSgnc2hvdycpO1xuICAgICAgICB9XG5cbiAgICAgICAgc2hvdygpIHtcbiAgICAgICAgICAgIHRoaXMuY29udGFpbmVyLmNsYXNzTGlzdC5hZGQoJ3Nob3cnKTtcbiAgICAgICAgICAgIHRoaXMuaW5wdXQuY2xhc3NMaXN0LmFkZCgnc2hvdycpO1xuICAgICAgICAgICAgdGhpcy5UaW1lci5zdGFydCgpO1xuICAgICAgICB9XG5cblxuXG4gICAgfVxuXG4gICAgLy8gV2VsY29tZSBNZXNzYWdlc1xuICAgIGNsYXNzIFdlbGNvbWUge1xuICAgICAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgICAgIHRoaXMuYXBwID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2FwcCcpO1xuICAgICAgICAgICAgdGhpcy5jb250YWluZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnd2VsY29tZScpO1xuICAgICAgICAgICAgdGhpcy5hcHBlYXJ0aW5CbG9jayA9IHRoaXMuY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoJyN3ZWxjb21lLXRleHQnKTtcbiAgICAgICAgICAgIHRoaXMudGV4dCA9IHRoaXMuY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoJyN3ZWxjb21lLXRleHQgPiBwJyk7XG4gICAgICAgICAgICB0aGlzLm5leHRCdG4gPSB0aGlzLmNvbnRhaW5lci5xdWVyeVNlbGVjdG9yKCdidXR0b24jd2VsY29tZS1uZXh0LWJ0bicpO1xuICAgICAgICAgICAgdGhpcy5ldmVudERvbmUgPSBuZXcgRXZlbnQoJ3dlbGNvbWVEb25lJyk7XG4gICAgICAgICAgICB0aGlzLmluaXQoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGluaXQoKSB7XG5cbiAgICAgICAgICAgIHRoaXMuY3VycmVudE1lc3NhZ2UgPSAwO1xuICAgICAgICAgICAgdGhpcy50ZXh0LmlubmVyVGV4dCA9IFNldHVwLndlbGNvbWVNZXNzYWdlW3RoaXMuY3VycmVudE1lc3NhZ2VdO1xuXG4gICAgICAgICAgICBsZXQgc2VsZiA9IHRoaXM7XG4gICAgICAgICAgICB0aGlzLm5leHRCdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgc2VsZi5uZXh0TWVzc2FnZSgpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICBuZXh0TWVzc2FnZSgpIHtcbiAgICAgICAgICAgIHRoaXMuY3VycmVudE1lc3NhZ2UrKztcbiAgICAgICAgICAgIGlmICh0aGlzLmN1cnJlbnRNZXNzYWdlID49IFNldHVwLndlbGNvbWVNZXNzYWdlLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgIHRoaXMuYXBwLmRpc3BhdGNoRXZlbnQodGhpcy5ldmVudERvbmUpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLnRleHQuaW5uZXJUZXh0ID0gU2V0dXAud2VsY29tZU1lc3NhZ2VbdGhpcy5jdXJyZW50TWVzc2FnZV07XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBzaG93KCkge1xuICAgICAgICAgICAgdGhpcy5jb250YWluZXIuY2xhc3NMaXN0LmFkZCgnc2hvdycpO1xuICAgICAgICAgICAgdGhpcy5hcHBlYXJ0aW5CbG9jay5jbGFzc0xpc3QuYWRkKCdzaG93Jyk7XG4gICAgICAgICAgICB0aGlzLm5leHRCdG4uY2xhc3NMaXN0LmFkZCgnc2hvdycpO1xuICAgICAgICB9XG5cbiAgICAgICAgaGlkZSgpIHtcbiAgICAgICAgICAgIHRoaXMuY29udGFpbmVyLmNsYXNzTGlzdC5yZW1vdmUoJ3Nob3cnKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBcblxuXG5cblxuXG4gICAgLy8gY2xhc3MgTWVzc2FnZUJveCB7XG4gICAgLy9cbiAgICAvLyAgICAgY29uc3RydWN0b3IoKSB7XG4gICAgLy8gICAgICAgICB0aGlzLmNvbnRhaW5lciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdtZXNzYWdlJyk7XG4gICAgLy8gICAgICAgICB0aGlzLm1lc3NhZ2UgPSB0aGlzLmNvbnRhaW5lci5xdWVyeVNlbGVjdG9yKCcubWVzc2FnZScpO1xuICAgIC8vICAgICAgICAgdGhpcy5va0J0biA9IHRoaXMuY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoJyNtZXNzYWdlLW9rJylcbiAgICAvLyAgICAgICAgIHRoaXMuaW5pdCgpO1xuICAgIC8vICAgICB9XG4gICAgLy9cbiAgICAvLyAgICAgaW5pdCgpIHtcbiAgICAvLyAgICAgICAgIGxldCBzZWxmID0gdGhpcztcbiAgICAvLyAgICAgICAgIHRoaXMub2tCdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbiAoKSB7XG4gICAgLy8gICAgICAgICAgICAgc2VsZi5oaWRlKCk7XG4gICAgLy8gICAgICAgICB9KTtcbiAgICAvLyAgICAgfVxuICAgIC8vXG4gICAgLy8gICAgIHNldE1lc3NhZ2UobWVzc2FnZSkge1xuICAgIC8vICAgICAgICAgdGhpcy5tZXNzYWdlLmlubmVySFRNTCA9IG1lc3NhZ2U7XG4gICAgLy8gICAgIH1cbiAgICAvL1xuICAgIC8vICAgICBzaG93KCkge1xuICAgIC8vICAgICAgICAgdGhpcy5jb250YWluZXIuY2xhc3NMaXN0LmFkZCgnc2hvdycpO1xuICAgIC8vICAgICB9XG4gICAgLy9cbiAgICAvLyAgICAgaGlkZSgpIHtcbiAgICAvLyAgICAgICAgIHRoaXMuY29udGFpbmVyLmNsYXNzTGlzdC5yZW1vdmUoJ3Nob3cnKTtcbiAgICAvLyAgICAgfVxuICAgIC8vXG4gICAgLy8gfVxuXG5cblxuICAgIGNsYXNzIFBsYXllciB7XG5cbiAgICAgICAgY29uc3RydWN0b3IocGF0aFRvRmlsZSwgbG9vcCA9IGZhbHNlKSB7XG4gICAgICAgICAgICB0aGlzLnBsYXlCdG4gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncGxheScpO1xuICAgICAgICAgICAgdGhpcy5zdG9wQnRuID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3N0b3AnKTtcblxuXG4gICAgICAgICAgICB0aGlzLnNvdW5kID0gbmV3IEF1ZGlvKHBhdGhUb0ZpbGUpO1xuICAgICAgICAgICAgdGhpcy5zb3VuZC5sb29wID0gbG9vcDtcblxuICAgICAgICAgICAgdGhpcy5pbml0KCk7XG4gICAgICAgIH1cblxuICAgICAgICBpbml0KCkge1xuICAgICAgICAgICAgbGV0IHNlbGYgPSB0aGlzO1xuICAgICAgICAgICAgdGhpcy5wbGF5QnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHNlbGYucGxheSgpO1xuICAgICAgICAgICAgICAgIHNlbGYuc2hvd1N0b3BCdG4oKTtcbiAgICAgICAgICAgICAgICBzZWxmLmhpZGVQbGF5QnRuKCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHRoaXMuc3RvcEJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBzZWxmLnN0b3AoKVxuICAgICAgICAgICAgICAgIHNlbGYuc2hvd1BsYXlCdG4oKTtcbiAgICAgICAgICAgICAgICBzZWxmLmhpZGVTdG9wQnRuKCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHBsYXkoKSB7XG4gICAgICAgICAgICB0aGlzLnNvdW5kLnBsYXkoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHBhdXNlKCkge1xuICAgICAgICAgICAgdGhpcy5zb3VuZC5wYXVzZSgpO1xuICAgICAgICB9XG5cbiAgICAgICAgc3RvcCgpIHtcbiAgICAgICAgICAgIHRoaXMuc291bmQucGF1c2UoKTtcbiAgICAgICAgICAgIHRoaXMuc291bmQuY3VycmVudFRpbWUgPSAwO1xuICAgICAgICB9XG5cbiAgICAgICAgc2hvd1BsYXlCdG4oKSB7XG4gICAgICAgICAgICB0aGlzLnBsYXlCdG4uY2xhc3NMaXN0LmFkZCgnc2hvdycpO1xuICAgICAgICB9XG5cbiAgICAgICAgaGlkZVBsYXlCdG4oKSB7XG4gICAgICAgICAgICB0aGlzLnBsYXlCdG4uY2xhc3NMaXN0LnJlbW92ZSgnc2hvdycpO1xuICAgICAgICB9XG5cbiAgICAgICAgc2hvd1N0b3BCdG4oKSB7XG4gICAgICAgICAgICB0aGlzLnN0b3BCdG4uY2xhc3NMaXN0LmFkZCgnc2hvdycpO1xuICAgICAgICB9XG5cbiAgICAgICAgaGlkZVN0b3BCdG4oKSB7XG4gICAgICAgICAgICB0aGlzLnN0b3BCdG4uY2xhc3NMaXN0LnJlbW92ZSgnc2hvdycpO1xuICAgICAgICB9XG5cbiAgICAgICAgaXNQbGF5aW5nKG5hbWUpIHtcbiAgICAgICAgICAgIHJldHVybiAhdGhpcy5zb3VuZC5wYXVzZWQ7XG4gICAgICAgIH1cblxuICAgIH1cblxuXG5cblxuXG4gICAgY2xhc3MgVGltZXIge1xuXG4gICAgICAgIGNvbnN0cnVjdG9yKHRpbWVPdmVyKSB7XG5cbiAgICAgICAgICAgIHRoaXMuYXBwID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2FwcCcpO1xuICAgICAgICAgICAgdGhpcy5jb250YWluZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndGltZXInKTtcbiAgICAgICAgICAgIHRoaXMuYXZhaWxhYmxlU2Vjb25kcyA9IHRpbWVPdmVyO1xuXG4gICAgICAgICAgICB0aGlzLnNob3dUaW1lclZhbHVlKCk7XG5cbiAgICAgICAgICAgIHRoaXMuc291bmRUaWNrID0gbmV3IFBsYXllcihTZXR1cC5zb3VuZHMudGljaywgdHJ1ZSk7XG4gICAgICAgICAgICB0aGlzLnNvdW5kQWxhcm0gPSBuZXcgUGxheWVyKFNldHVwLnNvdW5kcy5hbGFybSk7XG5cbiAgICAgICAgICAgIHRoaXMuZmFpbEV2ZW50ID0gbmV3IEV2ZW50KCdmYWlsVGltZXInKTtcblxuICAgICAgICAgICAgdGhpcy5zZWNvbmRzVG9EYW5nZXIgPSAxMDtcblxuICAgICAgICB9XG5cbiAgICAgICAgc3RhcnQoKSB7XG5cbiAgICAgICAgICAgIGxldCBzZWxmID0gdGhpcztcblxuICAgICAgICAgICAgdGhpcy5jb250YWluZXIuY2xhc3NMaXN0LmFkZCgnZGFuZ2VyJyk7XG5cbiAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHNlbGYuY29udGFpbmVyLmNsYXNzTGlzdC5yZW1vdmUoJ2RhbmdlcicpO1xuICAgICAgICAgICAgfSwgODAwKTtcblxuICAgICAgICAgICAgdGhpcy50aW1lciA9IHNldEludGVydmFsKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBzZWxmLmF2YWlsYWJsZVNlY29uZHMgLS07XG5cbiAgICAgICAgICAgICAgICBzZWxmLmNoZWNrRGFuZ2VyKCk7XG4gICAgICAgICAgICAgICAgc2VsZi5jaGVja1RpbWVJc092ZXIoKTtcbiAgICAgICAgICAgICAgICBzZWxmLnNob3dUaW1lclZhbHVlKCk7XG5cbiAgICAgICAgICAgIH0sIDEwMDApO1xuICAgICAgICB9XG5cbiAgICAgICAgc3RvcCgpIHtcbiAgICAgICAgICAgIGNsZWFySW50ZXJ2YWwodGhpcy50aW1lcik7XG4gICAgICAgIH1cblxuICAgICAgICBzaG93VGltZXJWYWx1ZSgpIHtcblxuICAgICAgICAgICAgbGV0IG1pbnV0ZXMgPSBNYXRoLmZsb29yKHRoaXMuYXZhaWxhYmxlU2Vjb25kcyAvIDYwKTtcbiAgICAgICAgICAgIGxldCBzZWNvbmRzID0gdGhpcy5hdmFpbGFibGVTZWNvbmRzICUgNjA7XG5cbiAgICAgICAgICAgIGlmIChtaW51dGVzIDwgMTApIHtcbiAgICAgICAgICAgICAgICBtaW51dGVzID0gJzAnICsgbWludXRlcztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHNlY29uZHMgPCAxMCkge1xuICAgICAgICAgICAgICAgIHNlY29uZHMgPSAnMCcgKyBzZWNvbmRzO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLmNvbnRhaW5lci5pbm5lclRleHQgPSBtaW51dGVzICsgJzonICsgc2Vjb25kcztcblxuICAgICAgICB9XG5cbiAgICAgICAgY2hlY2tEYW5nZXIoKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5hdmFpbGFibGVTZWNvbmRzIDwgdGhpcy5zZWNvbmRzVG9EYW5nZXIpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmNvbnRhaW5lci5jbGFzc0xpc3QuYWRkKCdkYW5nZXInKTtcbiAgICAgICAgICAgICAgICBpZiAoIXRoaXMuc291bmRUaWNrLmlzUGxheWluZygpKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc291bmRUaWNrLnBsYXkoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBjaGVja1RpbWVJc092ZXIoKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5hdmFpbGFibGVTZWNvbmRzIDwgMSkge1xuICAgICAgICAgICAgICAgIGNsZWFySW50ZXJ2YWwodGhpcy50aW1lcik7XG4gICAgICAgICAgICAgICAgdGhpcy5zb3VuZEFsYXJtLnBsYXkoKTtcbiAgICAgICAgICAgICAgICB0aGlzLnNvdW5kVGljay5zdG9wKCk7XG4gICAgICAgICAgICAgICAgdGhpcy5hcHAuZGlzcGF0Y2hFdmVudCh0aGlzLmZhaWxFdmVudCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgIH1cblxuICAgIGNsYXNzIEhpbnRDb21wb25lbnQge1xuICAgICAgICBjb25zdHJ1Y3RvcihtZXNzYWdlKSB7XG4gICAgICAgICAgICB0aGlzLmNvbnRhaW5lciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdoaW50Jyk7XG4gICAgICAgICAgICB0aGlzLmhpbnRUZXh0ID0gdGhpcy5jb250YWluZXIucXVlcnlTZWxlY3RvcigncCNoaW50LXRleHQnKTtcbiAgICAgICAgICAgIHRoaXMuY2xvc2VCdG4gPSB0aGlzLmNvbnRhaW5lci5xdWVyeVNlbGVjdG9yKCdidXR0b24jY2xvc2UtaGludCcpO1xuXG4gICAgICAgICAgICB0aGlzLmhpbnRUZXh0LmlubmVyVGV4dCA9IG1lc3NhZ2U7XG5cbiAgICAgICAgICAgIHRoaXMuaW5pdCgpO1xuICAgICAgICB9XG5cbiAgICAgICAgaW5pdCgpIHtcbiAgICAgICAgICAgIGxldCBzZWxmID0gdGhpcztcbiAgICAgICAgICAgIHRoaXMuY2xvc2VCdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgc2VsZi5oaWRlKCk7XG4gICAgICAgICAgICB9KVxuICAgICAgICB9XG5cbiAgICAgICAgc2hvdygpIHtcbiAgICAgICAgICAgIHRoaXMuY29udGFpbmVyLmNsYXNzTGlzdC5hZGQoJ3Nob3cnKTtcbiAgICAgICAgfVxuICAgICAgICBoaWRlKCkge1xuICAgICAgICAgICAgdGhpcy5jb250YWluZXIuY2xhc3NMaXN0LnJlbW92ZSgnc2hvdycpO1xuICAgICAgICB9XG4gICAgfVxuXG5cbiAgICAvLyBIZWxwZXJzXG4gICAgLy9UZXh0XG4gICAgZnVuY3Rpb24gdGV4dEFuaW1hdGlvbihlbGVtZW50LCBzcGVlZCkge1xuICAgICAgICBsZXQgdGV4dCA9IGVsZW1lbnQuaW5uZXJUZXh0O1xuICAgICAgICBlbGVtZW50LmlubmVyVGV4dCA9ICcnO1xuICAgICAgICBsZXQgaSA9IDA7XG4gICAgICAgIGxldCB0aW1lciA9IHNldEludGVydmFsKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGlmIChpIDwgdGV4dC5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICBlbGVtZW50LmFwcGVuZCh0ZXh0LmNoYXJBdChpKSk7XG4gICAgICAgICAgICAgICAgaSsrO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBjbGVhckludGVydmFsKHRpbWVyKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSwgNDApO1xuICAgICAgICByZXR1cm4gc3BlZWQgKiB0ZXh0Lmxlbmd0aDtcbiAgICB9XG5cblxuXG4gICAgbmV3IEdhbWUoU3RlcHMpO1xuXG59KTsiXX0=
