window.addEventListener('DOMContentLoaded', () => {

    backBtn = document.getElementById('back-button');

    backBtn.addEventListener('click', (event) => {

        event.preventDefault();
        history.back(event);
    });
});