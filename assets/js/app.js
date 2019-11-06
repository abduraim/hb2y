document.addEventListener("DOMContentLoaded", function(event) {

    const Steps = [
        {},
        {
            question: 'test1',
            answer: '123',
            hint: 'hint 1',
        },
        {
            question: 'test2',
            answer: '345',
            hint: 'hint 2',
        }
    ];

    class Game {

        constructor() {

            this.app = document.getElementsByTagName('body')[0];

            this.currentStep = 1;

            this.StepsInfo = Steps;

            this.CommonTimer = new CommonTimer();

            this.StepFrame = new StepFrame();

            this.init();

            this.startInit();

        }

        init() {

            let self = this;

            this.app.addEventListener('success', function () {

                self.currentStep ++;
                self.StepFrame.showStep(self.currentStep);

                console.log('success event');

            });

        }

        startInit() {

            let self = this;

            this.welcomeScreen = document.getElementById('welcome-screen');

            this.startBtn = document.getElementById('start');

            this.startBtn.addEventListener('click', function () {
                self.welcomeScreen.classList.remove('show');
                self.startGame();
            });

        }

        startGame() {
            this.CommonTimer.start();
            this.StepFrame.showStep(this.currentStep);
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