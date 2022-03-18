"use strict";

const startButton = document.getElementById("start-button"); //「お年玉をもらう」ボタンを取得
const resultDivided = document.getElementById("result-area"); //ガチャ結果表示エリアを取得

//ガチャの中身を設定
const config = [100000, 10000, 5000, 500];

//ボタンをクリックした時の処理
startButton.onclick = () => {
    startButton.classList.add("hidden"); //ボタンを画面から消す

    const paragraph = document.createElement("p");
    const img = document.createElement("img");

    //抽選
    const randomNum = Math.floor(Math.random() * 100);
    if (0 < randomNum && randomNum <= 3) {
        paragraph.innerText = config[0].toLocaleString() + '円';
        paragraph.classList.add('ssr');
        img.src = './img/ssr.png';
    } else if (3 < randomNum && randomNum <= 20) {
        paragraph.innerText = config[1].toLocaleString() + '円';
        paragraph.classList.add('sr');
    } else if (20 < randomNum && randomNum <= 50) {
        paragraph.innerText = config[2].toLocaleString() + '円';
        paragraph.classList.add('r');
    } else {
        paragraph.innerText = config[3].toLocaleString() + '円';
        paragraph.classList.add('c');
    }

    if (img.src) {
        img.addEventListener("animationend", () => {
            resultDivided.innerText = "";
            const header = document.createElement("h3");
            header.innerText = "🎊ガチャ結果🎊";
            resultDivided.appendChild(header);
            resultDivided.appendChild(paragraph);
            setTimeout(() => {
                resultDivided.innerText = "";
                startButton.classList.remove("hidden");
            }, 3000);
        });

        resultDivided.appendChild(img);
    } else {
        const header = document.createElement("h3");
        header.innerText = "🎊ガチャ結果🎊";
        resultDivided.appendChild(header);
        resultDivided.appendChild(paragraph);
        setTimeout(() => {
            resultDivided.innerText = "";
            startButton.classList.remove("hidden");
        }, 2000);
    }
};
