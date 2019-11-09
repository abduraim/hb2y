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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6InNjcmlwdHMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwiRE9NQ29udGVudExvYWRlZFwiLCBmdW5jdGlvbihldmVudCkge1xuXG5cblxuICAgIGNvbnN0IFN0ZXBzID0gW1xuICAgICAgICB7fSxcbiAgICAgICAge1xuICAgICAgICAgICAgcXVlc3Rpb246ICfQmNGC0LDQuiwg0YLQstC+0LUg0L/QtdGA0LLQvtC1INC30LDQtNCw0L3QuNC1OiDQmNGB0LrQsNGC0Ywg0L7RgtCy0LXRgiDQvdGD0LbQvdC+INGC0LDQvCwg0LPQtNC1INGC0Ysg0LPQvtGC0L7QstC40YjRjCDQvNC+0Y4g0LvRjtCx0LjQvNGD0Y4g0LvQsNC/0YjRgywg0L7RgtCy0LXRgiDQsdGD0LTQtdGCINCyINC60L7QvdCy0LXRgNGC0LUg0YDRj9C00L7QvCDRgSDQstC40LvQutC+0Lkg0Lgg0L3QvtC20L7QvC4nLFxuICAgICAgICAgICAgYW5zd2VyOiAnMjU4JyxcbiAgICAgICAgICAgIGhpbnQ6ICfQkiDRj9GJ0LjQutC1INGB0YLQvtC70LAsINC90LAg0LrRg9GF0L3QtScsXG4gICAgICAgICAgICBzdWNjZXNzTWVzc2FnZTogJ9CU0LDRiNGD0LvRjNC60LAsINGB0L/QsNGB0LjQsdC+INC30LAg0L7RgtC70LjRh9C90YvQtSDQuCDQstC60YPRgdC90YvRhSDQsdC70Y7QtNCwLCDQutC+0YLQvtGA0YvQtSDRgtGLINC00LvRjyDQvdCw0YEg0LPQvtGC0L7QstC40YjRjCEg0KLQstC+0Lkg0L/QvtC00LDRgNC+0Log0LIg0YHRgtC+0LvQtSwg0L7RgtC60YDQvtC5INC00LLQtdGA0YbRiy4nLFxuICAgICAgICAgICAgdGltZU92ZXI6IDE1LFxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgICBxdWVzdGlvbjogJ9Ch0LvQtdC00YPRjtGJ0LjQuSDQutC+0L3QstC10YDRgiDRgtGLINC90LDQudC00LXRiNGMINGC0LDQvCwg0LrRg9C00LAg0L/QvtC/0LDQtNCw0Y7RgiDRgtCy0L7QuCDQvdC+0YHQvtGH0LrQuCDQv9C+0YHQu9C1INGB0YLQuNGA0LrQuC4nLFxuICAgICAgICAgICAgYW5zd2VyOiAnMTU3JyxcbiAgICAgICAgICAgIGhpbnQ6ICfQn9C+0YHQu9C1INGC0L7Qs9C+LCDQutCw0Log0L7QvdC4INCy0YvRgdC+0YXQu9C4JyxcbiAgICAgICAgICAgIHN1Y2Nlc3NNZXNzYWdlOiAn0KHQv9Cw0YHQuNCx0L4g0LfQsCDRh9C40YHRgtC+0YLRgyDQuCDQv9C+0YDRj9C00L7Quiwg0LrQvtGC0L7RgNGL0LUg0YLRiyDQtNC70Y8g0L3QsNGBINC/0L7QtNC00LXRgNC20LjQstCw0LXRiNGMISDQotCy0L7QuSDRgdC70LXQtNGD0Y7RidC40Lkg0L/QvtC00LDRgNC+0Log0L3QsCDQsNC90YLRgNC10YHQvtC70LghJyxcbiAgICAgICAgICAgIHRpbWVPdmVyOiAxNSxcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgcXVlc3Rpb246ICfQn9C+0YLQvtGA0L7Qv9C40YHRjCDQuiDRgdC70LXQtNGD0Y7RidC10LzRgyDQutC+0L3QstC10YDRgtGDLCDQvtC9INC90LDRhdC+0LTQuNGC0YHRjyDRgyDRhdC+0YDQvtGI0LXQs9C+INC60YPRh9C10YDRj9Cy0L7Qs9C+INGH0LXQu9C+0LLQtdC60LAsINC20LjQstGD0YnQtdCz0L4g0L/QviDRgdC+0YHQtdC00YHRgtCy0YMuJyxcbiAgICAgICAgICAgIGFuc3dlcjogJzMzMycsXG4gICAgICAgICAgICBoaW50OiAn0Y3RgtC+INCY0YDQuNC90LAnLFxuICAgICAgICAgICAgc3VjY2Vzc01lc3NhZ2U6ICfQodC/0LDRgdC40LHQviDQt9CwINGC0LLQvtC1INC+0LHRidC10L3QuNC1LCDQt9CwINC90L7QstC+0YHRgtC4INC4INC40LTQtdC4LCDQutC+0YLQvtGA0YvQvNC4INGC0Ysg0LTQtdC70LjRiNGM0YHRjyEg0J/QvtC00LDRgNC+0Log0LIg0YjQutCw0YTRgyAo0LIg0L7QsdGJ0LXQvCDQutC+0YDQuNC00L7RgNC1KScsXG4gICAgICAgICAgICB0aW1lT3ZlcjogMTUsXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICAgIHF1ZXN0aW9uOiAn0KHQu9C10LTRg9GO0YnQuNC5INC60L7QvdCy0LXRgNGCINC90LDRhdC+0LTQuNGC0YHRjyDRgtCw0LwsINCz0LTQtSDRgtGLINC/0L7QtNC00LXRgNC20LjQstCw0LXRiNGMINC20LjQt9C90Ywg0YLQtdC8LCDQutC+0LPQviDQtNCw0YDRj9GCINGC0LLQvtC4INC60LvQuNC10L3RgtGLINC70Y7QsdC40LzRi9C8INC70Y7QtNGP0LwuJyxcbiAgICAgICAgICAgIGFuc3dlcjogJzU1NScsXG4gICAgICAgICAgICBoaW50OiAn0K3RgtC+INGG0LLQtdGC0YssINC60L7RgtC+0YDRi9C1INGC0Ysg0LLRi9GA0LDRidC40LLQsNC10YjRjCcsXG4gICAgICAgICAgICBzdWNjZXNzTWVzc2FnZTogJ9Ch0L/QsNGB0LjQsdC+INC30LAg0LrRgNCw0YHQvtGC0YMsINC60L7RgtC+0YDRg9GOINGC0Ysg0L/RgNC40L3QvtGB0LjRiNGMINCyINGN0YLQvtGCINC80LjRgCwg0L/QvtC00LDRgNC+0Log0LjRidC4INCyINGI0LrQsNGE0YMg0LLQsNC90L3QvtC5INC60L7QvNC90LDRgtGLLicsXG4gICAgICAgICAgICB0aW1lT3ZlcjogMTUsXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICAgIHF1ZXN0aW9uOiAn0JjRgtCw0LosINC/0L7RgdC70LXQtNC90LXQtSDQt9Cw0LTQsNC90LjQtS4g0J7RgtCy0LXRgiDQv9GA0Y/Rh9C10YLRgdGPINCyINC80LXRiNC60LUg0L3QsNCx0LjRgtC+0Lwg0LPRg9GB0LjQvdGL0LzQuCDQstC+0LvQvtGB0LDQvNC4LicsXG4gICAgICAgICAgICBhbnN3ZXI6ICczNjknLFxuICAgICAgICAgICAgaGludDogJ9Ct0YLQviDQv9C+0LTRg9GI0LrQsCcsXG4gICAgICAgICAgICBzdWNjZXNzTWVzc2FnZTogJ9Ch0L/QsNGB0LjQsdC+INC30LAg0LvRjtCx0L7QstGMINC4INC70LDRgdC60YMsINC60L7RgtC+0YDRi9C80Lgg0YLRiyDQvdCw0YEg0YHQvtCz0YDQtdCy0LDQtdGI0YwhINCi0LLQvtC5INC/0L7QtNCw0YDQvtC6INC/0L7QtCDQvNCw0YLRgNCw0YHQvtC8LicsXG4gICAgICAgICAgICB0aW1lT3ZlcjogMTUsXG4gICAgICAgIH0sXG4gICAgXTtcbiAgICBjb25zdCBTZXR1cCA9IHtcbiAgICAgICAgZGVidWc6IHRydWUsXG4gICAgICAgIHNvdW5kczoge1xuICAgICAgICAgICAgJ2Rhc2hhJzogJy9hc3NldHMvc291bmRzL2Rhc2hhLm1wMycsXG4gICAgICAgICAgICAnYXBwbGF1c2UnOiAnL2Fzc2V0cy9zb3VuZHMvYXBwbGF1c2UubXAzJyxcbiAgICAgICAgICAgICdmaXJld29ya3MnOiAnL2Fzc2V0cy9zb3VuZHMvZmlyZXdvcmtzLm1wMycsXG4gICAgICAgICAgICAnYWxhcm0nOiAnL2Fzc2V0cy9zb3VuZHMvYWxhcm0ubXAzJyxcbiAgICAgICAgICAgICd0aWNrJzogJy9hc3NldHMvc291bmRzL3RpY2subXAzJyxcbiAgICAgICAgfVxuICAgIH07XG5cblxuXG4gICAgY2xhc3MgR2FtZSB7XG5cbiAgICAgICAgY29uc3RydWN0b3IoKSB7XG5cbiAgICAgICAgICAgIHRoaXMuYXBwID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2FwcCcpO1xuXG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRTdGVwID0gMTtcblxuICAgICAgICAgICAgLy8gU2NyZWVuc1xuICAgICAgICAgICAgdGhpcy5sb2FkaW5nU2NyZWVuID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2xvYWRpbmcnKTtcbiAgICAgICAgICAgIHRoaXMucHlyb1NjcmVlbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdweXJvJyk7XG4gICAgICAgICAgICB0aGlzLndlbGNvbWVTY3JlZW4gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnd2VsY29tZScpO1xuXG5cblxuICAgICAgICAgICAgLy8gQnV0dG9uc1xuICAgICAgICAgICAgdGhpcy5oaW50QnRuID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2hpbnQtYnRuJyk7XG5cblxuXG5cblxuICAgICAgICAgICAgdGhpcy5GdWxsc2NyZWVuQ29udHJvbCA9IG5ldyBGdWxsc2NyZWVuQ29udHJvbCgpO1xuICAgICAgICAgICAgdGhpcy5IaW50ID0gbmV3IEhpbnQoKTtcblxuXG4gICAgICAgICAgICB0aGlzLkNvbW1vblRpbWVyID0gbmV3IENvbW1vblRpbWVyKCk7XG5cbiAgICAgICAgICAgIHRoaXMuU3RlcEZyYW1lID0gbmV3IFN0ZXBGcmFtZSgpO1xuXG4gICAgICAgICAgICAvL3RoaXMuTWVzc2FnZUJveCA9IG5ldyBNZXNzYWdlQm94KCk7XG5cbiAgICAgICAgICAgIHRoaXMubXVzaWNEYXNoYSA9IG5ldyBQbGF5ZXIoU2V0dXAuc291bmRzLmRhc2hhKTtcblxuXG5cblxuICAgICAgICAgICAgLy8gQmluZCBFdmVudHNcbiAgICAgICAgICAgIHRoaXMuaW5pdENvbnRyb2xzKCk7XG4gICAgICAgICAgICB0aGlzLmluaXRFdmVudHMoKTtcblxuICAgICAgICAgICAgLy8gSGlkZSBsb2FkaW5nIGJlZm9yZSBsb2FkaW5nXG4gICAgICAgICAgICB0aGlzLmhpZGVMb2FkaW5nKCk7XG5cbiAgICAgICAgfVxuXG4gICAgICAgIC8vIEluaXQgQ29udHJvbHNcbiAgICAgICAgaW5pdENvbnRyb2xzKCkge1xuICAgICAgICAgICAgbGV0IHNlbGYgPSB0aGlzO1xuXG4gICAgICAgICAgICB0aGlzLmhpbnRCdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgc2VsZi5IaW50LnNob3coc2VsZi5jdXJyZW50U3RlcCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIEJpbmcgRXZlbnRzXG4gICAgICAgIGluaXRFdmVudHMoKSB7XG4gICAgICAgICAgICBsZXQgc2VsZiA9IHRoaXM7XG5cbiAgICAgICAgICAgIC8vIEZ1bGxzY3JlZW4gRG9uZVxuICAgICAgICAgICAgdGhpcy5hcHAuYWRkRXZlbnRMaXN0ZW5lcignZnVsbHNjcmVlbkRvbmUnLCBmdW5jdGlvbiAoKSB7XG5cbiAgICAgICAgICAgICAgICBsZXQgdGltZU91dCA9IHRleHRBbmltYXRpb24oc2VsZi53ZWxjb21lU2NyZWVuLnF1ZXJ5U2VsZWN0b3IoJ3AnKSwgNDApO1xuXG4gICAgICAgICAgICAgICAgbGV0IGdpZnRJbWcgPSBzZWxmLndlbGNvbWVTY3JlZW4ucXVlcnlTZWxlY3RvcignaW1nJyk7XG5cbiAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgZ2lmdEltZy5jbGFzc0xpc3QuYWRkKCdzaG93Jyk7XG4gICAgICAgICAgICAgICAgfSwgdGltZU91dCk7XG5cbiAgICAgICAgICAgICAgICBnaWZ0SW1nLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICBzZWxmLndlbGNvbWVTY3JlZW4uY2xhc3NMaXN0LnJlbW92ZSgnc2hvdycpO1xuICAgICAgICAgICAgICAgICAgICBzZWxmLnN0YXJ0R2FtZSgpO1xuICAgICAgICAgICAgICAgIH0pXG5cblxuXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgLy8gUXVlc3QgRG9uZVxuICAgICAgICAgICAgdGhpcy5hcHAuYWRkRXZlbnRMaXN0ZW5lcignc3VjY2VzcycsIGZ1bmN0aW9uICgpIHtcblxuICAgICAgICAgICAgICAgIHNlbGYuc2hvd1N1Y2Nlc3NNZXNzYWdlKCk7XG5cbiAgICAgICAgICAgICAgICBzZWxmLmN1cnJlbnRTdGVwICsrO1xuICAgICAgICAgICAgICAgIHNlbGYuU3RlcEZyYW1lLnNob3dTdGVwKHNlbGYuY3VycmVudFN0ZXApO1xuXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ3N1Y2Nlc3MgZXZlbnQnKTtcblxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIC8vIFRpbWVyXG4gICAgICAgICAgICB0aGlzLmFwcC5hZGRFdmVudExpc3RlbmVyKCdmYWlsVGltZXInLCBmdW5jdGlvbiAoKSB7XG5cbiAgICAgICAgICAgICAgICBzZWxmLmhpbnRCdG4uY2xhc3NMaXN0LmFkZCgnc2hvdycpO1xuXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ2ZhaWwgdGltZXInKTtcblxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFN0YXJ0IFRoZSBHYW1lIVxuICAgICAgICBzdGFydEdhbWUoKSB7XG4gICAgICAgICAgICBpZiAoIVNldHVwLmRlYnVnKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5tdXNpY0Rhc2hhLnBsYXkoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuQ29tbW9uVGltZXIuc3RhcnQoKTtcbiAgICAgICAgICAgIHRoaXMuU3RlcEZyYW1lLnNob3dTdGVwKHRoaXMuY3VycmVudFN0ZXApO1xuICAgICAgICB9XG5cbiAgICAgICAgc2hvd1N1Y2Nlc3NNZXNzYWdlKCkge1xuXG4gICAgICAgIH1cblxuICAgICAgICAvL0xvYWRpbmdcbiAgICAgICAgc2hvd0xvYWRpbmcoKSB7XG4gICAgICAgICAgICB0aGlzLmxvYWRpbmdTY3JlZW4uY2xhc3NMaXN0LmFkZCgnc2hvdycpO1xuICAgICAgICB9XG4gICAgICAgIGhpZGVMb2FkaW5nKCkge1xuICAgICAgICAgICAgdGhpcy5sb2FkaW5nU2NyZWVuLmNsYXNzTGlzdC5yZW1vdmUoJ3Nob3cnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vUHlyb1xuICAgICAgICBzaG93UHlybygpIHtcbiAgICAgICAgICAgIHRoaXMucHlyb1NjcmVlbi5jbGFzc0xpc3QuYWRkKCdzaG93Jyk7XG4gICAgICAgIH1cbiAgICAgICAgaGlkZVB5cm8oKSB7XG4gICAgICAgICAgICB0aGlzLnB5cm9TY3JlZW4uY2xhc3NMaXN0LnJlbW92ZSgnc2hvdycpO1xuICAgICAgICB9XG4gICAgICAgIHZvbGxleVB5cm8oKSB7XG4gICAgICAgICAgICBsZXQgc2VsZiA9IHRoaXM7XG4gICAgICAgICAgICB0aGlzLnNob3dQeXJvKCk7XG4gICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBzZWxmLmhpZGVQeXJvKCk7XG4gICAgICAgICAgICB9LCAzMDAwKTtcbiAgICAgICAgfVxuXG4gICAgfVxuXG4gICAgLy8gRnVsbHNjcmVlbiBDbGFzc1xuICAgIGNsYXNzIEZ1bGxzY3JlZW5Db250cm9sIHtcblxuICAgICAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgICAgIHRoaXMuYXBwID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2FwcCcpO1xuICAgICAgICAgICAgdGhpcy5jb250YWluZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZnVsbHNjcmVlbicpO1xuICAgICAgICAgICAgdGhpcy5jb250YWluZXIuY2xhc3NMaXN0LmFkZCgnc2hvdycpO1xuICAgICAgICAgICAgdGhpcy5idG4gPSB0aGlzLmNvbnRhaW5lci5xdWVyeVNlbGVjdG9yKCdidXR0b24nKTtcbiAgICAgICAgICAgIHRoaXMuZnVsbHNjcmVlbkRvbmUgPSBuZXcgRXZlbnQoJ2Z1bGxzY3JlZW5Eb25lJyk7XG4gICAgICAgICAgICBsZXQgc2VsZiA9IHRoaXM7XG4gICAgICAgICAgICB0aGlzLmJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBpZiAoIVNldHVwLmRlYnVnKSB7XG4gICAgICAgICAgICAgICAgICAgIHNlbGYubGF1bmNoRnVsbFNjcmVlbihkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBzZWxmLmJ0bi5jbGFzc0xpc3QuYWRkKCdzb2Z0X2hpZGUnKTtcbiAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5jb250YWluZXIuY2xhc3NMaXN0LnJlbW92ZSgnc2hvdycpO1xuICAgICAgICAgICAgICAgICAgICBzZWxmLmFwcC5kaXNwYXRjaEV2ZW50KHNlbGYuZnVsbHNjcmVlbkRvbmUpO1xuICAgICAgICAgICAgICAgIH0sIDEwMDApO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgfVxuXG4gICAgICAgIGxhdW5jaEZ1bGxTY3JlZW4oZWxlbWVudCkge1xuICAgICAgICAgICAgaWYoZWxlbWVudC5yZXF1ZXN0RnVsbFNjcmVlbikge1xuICAgICAgICAgICAgICAgIGVsZW1lbnQucmVxdWVzdEZ1bGxTY3JlZW4oKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZihlbGVtZW50Lm1velJlcXVlc3RGdWxsU2NyZWVuKSB7XG4gICAgICAgICAgICAgICAgZWxlbWVudC5tb3pSZXF1ZXN0RnVsbFNjcmVlbigpO1xuICAgICAgICAgICAgfSBlbHNlIGlmKGVsZW1lbnQud2Via2l0UmVxdWVzdEZ1bGxTY3JlZW4pIHtcbiAgICAgICAgICAgICAgICBlbGVtZW50LndlYmtpdFJlcXVlc3RGdWxsU2NyZWVuKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBjYW5jZWxGdWxsc2NyZWVuKCkge1xuICAgICAgICAgICAgaWYoZG9jdW1lbnQuY2FuY2VsRnVsbFNjcmVlbikge1xuICAgICAgICAgICAgICAgIGRvY3VtZW50LmNhbmNlbEZ1bGxTY3JlZW4oKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZihkb2N1bWVudC5tb3pDYW5jZWxGdWxsU2NyZWVuKSB7XG4gICAgICAgICAgICAgICAgZG9jdW1lbnQubW96Q2FuY2VsRnVsbFNjcmVlbigpO1xuICAgICAgICAgICAgfSBlbHNlIGlmKGRvY3VtZW50LndlYmtpdENhbmNlbEZ1bGxTY3JlZW4pIHtcbiAgICAgICAgICAgICAgICBkb2N1bWVudC53ZWJraXRDYW5jZWxGdWxsU2NyZWVuKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgIH1cblxuICAgIC8vIENvbW1vblRpbWUgQ2xhc3NcbiAgICBjbGFzcyBDb21tb25UaW1lciB7XG5cbiAgICAgICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRTZWNvbmRzID0gMDtcbiAgICAgICAgfVxuXG4gICAgICAgIHN0YXJ0KCkge1xuICAgICAgICAgICAgbGV0IHNlbGYgPSB0aGlzO1xuICAgICAgICAgICAgdGhpcy50aW1lciA9IHNldEludGVydmFsKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBzZWxmLmN1cnJlbnRTZWNvbmRzICsrO1xuICAgICAgICAgICAgfSwgMTAwMCk7XG4gICAgICAgIH1cblxuICAgICAgICBzdG9wKCkge1xuICAgICAgICAgICAgY2xlYXJJbnRlcnZhbCh0aGlzLnRpbWVyKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGdldENvbW1vblRpbWUoKSB7XG5cbiAgICAgICAgICAgIGxldCBtaW51dGVzID0gTWF0aC5mbG9vcih0aGlzLmN1cnJlbnRTZWNvbmRzIC8gNjApO1xuICAgICAgICAgICAgbGV0IHNlY29uZHMgPSB0aGlzLmN1cnJlbnRTZWNvbmRzICUgNjA7XG5cbiAgICAgICAgICAgIGlmIChtaW51dGVzIDwgMTApIHtcbiAgICAgICAgICAgICAgICBtaW51dGVzID0gJzAnICsgbWludXRlcztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHNlY29uZHMgPCAxMCkge1xuICAgICAgICAgICAgICAgIHNlY29uZHMgPSAnMCcgKyBzZWNvbmRzO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gbWludXRlcyArICc6JyArIHNlY29uZHM7O1xuICAgICAgICB9XG5cbiAgICB9XG5cbiAgICAvLyBRZXN0U3RlcCBDbGFzc1xuICAgIGNsYXNzIFN0ZXBGcmFtZSB7XG5cbiAgICAgICAgY29uc3RydWN0b3IoKSB7XG5cbiAgICAgICAgICAgIHRoaXMudGV4dCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd0ZXh0Jyk7XG4gICAgICAgICAgICB0aGlzLmlucHV0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2Fuc3dlci1pbnB1dCcpO1xuXG4gICAgICAgICAgICB0aGlzLnN1Y2Nlc3NNZXNzYWdlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3N1Y2Nlc3MtbWVzc2FnZScpO1xuICAgICAgICAgICAgdGhpcy5zdWNjZXNzTWVzc2FnZVRleHQgPSB0aGlzLnN1Y2Nlc3NNZXNzYWdlLnF1ZXJ5U2VsZWN0b3IoJ3AjdGV4dC1zdWNjZXNzLW1lc3NhZ2UnKTtcbiAgICAgICAgICAgIHRoaXMubmV4dFF1ZXN0QnRuID0gdGhpcy5zdWNjZXNzTWVzc2FnZS5xdWVyeVNlbGVjdG9yKCdidXR0b24jbmV4dC1xdWVzdC1idG4nKTtcblxuICAgICAgICAgICAgdGhpcy5zdWNjZXNFdmVudCA9IG5ldyBFdmVudCgnc3VjY2VzcycpO1xuXG4gICAgICAgIH1cblxuICAgICAgICBzaG93U3RlcChzdGVwTnVtYmVyKSB7XG5cbiAgICAgICAgICAgIHRoaXMuYXBwID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2FwcCcpO1xuICAgICAgICAgICAgdGhpcy5jb250YWluZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncXVlc3QnKTtcbiAgICAgICAgICAgIHRoaXMuY29udGFpbmVyLmNsYXNzTGlzdC5hZGQoJ3Nob3cnKTtcbiAgICAgICAgICAgIHRoaXMucXVlc3Rpb24gPSBTdGVwc1tzdGVwTnVtYmVyXS5xdWVzdGlvbjtcbiAgICAgICAgICAgIHRoaXMuYW5zd2VyID0gU3RlcHNbc3RlcE51bWJlcl0uYW5zd2VyO1xuICAgICAgICAgICAgdGhpcy5zdWNjZXNzTWVzc2FnZVRleHQuaW5uZXJUZXh0ID0gU3RlcHNbc3RlcE51bWJlcl0uc3VjY2Vzc01lc3NhZ2U7XG5cbiAgICAgICAgICAgIHRoaXMudGltZXJPdmVyID0gU3RlcHNbc3RlcE51bWJlcl0udGltZU92ZXI7XG5cbiAgICAgICAgICAgIHRoaXMuVGltZXIgPSBuZXcgVGltZXIodGhpcy50aW1lck92ZXIpO1xuXG4gICAgICAgICAgICB0aGlzLnRleHQuaW5uZXJUZXh0ID0gdGhpcy5xdWVzdGlvbjtcblxuICAgICAgICAgICAgbGV0IHRpbWVPdXQgPSB0ZXh0QW5pbWF0aW9uKHRoaXMudGV4dCwgNDApO1xuICAgICAgICAgICAgbGV0IHNlbGYgPSB0aGlzO1xuICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgc2VsZi5UaW1lci5zdGFydCgpO1xuICAgICAgICAgICAgICAgIHNlbGYuaW5wdXQuY2xhc3NMaXN0LmFkZCgnc2hvdycpO1xuICAgICAgICAgICAgfSwgdGltZU91dCk7XG5cbiAgICAgICAgICAgIHRoaXMuaW5pdCgpO1xuICAgICAgICB9XG5cbiAgICAgICAgaW5pdCgpIHtcblxuICAgICAgICAgICAgbGV0IHNlbGYgPSB0aGlzO1xuXG4gICAgICAgICAgICB0aGlzLmlucHV0LnNldEF0dHJpYnV0ZSgnbWF4bGVuZ3RoJywgdGhpcy5hbnN3ZXIubGVuZ3RoKTtcblxuICAgICAgICAgICAgdGhpcy5pbnB1dC5hZGRFdmVudExpc3RlbmVyKCdpbnB1dCcsIGZ1bmN0aW9uICgpIHtcblxuICAgICAgICAgICAgICAgIGlmICh0aGlzLnZhbHVlLmxlbmd0aCA9PSBzZWxmLmFuc3dlci5sZW5ndGgpIHtcblxuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy52YWx1ZSA9PSBzZWxmLmFuc3dlcikge1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxmLnN1Y2Nlc3NNZXNzYWdlLmNsYXNzTGlzdC5hZGQoJ3Nob3cnKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ3JpZ2h0IScpO1xuXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCd3cm9uZy4uLicpO1xuXG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHRoaXMubmV4dFF1ZXN0QnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xuXG4gICAgICAgICAgICAgICAgc2VsZi5zdWNjZXNzTWVzc2FnZS5jbGFzc0xpc3QucmVtb3ZlKCdzaG93Jyk7XG5cbiAgICAgICAgICAgICAgICBzZWxmLmFwcC5kaXNwYXRjaEV2ZW50KHNlbGYuc3VjY2VzRXZlbnQpO1xuXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICB9XG5cbiAgICB9XG5cblxuXG5cblxuXG4gICAgLy8gY2xhc3MgTWVzc2FnZUJveCB7XG4gICAgLy9cbiAgICAvLyAgICAgY29uc3RydWN0b3IoKSB7XG4gICAgLy8gICAgICAgICB0aGlzLmNvbnRhaW5lciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdtZXNzYWdlJyk7XG4gICAgLy8gICAgICAgICB0aGlzLm1lc3NhZ2UgPSB0aGlzLmNvbnRhaW5lci5xdWVyeVNlbGVjdG9yKCcubWVzc2FnZScpO1xuICAgIC8vICAgICAgICAgdGhpcy5va0J0biA9IHRoaXMuY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoJyNtZXNzYWdlLW9rJylcbiAgICAvLyAgICAgICAgIHRoaXMuaW5pdCgpO1xuICAgIC8vICAgICB9XG4gICAgLy9cbiAgICAvLyAgICAgaW5pdCgpIHtcbiAgICAvLyAgICAgICAgIGxldCBzZWxmID0gdGhpcztcbiAgICAvLyAgICAgICAgIHRoaXMub2tCdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbiAoKSB7XG4gICAgLy8gICAgICAgICAgICAgc2VsZi5oaWRlKCk7XG4gICAgLy8gICAgICAgICB9KTtcbiAgICAvLyAgICAgfVxuICAgIC8vXG4gICAgLy8gICAgIHNldE1lc3NhZ2UobWVzc2FnZSkge1xuICAgIC8vICAgICAgICAgdGhpcy5tZXNzYWdlLmlubmVySFRNTCA9IG1lc3NhZ2U7XG4gICAgLy8gICAgIH1cbiAgICAvL1xuICAgIC8vICAgICBzaG93KCkge1xuICAgIC8vICAgICAgICAgdGhpcy5jb250YWluZXIuY2xhc3NMaXN0LmFkZCgnc2hvdycpO1xuICAgIC8vICAgICB9XG4gICAgLy9cbiAgICAvLyAgICAgaGlkZSgpIHtcbiAgICAvLyAgICAgICAgIHRoaXMuY29udGFpbmVyLmNsYXNzTGlzdC5yZW1vdmUoJ3Nob3cnKTtcbiAgICAvLyAgICAgfVxuICAgIC8vXG4gICAgLy8gfVxuXG5cblxuICAgIGNsYXNzIFBsYXllciB7XG5cbiAgICAgICAgY29uc3RydWN0b3IocGF0aFRvRmlsZSwgbG9vcCA9IGZhbHNlKSB7XG4gICAgICAgICAgICB0aGlzLnBsYXlCdG4gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncGxheScpO1xuICAgICAgICAgICAgdGhpcy5zdG9wQnRuID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3N0b3AnKTtcblxuXG4gICAgICAgICAgICB0aGlzLnNvdW5kID0gbmV3IEF1ZGlvKHBhdGhUb0ZpbGUpO1xuICAgICAgICAgICAgdGhpcy5zb3VuZC5sb29wID0gbG9vcDtcblxuICAgICAgICAgICAgdGhpcy5pbml0KCk7XG4gICAgICAgIH1cblxuICAgICAgICBpbml0KCkge1xuICAgICAgICAgICAgbGV0IHNlbGYgPSB0aGlzO1xuICAgICAgICAgICAgdGhpcy5wbGF5QnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHNlbGYucGxheSgpO1xuICAgICAgICAgICAgICAgIHNlbGYuc2hvd1N0b3BCdG4oKTtcbiAgICAgICAgICAgICAgICBzZWxmLmhpZGVQbGF5QnRuKCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHRoaXMuc3RvcEJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBzZWxmLnN0b3AoKVxuICAgICAgICAgICAgICAgIHNlbGYuc2hvd1BsYXlCdG4oKTtcbiAgICAgICAgICAgICAgICBzZWxmLmhpZGVTdG9wQnRuKCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHBsYXkoKSB7XG4gICAgICAgICAgICB0aGlzLnNvdW5kLnBsYXkoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHBhdXNlKCkge1xuICAgICAgICAgICAgdGhpcy5zb3VuZC5wYXVzZSgpO1xuICAgICAgICB9XG5cbiAgICAgICAgc3RvcCgpIHtcbiAgICAgICAgICAgIHRoaXMuc291bmQucGF1c2UoKTtcbiAgICAgICAgICAgIHRoaXMuc291bmQuY3VycmVudFRpbWUgPSAwO1xuICAgICAgICB9XG5cbiAgICAgICAgc2hvd1BsYXlCdG4oKSB7XG4gICAgICAgICAgICB0aGlzLnBsYXlCdG4uY2xhc3NMaXN0LmFkZCgnc2hvdycpO1xuICAgICAgICB9XG5cbiAgICAgICAgaGlkZVBsYXlCdG4oKSB7XG4gICAgICAgICAgICB0aGlzLnBsYXlCdG4uY2xhc3NMaXN0LnJlbW92ZSgnc2hvdycpO1xuICAgICAgICB9XG5cbiAgICAgICAgc2hvd1N0b3BCdG4oKSB7XG4gICAgICAgICAgICB0aGlzLnN0b3BCdG4uY2xhc3NMaXN0LmFkZCgnc2hvdycpO1xuICAgICAgICB9XG5cbiAgICAgICAgaGlkZVN0b3BCdG4oKSB7XG4gICAgICAgICAgICB0aGlzLnN0b3BCdG4uY2xhc3NMaXN0LnJlbW92ZSgnc2hvdycpO1xuICAgICAgICB9XG5cbiAgICAgICAgaXNQbGF5aW5nKG5hbWUpIHtcbiAgICAgICAgICAgIHJldHVybiAhdGhpcy5zb3VuZC5wYXVzZWQ7XG4gICAgICAgIH1cblxuICAgIH1cblxuXG5cblxuXG4gICAgY2xhc3MgVGltZXIge1xuXG4gICAgICAgIGNvbnN0cnVjdG9yKHRpbWVPdmVyKSB7XG5cbiAgICAgICAgICAgIHRoaXMuYXBwID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2FwcCcpO1xuICAgICAgICAgICAgdGhpcy5jb250YWluZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndGltZXInKTtcbiAgICAgICAgICAgIHRoaXMuYXZhaWxhYmxlU2Vjb25kcyA9IHRpbWVPdmVyO1xuXG4gICAgICAgICAgICB0aGlzLnNob3dUaW1lclZhbHVlKCk7XG5cbiAgICAgICAgICAgIHRoaXMuc291bmRUaWNrID0gbmV3IFBsYXllcihTZXR1cC5zb3VuZHMudGljaywgdHJ1ZSk7XG4gICAgICAgICAgICB0aGlzLnNvdW5kQWxhcm0gPSBuZXcgUGxheWVyKFNldHVwLnNvdW5kcy5hbGFybSk7XG5cbiAgICAgICAgICAgIHRoaXMuZmFpbEV2ZW50ID0gbmV3IEV2ZW50KCdmYWlsVGltZXInKTtcblxuICAgICAgICAgICAgdGhpcy5zZWNvbmRzVG9EYW5nZXIgPSAxMDtcblxuICAgICAgICB9XG5cbiAgICAgICAgc3RhcnQoKSB7XG5cbiAgICAgICAgICAgIGxldCBzZWxmID0gdGhpcztcblxuICAgICAgICAgICAgdGhpcy5jb250YWluZXIuY2xhc3NMaXN0LmFkZCgnZGFuZ2VyJyk7XG5cbiAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHNlbGYuY29udGFpbmVyLmNsYXNzTGlzdC5yZW1vdmUoJ2RhbmdlcicpO1xuICAgICAgICAgICAgfSwgODAwKTtcblxuICAgICAgICAgICAgdGhpcy50aW1lciA9IHNldEludGVydmFsKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBzZWxmLmF2YWlsYWJsZVNlY29uZHMgLS07XG5cbiAgICAgICAgICAgICAgICBzZWxmLmNoZWNrRGFuZ2VyKCk7XG4gICAgICAgICAgICAgICAgc2VsZi5jaGVja1RpbWVJc092ZXIoKTtcbiAgICAgICAgICAgICAgICBzZWxmLnNob3dUaW1lclZhbHVlKCk7XG5cbiAgICAgICAgICAgIH0sIDEwMDApO1xuICAgICAgICB9XG5cbiAgICAgICAgc2hvd1RpbWVyVmFsdWUoKSB7XG5cbiAgICAgICAgICAgIGxldCBtaW51dGVzID0gTWF0aC5mbG9vcih0aGlzLmF2YWlsYWJsZVNlY29uZHMgLyA2MCk7XG4gICAgICAgICAgICBsZXQgc2Vjb25kcyA9IHRoaXMuYXZhaWxhYmxlU2Vjb25kcyAlIDYwO1xuXG4gICAgICAgICAgICBpZiAobWludXRlcyA8IDEwKSB7XG4gICAgICAgICAgICAgICAgbWludXRlcyA9ICcwJyArIG1pbnV0ZXM7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChzZWNvbmRzIDwgMTApIHtcbiAgICAgICAgICAgICAgICBzZWNvbmRzID0gJzAnICsgc2Vjb25kcztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5jb250YWluZXIuaW5uZXJUZXh0ID0gbWludXRlcyArICc6JyArIHNlY29uZHM7XG5cbiAgICAgICAgfVxuXG4gICAgICAgIGNoZWNrRGFuZ2VyKCkge1xuICAgICAgICAgICAgaWYgKHRoaXMuYXZhaWxhYmxlU2Vjb25kcyA8IHRoaXMuc2Vjb25kc1RvRGFuZ2VyKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5jb250YWluZXIuY2xhc3NMaXN0LmFkZCgnZGFuZ2VyJyk7XG4gICAgICAgICAgICAgICAgaWYgKCF0aGlzLnNvdW5kVGljay5pc1BsYXlpbmcoKSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnNvdW5kVGljay5wbGF5KCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgY2hlY2tUaW1lSXNPdmVyKCkge1xuICAgICAgICAgICAgaWYgKHRoaXMuYXZhaWxhYmxlU2Vjb25kcyA8IDEpIHtcbiAgICAgICAgICAgICAgICBjbGVhckludGVydmFsKHRoaXMudGltZXIpO1xuICAgICAgICAgICAgICAgIHRoaXMuc291bmRBbGFybS5wbGF5KCk7XG4gICAgICAgICAgICAgICAgdGhpcy5zb3VuZFRpY2suc3RvcCgpO1xuICAgICAgICAgICAgICAgIHRoaXMuYXBwLmRpc3BhdGNoRXZlbnQodGhpcy5mYWlsRXZlbnQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICB9XG5cbiAgICBjbGFzcyBIaW50IHtcbiAgICAgICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgICAgICB0aGlzLmNvbnRhaW5lciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdoaW50Jyk7XG4gICAgICAgICAgICB0aGlzLmhpbnRUZXh0ID0gdGhpcy5jb250YWluZXIucXVlcnlTZWxlY3RvcigncCNoaW50LXRleHQnKTtcbiAgICAgICAgICAgIHRoaXMuY2xvc2VCdG4gPSB0aGlzLmNvbnRhaW5lci5xdWVyeVNlbGVjdG9yKCdidXR0b24jY2xvc2UtaGludCcpO1xuXG4gICAgICAgICAgICB0aGlzLmluaXQoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGluaXQoKSB7XG5cbiAgICAgICAgICAgIGxldCBzZWxmID0gdGhpcztcblxuICAgICAgICAgICAgdGhpcy5jbG9zZUJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBzZWxmLmhpZGUoKTtcbiAgICAgICAgICAgIH0pXG5cbiAgICAgICAgfVxuXG4gICAgICAgIHNob3coc3RlcE51bWJlcikge1xuICAgICAgICAgICAgdGhpcy5oaW50VGV4dC5pbm5lclRleHQgPSBTdGVwc1tzdGVwTnVtYmVyXS5oaW50O1xuICAgICAgICAgICAgdGhpcy5jb250YWluZXIuY2xhc3NMaXN0LmFkZCgnc2hvdycpO1xuICAgICAgICB9XG4gICAgICAgIGhpZGUoKSB7XG4gICAgICAgICAgICB0aGlzLmNvbnRhaW5lci5jbGFzc0xpc3QucmVtb3ZlKCdzaG93Jyk7XG4gICAgICAgIH1cbiAgICB9XG5cblxuICAgIC8vIEhlbHBlcnNcbiAgICAvL1RleHRcbiAgICBmdW5jdGlvbiB0ZXh0QW5pbWF0aW9uKGVsZW1lbnQsIHNwZWVkKSB7XG4gICAgICAgIGxldCB0ZXh0ID0gZWxlbWVudC5pbm5lclRleHQ7XG4gICAgICAgIGVsZW1lbnQuaW5uZXJUZXh0ID0gJyc7XG4gICAgICAgIGxldCBpID0gMDtcbiAgICAgICAgbGV0IHRpbWVyID0gc2V0SW50ZXJ2YWwoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgaWYgKGkgPCB0ZXh0Lmxlbmd0aCkge1xuICAgICAgICAgICAgICAgIGVsZW1lbnQuYXBwZW5kKHRleHQuY2hhckF0KGkpKTtcbiAgICAgICAgICAgICAgICBpKys7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGNsZWFySW50ZXJ2YWwodGltZXIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LCA0MCk7XG4gICAgICAgIHJldHVybiBzcGVlZCAqIHRleHQubGVuZ3RoO1xuICAgIH1cblxuXG5cbiAgICBuZXcgR2FtZShTdGVwcyk7XG5cbn0pOyJdfQ==
