document.addEventListener("DOMContentLoaded", function(event) {

    const Steps = [
        {},
        {
            question: 'test1',
            answer: '123',
            hint: 'hint 1',
            successMessage: 'Congratulations!111',
        },
        {
            question: 'test2',
            answer: '345',
            hint: 'hint 2',
            successMessage: 'Congratulations!222',
        }
    ];

    class Game {

        constructor() {

            this.app = document.getElementById('app');

            this.currentStep = 1;

            this.FullscreenControl = new FullscreenControl();

            this.Steps = Steps;

            this.CommonTimer = new CommonTimer();

            this.StepFrame = new StepFrame();

            this.MessageBox = new MessageBox();

            this.Player = new Player();

            this.init();

            this.startInit();

        }

        init() {

            let self = this;

            this.app.addEventListener('success', function () {

                self.showSuccessMessage();

                self.currentStep ++;
                self.StepFrame.showStep(self.currentStep);

                console.log('success event');

            });

        }

        startInit() {

            let self = this;

            this.welcomeScreen = document.getElementById('welcome-screen');

            this.giftImg = this.welcomeScreen.querySelector('img');

            this.giftImg.addEventListener('click', function () {
                self.welcomeScreen.classList.remove('show');
                self.Player.play();
                self.startGame();
            });

            setTimeout(function () {
                self.giftImg.classList.add('animated');
            }, 2000);

        }

        startGame() {
            this.CommonTimer.start();
            this.StepFrame.showStep(this.currentStep);
        }

        showSuccessMessage() {

        }



    }

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

    class MessageBox {

        constructor() {
            this.container = document.getElementById('message');
            this.message = this.container.querySelector('.message');
            this.okBtn = this.container.querySelector('#message-ok')
            this.init();
        }

        init() {
            let self = this;
            this.okBtn.addEventListener('click', function () {
                self.hide();
            });
        }

        setMessage(message) {
            this.message.innerHTML = message;
        }

        show() {
            this.container.classList.add('show');
        }

        hide() {
            this.container.classList.remove('show');
        }

    }

    class StepFrame {

        constructor() {

            this.text = document.getElementById('text');
            this.input = document.getElementById('answer-input');
            this.answerBtn = document.getElementById('answer-btn');
            this.message = document.getElementById('message');
            this.succesEvent = new Event('success');

        }

        showStep(stepNumber) {

            this.app = document.getElementsByTagName('body')[0];
            this.question = Steps[stepNumber].question;
            this.answer = Steps[stepNumber].answer;
            this.hint = Steps[stepNumber].hint;

            this.text.innerText = this.question;

            this.init();
        }

        init() {

            let self = this;

            this.input.setAttribute('maxlength', this.answer.length);

            this.input.addEventListener('input', function () {

                if (this.value == self.answer) {

                    self.answerBtn.classList.add('show');

                    self.answerBtn.focus();

                    self.message.classList.add('show');

                    console.log('right!');

                } else {

                    console.log('wrong...');

                }
            });

            this.answerBtn.addEventListener('click', function (event) {

                if (self.input.value == self.answer) {
                    self.app.dispatchEvent(self.succesEvent);
                }

            });

        }

    }

    class Player {

        constructor() {
            this.playBtn = document.getElementById('play');
            this.stopBtn = document.getElementById('stop');
            this.musicDasha = new Audio('dasha.mp3');
            this.musicDasha.currentTime = 1;
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
            this.musicDasha.play();
        }

        pause() {
            this.musicDasha.pause();
        }

        stop() {
            this.musicDasha.pause();
            this.musicDasha.currentTime = 1;
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

        isPlaying() {
            return !this.musicDasha.paused;
        }

    }

    class FullscreenControl {

        constructor() {
            this.container = document.getElementById('fullscreen');
            this.btn = this.container.querySelector('button');
            let self = this;
            this.btn.addEventListener('click', function () {
                self.launchFullScreen(document.documentElement);
                self.btn.classList.add('soft_hide');
                setTimeout(function () {
                    self.container.classList.remove('show');
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


    class Timer {

        constructor(container) {

            this.container = container;
            this.availableSeconds = 5;
            this.currentSeconds = 0;

            this.secondsToDanger = 10;

            this.timerInit();

        }

        timerInit() {

            let self = this;

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
            }
        }

        checkTimeIsOver() {
            if (this.availableSeconds < 1) {
                clearInterval(this.timer);
            }
        }

    }

    class Hint {

    }


    new Game(Steps);





    var audio = new Audio('dasha.mp3');
    //audio.play();


    var elem = document.getElementById("app");

    /* When the openFullscreen() function is executed, open the video in fullscreen.
    Note that we must include prefixes for different browsers, as they don't support the requestFullscreen method yet */
    // function openFullscreen() {
    //     if (elem.requestFullscreen) {
    //         elem.requestFullscreen();
    //     } else if (elem.mozRequestFullScreen) { /* Firefox */
    //         elem.mozRequestFullScreen();
    //     } else if (elem.webkitRequestFullscreen) { /* Chrome, Safari and Opera */
    //         elem.webkitRequestFullscreen();
    //     } else if (elem.msRequestFullscreen) { /* IE/Edge */
    //         elem.msRequestFullscreen();
    //     }
    // }
    //
    // document.getElementById('fullscreen').addEventListener('click', function () {
    //     console.log('click');
    //     openFullscreen();
    // });


    // let frames = document.getElementsByClassName('frame');
    //
    // new Timer(document.getElementById('timer'));
    //
    // for (let i = 0; i < frames.length; i++) {
    //
    //     new Frame(frames[i]);
    //
    // }





});