document.addEventListener("DOMContentLoaded", function(event) {



    const Steps = [
        {},
        {
            question: 'Итак, твое первое задание: Искать ответ нужно там, где ты готовишь мою любимую лапшу, ответ будет в конверте рядом с вилкой и ножом.',
            answer: '258',
            hint: 'В ящике стола, на кухне',
            successMessage: 'Дашулька, спасибо за отличные и вкусных блюда, которые ты для нас готовишь! Твой подарок в столе, открой дверцы.',
            timeOver: 15,
        },
        {
            question: 'Следующий конверт ты найдешь там, куда попадают твои носочки после стирки.',
            answer: '157',
            hint: 'После того, как они высохли',
            successMessage: 'Спасибо за чистоту и порядок, которые ты для нас поддерживаешь! Твой следующий подарок на антресоли!',
            timeOver: 15,
        },
        {
            question: 'Поторопись к следующему конверту, он находится у хорошего кучерявого человека, живущего по соседству.',
            answer: '333',
            hint: 'это Ирина',
            successMessage: 'Спасибо за твое общение, за новости и идеи, которыми ты делишься! Подарок в шкафу (в общем коридоре)',
            timeOver: 15,
        },
        {
            question: 'Следующий конверт находится там, где ты поддерживаешь жизнь тем, кого дарят твои клиенты любимым людям.',
            answer: '555',
            hint: 'Это цветы, которые ты выращиваешь',
            successMessage: 'Спасибо за красоту, которую ты приносишь в этот мир, подарок ищи в шкафу ванной комнаты.',
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
        }
    };



    class Game {

        constructor() {

            this.app = document.getElementById('app');

            this.currentStep = 1;

            // Screens
            this.loadingScreen = document.getElementById('loading');
            this.pyroScreen = document.getElementById('pyro');
            this.welcomeScreen = document.getElementById('welcome');



            // Buttons
            this.hintBtn = document.getElementById('hint-btn');





            this.FullscreenControl = new FullscreenControl();
            this.Hint = new Hint();


            this.CommonTimer = new CommonTimer();

            this.StepFrame = new StepFrame();

            //this.MessageBox = new MessageBox();

            this.musicDasha = new Player(Setup.sounds.dasha);




            // Bind Events
            this.initControls();
            this.initEvents();

            // Hide loading before loading
            this.hideLoading();

        }

        // Init Controls
        initControls() {
            let self = this;

            this.hintBtn.addEventListener('click', function () {
                self.Hint.show(self.currentStep);
            });
        }

        // Bing Events
        initEvents() {
            let self = this;

            // Fullscreen Done
            this.app.addEventListener('fullscreenDone', function () {

                let timeOut = textAnimation(self.welcomeScreen.querySelector('p'), 40);

                let giftImg = self.welcomeScreen.querySelector('img');

                setTimeout(function () {
                    giftImg.classList.add('show');
                }, timeOut);

                giftImg.addEventListener('click', function () {
                    self.welcomeScreen.classList.remove('show');
                    self.startGame();
                })



            });

            // Quest Done
            this.app.addEventListener('success', function () {

                self.showSuccessMessage();

                self.currentStep ++;
                self.StepFrame.showStep(self.currentStep);

                console.log('success event');

            });

            // Timer
            this.app.addEventListener('failTimer', function () {

                self.hintBtn.classList.add('show');

                console.log('fail timer');

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

        showSuccessMessage() {

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
    class FullscreenControl {

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
    class CommonTimer {

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
    class StepFrame {

        constructor() {

            this.text = document.getElementById('text');
            this.input = document.getElementById('answer-input');

            this.successMessage = document.getElementById('success-message');
            this.successMessageText = this.successMessage.querySelector('p#text-success-message');
            this.nextQuestBtn = this.successMessage.querySelector('button#next-quest-btn');

            this.succesEvent = new Event('success');

        }

        showStep(stepNumber) {

            this.app = document.getElementById('app');
            this.container = document.getElementById('quest');
            this.container.classList.add('show');
            this.question = Steps[stepNumber].question;
            this.answer = Steps[stepNumber].answer;
            this.successMessageText.innerText = Steps[stepNumber].successMessage;

            this.timerOver = Steps[stepNumber].timeOver;

            this.Timer = new Timer(this.timerOver);

            this.text.innerText = this.question;

            let timeOut = textAnimation(this.text, 40);
            let self = this;
            setTimeout(function () {
                self.Timer.start();
                self.input.classList.add('show');
            }, timeOut);

            this.init();
        }

        init() {

            let self = this;

            this.input.setAttribute('maxlength', this.answer.length);

            this.input.addEventListener('input', function () {

                if (this.value.length == self.answer.length) {

                    if (this.value == self.answer) {

                        self.successMessage.classList.add('show');

                        console.log('right!');

                    } else {

                        console.log('wrong...');

                    }

                }

            });

            this.nextQuestBtn.addEventListener('click', function () {

                self.successMessage.classList.remove('show');

                self.app.dispatchEvent(self.succesEvent);

            });

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

    class Hint {
        constructor() {
            this.container = document.getElementById('hint');
            this.hintText = this.container.querySelector('p#hint-text');
            this.closeBtn = this.container.querySelector('button#close-hint');

            this.init();
        }

        init() {

            let self = this;

            this.closeBtn.addEventListener('click', function () {
                self.hide();
            })

        }

        show(stepNumber) {
            this.hintText.innerText = Steps[stepNumber].hint;
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