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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6InNjcmlwdHMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwiRE9NQ29udGVudExvYWRlZFwiLCBmdW5jdGlvbihldmVudCkge1xuXG4gICAgY29uc3QgU3RlcHMgPSBbXG4gICAgICAgIHt9LFxuICAgICAgICB7XG4gICAgICAgICAgICBxdWVzdGlvbjogJ3Rlc3QxJyxcbiAgICAgICAgICAgIGFuc3dlcjogJzEyMycsXG4gICAgICAgICAgICBoaW50OiAnaGludCAxJyxcbiAgICAgICAgICAgIHN1Y2Nlc3NNZXNzYWdlOiAnQ29uZ3JhdHVsYXRpb25zITExMScsXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICAgIHF1ZXN0aW9uOiAndGVzdDInLFxuICAgICAgICAgICAgYW5zd2VyOiAnMzQ1JyxcbiAgICAgICAgICAgIGhpbnQ6ICdoaW50IDInLFxuICAgICAgICAgICAgc3VjY2Vzc01lc3NhZ2U6ICdDb25ncmF0dWxhdGlvbnMhMjIyJyxcbiAgICAgICAgfVxuICAgIF07XG5cbiAgICBjbGFzcyBHYW1lIHtcblxuICAgICAgICBjb25zdHJ1Y3RvcigpIHtcblxuICAgICAgICAgICAgdGhpcy5hcHAgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYXBwJyk7XG5cbiAgICAgICAgICAgIHRoaXMuY3VycmVudFN0ZXAgPSAxO1xuXG4gICAgICAgICAgICB0aGlzLkZ1bGxzY3JlZW5Db250cm9sID0gbmV3IEZ1bGxzY3JlZW5Db250cm9sKCk7XG5cbiAgICAgICAgICAgIHRoaXMuU3RlcHMgPSBTdGVwcztcblxuICAgICAgICAgICAgdGhpcy5Db21tb25UaW1lciA9IG5ldyBDb21tb25UaW1lcigpO1xuXG4gICAgICAgICAgICB0aGlzLlN0ZXBGcmFtZSA9IG5ldyBTdGVwRnJhbWUoKTtcblxuICAgICAgICAgICAgdGhpcy5NZXNzYWdlQm94ID0gbmV3IE1lc3NhZ2VCb3goKTtcblxuICAgICAgICAgICAgdGhpcy5QbGF5ZXIgPSBuZXcgUGxheWVyKCk7XG5cbiAgICAgICAgICAgIHRoaXMuaW5pdCgpO1xuXG4gICAgICAgICAgICB0aGlzLnN0YXJ0SW5pdCgpO1xuXG4gICAgICAgIH1cblxuICAgICAgICBpbml0KCkge1xuXG4gICAgICAgICAgICBsZXQgc2VsZiA9IHRoaXM7XG5cbiAgICAgICAgICAgIHRoaXMuYXBwLmFkZEV2ZW50TGlzdGVuZXIoJ3N1Y2Nlc3MnLCBmdW5jdGlvbiAoKSB7XG5cbiAgICAgICAgICAgICAgICBzZWxmLnNob3dTdWNjZXNzTWVzc2FnZSgpO1xuXG4gICAgICAgICAgICAgICAgc2VsZi5jdXJyZW50U3RlcCArKztcbiAgICAgICAgICAgICAgICBzZWxmLlN0ZXBGcmFtZS5zaG93U3RlcChzZWxmLmN1cnJlbnRTdGVwKTtcblxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdzdWNjZXNzIGV2ZW50Jyk7XG5cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgIH1cblxuICAgICAgICBzdGFydEluaXQoKSB7XG5cbiAgICAgICAgICAgIGxldCBzZWxmID0gdGhpcztcblxuICAgICAgICAgICAgdGhpcy53ZWxjb21lU2NyZWVuID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3dlbGNvbWUtc2NyZWVuJyk7XG5cbiAgICAgICAgICAgIHRoaXMuZ2lmdEltZyA9IHRoaXMud2VsY29tZVNjcmVlbi5xdWVyeVNlbGVjdG9yKCdpbWcnKTtcblxuICAgICAgICAgICAgdGhpcy5naWZ0SW1nLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHNlbGYud2VsY29tZVNjcmVlbi5jbGFzc0xpc3QucmVtb3ZlKCdzaG93Jyk7XG4gICAgICAgICAgICAgICAgc2VsZi5QbGF5ZXIucGxheSgpO1xuICAgICAgICAgICAgICAgIHNlbGYuc3RhcnRHYW1lKCk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgc2VsZi5naWZ0SW1nLmNsYXNzTGlzdC5hZGQoJ2FuaW1hdGVkJyk7XG4gICAgICAgICAgICB9LCAyMDAwKTtcblxuICAgICAgICB9XG5cbiAgICAgICAgc3RhcnRHYW1lKCkge1xuICAgICAgICAgICAgdGhpcy5Db21tb25UaW1lci5zdGFydCgpO1xuICAgICAgICAgICAgdGhpcy5TdGVwRnJhbWUuc2hvd1N0ZXAodGhpcy5jdXJyZW50U3RlcCk7XG4gICAgICAgIH1cblxuICAgICAgICBzaG93U3VjY2Vzc01lc3NhZ2UoKSB7XG5cbiAgICAgICAgfVxuXG5cblxuICAgIH1cblxuICAgIGNsYXNzIENvbW1vblRpbWVyIHtcblxuICAgICAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgICAgIHRoaXMuY3VycmVudFNlY29uZHMgPSAwO1xuICAgICAgICB9XG5cbiAgICAgICAgc3RhcnQoKSB7XG4gICAgICAgICAgICBsZXQgc2VsZiA9IHRoaXM7XG4gICAgICAgICAgICB0aGlzLnRpbWVyID0gc2V0SW50ZXJ2YWwoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHNlbGYuY3VycmVudFNlY29uZHMgKys7XG4gICAgICAgICAgICB9LCAxMDAwKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHN0b3AoKSB7XG4gICAgICAgICAgICBjbGVhckludGVydmFsKHRoaXMudGltZXIpO1xuICAgICAgICB9XG5cbiAgICAgICAgZ2V0Q29tbW9uVGltZSgpIHtcblxuICAgICAgICAgICAgbGV0IG1pbnV0ZXMgPSBNYXRoLmZsb29yKHRoaXMuY3VycmVudFNlY29uZHMgLyA2MCk7XG4gICAgICAgICAgICBsZXQgc2Vjb25kcyA9IHRoaXMuY3VycmVudFNlY29uZHMgJSA2MDtcblxuICAgICAgICAgICAgaWYgKG1pbnV0ZXMgPCAxMCkge1xuICAgICAgICAgICAgICAgIG1pbnV0ZXMgPSAnMCcgKyBtaW51dGVzO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoc2Vjb25kcyA8IDEwKSB7XG4gICAgICAgICAgICAgICAgc2Vjb25kcyA9ICcwJyArIHNlY29uZHM7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBtaW51dGVzICsgJzonICsgc2Vjb25kczs7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBjbGFzcyBNZXNzYWdlQm94IHtcblxuICAgICAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgICAgIHRoaXMuY29udGFpbmVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ21lc3NhZ2UnKTtcbiAgICAgICAgICAgIHRoaXMubWVzc2FnZSA9IHRoaXMuY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoJy5tZXNzYWdlJyk7XG4gICAgICAgICAgICB0aGlzLm9rQnRuID0gdGhpcy5jb250YWluZXIucXVlcnlTZWxlY3RvcignI21lc3NhZ2Utb2snKVxuICAgICAgICAgICAgdGhpcy5pbml0KCk7XG4gICAgICAgIH1cblxuICAgICAgICBpbml0KCkge1xuICAgICAgICAgICAgbGV0IHNlbGYgPSB0aGlzO1xuICAgICAgICAgICAgdGhpcy5va0J0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBzZWxmLmhpZGUoKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgc2V0TWVzc2FnZShtZXNzYWdlKSB7XG4gICAgICAgICAgICB0aGlzLm1lc3NhZ2UuaW5uZXJIVE1MID0gbWVzc2FnZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHNob3coKSB7XG4gICAgICAgICAgICB0aGlzLmNvbnRhaW5lci5jbGFzc0xpc3QuYWRkKCdzaG93Jyk7XG4gICAgICAgIH1cblxuICAgICAgICBoaWRlKCkge1xuICAgICAgICAgICAgdGhpcy5jb250YWluZXIuY2xhc3NMaXN0LnJlbW92ZSgnc2hvdycpO1xuICAgICAgICB9XG5cbiAgICB9XG5cbiAgICBjbGFzcyBTdGVwRnJhbWUge1xuXG4gICAgICAgIGNvbnN0cnVjdG9yKCkge1xuXG4gICAgICAgICAgICB0aGlzLnRleHQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndGV4dCcpO1xuICAgICAgICAgICAgdGhpcy5pbnB1dCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdhbnN3ZXItaW5wdXQnKTtcbiAgICAgICAgICAgIHRoaXMuYW5zd2VyQnRuID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2Fuc3dlci1idG4nKTtcbiAgICAgICAgICAgIHRoaXMubWVzc2FnZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdtZXNzYWdlJyk7XG4gICAgICAgICAgICB0aGlzLnN1Y2Nlc0V2ZW50ID0gbmV3IEV2ZW50KCdzdWNjZXNzJyk7XG5cbiAgICAgICAgfVxuXG4gICAgICAgIHNob3dTdGVwKHN0ZXBOdW1iZXIpIHtcblxuICAgICAgICAgICAgdGhpcy5hcHAgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnYm9keScpWzBdO1xuICAgICAgICAgICAgdGhpcy5xdWVzdGlvbiA9IFN0ZXBzW3N0ZXBOdW1iZXJdLnF1ZXN0aW9uO1xuICAgICAgICAgICAgdGhpcy5hbnN3ZXIgPSBTdGVwc1tzdGVwTnVtYmVyXS5hbnN3ZXI7XG4gICAgICAgICAgICB0aGlzLmhpbnQgPSBTdGVwc1tzdGVwTnVtYmVyXS5oaW50O1xuXG4gICAgICAgICAgICB0aGlzLnRleHQuaW5uZXJUZXh0ID0gdGhpcy5xdWVzdGlvbjtcblxuICAgICAgICAgICAgdGhpcy5pbml0KCk7XG4gICAgICAgIH1cblxuICAgICAgICBpbml0KCkge1xuXG4gICAgICAgICAgICBsZXQgc2VsZiA9IHRoaXM7XG5cbiAgICAgICAgICAgIHRoaXMuaW5wdXQuc2V0QXR0cmlidXRlKCdtYXhsZW5ndGgnLCB0aGlzLmFuc3dlci5sZW5ndGgpO1xuXG4gICAgICAgICAgICB0aGlzLmlucHV0LmFkZEV2ZW50TGlzdGVuZXIoJ2lucHV0JywgZnVuY3Rpb24gKCkge1xuXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMudmFsdWUgPT0gc2VsZi5hbnN3ZXIpIHtcblxuICAgICAgICAgICAgICAgICAgICBzZWxmLmFuc3dlckJ0bi5jbGFzc0xpc3QuYWRkKCdzaG93Jyk7XG5cbiAgICAgICAgICAgICAgICAgICAgc2VsZi5hbnN3ZXJCdG4uZm9jdXMoKTtcblxuICAgICAgICAgICAgICAgICAgICBzZWxmLm1lc3NhZ2UuY2xhc3NMaXN0LmFkZCgnc2hvdycpO1xuXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdyaWdodCEnKTtcblxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG5cbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ3dyb25nLi4uJyk7XG5cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgdGhpcy5hbnN3ZXJCdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbiAoZXZlbnQpIHtcblxuICAgICAgICAgICAgICAgIGlmIChzZWxmLmlucHV0LnZhbHVlID09IHNlbGYuYW5zd2VyKSB7XG4gICAgICAgICAgICAgICAgICAgIHNlbGYuYXBwLmRpc3BhdGNoRXZlbnQoc2VsZi5zdWNjZXNFdmVudCk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICB9XG5cbiAgICB9XG5cbiAgICBjbGFzcyBQbGF5ZXIge1xuXG4gICAgICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICAgICAgdGhpcy5wbGF5QnRuID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3BsYXknKTtcbiAgICAgICAgICAgIHRoaXMuc3RvcEJ0biA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzdG9wJyk7XG4gICAgICAgICAgICB0aGlzLm11c2ljRGFzaGEgPSBuZXcgQXVkaW8oJ2Rhc2hhLm1wMycpO1xuICAgICAgICAgICAgdGhpcy5tdXNpY0Rhc2hhLmN1cnJlbnRUaW1lID0gMTtcbiAgICAgICAgICAgIHRoaXMuaW5pdCgpO1xuICAgICAgICB9XG5cbiAgICAgICAgaW5pdCgpIHtcbiAgICAgICAgICAgIGxldCBzZWxmID0gdGhpcztcbiAgICAgICAgICAgIHRoaXMucGxheUJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBzZWxmLnBsYXkoKTtcbiAgICAgICAgICAgICAgICBzZWxmLnNob3dTdG9wQnRuKCk7XG4gICAgICAgICAgICAgICAgc2VsZi5oaWRlUGxheUJ0bigpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB0aGlzLnN0b3BCdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgc2VsZi5zdG9wKClcbiAgICAgICAgICAgICAgICBzZWxmLnNob3dQbGF5QnRuKCk7XG4gICAgICAgICAgICAgICAgc2VsZi5oaWRlU3RvcEJ0bigpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICBwbGF5KCkge1xuICAgICAgICAgICAgdGhpcy5tdXNpY0Rhc2hhLnBsYXkoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHBhdXNlKCkge1xuICAgICAgICAgICAgdGhpcy5tdXNpY0Rhc2hhLnBhdXNlKCk7XG4gICAgICAgIH1cblxuICAgICAgICBzdG9wKCkge1xuICAgICAgICAgICAgdGhpcy5tdXNpY0Rhc2hhLnBhdXNlKCk7XG4gICAgICAgICAgICB0aGlzLm11c2ljRGFzaGEuY3VycmVudFRpbWUgPSAxO1xuICAgICAgICB9XG5cbiAgICAgICAgc2hvd1BsYXlCdG4oKSB7XG4gICAgICAgICAgICB0aGlzLnBsYXlCdG4uY2xhc3NMaXN0LmFkZCgnc2hvdycpO1xuICAgICAgICB9XG5cbiAgICAgICAgaGlkZVBsYXlCdG4oKSB7XG4gICAgICAgICAgICB0aGlzLnBsYXlCdG4uY2xhc3NMaXN0LnJlbW92ZSgnc2hvdycpO1xuICAgICAgICB9XG5cbiAgICAgICAgc2hvd1N0b3BCdG4oKSB7XG4gICAgICAgICAgICB0aGlzLnN0b3BCdG4uY2xhc3NMaXN0LmFkZCgnc2hvdycpO1xuICAgICAgICB9XG5cbiAgICAgICAgaGlkZVN0b3BCdG4oKSB7XG4gICAgICAgICAgICB0aGlzLnN0b3BCdG4uY2xhc3NMaXN0LnJlbW92ZSgnc2hvdycpO1xuICAgICAgICB9XG5cbiAgICAgICAgaXNQbGF5aW5nKCkge1xuICAgICAgICAgICAgcmV0dXJuICF0aGlzLm11c2ljRGFzaGEucGF1c2VkO1xuICAgICAgICB9XG5cbiAgICB9XG5cbiAgICBjbGFzcyBGdWxsc2NyZWVuQ29udHJvbCB7XG5cbiAgICAgICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgICAgICB0aGlzLmNvbnRhaW5lciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdmdWxsc2NyZWVuJyk7XG4gICAgICAgICAgICB0aGlzLmJ0biA9IHRoaXMuY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoJ2J1dHRvbicpO1xuICAgICAgICAgICAgbGV0IHNlbGYgPSB0aGlzO1xuICAgICAgICAgICAgdGhpcy5idG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgc2VsZi5sYXVuY2hGdWxsU2NyZWVuKGRvY3VtZW50LmRvY3VtZW50RWxlbWVudCk7XG4gICAgICAgICAgICAgICAgc2VsZi5idG4uY2xhc3NMaXN0LmFkZCgnc29mdF9oaWRlJyk7XG4gICAgICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIHNlbGYuY29udGFpbmVyLmNsYXNzTGlzdC5yZW1vdmUoJ3Nob3cnKTtcbiAgICAgICAgICAgICAgICB9LCAxMDAwKTtcbiAgICAgICAgICAgIH0pXG4gICAgICAgIH1cblxuICAgICAgICBsYXVuY2hGdWxsU2NyZWVuKGVsZW1lbnQpIHtcbiAgICAgICAgICAgIGlmKGVsZW1lbnQucmVxdWVzdEZ1bGxTY3JlZW4pIHtcbiAgICAgICAgICAgICAgICBlbGVtZW50LnJlcXVlc3RGdWxsU2NyZWVuKCk7XG4gICAgICAgICAgICB9IGVsc2UgaWYoZWxlbWVudC5tb3pSZXF1ZXN0RnVsbFNjcmVlbikge1xuICAgICAgICAgICAgICAgIGVsZW1lbnQubW96UmVxdWVzdEZ1bGxTY3JlZW4oKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZihlbGVtZW50LndlYmtpdFJlcXVlc3RGdWxsU2NyZWVuKSB7XG4gICAgICAgICAgICAgICAgZWxlbWVudC53ZWJraXRSZXF1ZXN0RnVsbFNjcmVlbigpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgY2FuY2VsRnVsbHNjcmVlbigpIHtcbiAgICAgICAgICAgIGlmKGRvY3VtZW50LmNhbmNlbEZ1bGxTY3JlZW4pIHtcbiAgICAgICAgICAgICAgICBkb2N1bWVudC5jYW5jZWxGdWxsU2NyZWVuKCk7XG4gICAgICAgICAgICB9IGVsc2UgaWYoZG9jdW1lbnQubW96Q2FuY2VsRnVsbFNjcmVlbikge1xuICAgICAgICAgICAgICAgIGRvY3VtZW50Lm1vekNhbmNlbEZ1bGxTY3JlZW4oKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZihkb2N1bWVudC53ZWJraXRDYW5jZWxGdWxsU2NyZWVuKSB7XG4gICAgICAgICAgICAgICAgZG9jdW1lbnQud2Via2l0Q2FuY2VsRnVsbFNjcmVlbigpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cblxuICAgIH1cblxuXG4gICAgY2xhc3MgVGltZXIge1xuXG4gICAgICAgIGNvbnN0cnVjdG9yKGNvbnRhaW5lcikge1xuXG4gICAgICAgICAgICB0aGlzLmNvbnRhaW5lciA9IGNvbnRhaW5lcjtcbiAgICAgICAgICAgIHRoaXMuYXZhaWxhYmxlU2Vjb25kcyA9IDU7XG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRTZWNvbmRzID0gMDtcblxuICAgICAgICAgICAgdGhpcy5zZWNvbmRzVG9EYW5nZXIgPSAxMDtcblxuICAgICAgICAgICAgdGhpcy50aW1lckluaXQoKTtcblxuICAgICAgICB9XG5cbiAgICAgICAgdGltZXJJbml0KCkge1xuXG4gICAgICAgICAgICBsZXQgc2VsZiA9IHRoaXM7XG5cbiAgICAgICAgICAgIHRoaXMudGltZXIgPSBzZXRJbnRlcnZhbChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgc2VsZi5hdmFpbGFibGVTZWNvbmRzIC0tO1xuXG4gICAgICAgICAgICAgICAgc2VsZi5jaGVja0RhbmdlcigpO1xuICAgICAgICAgICAgICAgIHNlbGYuY2hlY2tUaW1lSXNPdmVyKCk7XG4gICAgICAgICAgICAgICAgc2VsZi5zaG93VGltZXJWYWx1ZSgpO1xuXG4gICAgICAgICAgICB9LCAxMDAwKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHNob3dUaW1lclZhbHVlKCkge1xuXG4gICAgICAgICAgICBsZXQgbWludXRlcyA9IE1hdGguZmxvb3IodGhpcy5hdmFpbGFibGVTZWNvbmRzIC8gNjApO1xuICAgICAgICAgICAgbGV0IHNlY29uZHMgPSB0aGlzLmF2YWlsYWJsZVNlY29uZHMgJSA2MDtcblxuICAgICAgICAgICAgaWYgKG1pbnV0ZXMgPCAxMCkge1xuICAgICAgICAgICAgICAgIG1pbnV0ZXMgPSAnMCcgKyBtaW51dGVzO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoc2Vjb25kcyA8IDEwKSB7XG4gICAgICAgICAgICAgICAgc2Vjb25kcyA9ICcwJyArIHNlY29uZHM7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMuY29udGFpbmVyLmlubmVyVGV4dCA9IG1pbnV0ZXMgKyAnOicgKyBzZWNvbmRzO1xuXG4gICAgICAgIH1cblxuICAgICAgICBjaGVja0RhbmdlcigpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLmF2YWlsYWJsZVNlY29uZHMgPCB0aGlzLnNlY29uZHNUb0Rhbmdlcikge1xuICAgICAgICAgICAgICAgIHRoaXMuY29udGFpbmVyLmNsYXNzTGlzdC5hZGQoJ2RhbmdlcicpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgY2hlY2tUaW1lSXNPdmVyKCkge1xuICAgICAgICAgICAgaWYgKHRoaXMuYXZhaWxhYmxlU2Vjb25kcyA8IDEpIHtcbiAgICAgICAgICAgICAgICBjbGVhckludGVydmFsKHRoaXMudGltZXIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICB9XG5cbiAgICBjbGFzcyBIaW50IHtcblxuICAgIH1cblxuXG4gICAgbmV3IEdhbWUoU3RlcHMpO1xuXG5cblxuXG5cbiAgICB2YXIgYXVkaW8gPSBuZXcgQXVkaW8oJ2Rhc2hhLm1wMycpO1xuICAgIC8vYXVkaW8ucGxheSgpO1xuXG5cbiAgICB2YXIgZWxlbSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYXBwXCIpO1xuXG4gICAgLyogV2hlbiB0aGUgb3BlbkZ1bGxzY3JlZW4oKSBmdW5jdGlvbiBpcyBleGVjdXRlZCwgb3BlbiB0aGUgdmlkZW8gaW4gZnVsbHNjcmVlbi5cbiAgICBOb3RlIHRoYXQgd2UgbXVzdCBpbmNsdWRlIHByZWZpeGVzIGZvciBkaWZmZXJlbnQgYnJvd3NlcnMsIGFzIHRoZXkgZG9uJ3Qgc3VwcG9ydCB0aGUgcmVxdWVzdEZ1bGxzY3JlZW4gbWV0aG9kIHlldCAqL1xuICAgIC8vIGZ1bmN0aW9uIG9wZW5GdWxsc2NyZWVuKCkge1xuICAgIC8vICAgICBpZiAoZWxlbS5yZXF1ZXN0RnVsbHNjcmVlbikge1xuICAgIC8vICAgICAgICAgZWxlbS5yZXF1ZXN0RnVsbHNjcmVlbigpO1xuICAgIC8vICAgICB9IGVsc2UgaWYgKGVsZW0ubW96UmVxdWVzdEZ1bGxTY3JlZW4pIHsgLyogRmlyZWZveCAqL1xuICAgIC8vICAgICAgICAgZWxlbS5tb3pSZXF1ZXN0RnVsbFNjcmVlbigpO1xuICAgIC8vICAgICB9IGVsc2UgaWYgKGVsZW0ud2Via2l0UmVxdWVzdEZ1bGxzY3JlZW4pIHsgLyogQ2hyb21lLCBTYWZhcmkgYW5kIE9wZXJhICovXG4gICAgLy8gICAgICAgICBlbGVtLndlYmtpdFJlcXVlc3RGdWxsc2NyZWVuKCk7XG4gICAgLy8gICAgIH0gZWxzZSBpZiAoZWxlbS5tc1JlcXVlc3RGdWxsc2NyZWVuKSB7IC8qIElFL0VkZ2UgKi9cbiAgICAvLyAgICAgICAgIGVsZW0ubXNSZXF1ZXN0RnVsbHNjcmVlbigpO1xuICAgIC8vICAgICB9XG4gICAgLy8gfVxuICAgIC8vXG4gICAgLy8gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2Z1bGxzY3JlZW4nKS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uICgpIHtcbiAgICAvLyAgICAgY29uc29sZS5sb2coJ2NsaWNrJyk7XG4gICAgLy8gICAgIG9wZW5GdWxsc2NyZWVuKCk7XG4gICAgLy8gfSk7XG5cblxuICAgIC8vIGxldCBmcmFtZXMgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdmcmFtZScpO1xuICAgIC8vXG4gICAgLy8gbmV3IFRpbWVyKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd0aW1lcicpKTtcbiAgICAvL1xuICAgIC8vIGZvciAobGV0IGkgPSAwOyBpIDwgZnJhbWVzLmxlbmd0aDsgaSsrKSB7XG4gICAgLy9cbiAgICAvLyAgICAgbmV3IEZyYW1lKGZyYW1lc1tpXSk7XG4gICAgLy9cbiAgICAvLyB9XG5cblxuXG5cblxufSk7Il19
