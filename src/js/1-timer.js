import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

document.addEventListener('DOMContentLoaded', () => {
  const startButton = document.querySelector('button[data-start]');
  const dateTimePicker = document.getElementById('datetime-picker');
  const daysSpan = document.querySelector('[data-days]');
  const hoursSpan = document.querySelector('[data-hours]');
  const minutesSpan = document.querySelector('[data-minutes]');
  const secondsSpan = document.querySelector('[data-seconds]');

  let userSelectedDate;
  let countdownInterval;

  const options = {
    enableTime: true,
    time_24hr: true,
    defaultDate: new Date(),
    minuteIncrement: 1,
    onClose(selectedDates) {
      userSelectedDate = selectedDates[0];
      if (userSelectedDate < new Date()) {
        iziToast.error({
          title: 'Error',
          message: 'Please choose a date in the future',
        });
        startButton.disabled = true;
      } else {
        startButton.disabled = false;
        startButton.onclick = () => startCountdown(userSelectedDate);
      }
    },
  };

  flatpickr(dateTimePicker, options);

  function startCountdown(endTime) {
    clearInterval(countdownInterval);
    countdownInterval = setInterval(() => {
      const now = new Date().getTime();
      const distance = endTime - now;

      if (distance < 0) {
        clearInterval(countdownInterval);
        iziToast.info({
          title: 'Finished',
          message: 'The countdown has ended',
        });
        updateTimerDisplay(0, 0, 0, 0);
        dateTimePicker.disabled = false;
        startButton.disabled = true;
        return;
      }

      const { days, hours, minutes, seconds } = convertMs(distance);
      updateTimerDisplay(days, hours, minutes, seconds);

      dateTimePicker.disabled = true;
      startButton.disabled = true;
    }, 1000);
  }

  function updateTimerDisplay(days, hours, minutes, seconds) {
    daysSpan.textContent = addLeadingZero(days);
    hoursSpan.textContent = addLeadingZero(hours);
    minutesSpan.textContent = addLeadingZero(minutes);
    secondsSpan.textContent = addLeadingZero(seconds);
  }

  function convertMs(ms) {
    const second = 1000;
    const minute = second * 60;
    const hour = minute * 60;
    const day = hour * 24;

    const days = Math.floor(ms / day);
    const hours = Math.floor((ms % day) / hour);
    const minutes = Math.floor(((ms % day) % hour) / minute);
    const seconds = Math.floor((((ms % day) % hour) % minute) / second);

    return { days, hours, minutes, seconds };
  }

  function addLeadingZero(value) {
    return String(value).padStart(2, '0');
  }
});
