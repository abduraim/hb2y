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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6InNjcmlwdHMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwiRE9NQ29udGVudExvYWRlZFwiLCBmdW5jdGlvbihldmVudCkge1xuXG4gICAgY29uc3QgU3RlcHMgPSBbXG4gICAgICAgIHt9LFxuICAgICAgICB7XG4gICAgICAgICAgICBxdWVzdGlvbjogJ3Rlc3QxJyxcbiAgICAgICAgICAgIGFuc3dlcjogJzEyMycsXG4gICAgICAgICAgICBoaW50OiAnaGludCAxJyxcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgcXVlc3Rpb246ICd0ZXN0MicsXG4gICAgICAgICAgICBhbnN3ZXI6ICczNDUnLFxuICAgICAgICAgICAgaGludDogJ2hpbnQgMicsXG4gICAgICAgIH1cbiAgICBdO1xuXG4gICAgY2xhc3MgR2FtZSB7XG5cbiAgICAgICAgY29uc3RydWN0b3IoKSB7XG5cbiAgICAgICAgICAgIHRoaXMuYXBwID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2JvZHknKVswXTtcblxuICAgICAgICAgICAgdGhpcy5jdXJyZW50U3RlcCA9IDE7XG5cbiAgICAgICAgICAgIHRoaXMuU3RlcHNJbmZvID0gU3RlcHM7XG5cbiAgICAgICAgICAgIHRoaXMuQ29tbW9uVGltZXIgPSBuZXcgQ29tbW9uVGltZXIoKTtcblxuICAgICAgICAgICAgdGhpcy5TdGVwRnJhbWUgPSBuZXcgU3RlcEZyYW1lKCk7XG5cbiAgICAgICAgICAgIHRoaXMuaW5pdCgpO1xuXG4gICAgICAgICAgICB0aGlzLnN0YXJ0SW5pdCgpO1xuXG4gICAgICAgIH1cblxuICAgICAgICBpbml0KCkge1xuXG4gICAgICAgICAgICBsZXQgc2VsZiA9IHRoaXM7XG5cbiAgICAgICAgICAgIHRoaXMuYXBwLmFkZEV2ZW50TGlzdGVuZXIoJ3N1Y2Nlc3MnLCBmdW5jdGlvbiAoKSB7XG5cbiAgICAgICAgICAgICAgICBzZWxmLmN1cnJlbnRTdGVwICsrO1xuICAgICAgICAgICAgICAgIHNlbGYuU3RlcEZyYW1lLnNob3dTdGVwKHNlbGYuY3VycmVudFN0ZXApO1xuXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ3N1Y2Nlc3MgZXZlbnQnKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgIH1cblxuICAgICAgICBzdGFydEluaXQoKSB7XG5cbiAgICAgICAgICAgIGxldCBzZWxmID0gdGhpcztcblxuICAgICAgICAgICAgdGhpcy53ZWxjb21lU2NyZWVuID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3dlbGNvbWUtc2NyZWVuJyk7XG5cbiAgICAgICAgICAgIHRoaXMuc3RhcnRCdG4gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc3RhcnQnKTtcblxuICAgICAgICAgICAgdGhpcy5zdGFydEJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBzZWxmLndlbGNvbWVTY3JlZW4uY2xhc3NMaXN0LnJlbW92ZSgnc2hvdycpO1xuICAgICAgICAgICAgICAgIHNlbGYuc3RhcnRHYW1lKCk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICB9XG5cbiAgICAgICAgc3RhcnRHYW1lKCkge1xuICAgICAgICAgICAgdGhpcy5Db21tb25UaW1lci5zdGFydCgpO1xuICAgICAgICAgICAgdGhpcy5TdGVwRnJhbWUuc2hvd1N0ZXAodGhpcy5jdXJyZW50U3RlcCk7XG4gICAgICAgIH1cblxuXG5cbiAgICB9XG5cbiAgICBjbGFzcyBDb21tb25UaW1lciB7XG5cbiAgICAgICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRTZWNvbmRzID0gMDtcbiAgICAgICAgfVxuXG4gICAgICAgIHN0YXJ0KCkge1xuICAgICAgICAgICAgbGV0IHNlbGYgPSB0aGlzO1xuICAgICAgICAgICAgdGhpcy50aW1lciA9IHNldEludGVydmFsKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBzZWxmLmN1cnJlbnRTZWNvbmRzICsrO1xuICAgICAgICAgICAgfSwgMTAwMCk7XG4gICAgICAgIH1cblxuICAgICAgICBzdG9wKCkge1xuICAgICAgICAgICAgY2xlYXJJbnRlcnZhbCh0aGlzLnRpbWVyKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGdldENvbW1vblRpbWUoKSB7XG5cbiAgICAgICAgICAgIGxldCBtaW51dGVzID0gTWF0aC5mbG9vcih0aGlzLmN1cnJlbnRTZWNvbmRzIC8gNjApO1xuICAgICAgICAgICAgbGV0IHNlY29uZHMgPSB0aGlzLmN1cnJlbnRTZWNvbmRzICUgNjA7XG5cbiAgICAgICAgICAgIGlmIChtaW51dGVzIDwgMTApIHtcbiAgICAgICAgICAgICAgICBtaW51dGVzID0gJzAnICsgbWludXRlcztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHNlY29uZHMgPCAxMCkge1xuICAgICAgICAgICAgICAgIHNlY29uZHMgPSAnMCcgKyBzZWNvbmRzO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gbWludXRlcyArICc6JyArIHNlY29uZHM7O1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgY2xhc3MgU3RlcEZyYW1lIHtcblxuICAgICAgICBjb25zdHJ1Y3RvcigpIHtcblxuICAgICAgICAgICAgdGhpcy50ZXh0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3RleHQnKTtcbiAgICAgICAgICAgIHRoaXMuaW5wdXQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYW5zd2VyLWlucHV0Jyk7XG4gICAgICAgICAgICB0aGlzLmFuc3dlckJ0biA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdhbnN3ZXItYnRuJyk7XG4gICAgICAgICAgICB0aGlzLm1lc3NhZ2UgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbWVzc2FnZScpO1xuICAgICAgICAgICAgdGhpcy5zdWNjZXNFdmVudCA9IG5ldyBFdmVudCgnc3VjY2VzcycpO1xuXG4gICAgICAgIH1cblxuICAgICAgICBzaG93U3RlcChzdGVwTnVtYmVyKSB7XG5cbiAgICAgICAgICAgIHRoaXMuYXBwID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2JvZHknKVswXTtcbiAgICAgICAgICAgIHRoaXMucXVlc3Rpb24gPSBTdGVwc1tzdGVwTnVtYmVyXS5xdWVzdGlvbjtcbiAgICAgICAgICAgIHRoaXMuYW5zd2VyID0gU3RlcHNbc3RlcE51bWJlcl0uYW5zd2VyO1xuICAgICAgICAgICAgdGhpcy5oaW50ID0gU3RlcHNbc3RlcE51bWJlcl0uaGludDtcblxuICAgICAgICAgICAgdGhpcy50ZXh0LmlubmVyVGV4dCA9IHRoaXMucXVlc3Rpb247XG5cbiAgICAgICAgICAgIHRoaXMuaW5pdCgpO1xuICAgICAgICB9XG5cbiAgICAgICAgaW5pdCgpIHtcblxuICAgICAgICAgICAgbGV0IHNlbGYgPSB0aGlzO1xuXG4gICAgICAgICAgICB0aGlzLmlucHV0LnNldEF0dHJpYnV0ZSgnbWF4bGVuZ3RoJywgdGhpcy5hbnN3ZXIubGVuZ3RoKTtcblxuICAgICAgICAgICAgdGhpcy5pbnB1dC5hZGRFdmVudExpc3RlbmVyKCdpbnB1dCcsIGZ1bmN0aW9uICgpIHtcblxuICAgICAgICAgICAgICAgIGlmICh0aGlzLnZhbHVlID09IHNlbGYuYW5zd2VyKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgc2VsZi5hbnN3ZXJCdG4uY2xhc3NMaXN0LmFkZCgnc2hvdycpO1xuXG4gICAgICAgICAgICAgICAgICAgIHNlbGYuYW5zd2VyQnRuLmZvY3VzKCk7XG5cbiAgICAgICAgICAgICAgICAgICAgc2VsZi5tZXNzYWdlLmNsYXNzTGlzdC5hZGQoJ3Nob3cnKTtcblxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygncmlnaHQhJyk7XG5cbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCd3cm9uZy4uLicpO1xuXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHRoaXMuYW5zd2VyQnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24gKGV2ZW50KSB7XG5cbiAgICAgICAgICAgICAgICBpZiAoc2VsZi5pbnB1dC52YWx1ZSA9PSBzZWxmLmFuc3dlcikge1xuICAgICAgICAgICAgICAgICAgICBzZWxmLmFwcC5kaXNwYXRjaEV2ZW50KHNlbGYuc3VjY2VzRXZlbnQpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgfVxuXG4gICAgfVxuXG5cbiAgICBjbGFzcyBUaW1lciB7XG5cbiAgICAgICAgY29uc3RydWN0b3IoY29udGFpbmVyKSB7XG5cbiAgICAgICAgICAgIHRoaXMuY29udGFpbmVyID0gY29udGFpbmVyO1xuICAgICAgICAgICAgdGhpcy5hdmFpbGFibGVTZWNvbmRzID0gNTtcbiAgICAgICAgICAgIHRoaXMuY3VycmVudFNlY29uZHMgPSAwO1xuXG4gICAgICAgICAgICB0aGlzLnNlY29uZHNUb0RhbmdlciA9IDEwO1xuXG4gICAgICAgICAgICB0aGlzLnRpbWVySW5pdCgpO1xuXG4gICAgICAgIH1cblxuICAgICAgICB0aW1lckluaXQoKSB7XG5cbiAgICAgICAgICAgIGxldCBzZWxmID0gdGhpcztcblxuICAgICAgICAgICAgdGhpcy50aW1lciA9IHNldEludGVydmFsKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBzZWxmLmF2YWlsYWJsZVNlY29uZHMgLS07XG5cbiAgICAgICAgICAgICAgICBzZWxmLmNoZWNrRGFuZ2VyKCk7XG4gICAgICAgICAgICAgICAgc2VsZi5jaGVja1RpbWVJc092ZXIoKTtcbiAgICAgICAgICAgICAgICBzZWxmLnNob3dUaW1lclZhbHVlKCk7XG5cbiAgICAgICAgICAgIH0sIDEwMDApO1xuICAgICAgICB9XG5cbiAgICAgICAgc2hvd1RpbWVyVmFsdWUoKSB7XG5cbiAgICAgICAgICAgIGxldCBtaW51dGVzID0gTWF0aC5mbG9vcih0aGlzLmF2YWlsYWJsZVNlY29uZHMgLyA2MCk7XG4gICAgICAgICAgICBsZXQgc2Vjb25kcyA9IHRoaXMuYXZhaWxhYmxlU2Vjb25kcyAlIDYwO1xuXG4gICAgICAgICAgICBpZiAobWludXRlcyA8IDEwKSB7XG4gICAgICAgICAgICAgICAgbWludXRlcyA9ICcwJyArIG1pbnV0ZXM7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChzZWNvbmRzIDwgMTApIHtcbiAgICAgICAgICAgICAgICBzZWNvbmRzID0gJzAnICsgc2Vjb25kcztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5jb250YWluZXIuaW5uZXJUZXh0ID0gbWludXRlcyArICc6JyArIHNlY29uZHM7XG5cbiAgICAgICAgfVxuXG4gICAgICAgIGNoZWNrRGFuZ2VyKCkge1xuICAgICAgICAgICAgaWYgKHRoaXMuYXZhaWxhYmxlU2Vjb25kcyA8IHRoaXMuc2Vjb25kc1RvRGFuZ2VyKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5jb250YWluZXIuY2xhc3NMaXN0LmFkZCgnZGFuZ2VyJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBjaGVja1RpbWVJc092ZXIoKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5hdmFpbGFibGVTZWNvbmRzIDwgMSkge1xuICAgICAgICAgICAgICAgIGNsZWFySW50ZXJ2YWwodGhpcy50aW1lcik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgIH1cblxuICAgIGNsYXNzIEhpbnQge1xuXG4gICAgfVxuXG5cbiAgICBuZXcgR2FtZShTdGVwcyk7XG5cbiAgICAvLyBsZXQgZnJhbWVzID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnZnJhbWUnKTtcbiAgICAvL1xuICAgIC8vIG5ldyBUaW1lcihkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndGltZXInKSk7XG4gICAgLy9cbiAgICAvLyBmb3IgKGxldCBpID0gMDsgaSA8IGZyYW1lcy5sZW5ndGg7IGkrKykge1xuICAgIC8vXG4gICAgLy8gICAgIG5ldyBGcmFtZShmcmFtZXNbaV0pO1xuICAgIC8vXG4gICAgLy8gfVxuXG5cblxuXG5cbn0pOyJdfQ==
