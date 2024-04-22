export const configureClock = () => {
    let clock = document.createElement('p');
    clock.classList.add('clock');
    document.querySelector('header').appendChild(clock);

    setInterval(() => {
        updateClock(clock);
    },0,1000);
}

const updateClock = (clockElement) => {
    clockElement.textContent = new Date().toLocaleTimeString().slice(0,8);
}