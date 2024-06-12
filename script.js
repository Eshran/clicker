document.addEventListener("DOMContentLoaded", function() {
    const clickButton = document.getElementById("clicker-button");
    const clickCountDisplay = document.getElementById("click-count");
    const shopButton = document.getElementById("shop-button");
    const shopContainer = document.getElementById("shop-container");
    const shopOverlay = document.getElementById("shop-overlay");

    const tg = window.Telegram.WebApp

    let clickCount = 0;
    let clickValue = 1;

    clickButton.addEventListener("click", function() {
        const plusOne = document.createElement("div");

        plusOne.textContent = `+${clickValue}`;
        plusOne.classList.add("plus-one");
        document.body.appendChild(plusOne);

        const buttonRect = clickButton.getBoundingClientRect();
        plusOne.style.left = `${buttonRect.left + buttonRect.width / 2 - plusOne.offsetWidth / 2}px`;
        plusOne.style.top = `${buttonRect.top - 20}px`;

        setTimeout(() => {
            plusOne.remove();
        }, 1000);

        clickCount += clickValue;
        clickCountDisplay.textContent = clickCount;
    });

    shopButton.addEventListener("click", function() {
        shopContainer.style.display = (shopContainer.style.display === "none" || shopContainer.style.display === "") ? "block" : "none";
        shopOverlay.style.display = (shopOverlay.style.display === "none" || shopOverlay.style.display === "") ? "block" : "none";
    });

    shopOverlay.addEventListener("click", function() {
        shopContainer.style.display = "none";
        shopOverlay.style.display = "none";
    });

    document.querySelectorAll('.shop-item button').forEach(button => {
        button.addEventListener('click', function() {
            const shopItem = this.parentElement;
            const upgradeValue = parseInt(shopItem.getAttribute('data-upgrade'));
            const upgradeCost = parseInt(shopItem.getAttribute('data-cost'));

            if (clickCount >= upgradeCost) {
                clickCount -= upgradeCost;
                clickValue += upgradeValue;
                clickCountDisplay.textContent = clickCount;
                shopItem.querySelector('div').textContent += ' (Куплено!)';
                this.disabled = true;
            } else {
                alert('Недостаточно кликов для покупки этого улучшения.');
            }
        });
    });

    tg.onEvent('mainButtonClicked', function() {
        tg.sendData(JSON.stringify({ clickCount: clickCount }));
        tg.close();
    });

    tg.MainButton.setText("Сохранить результат");
    tg.MainButton.show();
});
